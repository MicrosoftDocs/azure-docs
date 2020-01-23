---
title: Remove accounts from token cache on sign-out - Microsoft identity platform | Azure
description: Learn how to remove an account from the token cache on sign-out
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
ms.date: 09/30/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Web app that calls Web APIs using the Microsoft identity platform for developers.
---

# Remove accounts from the cache on global sign-out

You already know how to add sign-in to your web app. You learn that in [Web app that signs-in users - add sign-in](scenario-web-app-sign-user-sign-in.md).

What is different here, is that when the user has signed out, from this application, or from any application, you want to remove from the token cache, the tokens associated with the user.

## Intercepting the callback after sign-out - Single Sign Out

Your application can intercept the after `logout` event, for instance to clear the entry of the token cache associated with the account that signed out. The web app will store access tokens for the user in a cache. Intercepting the after `logout` callback enables your web application to remove the user from the token cache.

# [ASP.NET Core](#tab/aspnetcore)

This mechanism is illustrated in the `AddMsal()` method of [WebAppServiceCollectionExtensions.cs#L151-L157](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/db7f74fd7e65bab9d21092ac1b98a00803e5ceb2/Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L151-L157)

The **Logout Url** that you've registered for your application enables you to implement single sign-out. The Microsoft identity platform `logout` endpoint will call the **Logout URL** registered with your application. This call happens if the sign-out was initiated from your web app, or from another web app or the browser. For more information, see [Single sign-out](v2-protocols-oidc.md#single-sign-out).

```csharp
public static class WebAppServiceCollectionExtensions
{
 public static IServiceCollection AddMsal(this IServiceCollection services, IConfiguration configuration, IEnumerable<string> initialScopes, string configSectionName = "AzureAd")
 {
  // Code omitted here

  services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
  {
   // Code omitted here

   // Handling the sign-out: removing the account from MSAL.NET cache
   options.Events.OnRedirectToIdentityProviderForSignOut = async context =>
   {
    // Remove the account from MSAL.NET token cache
    var tokenAcquisition = context.HttpContext.RequestServices.GetRequiredService<ITokenAcquisition>();
    await tokenAcquisition.RemoveAccountAsync(context).ConfigureAwait(false);
   };
  });
  return services;
 }
}
```

The code for RemoveAccountAsync is available from [Microsoft.Identity.Web/TokenAcquisition.cs#L264-L288](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/db7f74fd7e65bab9d21092ac1b98a00803e5ceb2/Microsoft.Identity.Web/TokenAcquisition.cs#L264-L288).

# [ASP.NET](#tab/aspnet)

The ASP.NET sample doesn't remove accounts from the cache on global sign-out

# [Java](#tab/java)

The Java sample doesn't remove accounts from the cache on global sign-out

# [Python](#tab/python)

The Python sample doesn't remove accounts from the cache on global sign-out

---

## Next steps

# [ASP.NET Core](#tab/aspnetcore)

> [!div class="nextstepaction"]
> [Acquiring a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=aspnetcore)

# [ASP.NET](#tab/aspnet)

> [!div class="nextstepaction"]
> [Acquiring a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=aspnet)

# [Java](#tab/java)

> [!div class="nextstepaction"]
> [Acquiring a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=java)

# [Python](#tab/python)

> [!div class="nextstepaction"]
> [Acquiring a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=python)

---
