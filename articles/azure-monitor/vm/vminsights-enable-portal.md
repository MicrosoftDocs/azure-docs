---
title: Enable VM insights in the Azure portal
description: Learn how to enable VM insights on a single Azure virtual machine or virtual machine scale set using the Azure portal.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/08/2022

---

# Enable VM insights in the Azure portal
This article describes how to enable VM insights using the Azure portal for the following :

- Azure virtual machine
- Azure virtual machine scale set
- Hybrid virtual machine connected with Azure Arc

## Prerequisites

- [Create a Log Analytics workspace](./vminsights-configure-workspace.md). You can create a new workspace during this process, but you should use an existing workspace if you already have one. See [Log Analytics workspace overview](../logs/log-analytics-workspace-overview.md) and [Design a Log Analytics workspace architecture](../logs/workspace-design.md) for more information.
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported. 
- See [Manage the Azure Monitor agent](../agents/azure-monitor-agent-manage.md#prerequisites) for prerequisites related to Azure Monitor agent.


> [!NOTE]
> This process describes enabling VM insights from the **Monitor** menu in the Azure portal. You can perform the same process from the **Insights** menu for a particular virtual machine or virtual machine scale set.

## View monitored and unmonitored machines
 The **Overview** page lists all of the virtual machines and virtual machine scale sets in the selected subscriptions. Machines will either be included in the **Monitored** or **Not monitored** tab depending on whether the machine is currently being monitored by VM insights. A machine may be listed in **Not monitored** even though it has the Azure Monitor or Log Analytics agent installed but has not been enabled for VM insights.




## Enable VM insights on unmonitored machine
Use this process to enable VM insights for machines that are not currently being monitored. The following example shows an Azure virtual machine, but the menu is similar for Azure virtual machine scale set or Azure Arc.

From the **Overview** page for VM insights, select **Not Monitered**. Click the **Enable** button next to any machine that you want to enable. If a machine is currently running, then you must start it to enable it.

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored.png" lightbox="media/vminsights-enable-portal/enable-unmonitored.png" alt-text="Screenshot with unmonitored machines in V M insights.":::
 
Click **Enable** on the introduction page to view the configuration. The **Monitoring configuration** page allows you to select whether you will use the **Azure Monitor agent** or the **Log Analytics agent**. Azure Monitor agent is strongly recommended because of its considerable advantages. The Log Analytics agent is on a deprection path as described in [Log Analytics agent overview](../agents/log-analytics-agent.md).

> [!NOTE]
> If a virtual machine has the Log Analytics agent installed but not the Dependency agent, it will be listed as not monitored. In this case, the Azure Monitor agent will be started without being given the option for the Log Analytics agent.


### Azure Monitor agent
If you select Azure Monitor agent, you need to specify a [data collection rule (DCR)](vminsights-enable-overview.md#data-collection-rule-azure-monitor-agent). If one hasn't already been created for unmonitored machines, then one will be created with the following details. Click **Configure** to select the Log Analytics workspace.

- **Guest performance** enabled.
-  **Processes and dependencies** disabled.

> [!NOTE]
> You can only select data collection rules that are configured for VM insights.

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored-configure-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/enable-unmonitored-configure-azure-monitor-agent.png" alt-text="Screenshot showing monitoring configuration for Azure Monitor agent for unmonitored machine.":::

If you want to collect process and dependencies to enable the [map feature of VM insights](vminsights-maps.md), then either create a new data collection rule, or select one that was created for [monitored machines](#enable-azure-monitor-agent-on-monitored-machines).

To create a new data collection rule, click **Create new** and provide the required information.

:::image type="content" source="media/vminsights-enable-portal/create-data-collection-rule.png" lightbox="media/vminsights-enable-portal/create-data-collection-rule.png" alt-text="Screenshot showing screen for creating new data collection rule.":::

It will take several minutes for the agent to be installed and data to start being collected. You'll receive status messages as the configuration is performed.

> [!NOTE]
> A system-assigned managed identity will be added for the machine if one doesn't already exist.
### Log Analytics agent
If you select Log Analytics agent, you only need to specify the Log Analytics workspace that the agent will use. VM insights will configure the data to collect.

If the virtual machine isn't already connected to a Log Analytics workspace, then you'll be prompted to select one. If you haven't previously [created a workspace](../logs/quick-create-workspace.md), then you can select a default for the location where the virtual machine or virtual machine scale set is deployed in the subscription. This workspace will be created and configured if it doesn't already exist. If you select an existing workspace, it will be configured for VM insights if it wasn't already.

> [!NOTE]
> If you select a workspace that wasn't previously configured for VM insights, the *VMInsights* management pack will be added to this workspace. This will be applied to any agent already connected to the workspace, whether or not it's enabled for VM insights. Performance data will be collected from these virtual machines and stored in the *InsightsMetrics* table.

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored-configure-log-analytics-agent.png" lightbox="media/vminsights-enable-portal/enable-unmonitored-configure-log-analytics-agent.png" alt-text="Screenshot showing monitoring configuration for Log Analytics agent."::: 

Click **Configure** to modify the configuration. The only option you can modify is the workspace. You will receive status messages as the configuration is performed.


>[!NOTE]
>If you use a manual upgrade model for your virtual machine scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.


## Enable Azure Monitor agent on monitored machines
From the **Monitored** tab, click **Configure using Azure Monitor agent** to enable Azure Monitor agent on machines that already being monitored with the Log Analytics agent. This will initiate the process described in [Enable VM insights on unmonitored machine](#enable-vm-insights-on-unmonitored-machine). If a data collection rule hasn't already been created for monitored machines, then one will be created with the following details. Click **Configure** to select the workspace.

- **Guest performance** enabled.
- **Processes and dependencies** enabled.
 

:::image type="content" source="media/vminsights-enable-portal/enable-monitored-configure-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/enable-monitored-configure-azure-monitor-agent.png" alt-text="Screenshot showing monitoring configuration for Azure Monitor agent for monitored machine.":::
 

Once you've verified that the Azure Monitor agent has been enabled, you should remove the Log Analytics agent from the machine to prevent duplicate data collection. If a machine has both agents installed, you'll have a warning in the Azure portal.

:::image type="content" source="media/vminsights-azure-monitor-agent/both-agents-installed.png" alt-text="Both agents installed":::


## Next steps

* See [Use VM insights Map](vminsights-maps.md) to view discovered application dependencies. 
* See [View Azure VM performance](vminsights-performance.md) to identify bottlenecks, overall utilization, and your VM's performance.
