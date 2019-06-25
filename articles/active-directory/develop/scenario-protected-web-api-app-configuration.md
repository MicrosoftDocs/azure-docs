---
title: Protected web API - app code configuration | Azure
description: Learn how to build a protected Web API and configure your application's code.
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
#Customer intent: As an application developer, I want to know how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected web API - code configuration

To successfully configure the code for your protected web API, you need to understand what makes the APIs protected, what you need to configure the bearer token, and how to validate the token.

## What makes ASP.NET/ASP.NET Core APIs protected?

Like in web Apps, the ASP.NET/ASP.NET core web APIs are "protected" because their controller actions are prefixed with the `[Authorize]` attribute. Therefore, the controller actions can only be called if the API is called with an identity that is authorized.

Consider the following questions:

- How does the web API know the identity of the application that calls it (only an application can call a web API)?
- If the application called the web API on behalf of a user, what is the user's identity?

## Bearer token

The information about the identity of the application, and about the user (unless the web app accepts service-to-service calls from a daemon application), is held in the bearer token that's set in the header when calling the application.

Here's a C# code example that shows a client calling the API after acquiring a token with MSAL.NET.

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
> The bearer token was requested by a client application to the Microsoft identity platform endpoint **for the web API**. The web API is the only application that should verify the token and look at the claims it contains. The client applications should never look at the claims in the tokens (the web API could decide, in the future, that it demands that the token be encrypted and this will break the client application which can crack open the access tokens).

## JwtBearer configuration

This section covers what you need to configure the bearer token.

### Config file

```Json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-api-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    /*
      You need specify the TenantId only if you want to accept access tokens from a single tenant
     (line of business app)
      Otherwise you can leave them set to common
      This can be:
      - A guid (Tenant ID = Directory ID)
      - 'common' (Any organization and personal accounts)
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

When the application is called on the controller action holding an `[Authorize]` attribute, ASP.NET/ASP.NET core looks at the bearer token in the Authorization header of the calling request and extracts the access token, which is then forwarded to the JwtBearer middleware, which calls the Microsoft Identity Model Extensions for .NET.

In ASP.NET Core, this middleware is initialized in the `Startup.cs` file.

```CSharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

The middleware is added to the web API by the following instruction:

```CSharp
 services.AddAzureAdBearer(options => Configuration.Bind("AzureAd", options));
```

 Currently, the ASP.NET Core templates create Azure AD v1.0 web APIs. However, you can easily change them to use the Microsoft identity platform endpoint by adding the following code in the `Startup.cs` file.

```CSharp
services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
{
    // This is a Microsoft identity platform v2.0 web API
    options.Authority += "/v2.0";

    // The web API accepts as audiences are both the Client ID (options.Audience) and api://{ClientID}
    options.TokenValidationParameters.ValidAudiences = new []
    {
     options.Audience,
     $"api://{options.Audience}"
    };

    // Instead of using the default validation (validating against a single tenant,
    // as we do in line of business apps),
    // we inject our own multi-tenant validation logic (which even accepts both V1 and V2 tokens)
    options.TokenValidationParameters.IssuerValidator = AadIssuerValidator.ValidateAadIssuer;
});
```

## Token validation

The JwtBearer middleware, like the OpenID Connect middleware in web apps, is directed by the `TokenValidationParameters` to validate the token. The token is decrypted (if needed), the claims are extracted, and the signature is verified. Then, the token is validated by checking for the following data:

- It's targeted for the web API (audience)
- It was issued for an application that is allowed to call the web API (sub)
- It was issued by a trustable Security Token Server (STS) (issuer)
- The token's lifetime is in range (expiry)
- It wasn't tampered with (signature)

There can also be special validations. For instance, it's possible to validate that signing keys (when embedded in a token) are trusted and that the token isn't being replayed. Finally, some protocols require specific validations.

### Validators

The validation steps are captured into validators, which are all in the [Microsoft Identity Model Extension for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) open-source library, in one source file: [Microsoft.IdentityModel.Tokens/Validators.cs](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/master/src/Microsoft.IdentityModel.Tokens/Validators.cs)

The validators are described in the following table:

| Validator | Description |
|---------|---------|
| `ValidateAudience` | Ensures that the token is for the application that validates the token (for me). |
| `ValidateIssuer` | Ensures that the token was issued by a trusted STS (from someone I trust). |
| `ValidateIssuerSigningKey` | Ensures the application validating the token trusts the key that was used to sign the token (special case where the key is embedded in the token, usually not required). |
| `ValidateLifetime` | Ensures that the token is still (or already) valid. Done by checking that the lifetime of the token (`notbefore`, `expires` claims) is in range. |
| `ValidateSignature` | Ensures that the token hasn't been tampered. |
| `ValidateTokenReplay` | Ensures the token isn't replayed (special case for some onetime use protocols). |

The validators are all associated with properties of the `TokenValidationParameters` class, themselves initialized from the ASP.NET/ASP.NET Core configuration. In most cases, you won't have to change the parameters. There is one exception for applications that aren't single tenants (that is web apps that accept users from any organization or personal Microsoft accounts) -- in this case, the issuer must be validated.

## Next steps

> [!div class="nextstepaction"]
> [Verify scopes and app roles in your code](scenario-protected-web-api-verification-scope-app-roles.md)
