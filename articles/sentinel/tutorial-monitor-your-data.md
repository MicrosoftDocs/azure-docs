---
title: Visualize your data using Azure Monitor Workbooks in Azure Sentinel | Microsoft Docs
description: Use this tutorial to learn how to visualize your data using workbooks in Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/04/2020
ms.author: yelevin

---
# Tutorial: Visualize and monitor your data



Once you have [connected your data sources](quickstart-onboard.md) to Azure Sentinel, you can visualize and monitor the data using the Azure Sentinel adoption of Azure Monitor Workbooks, which provides versatility in creating custom dashboards. While the Workbooks are displayed differently in Azure Sentinel, it may be useful for you to see how to [create interactive reports with Azure Monitor Workbooks](../azure-monitor/platform/workbooks-overview.md). Azure Sentinel allows you to create custom workbooks across your data, and also comes with built-in workbook templates to allow you to quickly gain insights across your data as soon as you connect a data source.


This tutorial helps you visualize your data in Azure Sentinel.
> [!div class="checklist"]
> * Use built-in workbooks
> * Create new workbooks

## Prerequisites

- You must have at least Workbook reader or Workbook contributor permissions on the resource group of the Azure Sentinel workspace.

> [!NOTE]
> The workbooks that you can see in Azure Sentinel are saved within the Azure Sentinel workspace's resource group and are tagged by the workspace in which they were created.

## Use built-in workbooks

1. Go to **Workbooks** and then select **Templates** to see the full list of Azure Sentinel built-in workbooks. To see which are relevant to the data types you have connected, the **Required data types** field in each workbook will list the data type next to a green check mark if you already stream relevant data to Azure Sentinel.
  ![go to workbooks](./media/tutorial-monitor-data/access-workbooks.png)
1. Click **View workbook** to see the template populated with your data.
  
1. To edit the workbook, select **Save**, and then select the location where you want to save the json file for the template. 

   > [!NOTE]
   > This creates an Azure resource based on the relevant template and saves the template Json file itself and not the data.


1. Select **View workbook**. Then, click the **Edit** button at the top. You can now edit the workbook and customize it according to your needs. For more information on how to customize the workbook, see how to [Create interactive reports with Azure Monitor Workbooks](../azure-monitor/platform/workbooks-overview.md).
![view workbooks](./media/tutorial-monitor-data/workbook-graph.png)
1. After you make your changes, you can save the workbook. 

1. You can also clone the workbook: Select **Edit** and then **Save as**, making sure to save it with another name, under the same subscription and resource group. These workbooks are displayed under the **My workbooks** tab.


## Create new workbook

1. Go to **Workbooks** and then select **Add workbook** to create a new workbook from scratch.
  ![go to workbooks](./media/tutorial-monitor-data/create-workbook.png)

1. To edit the workbook, select **Edit**, and then add text, queries, and parameters as necessary. For more information on how to customize the workbook, see how to [Create interactive reports with Azure Monitor Workbooks](../azure-monitor/platform/workbooks-overview.md). 

1. When building a query, set the **Data source** is set to **Logs**, the **Resource type** is set to **Log Analytics** and then choose the relevant workspace(s). 

1. After you create your workbook, save the workbook making sure you save it under the subscription and resource group of your Azure Sentinel workspace.

1. If you want to let others in your organization use the workbook, under **Save to** select **Shared reports**. If you want this workbook to be available only to you, select **My reports**.

1. To switch between workbooks in your workspace, you can select **Open** ![Switch workbooks](./media/tutorial-monitor-data/switch.png)in the top pane of any workbook. On the window that opens to the right, switch between workbooks.

   ![Switch workbooks](./media/tutorial-monitor-data/switch-workbooks.png)


## How to delete workbooks

You can delete Workbooks that were created from an Azure Sentinel template. 

To delete a customized workbook, in the Workbooks page, select the saved workbook that you want to delete and select **Delete**. This will remove the saved workbook.

> [!NOTE]
> This removes the resource as well as any changes you made to the template. The original template will remain available.

## Next steps

In this tutorial, you learned how to view your data in Azure Sentinel.

To learn how to automate your responses to threats, see [Set up automated threat responses in Azure Sentinel](tutorial-respond-threats-playbook.md).
