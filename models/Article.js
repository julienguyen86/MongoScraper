// Require mongoose
var mongoose = require("mongoose");

// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  summary: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
