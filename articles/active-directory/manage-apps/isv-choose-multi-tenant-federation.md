---
title: Choose the right federation protocol for your multi-tenant application
description: Guidance for independent software vendors on integrating with Azure Active Directory
services: active-directory
author: barbaraselden
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity   
ms.date: 05/22/2019
ms.author: baselden
ms.reviewer: jeeds
ms.collection: M365-identity-device-management
#customer intent: As an ISV developer, I need to learn about single-sign on (SSO) so I can create a multi-tenant SaaS app
---
# Choose the right federation protocol for your multi-tenant application

When you develop your software as a service (SaaS) application, you must select the federation protocol that best meets your and your customers’ needs. This decision is based on your development platform, and your desire to integrate with data available within your customers’ Office 365 and Azure AD ecosystem.

See the complete list of [protocols available for SSO integrations](what-is-single-sign-on.md) with Azure Active Directory.
The following table compares 
* Open Authentication 2.0 (OAuth 2.0)
* Open ID Connect (OIDC)
* Security Assertion Markup Language (SAML)
* Web Services Federation (WSFed)

| Capability| OAuth / OIDC| SAML / WSFed |
| - |-|-|
| Web-based Single sign-on| √| √ |
| Web-based Single sign-out| √| √ |
| Mobile-based Single sign-on| √| √* |
| Mobile-based Single sign-out| √| √* |
| Conditional Access policies for mobile applications| √| X |
| Seamless MFA experience for mobile applications| √| X |
| Access Microsoft Graph| √| X |

*Possible, but Microsoft doesn't provide samples or guidance.

## OAuth 2.0 and Open ID Connect

OAuth 2.0 is an [industry-standard](https://oauth.net/2/) protocol for authorization. OIDC (OpenID Connect) is an [industry standard](https://openid.net/connect/) identity authentication layer built on top of the Oath 2.0 protocol.

### Benefits

Microsoft recommends using OIDC/OAuth 2.0 as they have authentication and authorization built in to the protocols. With SAML, you must additionally implement authorization.

The authorization inherent in these protocols enables your application to access and integrate with rich user and organizational data through the Microsoft Graph API.

Using OAuth 2.0 and OIDC simplifies your customers’ end-user experience when adopting SSO for your application. You can easily define the permission sets necessary, which are then automatically represented to the administrator or end user consenting.

Additionally, using these protocols enables your customers to use Conditional Access and MFA policies to control access to the applications. Microsoft provides libraries and [code samples across multiple technology platforms](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Samples) to aid your development.  

### Implementation

You register your application with Microsoft Identity, which is an OAuth 2.0 provider. You could then also register your OAuth 2.0-based application with any other Identity Provider that you wish to integrate with. 

For information on how to register your application and implement these protocols for SSO to web apps, see [Authorize access to web applications using OpenID Connect and Azure Active Directory](../develop/sample-v2-code.md).  For information on how to implement these protocols for SSO in mobile apps, see the following: 

* [Android](../develop/quickstart-v2-android.md)

* [iOS](../develop/quickstart-v2-ios.md)

* [Universal Windows Platform](../develop/quickstart-v2-uwp.md)

## SAML 2.0 and WSFed

Security Assertion Markup Language (SAML) is usually used for web applications. See [How Azure uses the SAML protocol](../develop/active-directory-saml-protocol-reference.md) for an overview. 

Web Services Federation (WSFed) is an [industry standard](http://docs.oasis-open.org/wsfed/federation/v1.2/ws-federation.html) generally used for web applications that are developed using the .Net platform.

### Benefits

SAML 2.0 is a mature standard and most technology platforms support open-source libraries for SAML 2.0. You can provide your customers an administration interface to configure SAML SSO. They can configure SAML SSO for Microsoft Azure AD,  and any other identity provider that supports SAML 2

### Trade-offs

When using SAML 2.0 or WSFed protocols for mobile applications, certain conditional access policies including Multi-factor Authentication (MFA) will have a degraded experience. Additionally, if you want to access the Microsoft Graph, you will need to implement authorization through OAuth 2.0 to generate necessary tokens. 

### Implementation

Microsoft does not provide libraries for SAML implementation or recommend specific libraries. There are many open-source libraries available.

## SSO and Using Microsoft Graph Rest API 

Microsoft Graph is the data fabric across all of Microsoft 365, including Office 365, Windows 10 and Enterprise Mobility and Security, and additional products such as Dynamics 365. This includes the core schemas of the entities such as Users, Groups, Calendar, Mail, Files, and more, that drive user productivity. Microsoft Graph offers three interfaces for developers a REST based API, Microsoft Graph data connect, and Connectors that allow developers to add their own data into the Microsoft Graph.  

Using any of the above protocols for SSO enables your application’s access to the rich data available through the Microsoft Graph REST API. This  enables your customers  to get more value from their investment in Microsoft 365. For example,  your application can call the Microsoft Graph API to integrate with your customers’ Office 365 instance and surface users’ Microsoft Office and SharePoint items within your application. 

If you are using Open ID Connect  to authenticate, then your development experience is seamless  because you will use OAuth2, the foundation of Open ID Connect, to acquire tokens can be used for invoking Microsoft Graph APIs. If your application is using SAML or WSFed, you must add additional code within your application to get these OAuth2 to acquire the tokens  required to  invoking Microsoft Graph APIs. 

## Next Steps

[Enable SSO for your multi-tenant application](isv-sso-content.md)

[Create documentation for your multi-tenant application](isv-create-sso-documentation.md)
