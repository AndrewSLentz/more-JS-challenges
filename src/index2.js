// utility for logging
if(!log)
    var log = function(){ console.log([].slice.call(arguments)) }

var FILL_ME_IN

// predefined variables
var whatIsThis = function(a, b) {
    return [this, a, b].join(',')
}

var inAnObject = {
    name: 'inAnObject',
    test1: whatIsThis,
    anotherObject: {
        name: 'anotherObject',
        test2: whatIsThis
    }
}

var inAFunction = function(a, b) {
    this.name = 'Sally'
    whatIsThis(a, b)
}

inAFunction.prototype.test3 = whatIsThis

var trickyTricky = {
    name: 'trickyTricky',
    why: 'does this work?',
    what: 'is going on here?'
}

var confusing = {
    name: 'confusing',
    state: 'Alaska',
    city: 'Anchorage'
}

/**
 * THE PROBLEMS
 */
console.assert(whatIsThis('hello', 'world') === '[object Window],hello,world')
// this is so because the function returns 'this' (which in the global scope is window), followed by the two arguments fed to it, joined by commas.

console.assert(window.whatIsThis('hello', 'world') === '[object Window],hello,world')
// Same as above but with scope implicitly defined as global rather than by default.

console.assert(inAnObject.test1('face', 'book') === '[object Object],face,book')
// calls what is this function explained above but from within the scope of an object, changing 'this' to refer to the object it's housed in.

console.assert(inAnObject.anotherObject.test2('twitter', 'book') === '[object Object],twitter,book')
// calls the function whatIsThis from where it's housed as the value for key "test2", making the 'this' it returns object Object and the rest of the function running as usual

console.assert(whatIsThis.call() === '[object Window],,')
// calls what is this in the global scope, but with no arguments to put between the commas.

console.assert(whatIsThis.call(trickyTricky) === '[object Object],,')
// calls whatIsThis in the scope of trickyTricky which is an object, but call takes comma separated arguments, no objects or arrays so it runs it in the scope with no arguments.

console.assert(whatIsThis.call(trickyTricky, 'nice', 'job') === '[object Object],nice,job')
// same as above but with arguments passed in.

console.assert(whatIsThis.call(confusing) === '[object Object],,')
// calls whatIsThis in the scope of confusing which is an object, but passes in no arguments to put between the commas.

console.assert(whatIsThis.call(confusing, 'hello') === '[object Object],hello,')
// calls whatIsThis in the scope of confusing which is an object, but with only one argument so nothing to put after the second comma.

console.assert(whatIsThis.apply(trickyTricky) === '[object Object],,')
// applies function whatIsThis to object trickyTricky, changing the scope it runs in, but with no arguments.

console.assert(whatIsThis.apply(confusing, ['nice', 'job']) === '[object Object],nice,job')
// same as above but with arguments passed in as an array, which is the syntax for feeding arguments to something called with .apply

//console.assert(whatIsThis.apply(confusing, 'nice', 'job') === uncaught type error)
// throws error because arguments should be fed to apply in an array. This way it thinks you are trying to run the function on the strings 'nice' and 'job' which doesn't work.

var inAFun = new inAFunction();

console.assert(inAFun.test3('what will', 'happen?') === '[object Object],what will,happen?')
// I am not sure why the scope is object here. Maybe because it's a new instance of a constructor?

try{
    console.assert(inAFun.test3('A', 'B') === '[object Object],A,B')
} catch(e){
    log(e)
}
// I have no idea what try and catch do.

var newObject = new inAFunction('what will', 'happen?')
console.assert(newObject.name === 'Sally')
// made a new object from a constructor that automatically gives instances of it a value of 'Sally' for key name.

var newObject2 = new inAFunction('what will', 'happen?')
console.assert(newObject2.test3('C', 'D') === '[object Object],C,D')
// creates object that is a new instance of a constructor that contains function whatIsThis and runs it in the scope of that new object

console.assert(inAnObject.test1.call(trickyTricky, 'face', 'book') === '[object Object],face,book')
// calls function whatIsThis using .call from where it is stored in key test1 of object and explicitly defines this as the object it's run from, then runs as usual.

console.assert(inAnObject.anotherObject.test2.apply(confusing, ['foo', 'bar']) === '[object Object],foo,bar')
// calls function whatIsThis using .apply from it's location in key test2 in object anotherObject inside object inAnObject and feeds it arguments in an array as one does with .apply.
