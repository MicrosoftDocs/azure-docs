---
title: Add or remove role assignments using Azure RBAC and the Azure portal
description: Learn how to grant access to Azure resources for users, groups, service principals, or managed identities using Azure role-based access control (RBAC) and the Azure portal.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 8078f366-a2c4-4fbb-a44b-fc39fd89df81
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/25/2019
ms.author: rolyon
ms.reviewer: bagovind
---

# Add or remove role assignments using Azure RBAC and the Azure portal

[!INCLUDE [Azure RBAC definition grant access](../../includes/role-based-access-control-definition-grant.md)] This article describes how to assign roles using the Azure portal.

If you need to assign administrator roles in Azure Active Directory, see [View and assign administrator roles in Azure Active Directory](../active-directory/users-groups-roles/directory-manage-roles-portal.md).

## Prerequisites

To add or remove role assignments, you must have:

- `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner)

## Overview of Access control (IAM)

**Access control (IAM)** is the blade that you use to assign roles. It's also known as identity and access management and appears in several locations in the Azure portal. The following shows an example of the Access control (IAM) blade for a subscription.

![Access control (IAM) blade for a subscription](./media/role-assignments-portal/access-control-subscription.png)

To be the most effective with the Access control (IAM) blade, it helps if you can answer the following three questions when you are trying to assign a role:

1. **Who needs access?**

    Who refers to a user, group, service principal, or managed identity. This is also called a *security principal*.

1. **What role do they need?**

    Permissions are grouped together into roles. You can select from a list of several [built-in roles](built-in-roles.md) or you use your own custom roles.

1. **Where do they need access?**

    Where refers to the set of resources that the access applies to. Where can be a management group, subscription, resource group, or a single resource such as a storage account. This is called the *scope*.

## Add a role assignment

Follow these steps to assign a role at different scopes.

1. In the Azure portal, click **All services** and then select the scope. For example, you can select **Management groups**, **Subscriptions**, **Resource groups**, or a resource.

1. Click the specific resource.

1. Click **Access control (IAM)**.

1. Click the **Role assignments** tab to view all the role assignments at this scope.

1. Click **Add** > **Add role assignment** to open the Add role assignment pane.

   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

   ![Add menu](./media/role-assignments-portal/add-menu.png)

   ![Add role assignment pane](./media/role-assignments-portal/add-role-assignment.png)

1. In the **Role** drop-down list, select a role such as **Virtual Machine Contributor**.

1. In the **Select** list, select a user, group, service principal, or managed identity. If you don't see the security principal in the list, you can type in the **Select** box to search the directory for display names, email addresses, and object identifiers.

1. Click **Save** to assign the role.

   After a few moments, the security principal is assigned the role at the selected scope.

## Assign a user as an administrator of a subscription

To make a user an administrator of an Azure subscription, assign them the [Owner](built-in-roles.md#owner) role at the subscription scope. The Owner role gives the user full access to all resources in the subscription, including the permission to grant access to others. These steps are the same as any other role assignment.

1. In the Azure portal, click **All services** and then **Subscriptions**.

1. Click the subscription where you want to add a role assignment.

1. Click **Access control (IAM)**.

1. Click the **Role assignments** tab to view all the role assignments for this subscription.

1. Click **Add** > **Add role assignment** to open the Add role assignment pane.

   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

   ![Add menu](./media/role-assignments-portal/add-menu.png)

   ![Add role assignment pane](./media/role-assignments-portal/add-role-assignment.png)

1. In the **Role** drop-down list, select the **Owner** role.

1. In the **Select** list, select a user. If you don't see the user in the list, you can type in the **Select** box to search the directory for display names and email addresses.

1. Click **Save** to assign the role.

   After a few moments, the user is assigned the Owner role at the subscription scope.

## Remove a role assignment

In RBAC, to remove access, you remove a role assignment. Follow these steps to remove a role assignment.

1. Open **Access control (IAM)** at a scope, such as management group, subscription, resource group, or resource, where you want to remove access.

1. Click the **Role assignments** tab to view all the role assignments for this subscription.

1. In the list of role assignments, add a checkmark next to the security principal with the role assignment you want to remove.

   ![Remove role assignment message](./media/role-assignments-portal/remove-role-assignment-select.png)

1. Click **Remove**.

   ![Remove role assignment message](./media/role-assignments-portal/remove-role-assignment.png)

1. In the remove role assignment message that appears, click **Yes**.

    Inherited role assignments cannot be removed. If you need to remove an inherited role assignment, you must do it at the scope where the role assignment was created. In the **Scope** column, next to **(Inherited)** there is a link that takes you to the scope where this role was assigned. Go to the scope listed there to remove the role assignment.

   ![Remove role assignment message](./media/role-assignments-portal/remove-role-assignment-inherited.png)

## Next steps

- [List role assignments using Azure RBAC and the Azure portal](role-assignments-list-portal.md)
- [Tutorial: Grant a user access to Azure resources using RBAC and the Azure portal](quickstart-assign-role-user-portal.md)
- [Troubleshoot RBAC for Azure resources](troubleshooting.md)
- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)
