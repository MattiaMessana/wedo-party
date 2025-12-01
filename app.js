// Stato principale dell'app
const state = {
    teams: [],   // { id, name, score }
    games: []    // { id, label, snapshot: [{ name, score }] }
};

let teamIdCounter = 1;
let gameIdCounter = 1;

// Elementi DOM
const teamForm = document.getElementById('team-form');
const teamNameInput = document.getElementById('team-name');
const teamList = document.getElementById('team-list');
const rankingList = document.getElementById('ranking-list');
const saveGameBtn = document.getElementById('save-game-btn');
const gamesContainer = document.getElementById('games-container');

// Punti standard (poi li rendiamo configurabili)
const POINT_PRESETS = [10, 20, -10, -20];

// Aggiunta squadra
teamForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = teamNameInput.value.trim();
    if (!name) return;

    // Evita doppioni
    const already = state.teams.some(t => t.name.toLowerCase() === name.toLowerCase());
    if (already) {
        alert('Esiste già una squadra con questo nome.');
        return;
    }

    const team = {
        id: teamIdCounter++,
        name,
        score: 0
    };
    state.teams.push(team);
    teamNameInput.value = '';
    renderTeams();
    renderRanking();
});

// Cambia punteggio
function changeScore(teamId, delta) {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;
    team.score += delta;
    renderTeams();
    renderRanking();
}

// Rimuovi squadra
function removeTeam(teamId) {
    state.teams = state.teams.filter(t => t.id !== teamId);
    renderTeams();
    renderRanking();
}

// Salva classifica parziale (fine gioco)
saveGameBtn.addEventListener('click', () => {
    if (state.teams.length === 0) {
        alert('Aggiungi almeno una squadra prima di salvare una classifica.');
        return;
    }

    const sortedTeams = [...state.teams]
        .sort((a, b) => b.score - a.score);

    const snapshot = sortedTeams.map(t => ({
        name: t.name,
        score: t.score
    }));

    const game = {
        id: gameIdCounter++,
        label: `Gioco ${state.games.length + 1}`,
        snapshot
    };

    state.games.push(game);
    renderGamesHistory();
});

// RENDER FUNCTIONS

function renderTeams() {
    teamList.innerHTML = '';

    state.teams.forEach(team => {
        const li = document.createElement('li');
        li.className = 'team-item';

        const info = document.createElement('div');
        info.className = 'team-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'team-name';
        nameSpan.textContent = team.name;

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'team-score';
        scoreSpan.textContent = `Punti: ${team.score}`;

        info.appendChild(nameSpan);
        info.appendChild(scoreSpan);

        const controls = document.createElement('div');
        controls.className = 'team-controls';

        // Bottoni punteggio standard
        POINT_PRESETS.forEach(value => {
            const btn = document.createElement('button');
            btn.textContent = value > 0 ? `+${value}` : `${value}`;
            if (value < 0) {
                btn.classList.add('btn-minus');
            }
            btn.addEventListener('click', () => changeScore(team.id, value));
            controls.appendChild(btn);
        });

        // Bottone rimozione
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = '✕';
        removeBtn.title = 'Rimuovi squadra';
        removeBtn.addEventListener('click', () => {
            if (confirm(`Vuoi rimuovere la squadra "${team.name}"?`)) {
                removeTeam(team.id);
            }
        });
        controls.appendChild(removeBtn);

        li.appendChild(info);
        li.appendChild(controls);
        teamList.appendChild(li);
    });
}

function renderRanking() {
    rankingList.innerHTML = '';

    const sorted = [...state.teams].sort((a, b) => b.score - a.score);

    sorted.forEach(team => {
        const li = document.createElement('li');
        li.textContent = `${team.name} – ${team.score} punti`;
        rankingList.appendChild(li);
    });
}

function renderGamesHistory() {
    gamesContainer.innerHTML = '';

    state.games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const title = document.createElement('h3');
        title.textContent = game.label;
        card.appendChild(title);

        const list = document.createElement('ol');
        game.snapshot.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name} – ${entry.score} punti`;
            list.appendChild(li);
        });

        card.appendChild(list);
        gamesContainer.appendChild(card);
    });
}

// Render iniziale
renderTeams();
renderRanking();
renderGamesHistory();