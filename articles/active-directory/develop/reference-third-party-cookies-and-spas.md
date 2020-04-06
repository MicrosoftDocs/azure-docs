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

In order to continue authenticating users in SPAs, we must switch to the [authorization code flow](v2-oauth2-auth-code-flow.md), which issues a code to the SPA. The SPA is able to redeem this code using XHR for an access token and a refresh token.  When the app requires additional tokens, it can use the refresh token to get new tokens for the user, without requiring the use of third-party cookies.  

For Azure AD, native clients and SPAs follow the same protocol guidance:

* Use of a PKCE code challenge
* No use of a client secret

![Code flow for SPA apps](media/v2-oauth-auth-code-spa/active-directory-oauth-code-spa.png)

## Performance and UX implications

Some applications may attempt to get truly silent sign-in as a SPA by immediately opening a login iframe using `prompt=none` when the page is loaded. In most browsers, this request will hand your app tokens for the currently signed in user assuming consent has already been granted. This pattern meant your app did not need to do a full page redirect to sign the user in, improving performance and user experience. `prompt=none` and iframes are no longer an option when third-party cookies are blocked, so you must find a way of visiting the login page directly to have a code issued to your app.  There are two ways of accomplishing sign-in:

1. Full page redirects
    1. On the first load of your SPA, redirect the user to the sign-in page if you don't have a session already (or if the session is expired).  Their browser will visit the login page, present the cookies containing the user session, and then immediately redirect back to your application with the code and tokens in a fragment.
    1. The redirect does result in your SPA being loaded twice.  Ensure you are following best practices for caching of SPAs so that app is not downloaded in full twice.
    1. Consider having a pre-load sequence in your app that checks for a login session and redirects to the login page before your app fully unpacks and executes the JavaScript payload.
1. Popups
    1. If the UX of a full page redirect does not work for your application, you can also consider using a popup to handle authentication.  
    1. When the popup finishes redirecting to your domain after authentication, it will store code and tokens in local storage for your application to use. MSAL.JS supports popups for authentication, as do most libraries.
    1. Browsers are decreasing support for popups, so they may not be the most reliable option.  You should require user interaction with your SPA before creating the popup to satisfy browser requirements.

### A note on iframed applications

A common pattern in web apps is to use an iframe to embed one app inside another.  The top-level frame handles authenticating the user, and the iframed application can trust that the user is signed in, fetching tokens silently using the implicit flow. Silent token acquisition no longer works when third-party cookies are blocked - the iframed application must switch to using popups to access the user's session, as it cannot navigate to the login page.  Because popups are often not a desirable or reliable scenario, Microsoft Identity platform is working on a trust model to handle passing tokens between the top-level frame and the iframed application.

## Security implication of refresh tokens in the browser

The [OAuth security best current practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-14) recommend against using the implicit flow due to some security considerations inherent in passing the access token through the browser URI.  The working group instead recommends use of the authorization code flow, as we have outlined above. However, when third-party cookies are blocked the authorization code flow becomes onerous when new or different tokens are required - a full page redirect or popup for every single token, every time a token expires (every hour usually, for Microsoft identity platform tokens). To provide a better experience, we have provided time-limited refresh tokens for SPAs using the authorization code flow.  These tokens expire after 24 hours - unlike normal refresh tokens, they have no sliding window of expiration.  24 hours was selected as a balance between limiting the damage that can be done with stolen tokens and ensuring that users can work for a full day without being redirected through the login page mid-task.
