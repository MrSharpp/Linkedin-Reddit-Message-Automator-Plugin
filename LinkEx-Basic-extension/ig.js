function delayy(val) {
    // if (!val) val = 1000;
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(true);
        }, val);
    })
}

const addNSecondsDelay = (n) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, n * 1000);
  });
}

function checkCap(activityName) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: CHECK_CAP, activityName }, hit => {
            resolve(hit);
        })
    })
}


let initCount = 2000;
setTimeout(() => {
    // getUserId();
    initCount += initCount;
}, initCount)


let _url = window.location.href;
console.log(_url)




// if(_url.search("instagram.com/direct/inbox") > -1 && _url.search("#startinbox") > -1){

window.onload = function exampleFunction() {
  
    if(_url.search("startinbox") > -1){

    }
    else if (_url.search("") > -1) {
        
    }else if(_url.search("") > -1){

    }else if(_url.search("") > -1){
        
    }else if(_url.search("") > -1){
     
    }

    if(_url.search("") > -1){

        
    }
    if(_url.search("") > -1){


        
    }



}



   
   
}


