# n8n-nodes-apogeoapi

An [n8n](https://n8n.io) community node for [ApogeoAPI](https://apogeoapi.com) — IP geolocation, country data, cities, states, and exchange rates in your n8n workflows.

---

## Installation

### In a self-hosted n8n instance

```bash
npm install n8n-nodes-apogeoapi
```

Then restart n8n. The node will appear in the node palette under **ApogeoAPI**.

### Via the n8n UI (v0.187+)

Go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-apogeoapi
```

---

## Credentials

1. Sign up at [apogeoapi.com](https://apogeoapi.com) and copy your API key from the dashboard.
2. In n8n, create a new credential of type **ApogeoAPI** and paste your API key.

---

## Supported Operations (8 total)

### Country

| Operation | Description |
|-----------|-------------|
| **Get Country** | Fetch full data for a country by ISO alpha-2 code (e.g. `US`, `DE`) |
| **List Countries** | List all countries, optionally filtered by region (Africa, Americas, Asia, Europe, Oceania) |
| **Search Countries** | Search countries by name or partial name |
| **Get States** | Get all states / provinces for a country |
| **Get Cities** | Get cities in a country, with optional state filter and result limit |

### IP Geolocation

| Operation | Description |
|-----------|-------------|
| **Geolocate IP** | Resolve an IPv4 or IPv6 address to country, city, timezone, coordinates, and more |

### Exchange Rate

| Operation | Description |
|-----------|-------------|
| **Get Rate** | Get the USD exchange rate for a single currency (e.g. `EUR`, `ARS`) |
| **List All Rates** | Retrieve exchange rates for all supported currencies at once |

---

## Example Workflow

1. Add an **ApogeoAPI** node.
2. Select **Resource → IP Geolocation** and **Operation → Geolocate IP**.
3. Set **IP Address** to `={{ $json.ip }}` to use a value from a previous node.
4. Connect the output to a downstream node — you'll get the full geolocation object as JSON.

---

## API Reference

Full API documentation: [https://api.apogeoapi.com/api/docs](https://api.apogeoapi.com/api/docs)

---

## License

MIT — © [ApogeoAPI](https://apogeoapi.com)
