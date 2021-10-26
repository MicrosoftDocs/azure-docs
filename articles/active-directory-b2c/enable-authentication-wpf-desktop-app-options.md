---
title: Enable WPF desktop application options using Azure Active Directory B2C
description:  Enable the use of WPF desktop application options by using several ways.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 08/04/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication options in a WPF desktop app by using Azure AD B2C 

This article describes ways you can customize and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your Windows Presentation Foundation (WPF) desktop application. 

Before you start, familiarize yourself with the [Configure authentication in a sample WPF desktop app by using Azure AD B2C](configure-authentication-sample-wpf-desktop-app.md) article.


[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you're using a custom policy, add the required input claim, as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Look for your Microsoft Authentication Library (MSAL) configuration object, and then add the `withLoginHint()` method with the login hint.

```csharp
authResult = await app.AcquireTokenInteractive(App.ApiScopes)
    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
    .WithLoginHint("bob@contoso.com")
    .ExecuteAsync();
```

[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Create or use an existing `Dictionary` object to store extra query parameters.
1. Add the `domain_hint` parameter with the corresponding domain name to the dictionary (for example, `facebook.com`).
1. Pass the extra query parameters object into the MSAL configuration object's `WithExtraQueryParameters` method.

```csharp
Dictionary<string, string> extraQueryParameters = new Dictionary<string, string>();
extraQueryParameters.Add("domain_hint", "facebook.com");

authResult = await app.AcquireTokenInteractive(App.ApiScopes)
    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
    .WithExtraQueryParameters(extraQueryParameters)
    .ExecuteAsync();
```

[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure language customization](language-customization.md).
1. Create or use an existing `Dictionary` object to store extra query parameters.
1. Add the `ui_locales` parameter with the corresponding language code to the dictionary (for example, `en-us`).
1. Pass the extra query parameters object into the MSAL configuration object's `WithExtraQueryParameters` method.

```csharp
Dictionary<string, string> extraQueryParameters = new Dictionary<string, string>();
extraQueryParameters.Add("ui_locales", "en-us");

authResult = await app.AcquireTokenInteractive(App.ApiScopes)
    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
    .WithExtraQueryParameters(extraQueryParameters)
    .ExecuteAsync();
```

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Create or use an existing `Dictionary` object to store extra query parameters.
1. Add the custom query string parameter, such as `campaignId`. Set the parameter value (for example, `germany-promotion`).
1. Pass the extra query parameters object into the MSAL configuration object's `WithExtraQueryParameters` method.

```csharp
Dictionary<string, string> extraQueryParameters = new Dictionary<string, string>();
extraQueryParameters.Add("campaignId", "germany-promotion");

authResult = await app.AcquireTokenInteractive(App.ApiScopes)
    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
    .WithExtraQueryParameters(extraQueryParameters)
    .ExecuteAsync();
```

[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. In your custom policy, define an [ID token hint technical profile](id-token-hint.md).
1. In your code, generate or acquire an ID token, and then set the token to a variable (for example, `idToken`). 
1. Create or use an existing `Dictionary` object to store extra query parameters.
1. Add the `id_token_hint` parameter with the corresponding variable that stores the ID token.
1. Pass the extra query parameters object into the MSAL configuration object's `extraQueryParameters` attribute.

```csharp
Dictionary<string, string> extraQueryParameters = new Dictionary<string, string>();
extraQueryParameters.Add("id_token_hint", idToken);

authResult = await app.AcquireTokenInteractive(App.ApiScopes)
    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
    .WithExtraQueryParameters(extraQueryParameters)
    .ExecuteAsync();
```


[!INCLUDE [active-directory-b2c-app-integration-logging](../../includes/active-directory-b2c-app-integration-logging.md)]


The following code snippet demonstrates how to configure MSAL logging:

```csharp
PublicClientApp = PublicClientApplicationBuilder.Create(ClientId)
    .WithB2CAuthority(AuthoritySignUpSignIn)
    .WithRedirectUri(RedirectUri)
    .WithLogging(Log, LogLevel.Info, false) // don't log P(ersonally) I(dentifiable) I(nformation) details on a regular basis
    .Build();
```

## Configure the redirect URI

During the [desktop app registration](configure-authentication-sample-wpf-desktop-app.md#step-23-register-the-desktop-app) process, when you're choosing a redirect URI, keep in mind the following important considerations:

* **Development**: For development use in desktop apps, you can set the redirect URI to `http://localhost`, and Azure AD B2C will respect any port in the request. If the registered URI contains a port, Azure AD B2C will use that port only. For example, if the registered redirect URI is `http://localhost`, the redirect URI in the request can be `http://localhost:<randomport>`. If the registered redirect URI is `http://localhost:8080`, the redirect URI in the request must be `http://localhost:8080`.
* **Unique**: The scheme of the redirect URI must be unique for every application. In the example `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`, `com.onmicrosoft.contosob2c.exampleapp` is the scheme. This pattern should be followed. If two applications share the same scheme, users are given a choice of applications. If users choose incorrectly, the sign-in fails.
* **Complete**: The redirect URI must have a both a scheme and a path. The path must contain at least one slash character after the domain. For example, `//oauth/` works, and `//oauth` fails. Don't include special characters in the URI. For example, the underscore character (_) isn't allowed.

## Next steps

- To learn more, see [MSAL for .NET, UWP, NetCore, and Xamarin configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki).
