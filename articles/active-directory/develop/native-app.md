---
title: Native apps in Azure Active Directory
description: Describes what native apps are and the basics on protocol flow, registration, and token expiration for this app type. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ryanwi
ms.reviewer: saeeda, jmprieur, andret
ms.custom: aaddev
---

# Native apps

Native apps are applications that call a web API on behalf of a user. This scenario is built on the OAuth 2.0 authorization code grant type with a public client, as described in section 4.1 of the [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749). The native application obtains an access token for the user by using the OAuth 2.0 protocol. This access token is then sent in the request to the web API, which authorizes the user and returns the desired resource.

## Diagram

![Native Application to Web API Diagram](./media/authentication-scenarios/native_app_to_web_api.png)

## Protocol flow

If you are using the AD Authentication Libraries, most of the protocol details described below are handled for you, such as the browser pop-up, token caching, and handling of refresh tokens.

1. Using a browser pop-up, the native application makes a request to the authorization endpoint in Azure AD. This request includes the Application ID and the redirect URI of the native application as shown in the Azure portal, and the application ID URI for the web API. If the user hasn’t already signed in, they are prompted to sign in again
1. Azure AD authenticates the user. If it is a multi-tenant application and consent is required to use the application, the user will be required to consent if they haven’t already done so. After granting consent and upon successful authentication, Azure AD issues an authorization code response back to the client application’s redirect URI.
1. When Azure AD issues an authorization code response back to the redirect URI, the client application stops browser interaction and extracts the authorization code from the response. Using this authorization code, the client application sends a request to Azure AD’s token endpoint that includes the authorization code, details about the client application (Application ID and redirect URI), and the desired resource (application ID URI for the web API).
1. The authorization code and information about the client application and web API are validated by Azure AD. Upon successful validation, Azure AD returns two tokens: a JWT access token and a JWT refresh token. In addition, Azure AD returns basic information about the user, such as their display name and tenant ID.
1. Over HTTPS, the client application uses the returned JWT access token to add the JWT string with a “Bearer” designation in the Authorization header of the request to the web API. The web API then validates the JWT token, and if validation is successful, returns the desired resource.
1. When the access token expires, the client application will receive an error that indicates the user needs to authenticate again. If the application has a valid refresh token, it can be used to acquire a new access token without prompting the user to sign in again. If the refresh token expires, the application will need to interactively authenticate the user once again.

> [!NOTE]
> The refresh token issued by Azure AD can be used to access multiple resources. For example, if you have a client application that has permission to call two web APIs, the refresh token can be used to get an access token to the other web API as well.

## Code samples

See the code samples for Native Application to Web API scenarios. And, check back frequently -- we add new samples frequently. [Native Application to Web API](sample-v1-code.md#desktop-and-mobile-public-client-applications-calling-microsoft-graph-or-a-web-api).

## App registration

To register an application with the Azure AD v1.0 endpoint, see [Register an app](quickstart-register-app.md).

* Single tenant - Both the native application and the web API must be registered in the same directory in Azure AD. The web API can be configured to expose a set of permissions, which are used to limit the native application’s access to its resources. The client application then selects the desired permissions from the “Permissions to Other Applications” drop-down menu in the Azure portal.
* Multi-tenant - First, the native application only ever registered in the developer or publisher’s directory. Second, the native application is configured to indicate the permissions it requires to be functional. This list of required permissions is shown in a dialog when a user or administrator in the destination directory gives consent to the application, which makes it available to their organization. Some applications only require user-level permissions, which any user in the organization can consent to. Other applications require administrator-level permissions, which a user in the organization cannot consent to. Only a directory administrator can give consent to applications that require this level of permissions. When the user or administrator consents, only the web API is registered in their directory. 

## Token expiration

When the native application uses its authorization code to get a JWT access token, it also receives a JWT refresh token. When the access token expires, the refresh token can be used to re-authenticate the user without requiring them to sign in again. This refresh token is then used to authenticate the user, which results in a new access token and refresh token.

## Next steps

- Learn more about other [Application types and scenarios](app-types.md)
- Learn about the Azure AD [authentication basics](v1-authentication-scenarios.md)
