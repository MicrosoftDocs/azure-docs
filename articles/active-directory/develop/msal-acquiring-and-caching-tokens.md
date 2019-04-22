---
title: Managing tokens (MSAL) | Azure
description: Learn about acquiring and caching tokens using the Microsoft Authentication Library (MSAL).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
---

# Acquiring and caching tokens using MSAL
There are many ways to acquiring a token using Microsoft Authentication Library (MSAL). Some ways require user interactions through a web browser. Some don't require any user interactions. In general, the way to acquire a token depends on if the application is a public client application (desktop or mobile app) or a confidential client application (Web App, Web API, or daemon application like a Windows service).

## Acquiring tokens from the cache
MSAL maintains a token cache (or two caches in the case of confidential client applications).  MSAL caches a token after it has been acquired.  Application code should try to get a token silently (from the cache), first, before acquiring a token by other means. 

In many cases, attempting to silently get a token will acquire another token with more scopes based on a token in the cache. It's also capable of refreshing a token when it's getting close to expiration (as the token cache also contains a refresh token)

Clearing the cache is achieved by removing the accounts from the cache. This does not remove the session cookie which is in the browser, though.

## Acquiring tokens

### Public client applications

- will often [acquire token interactively](Acquiring-tokens-interactively), having the user sign in.
- But it's also possible for a desktop application running on a Windows machine which is joined to a domain or to Azure AD, to [get a token silently for the user signed-in on the machine](https://aka.ms/msal-net-iwa), leveraging Integrated Windows Authentication (IWA/Kerberos). 
- On .NET framework desktop client applications , it's also possible (but not recommended) to [get a token with a username and password](https://aka.ms/msal-net-up) (U/P). Note that you should not use username/password in confidential client applications.
- Finally, for applications running on devices which don't have a Web browser, it's possible to acquire a token through the [device code flow](https://aka.ms/msal-net-device-code-flow) mechanism, which provides the user with a URL and a code. The user goes to a web browser on another device, enters the code and signs-in, which has Azure AD get them a token back on the browser-less device.

### Confidential client applications 

- Acquire token **for the application itself**, not for a user, using [client credentials](Client-credential-flows). This can be used for syncing tools, or tools which process users in general, not a particular user. 
- In the case of Web APIs calling and API on behalf of the user, using the [On Behalf Of flow](on-behalf-of) and still identifying the application itself with client credentials to acquire a token based on some User assertion (SAML for instance, or a JWT token). This can be used for applications which need to access resources of a particular user in service to service calls.
- **For Web apps**, acquire tokens [by authorization code](Acquiring-tokens-with-authorization-codes-on-web-apps) after letting the user sign-in through the authorization request URL. This is typically the mechanism used by an open id connect application, which lets the user sign-in using Open ID connect, but then wants to access Web APIs on behalf of this particular user.


## Authentication results 
Token acquisition methods return an authentication result, which exposes:

- AccessToken for the Web API to access resources. This is a string, usually a base64 encoded JWT but the client should never look inside the access token. The format isn't guaranteed to remain stable and it can be encrypted for the resource. People writing code depending on access token content on the client is one of the biggest sources of errors and client logic breaks
- IdToken for the user (this is a JWT)
- ExpiresOn tells the date/time when the token expires
- TenantId contains the tenant in which the user was found. Note that in the case of guest users (Azure AD B2B scenarios), the TenantId is the guest tenant, not the unique tenant. When the token is delivered in the name of a user, AuthenticationResult also contains information about this user. For confidential client flows where tokens are requested with no user (for the application), this User information is null.
- The Scopes for which the token was issued (See Scopes not resources)
- The unique Id for the user.
