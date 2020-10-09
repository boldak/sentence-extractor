let _ = require("lodash-node")


/** Клас тега */
class Token {
	/**
     * Створює примірник тега. 
     * @param {int} index - Позиція в масиві.
     * @param {*} data - Значення тега.
     * @param {Scanner} scanner - Посилання на {@link Scanner}.
    */
	constructor(index, data, scanner){
		this._index = index
		this.data = data
		this.scanner = scanner
	}

	/**
     * Повертає тег ліворуч
     * @param {int}  count - зміщення.
     
     * @return {token} -  Примірник {@link token} ліворуч від поточного на {count} позиції.
    */
		
	atLeft(count){
		return this.scanner.atLeft(this, count)
	}	

	/**
     * Повертає тег праворуч
     * @param {int}  count - зміщення.
     
     * @return {token} -  Примірник {@link token} праворуч від поточного на {count} позиції.
    */
	
	atRight(count){
		return this.scanner.atRight(this, count)
	}

	/**
     * Повертає тег на вказаній позиції
     * @param {int}  pos - позиція.
     
     * @return {token} -  Примірник {@link token} на позиції {pos}.
    */

	atIndex(pos){
		return this.scanner.token(pos)	
	}		
	
	/**
     * Повертає наступний тег
     * @return {token} -  Примірник {@link token}.
    */

	next(token){ 
		return this.scanner.next(this)
	}	

	/**
     * Повертає попередній тег
     * @return {token} -  Примірник {@link token}.
    */

	prev(token){
		return this.scanner.prev(this)
	}	
	
	/**
     * Повертає масив тегів ліворуч
     * @param {int} count - Розмір вікна.
     * @return {token} -  Масив {@link token}.
    */
	
	arroundLeft(count){
		return this.scanner.arroundLeft(this, count)
	}
	
	/**
     * Повертає масив тегів праворуч
     * @param {int} count - Розмір вікна.
     * @return {token} -  Масив {@link token}.
    */
	
	arroundRight(count){
		return this.scanner.arroundRight(this, count)
	}

	/**
     * Повертає масив тегів навколо
     * @param {int} count - Розмір вікна.
     * @return {token} -  Масив {@link token}.
    */
	
	arround(count){
		return this.scanner.arround(this, count)
	}

}

/** Клас сканера */
class Scanner {
	/**
     * Створює примірник сканера. 
     * @param {Array.<*>} tokens - Вхідний масив тегів.
    */
	constructor(tokens){
		tokens = tokens || []
		tokens = _.isArray(tokens) ? tokens : [tokens]
		this.tokens = tokens.map( (t, index) => new Token(index, t, this))
	}

	/**
     * Повертає тег 
     * @param {int}  - Порядковий номер тега в масиві (індекс).
     * @return {token} -  Примірник {@link token}.
    */

	token(pos){
		pos = pos || 0
		return this.tokens[pos]
	}
	
	/**
     * Повертає перший тег масива 
     * @return {token} -  Примірник {@link token}.
    */
	
	first(){
		return (this.tokens.length > 0) ? this.token(0) : null
	}

	/**
     * Повертає останній тег масива 
     * @return {token} -  Примірник {@link token}.
    */
	
	last(){
		return (this.tokens.length > 0) ? this.token(this.tokens.length-1) : null
	}

	/**
     * Повертає тег ліворуч від поточного тега
     * @param {token} token - поточний {@link token}.
     * @param {int}  count - зміщення.
     
     * @return {token} -  Примірник {@link token} ліворуч від поточного на {count} позиції.
    */
	
	atLeft(token, count){
		return ((token._index - count) < 0 ) ? null : this.tokens[token._index - count]
	}	

	/**
     * Повертає тег праворуч від поточного тега
     * @param {token} token - поточний {@link token}.
     * @param {int}  count - зміщення.
     
     * @return {token} -  Примірник {@link token} праворуч від поточного на {count} позиції.
    */
	
	atRight(token, count){
		return ((token._index + count) > this.tokens.length - 1 ) ? null : this.tokens[token._index + count]
	}		
	
	/**
     * Повертає наступний від поточного тег
     * @param {token} token - поточний {@link token}.
     
     * @return {token} -  Примірник {@link token}, наступний за поточним.
    */
	
	next(token){ 
		return this.atRight(token, 1)
	}	

	/**
     * Повертає попередній від поточного тег
     * @param {token} token - поточний {@link token}.
     
     * @return {token} -  Примірник {@link token}, попередній від поточного.
    */

	prev(token){
		return this.atLeft(token, 1)
	}	
	
	/**
     * Повертає масив тегів ліворуч від поточного
     * @param {token} token - поточний {@link token}.
     * @param {int} count - Розмір вікна.
     * @return {token} -  Масив {@link token}, ліворуч від поточного.
    */
	
	arroundLeft(token, count){
		let start = token._index - count
		start = (start < 0 ) ? 0 : start
		return _.slice(this.tokens, start, token._index)
	}
	
	/**
     * Повертає масив тегів праворуч від поточного
     * @param {token} token - поточний {@link token}.
     * @param {int} count - Розмір вікна.
     * @return {token} -  Масив {@link token}, праворуч від поточного.
    */
	arroundRight(token, count){
		let stop = token._index + count + 1
		stop = (stop > this.tokens.length + 1 ) ? this.tokens.length + 1 : stop
		return _.slice(this.tokens, token._index+1, stop)
	}

	/**
     * Повертає масив тегів навколо від поточного
     * @param {token} token - поточний {@link token}.
     * @param {int} count - Розмір вікна.
     * @return {token} -  Масив {@link token}, навколо від поточного.
    */

	arround(token, count){
		return _.flatten([this.arroundLeft(token, count), this.arroundRight(token, count)])
	} 

}

/**
 * Сканер масиву тегів.
 * Забезпечує двосторонню навігацію в масиві тегів
 * @module scanner
 */

/**
 * Повертає примірник {@link Scanner}.
 * @param {Array.<*>} tokens - Вхідний масив тегів.
 * @return {Scanner} примірник {@link Scanner}
*/

module.exports = tokens => {
	return new Scanner(tokens)
}	

