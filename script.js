// DOM Elements
const inputSlider = document.getElementById("inputSlider");
const sliderValue = document.getElementById("sliderValue");
const passBox = document.getElementById("passBox");

const lowercaseEl = document.getElementById("lowercase");
const uppercaseEl = document.getElementById("uppercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");

// New element for favorite words
const favoriteWordsInput = document.getElementById("favoriteWords");

const generateBtn = document.getElementById("genBtn");
const copyBtn = document.getElementById("copyIcon");
const passIndicator = document.getElementById("passIndicator");
const clearBtn = document.getElementById("delete")

// Character Sets
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}\\|;':\",./<>?";

// Initialize Slider Value
sliderValue.textContent = inputSlider.value;

// Event Listeners
inputSlider.addEventListener("input", () => {
    sliderValue.textContent = inputSlider.value;
});

generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyToClipboard);
clearBtn.addEventListener("click" , clear)


// Functions
function generatePassword() {
    const length = inputSlider.value;

    let characters = "";
    let passwordArray = [];

    // Include favorite words
    const favoriteWordsInputValue = favoriteWordsInput.value;
    const favoriteWords = favoriteWordsInputValue.split(',').map(word => word.trim()).filter(word => word);

    // Process favorite words based on checkbox selections
    if (favoriteWords.length > 0) {
        if (lowercaseEl.checked) {
            passwordArray.push(...favoriteWords.map(word => word.toLowerCase())); // Convert to lowercase
        }
        if (uppercaseEl.checked) {
            passwordArray.push(...favoriteWords.map(word => word.toUpperCase())); // Convert to uppercase
        }
        if (!lowercaseEl.checked && !uppercaseEl.checked) {
            passwordArray.push(...favoriteWords); // Keep original case if neither is checked
        }
    }

    // Add character sets based on checkboxes
    if (lowercaseEl.checked) characters += lowercaseLetters;
    if (uppercaseEl.checked) characters += uppercaseLetters;
    if (numbersEl.checked) characters += numbers;
    if (symbolsEl.checked) characters += symbols;

    // Ensure there's at least one character type selected
    if (characters.length === 0 && passwordArray.length === 0) {
        alert("Please select at least one character type or enter favorite words.");
        return;
    }

    // Generate password from shuffled favorite words and other characters
    while (passwordArray.length < length) {
        passwordArray.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }

    // Shuffle the final password array for randomness
    shuffleArray(passwordArray);
    
    passBox.value = passwordArray.slice(0, length).join(''); // Limit to the desired length

    updatePasswordIndicator();
}

function updatePasswordIndicator() {
    const passwordStrength = getPasswordStrength(passBox.value);
    passIndicator.className = "pass-indicator " + passwordStrength;
}

function getPasswordStrength(password) {
    if (password.length <= 10) return "weak";
    if (password.length <= 20) return "medium";
    return "strong";
}

// Clipboard Functionality
function copyToClipboard() {
    if (passBox.value !== "") {
        navigator.clipboard.writeText(passBox.value);
        copyBtn.innerText = "check";

        setTimeout(() => {
            copyBtn.innerHTML = "content_copy";
        }, 3000);
    }
}

// clear the favorite words
function clear(){
    favoriteWords.value = "";
}

// Shuffle Array Function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Confetti Creation Functionality
function createConfetti() {
    const confetti = document.createElement('div');

    // Get all elements on the page to avoid collisions
    const elementsToAvoid = [passBox, generateBtn, copyBtn, ...document.querySelectorAll('.container')];

    // Randomly position confetti anywhere on the screen but outside of the specified elements
    let randomXPosition, randomYPosition;

    do {
        randomXPosition = Math.random() * window.innerWidth; // Random X position within viewport width
        randomYPosition = Math.random() * window.innerHeight; // Random Y position within viewport height
    } while (isColliding(randomXPosition, randomYPosition, elementsToAvoid));

    confetti.style.left = `${randomXPosition}px`;
    confetti.style.top = `${randomYPosition}px`;

    // Set random colors
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Set random size
    const size = Math.random() * 7 + 5; // Size between 5px and 15px
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;

    // Add a burst animation class
    confetti.classList.add('confetti');

    // Append to body and animate falling down
    document.body.appendChild(confetti);

    // Animate falling down and fading out
    confetti.style.animation = `burst ${Math.random() * (3 - 1) + 1}s linear forwards`;

    // Remove the shape after animation ends and create another one
    confetti.addEventListener('animationend', () => {
        confetti.remove();
        createConfetti(); // Create another shape after one is removed
    });
}

// Function to check for collisions with specified elements
function isColliding(x, y, elements) {
   return elements.some(el => {
       const rect = el.getBoundingClientRect();
       return (
           x >= rect.left && x <= rect.right &&
           y >= rect.top && y <= rect.bottom
       );
   });
}

// Start creating confetti on load
window.onload = () => {
   for (let i = 0; i < 150; i++) createConfetti(); // Adjust number of confetti pieces as needed
};

// Update password indicator on page load
window.addEventListener('DOMContentLoaded', updatePasswordIndicator);