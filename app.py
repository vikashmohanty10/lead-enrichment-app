from flask import Flask, render_template, request, jsonify, send_file
import sqlite3
import json
from datetime import datetime
import os
import csv
import io

app = Flask(__name__)

# Database initialization
def init_db():
    conn = sqlite3.connect('database/leads.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS leads
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  company_name TEXT,
                  website TEXT,
                  contact_name TEXT,
                  contact_email TEXT,
                  job_title TEXT,
                  industry TEXT,
                  linkedin_url TEXT,
                  enrichment_data TEXT,
                  personalized_email TEXT,
                  lead_score INTEGER,
                  lead_tier TEXT,
                  recommended_services TEXT,
                  status TEXT DEFAULT 'New',
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/new-lead')
def new_lead():
    return render_template('new_lead.html')

@app.route('/leads')
def leads_list():
    return render_template('leads_list.html')

@app.route('/api/leads', methods=['GET'])
def get_leads():
    conn = sqlite3.connect('database/leads.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM leads ORDER BY created_at DESC')
    leads = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(leads)

@app.route('/api/leads/<int:lead_id>', methods=['GET'])
def get_lead(lead_id):
    conn = sqlite3.connect('database/leads.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM leads WHERE id = ?', (lead_id,))
    lead = dict(c.fetchone())
    conn.close()
    
    # Parse JSON fields
    if lead['enrichment_data']:
        lead['enrichment_data'] = json.loads(lead['enrichment_data'])
    
    return jsonify(lead)

@app.route('/api/leads/<int:lead_id>/status', methods=['PUT'])
def update_lead_status(lead_id):
    data = request.json
    status = data.get('status')
    
    conn = sqlite3.connect('database/leads.db')
    c = conn.cursor()
    c.execute('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?',
              (status, datetime.now(), lead_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/enrich', methods=['POST'])
def enrich_lead():
    data = request.json
    
    # Simulate enrichment (in production, integrate with actual enrichment tools)
    company_name = data.get('company_name', '')
    website = data.get('website', '')
    
    enrichment_data = {
        'company_description': f'{company_name} - Full enrichment pending',
        'website_quality': '4/10 - Requires modernization',
        'pain_points': [
            'Outdated Website Design',
            'Limited Marketing Automation',
            'No AI/Chatbot Integration',
            'Inconsistent Content Strategy'
        ],
        'fit_score': 8,
        'recommended_services': ['Website Redesign', 'Marketing Automation', 'AI Chatbot', 'Content Marketing', 'SEO'],
        'lead_tier': 'Hot'
    }
    
    personalized_email = generate_email(data, enrichment_data)
    
    # Save to database
    conn = sqlite3.connect('database/leads.db')
    c = conn.cursor()
    c.execute('''INSERT INTO leads 
                 (company_name, website, contact_name, contact_email, job_title, 
                  industry, linkedin_url, enrichment_data, personalized_email, 
                  lead_score, lead_tier, recommended_services, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              (data.get('company_name'), data.get('website'), data.get('contact_name'),
               data.get('contact_email'), data.get('job_title'), data.get('industry'),
               data.get('linkedin_url'), json.dumps(enrichment_data), personalized_email,
               enrichment_data['fit_score'], enrichment_data['lead_tier'],
               ', '.join(enrichment_data['recommended_services']), 'New'))
    
    lead_id = c.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'lead_id': lead_id,
        'enrichment_data': enrichment_data,
        'personalized_email': personalized_email
    })

def generate_email(lead_data, enrichment_data):
    company_name = lead_data.get('company_name', 'your company')
    contact_name = lead_data.get('contact_name', 'there')
    services = enrichment_data.get('recommended_services', [])
    
    email = f"""Subject: {company_name}'s digital transformation opportunity

Hi {contact_name},

I came across {company_name} and noticed significant opportunities for digital growth.

**Key Issues Identified:**

"""
    
    pain_points = enrichment_data.get('pain_points', [])
    for i, pain_point in enumerate(pain_points, 1):
        email += f"{i}. **{pain_point}** - This is limiting your growth potential\n"
    
    email += f"""
**Recommended Services for {company_name}:**

"""
    
    for service in services:
        email += f"✅ {service}\n"
    
    email += f"""

At Webverse Innovators, we specialize in digital transformation for businesses like yours.

Would you be open to a 15-minute call this week?

Best regards,
[Your Name]
Webverse Innovators
"""
    
    return email

@app.route('/lead/<int:lead_id>')
def view_lead(lead_id):
    return render_template('lead_detail.html', lead_id=lead_id)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='0.0.0.0', port=port)
