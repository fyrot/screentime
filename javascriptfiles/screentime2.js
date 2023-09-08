browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0].url;
    if (tab.startsWith("https://")) {tab = tab.replace("https://", "");}
    else if (tab.startsWith("http://")) {tab = tab.replace("http://", "")}
    for (i=0; i<tab.length; i++) {
        if (tab[i] == "/") {
            tab = tab.slice(0, i);
            tab = tab.replace("#", "");
            break;
        }
        
    }
    
    browser.runtime.sendMessage({message: "datarequest"}, (response) => {
        let browserelapsed = response.reallysus["totalbrowsertime"];
        let tabtohttp = response.reallysus["tabtohttp"];
        delete response.reallysus["tabtohttp"];
        delete response.reallysus["totalbrowsertime"];
        const tabinfoarray = Object.entries(response.reallysus);
        function sortfortop(iterableobj, timestobesorted) { // recursive (?) function that finds the top "timestobesorted"
            // iterable must be list, timestobesorted must be a int greater than 0
            let topinfo = ["none", 0]
            let spliceindex = 0
            for (let i = 0; i<iterableobj.length; i++) {
                if (iterableobj[i][1] > topinfo[1]) {
                    spliceindex = i;
                    topinfo[1] = iterableobj[i][1];
                    topinfo[0] = iterableobj[i][0];
                }
            }
            iterableobj.splice(spliceindex, 1)
            toparray.push(topinfo)
            if (toparray.length < timestobesorted && iterableobj.length > 0) {
                sortfortop(iterableobj, timestobesorted)
            }
            
        }
        function converttocompact(second) {
            seconds = second;
            if (seconds < 60) {
                if (seconds >= 2) {return String(seconds) + " secs";}
                if (seconds == 1) {return (String(seconds) + " second");}
                    
            }
            minutes = Math.floor(seconds/60);
            seconds = seconds - (minutes * 60);
            hours = Math.floor(minutes/60);
            minutes = minutes - (hours * 60);
            minutes = String(minutes);
            hours = String(hours);
            seconds = String(seconds)
            if (minutes.length == 1) {
                minutes = "0" + minutes;
            }
            if (seconds.length == 1) {
                seconds = "0" + seconds;
            }
            if (hours == "00") {
                return minutes + ":" + seconds;
            } else {return hours + ":" + minutes + ":" + seconds;}
            
        }
        if (localStorage.getItem("timesetting") == null) {
            localStorage.setItem("timesetting", "on")
        }
        let toparray = [];
        
        sortfortop(tabinfoarray, 5); // results are placed into toparray
        for (let i = 0; i < 5; i++) {
            if (toparray.length > i) {
                
                if (localStorage.getItem("timesetting") == "on") {
                    document.getElementById("counter" + String(i + 1)).innerHTML = toparray[i][0] + ": " + converttocompact(toparray[i][1]);

                } else {document.getElementById("counter" + String(i + 1)).innerHTML = toparray[i][0] + ": " + toparray[i][1];}
                document.getElementById("counter" + String(i+1)).href = tabtohttp[toparray[i][0]]
                document.getElementById("counter" + String(i+1) + "graph").style.width = String((toparray[i][1]/browserelapsed) * 168) + "px"
                document.getElementById("counter" + String(i+1)).addEventListener("input", function() {
                    open(document.getElementById("counter" + String(i+1)).href);
                })
                
            }
        }
        
        if (localStorage.getItem("graphviewsetting") == "relativetotop") {
            document.getElementById("counter1graph").style.width = "168px"
            
            for (let counternum = 2; counternum < 6; counternum++) { // graphs relative to the first counter instead of total time
                if (toparray.length > (counternum - 1)) {
                    let current = toparray[counternum-1][1]
                    if (toparray[0][1] != 0) {
                        document.getElementById("counter" + String(counternum) + "graph").style.width = String((current/toparray[0][1]) * 168) + "px"
                    }
                }              
            }   
        }
        document.getElementById("currentcounter").innerHTML = "fat"
        if (localStorage.getItem("timesetting") == "on") {
            document.getElementById("currentcounter").innerHTML = tab + ": " + converttocompact(response.reallysus[tab]);
        } else {
            document.getElementById("currentcounter").innerHTML = tab + ": " + response.reallysus[tab];
        }
        
        
    });
}, console.error);
