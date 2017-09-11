---
title: Managed Service Identity in App Service and Azure Functions | Microsoft Docs
description: Conceptual reference and setup guide for Managed Service Identity support in Azure App Service and Azure Functions
services: app-service
author: mattchenderson
manager: cfowler
editor: ''

ms.service: app-service
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 08/31/2017
ms.author: mahender

---

# How to use Azure Managed Service Identity (public preview) in App Service and Azure Functions

> [!NOTE] 
> Managed Service Identity for App Service and Azure Functions is currently in preview.

This topic shows you how to create App Service and Azure Functions applications with a managed Azure Active Directory identity. This allows your apps to easily access other AAD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about Managed Service Identity, see the [Managed Service Identity overview](https://docs.microsoft.com/azure/active-directory/active-directory-msi-overview).

## Creating an app with an identity

Creating an app with an identity requires an additional property to be set at creation time.

> [!NOTE]
> This feature is in preview, and there currently is no UX support for creating an app with an identity. To try out this feature, you need to create your app using an Azure Resource Manager template.

### Using an Azure Resource Manager template

An Azure Resource Manager template can be used to automate deployment of your Azure resources. To learn more about deploying to App Service and Functions, see [Automating resource deployment in App Service](https://docs.microsoft.com/azure/app-service-web/app-service-deploy-complex-application-predictably) and [Automating resource deployment in Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-infrastructure-as-code).

Any resource of type `Microsoft.Web/sites` can be created with an identity by including the following property in the resource definition:
```json
"identity": {
    "type": "SystemAssigned"
}    
```

This tells Azure to create and manage the identity for your application.

For example, a web app might look like the following:
```json
{
    "apiVersion": "2016-08-01",
    "type": "Microsoft.Web/sites",
    "name": "[variables('appName')]",
    "location": "[resourceGroup().location]",
    "identity": {
        "type": "SystemAssigned"
    },
    "properties": {
        "name": "[variables('appName')]",
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "hostingEnvironment": "",
        "clientAffinityEnabled": false,
        "alwaysOn": true
    },
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
    ]
}
```

When the site is created, it has the following additional properties:
```json
"identity": {
    "tenantId": "<TENANTID>",
    "principalId": "<PRINCIPALID>"
}
```

Where "<TENANTID" and "<PRINCIPALID>" are replaced with GUIDs. The tenantId property identifies what AAD tenant the application belongs to. The principalId is a unique identifier for the application's new identity. Within AAD, the application has the same name that you gave to your App Service or Azure Functions instance.

## Obtaining tokens for Azure resources

An app can use its identity to get tokens to other resources protected by AAD, such as Azure Key Vault. These tokens represent the application accessing the resource, and not any specific user of the application. 

> [!IMPORTANT]
> You may need to configure the target resource to allow access from your application. For example, if you request a token to Key Vault, you need to make sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token.

There is a simple REST protocol for obtaining a token in App Service and Azure Functions. For .NET applications, the Azure Service Authentication Library provides an abstraction over this protocol and supports a local development experience.

### <a name="asal"></a>Using the Azure Service Authentication Library (ASAL)

For .NET applications and functions, the simplest way to work with a managed service identity is through the Azure Service Authentication Library. This section shows you how to get started with ASAL.

1. Add a reference to the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) NuGet package to your application.

2. Add a "AzureServicesAuthConnectionString" application setting to your Azure resource with the value `AuthenticateAs=App;`.

> ![TIP]
>  For local development, set your local version of this setting to `AuthenticateAs=User;User=VisualStudioAccount`. This allows you to test your code locally using the permissions granted to your individual account.

3. Add the following code to your application:

```csharp
using Microsoft.Azure.Services.AppAuthentication;
// ...
string connectionString = ""; // Replace to read from the AzureServicesAuthConnectionString setting as appropriate to the target framework
var azureServiceTokenProvider = new AzureServiceTokenProvider(connectionString);
```

You can then request a token directly or pass a token callback to another Azure service SDK as follows:

```csharp
string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync(AzureService.AzureDataLake);
// OR
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
```

To learn more about ASAL and the operations it exposes, see the [Azure Service Authentication Library Reference](https://azure.microsoft.com).

### Using the REST protocol

An app with a managed service identity has two environment variables defined:
- MSI_ENDPOINT
- MSI_SECRET

The **MSI_ENDPOINT** is a local URL from which your app can request tokens. To get a token for a resource, make an HTTP GET request to this endpoint, including the following parameters:

> [!div class="mx-tdBreakAll"]
> |Parameter name|In|Description|
> |-----|-----|-----|
> |resource|Query|The AAD resource URI of the resource for which a token should be obtained.|
> |api-version|Query|The version of the token API to be used. "2017-09-01" is currently the only version supported.|
> |secret|Header|The value of the MSI_SECRET environment variable.|


A successful 200 OK response includes a JSON body with the following properties:

> [!div class="mx-tdBreakAll"]
> |Property name|Description|
> |-------------|----------|
> |access_token|The requested access token. The calling web service can use this token to authenticate to the receiving web service.|
> |expires_on|The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens.|
> |resource|The App ID URI of the receiving web service.|
> |token_type|Indicates the token type value. The only type that Azure AD supports is Bearer. For more information about bearer tokens, see [The OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](http://www.rfc-editor.org/rfc/rfc6750.txt).|

This response is the same as the [response for the AAD service-to-service access token request](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service#service-to-service-access-token-response).

### REST protocol examples
An example request might look like the following:
```
GET /MSI/token?resource=https://vault.azure.net&api-version=2017-09-01 HTTP/1.1
Host: localhost:4141
Secret: 853b9a84-5bfa-4b22-a3f3-0b9a43d9ad8a
```
And a sample response might look like the following:
```
HTTP/1.1 200 OK
Content-Type: application/json
 
{
    "access_token": "eyJ0eXAi…",
    "expires_on": "09/14/2017 00:00:00 PM +00:00",
    "resource": "https://vault.azure.net",
    "token_type": "Bearer"
}
```

### Code examples
To make this request in C#:
```csharp
public static async Task<HttpResponseMessage> GetToken(string resource, string apiversion)  {
    HttpClient client = new HttpClient();
    client.DefaultRequestHeaders.Add("Secret", Environment.GetEnvironmentVariable("MSI_SECRET"));
    return await client.GetAsync(String.Format("{0}/?resource={1}&api-version={2}", Environment.GetEnvironmentVariable("MSI_ENDPOINT"), resource, apiversion));
}
```
> [!TIP]
> For .NET languages, you can also use [ASAL](#asal) instead of crafting this request yourself.

In Node.JS:
```javascript
const rp = require('request-promise');
const getToken = function(resource, apiver, cb) {
    var options = {
        uri: `${process.env["MSI_ENDPOINT"]}/?resource=${resource}&api-version=${apiver}`,
        headers: {
            'Secret': process.env["MSI_SECRET"]
        }
    };
    rp(options)
        .then(cb);
}
```
