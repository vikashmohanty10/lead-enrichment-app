// Get lead ID from URL
const leadId = window.location.pathname.split('/').pop();

async function loadLeadDetails() {
    try {
        const response = await fetch(`/api/leads/${leadId}`);
        const lead = await response.json();
        
        // Update page content
        document.getElementById('company-name').textContent = lead.company_name;
        document.getElementById('company-industry').textContent = lead.industry;
        
        // Contact information
        document.getElementById('contact-name').textContent = lead.contact_name;
        document.getElementById('contact-email').textContent = lead.contact_email;
        document.getElementById('job-title').textContent = lead.job_title || '-';
        
        const websiteLink = document.getElementById('website');
        websiteLink.textContent = lead.website;
        websiteLink.href = lead.website;
        
        if (lead.linkedin_url) {
            const linkedinLink = document.getElementById('linkedin');
            linkedinLink.textContent = 'View Profile';
            linkedinLink.href = lead.linkedin_url;
        } else {
            document.getElementById('linkedin').textContent = '-';
        }
        
        // Lead scoring
        document.getElementById('lead-score').textContent = lead.lead_score;
        
        const tierBadge = document.getElementById('lead-tier');
        tierBadge.textContent = lead.lead_tier;
        tierBadge.className = `tier-badge tier-${lead.lead_tier.toLowerCase()}`;
        
        document.getElementById('fit-score').textContent = `${lead.lead_score}/10`;
        
        // Recommended services
        const services = lead.recommended_services.split(', ');
        const servicesHtml = services.map(service => 
            `<span class="service-tag">${service}</span>`
        ).join('');
        document.getElementById('services-list').innerHTML = servicesHtml;
        
        // Pain points
        if (lead.enrichment_data && lead.enrichment_data.pain_points) {
            const painPointsHtml = lead.enrichment_data.pain_points.map(point => 
                `<span class="pain-point-tag">${point}</span>`
            ).join('');
            document.getElementById('pain-points-list').innerHTML = painPointsHtml;
        } else {
            document.getElementById('pain-points-list').innerHTML = '<p>No pain points identified yet</p>';
        }
        
        // Email content
        document.getElementById('email-content').textContent = lead.personalized_email;
        
        // Status select
        document.getElementById('status-select').value = lead.status;
        
    } catch (error) {
        console.error('Error loading lead details:', error);
        alert('Error loading lead details');
    }
}

// Status change handler
document.getElementById('status-select').addEventListener('change', async (e) => {
    const newStatus = e.target.value;
    
    try {
        const response = await fetch(`/api/leads/${leadId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            // Show success feedback (you can add a toast notification here)
            console.log('Status updated successfully');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
});

// Copy email functionality
document.getElementById('copy-email-btn').addEventListener('click', () => {
    const emailContent = document.getElementById('email-content').textContent;
    
    navigator.clipboard.writeText(emailContent).then(() => {
        const btn = document.getElementById('copy-email-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Error copying text:', err);
        alert('Error copying email');
    });
});

// Load on page load
document.addEventListener('DOMContentLoaded', loadLeadDetails);
