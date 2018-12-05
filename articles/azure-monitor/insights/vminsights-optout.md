---
title: How to Disable Monitoring with Azure Monitor for VMs (Preview) | Microsoft Docs
description: This article describes how you can discontinue monitoring of your virtual machines with Azure Monitor for VMs.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 

ms.assetid: 
ms.service: azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/05/2018
ms.author: magoedte
---

# How to disable monitoring of your virtual machines with Azure Monitor for VMs (Preview)

If after you enable monitoring of your virtual machines you decide you no longer want to monitor them with Azure Monitor for VMs, you can disable monitoring. This article shows how to accomplish this for a single or multiple VMs.  

Currently, Azure Monitor for VMs does not support selectively disabling monitoring of your VMs. If your Log Analytics workspace is configured to support this solution and other solutions, as well as collect other monitoring data, it's important you understand the impact and methods described below before proceeding.

Azure Monitor for VMs relies on the following components to deliver its experience:

* A Log Analytics workspace, which stores monitoring data collected from VMs and other sources.
* Collection of performance counters configured in the workspace, which updates monitoring configuration on all VMs connected to the workspace.
* Two monitoring solutions configured in the workspace - **InfrastructureInsights** and **ServiceMap**, which update monitoring configuration on all VMs connected to the workspace.
* Two Azure virtual machine extensions, the **MicrosoftMonitoringAgent** and the **DepenendencyAgent**, which collect and send data to the workspace.

Consider the following when preparing to disable monitoring of your virtual machines with Azure Monitor for VMs:

* If you are evaluating with a single VM and you accepted the pre-selected default Log Analytics workspace, you can disable monitoring by uninstalling the Dependency agent from the VM and disconnecting the Log Analytics agent from this workspace. This approach is appropriate if you intend on using the VM for other purposes and decide later to reconnect it to a different workspace.
* If you are using the Log Analytics workspace to support other monitoring solutions and collection of data from other sources, you can remove Azure Monitor for VMs solution components from the workspace without interruption or impact to your workspace.  

>[!NOTE]
> After removing the solution components from your workspace, you may continue to see health state from your Azure VMs; specifically performance and map data when you navigate to either view in the portal. Data will eventually stop appearing from the Performance and Map view after sometime; however the Health view will continue to show health status for your VMs. The **Try now** option will be available from the selected Azure VM to allow you to re-enable monitoring in the future.  

## Complete removal of Azure Monitor for VMs

The following steps describe how to completely remove Azure Monitor for VMs if you still require the Log Analytics workspace. You are going to remove the **InfastructureInsights** and **ServiceMap** solutions from the workspace.  

>[!NOTE]
>If you were using the Service Map monitoring solution previous to enabling Azure Monitor for VMs and you still rely on it, do not remove that solution as described in step 6 below.  
>

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. In the Azure portal, click **All services**. In the list of resources, type Log Analytics. As you begin typing, the list filters based on your input. Select **Log Analytics**.
3. In your list of Log Analytics workspaces, select the workspace you chose when onboarding Azure Monitor for VMs.
4. From the left pane, select **Solutions**.  
5. In the list of solutions, select **InfrastructureInsights(workspace name)**, and then on the **Overview** page for the solution, click **Delete**.  When prompted to confirm, click **Yes**.  
6. From the list of solutions, select **ServiceMap(workspace name)**, and then on the **Overview** page for the solution, click **Delete**.  When prompted to confirm, click **Yes**.  

If before onboarding Azure Monitor for VMs, you were not [collecting the performance counters enabled](vminsights-onboard.md?toc=/azure/azure-monitor/toc.json#performance-counters-enabled) for the Windows or Linux-based VMs in your workspace, you need to disable those rules by following the steps described [here](../../azure-monitor/platform/data-sources-performance-counters.md?toc=/azure/azure-monitor/toc.json#configuring-performance-counters) for Windows and for Linux.

## Disable monitoring for an Azure VM and retain workspace  

The following steps describe how to disable monitoring for a virtual machine that was enabled to evaluate Azure Monitor for VMs, but the Log Analytics workspace is still required to support monitoring from other sources. If this is an Azure VM, you are going to remove the Dependency agent VM extension and Log Analytics agent VM extension for Windows/Linux directly from the VM. 

>[!NOTE]
>If the virtual machine is managed by Azure Automation to orchestrate processes, manage configuration, or manage updates, or managed by Azure Security Center for security management and threat detection, the Log Analytics agent should not be removed. Otherwise, you will prevent those services and solutions from proactively managing your VM. 

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 
2. In the Azure portal, select **Virtual Machines**. 
3. From the list, select a VM. 
4. From the left pane, select **Extensions** and on the **Extensions** page, select **DependencyAgent**.
5. On the extension properties page, click **Uninstall**.
6. On the **Extensions** page, select **MicrosoftMonitoringAgent** and on the extension properties page, click **Uninstall**.  
