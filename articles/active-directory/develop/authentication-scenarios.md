---
title: Authentication in Azure AD | Microsoft Docs
description: Provides an overview of the five most common authentication scenarios for Azure Active Directory (Azure AD)
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 0c84e7d0-16aa-4897-82f2-f53c6c990fd9
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/26/2018
ms.author: celested
ms.reviewer: saeeda, jmprieur, andret, nacanuma, hirsin
ms.custom: aaddev
#Customer intent: As an application developer, I can learn about the basic authentication concepts in Azure Active Directory so I understand what I need to do when I create apps that integrate Microsoft Sign-in.
---

# What is authentication?

> [!NOTE]
> CelesteD is actively rewriting this topic in this branch. Expect some weirdness and churn.

*Authentication* is the act of challenging a party for legitimate credentials, providing the basis for creation of a security principal to be used for identity and access control. In simpler terms, it's the process of proving you are who you say you are. Authentication is sometimes shortened to AuthN.

*Authorization* is the act of granting an authenticated security principal permission to do something. It specifies what data you're allowed to access and what you can do with it. Authorization is sometimes shortened to AuthZ.

Azure Active Directory (Azure AD) simplifies authentication for application developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect, as well as open-source libraries for different platforms to help you start coding quickly.

There are two primary use cases in the Azure AD programming model:

* During an OAuth 2.0 authorization grant flow - when the resource owner grants authorization to the client application, allowing the client to access the resource owner's resources.
* During resource access by the client - as implemented by the resource server, using the claims values present in the access token to make access control decisions based upon them.

## Authentication basics in Azure AD

Consider the most basic scenario where identity is required: a user in a web browser needs to authenticate to a web application. The following diagram shows this scenario:

![Overview of sign-on to web application](./media/authentication-scenarios/basics_of_auth_in_aad.png)

Here’s what you need to know about the various components shown in the diagram:

* Azure AD is the identity provider. The identity provider is responsible for verifying the identity of users and applications that exist in an organization’s directory, and issues security tokens upon successful authentication of those users and applications.
* An application that wants to outsource authentication to Azure AD must be registered in Azure AD. Azure AD registers and uniquely identifies the app in the directory.
* Developers can use the open-source Azure AD authentication libraries to make authentication easy by handling the protocol details for you. For more info, see Azure AD [v2.0 authentication libaries](reference-v2-libraries.md) and [v1.0 authentication libraries](active-directory-authentication-libraries.md).
* Once a user has been authenticated, the application must validate the user’s security token to ensure that authentication was successful. You can find quickstarts, tutorials, and code samples in a variety of languages and frameworks which show what the application must do.
  * To quickly build an app and add functionality like getting tokens, refreshing tokens, signing in a user, displaying some user info, and more, see the **Quickstarts** section of the documentation.
  * To get in-depth, scenario-based procedures for top auth developer tasks like obtaining access tokens and using them in calls to the Microsoft Graph API and other APIs, implementing sign-in with Microsoft with a traditional web browser-based app using OpenID Connect, and more, see the **Tutorials** section of the documentation.
  * To download code samples, go to [GitHub](https://github.com/Azure-Samples?q=active-directory).
* The flow of requests and responses for the authentication process is determined by the authentication protocol that you used, such as OAuth 2.0, OpenID Connect, WS-Federation, or SAML 2.0. For more info about protocols, see the **Concepts > Protocols** section of the documentation.

Now that you have an overview of the basics, read on to understand the identity app model and API.

## App model and API

In the example scenario above, you can classify the apps according to these two roles:

* Apps that need to securely access resources
* Apps that play the role of the resource itself

TBD

Now that you have an overview of the basics, read on to understand how provisioning works in Azure AD and the common scenarios that Azure AD supports.

## Claims in Azure AD security tokens

Security tokens (access and ID tokens) issued by Azure AD contain claims, or assertions of information about the subject that has been authenticated. These claims can be used by the application for various tasks. For example, applications can use claims to validate the token, identify the subject's directory tenant, display user information, determine the subject's authorization, and so on. The claims present in any given security token are dependent upon the type of token, the type of credential used to authenticate the user, and the application configuration. A brief description of each type of claim emitted by Azure AD is provided in the table below. For more information, refer to [Supported token and claim types](v1-id-and-access-tokens.md).

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

## See Also

[Azure Active Directory Code Samples](sample-v1-code.md)

[Important Information About Signing Key Rollover in Azure AD](active-directory-signing-key-rollover.md)

[OAuth 2.0 in Azure AD](https://msdn.microsoft.com/library/azure/dn645545.aspx)
