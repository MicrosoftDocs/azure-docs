---
title: Manage workspaces
titleSuffix: Playwright Workspaces
description: Learn how to create and manage Playwright Workspaces using the Azure portal.
ms.topic: how-to
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: johnsta
ms.author: johnsta
ms.date: 08/07/2025
ms.custom: playwright-workspaces
---

# Manage Playwright Workspaces

In this article, you learn how to create, view, and delete Playwright workspaces using the Azure portal.

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create a workspace

To connect with cloud browsers, you first need to create a Playwright workspace.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the menu button in the upper-left corner of the portal, and then select **Create a resource** a resource.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal menu to create a new resource." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-create-resource.png":::

1. Enter *Playwright Workspaces* in the search box.
1. Select the **Playwright Workspaces** card, and then select **Create**.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-resource.png" alt-text="Screenshot that shows the Azure Marketplace search page with the Playwright Workspaces search result." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-resource.png":::

1. Provide the following information to configure a new Playwright workspace:

    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Playwright workspace. |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name to identify your workspace.<BR>The name can only consist of alphanumerical characters, and have a length between 3 and 64 characters. |
    |**Location**     | Select a geographic location to host your workspace. |

    > [!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Playwright workspace.

    When the process has finished, a deployment success message appears.

1. To view the new workspace, select **Go to resource**.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png" alt-text="Screenshot that shows the deployment completion information in the Azure portal." lightbox="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png":::

## Display a list of workspaces

To get the list of Playwright workspaces that you have access to:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the top search field, enter **Playwright Workspaces**.

1. Select **Playwright Workspaces** from the **Services** section to view all your workspaces.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-workspaces.png" alt-text="Screenshot that shows the search box in the Azure portal, to search for Playwright Workspaces resources." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-workspaces.png":::
    

1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.

1. Select a workspace to display its details.

## Delete a workspace

To delete a Playwright workspace:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Playwright workspace.

1. Select **Delete** to delete the workspace.

    > [!WARNING]
    > Deleting a workspace is an irreversible action. The workspace and the activity log can't be recovered.

## Related content

- [Optimize regional latency for a workspace](./how-to-optimize-regional-latency.md)

- [Manage workspace access](./how-to-manage-workspace-access.md)

- Get started with [running Playwright tests at scale](./quickstart-run-end-to-end-tests.md)
- Learn more about the [Playwright Workspaces resource limits](./resource-limits-quotas-capacity.md)
