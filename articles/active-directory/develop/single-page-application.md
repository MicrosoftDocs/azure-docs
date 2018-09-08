---
title: Application types in Azure Active Directory | Microsoft Docs
description: Describes the types of apps and scenarios supported by the Azure Active Directory v2.0 endpoint.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: saeeda, jmprieur, andret
ms.custom: aaddev
---

# Single-page applications

Single-page applications (SPAs) are typically structured as a JavaScript presentation layer (front end) that runs in the browser, and a web API back end that runs on a server and implements the application’s business logic.

Many modern apps have a single-page app front end that is primarily written in JavaScript. Often, it's written by using a framework like AngularJS, Ember.js, or Durandal.js. The Azure AD v2.0 endpoint supports these apps by using the [OAuth 2.0 implicit flow](v2-oauth2-implicit-grant-flow.md).

In the OAuth 2.0 implicit flow, the app receives tokens directly from the v2.0 authorize endpoint, without any server-to-server exchanges. All authentication logic and session handling takes place entirely in the JavaScript client, without extra page redirects.

![Implicit authentication flow](./media/v2-app-types/convergence_scenarios_implicit.png)

In this scenario, when the user signs in, the JavaScript front end uses [Microsoft Authentication Library for JavaScript (MSAL.JS)](https://github.com/AzureAD/microsoft-authentication-library-for-js) and the implicit authorization grant to obtain an ID token (id_token) from Azure AD. The token is cached and the client attaches it to the request as the bearer token when making calls to its Web API back end, which is secured using the OWIN middleware.

## Diagram

![Single Page Application diagram](./media/authentication-scenarios/single_page_app.png)

## Protocol flow

1. The user navigates to the web application.
1. The application returns the JavaScript front end (presentation layer) to the browser.
1. The user initiates sign in, for example by clicking a sign-in link. The browser sends a GET to the Azure AD authorization endpoint to request an ID token. This request includes the application ID and reply URL in the query parameters.
1. Azure AD validates the Reply URL against the registered Reply URL that was configured in the Azure portal.
1. The user signs in on the sign-in page.
1. If authentication is successful, Azure AD creates an ID token and returns it as a URL fragment (#) to the application’s Reply URL. For a production application, this Reply URL should be HTTPS. The returned token includes claims about the user and Azure AD that are required by the application to validate the token.
1. The JavaScript client code running in the browser extracts the token from the response to use in securing calls to the application’s web API back end.
1. The browser calls the application’s web API back end with the ID token in the authorization header. The Azure AD authentication service issues an ID token that can be used as a bearer token if the resource is the same as the client ID (in this case, this is true as the web API is the app's own backend).

## Code samples

See the [code samples for single-page application scenarios](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Samples). Be sure to check back frequently as new samples are added frequently.

## Registering

To register a single-page app, see [Register an app with the Azure AD v2.0 endpoint](quickstart-v2-register-an-app.md).

* Single tenant - If you are building an application just for your organization, it must be registered in your company’s directory by using the Azure portal.
* Multi-tenant - If you are building an application that can be used by users outside your organization, it must be registered in your company’s directory, but also must be registered in each organization’s directory that will be using the application. To make your application available in their directory, you can include a sign-up process for your customers that enables them to consent to your application. When they sign up for your application, they will be presented with a dialog that shows the permissions the application requires, and then the option to consent. Depending on the required permissions, an administrator in the other organization may be required to give consent. When the user or administrator consents, the application is registered in their directory.

After registering the application, it must be configured to use OAuth 2.0 implicit grant protocol. By default, this protocol is disabled for applications. To enable the OAuth2 implicit grant protocol for your application, edit its application manifest from the Azure portal and set the “oauth2AllowImplicitFlow” value to true. For more info, see [Application manifest](reference-app-manifest.md).

## Token expiration

Using MSAL.js helps with:

* refreshing an expired token
* requesting an access token to call a web API resource

After a successful authentication, Azure AD writes a cookie in the user's browser to establish a session. Note the session exists between the user and Azure AD (not between the user and the web application). When a token expires, MSAL.js uses this session to silently obtain another token. MSAL.js uses a hidden iFrame to send and receive the request using the OAuth implicit grant protocol. MSAL.js can also use this same mechanism to silently obtain access tokens for other web API resources the application calls as long as these resources support cross-origin resource sharing (CORS), are registered in the user’s directory, and any required consent was given by the user during sign-in.





## Web apps

For web apps (.NET, PHP, Java, Ruby, Python, Node) that the user accesses through a browser, you can use [OpenID Connect](active-directory-v2-protocols.md) for user sign-in. In OpenID Connect, the web app receives an ID token. An ID token is a security token that verifies the user's identity and provides information about the user in the form of claims:

```
// Partial raw ID token
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtyaU1QZG1Cd...

// Partial content of a decoded ID token
{
    "name": "John Smith",
    "email": "john.smith@gmail.com",
    "oid": "d9674823-dffc-4e3f-a6eb-62fe4bd48a58"
    ...
}
```

You can learn about all the types of tokens and claims that are available to an app in the [v2.0 tokens reference](v2-id-and-access-tokens.md).

In web server apps, the sign-in authentication flow takes these high-level steps:

![Web app authentication flow](./media/v2-app-types/convergence_scenarios_webapp.png)

You can ensure the user's identity by validating the ID token with a public signing key that is received from the v2.0 endpoint. A session cookie is set, which can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web app sign-in code samples in our v2.0 [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might need to access another web service, such as a REST API. In this case, the web server app engages in a combined OpenID Connect and OAuth 2.0 flow, by using the [OAuth 2.0 authorization code flow](active-directory-v2-protocols.md). For more information about this scenario, read about [getting started with web apps and Web APIs](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md).

## Web APIs
You can use the v2.0 endpoint to secure web services, such as your app's RESTful Web API. Instead of ID tokens and session cookies, a Web API uses an OAuth 2.0 access token to secure its data and to authenticate incoming requests. The caller of a Web API appends an access token in the authorization header of an HTTP request, like this:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API uses the access token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the access token. To learn about all the types of tokens and claims that are available to an app, see the [v2.0 tokens reference](v2-id-and-access-tokens.md).

A Web API can give users the power to opt in or opt out of specific functionality or data by exposing permissions, also known as [scopes](v2-permissions-and-consent.md). For a calling app to acquire permission to a scope, the user must consent to the scope during a flow. The v2.0 endpoint asks the user for permission, and then records permissions in all access tokens that the Web API receives. The Web API validates the access tokens it receives on each call and performs authorization checks.

A Web API can receive access tokens from all types of apps, including web server apps, desktop and mobile apps, single-page apps, server-side daemons, and even other Web APIs. The high-level flow for a Web API looks like this:

![Web API authentication flow](./media/v2-app-types/convergence_scenarios_webapi.png)

To learn how to secure a Web API by using OAuth2 access tokens, check out the Web API code samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In many cases, web APIs also need to make outbound requests to other downstream web APIs secured by Azure Active Directory. To do so, web APIs can take advantage of Azure AD's **On Behalf Of** flow, which allows the web API to exchange an incoming access token for another access token to be used in outbound requests. The v2.0 endpoint's On Behalf Of flow is described in [detail here](v2-oauth2-on-behalf-of-flow.md).

## Mobile and native apps

Device-installed apps, such as mobile and desktop apps, often need to access back-end services or Web APIs that store data and perform functions on behalf of a user. These apps can add sign-in and authorization to back-end services by using the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

In this flow, the app receives an authorization code from the v2.0 endpoint when the user signs in. The authorization code represents the app's permission to call back-end services on behalf of the user who is signed in. The app can exchange the authorization code in the background for an OAuth 2.0 access token and a refresh token. The app can use the access token to authenticate to Web APIs in HTTP requests, and use the refresh token to get new access tokens when older access tokens expire.

![Native app authentication flow](./media/v2-app-types/convergence_scenarios_native.png)

## Daemons and server-side apps

Apps that have long-running processes or that operate without interaction with a user also need a way to access secured resources, such as Web APIs. These apps can authenticate and get tokens by using the app's identity, rather than a user's delegated identity, with the OAuth 2.0 client credentials flow.

In this flow, the app interacts directly with the `/token` endpoint to obtain endpoints:

![Daemon app authentication flow](./media/v2-app-types/convergence_scenarios_daemon.png)

To build a daemon app, see the [client credentials documentation](v2-oauth2-client-creds-grant-flow.md), or try a [.NET sample app](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).
