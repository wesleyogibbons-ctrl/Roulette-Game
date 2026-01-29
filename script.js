// --- INITIAL LOAD: Balance & Daily Bonus ---
let balance = parseFloat(localStorage.getItem("rouletteBalance"));
if (isNaN(balance)) balance = 10000;

let lastVisit = localStorage.getItem("lastVisitDate");
let today = new Date().toDateString();

if (lastVisit !== today) {
    balance += balance* 0.1;
    balance += 1500
    localStorage.setItem("lastVisitDate", today);
    localStorage.setItem("rouletteBalance", balance);
    alert("Daily Bonus! You got paid 1500$ and You have gained 10% intrest.");
}

// Update the screen on load
updateDisplay();

// --- BUTTON CLICK ---
document.getElementById("spinButton").addEventListener("click", function() {
    // Get Inputs
    const nInput = document.getElementById("numberInput").value;
    const eoInput = document.getElementById("evenInput").value;
    const cInput = document.getElementById("colorInput").value;

    const nBet = parseFloat(document.getElementById("numberBet").value) || 0;
    const eoBet = parseFloat(document.getElementById("evenBet").value) || 0;
    const cBet = parseFloat(document.getElementById("colorBet").value) || 0;

    const totalBet = nBet + eoBet + cBet;

    if (totalBet - 10000 > balance) {
        alert("You don't have enough money for that bet!");
        return;
    }
    if (totalBet <= 0) {
        alert("Please place a bet first.");
        return;
    }

    // Deduct bet from balance
    balance -= totalBet;

    // Spin!
    const result = Math.floor(Math.random() * 38); // 37 = 00
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    let colorResult = "Black";
    if (result === 0 || result === 37) colorResult = "Green";
    else if (redNumbers.includes(result)) colorResult = "Red";

    let winnings = 0;

    // 1. Number Win (35 to 1)
    if ((nInput === "00" && result === 37) || (parseInt(nInput) === result)) {
        winnings += (nBet * 36); 
    }

    // 2. Even/Odd Win (1 to 1)
    if (result !== 0 && result !== 37) {
        let isEven = result % 2 === 0;
        if ((isEven && eoInput === "Even") || (!isEven && eoInput === "Odd")) {
            winnings += (eoBet * 2);
        }
    }

    // 3. Color Win (1 to 1)
    if (cInput === colorResult) {
        winnings += (cBet * 2);
    }

    // Update Totals
    balance += winnings;
    localStorage.setItem("rouletteBalance", balance);
    
    // UI Update
    const displayNum = result === 37 ? "00" : result;
    document.getElementById("winLossOutput").innerHTML = 
        `The wheel landed on: <strong>${colorResult} ${displayNum}</strong><br>` +
        `Winnings: $${winnings}<br>` +
        `Net: $${winnings - totalBet}`;
    
    updateDisplay();
});

function updateDisplay() {
    document.getElementById("balance-display").innerText = "Balance: $" + balance.toLocaleString();
}
