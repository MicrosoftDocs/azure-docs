---
title: Single-page applications in Azure Active Directory
description: Describes what single-page applications (SPAs) are and the basics on protocol flow, registration, and token expiration for this app type. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: azuread-dev
ms.workload: identity
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ryanwi
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
ROBOTS: NOINDEX
---

# Single-page applications

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

Single-page applications (SPAs) are typically structured as a JavaScript presentation layer (front end) that runs in the browser, and a web API back end that runs on a server and implements the application's business logic.To learn more about the implicit authorization grant, and help you decide whether it's right for your application scenario, see [Understanding the OAuth2 implicit grant flow in Azure Active Directory](v1-oauth2-implicit-grant-flow.md).

In this scenario, when the user signs in, the JavaScript front end uses [Active Directory Authentication Library for JavaScript (ADAL.JS)](https://github.com/AzureAD/azure-activedirectory-library-for-js) and the implicit authorization grant to obtain an ID token (id_token) from Azure AD. The token is cached and the client attaches it to the request as the bearer token when making calls to its Web API back end, which is secured using the OWIN middleware.

## Diagram

![Single-page application diagram](./media/authentication-scenarios/single-page-app.png)

## Protocol flow

1. The user navigates to the web application.
1. The application returns the JavaScript front end (presentation layer) to the browser.
1. The user initiates sign in, for example by clicking a sign-in link. The browser sends a GET to the Azure AD authorization endpoint to request an ID token. This request includes the application ID and reply URL in the query parameters.
1. Azure AD validates the Reply URL against the registered Reply URL that was configured in the Azure portal.
1. The user signs in on the sign-in page.
1. If authentication is successful, Azure AD creates an ID token and returns it as a URL fragment (#) to the application's Reply URL. For a production application, this Reply URL should be HTTPS. The returned token includes claims about the user and Azure AD that are required by the application to validate the token.
1. The JavaScript client code running in the browser extracts the token from the response to use in securing calls to the application's web API back end.
1. The browser calls the application's web API back end with the ID token in the authorization header. The Azure AD authentication service issues an ID token that can be used as a bearer token if the resource is the same as the client ID (in this case, this is true as the web API is the app's own backend).

## Code samples

See the [code samples for single-page application scenarios](sample-v1-code.md#single-page-applications). Be sure to check back frequently as new samples are added frequently.

## App registration

* Single tenant - If you are building an application just for your organization, it must be registered in your company's directory by using the Azure portal.
* Multi-tenant - If you are building an application that can be used by users outside your organization, it must be registered in your company's directory, but also must be registered in each organization's directory that will be using the application. To make your application available in their directory, you can include a sign-up process for your customers that enables them to consent to your application. When they sign up for your application, they will be presented with a dialog that shows the permissions the application requires, and then the option to consent. Depending on the required permissions, an administrator in the other organization may be required to give consent. When the user or administrator consents, the application is registered in their directory.

After registering the application, it must be configured to use OAuth 2.0 implicit grant protocol. By default, this protocol is disabled for applications. To enable the OAuth2 implicit grant protocol for your application, edit its application manifest from the Azure portal and set the "oauth2AllowImplicitFlow" value to true. For more info, see [Application manifest](../develop/reference-app-manifest.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json).

## Token expiration

Using ADAL.js helps with:

* Refreshing an expired token
* Requesting an access token to call a web API resource

After a successful authentication, Azure AD writes a cookie in the user's browser to establish a session. Note the session exists between the user and Azure AD (not between the user and the web application). When a token expires, ADAL.js uses this session to silently obtain another token. ADAL.js uses a hidden iFrame to send and receive the request using the OAuth implicit grant protocol. ADAL.js can also use this same mechanism to silently obtain access tokens for other web API resources the application calls as long as these resources support cross-origin resource sharing (CORS), are registered in the user's directory, and any required consent was given by the user during sign-in.

## Next steps

* Learn more about other [Application types and scenarios](app-types.md)
* Learn about the Azure AD [authentication basics](v1-authentication-scenarios.md)
