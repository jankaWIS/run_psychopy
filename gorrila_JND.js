import gorilla

= require('gorilla/gorilla');


var FixationLength = 500; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var err = 0 // number of errors

// Height of the image, in pixels
var _requiredHeight: number = 220;

// Width of the image, in pixels
var _requiredWidth: number = 220;

var _change_size: number = 2;

var refSize = 220;
var initial = 0.3;
var testSize = refSize + initial * refSize;
var stimScreen = 500; // fo
var correct = 0;

gorilla.ready(() => {
    // attach the responsive resizing logic to the container
    // this allows the contents of the screen to resize, depending on the size of the browser window
    gorilla.responsiveFrame('#gorilla');

    // this allows us to use gorilla's timing features such as stopwatch and sequence
    gorilla.initialiseTimer();

    var currentTrial = 0;

    function DisplayInstructions() {

        gorilla.populate('#gorilla', 'instructions', {});
        gorilla.refreshLayout();

        $('.continue-button').one('click', (event: JQueryEventObject) => {
            DisplayTrial();
        });
    }

    // Randomly pick one image from the set of uploaded
    function imagePicker() {
        var stimuliImages = ['Asset 44.png', 'Asset 45.png', 'Asset 46.png', 'Asset 47.png', 'Asset 48.png', 'Asset 49.png']

        var image = '';

        var rand = Math.random();
        rand *= stimuliImages.length; // to get random number in range of length of stimuli
        rand = Math.floor(rand); // to get an index

        image = stimuliImages[rand]; // to get a random stimuli

        return image;
    }

    // Select one reference image
    var refImage = imagePicker();

    function SmallerBigger() {
        var order = 'SB'
        var sequence = null;

        // Show images
        sequence = gorilla.addTimerSequence()
            .delay(100)
            // show fixation cross
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').show();
                gorilla.refreshLayout();
            })
            .delay(FixationLength)
            // give some break after fixation cross
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(500)
            // show first image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {refImage: refImage});
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(stimScreen)
            // give some break after fixation cross
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(500)
            // show second image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {image: refImage});
                $('.gorilla-fixation-cross').hide();
                $('image').css('height', testSize + 'px').css('width', testSize + 'px');
                gorilla.refreshLayout();
            })
            .delay(stimScreen)
            //.then(() => {sequence.cancel();})
            //.run();

            // Not a good way of doing that but collect response here and now
            .then(() => {
                gorilla.populate('#gorilla', 'response', {number1: 'First', number2: 'Second'});
                //sequence.cancel();
                gorilla.refreshLayout();
                // this begins the gorilla stopwatch allowing us to record the reaction time of the user
                gorilla.startStopwatch();

                $('.number-zone').one('click', (event: JQueryEventObject) => {
                    // In DisplyStimuli, it wasn't very obvious that anything had been selected
                    // Let's add a new class to the selected number zone so that the user knows it has been clicked
                    // This class has been defined in our 'Style' file
                    $(event.currentTarget).addClass('selected');

                    // In DisplayStimuli, we immediately progressed upon selecting a stimuli
                    // Now, we can use gorilla.metric to upload some data about what the user has just done!

                    // gorilla.stopStopwatch(); this stops the stopwatch.  Note that the time on the stopwatch is still stored
                    // (like a real stopwatch) we can retrieve this using getStopwatch
                    gorilla.stopStopwatch();
                    var responseTime = gorilla.getStopwatch();

                    // In the template, we included the number in data-number on each number element
                    // We can access this now using data('number')
                    var selectedNumber = $(event.currentTarget).data('number');
                    if (selectedNumber == 'Second') {
                        var ThisCorrect = 1;
                        correct++;
                    } else {
                        var ThisCorrect = 0;
                    }

                    // gorilla.metric submits metrics to the database
                    // it takes as an arguement a dictonary (a set of key/vlaue pairs)
                    // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
                    // in order to upload metrics to the gorilla database, you will need to use this function!
                    gorilla.metric({
                        selectedNumber: selectedNumber,
                        CorrectIncorrect: ThisCorrect,
                        responseTime: responseTime,
                        order: order.toString(), //trialNumbers.toString(),
                    });

                    // In DisplayStimuli, we moved on to the next stimuli straight away if one was selected
                    // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
                    sequence = gorilla.addTimerSequence()
                        .delay(300)
                        .then(() => {
                            iterateAndProgress();
                        })
                        .run();

                });
                // finish collection
            })
            // run the sequence
            .run();

    }

    function DisplayTrial() {

        var sequence = null;
        var correct = 0;

        // // Populate our trial screen, https://gorilla.sc/admin/task/6380/editor?version=2
        // gorilla.populate('#gorilla', 'trial', {});
        // // hide the main bits of our display
        // $('.gorilla-fixation-cross').hide();
        // //$('.img').hide();
        // gorilla.refreshLayout();
        // // Display the fixation cross
        // $('#gorilla')
        //         .queue(function(){
        //             $('.gorilla-fixation-cross').show();
        //             gorilla.refreshLayout();
        //             $(this).dequeue();
        //         })
        //         .delay(FixationLength)
        //         .queue(function(){
        //             $('.gorilla-fixation-cross').hide();
        //             gorilla.refreshLayout();
        //             $(this).dequeue();
        //         })
        //         .delay(2500);


        // Randomise order
        var rand = Math.random();
        if (rand <= 0.5) {
            SmallerBigger();
            //BiggerSmaller();
        } else {
            SmallerBigger();
            //BiggerSmaller();
        }
        //SmallerBigger();


    }

    function iterateAndProgress() {
        currentTrial++;
        err++;
        if (err < 7) {
            DisplayTrial();
        } else {
            DisplayFinish();
        }
    }

    function DisplayFinish() {
        gorilla.finish();
    }


// This variable indicates the name of the image zone that we which to fix the size for
// See the instructions in 'User Requirements' for how to find and change this
    var _imageZoneName: string = 'imageZone';
    var ratio_str: string;
    var ratio: number;


    gorilla.run(function () {
        DisplayInstructions();
    });

});