const dialogs = [
    {
        body : "Jivoy Kameny."
    },
    {
        body : "Viberi personazha: (Freya / Mihail)",
        sources : [
            {
                aliases : ['freya'],
                modify : 'character',
                nextAction : {
                    body : 'Freya - naemnik, ona rabotaet v pare s Mihailom. Freya imeet otlichnuyu vrozhdennuyu lovkosty i skirtnosty'
                }
            },
            {
                aliases : ['mihail'],
                modify : 'character',
                nextAction : {
                    body : 'Mihail - naemnik, on rabotaet v pare s Freya. Mihail idealyno podhodit na roly tanka, tak kak on ocheny bolshoy i silniy'
                }
            }
        ]
    },
    {
        body : "Igra nachinaetsa..."
    }
];

class Application {
    constructor () {
        this.title        = "Jivoy Kameny : Glava I";
        this.version      = "0.1";
        this.author       = "Ilya Gursky";
        this.description  = "Small text-rpg written on JS specially for Vitalik228 streams.";
        this.app          = {
            userAnswer  : "",
            answerForId : "",
            actions     : [],
            character   : "",
            currentAction   : {},
            currentSources  : [],
            actionId        : 1
        };

        console.log('Application initialised. Use \'JivoyKameny.start()\' to start console version.');
    }

    actions () {
        const self = this;

        return {
            load ( dialogsList ) {
                dialogsList.forEach( dialog => this.pushAction(dialog) );

                return this;
            },
            pushAction ( action  = {} ) {
                action.id = 'jk-a-' + self.app.actionId;

                self.app.actionId += 1;

                if (!action.sources)
                {
                    action.body += " \n(nazhmi [ENTER], chtobi prodolzhity)";
                    action.sources = ['emptyMsg'];
                }

                self.app.actions.push(action);

                return this;
            },
            trigger () {
                if (self.app.actions.length > 0)
                {
                    self.app.currentAction = self.app.actions[0];
                    self.app.currentSources = self.app.currentAction.sources;

                    //output
                    console.log(self.app.currentAction.body);

                    //input
                    self.setAnswerFor(self.app.currentAction.id);
                }
            }
        }
    }

    setAnswerFor ( id = "" ) {
        this.app.answerForId = id;
    }

    start () {
        this.actions().load(dialogs).trigger();
    }

    checkUserAnswer () {
        const self = this;
        const validateAnswer = this.app.userAnswer.replace('/\s+/g', '').toLocaleLowerCase();
        let correctAnswer = false;

        if (this.app.currentSources[0] !== "emptyMsg")
        {
            this.app.currentSources.forEach( source => {
                if (source.aliases.indexOf(validateAnswer) !== -1)
                {
                    correctAnswer = true;

                    if (source.modify)
                    {
                        self.app.character = source.aliases[source.aliases.indexOf(validateAnswer)];
                    }

                    if (source.nextAction)
                    {
                        self.actions().pushAction(source.nextAction);
                        // pushing nextAction object to start of the array
                        self.app.actions.unshift(self.app.actions[self.app.actions.length - 1]);
                    }
                }
            } );

            if (this.app.userAnswer === "" || !correctAnswer)
            {
                return console.log('Invalid answer!');
            }
        }

        //delete current action after answer
        self.app.actions = self.app.actions.filter( el => el.id !== self.app.currentAction.id );

        this.actions().trigger();
    }

    answer ( string = "" ) {
        this.app.userAnswer = string;

        this.checkUserAnswer();
    }
}

window.JivoyKameny = new Application();