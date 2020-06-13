---
title: Enable SSO for your multi-tenant application
description: Guidance for independent software vendors on integrating with Azure active Directory
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/22/2019
ms.author: kenwith
ms.reviewer: jeeds
ms.collection: M365-identity-device-management
#customer intent: As an ISV developer, I need to learn about single-sign on (SSO) so I can create a multi-tenant SaaS app
---

# Enable Single Sign-on for your multi-tenant application  

When you offer your application for use by other companies through a purchase or subscription, you make your application available to customers within their own Azure tenants. This is known as creating a multi-tenant application. For overview of this concept, see [Multitenant Applications in Azure](https://docs.microsoft.com/azure/dotnet-develop-multitenant-applications) and [Tenancy in Azure Active Directory](../develop/single-and-multi-tenant-apps.md).

## What is Single Sign-On

Single sign-on (SSO) adds security and convenience when users sign on to applications by using Azure Active Directory and other identities. When an application is SSO enabled, users don't have to enter separate credentials to access that application. For a full explanation of Single sign-on. [See Single sign-on to applications in Azure Active Directory](what-is-single-sign-on.md).

## Why Enable Single Sign-on in your application?

There are many advantages to enabling SSO in your multi-tenant application. When you enable SSO for your application:

* Your application can be listed in the Azure Marketplace, where your app is discoverable by millions of organizations using Azure Active Directory.
  * Enables customers to quickly configure the application with Azure AD.

* Your application can be discoverable in the Office 365 App Gallery, the Office 365 App Launcher and within Microsoft Search on Office.com

* Your application can use the Microsoft Graph REST API to access the data that drives user productivity that is available from the Microsoft Graph.

* You reduce support costs by making it easier for your customers.
  * Application-specific documentation coproduced with the Azure AD team for our mutual customers eases adoption.
  * If one-click SSO is enabled, your customers’ IT Administrators don't have to learn how to configure your application for use in their organization.

* You provide your customers the ability to completely manage their employee and guest identities’ authentication and authorization.

  * Placing all account management and compliance responsibility with the customer owner of those identities.

  * Providing ability to enable or disable SSO for specific identity providers, groups, or users to meet their business needs.

* You increase your marketability and adoptability. Many large organizations require that (or aspire to) their employees have seamless SSO experiences across all applications. Making SSO easy is important.

* You reduce end-user friction, which may increase end-user usage and increase your revenue.

## How to enable Single Sign-on in your published application

1. [Choose the right federation protocol for your multi-tenant application](isv-choose-multi-tenant-federation.md).
1. Implement SSO in your application
   - ‎See [guidance on authentication patterns](../develop/v2-app-types.md)
   - See [Azure active Directory code samples](../develop/sample-v2-code.md) for OIDC and OAuth protocols
1. [Create your Azure Tenant](isv-tenant-multi-tenant-app.md) and test your application
1. [Create and publish SSO documentation on your site](isv-create-sso-documentation.md).
1. [Submit your application listing](https://microsoft.sharepoint.com/teams/apponboarding/Apps/SitePages/Default.aspx)  and partner with Microsoft to create documentation on Microsoft’s site.
1. [Join the Microsoft Partner Network (free) and create your go to market plan](https://partner.microsoft.com/en-us/explore/commercial#gtm).
