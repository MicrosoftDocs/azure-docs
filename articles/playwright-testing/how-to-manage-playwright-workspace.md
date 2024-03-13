---
title: Manage workspaces
description: Learn how to create and manage Microsoft Playwright Testing workspaces. Use the Playwright portal or Azure portal to manage workspaces.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Manage workspaces in Microsoft Playwright Testing Preview

In this article, you create, view, and delete Microsoft Playwright Testing Preview workspaces. You can access and manage a workspace in the Azure portal or in the Playwright portal.

The following table lists the differences in functionality, based on how you access Microsoft Playwright Testing:

| Functionality | Azure portal | Playwright portal | Learn more |
|-|-|-|-|
| Create a workspace | Yes | Yes | [Quickstart: run Playwright test in the cloud](./quickstart-run-end-to-end-tests.md) |
| View the list of workspaces | Yes | Yes | [View all workspaces](#display-the-list-of-workspaces) |
| View the workspace activity log | No | Yes | [Display activity log](#display-the-workspace-activity-log) |
| Delete a workspace | Yes | Yes | [Delete a workspace](#delete-a-workspace) |
| Configure region affinity | Yes | No | [Configure region affinity](./how-to-optimize-regional-latency.md) |
| Grant or revoke access to a workspace | Yes | No | [Manage workspace access](./how-to-manage-workspace-access.md)|

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a workspace

To get started with running your Playwright tests on cloud browsers, you first create a Microsoft Playwright Testing workspace. You can create a workspace in either the Azure portal or the Playwright portal.

# [Playwright portal](#tab/playwright)

When you create a workspace in the Playwright portal, the service creates a new resource group and a Microsoft Playwright Testing Azure resource in your Azure subscription. The name of the new resource group is based on the workspace name.

[!INCLUDE [Create workspace in Playwright portal](./includes/include-playwright-portal-create-workspace.md)]

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the menu button in the upper-left corner of the portal, and then select **Create a resource** a resource.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal menu to create a new resource." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-create-resource.png":::

1. Enter *Microsoft Playwright Testing* in the search box.
1. Select the **Microsoft Playwright Testing (Preview)** card, and then select **Create**.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-resource.png" alt-text="Screenshot that shows the Azure Marketplace search page with the Microsoft Playwright Testing search result." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-resource.png":::

1. Provide the following information to configure a new Microsoft Playwright Testing workspace:

    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace. |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name to identify your workspace.<BR>The name can only consist of alphanumerical characters, and have a length between 3 and 64 characters. |
    |**Location**     | Select a geographic location to host your workspace. <BR>This location also determines where the test execution results and related artifacts are stored. |

    > [!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Microsoft Playwright Testing workspace.

    When the process has finished, a deployment success message appears.

1. To view the new workspace, select **Go to resource**.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png" alt-text="Screenshot that shows the deployment completion information in the Azure portal." lightbox="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png"::: 

---

## Display the list of workspaces

To get the list of Playwright workspaces that you have access to:

# [Playwright portal](#tab/playwright)

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select your current workspace in the top of the screen, and then select **Manage all workspaces**.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/playwright-portal-manage-all-workspaces.png" alt-text="Screenshot that shows the Playwright portal, highlighting the Manage all workspaces menu item." lightbox="./media/how-to-manage-playwright-workspace/playwright-portal-manage-all-workspaces.png":::

1. On the **Workspaces** page, you can now see all the workspaces that you have access to.

    The page shows a card for each of the workspaces in the currently selected Azure subscription. You can switch to another subscription by selecting a subscription from the list.
    
    :::image type="content" source="./media/how-to-manage-playwright-workspace/playwright-portal-workspaces.png" alt-text="Screenshot that shows the list of all workspaces in the Playwright portal." lightbox="./media/how-to-manage-playwright-workspace/playwright-portal-workspaces.png":::

    > [!TIP]
    > Notice that the workspace card indicates if the workspace is included in a free trial.

1. Select a workspace to view the workspace details and activity log.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the top search field, enter **Microsoft Playwright Testing**.

1. Select **Microsoft Playwright Testing Preview** from the **Services** section to view all your workspaces.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-workspaces.png" alt-text="Screenshot that shows the search box in the Azure portal, to search for Microsoft Playwright Testing resources." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-search-playwright-workspaces.png":::

1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.

1. Select a workspace to display its details.

    You can navigate to the workspace in the Playwright portal by selecting the dashboard URL in the workspace **Overview** page.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-workspace-details-dashboard-url.png" alt-text="Screenshot that shows the workspace Overview page in the Azure portal, highlighting the Playwright portal URL." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-workspace-details-dashboard-url.png":::

---

## Display the workspace activity log

You can view the list of test runs for the workspace in the Playwright portal. Microsoft Playwright Testing only stores test run metadata, and doesn't store the test code, test results, trace files, or other artifacts.

The workspace activity log lists for each test run the following details: 

- Total test duration of the test suite
- Maximum number of parallel browsers
- Total time across all parallel browsers. This is the time  that you're billed for the test run.

To view the list of test runs in the Playwright portal:

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Optionally, switch to another workspace by selecting your current workspace in the top of the screen, and then select **Manage all workspaces**.

1. On the workspace home page, you can view the workspace activity log.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/playwright-testing-activity-log.png" alt-text="Screenshot that shows the activity log for a workspace in the Playwright Testing portal." lightbox="./media/how-to-manage-playwright-workspace/playwright-testing-activity-log.png":::

## Delete a workspace

To delete a Playwright workspace:

# [Playwright portal](#tab/playwright)

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select your current workspace in the top of the screen, and then select **Manage all workspaces**.

1. On the **Workspaces** page, select the ellipsis (**...**) next to your workspace, and then select **Delete workspace**.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/playwright-portal-delete-workspace.png" alt-text="Screenshot that shows the Workspaces page in the Playwright portal, highlighting the Delete workspace menu item." lightbox="./media/how-to-manage-playwright-workspace/playwright-portal-delete-workspace.png":::

1. On the **Delete Workspace** page, select **Delete** to confirm the deletion of the workspace.

    > [!WARNING]
    > Deleting a workspace is an irreversible action. The workspace and the activity log can't be recovered.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Playwright workspace.

1. Select **Delete** to delete the workspace.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/azure-portal-delete-workspace.png" alt-text="Screenshot that shows the delete workspace functionality in the Azure portal." lightbox="./media/how-to-manage-playwright-workspace/azure-portal-delete-workspace.png":::

    > [!WARNING]
    > Deleting a workspace is an irreversible action. The workspace and the activity log can't be recovered.

---

## Related content

- [Optimize regional latency for a workspace](./how-to-optimize-regional-latency.md)

- [Manage workspace access](./how-to-manage-workspace-access.md)

- Get started with [running Playwright tests at scale](./quickstart-run-end-to-end-tests.md)
- Learn more about the [Microsoft Playwright Testing resource limits](./resource-limits-quotas-capacity.md)