---
title: Enable VM insights in the Azure portal
description: Learn how to enable VM insights on a single Azure virtual machine or virtual machine scale set using the Azure portal.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: xpathak
ms.date: 12/15/2022

---

# Enable VM insights in the Azure portal
This article describes how to enable VM insights using the Azure portal for Azure virtual machines, Azure virtual machine scale sets, and hybrid virtual machines connected with [Azure Arc](../../azure-arc/overview.md).

## Prerequisites

- [Create a Log Analytics workspace](./vminsights-configure-workspace.md). You can create a new workspace during this process, but you should use an existing workspace if you already have one. See [Log Analytics workspace overview](../logs/log-analytics-workspace-overview.md) and [Design a Log Analytics workspace architecture](../logs/workspace-design.md) for more information.
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported. 
- See [Manage the Azure Monitor agent](../agents/azure-monitor-agent-manage.md#prerequisites) for prerequisites related to Azure Monitor agent.

## View monitored and unmonitored machines

To see which virtual machines in your directory are monitored using VM insights, from the Azure portal:

1. From the **Monitor** menu, select **Virtual Machines** > **Overview**. 

    The **Overview** page lists all of the virtual machines and virtual machine scale sets in the selected subscriptions. 

1. Select the **Monitored** tab for the list of machines that have VM insights enabled.
    
1. Select the **Not monitored** tab for the list of machines that do not have VM insights enabled. 

    A machine may be listed in **Not monitored** even though it has the Azure Monitor or Log Analytics agent installed but has not been enabled for VM insights. If a virtual machine has the Log Analytics agent installed but not the Dependency agent, it will be listed as not monitored. In this case, the Azure Monitor agent will be started without being given the option for the Log Analytics agent.

## Enable VM insights for Azure Monitor Agent
> [!NOTE]
> A system-assigned managed identity will be added for a machine as part of the installation process of Azure Monitor Agent if one doesn't already exist.

To enable VM insights on an unmonitored virtual machine or virtual machine scale set using Azure Monitor Agent:

1. Select **Virtual Machines** from the **Monitor** menu in the Azure portal.

1. From the **Overview** page, select **Not Monitored**. 
 
1. Select **Enable** next to any machine that you want to enable. If a machine is currently running, you must start it to enable it.

    :::image type="content" source="media/vminsights-enable-portal/enable-unmonitored.png" lightbox="media/vminsights-enable-portal/enable-unmonitored.png" alt-text="Screenshot with unmonitored machines in V M insights.":::
 
1. Select **Enable** on the **Insights Onboarding** page. 
 
1. On the **Monitoring configuration** page, select **Azure Monitor agent** and select a [data collection rule](vminsights-enable-overview.md#data-collection-rule-azure-monitor-agent) from the **Data collection rule** dropdown. 

    :::image type="content" source="media/vminsights-enable-portal/vm-insights-monitoring-configuration.png" lightbox="media/vminsights-enable-portal/vm-insights-monitoring-configuration.png" alt-text="Screenshot that shows the Monitoring configuration screen for V M insights."::: 

    The **Data collection rule** dropdown lists only rules configured for VM insights. If a data collection rule hasn't already been created for VM insights, Azure Monitor creates a rule with: 

    - **Guest performance** enabled.
    - **Processes and dependencies** disabled.

    Select **Create new** to create a new data collection rule. This lets you select a workspace and specify whether to collect processes and dependencies using the [VM insights Map feature](vminsights-maps.md).

    :::image type="content" source="media/vminsights-enable-portal/create-data-collection-rule.png" lightbox="media/vminsights-enable-portal/create-data-collection-rule.png" alt-text="Screenshot showing screen for creating new data collection rule.":::

1. Select **Configure** to start the configuration process. It takes several minutes to install the agent and start collecting data. You'll receive status messages as the configuration is performed.
 
1. If you use a manual upgrade model for your virtual machine scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.


## Enable VM insights for Log Analytics agent

To enable VM insights on an unmonitored virtual machine or virtual machine scale set using Log Analytics agent:

1. Select **Virtual Machines** from the **Monitor** menu in the Azure portal.

1. From the **Overview** page, select **Not Monitored**. 
 
1. Select **Enable** next to any machine that you want to enable. If a machine is currently running, then you must start it to enable it.

    :::image type="content" source="media/vminsights-enable-portal/enable-unmonitored.png" lightbox="media/vminsights-enable-portal/enable-unmonitored.png" alt-text="Screenshot with unmonitored machines in V M insights.":::
 
1. Select **Enable** on the **Insights Onboarding** page. 
 
1. Select **Log Analytics agent** on the **Monitoring configuration** page. 

1. If the virtual machine isn't already connected to a Log Analytics workspace, then you'll be prompted to select one. If you haven't previously [created a workspace](../logs/quick-create-workspace.md), then you can select a default for the location where the virtual machine or virtual machine scale set is deployed in the subscription. This workspace will be created and configured if it doesn't already exist. If you select an existing workspace, it will be configured for VM insights if it wasn't already.

    > [!NOTE]
    > If you select a workspace that wasn't previously configured for VM insights, the *VMInsights* management pack will be added to this workspace. This will be applied to any agent already connected to the workspace, whether or not it's enabled for VM insights. Performance data will be collected from these virtual machines and stored in the *InsightsMetrics* table.

1. Select **Configure** to modify the configuration. The only option you can modify is the workspace. You will receive status messages as the configuration is performed.
 
1. If you use a manual upgrade model for your virtual machine scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.


## Enable Azure Monitor Agent on monitored machines

To add Azure Monitor Agent to machines that are already enabled with the Log Analytics agent. 

1. Select **Virtual Machines** from the **Monitor** menu in the Azure portal.
 
1. From the **Overview** page, select **Monitored**.
 
1. Select **Configure using Azure Monitor agent** next to any machine that you want to enable. If a machine is currently running, you must start it to enable it.

    :::image type="content" source="media/vminsights-enable-portal/add-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/add-azure-monitor-agent.png" alt-text="Screenshot showing monitoring configuration to Azure Monitor agent to monitored machine.":::


1. Follow the process described in [Enable VM insights for Azure Monitor agent
](#enable-vm-insights-for-azure-monitor-agent) to select a data collection rule. The only difference is that the data collection rule hasn't created for monitored machines has **Processes and dependencies** enabled for backward compatibility with the Log Analytics agent.
 
    :::image type="content" source="media/vminsights-enable-portal/enable-monitored-configure-azure-monitor-agent.png" lightbox="media/vminsights-enable-portal/enable-monitored-configure-azure-monitor-agent.png" alt-text="Screenshot showing monitoring configuration for Azure Monitor agent for monitored machine.":::

1. With both agents installed, a warning will be displayed indicating that you may be collecting duplicate data.

    :::image type="content" source="media/vminsights-enable-portal/both-agents-installed.png" lightbox="media/vminsights-enable-portal/both-agents-installed.png" alt-text="Screenshot showing warning message for both agents installed":::

    > [!WARNING]
    > Collecting duplicate data from a single machine with both the Azure Monitor agent and Log Analytics agent can result in the following consequences:
    >
    > - Additional ingestion cost from sending duplicate data to the Log Analytics workspace.
    > - The map feature of VM insights may be inaccurate since it does not check for duplicate data.
    > 
    > See [Migrate from Log Analytics agent](vminsights-enable-overview.md#migrate-from-log-analytics-agent).

1. Once you've verified that the Azure Monitor agent has been enabled, remove the Log Analytics agent from the machine to prevent duplicate data collection. 

## Next steps

* See [Use VM insights Map](vminsights-maps.md) to view discovered application dependencies. 
* See [View Azure VM performance](vminsights-performance.md) to identify bottlenecks, overall utilization, and your VM's performance.
