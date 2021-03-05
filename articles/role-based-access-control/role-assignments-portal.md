---
title: Assign Azure roles using the Azure portal - Azure RBAC
description: Learn how to grant access to Azure resources for users, groups, service principals, or managed identities using the Azure portal and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: daveba
ms.service: role-based-access-control
ms.topic: how-to
ms.workload: identity
ms.date: 02/15/2021
ms.author: rolyon
ms.custom: contperf-fy21q3-portal
---

# Assign Azure roles using the Azure portal

[!INCLUDE [Azure RBAC definition grant access](../../includes/role-based-access-control/definition-grant.md)] This article describes how to assign roles using the Azure portal.

If you need to assign administrator roles in Azure Active Directory, see [View and assign administrator roles in Azure Active Directory](../active-directory/roles/manage-roles-portal.md).

## Prerequisites

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

## Step 1: Identify the needed scope

[!INCLUDE [Scope for Azure RBAC introduction](../../includes/role-based-access-control/scope-intro.md)]

[!INCLUDE [Scope for Azure RBAC least privilege](../../includes/role-based-access-control/scope-least.md)] For more information about scope, see [Understand scope](scope-overview.md).

![Scope levels for Azure RBAC](../../includes/role-based-access-control/media/scope-levels.png)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Search box at the top, search for the scope you want to grant access to. For example, search for **Management groups**, **Subscriptions**, **Resource groups**, or a specific resource.

    ![Azure portal search for resource group](./media/shared/rg-portal-search.png)

1. Click the specific resource for that scope.

    The following shows an example resource group.

    ![Resource group overview](./media/shared/rg-overview.png)

## Step 2: Open the Add role assignment pane

**Access control (IAM)** is the page that you typically use to assign roles to grant access to Azure resources. It's also known as identity and access management (IAM) and appears in several locations in the Azure portal.

1. Click **Access control (IAM)**.

    The following shows an example of the Access control (IAM) page for a resource group.

    ![Access control (IAM) page for a resource group](./media/shared/rg-access-control.png)

1. Click the **Role assignments** tab to view the role assignments at this scope.

1. Click **Add** > **Add role assignment**.
   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

   ![Add role assignment menu](./media/shared/add-role-assignment-menu.png)

    The Add role assignment pane opens.

   ![Add role assignment pane](./media/shared/add-role-assignment.png)

## Step 3: Select the appropriate role

1. In the **Role** list, search or scroll to find the role that you want to assign.

    To help you determine the appropriate role, you can hover over the info icon to display a description for the role. For additional information, you can view the [Azure built-in roles](built-in-roles.md) article.

   ![Select role in Add role assignment](./media/role-assignments-portal/add-role-assignment-role.png)

1. Click to select the role.

## Step 4: Select who needs access

1. In the **Assign access to** list, select the type of security principal to assign access to.

    | Type | Description |
    | --- | --- |
    | **User, group, or service principal** | If you want to assign the role to a user, group, or service principal (application), select this type. |
    | **User assigned managed identity** | If you want to assign the role to a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md), select this type. |
    | *System assigned managed identity* | If you want to assign the role to a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md), select the Azure service instance where the managed identity is located. |

   ![Select security principal type in Add role assignment](./media/role-assignments-portal/add-role-assignment-type.png)

1. If you selected a user-assigned managed identity or a system-assigned managed identity, select the **Subscription** where the managed identity is located.

1. In the **Select** section, search for the security principal by entering a string or scrolling through the list.

   ![Select user in Add role assignment](./media/role-assignments-portal/add-role-assignment-user.png)

1. Once you have found the security principal, click to select it.

## Step 5: Assign role

1. To assign the role, click **Save**.

   After a few moments, the security principal is assigned the role at the selected scope.

1. On the **Role assignments** tab, verify that you see the role assignment in the list.

    ![Add role assignment saved](./media/role-assignments-portal/rg-role-assignments.png)

## Next steps

- [Assign a user as an administrator of an Azure subscription](role-assignments-portal-subscription-admin.md)
- [Remove Azure role assignments](role-assignments-remove.md)
- [Troubleshoot Azure RBAC](troubleshooting.md)
