---
title: VM update and management with Azure Stack | Microsoft Docs
description: Learn how to use the Azure Monitor for VMs, Update Management, Change Tracking, and Inventory solutions in Azure Automation to manage Windows and Linux VMs that are deployed in Azure Stack. 
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: jeffgilb
ms.reviewer: rtiberiu
ms.lastreviewed: 03/20/2019
---

# Azure Stack VM update and management
You can use the following Azure Automation solution features to manage Windows and Linux VMs that are deployed using Azure Stack:

- **[Update Management](https://docs.microsoft.com/azure/automation/automation-update-management)**. With the Update Management solution, you can quickly assess the status of available updates on all agent computers and manage the process of installing required updates for these Windows and Linux VMs.

- **[Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking)**. Changes to installed software, Windows services, Windows registry and files, and Linux daemons on the monitored servers are sent to the Azure Monitor service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. By using the information on the Change Tracking dashboard, you can easily see the changes that were made in your server infrastructure.

- **[Inventory](https://docs.microsoft.com/azure/automation/automation-vm-inventory)**. The Inventory tracking for an Azure Stack virtual machine provides a browser-based user interface for setting up and configuring inventory collection.

- **[Azure Monitor for VMs](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-overview)**. Azure Monitor for VMs monitors your Azure and Azure Stack virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. 

> [!IMPORTANT]
> These solutions are the same as the ones used to manage Azure VMs. Both Azure and Azure Stack VMs are managed in the same way, from the same interface, using the same tools. The Azure Stack VMs are also priced the same as Azure VMs when using the Update Management, Change Tracking, Inventory, and Azure Monitor Virtual Machines solutions with Azure Stack.

## Prerequisites
Several prerequisites must be met before using these features to update and manage Azure Stack VMs. These include steps that must be taken in the Azure portal as well as the Azure Stack administration portal.

### In the Azure portal
To use the Azure Monitor for VMs, Inventory, Change Tracking, and Update Management Azure automation features for Azure Stack VMs, you first need to enable these solutions in Azure.

> [!TIP]
> If you already have these features enabled for Azure VMs, you can use your pre-existing LogAnalytics Workspace credentials. If you already have a LogAnalytics WorkspaceID and Primary Key that you want to use, skip ahead to [the next section](./vm-update-management.md#in-the-azure-stack-administration-portal). Otherwise, continue in this section to create a new LogAnalytics Workspace and automation account.

The first step in enabling these solutions is to [create a LogAnalytics Workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-quick-create-workspace) in your Azure subscription. A Log Analytics workspace is a unique Azure Monitor logs environment with its own data repository, data sources, and solutions. After you have created a workspace, note the WorkspaceID and Key. To view this information, go to the workspace blade, click on **Advanced settings**, and review the **Workspace ID** and **Primary Key** values. 

Next, you must [create an Automation Account](https://docs.microsoft.com/azure/automation/automation-create-standalone-account). An Automation Account is a container for your Azure Automation resources. It provides a way to separate your environments or further organize your Automation workflows and resources. Once the automation account is created, you need to enable the Inventory, Change tracking, and Update management features. To do this, follow these steps to enable each feature:

1. In the Azure portal, go to the Automation Account that you want to use.

2. Select the solution to enable (either **Inventory**, **Change tracking**, or **Update management**).

3. Use the **Select Workspace...** drop-down list to select the Log Analytics workspace to use.

4. Verify that all remaining information is correct, and then click **Enable** to enable the solution.

5. Repeat steps 2-4 to enable all three solutions. 

   [![](media/vm-update-management/1-sm.PNG "Enable automation account features")](media/vm-update-management/1-lg.PNG#lightbox)

### Enable Azure Monitor for VMs

Azure Monitor for VMs monitors your Azure virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes.

As a solution, Azure Monitor for VMs includes support for monitoring performance and application dependencies for VMs that are hosted on-premises or in another cloud provider. Three key features deliver in-depth insight:

1. Logical components of Azure VMs that run Windows and Linux: Are measured against pre-configured health criteria, and they alert you when the evaluated condition is met. 

2. Pre-defined trending performance charts: Display core performance metrics from the guest VM operating system.

3. Dependency map: Displays the interconnected components with the VM from various resource groups and subscriptions.

After the Log Analytics Workspace is created, you will need to enable performance counters in the workspace for collection on Linux and Windows VMs, as well as install and enable the ServiceMap and InfrastructureInsights solution in your workspace. The process is described in the [Deploy Azure Monitor for VMs](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-onboard#deploy-azure-monitor-for-vms) guide.

### In the Azure Stack Administration Portal
After enabling the Azure Automation solutions in the Azure portal, you next need to sign in to the Azure Stack administration portal as a cloud administrator and download the **Azure Monitor, Update and Configuration Management** and the **Azure Monitor, Update and Configuration Management for Linux** extension Azure Stack marketplace items. 

   ![Azure Monitor, update and configuration management extension marketplace item](media/vm-update-management/2.PNG) 

To enable the Azure Monitor for VMs Map solution and gain insights into the networking dependencies, you will need to also download the **Azure Monitor Dependency Agent**:

   ![Azure Monitor Dependency Agent](media/vm-update-management/2-dependency.PNG) 

## Enable Update Management for Azure Stack virtual machines
Follow these steps to enable update management for Azure Stack VMs.

1. Log into the Azure Stack user portal.

2. In the Azure Stack user-portal, go to the Extensions blade of the virtual machines for which you want to enable these solutions, click **+ Add**, select the **Azure Update and Configuration Management** extension, and click **Create**:

   [![](media/vm-update-management/3-sm.PNG "VM extension blade")](media/vm-update-management/3-lg.PNG#lightbox)

3. Provide the previously created WorkspaceID and Primary Key to link the agent with the LogAnalytics workspace and click **OK** to deploy the extension.

   [![](media/vm-update-management/4-sm.PNG "Providing the WorkspaceID and Key")](media/vm-update-management/4-lg.PNG#lightbox) 

4. As described in the [automation update management documentation](https://docs.microsoft.com/azure/automation/automation-update-management), you need to enable the Update Management solution for each VM that you want to manage. To enable the solution for all VMs reporting to the workspace, select **Update management**, click **Manage machines**, and then select the **Enable on all available and future machines** option.

   [![](media/vm-update-management/5-sm.PNG "Providing the WorkspaceID and Key")](media/vm-update-management/5-lg.PNG#lightbox) 

   > [!TIP]
   > Repeat this step to enable each solution for the Azure Stack VMs that report to the workspace. 
  
After the Azure Update and Configuration Management extension is enabled, a scan is performed twice per day for each managed VM. The API is called every 15 minutes to query for the last update time to determine whether the status has changed. If the status has changed, a compliance scan is initiated.

After the VMs are scanned, they will appear in the Azure Automation account in the Update Management solution: 

   [![](media/vm-update-management/6-sm.PNG "Providing the WorkspaceID and Key")](media/vm-update-management/6-lg.PNG#lightbox) 

> [!IMPORTANT]
> It can take between 30 minutes and 6 hours for the dashboard to display updated data from managed computers.

The Azure Stack VMs can now be included in scheduled update deployments together with Azure VMs.

## Enable Azure Monitor for VMs running on Azure Stack
Once the VM has the **Azure Monitor, Update and Configuration Management** and the **Azure Monitor Dependency Agent** extensions installed, it will start reporting data in the [Azure Monitor for VMs](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-overview) solution. 

> [!TIP]
> The **Azure Monitor Dependency Agent** extension doesn't require any parameters. The Azure Monitor for VMs Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports. The Map data is always transmitted by the Log Analytics agent to the Azure Monitor service, either directly or through the [OMS Gateway](https://docs.microsoft.com/azure/azure-monitor/platform/gateway) if your IT security policies don't allow computers on the network to connect to the internet.

Azure Monitor for VMs includes a set of performance charts that target several key performance indicators (KPIs) to help you determine how well a virtual machine is performing. The charts show resource utilization over a period of time so you can identify bottlenecks, anomalies, or switch to a perspective listing each machine to view resource utilization based on the metric selected. While there are numerous elements to consider when dealing with performance, Azure Monitor for VMs monitors key operating system performance indicators related to processor, memory, network adapter, and disk utilization. Performance complements the health monitoring feature and helps expose issues that indicate a possible system component failure, support tuning and optimization to achieve efficiency, or support capacity planning.

   ![Azure Monitor Performance tab](https://docs.microsoft.com/azure/azure-monitor/insights/media/vminsights-performance/vminsights-performance-aggview-01.png)

Viewing the discovered application components on Windows and Linux virtual machines running in Azure Stack can be observed in two ways with Azure Monitor for VMs, from a virtual machine directly or across groups of VMs from Azure Monitor.
The [Using Azure Monitor for VMs (preview) Map to understand application components](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-maps) article will help you understand the experience between the two perspectives and how to use the Map feature.

   ![Azure Monitor Performance tab](https://docs.microsoft.com/azure/azure-monitor/insights/media/vminsights-maps/map-multivm-azure-monitor-01.png)


## Enable Update Management using a Resource Manager template
If you have a large number of Azure Stack VMs, you can use [this Azure Resource Manager template](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/MicrosoftMonitoringAgent-ext-win) to more easily deploy the solution on VMs. The template deploys the Microsoft Monitoring Agent extension to an existing Azure Stack VM and adds it to an existing Azure LogAnalytics workspace.
 
## Next steps
[Optimize SQL Server VM performance](azure-stack-sql-server-vm-considerations.md)




