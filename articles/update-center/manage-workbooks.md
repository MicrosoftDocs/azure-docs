---
title: Create reports using workbooks in update management center (preview)..
description: This article describes how to create and manage workbooks for VM insights.
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 05/23/2023
ms.topic: how-to
---

# Create reports in update management center (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to create a workbook and how to edit a workbook to create customized reports.

## Create a workbook

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).
1. Under **Monitoring**, select **Workbooks** to view the Update management center (Preview)| Workbooks|Gallery.
1. Select **Quick start** tile > **Empty** or alternatively, you can select **+New** to create a workbook.
1. Select **+Add** to select any [elements](../azure-monitor/visualize/workbooks-create-workbook.md#create-a-new-azure-workbook) to add to the workbook.

   :::image type="content" source="./media/manage-workbooks/create-workbook-elements.png" alt-text="Screenshot of how to create workbook using elements.":::

1. Select **Done Editing**.

## Edit a workbook
1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).
1. Under **Monitoring**, select **Workbooks** to view the Update management center (Preview)| Workbooks|Gallery.
1. Select **Update management center** tile > **Overview** to view the Update management center (Preview)|Workbooks|Overview page.
1. Select your subscription, and select **Edit** to enable the edit mode for all the four options.

    - Machines overall status & configuration
    - Updates data overview
    - Schedules/Maintenance configurations
    - History of Installation runs

    :::image type="content" source="./media/manage-workbooks/edit-workbooks-inline.png" alt-text="Screenshot of enabling the edit mode for all the options in workbooks." lightbox="./media/manage-workbooks/edit-workbooks-expanded.png":::

    You can customize the visualization to create interactive reports, edit the parameters, the size of the charts and the chart settings to define how the chart must be rendered.

    :::image type="content" source="./media/manage-workbooks/workbooks-edit-query-inline.png" alt-text="Screenshot of various edit options in workbooks." lightbox="./media/manage-workbooks/workbooks-edit-query-expanded.png":::

1. Select **Done Editing**.


## Next steps

* [View updates for single machine](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update management center](manage-multiple-machines.md)