const knox = require('knox');
const fs = require('fs');
let secrets;

if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}

//console.log("secrets:", secrets);

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'alejaramilloimageboard'
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.sendStatus(500);
    }
    //put is kind of like a post request:
    //configuring req to amazon
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    //sends request to amazon
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    //receiving the response
    s3Request.on('response', s3Response => {
        console.log("status code of response:", s3Response.statusCode);
        const wasSuccessful = s3Response.statusCode == 200;

        if (wasSuccessful) {
            // res.json({ success: wasSuccessful });
            next();
        } else {
            res.sendStatus(500);
        }
    });

};
