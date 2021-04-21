---
title: Build services that are resilient to Azure AD's OpenID Connect metadata refresh | Azure
titleSuffix: Microsoft identity platform
description: Learn how to ensure that your web app or web api is resilient to Azure AD's OpenID Connect metadata refresh.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 04/21/2021
ms.author: jmprieur
ms.reviewer: marsma, shermanouko
ms.custom: aaddev
---

# How to: Build services that are resilient to metadata refresh.

Protected web APIs need to validate access tokens. Web apps also validate the ID tokens. Token Validation has multiple parts, checking it's for the application, issued by a trusted Identity Provider (IDP), its lifetime is in range, and it wasn't tampered with. There can also be special validations. For instance, the app needs to validate the signature and that signing keys (when embedded in a token) are trusted and that the token isn't being replayed. When the signing keys aren't embedded in the token, they need to be fetched from the identity provider (Discovery or Metadata). Sometimes it's also necessary to obtain keys dynamically at runtime.

To build a resilient web app or web API, you'd want to respect the best practices that are highlighted in this article for refreshing stale OpenID Connect metadata. It applies to ASP.NET Core, ASP.NET classic, and Microsoft.IdentityModel.

## ASP.NET Core

Use latest version of [Microsoft.IdentityModel.*](https://www.nuget.org/packages?q=Microsoft.IdentityModel) and manually ensure that you follow the guidelines below.

Ensure that `JwtBearerOptions.RefreshOnIssuerKeyNotFound` is set to true, and that you're using the latest Microsoft.IdentityModel.* library. This property should be enabled by default.

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

Microsoft recommends that you move to ASP.NET Core, as development has stopped on ASP.NET. 

If you're using ASP.NET classic, use the latest [Microsoft.IdentityModel.*](https://www.nuget.org/packages?q=Microsoft.IdentityModel) and manually ensure that you follow the guidelines below.

OWIN has an automatic 24-hour refresh interval for the `OpenIdConnectConfiguration`. This refresh will only be triggered if a request is received after the 24-hour time span has passed. As far as we know, there's no way to change this value or trigger a refresh early, aside from restarting the application.

## Microsoft.IdentityModel

If you validate your token yourself, for instance in an Azure Function, use the latest version of [Microsoft.IdentityModel.*](https://www.nuget.org/packages?q=Microsoft.IdentityModel) and follow the metadata guidance illustrated by the code snippets below.

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
