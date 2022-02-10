let selectedQueries = new Set();
let totalNum = 0;

// var popupWindow = window.open(
//     chrome.extension.getURL("popup.html"),
//     "exampleName",
//     "width=400,height=400"
// );




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



chrome.storage.sync.get(ACTIVITY_TRACK, (resp) => {
})



$(document).on("click", ".queries .button", function(){

})

$("#msg").click(function(){

})

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

// console.log(localStorage.getItem('userIds'))

document.getElementsByClassName('follow-use')[0].innerText = localStorage.getItem('userIds')+'/150';