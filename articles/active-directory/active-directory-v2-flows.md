<properties
	pageTitle="Types of the v2.0 endpoint | Microsoft Azure"
	description="The types of apps and scenarios supported by the Azure AD v2.0 endpoint."
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
	ms.date="05/31/2016"
	ms.author="dastrock"/>

# Types of the v2.0 endpoint
The v2.0 endpoint supports authentication for a variety of modern app architectures, all of which are based on the industry standard protocols [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) and/or [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  This doc briefly describes the types of apps you can build, independent of the language or platform you prefer.  It will help you understand the high level scenarios before you [jump right into the code](active-directory-appmodel-v2-overview.md#getting-started).

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## The basics
Every app that uses the v2.0 endpoint will need to be registered at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app](active-directory-v2-app-registration.md).

Once registered, the app communicates with Azure AD my sending requests to the Azure Active Directory v2.0 endpoint.  We provide open source frameworks & libraries that take care of the details of these requests, or you can implement the authentication logic yourself by crafting requests to these endpoints:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```
<!-- TODO: Need a page for libraries to link to -->

## Web apps
For web apps (.NET, PHP, Java, Ruby, Python, Node, etc) that are accessed through a browser, you can perform user sign-in using [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  In OpenID Connect the web app receives an `id_token`, a security token that verifies the user's identity and provides information about the user in the form of claims:

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

You can learn about all of the types of tokens and claims available to an app in the [v2.0 token reference](active-directory-v2-tokens.md).

In web server apps, the sign-in authentication flow takes these high level steps:

![Web App Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_webapp.png)

The validation of the id_token using a public signing key received from the v2.0 endpoint is sufficient to ensure the user's identity, and set a session cookie that can be used to identify the user on subsequent page requests.

To see this scenario in action, try out one of the web app sign-in code samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might also need to access some other web service such as a REST API.  In this case the web server app can engage in a combined OpenID Connect & OAuth 2.0 flow, using the [OAuth 2.0 Authorization Code flow](active-directory-v2-protocols.md#oauth2-authorization-code-flow). This scenario is covered below in our [WebApp-WebAPI Getting Started topic](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md).

## Web APIs
You can use the v2.0 endpoint to secure web services as well, such as your app's RESTful Web API.  Instead of id_tokens and session cookies, Web APIs use OAuth 2.0 access_tokens to secure their data and authenticate incoming requests.  The caller of a Web API appends an access_token in the authorization header of an HTTP request:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API can then use the access_token to verify the API caller's identity and extract information about the caller from claims that are encoded in the access_token.  You can learn about all of the types of tokens and claims available to an app in the [v2.0 token reference](active-directory-v2-tokens.md).

A Web API can give users the power to opt-in/opt-out of certain functionality or data by exposing permissions, otherwise known as [scopes](active-directory-v2-scopes.md).  For a calling app to acquire permission to a scope, the user must consent to the scope during an flow.  The v2.0 endpoint will take care of asking the user for permission, and recording those permissions in all access_tokens that the Web API receives.  All the Web API needs to worry about is validating the access_tokens it receives on each call and performing the proper authorization checks.

A Web API can receive access_tokens from all types of apps, including web server apps, desktop and mobile apps, single page apps, server side daemons, and even other Web APIs.  The high level flow for web api authentication is as follows:

![Web API Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_webapi.png)

To learn more about authorization_codes, refresh_tokens, and the detailed steps of getting access_tokens, read about the [OAuth 2.0 protocol](active-directory-v2-protocols-oauth-code.md).

To learn how to secure a web api with OAuth2 access_tokens, check out the web api code samples in our [Getting Started section](active-directory-appmodel-v2-overview.md#getting-started).


## Mobile and native apps
Apps that are installed on a device, such as mobile and desktop apps, often need to access backend services or Web APIs that store data and perform various functions on behalf of a user.  These apps can add sign-in and authorization to backend services using the [OAuth 2.0 Authorization Code flow](active-directory-v2-protocols-oauth-code.md).  

In this flow, a the app receives an authorization_code from the v2.0 endpoint upon user sign-in, which represents the app's permission to call backend services on behalf of the currently signed-in user.  The app can then exchange the authoriztion_code in the background for an OAuth 2.0 access_token and a refresh_token.  The app can use the access_token to authenticate to Web APIs in HTTP requests, and can use the refresh_token to get new access_tokens when older ones expire.

![Native App Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_native.png)

## Single page apps (javascript)
Many modern apps have a Single Page App (SPA) front-end written primarily in javascript and often using frameworks such as AngularJS, Ember.js, Durandal, etc.  The Azure AD v2.0 endpoint supports these apps using the [OAuth 2.0 Implicit Flow](active-directory-v2-protocols-implicit.md).

In this flow, the app receives tokens from the v2.0 authorize endpoint directly, without performing any backend server to server exchanges.  This allows all authentication logic and session handling to take place entirely in the javascript client, without performing extra page redirects.

![Implicit Flow Swimlanes Image](../media/active-directory-v2-flows/convergence_scenarios_implicit.png)

To see this scenario in action, try out one of the single page app code samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

## Current limitations
These types of apps are not currently supported by the v2.0 endpoint, but are on the roadmap.  Additional limitations and restrictions for the v2.0 endpoint are described in the [v2.0 limitations article](active-directory-v2-limitations.md).

### Daemons/server side apps
Apps that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs.  These apps can authenticate and get tokens using the app's identity (rather than a user's delegated identity) using the OAuth 2.0 client credentials flow.

The client credentials flow is not currently supported in the v2.0 endpoint.  To see how this flow works in the generally available Azure AD service, check out the [daemon code sample on GitHub](https://github.com/AzureADSamples/Daemon-DotNet).

### Chained web APIs (on-behalf-of)
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 endpoint.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service such as Office 365 or the Graph API.

This chained Web API scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the [On-Behalf-Of Flow](active-directory-v2-protocols.md#oauth2-on-behalf-of-flow).  However, the On-Behalf-Of flow is not currently implemented in the v2.0 endpoint.  To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).
