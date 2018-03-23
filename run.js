const webshot = require("webshot");
const looksSame = require("looks-same");
const fs = require("fs");
const notifier = require("node-notifier");

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

function createNewBaseline() {
    if (fs.existsSync(baseline)) {
        fs.unlinkSync(baseline, (err) => {
            if (err) throw err;
            console.log(baseline + ' was deleted');
        });
    }
    renameToBaseline();
}

webshot("google.com", screenshotPath, function(err) {
    if (!fs.existsSync(baseline)) {
        createNewBaseline();
        notifier.notify({
            title: "Baseline Created",
            message: "A new baseline was created"
        });
    } else {
        looksSame(screenshotPath, baseline, function(error, equal) {
            if (!equal) {
                createNewBaseline();
                notifier.notify({
                    title: "OutSystems New Stuff!!",
                    message: "Go check it out!"
                });
            } else {
                notifier.notify({
                    title: "No News from OutSystems :(",
                    message: "Maybe later"
                });
            }
        });
    }
});