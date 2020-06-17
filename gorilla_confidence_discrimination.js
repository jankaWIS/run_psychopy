import gorilla = require('gorilla/gorilla');

// Parameters

var FixationLength = 500; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var isi = 500; // inter-stimuli interval (after 1st, after 2nd)

// initialize
var currentTrial = 0;
var noOfTrials = 1;
var loc_on_screen = '';
var size_one = 0;// pixPerCm * refSize_cm;
var size_two = 0;

// Select one reference image
var refImage = gorilla.retrieve('stimuli_name', 'Asset 45.png', true);
// var refImage = 'Asset 38.png'; // MUST FIT LEARNING game

// Get technical details

// Get the value from Calibration task
var pixPerCm = gorilla.retrieve('PxPerCm', 24, true); // the second is a default value
var JND_px = gorilla.retrieve('JND_px', 80, true);
// With this value, you know how many pixels on the participants monitor represent a real life centimetre.
// So, you can use this to work out how many pixels wide and high your image needs to be for a certain size in centimetres.
// For example, if you want it to be 5cm in width you would do 5 * pixPerCm to get the number of pixels width required.

//var tech_details = setTechDetails(73.5)
var refSize_cm = 7.4;
// var pixPerCm = 20;
// var JND_px = 80;

// var refSize = 220; //tech_details.px_refSize_rect
var refSize = Math.round(pixPerCm * refSize_cm);
var initial_ratio = 3; // how far apart should they be, default 3*JND
var testSize = refSize + initial_ratio*JND_px;

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


    function ShowStimuli() {
        var sequence = null;
        var sequence_resp = null;
        var ThisCorrect = 5 // just to have some value in case the code does not work
        var responseTime = -5;
        var selectedNumber = '-5';

        $('#gorilla').hide();
        gorilla.populateAndLoad('#gorilla', 'trial', {image: refImage, image1: refImage}, ()=>{
        $('#gorilla').show();

        $('.image').show();
        $('.image1').show();
        // $('.s-optimal').hide();

        //already randomised
        $('.image').css('height', size_one + 'px').css('width', size_one + 'px');
        $('.image1').css('height', size_two + 'px').css('width', size_two + 'px');

        gorilla.refreshLayout();
        // this begins the gorilla stopwatch allowing us to record the reaction time of the user
        gorilla.startStopwatch();

        $('.image').one('click', (event: JQueryEventObject) => {
                    // Let's add a new class to the selected number zone so that the user knows it has been clicked
                    // This class has been defined in our 'Style' file
                    $(event.currentTarget).addClass('selected');
                    sequence_resp.cancel(); // for response within 3 s

                    // gorilla.stopStopwatch(); this stops the stopwatch.  Note that the time on the stopwatch is still stored
                    // (like a real stopwatch) we can retrieve this using getStopwatch
                    gorilla.stopStopwatch();
                    responseTime = gorilla.getStopwatch();

                    selectedNumber = 'Left';
                    if(loc_on_screen = 'TestRef'){
                        // Incorrect
                        ThisCorrect = 0;

                    }
                    else if(loc_on_screen = 'RefTest'){
                        // Correct
                        ThisCorrect = 1;
                        }

           gorilla.metric({
                selectedNumber: selectedNumber, // choice
                CorrectIncorrect: ThisCorrect,
                responseTime: responseTime, //RT
                loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                isi: isi,
            });

            sequence = gorilla.addTimerSequence()
                .delay(100)
                .then(() => {
                    $('.image').hide();
                    $('.image1').hide();
                })
                .delay(300)
                .then(() => {
                    iterateAndProgress();
                })
                .run();


        }); // end Left image

        $('.image1').one('click', (event: JQueryEventObject) => {
                    // Let's add a new class to the selected number zone so that the user knows it has been clicked
                    // This class has been defined in our 'Style' file
                    $(event.currentTarget).addClass('selected');
                    sequence_resp.cancel(); // for response within 3 s

                    // gorilla.stopStopwatch(); this stops the stopwatch.  Note that the time on the stopwatch is still stored
                    // (like a real stopwatch) we can retrieve this using getStopwatch
                    gorilla.stopStopwatch();
                    responseTime = gorilla.getStopwatch();

                    selectedNumber = 'Right';
                    if(loc_on_screen = 'RefTest'){
                        // Incorrect
                        ThisCorrect = 0;
                    }
                    else if(loc_on_screen = 'TestRef'){
                        // Correct
                        ThisCorrect = 1;
                    }

                // SaveAndRun();
            gorilla.metric({
                selectedNumber: selectedNumber, // choice
                CorrectIncorrect: ThisCorrect,
                responseTime: responseTime, //RT
                loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                isi: isi,
            });

            sequence = gorilla.addTimerSequence()
                .delay(100)
                .then(() => {
                    $('.image').hide();
                    $('.image1').hide();
                })
                .delay(300)
                .then(() => {
                    iterateAndProgress();
                })
                .run();


        }); // end Right image



                // go further if they do not answer within 10 s
                sequence_resp = gorilla.addTimerSequence()
                .delay(10000)
                // .then contains a function which is executed once the previous delay has been finished
                .then(() => {
                            //No response
                            gorilla.metric({
                                selectedNumber: 'None', // choice
                                CorrectIncorrect: -1,
                                responseTime: -1, //RT
                                loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                                isi: isi,
                            });

                            iterateAndProgress();

                        })
                .run(); // go further

    }) // finish populate

}


    function DisplayTrial() {

        var sequence = null;
        // correct=0;

        // Randomise location
        var rand = Math.random();
        if(rand <= 0.5){
            size_one = testSize;
            size_two = refSize;
            loc_on_screen = 'TestRef'
            ShowStimuli();
        } else {
            size_one = refSize;
            size_two = testSize;
            loc_on_screen = 'RefTest'
            ShowStimuli();
        }
    }

    function iterateAndProgress(){
        currentTrial++;
        if(currentTrial < noOfTrials){
            DisplayTrial();
        } else {
            gorilla.metric({
                noOfTrials: noOfTrials,
                pixPerCm: pixPerCm,
                JND_px: JND_px,
                refSize: refSize,
                testSize: testSize,
                stimuli_name: refImage,
                            });

            DisplayFinish();
        }
    }

    function DisplayFinish(){
        // save for following experiments
        var stimuli_name = refImage;
        gorilla.store('stimuli_name', 0, true);

            gorilla.finish();
        }

    gorilla.run(function(){
        DisplayInstructions();
    });

});