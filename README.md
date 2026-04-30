# CV PDF Engine 

A backend service for generating clean, structured, and non-overflowing CV PDFs for the Catch That Scholarship resume builder.

##  Project Purpose

This project powers the PDF generation feature of:
https://catchthatscholarship.com

The goal is to ensure:
- Clean formatting
- No content overflow
- Consistent layout across devices
- Professional-looking resumes

---

##  Tech Stack

- Node.js
- Puppeteer (for PDF generation)
- Express.js (server handling)
- Docker (for deployment)

---

## Features

- Generate PDF from HTML resume templates
- Prevent text/content overflow across pages
- Maintain consistent margins and spacing
- Scalable backend for resume downloads
- Dockerized for easy deployment

---

## Current Challenges

- Handling dynamic content length
- Avoiding page breaks in awkward positions
- Optimizing PDF rendering speed
- Font consistency across systems

---

## What I Learned

- How Puppeteer renders HTML to PDF
- Managing layout issues in print format
- Backend handling for file generation
- Debugging real-world UI/UX problems

---

## Future Improvements

- Add multiple CV templates
- Optimize performance for large traffic
- Add preview before download
- Improve typography and spacing

---

## How to Run Locally

```bash
git clone https://github.com/your-username/cv-pdf-engine.git
cd cv-pdf-engine
npm install
node server.js
