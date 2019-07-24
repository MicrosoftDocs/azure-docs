---
title: Protected web API - app code configuration | Azure
description: Learn how to build a protected web API and configure your application's code.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected web API: Code configuration

To configure the code for your protected web API, you need to understand what defines APIs as protected, how to configure a bearer token, and how to validate the token.

## What defines ASP.NET/ASP.NET Core APIs as protected?

Like web apps, the ASP.NET/ASP.NET Core web APIs are "protected" because their controller actions are prefixed with the `[Authorize]` attribute. So the controller actions can be called only if the API is called with an identity that's authorized.

Consider the following questions:

- How does the web API know the identity of the app that calls it? (Only an app can call a web API.)
- If the app called the web API on behalf of a user, what's the user's identity?

## Bearer token

The information about the identity of the app, and about the user (unless the web app accepts service-to-service calls from a daemon app), is held in the bearer token that's set in the header when the app is called.

Here's a C# code example that shows a client calling the API after it acquires a token with Microsoft Authentication Library for .NET (MSAL.NET):

```CSharp
var scopes = new[] {$"api://.../access_as_user}";
var result = await app.AcquireToken(scopes)
                      .ExecuteAsync();

httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call the web API.
HttpResponseMessage response = await _httpClient.GetAsync(apiUri);
```

> [!IMPORTANT]
> The bearer token was requested by a client application to the Microsoft identity platform endpoint *for the web API*. The web API is the only application that should verify the token and view the claims it contains. Client apps should never try to inspect the claims in tokens. (The web API could require, in the future, that the token be encrypted. This requirement would prevent access for client apps that can view access tokens.)

## JwtBearer configuration

This section describes how to configure a bearer token.

### Config file

```Json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-api-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    /*
      You need specify the TenantId only if you want to accept access tokens from a single tenant
     (line-of-business app).
      Otherwise, you can leave them set to common.
      This can be:
      - A GUID (Tenant ID = Directory ID)
      - 'common' (any organization and personal accounts)
      - 'organizations' (any organization)
      - 'consumers' (Microsoft personal accounts)
    */
    "TenantId": "common"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Code initialization

When an app is called on a controller action that holds an `[Authorize]` attribute, ASP.NET/ASP.NET Core looks at the bearer token in the Authorization header of the calling request and extracts the access token. The token is then forwarded to the JwtBearer middleware, which calls Microsoft IdentityModel Extensions for .NET.

In ASP.NET Core, this middleware is initialized in the Startup.cs file:

```CSharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

The middleware is added to the web API by this instruction:

```CSharp
 services.AddAzureAdBearer(options => Configuration.Bind("AzureAd", options));
```

 Currently, the ASP.NET Core templates create Azure Active Directory (Azure AD) web APIs that sign in users within your organization or any organization, not with personal accounts. But you can easily change them to use the Microsoft identity platform endpoint by adding this code to the Startup.cs file:

```CSharp
services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
{
    // This is a Microsoft identity platform v2.0 web API.
    options.Authority += "/v2.0";

    // The web API accepts as audiences both the Client ID (options.Audience) and api://{ClientID}.
    options.TokenValidationParameters.ValidAudiences = new []
    {
     options.Audience,
     $"api://{options.Audience}"
    };

    // Instead of using the default validation (validating against a single tenant,
    // as we do in line-of-business apps),
    // we inject our own multitenant validation logic (which even accepts both v1 and v2 tokens).
    options.TokenValidationParameters.IssuerValidator = AadIssuerValidator.ValidateAadIssuer;
});
```

## Token validation

The JwtBearer middleware, like the OpenID Connect middleware in web apps, is directed by `TokenValidationParameters` to validate the token. The token is decrypted (as needed), the claims are extracted, and the signature is verified. The middleware then validates the token by checking for this data:

- It's targeted for the web API (audience).
- It was issued for an app that's allowed to call the web API (sub).
- It was issued by a trusted security token service (STS) (issuer).
- Its lifetime is in range (expiry).
- It wasn't tampered with (signature).

There can also be special validations. For example, it's possible to validate that signing keys (when embedded in a token) are trusted and that the token isn't being replayed. Finally, some protocols require specific validations.

### Validators

The validation steps are captured in validators, which are all in the [Microsoft IdentityModel Extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) open-source library, in one source file: [Microsoft.IdentityModel.Tokens/Validators.cs](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/master/src/Microsoft.IdentityModel.Tokens/Validators.cs).

The validators are described in this table:

| Validator | Description |
|---------|---------|
| `ValidateAudience` | Ensures the token is for the application that validates the token (for me). |
| `ValidateIssuer` | Ensures the token was issued by a trusted STS (from someone I trust). |
| `ValidateIssuerSigningKey` | Ensures the application validating the token trusts the key that was used to sign the token. (Special case where the key is embedded in the token. Not usually required.) |
| `ValidateLifetime` | Ensures the token is still (or already) valid. The validator checks if the lifetime of the token (`notbefore` and `expires` claims) is in range. |
| `ValidateSignature` | Ensures the token hasn't been tampered with. |
| `ValidateTokenReplay` | Ensures the token isn't replayed. (Special case for some onetime use protocols.) |

The validators are all associated with properties of the `TokenValidationParameters` class, themselves initialized from the ASP.NET/ASP.NET Core configuration. In most cases, you won't have to change the parameters. There's one exception, for apps that aren't single tenants. (That is, web apps that accept users from any organization or from personal Microsoft accounts.) In this case, the issuer must be validated.

## Next steps

> [!div class="nextstepaction"]
> [Verify scopes and app roles in your code](scenario-protected-web-api-verification-scope-app-roles.md)
