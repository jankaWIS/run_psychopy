import gorilla

= require('gorilla/gorilla');

// Parameters

var FixationLength = 500; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var isi = 500; // inter-stimuli interval (after 1st, after 2nd)

// Get technical details

// Get the value from Calibration task
// var pixPerCm = gorilla.retrieve('PxPerCm', 0, true);
// var JND_px = gorilla.retrieve('JND_px', 0, true);
// With this value, you know how many pixels on the participants monitor represent a real life centimetre.
// So, you can use this to work out how many pixels wide and high your image needs to be for a certain size in centimetres.
// For example, if you want it to be 5cm in width you would do 5 * pixPerCm to get the number of pixels width required.

//var tech_details = setTechDetails(73.5)
var pixPerCm = 24;
var JND_px = 80;
var refSize_cm = 7.4;
var refSize = Math.round(pixPerCm * refSize_cm);
// var stimuli_name = gorilla.retrieve('stimuli_name', 0, true);
var stimuli_name = 'Asset 45.png'; // MUST be the same as learning game

// var refSize = 220; //tech_details.px_refSize_rect
var size_one = 0;// pixPerCm * refSize_cm;
var size_two = 0;
var stimScreen = 500; // how long are stimuli on screen, ms

// Generate sizes
//var GS = [0, 0.33, 0.6, 0.8, 1, 1.2, 1.4, 4]
//var GS_arr = [0, 0, 0, 0, 0, 0.33, 0.33, 0.33, 0.33, 0.33, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8,
//0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1, 1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.4, 1.4, 1.4, 1.4, 1.4, 4, 4, 4, 4, 4];

var GS_arr = [0, 0, 0, 0, 0, 0.33, 0.33, 0.33, 0.33, 0.33, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1, 1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.4, 1.4, 1.4, 1.4, 1.4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0.33, 0.33, 0.33, 0.33, 0.33, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1, 1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.4, 1.4, 1.4, 1.4, 1.4, 4, 4, 4, 4, 4]
// var sb_arr = Collections.nCopies(5, "SB");
// var bs_arr = new String[10];
// Arrays.fill(bs_arr, "BS");
// asList = Arrays.asList(bs_arr);
var sb_arr = ['SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB', 'SB']
var bs_arr = ['BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS', 'BS']
var size_order = sb_arr.concat(bs_arr)
// Create a random list of order -- sample random locations
// https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n?page=1&tab=votes#tab-top
// var trials = Array.from(Array(10).keys())
// var trials = [...Array(10).keys()]
// var trials = Array.apply(null, {length: size_order.length}).map(Number.call, Number)
var trials = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79]
var shuffled_trials = gorilla.shuffle(trials);
var trial = 0;
var big_error = 0;

var ones;
(ones = []).length = 30;
ones.fill(1);


// initialize
var currentTrial = 0;
var noOfTrials = size_order.length // number of trials
var err = 0 // number of errors
var correct = 0;
var order = null;


// var big = size_one_values.map(function(element) {
// 	return element*2;
// });

// var small = size_two_values.map(function(element) {
// 	return element*2;
// });

// var shuffled_one = gorilla.shuffle(big);
// var shuffled_two = gorilla.shuffle(small);


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

    // var jsPsych = window['jsPsych'];
    // function SampleSizes(){
    //     return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
    //   }


    function ShowStimuli() {
        // Select one reference image
        var refImage = stimuli_name;

        var sequence = null;
        var sequence_resp = null;
        var ThisCorrect = 5 // just to have some value in case the code does not work


        $('#gorilla').hide();
        gorilla.populateAndLoad('#gorilla', 'trial_response', {
            image: refImage,
            number1: 'First',
            number2: 'Second'
        }, () => {
            $('#gorilla').show();

            // Hide all
            $('.image').hide();
            $('.gorilla-fixation-cross').hide();
            // $('.gorilla-float').hide();
            $('.gorilla-hint').hide();
            $('.number-zone').hide();

            // Show images
            sequence = gorilla.addTimerSequence()
                .delay(100)
                // show fixation cross
                .then(() => {
                    $('.gorilla-fixation-cross').show();
                    gorilla.refreshLayout();
                })
                .delay(FixationLength)
                // give some break after fixation cross
                .then(() => {
                    $('.gorilla-fixation-cross').hide();
                    gorilla.refreshLayout();
                })
                .delay(500)
                // show first image
                .then(() => {
                    $('.image').show();
                    $('.image').css('height', size_one + 'px').css('width', size_one + 'px');
                    gorilla.refreshLayout();
                })
                .delay(stimScreen)
                // give some break after first image
                .then(() => {
                    $('.image').hide();
                    gorilla.refreshLayout();
                })
                .delay(isi)
                // show second image
                .then(() => {
                    $('.image').show();
                    $('.image').css('height', size_two + 'px').css('width', size_two + 'px');
                    gorilla.refreshLayout();
                })
                .delay(stimScreen)
                // give some break after the second image
                .then(() => {
                    $('.image').hide();
                    gorilla.refreshLayout();
                })
                .delay(isi)

                // Not a good way of doing that but collect response here and now
                .then(() => {
                    // gorilla.populate('#gorilla', 'response', {number1: 'First', number2: 'Second'});
                    $('.number-zone').show();
                    $('.gorilla-hint').show();
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

                        if (order == 'SB') {
                            if (selectedNumber == 'Second') {
                                // Correct
                                ThisCorrect = 1;
                                correct++;

                            } else if (selectedNumber == 'First') {
                                // Incorrect
                                ThisCorrect = 0;
                                err++;
                            }

                        } // end of size_two>size_one
                        else {
                            if (selectedNumber == 'First') {
                                // Correct
                                ThisCorrect = 1;
                                correct++;
                            } else if (selectedNumber == 'Second') {
                                // Incorrect
                                ThisCorrect = 0;
                                err++;
                            }
                        }

                        // add if they mess up the very big image
                        if (GS_arr[currentTrial] == 4 && ThisCorrect == 0) {
                            big_error++;
                        }

                        // gorilla.metric submits metrics to the database
                        // it takes as an arguement a dictonary (a set of key/vlaue pairs)
                        // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
                        // in order to upload metrics to the gorilla database, you will need to use this function!
                        gorilla.metric({
                            selectedNumber: selectedNumber, // choice
                            CorrectIncorrect: ThisCorrect,
                            responseTime: responseTime, //RT
                            refImage: refImage,
                            order: order.toString(), //trialNumbers.toString(),
                            isi: isi,
                            size_one: size_one,
                            size_two: size_two,
                            GS: GS_arr[trial],
                            trial: trial,
                            big_error: big_error,
                        });

                        // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
                        sequence = gorilla.addTimerSequence()
                            .delay(300)
                            .then(() => {
                                iterateAndProgress();
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
                                size_one: size_one,
                                size_two: size_two,
                                GS: GS_arr[currentTrial],
                                trial: trial,
                            });
                            err++; // count it as a mistake
                            iterateAndProgress();

                        })
                        .run(); // go further

                }) // finish collection

                // run the sequence of SB
                .run();
        }) // finish populate

    }


    function DisplayTrial() {

        var sequence = null;

        trial = shuffled_trials[currentTrial];
        order = size_order[trial];

        // Randomise order -- reassign values
        if (order == 'BS') {
            size_one = Math.round(refSize + GS_arr[trial] * JND_px);
            size_two = refSize;
            ShowStimuli();

        } else if (order == 'SB') {
            size_one = refSize;
            size_two = Math.round(refSize + GS_arr[trial] * JND_px);
            ShowStimuli();

        }

    }

    function iterateAndProgress() {
        currentTrial++;
        if (currentTrial < noOfTrials) {
            DisplayTrial();
        } else {
            gorilla.metric({
                noOfTrials: noOfTrials,
                pixPerCm: pixPerCm,
                err: err,
                correct: correct,
                sequence: shuffled_trials,
                stimuli_name: stimuli_name,
            });

            DisplayFinish();
        }
    }

    function DisplayFinish() {
        // save for following experiments
        gorilla.store('big_error', 0, true);

        gorilla.populate('#gorilla', 'closing', {});
        gorilla.refreshLayout();

        $('.continue-button').one('click', (event: JQueryEventObject) => {
            gorilla.finish();
        });
    }

    gorilla.run(function () {
        DisplayInstructions();
    });

});
