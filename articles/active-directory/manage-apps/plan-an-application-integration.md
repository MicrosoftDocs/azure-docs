---

title: Get started integrating Azure Active Directory with apps
description: This article is a getting started guide for integrating Azure Active Directory (AD) with on-premises applications, and cloud applications.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 04/05/2021
ms.author: davidmu
ms.reviewer: ergreenl
---

# Integrating Azure Active Directory with applications getting started guide

This topic summarizes the process for integrating applications with Azure Active Directory (AD). Each of the sections below contain a brief summary of a more detailed topic so you can identify which parts of this getting started guide are relevant to you.

To download in-depth deployment plans, see [Next steps](#next-steps).

## Take inventory

Before integrating applications with Azure AD, it is important to know where you are and where you want to go.  The following questions are intended to help you think about your Azure AD application integration project.

### Application inventory

* Where are all of your applications? Who owns them?
* What kind of authentication do your applications require?
* Who needs access to which applications?
* Do you want to deploy a new application?
  * Will you build it in-house and deploy it on an Azure compute instance?
  * Will you use one that is available in the Azure Application Gallery?

### User and group inventory

* Where do your user accounts reside?
  * On-premises Active Directory
  * Azure AD
  * Within a separate application database that you own
  * In unsanctioned applications
  * All of the above
* What permissions and role assignments do individual users currently have? Do you need to review their access or are you sure that your user access and role assignments are appropriate now?
* Are groups already established in your on-premises Active Directory?
  * How are your groups organized?
  * Who are the group members?
  * What permissions/role assignments do the groups currently have?
* Will you need to clean up user/group databases before integrating?  (This is an important question. Garbage in, garbage out.)

### Access management inventory

* How do you currently manage user access to applications? Does that need to change?  Have you considered other ways to manage access, such as with [Azure RBAC](../../role-based-access-control/role-assignments-portal.md) for example?
* Who needs access to what?

Maybe you don't have the answers to all of these questions up front but that's okay.  This guide can help you answer some of those questions and make some informed decisions.

### Find unsanctioned cloud applications with Cloud Discovery

As mentioned above, there may be applications that haven't been managed by your organization until now.  As part of the inventory process, it is possible to find unsanctioned cloud applications. See
[Set up Cloud Discovery](/cloud-app-security/set-up-cloud-discovery).

## Integrating applications with Azure AD

The following articles discuss the different ways applications integrate with Azure AD, and provide some guidance.

* [Determining which Active Directory to use](../fundamentals/active-directory-whatis.md)
* [Using applications in the Azure application gallery](what-is-single-sign-on.md)
* [Integrating SaaS applications tutorials list](../saas-apps/tutorial-list.md)

## Capabilities for apps not listed in the Azure AD gallery

You can add any application that already exists in your organization, or any third-party application  from a vendor who is not already part of the Azure AD gallery. Depending on your [license agreement](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing), the following capabilities are available:

* Self-service integration of any application that supports [Security Assertion Markup Language (SAML) 2.0](https://wikipedia.org/wiki/SAML_2.0) identity providers (SP-initiated or IdP-initiated)
* Self-service integration of any web application that has an HTML-based sign-in page using [password-based SSO](sso-options.md#password-based-sso)
* Self-service connection of applications that use the [System for Cross-Domain Identity Management (SCIM) protocol for user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md)
* Ability to add links to any application in the [Office 365 app launcher](https://support.microsoft.com/office/meet-the-microsoft-365-app-launcher-79f12104-6fed-442f-96a0-eb089a3f476a) or [My Apps](https://myapplications.microsoft.com/)

If you're looking for developer guidance on how to integrate custom apps with Azure AD, see [Authentication Scenarios for Azure AD](../develop/authentication-vs-authorization.md). When you develop an app that uses a modern protocol like [OpenId Connect/OAuth](../develop/active-directory-v2-protocols.md) to authenticate users, you can register it with the Microsoft identity platform by using the [App registrations](../develop/quickstart-register-app.md) experience in the Azure portal.

### Authentication Types

Each of your applications may have different authentication requirements. With Azure AD, signing certificates can be used with applications that use SAML 2.0, WS-Federation, or OpenID Connect Protocols and Password Single Sign On. For more information about application authentication types, see [Managing Certificates for Federated Single Sign-On in Azure Active Directory](manage-certificates-for-federated-single-sign-on.md) and [Password based single sign on](what-is-single-sign-on.md).

### Enabling SSO with Azure AD App Proxy

With Microsoft Azure AD Application Proxy, you can provide access to applications located inside your private network securely, from anywhere and on any device. After you have installed an application proxy connector within your environment, it can be easily configured with Azure AD.

### Integrating custom applications

If you want to add your custom application to the Azure Application Gallery, see [Publish your app to the Azure AD app gallery](../develop/v2-howto-app-gallery-listing.md).

## Managing access to applications

The following articles describe ways you can manage access to applications once they have been integrated with Azure AD using Azure AD Connectors and Azure AD.

* [Managing access to apps using Azure AD](what-is-access-management.md)
* [Automating with Azure AD Connectors](../app-provisioning/user-provisioning.md)
* [Assigning users to an application](./assign-user-or-group-access-portal.md)
* [Assigning groups to an application](./assign-user-or-group-access-portal.md)
* [Sharing accounts](../enterprise-users/users-sharing-accounts.md)

## Next steps

For in-depth information, you can download Azure Active Directory deployment plans from [GitHub](../fundamentals/active-directory-deployment-plans.md). For gallery applications, you can download deployment plans for single sign-on, Conditional Access, and user provisioning through the [Azure portal](https://portal.azure.com).

To download a deployment plan from the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Enterprise Applications** | **Pick an App** | **Deployment Plan**.
