var posts;
var users;
var i = 0;
var f = 0;
var alreadyMessaged = [];
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:3000/stats", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader("authorization", "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMDU2YzlhMWZiZTM3MTY2NTA0Mzc1OCIsImlhdCI6MTY0NDY2NzcwMiwiZXhwIjoxNjQ0NzU0MTAyfQ.K1pXyBWnyvW6yyRMEzMOefUcA_cU5gQzfuR5ZBlqsY8", true);


window.onload = async function  exampleFunction() {
    let _url = window.location.href;
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
                    sendToApi("redditDms=1")
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
                setKeywordText("This Is A Message")
                document.getElementsByClassName('_3QHhpmOrsIj9Hy8FecxWKa')[9].click()
            }

        }
    }
    else if (_url.search("keywords") > -1) {
        document.getElementsByClassName('artdeco-pill')[1].click()
        const companies = document.getElementsByClassName('entity-result__title-text')
        document.getElementsByClassName('artdeco-pill')[4].click()
        document.getElementsByClassName('mt1')[2].value = "Manager"
        
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
