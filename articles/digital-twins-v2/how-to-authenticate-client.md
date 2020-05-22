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

## Write client app authentication code: .NET (C#) SDK

This section describes the code you will need to include in your client application in order to complete the authentication process using the .NET (C#) SDK.
The Azure Digital Twins C# SDK is part of the Azure SDK for .NET. It is located here: [Azure IoT Digital Twin client library for .NET](https://github.com/Azure/azure-sdk-for-net-pr/tree/feature/digitaltwins/sdk/digitaltwins/Azure.DigitalTwins.Core).

### Prerequisites

In order to use the .NET SDK, you'll need to include the following packages in your project:
* `Azure.DigitalTwins.Core`
* `Azure.Identity`

Depending on your tools of choice, you can do so with the Visual Studio package manager or the `dotnet` command line tool. 

### Authentication and client creation: .NET

To authenticate with the .NET SDK, use one of the credential-obtaining methods that are defined in the [Azure.Identity](https://docs.microsoft.com/dotnet/api/azure.identity?view=azure-dotnet) library.

Here are two that are commonly used: 
* [InteractiveBrowserCredential](https://docs.microsoft.com/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet). This method is intended for interactive applications and will bring up a web browser for authentication.
* [ManagedIdentityCredential](https://docs.microsoft.com/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet). This method works great in cases where you need [managed identities (MSI)](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)—for example, when working with Azure Functions. 

You'll also need the following using statements:

```csharp
using Azure.Identity;
using Azure.DigitalTwins.Core;
```

To use the interactive browser credentials to create an authenticated SDK client, add this code:

```csharp
// Your client / app registration ID
private static string clientId; 
// Your tenant / directory ID
private static string tenantId;
// The URL of your instance, including the protocol (https://)
private static string adtInstanceUrl;
...

DigitalTwinsClient client;
try
{
    var credential = new InteractiveBrowserCredential(tenantId, clientId);
    client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credential);
} catch(Exception e)
{
    Console.WriteLine($"Authentication or client creation error: {e.Message}");
    Environment.Exit(0);
}
```

In an Azure Function, you can use the managed identity credentials like this:

```csharp
ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
DigitalTwinsClientOptions opts = 
    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
```

See [[How-to: Set up an Azure Function for processing data](how-to-create-azure-function.md) for a more complete example that explains some of the important configuration choices in the context of functions.

Also, to use authentication in a function, remember to:
* [Enable managed identity](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet)
* [Environment variables](https://docs.microsoft.com/sandbox/functions-recipes/environment-variables?tabs=csharp)
* Assign permissions to the functions app that enable it to access the Digital Twins APIs. See [How-to: Set up an Azure Function for processing data](how-to-create-azure-function.md) for more information.

## Authentication in an AutoRest-generated SDK

If you are not using .NET, you may opt to build an SDK library in a language of your choice, as described in [How-to: Create custom SDKs for Azure Digital Twins with AutoRest](how-to-create-custom-sdks.md).

This section explains how to authenticate in that case.

### Prerequisites

This example uses a Typescript SDK generated with AutoRest. As a result, it also requires:
* [msal-js](https://github.com/AzureAD/microsoft-authentication-library-for-js)
* [ms-rest-js](https://github.com/Azure/ms-rest-js)

### Minimal authentication code sample

To authenticate a .NET app with Azure services, you can use the following minimal code within your client app.

You will need your *Application (client) ID* and *Directory (tenant) ID* from earlier, as well as the URL of your Azure Digital Twins instance.

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your Azure Digital Twins instance's *hostName*. To see the hostName, along with all the properties of your instance, you can run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```javascript
import * as Msal from "msal";
import { TokenCredentials } from "@azure/ms-rest-js";
// Autorest-generated SDK
import { AzureDigitalTwinsAPI } from './azureDigitalTwinsAPI';

// Client / app registration ID
var ClientId;
// Azure tenant / directory ID
var TenantId;
// URL of the Azure Digital Twins instance
var AdtInstanceUrl; 

var AdtAppId = "https://digitaltwins.azure.net";

let client = null;

export async function login() {

    const msalConfig = {
        auth: {
            clientId: ClientId,
            redirectUri: "http://localhost:3000",
            authority: "https://login.microsoftonline.com/"+TenantId
        }
    };

    const msalInstance = new Msal.UserAgentApplication(msalConfig);

    msalInstance.handleRedirectCallback((error, response) => {
        // handle redirect response or error
    });

    var loginRequest = {
        scopes: [AdtAppId + "/.default"] 
    };

    try {
        await msalInstance.loginPopup(loginRequest)
        var accessToken;
        // if the user is already logged in you can acquire a token
        if (msalInstance.getAccount()) {
            var tokenRequest = {
                scopes: [AdtAppId + "/.default"]
            };
            try {
                const response = await msalInstance.acquireTokenSilent(tokenRequest);
                accessToken = response.accessToken;
            } catch (err) {
                if (err.name === "InteractionRequiredAuthError") {
                    const response = await msalInstance.acquireTokenPopup(tokenRequest)
                    accessToken = response.accessToken;
                }
            }
        }
        if (accessToken!=null)
        {
            var tokenCredentials = new TokenCredentials(accessToken);
                
            // Add token and server URL to service instance
            const clientConfig = {
                baseUri: AdtInstanceUrl
            };
            client = new AzureDigitalTwinsAPI(tokenCredentials, clientConfig);
            appDataStore.client = client;
        }
    } catch (err) {
        ...
    }
}
```

MSAL has many more options you can use, to implement things like caching and other authentication flows. For more information on this, see [Overview of Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md).

## Next steps

Read more about how security works in Azure Digital Twins:
* [Concepts: Security for Azure Digital Twins solutions](concepts-security.md)

Or, now that authentication is set up, move on to creating models in your instance:
* [How-to: Manage a twin model](how-to-manage-model.md)