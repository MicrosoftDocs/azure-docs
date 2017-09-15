---
title: Collect data about Azure Virtual Machines | Microsoft Docs
description: Learn how to enable the OMS Agent VM Extension and enable collection of data from your Azure VMs with Log Analytics.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/14/2017
ms.author: magoedte

---

# Collect data about Azure Virtual Machines
Configuring monitoring of your Azure Virtual Machines using [Log Analytics](log-analytics-overview.md) can be easily accomplished with a few simple steps.  This quickstart shows you how to configure and collect data from your Linux or Windows VMs already deployed in Azure for detailed analysis and correlation from other resources in your environment.  
 
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a workspace
1. In the Azure portal, search the list of services in the Marketplace for Log Analytics, and then select **Log Analytics**.
2. Click **Create**, and then select choices for the following items:

  * Specify a name for the new **OMS Workspace**.
  * Select a **Subscription** to link to by selecting from the drop-down list if the default selected is not appropriate.
  * For **Resource Group**, select an existing resource group containing Azure resources to monitor. 
  * Select a **Location**.  For additional information, see which [regions Log Analytics is available in](https://azure.microsoft.com/regions/services/).
  * You can choose from three different **pricing tiers** in Log Analytics, but for this quickstart you are going to select the **free** tier.  For additional information about the particular tiers, see [Log Analytics Pricing Details](https://azure.microsoft.com/pricing/details/log-analytics/).

        ![Create Log Analytics resource blade](./media/log-analytics-quick-collect-azurevm/create-loganalytics-resource-blade.png)<br>  
3. After providing the required information on the **OMS Workspace** blade, click **OK**.  

While the information is verified and the workspace is created, you can track its progress under **Notifications** from the menu. 

## Enable the Log Analytics VM Extension
For Windows and Linux virtual machines already deployed in Azure, you install the Log Analytics agent with the Log Analytics VM Extension.  Using the extension simplifies the installation process and automatically configures the agent to send data to the Log Analytics workspace that you specify. The agent is also upgraded automatically, ensuring that you have the latest features and fixes.

1. Sign into the Azure portal.
2. Select **Browse** on the left side of the portal, and then select **Log Analytics**.
3. In your list of Log Analytics workspaces, select the one that you created earlier.
4. On the left-hand menu, under Workspace Data Sources, click **Virtual machines**.  
5. In the list of **Virtual machines**, select the virtual machine you want to install the agent on. Notice that the **OMS connection status** for the VM indicates that it is **Not connected**.
6. In the details for your virtual machine, select **Connect**. The agent is automatically installed and configured for your Log Analytics workspace. This process takes a few minutes, during which time the **Status** is **Connecting**.
7. After you install and connect the agent, the **OMS connection status** will be updated with **This workspace**.

## Collect event and performance data
Log Analytics can collect events from the Windows event logs or Linux Syslog and performance counters that you specify for longer term analysis and reporting, and take action when a particular condition is detected.  Follow these steps to configure collection of events from the Windows system log and Linux Syslog, and several common performance counters to start with.  

### Data collection from Windows VM

1. Open the Azure portal.
2. Navigate to Log Analytics and select the workspace you created earlier.
3. Launch the OMS portal by selecting OMS Portal and on the **Overview** page, from the top menu select **Settings**.<br> ![OMS portal menu Settings option](./media/log-analytics-quick-collect-azurevm/omsportal-menu-settings-option.png)<br> 
4. Select **Data**, and then select **Windows Event Logs**.  
5. You add an event log by typing in the name of the log.  Type **System** and then click the plus sign **+**.  
6. In the table, check the severities **Error** and **Warning**.   
7. Click **Save** at the top of the page to save the configuration.
8. Select **Windows Performance Data** to enable collection of performance counters on a Windows computer. 
9. When you first configure Windows Performance counters for a new Log Analytics workspace, you are given the option to quickly create several common counters. They are listed with a checkbox next to each.<br> ![Default Windows performance counters selected](./media/log-analytics-quick-collect-azurevm/windows-perfcounters-default.png).<br> Click **Add the selected performance counters**.  They are added and preset with a ten second collection sample interval.  
10. Click **Save** at the top of the page to save the configuration.

### Data collection from Linux VM

1. In the OMS portal, select **Syslog**.
2. You add an event log by typing in the name of the log.  Type **Syslog** and then click the plus sign **+**.  
3. In the table, uncheck the severities **Info**, **Notice** and **Debug**. 
4. Click **Save** at the top of the page to save the configuration.
5. Select **Linux Performance Data** to enable collection of performance counters on a Windows computer. 
6. When you first configure Linux Performance counters for a new Log Analytics workspace, you are given the option to quickly create several common counters. They are listed with a checkbox next to each.<br> ![Default Windows performance counters selected](./media/log-analytics-quick-collect-azurevm/linux-perfcounters-default.png).<br> Click **Add the selected performance counters**.  They are added and preset with a ten second collection sample interval.  
7. Click **Save** at the top of the page to save the configuration.

## View data collected
Now that you have enabled data collection, lets run a simple log search example to see some of the data from the target VMs.  

1. In the Azure portal, navigate to Log Analytics and select the workspace created earlier.
2. Click the **Log Search** tile and on the Log Search blade, in the query field type `Type=Perf` and then hit enter or click the search button to the right of the query field.<br> ![Log Analytics log search query example](./media/log-analytics-quick-collect-azurevm/log-analytics-portal-queryexample.png)<br> For example, the query in the following image returned 78,000 Performance records.  Your results will be significantly less.<br> ![Log Analytics log search result](./media/log-analytics-quick-collect-azurevm/log-analytics-portal-queryresult.png)

## Clean up resources
When no longer needed, delete the Log Analytics workspace. To do so, select the Log Analytics workspace you created earlier and on the resource page click **Delete**.<br> ![Delete Log Analytics resource](./media/log-analytics-quick-collect-azurevm/log-analytics-portal-deleteresoruce.png)

## Next steps
Now that you are collecting operational and performance data from your Windows or Linux virtual machines, you can easily begin exploring, analyzing, and taking action on data that you collect for *free*.  

To learn how to view and analyze the data, continue to the tutorial.   

> [!div class="nextstepaction"]
> [Log Analytics tutorials](log-analytics-tutorial-viewdata.md)
