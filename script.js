// MindQuest Script

// Initialize game state
let gameState = {
    level: 1,
    daysActive: 0,
    lastActivity: null,
    brightness: 50,
    activitiesDone: 0,
    currentMood: 'happy',
    streak: 0,
    unlockedStories: [],
    chatMessages: [],
    sharedPosts: []
};

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('mindQuestState');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('mindQuestState', JSON.stringify(gameState));
}

// Update the display based on game state
function updateDisplay() {
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('days-active').textContent = gameState.daysActive;
    document.getElementById('brightness').textContent = gameState.brightness + '%';

    // Update world brightness
    const worldDisplay = document.getElementById('world-display');
    worldDisplay.style.backgroundColor = `hsl(60, 20%, ${gameState.brightness}%)`;

    // Update environment based on level
    const environment = document.getElementById('environment');
    if (gameState.level >= 5) {
        environment.textContent = '🌳🌸🌞🏰';
    } else if (gameState.level >= 3) {
        environment.textContent = '🌳🌸🌞';
    } else {
        environment.textContent = '🌳';
    }

    // Update story
    updateStory();
}

// Update story text based on progress
function updateStory() {
    const storyText = document.getElementById('story-text');
    if (gameState.daysActive === 0) {
        storyText.textContent = "Welcome to MindQuest! Start your journey by completing activities to grow your world.";
    } else if (gameState.daysActive < 3) {
        storyText.textContent = "Your world is beginning to brighten. Keep up the good work!";
    } else if (gameState.daysActive < 7) {
        storyText.textContent = "Your character grows stronger. The environment responds to your dedication.";
    } else {
        storyText.textContent = "You've become a master of mindfulness! Your world is vibrant and full of life.";
    }
}

// Handle activity completion
function completeActivity(activityType) {
    const now = new Date();
    const today = now.toDateString();

    if (gameState.lastActivity !== today) {
        gameState.daysActive++;
        gameState.lastActivity = today;
    }

    gameState.activitiesDone++;
    gameState.brightness = Math.min(100, gameState.brightness + 5);

    // Level up every 10 activities
    if (gameState.activitiesDone % 10 === 0) {
        gameState.level++;
    }

    saveGameState();
    updateDisplay();

    // Show feedback
    alert(`Great job! You completed ${activityType}. Your world grows brighter!`);
}

// Simulate decay if no activity for a day
function checkDecay() {
    const now = new Date();
    const today = now.toDateString();

    if (gameState.lastActivity && gameState.lastActivity !== today) {
        const lastActivityDate = new Date(gameState.lastActivity);
        const daysSince = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));

        if (daysSince > 1) {
            gameState.brightness = Math.max(20, gameState.brightness - daysSince * 5);
            saveGameState();
            updateDisplay();
        }
    }
}

// Event listeners for activity buttons
document.getElementById('meditate').addEventListener('click', () => completeActivity('Meditation'));
document.getElementById('journal').addEventListener('click', () => completeActivity('Journaling'));
document.getElementById('gratitude').addEventListener('click', () => completeActivity('Gratitude Practice'));
document.getElementById('reflect').addEventListener('click', () => completeActivity('Emotional Reflection'));

// Initialize the app
window.addEventListener('load', () => {
    loadGameState();
    checkDecay();
});
