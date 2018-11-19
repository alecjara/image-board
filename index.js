const express = require("express");
const app = express();

app.disable("x-powered-by");
const db = require("./db");
// const bodyParser = require("body-parser");
const ca = require("chalk-animation");

// app.use(
//     bodyParser.urlencoded({
//         extended: false
//     })
// );

app.use(express.static("./public"));

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

app.listen(8080, () => ca.rainbow("listening!"));
