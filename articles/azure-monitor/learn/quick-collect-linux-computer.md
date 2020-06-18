---
title: 'Quickstart: Collect data from a hybrid Linux Computer with Azure Monitor'
description: In this quickstart, you'll learn how to deploy the Log Analytics agent for Linux computers running outside of Azure and enable data collection with Azure Monitor Logs.
services: azure-monitor
documentationcenter: azure-monitor
author: bwren
manager: carmonm
editor: ''
ms.assetid: 

ms.workload: na
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.date: 12/24/2019
ms.author: bwren
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019
---

# Quickstart: Collect data from a Linux computer in a hybrid environment with Azure Monitor

[Azure Monitor](../overview.md) can collect data directly from your physical or virtual Linux computers in your environment into a Log Analytics workspace for detailed analysis and correlation. Installing the [Log Analytics agent](../platform/log-analytics-agent.md) allows Azure Monitor to collect data from a datacenter or other cloud environment. This quickstart shows you how to configure and collect data from your Linux server with a few easy steps. For information about Azure Linux VMs, see [Collect data about Azure virtual machines](../../azure-monitor/learn/quick-collect-azurevm.md).  

To understand the supported configuration, see [Supported Windows operating systems](../../azure-monitor/platform/log-analytics-agent.md#supported-linux-operating-systems) and [Network firewall configuration](../../azure-monitor/platform/log-analytics-agent.md#network-requirements).
 
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to the Azure portal

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 

## Create a workspace

1. In the Azure portal, select **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.

    ![Finding Log Analytics workspace in the Azure portal](media/quick-collect-azurevm/azure-portal-log-analytics-workspaces.png)<br>  

2. Select **Create**, and then select choices for the following items:

   * Provide a name for the new **Log Analytics workspace**, such as *DefaultLAWorkspace*.  
   * Select a **Subscription** to link to by selecting from the drop-down list if the default selected is not appropriate.
   * For **Resource Group**, select an existing resource group that contains one or more Azure virtual machines.  
   * Select the **Location** your VMs are deployed to.  For additional information, see which [regions Log Analytics is available in](https://azure.microsoft.com/regions/services/).
   * If you are creating a workspace in a new subscription created after April 2, 2018, it will automatically use the *Per GB* pricing plan and the option to select a pricing tier will not be available.  If you are creating a workspace for an existing subscription created before April 2, or to subscription that was tied to an existing EA enrollment, select your preferred pricing tier.  For additional information about the particular tiers, see [Log Analytics Pricing Details](https://azure.microsoft.com/pricing/details/log-analytics/).
  
        ![Creating a Log Analytics workspace in the Azure portal](media/quick-collect-azurevm/create-log-analytics-workspace-azure-portal.png) 

3. After providing the required information on the **Log Analytics workspace** pane, select **OK**.  

While the information is verified and the workspace is created, you can track its progress under **Notifications** from the menu. 

## Obtain workspace ID and key

Before installing the Log Analytics agent for Linux, you need the workspace ID and key for your Log Analytics workspace. This information is required by the agent wrapper script to properly configure the agent and ensure it can successfully communicate with Azure Monitor.

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]  

1. In the upper-left corner of the Azure portal, select **All services**. In the search box, enter **Log Analytics**. As you type, the list filters based on your input. Select **Log Analytics workspaces**.

2. In your list of Log Analytics workspaces, select the workspace you created earlier. (You might have named it **DefaultLAWorkspace**.)

3. Select **Advanced settings**:

    ![Advanced Settings menu for Log Analytics in the Azure portal](media/quick-collect-azurevm/log-analytics-advanced-settings-azure-portal.png) 
 
4. Select **Connected Sources**, and then select **Linux Servers**.

5. The value to the right of **Workspace ID** and **Primary Key**. Copy and paste both into your favorite editor.

## Install the agent for Linux

The following steps configure setup of the agent for Log Analytics in Azure and Azure Government cloud.  

>[!NOTE]
>The Log Analytics agent for Linux cannot be configured to report to more than one Log Analytics workspace.  

If your Linux computer needs to communicate through a proxy server to Log Analytics, the proxy configuration can be specified on the command line by including `-p [protocol://][user:password@]proxyhost[:port]`.  The *proxyhost* property accepts a fully qualified domain name or IP address of the proxy server. 

For example: `https://user01:password@proxy01.contoso.com:30443`

1. To configure the Linux computer to connect to a Log Analytics workspace, run the following command providing the workspace ID and primary key copied earlier. The following command downloads the agent, validates its checksum, and installs it. 
    
    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

    The following command includes the `-p` proxy parameter and example syntax when authentication is required by your proxy server:

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://][user:password@]proxyhost[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

2. To configure the Linux computer to connect to Log Analytics workspace in Azure Government cloud, run the following command providing the workspace ID and primary key copied earlier. The following command downloads the agent, validates its checksum, and installs it. 

    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ``` 

    The following command includes the `-p` proxy parameter and example syntax when authentication is required by your proxy server:

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://][user:password@]proxyhost[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ```

3. Restart the agent by running the following command: 

    ```
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ``` 

## Collect event and performance data

Azure Monitor can collect events from the Linux Syslog and performance counters that you specify for longer term analysis and reporting. It can also take action when it detects a particular condition. Follow these steps to configure collection of events from the Linux Syslog, and several common performance counters to start with.  

1. In the Azure portal, select **All services**. In the list of resources, type Log Analytics. As you type, the list filters based on your input. Select **Log Analytics workspaces** and in your list of Log Analytics workspaces, select the workspace you are looking for and select **Advanced settings** of the **Log Analytics** workspace.

2. Select **Data**, and then select **Syslog**.  

3. You add syslog by typing in the name of the log. Enter **Syslog** and then select the plus sign **+**.  

4. In the table, uncheck the severities **Info**, **Notice** and **Debug**. 

5. Select **Save** at the top of the page to save the configuration.

6. Select **Linux Performance Data** to enable collection of performance counters on a Linux computer. 

7. When you first configure Linux Performance counters for a new Log Analytics workspace, you are given the option to quickly create several common counters. They are listed with a checkbox next to each.

    ![Default Linux performance counters selected in Azure Monitor](media/quick-collect-azurevm/linux-perfcounters-azure-monitor.png)

    Select **Apply below configuration to to my machines** and then select **Add the selected performance counters**. They are added and preset with a ten second collection sample interval.  

8. Select **Save** at the top of the page to save the configuration.

## View data collected

Now that you have enabled data collection, lets run a simple log search example to see some data from the target computer.  

1. In the selected workspace, from the left-hand pane, select **Logs**.

2. On the Logs query page, type `Perf` in the query editor and select **Run**.
 
    ![Log Analytics log search](media/quick-collect-windows-computer/log-analytics-portal-queryexample.png)

    For example, the query in the following image returned 10,000 Performance records. Your results will be significantly less.

    ![Log Analytics log search result](media/quick-collect-linux-computer/log-analytics-search-perf.png)

## Clean up resources

When no longer needed, you can remove the agent from the Linux computer and delete the Log Analytics workspace.  

To remove the agent, run the following command on the Linux computer. The *--purge* argument completely removes the agent and its configuration.

   `wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh --purge`

To delete the workspace, select the Log Analytics workspace you created earlier and on the resource page select **Delete**.

![Delete Log Analytics resource](media/quick-collect-azurevm/log-analytics-portal-delete-resource.png)

## Next steps

Now that you are collecting operational and performance data from your on-premises Linux computer, you can easily begin exploring, analyzing, and taking action on data that you collect for *free*.  

To learn how to view and analyze the data, continue to the tutorial.

> [!div class="nextstepaction"]
> [View or analyze data in Log Analytics](../../azure-monitor/learn/tutorial-viewdata.md)
