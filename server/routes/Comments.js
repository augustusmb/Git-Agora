const db = require('./../../db/db.js');
const path = require('path');

var QueryFile = db.$config.pgp.QueryFile;

function sql(file) {
  const fullPath = path.join(__dirname, './../../db/queries/comments', file);
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  getComments: sql('getCommentsByTopicId.sql'),
  addComment: sql('insertComment.sql')
};

module.exports.getComments = (req, res) => {
  const { type, topic_id } = req.query;

  return db.query(queries.getComments, { type, topic_id })
  .then((data) => {
    console.log('Success getting comments');
    res.status(200).json(data);
  })
  .catch((error) => {
    console.log('FAILED GETTING COMMENTS');
    res.status(404).send(error);
  });
};


module.exports.addComment = (req, res) => {
  const { user_id, date_created, type, topic_id, content } = req.body;

  return db.query(queries.addComment, { user_id, type, date_created, topic_id, content })
  .then(() => {
    console.log('Success Adding comment');
    res.status(201).send();
  })
  .catch((error) => {
    res.status(404).send('failed to add comment');
  });
};
