---
title: What is Azure single sign-on?
description: Learn about single sign-on in Azure Active Directory.
titleSuffix: Azure Active Directory
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: overview
ms.date: 07/19/2021
ms.author: davidmu
---

# What is single sign-on?

This article provides you with information about what single sign-on (SSO) is in relation to your applications and Azure Active Directory (Azure AD). Using SSO means a user doesn't have to sign into every application they use. The user logs in once and that credential is used for other apps too. With SSO, users can access all needed applications without being required to authenticate a second time. 

Many applications already exist in Azure Active Directory (Azure AD) that you can use with SSO. You have several options for SSO depending on the needs of the application and how it is implemented. Take time to plan your SSO deployment before you create applications in Azure AD. The management of applications can be made easier by using the MyApps portal.

## SSO options

Choosing an SSO method depends on how the application is configured for authentication. Cloud applications can use federation-based options, such as OpenID Connect, OAuth, and SAML, or password-based, linked, or disabled methods.

- **Federation** - When you set up SSO to work between multiple identity providers, it's called federation. An SSO implementation based on federation protocols improves security, reliability, end-user experiences, and implementation. 

    With federated single sign-on, Azure AD authenticates the user to the application by using their Azure AD account. This method is supported for [SAML 2.0](../develop/single-sign-on-saml-protocol.md), WS-Federation, or [OpenID Connect](../develop/active-directory-v2-protocols.md) applications. Federated SSO is the richest mode of SSO. Use federated SSO with Azure AD when an application supports it, instead of password-based SSO and Active Directory Federation Services (AD FS).

    There are some scenarios where the single sign-on option is not present for an enterprise application. If the application was registered using **App registrations** in the portal, then the single sign-on capability is configured to use OpenID Connect and OAuth by default. In this case, the single sign-on option won't appear in the navigation under enterprise applications.

    Single sign-on is not available when an application is hosted in another tenant. Single sign-on is also not available if your account doesn't have the required permissions (Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal). Permissions can also cause a scenario where you can open single sign-on but won't be able to save.

    Authentication fundamentals: Federation | Azure Active Directory

    > [!VIDEO https://www.youtube.com/embed/CjarTgjKcX8]

- **Password-based** - On-premises applications can use password-based, Integrated Windows Authentication, header-based, linked, or disabled methods for single sign-on. The on-premises choices work when applications are configured for [Application Proxy](../app-proxy/what-is-application-proxy.md).

    With password-based single sign-on, users sign in to the application with a username and password the first time they access it. After the first sign-on, Azure AD supplies the username and password to the application. Password-based single sign-on enables secure application password storage and replay using a web browser extension or mobile app. This option uses the existing sign-in process provided by the application, enables an administrator to manage the passwords, and doesn't require the user to know the password.

## Plan SSO deployment

Web applications are hosted by various companies and made available as a service. Some popular examples of web applications include Microsoft 365, GitHub, and Salesforce, and there are thousands of others. People access web applications using a web browser on their computer. Single sign-on makes it possible for people to navigate between the various web applications without having to sign in multiple times.

How you implement single sign-on depends on where the application is hosted. Hosting matters because of the way network traffic is routed to access the application. Users don't need to use the Internet to access on-premises applications (hosted on a local network). If the application is hosted in the cloud, users need the Internet to use it. Cloud hosted applications are also called Software as a Service (SaaS) applications.

For cloud applications, federation protocols are used. You can also use single sign-on for on-premises-based applications. You let the identity provider know it's being used for the application, and then you configure the application using Application Proxy to trust the identity provider. 

## MyApps

If you're an end user, you likely don't care much about SSO details. You just want to use the apps that make you productive without having to type your password so much. You can find and manage your applications at: `https://myapps.microsoft.com`.	

## Next steps

- [Plan a single sign-on deployment](plan-sso-deployment.md)
