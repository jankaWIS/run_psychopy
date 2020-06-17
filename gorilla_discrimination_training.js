import gorilla = require('gorilla/gorilla');

// fixed the problem with non clickable buttons by style="pointer-events: none;"
// set default value fo px per cm

// Parameters

var FixationLength = 800; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var isi = 500; // inter-stimuli interval (after 1st, after 2nd)

// initialize
var currentTrial = 0;
var noOfTrials = 10; // number of trials
var err = 0 // number of errors
var correct = 0;


// Get technical details

// Get the value from Calibration task
var pixPerCm = gorilla.retrieve('PxPerCm', 24, true);
// With this value, you know how many pixels on the participants monitor represent a real life centimetre.
// So, you can use this to work out how many pixels wide and high your image needs to be for a certain size in centimetres.
// For example, if you want it to be 5cm in width you would do 5 * pixPerCm to get the number of pixels width required.

//var tech_details = setTechDetails(73.5)
var refSize_cm = 7.4;
// var pixPerCm = 20;

// var refSize = 220; //tech_details.px_refSize_rect
var size_one = 7;// pixPerCm * refSize_cm;
var size_two = 6.4;
var stimScreen = 500; // how long are stimuli on screen, ms
var feedbackTime = 1000; //for how long to show feedback, ms

// Generate sizes
var size_one_values = [5, 5.4, 5.8, 6.2, 6.6, 7, 7.4, 7.8, 8.2, 8.6];
var size_two_values = [5.2, 5.6, 6, 6.4, 6.6, 6.8, 7.2, 7.6, 8, 8.4];
var shuffled_one = gorilla.shuffle(size_one_values);
var shuffled_two = gorilla.shuffle(size_two_values);



gorilla.ready(()=> {
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
        //var stimuliImages = ['Asset 44.png', 'Asset 45.png', 'Asset 46.png', 'Asset 47.png', 'Asset 48.png', 'Asset 49.png']
        var stimuliImages = ['29.png', '38.png', '39.png', '42.png']

        var image = '';

        var rand = Math.random();
        rand *= stimuliImages.length; // to get random number in range of length of stimuli
        rand = Math.floor(rand); // to get an index

        image = stimuliImages[rand]; // to get a random stimuli

        return image;
    }

    function ShowStimuli() {
        // Select one reference image
        var refImage = imagePicker();

        var order = 'none';
        var sequence = null;
        var sequence_resp = null;
        var sequence_fbk = null;
        var ThisCorrect = 5 // just to have some value in case the code does not work

        if(size_two > size_one){
            order='BS';
        } else{
            order='SB';
        }

        $('#gorilla').hide();
        gorilla.populateAndLoad('#gorilla', 'trial_response', {image: refImage, number1: 'First', number2: 'Second'}, ()=>{
        $('#gorilla').show();

        // Hide all
        $('.image').hide();
        $('.gorilla-fixation-cross').hide();
        $('.missed-trial').hide();
        $('.s-answer-red').hide();
        $('.s-answer-green').hide();
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
                // give some break after fixation cross
                .delay(FixationLength)
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

                    if(size_two > size_one){
                    if(selectedNumber == 'Second'){
                        // Correct
                        ThisCorrect = 1;
                        correct++;

                        //display FEEDBACK
                        sequence_fbk = gorilla.addTimerSequence()
                        .delay(100)
                        // show correct
                        .then(() => {
                                $('.number-zone').hide();
                                $('.gorilla-hint').hide();
                                $('.s-answer-green').show();
                                gorilla.refreshLayout();
                        })
                        .delay(feedbackTime)
                        .run();


                    } else if (selectedNumber == 'First') {
                        // Incorrect
                        ThisCorrect = 0;
                        err++;
                        //display FEEDBACK
                        sequence_fbk = gorilla.addTimerSequence()
                        .delay(100)
                        // show incorrect
                        .then(() => {
                                $('.number-zone').hide();
                                $('.gorilla-hint').hide();
                                $('.s-answer-red').show();
                                gorilla.refreshLayout();
                        })
                        .delay(feedbackTime)
                        .run();
                    }

                    } // end of size_two>size_one
                    else {
                        if(selectedNumber == 'First'){
                        // Correct
                        ThisCorrect = 1;
                        correct++;

                        //display FEEDBACK
                        sequence_fbk = gorilla.addTimerSequence()
                        .delay(100)
                        .then(() => {
                                $('.number-zone').hide();
                                $('.gorilla-hint').hide();
                                $('.s-answer-green').show();
                                gorilla.refreshLayout();
                        })
                        .delay(feedbackTime)
                        .run();

                    } else if (selectedNumber == 'Second') {
                        // Incorrect
                        ThisCorrect = 0;
                        err++;
                        //display FEEDBACK
                        sequence_fbk = gorilla.addTimerSequence()
                        .delay(100)
                        .then(() => {
                                $('.number-zone').hide();
                                $('.gorilla-hint').hide();
                                $('.s-answer-red').show();
                                gorilla.refreshLayout();
                                gorilla.refreshLayout();
                        })
                        .delay(feedbackTime)
                        .run();
                    }
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
                    });

                    // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
                    sequence = gorilla.addTimerSequence()
                        .delay(300+feedbackTime)
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
                            $('.number-zone').hide();
                            $('.gorilla-hint').hide();
                            //No response
                            gorilla.metric({
                                selectedNumber: 'None', // choice
                                CorrectIncorrect: -1,
                                responseTime: -1, //RT
                                refImage: refImage,
                                order: order.toString(), //trialNumbers.toString(),
                                isi: isi,
                                size_one: size_one,
                                size_two: size_two,
                            });
                            err++; // count it as a mistake
                            //display FEEDBACK for missed
                            $('.missed-trial').show();
                            gorilla.refreshLayout();

                        })
                .delay(feedbackTime)
                .then(() => {iterateAndProgress();})
                .run(); // go further

                }) // finish collection

                // run the sequence of SB
                .run();
        }) // finish populate

    }


    function DisplayTrial() {

        var sequence = null;

        // Randomise order -- reassign values
        size_one = pixPerCm * shuffled_one[currentTrial];
        size_two = pixPerCm * shuffled_two[currentTrial];
        ShowStimuli();

    }

    function iterateAndProgress(){
        currentTrial++;
        if(currentTrial < noOfTrials){
            DisplayTrial();
        } else {
            gorilla.metric({
                noOfTrials: noOfTrials,
                pixPerCm: pixPerCm,
                err: err,
                correct: correct,
                            });

            DisplayFinish();
        }
    }

    function DisplayFinish(){
        gorilla.populate('#gorilla', 'closing', {});
        gorilla.refreshLayout();

        $('.continue-button').one('click', (event: JQueryEventObject) => {
            gorilla.finish();
        });
        }

    gorilla.run(function(){
        DisplayInstructions();
    });

});
