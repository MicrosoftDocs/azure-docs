---
title: Configure protected web API apps | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a protected web API and configure your application's code.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
---

# Protected web API: Code configuration

To configure the code for your protected web API, you need to understand:

- What defines APIs as protected.
- How to configure a bearer token.
- How to validate the token.

## What defines ASP.NET and ASP.NET Core APIs as protected?

Like web apps, the ASP.NET and ASP.NET Core web APIs are protected because their controller actions are prefixed with the **[Authorize]** attribute. The controller actions can be called only if the API is called with an authorized identity.

Consider the following questions:

- Only an app can call a web API. How does the API know the identity of the app that calls it?
- If the app calls the API on behalf of a user, what's the user's identity?

## Bearer token

The bearer token that's set in the header when the app is called holds information about the app identity. It also holds information about the user unless the web app accepts service-to-service calls from a daemon app.

Here's a C# code example that shows a client calling the API after it acquires a token with Microsoft Authentication Library for .NET (MSAL.NET):

```csharp
var scopes = new[] {$"api://.../access_as_user"};
var result = await app.AcquireToken(scopes)
                      .ExecuteAsync();

httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call the web API.
HttpResponseMessage response = await _httpClient.GetAsync(apiUri);
```

> [!IMPORTANT]
> A client application requests the bearer token to the Microsoft identity platform endpoint *for the web API*. The web API is the only application that should verify the token and view the claims it contains. Client apps should never try to inspect the claims in tokens.
>
> In the future, the web API might require that the token be encrypted. This requirement would prevent access for client apps that can view access tokens.

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

When an app is called on a controller action that holds an **[Authorize]** attribute, ASP.NET and ASP.NET Core extract the access token from the Authorization header's bearer token. The access token is then forwarded to the JwtBearer middleware, which calls Microsoft IdentityModel Extensions for .NET.

In ASP.NET Core, this middleware is initialized in the Startup.cs file.

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

The middleware is added to the web API by this instruction:

```csharp
 services.AddAuthentication(AzureADDefaults.JwtBearerAuthenticationScheme)
         .AddAzureADBearer(options => Configuration.Bind("AzureAd", options));
```

 Currently, the ASP.NET Core templates create Azure Active Directory (Azure AD) web APIs that sign in users within your organization or any organization. They don't sign in users with personal accounts. But you can change the templates to use the Microsoft identity platform endpoint by adding this code to Startup.cs:

```csharp
services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
{
    // This is a Microsoft identity platform web API.
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
    options.TokenValidationParameters.IssuerValidator = AadIssuerValidator.GetIssuerValidator(options.Authority).Validate;;
});
```

The preceding code snippet is extracted from the ASP.NET Core web API incremental tutorial in [Microsoft.Identity.Web/WebApiServiceCollectionExtensions.cs#L50-L63](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/blob/154282843da2fc2958fad151e2a11e521e358d42/Microsoft.Identity.Web/WebApiServiceCollectionExtensions.cs#L50-L63). The **AddProtectedWebApi** method, which does more than the snippet shows, is called from Startup.cs.

## Token validation

In the preceding snippet, the JwtBearer middleware, like the OpenID Connect middleware in web apps, validates the token based on the value of `TokenValidationParameters`. The token is decrypted as needed, the claims are extracted, and the signature is verified. The middleware then validates the token by checking for this data:

- Audience: The token is targeted for the web API.
- Sub: It was issued for an app that's allowed to call the web API.
- Issuer: It was issued by a trusted security token service (STS).
- Expiry: Its lifetime is in range.
- Signature: It wasn't tampered with.

There can also be special validations. For example, it's possible to validate that signing keys, when embedded in a token, are trusted and that the token isn't being replayed. Finally, some protocols require specific validations.

### Validators

The validation steps are captured in validators, which are provided by the [Microsoft IdentityModel Extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) open-source library. The validators are defined in the library source file [Microsoft.IdentityModel.Tokens/Validators.cs](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/master/src/Microsoft.IdentityModel.Tokens/Validators.cs).

This table describes the validators:

| Validator | Description |
|---------|---------|
| **ValidateAudience** | Ensures the token is for the application that validates the token for you. |
| **ValidateIssuer** | Ensures the token was issued by a trusted STS, meaning it's from someone you trust. |
| **ValidateIssuerSigningKey** | Ensures the application validating the token trusts the key that was used to sign the token. There's a special case where the key is embedded in the token. But this case doesn't usually arise. |
| **ValidateLifetime** | Ensures the token is still or already valid. The validator checks if the lifetime of the token is in the range specified by the **notbefore** and **expires** claims. |
| **ValidateSignature** | Ensures the token hasn't been tampered with. |
| **ValidateTokenReplay** | Ensures the token isn't replayed. There's a special case for some onetime-use protocols. |

The validators are associated with properties of the **TokenValidationParameters** class. The properties are initialized from the ASP.NET and ASP.NET Core configuration.

In most cases, you don't need to change the parameters. Apps that aren't single tenants are exceptions. These web apps accept users from any organization or from personal Microsoft accounts. Issuers in this case must be validated.

## Token validation in Azure Functions

You can also validate incoming access tokens in Azure Functions. You can find examples of such validation in [Microsoft .NET](https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions), [NodeJS](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-azurefunctions), and [Python](https://github.com/Azure-Samples/ms-identity-python-webapi-azurefunctions).

## Next steps

> [!div class="nextstepaction"]
> [Verify scopes and app roles in your code](scenario-protected-web-api-verification-scope-app-roles.md)
