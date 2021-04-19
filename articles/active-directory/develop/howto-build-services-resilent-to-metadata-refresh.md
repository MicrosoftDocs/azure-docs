---
title: How to build services that are resilient to metadata refresh | Azure
titleSuffix: Microsoft identity platform
description: Learn how to ensure that your web app or web api is resilient to metadata refresh.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 04/19/2021
ms.author: jmprieur
ms.reviewer: marsma, jmprieur
ms.custom: aaddev
---

# How to: How to build services that are resilient to metadata refresh

This article highlights the best practices for refreshing stale metadata in web apps and web APIs. It applies to ASP.NET Core, ASP.NET classic, and Microsoft.IdentityModel.

## ASP.NET Core

Use latest version of Microsoft.Identity.Model.* and manually ensure that you follow the guidelines above.

Ensure that `JwtBearerOptions.RefreshOnIssuerKeyNotFound` is set to true, and that you are using the latest Microsoft.IdentityModel.* library. This should be enabled by default.

```csharp
  services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
  {
	…
	// shouldn’t be necessary as it’s true by default
	options.RefreshOnIssuerKeyNotFound = true;
	…
   };
```

## ASP.NET/ OWIN

Note that Microsoft recommends that you move to ASP.NET Core.

If you are using ASP.NET classic, use the latest Microsoft.Identity.Model and manually ensure that you follow the guidelines above.

OWIN has an automatic 24 hour refresh interval for the `OpenIdConnectConfiguration`. This refresh will only be triggered if a request is received after the 24 hour time span has passed. As far as we know, there is no way to change this value or trigger a refresh early, aside from restarting the application.

## Microsoft.IdentityModel

Use latest version of Microsoft.Identity.Model.*  and follow the metadata guidance illustrated by the code snippets below.

```csharp
ConfigurationManager<OpenIdConnectConfiguration> configManager = 
  new ConfigurationManager<OpenIdConnectConfiguration>("http://someaddress.com", 
                                                       new OpenIdConnectConfigurationRetriever());
OpenIdConnectConfiguration config = await configManager.GetConfigurationAsync().ConfigureAwait(false);
TokenValidationParameters validationParameters = new TokenValidationParameters()
{
  …
  IssuerSigningKeys = config.SigningKeys;
  …
}

JsonWebTokenHandler tokenHandler = new JsonWebTokenHandler();
result = Handler.ValidateToken(jwtToken, validationParameters);
if (result.Exception != null && result.Exception is SecurityTokenSignatureKeyNotFoundException)
{
  configManager.RequestRefresh();
  config = await configManager.GetConfigurationAsync().ConfigureAwait(false);
  validationParameters = new TokenValidationParameters()
  {
    …
    IssuerSigningKeys = config.SigningKeys,
    …
  };
  // attempt to validate token again after refresh
  result = Handler.ValidateToken(jwtToken, validationParameters);
}
```