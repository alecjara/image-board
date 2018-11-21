const spicedPg = require('spiced-pg');
//const db = spicedPg(`postgres:postgres:postgres@localhost:5432/petition`);
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);


exports.getImages = function() {
    return db.query('SELECT * FROM images');
};

exports.addImages = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    );
};

exports.addComments = function(comment, username) {
    return db.query(
        `INSERT INTO comments (comment, username)
        VALUES ($1, $2)
        RETURNING *`,
        [comment, username]
    );
};


exports.getImageId = function(id) {
    return db.query(
        `SELECT * FROM images WHERE id = $1`,
        [id]
    );
};
