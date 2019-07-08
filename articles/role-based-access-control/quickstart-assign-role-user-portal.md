---
title: Tutorial - Grant a user access to Azure resources using RBAC and the Azure portal | Microsoft Docs
description: Learn how to grant a user access to Azure resources using role-based access control (RBAC) in the Azure portal.
services: role-based-access-control
documentationCenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: role-based-access-control
ms.devlang: ''
ms.topic: tutorial
ms.tgt_pltfrm: ''
ms.workload: identity
ms.date: 02/22/2019
ms.author: rolyon

#Customer intent: As a new user, I want to see how to grant access to resources in the portal, so that I can start granting access to others.

---

# Tutorial: Grant a user access to Azure resources using RBAC and the Azure portal

[Role-based access control (RBAC)](overview.md) is the way that you manage access to Azure resources. In this tutorial, you grant a user access to create and manage virtual machines in a resource group.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant access for a user at a resource group scope
> * Remove access

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a resource group

1. In the navigation list, click **Resource groups**.

1. Click **Add** to open the **Resource group** blade.

   ![Add a new resource group](./media/quickstart-assign-role-user-portal/resource-group.png)

1. For **Resource group name**, enter **rbac-resource-group**.

1. Select a subscription and a location.

1. Click **Create** to create the resource group.

1. Click **Refresh** to refresh the list of resource groups.

   The new resource group appears in your resource groups list.

   ![Resource group list](./media/quickstart-assign-role-user-portal/resource-group-list.png)

## Grant access

In RBAC, to grant access, you create a role assignment.

1. In the list of **Resource groups**, click the new **rbac-resource-group** resource group.

1. Click **Access control (IAM)**.

1. Click the **Role assignments** tab to see the current list of role assignments.

   ![Access control (IAM) blade for resource group](./media/quickstart-assign-role-user-portal/access-control.png)

1. Click **Add** > **Add role assignment** to open the Add role assignment pane.

   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

   ![Add menu](./media/role-assignments-portal/add-menu.png)

   ![Add role assignment pane](./media/quickstart-assign-role-user-portal/add-role-assignment.png)

1. In the **Role** drop-down list, select **Virtual Machine Contributor**.

1. In the **Select** list, select yourself or another user.

1. Click **Save** to create the role assignment.

   After a few moments, the user is assigned the Virtual Machine Contributor role at the rbac-resource-group resource group scope.

   ![Virtual Machine Contributor role assignment](./media/quickstart-assign-role-user-portal/vm-contributor-assignment.png)

## Remove access

In RBAC, to remove access, you remove a role assignment.

1. In the list of role assignments, add a checkmark next to the user with the Virtual Machine Contributor role.

1. Click **Remove**.

   ![Remove role assignment message](./media/quickstart-assign-role-user-portal/remove-role-assignment.png)

1. In the remove role assignment message that appears, click **Yes**.

## Clean up

1. In the navigation list, click **Resource groups**.

1. Click **rbac-resource-group** to open the resource group.

1. Click **Delete resource group** to delete the resource group.

   ![Delete resource group](./media/quickstart-assign-role-user-portal/delete-resource-group.png)

1. On the **Are you sure you want to delete** blade, type the resource group name: **rbac-resource-group**.

1. Click **Delete** to delete the resource group.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant a user access to Azure resources using RBAC and Azure PowerShell](tutorial-role-assignments-user-powershell.md)

