document.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('rucksackList');
    const regList = document.getElementById('rucksackListRegister');
    if (list) {
        fetch('/.netlify/functions/get-rucksack')
            .then(res => res.json())
            .then(items => {
                items.forEach((item, idx) => {
                    const card = document.createElement('div');
                    card.className = 'rucksack-card';
                    card.style.animationDelay = `${idx * 0.1}s`;
                    card.innerHTML = `
                        <div class="feature-icon military-icon">
                            <img src="assets/rucksack.svg" alt="Rucksack Icon">
                        </div>
                        <h3>${item.name}</h3>
                        ${item.website ? `<p><a href="${item.website}" target="_blank" class="link-icon">🔗</a></p>` : ``}
                        ${item.phone && item.phone !== 'N/A' ? `<p><a href="tel:${item.phone.replace(/[^0-9+]/g, '')}">${item.phone}</a></p>` : ``}
                    `;
                    // Append to main list
                    list.appendChild(card);
                    // Also append to register section if present
                    if (regList) {
                        const regCard = card.cloneNode(true);
                        // Clear animation delay for register list
                        regCard.style.animationDelay = '';
                        regList.appendChild(regCard);
                    }
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
        registerBtn.addEventListener('click', async () => {
            const name = document.getElementById('orgName').value.trim();
            const website = document.getElementById('orgWebsite').value.trim();
            const phone = document.getElementById('orgPhone').value.trim();
            if (!name || !website || !phone) {
                showMilitaryNotification('🔴 Please fill in all fields', 'error');
                return;
            }
            try {
                const response = await fetch('/.netlify/functions/add-rucksack', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, website, phone })
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Error registering service');
                }
                const card = document.createElement('div');
                card.className = 'rucksack-card';
                card.innerHTML = `
                    <div class="feature-icon military-icon">
                        <img src="assets/rucksack.svg" alt="Rucksack Icon">
                    </div>
                    <h3>${result.name}</h3>
                    ${result.website ? `<p><a href="${result.website}" target="_blank" class="link-icon">🔗</a></p>` : ``}
                    ${result.phone && result.phone !== 'N/A' ? `<p><a href="tel:${result.phone.replace(/[^0-9+]/g, '')}">${result.phone}</a></p>` : ``}
                `;
                // Append to register section
                const regContainer = document.getElementById('rucksackListRegister');
                regContainer.appendChild(card);
                // Also append to main listing
                const mainList = document.getElementById('rucksackList');
                if (mainList) {
                    mainList.appendChild(card.cloneNode(true));
                }
                showMilitaryNotification('✔️ Service registered', 'success');
                // Reset form
                document.getElementById('orgName').value = '';
                document.getElementById('orgWebsite').value = '';
                document.getElementById('orgPhone').value = '';
            } catch (err) {
                showMilitaryNotification(`🔴 ${err.message}`, 'error');
            }
        });
    }
}); 