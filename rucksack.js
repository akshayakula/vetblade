document.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('rucksackList');
    if (list) {
        fetch('/.netlify/functions/get-rucksack')
            .then(res => res.json())
            .then(items => {
                items.forEach((item, idx) => {
                    const card = document.createElement('div');
                    card.className = 'rucksack-card';
                    card.style.animationDelay = `${idx * 0.1}s`;
                    card.innerHTML = `
                        <div class="feature-icon military-icon">🎒</div>
                        <h3>${item.name}</h3>
                        <p><a href="${item.website}" target="_blank">${item.website}</a></p>
                        <p>Phone: ${item.phone}</p>
                    `;
                    list.appendChild(card);
                });
            })
            .catch(err => console.log('Error fetching rucksack:', err));
    }

    // Reveal registration form
    const showBtn = document.getElementById('showRegisterBtn');
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            const regSection = document.getElementById('registerSection');
            if (regSection) regSection.classList.toggle('hidden');
            regSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Reuse registration logic from script.js: new entries append to rucksackListRegister
    const registerBtn = document.getElementById('registerService');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const name = document.getElementById('orgName').value.trim();
            const website = document.getElementById('orgWebsite').value.trim();
            const phone = document.getElementById('orgPhone').value.trim();
            if (!name || !website || !phone) {
                showMilitaryNotification('🔴 Please fill in all fields', 'error');
                return;
            }
            const card = document.createElement('div');
            card.className = 'rucksack-card';
            card.innerHTML = `
                <div class="feature-icon military-icon">🎒</div>
                <h3>${name}</h3>
                <p><a href="${website}" target="_blank">${website}</a></p>
                <p>Phone: ${phone}</p>
            `;
            const container = document.getElementById('rucksackListRegister');
            container.appendChild(card);
            showMilitaryNotification('✔️ Service registered locally', 'success');
            // Reset form
            document.getElementById('orgName').value = '';
            document.getElementById('orgWebsite').value = '';
            document.getElementById('orgPhone').value = '';
        });
    }
}); 