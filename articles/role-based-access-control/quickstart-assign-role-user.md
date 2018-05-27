---
title: Quickstart - Use RBAC to assign a role to a user in the Azure portal | Microsoft Docs
description: Use role-based access control (RBAC) to grant permissions to a user by assigning a role in the Azure portal.
services: role-based-access-control
documentationCenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: role-based-access-control
ms.devlang: ''
ms.topic: quickstart
ms.tgt_pltfrm: ''
ms.workload: identity
ms.date: 04/26/2018
ms.author: rolyon

#Customer intent: As a new user, I want to see how to grant access to resources in the portal, so that I can start granting access to others.

---

# Quickstart: Assign a role to a user in the Azure Portal

Role-based access control (RBAC) is the way that you control access to resources in Azure. In this quickstart, you will grant a user access to manage virtual machines in a resource group, but not have access to the virtual machines.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at http://portal.azure.com.

## Create a resource group

1. In the navigation list, choose **Resource groups**.

1. Choose **Add** to open the **Resource group** blade.

   ![Add a new resource group](./media/quickstart-assign-role-user/resource-group.png)

1. For **Resource group name**, enter **rbac-quickstart-resource-group**.

1. Select a subscription and a location.

1. Choose **Create** to create the resource group.

1. Choose **Refresh** to refresh the list of resource groups.

   The new resource group appears in your resource groups list.

   ![Resource group list](./media/quickstart-assign-role-user/resource-group-list.png)

## Grant access

In RBAC, to grant access, you create a role assignment.

1. In the list of **Resource groups**, choose the new **rbac-quickstart-resource-group** resource group.

1. Choose **Access control (IAM)** to see the current list of role assignments.

   ![Access control (IAM) blade for resource group](./media/quickstart-assign-role-user/access-control.png)

1. Choose **Add** to open the **Add permissions** pane.

   If you don't have permissions to assign roles, you won't see the **Add** option.

   ![Add permissions pane](./media/quickstart-assign-role-user/add-permissions.png)

1. In the **Role** drop-down list, select **Virtual Machine Contributor**.

1. In the **Select** list, select yourself or another user.

1. Choose **Save** to create the role assignment.

   After a few moments, the user is assigned the Virtual Machine Contributor role for the rbac-quickstart-resource-group resource group.

   ![Virtual Machine Contributor role assignment](./media/quickstart-assign-role-user/vm-contributor-assignment.png)

## Remove access

In RBAC, to remove access, you remove a role assignment.

1. In the list of role assignments, add a checkmark next to user with the Virtual Machine Contributor role.

1. Choose **Remove**.

   ![Remove role assignment message](./media/quickstart-assign-role-user/remove-role-assignment.png)

1. In the remove role assignment message that appears, choose **Yes**.

## Clean up

1. In the navigation list, choose **Resource groups**.

1. Add a checkmark next to **rbac-quickstart-resource-group**.

1. At the end of the row, choose the ellipsis (**...**) to open the context menu and then choose **Delete resource group**.

   ![Delete resource group context menu](./media/quickstart-assign-role-user/delete-resource-group-context.png)

1. On the **Are you sure you want to delete** blade, type the resource group name: **rbac-quickstart-resource-group**.

1. Choose **Delete** to delete the resource group.

## Next steps

> [!div class="nextstepaction"]
> [Assign a role to a user using PowerShell](tutorial-role-assignments-user-powershell.md)

