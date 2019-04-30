---
title: Get consent for several resources (Microsoft Authentication Library for .NET) | Azure
description: Learn how to instantiate a public client application with configuration options using MSAL.NET using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/30/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to specify additional scopes so I can get pre-consent for several resources.
ms.collection: M365-identity-device-management
---

# Instantiate a public client application with configuration options using MSAL.NET

The case of an ASP.NET Core application is similar, except that this time you will use ConfidentialClientApplicationOptions, which holds client secrets, in addition to the options you've seen so far, and ASP.NET Core will probably handle the configuration for you and provide you directly with the data structure

In designing MSAL.NET 3.x, we made sure that the name of the properties of the Options in MSAL match the name of the properties of the AzureADOptions in ASP.NET Core so that you don't need to write any glue code.

Configuring the application straight from the configuration file
ASP.NET Core applications propose to describe the application configuration in appsettings.json files like the following:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "[Enter the domain of your tenant, e.g. contoso.onmicrosoft.com]",
    "TenantId": "[Enter 'common', or 'organizations' or the Tenant Id (Obtained from the Azure portal. Select 'Endpoints' from the 'App registrations' blade and use the GUID in any of the URLs), e.g. da41245a5-11b3-996c-00a8-4d99re19f292]",
    "ClientId": "[Enter the Client Id (Application ID obtained from the Azure portal), e.g. ba74781c2-53c2-442a-97c2-3d60re42f403]",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath ": "/signout-callback-oidc",

    "ClientSecret": "[Copy the client secret added to the app from the Azure portal]"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

MSAL.NET, from 3.x, enables you to benefit from this configuration file and configure your Confidential client application with this config file:

The classes related to the app configuration are located in the Microsoft.Identity.Client.AppConfig namespace.

Then in the class where you want to benefit from the configuration, you need to declare a ConfidentialClientApplicationOptions and bind the configuration read from whatever source (including the appconfig.json file) to the instance of

```csharp
using Microsoft.Identity.Client.AppConfig;

private ConfidentialClientApplicationOptions _applicationOptions;
_applicationOptions = new ConfidentialClientApplicationOptions();
configuration.Bind("AzureAD", _applicationOptions);
```

This enables the content of the "AzureAD" section of the appsettings.json to be bound to the corresponding properties of the ConfidentialClientApplicationOptions

From there, you can build a ConfidentialClientApplication

```csharp
IConfidentialClientApplication app;
app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(_applicationOptions)
        .Build();
```
Adding runtime configuration
Now, in a Confidential client application, you usually have a cache per user, therefore you will need to get the cache associated with the user, and inform the application builder that you want to use it. In the same way, you might have a dynamically computed redirectUri. In this case the code is the following:

```csharp
IConfidentialClientApplication app;
var request = httpContext.Request;
var currentUri = UriHelper.BuildAbsolute(request.Scheme, request.Host, request.PathBase, _azureAdOptions.CallbackPath ?? string.Empty);
app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(_applicationOptions)
       .WithRedirectUri(currentUri)
       .Build();
TokenCache userTokenCache = _tokenCacheProvider.SerializeCache(app.UserTokenCache,httpContext, claimsPrincipal);
``