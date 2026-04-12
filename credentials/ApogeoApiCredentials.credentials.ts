import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ApogeoApiCredentials implements ICredentialType {
  name = 'apogeoApiCredentials';
  displayName = 'ApogeoAPI';
  documentationUrl = 'https://api.apogeoapi.com/api/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Get your API key at https://apogeoapi.com',
    },
  ];
}
