---
title: Service-to-service apps in Azure Active Directory
description: Describes what service-to-service applications and the basics on protocol flow, registration, and token expiration for this app type. 
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/20/2019
ms.author: ryanwi
ms.reviewer: saeeda, jmprieur, andret
ms.custom: aaddev
---

# Service-to-service apps

Service-to-service applications can be a daemon or server application that needs to get resources from a web API. There are two sub-scenarios that apply to this section:

- A daemon that needs to call a web API, built on OAuth 2.0 client credentials grant type

    In this scenario, it’s important to understand a few things. First, user interaction is not possible with a daemon application, which requires the application to have its own identity. An example of a daemon application is a batch job, or an operating system service running in the background. This type of application requests an access token by using its application identity and presenting its Application ID, credential (password or certificate), and application ID URI to Azure AD. After successful authentication, the daemon receives an access token from Azure AD, which is then used to call the web API.

- A server application (such as a web API) that needs to call a web API, built on OAuth 2.0 On-Behalf-Of draft specification

    In this scenario, imagine that a user has authenticated on a native application, and this native application needs to call a web API. Azure AD issues a JWT access token to call the web API. If the web API needs to call another downstream web API, it can use the on-behalf-of flow to delegate the user’s identity and authenticate to the second-tier web API.

## Diagram

![Daemon or Server Application to Web API diagram](./media/authentication-scenarios/daemon_server_app_to_web_api.png)

## Protocol flow

### Application identity with OAuth 2.0 client credentials grant

1. First, the server application needs to authenticate with Azure AD as itself, without any human interaction such as an interactive sign-on dialog. It makes a request to Azure AD’s token endpoint, providing the credential, Application ID, and application ID URI.
1. Azure AD authenticates the application and returns a JWT access token that is used to call the web API.
1. Over HTTPS, the web application uses the returned JWT access token to add the JWT string with a “Bearer” designation in the Authorization header of the request to the web API. The web API then validates the JWT token, and if validation is successful, returns the desired resource.

### Delegated user identity with OAuth 2.0 On-Behalf-Of Draft Specification

The flow discussed below assumes that a user has been authenticated on another application (such as a native application), and their user identity has been used to acquire an access token to the first-tier web API.

1. The native application sends the access token to the first-tier web API.
1. The first-tier web API sends a request to Azure AD’s token endpoint, providing its Application ID and credentials, as well as the user’s access token. In addition, the request is sent with an on_behalf_of parameter that indicates the web API is requesting new tokens to call a downstream web API on behalf of the original user.
1. Azure AD verifies that the first-tier web API has permissions to access the second-tier web API and validates the request, returning a JWT access token and a JWT refresh token to the first-tier web API.
1. Over HTTPS, the first-tier web API then calls the second-tier web API by appending the token string in the Authorization header in the request. The first-tier web API can continue to call the second-tier web API as long as the access token and refresh tokens are valid.

## Code samples

See the code samples for Daemon or Server Application to Web API scenarios: [Server or Daemon Application to Web API](sample-v1-code.md#daemon-applications-accessing-web-apis-with-the-applications-identity)

## App registration

* Single tenant - For both the application identity and delegated user identity cases, the daemon or server application must be registered in the same directory in Azure AD. The web API can be configured to expose a set of permissions, which are used to limit the daemon or server’s access to its resources. If a delegated user identity type is being used, the server application needs to select the desired permissions. In the **API Permission** page for the application registration, after you've selected **Add a permission** and chosen the API family, choose **Delegated permissions**, and then select your permissions. This step is not required if the application identity type is being used.
* Multi-tenant - First, the daemon or server application is configured to indicate the permissions it requires to be functional. This list of required permissions is shown in a dialog when a user or administrator in the destination directory gives consent to the application, which makes it available to their organization. Some applications only require user-level permissions, which any user in the organization can consent to. Other applications require administrator-level permissions, which a user in the organization cannot consent to. Only a directory administrator can give consent to applications that require this level of permissions. When the user or administrator consents, both of the web APIs are registered in their directory.

## Token expiration

When the first application uses its authorization code to get a JWT access token, it also receives a JWT refresh token. When the access token expires, the refresh token can be used to re-authenticate the user without prompting for credentials. This refresh token is then used to authenticate the user, which results in a new access token and refresh token.

## Next steps

- Learn more about other [Application types and scenarios](app-types.md)
- Learn about the Azure AD [authentication basics](v1-authentication-scenarios.md)
