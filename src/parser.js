let cursor = require("./scanner")
let _ = require("lodash-node")
  		
let parse = (data, grammar) => {
				
	let result = []
	let current = cursor(data).first()
	let changed = false

	while (current) {
		let res = grammar.map( r => r.apply(current))
		let shift = 0
	
		let rIndex = _.findIndex(res, d => d)

		if( rIndex >= 0 ) {
			changed = true
			shift = grammar[rIndex].scan(current) //_.max(grammar.map( r => r.window || 1)) 
			if( !res[rIndex].skip ) result = result.concat((_.isArray(res[rIndex])) ? res[rIndex] : [res[rIndex]]) 
		} else {
			result.push(current.data)
		}	 

		shift = (shift) ? shift : 1
		current = current.atRight(shift)
		
	}
	
	return {
		nextIteration: changed,
		data: result
	}
}


/**
 * Парсер текстів на українській мові.
 * Перетворює вхідний масив тегів у вихідний масив тегів з використанням граматичних правил.
 * @module parser
 */

/**
 * Повертає масив тегів, отриманих в результаті перетворення на основі граматичних правил.
 
 * @param {Array.<*>} data - Вхідний масив тегів.
 * @param {Array.<Rule>} grammar - Граматика (масив правил).
 
 * @return {Promise} Проміс, який буде повертати масив тегів.

 * @exception {ParserException} "Iteration limit unbounded", якщо кількість ітерацій перевищує довжину вхідного масиву тегів
 */

module.exports = (data, grammar) => ( new Promise (( resolve, reject ) => 

	{
		
		let limit = data.length
		let parsed = {
	  			nextIteration: true,
	  			data
	  	};
	  	let i = 0
	  	while(parsed.nextIteration && i <= limit) { 
	  		i++
	  		parsed = parse(parsed.data, grammar)
	  	}
	  	if(i <= limit){
	  		resolve(parsed.data)	
	  	} else {
	  		reject("Iteration limit unbounded")
	  	}

	}))  		


  		