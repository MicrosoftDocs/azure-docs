---
title: Understanding the OAuth2 implicit grant flow in Azure AD
description: Learn more about Azure Active Directory's implementation of the OAuth2 implicit grant flow, and whether it's right for your application.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: azuread-dev
ms.topic: conceptual
ms.workload: identity
ms.date: 08/15/2019
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev
ROBOTS: NOINDEX
---

# Understanding the OAuth2 implicit grant flow in Azure Active Directory (AD)

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

The OAuth2 implicit grant is notorious for being the grant with the longest list of security concerns in the OAuth2 specification. And yet, that is the approach implemented by ADAL JS and the one we recommend when writing SPA applications. What gives? It's all a matter of tradeoffs: and as it turns out, the implicit grant is the best approach you can pursue for applications that consume a Web API via JavaScript from a browser.

## What is the OAuth2 implicit grant?

The quintessential [OAuth2 authorization code grant](https://tools.ietf.org/html/rfc6749#section-1.3.1) is the authorization grant that uses two separate endpoints. The authorization endpoint is used for the user interaction phase, which results in an authorization code. The token endpoint is then used by the client for exchanging the code for an access token, and often a refresh token as well. Web applications are required to present their own application credentials to the token endpoint, so that the authorization server can authenticate the client.

The [OAuth2 implicit grant](https://tools.ietf.org/html/rfc6749#section-1.3.2) is a variant of other authorization grants. It allows a client to obtain an access token (and id_token, when using [OpenId Connect](https://openid.net/specs/openid-connect-core-1_0.html)) directly from the authorization endpoint, without contacting the token endpoint nor authenticating the client. This variant was designed for JavaScript based applications running in a Web browser: in the original OAuth2 specification, tokens are returned in a URI fragment. That makes the token bits available to the JavaScript code in the client, but it guarantees they won't be included in redirects toward the server. In OAuth2 implicit grant, the authorization endpoint issues access tokens directly to the client using a redirect URI that was previously supplied. It also has the advantage of eliminating any requirements for cross origin calls, which are necessary if the JavaScript application is required to contact the token endpoint.

An important characteristic of the OAuth2 implicit grant is the fact that such flows never return refresh tokens to the client. The next section shows how this isn't necessary and would in fact be a security issue.

## Suitable scenarios for the OAuth2 implicit grant

The OAuth2 specification declares that the implicit grant has been devised to enable user-agent applications – that is to say, JavaScript applications executing within a browser. The defining characteristic of such applications is that JavaScript code is used for accessing server resources (typically a Web API) and for updating the application user experience accordingly. Think of applications like Gmail or Outlook Web Access: when you select a message from your inbox, only the message visualization panel changes to display the new selection, while the rest of the page remains unmodified. This characteristic is in contrast with traditional redirect-based Web apps, where every user interaction results in a full page postback and a full page rendering of the new server response.

Applications that take the JavaScript based approach to its extreme are called single-page applications, or SPAs. The idea is that these applications only serve an initial HTML page and associated JavaScript, with all subsequent interactions being driven by Web API calls performed via JavaScript. However, hybrid approaches, where the application is mostly postback-driven but performs occasional JS calls, are not uncommon – the discussion about implicit flow usage is relevant for those as well.

Redirect-based applications typically secure their requests via cookies, however, that approach does not work as well for JavaScript applications. Cookies only work against the domain they have been generated for, while JavaScript calls might be directed toward other domains. In fact, that will frequently be the case: think of applications invoking Microsoft Graph API, Office API, Azure API – all residing outside the domain from where the application is served. A growing trend for JavaScript applications is to have no backend at all, relying 100% on third party Web APIs to implement their business function.

Currently, the preferred method of protecting calls to a Web API is to use the OAuth2 bearer token approach, where every call is accompanied by an OAuth2 access token. The Web API examines the incoming access token and, if it finds in it the necessary scopes, it grants access to the requested operation. The implicit flow provides a convenient mechanism for JavaScript applications to obtain access tokens for a Web API, offering numerous advantages in respect to cookies:

* Tokens can be reliably obtained without any need for cross origin calls – mandatory registration of the redirect URI to which tokens are return guarantees that tokens are not displaced
* JavaScript applications can obtain as many access tokens as they need, for as many Web APIs they target – with no restriction on domains
* HTML5 features like session or local storage grant full control over token caching and lifetime management, whereas cookies management is opaque to the app
* Access tokens aren't susceptible to Cross-site request forgery (CSRF) attacks

The implicit grant flow does not issue refresh tokens, mostly for security reasons. A refresh token isn't as narrowly scoped as access tokens, granting far more power hence inflicting far more damage in case it is leaked out. In the implicit flow, tokens are delivered in the URL, hence the risk of interception is higher than in the authorization code grant.

However, a JavaScript application has another mechanism at its disposal for renewing access tokens without repeatedly prompting the user for credentials. The application can use a hidden iframe to perform new token requests against the authorization endpoint of Azure AD: as long as the browser still has an active session (read: has a session cookie) against the Azure AD domain, the authentication request can successfully occur without any need for user interaction.

This model grants the JavaScript application the ability to independently renew access tokens and even acquire new ones for a new API (provided that the user previously consented for them). This avoids the added burden of acquiring, maintaining, and protecting a high value artifact such as a refresh token. The artifact that makes the silent renewal possible, the Azure AD session cookie, is managed outside of the application. Another advantage of this approach is a user can sign out from Azure AD, using any of the applications signed into Azure AD, running in any of the browser tabs. This results in the deletion of the Azure AD session cookie, and the JavaScript application will automatically lose the ability to renew tokens for the signed out user.

## Is the implicit grant suitable for my app?

The implicit grant presents more risks than other grants, and the areas you need to pay attention to are well documented (for example, [Misuse of Access Token to Impersonate Resource Owner in Implicit Flow][OAuth2-Spec-Implicit-Misuse] and [OAuth 2.0 Threat Model and Security Considerations][OAuth2-Threat-Model-And-Security-Implications]). However, the higher risk profile is largely due to the fact that it is meant to enable applications that execute active code, served by a remote resource to a browser. If you are planning an SPA architecture, have no backend components or intend to invoke a Web API via JavaScript, use of the implicit flow for token acquisition is recommended.

If your application is a native client, the implicit flow isn't a great fit. The absence of the Azure AD session cookie in the context of a native client deprives your application from the means of maintaining a long lived session. Which means your application will repeatedly prompt the user when obtaining access tokens for new resources.

If you are developing a Web application that includes a backend, and consuming an API from its backend code, the implicit flow is also not a good fit. Other grants give you far more power. For example, the OAuth2 client credentials grant provides the ability to obtain tokens that reflect the permissions assigned to the application itself, as opposed to user delegations. This means the client has the ability to maintain programmatic access to resources even when a user is not actively engaged in a session, and so on. Not only that, but such grants give higher security guarantees. For instance, access tokens never transit through the user browser, they don't risk being saved in the browser history, and so on. The client application can also perform strong authentication when requesting a token.

## Next steps

* See [How to integrate an application with Azure AD][ACOM-How-To-Integrate] for additional depth on the application integration process.

<!--Image references-->

<!--Reference style links in use-->
[ACOM-How-To-Integrate]: ../develop/how-to-integrate.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json
[OAuth2-Spec-Implicit-Misuse]: https://tools.ietf.org/html/rfc6749#section-10.16
[OAuth2-Threat-Model-And-Security-Implications]: https://tools.ietf.org/html/rfc6819
