---
title: Understand how users are assigned to apps in Azure Active Directory
description: Understand how users get assigned to an app that is using Azure Active Directory for identity management.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 01/07/2021
ms.author: davidmu
ms.reviewer: alamaral
---

# Understand how users are assigned to apps in Azure Active Directory

This article help you to understand how users get assigned to an application in your tenant.

## How do users get assigned to an application in Azure AD?

For a user to access an application, they must first be assigned to it in some way. Assignment can be performed by an administrator, a business delegate, or sometimes, the user themselves. Below describes the ways users can get assigned to applications:

* An administrator [assigns a user](./assign-user-or-group-access-portal.md) to the application directly
* An administrator [assigns a group](./assign-user-or-group-access-portal.md) that the user is a member of to the application, including:

  * A group that was synchronized from on-premises
  * A static security group created in the cloud
  * A [dynamic security group](../enterprise-users/groups-dynamic-membership.md) created in the cloud
  * A Microsoft 365 group created in the cloud
  * The [All Users](../fundamentals/active-directory-groups-create-azure-portal.md) group
* An administrator enables [Self-service Application Access](./manage-self-service-access.md) to allow a user to add an application using [My Apps](../user-help/my-apps-portal-end-user-access.md) **Add App** feature **without business approval**
* An administrator enables [Self-service Application Access](./manage-self-service-access.md) to allow a user to add an application using [My Apps](../user-help/my-apps-portal-end-user-access.md) **Add App** feature, but only **with prior approval from a selected set of business approvers**
* An administrator enables [Self-service Group Management](../enterprise-users/groups-self-service-management.md) to allow a user to join a group that an application is assigned to **without business approval**
* An administrator enables [Self-service Group Management](../enterprise-users/groups-self-service-management.md) to allow a user to join a group that an application is assigned to, but only **with prior approval from a selected set of business approvers**
* An administrator assigns a license to a user directly for a first party application, like [Microsoft 365](https://products.office.com/)
* An administrator assigns a license to a group that the user is a member of to a first party application, like [Microsoft 365](https://products.office.com/)
* An [administrator consents to an application](../develop/howto-convert-app-to-be-multi-tenant.md) to be used by all users and then a user signs in to the application
* A user [consents to an application](../develop/howto-convert-app-to-be-multi-tenant.md) themselves by signing in to the application

## Next steps

* [Quickstart Series on Application Management](view-applications-portal.md)
* [What is application management?](what-is-application-management.md)
* [What is single sign-on?](what-is-single-sign-on.md)
