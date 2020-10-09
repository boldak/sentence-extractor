
let _  =require("lodash-node")
let t = require("./raw_tokenizer_uk")
let parse = require("./parser")
let grammar = require("./grammar")


module.exports = sample => {
    
    sample = sample
        .split(/(\r\n)+|(\n)+/gm)
        .filter(l => l)
        .map( l => l.trim())
        .filter(l => l)
        .join("\n")
        .replace(/\s{2,}/gm, " ")
    

    let createStructure = tokens => {

        let text,p,s,ss

        let rules = {
            
            startOfText: item => { 
                text = {
                    type: "text",
                    childs:[]
                }
            },
            
            startOfParagraph: item => {
                p = {
                    type: "paragraph",
                    childs:[]
                }
            },
            
            startOfSentence: item => { 
                s = {
                    type: "sentence",
                    childs:[]
                }
                p.childs.push(s)
            },
            
            startOfSubSentence: item => { 
                ss = {
                    type: "subSentence",
                    childs:[]
                }
                s.childs.push(ss)  
            },
            
            word: item => {
                ss.childs.push({
                    type:"word",
                    value: item.value
                })
            },
                
            number: item => {
                ss.childs.push({
                    type:"number",
                    value: item.value
                })
            },

            date: item => {
                ss.childs.push({
                    type:"date",
                    value: item.value
                })
            },

            time: item => {
                ss.childs.push({
                    type:"time",
                    value: item.value
                })
            },
            
            endOfSubSentence: item => {
                ss.value = ss.childs.map( item => item.value).join("")
                if(ss.value.trim() == ""){
                    s.childs.splice(s.childs.length-1,1)
                    s.childs = s.childs.concat(ss.childs)
                }
            },

            endOfSentence: item => {
                s.value = s.childs.map( item => item.value).join("")
            },

            endOfParagraph: item => {
                p.value = p.childs.map( item => item.value).join("")
                text.childs.push(p)
            },

            endOfText: item => {
                text.value = text.childs.map( item => item.value).join("")
            },
            
            whitespace: item => {
                if(item.labels.indexOf("punctuation")>=0){
                    s.childs.push({
                        type:"punctuation",
                        value: item.value
                    })
                } else {
                    ss.childs.push({
                        type: "whitespace",
                        value: item.value
                    })  
                }
            }

        }


        tokens.forEach( token => {
            _.keys(rules).forEach( r => {
                if(token.labels.indexOf(r)>=0) {
                    rules[r](token)
                }   
            })
        })
        
        return text
    }
    
    return parse(t(sample), grammar.tokens)
            .then( tokens => parse(tokens, grammar.sentences))
            .then( tokens => createStructure(tokens))

}
