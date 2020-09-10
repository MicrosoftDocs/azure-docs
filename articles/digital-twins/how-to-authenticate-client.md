---
# Mandatory fields.
title: Write app authentication code
titleSuffix: Azure Digital Twins
description: See how to write authentication code in a client application
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/22/2020
ms.topic: how-to
ms.service: digital-twins
ms.custom: devx-track-javascript

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Write client app authentication code

After you [set up an Azure Digital Twins instance and authentication](how-to-set-up-instance-scripted.md), you can create a client application that you will use to interact with the instance. Once you have set up a starter client project, this article shows you **how to write code in that client app to authenticate it** against the Azure Digital Twins instance.

There are two approaches to sample code in this article. You can use the one that's right for you, depending on your language of choice:
* The first section of sample code uses the Azure Digital Twins .NET (C#) SDK. The SDK is part of the Azure SDK for .NET, and is located here: [*Azure IoT Digital Twin client library for .NET*](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core).
* The second section of sample code is for users not using the .NET SDK, and instead using AutoRest-generated SDKs in other languages. For more information on this strategy, see [*How-to: Create custom SDKs for Azure Digital Twins with AutoRest*](how-to-create-custom-sdks.md).

You can also read more about the APIs and SDKs for Azure Digital Twins in [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).

## Prerequisites

First, complete the setup steps in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-scripted.md). This will ensure you have an Azure Digital Twins instance, your user has access permissions, and you've set up permissions for client applications. After all this setup, you are ready to write client app code.

To proceed, you will need a client app project in which you write your code. If you don't already have a client app project set up, create a basic project in your language of choice to use with this tutorial.

## Authentication and client creation: .NET (C#) SDK

First, include the following packages in your project in order to use the .NET SDK and authentication tools for this how-to:
* `Azure.DigitalTwins.Core`
* `Azure.Identity`

Depending on your tools of choice, you can include the packages using the Visual Studio package manager or the `dotnet` command line tool. 

You'll also need the following using statements:

```csharp
using Azure.Identity;
using Azure.DigitalTwins.Core;
```
To authenticate with the .NET SDK, use one of the credential-obtaining methods that are defined in the [Azure.Identity](https://docs.microsoft.com/dotnet/api/azure.identity?view=azure-dotnet) library. Here are two that are commonly used (even together in the same application):

* [InteractiveBrowserCredential](https://docs.microsoft.com/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet) is intended for interactive applications, and can be used to create an authenticated SDK client
* [ManagedIdentityCredential](https://docs.microsoft.com/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet) works great in cases where you need managed identities (MSI), and is a good candidate for working with Azure Functions

### InteractiveBrowserCredential method
The [InteractiveBrowserCredential](https://docs.microsoft.com/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet) method is intended for interactive applications and will bring up a web browser for authentication.

To use the interactive browser credentials to create an authenticated SDK client, add this code:

```csharp
// Your client / app registration ID
private static string clientId = "<your-client-ID>"; 
// Your tenant / directory ID
private static string tenantId = "<your-tenant-ID>";
// The URL of your instance, starting with the protocol (https://)
private static string adtInstanceUrl = "<your-Azure-Digital-Twins-instance-URL>";

//...

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

>[!NOTE]
> While you can place the client ID, tenant ID and instance URL directly into the code as shown above, it's a good idea to have your code get these values from a configuration file or environment variable instead.

### ManagedIdentityCredential method
 The [ManagedIdentityCredential](https://docs.microsoft.com/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet) method works great in cases where you need [managed identities (MSI)](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)—for example, when working with Azure Functions.
In an Azure function, you can use the managed identity credentials like this:

```csharp
ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
DigitalTwinsClientOptions opts = 
    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
```

See [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md) for a more complete example that explains some of the important configuration choices in the context of functions.

Also, to use authentication in a function, remember to:
* [Enable managed identity](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet)
* Use [environment variables](https://docs.microsoft.com/sandbox/functions-recipes/environment-variables?tabs=csharp) as appropriate
* Assign permissions to the functions app that enable it to access the Digital Twins APIs. For more information on Azure Functions processes, see [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md).

## Authentication with an AutoRest-generated SDK

If you are not using .NET, you may opt to build an SDK library in a language of your choice, as described in [*How-to: Create custom SDKs for Azure Digital Twins with AutoRest*](how-to-create-custom-sdks.md).

This section explains how to authenticate in that case.

### Prerequisites

First, you should complete the steps to create a custom SDK with AutoRest, using the steps in [*How-to: Create custom SDKs for Azure Digital Twins with AutoRest*](how-to-create-custom-sdks.md).

This example uses a Typescript SDK generated with AutoRest. As a result, it also requires:
* [msal-js](https://github.com/AzureAD/microsoft-authentication-library-for-js)
* [ms-rest-js](https://github.com/Azure/ms-rest-js)

### Minimal authentication code sample

To authenticate an app with Azure services, you can use the following minimal code within your client app.

You will need your *Application (client) ID* and *Directory (tenant) ID* from earlier, as well as the URL of your Azure Digital Twins instance.

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your Azure Digital Twins instance's *hostName*. To see the *hostName*, along with all the properties of your instance, you can run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`. You can use the `az account show --query tenantId` command to see your *Directory (tenant) ID*. 

```javascript
import * as Msal from "msal";
import { TokenCredentials } from "@azure/ms-rest-js";
// Autorest-generated SDK
import { AzureDigitalTwinsAPI } from './azureDigitalTwinsAPI';

// Client / app registration ID
var ClientId = "<your-client-ID>";
// Azure tenant / directory ID
var TenantId = "<your-tenant-ID>";
// URL of the Azure Digital Twins instance
var AdtInstanceUrl = "<your-instance-URL>"; 

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

Note again that where the code above places the client ID, tenant ID and instance URL directly into the code for simplicity, it's a good idea to have your code get these values from a configuration file or environment variable instead.

MSAL has many more options you can use, to implement things like caching and other authentication flows. For more information on this, see [*Overview of Microsoft Authentication Library (MSAL)*](../active-directory/develop/msal-overview.md).

## Next steps

Read more about how security works in Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)

Or, now that authentication is set up, move on to creating models in your instance:
* [*How-to: Manage custom models*](how-to-manage-model.md)