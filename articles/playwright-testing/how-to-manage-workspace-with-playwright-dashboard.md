---
title: Manage workspaces in Playwright dashboard
titleSuffix: Microsoft Playwright Testing
description: Learn how to create and manage Microsoft Playwright Testing workspaces in the Playwright dashboard.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 10/12/2022
---

# Manage Microsoft Playwright Testing Preview workspaces in the Playwright dashboard

In this article, you learn how to manage Microsoft Playwright Testing Preview workspaces by using the Playwright dashboard. You use a workspace to run and analyze your Playwright tests in the cloud.

You can also [manage Microsoft Playwright Testing workspaces by using the Azure portal](./how-to-manage-workspace-in-azure-portal.md).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The [contributor](/azure/role-based-access-control/built-in-roles#contributor) role assigned to your user account in the Azure subscription.

## Create a workspace

To get started with Microsoft Playwright Testing, you first create a workspace. You can then [create an access key](./how-to-manage-access-keys.md) to authenticate with the service and run your Playwright tests.

When you create a workspace in the Playwright dashboard, the service creates two resources in the Azure subscription:

- An Azure resource group. The name of the resource group follows this naming convention: `<workspace name>-rg`.
- A Microsoft Playwright Testing workspace. The workspace is automatically added to the Azure resource group that was created earlier.

To create a workspace in the Playwright dashboard:

1. Sign in to the [Playwright dashboard](https://17157345.playwright-int.io/).
1. Select **Menu > Create a new Workspace** in the upper-right corner.

    :::image type="content" source="./media/how-to-manage-workspace-with-playwright-dashboard/playwright-dashboard-create-new-workspace-menu.png" alt-text="Screenshot that shows the menu to create a new workspace in the Playwright dashboard.":::

1. On the **Create a Playwright Testing Workspace** page, provide the following information:

    |Field  |Description  |
    |---------|---------|
    |**Azure Subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace.<BR>If you've recently created a new Azure subscription, or you were granted access to a subscription, select **Refresh** to refresh the list of subscriptions. |
    |**Workspace Name**     | Enter a unique name to identify your workspace. |
    |**Region**     | Select a geographic location to host your workspace. <BR>This location also determines where the test results and related artifacts are stored. |

1. Select **Create Workspace** to create the workspace in your Azure subscription.

    :::image type="content" source="./media/how-to-manage-workspace-with-playwright-dashboard/playwright-dashboard-create-new-workspace.png" alt-text="Screenshot that shows the page to enter the details for creating a new workspace in the Playwright dashboard.":::

1. After the workspace creation completes, you'll navigate to the workspace **Getting started** page.

You can now use the workspace to run your Playwright tests. To get started:

- Follow the steps on the **Getting started** page.
- [Quickstart: run a sample Playwright test suite at scale](./quickstart-run-end-to-end-tests.md).
- [Run existing Playwright tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).

## Switch to another workspace

You can switch to another workspace at any time. The list of workspaces is filtered to only the workspaces you have access to. If you can't find a workspace, see how to [manage access to a Microsoft Playwright Testing workspace](./how-to-assign-roles.md).

To select another workspace in the Playwright dashboard:

1. Sign in to the [Playwright dashboard](https://17157345.playwright-int.io/).
1. Select **Menu > Switch Workspace** in the upper-right corner.

    :::image type="content" source="./media/how-to-manage-workspace-with-playwright-dashboard/playwright-dashboard-switch-workspace-menu.png" alt-text="Screenshot that shows the menu to switch to a workspace in the Playwright dashboard.":::

1. Select a workspace from the list of workspaces. You only see the workspaces you have access to.
1. You'll navigate to the selected workspace dashboard.

## Delete a workspace

To remove a workspace, follow these steps to [delete a workspace by using the Azure portal](./how-to-manage-workspace-in-azure-portal.md#delete-a-workspace).

> [!WARNING]
> Once a Microsoft Playwright Testing workspace is deleted, it cannot be recovered.
    
## Next steps

- Learn how to [identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md)
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn how to [run existing Playwright tests in the cloud](./how-to-run-with-playwright-testing.md).
