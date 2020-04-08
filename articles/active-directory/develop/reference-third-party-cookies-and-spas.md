---
title: How to handle the ITP feature in Safari | Azure
titleSuffix: Microsoft identity platform
description: SPA authentication when third-party cookies are no longer allowed.
services: active-directory
documentationcenter: ''
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/31/2020
ms.author: hirsin
ms.reviewer: kkrishna
ms.custom: aaddev
---
# Handle ITP in Safari, and other browsers where third-party cookies are blocked

## What is ITP (Intelligent Tracking Protection)

Apple Safari has an on-by-default privacy protection feature called [Intelligent Tracking Protection (ITP)](https://webkit.org/tracking-prevention-policy/).  It blocks "third-party cookies", cookies on requests that cross domains. A common form of user tracking is loading an iframe in the background to a third-party site, using cookies to correlate the user across the Internet.  Unfortunately, this pattern is also the standard way of implementing the [implicit flow](v2-oauth2-implicit-grant-flow.md) for single page apps (SPAs).  When a browser blocks 3rd party cookies to prevent user tracking, SPAs are also broken.

Safari is not alone in blocking third-party cookies to enhance user privacy - Brave has blocked third-party cookies by default, and Chromium (the platform behind Google Chrome and Microsoft Edge) has announced that they will stop supporting third-party cookies as well in the future.  The solution outlined in this document works in all of these browsers, or anywhere else third-party cookies are blocked.  

## Overview of the solution

In order to continue authenticating users in SPAs, app developers must use the [authorization code flow](v2-oauth2-auth-code-flow.md), which issues a code to the SPA. The SPA  redeems this code for an access token and a refresh token.  When the app requires additional tokens, it can use the refresh token to get new tokens for the user, without requiring the user of third-party cookies.  MSAL.js 2.0, the Microsoft identity platform library for SPAs, implements the authorization code flow for SPAs and is a drop-in replacement for MSAL.js 1.x with minor updates.

For Azure AD, native clients and SPAs follow the same protocol guidance:

* Use of a [PKCE code challenge](https://tools.ietf.org/html/rfc7636)
    * While this is only *recommended* for native and confidential clients, Microsoft identity platform *requires* PKCE for SPAs. 
* No use of a client secret

And have two additional restrictions: 

* [The redirect URI must be marked as type `spa`](v2-oauth2-auth-code-flow.md#setup-required-for-single-page-apps) to enable CORS on login endpoints.  
* Refreshtokens issued through the authorization code flow to `spa` redirect URIs have a 24-hour lifetime rather then a 90-day lifetime.

![Code flow for SPA apps](media/v2-oauth-auth-code-spa/active-directory-oauth-code-spa.png)

## Performance and UX implications

Some applications may attempt sign-in without redirecting away by opening a login iframe using `prompt=none`. In most browsers, this request will respond with tokens for the currently signed in user assuming consent has already been granted.  This pattern meant applications did not need a full page redirect to sign the user in, improving performance and user experience.  `prompt=none` and iframes are no longer an option when third-party cookies are blocked, so applications must visit the login page in a top-level frame to have an authorization code issued.  There are two ways of accomplishing sign-in:

1. Full page redirects
    1. On the first load of the SPA, redirect the user to the sign-in page if no session exists already (or if the session is expired).  The user's browser will visit the login page, present the cookies containing the user session, and then redirect back to the application with the code and tokens in a fragment.
    1. The redirect does result in the SPA being loaded twice.  Follow best practices for caching of SPAs so that the app is not downloaded in full twice.
    1. Consider having a pre-load sequence in the app that checks for a login session and redirects to the login page before the app fully unpacks and executes the JavaScript payload.
1. Popups
    1. If the UX of a full page redirect does not work for the application, consider using a popup to handle authentication.  
    1. When the popup finished redirecting to the application after authentication, code in the redirect handler will store the code and tokens in local storage for the application to use. MSAL.JS supports popups for authentication, as do most libraries.
    1. Browsers are decreasing support for popups, so they may not be the most reliable option.  User interaction with the SPA before creating the popup may be needed to satisfy browser requirements.

>[NOTE]
> Apple [has indicated](https://webkit.org/blog/8311/intelligent-tracking-prevention-2-0/) that the popup method is only a temporary compatibility fix to give the original window access to third-party cookies. While Apple may remove this transferral of permissions in the future, using the popup to acquire the initial code from the Microsoft identity platform will not be impacted.

### A note on iframed applications

A common pattern in web apps is to use an iframe to embed one app inside another.  The top-level frame handles authenticating the user, and the iframed application can trust that the user is signed in, fetching tokens silently using the implicit flow. Silent token acquisition no longer works when third-party cookies are blocked - the iframed application must switch to using popups to access the user's session, as it cannot navigate to the login page. 

## Security implication of refresh tokens in the browser

The [OAuth security best current practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-14) recommend against using the implicit flow due to some security considerations inherent in passing the access token through the browser URI.  The working group instead recommends use of the authorization code flow, as we have outlined above. However, when third-party cookies are blocked the authorization code flow becomes onerous when new or different tokens are required - a full page redirect or popup for every single token, every time a token expires (every hour usually, for Microsoft identity platform tokens). To provide a better experience, we have provided time-limited refresh tokens for SPAs using the authorization code flow.  These tokens expire after 24 hours - unlike normal refresh tokens, they have no sliding window of expiration.  24 hours was selected as a balance between limiting the damage that can be done with stolen tokens and ensuring that users can work for a full day without being redirected through the login page mid-task.