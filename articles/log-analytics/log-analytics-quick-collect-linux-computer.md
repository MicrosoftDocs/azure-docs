---
title: Configure Azure Log Analytics Agent for Hybrid Linux Computer | Microsoft Docs
description: Learn how to deploy the Log Analytics agent for Linux running on computers outside of Azure and enable data collection with Log Analytics.
services: log-analytics
documentationcenter: log-analytics
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 08/02/2018
ms.author: magoedte
ms.custom: mvc
ms.component: 
---

# Configure Log Analytics agent for Linux computers in a hybrid environment
[Azure Log Analytics](log-analytics-overview.md) can collect data directly from your physical or virtual Linux computer in your datacenter or other cloud environment into a single repository for detailed analysis and correlation.  This quickstart shows you how to configure and collect data from your Linux computer with a few easy steps.  For Azure Linux VMs, see the following topic [Collect data about Azure Virtual Machines](log-analytics-quick-collect-azurevm.md).  

To understand the supported configuration, review [supported Linux operating systems](log-analytics-concept-hybrid.md#supported-linux-operating-systems) and [network firewall configuration](log-analytics-concept-hybrid.md#network-firewall-requirements).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure portal
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 

## Create a workspace
1. In the Azure portal, click **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.<br><br> ![Azure portal](media/log-analytics-quick-collect-azurevm/azure-portal-01.png)<br><br>  
2. Click **Create**, and then select choices for the following items:

  * Provide a name for the new **OMS Workspace**, such as *DefaultLAWorkspace*. 
  * Select a **Subscription** to link to by selecting from the drop-down list if the default selected is not appropriate.
  * For **Resource Group**, select an existing resource group that contains one or more Azure virtual machines.  
  * Select the **Location** your VMs are deployed to.  For additional information, see which [regions Log Analytics is available in](https://azure.microsoft.com/regions/services/).  
  * If you are creating a workspace in a new subscription created after April 2, 2018, it will automatically use the *Per GB* pricing plan and the option to select a pricing tier will not be available.  If you are creating a workspace for an existing subscription created before April 2, or to subscription that was tied to an existing EA enrollment, select your preferred pricing tier.  For additional information about the particular tiers, see [Log Analytics Pricing Details](https://azure.microsoft.com/pricing/details/log-analytics/).

        ![Create Log Analytics resource blade](./media/log-analytics-quick-collect-azurevm/create-loganalytics-workspace-02.png)<br>  

3. After providing the required information on the **OMS Workspace** pane, click **OK**.  

While the information is verified and the workspace is created, you can track its progress under **Notifications** from the menu. 

## Obtain workspace ID and key
Before installing the OMS agent for Linux, you need the workspace ID and key for your Log Analytics workspace.  This information is required by the agent wrapper script to properly configure the agent and ensure it can successfully communicate with Log Analytics.  

1. In the Azure portal, click **All services** found in the upper left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
2. In your list of Log Analytics workspaces, select *DefaultLAWorkspace* created earlier.
3. Select **Advanced settings**.<br><br> ![Log Analytics Advance Settings](media/log-analytics-quick-collect-azurevm/log-analytics-advanced-settings-01.png)<br><br>  
4. Select **Connected Sources**, and then select **Linux Servers**.   
5. The value to the right of **Workspace ID** and **Primary Key**. Copy and paste both into your favorite editor.   

## Install the agent for Linux
The following steps configure setup of the agent for Log Analytics in Azure and Azure Government cloud.  

>[!NOTE]
>The OMS agent for Linux cannot be configured to report to more than one Log Analytics workspace.  

If your Linux computer needs to communicate through a proxy server to Log Analytics, the proxy configuration can be specified on the command line by including `-p [protocol://][user:password@]proxyhost[:port]`.  The *proxyhost* property accepts a fully qualified domain name or IP address of the proxy server. 

For example: `https://user01:password@proxy01.contoso.com:30443`

1. To configure the Linux computer to connect to Log Analytics, run the following command providing the workspace ID and primary key copied earlier.  The following command downloads the agent, validates its checksum, and installs it. 
    
    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

    The following command includes the `-p` proxy parameter and example syntax.

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://][user:password@]proxyhost[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

2. To configure the Linux computer to connect to Log Analytics in Azure Government cloud, run the following command providing the workspace ID and primary key copied earlier.  The following command downloads the agent, validates its checksum, and installs it. 

    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ``` 

    The following command includes the `-p` proxy parameter and example syntax.

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://][user:password@]proxyhost[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ```
2. Restart the agent by running the following command: 

    ```
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ``` 

## Collect event and performance data
Log Analytics can collect events from the Linux Syslog and performance counters that you specify for longer term analysis and reporting, and take action when a particular condition is detected.  Follow these steps to configure collection of events from the Linux Syslog, and several common performance counters to start with.  

1. Select **Syslog**.  
2. You add an event log by typing in the name of the log.  Type **Syslog** and then click the plus sign **+**.  
3. In the table, uncheck the severities **Info**, **Notice** and **Debug**. 
4. Click **Save** at the top of the page to save the configuration.
5. Select **Linux Performance Data** to enable collection of performance counters on a Windows computer. 
6. When you first configure Linux Performance counters for a new Log Analytics workspace, you are given the option to quickly create several common counters. They are listed with a checkbox next to each.<br><br> ![Default Windows performance counters selected](media/log-analytics-quick-collect-azurevm/linux-perfcounters-default.png)<br> Click **Add the selected performance counters**.  They are added and preset with a ten second collection sample interval.  
7. Click **Save** at the top of the page to save the configuration.

## View data collected
Now that you have enabled data collection, lets run a simple log search example to see some data from the target computer.  

1. In the Azure portal, navigate to Log Analytics and select the workspace created earlier.
2. Click the **Log Search** tile and on the Log Search pane, in the query field type `Perf` and then hit enter or click the search button to the right of the query field.<br><br> ![Log Analytics log search query example](media/log-analytics-quick-collect-linux-computer/log-analytics-portal-queryexample.png)<br><br> For example, the query in the following image returned 735 Performance records.<br><br> ![Log Analytics log search result](media/log-analytics-quick-collect-linux-computer/log-analytics-search-perf.png)

## Clean up resources
When no longer needed, you can remove the agent from the Linux computer and delete the Log Analytics workspace.  

To remove the agent, run the following command on the Linux computer.  The *--purge* argument completely removes the agent and its configuration.

   `wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh --purge`

To delete the workspace, select the Log Analytics workspace you created earlier and on the resource page click **Delete**.<br><br> ![Delete Log Analytics resource](media/log-analytics-quick-collect-azurevm/log-analytics-portal-delete-resource.png)

## Next steps
Now that you are collecting operational and performance data from your on-premises Linux computer, you can easily begin exploring, analyzing, and taking action on data that you collect for *free*.  

To learn how to view and analyze the data, continue to the tutorial.   

> [!div class="nextstepaction"]
> [View or analyze data in Log Analytics](log-analytics-tutorial-viewdata.md)
