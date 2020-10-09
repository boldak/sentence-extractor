let _ = require("lodash-node")

class Rule {
	
	constructor(cb){
		this.cond = cb;
		this.thenCb = [d => d]
	}

	test(token){
		return this.cond(token)
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	scan(token){
		return (this.cond(token)) ? 1 : 0		
	}

	map(token){
		let res = token
		this.thenCb.forEach( cb => {
			let temp = cb(res) 
			res = (temp) ? temp : res
		})
		return res	
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}

class PosRule {
	
	constructor(cb){
		this.cond = cb;
		this.thenCb = [d => d]
	}

	test(token){
		return this.cond(token)
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	scan(token){
		return 0		
	}

	map(token){
		let res = token
		this.thenCb.forEach( cb => {
			let temp = cb(res) 
			res = (temp) ? temp : res
		})
		return res	
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}

class OptionalRule {

	constructor(rule){
		this.rule = rule;
		this.thenCb = [d => d]
	}

	test(){
		return true
	}

	scan(token){
		return (this.rule.test(token)) ? this.rule.scan(token) : 0
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	map(token){
		if( this.rule.test(token) ){
			let res = this.rule.map(token)
			this.thenCb.forEach( cb => {
				let temp = cb(res) 
				res = (temp) ? temp : res
			})
			return res	
		}
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}

}

class NotRule {
	
	constructor(rule){
		this.rule = rule;
		this.thenCb = [d => d]
		this.window = 0
	}

	test(token){
		return !this.rule.test(token) 
	}

	scan(token){
		return (this.test(token)) ? 1 : 0
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	map(token){
			let res = this.rule.map(token)
			this.thenCb.forEach( cb => {
				let temp = cb(res) 
				res = (temp) ? temp : res
			})
			// console.log(res)
			return res	
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}



class AnyRule {
	
	constructor(...rules){
		this.rules = rules[0]
		this.thenCb = [d => d]
	}

	test(token){
		return this.rules.map( r => r.test(token)).filter( r => r).length > 0
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	map(token){
		let r = _.find(this.rules, r => r.test(token))
		if (r) {
			let res = r.map(token)
			this.window = r.window || 1

			this.thenCb.forEach( cb => {
				let temp = cb(res) 
				res = (temp) ? temp : res
			})

			return res	
		}
		
	}

	scan(token){
		let r = _.find(this.rules, r => r.test(token))
		return (r) ? r.scan(token) : 0
	}

	apply(token){
		let r = _.find(this.rules, r => r.test(token))
		if (r) return this.map(token)
	}
}



class NextRule {
	
	constructor(rule){
		this.rule = rule
		this.thenCb = [d => d]
	}

	test(token){
		let d = token.next()
		if(d) return this.rule.test(d)
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	scan(token){
		let d = token.next()
		if(d) return this.rule.scan(d)
	}

	map(token){
		let d = token.next()
		
		if( d ) {
			let res = this.rule.map(d)
			this.thenCb.forEach( cb => {
				let temp = cb(res) 
				res = (temp) ? temp : res
			})
			return res
		}		
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}

class PrevRule {
	
	constructor(rule){
		this.rule = rule
		this.thenCb = [d => d]
	}

	test(token){
		let d = token.prev()
		if(d) return this.rule.test(d)
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	scan(token){
		let d = token.prev()
		if(d) return this.rule.scan(d)
	}

	map(token){
		let d = token.prev()
		
		if( d ) {
			let res = this.rule.map(d)
			this.thenCb.forEach( cb => {
				let temp = cb(res) 
				res = (temp) ? temp : res
			})
			return res
		}		
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}

class CursorRule {
	
	constructor(...rules){
		this.rules = rules[0]
		this.thenCb = [d => d]
	}

	test(token){
		let res = []
		let d = token
		
		this.rules.forEach(r => {
			if(d){
				let t = r.test(d)
				t = (t) ? t : false
				res.push(t)
				if(t) d = (d) ? d.atRight(r.scan(d)) : d
			} else {
				res.push(false)
			}
				
		})

		return res.filter( r => r).length  == this.rules.length
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	scan(token){
		let res = []
		let d = token
		let w = 0
		this.rules.forEach(r => {
			if(d){
				// console.log("--", w, "--", d.item.value)
				let t = r.test(d)
				t = (t) ? t : false
				res.push(t)
				if(t){
					w += r.scan(d)
					d = token.atRight(w)	
				} 		
			} else {
				res.push(false)
			}
				
		})
		// console.log(res)
		return w //(res.filter( r => r).length  == this.rules.length) ? w : 0
	}

	map(token){
		let res = []
		let d = token
		this.rules.forEach( r => {
			res.push((d) ? r.map(d) : null)
			d = (d) ? d.atRight(r.scan(d)) : d	
		})
		
		this.thenCb.forEach( cb => {
			let temp = cb(res) 
			res = (temp) ? temp : res
		})
		return res
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}


class RepeatRule {
	
	constructor(rule){
		this.rule = rule
		this.thenCb = [d => d]
	}

	test(token){
		let res = false
		let d = token
		while(d && this.rule.test(d)){
			res = true
			d = d.atRight(this.rule.scan(d))
		}
		return res
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	scan(token){
		let d = token
		let w = 0
		while(d && this.rule.test(d)){
			w += this.rule.scan(d)
			d = token.atRight(w)
		}
		return w
	}

	map(token){
		let res = []
		let d = token
		
		while(d && this.rule.test(d)){
			res.push(this.rule.map(d))
			d = d.atRight(this.rule.scan(d))
		}
		this.thenCb.forEach( cb => {
			let temp = cb(res) 
			res = (temp) ? temp : res
		})
		
		return res
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}

class AllRule {
	
	constructor(...rules){
		this.rules = rules[0]
		this.thenCb = [d => d]
	}

	test(token){
		return this.rules.map( r => r.test(token)).filter( r => r).length  == this.rules.length
	}

	then(cb){
		this.thenCb.push(cb)
		return this
	}

	map(token){
		let res = this.rules.map( r => r.map(token))
		this.thenCb.forEach( cb => {
			let temp = cb(res) 
			res = (temp) ? temp : res
		})
		return res
	}

	scan(token){
		return (this.test(token)) ? _.max(this.rules.map( r => r.scan(token))) : 0
	}

	apply(token){
		if (this.test(token)) return this.map(token)
	}
}

// class AnyData {
	
// 	constructor(rule){
// 		this.rule = rule
// 		this.thenCb = [d => d]
// 		this.window = 0
// 	}

// 	test(token){
// 		this.window = 0
// 		token = _.isArray(token) ? token : [token]
// 		return token.map( d => this.rule.test(d)).filter( d => d).length > 0
// 	}

// 	then(cb){
// 		this.thenCb.push(cb)
// 		return this
// 	}

// 	map(token){
// 		this.window = 1
// 		let res = this.rule.map(token)
// 		this.thenCb.forEach( cb => {
// 			let temp = cb(res) 
// 			res = (temp) ? temp : res
// 		})
// 		return res
// 	}

// 	apply(token){
// 		token = _.isArray(token) ? token : [token]
// 		let d = _.find( token, d => this.rule.test(d)) 	
// 		if (d) return this.map(d)
// 	}
// }

// class AllData {
	
// 	constructor(rule){
// 		this.rule = rule
// 		this.thenCb = [d => d]
// 		this.window = 0
// 	}

// 	test(token){
// 		this.window = 0
// 		token = _.isArray(token) ? token : [token]
// 		return token.map( d => this.rule.test(d)).filter( d => d).length  == token.length
// 	}

// 	then(cb){
// 		this.thenCb.push(cb)
// 		return this
// 	}

// 	map(token){
// 		this.window = 1
// 		let res = token.map( d => this.rule.map(d))
// 		this.thenCb.forEach( cb => {
// 			let temp = cb(res) 
// 			res = (temp) ? temp : res
// 		})
// 		return res
// 	}

// 	apply(token){
// 		token = _.isArray(token) ? token : [token]
// 		if (this.test(token)) return this.map(token)
// 	}
// }

let e = cb => new Rule(cb)
e = _.extend(e, {
	// "true": new Rule(token => true),
	
	"ignore": token => {
		token.skip = true
		return token
	},

	"skip": token => {
		token.skip = true
		return token
	},

	// "shift": new Rule(token => true),
	firstPos: () => new Rule(token => token._index == 0),
	lastPos: () => new Rule(token => token.scanner.last()._index == token._index),
	not: rule => new NotRule(rule),
	or: (...rules) => new AnyRule(rules),
	some: (...rules) => new AnyRule(rules),
	any: (...rules) => new AnyRule(rules),
	and: (...rules) => new AnyRule(rules),
	all: (...rules) => new AllRule(rules),
	every: (...rules) => new AllRule(rules),
	anyData: (rule) => new AnyData(rule),
	allData: (rule) => new AllData(rule),
	cursor: (...rules) => new CursorRule(rules),
	sequence: (...rules) => new CursorRule(rules),
	repeat: (rule) => new RepeatRule(rule),
	option: (rule) => new OptionalRule(rule),
	optional: (rule) => new OptionalRule(rule),
	next: (rule) => new NextRule(rule),
	prev: (rule) => new PrevRule(rule)

})

module.exports = e
