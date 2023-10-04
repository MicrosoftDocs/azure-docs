---
title: Enable automatic user provisioning for multi-tenant applications in Microsoft Entra ID
description: A guide for independent software vendors for enabling automated provisioning in Microsoft Entra ID
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: reference
ms.workload: identity
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: zhchia, arvinh
---

# Enable automatic user provisioning for your multi-tenant application in Microsoft Entra ID

Automatic user provisioning is the process of automating the creation, maintenance, and removal of user identities in target systems like your software-as-a-service applications.

## Why enable automatic user provisioning?

Applications that require that a user record is present in the application before a user’s first sign in require user provisioning. There are benefits to you as a service provider, and benefits to your customers.

### Benefits to you as the service provider

* Increase the security of your application by using the Microsoft identity platform.

* Reduce actual and perceived customer effort to adopt your application.

* Reduce your costs in integrating with multiple identity providers (IdPs) for automatic user provisioning by using System for Cross-Domain Identity Management (SCIM)-based provisioning.

* Reduce support costs by providing rich logs to help customers troubleshoot user provisioning issues.

* Increase the visibility of your application in the [Microsoft Entra app gallery](https://azuremarketplace.microsoft.com/marketplace/apps).

* Get a prioritized listing in the App Tutorials page.

### Benefits to your customers

* Increase security by automatically removing access to your application for users who change roles or leave the organization to your application.

* Simplify user management for your application by avoiding human error and repetitive work associated with manual provisioning.

* Reduce the costs of hosting and maintaining custom-developed provisioning solutions.

## Choose a provisioning method

Microsoft Entra ID provides several integration paths to enable automatic user provisioning for your application.

* The [Microsoft Entra provisioning service](../app-provisioning/user-provisioning.md) manages the provisioning and deprovisioning of users from Microsoft Entra ID to your application (outbound provisioning) and from your application to Microsoft Entra ID (inbound provisioning). The service connects to the System for Cross-Domain Identity Management (SCIM) user management API endpoints provided by your application.

* When using the [Microsoft Graph](/graph/), your application manages inbound and outbound provisioning of users and groups from Microsoft Entra ID to your application by querying the Microsoft Graph API.

* The Security Assertion Markup Language Just in Time (SAML JIT) user provisioning can be enabled if your application is using SAML for federation. It uses claims information sent in the SAML token to provision users.

To help determine which integration option to use for your application, refer to the high-level comparison table, and then see the more detailed information on each option.

| Capabilities enabled or enhanced by Automatic Provisioning| Microsoft Entra provisioning service (SCIM 2.0)| Microsoft Graph API (OData v4.0)| SAML JIT |
|---|---|---|---|
| User and group management in Microsoft Entra ID| √| √| User only |
| Manage users and groups synced from on-premises Active Directory| √*| √*| User only* |
| Access data beyond users and groups during provisioning Access to Microsoft 365 data (Teams, SharePoint, Email, Calendar, Documents, etc.)| X+| √| X |
| Create, read, and update users based on business rules| √| √| √ |
| Delete users based on business rules| √| √| X |
| Manage automatic user provisioning for all applications from the Microsoft Entra admin center| √| X| √ |
| Support multiple identity providers| √| X| √ |
| Support guest accounts (B2B)| √| √| √ |
| Support non-enterprise accounts (B2C)| X| √| √ |

<sup>*</sup> – Microsoft Entra Connect setup is required to sync users from AD to Microsoft Entra ID.  
<sup>+</sup >– Using SCIM for provisioning does not preclude you from integrating your application with Microsoft Graph for other purposes.

<a name='azure-ad-provisioning-service-scim'></a>

## Microsoft Entra provisioning service (SCIM)

The Microsoft Entra provisioning service uses [SCIM](https://aka.ms/SCIMOverview), an industry standard for provisioning supported by many identity providers (IdPs) as well as applications (e.g. Slack, G Suite, Dropbox). We recommend you use the Microsoft Entra provisioning service if you want to support IdPs in addition to Microsoft Entra ID, as any SCIM-compliant IdP can connect to your SCIM endpoint. Building a simple /User endpoint, you can enable provisioning without having to maintain your own sync engine. 

For more information on how the Microsoft Entra provisioning service users SCIM, see: 

* [Learn more about the SCIM standard](https://aka.ms/SCIMOverview)

* [Using System for Cross-Domain Identity Management (SCIM) to automatically provision users and groups from Microsoft Entra ID to applications](../app-provisioning/use-scim-to-provision-users-and-groups.md)

* [Understand the Microsoft Entra SCIM implementation](../app-provisioning/use-scim-to-provision-users-and-groups.md)

## Microsoft Graph for Provisioning

When you use Microsoft Graph for provisioning, you have access to all the rich user data available in Graph. In addition to the details of users and groups, you can also fetch additional information like the user’s roles, manager and direct reports, owned and registered devices, and hundreds of other data pieces available in the [Microsoft Graph](/graph/api/overview). 

More than 15 million organizations, and 90% of fortune 500 companies use Microsoft Entra ID while subscribing to Microsoft cloud services like Microsoft 365, Microsoft Azure, or Enterprise Mobility Suite. You can use Microsoft Graph to integrate your app with administrative workflows, such as employee onboarding (and termination), profile maintenance, and more. 

Learn more about using Microsoft Graph for provisioning:

* [Microsoft Graph Home page](https://developer.microsoft.com/graph)

* [Overview of Microsoft Graph](/graph/overview)

* [Microsoft Graph Auth Overview](/graph/auth/)

* [Getting started with Microsoft Graph](https://developer.microsoft.com/graph/rest-api/)

## Using SAML JIT for provisioning

If you want to provision users only upon first sign in to your application, and do not need to automatically deprovision users, SAML JIT is an option. Your application must support SAML 2.0 as a federation protocol to use SAML JIT.

SAML JIT uses the claims information in the SAML token to create and update user information in the application. Customers can configure these required claims in the Microsoft Entra application as needed. Sometimes the JIT provisioning needs to be enabled from the application side so that customer can use this feature. SAML JIT is useful for creating and updating users, but it can't delete or deactivate the users in the application.

## Next Steps

* [Enable Single Sign-on for your application](../manage-apps/v2-howto-app-gallery-listing.md)

* [Submit your application listing](https://microsoft.sharepoint.com/teams/apponboarding/Apps/SitePages/Default.aspx) and partner with Microsoft to create documentation on Microsoft’s site.

* [Join the Microsoft Partner Network (free) and create your go to market plan](https://partner.microsoft.com/explore/commercial).
