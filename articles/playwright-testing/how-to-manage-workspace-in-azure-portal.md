---
title: Manage workspaces in Azure portal
titleSuffix: Microsoft Playwright Testing
description: Learn how to create and manage Microsoft Playwright Testing workspaces in the Azure portal.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 08/18/2022
---

# Manage Microsoft Playwright Testing Preview workspaces in the Azure portal

In this article, you create, view, and delete Microsoft Playwright Testing Preview workspaces, using the Azure portal.

You can also [manage workspaces in the Playwright dashboard](./how-to-manage-workspace-in-azure-portal.md).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a workspace

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

## Find a workspace

To see the list of Playwright workspaces:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the top search field, type **Microsoft Playwright Testing**.
1. Select **Microsoft Playwright Testing**.
    <!-- TODO: add screenshot of search in portal -->
1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.
1. Select a workspace to display its properties.

## Delete a workspace

To delete a Playwright workspace in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your Playwright workspace.
1. Select **Delete** to delete the workspace.

    :::image type="content" source="./media/how-to-manage-workspace-in-azure-portal/azure-portal-delete-workspace.png" alt-text="Screenshot that shows the delete workspace functionality in the Azure portal.":::

    > [!WARNING]
    > Once a Microsoft Playwright Testing workspace has been deleted, it cannot be recovered.
    
## Next steps

- Learn how to [Identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md)
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn how to [Run existing Playwright tests in the cloud](./how-to-run-with-playwright-testing.md).
