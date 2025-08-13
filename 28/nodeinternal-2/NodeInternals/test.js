
// process.nextTick(()=>{
//     console.log("nt") //1
// })

// Promise.resolve().then(() =>{
//     console.log("promise") //3
//     process.nextTick(()=>{ 
//         console.log("nt in promise") //5
//     })
// })

// process.nextTick(()=>{
//     console.log("nt2")//2
//     Promise.resolve().then(() =>{
//         console.log('promise in nt ') //4
//     })
//     setTimeout(()=>{
//         console.log('timeout')
//     }, 0)
// })
// "use strict"

// function s(){
//     console.log(this)
//     console.log(this === global)
//     console.log(this === module.exports)

// }
// s()

const fs = require("fs");

fs.readFile(__filename, () => {
    console.log("readFile 1"); // 6
});

setTimeout(() => console.log("setTimeout 1"), 0); // 3
process.nextTick(() => console.log("nextTick 1")); // 1
Promise.resolve().then(() => console.log("Promise")); // 2

//  io polling
setImmediate(() => {
    console.log("immidiate"); // 4
    setTimeout(() => console.log("setTimeout 3"), 0); // 5
});

