---
title: protected Web API - app's code configuration | Azure
description: Learn how to build a protected Web API (app's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected Web API - app's code configuration

Learn how to configure the code for your protected Web API.

## What makes ASP.NET/ASP.NET Core APIs protected?

### Protected APIs

Like in Web Apps, the ASP.NET/ASP.NET core Web APIs are "protected" because their controller actions are prefixed with the `[Authorize]` attribute.
The controller actions can, thus, only be called if the API is called with an identity that is authorized. Now the questions are:

- how does the Web API know the identity of the application that call it (only an application can call a Web API)?
- If the application called our Web API on behalf of a user, what is the identity of the user?

### Bearer token

This information about the identity of the application, and about the user (unless our web app accepts service to service calls from a daemon application), is held in the bearer token that is set in the header when calling the application. Here is an example of  C# code of a client calling our API after acquiring a token with MSAL.NET

```CSharp
var scopes = new[] {$"api://.../access_as_user}";
var result = await app.AcquireToken(scopes)
                      .ExecuteAsync();

httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call the Web API.
HttpResponseMessage response = await _httpClient.GetAsync(apiUri);
```

> [!IMPORTANT]
> The bearer token was requested by a client application to the Microsoft identity platform v2.0 endpoint **for our Web API**.
> Our Web API is the only application that should verify the token, and look at the claims it contains.
> The client applications should never look at the claims in the tokens (the Web API could decide, in the future, that it demands
> that the token be encrypted and this would break client application which would crack open the access tokens)

## JwtBearer configuration

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

When the application is called on the controller action holding an `[Authorize]` attribute, ASP.NET/ASP.NET core looks at the bearer token in the Authorization header of the calling request and extracts the access token, which is then forwarded to the JwtBearer middleware, itself calling the Microsoft Identity Model Extensions for .NET.

In ASP.NET Core, this middleware is initialized in the `Startup.cs` file.

```CSharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

The middleware is added to the Web API by the following instruction:

```CSharp
 services.AddAzureAdBearer(options => Configuration.Bind("AzureAd", options));
```

 Currently the ASP.NET Core templates create Azure AD v1.0 Web APIs.
 However you can easily change them to use the Microsoft identity platform v2.0 endpoint by adding the following code in the `Startup.cs` file.

```CSharp
services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
{
    // This is a Microsoft identity platform v2.0 Web API
    options.Authority += "/v2.0";

    // The Web API accepts as audiences are both the Client ID (options.Audience) and api://{ClientID}
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

The JwtBearer middleware, like the OpenID Connect middleware in Web Apps, is directed by the `TokenValidationParameters` to validate the token. The token is decrypted (if needed), the claims are extracted, the signature is verified. Then, the token is validated by checking that:

- it's targeted for the Web API (audience)
- it was issued for an application that is allowed to call the Web API (sub)
- it was issued by a trustable Security Token Server (STS) (issuer)
- the token's lifetime is in range (expiry)
- it wasn't tampered with (signature)

There can also be special validations. For instance, it's possible to validate that signing keys (when embedded in a token) are trusted and that the token isn't being replayed. Finally, some protocols require specific validations.

### Validators

The validation steps are captured into Validators, which are all in the [Microsoft Identity Model Extension for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) open-source library, in one source file: [Microsoft.IdentityModel.Tokens/Validators.cs](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/master/src/Microsoft.IdentityModel.Tokens/Validators.cs)

The validators are described in the following table:

Validator | Description
--------- | ---------
`ValidateAudience` | Ensures that the token is indeed for the application that validates the token (for me)
`ValidateIssuer` | Ensures that the token was issued by an STS I trust (from someone I trust)
`ValidateIssuerSigningKey` | Ensures the application validating the token trusts the key that was used to sign the token (special case where the key is embedded in the token, usually not required)
`ValidateLifetime` | Ensures that the token is still (or already) valid. Done by checking that the lifetime of the token (`notbefore`, `expires` claims) is in range
`ValidateSignature` | Ensures that the token hasn't been tampered
`ValidateTokenReplay` | Ensure the token isn't replayed (Special case for some onetime use protocols)

The validators are all associated with properties of the `TokenValidationParameters` class, themselves initialized from the ASP.NET / ASP.NET core configuration. In most cases, you won't have to change the parameters. There is, however one exception: for applications that aren't single tenants (that is Web apps accepting users from any organization or Microsoft personal accounts): the issuer must be validated.

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-protected-web-api-production.md)
