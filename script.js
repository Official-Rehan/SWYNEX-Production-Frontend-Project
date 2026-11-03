const API_URL = "https://randomuser.me/api/?results=12";

const userGrid = document.getElementById("userGrid");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const genderFilter = document.getElementById("genderFilter");
const refreshBtn = document.getElementById("refreshBtn");
const retryBtn = document.getElementById("retryBtn");
const userCount = document.getElementById("userCount");

let users = [];


/* =========================
   FETCH USERS FROM API
========================= */

async function fetchUsers() {
    showLoading();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        users = data.results;

        renderUsers();

    } catch (error) {
        console.error("API Error:", error);
        showError();
    }
}


/* =========================
   RENDER USERS
========================= */

function renderUsers() {

    // Hide loading and error after successful API response
    loading.classList.add("hidden");
    errorBox.classList.add("hidden");

    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedGender = genderFilter.value;

    const filteredUsers = users.filter((user) => {

        const fullName =
            `${user.name.first} ${user.name.last}`.toLowerCase();

        const email = user.email.toLowerCase();

        const matchesSearch =
            fullName.includes(searchTerm) ||
            email.includes(searchTerm);

        const matchesGender =
            selectedGender === "all" ||
            user.gender === selectedGender;

        return matchesSearch && matchesGender;
    });


    // Clear previous cards
    userGrid.innerHTML = "";


    // No users found
    if (filteredUsers.length === 0) {

        emptyState.classList.remove("hidden");

    } else {

        emptyState.classList.add("hidden");

        filteredUsers.forEach((user) => {

            const card = createUserCard(user);

            userGrid.appendChild(card);
        });
    }


    // Update user count
    userCount.textContent =
        `${filteredUsers.length} ${
            filteredUsers.length === 1 ? "user" : "users"
        }`;
}


/* =========================
   CREATE USER CARD
========================= */

function createUserCard(user) {

    const card = document.createElement("article");

    const fullName =
        `${user.name.first} ${user.name.last}`;

    const location =
        `${user.location.city}, ${user.location.country}`;


    card.className = "user-card";


    card.innerHTML = `
        <div class="profile">

            <img
                src="${user.picture.large}"
                alt="${fullName}"
            >

            <div>
                <h3>${fullName}</h3>

                <div class="username">
                    @${user.login.username}
                </div>
            </div>

        </div>


        <div class="info">

            <div class="info-item">
                <span class="info-icon">✉</span>
                <span>${user.email}</span>
            </div>


            <div class="info-item">
                <span class="info-icon">☎</span>
                <span>${user.phone}</span>
            </div>


            <div class="info-item">
                <span class="info-icon">⌖</span>
                <span>${location}</span>
            </div>


            <div class="info-item">
                <span class="info-icon">●</span>
                <span>${user.gender}</span>
            </div>

        </div>
    `;


    return card;
}


/* =========================
   SHOW LOADING
========================= */

function showLoading() {

    loading.classList.remove("hidden");

    errorBox.classList.add("hidden");

    emptyState.classList.add("hidden");

    userGrid.innerHTML = "";

    userCount.textContent = "Loading...";
}


/* =========================
   SHOW ERROR
========================= */

function showError() {

    loading.classList.add("hidden");

    errorBox.classList.remove("hidden");

    emptyState.classList.add("hidden");

    userGrid.innerHTML = "";

    userCount.textContent = "0 users";
}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", () => {

    renderUsers();

});


/* =========================
   GENDER FILTER
========================= */

genderFilter.addEventListener("change", () => {

    renderUsers();

});


/* =========================
   REFRESH BUTTON
========================= */

refreshBtn.addEventListener("click", () => {

    fetchUsers();

});


/* =========================
   RETRY BUTTON
========================= */

retryBtn.addEventListener("click", () => {

    fetchUsers();

});


/* =========================
   INITIAL LOAD
========================= */

fetchUsers();