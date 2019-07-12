---
title: Configure the Azure Log Analytics agent for hybrid Windows computers | Microsoft Docs
description: In this quickstart, you'll learn how to deploy the Log Analytics agent for Windows computers running outside of Azure and enable data collection with Log Analytics.
services: log-analytics
documentationcenter: log-analytics
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.date: 04/09/2019
ms.author: magoedte
ms.custom: mvc
---

# Configure the Log Analytics agent for Windows computers in a hybrid environment
[Azure Log Analytics](../../azure-monitor/platform/agent-windows.md) can collect data directly from your physical or virtual Windows computers into a single repository for detailed analysis and correlation. Log Analytics can collect data from a datacenter or other cloud environment. This quickstart shows you how to configure and collect data from your Windows computer with a few easy steps.  For information about Azure Windows VMs, see [Collect data about Azure virtual machines](../../azure-monitor/learn/quick-collect-azurevm.md).  

To understand the supported configuration, see [Supported Windows operating systems](../../azure-monitor/platform/log-analytics-agent.md#supported-windows-operating-systems) and [Network firewall configuration](../../azure-monitor/platform/log-analytics-agent.md#network-firewall-requirements).
 
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to the Azure portal
Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a workspace
1. In the Azure portal, select **All services**. In the search box, enter **Log Analytics**. As you type, the list filters based on your input. Select **Log Analytics**:

    ![Azure portal](media/quick-collect-windows-computer/azure-portal-01.png)
  
2. Select **Create**, and then provide these details:

   * Enter a name for the new **Log Analytics Workspace**. Something like **DefaultLAWorkspace**.
   * Select a **Subscription** to link to. If the default isn't the one you want to use, select another one from the list.
   * For the **Resource Group**, select an existing resource group that contains one or more Azure virtual machines.  
   * Select the **Location** your VMs are deployed to. Here's a list of [regions in which Log Analytics is available](https://azure.microsoft.com/regions/services/).  
   * If you're creating a workspace in a subscription that you created after April 2, 2018, the workspace will automatically use the **Per GB** pricing plan. You won't be able to select a pricing tier. If you're creating a workspace in a subscription that you created before April 2, 2018, or in a subscription that was tied to an existing EA enrollment, select the pricing tier that you want to use. See the [Log Analytics pricing details](https://azure.microsoft.com/pricing/details/log-analytics/) for information about tiers.

        ![Create Log Analytics resource](media/quick-collect-windows-computer/create-loganalytics-workspace-02.png)<br>  

3. After providing the required information in the **Log Analytics Workspace** pane, select **OK**.  

While the information is verified and the workspace is being created, you can track the progress under **Notifications** in the menu.

## Get the workspace ID and key
Before you install Microsoft Monitoring Agent for Windows, you need the workspace ID and key for your Log Analytics workspace. The setup wizard needs this information to properly configure the agent and ensure it can communicate with Log Analytics.  

1. In the upper-left corner of the Azure portal, select **All services**. In the search box, enter **Log Analytics**. As you type, the list filters based on your input. Select **Log Analytics**.
2. In your list of Log Analytics workspaces, select the workspace you created earlier. (You might have named it **DefaultLAWorkspace**.)
3. Select **Advanced settings**:

    ![Log Analytics advanced settings](media/quick-collect-windows-computer/log-analytics-advanced-settings-01.png)
  
4. Select **Connected Sources**, and then select **Windows Servers**.
5. Copy the values to the right of **Workspace ID** and **Primary Key**. Paste them into your favorite editor.

## Install the agent for Windows
The following steps install and configure the agent for Log Analytics in Azure and Azure Government. You'll use the Microsoft Monitoring Agent Setup program to install the agent on your computer.

1. Continuing from the previous set of steps, on the **Windows Servers** page, select the **Download Windows Agent** version that you want to download. Select the appropriate version for the processor architecture of your Windows operating system.
2. Run Setup to install the agent on your computer.
2. On the **Welcome** page, select **Next**.
3. On the **License Terms** page, read the license and then select **I Agree**.
4. On the **Destination Folder** page, change or keep the default installation folder and then select **Next**.
5. On the **Agent Setup Options** page, connect the agent to Azure Log Analytics and then select **Next**.
6. On the **Azure Log Analytics** page, complete these steps:
   1. Paste in the **Workspace ID** and **Workspace Key (Primary Key)** that you copied earlier. If the computer should report to a Log Analytics workspace in Azure Government, select **Azure US Government** in the **Azure Cloud** list.  
   2. If the computer needs to communicate through a proxy server to the Log Analytics service, select **Advanced** and provide the URL and port number of the proxy server. If your proxy server requires authentication, enter the user name and password for authentication with the proxy server and then select **Next**.  
7. Select **Next** after you've added the configuration settings:

    ![Microsoft Monitoring Agent Setup](media/quick-collect-windows-computer/log-analytics-mma-setup-laworkspace.png)

8. On the **Ready to Install** page, review your choices and then select **Install**.
9. On the **Configuration completed successfully** page, select **Finish**.

When the installation and setup is finished, Microsoft Monitoring Agent appears in Control Panel. You can review your configuration and verify that the agent is connected to Log Analytics. When connected, on the **Azure Log Analytics** tab, the agent displays this message: **The Microsoft Monitoring Agent has successfully connected to the Microsoft Log Analytics service.**<br><br> ![MMA connection status](media/quick-collect-windows-computer/log-analytics-mma-laworkspace-status.png)

## Collect event and performance data
Log Analytics can collect events that you specify from the Windows event log and performance counters for longer term analysis and reporting. It can also take action when it detects a particular condition. Follow these steps to configure collection of events from the Windows event log, and several common performance counters to start with.  

1. In the lower-left corner of the Azure portal, select **More services**. In the search box, enter **Log Analytics**. As you type, the list filters based on your input. Select **Log Analytics**.
2. Select **Advanced settings**:

    ![Log Analytics advanced settings](media/quick-collect-windows-computer/log-analytics-advanced-settings-01.png)
 
3. Select **Data**, and then select **Windows Event Logs**.  
4. You add an event log by entering the name of the log. Enter **System**, and then select the plus sign (**+**).  
5. In the table, select the **Error** and **Warning** severities.
6. Select **Save** at the top of the page.
7. Select **Windows Performance Counters** to enable collection of performance counters on a Windows computer.
8. When you first configure Windows performance counters for a new Log Analytics workspace, you're given the option to quickly create several common counters. Each option is listed, with a check box next to it:

    ![Windows performance counters](media/quick-collect-windows-computer/windows-perfcounters-default.png).
    
    Select **Add the selected performance counters**. The counters are added and preset with a ten-second collection sample interval.

9. Select **Save** at the top of the page.

## View collected data
Now that you've enabled data collection, let's run a simple log search to see some data from the target computer.  

1. In the Azure portal, in the selected workspace, select the **Logs** tile.  
2. On the **Log Search** pane, in the query box, enter **Perf** and click **Run** on the top of query box:
 
    ![Log Analytics log search](media/quick-collect-windows-computer/log-analytics-portal-queryexample.png)

    For example, the query in this image returned 735 Performance records:

    ![Log Analytics log search result](media/quick-collect-windows-computer/log-analytics-search-perf.png)

## Clean up resources
You can remove the agent from your computer and delete the Log Analytics workspace if you no longer need them.  

To remove the agent, complete these steps:

1. Open Control Panel.
2. Open **Programs and Features**.
3. In **Programs and Features**, select **Microsoft Monitoring Agent** and then select **Uninstall**.

To delete the Log Analytics workspace you created earlier, select it, and, on the resource page, select **Delete**:

![Delete Log Analytics workspace](media/quick-collect-windows-computer/log-analytics-portal-delete-resource.png)

## Next steps
Now that you're collecting operational and performance data from your Windows computer, you can easily begin exploring, analyzing, and acting on the data you collect, for *free*.  

To learn how to view and analyze the data, continue to the tutorial:

> [!div class="nextstepaction"]
> [View or analyze data in Log Analytics](tutorial-viewdata.md)
