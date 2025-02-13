---
title: Quickstart - Check access for a user to a single Azure resource - Azure RBAC
description: In this quickstart, you learn how to check the access for yourself or another user to an Azure resource using the Azure portal and Azure role-based access control (Azure RBAC).
services: role-based-access-control
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.topic: quickstart
ms.date: 12/12/2024
ms.author: rolyon
ms.custom: mode-other
#Customer intent: As a new user, I want to quickly see access for myself, user, group, or application, to make sure they have the appropriate permissions.
---

# Quickstart: Check access for a user to a single Azure resource

Sometimes you need to check what access a user has to an Azure resource. You check their access by listing their assignments. A quick way to check the access for a single user is to use the **Check access** feature on the **Access control (IAM)** page.

## Step 1: Open the Azure resource

To check the access for a user, you first need to open the Azure resource you want to check access for. Azure resources are organized into levels that are typically called the *scope*. In Azure, you can specify a scope at four levels from broad to narrow: management group, subscription, resource group, and resource.

![Diagram that shows scope levels for Azure RBAC.](../../includes/role-based-access-control/media/scope-levels.png)

Follow these steps to open the Azure resource that you want to check access for.

1. Open the [Azure portal](https://portal.azure.com).

1. Open the Azure resource you want to check access for, such as **Management groups**, **Subscriptions**, **Resource groups**, or a particular resource.

1. Select the specific resource in that scope.

    The following shows an example resource group.

    :::image type="content" source="./media/shared/rg-overview.png" alt-text="Screenshot of resource group overview." lightbox="./media/shared/rg-overview.png":::

## Step 2: Check your access

Follow these steps to check your access to the previously selected Azure resource.

If you have a Microsoft Entra ID P2 or Microsoft Entra ID Governance license, [Microsoft Entra Privileged Identity Management (PIM)](/entra/id-governance/privileged-identity-management/pim-configure) functionality is integrated so you should follow the steps on the **PIM** tab.

# [Default](#tab/default)

1. Select **Access control (IAM)**.

    The following shows an example of the Access control (IAM) page for a resource group.

    :::image type="content" source="./media/shared/rg-access-control.png" alt-text="Screenshot of resource group access control and Check access tab." lightbox="./media/shared/rg-access-control.png":::

1. On the **Check access** tab, select the **View my access** button.

    An assignments pane appears that lists your access at this scope and inherited to this scope. Assignments at child scopes aren't listed.

    :::image type="content" source="./media/check-access/rg-check-access-assignments.png" alt-text="Screenshot of role and deny assignments pane." lightbox="./media/check-access/rg-check-access-assignments.png":::

# [PIM](#tab/pim)

1. Select **Access control (IAM)**.

1. On the **Check access** tab, view your role assignments at this scope and inherited to this scope. Assignments at child scopes aren't listed.

    The following shows an example of the Access control (IAM) page for a resource group.


    :::image type="content" source="./media/check-access/rg-access-control-pim.png" alt-text="Screenshot of resource group access control and Check access tab for PIM integration." lightbox="./media/check-access/rg-access-control-pim.png":::

    This page lists any [eligible and time-bound role assignments](pim-integration.md). To activate any eligible role assignments, select **Activate role**. For more information, see [Activate eligible Azure role assignments](./role-assignments-eligible-activate.md).

---

## Step 3: Check access for a user

Follow these steps to check the access for a single user, group, service principal, or managed identity to the previously selected Azure resource.

1. Select **Access control (IAM)**.

1. On the **Check access** tab, select the **Check access** button.

    A **Check access** pane appears.

1. Select **User, group, or service principal**.

1. In the search box, enter a string to search the directory for name or email addresses.

    :::image type="content" source="./media/shared/rg-check-access-select.png" alt-text="Screenshot of Check access select list." lightbox="./media/shared/rg-check-access-select.png":::

1. Select the user to open the **assignments** pane.

    On this pane, you can see the access for the selected user at this scope and inherited to this scope. Assignments at child scopes aren't listed. You see the following assignments:

    - Role assignments added with Azure RBAC.
    - Deny assignments added using Azure Blueprints or Azure managed apps.

    If there are any [eligible or time-bound role assignments](pim-integration.md), you can view these assignments on the **Eligible assignments** tab.

    :::image type="content" source="./media/shared/rg-check-access-assignments-user.png" alt-text="Screenshot of role and deny assignments pane for a user." lightbox="./media/shared/rg-check-access-assignments-user.png":::

## Next steps

> [!div class="nextstepaction"]
> [List Azure role assignments using the Azure portal](role-assignments-list-portal.yml)
