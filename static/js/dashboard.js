// Load dashboard data
async function loadDashboard() {
    try {
        const response = await fetch('/api/leads');
        const leads = await response.json();
        
        // Calculate stats
        const totalLeads = leads.length;
        const hotLeads = leads.filter(l => l.lead_tier === 'Hot').length;
        const warmLeads = leads.filter(l => l.lead_tier === 'Warm').length;
        const coldLeads = leads.filter(l => l.lead_tier === 'Cold').length;
        
        // Update stats
        document.getElementById('total-leads').textContent = totalLeads;
        document.getElementById('hot-leads').textContent = hotLeads;
        document.getElementById('warm-leads').textContent = warmLeads;
        document.getElementById('cold-leads').textContent = coldLeads;
        
        // Display recent leads
        displayRecentLeads(leads.slice(0, 5));
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('recent-leads-list').innerHTML = '<p>Error loading leads</p>';
    }
}

function displayRecentLeads(leads) {
    const container = document.getElementById('recent-leads-list');
    
    if (leads.length === 0) {
        container.innerHTML = '<p>No leads yet. <a href="/new-lead">Add your first lead</a></p>';
        return;
    }
    
    const html = leads.map(lead => `
        <div class="lead-item" style="padding: 1rem; border-bottom: 1px solid #e1e8ed;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin-bottom: 0.5rem;">${lead.company_name}</h4>
                    <p style="color: #666; font-size: 0.9rem;">
                        ${lead.contact_name} • ${lead.industry}
                    </p>
                </div>
                <div style="text-align: right;">
                    <span class="tier-badge tier-${lead.lead_tier.toLowerCase()}">${lead.lead_tier}</span>
                    <div style="margin-top: 0.5rem;">
                        <a href="/lead/${lead.id}" class="btn btn-small btn-secondary">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadDashboard);
