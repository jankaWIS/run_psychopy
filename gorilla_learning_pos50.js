import gorilla = require('gorilla/gorilla');

// Parameters

var FixationLength = 500; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var isi = 500; // inter-stimuli interval (after 1st, after 2nd)

// initialize
var currentTrial = 0;
var noOfTrials = 50;
var loc_on_screen = '';
var size_one = 0;// pixPerCm * refSize_cm;
var size_two = 0;
var correct = 0;
var incorrect = 0;
var feedback;
var earnings = 0; // cumulative reward/loss


// Generate rew/pun vectors
var RS = 0.5;//*noOfTrials;

var ones;
var zeros;
(ones = []).length = Math.round(RS*noOfTrials); ones.fill(1); // 70
// (ones = []).length = 30; ones.fill(1);
(zeros = []).length = Math.round((1-RS)*noOfTrials); zeros.fill(0); // 70
// (zeros = []).length = 20; zeros.fill(0); // 70
var RS_hig = ones.concat(zeros)
var RS_low = RS_hig.map(num => 1-num)
//https://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array

// Generate random vectors
var rewards = gorilla.shuffle(RS_hig);
var punishments = gorilla.shuffle(RS_low);


// Get technical details

// Get the value from Calibration task
var pixPerCm = gorilla.retrieve('PxPerCm', 20, true);
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
var stimScreen = 500; // how long are stimuli on screen, ms

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
        var stimuliImages = ['Asset 30.png', 'Asset 31.png', 'Asset 32.png', 'Asset 33.png', 'Asset 34.png', 'Asset 35.png', 'Asset 36.png', 'Asset 37.png', 'Asset 40.png', 'Asset 41.png', 'Asset 43.png', 'Asset 44.png', 'Asset 45.png', 'Asset 46.png', 'Asset 47.png', 'Asset 49.png']

        var image = '';

        var rand = Math.random();
        rand *= stimuliImages.length; // to get random number in range of length of stimuli
        rand = Math.floor(rand); // to get an index

        image = stimuliImages[rand]; // to get a random stimuli

        return image;
    }

    // Select one reference image
    var refImage = imagePicker();

    // Save initial setup
    var refSize_cm = refSize / pixPerCm;
    var testSize_cm = testSize / pixPerCm;
    gorilla.metric({
        JND_px: JND_px,
        stimuli_name: refImage,
        refSize: refSize,
        testSize: testSize,
        refSize_mm: refSize_cm,
        testSize_mm: testSize_cm,
        RS: RS,
    });


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

        //already randomised
        $('.image').css('height', size_one + 'px').css('width', size_one + 'px'); // left image
        $('.image1').css('height', size_two + 'px').css('width', size_two + 'px');

        $('.s-optimal').hide();
        $('.s-suboptimal').hide();
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
                    if(loc_on_screen == 'TestRef'){
                        // Incorrect
                        ThisCorrect = 0;
                        incorrect++;
                        feedback = punishments[currentTrial];
                        earnings += feedback;

                    }
                    else if(loc_on_screen == 'RefTest'){
                        // Correct
                        ThisCorrect = 1;
                        correct++;
                        feedback = rewards[currentTrial];
                        earnings += feedback;
                        }

           gorilla.metric({
                selectedNumber: selectedNumber, // choice
                CorrectIncorrect: ThisCorrect,
                responseTime: responseTime, //RT
                loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                isi: isi,
                feedback: feedback,
            });

            sequence = gorilla.addTimerSequence()
                .delay(100)
                .then(() => {
                    $('.image').hide();
                    $('.image1').hide();
                })
                .delay(300)
                .then(() => {
                // Update the value of the feedback by what they earned
                    if(feedback>0){
                    $('.s-optimal').html(feedback.toString());
                    $('.s-optimal').show();
                    } else if(feedback==0){
                    $('.s-suboptimal').html(feedback.toString());
                    $('.s-suboptimal').show();
                    }
                })
                .delay(300)
                .then(() => {
                    $('.s-optimal').hide();
                    $('.s-suboptimal').hide();
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
                    if(loc_on_screen == 'RefTest'){
                        // Incorrect
                        ThisCorrect = 0;
                        incorrect++;
                        feedback = punishments[currentTrial];
                        earnings += feedback;
                    }
                    else if(loc_on_screen == 'TestRef'){
                        // Correct
                        ThisCorrect = 1;
                        correct++;
                        feedback = rewards[currentTrial];
                        earnings += feedback;
                    }

                // SaveAndRun();
            gorilla.metric({
                selectedNumber: selectedNumber, // choice
                CorrectIncorrect: ThisCorrect,
                responseTime: responseTime, //RT
                loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                isi: isi,
                feedback: feedback,
            });

             sequence = gorilla.addTimerSequence()
                .delay(100)
                .then(() => {
                    $('.image').hide();
                    $('.image1').hide();
                })
                .delay(300)
                .then(() => {
                // Update the value of the feedback by what they earned
                    if(feedback>0){
                    $('.s-optimal').html(feedback.toString());
                    $('.s-optimal').show();
                    } else if(feedback==0){
                    $('.s-suboptimal').html(feedback.toString());
                    $('.s-suboptimal').show();
                    }
                })
                .delay(300)
                .then(() => {
                    $('.s-optimal').hide();
                    $('.s-suboptimal').hide();
                })
                .delay(300)
                .then(() => {
                    iterateAndProgress();
                })
                .run();


        }); // end Right image



                // go further if they do not answer within 3 s
                sequence_resp = gorilla.addTimerSequence()
                .delay(3000)
                .then(() => {
                    $('.image').hide();
                    $('.image1').hide();
                })
                .delay(300)
                .then(() => {
                            feedback = punishments[currentTrial];
                            earnings = earnings + feedback;
                            //No response
                            gorilla.metric({
                                selectedNumber: 'None', // choice
                                CorrectIncorrect: -1,
                                responseTime: -1, //RT
                                loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                                isi: isi,
                                feedback: feedback,
                            });
                            incorrect++; // count it as a mistake

                            // iterateAndProgress();

                            $('.s-suboptimal').show();
                        })
                .delay(300)
                .then(() => {
                    $('.s-suboptimal').hide();
                })
                .delay(300)
                .then(() => {
                    iterateAndProgress();
                         })
                .run(); // go further

    }) // finish populate

}


    function DisplayTrial() {

        var sequence = null;
        loc_on_screen = '';
        // correct=0;

        // Randomise location
        var rand = Math.random();
        if(rand <= 0.5){
            size_one = testSize; // left
            size_two = refSize;  // right
            loc_on_screen = 'TestRef';
            // ShowStimuli();
        } else {
            size_one = refSize;
            size_two = testSize;
            loc_on_screen = 'RefTest';
            // ShowStimuli();
        }

        ShowStimuli();
    }

    function iterateAndProgress(){
        currentTrial++;
        if(currentTrial < noOfTrials){
            DisplayTrial();
        } else {
            gorilla.metric({
                numTrials: noOfTrials,
                pixPerCm: pixPerCm,
                incorrect: incorrect,
                correct: correct,
                earnings: earnings,
                stimuli_name: refImage,
                });

            DisplayFinish();
        }
    }

    function DisplayFinish(){
        // save for following experiments

        // update total earnings throughout the experiment
        var total_earnings = gorilla.retrieve('total_earnings', 0, true);
        total_earnings += earnings;
        gorilla.metric({
                total_earnings: total_earnings,
        });

        var stimuli_name = refImage;
        gorilla.store('total_earnings', total_earnings, true);
        gorilla.store('stimuli_name', stimuli_name, true);

        gorilla.populate('#gorilla', 'closing', {});
        $('.s-optimal').html(earnings.toString());
        gorilla.refreshLayout();

        $('.continue-button').one('click', (event: JQueryEventObject) => {
            gorilla.finish();
        });
        }

    gorilla.run(function(){
        DisplayInstructions();
    });

});