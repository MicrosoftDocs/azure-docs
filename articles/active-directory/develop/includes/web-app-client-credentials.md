---
title: Client credentials for web apps and web APIs calling downstream APIs
description: Include file with a common configuration in web apps and web APIs calling downstream web APIs (ASP.NET Core and ASP.NET OWIN).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: include
ms.date: 05/08/2023
ms.author: jmprieur
ms.reviewer: jmprieur
ms.custom: aaddev
---

Given that your web app now calls a downstream web API, provide a client secret or client certificate in the *appsettings.json* file. You can also add a section that specifies:

- The URL of the downstream web API
- The scopes required for calling the API

In the following example, the `GraphBeta` section specifies these settings.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Enter_the_Application_Id_Here]",
    "TenantId": "common",

   // To call an API
   "ClientCredentials": [
    {
      "SourceType": "ClientSecret",
      "ClientSecret":"[Enter_the_Client_Secret_Here]"
    }
  ]
 },
 "GraphBeta": {
    "BaseUrl": "https://graph.microsoft.com/beta",
    "Scopes": ["user.read"]
    }
}
```
> [!NOTE]
> You can propose a collection of client credentials, including a credential-less solution like workload identity federation for Azure Kubernetes. 
> Previous versions of Microsoft.Identity.Web expressed the client secret in a single property "ClientSecret" instead of "ClientCredentials". This is still supported for backwards compatibility but you cannot use both the "ClientSecret" property, and the "ClientCredentials" collection.

Instead of a client secret, you can provide a client certificate. The following code snippet shows using a certificate stored in Azure Key Vault.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Enter_the_Application_Id_Here]",
    "TenantId": "common",

   // To call an API
   "ClientCredentials": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
   ]
  },
  "GraphBeta": {
    "BaseUrl": "https://graph.microsoft.com/beta",
    "Scopes": ["user.read"]
  }
}
```

> [!WARNING]
>
> If you forget to change the `Scopes` to an array, when you try to use the `IDownstreamApi` the scopes will appear null, and `IDownstreamApi` will attempt an anonymous (unauthenticated) call to the downstream API, which will result in a `401/unauthenticated`.

*Microsoft.Identity.Web* provides several ways to describe certificates, both by configuration or by code. For details, see [Microsoft.Identity.Web - Using certificates](https://github.com/AzureAD/microsoft-identity-web/wiki/Using-certificates) on GitHub.