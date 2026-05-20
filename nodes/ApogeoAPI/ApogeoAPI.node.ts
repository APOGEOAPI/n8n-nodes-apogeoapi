import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

const BASE_URL = 'https://api.apogeoapi.com/v1';

export class ApogeoAPI implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ApogeoAPI',
    name: 'apogeoAPI',
    icon: 'file:apogeoapi.svg',
    group: ['transform'],
    version: 1,
    description: 'IP geolocation, countries, cities, and exchange rates',
    defaults: {
      name: 'ApogeoAPI',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'apogeoApiCredentials',
        required: true,
      },
    ],
    properties: [
      // ─── Resource ──────────────────────────────────────────────────
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Country', value: 'country' },
          { name: 'IP Geolocation', value: 'ipGeolocation' },
          { name: 'Exchange Rate', value: 'exchangeRate' },
        ],
        default: 'country',
      },

      // ─── Country operations ────────────────────────────────────────
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['country'] } },
        options: [
          {
            name: 'Get Country',
            value: 'getCountry',
            description: 'Get a country by ISO code',
            action: 'Get a country by ISO code',
          },
          {
            name: 'List Countries',
            value: 'listCountries',
            description: 'List all countries, optionally filtered by region',
            action: 'List all countries',
          },
          {
            name: 'Search Countries',
            value: 'searchCountries',
            description: 'Search countries by name',
            action: 'Search countries by name',
          },
          {
            name: 'Get States',
            value: 'getStates',
            description: 'Get all states/provinces of a country',
            action: 'Get states of a country',
          },
          {
            name: 'Get Cities',
            value: 'getCities',
            description: 'Get cities in a country, optionally filtered by state',
            action: 'Get cities in a country',
          },
        ],
        default: 'getCountry',
      },

      // ─── IP Geolocation operations ─────────────────────────────────
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['ipGeolocation'] } },
        options: [
          {
            name: 'Geolocate IP',
            value: 'geolocateIp',
            description: 'Get geolocation data for an IP address',
            action: 'Geolocate an IP address',
          },
        ],
        default: 'geolocateIp',
      },

      // ─── Exchange Rate operations ──────────────────────────────────
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['exchangeRate'] } },
        options: [
          {
            name: 'Get Rate',
            value: 'getRate',
            description: 'Get the USD exchange rate for a currency',
            action: 'Get exchange rate for a currency',
          },
          {
            name: 'List All Rates',
            value: 'listRates',
            description: 'List exchange rates for all available currencies',
            action: 'List all exchange rates',
          },
        ],
        default: 'getRate',
      },

      // ─── Country Code (Get Country / Get States / Get Cities) ──────
      {
        displayName: 'Country Code',
        name: 'countryCode',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'US',
        description: 'ISO 3166-1 alpha-2 country code (e.g. US, DE, AR)',
        displayOptions: {
          show: {
            resource: ['country'],
            operation: ['getCountry', 'getStates', 'getCities'],
          },
        },
      },

      // ─── Region filter (List Countries) ───────────────────────────
      {
        displayName: 'Region',
        name: 'region',
        type: 'options',
        default: 'all',
        description: 'Filter countries by region',
        displayOptions: {
          show: { resource: ['country'], operation: ['listCountries'] },
        },
        options: [
          { name: 'All', value: 'all' },
          { name: 'Africa', value: 'Africa' },
          { name: 'Americas', value: 'Americas' },
          { name: 'Asia', value: 'Asia' },
          { name: 'Europe', value: 'Europe' },
          { name: 'Oceania', value: 'Oceania' },
        ],
      },

      // ─── Query (Search Countries) ──────────────────────────────────
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Germany',
        description: 'Country name or partial name to search for',
        displayOptions: {
          show: { resource: ['country'], operation: ['searchCountries'] },
        },
      },

      // ─── State filter (Get Cities) ─────────────────────────────────
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        placeholder: 'California',
        description: 'Filter cities by state/province name (optional)',
        displayOptions: {
          show: { resource: ['country'], operation: ['getCities'] },
        },
      },

      // ─── Limit (Get Cities) ────────────────────────────────────────
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1, maxValue: 500 },
        default: 50,
        description: 'Max number of cities to return',
        displayOptions: {
          show: { resource: ['country'], operation: ['getCities'] },
        },
      },

      // ─── IP address (Geolocate IP) ─────────────────────────────────
      {
        displayName: 'IP Address',
        name: 'ip',
        type: 'string',
        required: true,
        default: '',
        placeholder: '8.8.8.8',
        description: 'IPv4 or IPv6 address to geolocate',
        displayOptions: {
          show: { resource: ['ipGeolocation'], operation: ['geolocateIp'] },
        },
      },

      // ─── Currency Code (Get Rate) ──────────────────────────────────
      {
        displayName: 'Currency Code',
        name: 'currencyCode',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'EUR',
        description: 'ISO 4217 currency code (e.g. EUR, GBP, ARS)',
        displayOptions: {
          show: { resource: ['exchangeRate'], operation: ['getRate'] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Auth is injected by httpRequestWithAuthentication from the credential's
    // `authenticate` definition (X-API-Key header) — no manual getCredentials.
    const headers = {
      'Content-Type': 'application/json',
    };

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      let url = '';
      const qs: Record<string, string | number> = {};

      try {
        if (resource === 'country') {
          if (operation === 'getCountry') {
            const code = (
              this.getNodeParameter('countryCode', i) as string
            ).toUpperCase();
            url = `${BASE_URL}/countries/${code}`;
          } else if (operation === 'listCountries') {
            const region = this.getNodeParameter('region', i) as string;
            url = `${BASE_URL}/countries`;
            if (region && region !== 'all') {
              qs['region'] = region;
            }
          } else if (operation === 'searchCountries') {
            const query = this.getNodeParameter('query', i) as string;
            url = `${BASE_URL}/countries/search`;
            qs['q'] = query;
          } else if (operation === 'getStates') {
            const code = (
              this.getNodeParameter('countryCode', i) as string
            ).toUpperCase();
            url = `${BASE_URL}/countries/${code}/states`;
          } else if (operation === 'getCities') {
            const code = (
              this.getNodeParameter('countryCode', i) as string
            ).toUpperCase();
            const state = this.getNodeParameter('state', i) as string;
            const limit = this.getNodeParameter('limit', i) as number;
            url = `${BASE_URL}/countries/${code}/cities`;
            if (state) qs['state'] = state;
            qs['limit'] = limit;
          }
        } else if (resource === 'ipGeolocation') {
          if (operation === 'geolocateIp') {
            const ip = this.getNodeParameter('ip', i) as string;
            url = `${BASE_URL}/ip/${ip}`;
          }
        } else if (resource === 'exchangeRate') {
          if (operation === 'getRate') {
            const currency = (
              this.getNodeParameter('currencyCode', i) as string
            ).toUpperCase();
            url = `${BASE_URL}/exchange-rates/${currency}`;
          } else if (operation === 'listRates') {
            url = `${BASE_URL}/exchange-rates`;
          }
        }

        if (!url) {
          throw new NodeOperationError(
            this.getNode(),
            `Unknown resource/operation: ${resource}/${operation}`,
            { itemIndex: i },
          );
        }

        // Build query string
        const queryString = Object.keys(qs)
          .map(
            (k) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(qs[k]))}`,
          )
          .join('&');
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const responseData = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'apogeoApiCredentials',
          {
            method: 'GET',
            url: fullUrl,
            headers,
            json: true,
          },
        );

        // Normalise: if the response is an array, spread it; otherwise wrap it
        if (Array.isArray(responseData)) {
          returnData.push(
            ...this.helpers.returnJsonArray(responseData as IDataObject[]),
          );
        } else {
          returnData.push(
            ...this.helpers.returnJsonArray([responseData as IDataObject]),
          );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
