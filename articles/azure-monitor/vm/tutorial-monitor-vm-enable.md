---
title: Tutorial - Enable monitoring for Azure virtual machine
description: Enable monitoring with VM insights in Azure Monitor to monitor an Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/19/2021
---

# Tutorial: Enable monitoring for Azure virtual machine
VM insights is a feature of Azure Monitor for monitoring the guest operating system and workloads running on Azure virtual machines. When you enable monitoring for an Azure virtual machine, it installs the necessary agents and starts collecting performance, process, and dependency information from the guest operating system. 


> [!NOTE]
> Prior to the Azure Monitor agent, guest metrics for Azure virtual machines were collected with the [Azure diagnostic extension](../agents/diagnostics-extension-overview.md) for Windows (WAD) and Linux (LAD). These agents are still available and can be configured with the **Diagnostic settings** menu item for the virtual machine, but they are in the process of being replaced with Azure Monitor agent.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace to collect performance and log data from the virtual machine.
> * Enable VM insights for the virtual machine which installs the required agents and begins data collection. 
> * Inspect graphs analyzing performance data collected form the virtual machine. 
> * Inspect map showing processes running on the virtual machine and dependencies with other systems.



## Prerequisites
To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.



## Create a Log Analytics workspace
[!INCLUDE [Create workspace](../../../includes/azure-monitor-tutorial-workspace.md)]


## Enable monitoring
Select **Insights** from your virtual machine's menu in the Azure portal. If VM insights hasn't yet been enabled for it, you should see a screen similar to the following allowing you to enable monitoring. Click **Enable**.

> [!NOTE]
> If you selected the option to **Enable detailed monitoring** when you created your virtual machine, VM insights may already be enabled.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights.png" lightbox="media/tutorial-monitor-vm/enable-vminsights.png" alt-text="Enable VM insights":::

Select your workspace and click **Enable**. This is the workspace where data collected by VM insights will be sent.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights-02.png" lightbox="media/tutorial-monitor-vm/enable-vminsights-02.png" alt-text="Enable VM insights with workspace":::

You'll see a message saying that monitoring is being enabled. It may take several minutes for the agent to be installed and for data collection to begin. When the deployment is complete, you'll see views in the **Performance** tab in VM insights with performance data for the machine.

> [!NOTE]
> You may receive a message about an upgrade being available for VM insights. If so, select the option to perform the upgrade before proceeding.

## View performance
Select the performance tab to view details about the virtual machine's disks and values of key guest metrics over time. 

:::image type="content" source="media/tutorial-monitor-vm/performance.png" lightbox="media/tutorial-monitor-vm/performance.png" alt-text="VM insights performance view":::

## ## View processes and dependencies
Select the **Maps** tab to view processes and dependencies for the virtual machine. The current machine is at the center of the view. View the processes running on it by expanding **Processes**.

:::image type="content" source="media/tutorial-monitor-vm/performance.png" lightbox="media/tutorial-monitor-vm/performance.png" alt-text="VM insights performance view":::


## View machine details
The **Maps** view provides different 


## Next steps


