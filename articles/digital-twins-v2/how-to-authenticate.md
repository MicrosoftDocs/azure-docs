---
# Mandatory fields.
title: Authenticate against Azure Digital Twins
titleSuffix: Azure Digital Twins
description: See how to authenticate against the Azure Digital Twins service.
author: cschormann
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
> To learn how to create an Azure Digital Twins instance, please see [Create an Azure Digital Twins instance](how-to-set-up-instance.md).

Before you can issue API calls against your Azure Digital Twins instance, you will need to authenticate. This is a two-step process:
1. Create an app registration
2. Write authentication code in a client application

This article will walk you through how to do both.

## Create an app registration

To authenticate against Azure Digital Twins from a client application, you need to set up an **app registration** in [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md).

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis.md). Your client app authenticates against the app registration, and as a result is granted the configured access permissions to the APIs.

To create an app registration, you need to provide the resource IDs for the Azure Digital Twins APIs, and the baseline permissions to the API. In your working directory, open a new file and enter the following JSON snippet to configure these details: 

```json
[{
    "resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0",
    "resourceAccess": [
     {
       "id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
       "type": "Scope"
     }
    ]
}]
``` 

Save this file as *manifest.json*.

Next, run the following command to create an app registration (replacing placeholders as needed):

```bash
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses <path-to-manifest.json> --reply-url http://localhost
```

From the output of this command, look for the `appId` field and note its value. You will need this **app registration ID** later, when you authenticate against the Azure Digital Twins APIs.

Depending on your scenario, you may need to make additional changes to the app registration. Here are some common requirements you may need to meet:
* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows

The easiest way to set up these settings is to use the [Azure portal](https://portal.azure.com/). For more information about this process, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/graph/auth-register-app-v2).

> [!TIP] 
> If your Azure subscription is created using a Microsoft account such as Live, Xbox, or Hotmail, you need to set the *signInAudience* on the app registration to support personal accounts.

## Write client app authentication code

This section describes the code you will need to include in your client application in order to complete the authentication process.

### Prerequisites

To follow the example in this section, you will first need to build the SDK library that is described in [Use the Azure Digital Twins APIs](how-to-use-apis.md).

You will need to add references in your project to the following libraries, which you can find on [NuGet](https://www.nuget.org/):
* Microsoft.Identity.Client (this is the [MSAL](../active-directory/develop/msal-overview.md) client library)
* Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* System.Security.Cryptography.ProtectedData

### Code samples

To authenticate a .NET app with Azure services, you can use the following minimal code within your client app.

> [!TIP] 
> If your Azure subscription is created using a Microsoft account such as Live, Xbox, or Hotmail, you can find the tenant ID in the default directory overview in the Azure Active Directory section. 

```csharp
private string adtAppId = "0b07f429-9f4b-4714-9392-cc5e8e80c8b0";
private string clientId = "<your-app-registration-ID>";
private string tenantId = "<your-tenant-ID>";
private AuthenticationResult authResult;
static async Task Authenticate()
{
    string[] scopes = new[] { adtAppId + "/.default" };
    var app = PublicClientApplicationBuilder.Create(clientId).WithTenantId(tenantId).WithRedirectUri("http://localhost").Build();
    var accounts = await app.GetAccountsAsync();
    try
    {
        authResult = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
    }
    catch (MsalUiRequiredException)
    {
        authResult = await app.AcquireTokenInteractive(scopes).ExecuteAsync();
    }
}
```

The sample above shows the most minimal code that can be used to authenticate using the Microsoft Authentication Library (MSAL). There are many more options you can use, to implement things like caching and other authentication flows. For more information, see [Overview of Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md).

The sample below is a more complete example. It creates an API client.

You will need to have references to the following libraries, which you can find on NuGet:
* Microsoft.Identity.Client. This is the MSAL client library.
* *Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* System.Security.Cryptography.ProtectedData

```csharp
using Microsoft.Identity.Client;
using Microsoft.Rest;
using Microsoft.Rest.Azure;
using Azure Digital TwinsApi; // The SDK library, as built in the "Use the Azure Digital Twins APIs" how-to article
...
...

namespace Azure Digital TwinsGettingStarted
{
    class Program
    {
        private const string clientId = "<your-app-registration>";
        // The Azure Digital Twins API resource ID
        private const string adtAppId = "0b07f429-9f4b-4714-9392-cc5e8e80c8b0";
        private static AuthenticationResult authResult;

        private static AzureDigitalTwinsAPIClient client;
        private const string adtInstanceUrl = "<your-app-ID>";

        static async Task Main(string[] args)
        {
            await Authenticate();

            if (authResult!=null && authResult.AccessToken != null)
            {
                
                Console.WriteLine($"\nSucessfully logged in as {authResult.Account.Username}");
                TokenCredentials tk = new TokenCredentials(authResult.AccessToken);
                client = new AzureDigitalTwinsAPIClient(tk);
                client.BaseUri = new Uri(adtInstanceUrl);
                Console.WriteLine($"Service client created — ready to go");

                //... your app code using Azure Digital Twins APIs here ...
            }
        }

        static async Task Authenticate()
        {
            string[] scopes = new[] { adtAppId + "/.default" };
            var app = PublicClientApplicationBuilder.Create(clientId).WithRedirectUri("http://localhost").Build();
            var accounts = await app.GetAccountsAsync();
            try
            {
                authResult = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
            }
            catch (MsalUiRequiredException)
            {
                authResult = await app.AcquireTokenInteractive(scopes).ExecuteAsync();
            }
        }
    }
}
```

## Next steps

See how to make API calls to your Azure Digital Twin instance:
* [Manage an individual digital twin](how-to-manage-twin.md)