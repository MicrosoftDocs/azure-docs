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

## Write client app authentication code: .NET SDK

This section describes the code you will need to include in your client application in order to complete the authentication process using the .NET SDK.

### Prerequisites

In order to use the .NET SDK, you need to include the following packages in your project:
* Azure.DigitalTwins.Core
* Azure.Identity

Depending on your tools of choice, you can do so with the Visual Studio package manager or the dotnet command line tool. 

### Authentication and Client Creation: .NET

To authenticate with the .NET SDK, use one of the several methods to obtain credentials that are defined in the [Azure.Identity](https://docs.microsoft.com/en-us/dotnet/api/azure.identity?view=azure-dotnet) library.

Most commonly, you will probably use one of these two: 
* [InteractiveBrowserCredential](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet). This method is intended for interactive applications and will bring up a web browser to authenticate with.
* [ManagedIdentityCredential](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet). This method works great in cases where you need [managed identities (MSI)](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview), for example when you want to work with Azure Functions. 

You need the following using statements:
```csharp
using Azure.Identity;
using Azure.DigitalTwins.Core;
```

To use the interactive browser credentials to create an authenticated SDK client use:
```csharp
// Your client Id / app registration
private static string clientId; 
// Your tenant Id
private static string tenantId;
// The URL of your instance including the protocol (https://)
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

In an Azure Function, you will likely use the managed identity credentials:
```csharp
ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
DigitalTwinsClientOptions opts = 
    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
```

See [how-to-create-azure-function.md](./how-to-create-azure-function.md) for a more complete example that explains some of the important configuration choices in the context of functions.

Also, to use authentication in a function make sure that you:
* [Enable managed identity](https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=dotnet)
* [Set an environment variable in the Azure Functions app](https://www.google.com/search?q=Azure+FUnctions+how+to+set+an+environment+variable&rlz=1C1GCEU_enUS861US861&oq=Azure+functions+&aqs=chrome.0.69i59j0l4j69i60j69i65l2.3626j0j4&sourceid=chrome&ie=UTF-8)
* Assign permissions to the functions app that enable it to access Digital Twins APIs. See [how-to-create-azure-function])./how-to-create-azure-function) for more information.

## Authentication in an Autorest-generated SDK

### Prerequisites

To follow the example in this section, you will first need to build the SDK library that is described in [How-to: Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md).

This example uses a Typescript SDK generated with Autorest. It therefore also requires:
* [msal-js](https://github.com/AzureAD/microsoft-authentication-library-for-js)
* [ms-rest-js](https://github.com/Azure/ms-rest-js)


### Minimal authentication code sample

To authenticate a .NET app with Azure services, you can use the following minimal code within your client app.

You will need your *Application (client) ID* and *Directory (tenant) ID* from earlier, as well as the URL of your Azure Digital Twins instance

```javascript
import * as Msal from "msal";
import { TokenCredentials } from "@azure/ms-rest-js";
// Autorest-generated SDK
import { AzureDigitalTwinsAPI } from './azureDigitalTwinsAPI';

// client id / app registration
var ClientId;
// Azure tenant
var TenantId;
// URL of the ADT instance
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
                
            // Add token and server url to service instance
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

MSAL has many more options you can use, to implement for example caching and other authentication flows. For more information, see [Overview of Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md).

## Next steps

Read more about how security works in Azure Digital Twins:
* [Concepts: Security for Azure Digital Twins solutions](concepts-security.md)

Or, now that authentication is set up, move on to creating models in your instance:
* [How-to: Manage a twin model](how-to-manage-model.md)