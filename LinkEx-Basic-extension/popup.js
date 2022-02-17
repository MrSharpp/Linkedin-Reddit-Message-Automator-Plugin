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

  function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}





document.addEventListener('DOMContentLoaded', async function(){
    document.getElementById('a1').children[0].click()
    await chrome.cookies.get({"url":"http://localhost:3000", "name":"auth"},(abc) => {
        if(!abc) {
            $("#loggedInSection").hide()
            $("#loggedOutSection").show()
        }else{
            cookieAuth = abc.value
                $("#loggedInSection").show()
                $("#loggedOutSection").hide()
                return;
            }
                chrome.storage.sync.get(['redCount', 'linCount' ], (req) => {
                    var redCount = req.redCount;
                    var linCount = req.linCount;
                    if(!redCount && !linCount){
                        chrome.storage.sync.set({"redCount": 0, "linCount":0})
                        redCount = 0;
                        linCount = 0;
                    }
                    $("#redCount").html(redCount)
                    $("#linCount").html(linCount)

                })

                chrome.storage.sync.get(['linkcount', 'linkDate'], (req) => {
                    var linkcount;
                    linkcount=req.linkcount
                    var date = req.linkDate || +new Date();
                    if(!linkcount) {
                        chrome.storage.sync.set({"linkcount": 0,"linkDate": +new Date() })
                        linkcount = 0;
                    }
                    const oneday = 60 * 60 * 24 * 1000
                    var nowDate = +new Date()
                    if((nowDate - date) > oneday){
                        chrome.storage.sync.set({"linkcount": 0,"linkDate": +new Date() })
                    }
                    if(linkcount > 4) $("#startLin").attr('disabled','true')
                    $("#limitL").html(linkcount +"/15")
                });

                chrome.storage.sync.get(['redditCount', 'redditDate'], (req) => {
                    var redditCount;
                    redditCount=req.redditCount
                    var date = req.redditDate || +new Date();
                    if(!redditCount) {
                        chrome.storage.sync.set({"redditCount": 0,"redditDate": +new Date() })
                        redditCount = 0;
                    }
                    const oneday = 60 * 60 * 24 * 1000
                    var nowDate = +new Date()
                    if((nowDate - date) > oneday){
                        chrome.storage.sync.set({"redditCount": 0,"redditDate": +new Date() })
                    }
                    if(redditCount > 4) $("#startRid").attr('disabled','true')
                    $("#limitR").html(redditCount +"/15")
                });

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
    if(!$("#categoryR").val() || !$("#promotionMsgR").val()) return alert("Enter The Sub Reddit username and promotional Message")
    chrome.tabs.update({url: "https://www.reddit.com/r/"+$("#categoryR").val()})
})

// The ID of the extension we want to talk to.
var editorExtensionId = chrome.runtime.id;
var category;
var prommotionalMsg;

$("#linkedInButton").click( async function() {
    category = $("#categoryL").val();
    prommotionalMsg = $("#promotionMsgL").val();
    var skip = parseInt($("#skipPeople").val()) / 10
    skip = String(skip).split('.')[0]
    if(skip < 1) skip = 1
    if(!category || !prommotionalMsg || !$("#titleL").val() || !skip) return alert("Enter The Company Category and promotional Message")
    chrome.tabs.update({url: "https://www.linkedin.com/search/results/people/?keywords="+$("#categoryL").val()+"&title="+$("#titleL").val()+"&page="+skip})
})

var automationStart = false;
var RautomationStart = false;


$("#startLin").click(() => {
    if(!$("#promotionMsgL").val()) return alert("Enter Promotional Message")
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        console.log("URL:"+tabs)
        let url = new URL(tabs[0].url);
        if(url.hostname != "www.linkedin.com") return alert("Load Linked First")
        if(!automationStart) sendToContent({cookie: cookieAuth, extensionId: chrome.runtime.id, msg:$("#promotionMsgL").val(), status: "start", linkcount:$("#limitL").html().split('/')[0]})
        else sendToContent({ extensionId: chrome.runtime.id, status: "stop"})
        automationStart = !automationStart;
    });
    if(automationStart) $(".startButtonLinkedIn").html("Start Bot")
    if(!automationStart) $(".startButtonLinkedIn").html("Stop Bot")
})

$("#startRid").click(() => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        console.log("URL:"+tabs)
        let url = new URL(tabs[0].url);
        if(url.hostname != "www.reddit.com") return alert("Load Reddit First")
        if(!RautomationStart) sendToContent({cookie: cookieAuth, extensionId: chrome.runtime.id, msg:$("#promotionMsgR").val(), status: "startR", linkcount:$("#limitR").html().split('/')[0]})
        else sendToContent({extensionId: chrome.runtime.id, status: "stop"})
        RautomationStart = !RautomationStart;
    });
    if(RautomationStart) $(".startButtonReddit").html("Start Bot")
    if(!RautomationStart) $(".startButtonReddit").html("Stop Bot")
})


    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            var redCount
            var linCount
            chrome.storage.sync.get(['redCount','linCount'], (req) => {
                redCount  = req.redCount;
                linCount = req.linCount;
            
            
            if(request.linkcount){
                linCount =parseInt(linCount) + 1;
                chrome.storage.sync.set({linkcount: request.linkcount, "linCount": linCount}, () => {
                    $("#linCount").html(linCount)
                    $("#limitL").html(request.linkcount+'/15')
                    if(request.linkcount > 14)  {
                        $("#startLin").attr('disabled','true')
                    }
                });
                
            }else if(request.redditcount){
                redCount = parseInt(redCount) + 1;
                $("#redCount").html(redCount)
                chrome.storage.sync.set({redditCount: request.redditcount, "redCount": redCount}, () => {
                    $("#limitR").html(request.redditcount+'/15')
                    if(request.redditcount > 14)  {
                        $("#startRid").attr('disabled','true')
                    }
             });
            }

        })
            

            sendResponse('{}')
            return true;

            
        });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendToContent(msg){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
            if(response) return;
        });
    });
}

$("[ref-tab]").click(function(e){
    let target =  $(e.target).parent();
    let ref = target.attr("ref-tab");
    $("[ref-tab]").removeClass("is-active");
    target.addClass("is-active");
    $(".tab-item").hide();
    $(`#${ref}`).show();
})

$("#findC").click(() => {
    chrome.tabs.update({url: "https://www.linkedin.com/search/results/people/?keywords="+$("#categoryL").val()})
})

$("#findT").click(() => {
    if(!$("#categoryL").val()) return alert("Type A Niche")
    chrome.tabs.update({url: "https://www.linkedin.com/search/results/people/?keywords="+$("#categoryL").val()+"&title="+$("#titleL").val()})
})

$("#skipPeopleButton").click(() => {
    if(!$("#categoryL").val()) return alert("Type A Niche")
    var skip = parseInt($("#skipPeople").val()) / 10
    skip = String(skip).split('.')[0]
    if(skip < 1) skip = 1
    if(!$("#titleL").val()) return chrome.tabs.update({url: "https://www.linkedin.com/search/results/people/?keywords="+$("#categoryL").val()+"&title="+$("#titleL").val()+"&page="+skip})
    chrome.tabs.update({url: "https://www.linkedin.com/search/results/people/?keywords="+$("#categoryL").val()+"&page="+skip})
})