---
title: Azure AD for developers (v1.0)
description: Learn authentication basics for Azure AD for developers (v1.0) such as the app model, API, provisioning, and the most common authentication scenarios.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: azuread-dev
ms.topic: conceptual
ms.workload: identity
ms.date: 10/14/2019
ms.author: ryanwi
ms.reviewer: marsma, ludwignick
ms.custom: aaddev
ROBOTS: NOINDEX
#Customer intent: As an application developer, I want to learn about the basic authentication concepts in Azure AD for developers (v1.0), including the app model, API, provisioning, and supported scenarios, so I understand what I need to do when I create apps that integrate Microsoft sign-in.
---

# What is authentication?

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

*Authentication* is the act of challenging a party for legitimate credentials, providing the basis for creation of a security principal to be used for identity and access control. In simpler terms, it's the process of proving you are who you say you are. Authentication is sometimes shortened to AuthN.

*Authorization* is the act of granting an authenticated security principal permission to do something. It specifies what data you're allowed to access and what you can do with it. Authorization is sometimes shortened to AuthZ.

Azure Active Directory for developers (v1.0) (Azure AD) simplifies authentication for application developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect, as well as open-source libraries for different platforms to help you start coding quickly.

There are two primary use cases in the Azure AD programming model:

* During an OAuth 2.0 authorization grant flow - when the resource owner grants authorization to the client application, allowing the client to access the resource owner's resources.
* During resource access by the client - as implemented by the resource server, using the claims values present in the access token to make access control decisions based upon them.

## Authentication basics in Azure AD

Consider the most basic scenario where identity is required: a user in a web browser needs to authenticate to a web application. The following diagram shows this scenario:

![Overview of sign-on to web application](./media/v1-authentication-scenarios/auth-basics-microsoft-identity-platform.svg)

Here's what you need to know about the various components shown in the diagram:

* Azure AD is the identity provider. The identity provider is responsible for verifying the identity of users and applications that exist in an organization's directory, and issues security tokens upon successful authentication of those users and applications.
* An application that wants to outsource authentication to Azure AD must be registered in Azure Active Directory (Azure AD). Azure AD registers and uniquely identifies the app in the directory.
* Developers can use the open-source Azure AD authentication libraries to make authentication easy by handling the protocol details for you. For more info, see Microsoft identity platform [v2.0 authentication libraries](../develop/reference-v2-libraries.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json) and [v1.0 authentication libraries](active-directory-authentication-libraries.md).
* Once a user has been authenticated, the application must validate the user's security token to ensure that authentication was successful. You can find quickstarts, tutorials, and code samples in a variety of languages and frameworks which show what the application must do.
  * To quickly build an app and add functionality like getting tokens, refreshing tokens, signing in a user, displaying some user info, and more, see the **Quickstarts** section of the documentation.
  * To get in-depth, scenario-based procedures for top auth developer tasks like obtaining access tokens and using them in calls to the Microsoft Graph API and other APIs, implementing sign-in with Microsoft with a traditional web browser-based app using OpenID Connect, and more, see the **Tutorials** section of the documentation.
  * To download code samples, go to [GitHub](https://github.com/Azure-Samples?q=active-directory).
* The flow of requests and responses for the authentication process is determined by the authentication protocol that you used, such as OAuth 2.0, OpenID Connect, WS-Federation, or SAML 2.0. For more info about protocols, see the **Concepts > Authentication protocol** section of the documentation.

In the example scenario above, you can classify the apps according to these two roles:

* Apps that need to securely access resources
* Apps that play the role of the resource itself

### How each flow emits tokens and codes

Depending on how your client is built, it can use one (or several) of the authentication flows supported by Azure AD. These flows can produce a variety of tokens (id_tokens, refresh tokens, access tokens) as well as authorization codes, and require different tokens to make them work. This chart provides an overview:

|Flow | Requires | id_token | access token | refresh token | authorization code | 
|-----|----------|----------|--------------|---------------|--------------------|
|[Authorization code flow](v1-protocols-oauth-code.md) | | x | x | x | x|  
|[Implicit flow](v1-oauth2-implicit-grant-flow.md) | | x        | x    |      |                    |
|[Hybrid OIDC flow](v1-protocols-openid-connect-code.md#get-access-tokens)| | x  | |          |            x   |
|[Refresh token redemption](v1-protocols-oauth-code.md#refreshing-the-access-tokens) | refresh token | x | x | x| |
|[On-behalf-of flow](v1-oauth2-on-behalf-of-flow.md) | access token| x| x| x| |
|[Client credentials](v1-oauth2-client-creds-grant-flow.md) | | | x (app-only)| | |

Tokens issued via the implicit mode have a length limitation due to being passed back to the browser via the URL (where `response_mode` is `query` or `fragment`).  Some browsers have a limit on the size of the URL that can be put in the browser bar and fail when it is too long.  Thus, these tokens do not have `groups` or `wids` claims. 

Now that you have an overview of the basics, read on to understand the identity app model and API, how provisioning works in Azure AD, and links to detailed info about the common scenarios that Azure AD supports.

## Application model

Azure AD represents applications following a specific model that's designed to fulfill two main functions:

* **Identify the app according to the authentication protocols it supports** - This involves enumerating all the identifiers, URLs, secrets, and related information that are needed at authentication time. Here, Azure AD:

    * Holds all the data required to support authentication at run time.
    * Holds all the data for deciding what resources an app might need to access and whether a given request should be fulfilled and under what circumstances.
    * Provides the infrastructure for implementing app provisioning within the app developer's tenant and to any other Azure AD tenant.

* **Handle user consent during token request time and facilitate the dynamic provisioning of apps across tenants** - Here, Azure AD:

    * Enables users and administrators to dynamically grant or deny consent for the app to access resources on their behalf.
    * Enables administrators to ultimately decide what apps are allowed to do and which users can use specific apps, and how the directory resources are accessed.

In Azure AD, an **application object** describes an application as an abstract entity. Developers work with applications. At deployment time, Azure AD uses a given application object as a blueprint to create a **service principal**, which represents a concrete instance of an application within a directory or tenant. It's the service principal that defines what the app can actually do in a specific target directory, who can use it, what resources it has access to, and so on. Azure AD creates a service principal from an application object through **consent**.

The following diagram shows a simplified Azure AD provisioning flow driven by consent.  In it, two tenants exist (A and B), where tenant A owns the application, and tenant B is instantiating the application via a service principal.  

![Simplified provisioning flow driven by consent](./media/v1-authentication-scenarios/simplified-provisioning-flow-consent-driven.svg)

In this provisioning flow:

1. A user from tenant B attempts to sign in with the app, the authorization endpoint requests a token for the application.
1. The user credentials are acquired and verified for authentication
1. The user is prompted to provide consent for the app to gain access to tenant B
1. Azure AD uses the application object in tenant A as a blueprint for creating a service principal in tenant B
1. The user receives the requested token

You can repeat this process as many times as you want for other tenants (C, D, and so on). Tenant A retains the blueprint for the app (application object). Users and admins of all the other tenants where the app is given consent retain control over what the application is allowed to do through the corresponding service principal object in each tenant. For more information, see [Application and service principal objects in Microsoft identity platform](../develop/app-objects-and-service-principals.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json).

## Claims in Azure AD security tokens

Security tokens (access and ID tokens) issued by Azure AD contain claims, or assertions of information about the subject that has been authenticated. Applications can use claims for various tasks, including:

* Validate the token
* Identify the subject's directory tenant
* Display user information
* Determine the subject's authorization

The claims present in any given security token are dependent upon the type of token, the type of credential used to authenticate the user, and the application configuration.

A brief description of each type of claim emitted by Azure AD is provided in the table below. For more detailed information, see the [access tokens](../develop/access-tokens.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json) and [ID tokens](../develop/id-tokens.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json) issued by the Azure AD.

| Claim | Description |
| --- | --- |
| Application ID | Identifies the application that is using the token. |
| Audience | Identifies the recipient resource the token is intended for. |
| Application Authentication Context Class Reference | Indicates how the client was authenticated (public client vs. confidential client). |
| Authentication Instant | Records the date and time when the authentication occurred. |
| Authentication Method | Indicates how the subject of the token was authenticated (password, certificate, etc.). |
| First Name | Provides the given name of the user as set in Azure AD. |
| Groups | Contains object IDs of Azure AD groups that the user is a member of. |
| Identity Provider | Records the identity provider that authenticated the subject of the token. |
| Issued At | Records the time at which the token was issued, often used for token freshness. |
| Issuer | Identifies the STS that emitted the token as well as the Azure AD tenant. |
| Last Name | Provides the surname of the user as set in Azure AD. |
| Name | Provides a human readable value that identifies the subject of the token. |
| Object ID | Contains an immutable, unique identifier of the subject in Azure AD. |
| Roles | Contains friendly names of Azure AD Application Roles that the user has been granted. |
| Scope | Indicates the permissions granted to the client application. |
| Subject | Indicates the principal about which the token asserts information. |
| Tenant ID | Contains an immutable, unique identifier of the directory tenant that issued the token. |
| Token Lifetime | Defines the time interval within which a token is valid. |
| User Principal Name | Contains the user principal name of the subject. |
| Version | Contains the version number of the token. |

## Next steps

* Learn about the [application types and scenarios supported in Microsoft identity platform](app-types.md)
