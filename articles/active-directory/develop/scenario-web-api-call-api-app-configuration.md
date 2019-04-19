---
title: web API that calls Web APIs - app's code configuration | Azure
description: Learn how to build a web API that calls Web APIs (app's code configuration)
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
#Customer intent: As an application developer, I want to know how to write a web API that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# web API that calls Web APIs - app's code configuration

Learn how to configure the code for your web API that calls Web APIs.


## Subscribe to OnTokenValidated

```CSharp
/// <summary>
/// Protects the Web API with Microsoft Identity Platform v2.0 (AAD v2.0)
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
        // When an access token for our own Web API is validated, we add it to MSAL.NET's cache so that it can
        // be used from the controllers.
        options.Events = new JwtBearerEvents();

        options.Events.OnTokenValidated = async context =>
        {
            var tokenAcquisition = context.HttpContext.RequestServices.GetRequiredService<ITokenAcquisition>();
            context.Success();

            // Adds the token to the cache, and also handles the incremental consent and claim challenges
            tokenAcquisition.AddAccountToCacheFromJwt(context, scopes);
            await Task.FromResult(0);
        };
    });
    return services;
}
```

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token for the app](scenario-web-api-call-api-acquire-token.md)
