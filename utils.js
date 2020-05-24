//stop the program fetching from the API until after typing has stopped
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId){
          clearTimeout(timeoutId);
      }
       timeoutId= setTimeout(() => {
          func.apply(null, args);
        }, delay)
  
    }
  };