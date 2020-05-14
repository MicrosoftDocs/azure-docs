---
title: Register single-page apps | Azure
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
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform for developers.
---

# Single-page application: App registration

This article explains the app registration specifics for a single-page application (SPA).

## Getting started

Follow the steps to [register a new application with the Microsoft identity platform](quickstart-register-app.md), and select the supported accounts for your application. The SPA scenario can support authentication with accounts in your organization or any organization and personal Microsoft accounts.

The following sections describe the aspects of application registration specific to single-page applications. Aspects of app registration differ slightly between MSAL.js 1.0 and MSAL.js 2.0.

## MSAL.js 2.0 with auth code flow

Register a redirect URI where your application can receive tokens. Ensure that the redirect URI exactly matches the URI for your application.

The following steps apply to redirect URIs for apps using MSAL.js 2.0. The latest version on MSAL supports the Authorization Code Flow with PKCE and CORS support in response to [browser third party cookie restrictions](reference-third-party-cookies-spa.md).

1. Select your app registration in the Azure portal, and then select the **Authentication** menu item.
1. Select **Add a platform**.
1. Under **Web applications**, select **Single-page application**.
1. Under **Redirect URIs**, enter your [redirect URI](reply-url.md).
1. Select **Configure** to finish adding the redirect URI.

You've now registered your SPA redirect URI and enabled the authorization code flow.

## MSAL.js 1.0 with implicit flow

Register a redirect URI where your application can receive tokens. Ensure that the redirect URI exactly matches the URI for your application.

1. Select your app registration in the Azure portal, and then select the **Authentication** menu item.
1. Select **Add a platform**.
1. Select **Single-page application** platform tile.
1. Under **Redirect URIs**, enter your [redirect URI](reply-url.md).
1. Enable the **Implicit flow**.
    - If your application signs in users, select **ID tokens**.
    - If your application also needs to call a protected web API, select **Access tokens**. For more information about these token types, see [ID tokens](id-tokens.md) and [Access tokens](access-tokens.md).
1. Select **Configure** to finish adding the redirect URI.

You've now registered your SPA redirect URI and enabled the implicit flow.

### Note about authorization flows

By default, new applications created in the SPA platform are enabled for the authorization code flow. To take advantage of this flow, your applications must use MSAL.js 2.0.

Applications using MSAL.js 1.0 can use only the implicit flow. Current [OAuth 2.0 best practices](v2-oauth2-auth-code-flow.md) recommend the authorization code flow rather than implicit flow for SPAs. Having limited lifetime refresh tokens also helps your application adapt to [modern browser cookie privacy limitations](msal-js-known-issues-safari-browser.md) like Safari ITP.

When all of your production applications represented by an app registration are using MSAL.js 2.0 and the authorization code flow, uncheck the implicit settings in its **Authentication** pane in the Azure portal. Applications using MSAL.js 1.0 and the implicit flow can continue to function, however, if you leave the implicit flow enabled (checked).

## API permissions

Single-page applications can call APIs on behalf of the signed-in user. They need to request delegated permissions. For details, see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-spa-app-configuration.md)
