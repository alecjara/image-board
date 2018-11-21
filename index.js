const express = require("express");
const app = express();
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const s3 = require('./s3');
const s3Url = require('./config.json');
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//boilerplate for uploading
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//end of boilerplate (do not touch)

app.disable("x-powered-by");
const db = require("./db");
const ca = require("chalk-animation");

app.use(express.static("./public"));

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        var cUrl = s3Url.s3Url + req.file.filename;
        //console.log("cUrl:", cUrl);
        db.addImages(cUrl, req.body.username, req.body.title, req.body.description)
            .then(resp => {
                res.json(resp);
            });
    } else {
        res.json({
            success: false
        });
    }
});


app.get("/images", (req, res) => {
    //ca.rainbow("/get-images hit!");
    db.getImages(
    ).then((resp) => {
        res.json(resp);
        //console.log("resp:", resp);
    }).catch(error =>{
        console.log("error in get images:", error);
    });
});

app.get("/images/:id", (req, res) => {
    //ca.rainbow("/get-images hit!");
    db.getImageId(req.params.id
    ).then((resp) => {
        res.json(resp);
        //console.log("resp:", resp);
    }).catch(error =>{
        console.log("error in get images:", error);
    });
});

// app.post("/comments", (req, res) => {
//     //ca.rainbow("/get-images hit!");
//     db.addComments(
//     ).then((resp) => {
//         res.json(resp);
//         //console.log("resp:", resp);
//     }).catch(error =>{
//         console.log("error in get images:", error);
//     });
// });

app.listen(8080, () => ca.rainbow("listening!"));
