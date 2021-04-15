---
title: Create a dashboard in the Azure portal
description: This article describes how to create and customize a dashboard in the Azure portal.
ms.assetid: ff422f36-47d2-409b-8a19-02e24b03ffe7
ms.topic: how-to
ms.date: 04/15/2021
---

# Create a dashboard in the Azure portal

Dashboards are a focused and organized view of your cloud resources in the Azure portal. Use dashboards as a workspace where you can monitor resources and quickly launch tasks for day-to-day operations. Build custom dashboards based on projects, tasks, or user roles, for example.

The Azure portal provides a default dashboard as a starting point. You can edit the default dashboard and create and customize additional dashboards.

> [!NOTE]
> Each user can create up to 100 private dashboards. If you [publish and share the dashboard](azure-portal-dashboard-share-access.md), it will be implemented as an Azure resource in your subscription and won’t count towards this limit.

This article describes how to create a new dashboard and customize it. For information on sharing dashboards, see [Share Azure dashboards by using Azure role-based access control](azure-portal-dashboard-share-access.md).

## Create a new dashboard

This example shows how to create a new private dashboard with an assigned name. All dashboards are private when created, although you can choose to publish and share your dashboard with other users in your organization if you'd like.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu, select **Dashboard**. Your default view might already be set to dashboard.

    ![Screenshot of the Azure portal with Dashboard selected.](./media/azure-portal-dashboards/portal-menu-dashboard.png)

1. Select **New dashboard** then **Blank dashboard**.

    ![Screenshot of the New dashboard options.](./media/azure-portal-dashboards/create-new-dashboard.png)

    This action opens the **Tile Gallery**, from which you can select tiles, and an empty grid where you'll arrange the tiles.

1. Select the **My Dashboard** text in the dashboard label and enter a name that will help you easily identify the custom dashboard.

    :::image type="content" source="media/azure-portal-dashboards/dashboard-name.png" alt-text="Screenshot of an empty grid with the Tile Gallery.":::

1. To save the dashboard as is, select **Done customizing** in the page header. Or, continue to the next section to add tiles and save your dashboard.

The dashboard view now shows your new dashboard. Select the arrow next to the dashboard name to see dashboards available to you. The list might include dashboards that other users have created and shared.

## Edit a dashboard

Now, let's edit the dashboard to add, resize, and arrange tiles that represent your Azure resources.

### Add tiles from the Tile Gallery

To add tiles to a dashboard, follow these steps:

1. Select ![edit icon](./media/azure-portal-dashboards/dashboard-edit-icon.png) **Edit** from the dashboard's page header.

    ![Screenshot of dashboard highlighting the Edit option.](./media/azure-portal-dashboards/dashboard-edit.png)

1. Browse the **Tile Gallery** or use the search field to find a certain tile. Select the tile you want to add to your dashboard.

   :::image type="content" source="media/azure-portal-dashboards/dashboard-tile-gallery.png" alt-text="Screenshot of the Tile Gallery.":::

1. Select **Add** to add the tile to the dashboard with a default size and location. Or, drag the tile to the grid and place it where you want. Add any tiles you want, but here are a couple of ideas:

    - Add **All resources** to see any resources you've already created.

    - If you work with more than one organization, add the **Organization identity** tile to your dashboard to clearly show which organization the resources belong to.

1. If desired, resize the tile by dragging and dropping the lower right hand corner of the tile.

1. To save your changes, select **Save** in the page header. You can also preview the changes without saving by selecting **Preview** in the page header. From the preview screen, you can select **Save** to keep the changes, **Discard** to remove them, or **Edit** to go back to the editing options and make further changes.

   :::image type="content" source="media/azure-portal-dashboards/dashboard-save.png" alt-text="Screenshot of the Preview, Save, and Discard options.":::

### Pin content from a resource page

Another way to add tiles to your dashboard is directly from a resource page.

Many resource pages include a pin icon in the command bar. If you select this icon, you can pin a tile representing the source page to an existing dashboard, or to a new dashboard that you create.

![Screenshot of page command bar with pin icon](./media/azure-portal-dashboards/dashboard-pin-blade.png)

In some cases, a pin icon may also appear by specific content within a page, which means you can pin a tile for that specific content rather than the entire page.

### Resize or rearrange tiles

To change the size of a tile or to rearrange the tiles on a dashboard, follow these steps:

1. Select ![edit icon](./media/azure-portal-dashboards/dashboard-edit-icon.png) **Edit** from the page header.

1. Select the context menu in the upper right corner of a tile. Then, choose a tile size. Tiles that support any size also include a "handle" in the lower right corner that lets you drag the tile to the size you want.

    :::image type="content" source="media/azure-portal-dashboards/dashboard-tile-resize.png" alt-text="Screenshot of dashboard with tile size menu open.":::

1. Select a tile and drag it to a new location on the grid to arrange your dashboard.

### Additional tile configuration

Some tiles might require more configuration to show the information you want. For example, the **Metrics chart** tile has to be set up to display a metric from Azure Monitor. You can also customize tile data to override the dashboard's default time settings.

Any tile that needs to be set up displays a banner until you customize the tile. For the **Metrics chart**, the banner is **Edit in Metrics**.To customize the tile:

1. In the page header select **Save** to exit edit mode.

1. Select the banner, then do the required setup.

    ![Screenshot of tile that requires configuration](./media/azure-portal-dashboards/dashboard-configure-tile.png)

> [!NOTE]
> A markdown tile lets you display custom, static content on your dashboard. This could be basic instructions, an image, a set of hyperlinks, or even contact information. For more information about using a markdown tile, see [Use a markdown tile on Azure dashboards to show custom content](azure-portal-markdown-tile.md).

### Customize tile data

Data on the dashboard automatically shows activity for the past 24 hours. To show a different time span for just this tile, follow these steps:

1. Select **Customize tile data** from the context menu or from the ![filter icon](./media/azure-portal-dashboards/dashboard-filter.png) filter in the upper left corner of the tile.

    ![Screenshot of tile context menu.](./media/azure-portal-dashboards/dashboard-customize-tile-data.png)

1. Select the checkbox to **Override the dashboard time settings at the tile level**.

    ![Screenshot of dialog to configure tile time settings.](./media/azure-portal-dashboards/dashboard-override-time-settings.png)

1. Choose the time span to show for this tile. You can choose from the past 30 minutes to the past 30 days or define a custom range.

1. Choose the time granularity to display. You can show anywhere from one-minute increments to one-month.

1. Select **Apply**.

## Delete a tile

To remove a tile from a dashboard, do one of the following:

- Select the context menu in the upper right corner of the tile, then select **Remove from dashboard**.

- Select ![edit icon](./media/azure-portal-dashboards/dashboard-edit-icon.png) **Edit** to enter customization mode. Hover in the upper right corner of the tile, then select the ![delete icon](./media/azure-portal-dashboards/dashboard-delete-icon.png) delete icon to remove the tile from the dashboard.

   ![Screenshot showing how to remove tile from dashboard.](./media/azure-portal-dashboards/dashboard-delete-tile.png)

## Clone a dashboard

To use an existing dashboard as a template for a new dashboard, follow these steps:

1. Make sure that the dashboard view is showing the dashboard that you want to copy.

1. In the page header, select ![clone icon](./media/azure-portal-dashboards/dashboard-clone.png) **Clone**.

1. A copy of the dashboard, named **Clone of** *your dashboard name* opens in edit mode. Use the preceding steps in this article to rename and customize the dashboard.

## Publish and share a dashboard

When you create a dashboard, it's private by default, which means you're the only one who can see it. To make dashboards available to others, you can publish and share them. For more information, see [Share Azure dashboards by using Azure role-based access control](azure-portal-dashboard-share-access.md).

### Open a shared dashboard

To find and open a shared dashboard, follow these steps:

1. Select the arrow next to the dashboard name.

1. Select from the displayed list of dashboards. If the dashboard you want to open isn't listed:

    1. select **Browse all dashboards**.

        ![Screenshot of dashboard selection menu](./media/azure-portal-dashboards/dashboard-browse.png)

    1. In the **Type** field, select **Shared dashboards**.

        ![Screenshot of all dashboards selection menu](./media/azure-portal-dashboards/dashboard-browse-all.png)

    1. Select one or more subscriptions. You can also enter text to filter dashboards by name.

    1. Select a dashboard from the list of shared dashboards.

## Delete a dashboard

To permanently delete a private or shared dashboard, follow these steps:

1. Select the dashboard you want to delete from the list next to the dashboard name.

1. Select ![delete icon](./media/azure-portal-dashboards/dashboard-delete-icon.png) **Delete** from the page header.

1. For a private dashboard, select **OK** on the confirmation dialog to remove the dashboard. For a shared dashboard, on the confirmation dialog, select the checkbox to confirm that the published dashboard will no longer be viewable by others. Then, select **OK**.

    ![Screenshot of delete confirmation.](./media/azure-portal-dashboards/dashboard-delete-dash.png)

## Recover a deleted dashboard

If you're in the global Azure cloud, and you delete a _published_ dashboard in the Azure portal, you can recover that dashboard within 14 days of the delete. For more information, see [Recover a deleted dashboard in the Azure portal](recover-shared-deleted-dashboard.md).

## Next steps

- [Share Azure dashboards by using Azure role-based access control](azure-portal-dashboard-share-access.md)
- [Programmatically create Azure dashboards](azure-portal-dashboards-create-programmatically.md)
