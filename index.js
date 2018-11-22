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
        fileSize: 3097152
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

app.post("/images/:id", (req, res) => {
    //console.log("req.body:", req.body);
    db.addComments(req.body.comment, req.body.comusername, req.params.id
    ).then((resp) => {
        //console.log(req.boby.comment);
        res.json(resp);
        //console.log("resp:", resp);
    }).catch(error =>{
        console.log("error in post images:", error);
    });
});

//part4
app.get('/get-more-images/:id', (req, res) => {
    var lastId = req.params.id;

    db.getMoreImages(lastId).then(images => {
        //console.log("images in get more images:", images);
        //res.json sends them to vue to do his stuff
        res.json(images);
    });
});

app.listen(8080, () => ca.rainbow("listening!"));
