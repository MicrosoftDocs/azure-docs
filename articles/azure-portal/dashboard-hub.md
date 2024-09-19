---
title: Create and manage dashboards in Dashboard hub
description: This article describes how to create and customize a shared dashboard in Dashboard hub in the Azure portal.
ms.topic: how-to
ms.date: 08/28/2024
---

# Create and manage dashboards in Dashboard hub (preview)

Dashboards are a focused and organized view of your cloud resources in the Azure portal. The new Dashboard hub (preview) experience offers editing features such as tabs, a rich set of tiles with support for different data sources, and dashboard access in the latest version of the [Azure mobile app](mobile-app/overview.md).

Currently, Dashboard hub can only be used to create and manage shared dashboards. These shared dashboards are implemented as Azure resources in your subscription. They're visible in the Azure portal or the Azure mobile app, to all users who have subscription-level access.

> [!IMPORTANT]
> Dashboard hub is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Current limitations

Before using the new Dashboard hub experience, be aware of the following current limitations and make sure that your new dashboard meets your organization's needs.

Private dashboards aren't currently supported in Dashboard hub. These dashboards are shared with all users in a subscription by default. To create a private dashboard, or to share it with only a limited set of users, create your dashboard [from the **Dashboard** view in the Azure portal](azure-portal-dashboards.md) rather than using the new experience.

Some tiles aren't yet available in the Dashboard hub experience. Currently, the following tiles are available:

- **Azure Resource Graph query**
- **Metrics**
- **Resource**
- **Resource Group**
- **Recent Resources**
- **All Resources**
- **Markdown**
- **Policy**

If your dashboard relies on one of these tiles, we recommend that you don't use the new experience for that dashboard at this time. We'll update this page as we add more tile types to the new experience.

## Create a new dashboard

To create a new shared dashboard with an assigned name, follow these steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Dashboard hub** and then select it.

1. Under **Dashboards (preview)**, select **Shared dashboards**. Then select **Create**.

   :::image type="content" source="media/dashboard-hub/dashboard-hub-create.png" alt-text="Screenshot of the Create option in the Dashboard hub.":::

   You'll see an empty dashboard with a grid where you can arrange tiles.

1. If you want to use a template to create your dashboard, select **Select Templates**, then choose an available template to start from. Enter a name and any other applicable information. For example, if you select **SQL database health**, you'll need to specify a SQL database resource. When you're finished, select **Submit**.

1. If you aren't using a template, or if you want to add more tiles, select **Add tile** to open the **Tile Gallery**. The **Tile Gallery** features various tiles that display different types of information. Select a tile, then select **Add**. You can also drag tiles from the **Tile Gallery** onto your grid. Resize or rearrange the tiles as desired.

1. If you haven't already provided a name, or want to change what you entered, select **Rename dashboard** to enter a name that will help you easily identify your dashboard.

   :::image type="content" source="media/dashboard-hub/dashboard-hub-rename.png" alt-text="Screenshot showing a dashboard being renamed in the Dashboard hub.":::

1. When you're finished, select **Publish dashboardV2** in the command bar.

1. Select the subscription and resource group to which the dashboard will be saved.
1. Enter a name for the dashboard. This name is used for the dashboard resource in Azure, and it can't be changed after publishing. However, you can edit the displayed title of the dashboard later.
1. Select **Submit**.

You'll see a notification confirming that your dashboard has been published. You can continue to [edit your dashboard](#edit-a-dashboard) as needed.

> [!IMPORTANT]
> Since all dashboards in the new experience are shared by default, anyone with access to the subscription will have access to the dashboard resource. For more access control options, see [Understand access control](#understand-access-control).

## Create a dashboard based on an existing dashboard

To create a new shared dashboard with an assigned name, based on an existing dashboard, follow these steps.

> [!TIP]
> Review the [current limitations ](#current-limitations) before you proceed. If your dashboard includes tiles that aren't currently supported in the new experience, you can still create a new dashboard based on the original one. However, any tiles that aren't yet available won't be included.

1. Navigate to the dashboard that you want to start with. You can do this by selecting **Dashboard** from the Azure menu, then selecting the dashboard that you wish to start with. Alternately, in the new Dashboard hub, expand **Dashboards** and then select either **Private dashboards** or **Shared dashboards** to find your dashboard.
1. From the Select **Try it now**.

   :::image type="content" source="media/dashboard-hub/dashboard-try-it-now.png" alt-text="Screenshot showing the Try it now link for a dashboard.":::

   The dashboard opens in the new Dashboard hub editing experience. Follow the process described in the previous section to publish the dashboard as a new shared dashboard, or read on to learn how to make edits to your dashboard before publishing.

## Edit a dashboard

After you create a dashboard, you can add, resize, and arrange tiles that show your Azure resources or display other helpful information.

To open the editing page for a dashboard, select **Edit** from its command bar. Make changes as described in the sections below, then select **Publish dashboardV2** when you're finished.

### Add tiles from the Tile Gallery

To add tiles to a dashboard by using the Tile Gallery, follow these steps.

1. Click **Add tile** to open the Tile Gallery.
1. Select the tile you want to add to your dashboard, then select **Add**. Alternately, you can drag the tile to the desired location in your grid.
1. To configure the tile, select **Edit** to open the tile editor.

   :::image type="content" source="media/dashboard-hub/dashboard-hub-edit-tile.png" alt-text="Screenshot of the Edit Tile option in the Dashboard hub in the Azure portal.":::

1. Make the desired changes to the tile, including editing its title or changing its configuration. When you're done, select **Apply changes**.

### Resize or rearrange tiles

To change the size of a tile, select the arrow on the bottom right corner of the tile, then drag to resize it. If there's not enough grid space to resize the tile, it bounces back to its original size.

To change the placement of a tile, select it and then drag it to a new location on the dashboard.

Repeat these steps as needed until you're happy with the layout of your tiles.

### Delete tiles

To remove a tile from the dashboard, hover in the upper right corner of the tile and then select **Delete**.

### Manage tabs

The new dashboard experience lets you create multiple tabs where you can group information. To create tabs:

1. Select **Manage tabs** from the command bar to open the **Manage tabs** pane.

   :::image type="content" source="media/dashboard-hub/dashboard-hub-manage-tabs.png" alt-text="Screenshot of the Manage tabs page in the Dashboard hub in the Azure portal.":::

1. Enter name for the tabs you want to create.
1. To change the tab order, drag and drop your tabs, or select the checkbox next to a tab and use the **Move up** and **Move down** buttons.
1. When you're finished, select **Apply changes**.

You can then select each tab to make individual edits.

### Apply dashboard filters

To add filters to your dashboard, select **Parameters** from the command bar to open the **Manage parameters** pane

The options you see depend on the tiles used in your dashboard. For example, you may see options to filter data for a specific subscription or location.

If your dashboard includes the **Metrics** tile, the default parameters are **Time range** and **Time granularity.**

:::image type="content" source="media/dashboard-hub/dashboard-hub-parameters.png" alt-text="Screenshot of the Manage parameters pane in the Dashboard hub in the Azure portal.":::

To edit a parameter, select the pencil icon.

To add a new parameter, select **Add**, then configure the parameter as desired.

To remove a parameter, select the trash can icon.

### Pin content from a resource page

Another way to add tiles to your dashboard is directly from a resource page.

Many resource pages include a pin icon in the command bar, which means that you can pin a tile representing that resource.

:::image type="content" source="media/dashboard-hub/dashboard-hub-pin.png" alt-text="Screenshot showing the Pin option for an Azure resource.":::

In some cases, a pin icon may also appear by specific content within a page, which means you can pin a tile for that specific content, rather than the entire page. For example, you can pin some resources through the context pane.

:::image type="content" source="media/dashboard-hub/dashboard-hub-pin-context-pane.png" alt-text="Screenshot showing the Pin option in a resource's context pane.":::

To pin content to your dashboard, select the **Pin to dashboard** option or the pin icon. Be sure to select the **Shared** dashboard type. You can also create a new dashboard which will include this pin by selecting **Create new**.

## Export a dashboard

You can export a dashboard from the Dashboard hub to view its structure programmatically. These exported templates can also be used as the basis for creating future dashboards.

To export a dashboard, select **Export**. Select the option for the format you wish to download:

- **ARM template**: Downloads an ARM template representation of the dashboard.
- **Dashboard**: Downloads a JSON representation of the dashboard.
- **View**: Downloads a declarative view of the dashboard.

After you make your selection, you can view the downloaded version in the editor of your choice.

## Understand access control

Published dashboards are implemented as Azure resources, Each dashboard exists as a manageable item contained in a resource group within your subscription. You can manage access control through the Dashboard hub.

Azure role-based access control (Azure RBAC) lets you assign users to roles at different levels of scope: management group, subscription, resource group, or resource. Azure RBAC permissions are inherited from higher levels down to the individual resource. In many cases, you may already have users assigned to roles for the subscription that will give them access to the published dashboard.

For example, users who have the **Owner** or **Contributor** role for a subscription can list, view, create, modify, or delete dashboards within the subscription. Users with a custom role that includes the `Microsoft.Portal/Dashboards/Write` permission can also perform these tasks.

Users with the **Reader** role for the subscription (or a custom role with `Microsoft.Portal/Dashboards/Read permission`) can list and view dashboards within that subscription, but they can't modify or delete them. These users can make private copies of dashboards for themselves. They can also make local edits to a published dashboard for their own use, such as when troubleshooting an issue, but they can't publish those changes back to the server. These users can also view these dashboards in the Azure mobile app.

To expand access to a dashboard beyond the access granted at the subscription level, you can assign permissions to an individual dashboard, or to a resource group that contains several dashboards. For example, if a user has limited permissions across the subscription, but needs to be able to edit one particular dashboard, you can assign a different role with more permissions (such as Contributor) for that dashboard only.
