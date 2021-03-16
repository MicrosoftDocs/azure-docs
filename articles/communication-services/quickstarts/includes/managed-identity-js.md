## Add managed identity to your Communication Services solution (JS)

### Install the client library packages

```console
npm install @azure/communication-identity
npm install @azure/communication-common
npm install @azure/communication-sms
npm install @azure/identity
```

### Use the client library packages

Add the following `import` directives to your code to use the Azure Identity and Azure Storage client libraries.

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { CommunicationIdentityClient, CommunicationUserToken } from "@azure/communication-identity";
import { SmsClient, SmsSendRequest } from "@azure/communication-sms";
```

The examples below are using the [DefaultAzureCredential](/javascript/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

To register application in the development environment and set up environment variables, see [Authorize access with managed identity](../managed-identity-from-cli.md)  

### Create an identity and issue a token with Managed Identity

The following code example shows how to create a service client object with managed identity, then use the client to issue a token for a new user:

```JavaScript
export async function createIdentityAndIssueToken(resourceEndpoint: string): Promise<CommunicationUserToken> {
     let credential = new DefaultAzureCredential();
     const client = new CommunicationIdentityClient(resourceEndpoint, credential);
     return await client.createUserAndToken(["chat"]);
}
```

### Send an SMS with Managed Identity

The following code example shows how to create a service client object with managed identity, then use the client to send an SMS message:

```JavaScript
export async function sendSms(resourceEndpoint: string, fromNumber: any, toNumber: any, message: string) {
     let credential = new DefaultAzureCredential();
     const smsClient = new SmsClient(resourceEndpoint, credential);
     const sendRequest: SmsSendRequest = { 
          from: fromNumber, 
          to: [toNumber], 
          message: message 
     };

     const response = await smsClient.send(
          sendRequest, 
          {} //Optional SendOptions
          );
}
```

