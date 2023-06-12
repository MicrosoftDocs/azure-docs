---
title: How to handle Intelligent Tracking Protection (ITP) in Safari
description: Single-page app (SPA) authentication when third-party cookies are no longer allowed.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/14/2022
ms.author: owenrichards
ms.reviewer: ludwignick
ms.custom: aaddev
---

# Handle ITP in Safari and other browsers where third-party cookies are blocked

Many browsers block _third-party cookies_, cookies on requests to domains other than the domain shown in the browser's address bar. This block breaks the implicit flow and requires new authentication patterns to successfully sign in users. In the Microsoft identity platform, we use the authorization flow with Proof Key for Code Exchange (PKCE) and refresh tokens to keep users signed in when third-party cookies are blocked.

## What is Intelligent Tracking Protection (ITP)?

Apple Safari has an on-by-default privacy protection feature called [Intelligent Tracking Protection](https://webkit.org/tracking-prevention-policy/), or _ITP_. ITP blocks "third-party" cookies, cookies on requests that cross domains.

A common form of user tracking is done by loading an iframe to third-party site in the background and using cookies to correlate the user across the Internet. Unfortunately, this pattern is also the standard way of implementing the [implicit flow](v2-oauth2-implicit-grant-flow.md) in single-page apps (SPAs). When a browser blocks third-party cookies to prevent user tracking, SPAs are also broken.

Safari isn't alone in blocking third-party cookies to enhance user privacy. Brave blocks third-party cookies by default, and Chromium (the platform behind Google Chrome and Microsoft Edge) has announced that they as well will stop supporting third-party cookies in the future.

The solution outlined in this article works in all of these browsers, or anywhere third-party cookies are blocked.

## Overview of the solution

To continue authenticating users in SPAs, app developers must use the [authorization code flow](v2-oauth2-auth-code-flow.md). In the auth code flow, the identity provider issues a code, and the SPA redeems the code for an access token and a refresh token. When the app requires new tokens, it can use the [refresh token flow](v2-oauth2-auth-code-flow.md#refresh-the-access-token) to get new tokens. Microsoft Authentication Library (MSAL) for JavaScript v2.0, implements the authorization code flow for SPAs and, with minor updates, is a drop-in replacement for MSAL.js 1.x.

For the Microsoft identity platform, SPAs and native clients follow similar protocol guidance:

- Use of a [PKCE code challenge](https://tools.ietf.org/html/rfc7636)
  - PKCE is _required_ for SPAs on the Microsoft identity platform. PKCE is _recommended_ for native and confidential clients.
- No use of a client secret

SPAs have two more restrictions:

- [The redirect URI must be marked as type `spa`](v2-oauth2-auth-code-flow.md#redirect-uris-for-single-page-apps-spas) to enable CORS on login endpoints.
- Refresh tokens issued through the authorization code flow to `spa` redirect URIs have a 24-hour lifetime rather than a 90-day lifetime.

:::image type="content" source="media/v2-oauth-auth-code-spa/oauth-code-spa.svg" alt-text="Diagram showing the OAuth 2 authorization code flow between a single-page app and the security token service endpoint." border="false":::

## Performance and UX implications

Some applications using the implicit flow attempt sign-in without redirecting by opening a login iframe using `prompt=none`. In most browsers, this request will respond with tokens for the currently signed-in user (assuming consent has already been granted). This pattern meant applications didn't need a full page redirect to sign the user in, improving performance and user experience - the user visits the web page and is signed in already. Because `prompt=none` in an iframe is no longer an option when third-party cookies are blocked, applications must visit the login page in a top-level frame to have an authorization code issued.

There are two ways of accomplishing sign-in:

- **Full page redirects**
  - On the first load of the SPA, redirect the user to the sign-in page if no session already exists (or if the session is expired). The user's browser will visit the login page, present the cookies containing the user session, and then redirect back to the application with the code and tokens in a fragment.
  - The redirect does result in the SPA being loaded twice. Follow best practices for caching of SPAs so that the app isn't downloaded in-full twice.
  - Consider having a pre-load sequence in the app that checks for a login session and redirects to the login page before the app fully unpacks and executes the JavaScript payload.
- **Popups**
  - If the user experience (UX) of a full page redirect doesn't work for the application, consider using a popup to handle authentication.
  - When the popup finishes redirecting to the application after authentication, code in the redirect handler will store the code, and tokens in local storage for the application to use. MSAL.js supports popups for authentication, as do most libraries.
  - Browsers are decreasing support for popups, so they may not be the most reliable option. User interaction with the SPA before creating the popup may be needed to satisfy browser requirements.

     Apple [describes a popup method](https://webkit.org/blog/8311/intelligent-tracking-prevention-2-0/) as a temporary compatibility fix to give the original window access to third-party cookies. While Apple may remove this transferal of permissions in the future, it will not impact the guidance here.
     
     Here, the popup is being used as a first party navigation to the login page so that a session is found and an auth code can be provided. This should continue working into the future.

### Using iframes

A common pattern in web apps is to use an iframe to embed one app inside another: the top-level frame handles authenticating the user and the application hosted in the iframe can trust that the user is signed in, fetching tokens silently using the implicit flow. However, there are a couple of caveats to this assumption irrespective of whether third-party cookies are enabled or blocked in the browser.

Silent token acquisition no longer works when third-party cookies are blocked - the application embedded in the iframe must switch to using popups to access the user's session as it can't navigate to the login page.

You can achieve single sign-on between iframed and parent apps with same-origin _and_ cross-origin JavaScript script API access by passing a user (account) hint from the parent app to the iframed app. For more information, see [Using MSAL.js in iframed apps](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/iframe-usage.md) in the MSAL.js repository on GitHub.

## Security implications of refresh tokens in the browser

Issuing refresh tokens to the browser is considered a security issue. Cross-site scripting (XSS) attacks or compromised JS packages can steal the refresh token and use it remotely until it expires or is revoked. In order to minimize the risk of stolen refresh tokens, SPAs will be issued tokens valid for only 24 hours. After 24 hours, the app must acquire a new authorization code via a top-level frame visit to the login page.

This limited-lifetime refresh token pattern was chosen as a balance between security and degraded UX. Without refresh tokens or third-party cookies, the authorization code flow (as recommended by the [OAuth security best current practices draft](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-14)) becomes onerous when new or additional tokens are required. A full page redirect or popup is needed for every single token, every time a token expires (every hour usually, for the Microsoft identity platform tokens).

## Next steps

For more information about authorization code flow and MSAL.js, see:

- [Authorization code flow](v2-oauth2-auth-code-flow.md).
- [MSAL.js 2.0 quickstart](quickstart-v2-javascript-auth-code.md).
