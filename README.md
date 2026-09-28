# Lead Enrichment Web App - Webverse Innovators

A comprehensive web application for enriching sales leads, generating personalized outreach emails, and tracking lead status.

## Features

✅ **Lead Enrichment** - Automatically research and enrich lead information  
✅ **Personalized Email Generation** - Create custom outreach emails based on pain points  
✅ **Lead Tracking** - Track lead status from New → Contacted → Qualified → Won/Lost  
✅ **Dashboard Analytics** - View Hot/Warm/Cold lead distribution  
✅ **Search & Filter** - Find leads quickly by company, contact, or tier  
✅ **Export Functionality** - Export enriched lead data  

## Installation

### 1. Install Dependencies

```bash
cd /home/ubuntu/lead_enrichment_app
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

The application will start on **http://localhost:8080**

### 3. Access the Web App

Open your browser and navigate to:
- **Dashboard**: http://localhost:8080/
- **Add New Lead**: http://localhost:8080/new-lead
- **All Leads**: http://localhost:8080/leads

## Usage Guide

### Adding a New Lead

1. Click **"+ Add New Lead"** from the dashboard
2. Fill in the lead information:
   - Company Name (required)
   - Website URL (required)
   - Contact Name (required)
   - Contact Email (required)
   - Job Title (optional)
   - Industry (required)
   - LinkedIn Profile (optional)
3. Click **"🔍 Enrich Lead & Generate Email"**
4. View the enriched data and personalized email

### Managing Leads

- **View All Leads**: Click "All Leads" in the navigation
- **Filter by Tier**: Click Hot 🔥, Warm ⭐, or Cold ❄️ buttons
- **Search**: Use the search box to find specific companies or contacts
- **Update Status**: Click on a lead and change the status dropdown

### Lead Status Workflow

1. **New** - Just added to the system
2. **Contacted** - Initial outreach sent
3. **Qualified** - Lead shows interest
4. **Proposal Sent** - Proposal/quote sent
5. **Won** - Deal closed successfully
6. **Lost** - Did not convert

## Database

The application uses SQLite database located at `database/leads.db`

### Database Schema

```sql
leads
├── id (INTEGER PRIMARY KEY)
├── company_name (TEXT)
├── website (TEXT)
├── contact_name (TEXT)
├── contact_email (TEXT)
├── job_title (TEXT)
├── industry (TEXT)
├── linkedin_url (TEXT)
├── enrichment_data (TEXT JSON)
├── personalized_email (TEXT)
├── lead_score (INTEGER)
├── lead_tier (TEXT: Hot/Warm/Cold)
├── recommended_services (TEXT)
├── status (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Customization

### Integrating Real Enrichment

To integrate with actual web research tools, modify the `enrich_lead()` function in `app.py`:

```python
@app.route('/api/enrich', methods=['POST'])
def enrich_lead():
    data = request.json
    
    # TODO: Add actual web research integration
    # - Web scraping
    # - SEO analysis
    # - Social media checks
    # - Tech stack detection
    
    enrichment_data = perform_actual_enrichment(data)
    personalized_email = generate_email(data, enrichment_data)
    # ... rest of the code
```

### Customizing Email Templates

Edit the `generate_email()` function in `app.py` to customize the email format:

```python
def generate_email(lead_data, enrichment_data):
    # Customize email template here
    # Use lead_data and enrichment_data to personalize
```

### Styling

All styles are in `static/css/style.css`. The design uses:
- Gradient purple theme (#667eea to #764ba2)
- Modern card-based layout
- Responsive design for mobile/tablet/desktop

## API Endpoints

### GET /api/leads
Get all leads

### GET /api/leads/<lead_id>
Get specific lead details

### POST /api/enrich
Enrich a new lead
```json
{
  "company_name": "Bilby Dental",
  "website": "https://bilbydental.com.au",
  "contact_name": "Rohit Sharma",
  "contact_email": "reception@bilbydental.com.au",
  "job_title": "Director",
  "industry": "Dental Health Care",
  "linkedin_url": "https://linkedin.com/in/..."
}
```

### PUT /api/leads/<lead_id>/status
Update lead status
```json
{
  "status": "Contacted"
}
```

## Deployment

### For Production Deployment:

1. **Use a production WSGI server** (not Flask's dev server):
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8080 app:app
```

2. **Set up a reverse proxy** (Nginx recommended)

3. **Use a production database** (PostgreSQL recommended)

4. **Add authentication** for team access

5. **Enable HTTPS** with SSL certificate

## Security Notes

⚠️ **Important for Production:**

- Add user authentication
- Implement CSRF protection
- Use environment variables for sensitive data
- Enable HTTPS
- Add rate limiting
- Sanitize all user inputs
- Use a production database with backups

## Support

For questions or issues, contact the development team at Webverse Innovators.

## License

© 2025 Webverse Innovators. All rights reserved.
