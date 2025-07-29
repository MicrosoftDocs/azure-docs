---
title: "Tutorial: Grant a user access to Azure resources using the Azure portal - Azure RBAC"
description: In this tutorial, learn how to grant a user access to Azure resources using the Azure portal and Azure role-based access control (Azure RBAC).
services: role-based-access-control
author: jenniferf-skc
manager: pmwongera
ms.service: role-based-access-control
ms.topic: tutorial
ms.date: 03/30/2025
ms.author: jfields
ms.custom: subject-rbac-steps
#Customer intent: As a new user, I want to see how to grant access to resources in the portal, so that I can start granting access to others.
---

# Tutorial: Grant a user access to Azure resources using the Azure portal

[Azure role-based access control (Azure RBAC)](overview.md) is the way that you manage access to Azure resources. In this tutorial, you grant a user access to create and manage virtual machines in a resource group.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant access for a user at a resource group scope
> * Remove access

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a resource group

1. In the navigation list, select **Resource groups**.

1. Select **New** to open the **Create a resource group** page.

    :::image type="content" source="./media/quickstart-assign-role-user-portal/resource-group.png" alt-text="Screenshot of Create a new resource group page." lightbox="./media/quickstart-assign-role-user-portal/resource-group.png":::

1. Select a subscription.

1. For **Resource group** name, enter **example-group** or another name.

1. Select **Review + create** and then select **Create** to create the resource group.

1. Select **Refresh** to refresh the list of resource groups.

   The new resource group appears in your resource groups list.

## Grant access

In Azure RBAC, to grant access, you assign an Azure role.

1. In the list of **Resource groups**, open the new **example-group** resource group.

1. In the navigation menu, select **Access control (IAM)**.

1. Select the **Role assignments** tab to see the current list of role assignments.

    :::image type="content" source="./media/shared/rg-role-assignments.png" alt-text="Screenshot of Access control (IAM) page for resource group." lightbox="./media/shared/rg-role-assignments.png":::

1. Select **Add** > **Add role assignment**.

   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot of Access control (IAM) page with Add role assignment menu open." lightbox="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png":::

1. On the **Role** tab, select the **Virtual Machine Contributor** role.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-role-generic.png" alt-text="Screenshot of Add role assignment page with Role tab selected." lightbox="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-role-generic.png":::

1. On the **Members** tab, select yourself or another user.

1. On the **Review + assign** tab, review the role assignment settings.

1. Select **Review + assign** to assign the role.

   After a few moments, the user is assigned the Virtual Machine Contributor role at the example-group resource group scope.

    :::image type="content" source="./media/quickstart-assign-role-user-portal/vm-contributor-assignment.png" alt-text="Screenshot of Virtual Machine Contributor role assignment." lightbox="./media/quickstart-assign-role-user-portal/vm-contributor-assignment.png":::

## Remove access

In Azure RBAC, to remove access, you remove a role assignment.

1. In the list of role assignments, add a checkmark next to the user with the Virtual Machine Contributor role.

1. Select **Remove**.

    :::image type="content" source="./media/quickstart-assign-role-user-portal/remove-role-assignment.png" alt-text="Screenshot of Remove role assignments message." lightbox="./media/quickstart-assign-role-user-portal/remove-role-assignment.png":::

1. In the remove role assignment message that appears, select **Yes**.

## Clean up

1. In the navigation list, select **Resource groups**.

1. Select **example-group** to open the resource group.

1. Select **Delete resource group** to delete the resource group.

1. On the **Are you sure you want to delete** pane, type the resource group name and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant a user access to Azure resources using Azure PowerShell](tutorial-role-assignments-user-powershell.md)
