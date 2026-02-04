# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for Ulnar Nerve (ulnar.app) - a company that builds tools for creators. The site is a static HTML/CSS/JS landing page with Cloudflare Pages Functions for backend functionality.

## Development Commands

```bash
# Local development - simple static preview
open index.html
# or
npx serve .

# Local development with Cloudflare Functions (required for testing API endpoints)
wrangler pages dev .

# View KV data (subscribers/inquiries)
wrangler kv:key get --namespace-id=YOUR_NAMESPACE_ID "subscriber_list"
wrangler kv:key get --namespace-id=YOUR_NAMESPACE_ID "inquiry_list"
```

## Architecture

**No build step** - pure static HTML/CSS/JS served via Cloudflare Pages.

### Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **Backend**: Cloudflare Pages Functions (serverless)
- **Storage**: Cloudflare KV for email subscribers and form inquiries
- **Hosting**: Cloudflare Pages (auto-deploys on push to `main`)

### Key Files
- `index.html` - Main landing page with embedded JS form handlers
- `styles.css` - Global styles, responsive breakpoints at 768px/600px/480px
- `functions/api/subscribe.js` - Email subscription endpoint (POST /api/subscribe)
- `functions/api/inquiry.js` - Contact form endpoint (POST /api/inquiry)

### Cloudflare KV Bindings
The functions expect these KV namespace bindings configured in Cloudflare:
- `SUBSCRIBERS` - stores email signups (keys: individual emails + `subscriber_list`)
- `INQUIRIES` - stores form submissions (keys: timestamped entries + `inquiry_list`)

### Form Handler Pattern
Both API endpoints follow the same pattern:
1. Validate request method (POST only)
2. Parse and validate JSON body
3. Store individual entry in KV with metadata
4. Update list key for easy export
5. Return JSON response with CORS headers
