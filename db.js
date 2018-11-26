const spicedPg = require('spiced-pg');
//const db = spicedPg(`postgres:postgres:postgres@localhost:5432/petition`);
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);


exports.getImages = function() {
    return db.query('SELECT * FROM images ORDER BY id DESC LIMIT 3');
};

exports.addImages = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    );
};

exports.addComments = function(comment, username, imageId) {
    return db.query(
        `INSERT INTO comments (comment, username, imageId)
        VALUES ($1, $2, $3)
        RETURNING comment, username AS comusername, imageId`,
        [comment || null, username || null, imageId || null]
    );
};

//IF I WANT TO DO THE BONUS FOR NEXT AND PREVIOUS IMAGE:
exports.getImageId = function(id) {
    return db.query(
        `SELECT images.id AS imageId, url, images.username, title, description, images.created_at, comment,
        comments.username AS comusername,
        (SELECT id FROM images WHERE id > $1 LIMIT 1) AS next_id, (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1) AS prev_id
        FROM images
        LEFT JOIN comments
        ON images.id = comments.imageid
        WHERE images.id = $1`,
        [id]
    );
};
//I WILL HAVE TO ERASE THE NEXT QUERY IF I DO THIS ABOVE.

// exports.getImageId = function(id) {
//     return db.query(
//         // `SELECT * FROM images WHERE id = $1`,
//         `SELECT images.id AS imageId, url, images.username, title, description, images.created_at, comment,
//         comments.username AS comusername
//         FROM images
//         LEFT JOIN comments
//         ON images.id = comments.imageid
//         WHERE images.id = $1`,
//         [id]
//     );
// };

exports.getMoreImages = lastId => {
    return db
        .query(
            `SELECT *, (
                SELECT id AS lasteId  FROM images
                WHERE id = $1
                ORDER BY id DESC
            )
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
            [lastId]
        )
        .then(results => {
            return results.rows;
        });
};
