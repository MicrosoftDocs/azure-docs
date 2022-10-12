---
title: Permissions in Microsoft Defender for Cloud
description: This article explains how Microsoft Defender for Cloud uses role-based access control to assign permissions to users and identify the permitted actions for each role.
ms.topic: overview
ms.custom: ignite-2022
ms.date: 05/22/2022
---

# Permissions in Microsoft Defender for Cloud

Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Defender for Cloud assesses the configuration of your resources to identify security issues and vulnerabilities. In Defender for Cloud, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or the resource's resource group.

In addition to the built-in roles, there are two roles specific to Defender for Cloud:

* **Security Reader**: A user that belongs to this role has viewing rights to Defender for Cloud. The user can view recommendations, alerts, a security policy, and security states, but cannot make changes.
* **Security Admin**: A user that belongs to this role has the same rights as the Security Reader and can also update the security policy, dismiss alerts and recommendations, and apply recommendations.

> [!NOTE]
> The security roles, Security Reader and Security Admin, have access only in Defender for Cloud. The security roles do not have access to other Azure services such as Storage, Web & Mobile, or Internet of Things.

## Roles and allowed actions

The following table displays roles and allowed actions in Defender for Cloud.

| **Action**   | [Security Reader](../role-based-access-control/built-in-roles.md#security-reader) / <br> [Reader](../role-based-access-control/built-in-roles.md#reader) | [Security Admin](../role-based-access-control/built-in-roles.md#security-admin) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) / [Owner](../role-based-access-control/built-in-roles.md#owner) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|:-|:-:|:-:|:-:|:-:|:-:|
|  |  |  | **(Resource group level)** | **(Subscription level)** | **(Subscription level)** |
| Add/assign initiatives (including) regulatory compliance standards) | - | - | - | ✔ | ✔ |
| Edit security policy | - | ✔ | - | ✔ | ✔ |
| Enable / disable Microsoft Defender plans | - | ✔ | - | ✔ | ✔ |
| Dismiss alerts | - | ✔ | - | ✔ | ✔ |
| Apply security recommendations for a resource</br> (and use [Fix](implement-security-recommendations.md#fix-button)) | - | - | ✔ | ✔ | ✔ |
| View alerts and recommendations | ✔ | ✔ | ✔ | ✔ | ✔ |


The specific role required to deploy monitoring components depends on the extension you're deploying. Learn more about [monitoring components](monitoring-components.md).

> [!NOTE]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.

## Next steps
This article explained how Defender for Cloud uses Azure RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Defender for Cloud](tutorial-security-policy.md)
- [Manage security recommendations in Defender for Cloud](review-security-recommendations.md)
- [Manage and respond to security alerts in Defender for Cloud](managing-and-responding-alerts.md)
- [Monitor partner security solutions](./partner-integration.md)
