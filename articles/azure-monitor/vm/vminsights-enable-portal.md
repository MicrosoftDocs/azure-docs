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
Open VM insights by selecting **Virtual Machines** from the **Monitor** menu in the Azure portal. The **Overview** page lists all of the virtual machines and virtual machine scale sets in the selected subscriptions. Machines will either be included in the **Monitored** or **Not monitored** tab depending on whether the machine is currently being monitored by VM insights. 

A machine may be listed in **Not monitored** even though it has the Azure Monitor or Log Analytics agent installed but has not been enabled for VM insights. If a virtual machine has the Log Analytics agent installed but not the Dependency agent, it will be listed as not monitored. In this case, the Azure Monitor agent will be started without being given the option for the Log Analytics agent.

> [!NOTE]
>  **Data collection rule** column has replaced the **Workspace** column on the **Overview** page to support the [Azure Monitor agent](vminsights-enable-overview.md#agents). This either shows the data collection rules used by the Azure Monitor agent for each machine, or it gives the option to configure with the Azure Monitor agent.


## Enable VM insights for Azure Monitor agent
> [!NOTE]
> A system-assigned managed identity will be added for a machine as part of the installation process of the Azure Monitor agent if one doesn't already exist.

Use this procedure to enable an unmonitored virtual machine or virtual machine scale set using Azure Monitor agent.

1. Select **Virtual Machines** from the **Monitor** menu in the Azure portal.

1. From the **Overview** page, select **Not Monitored**. 
 
2. Click the **Enable** button next to any machine that you want to enable. If a machine is currently running, then you must start it to enable it.

    :::image type="content" source="media/vminsights-enable-portal/enable-unmonitored.png" lightbox="media/vminsights-enable-portal/enable-unmonitored.png" alt-text="Screenshot with unmonitored machines in V M insights.":::
 
3. Click **Enable** on the introduction page to view the configuration. 
 
4. Select **Azure Monitor agent** from the **Monitoring configuration** page and then select **Azure Monitor agent**. 

5. If a [data collection rule (DCR)](vminsights-enable-overview.md#data-collection-rule-azure-monitor-agent) hasn't already been created for unmonitored machines, then one will be created with the following details. 

    - **Guest performance** enabled.
    - **Processes and dependencies** disabled.

6. If you want this configuration, then click **Configure** to start the agent installation, or select a different data collection rule from the dropdown. Only data collection rules enabled for VM insights will be included.
 
7. If you want a different configuration or want to use a different Log Analytics workspace, then click **Create new** to create a new data collection rule. This will allow you to select a workspace and specify whether you want to collect processes and dependencies to enable the [map feature in VM insights](vminsights-maps.md).

:::image type="content" source="media/vminsights-enable-portal/create-data-collection-rule.png" lightbox="media/vminsights-enable-portal/create-data-collection-rule.png" alt-text="Screenshot showing screen for creating new data collection rule.":::

6. Click **Configure** to start the configuration process. It will take several minutes for the agent to be installed and data to start being collected. You'll receive status messages as the configuration is performed.
 
7. If you use a manual upgrade model for your virtual machine scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.




## Enable VM insights for Log Analytics agent
Use this procedure to enable an unmonitored virtual machine or virtual machine scale set using Log Analytics agent.

1. Select **Virtual Machines** from the **Monitor** menu in the Azure portal.

1. From the **Overview** page, select **Not Monitored**. 
 
2. Click the **Enable** button next to any machine that you want to enable. If a machine is currently running, then you must start it to enable it.

:::image type="content" source="media/vminsights-enable-portal/enable-unmonitored.png" lightbox="media/vminsights-enable-portal/enable-unmonitored.png" alt-text="Screenshot with unmonitored machines in V M insights.":::
 
3. Click **Enable** on the introduction page to view the configuration. 
 
4. Select **Azure Monitor agent** from the **Monitoring configuration** page and then select **Log Analytics agent**. 

5. If the virtual machine isn't already connected to a Log Analytics workspace, then you'll be prompted to select one. If you haven't previously [created a workspace](../logs/quick-create-workspace.md), then you can select a default for the location where the virtual machine or virtual machine scale set is deployed in the subscription. This workspace will be created and configured if it doesn't already exist. If you select an existing workspace, it will be configured for VM insights if it wasn't already.

    > [!NOTE]
    > If you select a workspace that wasn't previously configured for VM insights, the *VMInsights* management pack will be added to this workspace. This will be applied to any agent already connected to the workspace, whether or not it's enabled for VM insights. Performance data will be collected from these virtual machines and stored in the *InsightsMetrics* table.

6. Click **Configure** to modify the configuration. The only option you can modify is the workspace. You will receive status messages as the configuration is performed.
 
7. If you use a manual upgrade model for your virtual machine scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.


## Enable Azure Monitor agent on monitored machines
Use this procedure to add the Azure Monitor agent to machines that are already enabled with the Log Analytics agent. 

1. Select **Virtual Machines** from the **Monitor** menu in the Azure portal.
 
2. From the **Overview** page, select **Monitored**.
 
3. Click **Configure using Azure Monitor agent** next to any machine that you want to enable. If a machine is currently running, then you must start it to enable it.

    :::image type="content" source="media/vminsights-enable-portal/add-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/add-azure-monitor-agent.png" alt-text="Screenshot showing monitoring configuration to Azure Monitor agent to monitored machine.":::


1. Follow the process described in [Enable VM insights for Azure Monitor agent
](#enable-vm-insights-for-azure-monitor-agent) to select a data collection rule. The only difference is that the data collection rule hasn't created for monitored machines has **Processes and dependencies** enabled for backward compatibility with the Log Analytics agent.
 
    :::image type="content" source="media/vminsights-enable-portal/enable-monitored-configure-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/enable-monitored-configure-azure-monitor-agent.png" alt-text="Screenshot showing monitoring configuration for Azure Monitor agent for monitored machine.":::

5. With both agents installed, a warning will be displayed indicating that you may be collecting duplicate data.

    :::image type="content" source="media/vminsights-enable-portal/both-agents-installed.png" lightbox="media/vminsights-enable-portal/both-agents-installed.png" alt-text="Screenshot showing warning message for both agents installed":::

    > [!WARNING]
    > Collecting duplicate data from a single machine with both the Azure Monitor agent and Log Analytics agent can result in the following consequences:
    >
    > - Additional ingestion cost from sending duplicate data to the Log Analytics workspace.
    > - The map feature of VM insights may be inaccurate since it does not check for duplicate data.
    > 
    > See [Migrate from Log Analytics agent](vminsights-enable-overview.md#migrate-from-log-analytics-agent).

4. Once you've verified that the Azure Monitor agent has been enabled, remove the Log Analytics agent from the machine to prevent duplicate data collection. 

## Next steps

* See [Use VM insights Map](vminsights-maps.md) to view discovered application dependencies. 
* See [View Azure VM performance](vminsights-performance.md) to identify bottlenecks, overall utilization, and your VM's performance.
