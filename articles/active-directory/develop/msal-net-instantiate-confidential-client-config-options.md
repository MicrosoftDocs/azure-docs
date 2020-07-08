---
title: Instantiate a confidential client app (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to instantiate a confidential client application with configuration options using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 04/30/2019
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to use application config options so I can instantiate a confidential client app.
---

# Instantiate a confidential client application with configuration options using MSAL.NET

This article describes how to instantiate a [confidential client application](msal-client-applications.md) using Microsoft Authentication Library for .NET (MSAL.NET).  The application is instantiated with configuration options defined in a settings file.

Before initializing an application, you first need to [register](quickstart-register-app.md) it so that your app can be integrated with the Microsoft identity platform. After registration, you may need the following information (which can be found in the Azure portal):

- The client ID (a string representing a GUID)
- The identity provider URL (named the instance) and the sign-in audience for your application. These two parameters are collectively known as the authority.
- The tenant ID if you are writing a line of business application solely for your organization (also named single-tenant application).
- The application secret (client secret string) or certificate (of type X509Certificate2) if it's a confidential client app.
- For web apps, and sometimes for public client apps (in particular when your app needs to use a broker), you'll have also set the redirectUri where the identity provider will contact back your application with the security tokens.

## Configure the application from the config file
The name of the properties of the options in MSAL.NET match the name of the properties of the `AzureADOptions` in ASP.NET Core, so you don't need to write any glue code.

An ASP.NET Core application configuration is described in an *appsettings.json* file:

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

Starting in MSAL.NET v3.x, you can configure your confidential client application from the config file.

In the class where you want configure and instantiate your application, you need to declare a `ConfidentialClientApplicationOptions` object.  Bind the configuration read from the source (including the appconfig.json file) to the instance of the application options, using the `IConfigurationRoot.Bind()` method from the [Microsoft.Extensions.Configuration.Binder nuget package](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Binder):

```csharp
using Microsoft.Identity.Client;

private ConfidentialClientApplicationOptions _applicationOptions;
_applicationOptions = new ConfidentialClientApplicationOptions();
configuration.Bind("AzureAD", _applicationOptions);
```

This enables the content of the "AzureAD" section of the *appsettings.json* file to be bound to the corresponding properties of the `ConfidentialClientApplicationOptions` object.  Next, build a `ConfidentialClientApplication` object:

```csharp
IConfidentialClientApplication app;
app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(_applicationOptions)
        .Build();
```

## Add runtime configuration
In a confidential client application, you usually have a cache per user. Therefore you will need to get the cache associated with the user and inform the application builder that you want to use it. In the same way, you might have a dynamically computed redirect URI. In this case the code is the following:

```csharp
IConfidentialClientApplication app;
var request = httpContext.Request;
var currentUri = UriHelper.BuildAbsolute(request.Scheme, request.Host, request.PathBase, _azureAdOptions.CallbackPath ?? string.Empty);
app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(_applicationOptions)
       .WithRedirectUri(currentUri)
       .Build();
TokenCache userTokenCache = _tokenCacheProvider.SerializeCache(app.UserTokenCache,httpContext, claimsPrincipal);
```

