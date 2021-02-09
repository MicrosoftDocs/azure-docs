---
title: Quickstart - Check access for a user to Azure resources - Azure RBAC
description: In this quickstart, you learn how to check the access for yourself or another user to Azure resources using the Azure portal and Azure role-based access control (Azure RBAC).
services: role-based-access-control
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.topic: quickstart
ms.workload: identity
ms.date: 12/09/2020
ms.author: rolyon
ms.custom: contperf-fy21q2

#Customer intent: As a new user, I want to quickly see access for myself, user, group, or application, to make sure they have the appropriate permissions.

---

# Quickstart: Check access for a user to Azure resources

Sometimes you need to check what access a user has to a set of Azure resources. You check their access by listing their assignments. A quick way to check the access for a single user is to use the **Check access** feature on the **Access control (IAM)** page.

## Step 1: Open the Azure resources

To check the access for a user, you first need to open the Azure resources you want to check access for. Azure resources are organized into levels that are typically called the *scope*. In Azure, you can specify a scope at four levels from broad to narrow: management group, subscription, resource group, and resource.

![Scope levels for Azure RBAC](../../includes/role-based-access-control/media/scope-levels.png)

Follow these steps to open the set of Azure resources that you want to check access for.

1. Open the [Azure portal](https://portal.azure.com).

1. Open the set of Azure resources, such as **Management groups**, **Subscriptions**, **Resource groups**, or a particular resource.

1. Click the specific resource in that scope.

    The following shows an example resource group.

    ![Resource group overview](./media/shared/rg-overview.png)

## Step 2: Check access for a user

Follow these steps to check the access for a single user, group, service principal, or managed identity to the previously selected Azure resources.

1. Click **Access control (IAM)**.

    The following shows an example of the Access control (IAM) page for a resource group.

    ![Resource group access control - Check access tab](./media/shared/rg-access-control.png)

1. On the **Check access** tab, in the **Find** list, select the user, group, service principal, or managed identity you want to check access for.

1. In the search box, enter a string to search the directory for display names, email addresses, or object identifiers.

    ![Check access select list](./media/shared/rg-check-access-select.png)

1. Click the security principal to open the **assignments** pane.

    On this pane, you can see the access for the selected security principal at this scope and inherited to this scope. Assignments at child scopes are not listed. You see the following assignments:

    - Role assignments added with Azure RBAC.
    - Deny assignments added using Azure Blueprints or Azure managed apps.
    - Classic Service Administrator or Co-Administrator assignments for classic deployments. 

    ![Role and deny assignments pane for a user](./media/shared/rg-check-access-assignments-user.png)

## Step 3: Check your access

Follow these steps to check your access to the previously selected Azure resources.

1. Click **Access control (IAM)**.

1. On the **Check access** tab, click the **View my access** button.

    An assignments pane appears that lists your access at this scope and inherited to this scope. Assignments at child scopes are not listed.

    ![Role and deny assignments pane](./media/check-access/rg-check-access-assignments.png)

## Next steps

> [!div class="nextstepaction"]
> [List Azure role assignments using the Azure portal](role-assignments-list-portal.md)
