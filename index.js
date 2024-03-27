require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")
const CronJob = require("cron").CronJob;
const multer = require("multer");
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;

//accessing the image
const storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, "./uploads");
    },
    filename: function(req, file, cb){
      cb(null, file.originalname);
    },
  });
  

const tweet = async () => {
  try {
    await twitterClient.v2.tweet("Hello world!");
  } catch (e) {
    console.log(e)
  }
}

const tweetwithMedia = async() =>{
    try {
        // uploads the media to twitter client
        const mediaId = await twitterClient.v1.uploadMedia("./uploads/image.jpg");
        await twitterClient.v2.tweet({
          text: "Hello world!!!\nIt's me, your friendly neighborhood bot. Here's a picture.",
          media: {
            media_ids: [mediaId], //mediaID: assigned by twitter...
          },
        });
      } catch (e) {
        console.error("Error occurred while tweeting:", e);
      }
}

// doesn't work because of the free tier...
const search = async () =>{
    const tweetsSearched = await twitterBearer.v2.search("#100DaysOfCode");
    for await( const tweet of tweetsSearched){
      await twitterClient.v2.like(process.env.APP_ID, tweet.id);
    }
}


const cronTweet = new CronJob("30 * * * * *", async () => {
    tweet();
    tweetwithMedia();
  });
  
  cronTweet.start();

  
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})