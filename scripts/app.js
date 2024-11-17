import data from './passwordData.js';

const form = document.getElementById("form");
const optionsContainer = document.getElementById("optionsContainer");
const notificationContainer = document.getElementById("notificationContainer");
const resultDiv = document.getElementById("resultDiv");
const passwordValue = document.getElementById("passwordValue");
const copyBtn = document.getElementById("copyBtn");

// Notification function
function notification(type, message) {
	const config = {
		error: {
			textColor: "text-red-500",
			bgColor: "bg-red-100",
			borderColor: "border-red-200",
			icon: `<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>`
		},
		success: {
			textColor: "text-green-500",
			bgColor: "bg-green-100",
			borderColor: "border-green-200",
			icon: `<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>`
		}
	};

	const { textColor, bgColor, borderColor, icon } = config[type] || {};
	const markup = `
    <div class="border ${borderColor} rounded-lg p-4 ${bgColor} mb-6">
      <div class="${textColor} flex items-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" height="21" width="21" viewBox="0 0 512 512">${icon}</svg>
        <h2 class="text-md leading-tight font-normal">${message}</h2>
      </div>
    </div>
  `;
	notificationContainer.innerHTML = markup;
}

// Load available password options dynamically
function loadOptions() {
	const options = Object.keys(data.password_character_options);
	let checked = 0;

	options.forEach(option => {
		const labelTag = document.createElement("label");
		const checkStatus = checked <= 3 ? "checked" : "";

		labelTag.classList = "flex items-center space-x-3 cursor-pointer";
		labelTag.innerHTML = `
      <input id="combination" name="combination" type="checkbox" class="peer hidden" value="${option}" ${checkStatus}/>
      <svg class="block peer-checked:hidden" xmlns="http://www.w3.org/2000/svg" height="28" width="24.5" viewBox="0 0 448 512">
        <path fill="#EF4444" d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm88 200l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
      </svg>
      <svg class="hidden peer-checked:block" xmlns="http://www.w3.org/2000/svg" height="28" width="24.5" viewBox="0 0 448 512">
        <path fill="#22C55E" d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
      </svg>
      <span class="text-gray-400 text-sm font-light peer-checked:text-gray-900">Include ${option.replace("_", " ")}</span>
    `;
		optionsContainer.appendChild(labelTag);
		checked++;
	});
}

// Generate password based on selected length and options
function createPassword(pLength, pCombinations) {
	const allChars = pCombinations.reduce((chars, combination) => chars + data.password_character_options[combination], "");
	let password = "";

	for (let i = 0; i < pLength; i++) {
		password += allChars.charAt(Math.floor(Math.random() * allChars.length));
	}

	return password;
}

// Function to copy text to clipboard
function copyToClipboard(text) {
	navigator.clipboard.writeText(text)
		.then(() => {
			notification("success", "Text copied to clipboard!");
		})
		.catch(err => {
			notification("error", `Failed to copy text`);
			// Optionally show an error message
		});
}

// Handle form submission to generate password
form.addEventListener('submit', function(event) {
	event.preventDefault();

	const formData = new FormData(this);
	const length = formData.get("length");
	const combinations = formData.getAll("combination");

	const password = createPassword(length, combinations);
	resultDiv.classList.replace("hidden", "block");
	passwordValue.value = password;

	notificationContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
	notification("success", "Password Generated Successfully!");
});

copyBtn.addEventListener('click', function() {
	copyToClipboard(passwordValue.value);
});

// Load password options on page load
loadOptions();

// service worker
// for PWA support
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/PasswordGen/service-worker.js').then(function(registration) {
		console.log('Service Worker registered with scope:', registration.scope);
	}).catch(function(error) {
		console.log('Service Worker registration failed:', error);
	});
}
