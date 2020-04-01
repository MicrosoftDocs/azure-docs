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
ms.author: hpsin
ms.reviewer: kkrishna
ms.custom: aaddev
---
# Handle ITP in Safari, and other browsers where 3rd party cookies are blocked

## What is ITP (Intelligent Tracking Protection)

Apple Safari has an on-by-default privacy protection feature called [ITP or Intelligent Tracking Protection](https://webkit.org/tracking-prevention-policy/).  It blocks "3rd party cookies", cookies on requests that cross domains. A common form of user tracking is loading an iframe in the background and making a silent request to a 3rd party site, using cookies on that  3rd party site to correlate the user across the Internet.  Unfortunately, this is also the standard way of implementing the [implicit flow](v2-oauth2-implicit-grant-flow) for single page apps (SPAs), which means that SPAs are usually broken in Safari today.

Safari is not alone in blocking 3rd party cookies to enhance user privacy - Brave has blocked 3rd party cookies by default for a while, and Chromium (the platform behind Google Chrome and Microsoft Edge) has announced that they will stop supporting 3rd party cookies as well in the future.  The solution outlined in this document works in all of these browsers, or anywhere else 3rd party cookies are blocked.  

## Overview of the solution

In order to continue authenticating users in SPAs, we must switch to the [authorization code flow](v2-oauth2-auth-code-flow), which issues a code to the SPA. The SPA is able to redeem this code using XHR for an access token and a refresh token.  When the app requires additional tokens, it can use the refresh token to get new tokens for the user, without requiring the user of 3rd party cookies.  

For Azure AD, native clients and SPAs follow the same protocol guidance: 

* Use of a PKCE code challenge
* No use of a client secret


## Performance and UX implications 

Some applications may attempt to get truly silent sign-in as a SPA by immediately opening a login iframe using `prompt=none` when the page is loaded. In most browsers, this will hand your app tokens for the currently signed in user assuming consent has already been granted.  This pattern means your app does not need to do a full page redirect to sign the user in, improving performance and user experience.  This is no longer an option when 3rd party cookies are blocked, so you must find a way of showing the login page to the user so that their session can be detected and a code issued to your app.  There are two ways of accomplishing this:

1. Full page redirects
    1. On the first load of your SPA, redirect the user to the sign in page if you don't have a session already (or if the session is expired).  Their browser will visit the login page, present the cookies needed to see that a user is in session, and immediately redirect back to your application with the code and tokens in a fragment.
    1. This does result in your SPA being loaded twice.  Ensure you are following best practices for caching of SPAs so that this does not result in your app being downloaded in full twice. 
    1. Consider having a pre-load sequence in your app that checks for a login session and redirects to the login page before your app fully unpacks and executes the JavaScript payload.
1. Popups
    1. If the UX of a full page redirect does not work for your application, 


### A note on iframed applications

A common pattern in web apps is to embed 

## Security implication of refresh tokens in the browsers


