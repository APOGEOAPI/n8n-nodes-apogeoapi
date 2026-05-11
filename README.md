# n8n-nodes-apogeoapi

[![npm version](https://img.shields.io/npm/v/n8n-nodes-apogeoapi.svg)](https://www.npmjs.com/package/n8n-nodes-apogeoapi)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-apogeoapi.svg)](https://www.npmjs.com/package/n8n-nodes-apogeoapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

n8n community node for [ApogeoAPI](https://apogeoapi.com) — geographic data, live exchange rates, and IP geolocation in your n8n workflows.

> **250+ countries · 5,000+ states · 150,000+ cities · 161+ live currency rates · IP geolocation**

---

## Installation

### Via the n8n UI (recommended, v0.187+)

1. Go to **Settings → Community Nodes → Install**.
2. Enter: `n8n-nodes-apogeoapi`.
3. Agree to the risks and click **Install**.

The **ApogeoAPI** node will appear in the node palette.

### Self-hosted n8n

```bash
npm install n8n-nodes-apogeoapi
```

Restart n8n and reload the editor.

---

## Credentials

1. Create a free account at [apogeoapi.com](https://apogeoapi.com) — no credit card.
2. Copy your API key from the dashboard → **API Keys**.
3. In n8n, create a new credential of type **ApogeoAPI** and paste your key.

The free tier includes **1,000 requests/month** (countries + states). Paid plans unlock cities, IP geolocation, and live FX rates.

---

## Operations

| Operation | Description | Requires paid plan |
|-----------|-------------|---------------------|
| **Get Country** | Full country data by ISO-2 or ISO-3 code (name, capital, region, population, currency, flag, coordinates, **live USD exchange rate**) | No |
| **List Countries** | All 250+ countries with filtering by region | No |
| **Search Countries** | Find countries by name, region, currency, language | No |
| **Get States** | States/provinces for a country | No |
| **Get Cities** | 150,000+ cities with coordinates, population, state | Yes (Basic+) |
| **Get Exchange Rate** | Live USD rate for 161 currencies (refreshed every 4h) | Yes (Basic+) |
| **Geolocate IP** | Country, region, city, timezone, ISP from any IP | Yes (Basic+) |
| **Global Search** | Fuzzy search across countries, cities, and currencies | No |

All operations return typed JSON — no mapping required.

---

## Example workflows

### 1. IP → enrich + Slack notification

Detect the country of a webhook visitor and post a formatted message to Slack.

```
Webhook ─▶ ApogeoAPI (Geolocate IP) ─▶ Set (format message) ─▶ Slack
```

Use the `ip` field from the webhook request. ApogeoAPI returns country, city, timezone, and flag URL that you can include in the Slack message.

### 2. Lead CRM → currency rate → USD normalization

Every time a new deal is added to your CRM, fetch the live USD rate for its local currency and update the deal value in USD.

```
HubSpot (New Deal) ─▶ ApogeoAPI (Get Exchange Rate, currency={{$json.currency}}) ─▶ HubSpot (Update Deal, valueUSD={{$json.amount / $json.rate}})
```

### 3. Form submission → localized welcome email

When a user signs up, detect their country from IP, and send them a welcome email in the correct language.

```
Typeform ─▶ ApogeoAPI (Geolocate IP) ─▶ Switch (by country) ─▶ SendGrid (template per region)
```

More templates coming soon at [n8n.io/workflows](https://n8n.io/workflows).

---

## Links

- **API documentation**: https://api.apogeoapi.com/api/docs
- **Landing**: https://apogeoapi.com
- **GitHub (node source)**: https://github.com/APOGEOAPI/n8n-nodes-apogeoapi
- **Dashboard / signup**: https://app.apogeoapi.com
- **Issues & feature requests**: https://github.com/APOGEOAPI/n8n-nodes-apogeoapi/issues
- **Email**: support@apogeoapi.com

---

## License

MIT © [ApogeoAPI](https://apogeoapi.com)
