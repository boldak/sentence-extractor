let $ = require("./rules")
let _ = require("lodash-node")

let abbreviations = [
        "ім",
        "в",
        "о",
        "обл",
        "вул", 
        "просп",
        "бул",
        "пров",
        "пл",
        "г",
        "р",
        "див",
        "п",
        "с",
        "м"
    ]

    let monthAbbr = [
        "січ", 
        "лип",
        "лют",
        "серп",
        "берез",
        "верес",
        "квіт", 
        "жовт",
        "трав",
        "листоп",
        "черв",
        "груд"
    ]

    let labelRules = [
        {
            label:"whitespace",
            test: value => /[^a-zа-яёїіґє\`\'0-9]/gi.test(value)
        },
        {
            label:"endOfSubSentence",
            test: value => /[\,\-\:\;\.\!\?\n\(\)\[\]\{\}\"]/gi.test(value)
        },
        {
            label:"endOfSentence",
            test: value => /[\.\!\?\n]/gi.test(value)
        },
        
        {
            label:"punctuation",
            test: value => /[\,\-\:\;\.\!\?\(\)\[\]\"\n]/gi.test(value)
        },
        {
            label:"word",
            test: value => /[a-zа-яёїіґє\`]+/gi.test(value)
        },
        {
            label:"abbreviation",
            test: value => (abbreviations.indexOf(value)>=0) 
                || (monthAbbr.indexOf(value)>=0)
                ||  (
                        value.length >= 2 &&
                        /[a-zа-яёїіґє\`]+/gi.test(value) &&
                        value.toUpperCase() == value
                    ) 
            //^[A-ZА-ЯЁЇІҐЄ]{2,}/
        },

        {
            label:"withDot",
            test: value => (abbreviations.indexOf(value)>=0) || (monthAbbr.indexOf(value) >=0)
        },

        {
            label:"initial",
            test: value => (
                value.length == 1 &&
                /[a-zа-яёїіґє]+/gi.test(value) &&      
                value.toUpperCase() == value
            )
            //^[A-ZА-ЯЁЇІҐЄ]{1}$/
        },

        {
            label:"number",
            test: value => /[0-9]+/gi.test(value)
        },
        {
            label:"endOfParagraph",
            test: value => /[\n]+/gi.test(value)
        },
    
    ]

 
let hasEveryLabels = (...labels) => ( token => token.data && token.data.labels && labels.every(l => token.data.labels.indexOf(l)>=0))
let hasSomeLabels = (...labels) => ( token => token.data && token.data.labels && labels.some(l => token.data.labels.indexOf(l)>=0))

let notHasEveryLabels = (...labels) => ( token => token.data && token.data.labels && labels.every(l => token.data.labels.indexOf(l)<0))
let notHasSomeLabels = (...labels) => ( token => token.data && token.data.labels && labels.some(l => token.data.labels.indexOf(l)<0))


let hasLabels = token => token.data.labels 
let notHasLabels = token => !token.data.labels 

let hasSomeValues = (...values) => ( token => token.data && token.data.value && values.some(l => token.data.value == l))


let stage = s => (token => token.data && token.data.stage >= s)

let pos = p => (token => token._index == p)

let LABELS = 
	$(notHasLabels).then(token => {
		return {
			labels:  labelRules.filter( l => l.test(token.data)).map( l => l.label),
			value: token.data,
			stage: 1
		}
	})

let DOTTED_ABBR = 
    $.every(
		$.repeat(
			$.sequence(
				$(hasEveryLabels("abbreviation","withDot")),
				$( token => token.data.value == ".")
			).then(res => ({
				labels: res[0].data.labels,
				value: res[0].data.value+"."
			}))
		).then( res => ({
			labels: res[0].labels,
			value: res.map( r => r.value).join(""),
			stage:2
		})),
		$(stage(1))
	).then( res => res[0])


let FLOAT = 
    $.every(
        $.sequence(
            $.optional(
                $(hasEveryLabels("number"))
            ),
            $(token => ( token.data.value == "." || token.data.value == ",")),
            $(hasEveryLabels("number"))
        ).then(res => ({
            labels:["number"],
            value: res.filter(r => r).map(r => r.data.value).join(""),
            stage: 2
        })),
        $(stage(1))
    ).then( res => res[0])

let SIGNED = 
    $.every(
        $.sequence(
            $(hasSomeValues("+","-")),
            $(hasEveryLabels("number"))
        ).then( res => ({
            labels:["number"],
            value: res.filter(r => r).map(r => r.data.value).join(""),
            stage: 2
        })),
        $(stage(1))
    ).then(res => res[0])

let NN = 
    $.every(
        $.sequence(
            $(hasEveryLabels("number")),
            $(hasEveryLabels("number"))
        ).then( res => ({
            labels:["number"],
            value: res.map(r => r.data.value).join(""),
            stage: 3
        })),
        $(stage(2))
    ).then(res => res[0])

let PERCENTS = $.every(
        $.sequence(
            $(hasEveryLabels("number")),
            $(hasSomeValues("%"))
        ).then( res => ({
            labels:["number"],
            value: res.map(r => r.data.value).join("")
        })),
        $(stage(2))
    ).then(res => res[0])        

let NUMBERS = 
    $.some(
        FLOAT,
        SIGNED,
        NN,
        PERCENTS
    ) 


let DATE_NNN = 
    $.every(
        $.sequence(
            $(hasEveryLabels("number")),
            $(hasSomeValues("-",".","/")),
            $(hasEveryLabels("number")),
            $(hasSomeValues("-",".","/")),
            $(hasEveryLabels("number")),
        ).then( res =>({
            labels:["date"],
            value: res.filter(r => r).map(r => r.data.value).join(""),
            stage: 3
        })),
        $(stage(1))
    ).then( res => res[0])

let TIME_NNN =            	
    $.every(
        $.sequence(
            $(hasEveryLabels("number")),
            $(hasSomeValues(":")),
            $(hasEveryLabels("number")),
            $(hasSomeValues(":")),
            $(hasEveryLabels("number")),
        ).then( res =>({
            labels:["time"],
            value: res.filter(r => r).map(r => r.data.value).join(""),
            stage: 3
        })),
        $(stage(1))
    ).then( res => res[0])

let TIME_NN =              
    $.every(
        $.sequence(
            $(hasEveryLabels("number")),
            $(hasSomeValues(":")),
            $(hasEveryLabels("number")),
        ).then( res =>({
            labels:["time"],
            value: res.filter(r => r).map(r => r.data.value).join(""),
            stage: 3
        })),
        $(stage(1))
    ).then( res => res[0])

let COMPLEX_WORD = 
    $.every(
        $.sequence(
            $(hasSomeLabels("number","word")),
            $(hasSomeValues("-")),
            $(hasSomeLabels("word"))
        ).then( res => ({
            labels:["word","complex"],
            value: res.map( r => r.data.value).join("")
        })),
        $(stage(1))
    ).then( res => res[0])    


let TIME = $.some(
    TIME_NNN,
    TIME_NN
)

let DATE = $.some(
    DATE_NNN,
    TIME
)


let INITIAL = 
    $.every(
        $.repeat(
            $.sequence(
                $(hasEveryLabels("initial")),
                $(hasSomeValues("."))
            ).then( res => res[0].data.value + ".")
        ).then(res =>({
            labels:["initial"],
            value: res.join(""),
            stage:2
        })),
        $(stage(1))
    ).then( res => res[0])



let TEXT_START = 
    $.every(
        $.firstPos().then(res => [
        {
            labels:(res.data.labels || []).concat(["startOfText","startOfParagraph","startOfSentence","startOfSubSentence"]),
            value: res.data.value
        }
        ]),
        $(hasLabels),
        $(notHasEveryLabels("startOfText","startOfSentence","startOfSubSentence"))
    ).then(res => res[0])

let TEXT_STOP =  
    $.every(
        $.lastPos().then(res => [
        {
            labels:_.unique((res.data.labels || []).concat(["endOfSubSentence","endOfSentence","endOfParagraph","endOfText"])),
            value: res.data.value
        }
        ]),
        $(hasLabels),
        $(notHasSomeLabels("endOfText","endOfParagraph","endOfSentence","endOfSubSentence"))
    ).then(res => res[0])

let DOTTED_ABBR_EOSENTENCE = 
    $.every(
        $.sequence(
            $(hasEveryLabels("abbreviation","withDot")),
            $(hasSomeValues(" ")),
            $.every(
                $(notHasEveryLabels("abbreviation")),
                $(hasEveryLabels("word")),
                $(token => token.data.value == _.capitalize(token.data.value))
            ).then(res => res[0])
        ).then( res => [
            {
                labels: res[0].data.labels.concat(["endOfSubSentence","endOfSentence"]),
                value: res[0].data.value
            },
            res[1].data,
            res[2].data
        ]),
        $(stage(2))
    ).then( res => res[0])

let SUBSENTENCE_START = 
        $.sequence(
            $(hasEveryLabels("endOfSubSentence")),
            $(notHasEveryLabels("startOfSubSentence","endOfParagraph")),
        ).then( res => [
            res[0].data,
            {
                labels:res[1].data.labels.concat(["startOfSubSentence"]),
                value:res[1].data.value
            }
        ])

let SENTENCE_START = 
        $.sequence(
            $(hasEveryLabels("endOfSentence")),
            $(notHasEveryLabels("startOfSentence","endOfParagraph")),
        ).then( res => [
            res[0].data,
            {
                labels:res[1].data.labels.concat(["startOfSentence"]),
                value:res[1].data.value
            }
        ])

let PARAGRAPH_START = 
        $.sequence(
            $(hasEveryLabels("endOfParagraph")),
            $(notHasSomeLabels("startOfParagraph")),
        ).then( res => [
            res[0].data,
            {
                labels:res[1].data.labels.concat(["startOfParagraph"]),
                value:res[1].data.value
            }
        ])

let DUBLE_EOP = 
    $.sequence(
        $(hasEveryLabels("endOfSubSentence","endOfSentence")),
        $(hasEveryLabels("endOfSubSentence","endOfSentence","endOfParagraph"))
    ).then( res => [
        {
            labels:res[0].data.labels.filter(l => (l != "endOfSubSentence") && (l != "endOfSentence")),
            value:res[0].data.value
        },
        res[1].data
    ])

let SHIFT_EOSS = 
    $.sequence(
        $.every(
            $(hasSomeLabels("word","abbreviation")),
            $.not($(hasSomeLabels("endOfSubSentence")))
        ).then( res => {
           return res[0]
        }),
        $(hasEveryLabels("endOfSubSentence"))
    ).then(res => {
        return [
            {
                labels: res[0].data.labels.concat(["endOfSubSentence"]),
                value: res[0].data.value
            },
            {
                labels: res[1].data.labels.slice(res[1].data.labels.indexOf("endOfSubSentence"),1),
                value: res[1].data.value
            }
        ]
    })


module.exports = {
    tokens:[
        LABELS,
    	DOTTED_ABBR,
        DATE,
        NUMBERS,
        COMPLEX_WORD,
        INITIAL,
        DOTTED_ABBR_EOSENTENCE
    ],
    sentences:[
        TEXT_START,
        PARAGRAPH_START,
        SENTENCE_START,
        SUBSENTENCE_START,
        DUBLE_EOP,
        TEXT_STOP
    ]
}