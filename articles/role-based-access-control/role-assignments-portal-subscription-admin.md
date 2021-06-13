---
title: Assign a user as an administrator of an Azure subscription - Azure RBAC
description: Learn how to make a user an administrator of an Azure subscription using the Azure portal and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.topic: how-to
ms.workload: identity
ms.date: 01/11/2021
ms.author: rolyon
---

# Assign a user as an administrator of an Azure subscription

To make a user an administrator of an Azure subscription, assign them the [Owner](built-in-roles.md#owner) role at the subscription scope. The Owner role gives the user full access to all resources in the subscription, including the permission to grant access to others. These steps are the same as any other role assignment.

## Prerequisites

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

## Step 1: Open the subscription

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Search box at the top, search for subscriptions.

    ![Azure portal search for resource group](./media/shared/sub-portal-search.png)

1. Click the subscription you want to use.

    The following shows an example subscription.

    ![Resource group overview](./media/shared/sub-overview.png)

## Step 2: Open the Add role assignment pane

**Access control (IAM)** is the page that you typically use to assign roles to grant access to Azure resources. It's also known as identity and access management (IAM) and appears in several locations in the Azure portal.

1. Click **Access control (IAM)**.

    The following shows an example of the Access control (IAM) page for a subscription.

    ![Access control (IAM) page for a resource group](./media/shared/sub-access-control.png)

1. Click the **Role assignments** tab to view the role assignments at this scope.

1. Click **Add** > **Add role assignment**.
   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

   ![Add role assignment menu](./media/shared/add-role-assignment-menu.png)

    The Add role assignment pane opens.

   ![Add role assignment pane](./media/shared/add-role-assignment.png)

## Step 3: Select the Owner role

The [Owner](built-in-roles.md#owner) role grant full access to manage all resources, including the ability to assign roles in Azure RBAC. You should have a maximum of 3 subscription owners to reduce the potential for breach by a compromised owner.

- In the **Role** list, select the **Owner** role.

   ![Select Owner role in Add role assignment pane](./media/role-assignments-portal-subscription-admin/add-role-assignment-role-owner.png)

## Step 4: Select who needs access

1. In the **Assign access to** list, select **User, group, or service principal**.

1. In the **Select** section, search for the user by entering a string or scrolling through the list.

   ![Select user in Add role assignment](./media/role-assignments-portal-subscription-admin/add-role-assignment-user-admin.png)

1. Once you have found the user, click to select it.

## Step 5: Assign role

1. To assign the role, click **Save**.

   After a few moments, the user is assigned the role at the selected scope.

1. On the **Role assignments** tab, verify that you see the role assignment in the list.

    ![Add role assignment saved](./media/role-assignments-portal-subscription-admin/sub-role-assignments-owner.png)

## Next steps

- [Assign Azure roles using the Azure portal](role-assignments-portal.md)
- [List Azure role assignments using the Azure portal](role-assignments-list-portal.md)
- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)
