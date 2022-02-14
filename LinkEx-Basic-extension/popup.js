let selectedQueries = new Set();
let totalNum = 0;
var cookieAuth;

// var popupWindow = window.open(
//     chrome.extension.getURL("popup.html"),
//     "exampleName",
//     "width=400,height=400"
// );




chrome.tabs.onUpdated.addListener(function (tabId , info) {
    if (info.status === 'complete') {
        var hi = document.getElementsByClassName('_3TG57N4WQtubLLo8SbAXVF');
        console.log(hi[0])
    }
  });




document.addEventListener('DOMContentLoaded', async function(){
    document.getElementById('a1').children[0].click()
    await chrome.cookies.get({"url":"http://localhost:3000", "name":"auth"},(abc) => {
        if(!abc) {
            $("#loggedInSection").hide()
            $("#loggedOutSection").show()
        }else{
            chrome.storage.sync.set({"cookieAuth": abc.value }, function() {
                console.log("Auth cookie Set");
              });
                cookieAuth = abc.value 
                $("#loggedInSection").show()
                $("#loggedOutSection").hide()
                chrome.storage.sync.get(['linkcount', 'linkDate'], (req) => {
                    var linkcount;
                    linkcount=req
                    var date = req.linkDate || +new Date();
                    if(Object.keys(linkcount).length == 0) {
                        chrome.storage.sync.set({"linkcount": 0,"linkDate": +new Date() })
                        linkcount = 0;
                    }
                    const oneday = 60 * 60 * 24 * 1000
                    var nowDate = +new Date() + oneday
                    if((nowDate - date) > oneday){
                        chrome.storage.sync.set({"linkcount": 0,"linkDate": +new Date() })
                    }
                    if(linkcount.linkcount > 4) $("#startLin").attr('disabled','true')
                    $("#limitL").html(linkcount.linkcount +"/5")
                });
            }
        })
});


  $("#loginButton").click(() => {
    chrome.tabs.update({url: "http://localhost:3000" })

});

$(".follow").click(function(){

})


$(".all").click(function(){

})

chrome.runtime.sendMessage({type: GET_TEMP_COMMENT}, (res)=>{
})

chrome.runtime.sendMessage({type: GET_MESSAGE}, (res)=>{
})

chrome.storage.local.get(FOLLOW_IDS_KEY, (res)=>{

})



function getToday() {
}

function newActivity() {
    return {
        follows: 0,
        messages: 0,
        tweets: 0,
        date: getToday()
    }
}


chrome.storage.local.get(['userIds'], function(result) {
     console.log(result)
});

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}

//usage:

//usage:



chrome.storage.sync.get(ACTIVITY_TRACK, (resp) => {
})



$(document).on("click", ".queries .button", function(){

})

$("#msg").click(function(){
    
})

$("#redditButton").click(() => {
    if(!$("#categoryR").val() && !$("#promotionMsgR").val()) return alert("Enter The Sub Reddit username and promotional Message")
    chrome.tabs.update({url: "https://www.reddit.com/r/"+$("#categoryR").val()+"?commentPlu=1&auth="+cookieAuth+"&msg="+$("#promotionMsgR").val() })
})

// The ID of the extension we want to talk to.
var editorExtensionId = chrome.runtime.id;
var category;
var prommotionalMsg;

$("#linkedInButton").click( async function() {
    category = $("#categoryL").val();
    prommotionalMsg = $("#promotionMsgL").val();
    if(!category && !prommotionalMsg) return alert("Enter The Company Category and promotional Message")
    chrome.tabs.update({url: "https://www.linkedin.com/search/results/people/?keywords="+$("#categoryL").val()+"&title=manager"})
})

var automationStart = false;

$("#startLin").click(() => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        console.log("URL:"+tabs)
        let url = new URL(tabs[0].url);
        if(url.hostname != "www.linkedin.com") return alert("Load Linked First")
        if(!automationStart) sendToContent({cookie: cookieAuth, extensionId: chrome.runtime.id, msg:$("#promotionMsgL").val(), status: "start", linkcount:$("#limitL").html().split('/')[0]})
        else sendToContent({cookie: cookieAuth, extensionId: chrome.runtime.id, msg:$("#promotionMsgL").val(), status: "stop"})
        automationStart = !automationStart;
    });
    if(automationStart) $(".startButtonLinkedIn").html("Start Bot")
    if(!automationStart) $(".startButtonLinkedIn").html("Stop Bot")
})


    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log("MESSAGE CAME")
            chrome.storage.sync.set({linkcount: request.linkcount}, () => {
                $("#limitL").html(request.linkcount+'/5')
                if(request.linkcount > 4)  {
                    $("#startLin").attr('disabled','true')
                }
            sendResponse('{}')
            return true;
            });
            
        });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendToContent(msg){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
            if(response)alert(response.farewell);
        });
    });
}

function reddit(){
    alert("#")
}

function openTab(){
        let redditLink = "https://www.reddit.com/r/SocialMediaMarketing" 
        chrome.tabs.create ({url: redditLink, 
        selected: true});
};

$(".comment").click(function(){

})

$("[ref-tab]").click(function(e){
    let target =  $(e.target).parent();
    let ref = target.attr("ref-tab");
    $("[ref-tab]").removeClass("is-active");
    target.addClass("is-active");
    $(".tab-item").hide();
    $(`#${ref}`).show();
})



// document.getElementsByClassName('follow-use')[0].innerText = localStorage.getItem('userIds')+'/150';