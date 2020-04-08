---
title: Remove accounts from the token cache on sign-out - Microsoft identity platform | Azure
description: Learn how to remove an account from the token cache on sign-out
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/30/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform for developers.
---

# A web app that calls web APIs: Remove accounts from the token cache on global sign-out

You learned how to add sign-in to your web app in [Web app that signs in users: Sign-in and sign-out](scenario-web-app-sign-user-sign-in.md).

Sign-out is different for a web app that calls web apis. When the user signs out from your application, or from any application, you must remove the tokens associated with that user from the token cache.

## Intercept the callback after single sign-out

To clear the token-cache entry associated with the account that signed out, your application can intercept the after `logout` event. Web apps store access tokens for each user in a token cache. By intercepting the after `logout` callback,  your web application can remove the user from the cache.

# [ASP.NET Core](#tab/aspnetcore)

For ASP.NET Core, the interception mechanism is illustrated in the `AddMsal()` method of [WebAppServiceCollectionExtensions.cs#L151-L157](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/db7f74fd7e65bab9d21092ac1b98a00803e5ceb2/Microsoft.Identity.Web/WebAppServiceCollectionExtensions.cs#L151-L157).

The Logout URL that you previously registered for your application enables you to implement single sign-out. The Microsoft identity platform `logout` endpoint calls your Logout URL. This call happens if the sign-out started from your web app, or from another web app or the browser. For more information, see [Single sign-out](v2-protocols-oidc.md#single-sign-out).

```csharp
public static class WebAppServiceCollectionExtensions
{
 public static IServiceCollection AddMsal(this IServiceCollection services, IConfiguration configuration, IEnumerable<string> initialScopes, string configSectionName = "AzureAd")
 {
  // Code omitted here

  services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
  {
   // Code omitted here

   // Handling the sign-out: Remove the account from MSAL.NET cache.
   options.Events.OnRedirectToIdentityProviderForSignOut = async context =>
   {
    // Remove the account from MSAL.NET token cache.
    var tokenAcquisition = context.HttpContext.RequestServices.GetRequiredService<ITokenAcquisition>();
    await tokenAcquisition.RemoveAccountAsync(context).ConfigureAwait(false);
   };
  });
  return services;
 }
}
```

The code for `RemoveAccountAsync` is available from [Microsoft.Identity.Web/TokenAcquisition.cs#L264-L288](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/db7f74fd7e65bab9d21092ac1b98a00803e5ceb2/Microsoft.Identity.Web/TokenAcquisition.cs#L264-L288).

# [ASP.NET](#tab/aspnet)

The ASP.NET sample doesn't remove accounts from the cache on global sign-out.

# [Java](#tab/java)

The Java sample doesn't remove accounts from the cache on global sign-out.

# [Python](#tab/python)

The Python sample doesn't remove accounts from the cache on global sign-out.

---

## Next steps

# [ASP.NET Core](#tab/aspnetcore)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=aspnetcore)

# [ASP.NET](#tab/aspnet)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=aspnet)

# [Java](#tab/java)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=java)

# [Python](#tab/python)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=python)

---
