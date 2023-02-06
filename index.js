const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path')
const formidable = require('formidable');
const { Storage } = require('@google-cloud/storage');

const serviceKey = path.join(__dirname, './key.json');
const storage = new Storage({
    projectId: 'ai-lab-280706',
    keyFilename: serviceKey,
});
const bucket = storage.bucket('v2-capture-image')
   
const app = express();
app.use(cors());

   
app.post('/api/upload', (req, res, next) => {
    
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
  
        var oldPath = files.profilePic.filepath;
        var newPath = path.join(__dirname, 'uploads')
                + '/'+files.profilePic.name
        var rawData = fs.readFileSync(oldPath)
      
        fs.writeFile(newPath, rawData, function(err){
        console.log('raw data', rawData)
        const blob = bucket.file(`retail_product_image_${Math.round(new Date().getTime()/1000)}.jpg`)
        const blobStream = blob.createWriteStream({
            resumable: false
        })
        blobStream.on('finish', () => {
            res.send("Successfully uploaded")
        })
            .on('error', (err) => {
                res.send(`Unable to upload image, something went wrong ${err}`)
            })
            .end(rawData)
        })
  })
});

app.get('/', (req, res) => {
  res.send('Function to deploy images to bucket');
});
   
app.listen(3000, function(err){
    if(err) console.log(err)
    console.log('Server listening on Port 3000');
});
