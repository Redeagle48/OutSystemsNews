const webshot = require("webshot");
const looksSame = require("looks-same");
const fs = require("fs");
const notifier = require("node-notifier");

let screenshotPath = __dirname + "/screenshot.png",
  baseline = __dirname + "/baseline.png";

  webshot("google.com", screenshotPath, function(err) {
  if (!fs.existsSync(baseline)) {
    fs.rename(screenshotPath, baseline, function(err) {
      if (err) throw err;
      console.log("renamed complete");
    });
  } else {
    // screenshot now saved to google.png
    looksSame(screenshotPath, baseline, function(error, equal) {
      if (!equal) {
        // Object
        notifier.notify({
          title: "OutSystems New Stuff!!",
          message: "Go check it out!"
        });

        //Delete actual baseline
        //Screenshot is the new baseline

      }
      else {
        // Object
        notifier.notify({
          title: "No News from OutSystems!!",
          message: "Maybe later"
        });
      
      } 
    });
  }
});