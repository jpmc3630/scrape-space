<div key={dat._id} className="card  bg-light news-card">
<div className="card-body">
  <div className="news-image cover" style={{ backgroundImage: `url(${dat.img})` }}></div>
  <div className="news-content">
      <p className="news-title">{dat.title}</p>
      <p className="news-body">{dat.body}</p>
      <p className="news-byline">{dat.byline} - 
        {moment(dat.date).fromNow()} - 
        <a href={dat.url} target="_blank" className="news-url">Full Article</a> - 
        
          <CommentsModal 
            key={this.comKey(dat._id)}
            artId={dat._id} 
            artTitle={dat.title} 
            comments={dat.commentsIds} 
            onClick={this.loadCommentsFromDB}
          />
        
      </p>
      
    </div>
  </div>
</div>








<li key={dat._id}> {dat.title}</li>