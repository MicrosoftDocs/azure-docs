---
title: Choose the right federation protocol for your multi-tenant application
description: Guidance for independent software vendors on integrating with Azure Active Directory
services: active-directory
author: baselden
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 05/22/2019
ms.author: baselden
ms.reviewer: barbaraselden
ms.collection: M365-identity-device-management
#customer intent: As an ISV developer, I need to learn about single-sign on (SSO) so I can create a multi-tenant SaaS app
---

# Choose the right federation protocol for your multi-tenant application

As you develop your software as a service (SaaS) application, you must select the federation protocol that best meets your and your customers’ needs. This decision is based on your development platform, and your desire to integrate with data available within your customers’ Office 365 and Azure AD ecosystem.

See the [protocols available for SSO integrations](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/what-is-single-sign-on) with Azure Active Directory.

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

## OAuth 2.0 and OIDC

OAuth 2.0 is an [industry-standard](https://oauth.net/2/) protocol for authorization. OIDC (OpenID Connect) is an [industry standard](https://openid.net/connect/) identity authentication layer built on top of the Oath 2.0 protocol.

### Benefits

Microsoft recommends using OIDC/OAuth 2.0 as they have authentication and authorization built in to the protocols. With SAML, you must additionally implement authorization.

Using Oath2.0 and OIDC simplifies your customers’ end-user experience when adopting SSO for your application. You can easily define the permission sets necessary, which are then automatically represented to the administrator or end user consenting.

Additionally, using these protocols enables your customers to use Conditional Access and MFA policies to control access to the applications. Microsoft provides libraries and code samples across multiple technology platforms to aid your development. Add graph line here link to the two above also build UWP apps.

### Implementation

You register your application with Microsoft, which is the OAuth provider. You then also register your OAuth-based application with any other desired Identity Providers.

For information on how to implement these protocols for SSO to web apps, see [Authorize access to web applications using OpenID Connect and Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code). For information on how to implement these protocols for SSO in mobile apps, see the following documentation:

* [Android](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-android)

* [iOS](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-ios)

* [Universal Windows Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-uwp)

## SAML 2.0 and WSFed

Security Assertion Markup Language (SAML) is generally used for web applications. See [How Azure uses the SAML protocol](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-saml-protocol-reference) for an overview. Azure Active Directory supports the [Single Sign-out SAML protocol](https://docs.microsoft.com/en-us/azure/active-directory/develop/single-sign-out-saml-protocol).

Web Services Federation (WSFed) is an [industry standard](http://docs.oasis-open.org/wsfed/federation/v1.2/ws-federation.html) generally used for web applications that are developed using the .Net platform.

### Benefits

If you developed your application without SSO capabilities and your technology platform supports open-source libraries for SAML, they're readily available across platforms. For your application, you can provide each customer an administration user interface to configure SSO. They can then configure SAML SSO connecting to any other Identity Provider in their ecosystem that supports SAML. Most identity Providers, including Azure Active Directory and Active Directory Federation Server, support SAML 2.0.

### Trade-offs

When using SAML 2.0 or WSFed protocols, customers can't apply certain conditional access policies or Multi-factor Authentication (MFA) when the application is used from a mobile device. The experience for these features on mobile applications will be less than ideal. Further, your application won't be able to access the Microsoft Graph.

### Implementation

The following resources can help you to design and implement your application’s SAML SSO.

## SSO and Using Microsoft Graph

Using any of the above protocols for SSO enables your application to leverage the rich data available through the Microsoft Graph.  Microsoft Graph enables your customers to better integrate your application into their Microsoft ecosystems. For example, you can enable your application to use Microsoft Graph to integrate with your customers’ Office 365 implementation and surface users’ Microsoft Office and SharePoint items within your application.

If you're using OAuth/OIDC protocols with Microsoft Libraries, then the experience is seamless for Azure AD customers because the same token can be used for invoking Microsoft Graph APIs. For SAML or WSFed, you must add additional code within your application to get the OAuth token for invoking Microsoft Graph, and your customers must perform additional configuration steps.

## Next Steps
[Enable SSO for your multi-tenant application](\manage-apps\isv-sso-content.md)

[Create documentation for your multi-tenant application](\manage-apps\isv-create-sso-documentation.md)
