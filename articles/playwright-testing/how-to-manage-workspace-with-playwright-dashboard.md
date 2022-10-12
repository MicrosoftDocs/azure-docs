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

In this article, you create, view, and delete Microsoft Playwright Testing Preview workspaces, using the Playwright dashboard.

If you prefer using the Azure portal, you can also [manage workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your user account has the contributor role in the Azure subscription. You require permissions to create a resource group and a Microsoft Playwright Testing workspace.

## Create a workspace

1. Sign in to the [Playwright dashboard](https://17157345.playwright-int.io/).
1. Select **Menu > Create a new Workspace** in the upper-right corner.

    :::image type="content" source="./media/how-to-manage-workspace-with-playwright-dashboard/playwright-dashboard-create-new-workspace-menu.png" alt-text="Screenshot that shows the menu to create a new workspace in the Playwright dashboard.":::

1. On the **Create a Playwright Testing Workspace** page, provide the following information to configure a new Microsoft Playwright Testing workspace:

    |Field  |Description  |
    |---------|---------|
    |**Azure Subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace.<BR>If you've recently created a new Azure subscription, or you were granted access to a subscription, select **Refresh** to refresh the list of subscriptions. |
    |**Workspace Name**     | Enter a unique name to identify your workspace. |
    |**Region**     | Select a geographic location to host your workspace. <BR>This location also determines where the test execution results and related artifacts are stored. |

1. Select **Create Workspace** to create the workspace in your Azure subscription.

    :::image type="content" source="./media/how-to-manage-workspace-with-playwright-dashboard/playwright-dashboard-create-new-workspace.png" alt-text="Screenshot that shows the page to enter the details for creating a new workspace in the Playwright dashboard.":::

    > [!NOTE]
    > Microsoft Playwright Testing creates both a resource group and a workspace in your Azure subscription. Then name of the resource group follows this naming convention: `<workspace name>-rg`.

1. After the workspace creation completes, you'll navigate to the workspace **Getting started** page.

    You can now use the workspace to run your Playwright tests. To get started:
    
    - Follow the steps in the **Getting started** page.
    - [Quickstart: run a sample Playwright test suite at scale](./quickstart-run-end-to-end-tests.md).
    - [Run existing Playwright tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).

## Switch to another workspace

1. Sign in to the [Playwright dashboard](https://17157345.playwright-int.io/).
1. Select **Menu > Switch Workspace** in the upper-right corner.
1. Select a workspace from the list of workspaces you have access to.
1. You'll navigate to the workspace dashboard.

## Delete a workspace

Use the Azure portal to delete a Playwright workspace. Follow these steps to [delete your workspace](./how-to-manage-workspace-in-azure-portal.md#delete-a-workspace).

  > [!WARNING]
  > Once a Microsoft Playwright Testing workspace is deleted, it cannot be recovered.
    
## Next steps

- Learn how to [Identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md)
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn how to [Run existing Playwright tests in the cloud](./how-to-run-with-playwright-testing.md).
