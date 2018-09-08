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

# Application types in Azure Active Directory

The Azure Active Directory (Azure AD) supports authentication for a variety of modern app architectures, all of them based on industry-standard protocols [OAuth 2.0 or OpenID Connect](active-directory-v2-protocols.md).

This article describes the types of apps that you can build by using Azure AD regardless of your preferred language or platform. It notes differences you need to know when writing a particular app that works with the v1.0 endpoint or v2.0 endpoint. The information in this article is designed to help you understand high-level scenarios before you start working with the code.

> [!NOTE]
> The v2.0 endpoint doesn't support all Azure AD scenarios and features. To determine whether you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## The basics

You must register each app that uses the v2.0 endpoint in the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com). The app registration process collects and assigns these values for your app:

* An **Application ID** that uniquely identifies your app
* A **Redirect URI** that you can use to direct responses back to your app
* A few other scenario-specific values

For details, learn how to [register an app](quickstart-v2-register-an-app.md).

After the app is registered, the app communicates with Azure AD by sending requests to the Azure AD v2.0 endpoint. We provide open-source frameworks and libraries that handle the details of these requests. You also have the option to implement the authentication logic yourself by creating requests to these endpoints:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```
<!-- TODO: Need a page for libraries to link to -->

# [Single-page applications](#tab/spas)

Single-page applications (SPAs) are typically structured as a JavaScript presentation layer (front end) that runs in the browser, and a web API back end that runs on a server and implements the application’s business logic.

Many modern apps have a single-page app front end that is primarily written in JavaScript. Often, it's written by using a framework like AngularJS, Ember.js, or Durandal.js. The Azure AD v2.0 endpoint supports these apps by using the [OAuth 2.0 implicit flow](v2-oauth2-implicit-grant-flow.md).

In the OAuth 2.0 implicit flow, the app receives tokens directly from the v2.0 authorize endpoint, without any server-to-server exchanges. All authentication logic and session handling takes place entirely in the JavaScript client, without extra page redirects.

![Implicit authentication flow](./media/v2-app-types/convergence_scenarios_implicit.png)

In this scenario, when the user signs in, the JavaScript front end uses [Microsoft Authentication Library for JavaScript (MSAL.JS)](https://github.com/AzureAD/microsoft-authentication-library-for-js) and the implicit authorization grant to obtain an ID token (id_token) from Azure AD. The token is cached and the client attaches it to the request as the bearer token when making calls to its Web API back end, which is secured using the OWIN middleware.

# [Diagram](#tab/diagram/spas)

![Single Page Application diagram](./media/authentication-scenarios/single_page_app.png)

# [Protocol flow](#tab/protocol-flow/spas)

1. The user navigates to the web application.
1. The application returns the JavaScript front end (presentation layer) to the browser.
1. The user initiates sign in, for example by clicking a sign-in link. The browser sends a GET to the Azure AD authorization endpoint to request an ID token. This request includes the application ID and reply URL in the query parameters.
1. Azure AD validates the Reply URL against the registered Reply URL that was configured in the Azure portal.
1. The user signs in on the sign-in page.
1. If authentication is successful, Azure AD creates an ID token and returns it as a URL fragment (#) to the application’s Reply URL. For a production application, this Reply URL should be HTTPS. The returned token includes claims about the user and Azure AD that are required by the application to validate the token.
1. The JavaScript client code running in the browser extracts the token from the response to use in securing calls to the application’s web API back end.
1. The browser calls the application’s web API back end with the ID token in the authorization header. The Azure AD authentication service issues an ID token that can be used as a bearer token if the resource is the same as the client ID (in this case, this is true as the web API is the app's own backend).

# [Code samples](#tab/code-samples/spas)

See the [code samples for single-page application scenarios](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Samples). Be sure to check back frequently as new samples are added frequently.

# [Registering](#tab/registering/spas)

To register a single-page app, see [Register an app with the Azure AD v2.0 endpoint](quickstart-v2-register-an-app.md).

* Single tenant - If you are building an application just for your organization, it must be registered in your company’s directory by using the Azure portal.
* Multi-tenant - If you are building an application that can be used by users outside your organization, it must be registered in your company’s directory, but also must be registered in each organization’s directory that will be using the application. To make your application available in their directory, you can include a sign-up process for your customers that enables them to consent to your application. When they sign up for your application, they will be presented with a dialog that shows the permissions the application requires, and then the option to consent. Depending on the required permissions, an administrator in the other organization may be required to give consent. When the user or administrator consents, the application is registered in their directory.

After registering the application, it must be configured to use OAuth 2.0 implicit grant protocol. By default, this protocol is disabled for applications. To enable the OAuth2 implicit grant protocol for your application, edit its application manifest from the Azure portal and set the “oauth2AllowImplicitFlow” value to true. For more info, see [Application manifest](reference-app-manifest.md).

# [Token expiration](#tab/token-expiration/spas)

Using MSAL.js helps with:

* refreshing an expired token
* requesting an access token to call a web API resource

After a successful authentication, Azure AD writes a cookie in the user's browser to establish a session. Note the session exists between the user and Azure AD (not between the user and the web application). When a token expires, MSAL.js uses this session to silently obtain another token. MSAL.js uses a hidden iFrame to send and receive the request using the OAuth implicit grant protocol. MSAL.js can also use this same mechanism to silently obtain access tokens for other web API resources the application calls as long as these resources support cross-origin resource sharing (CORS), are registered in the user’s directory, and any required consent was given by the user during sign-in.

# [Web apps](#tab/web-apps)

Web apps are applications that authenticate a user in a web browser to a web application. In this scenario, the web application directs the user’s browser to sign them in to Azure AD. Azure AD returns a sign-in response through the user’s browser, which contains claims about the user in a security token. This scenario supports sign-on using the OpenID Connect, SAML 2.0, and WS-Federation protocols.

For web apps (.NET, PHP, Java, Ruby, Python, Node) that the user accesses through a browser, you can use OpenID Connect for user sign-in. In OpenID Connect, the web app receives an ID token. An ID token is a security token that verifies the user's identity and provides information about the user in the form of claims:

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

# [Diagram](#tab/diagram/web-apps)

![Authentication flow for browser to web application](./media/authentication-scenarios/web_browser_to_web_api.png)

In web server apps, the sign-in authentication flow takes these high-level steps:

![Web app authentication flow](./media/v2-app-types/convergence_scenarios_webapp.png)

You can ensure the user's identity by validating the ID token with a public signing key that is received from the v2.0 endpoint. A session cookie is set, which can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web app sign-in code samples in our v2.0 [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might need to access another web service, such as a REST API. In this case, the web server app engages in a combined OpenID Connect and OAuth 2.0 flow, by using the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md). For more information about this scenario, read about [getting started with web apps and Web APIs](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md).

# [Protocol flow](#tab/protocol-flow/web-apps)

1. When a user visits the application and needs to sign in, they are redirected via a sign-in request to the authentication endpoint in Azure AD.
1. The user signs in on the sign-in page.
1. If authentication is successful, Azure AD creates an authentication token and returns a sign-in response to the application’s Reply URL that was configured in the Azure portal. For a production application, this Reply URL should be HTTPS. The returned token includes claims about the user and Azure AD that are required by the application to validate the token.
1. The application validates the token by using a public signing key and issuer information available at the federation metadata document for Azure AD. After the application validates the token, it starts a new session with the user. This session allows the user to access the application until it expires.

# [Code samples](#tab/code-samples/web-apps)

See the code samples for web browser to web application scenarios. And, check back frequently as new samples are added frequently.

# [Registering](#tab/registering/web-apps)

To register a web app, see [Register an app with the Azure AD v2.0 endpoint](quickstart-v2-register-an-app.md).

* Single tenant - If you are building an application just for your organization, it must be registered in your company’s directory by using the Azure portal.
* Multi-tenan - If you are building an application that can be used by users outside your organization, it must be registered in your company’s directory, but also must be registered in each organization’s directory that will be using the application. To make your application available in their directory, you can include a sign-up process for your customers that enables them to consent to your application. When they sign up for your application, they will be presented with a dialog that shows the permissions the application requires, and then the option to consent. Depending on the required permissions, an administrator in the other organization may be required to give consent. When the user or administrator consents, the application is registered in their directory.

# [Token expiration](#tab/token-expiration/web-apps)

The user’s session expires when the lifetime of the token issued by Azure AD expires. Your application can shorten this time period if desired, such as signing out users based on a period of inactivity. When the session expires, the user will be prompted to sign in again.

# [Web API](#tab/web-api)

Web API apps are web applications that need to get resources from a web API. In this scenario, there are two identity types that the web application can use to authenticate and call the web API:

- **Application identity** - This scenario uses OAuth 2.0 client credentials grant to authenticate as the application and access the web API. When using an application identity, the web API can only detect that the web application is calling it, as the web API does not receive any information about the user. If the application receives information about the user, it will be sent via the application protocol, and it is not signed by Azure AD. The web API trusts that the web application authenticated the user. For this reason, this pattern is called a trusted subsystem.
- **Delegated user identity** - This scenario can be accomplished in two ways: OpenID Connect, and OAuth 2.0 authorization code grant with a confidential client. The web application obtains an access token for the user, which proves to the web API that the user successfully authenticated to the web application and that the web application was able to obtain a delegated user identity to call the web API. This access token is sent in the request to the web API, which authorizes the user and returns the desired resource.

Both the application identity and delegated user identity types are discussed in the flow below. The key difference between them is that the delegated user identity must first acquire an authorization code before the user can sign in and gain access to the web API.

# [Diagram](#tab/diagram/web-api)

![Web Application to Web API diagram](./media/authentication-scenarios/web_app_to_web_api.png)

# [Protocol flow](#tab/protocol-flow/web-api)

#### Application identity with OAuth 2.0 client credentials grant

1. A user is signed in to Azure AD in the web application (see the **Web apps** section for more info).
1. The web application needs to acquire an access token so that it can authenticate to the web API and retrieve the desired resource. It makes a request to Azure AD’s token endpoint, providing the credential, application ID, and web API’s application ID URI.
1. Azure AD authenticates the application and returns a JWT access token that is used to call the web API.
1. Over HTTPS, the web application uses the returned JWT access token to add the JWT string with a “Bearer” designation in the Authorization header of the request to the web API. The web API then validates the JWT token, and if validation is successful, returns the desired resource.

#### Delegated user identity with OpenID Connect

1. A user is signed in to a web application using Azure AD (see the [Web Browser to Web Application](#web-browser-to-web-application) section above). If the user of the web application has not yet consented to allowing the web application to call the web API on its behalf, the user will need to consent. The application will display the permissions it requires, and if any of these are administrator-level permissions, a normal user in the directory will not be able to consent. This consent process only applies to multi-tenant applications, not single tenant applications, as the application will already have the necessary permissions. When the user signed in, the web application received an ID token with information about the user, as well as an authorization code.
1. Using the authorization code issued by Azure AD, the web application sends a request to Azure AD’s token endpoint that includes the authorization code, details about the client application (Application ID and redirect URI), and the desired resource (application ID URI for the web API).
1. The authorization code and information about the web application and web API are validated by Azure AD. Upon successful validation, Azure AD returns two tokens: a JWT access token and a JWT refresh token.
1. Over HTTPS, the web application uses the returned JWT access token to add the JWT string with a “Bearer” designation in the Authorization header of the request to the web API. The web API then validates the JWT token, and if validation is successful, returns the desired resource.

#### Delegated user identity with OAuth 2.0 authorization code grant

1. A user is already signed in to a web application, whose authentication mechanism is independent of Azure AD.
1. The web application requires an authorization code to acquire an access token, so it issues a request through the browser to Azure AD’s authorization endpoint, providing the Application ID and redirect URI for the web application after successful authentication. The user signs in to Azure AD.
1. If the user of the web application has not yet consented to allowing the web application to call the web API on its behalf, the user will need to consent. The application will display the permissions it requires, and if any of these are administrator-level permissions, a normal user in the directory will not be able to consent. This consent applies to both single and multi-tenant application. In the single tenant case, an admin can perform admin consent to consent on behalf of their users. This can be done using the `Grant Permissions` button in the [Azure Portal](https://portal.azure.com). 
1. After the user has consented, the web application receives the authorization code that it needs to acquire an access token.
1. Using the authorization code issued by Azure AD, the web application sends a request to Azure AD’s token endpoint that includes the authorization code, details about the client application (Application ID and redirect URI), and the desired resource (application ID URI for the web API).
1. The authorization code and information about the web application and web API are validated by Azure AD. Upon successful validation, Azure AD returns two tokens: a JWT access token and a JWT refresh token.
1. Over HTTPS, the web application uses the returned JWT access token to add the JWT string with a “Bearer” designation in the Authorization header of the request to the web API. The web API then validates the JWT token, and if validation is successful, returns the desired resource.

#### Using the v2.0 endpoint to secure web services

You can use the v2.0 endpoint to secure web services, such as your app's RESTful web API. Instead of ID tokens and session cookies, a web API uses an OAuth 2.0 access token to secure its data and to authenticate incoming requests. The caller of a Web API appends an access token in the authorization header of an HTTP request, like this:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API uses the access token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the access token. To learn about all the types of tokens and claims that are available to an app, see the [v2.0 tokens reference](v2-id-and-access-tokens.md).

A web API can give users the power to opt in or opt out of specific functionality or data by exposing permissions, also known as scopes. For a calling app to acquire permission to a scope, the user must consent to the scope during a flow. The v2.0 endpoint asks the user for permission, and then records permissions in all access tokens that the Web API receives. The Web API validates the access tokens it receives on each call and performs authorization checks.

A web API can receive access tokens from all types of apps, including web server apps, desktop and mobile apps, single-page apps, server-side daemons, and even other Web APIs. The high-level flow for a Web API looks like this:

![Web API authentication flow](./media/v2-app-types/convergence_scenarios_webapi.png)

To learn how to secure a Web API by using OAuth2 access tokens, check out the Web API code samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

In many cases, web APIs also need to make outbound requests to other downstream web APIs secured by Azure Active Directory. To do so, web APIs can take advantage of Azure AD's **On Behalf Of** flow, which allows the web API to exchange an incoming access token for another access token to be used in outbound requests. The v2.0 endpoint's On Behalf Of flow is described in [detail here](v2-oauth2-on-behalf-of-flow.md).

# [Code samples](#tab/code-samples/web-api)

See the code samples for Web Application to Web API scenarios. And, check back frequently -- new samples are added frequently. Web [Application to Web API](sample-v1-code.md#web-applications-signing-in-users-calling-microsoft-graph-or-a-web-api-with-the-users-identity).

# [Registering](#tab/registering/web-api)

* Single tenant - For both the application identity and delegated user identity cases, the web application and the web API must be registered in the same directory in Azure AD. The web API can be configured to expose a set of permissions, which are used to limit the web application’s access to its resources. If a delegated user identity type is being used, the web application needs to select the desired permissions from the **Permissions to other applications** drop-down menu in the Azure portal. This step is not required if the application identity type is being used.
* Multi-tenant - First, the web application is configured to indicate the permissions it requires to be functional. This list of required permissions is shown in a dialog when a user or administrator in the destination directory gives consent to the application, which makes it available to their organization. Some applications only require user-level permissions, which any user in the organization can consent to. Other applications require administrator-level permissions, which a user in the organization cannot consent to. Only a directory administrator can give consent to applications that require this level of permissions. When the user or administrator consents, the web application and the web API are both registered in their directory.

# [Token expiration](#tab/token-expiration/web-api)

When the web application uses its authorization code to get a JWT access token, it also receives a JWT refresh token. When the access token expires, the refresh token can be used to re-authenticate the user without requiring them to sign in again. This refresh token is then used to authenticate the user, which results in a new access token and refresh token.

## Mobile and native apps

Device-installed apps, such as mobile and desktop apps, often need to access back-end services or Web APIs that store data and perform functions on behalf of a user. These apps can add sign-in and authorization to back-end services by using the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

In this flow, the app receives an authorization code from the v2.0 endpoint when the user signs in. The authorization code represents the app's permission to call back-end services on behalf of the user who is signed in. The app can exchange the authorization code in the background for an OAuth 2.0 access token and a refresh token. The app can use the access token to authenticate to Web APIs in HTTP requests, and use the refresh token to get new access tokens when older access tokens expire.

![Native app authentication flow](./media/v2-app-types/convergence_scenarios_native.png)

## Daemons and server-side apps

Apps that have long-running processes or that operate without interaction with a user also need a way to access secured resources, such as Web APIs. These apps can authenticate and get tokens by using the app's identity, rather than a user's delegated identity, with the OAuth 2.0 client credentials flow.

In this flow, the app interacts directly with the `/token` endpoint to obtain endpoints:

![Daemon app authentication flow](./media/v2-app-types/convergence_scenarios_daemon.png)

To build a daemon app, see the [client credentials documentation](v2-oauth2-client-creds-grant-flow.md), or try a [.NET sample app](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).
