const promise = new Promise((resolve, reject) => {
  resolve(123);
});
promise.then((res) => {
  console.log('I get called:', res === 123); // Devuelve: true
});
promise.then(()=>{
  console.log('otra promesa')
})
promise.catch((err) => {
  // Nuca es utilizado
});