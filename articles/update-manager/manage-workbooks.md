---
title: Create reports by using workbooks in Azure Update Manager
description: This article describes how to create and manage workbooks for VM insights.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 09/18/2023
ms.topic: how-to
---

# Create reports in Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to create and edit a workbook and make customized reports.

## Create a workbook

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Monitoring**, select **Update reports** to view the **Update Manager | Update reports | Gallery** page.
1. Select **Quick start** tile > **Empty**. Alternatively, you can select **New** to create a workbook.
1. Select **Add** to select any [elements](../azure-monitor/visualize/workbooks-create-workbook.md#create-a-new-azure-workbook) to add to the workbook.

   :::image type="content" source="./media/manage-workbooks/create-workbook-elements.png" alt-text="Screenshot that shows how to create a workbook by using elements.":::

1. Select **Done Editing**.

## Edit a workbook

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Monitoring**, select **Update reports** to view **Azure Update Manager | Update reports | Gallery**.
1. Select the **Azure Update Manager** tile > **Overview** to view the **Azure Update Manager | Update reports | Overview** page.
1. Select your subscription, and select **Edit** to enable the edit mode for all four options:

    - **Machines overall status & configuration**
    - **Updates Data Overview**
    - **Schedules/Maintenance configurations**
    - **History of Installation runs**

    :::image type="content" source="./media/manage-workbooks/edit-workbooks-inline.png" alt-text="Screenshot that shows enabling the edit mode for all the options in workbooks." lightbox="./media/manage-workbooks/edit-workbooks-expanded.png":::

    You can customize the visualization to create interactive reports and edit the parameters, chart size, and chart settings to define how the chart must be rendered.

    :::image type="content" source="./media/manage-workbooks/workbooks-edit-query-inline.png" alt-text="Screenshot that shows various edit options in workbooks." lightbox="./media/manage-workbooks/workbooks-edit-query-expanded.png":::

1. Select **Done Editing**.

## Next steps

* [View updates for a single machine](view-updates.md)
* [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via portal](manage-update-settings.md)
* [Manage multiple machines using Update Manager](manage-multiple-machines.md)
