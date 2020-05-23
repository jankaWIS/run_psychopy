import gorilla

= require('gorilla/gorilla');

// Parameters

var FixationLength = 500; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var isi = 500; // inter-stimuli interval (after 1st, after 2nd)

// initialize
var ratio = 2; // by how much to decrease the JND
var prev = 1;
var first_error = 0;
var currentTrial = 0;
var err = 0 // number of errors
var staircaseJND = 0 // in px
var correct = 0;


// // Get technical details

// Get the value from Calibration task
// var pixPerCm = gorilla.retrieve('PxPerCm', 0, true);
// // With this value, you know how many pixels on the participants monitor represent a real life centimetre.
// // So, you can use this to work out how many pixels wide and high your image needs to be for a certain size in centimetres.
// // For example, if you want it to be 5cm in width you would do 5 * pixPerCm to get the number of pixels width required.

// //var tech_details = setTechDetails(73.5)
// var refSize_cm = 7.4;

var refSize = 220; //tech_details.px_refSize_rect
// var refSize = pixPerCm * refSize_cm;
var initial_ratio = 0.3; // how far apart should they start, default 30 % of refSize
var initial = initial_ratio * refSize
var testSize = refSize + initial;
var diff = testSize - refSize // difference between stimuli sizes
var stimScreen = 500; // fo


gorilla.ready(() => {
    // attach the responsive resizing logic to the container
    // this allows the contents of the screen to resize, depending on the size of the browser window
    gorilla.responsiveFrame('#gorilla');

    // this allows us to use gorilla's timing features such as stopwatch and sequence
    gorilla.initialiseTimer();

    // set background to gray
    $('body').css('background-color', '#7F7F7F');

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
        var sequence_resp = null;
        var ThisCorrect = 5 // just to have some value in case the code does not work
        currentTrial++;

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
                gorilla.populate('#gorilla', 'trial', {image: refImage});
                $('.gorilla-fixation-cross').hide();
                $('.image').css('height', refSize + 'px').css('width', refSize + 'px');
                gorilla.refreshLayout();
            })
            .delay(stimScreen)
            // give some break after first image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(isi)
            // show second image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {image: refImage});
                $('.gorilla-fixation-cross').hide();
                $('.image').css('height', testSize + 'px').css('width', testSize + 'px');
                gorilla.refreshLayout();
            })
            .delay(stimScreen)
            // give some break after the second image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(isi)

            // Not a good way of doing that but collect response here and now
            .then(() => {
                gorilla.populate('#gorilla', 'response', {number1: 'First', number2: 'Second'});
                gorilla.refreshLayout();
                // this begins the gorilla stopwatch allowing us to record the reaction time of the user
                gorilla.startStopwatch();

                $('.number-zone').one('click', (event: JQueryEventObject) => {
                    // In DisplyStimuli, it wasn't very obvious that anything had been selected
                    // Let's add a new class to the selected number zone so that the user knows it has been clicked
                    // This class has been defined in our 'Style' file
                    $(event.currentTarget).addClass('selected');
                    sequence_resp.cancel(); // for response within 3 s

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
                        // Correct
                        ThisCorrect = 1;
                        correct++;

                    } else if (selectedNumber == 'First') {
                        // Incorrect
                        ThisCorrect = 0;
                        err++;
                    }
                    // gorilla.metric submits metrics to the database
                    // it takes as an arguement a dictonary (a set of key/vlaue pairs)
                    // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
                    // in order to upload metrics to the gorilla database, you will need to use this function!
                    gorilla.metric({
                        selectedNumber: selectedNumber, // choice
                        CorrectIncorrect: ThisCorrect,
                        responseTime: responseTime, //RT
                        order: order.toString(), //trialNumbers.toString(),
                        isi: isi,
                    });

                    // Since we go in blocks of SB and BS, here we test if had both (is div by 2), then continue, or not, then do the other
                    // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
                    sequence = gorilla.addTimerSequence()
                        .delay(300)
                        .then(() => {
                            if (currentTrial % 2 === 0) {
                                iterateAndProgress();
                            } else {
                                BiggerSmaller();
                            }
                        })
                        .run();

                }); // end number-zone

                // go further if they do not answer within 3 s
                sequence_resp = gorilla.addTimerSequence()
                    .delay(3000)
                    // .then contains a function which is executed once the previous delay has been finished
                    .then(() => {
                        //No response
                        gorilla.metric({
                            selectedNumber: 'None', // choice
                            CorrectIncorrect: -1,
                            responseTime: -1, //RT
                            order: order.toString(), //trialNumbers.toString(),
                            isi: isi,
                        });
                        err++; // count it as a mistake

                        if (currentTrial % 2 === 0) {
                            iterateAndProgress();
                        } else {
                            BiggerSmaller();
                        }
                    })
                    .run(); // go further

            }) // finish collection

            // run the sequence of SB
            .run();

    }

    function BiggerSmaller() {
        // the exact same as SmallerBigger just the order of images is flipped
        var order = 'BS'
        var sequence = null;
        var sequence_resp = null;
        var ThisCorrect = 5 // just to have some value in case the code does not work
        currentTrial++;

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
            // show first Bigger image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {image: refImage});
                $('.gorilla-fixation-cross').hide();
                $('.image').css('height', testSize + 'px').css('width', testSize + 'px');
                gorilla.refreshLayout();
            })
            .delay(stimScreen)
            // give some break after first image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(isi)
            // show second image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {image: refImage});
                $('.gorilla-fixation-cross').hide();
                $('.image').css('height', refSize + 'px').css('width', refSize + 'px');
                gorilla.refreshLayout();
            })
            .delay(stimScreen)
            // give some break after the second image
            .then(() => {
                gorilla.populate('#gorilla', 'trial', {});
                $('.image').hide();
                $('.gorilla-fixation-cross').hide();
                gorilla.refreshLayout();
            })
            .delay(isi)

            // Not a good way of doing that but collect response here and now
            .then(() => {
                gorilla.populate('#gorilla', 'response', {number1: 'First', number2: 'Second'});
                gorilla.refreshLayout();
                // this begins the gorilla stopwatch allowing us to record the reaction time of the user
                gorilla.startStopwatch();

                $('.number-zone').one('click', (event: JQueryEventObject) => {
                    // Show it has been clicked by frame defined in 'Style' file
                    $(event.currentTarget).addClass('selected');
                    sequence_resp.cancel(); // for response within 3 s

                    //stop watch and retrieve RT using getStopwatch
                    gorilla.stopStopwatch();
                    var responseTime = gorilla.getStopwatch();

                    // In the template, we included the number in data-number on each number element
                    // We can access this now using data('number')
                    var selectedNumber = $(event.currentTarget).data('number');
                    if (selectedNumber == 'First') {
                        // Correct
                        ThisCorrect = 1;
                        correct++;

                    } else if (selectedNumber == 'Second') {
                        // Incorrect
                        ThisCorrect = 0;
                        err++;

                    } else {
                        //No response
                        ThisCorrect = -1;
                        responseTime = -1;
                    }

                    // gorilla.metric submits metrics to the database
                    gorilla.metric({
                        selectedNumber: selectedNumber, // choice
                        CorrectIncorrect: ThisCorrect,
                        responseTime: responseTime, //RT
                        order: order.toString(), //trialNumbers.toString(),
                        isi: isi,
                    });

                    // Since we go in blocks of SB and BS, here we test if had both (is div by 2), then continue, or not, then do the other
                    // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
                    sequence = gorilla.addTimerSequence()
                        .delay(300)
                        .then(() => {
                            if (currentTrial % 2 === 0) {
                                iterateAndProgress();
                            } else {
                                SmallerBigger();
                            }
                        })
                        .run();

                }); // end number-zone

                // go further if they do not answer within 3 s
                sequence_resp = gorilla.addTimerSequence()
                    .delay(3000)
                    // .then contains a function which is executed once the previous delay has been finished
                    .then(() => {
                        //No response
                        gorilla.metric({
                            selectedNumber: 'None', // choice
                            CorrectIncorrect: -1,
                            responseTime: -1, //RT
                            order: order.toString(), //trialNumbers.toString(),
                            isi: isi,
                        });
                        err++; // count it as a mistake

                        if (currentTrial % 2 === 0) {
                            iterateAndProgress();
                        } else {
                            SmallerBigger();
                        }
                    })
                    .run(); // go further

            }) // finish collection

            // run the sequence of BS
            .run();

    }


    function DisplayTrial() {

        var sequence = null;
        correct = 0;

        // Randomise order
        var rand = Math.random();
        if (rand <= 0.5) {
            SmallerBigger();
        } else {
            //SmallerBigger();
            BiggerSmaller();
        }
    }

    function iterateAndProgress() {
        // compute correct/incorrect and next trial parameters, if convergence criterion met, stop
        if (correct === 2) {
            // decrease step
            if (prev === 0 && (ratio * 0.9) > 1) {
                ratio = ratio * 0.9;
            }

            // update JND
            staircaseJND = testSize - refSize;
            // update test size
            //diff = staircaseJND / ratio;
            diff = Math.round(diff / ratio); // to have integer pixel values
            testSize = refSize + diff;
            prev = 1;
            // correct=0;

            // save updates
            gorilla.metric({
                numTrials: currentTrial,
                JND_px: staircaseJND,
                difference: diff,
                test_size: testSize,
                ref_size: refSize,
                ratio: ratio,
            });

            if (err < 7) {
                DisplayTrial();
            } else {

                // save vars
                //var staircaseJNDinMM = staircaseJND/ pixPerCm; //tech_details.screen_data.screenPpm[0];
                // gorilla.metric({
                // numTrials: currentTrial,
                // JND_px: staircaseJND,
                // JND_mm: staircaseJNDinMM,
                //ExpTime: endTime - startTime;
                //screen_details: screen_data,
                // });
                DisplayFinish();
            }

            // end if correct == 2
        } else {
            // increase step
            if (prev === 1 && (ratio * 0.9) > 1) {
                ratio = ratio * 0.9;
            }

            // update test size
            diff = Math.round(diff * ratio);
            testSize = refSize + diff;
            prev = 0;
            // correct=0;
            // save updates
            gorilla.metric({
                numTrials: currentTrial,
                JND_px: staircaseJND,
                difference: diff,
                test_size: testSize,
                ref_size: refSize,
                ratio: ratio,
            });
            DisplayTrial();
        } // end else correct == 2

    }

    function DisplayFinish() {
        // save for following experiments
        var JND_px = staircaseJND
        // var JND_mm = staircaseJNDinMM
        gorilla.store('JND_px', 0, true);
        // gorilla.store('JND_mm', 0, true);

        gorilla.finish();
    }


    gorilla.run(function () {
        DisplayInstructions();
    });

});


// Resize stimuli

function setTechDetails(refSize_cm) {

    // print screen resolution
    var oldResolution = [555, 555]; // need to get

    // extract weight and hight of screen (in mm)
    var screen_width = 666 // extract
    var screen_height = 666
    var x_max //the number of pixels for the x axe, i.e. the width of the screen in px

    // compute pixel per inch (or per mm, ppi ot ppm)
    var w_ppm = oldResolution[0] / screen_width;
    var h_ppm = oldResolution[1] / screen_height;

    // Determine reference size - in pixels according to ppm
    var px_refSize_ppm = w_ppm * refSize;

    // Determine reference size - in pixels according to windowRect
    var px_refSize_rect = (x_max / screen_width) * refSize;

    var screen_data = {
        'screenResolution': oldResolution,
        'screenSizeInMM': [screen_width, screen_height],
        'screenPpm': [w_ppm, h_ppm],
        'GivenRefSize': refSize_cm,
        'px_refSize_rect': px_refSize_rect,
        'px_refSize_ppm': px_refSize_ppm,
        //'final_height_px': final_height_px,
        //'final_width_px': final_width_px,
    };

    return {
        'px_refSize_rect': px_refSize_rect,
        'screen_data': screen_data,
    };
}