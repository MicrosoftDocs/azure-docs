---
title: Understand how users are assigned to apps in Azure Active Directory
description: Understand how users get assigned to an app that is using Azure Active Directory for identity management.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: kenwith
---

# Understand how users are assigned to apps in Azure Active Directory
This article help you to understand how users get assigned to an application in your tenant.

## How do users get assigned to an application in Azure AD?
For a user to access an application, they must first be assigned to it in some way. Assignment can be performed by an administrator, a business delegate, or sometimes, the user themselves. Below describes the ways users can get assigned to applications:

*  An administrator [assigns a user](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal) to the application directly
*  An administrator [assigns a group](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal) that the user is a member of to the application, including:
    * A group that was synchronized from on-premises
    * A static security group created in the cloud
    * A [dynamic security group](https://docs.microsoft.com/azure/active-directory/active-directory-groups-dynamic-membership-azure-portal) created in the cloud
    * A Microsoft 365 group created in the cloud
    * The [All Users](https://docs.microsoft.com/azure/active-directory/active-directory-accessmanagement-dedicated-groups) group
*  An administrator enables [Self-service Application Access](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-application-access) to allow a user to add an application using [My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) **Add App** feature **without business approval**
*  An administrator enables [Self-service Application Access](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-application-access) to allow a user to add an application using [My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) **Add App** feature, but only **with prior approval from a selected set of business approvers**
*  An administrator enables [Self-service Group Management](https://docs.microsoft.com/azure/active-directory/active-directory-accessmanagement-self-service-group-management) to allow a user to join a group that an application is assigned to **without business approval**
*  An administrator enables [Self-service Group Management](https://docs.microsoft.com/azure/active-directory/active-directory-accessmanagement-self-service-group-management) to allow a user to join a group that an application is assigned to, but only **with prior approval from a selected set of business approvers**
*  An administrator assigns a license to a user directly for a first party application, like [Microsoft 365](https://products.office.com/)
*  An administrator assigns a license to a group that the user is a member of to a first party application, like [Microsoft 365](https://products.office.com/)
*  An [administrator consents to an application](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview) to be used by all users and then a user signs in to the application
* A user [consents to an application](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview) themselves by signing in to the application

## Next steps
* [Quickstart Series on Application Management](view-applications-portal.md)
* [What is application management?](what-is-application-management.md)
* [What is single sign-on?](what-is-single-sign-on.md)
