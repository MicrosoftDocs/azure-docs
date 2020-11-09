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
ms.date: 07/15/2020
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

#### Case where you used a custom App ID URI for your web API

If you've accepted the App ID URI proposed by the app registration portal, you don't need to specify the audience (see [Application ID URI and scopes](scenario-protected-web-api-app-registration.md#application-id-uri-and-scopes)). Otherwise, you should add an `Audience` property whose value is the App ID URI for your web API.

```Json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-api-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    "TenantId": "common",
    "Audience": "custom App ID URI for your web API"
  },
  // more lines
}
```

### Code initialization

When an app is called on a controller action that holds an **[Authorize]** attribute, ASP.NET and ASP.NET Core extract the access token from the Authorization header's bearer token. The access token is then forwarded to the JwtBearer middleware, which calls Microsoft IdentityModel Extensions for .NET.

#### Microsoft.Identity.Web

Microsoft recommends you use the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) NuGet package when developing a web API with ASP.NET Core.

_Microsoft.Identity.Web_ provides the glue between ASP.NET Core, the authentication middleware, and the [Microsoft Authentication Library (MSAL)](msal-overview.md) for .NET. It allows for a clearer, more robust developer experience and leverages the power of the Microsoft identity platform and Azure AD B2C.

#### Using Microsoft.Identity.Web templates

You can create a web API from scratch by using Microsoft.Identity.Web project templates. For details see [Microsoft.Identity.Web - Web API project template](https://aka.ms/ms-id-web/webapi-project-templates).

#### Starting from an existing ASP.NET Core 3.1 application

Today, ASP.NET Core 3.1 uses the Microsoft.AspNetCore.AzureAD.UI library. The middleware is initialized in the Startup.cs file.

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

The middleware is added to the web API by this instruction:

```csharp
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
  services.AddAuthentication(AzureADDefaults.JwtBearerAuthenticationScheme)
          .AddAzureADBearer(options => Configuration.Bind("AzureAd", options));
}
```

 Currently, the ASP.NET Core templates create Azure Active Directory (Azure AD) web APIs that sign in users within your organization or any organization. They don't sign in users with personal accounts. However, you can change the templates to use the Microsoft identity platform endpoint by using [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) replacing the code in *Startup.cs*:

```csharp
using Microsoft.Identity.Web;
```

```csharp
public void ConfigureServices(IServiceCollection services)
{
 // Adds Microsoft Identity platform (AAD v2.0) support to protect this API
 services.AddMicrosoftIdentityWebApiAuthentication(Configuration, "AzureAd");

 services.AddControllers();
}
```

you can also write the following (which is equivalent)

```csharp
public void ConfigureServices(IServiceCollection services)
{
 // Adds Microsoft Identity platform (AAD v2.0) support to protect this API
 services.AddAuthentication(AzureADDefaults.JwtBearerAuthenticationScheme)
             .AddMicrosoftIdentityWebApi(Configuration, "AzureAd");

services.AddControllers();
}
```

> [!NOTE]
> If you use Microsoft.Identity.Web and don't set the `Audience` in *appsettings.json*, the following is used:
> -  `$"{ClientId}"` if you have set the [access token accepted version](scenario-protected-web-api-app-registration.md#accepted-token-version) to `2`, or for Azure AD B2C web APIs.
> - `$"api://{ClientId}` in all other cases (for v1.0 [access tokens](access-tokens.md)).
> For details, see Microsoft.Identity.Web [source code](https://github.com/AzureAD/microsoft-identity-web/blob/d2ad0f5f830391a34175d48621a2c56011a45082/src/Microsoft.Identity.Web/Resource/RegisterValidAudience.cs#L70-L83).

The preceding code snippet is extracted from the [ASP.NET Core web API incremental tutorial](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/blob/63087e83326e6a332d05fee6e1586b66d840b08f/1.%20Desktop%20app%20calls%20Web%20API/TodoListService/Startup.cs#L23-L28). The detail of **AddMicrosoftIdentityWebApiAuthentication** is available in [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web/blob/d2ad0f5f830391a34175d48621a2c56011a45082/src/Microsoft.Identity.Web/WebApiExtensions/WebApiServiceCollectionExtensions.cs#L27). This method calls [AddMicrosoftWebAPI](https://github.com/AzureAD/microsoft-identity-web/blob/d2ad0f5f830391a34175d48621a2c56011a45082/src/Microsoft.Identity.Web/WebApiExtensions/WebApiAuthenticationBuilderExtensions.cs#L58), which itself instructs the middleware on how to validate the token. For details see its [source code](https://github.com/AzureAD/microsoft-identity-web/blob/d2ad0f5f830391a34175d48621a2c56011a45082/src/Microsoft.Identity.Web/WebApiExtensions/WebApiAuthenticationBuilderExtensions.cs#L104-L122).

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

#### Customizing token validation

The validators are associated with properties of the **TokenValidationParameters** class. The properties are initialized from the ASP.NET and ASP.NET Core configuration.

In most cases, you don't need to change the parameters. Apps that aren't single tenants are exceptions. These web apps accept users from any organization or from personal Microsoft accounts. Issuers in this case must be validated. Microsoft.Identity.Web takes care of the issuer validation as well. For details see Microsoft.Identity.Web [AadIssuerValidator](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web/Resource/AadIssuerValidator.cs).

In ASP.NET Core, if you want to customize the token validation parameters, use the following snippet in your *Startup.cs*:

```c#
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApi(Configuration);
services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
  var existingOnTokenValidatedHandler = options.Events.OnTokenValidated;
  options.Events.OnTokenValidated = async context =>
  {
       await existingOnTokenValidatedHandler(context);
      // Your code to add extra configuration that will be executed after the current event implementation.
      options.TokenValidationParameters.ValidIssuers = new[] { /* list of valid issuers */ };
      options.TokenValidationParameters.ValidAudiences = new[] { /* list of valid audiences */};
  }
});
```

For ASP.NET MVC, the following code sample shows how to do custom token validation:

https://github.com/azure-samples/active-directory-dotnet-webapi-manual-jwt-validation

## Token validation in Azure Functions

You can also validate incoming access tokens in Azure Functions. You can find examples of such validation in the following code samples on GitHub:

- .NET: [Azure-Samples/ms-identity-dotnet-webapi-azurefunctions](https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions)
- Node.js: [Azure-Samples/ms-identity-nodejs-webapi-azurefunctions](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-azurefunctions)
- Python: [Azure-Samples/ms-identity-python-webapi-azurefunctions)](https://github.com/Azure-Samples/ms-identity-python-webapi-azurefunctions)

## Next steps

Move on to the next article in this scenario,
[Verify scopes and app roles in your code](scenario-protected-web-api-verification-scope-app-roles.md).
