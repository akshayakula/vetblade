document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const edipi = params.get('edipi');
    const loader = document.querySelector('.verification-loader');
    const dataContainer = document.querySelector('.verification-data');

    if (!edipi) {
        loader.innerHTML = '<p>Invalid link: EDIPI not provided.</p>';
        return;
    }

    fetch(`/.netlify/functions/get-deers?edipi=${edipi}`)
        .then(response => response.json().then(body => ({ status: response.status, body })))
        .then(({ status, body }) => {
            if (status !== 200) {
                loader.innerHTML = `<p>Error: ${body.error}</p>`;
                return;
            }
            // Simulate a verification delay
            setTimeout(() => {
                // Hide loader visuals
                const ring = document.querySelector('.loader-ring');
                if (ring) ring.style.display = 'none';
                loader.querySelector('p').textContent = 'Verification complete.';

                // Show data
                dataContainer.style.display = 'block';
                dataContainer.style.opacity = '1';

                const fields = ['edipi', 'first_name', 'last_name', 'email', 'branch', 'rank', 'eligibility', 'deers_id'];
                fields.forEach((field, idx) => {
                    const div = document.createElement('div');
                    div.className = 'data-item';
                    div.style.animationDelay = `${idx * 0.1}s`;
                    const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    div.innerHTML = `<strong>${label}:</strong> ${body[field]}`;
                    dataContainer.appendChild(div);
                });
            }, 2000);
        })
        .catch(err => {
            loader.innerHTML = `<p>Network error: ${err.message}</p>`;
        });
}); 