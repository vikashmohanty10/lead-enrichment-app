document.getElementById('enrichment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        company_name: document.getElementById('company_name').value,
        website: document.getElementById('website').value,
        contact_name: document.getElementById('contact_name').value,
        contact_email: document.getElementById('contact_email').value,
        job_title: document.getElementById('job_title').value,
        industry: document.getElementById('industry').value,
        linkedin_url: document.getElementById('linkedin_url').value
    };
    
    try {
        const response = await fetch('/api/enrich', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            document.getElementById('result-container').style.display = 'block';
            document.getElementById('view-lead-link').href = `/lead/${result.lead_id}`;
            
            // Scroll to result
            document.getElementById('result-container').scrollIntoView({ behavior: 'smooth' });
            
            // Reset form
            document.getElementById('enrichment-form').reset();
        } else {
            alert('Error enriching lead. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error enriching lead. Please check your connection and try again.');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});
