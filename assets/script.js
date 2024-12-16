document.addEventListener('DOMContentLoaded', () => {
    const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    
    savedPlayers.forEach(player => {
        populatePlayerCard(player);
    });
});

// Listen for form submission
document.getElementById('playerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const playerData = {
        name: document.getElementById('name').value.trim(),
        photo: document.getElementById('photo').value.trim(),
        position: document.getElementById('position').value.trim(),
        nationality: document.getElementById('nationality').value.trim(),
        flag: document.getElementById('flag').value.trim(),
        club: document.getElementById('club').value.trim(),
        logo: document.getElementById('logo').value.trim(),
        rating: document.getElementById('rating').value.trim(),
        pace: document.getElementById('pace').value.trim(),
        shooting: document.getElementById('shooting').value.trim(),
        passing: document.getElementById('passing').value.trim(),
        dribbling: document.getElementById('dribbling').value.trim(),
        defending: document.getElementById('defending').value.trim(),
        physical: document.getElementById('physical').value.trim(),
        diving: document.getElementById('diving').value.trim(),
        handling: document.getElementById('handling').value.trim(),
        kicking: document.getElementById('kicking').value.trim(),
        reflexes: document.getElementById('reflexes').value.trim(),
        speed: document.getElementById('speed').value.trim(),
        positioning: document.getElementById('positioning').value.trim(),
    };

    // Validate the inputs
    let isValid = true;
    const validationMessages = [];

    if (playerData.name === '') {
        isValid = false;
        validationMessages.push('Name is required.');
    }

    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlRegex.test(playerData.photo)) {
        isValid = false;
        validationMessages.push('Invalid Photo URL.');
    }
    if (!urlRegex.test(playerData.flag)) {
        isValid = false;
        validationMessages.push('Invalid Flag URL.');
    }
    if (!urlRegex.test(playerData.logo)) {
        isValid = false;
        validationMessages.push('Invalid Club Logo URL.');
    }

    const rating = parseInt(playerData.rating);
    if (isNaN(rating) || rating < 1 || rating > 100) {
        isValid = false;
        validationMessages.push('Rating must be a number between 1 and 100.');
    }

    // (if position is GK)
    if (playerData.position === "GK") {
        const goalkeeperAttributes = ['diving', 'handling', 'kicking', 'reflexes', 'speed', 'positioning'];
        goalkeeperAttributes.forEach(attr => {
            const value = parseInt(playerData[attr]);
            if (isNaN(value) || value < 1 || value > 100) {
                isValid = false;
                validationMessages.push(`${attr.charAt(0).toUpperCase() + attr.slice(1)} must be a number between 1 and 100.`);
            }
        });
    }
    else {
        const attributes = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
        attributes.forEach(attr => {
            const value = parseInt(playerData[attr]);
            if (isNaN(value) || value < 1 || value > 100) {
                isValid = false;
                validationMessages.push(`${attr.charAt(0).toUpperCase() + attr.slice(1)} must be a number between 1 and 100.`);
            }
        });
    }

    // Show validation messages if any
    if (!isValid) {
        alert(validationMessages.join('\n'));
        return;
    }

    const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const existingIndex = savedPlayers.findIndex(p => p.position === playerData.position);

    if (existingIndex !== -1) {
        savedPlayers[existingIndex] = playerData;
    } else {
        savedPlayers.push(playerData);
    }
    localStorage.setItem('players', JSON.stringify(savedPlayers));

    populatePlayerCard(playerData);

    CloseModal();
    e.target.reset();
});

  
// Function to populate a player card
function populatePlayerCard(player) {
    const { position, name, photo, nationality, flag, club, logo, rating, diving, handling, kicking, reflexes, speed, positioning, pace, shooting, passing, dribbling, defending, physical } = player;

    if (!position) {
        console.error('Invalid position:', position);
        return;
    }

    const positionCard = document.querySelector(`.players .${position}`);

    if (!positionCard) {
        console.error('Position card not found for position:', position);
        return;
    }

    let cardHTML = `
        <!-- Player Card Top -->
        <div class="relative group text-[#e9cc74] player-card" data-position="${position}">
        <div class="relative group text-[#e9cc74] player-card" data-position="${position}">
            <button 
                class="modify-button text-x absolute z-20 top-2 right-[-8%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onclick="modifyPlayer('${position}')">
                ✎
            </button>
            <button 
                class="delete-button text-x absolute z-20 top-8 right-[-10%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onclick="deletePlayerCard('${position}')">
                🗑️
            </button>

            <div class="PlayerData absolute text-left pt-[1rem] text-uppercase">
                <div class="text-xs font-bold">${rating}</div>
                <div class="text-xs font-bold">${position}</div>
                <div class="block w-[1rem] h-auto my-[0.3rem]">
                    <img class="w-full h-full object-contain" src="${flag}" alt="${nationality}">
                </div>
                <div class="block w-[1rem] h-auto">
                    <img class="w-full h-full object-contain" src="${logo}" alt="${club}">
                </div>
            </div>
            <div class="PlayerImg w-[6vw] h-auto mx-auto overflow-hidden mb-1">
                <img class="w-full h-full object-contain relative bottom-0" src="${photo}" alt="${name}">
            </div>
        </div>
        <!-- Player Card Bottom -->
        <div class="relative">
            <div class="text-[#e9cc74] w-[96%] mx-auto">
                <div class="PlayerName text-center text-[0.6rem] mb-1 uppercase font-bold leading-none">
                    <span class="text-shadow">${name}</span>
                </div>
                <div class="PlayerData flex justify-center">`;

    if (position === "GK") {
        cardHTML += `
            <div class="border-r-2 border-[#e9cc74] pr-[0.4rem]">
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${diving}</span><span class="font-light">DIV</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${handling}</span><span class="font-light">HAN</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${kicking}</span><span class="font-light">KIC</span>
                </span>
            </div>
            <div class="pl-[0.4rem]">
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.1rem]">${reflexes}</span><span class="font-light">REF</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.1rem]">${speed}</span><span class="font-light">SPD</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.1rem]">${positioning}</span><span class="font-light">POS</span>
                </span>
            </div>`;
    } else {
        cardHTML += `
            <div class="border-r-2 border-[#e9cc74] pr-[0.4rem]">
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${pace}</span><span class="font-light">PAC</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${shooting}</span><span class="font-light">SHO</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${passing}</span><span class="font-light">PAS</span>
                </span>
            </div>
            <div class="pl-[0.4rem]">
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${dribbling}</span><span class="font-light">DRI</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${defending}</span><span class="font-light">DEF</span>
                </span>
                <span class="flex text-[0.6rem] uppercase">
                    <span class="font-bold mr-[0.3rem]">${physical}</span><span class="font-light">PHY</span>
                </span>
            </div>`;
    }

    cardHTML += `
                </div>
            </div>
        </div>
    `;

    positionCard.innerHTML = cardHTML;
    positionCard.classList.add('filled');
}

// Function to delete a player card
function deletePlayerCard(position) {
    const positionCard = document.querySelector(`.players .${position}`);
    if (!positionCard) return;

    positionCard.innerHTML = '';
    positionCard.classList.remove('filled');

    const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const updatedPlayers = savedPlayers.filter((player) => player.position !== position);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
}

  
// Function to save player data to localStorage
function savePlayerToLocalStorage(player) {
    const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    savedPlayers.push(player);
    localStorage.setItem('players', JSON.stringify(savedPlayers));
}

// Open Modal and Prefill Position
function OpenModal(positionId) {

    const positionMap = {
        Add9: "ST",
        Add11: "RW",
        Add7: "LW",
        Add10: "CM",
        Add8: "RM",
        Add6: "LM",
        Add5: "CB1",
        Add4: "CB2",
        Add2: "RB",
        Add3: "LB",
        Add0: "GK",
    };


    const position = positionMap[positionId] || positionId;


    document.getElementById("position").value = position;

    // Show specific attributes for goalkeepers
    if (position === "GK") {
        document.getElementById("goalkeeperAttributes").classList.remove("hidden");
        document.getElementById("fieldPlayerAttributes").classList.add("hidden");
    } else {
        document.getElementById("goalkeeperAttributes").classList.add("hidden");
        document.getElementById("fieldPlayerAttributes").classList.remove("hidden");
    }

    document.getElementById("Modal").classList.remove("hidden");
}

// Close Modal
function CloseModal() {

    document.querySelectorAll("#Modal input").forEach(input => {
        input.value = "";
    });
    document.getElementById("Modal").classList.add("hidden");
}


// Fetch player data from the external JSON file
async function fetchPlayerData() {
    try {
        const response = await fetch('https://theshamkhi.github.io/FUTXpert/assets/data/data.json');
        const data = await response.json();
        return data.players; 
    } catch (error) {
        console.error('Error fetching player data:', error);
        return [];
    }
}

// Function to autofill the form when the player name is entered
async function autofillForm(playerName) {
    const playersData = await fetchPlayerData();
    const player = playersData.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    
    if (player) {

        document.getElementById('photo').value = player.photo;
        document.getElementById('position').value = player.position;
        document.getElementById('nationality').value = player.nationality;
        document.getElementById('flag').value = player.flag;
        document.getElementById('club').value = player.club;
        document.getElementById('logo').value = player.logo;
        document.getElementById('rating').value = player.rating;
        document.getElementById('pace').value = player.pace;
        document.getElementById('shooting').value = player.shooting;
        document.getElementById('passing').value = player.passing;
        document.getElementById('dribbling').value = player.dribbling;
        document.getElementById('defending').value = player.defending;
        document.getElementById('physical').value = player.physical;
        document.getElementById('diving').value = player.diving;
        document.getElementById('handling').value = player.handling;
        document.getElementById('kicking').value = player.kicking;
        document.getElementById('reflexes').value = player.reflexes;
        document.getElementById('speed').value = player.speed;
        document.getElementById('positioning').value = player.positioning;
    }
}

document.getElementById('name').addEventListener('input', function () {
    const playerName = this.value.trim();
    
    if (playerName) {
        autofillForm(playerName);
    }
});

function modifyPlayer(position) {
    const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const player = savedPlayers.find(p => p.position === position);

    if (player) {

        document.getElementById('name').value = player.name;
        document.getElementById('photo').value = player.photo;
        document.getElementById('position').value = player.position;
        document.getElementById('nationality').value = player.nationality;
        document.getElementById('flag').value = player.flag;
        document.getElementById('club').value = player.club;
        document.getElementById('logo').value = player.logo;
        document.getElementById('rating').value = player.rating;
        document.getElementById('pace').value = player.pace;
        document.getElementById('shooting').value = player.shooting;
        document.getElementById('passing').value = player.passing;
        document.getElementById('dribbling').value = player.dribbling;
        document.getElementById('defending').value = player.defending;
        document.getElementById('physical').value = player.physical;
        document.getElementById('diving').value = player.diving;
        document.getElementById('handling').value = player.handling;
        document.getElementById('kicking').value = player.kicking;
        document.getElementById('reflexes').value = player.reflexes;
        document.getElementById('speed').value = player.speed;
        document.getElementById('positioning').value = player.positioning;


        OpenModal(player.position);
    }
}


// Overlay
const openOverlayBtn = document.getElementById('openOverlay');
const substitutionsOverlay = document.getElementById('substitutionsOverlay');
const closeOverlayBtn = document.getElementById('closeOverlay');

openOverlayBtn.addEventListener('click', () => {
    substitutionsOverlay.classList.remove('hidden');
});

closeOverlayBtn.addEventListener('click', () => {
    substitutionsOverlay.classList.add('hidden');
});



const savedPlayers = JSON.parse(localStorage.getItem('players')) || []; // players on localStorage

// Fetch player data
fetch('https://theshamkhi.github.io/FUTXpert/assets/data/data.json')
    .then(response => response.json())
    .then(data => {
        const players = data.players;
        const playerSlider = document.getElementById('playerSlider');

        const playersNotInLocalStorage = players.filter(player => {
            return !savedPlayers.some(savedPlayer => savedPlayer.name === player.name);
        });

        playersNotInLocalStorage.forEach(player => {
            let cardHTML = `
                <div class="relative w-[300px] h-[485px] scale-[0.8] bg-cover bg-center p-[2.5rem] z-10" style="background-image: url('https://selimdoyranli.com/cdn/fut-player-card/img/card_bg.png');">
                    
                    <!-- Player Card Top -->
                    <div class="flex relative text-[#e9cc74]">
                        <div class="absolute text-left pt-[2rem] text-uppercase">
                            <div class="text-2xl font-bold">${player.rating}</div>
                            <div class="text-xl font-bold">${player.position}</div>
                            
                            <div class="block w-[2rem] h-[25px] my-[0.3rem]">
                                <img class="w-full h-full object-contain" src="${player.flag}" alt="${player.nationality}">
                            </div>
                            
                            <div class="block w-[2.1rem] h-[40px]">
                                <img class="w-full h-full object-contain" src="${player.logo}" alt="${player.club}">
                            </div>
                        </div>
                        
                        <div class="w-[220px] h-auto mx-auto overflow-hidden">
                            <img class="w-full h-full object-contain relative bottom-0" src="${player.photo}" alt="${player.name}">
                        </div>
                    </div>
                
                    <!-- Player Card Bottom -->
                    <div class="relative">
                        <div class="text-[#e9cc74] w-[90%] mx-auto py-[0.3rem_0]">
                            
                            <div class="text-center text-xl font-bold uppercase border-b-2 border-[#e9cc74] py-[1rem]">
                                <span class="text-shadow">${player.name}</span>
                            </div>
                
                            <div class="flex justify-center my-[0.5rem]">`;

            if (player.position === "GK") {
                cardHTML += ` 
                    <div class="border-r-2 pr-[2.3rem]">
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.diving}</span><span class="font-light">DIV</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.handling}</span><span class="font-light">HAN</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.kicking}</span><span class="font-light">KIC</span>
                        </span>
                    </div>
                    <div class="pl-[2.3rem]">
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.reflexes}</span><span class="font-light">REF</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.speed}</span><span class="font-light">SPD</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.positioning}</span><span class="font-light">POS</span>
                        </span>
                    </div>`;
            } else {
                cardHTML += ` 
                    <div class="border-r-2 pr-[2.3rem]">
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.pace}</span><span class="font-light">PAC</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.shooting}</span><span class="font-light">SHO</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.passing}</span><span class="font-light">PAS</span>
                        </span>
                    </div>
                    <div class="pl-[2.3rem]">
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.dribbling}</span><span class="font-light">DRI</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.defending}</span><span class="font-light">DEF</span>
                        </span>
                        <span class="flex text-lg uppercase">
                            <span class="font-bold mr-[0.3rem]">${player.physical}</span><span class="font-light">PHY</span>
                        </span>
                    </div>`;
            }

            cardHTML += `
                            </div>
                        </div>
                    </div>
                </div>`;

            playerSlider.innerHTML += cardHTML;
        });
    })
    .catch(error => console.error('Error fetching player data:', error));
