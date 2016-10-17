<properties
	pageTitle="Apps you can use with the Azure AD v2.0 endpoint | Microsoft Azure"
	description="Learn the types of apps and scenarios that you can use with the Azure Active Directory v2.0 endpoint."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/30/2016"
	ms.author="dastrock"/>

# Apps you can use with the Azure AD v2.0 endpoint
The Azure Active Directory (AD) v2.0 endpoint supports authentication for a variety of modern app architectures, all of them based on industry-standard protocols [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) or [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow). This article briefly describes the types of apps that you can build by using Azure AD v2.0, regardless of your preferred language or platform. The information in this article can help you understand high-level scenarios before you [jump right into the code](active-directory-appmodel-v2-overview.md#getting-started).

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios and features are supported by the v2.0 endpoint. To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## The basics
You must register every app that uses the v2.0 endpoint at [apps.dev.microsoft.com](https://apps.dev.microsoft.com). The app registration process collects and assigns a few values to your app:

- **Application Id**: uniquely identifies your app
- **Redirect URI**: use to direct responses back to your app
- A few other scenario-specific values

For more details, learn how to [register an app](active-directory-v2-app-registration.md).

After the app is registered, it communicates with Azure AD by sending requests to the Azure Active Directory v2.0 endpoint. We provide open source frameworks and libraries that handle the details of these requests. Or, you can implement the authentication logic yourself by creating requests to these endpoints:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```
<!-- TODO: Need a page for libraries to link to -->

## Web apps
For web apps (.NET, PHP, Java, Ruby, Python, Node) that the user accesses through a browser, you can use [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow) for user sign-in. In OpenID Connect, the web app receives an `id_token`, a security token that verifies the user's identity and provides information about the user in the form of claims:

```
// Partial raw id_token
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtyaU1QZG1Cd...

// Partial content of a decoded id_token
{
	"name": "John Smith",
	"email": "john.smith@gmail.com",
	"oid": "d9674823-dffc-4e3f-a6eb-62fe4bd48a58"
	...
}
```

You can learn about all the types of tokens and claims available to an app in the [v2.0 token reference](active-directory-v2-tokens.md).

In web server apps, the sign-in authentication flow takes these high-level steps:

![Web app swimlanes](../media/active-directory-v2-flows/convergence_scenarios_webapp.png)

The validation of the id_token by using a public signing key that is received from the v2.0 endpoint is sufficient to ensure the user's identity. A session cookie is set that can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web app sign-in code samples in our v2.0 [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might need to access another web service, such as a REST API. In this case, the web server app engages in a combined OpenID Connect and OAuth 2.0 flow, by using the [OAuth 2.0 Authorization Code flow](active-directory-v2-protocols.md#oauth2-authorization-code-flow). For more information about this scenario, see our [WebApp-WebAPI Getting Started topic](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md).

## Web APIs
You can use the v2.0 endpoint to secure web services, such as your app's RESTful Web API. Instead of ID tokens and session cookies, Web APIs use an OAuth 2.0 access token to secure their data and authenticate incoming requests. The caller of a Web API appends an access token in the authorization header of an HTTP request like this:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API uses the access token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the access token. You can learn about all the types of tokens and claims available to an app in the [v2.0 token reference](active-directory-v2-tokens.md).

A Web API can give users the power to opt-in or opt-out of certain functionality or data by exposing permissions, otherwise known as [scopes](active-directory-v2-scopes.md). For a calling app to acquire permission to a scope, the user must consent to the scope during a flow. The v2.0 endpoint asks the user for permission, and records permissions in all access tokens that the Web API receives. The Web API validates the access tokens it receives on each call, and it performs the proper authorization checks.

A Web API can receive access tokens from all types of apps, including web server apps, desktop and mobile apps, single-page apps, server-side daemons, and even other Web APIs. The high-level flow for Web API authentication is as follows:

![Web API swimlanes](../media/active-directory-v2-flows/convergence_scenarios_webapi.png)

To learn more about authorization codes, refresh tokens, and the detailed steps of getting access tokens, read about the [OAuth 2.0 protocol](active-directory-v2-protocols-oauth-code.md).

To learn how to secure a Web API with OAuth2 access tokens, check out the Web API code samples in our [Getting Started section](active-directory-appmodel-v2-overview.md#getting-started).


## Mobile and native apps
Device-installed apps, such as mobile and desktop apps, often need to access back-end services or Web APIs that store data and perform various functions on behalf of a user. These apps can add sign-in and authorization to back-end services by using the [OAuth 2.0 Authorization Code flow](active-directory-v2-protocols-oauth-code.md).

In this flow, the app receives an authorization code from the v2.0 endpoint when the user signs in. The authorization code represents the app's permission to call back-end services on behalf of the user who is signed in at that time. The app can exchange the authorization code in the background for an OAuth 2.0 access token and a refresh token. The app can use the access token to authenticate to Web APIs in HTTP requests, and use the refresh token to get new access tokens when older access tokens expire.

![Native app swimlanes](../media/active-directory-v2-flows/convergence_scenarios_native.png)

## Single-page apps (JavaScript)
Many modern apps have a single-page app front end that primarily is written in JavaScript. Often, it's written by using a framework like AngularJS, Ember.js, or Durandal.js. The Azure AD v2.0 endpoint supports these apps by using the [OAuth 2.0 implicit flow](active-directory-v2-protocols-implicit.md).

In this flow, the app receives tokens directly from the v2.0 authorize endpoint, without any server-to-server exchanges. All authentication logic and session handling takes place entirely in the JavaScript client, without extra page redirects.

![Implicit flow swimlanes](../media/active-directory-v2-flows/convergence_scenarios_implicit.png)

To see this scenario in action, try one of the single-page app code samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

### Daemons and server-side apps
Apps that have long-running processes or that operate without interaction with a user also need a way to access secured resources, such as Web APIs. These apps can authenticate and get tokens by using the app's identity, rather than a user's delegated identity, with the OAuth 2.0 client credentials flow.

In this flow, the app interacts directly with the `/token` endpoint to obtain endpoints:

![Daemon app swimlanes](../media/active-directory-v2-flows/convergence_scenarios_daemon.png)

To build a daemon app, see the client credentials documentation in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section, or see this [.NET sample app](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).

## Current limitations
Currently, the types of apps in this section are not supported by the v2.0 endpoint, but they are on the roadmap. For additional limitations and restrictions for the v2.0 endpoint, see the [v2.0 limitations article](active-directory-v2-limitations.md).

### Chained web APIs (on-behalf-of)
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 endpoint. This scenario is common in native clients that have a Web API back end, which in turn calls a Microsoft Online service like Office 365 or the Graph API.

This chained Web API scenario can be supported by using the OAuth 2.0 JSON Web Token (JWT) bearer credentials grant, otherwise known as the [On-Behalf-Of flow](active-directory-v2-protocols.md#oauth2-on-behalf-of-flow). Currently, the On-Behalf-Of flow is not implemented in the v2.0 endpoint. To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).
