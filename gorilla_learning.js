import gorilla

= require('gorilla/gorilla');

// Parameters

var FixationLength = 500; //gorilla.manipulation(ManipulationsKeys.FixationLength, '500');
var isi = 500; // inter-stimuli interval (after 1st, after 2nd)

// initialize
var currentTrial = 0;
var noOfTrials = 5;//0;
var loc_on_screen = '';
var size_one = 0;// pixPerCm * refSize_cm;
var size_two = 0;
var correct;
var incorrect;
var feedback;
var earnings = 0; // cumulative reward/loss

var feedback_CSplus = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var feedback_CSminus = feedback_CSplus.map(num => 1 - num) // form the corresponding 1-RS


// Get technical details

// Get the value from Calibration task
//var pixPerCm = gorilla.retrieve('PxPerCm', 0, true);
//var JND_px = gorilla.retrieve('JND_px', 0, true);
// With this value, you know how many pixels on the participants monitor represent a real life centimetre.
// So, you can use this to work out how many pixels wide and high your image needs to be for a certain size in centimetres.
// For example, if you want it to be 5cm in width you would do 5 * pixPerCm to get the number of pixels width required.

//var tech_details = setTechDetails(73.5)
var refSize_cm = 7.4;
var pixPerCm = 20;
var JND_px = 80;

// var refSize = 220; //tech_details.px_refSize_rect
var refSize = Math.round(pixPerCm * refSize_cm);
var initial_ratio = 3; // how far apart should they be, default 3*JND
var testSize = refSize + initial_ratio * JND_px;
var stimScreen = 500; // how long are stimuli on screen, ms

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
            //DisplayFinish();
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

    function ShowStimuli() {
        var sequence = null;
        var sequence_resp = null;
        var ThisCorrect = 5 // just to have some value in case the code does not work
        var responseTime = -5;
        var selectedNumber = '-5';

        currentTrial++;

        $('#gorilla').hide();
        //gorilla.populateAndLoad('#gorilla', 'response', {number1: 'First', number2: 'Second', image: refImage}, ()=>{
        gorilla.populateAndLoad('#gorilla', 'trial', {image: refImage, image1: refImage}, () => {
            $('#gorilla').show();

            $('.image').show();
            $('.image1').show();
            //$('.number-zone').hide();

            //already randomised
            $('.image').css('height', size_one + 'px').css('width', size_one + 'px');
            $('.image1').css('height', size_two + 'px').css('width', size_two + 'px');

            gorilla.refreshLayout();
            // this begins the gorilla stopwatch allowing us to record the reaction time of the user
            gorilla.startStopwatch();

            //$('.number-zone').one('click', (event: JQueryEventObject) => {
            // $('.image').one('click', (event: JQueryEventObject) => {
            //             // In DisplyStimuli, it wasn't very obvious that anything had been selected
            //             // Let's add a new class to the selected number zone so that the user knows it has been clicked
            //             // This class has been defined in our 'Style' file
            //             $(event.currentTarget).addClass('selected');
            //             sequence_resp.cancel(); // for response within 3 s

            //             // In DisplayStimuli, we immediately progressed upon selecting a stimuli
            //             // Now, we can use gorilla.metric to upload some data about what the user has just done!

            //             // gorilla.stopStopwatch(); this stops the stopwatch.  Note that the time on the stopwatch is still stored
            //             // (like a real stopwatch) we can retrieve this using getStopwatch
            //             gorilla.stopStopwatch();
            //             var responseTime = gorilla.getStopwatch();

            //             // In the template, we included the number in data-number on each number element
            //             // We can access this now using data('number')
            //             var selectedNumber = $(event.currentTarget).data('number');
            //             if(loc_on_screen = 'TestRef'){
            //             if(selectedNumber == 'Second'){
            //                 // Correct
            //                 ThisCorrect = 1;
            //                 correct++;

            //             } else if (selectedNumber == 'First') {
            //                 // Incorrect
            //                 ThisCorrect = 0;
            //                 incorrect++;
            //             }

            //             } // end of size_two>size_one
            //             else if(loc_on_screen = 'RefTest'){
            //                 if(selectedNumber == 'First'){
            //                 // Correct
            //                 ThisCorrect = 1;
            //                 correct++;
            //                 } else if (selectedNumber == 'Second') {
            //                     // Incorrect
            //                     ThisCorrect = 0;
            //                     incorrect++;
            //                 }
            //             }

            //             // gorilla.metric submits metrics to the database
            //             // it takes as an arguement a dictonary (a set of key/vlaue pairs)
            //             // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
            //             // in order to upload metrics to the gorilla database, you will need to use this function!
            //             gorilla.metric({
            //                 selectedNumber: selectedNumber, // choice
            //                 CorrectIncorrect: ThisCorrect,
            //                 responseTime: responseTime, //RT
            //                 loc_on_screen: loc_on_screen, //trialNumbers.toString(),
            //                 isi: isi,
            //             });

            //             // Since we go in blocks of SB and BS, here we test if had both (is div by 2), then continue, or not, then do the other
            //             // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
            //             sequence = gorilla.addTimerSequence()
            //                 .delay(100)
            //                 .then(() => {
            //                     $('.image').hide();
            //                     $('.image1').hide();;
            //                 })
            //                 .delay(300)
            //                 .then(() => {
            //                     iterateAndProgress();
            //                 })
            //                 .run();

            //         }); // end number-zone


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
                if (loc_on_screen = 'TestRef') {
                    // Incorrect
                    ThisCorrect = 0;
                    incorrect++;
                } else if (loc_on_screen = 'RefTest') {
                    // Correct
                    ThisCorrect = 1;
                    correct++;
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
                if (loc_on_screen = 'RefTest') {
                    // Incorrect
                    ThisCorrect = 0;
                    incorrect++;
                } else if (loc_on_screen = 'TestRef') {
                    // Correct
                    ThisCorrect = 1;
                    correct++;
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
                        loc_on_screen: loc_on_screen, //trialNumbers.toString(),
                        isi: isi,
                    });
                    incorrect++; // count it as a mistake

                    iterateAndProgress();

                })
                .run(); // go further

        }) // finish populate


/////////////////////////////////
//         // Show images
//         sequence = gorilla.addTimerSequence()
//                 .delay(100)
//                 // give some break after fixation cross
//                 .then(() => {
//                     gorilla.populate('#gorilla', 'trial', {});
//                     $('.image').hide();
//                     $('.image1').hide();
//                     $('.gorilla-fixation-cross').hide();
//                     gorilla.refreshLayout();
//                 })
//                 .delay(500)

//         // Present stimuli and collect response
//                 .then(() => {
//         //gorilla.populate('#gorilla', 'response', {number1: 'First', number2: 'Second', image: refImage});
//         // gorilla.populate('#gorilla', 'response', {image: refImage});
//         //$('.image').show();
//         //$('.image').css('height', size_one + 'px').css('width', size_one + 'px');

// //  //      //
//          gorilla.populate('#gorilla', 'trial', {image: refImage, image1: refImage});
//                     $('.image').show();
//                     $('.image1').show();
//                     $('.gorilla-fixation-cross').hide();

//         gorilla.refreshLayout();
//         // this begins the gorilla stopwatch allowing us to record the reaction time of the user
//         gorilla.startStopwatch();

//         //$('.number-zone').one('click', (event: JQueryEventObject) => {
//         $('.stimuli').one('click', (event: JQueryEventObject) => {
//                     // In DisplyStimuli, it wasn't very obvious that anything had been selected
//                     // Let's add a new class to the selected number zone so that the user knows it has been clicked
//                     // This class has been defined in our 'Style' file
//                     $(event.currentTarget).addClass('selected');
//                     sequence_resp.cancel(); // for response within 3 s

//                     // In DisplayStimuli, we immediately progressed upon selecting a stimuli
//                     // Now, we can use gorilla.metric to upload some data about what the user has just done!

//                     // gorilla.stopStopwatch(); this stops the stopwatch.  Note that the time on the stopwatch is still stored
//                     // (like a real stopwatch) we can retrieve this using getStopwatch
//                     gorilla.stopStopwatch();
//                     var responseTime = gorilla.getStopwatch();

//                     // In the template, we included the number in data-number on each number element
//                     // We can access this now using data('number')
//                     var selectedNumber = $(event.currentTarget).data('number');
//                     if(loc_on_screen = 'TestRef'){
//                     if(selectedNumber == 'Second'){
//                         // Correct
//                         ThisCorrect = 1;
//                         correct++;

//                     } else if (selectedNumber == 'First') {
//                         // Incorrect
//                         ThisCorrect = 0;
//                         incorrect++;
//                     }

//                     } // end of size_two>size_one
//                     else if(loc_on_screen = 'RefTest'){
//                         if(selectedNumber == 'First'){
//                         // Correct
//                         ThisCorrect = 1;
//                         correct++;
//                         } else if (selectedNumber == 'Second') {
//                             // Incorrect
//                             ThisCorrect = 0;
//                             incorrect++;
//                         }
//                     }

//                     // gorilla.metric submits metrics to the database
//                     // it takes as an arguement a dictonary (a set of key/vlaue pairs)
//                     // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
//                     // in order to upload metrics to the gorilla database, you will need to use this function!
//                     gorilla.metric({
//                         selectedNumber: selectedNumber, // choice
//                         CorrectIncorrect: ThisCorrect,
//                         responseTime: responseTime, //RT
//                         loc_on_screen: loc_on_screen, //trialNumbers.toString(),
//                         isi: isi,
//                     });

//                     // Since we go in blocks of SB and BS, here we test if had both (is div by 2), then continue, or not, then do the other
//                     // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
//                     sequence = gorilla.addTimerSequence()
//                         .delay(300)
//                         .then(() => {
//                             iterateAndProgress();
//                         })
//                         .run();

//                 }); // end number-zone

//                 // go further if they do not answer within 3 s
//                 sequence_resp = gorilla.addTimerSequence()
//                 .delay(3000)
//                 // .then contains a function which is executed once the previous delay has been finished
//                 .then(() => {
//                             //No response
//                             gorilla.metric({
//                                 selectedNumber: 'None', // choice
//                                 CorrectIncorrect: -1,
//                                 responseTime: -1, //RT
//                                 loc_on_screen: loc_on_screen, //trialNumbers.toString(),
//                                 isi: isi,
//                             });
//                             incorrect++; // count it as a mistake

//                             iterateAndProgress();

//                         })
//                 .run(); // go further

//                 ;}) // finish collection

//                 // run the sequence of SB
//                 .run();

    }


    function DisplayTrial() {

        var sequence = null;
        // correct=0;

        // Randomise location
        var rand = Math.random();
        if (rand <= 0.5) {
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

    function iterateAndProgress() {
        currentTrial++;
        if (currentTrial < noOfTrials) {
            DisplayTrial();
        } else {
            gorilla.metric({
                noOfTrials: noOfTrials,
                pixPerCm: pixPerCm,
                err: incorrect,
                correct: correct,
            });

            DisplayFinish();
        }
    }

    function DisplayFinish() {
        // save for following experiments
        // var total_earnings = earnings;
        // var stimuli_name = refImage;
        // gorilla.store('total_earnings', 0, true);
        // gorilla.store('stimuli_name', 0, true);

        gorilla.finish();
    }

    gorilla.run(function () {
        DisplayInstructions();
    });


    // function SaveAndRun(selectedNumber,ThisCorrect,responseTime,loc_on_screen){
    //                 // gorilla.metric submits metrics to the database
    //         // it takes as an arguement a dictonary (a set of key/vlaue pairs)
    //         // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
    //         // in order to upload metrics to the gorilla database, you will need to use this function!
    //         gorilla.metric({
    //             selectedNumber: selectedNumber, // choice
    //             CorrectIncorrect: ThisCorrect,
    //             responseTime: responseTime, //RT
    //             loc_on_screen: loc_on_screen, //trialNumbers.toString(),
    //             isi: isi,
    //         });

    //         sequence = gorilla.addTimerSequence()
    //             .delay(100)
    //             .then(() => {
    //                 $('.image').hide();
    //                 $('.image1').hide();;
    //             })
    //             .delay(300)
    //             .then(() => {
    //                 iterateAndProgress();
    //             })
    //             .run();
    // }

});