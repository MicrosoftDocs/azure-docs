---
title: Monitor your data using dashboards based on Azure Monitor Workbooks in Azure Sentinel Preview | Microsoft Docs
description: Use this tutorial to learn how to monitor your data using dashboards bsed on workbooks in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/20/2019
ms.author: rkarlin

---
# Tutorial: Monitor your data



After you [connected your data sources](https://docs.microsoft.com/en-us/azure/sentinel/quickstart-onboard) to Azure Sentinel, you can use dashboards to monitor the data. The dashboards in Azure Sentinel are based on Azure Monitor Workbooks which provides versitility in creating custom dashboards. While the Workbooks are displayed differnetly in Azure Sentinel for dashboards, it may be useful for you to see how to [Create interactive reports with Azure Monitor Workbooks](../azure-monitor/app/usage-workbooks). Azure Sentinel allows you to create custom dashboards across your data, and also comes with built-in dashboards to allow you to quickly gain insights across your data as soon as you connect a data source.


This tutorial helps you monitor your data in Azure Sentinel.
> [!div class="checklist"]
> * Use built-in dashboards
> * Create new dashboards

## Prerequisites

- You must have at least Workbook reader or Workbook contributor permissions on the resource group of the Azure Sentinel workspace.

- The workbooks that you can see in Azure Sentinel are saved within the Azure Sentinel's workspace resource group and are tagged by the workspace in which they were created.

## Use built-in dashboards

1. Go to **Dashboards** and then select **Templates** to see the full list of Azure Sentinel built-in dashboards. To see which are relevant to the data types you have connected, the **Required data types** field in each dashboard will list the data type next to a green check mark if you already stream relevant data to Azure Sentinel.

1. Click **View template** to see the template populated with your data.

1. To edit the dashboard, select **Save**, and then select the location where you want to save the json file for the template. 
   > [!NOTE]
   > This saves only the template, not the data inside the template

1. Select **View dashboard**. Then, click the **Edit** button at the top. You can now edit the dashboard and customize it according to your needs. For more information on how to customize the dashboard, see how to [Create interactive reports with Azure Monitor Workbooks](../azure-monitor/app/usage-workbooks).

1. After you make your changes, you can save the dashboard making sure to save it under the same subscription and resource group. These dashboards are displayed under the **My dashboards** tab.


## Create new dashboards

1. Go to **Dashboards** and then select **Add Workbook dashboard** to create a new dashboard from scratch.

1. To create the dashboard, select **Edit**, and then add text, queries, and parameters as necessary. For more information on how to customize the dashboard, see how to [Create interactive reports with Azure Monitor Workbooks](../azure-monitor/app/usage-workbooks). 

1. When building a query, make sure that the **Data source** is set to **Logs**, the **Resource type** is set to **Log Analytics** and then choose the relevant workspace(s). 

1. After you create your dashboard, save the dashboard making sure to save it under the same subscription and resource group.

1. If you want to let others in your organization use the dashboard, under **Save to** select **Shared reports**. If you want this dashboard to be available only to you, select **My reports**.

1. Under the settings cog, you can see a list of the resources from which this dashboard takes data. Make sure that the Azure Sentinel workspace and resource group are listed as resources. These dashboards are displayed under the **My dashboards** tab.





## Next steps

In this tutorial, you learned how to view your data in Azure Sentinel.

To learn how to automate your responses to threats, [how to respond to threats using automated playbooks](https://docs.microsoft.com/en-us/azure/sentinel/tutorial-respond-threats-playbook).

[Respond to threats](https://docs.microsoft.com/en-us/azure/sentinel/tutorial-respond-threats-playbook) to automate your responses to threats.
