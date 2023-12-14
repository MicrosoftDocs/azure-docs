---
title: Azure Monitor workbooks settings
description: Understand the settings you can use in Azure Workbooks
services: azure-monitor
ms.topic: conceptual
ms.date: 06/21/2023
---

# Workbook settings

This article describes the settings you can use in Azure Workbooks.

## Delete a workbook

1. In the Azure portal, select **Monitor**, and then select **Workbooks** from the left pane.
1. Select the checkbox next to the Workbook you want to delete.
1. Select **Delete** from the top toolbar.

## Recover a deleted workbook
When you delete an Azure Workbook, it is soft-deleted and can be recovered by contacting support. After the soft-delete period, the workbook and its content are nonrecoverable and queued for purge completely within 30 days.
 
> [!NOTE]
> Workbooks that were saved using bring your own storage cannot be recovered by support. You may be able to recover the workbook content from the storage account if the storage account used has enabled soft delete. 

## Share a workbook

When you want to share a workbook or template, keep in mind that the person you want to share with must have permissions to access the workbook. They must have an Azure account, and **Monitoring Reader** permissions.
To share a workbook or workbook template:

1. In the Azure portal, select **Monitor**, and then select **Workbooks** from the left pane.
1. Select the checkbox next to the workbook or template you want to share.
1. Select the **Share** icon from the top toolbar.
1. The **Share workbook** or **Share template** window opens with a URL to use for sharing the workbook.
1. Copy the link to share the workbook, or select **Share link via email** to open your default mail app.

:::image type="content" source="media/workbooks-getting-started/workbooks-share.png" alt-text="Screenshot of the steps to share an Azure workbook.":::

## Set up Auto refresh

1. In the Azure portal, select the workbook.
1. Select **Auto refresh**, and then to select from a list of intervals for the auto-refresh. The workbook will start refreshing after the selected time interval.

-  Auto refresh only applies when the workbook is in read mode. If a user sets an interval of 5 minutes and after 4 minutes switches to edit mode, refreshing doesn't occur if the user is still in edit mode. But if the user returns to read mode, the interval of 5 minutes resets and the workbook will be refreshed after 5 minutes.
-  Selecting **Auto refresh** in read mode also resets the interval. If a user sets the interval to 5 minutes and after 3 minutes the user selects **Auto refresh** to manually refresh the workbook, the **Auto refresh** interval resets and the workbook will be auto-refreshed after 5 minutes.
- The **Auto refresh** setting isn't saved with the workbook. Every time a user opens a workbook, **Auto refresh** is **Off** and needs to be set again.
- Switching workbooks and going out of the gallery clears the **Auto refresh** interval.

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh.png" alt-text="Screenshot that shows workbooks with Auto refresh.":::

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh-interval.png" alt-text="Screenshot that shows workbooks with Auto refresh with an interval set.":::

## Configure Workbooks using the Settings tab

You can configure workbooks to suit your needs by using the settings in the **Settings** tab inside the workbook. 

Workbook settings have these tabs to help you configure your workbook.

|Settings tab  |Description  |
|---------|---------|
|Resources|This tab contains the resources that appear as default selections in this workbook.<br>The resource marked as the **Owner** is where the workbook will be saved and the location of the workbooks and templates you'll see when you're browsing. The owner resource can't be removed.<br> You can add a default resource by selecting **Add Resources**. You can remove resources by selecting a resource or several resources and selecting **Remove Selected Resources**. When you're finished adding and removing resources, select **Apply Changes**.|
|Versions| This tab contains a list of all the available versions of this workbook. Select a version and use the toolbar to compare, view, or restore versions. Previous workbook versions are available for 90 days.<br><ul><li>**Compare**: Compares the JSON of the previous workbook to the most recently saved version.</li><li>**View**: Opens the selected version of the workbook in a context pane.</li><li>**Restore**: Saves a new copy of the workbook with the contents of the selected version and overwrites any existing current content. You'll be prompted to confirm this action.</li></ul><br>|
|Style     |On this tab, you can set a padding and spacing style for the whole workbook. The possible options are **Wide**, **Standard**, **Narrow**, and **None**. The default style setting is **Standard**.|
|Pin     |While in pin mode, you can select **Pin Workbook** to pin a component from this workbook to a dashboard. Select **Link to Workbook** to pin a static link to this workbook on your dashboard. You can choose a specific component in your workbook to pin.|
|Trusted hosts     |On this tab, you can enable a trusted source or mark this workbook as trusted in this browser. For more information, see [Trusted hosts](#trusted-hosts). |

If query or metrics steps display time-based data, more settings are available on the **Advanced settings** tab.

### Versions

:::image type="content" source="media/workbooks-configurations/workbooks-versions.png" alt-text="Screenshot that shows the versions tab of the workbook's Settings pane.":::

### Compare versions

:::image type="content" source="media/workbooks-configurations/workbooks-compare-versions.png" alt-text="Screenshot that shows version comparison in the Compare Workbook Versions screen.":::

> [!NOTE]
> Version history isn't available for [bring-your-own-storage](workbooks-bring-your-own-storage.md) workbooks.

## Pinning

You can pin text, query, or metrics components in a workbook by using the **Pin** button on those items while the workbook is in pin mode. Or you can use the **Pin** button if the workbook author has enabled settings for that element to make it visible.

To access pin mode, select **Edit** to enter editing mode. Select **Pin** on the top bar. An individual **Pin** then appears above each corresponding workbook part's **Edit** button on the right side of the screen.

:::image type="content" source="./media/workbooks-overview/pin-experience.png" alt-text="Screenshot that shows the Pin button." border="false":::

> [!NOTE]
> The state of the workbook is saved at the time of the pin. Pinned workbooks on a dashboard won't update if the underlying workbook is modified. To update a pinned workbook part, you must delete and re-pin that part.

### Time ranges for pinned queries

Pinned workbook query parts will respect the dashboard's time range if the pinned item is configured to use a *TimeRange* parameter. The dashboard's time range value will be used as the time range parameter's value. Any change of the dashboard time range will cause the pinned item to update. If a pinned part is using the dashboard's time range, you'll see the subtitle of the pinned part update to show the dashboard's time range whenever the time range changes.

Pinned workbook parts using a time range parameter will auto-refresh at a rate determined by the dashboard's time range. The last time the query ran will appear in the subtitle of the pinned part.

If a pinned component has an explicitly set time range and doesn't use a time range parameter, that time range will always be used for the dashboard, regardless of the dashboard's settings. The subtitle of the pinned part won't show the dashboard's time range. The query won't auto-refresh on the dashboard. The subtitle will show the last time the query executed.

> [!NOTE]
> Queries that use the *merge* data source aren't currently supported when pinning to dashboards.

### Enable Trusted hosts

Enable a trusted source or mark this workbook as trusted in this browser.

| Control      | Definition |
| ----------- | ----------- |
| Mark workbook as trusted      | If enabled, this workbook can call any endpoint, whether the host is marked as trusted or not. A workbook is trusted if it's a new workbook, an existing workbook that's saved, or is explicitly marked as a trusted workbook.   |
| URL grid   | A grid to explicitly add trusted hosts.        |


