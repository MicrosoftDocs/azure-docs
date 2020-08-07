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

After you [create an Azure Digital Twins instance](how-to-set-up-instance.md), you can create a client application that you will use to interact with the instance. Once you have set up a starter client project, this article shows you how to properly authenticate that client application with the Azure Digital Twins instance.

This is done in two steps:
1. Create an app registration
2. Write authentication code in a client application

[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

## Create an app registration

To authenticate against Azure Digital Twins from a client application, you need to set up an **app registration** in [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md).

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis-sdks.md). Your client app authenticates against the app registration, and as a result is granted the configured access permissions to the APIs.

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

> [!NOTE] 
> There are some places where a "friendly," human-readable string `https://digitaltwins.azure.net` can be used for the Azure Digital Twins resource app ID instead of the GUID `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. For instance, many examples throughout this documentation set use authentication with the MSAL library, and the friendly string can be used for that. However, during this step of creating the app registration, the GUID form of the ID is required as it is shown above. 

In your Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-authenticate-client/upload-extension.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration (replacing placeholders as needed):

```azurecli
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

The output from this command looks something like this.

:::image type="content" source="media/how-to-authenticate-client/new-app-registration.png" alt-text="New AAD app registration":::

After creating the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal.

From this overview, select the app registration you just created from the list. This will open up its details in a page like this one:

:::image type="content" source="media/how-to-authenticate-client/get-authentication-ids.png" alt-text="Azure portal: authentication IDs":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. You will use these values later to authenticate a client app against the Azure Digital Twins APIs.

> [!NOTE]
> Depending on your scenario, you may need to make additional changes to the app registration. Here are some common requirements you may need to meet:
> * Activate public client access
> * Set specific reply URLs for web and desktop access
> * Allow for implicit OAuth2 authentication flows
> * If your Azure subscription is created using a Microsoft account such as Live, Xbox, or Hotmail, you need to set the *signInAudience* on the app registration to support personal accounts.
> The easiest way to set up these settings is to use the [Azure portal](https://portal.azure.com/). For more information about this process, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/graph/auth-register-app-v2).

## Write client app authentication code: .NET (C#) SDK

This section describes the code you will need to include in your client application in order to complete the authentication process using the .NET (C#) SDK.
The Azure Digital Twins C# SDK is part of the Azure SDK for .NET. It is located here: [Azure IoT Digital Twin client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core).

### Prerequisites

If you don't have a starter client app project already set up, create a basic .NET project to use with this tutorial.

In order to use the .NET SDK, you'll need to include the following packages in your project:
* `Azure.DigitalTwins.Core` (version `1.0.0-preview.2`)
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

In an Azure function, you can then use the managed identity credentials like this:

```csharp
ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
DigitalTwinsClientOptions opts = 
    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
```

See [How-to: Set up an Azure function for processing data](how-to-create-azure-function.md) for a more complete example that explains some of the important configuration choices in the context of functions.

Also, to use authentication in a function, remember to:
* [Enable managed identity](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet)
* [Environment variables](https://docs.microsoft.com/sandbox/functions-recipes/environment-variables?tabs=csharp)
* Assign permissions to the functions app that enable it to access the Digital Twins APIs. See [How-to: Set up an Azure function for processing data](how-to-create-azure-function.md) for more information.

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

MSAL has many more options you can use, to implement things like caching and other authentication flows. For more information on this, see [Overview of Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md).

## Next steps

Read more about how security works in Azure Digital Twins:
* [Concepts: Security for Azure Digital Twins solutions](concepts-security.md)

Or, now that authentication is set up, move on to creating models in your instance:
* [How-to: Manage custom models](how-to-manage-model.md)