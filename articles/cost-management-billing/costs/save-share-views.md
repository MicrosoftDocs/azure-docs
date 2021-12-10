---
title: Save and share customized views - Azure Cost Management and Billing
description: This article explains how to save and share a customized view with others.
author: bandersmsft
ms.author: banders
ms.date: 12/07/2021
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
---

# Save and share customized views

You can save and share customized views with others by pinning cost analysis to the Azure portal dashboard or by copying a link to cost analysis. You can also download a snapshot of the data or views and manually share it with others.

Watch the video [Sharing and saving views in Cost Management](https://www.youtube.com/watch?v=kQkXXj-SmvQ) to learn more about how to use the portal to share cost knowledge around your organization. To watch other videos, visit the [Cost Management YouTube channel](https://www.youtube.com/c/AzureCostManagement).

## Save and share a view

When you save a view, all settings in cost analysis are saved, including filters, grouping, granularity, the main chart type, and donut charts. Underlying data isn't saved.

After you save a view, you can share the URL to it with others using the **Share** command. The URL is specific to your current scope. Sharing only shares the view configuration and doesn't grant others access to the underlying data. If you don't have access to the scope, you'll see an `access denied` message.

You can also pin the current view to an Azure portal dashboard. The pinned view is a condensed view of the main chart or table and doesn't update when the view is updated. A pinned dashboard isn't the same thing as a saved view.

### To save a view

1. In Cost analysis, make sure that the settings for your current view are the ones that you want saved.
2. Under your billing scope or subscription name, select **Save** to update your current view or **Save as** to save a new view.  
    :::image type="content" source="./media/save-share-views/save-options.png" alt-text="Screen shot showing the view save options." lightbox="./media/save-share-views/save-options.png" :::
1. Enter a name for the view and then select **Save**.  
    :::image type="content" source="./media/save-share-views/save-box.png" alt-text="Screen shot showing Save box where you enter a name to save." lightbox="./media/save-share-views/save-box.png" :::
1. After you save a view, it's available to select from the **View** list.  
        :::image type="content" source="./media/save-share-views/view-list.png" alt-text="Screen shot showing the View list." lightbox="./media/save-share-views/view-list.png" :::

### To share a view

1. In Cost analysis, ensure that the currently selected view is the one that you want to share.
2. Under your billing scope or subscription name, select **Share**.
3. In the **Share** box, select **Copy to clipboard** to copy the URL and then select **OK**.  
        :::image type="content" source="./media/save-share-views/share.png" alt-text="Screen shot showing the Share box." lightbox="./media/save-share-views/share.png" :::
1. Paste the URL using any application that you like to send to others.

## Pin to dashboard

As mentioned previously, a pinned dashboard is only a saved main chart or table view. It's essentially a thumbnail view of the main chart you can select to get back to the view where the dashboard was originally pinned from.

To pin cost analysis to a dashboard

1. In Cost analysis, ensure that the currently selected view is the one that you want to pin.
2. To the right of your billing scope or subscription name, select the **Pin** symbol.
3. In the Pin to dashboard window, choose **Existing** to pin the current view to the existing dashboard or choose **Create new** to pin the current view to a new dashboard.  
        :::image type="content" source="./media/save-share-views/pin-dashboard.png" alt-text="Screen shot showing the Pin to dashboard page." lightbox="./media/save-share-views/pin-dashboard.png" :::
1. Select **Private** to if you don't want to share the dashboard and then select Pin or select **Shared to share** the dashboard with multiple subscriptions and then select **Pin**.
1. To view the dashboard after you've pinned it, from the Azure portal menu, select **Dashboard**.  
        :::image type="content" source="./media/save-share-views/saved-dashboard.png" alt-text="Screen shot showing the saved Dashboard page." lightbox="./media/save-share-views/saved-dashboard.png" :::

## Download data

When you want to share information with others that don't have access to Cost analysis, you can **Download** the current view in PNG, Excel, and CSV formats. Then you can share it with them by email or other means. The downloaded data is a snapshot, so it isn't automatically updated.

:::image type="content" source="./media/save-share-views/download.png" alt-text="Screen shot showing the Download page." lightbox="./media/save-share-views/download.png" :::

## Next steps

- For more information about creating dashboards, see [Create a dashboard in the Azure portal](../../azure-portal/azure-portal-dashboards.md).
- To learn more about Cost Management, see [Cost Management + Billing documentation](../index.yml).