const express = require("express");
const path = require("path");

var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");
var helpers = require("./helpers"); 
var db = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(logger("dev"));
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

mongoose.connect("mongodb+srv://admin:admin@cluster0-nizeq.mongodb.net/test?retryWrites=true&w=majority" , { useNewUrlParser: true });

// Define API routes here

// get comments route
app.get('/comments/:artId', async (req, res) => {

  db.headlines.find({_id: req.params.artId })
  .populate("commentsIds")
  .then(function(popComments) {

    console.log(popComments);

    res.json({ data: popComments[0].commentsIds });
    
  }).catch(function(err) {
    res.json(err);
  });

});

// submit comment route
app.post("/submit", function(req, res) {
  // Create a new comment in the comments collection
  db.comments.create(req.body)
    .then(function(dbComment) {
      console.log(dbComment);
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.headlines.findOneAndUpdate({ _id: req.body.articleId }, { $push: { commentsIds: dbComment._id }, $inc: { commentsTally: 1 }  }, { new: true });
    })
    .then(function(dbHeadline) {
      // If the User was updated successfully, send it back to the client
      res.json(dbHeadline);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


// search news route
// app.get('/search/:criteria', async (req, res) => {
//   try {
    // search the news and return it ... req.params.criteria
    // let news = await db.headlines.fuzzySearch('moon').then(console.log).catch(console.error);
    // console.log(news);
    // res.json({ success: true, data: news });
    
//   } catch (error) {
//     console.error(error);
//   }



// });



function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
// req.query.search
app.get('/search/:criteria', async (req, res) => {
  if (req.params.criteria !== undefined) {
     const regex = new RegExp(escapeRegex(req.params.criteria), 'gi');
     db.headlines.find({ "body": regex }, function(err, news) {
         if(err) {
             console.log(err);
         } else {
          res.json({ success: true, data: news });
         }
     }); 
  } 
});

app.get('/sort/:order', async (req, res) => {
      // get all the news and sort it appropriately
    try {
      let news;
      if (req.params.order === "comments") {
          news = await db.headlines.find({}).sort({commentsTally: -1});
      } else if (req.params.order==="oldest") {
          news = await db.headlines.find({}).sort({date: 1});
      } else {
        news = await db.headlines.find({}).sort({date: -1});
      }
      res.json({ success: true, data: news });
      
    } catch (error) {
      console.log("We have an error: " + error);
    }
});


app.get('/scrape/:order', async (req, res) => {
  try {
    const response = await axios.get('https://www.space.com/news');

    const $ = cheerio.load(response.data);

    let resArr = [];
    let hashArr = [];

    $('article.search-result-news').each(function (i, elem) {
      let title = $(this).find('.article-name').text();
      let img = $(this).find('img').attr('data-original-mos');
      let byline = $(this).find('.byline').text().replace(/(\r\n|\n|\r)/gm,"").trim();
      byline = [byline.slice(0, 2), ' ', byline.slice(2)].join('');
      let body = $(this).find('.synopsis').text().replace(/(\r\n|\n|\r)/gm,""); 
      let url = $(this).parent().attr('href');
      let date = $(this).find('.published-date').attr('data-published-date');

      let obj = {
        title,
        byline,
        img,
        body,
        url,
        date
      }
      
      resArr.push(obj);
      hashArr.push(helpers.hashMD5(obj));
    });


    let hashesFound = await db.headlinesHash.find({
        hHash : hashArr
      });


    let newHashes = [];
    let newNews = [];
    
    //check if news hashes are new
    for ( let i = 0 ; i < hashArr.length ; i++ ) {
      let match = false;
      for ( let j = 0 ; j < hashesFound.length ; j++ ) {
        if (hashArr[i] == hashesFound[j].hHash) match = true;
      }
      if (match == false) {
        newHashes.push({ hHash : hashArr[i] });
        newNews.push(resArr[i]);
      }
    }

    if (newNews > 0) {
        console.log( newNews.length + ' new news articles scraped!' );
    } else {
      console.log('No new news to scrape!');
    };
 
    await db.headlinesHash.create(newHashes);
    await db.headlines.create(newNews);

    // get all the news and sort it appropriately
    let news;
    if (req.params.order === "comments") {
        news = await db.headlines.find({}).sort({commentsTally: -1});
    } else if (req.params.order==="oldest") {
        news = await db.headlines.find({}).sort({date: 1});
    } else {
      news = await db.headlines.find({}).sort({date: -1});
    }
    res.json({ success: true, data: news });
  } catch (error) {
    console.log("We have an error: " + error);
  }
});


// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});



app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
