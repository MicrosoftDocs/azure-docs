---
title: Enable monitoring with VM insights for Azure virtual machine
description: Enable monitoring with VM insights in Azure Monitor to monitor an Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 12/03/2022
ms.reviewer: Xema Pathak
---

# Enable monitoring with VM insights for Azure virtual machine
To monitor the guest operating system and workloads on an Azure virtual machine, you need to install the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and create a [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that specifies which data to collect. One option is to use VM insights, which installs the agent and starts collecting a predefined set of performance counters. You can optionally enable the collection detailed process and telemetry to enable the Map feature of VM insights which gives you a visual representation of your VM environment.


> [!NOTE]
> If you're completely new to Azure Monitor, you should start with [Tutorial: Monitor Azure resources with Azure Monitor](../essentials/monitor-azure-resource.md). Azure virtual machines generate similar monitoring data as other Azure resources such as platform metrics and Activity log. This tutorial describes how to enable additional monitoring unique to virtual machines.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace to collect performance and log data from the virtual machine.
> * Enable VM insights for the virtual machine which installs the required agents and begins data collection. 
> * Inspect graphs analyzing performance data collected from the virtual machine. 
> * Inspect map showing processes running on the virtual machine and dependencies with other systems.


> [!NOTE]
> VM insights installs the Azure Monitor agent which collects performance data from the guest operating system of virtual machines. It doesn't collect logs from the guest operating system and doesn't send performance data to Azure Monitor Metrics. For this functionality, see [Tutorial: Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md).

## Prerequisites
To complete this tutorial, you need the following: 

- An Azure virtual machine to monitor.

> [NOTE!]
> If you selected the option to **Enable virtual machine insights** when you created your virtual machine, then VM insights will already be enabled. If the machine was previously enabled for VM insights using Log Analytics agent, see [Enable VM insights in the Azure portal](vminsights-enable-portal.md) for upgrading to Azure Monitor agent.



## Enable VM insights
Select **Insights** from your virtual machine's menu in the Azure portal. If VM insights hasn't been enabled, you should see a short description of it and an option to enable it. Click **Enable** to open the **Monitoring configuration** pane. Leave the default option of **Azure Monitor agent**. VM insights will create a default data collection rule that doesn't include collection of processes and dependencies. Click **Create new** to create a new data collection rule.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights.png" lightbox="media/tutorial-monitor-vm/enable-vminsights.png" alt-text="Enable VM insights with workspace":::

Provide a **Data collection rule name** and then select **Enable processes and dependencies (Map)**. Keep the default Log Analytics workspace for the subscription unless you have another workspace that you want to use. Click **Create** to create the new data collection rule. and then **Configure** to start VM insights configuration.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights-create-new-rule.png" lightbox="media/tutorial-monitor-vm/enable-vminsights-create-new-rule.png" alt-text="Enable VM insights with workspace":::


You'll see a message saying that monitoring is being enabled. It may take several minutes for the agent to be installed and for data collection to begin. 



## View performance
When the deployment is complete, you'll see views in the **Performance** tab in VM insights with performance data for the machine. This shows you the values of key guest metrics over time. 

:::image type="content" source="media/tutorial-monitor-vm/performance.png" lightbox="media/tutorial-monitor-vm/performance.png" alt-text="VM insights performance view":::

## View processes and dependencies
Select the **Maps** tab to view processes and dependencies for the virtual machine. The current machine is at the center of the view. View the processes running on it by expanding **Processes**.

:::image type="content" source="media/tutorial-monitor-vm/map-processes.png" lightbox="media/tutorial-monitor-vm/map-processes.png" alt-text="VM insights map view with processes":::


## View machine details
The **Maps** view provides different tabs with information collected about the virtual machine. Click through the tabs to see what's available.

:::image type="content" source="media/tutorial-monitor-vm/map-details.png" lightbox="media/tutorial-monitor-vm/map-details.png" alt-text="VM insights map view with machine details":::

## Next steps
Now that you're collecting data from the virtual machine, you can use that data to create alerts to proactively notify you when issues are detected.

> [!div class="nextstepaction"]
> [Create alert when Azure virtual machine is unavailable](tutorial-monitor-vm-alert.md)

