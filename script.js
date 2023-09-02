String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

document.getElementById("code-value").style.color = "white";

let codes = ["1977", "2201", "1247", "8715", "6094"];
let level = 0;
let moneyMinus = 0;
let money = 25000;
let triesLeft = 3;
let start = (new Date()).getTime();
let timeElem = document.getElementById("time-left");
let moneyElem = document.getElementById("money-left");
let clues = [
    "You shouldn't take the puzzle cube out of its box.",
    "You have a meeting with Gargalyk by 5:20.",
    "Look in clue drawer (right upper beige drawer).<br>Only police with lights can see the code.",
    "Look in clue drawer (right lower beige drawer).<br>Now you should take out what you mustn't take out before.",
    "<span style=\"color=#00ff00;font-size:70px\">You won!</span>"
];
let codeBreakers = [
    "If you look on the Rubik's cube without taking it out of the box, it displays \"NIKE\".<br>Inspect the coupon on the Nike bag on the glass table to get the code.",
    "Looking into the Apple computer, you can see text near the meeting time.<br>Print it on any other keyboard with two different layouts to get the answer.<br>The answer hints at the Report Pad on the table, where the code is.",
    "You need to make a light scheme with red and blue LEDs and the given battery.<br>It can be useful to read the code on the 3D printer with police light markings.",
    "Plug the 3D printer into the given socket, but it's missing something.<br>It will be found in the Rubik's box under the Rubik's cube.<br>Use the printer to \"print out\" the code."
];
let boughtCB = [false, false, false, false];
let started = false;

animateTime();

function playSound(src) {
    let audio = new Audio(src);
    audio.play();
}

function addNumber(num) {
    playSound("press.ogg");
    let valElem = document.getElementById("code-value");
    if (valElem.style.color != "white") return;
    let val = valElem.innerText;
    for (let i = 0; i < 4; i++) {
        if (val[i] == '.') {
            valElem.innerText = val.replaceAt(i, num.toString());
            return;
        }
    }
}

function deleteNumber() {
    playSound("press.ogg");
    let valElem = document.getElementById("code-value");
    if (valElem.style.color != "white") return;
    let val = valElem.innerText;
    for (let i = 3; i >= 0; i--) {
        if (val[i] != '.') {
            valElem.innerText = val.replaceAt(i, '.');
            return;
        }
    }
}

function checkCode() {
    let valElem = document.getElementById("code-value");
    let val = valElem.innerText;
    if (val == codes[level]) {
        playSound("right.ogg");
        valElem.style.color = "#00ff00";
        level++;
        triesLeft = 3;
        setTimeout(function () {
            valElem.innerText = "....";
            valElem.style.color = "white";
            document.getElementById("clue").style.opacity = 1;
            document.getElementById("clue-title").innerText = "CLUE " + level;
            document.getElementById("clue-text").innerHTML = clues[level - 1];
            document.getElementById("cb-text").innerHTML = "";
        }, 3000);
    } else {
        playSound("wrong.ogg");
        triesLeft--;
        valElem.style.color = "#ff0000";
        setTimeout(function () {
            valElem.innerText = "....";
            valElem.style.color = "white";
        }, (triesLeft > 0 ? 3000 : 120000));
    }
    if (level >= 5) requestAnimationFrame(win);
}

function animateTime() {
    let currT = (new Date()).getTime();
    let time = new Date(start + 3660000 - currT);
    if (!started && currT - start > 60000) {
        started = true;
        playSound("start.ogg");
    }
    if (40 - ((start + 3660000 - currT) / 60000) > moneyMinus / 500) {
        moneyMinus += 500;
        playSound("minus.mp3");
    }
    if (money - moneyMinus < 0 || start + 3660000 - currT < 0) {
        requestAnimationFrame(lose);
        return;
    }
    timeElem.innerText = (time.getMinutes() + "").padStart(2, "0") + ":" + (time.getSeconds() + "").padStart(2, "0") 
            + ":" + (Math.floor(time.getMilliseconds() / 10) + "").padStart(2, "0");
    moneyElem.innerText = "$ " + (money - moneyMinus);
    requestAnimationFrame(animateTime);
}

function buyBreaker() {
    if (boughtCB[level - 1]) {
        alert("You already bought a Code Breaker here.");
        return;
    }
    if (money - moneyMinus < 5000) {
        alert("Not enough money to buy a Code Breaker.");
        return;
    }
    if (!confirm("Do you really want to buy a Code Breaker for $5000?")) return;
    money -= 5000;
    boughtCB[level - 1] = true;
    playSound("cb.ogg");
    document.getElementById("cb-text").innerHTML = codeBreakers[level - 1];
}

function lose() {
    playSound("lose.mp3");
    let curtain = document.getElementById("curtain");
    curtain.style.backgroundColor = "red";
    curtain.style.opacity = 1;
}

function win() {
    playSound("win.mp3");
    let curtain = document.getElementById("curtain");
    curtain.style.backgroundColor = "green";
    curtain.style.opacity = 1;
}