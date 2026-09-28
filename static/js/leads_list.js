let allLeads = [];
let currentFilter = 'all';

async function loadLeads() {
    try {
        const response = await fetch('/api/leads');
        allLeads = await response.json();
        displayLeads(allLeads);
    } catch (error) {
        console.error('Error loading leads:', error);
        document.getElementById('leads-table-body').innerHTML = 
            '<tr><td colspan="9" class="loading">Error loading leads</td></tr>';
    }
}

function displayLeads(leads) {
    const tbody = document.getElementById('leads-table-body');
    
    if (leads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No leads found</td></tr>';
        return;
    }
    
    const html = leads.map(lead => {
        const createdDate = new Date(lead.created_at).toLocaleDateString();
        const tierClass = `tier-${lead.lead_tier.toLowerCase()}`;
        
        return `
            <tr>
                <td><strong>${lead.company_name}</strong></td>
                <td>${lead.contact_name}<br><small>${lead.contact_email}</small></td>
                <td>${lead.industry}</td>
                <td><strong>${lead.lead_score}/10</strong></td>
                <td><span class="tier-badge ${tierClass}">${lead.lead_tier}</span></td>
                <td><span class="status-badge">${lead.status}</span></td>
                <td><small>${lead.recommended_services}</small></td>
                <td>${createdDate}</td>
                <td>
                    <a href="/lead/${lead.id}" class="btn btn-small btn-secondary">View</a>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter leads
        const filter = btn.dataset.filter;
        currentFilter = filter;
        applyFilters();
    });
});

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    applyFilters();
});

function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    let filtered = allLeads;
    
    // Apply tier filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(lead => lead.lead_tier === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(lead => 
            lead.company_name.toLowerCase().includes(searchTerm) ||
            lead.contact_name.toLowerCase().includes(searchTerm)
        );
    }
    
    displayLeads(filtered);
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadLeads);
