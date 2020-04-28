---
# Mandatory fields.
title: Authenticate a client application
titleSuffix: Azure Digital Twins
description: See how to authenticate a client application against the Azure Digital Twins service.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/22/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Authenticate a client application with Azure Digital Twins

After you [create an Azure Digital Twins instance](how-to-set-up-instance.md), you can create a client application that you will use to interact with the instance. This article shows you how to set up and properly authenticate that client application with the Azure Digital Twins instance.

This is done in two steps:
1. Create an app registration
2. Write authentication code in a client application

## Create an app registration

[!INCLUDE [Azure Digital Twins setup steps: client app registration](../../includes/digital-twins-setup-2.md)]

## Write client app authentication code

This section describes the code you will need to include in your client application in order to complete the authentication process.

### Prerequisites

To follow the example in this section, you will first need to build the SDK library that is described in [How-to: Use the Azure Digital Twins APIs](how-to-use-apis-sdks.md).

You will need to add references in your project to the following libraries, which you can find on [NuGet](https://www.nuget.org/):
* Microsoft.Identity.Client (this is the [MSAL](../active-directory/develop/msal-overview.md) client library)
* Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* System.Security.Cryptography.ProtectedData

### Minimal authentication code sample

To authenticate a .NET app with Azure services, you can use the following minimal code within your client app.

You will need your *Application (client) ID* and *Directory (tenant) ID* from earlier. 

```csharp
private string adtAppId = "https://digitaltwins.azure.net";
private string clientId = "<your-application-ID>";
private string tenantId = "<your-directory-ID>";
private AuthenticationResult authResult;
static async Task Authenticate()
{
    string[] scopes = new[] { adtAppId + "/.default" };
    var app = PublicClientApplicationBuilder.Create(clientId).WithTenantId(tenantId).WithRedirectUri("http://localhost").Build();
    authResult = await app.AcquireTokenInteractive(scopes).ExecuteAsync();
}
```

The sample above shows the most minimal code that can be used to authenticate using the Microsoft Authentication Library (MSAL). There are many more options you can use, to implement things like caching and other authentication flows. For more information, see [Overview of Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md).

### More complex authentication code sample

This section offers a more complete example. It creates an API client.

You will need to have references to the following libraries, which you can find on NuGet:
* Microsoft.Identity.Client. This is the MSAL client library.
* *Microsoft.Rest.ClientRuntime
* Microsoft.Rest.ClientRuntime.Azure
* System.Security.Cryptography.ProtectedData

In addition to your *Application (client) ID* and *Directory (tenant) ID* from earlier, you will also need the Azure Digital Twins instance's *hostName*. You may have noted this earlier when you created your instance, or you can look for the *hostName* property in the output of this command:

```azurecli
az dt show --dt-name <your-Azure-Digital-Twins-instance>
```

Here is the client app code.

```csharp
using Microsoft.Identity.Client;
using Microsoft.Rest;
using Microsoft.Rest.Azure;
using ADTApi; // The SDK library, as built in the "Use the Azure Digital Twins APIs" how-to article
...
...

namespace Azure Digital TwinsGettingStarted
{
    class Program
    {
        private const string adtAppId = "https://digitaltwins.azure.net";
        private const string clientId = "<your-application-ID>";
        private string tenantId = "<your-directory-ID>";
        private static AuthenticationResult authResult;

        private static AzureDigitalTwinsAPIClient client;
        private const string adtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>";

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
            var app = PublicClientApplicationBuilder.Create(clientId).WithTenantId(tenantId).WithRedirectUri("http://localhost").Build();
            authResult = await app.AcquireTokenInteractive(scopes).ExecuteAsync();
        }
    }
}
```

## Next steps

Read more about how security works in Azure Digital Twins:
* [Concepts: Securing Azure Digital Twins solutions](concepts-security.md)

Or, now that authentication is set up, read about making API calls to your Azure Digital Twin instance:
* [Concepts: The Azure Digital Twins SDKs](concepts-sdks.md)