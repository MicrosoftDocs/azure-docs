---
title: Permissions in Azure Security Center | Microsoft Docs
description: This article explains how Azure Security Center uses role-based access control to assign permissions to users and identifies the allowed actions for each role.
services: security-center
cloud: na
documentationcenter: na
author: TerryLanfear
manager: MBaldwin

ms.assetid:
ms.service: security-center
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/13/2017
ms.author: terrylan

---

# Permissions in Azure Security Center

Azure Security Center uses [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Security Center assesses the configuration of your resources to identify security issues and vulnerabilities. In Security Center, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or resource group that a resource belongs to.

In addition to these roles, there are two specific Security Center roles:

* **Security Reader**: A user that belongs to this role has viewing rights to Security Center. The user can view recommendations, alerts, a security policy, and security states, but cannot make changes.
* **Security Administrator**: A user that belongs to this role has the same rights as the Security Reader and can also update the security policy and dismiss alerts and recommendations.

> [!NOTE]
> The security roles, Security Reader and Security Administrator, have access only in Security Center. The security roles do not have access to other service areas of Azure such as Storage, Web & Mobile, or Internet of Things.
>
>

## Roles and allowed actions

The following table displays roles and allowed actions in Security Center. An X indicates that the action is allowed for that role.

| Role | Edit security policy | Apply security recommendations for a resource | Dismiss alerts and recommendations | View alerts and recommendations |
|:--- |:---:|:---:|:---:|:---:|
| Subscription Owner | X | X | X | X |
| Subscription Contributor | X | X | X | X |
| Resource Group Owner | -- | X | -- | X |
| Resource Group Contributor | -- | X | -- | X |
| Reader | -- | -- | -- | X |
| Security Administrator | X | -- | X | X |
| Security Reader | -- | -- | -- | X |

> [!NOTE]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.
>
>

## Next steps
This article explained how Security Center uses RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Security Center](security-center-policies.md)
- [Manage security recommendations in Security Center](security-center-recommendations.md)
- [Monitor the security health of your Azure resources](security-center-monitoring.md)
- [Manage and respond to security alerts in Security Center](security-center-managing-and-responding-alerts.md)
- [Monitor partner security solutions](security-center-partner-solutions.md)
