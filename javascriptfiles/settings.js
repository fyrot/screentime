const timesetting = document.getElementById("timesetting");
const resetbutton = document.getElementById("resettime");
const graphviewsetting = document.getElementById("graphviewsetting")
let timecounter = 0;

if (localStorage.getItem("timesetting") == "off") {timesetting.checked = false;} else {timesetting.checked = true;}
if (localStorage.getItem("graphviewsetting") == "relativetototal") {graphviewsetting.checked = false} else {graphviewsetting.checked = true;}
function resettime() {
    if (timecounter == 1) {
        resetbutton.innerHTML = "Are you sure?"
    } 
    else if (timecounter == 2) {
        resetbutton.innerHTML = "Tracked time will be erased!"
    } else if (timecounter == 3) {
        resetbutton.innerHTML = "Absolutely sure?"
    } else if (timecounter == 4) {
        resetbutton.innerHTML = "I'm sure if you're sure."
    } else if (timecounter == 5) {
        browser.runtime.sendMessage({message: "datareset"});
        resetbutton.innerHTML = "It's done."
    }

}
function checkforchanges() {
    for (let setting = 0; setting<2; setting++) {
        document.getElementsByName("settings")[setting].addEventListener("input", function() {
            document.getElementById("savestatus").innerHTML = "Saving changes.."
        })
    }
    resetbutton.onclick = function() {
        timecounter = timecounter + 1
        if (timecounter == 1) {
            resetbutton.innerHTML = "Are you sure?"
        } 
        else if (timecounter == 2) {
            resetbutton.innerHTML = "Tracked time will be erased!"
        } else if (timecounter == 3) {
            resetbutton.innerHTML = "Absolutely sure?"
        } else if (timecounter == 4) {
            resetbutton.innerHTML = "I'm sure if you're sure."
        } else if (timecounter == 5) {
            browser.runtime.sendMessage({message: "datareset"});
            resetbutton.innerHTML = "It's done."
        }
    }
    if (timesetting.checked) {
        localStorage.setItem("timesetting", "on")
    } else {
        localStorage.setItem("timesetting", "off")
    }
    if (graphviewsetting.checked) {
        localStorage.setItem("graphviewsetting", "relativetotop")
    } else {
        localStorage.setItem("graphviewsetting", "relativetototal")
    }
    resettime()
    if (document.getElementById("savestatus").innerHTML == "Saving changes..") {document.getElementById("savestatus").innerHTML = "Saved!"}
}
setInterval(function() {
    checkforchanges()
}, 1000)
