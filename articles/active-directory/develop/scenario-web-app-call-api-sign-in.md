---
title: Web app that calls web APIs (sign in) - Microsoft identity platform
description: Learn how to build a Web app that calls web APIs (sign in)
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
#Customer intent: As an application developer, I want to know how to write a Web app that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that calls web APIs - sign in

You already know how to add sign-in to your web app. You learn that in [Web app that signs-in users - add sign-in](scenario-web-app-sign-user-sign-in.md).

What is different here, is that when the user has signed out, from this application, or from any application, you want to remove from the token cache, the tokens associated with the user.

## Intercepting the callback after sign out - Single Sign Out

Your application can intercept the after `logout` event, for instance to clear the entry of the token cache associated with the account that signed out. We'll see in the second part of this tutorial (about the Web app calling a Web API), that the web app will store access tokens for the user in a cache. Intercepting the after `logout` callback enables your web application to remove the user from the token cache. This mechanism is illustrated in the `AddMsal()` method of [StartupHelper.cs L137-143](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/b87a1d859ff9f9a4a98eb7b701e6a1128d802ec5/Microsoft.Identity.Web/StartupHelpers.cs#L137-L143)

The **Logout Url** that you've registered for your application enables you to implement single sign out. The Microsoft identity platform `logout` endpoint will call the **Logout URL** registered with your application. This call happens if the sign-out was initiated from your web app, or from another web app or the browser. For more information, see [Single sign-out](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#single-sign-out) in the conceptual documentation.

```CSharp
public static IServiceCollection AddMsal(this IServiceCollection services, IEnumerable<string> initialScopes)
{
    services.AddTokenAcquisition();

    services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
    {
     ...
        // Handling the sign-out: removing the account from MSAL.NET cache
        options.Events.OnRedirectToIdentityProviderForSignOut = async context =>
        {
            // Remove the account from MSAL.NET token cache
            var _tokenAcquisition = context.HttpContext.RequestServices.GetRequiredService<ITokenAcquisition>();
            await _tokenAcquisition.RemoveAccount(context);
        };
    });
    return services;
}
```

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token for the web app](scenario-web-app-call-api-acquire-token.md)
