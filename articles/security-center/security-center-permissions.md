---
title: Permissions in Azure Security Center | Microsoft Docs
description: This article explains how Azure Security Center uses role-based access control to assign permissions to users and identify the permitted actions for each role.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 07/04/2021
ms.author: memildin

---

# Permissions in Azure Security Center

Security Center uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Security Center assesses the configuration of your resources to identify security issues and vulnerabilities. In Security Center, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or the resource's resource group.

In addition to the built-in roles, there are two roles specific to Security Center:

* **Security Reader**: A user that belongs to this role has viewing rights to Security Center. The user can view recommendations, alerts, a security policy, and security states, but cannot make changes.
* **Security Admin**: A user that belongs to this role has the same rights as the Security Reader and can also update the security policy and dismiss alerts and recommendations.

> [!NOTE]
> The security roles, Security Reader and Security Admin, have access only in Security Center. The security roles do not have access to other Azure services such as Storage, Web & Mobile, or Internet of Things.

## Roles and allowed actions

The following table displays roles and allowed actions in Security Center.

| **Action**                                                                                                                      | [Security Reader](../role-based-access-control/built-in-roles.md#security-reader) / <br> [Reader](../role-based-access-control/built-in-roles.md#reader) | [Security Admin](../role-based-access-control/built-in-roles.md#security-admin) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) / [Owner](../role-based-access-control/built-in-roles.md#owner)| [Contributor](../role-based-access-control/built-in-roles.md#contributor)| [Owner](../role-based-access-control/built-in-roles.md#owner)|
|:----------------------------------------------------------------------------------------------------------------------------|:-----------------------------:|:--------------:|:------------------------------------------------------:|:------------------------:|:------------------:|
||||**(Resource group level)**|**(Subscription level)**|**(Subscription level)**|
| Add/assign initiatives (including) regulatory compliance standards)                                                         | -                             | -              | -                                                      | -                        | ✔                 |
| Edit security policy                                                                                                        | -                             | ✔             | -                                                      | -                        | ✔                 |
| Enable / disable Azure Defender plans                                                                                             | -                             | ✔             | -                                                      | -                        | ✔                 |
| Enable / disable auto provisioning                                                                                          | -                             | ✔             | -                                                      | ✔                       | ✔                  |
| Dismiss alerts                                                                                                              | -                             | ✔             | -                                                      | ✔                       | ✔                  |
| Apply security recommendations for a resource</br> (and use [Fix](security-center-remediate-recommendations.md#fix-button)) | -                             | -              | ✔                                                     | ✔                        | ✔                 |
| View alerts and recommendations                                                                                             | ✔                            | ✔              | ✔                                                     | ✔                        | ✔                 |
||||||

> [!NOTE]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.

## Next steps
This article explained how Security Center uses Azure RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Security Center](tutorial-security-policy.md)
- [Manage security recommendations in Security Center](security-center-recommendations.md)
- [Manage and respond to security alerts in Security Center](security-center-managing-and-responding-alerts.md)
- [Monitor partner security solutions](./security-center-partner-integration.md)