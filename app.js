const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = {
  title: 'String',
  content: 'String',
};

const Article = mongoose.model('Article', articleSchema);

// const article = new Article({});
// article.save();

app
  .route('/articles')
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
        console.log(foundArticles);
      } else {
        console.log(err);
      }
    });
  })
  .post(function (req, res) {
    const postedArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    postedArticle.save(function (err) {
      if (!err) {
        res.send('Successfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send('Successfully deleted all articles.');
      } else {
        res.send(err);
      }
    });
  });

///////////////////// REQUEST TARGETING A SPECIFIC ARTICLE

app
  .route('/articles/:articleTitle')
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send('No article matching that criteria was found.');
        }
      }
    );
  })
  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send('Successfully updated the article.');
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send('Successfully patched the article.');
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send('Successfully deleted the corresponding article.');
      }
    });
  });

app.listen(3000, function () {
  console.log('Server is running on port 3000');
});
