function checkfornull() {
    if (localStorage.getItem("timesetting") === null) {
        localStorage.setItem("timesetting", "on")
    }
    if (localStorage.getItem("graphviewsetting") === null) {
        localStorage.setItem("graphviewsetting", "relativetotop")
    }
}
checkfornull()