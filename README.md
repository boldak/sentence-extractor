# sentence-extractor
Rule based sentence extraction from text

## How to install
```
npm i --save boldak/sentence-extractor
```

## How to
### Tokenize text
```js
console.log(
	JSON.stringify(
		require("sentence-extractor")
			.tokenize(
		`Юрист зазначив, що 9-11 серпня в Білорусі вперше були застосовані деякі види озброєння і спецтехніки. 
Тільки в Мінську за перші 3 дні після виборів за медичною допомогою звернулися понад 1200 осіб.`
			)
	)
)
```
The result of tokenizing is shown below
```json
["Юрист"," ","зазначив",","," ","що"," ","9","-","11"," ","серпня"," ","в"," ","Білорусі"," ","вперше"," ","були"," ","застосовані"," ","деякі"," ","види"," ","озброєння"," ","і"," ","спецтехніки","."," ","\n","Тільки"," ","в"," ","Мінську"," ","за"," ","перші"," ","3"," ","дні"," ","після"," ","виборів"," ","за"," ","медичною"," ","допомогою"," ","звернулися"," ","понад"," ","1200"," ","осіб","."]
```
### Extract sentences
```js
let extractSentences = require("sentence-extractor").extractSentences

let ukText = `Юрист зазначив, що 9-11 серпня в Білорусі вперше були застосовані деякі види озброєння і спецтехніки. 
Тільки в Мінську за перші 3 дні після виборів за медичною допомогою звернулися понад 1200 осіб.`

extractSentences(ukText)
    .then( res => {
        console.log(JSON.stringify(res, null," "))
    })
    .catch( e => {
        console.error(e.toString())
    })

```

The result of extracting sentences in 4 nesting levels is shown below
```json
{
 "type": "text",
 "childs": [
  {
   "type": "paragraph",
   "childs": [
    {
     "type": "sentence",
     "childs": [
      {
       "type": "subSentence",
       "childs": [
        {
         "type": "word",
         "value": "Юрист"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "зазначив"
        }
       ],
       "value": "Юрист зазначив"
      },
      {
       "type": "punctuation",
       "value": ","
      },
      {
       "type": "subSentence",
       "childs": [
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "що"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "number",
         "value": "9"
        },
        {
         "type": "number",
         "value": "-11"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "серпня"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "в"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "Білорусі"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "вперше"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "були"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "застосовані"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "деякі"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "види"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "озброєння"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "і"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "спецтехніки"
        }
       ],
       "value": " що 9-11 серпня в Білорусі вперше були застосовані деякі види озброєння і спецтехніки"
      },
      {
       "type": "punctuation",
       "value": "."
      },
      {
       "type": "punctuation",
       "value": "\n"
      }
     ],
     "value": "Юрист зазначив, що 9-11 серпня в Білорусі вперше були застосовані деякі види озброєння і спецтехніки."
    }
   ],
   "value": "Юрист зазначив, що 9-11 серпня в Білорусі вперше були застосовані деякі види озброєння і спецтехніки."
  },
  {
   "type": "paragraph",
   "childs": [
    {
     "type": "sentence",
     "childs": [
      {
       "type": "subSentence",
       "childs": [
        {
         "type": "word",
         "value": "Тільки"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "в"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "Мінську"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "за"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "перші"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "number",
         "value": "3"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "дні"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "після"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "виборів"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "за"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "медичною"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "допомогою"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "звернулися"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "понад"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "number",
         "value": "1200"
        },
        {
         "type": "whitespace",
         "value": " "
        },
        {
         "type": "word",
         "value": "осіб"
        }
       ],
       "value": "Тільки в Мінську за перші 3 дні після виборів за медичною допомогою звернулися понад 1200 осіб"
      },
      {
       "type": "punctuation",
       "value": "."
      }
     ],
     "value": "Тільки в Мінську за перші 3 дні після виборів за медичною допомогою звернулися понад 1200 осіб"
    }
   ],
   "value": "Тільки в Мінську за перші 3 дні після виборів за медичною допомогою звернулися понад 1200 осіб"
  }
 ],
 "value": "Юрист зазначив, що 9-11 серпня в Білорусі вперше були застосовані деякі види озброєння і спецтехніки.Тільки в Мінську за перші 3 дні після виборів за медичною допомогою звернулися понад 1200 осіб"
}

``` 

## TODOs
- Add dictionaries of dot terminated abbreviations for russian and english.
- Add ```lang``` argument in sentences extraction
