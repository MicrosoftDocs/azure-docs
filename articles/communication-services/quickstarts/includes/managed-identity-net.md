## Add managed identity to your Communication Services solution (.NET)

### Install the SDK packages

```console
dotnet add package Azure.Communication.Identity  --version 1.0.0
dotnet add package Azure.Communication.Sms --version 1.0.0
dotnet add package Azure.Communication.PhoneNumbers --version 1.0.0-beta.6
dotnet add package Azure.Identity
```

### Use the SDK packages

Add the following `using` directives to your code to use the Azure Identity and Azure Storage SDKs.

```csharp
using Azure.Identity;
using Azure.Communication.Identity;
using Azure.Communication.PhoneNumbers;
using Azure.Communication.Sms;
using Azure.Core;
```

For an easy way to jump into using managed identity authentication, see [Authorize access with managed identity](../managed-identity-from-cli.md)

For a more in-depth look on how the DefaultAzureCredential object works and how you can use it in ways that are not specified in this quickstart, see
[Azure Identity client library for .Net](https://docs.microsoft.com/dotnet/api/overview/azure/identity-readme)

The examples below are using the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.


### Create an identity and issue a token with Managed Identity

The following code example shows how to create a service client object with Azure Active Directory tokens.

Then, use the client to issue a token for a new user:

```csharp
     public Response<AccessToken> CreateIdentityAndGetTokenAsync(Uri resourceEndpoint)
     {
          TokenCredential credential = new DefaultAzureCredential();
          var client = new CommunicationIdentityClient(resourceEndpoint, credential);

          var identityResponse = client.CreateUser();
          var identity = identityResponse.Value;

          var tokenResponse = client.GetToken(identity, scopes: new[] { CommunicationTokenScope.VoIP });

          return tokenResponse;
     }
```
### List all your purchased phone numbers

The following code example shows how to create a phone number service client with Azure managed identity, then use the client to retrieve all of the purchased phone numbers the resource has:

```csharp
     public void ListPhoneNumbers(Uri resourceEdnpont)
     {
          TokenCredential credential = new DefaultAzureCredential();
          var client = new PhoneNumbersClient(endpoint, credential);

          var purchasedPhoneNumbers = client.GetPurchasedPhoneNumbersAsync();
          await foreach (var purchasedPhoneNumber in purchasedPhoneNumbers)
          {
               Console.WriteLine($"Phone number: {purchasedPhoneNumber.PhoneNumber}, country code: {purchasedPhoneNumber.CountryCode}");
          }
     }
```

### Send an SMS with Managed Identity

The following code example shows how to create an SMS service client object with managed identity, then use the client to send an SMS message:

```csharp
     public SmsSendResult SendSms(Uri resourceEndpoint, string from, string to, string message)
     {
          TokenCredential credential = new DefaultAzureCredential();

          SmsClient smsClient = new SmsClient(resourceEndpoint, credential);

          SmsSendResult sendResult = smsClient.Send(
               from,
               to,
               message,
               new SmsSendOptions(enableDeliveryReport: true) // optional
          );

          return sendResult;
      }
```
