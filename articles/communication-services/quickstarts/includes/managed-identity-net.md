## Add managed identity to your Communication Services solution (.NET)

### Install the client library packages

```console
dotnet add package Azure.Communication.Identity
dotnet add package Azure.Communication.Sms
dotnet add package Azure.Identity
```

### Use the client library packages

Add the following `using` directives to your code to use the Azure Identity and Azure Storage client libraries.

```csharp
using Azure.Identity;
using Azure.Communication.Identity;
using Azure.Communication.Sms;
```

The examples below are using the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` environment variables are needed to create a `DefaultAzureCredential` object. To create a registered application in the development environment and set up environment variables, see [Authorize access with managed identity](../managed-identity-from-cli.md).

### Create an identity and issue a token with Managed Identity

The following code example shows how to create a service client object with Azure Active Directory tokens.

Then, use the client to issue a token for a new user:

```csharp
     public async Task<Response<AccessToken>> CreateIdentityAndGetTokenAsync(Uri resourceEndpoint)
     {
          TokenCredential credential = new DefaultAzureCredential();

          // You can find your endpoint and access key from your resource in the Azure portal
          // "https://<RESOURCE_NAME>.communication.azure.com";

          var client = new CommunicationIdentityClient(resourceEndpoint, credential);
          var identityResponse = await client.CreateUserAsync();
          var identity = identityResponse.Value;

          var tokenResponse = await client.GetTokenAsync(identity, scopes: new[] { CommunicationTokenScope.VoIP });

          return tokenResponse;
     }
```

### Send an SMS with Managed Identity

The following code example shows how to create a SMS service client object with managed identity, then use the client to send an SMS message:

```csharp
     public async Task SendSms(Uri resourceEndpoint, string from, string to, string message)
     {
          TokenCredential credential = new DefaultAzureCredential();
          // You can find your endpoint and access key from your resource in the Azure portal
          // "https://<RESOURCE_NAME>.communication.azure.com";

          SmsClient smsClient = new SmsClient(resourceEndpoint, credential);
          smsClient.Send(
               from: from,
               to: to,
               message: message,
               new SmsSendOptions(enableDeliveryReport: true) // optional
          );
      }
```

