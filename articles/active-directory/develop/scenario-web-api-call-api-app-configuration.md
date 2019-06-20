---
title: Web API that calls downstream web APIs (app's code configuration) - Microsoft identity platform
description: Learn how to build a web API that calls web APIs (app's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web API that calls web APIs - code configuration

After you've registered your web API, you can configure the code for the application.

The code to configure your web API so that it calls downstream web APIs builds on top of the code used to protect a web API. For more info, see [Protected web API - app configuration](scenario-protected-web-api-app-configuration.md).

## Code subscribed to OnTokenValidated

On top of the code configuration for any protected web APIs, you need to subscribe to the validation of the bearer token that's received when your API is called:

```CSharp
/// <summary>
/// Protects the web API with Microsoft Identity Platform v2.0 (AAD v2.0)
/// This supposes that the configuration files have a section named "AzureAD"
/// </summary>
/// <param name="services">Service collection to which to add authentication</param>
/// <param name="configuration">Configuration</param>
/// <returns></returns>
public static IServiceCollection AddProtectedApiCallsWebApis(this IServiceCollection services,
                                                             IConfiguration configuration,
                                                             IEnumerable<string> scopes)
{
    services.AddTokenAcquisition();
    services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
    {
        // When an access token for our own web API is validated, we add it 
        // to MSAL.NET's cache so that it can be used from the controllers.
        options.Events = new JwtBearerEvents();

        options.Events.OnTokenValidated = async context =>
        {
            context.Success();

            // Adds the token to the cache, and also handles the incremental consent 
            // and claim challenges
            AddAccountToCacheFromJwt(context, scopes);
            await Task.FromResult(0);
        };
    });
    return services;
}
```

## On-behalf-of flow

The AddAccountToCacheFromJwt() method needs to:

- Instantiate an MSAL confidential client application.
- Call `AcquireTokenOnBehalf` to exchange the bearer token that was acquired by the client for the web API, against a bearer token for the same user, but for our API to call a downstream API.

### Instantiate a confidential client application

This flow is only available in the confidential client flow so the protected web API provides client credentials (client secret or certificate) to the [ConfidentialClientApplicationBuilder](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder) via the `WithClientSecret` or `WithCertificate` methods, respectively.

![image](https://user-images.githubusercontent.com/13203188/55967244-3d8e1d00-5c7a-11e9-8285-a54b05597ec9.png)

```CSharp
IConfidentialClientApplication app;

#if !VariationWithCertificateCredentials
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
           .WithClientSecret(config.ClientSecret)
           .Build();
#else
// Building the client credentials from a certificate
X509Certificate2 certificate = ReadCertificate(config.CertificateName);
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
    .WithCertificate(certificate)
    .Build();
#endif
```

### How to call on-behalf-of

The on-behalf-of (OBO) call is done by calling the [AcquireTokenOnBehalf](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.acquiretokenonbehalfofparameterbuilder) method on the `IConfidentialClientApplication` interface.

The `ClientAssertion` is built from the bearer token received by the web API from its own clients. There are [two constructors](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.clientcredential.-ctor?view=azure-dotnet), one that takes a JWT bearer token, and one that takes any kind of user assertion (another kind of security token, which type is then specified in an additional parameter named `assertionType`).

![image](https://user-images.githubusercontent.com/13203188/37082180-afc4b708-21e3-11e8-8af8-a6dcbd2dfba8.png)

In practice, the OBO flow is often used to acquire a token for a downstream API and store it in the MSAL.NET user token cache so that other parts of the web API can later call on the [overrides](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.clientapplicationbase.acquiretokensilent?view=azure-dotnet) of ``AcquireTokenOnSilent`` to call the downstream APIs. This has the effect of refreshing the tokens, if needed.

```CSharp
private void AddAccountToCacheFromJwt(IEnumerable<string> scopes, JwtSecurityToken jwtToken, ClaimsPrincipal principal, HttpContext httpContext)
{
 try
 {
  UserAssertion userAssertion;
  IEnumerable<string> requestedScopes;
  if (jwtToken != null)
  {
   userAssertion = new UserAssertion(jwtToken.RawData, "urn:ietf:params:oauth:grant-type:jwt-bearer");
   requestedScopes = scopes ?? jwtToken.Audiences.Select(a => $"{a}/.default");
  }
  else
  {
   throw new ArgumentOutOfRangeException("tokenValidationContext.SecurityToken should be a JWT Token");
  }

  // Create the application
  var application = BuildConfidentialClientApplication(httpContext, principal);

  // .Result to make sure that the cache is filled-in before the controller tries to get access tokens
  var result = application.AcquireTokenOnBehalfOf(requestedScopes.Except(scopesRequestedByMsalNet),
                                                  userAssertion)
                                        .ExecuteAsync()
                                        .GetAwaiter().GetResult();
 }
 catch (MsalException ex)
 {
  Debug.WriteLine(ex.Message);
  throw;
 }
}
```

## Protocol

For more information about the on-behalf-of protocol, see [Microsoft identity platform and OAuth 2.0 On-Behalf-Of flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow)

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token for the app](scenario-web-api-call-api-acquire-token.md)
