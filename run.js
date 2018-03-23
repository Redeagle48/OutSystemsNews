const webshot = require("webshot");
const looksSame = require("looks-same");
const fs = require("fs");
const notifier = require("node-notifier");
const openurl = require("openurl");

const currDate = (function() {
    var currentdate = new Date();
    return currentdate.getDate() + "-" +
        (currentdate.getMonth() + 1) + "-" +
        currentdate.getFullYear() + "@" +
        currentdate.getHours() + "_" +
        currentdate.getMinutes() + "_" +
        currentdate.getSeconds();
})();

let screenshotPath = __dirname + "/screenshot_" + currDate + ".png",
    baseline = __dirname + "/baseline.png";

function renameToBaseline() {
    fs.renameSync(screenshotPath, baseline, function(err) {
        if (err) throw err;
        console.log("renamed complete");
    });
}

function deleteScreenShot(imageToDeletePath) {
    if (fs.existsSync(imageToDeletePath)) {
        fs.unlinkSync(imageToDeletePath, (err) => {
            if (err) throw err;
            console.log(imageToDeletePath + ' was deleted');
        });
    }
}

function createNewBaseline() {
    deleteScreenShot(baseline);
    renameToBaseline();
}

notifier.on('click', function(notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
    openurl.open("https://success.outsystems.com/Documentation/Whats_New");
    createNewBaseline();
});

notifier.on('timeout', function(notifierObject, options) {
    // Triggers if `wait: true` and notification closes
    console.log("Cancelled");
});

webshot("https://success.outsystems.com/Documentation/Whats_New", screenshotPath, function(err) {
    if (!fs.existsSync(baseline)) {
        createNewBaseline();
        notifier.notify({
            title: 'New baseline image was created',
            message: 'Next time we will be able to check if there\'s news!',
            //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
        });
    } else {
        looksSame(screenshotPath, baseline, function(error, equal) {
            if (!equal) {
                notifier.notify({
                    title: "OutSystems New Stuff!!",
                    message: "Go check it out!",
                    wait: true
                });
            } else {
                notifier.notify({
                    title: "No News from OutSystems :(",
                    message: "Maybe later"
                });
                deleteScreenShot(screenshotPath);
            }
        });
    }
});