# ulnar.app

Landing page for **Ulnar Nerve** — we build tools for creators.

🌐 **Live:** [ulnar.app](https://ulnar.app)

---

## Projects

| Project | Description | Status |
|---------|-------------|--------|
| [Luz](https://github.com/your-org/luz) | Inventory management for resellers | In development |

---

## Development

No build step required. Just static HTML + Cloudflare Pages Functions.

```bash
# Clone the repo
git clone https://github.com/your-org/ulnar.app.git
cd ulnar.app

# Open in browser
open index.html

# Or use a local server
npx serve .
```

### Local development with Wrangler

To test the email signup function locally:

```bash
npm install -g wrangler
wrangler pages dev .
```

---

## Deployment

Hosted on [Cloudflare Pages](https://pages.cloudflare.com). Deploys automatically on push to `main`.

### Setup KV for Email Subscriptions

1. Go to Cloudflare Dashboard → **Workers & Pages** → **KV**
2. Click **Create a namespace**
3. Name it `ulnar-subscribers`
4. Go to your Pages project → **Settings** → **Functions** → **KV namespace bindings**
5. Add binding:
   - **Variable name:** `SUBSCRIBERS`
   - **KV namespace:** `ulnar-subscribers`
6. Redeploy

### View Subscribers

To export your subscriber list:

1. Go to **Workers & Pages** → **KV** → **ulnar-subscribers**
2. Find the key `subscriber_list`
3. Click to view/download the JSON array of emails

Or use Wrangler CLI:
```bash
wrangler kv:key get --namespace-id=YOUR_NAMESPACE_ID "subscriber_list"
```

---

## Structure

```
.
├── index.html              # Landing page
├── README.md
└── functions/
    └── api/
        └── subscribe.js    # Email signup handler
```

---

## License

© 2026 Ulnar Nerve
