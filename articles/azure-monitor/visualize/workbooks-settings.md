---
title: Azure Monitor workbooks settings
description: Understand the settings you can use in Azure Workbooks
services: azure-monitor
ms.topic: conceptual
ms.date: 06/21/2023
---

# Workbook settings

This article describes the settings you can use to configure Azure Workbooks.

## The Settings tab

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


