var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose"); 
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoNewsScraper", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.story").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("h2.story-heading")
        .children("a")
        .text();
      result.link = $(this)
        .children("h2.story-heading")
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children("p.summary")
        .text();

      var flag;

      db.Article.findOne({title: result.title}).then(function (dbFinder) {
        if (dbFinder) {
          return;
        }
        else {
          db.Article
            .create(result)
            .then(function(dbArticle) {
              res.send("Scrape Complete");
            })
            .catch(function(err) {
              res.json(err);
            });
        }

      });

      // Create a new Article using the `result` object built from scraping
    });
    res.redirect("/");
  });
});

// Route for getting all Articles from the db
app.get("/", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}).populate("notes").then(function(data) {
      res.render("index", {articles: data});
    }).catch(function (err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findById(req.params.id)
  .populate("notes")
  .then (function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  });

});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
// Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
    return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote}}).then(function(dbRes) {
      res.redirect("/");
    });
  })

});

app.post("/articles/delete/:id", function (req, res) {
  db.Note.remove({_id: req.params.id}).then(function (dbRemove) {
    res.json(dbRemove);
  });
});

app.post("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}).then(function (dbRes) {
    res.redirect("/");
  })
})

app.post("/articles/unsave/:id", function (req, res) {
  db.Article.findOneAndUpdate({_id: req.params.id}, {saved: false}).then(function (dbRes) {
    res.redirect("/");
  })
})

app.get("/savedarticles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
    db.Article.find({saved: true}).populate("notes").then(function(data) {
      res.render("saved", {articles: data});
    }).catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
