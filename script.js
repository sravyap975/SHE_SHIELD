const firebaseConfig = {
    apiKey: "AIzaSyBEUGo40b91AUq9k8ojW519yMZ1AqNElyo",
    authDomain: "she-shield-b3fe5.firebaseapp.com",
    databaseURL: "https://she-shield-b3fe5-default-rtdb.firebaseio.com",
    projectId: "she-shield-b3fe5",
    storageBucket: "she-shield-b3fe5.appspot.com",
    messagingSenderId: "1040789300706",
    appId: "1:1040789300706:web:5bd7055add85154a7c85bb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// --- Siren Initialization ---
const siren = new Audio('siren.mp3');
siren.loop = true;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) errorEl.classList.remove('show');
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        const currentPage = window.location.pathname;
        const isLoginPage = currentPage.includes('index.html') || currentPage.endsWith('/');
        const isDashboard = currentPage.includes('dashboard.html');

        if (user) {
            if (isLoginPage) window.location.href = 'dashboard.html';
            else if (isDashboard) loadDashboard(user);
        } else {
            if (isDashboard) window.location.href = 'index.html';
        }
    });
}

async function signUp(email, password) {
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        return { success: true };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

async function login(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        return { success: true };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

async function logout() {
    await auth.signOut();
    window.location.href = 'index.html';
}

function getAuthErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use': return 'Email already registered.';
        case 'auth/wrong-password': return 'Incorrect password.';
        default: return 'An error occurred.';
    }
}

// ============================================
// DASHBOARD & CONTACTS
// ============================================

function loadDashboard(user) {
    const userEmailEl = document.getElementById('user-email');
    const userNameEl = document.getElementById('user-name');
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userNameEl) {
        const name = user.email.split('@')[0];
        userNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    }
    loadContacts(user.uid);
    loadAlerts(user.uid);
}

async function addContact(userId, name, phone) {
    try {
        await database.ref(`users/${userId}/contacts`).push().set({
            name: name, phone: phone, addedAt: Date.now()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to add contact.' };
    }
}

function loadContacts(userId) {
    database.ref(`users/${userId}/contacts`).on('value', (snapshot) => {
        const container = document.getElementById('contacts-container');
        if (!container) return;
        const contacts = snapshot.val();
        if (!contacts) {
            container.innerHTML = '<p class="no-contacts">No contacts added yet.</p>';
            return;
        }
        let html = '';
        for (const [key, contact] of Object.entries(contacts)) {
            html += `<div class="contact-item">
                <div class="contact-info"><h5>${escapeHtml(contact.name)}</h5><p>${escapeHtml(contact.phone)}</p></div>
                <button class="delete-contact" onclick="deleteContact('${userId}', '${key}')">🗑️</button>
            </div>`;
        }
        container.innerHTML = html;
    });
}

async function deleteContact(userId, contactId) {
    if (confirm('Delete contact?')) {
        await database.ref(`users/${userId}/contacts/${contactId}`).remove();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// EMERGENCY EFFECTS (SIREN & VIBRATE)
// ============================================

function triggerEmergencyEffects() {
    siren.volume = 1.0;
    siren.play().catch(e => console.log("Audio interaction required first"));

    if ("vibrate" in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
    }
}

// ============================================
// UPDATED SOS & SMS LOGIC
// ============================================

async function sendSOS() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please login first");
        return;
    }

    // 1. Play Siren and Vibration
    triggerEmergencyEffects();

    // 2. Get Location
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Standard Maps URL
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        try {
            // 3. Save Alert to Firebase
            await database.ref(`users/${user.uid}/alerts`).push().set({
                latitude, 
                longitude, 
                timestamp: Date.now()
            });

            // 4. Fetch Contacts and Open SMS
            const snapshot = await database.ref(`users/${user.uid}/contacts`).once('value');
            const contacts = snapshot.val();

            if (contacts) {
                const contactArray = Object.values(contacts);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                
                // Format numbers correctly for the OS
                const separator = isIOS ? ';' : ',';
                const finalNumbers = contactArray.map(c => c.phone.trim()).join(separator);

                // Construct message
                const messageText = `EMERGENCY! I need help. My current location: ${mapsUrl}`;
                
                // SMS link construction
                const smsLink = `sms:${finalNumbers}${isIOS ? '&' : '?'}body=${encodeURIComponent(messageText)}`;
                
                // Trigger SMS app
                setTimeout(() => {
                    window.location.href = smsLink;
                }, 500);
            } else {
                alert("SOS Sent to Dashboard, but no emergency contacts found.");
            }

            document.getElementById('sos-status')?.classList.remove('hidden');

        } catch (error) {
            console.error("SOS failed:", error);
        }
    }, (err) => {
        alert("Location Access Denied. Please enable GPS.");
    }, { enableHighAccuracy: true });
}

function loadAlerts(userId) {
    database.ref(`users/${userId}/alerts`).orderByChild('timestamp').limitToLast(5).on('value', (snapshot) => {
        const container = document.getElementById('alerts-container');
        if (!container) return;
        const alerts = snapshot.val();
        if (!alerts) return;
        const alertsArray = Object.entries(alerts).map(([key, value]) => ({ id: key, ...value })).sort((a, b) => b.timestamp - a.timestamp);
        let html = '';
        alertsArray.forEach(alert => {
            html += `<div class="alert-item"><p class="time">📅 ${formatDate(alert.timestamp)}</p></div>`;
        });
        container.innerHTML = html;
    });
}

// ============================================
// AI & MAP LOGIC
// ============================================

let map;
let marker;
let watchId = null;

function initMap(lat, lng) {
    if (!document.getElementById('google-map')) return;
    map = L.map('google-map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([lat, lng]).addTo(map);
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
if (recognition) {
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (transcript.includes("hey safety") || transcript.includes("help")) {
            sendSOS();
        }
    };
}

// ============================================
// EVENT LISTENERS
// ============================================



document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is already logged in or needs to be redirected
    checkAuthState();

    // 2. LOGIN BUTTON LISTENER (This was missing!)
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                showError('login-error', 'Please enter email and password.');
                return;
            }

            setLoading(loginBtn, true);
            hideError('login-error');

            const result = await login(email, password);
            if (!result.success) {
                showError('login-error', result.error);
                setLoading(loginBtn, false);
            }
            // Note: If successful, checkAuthState() handles the redirect
        });
    }

    // 3. SIGNUP BUTTON LISTENER (This was also missing!)
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', async () => {
            const email = document.getElementById('signup-email').value;
            const pass = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            if (pass !== confirm) {
                showError('signup-error', 'Passwords do not match.');
                return;
            }

            setLoading(signupBtn, true);
            const result = await signUp(email, pass);
            if (!result.success) {
                showError('signup-error', result.error);
                setLoading(signupBtn, false);
            }
        });
    }

    // 4. FORM SWITCHING LOGIC (To swap between Login and Signup views)
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginFormDiv = document.getElementById('login-form');
    const signupFormDiv = document.getElementById('signup-form');

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormDiv.classList.add('hidden');
            signupFormDiv.classList.remove('hidden');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupFormDiv.classList.add('hidden');
            loginFormDiv.classList.remove('hidden');
        });
    }

    // --- KEEPING YOUR EXISTING DASHBOARD LISTENERS BELOW ---
    const safetyToggle = document.getElementById('safety-toggle');
    if (safetyToggle) {
        safetyToggle.addEventListener('change', function() {
            if (this.checked) {
                siren.muted = true;
                siren.play().then(() => { siren.pause(); siren.muted = false; });
                recognition.start();
                watchId = navigator.geolocation.watchPosition((pos) => {
                    const { latitude, longitude } = pos.coords;
                    if (marker) marker.setLatLng([latitude, longitude]);
                    if (map) map.setView([latitude, longitude]);
                });
                alert("Safety Mode ON");
            } else {
                recognition.stop();
                siren.pause();
                siren.currentTime = 0;
                if (watchId) navigator.geolocation.clearWatch(watchId);
                alert("Safety Mode OFF");
            }
        });
    }

    const sosBtn = document.getElementById('sos-btn');
    if (sosBtn) sosBtn.addEventListener('click', sendSOS);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const user = auth.currentUser;
            if (user && name && phone) {
                await addContact(user.uid, name, phone);
                contactForm.reset();
            }
        });
    }

    navigator.geolocation.getCurrentPosition((p) => {
        initMap(p.coords.latitude, p.coords.longitude);
    });
});

// --- Functions ---
function updateHelplines() {
    const selectedState = document.getElementById('state-selector').value;
    const data = helplineData[selectedState];

    document.getElementById('num-police').textContent = data.police;
    document.getElementById('num-women').textContent = data.women;
    document.getElementById('num-medical').textContent = data.medical;
}

function showTip(category) {
    const display = document.getElementById('tip-display');
    display.style.opacity = 0; // Quick fade effect
    setTimeout(() => {
        display.innerHTML = `<p>${safetyTips[category]}</p>`;
        display.style.opacity = 1;
    }, 200);
}

// Auto-detect location on load and set dropdown
navigator.geolocation.getCurrentPosition(async (p) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${p.coords.latitude}&lon=${p.coords.longitude}`);
        const data = await res.json();
        const state = data.address.state;
        
        if(helplineData[state]) {
            document.getElementById('state-selector').value = state;
            updateHelplines();
        }
    } catch(e) { console.log("State detection failed"); }
});
// Data for Tips
const safetyTipsData = {
    night: {
        title: "Night Travel Safety",
        tips: ["Inform someone of your plans.", "Keep phone charged.", "Sit near the driver.", "Avoid headphones.", "Share live location."]
    },
    transport: {
        title: "Public Transport Safety",
        tips: ["Wait in lit areas.", "Note vehicle numbers.", "Don't sleep during travel.", "Trust your instincts."]
    },
    isolated: {
        title: "Isolated Areas Safety",
        tips: ["Avoid dark alleys or empty shortcuts.", "Walk with confidence and purpose.", "Keep your phone in your hand.", "Don't wear headphones in quiet areas.", "Head toward lights or shops if followed."]
    },
    work: {
        title: "Workplace Safety",
        tips: ["Know the emergency exit routes.", "Keep office security on speed dial.", "Report any harassment immediately.", "Avoid staying late alone if possible.", "Trust your professional instincts."]
    },
    online: {
    title: "Online Safety",
    tips: [
        "Use strong, unique passwords for all accounts.",
        "Enable Two-Factor Authentication (2FA) where possible.",
        "Be cautious about sharing personal details on social media.",
        "Avoid clicking on suspicious links in emails or texts.",
        "Report and block profiles that harass or threaten you."
    ]
}
    // Add more categories as needed...
};

function showTip(category) {
    const data = safetyTipsData[category];
    if(!data) return;
    document.getElementById('tip-title').textContent = data.title;
    const listHtml = data.tips.map(tip => `<li>${tip}</li>`).join('');
    document.getElementById('tip-list').innerHTML = listHtml;
    
    // Update active button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}


// Data for Helplines
const stateHelplines = {
    "Delhi": { police: "100", women: "1091", medical: "102", fire: "101" },
    "Telangana": { police: "100", women: "1091", medical: "108", fire: "101" }
};

function updateHelplines() {
    const state = document.getElementById('state-selector').value;
    const data = stateHelplines[state];
    document.getElementById('num-police').textContent = data.police;
    document.getElementById('num-women').textContent = data.women;
    document.getElementById('num-medical').textContent = data.medical;
    document.getElementById('num-fire').textContent = data.fire;
}

