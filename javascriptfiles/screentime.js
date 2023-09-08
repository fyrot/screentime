let set = 1;
let browserelapsed = -1 // test variable for counting
if (localStorage.getItem("tablist") === null) {
    var tablist = {"about:debugging": 0};
    localStorage.setItem("tablist", JSON.stringify(tablist));
} else {var tablist = JSON.parse(localStorage.getItem("tablist"));}
if (!("totalbrowsertime" in tablist)) {
    tablist["totalbrowsertime"] = -1;
} else {browserelapsed = tablist["totalbrowsertime"] - 1;}
if (!("tabtohttp" in tablist)) {
    var tabtohttp = {};
} else {
    var tabtohttp = tablist["tabtohttp"];
}
browserelapsed = tablist["totalbrowsertime"];
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == "datarequest") {
        localStorage.setItem("tablist", JSON.stringify(tablist));
        sendResponse({reallysus: JSON.parse(localStorage.getItem("tablist"))});
    }
    if (request.message == "datareset") {
        tablist["totalbrowsertime"] = browserelapsed = -2;
        tablist  = {};
    }
    
})
browser.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    localStorage.setItem("tablist", JSON.stringify(tablist))
})
setInterval(function(){
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tab = tabs[0].url;
        let tabedit = tabs[0].url;
        if (tab.startsWith("https://")) {tab = tab.replace("https://", "");}
        for (let i=0; i<tab.length; i++) {
            if (tab[i] == "/") {
                tab = tab.slice(0, i);
                tab = tab.replace("#", "");
                break;
            }
        }
        for (let i = 8; i<tabedit.length; i++) {
            if (tabedit[i] == "/") {
                tabedit = tabedit.slice(0, i);
                break
            }
        }
        tabtohttp[tab] = tabedit;
        if (!(tab in tablist)) {
            tablist[tab] = 0;
        } else {tablist[tab] = tablist[tab] + 1;}
        

        
    }, console.error);
    tablist["totalbrowsertime"] = browserelapsed = browserelapsed + 1;
    tablist["tabtohttp"] = tabtohttp;
    //localStorage.setItem("tablist", JSON.stringify(tablist));
}, 1000);
