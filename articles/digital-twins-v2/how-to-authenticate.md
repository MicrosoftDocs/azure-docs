---
# Mandatory fields.
title: Authenticate against the twins API
titleSuffix: Azure Digital Twins
description: See how to authenticate against an Azure Digital Twins service.
author: cschorm
ms.author: cschorm # Microsoft employees only
ms.date: 3/17/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Authenticate against Azure Digital Twins

> [!TIP]
> To learn how to create an Azure Digital Twins instance, please see [How to Set Up an Azure Digital Twins Instance](how-to-set-up-an-adt-instance.md)

Before you can issue API calls against your Azure Digital Twins instance, you will need to authenticate. 

There are two pieces to that:
* Creating an app registration
* Writing authentication code in a client app

## Create an app registration

*** This section is preliminary ***

To authenticate against Azure Digital Twins in Azure from an app, you need to set up an app registration in Active Directory.

This app registration is where you configure access permissions to the Azure Digital Twins API. Your client app authenticates against the app registration, which in turn has configured access permissions to the Azure Digital Twins APIs.

To create an app registration you need to provide the resource ids for the Azure Azure Digital Twins APIs and the baseline permissions to the API:
```json
requiredResourceAccess":[
  {
     "resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0",
     "resourceAccess": [
     {
       "id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
       "type": "Scope"
     }
  ]
]
``` 

In your working directory, save this json snippets as file manifest.json.

Then run:
```bash
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses <path-to-manifest.json> --reply-url <one-or-more-reply-urls>
```

For a desktop or console app, a typical reply urls would be "http://localhost"

You will need the id of this app registration (also known as the client id) when you authenticate against the Azure Digital Twins APIs.

Depending on your scenario, you may need to make additional changes to the app registration. In particular, you may need to:
* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows

These settings are easiest set up in the portal. See [Register an application with the Microsoft identity platform](https://docs.microsoft.com/en-us/graph/auth-register-app-v2) for more information.

## Client app authentication code

To follow the example in this section, you will need the SDK library as described in the [API how-to document](how-to-use-api.md).

To authenticate a .NET app with Azure services, you can use the following minimal code:

```csharp
private string adtAppId = "0b07f429-9f4b-4714-9392-cc5e8e80c8b0";
private string clientId = "your-app-registration-id";
private AuthenticationResult authResult;
static async Task Authenticate()
{
    string[] scopes = new[] { adtAppId + "/.default" };
    var app = PublicClientApplicationBuilder.Create(clientId)
                                            .WithRedirectUri("http://localhost")
                                            .Build();
    var accounts = await app.GetAccountsAsync();
    try
    {
        authResult = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                              .ExecuteAsync();
    }
    catch (MsalUiRequiredException)
    {
        authResult = await app.AcquireTokenInteractive(scopes)
                              .ExecuteAsync();
    }
}
```

Note that this sample is the most minimal code for authentication using the MSAL authentication library. THere are many more options you can use to implement for example caching and several other authentication flows. For more information see [Overview of Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview) 

You will need to have references to the following libraries, which you can find on NuGet:
* Microsoft.Identity.Client. This is the MSAL client library.
* *Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* System.Security.Cryptography.ProtectedData

A complete example that creates an API client:
```csharp
using Microsoft.Identity.Client;
using Microsoft.Rest;
using Microsoft.Rest.Azure;
using Azure Digital TwinsApi; // The SDK library as built in the using-apis how-to
...
...

namespace Azure Digital TwinsGettingStarted
{
    class Program
    {
        private const string clientId = "your-app-registration";
        // THe Azure Digital Twins API resource id
        private const string adtAppId = "0b07f429-9f4b-4714-9392-cc5e8e80c8b0";
        private static AuthenticationResult authResult;

        private static AzureDigitalTwinsAPIClient client;
        private const string adtInstanceUrl = "your-app-id";

        static async Task Main(string[] args)
        {
            await Authenticate();

            if (authResult!=null && authResult.AccessToken != null)
            {
                
                Console.WriteLine($"\nSucessfully logged in as {authResult.Account.Username}");
                TokenCredentials tk = new TokenCredentials(authResult.AccessToken);
                client = new AzureDigitalTwinsAPIClient(tk);
                client.BaseUri = new Uri(adtInstanceUrl);
                Console.WriteLine($"Service client created – ready to go");

                //... your app code using adt apis here ...
            }
        }

        static async Task Authenticate()
        {
            string[] scopes = new[] { adtAppId + "/.default" };
            var app = PublicClientApplicationBuilder.Create(clientId)
                                                    .WithRedirectUri("http://localhost")
                                                    .Build();
            var accounts = await app.GetAccountsAsync();
            try
            {
                authResult = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                                      .ExecuteAsync();
            }
            catch (MsalUiRequiredException)
            {
                authResult = await app.AcquireTokenInteractive(scopes)
                                      .ExecuteAsync();
            }
        }
    }
}
```