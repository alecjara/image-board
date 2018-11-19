const spicedPg = require('spiced-pg');
//const db = spicedPg(`postgres:postgres:postgres@localhost:5432/petition`);

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);


exports.getImages = function() {
    return db.query('SELECT * FROM images');
};
