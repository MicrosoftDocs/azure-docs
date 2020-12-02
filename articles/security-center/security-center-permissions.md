---
title: Permissions in Azure Security Center | Microsoft Docs
description: This article explains how Azure Security Center uses role-based access control to assign permissions to users and identifies the allowed actions for each role.
services: security-center
cloud: na
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 12/01/2020
ms.author: memildin

---

# Permissions in Azure Security Center

Azure Security Center uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Security Center assesses the configuration of your resources to identify security issues and vulnerabilities. In Security Center, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or resource group that a resource belongs to.

In addition to these roles, there are two specific Security Center roles:

* **Security Reader**: A user that belongs to this role has viewing rights to Security Center. The user can view recommendations, alerts, a security policy, and security states, but cannot make changes.
* **Security Admin**: A user that belongs to this role has the same rights as the Security Reader and can also update the security policy and dismiss alerts and recommendations.

> [!NOTE]
> The security roles, Security Reader and Security Admin, have access only in Security Center. The security roles do not have access to other service areas of Azure such as Storage, Web & Mobile, or Internet of Things.
>

## Roles and allowed actions

The following table displays roles and allowed actions in Security Center.

|Action|Security Reader / <br> Reader |Security Admin  |Resource Group Contributor / <br> Resource Group Owner  |Subscription Contributor  |Subscription Owner  |
|:--- |:---:|:---:|:---:|:---:|:---:|
|Edit security policy|-|✔|-|-|✔|
|Add/assign initiatives (including) regulatory compliance standards)|-|-|-|-|✔|
|Enable / disable Azure Defender|-|✔|-|-|✔|
|Enable / disable auto-provisioning|-|✔|-|✔|✔|
|Apply security recommendations for a resource</br> (and use [Quick Fix!](security-center-remediate-recommendations.md#quick-fix-remediation))|-|-|✔|✔|✔|
|Dismiss alerts|-|✔|-|✔|✔|
|View alerts and recommendations|✔|✔|✔|✔|✔|

> [!NOTE]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.
>
>


## Enable tenant-wide permissions for yourself

A user with the Azure Active Directory role of **Global Administrator** might have tenant-wide responsibilities, but lack the Azure permissions to view that organization-wide information in Azure Security Center. 

To assign yourself tenant-level permissions:

1. As a Global Administrator user without an assignment on the root management group of the tenant, open Security Center's **Overview** page and select the **tenant-wide visibility** link in the banner. 

    :::image type="content" source="media/security-center-permissions/enable-tenant-level-permissions-banner.png" alt-text="Enable tenant-level permissions in Azure Security Center":::

1. Select the new Azure role to be defined. 

    :::image type="content" source="media/security-center-permissions/enable-tenant-level-permissions-form.png" alt-text="Form for defining the tenant-level permissions to be assigned to your user":::

    > [!TIP]
    > To understand the differences between the optional roles, use the table in [Roles and allowed actions](security-center-permissions.md#roles-and-allowed-actions).

The organizational-wide view is achieved by granting roles on the root management group level of the tenant.  

Learn more about the [Global Administrator role](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-ad-roles)




## Next steps
This article explained how Security Center uses Azure RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Security Center](tutorial-security-policy.md)
- [Manage security recommendations in Security Center](security-center-recommendations.md)
- [Monitor the security health of your Azure resources](security-center-monitoring.md)
- [Manage and respond to security alerts in Security Center](security-center-managing-and-responding-alerts.md)
- [Monitor partner security solutions](./security-center-partner-integration.md)