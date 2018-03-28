var Alexa = require('alexa-sdk');
const APP_ID = undefined;

const SKILL_NAME = "task list";
const HELP_MESSAGE = "You can say give me task list, or you can say add item to task list. What can I help you with";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = 'Goodbye!';

var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "Tarski",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN[0],
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
};

const toDoList = [
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'addItem': function() {
        var add = this.event.request.intent.slots.item.value;
        toDoList.push(add);
        var speechOutput = add + ' has been added to tarski.';
        this.emit(':tellWithCard', speechOutput);
    },
    'listItems': function() {
        var speechOutput = 'You have ' + toDoList.length + ' items:';
        for(var i = 0; i < toDoList.length;i++) {
            speechOutput += '\n' + (i+1).toString() + '. ' + toDoList[i] + '.';
        }
        
        this.emit(':tellWithCard', speechOutput);
    },
    'removeItem': function() {
        this.response.speak('test');
        this.emit(':responseReady');
    },
    'topItems': function() {
        var num = this.event.request.intent.slots.num.value;
        if (num > toDoList.length) {
            var speechOutput = 'Sorry, there are only ' + toDoList.length + 'items.';
            this.emit(':tellWithCard', speechOutput, 'How many items do you want?', this.t('SKILL_NAME'),);

        }
        var speechOutput = 'Here are ' + num.toString() + ' items: ';
        for (var i = 0; i < num; i++) {
            speechOutput += (i+1).toString() +'. ' + toDoList[i] + '.';
        }
        this.emit(':tellWithCard', speechOutput);
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