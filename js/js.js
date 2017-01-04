
$(document).ready(function () {

    //-------------variable declarations---------------------------

    //initial array of syllogisms
    var arrayOfQuestions = [
        {
            question: "No reptiles are mammals. " +
            "All animals are mammals." +
            "Therefore, no reptiles are mammals.",
            value: "true"
        },
        {
            question: "All Canadians love snow. " +
            "All loggers are Canadian. " +
            "Therefore, all loggers love snow.",
            value: "false"
        },
        {
            question: "All poodles are animals." +
            "All animals are wild." +
            "Therefore, all poodles are wild.",
            value: "true"
        },
        {
            question: "All girls are dancers. " +
            "All dancers are left handed. " +
            "Therefore, all girls are left handed.",
            value: "true"
        },
        {
            question: "All women are teachers. " +
            "All teachers are nice people. " +
            "Therefore, all women are nice people.",
            value: "true"
        },
        {
            question: "All lions are animals." +
            "Some lions are in zoos." +
            "Therefore, some animals are in zoos.",
            value: "true"
        },
        {
            question: "All basketballs are balls. " +
            "All balls are round." +
            "Therefore, all basketballs are round.",
            value: "true"
        },
        {
            question: "All birds can fly." +
            "Eagles are birds." +
            "So, all eagles can fly.",
            value: "true"
        },
        {
            question: "All roses are plants. " +
            "All plants are living things." +
            "Therefore, all roses are living things.",
            value: "true"
        },
        {
            question: "Rocky and King are both dogs." +
            "All dogs have four legs." +
            "Therefore, Rocky and King have four legs.",
            value: "true"
        },
        {
            question: "All zebras are animals." +
            "Some animals are stripped." +
            "Therefore, some zebras are striped.",
            value: "false"
        },
        {
            question: "Anytime Anna is bitten by a dog she cries." +
            "Anna is crying." +
            "Therefore, Anna was bitten by a dog.",
            value: "false"
        },
        {
            question: "All the living members of the Beatles are rich." +
            "All the living members of the Beatles are over fifty." +
            "So, most of the rich are over fifty.",
            value: "false"
        },
        {
            question: "All of the blue toys are in Bill's room." +
            "All of Bill's toys are in his room." +
            "Therefore, all of Bill's toys are blue.",
            value: "false"
        },
        {
            question: "All frogs are reptiles." +
            "Some reptiles are green." +
            "Therefore, some frogs are green.",
            value: "false"
        },
        {
            question: "All men love football." +
            "Some Americans are men." +
            "So, all Americans love football.",
            value: "false"
        },
        {
            question: "All zebras are animals." +
            "Some animals are green." +
            "Therefore, some zebras are green.",
            value: "false"
        },
        {
            question: "Mary has brown hair." +
            "Tom has blond hair." +
            "Therefore, everyone has either brown or blond hair.",
            value: "false"
        },
        {
            question: "All dogs have legs." +
            "Barney the rabbit has legs." +
            "Therefore, Barney the rabbit is a dog.",
            value: "false"
        },
        {
            question: "All suitcases have a lock." +
            "All suitcases have a handle." +
            "Therefore, everything that has a lock has a handle.",
            value: "false"
        }
    ];

    var loadedArray = []; //array for questions that load into the flipbook
    var arrayOfAnswers = []; //array of answers that user gave
    var arrayOfHowSure = []; //array of how sure was user
    var arrayOfLatency = []; //array that keeps latency
    var iterator = 0; //variable for tracking which is the current number of question
    var timeStart, timeStop; //variables for tracking latency
    const LENGTH = 20; //constant for length of arrays
    var flipbook; //variable for a flipbook


    //---------------------function calls--------------------------

    loadQuestions(true);
    loadFlipbook();

    //----------------------event listeners------------------------


    $('#startButton').on('click', function () {

        $(this).css('display', 'none'); //on start click hide the button
        $('#answerAndDialog').css('display', 'block'); //show true and false buttons

        flipbook.turn('next'); //turn the flipbook

        timeStart = + new Date(); //get the timestamp for time tracking
    });


    $('.buttons').on('click', function () {

        var answer = $(this).val() + ""; //fetching the answer (true or false), and casting it to {string}
        arrayOfAnswers.push(answer); //storing the answer in array of answers

        $('#dialog').dialog(); //open the dialog box for how sure user is question

    });


    $('#howSureButton').on('click', function () {

        var input = $('input[type="radio"]:checked').val(); //get the value of checked radio button
        var scorecard = $('#scorecard'); //get the div element where we load scorecard table later

        arrayOfHowSure.push(input) //push the selected value in array of how sure was user
        console.log(arrayOfHowSure.length);

        $('#dialog').dialog('close'); //close the dialog upon clicking submit button

        iterator++; //increment the iterator for tracking number of question

        timeStop = + new Date(); // get the timestamp when user gave the final answer
        arrayOfLatency.push(timeStop - timeStart); //store the latency
        timeStart = + new Date(); //start new timestamp

        if(iterator == LENGTH) //if iterator matches LENGTH, end the test and show scorecard
        {
            $('.buttons').unbind('click'); //unbinding buttons (not necessary)
            $('#answerAndDialog').css('display', 'none');
            $('#start').css('display', 'none'); //hiding unnecessary content

            scorecard.html(createScoreCard()); //create scorecard
            scorecard.fadeIn(1500); //show scorecard

            $('#refreshButton').css('display', 'block'); //show button for restarting test
        }

        flipbook.turn('next'); //turn the flipbook page
    });

    // event listener for restarting test
    $('#refreshButton').on('click', function () {
        location.reload();
    });


    //--------------------function definitions--------------------------

    /**
     *function load questions in random order
     * if arg is true, if false loads in same order as in original array
     * @param arg boolean value
     */
    function loadQuestions(arg) {

        if(arg)
        {
            var assistArray = []; //array for keeping track of already chosen indexes

            //initialize first question
            assistArray.push(arrayOfQuestions[Math.round(Math.random() * (LENGTH - 1))]);
            loadedArray.push(assistArray[0]);

            for(var i = 0; i < LENGTH; i++)
            {
                var index = Math.round(Math.random() * (LENGTH - 1));

                while(assistArray.indexOf(index) != (-1))
                {
                    index = Math.round(Math.random() * (LENGTH - 1));
                }

                assistArray.push(index);
            }

            //initialize other questions
            for(var i = 1; i <= LENGTH; i++)
            {
                loadedArray.push(arrayOfQuestions[assistArray[i]]);
                console.log(assistArray[i]);
            }
        }
        else
        {
            loadedArray = arrayOfQuestions;
        }
    }

    /**
     * function for loading flipbook with questions
     * no input args
     */
    function loadFlipbook()
    {
        var flipBook = $('#flipbook'); //get the flipbook DOM element (div)

        var html = "<div style='width: 400px; height: 500px'><p class='pQuestions'>Syllogism test</p></div>";

        for (var i = 0; i < LENGTH; i++) {
            html += "<div><p></p></div>";
            html += "<div style='width: 400px; height: 500px'><p class='pQuestions'>" + loadedArray[i].question + "</p></div>";
        }

        flipBook.html(html); //load HTML string with pages inside flipbook div

        flipBook.bind('start',  //turning off the hover effect over a flipbook
            function (event, pageObject, corner) {
                if (corner == 'bl' || corner == 'br' || corner == 'tr' || corner == 'tl') {
                    event.preventDefault();
                }
            }
        );

        flipbook = flipBook.turn({ //flipbook initialization
            width: 600,
            height: 400,
            autoCenter: true,
            gradients: true,
            display: "double",
            duration: 1000
        });
    }

    /**
     * function for creating HTML string for scorecard table
     * @returns {string}
     */
    function createScoreCard() {

        var html = "<table class='table'>";
        html += "<tr><th>Correct answer</th><th>Response</th>" +
                "<th>Response latency</th><th>Certainity rating</th>" +
                "<th>Total correct</th>" + "<th>Total incorect</th>"
                +"<th>Certainity average</th>" + "<th>Certainity rating for correct</th>" + "</tr>"; //Headers

        html += "<tr>" //table rows and data
            + "<td>" + loadedArray[0].value + "</td>"
            + "<td>" + arrayOfAnswers[0] + "</td>"
            + "<td>" + arrayOfLatency[0] + "ms" + "</td>"
            + "<td>" + arrayOfHowSure[0] + "</td>"
            + "<td>" + totalCorrect() + "</td>"                 //
            + "<td>" + totalIncorrect() + "</td>"               //
            + "<td>" + certainityAverage().toFixed(2) + "</td>" //
            + "<td>" + certainityCorrect().toFixed(2) + "</td>" //these are loaded only once
            + "</tr>";

        for(var i = 1; i < LENGTH; i++)
        {
            html += "<tr>"
                    + "<td>" + loadedArray[i].value + "</td>"
                    + "<td>" + arrayOfAnswers[i] + "</td>"
                    + "<td>" + arrayOfLatency[i] + "ms" + "</td>"
                    + "<td>" + arrayOfHowSure[i] + "</td>"
                 + "</tr>";
        }

        html += "</table>";

        return html;
    }

    /**
     * function that calculates total number of correct answers
     * @returns {number}
     */
    function totalCorrect() {
        var correct = 0;

        for(var i = 0; i < LENGTH;i++)
        {
            if(loadedArray[i].value == arrayOfAnswers[i])
            {
                correct++;
            }
        }

        return correct;
    }

    /**
     * calculates the total number of incorect answers
     * @returns {number}
     */
    function totalIncorrect() {
        return LENGTH - totalCorrect();
    }

    /**
     * calculates the average of how certain user was
     * @returns {number}
     */
    function certainityAverage() {
        var sum = 0;

        for(var i = 0; i < LENGTH; i++)
        {
            sum += parseFloat(arrayOfHowSure[i]);
        }

        return sum/LENGTH;
    }

    /**
     * calculates average of how certain user was for correct answers
     * @returns {number}
     */
    function certainityCorrect() {
        var sum = 0;
        var correct = 0;

        for(var i = 0; i < LENGTH; i++)
        {
            if(loadedArray[i].value == arrayOfAnswers[i])
            {
                correct++;
                sum += parseFloat(arrayOfHowSure[i]);
            }
        }

        return sum/correct;
    }
});