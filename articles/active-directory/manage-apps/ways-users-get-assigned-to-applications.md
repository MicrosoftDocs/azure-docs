---
title: Understand how users are assigned to apps
description: Understand how users get assigned to an app that is using Microsoft Entra ID for identity management.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 01/07/2021
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: enterprise-apps
---

# Understand how users are assigned to apps

This article helps you to understand how users get assigned to an application in your tenant.

<a name='how-do-users-get-assigned-an-application-in-azure-ad'></a>

## How do users get assigned an application in Microsoft Entra ID?

There are several ways a user can be assigned an application. Assignment can be performed by an administrator, a business delegate, or sometimes, the user themselves. Below describes the ways users can get assigned to applications:

* An administrator [assigns a user](./assign-user-or-group-access-portal.md) to the application directly
* An administrator [assigns a group](./assign-user-or-group-access-portal.md) that the user is a member of to the application, including:

  * A group that was synchronized from on-premises
  * A static security group created in the cloud
  * A [dynamic security group](../enterprise-users/groups-dynamic-membership.md) created in the cloud
  * A Microsoft 365 group created in the cloud
  * The [All Users](../fundamentals/how-to-manage-groups.md) group
* An administrator enables [Self-service Application Access](./manage-self-service-access.md) to allow a user to add an application using [My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510) **Add App** feature **without business approval**
* An administrator enables [Self-service Application Access](./manage-self-service-access.md) to allow a user to add an application using [My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510) **Add App** feature, but only **with prior approval from a selected set of business approvers**
* An administrator enables [Self-service Group Management](../enterprise-users/groups-self-service-management.md) to allow a user to join a group that an application is assigned to **without business approval**
* An administrator enables [Self-service Group Management](../enterprise-users/groups-self-service-management.md) to allow a user to join a group that an application is assigned to, but only **with prior approval from a selected set of business approvers**
* One of the application's roles is included in an [entitlement management access package](../governance/entitlement-management-access-package-resources.md), and a user requests or is assigned to that access package
* An administrator assigns a license to a user directly, for a Microsoft service such as [Microsoft 365](www.microsoft.com/microsoft-365)
* An administrator assigns a license to a group that the user is a member of, for a Microsoft service such as [Microsoft 365](www.microsoft.com/microsoft-365)
* A user [consents to an application](./user-admin-consent-overview.md#user-consent) on behalf of themselves.

## Next steps

* [Quickstart Series on Application Management](view-applications-portal.md)
* [What is application management?](what-is-application-management.md)
* [What is single sign-on?](what-is-single-sign-on.md)
