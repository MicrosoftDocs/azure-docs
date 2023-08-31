---
title: Manage workspaces
description: Learn how to create and manage Microsoft Playwright Testing workspaces. Use the Playwright portal or Azure portal to manage workspaces.
ms.topic: how-to
ms.date: 08/29/2023
ms.custom: playwright-testing-preview
---

# Manage workspaces in Microsoft Playwright Testing Preview

In this article, you create, view, and delete Microsoft Playwright Testing Preview workspaces. You can access and manage a workspace in the Azure portal or in the Playwright portal.

The following table lists the differences in functionality, based on how you access Microsoft Playwright Testing:

| Functionality | Azure portal | Playwright portal | Learn more |
|-|-|-|-|
| Create a workspace | Yes | Yes | [Quickstart: run Playwright test in the cloud](./quickstart-run-end-to-end-tests.md) |
| View the list of workspaces | Yes | Yes | [View all workspaces](#view-the-list-of-workspaces) |
| View the workspace details | Yes | Yes | [View workspace details](#view-workspace-details) |
| Delete a workspace | Yes | Yes | [Delete a workspace](#delete-a-workspace) |
| Configure region affinity | Yes | No | [Configure region affinity](./how-to-configure-region-affinity.md) |
| Grant or revoke access to a workspace | Yes | No | [Manage workspace access](./how-to-manage-workspace-access.md)|

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a workspace

# [Playwright portal](#tab/playwright)

# [Azure portal](#tab/portal)

<!-- 
1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the menu button in the upper-left corner of the portal, and then select **Create a resource** a resource.

    :::image type="content" source="./media/how-to-manage-workspace-in-azure-portal/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal menu to create a new resource.":::

1. Enter *Microsoft Playwright Testing* in the search box.
1. Select **Microsoft Playwright Testing (Preview)**.

    :::image type="content" source="./media/how-to-manage-workspace-in-azure-portal/azure-portal-search-playwright-resource.png" alt-text="Screenshot that shows the Azure Marketplace search page with the Microsoft Playwright Testing search result.":::

1. On the Microsoft Playwright Testing page, select **Create**.
1. Provide the following information to configure a new Microsoft Playwright Testing workspace:

    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace. |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name to identify your workspace.<BR>The name can't contain special characters, such as \\/""[]:\|<>+=;,?*@&, or whitespace. |
    |**Location**     | Select a geographic location to host your workspace. <BR>This location also determines where the test execution results and related artifacts are stored. |

    >[!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Microsoft Playwright Testing workspace.

    When the process has finished, a deployment success message appears.

1. To view the new workspace, select **Go to resource**.

    :::image type="content" source="./media/how-to-manage-workspace-in-azure-portal/create-resource-deployment-complete.png" alt-text="Screenshot that shows the deployment completion information in the Azure portal."::: 
-->

---

## View the list of workspaces

To see the list of Playwright workspaces you have access to:

# [Playwright portal](#tab/playwright)

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the top search field, type **Microsoft Playwright Testing**.
1. Select **Microsoft Playwright Testing**.
1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.
1. Select a workspace to display its details.

---

## View workspace details

# [Playwright portal](#tab/playwright)

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/), and search for your workspace.
1. Select the workspace to display its details.

---

## Delete a workspace

To delete a Playwright workspace:

# [Playwright portal](#tab/playwright)

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your Playwright workspace.
1. Select **Delete** to delete the workspace.

    :::image type="content" source="./media/how-to-manage-workspace-in-azure-portal/azure-portal-delete-workspace.png" alt-text="Screenshot that shows the delete workspace functionality in the Azure portal.":::

    > [!WARNING]
    > Once a Microsoft Playwright Testing workspace has been deleted, it cannot be recovered.

---

## Related content

- [Configure region affinity for a workspace](./how-to-configure-region-affinity.md)
- [Manage workspace access](./how-to-manage-workspace-access.md)
- [Manage access keys for a workspace](./how-to-manage-access-keys.md)