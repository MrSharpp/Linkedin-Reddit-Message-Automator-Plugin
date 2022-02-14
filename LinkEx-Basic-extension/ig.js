var posts;
var users;
var i = 0;
var f = 0;
var alreadyMessaged = [];
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:3000/stats", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
var cookiAuth;
var msg;
var Estatus = false;
var linkedInCount = 0;
var redditCount = 0;
var extensionId;

xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(xhr.responseText)
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.linkcount) linkedInCount = request.linkcount
        if(request.extensionId) extensionId=request.extensionId
        if (request.cookie) cookiAuth = request.cookie;
        if(request.msg) msg = request.msg;
        if(request.status == "start") {
            Estatus = true;
            exampleFunction()
        }
        if(request.status == "stop") Estatus = false;
        return true;
});


async function exampleFunction() {
  
    if(!cookiAuth) console.error("Cooki Not Set")
    let _url = window.location.href;
    xhr.setRequestHeader("authorization", "JWT "+cookiAuth, true);
    if(_url.search("commentPlu") > -1){
        const posts = document.getElementsByClassName('_1oQyIsiPHYt6nx7VOmd1sz')
        for(var n = i; n < posts.length; n++){
            i++;
            posts[n].click()
            await sleep(3000);
            const users = document.getElementsByClassName('wM6scouPXXsFDSZmZPHRo')
            var apiCount = 1;
            for(var k = f; k < users.length;k++){
                apiCount--;
                if(apiCount < 1) {
                    sendToApi("dms=1")
                    apiCount = 3;
                }
                if(alreadyMessaged.includes(users[k].text)) continue;
                alreadyMessaged.push(users[k].text);
                f++;
                users[k].click()
                await sleep(2000);
                const chat = document.getElementsByClassName('_2q1wcTx60QKM_bQ1Maev7b')
                chat[1].click()
                await sleep(5000);
                setKeywordText(msg)
                document.getElementsByClassName('_3QHhpmOrsIj9Hy8FecxWKa')[9].click()
            }

        }
    }
    else if (_url.search("keywords") > -1) {
            startLinkedIn(msg)

    }
}

async function startLinkedIn(msg){
    await SendMessagesToLinkedInUsers(msg)

    if(linkedInCount < 15) {
        if(Estatus)  window.scrollTo(0,document.body.scrollHeight);
        await sleep(500)
        if(Estatus) document.getElementsByClassName('artdeco-pagination__button artdeco-pagination__button--next artdeco-button artdeco-button--muted artdeco-button--icon-right artdeco-button--1 artdeco-button--tertiary ember-view')[0].click()
        startLinkedIn(msg)
    }
    
}

function sendToApi(data){
    xhr.send(data);
}

function setKeywordText(text) {
    var el =  document.getElementsByClassName('_24sbNUBZcOO5r5rr66_bs4')[0]
    el.value = text;
    var evt= new Event('focus');
    el.dispatchEvent(evt);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateLimit(){
    await chrome.runtime.sendMessage({
        linkcount: linkedInCount
    });
    console.log("MSG SENT")
}

async function SendMessagesToLinkedInUsers(msg){
    if(!Estatus) return;
    var users = document.getElementsByClassName('entity-result__actions entity-result__divider')
    for(var n = 0; n < users.length;n++){
        if(!Estatus) break;
        if(linkedInCount > 14) return;
        try{
            if(users[n].children[0].innerText == "Follow") continue;
      
        var id = users[n].children[0].attributes.id.value
        console.log(id)
        document.getElementById(id).click()
        }catch(error){
            continue;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/stats", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader("authorization", "JWT "+cookiAuth, true);
        xhr.send("dms=1");
        // users[n].children[0].click() 
        try{
        await sleep(1000)
        document.getElementsByClassName('artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--secondary ember-view mr1')[0].click()
        await sleep(1000)
        document.getElementsByClassName('ember-text-area ember-view connect-button-send-invite__custom-message mb3')[0].value = msg
        await sleep(1000)
        var sendButton =  document.getElementsByClassName('artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml1')[0]
        var evt= new Event('click');
        sendButton.dispatchEvent(evt)
        await sleep(1000)
        }catch(err){
            console.log(err)
        }   
        linkedInCount++;
        await sleep(1000)
        updateLimit();
    }

}


