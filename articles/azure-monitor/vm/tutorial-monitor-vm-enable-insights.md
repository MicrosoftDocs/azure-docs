---
title: Enable monitoring with VM insights for Azure virtual machine
description: Enable monitoring with VM insights in Azure Monitor to monitor an Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 12/03/2022
ms.reviewer: Xema Pathak
---

# Tutorial: Enable monitoring with VM insights for Azure virtual machine
VM insights is a feature of Azure Monitor that quickly gets you started monitoring your virtual machines. You can view trends of performance data, running processes on individual machines, and dependencies between machines. VM insights installs the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) which is required to collect the guest operating system and prepares you to configure additional monitoring from your VMs according to your particular requirements. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable VM insights for a virtual machine which installs the Azure Monitor agent and begins data collection.
> * Enable optional collection of detailed process and telemetry to enable the Map feature of VM insights.
> * Inspect graphs analyzing performance data collected from the virtual machine. 
> * Inspect map showing processes running on the virtual machine and dependencies with other systems.


## Prerequisites
To complete this tutorial, you need the following: 

- An Azure virtual machine to monitor.

> [!NOTE]
> If you selected the option to **Enable virtual machine insights** when you created your virtual machine, then VM insights will already be enabled. If the machine was previously enabled for VM insights using Log Analytics agent, see [Enable VM insights in the Azure portal](vminsights-enable-portal.md) for upgrading to Azure Monitor agent.



## Enable VM insights
Select **Insights** from your virtual machine's menu in the Azure portal. If VM insights hasn't been enabled, you should see a short description of it and an option to enable it. Click **Enable** to open the **Monitoring configuration** pane. Leave the default option of **Azure Monitor agent**. 

In order to reduce cost for data collection, VM insights creates a default [data collection rule](../essentials/data-collection-rule-overview.md) that doesn't include collection of processes and dependencies. To enable this collection, click **Create new** to create a new data collection rule.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights.png" lightbox="media/tutorial-monitor-vm/enable-vminsights.png" alt-text="Screenshot for enabling VM insights with workspace":::

Provide a **Data collection rule name** and then select **Enable processes and dependencies (Map)**. You can't disable collection of guest performance since this is required for VM insights.

Keep the default Log Analytics workspace for the subscription unless you have another workspace that you want to use. Click **Create** to create the new data collection rule. and then **Configure** to start VM insights configuration.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights-create-new-rule.png" lightbox="media/tutorial-monitor-vm/enable-vminsights-create-new-rule.png" alt-text="Screenshot for configuring new data collection rule":::


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
VM insights collects performance data from the VM guest operating system, but it doesn't collect log data such as Windows event log or syslog. Now that you have the machine monitored with the Azure Monitor agent, you can create an additional data collection rule to perform this collection.

> [!div class="nextstepaction"]
> [Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md)

