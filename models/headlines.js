var mongoose = require("mongoose");
var mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var headlinesSchema = new Schema({
  title: String,
  byline: String,
  img: String,
  body: String,
  url: String,
  date: Date,
  commentsTally: Number,
  commentsIds: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Note model
      ref: "comments"
    }
  ]
});


headlinesSchema.plugin(mongoose_fuzzy_searching, {
	fields: [
		{
			name: 'title',
			weight: 3,
			minSize:2,
		}, {
			name: 'body',
			weight: 2,
			minSize:2,
		}, {
			name: 'byline',
			weight: 1,
			minSize:2,
			escapeSpecialCharacters: false
		}
	]
});


// This creates our model from the above schema, using mongoose's model method
var headlines = mongoose.model("headlines", headlinesSchema);

// Export the Note model
module.exports = headlines;