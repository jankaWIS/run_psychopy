import gorilla

= require('gorilla/gorilla');


gorilla.ready(() => {
    // this allows us to use gorilla's timing features such as stopwatch and sequence
    gorilla.initialiseTimer();

    // We're going to hard code the number of trials we want to have
    var noOfTrials = 4;
    var currentTrial = 0;

    function DisplayInstructions() {

        gorilla.populate('#gorilla', 'instructions', {});
        gorilla.refreshLayout();

        $('.continue-button').one('click', (event: JQueryEventObject) => {
            DisplayTrial();
        });
    }

    // These files work like normal javascript files - you can put in and run any functions you want or need to run your task
    // In this task, we want to randomise whether we show a blue or orange circle
    // So we're going to use a simple random generation scheme to pick out an image from our two options
    function imagePicker() {
        var stimuliImages = ["blue.png", "orange.png"];

        var image = '';

        var rand = Math.random();
        if (rand <= 0.5) {
            image = stimuliImages[0];
        } else {
            image = stimuliImages[1];
        }

        return image;
    }


    function DisplayTrial() {

        // a timer sequence allows us to chain together a series of events
        // we could us this to show a stimuli for a period of time
        // and then remove the stimuli from the screen for a period of time
        // before advancing to the next screen

        var sequence = null;
        var trialImage = imagePicker();

        $('#gorilla').hide();
        // populateAndLoad offers a callback function that activates once all elements on the page are ready and loaded
        // this is useful if you have images or videos that you want to be sure have loaded before you begin the task
        // both populate and populateAndLoad take a third argument, a dictonary containing the data you want added to your page
        // the keys of the dictonary must match the keys used in your template
        gorilla.populateAndLoad('#gorilla', 'trial', {image: trialImage}, () => {
            $('#gorilla').show();
            gorilla.refreshLayout();

            // if one of the images is clicked on we want to cancel the automatic sequence and move on to the next trial
            $('.stimuli').one('click', (event: JQueryEventObject) => {
                sequence.cancel();

                // we use this set of commands in a couple of places so its useful to capture it as a seperate function
                iterateAndProgress();

            });

            sequence = gorilla.addTimerSequence()
                // .delay waits for a period of time in milliseconds, in this case 2000 ms or 2 seconds
                .delay(3000)
                // .then contains a function which is executed once the previous delay has been finished
                .then(() => {
                    iterateAndProgress();
                })
                // you can chain together as many .delay's and .then's as you want
                // the chain must always end with .run indicating that this is the end of the chain
                // and execution should now begin
                .run();
        });
    }

    function iterateAndProgress() {
        currentTrial++;
        if (currentTrial < noOfTrials) {
            DisplayTrial();
        } else {
            DisplayFinish();
        }
    }

    function DisplayFinish() {
        gorilla.finish();
    }

    gorilla.run(function () {
        DisplayInstructions();
    });

});