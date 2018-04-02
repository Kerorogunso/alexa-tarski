var Alexa = require('alexa-sdk');
const APP_ID = undefined;

const SKILL_NAME = "task list";
const HELP_MESSAGE = "You can say give me task list, or you can say add item to task list. What can I help you with";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = 'Goodbye!';

var toDoList = ["lemon", "potato"];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    // Add an item to the task list
    'addItem': function() {
        var add = this.event.request.intent.slots.item.value;
        toDoList.push(add);
        var speechOutput = add + ' has been added.';
        this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
    },
    // See how many items are on the task list
    'howMany' : function() {
        if (toDoList.length == 1) {
            var speechOutput = 'You have 1 item.';
        } else {
            var speechOutput = 'You have ' + (toDoList.length).toString() + ' items.';
        }
        this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
    },
    // Clear all items on the task list
    'clearList': function() {
        toDoList = [];
        var speechOutput = 'Your task list is now empty.';
        this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
    },
    // Delete the closest matching item based on the number of word matches
    'removeItem': function() {
        var speechInput = this.event.request.intent.slots.item.value;
        var inputWords = speechInput.split(" ");
    
        var intersection = [];
        for (var i = 0;i < toDoList.length; i++) {
            var itemWords = toDoList[i].split(" ");
            var intersect = itemWords.filter(function(n){return inputWords.indexOf(n) !== -1;});
            intersection.push([i, intersect.length]);
        }
        
        // If no items with those words exist.
        if (intersection == []){
            var speechOutput = 'This item doesn\'t exist.';
            this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
        } else {
            // Initialize first item as candidate for deletion
            var best_index = 0;
            var best_match = intersection[0][1];
            
            // Look for better matches
            for(var j = 0; j < intersection.length; j++) {
                if (intersection[j][1] > best_match) {
                    // Replace the best index with the better match
                    best_index = j;
                    best_match = intersection[j][1]; 
                }  
            }        
            // Remove item and notify the user
            var speechOutput = toDoList[best_index] + ' has been removed.';
            toDoList.splice(best_index, 1);
            this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
        }
    },
    // Retrieve top n items from the list
    'topItems': function() {
        var num = this.event.request.intent.slots.num.value;
        if (num > toDoList.length) {
            if (num==1){
                var speechOutput = 'Sorry, there is only 1 item.';
                this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
            } else {
                var speechOutput = 'Sorry, there are only ' + toDoList.length + ' items.';
                this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
            }
        }
        var speechOutput = 'Here are ' + num.toString() + ' items: ';
        for (var i = 0; i < num; i++) {
            speechOutput += (i+1).toString() +'. ' + toDoList[i] + '. ';
        }
        this.emit(':tellWithCard', speechOutput, 'Feedback', speechOutput);
    },
    'AMAZON.HelpIntent': function() {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    }
};