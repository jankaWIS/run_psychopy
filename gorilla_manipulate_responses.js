import gorilla

= require('gorilla/gorilla');

gorilla.ready(() => {
    gorilla.initialiseTimer();

    // gorilla.manipulation allows us to retrieve manipulations set for your task
    // it accesses a manipulation using the 'key' property set in the 'Manipulations' tab
    // Unlike in DisplayStimuli, we can now manipulate the number of trials between runs,
    // without having to change the code!
    var noOfTrials = gorilla.manipulation('noOfTrials');
    var currentTrial = 0;

    function DisplayInstructions() {

        gorilla.populate('#gorilla', 'instructions', {});
        gorilla.refreshLayout();
        $('.continue-button').one('click', (event: JQueryEventObject) => {
            DisplayTrial();
        });
    }

    // we want to pick out two numbers to display to our participant
    // They have to be different numbers and we want to pick them out 'randomly'
    // We've chosen to use Math.random and Math.floor to generate a random integer and use this as in index for our set of numbers
    // we then remove the value at that index from our set of numbers
    // There are lots of other ways you could generate a random set of numbers --- all of this is normal javascript code and not unique to gorilla.
    function generateTrialNumbers() {
        var numbers = [];

        var numberSet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        for (var i = 0; i < 2; i++) {
            var numberIndex = randomIntFromInterval(0, 9 - numbers.length);
            numbers.push(numberSet[numberIndex]);
            numberSet.splice(numberIndex, 1);
        }

        return numbers;
    }

    function DisplayTrial() {

        var sequence = null;
        var trialNumbers = generateTrialNumbers();
        gorilla.populate('#gorilla', 'trial', {number1: trialNumbers[0], number2: trialNumbers[1]});
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

            // gorilla.metric submits metrics to the database
            // it takes as an arguement a dictonary (a set of key/vlaue pairs)
            // these keys must correspond to the 'key' properties entered in the 'Metrics' tab
            // in order to upload metrics to the gorilla database, you will need to use this function!
            gorilla.metric({
                selectedNumber: selectedNumber,
                responseTime: responseTime,
                numberOptions: trialNumbers.toString(),
            });

            // In DisplayStimuli, we moved on to the next stimuli straight away if one was selected
            // Let's put in a short pause using a gorilla sequence so the user has some time to take in the result
            sequence = gorilla.addTimerSequence()
                .delay(500)
                .then(() => {
                    iterateAndProgress();
                })
                .run();

        });

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

    }

    gorilla.run(function () {
        DisplayInstructions();
    });

});

// Functions can be defined outside of gorilla.ready
// this can be useful if you want to group all of your 'helper' functions together like the randomIntFromInterval function below
function randomIntFromInterval(min, max) {
    // Math.floor and Math.random are standard javascript functions available from Math
    return Math.floor(Math.random() * (max - min + 1) + min);
}
