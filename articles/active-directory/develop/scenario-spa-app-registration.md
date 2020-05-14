---
title: Register single-page applications (SPA) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a single-page application (app registration)
services: active-directory
author: hahamil
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/11/2020
ms.author: hahamil
ms.custom: aaddev
# Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform for developers.
---

# Single-page application: App registration

To register a single-page application (SPA) in the Microsoft identity platform, complete the following steps. The registration steps differ between MSAL.js 1.0, which supports the implicit grant flow, and MSAL.js 2.0, which supports the authorization code flow with PKCE.

## Create the app registration

For both MSAL.js 1.0- and 2.0-based applications, start by completing the following steps to create the initial app registration.

1. Sign in to the [Azure portal](https://portal.azure.com). If your account has access to multiple tenants, select the **Directory + Subscription** filter in the top menu, and then select the tenant to contain the app registration you're about to create.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**.
1. Select **New registration**, enter a **Name** for the application, and choose the **Supported account types** for the application. Do **NOT** enter a **Redirect URI**. For a description of the different account types, see the [Register a new application using the Azure portal](quickstart-register-app.md#register-a-new-application-using-the-azure-portal).
1. Select **Register** to create the app registration.
1. Under **Manage**, select **Authentication**, and then select **Add a platform**.
1. Under **Web applications**, select **Single-page application**.

Next, configure the app registration with a **Redirect URI** to specify where the Microsoft identity platform should redirect the client along with any security tokens. Use the steps appropriate for the version of MSAL.js you're using in your application:

- [MSAL.js 2.0 with auth code flow](#redirect-uri-msaljs-20-with-auth-code-flow) (recommended)
- [MSAL.js 1.0 with implicit flow](#redirect-uri-msaljs-10-with-implicit-flow)

## Redirect URI: MSAL.js 2.0 with auth code flow

Follow these steps to add a redirect URI for an app that uses MSAL.js 2.0 or later. MSAL.js versions 2.0 and later support the authorization code flow with PKCE and CORS in response to [browser third party cookie restrictions](reference-third-party-cookies-spas.md) (the implicit grant flow is not supported).

1. Under **Redirect URIs**, enter a [redirect URI](reply-url.md). Do **NOT** select either checkbox under **Implicit grant**.
1. Select **Configure** to finish adding the redirect URI.

You've now completed the registration of your single-page application (SPA) and a redirect URI to which the client will be redirected and any security tokens will be sent. By not selecting either of the settings under **Implicit grant**, your application registration is configured to support the authorization code flow with PKCE and CORS.

## Redirect URI: MSAL.js 1.0 with implicit flow

Follow these steps to add a redirect URI for a single-page app that uses MSAL.js 1.3 or earlier and the implicit grant flow. Applications that use MSAL.js 1.3 or earlier do not support the auth code flow.

1. Under **Redirect URIs**, enter a [redirect URI](reply-url.md).
1. Enable the **Implicit flow**:
    - If your application signs in users, select **ID tokens**.
    - If your application also needs to call a protected web API, select **Access tokens**. For more information about these token types, see [ID tokens](id-tokens.md) and [Access tokens](access-tokens.md).
1. Select **Configure** to finish adding the redirect URI.

You've now completed the registration of your single-page application (SPA) and a redirect URI to which the client will be redirected and any security tokens will be sent. By selecting one or both of **ID tokens** and **Access tokens**, you've enabled the implicit grant flow.

## Note about authorization flows

By default, a new app registration created by using single-page application platform setting enables the authorization code flow. To take advantage of this flow, your application must use MSAL.js 2.0 or later.

Single-page applications using MSAL.js 1.3 or earlier can use *only* the implicit flow. Current [OAuth 2.0 best practices](v2-oauth2-auth-code-flow.md) recommend using the authorization code flow rather than implicit flow for SPAs. Having limited-lifetime refresh tokens also helps your application adapt to [modern browser cookie privacy limitations](reference-third-party-cookies-spas.md), like Safari ITP.

When all of your production applications represented by an app registration are using MSAL.js 2.0 and the authorization code flow, uncheck the implicit settings in its **Authentication** pane in the Azure portal. Applications using MSAL.js 1.0 and the implicit flow can continue to function, however, if you leave the implicit flow enabled (checked).

## Next steps

Next, configure your app's code to use the app registration you created in the previous steps:.

> [!div class="nextstepaction"]
> [App's code configuration](scenario-spa-app-configuration.md)
