var posts;
var users;
var i = 0;
var f = 0;
var alreadyMessaged = [];

window.onload = async function  exampleFunction() {
    let _url = window.location.href;
    if(_url.search("comment") > -1){
        const posts = document.getElementsByClassName('_1oQyIsiPHYt6nx7VOmd1sz')
        for(var n = i; n < posts.length; n++){
            i++;
            posts[n].click()
            await sleep(3000);
            const users = document.getElementsByClassName('wM6scouPXXsFDSZmZPHRo')
            for(var k = f; k < users.length;k++){
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
    else if (_url.search("") > -1) {
        
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setKeywordText(text) {
    var el =  document.getElementsByClassName('_24sbNUBZcOO5r5rr66_bs4')[0]
    el.value = text;
    var evt= new Event('focus');
    el.dispatchEvent(evt);
}


