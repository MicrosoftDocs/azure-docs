---
title: VM insights with Azure Monitor agent (Preview)
description: Describes how to use the Azure Monitor agent with VM insights.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/23/2022
ms.custom: references_regions

---

#  VM insights with Azure Monitor agent (Preview)
[Azure Monitor agent](../agents/azure-monitor-agent-overview.md) is in the process of replacing the Log Analytics agent. VM insights support for virtual machines running Azure Monitor agent is currently in public preview. This article describes the changes in VM insights using virtual machines with the Azure Monitor agent. 


## Comparing operation of agents
Azure Monitor agent includes several advantages over Log Analytics agent, and is the preferred agent for virtual machines and virtual machine scale sets. See [Migrate to Azure Monitor agent from Log Analytics age(../agents/azure-monitor-agent-migration.md) for comparison of the agent and information on migrating.

The most significant differences between the agents in relation to VM insights are:

- You have no control over the data that VM insights collects from machines with the Log Analytics agent. You must [configure the Log Analytics workspace](../agents/agent-data-sources.md) if you want to collect additional data, and all machines connecting to the same workspace receive the same configuration. Azure Monitor agent uses [data collection rules](../essentials/data-collection-rule-overview.md) which can apply a unique configuration to different machines. VM insights creates a default DCR that you can modify to collect additional data. You can also create custom DCRs and associate them with different machines.
- The Log Analytics agent can only send data to a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md). The Azure Monitor agent can send data to both [Logs and Metrics](../data-platform.md) allowing you to leverage the advantages of each. 


## Changes to enabling VM insights
You no longer need to [enable VM insights on the Log Analytics workspace](vminsights-enable-portal.md#enable-vm-insights) since the VMinsights management pack isn't used by Azure Monitor agent.

> [!NOTE]
> You can't currently enable the Azure Monitor agent from the virtual machine's menu in the Azure portal. You must use the Azure Monitor menu.




## Changes to Overview page

The following changes have been made to the **Overiew** page in VM insights.

- **Data collection rule** column has replaced the **Workspace** column. This either shows the data collection rules used by the Azure Monitor agent for each machine, or it gives the option to configure with the Azure Monitor agent.

## Data collection
Data collection rules for VM insights are defined by the following three options:

| Option | Description |
|:---|:---|
| Guest performance | Specifies whether to collect performance data from the guest operating system. |
| Processes and dependencies | Collected details about processes running on the virtual machine and dependencies between machines. This enables the map feature in VM insights. |
| Log Analytics workspace | Specifies the workspace to send data.|

## Configure a new machine
Select **Not monitored** tab in VM insights to view virtual machines that aren't yet enabled for VM insights. Click **Enable** next to the virtual machine you want to enable for monitoring.

You first must select whether you want to enable VM insights using Azure Monitor agent or Log Analytics agent. If you select Log Analytics agent, then there are no other options since the agent gets its configuration from the workspace. This option will not be available after the public preview since only the Azure Monitor agent will be used.

> [!NOTE]
> If a virtual machine has the Log Analytics agent installed but not the Dependency agent, it will be listed as not monitored. In this case, the Azure Monitor agent will be started without being given the option for the Log Analytics agent.




## Migrate from Log Analytics agent
For any machines currently enabled with the Log Analytics, you must remove the Log Analytics agent yourself. You can add the Azure Monitor agent but this may lead to duplication of data and increased cost. If a machine has both the Log Analytics agent and the Azure Monitor agent installed, it will have a warning that you may be collecting duplicate data. 


If a virtual machine was already onboarded to VM insights with the Log Analytics agent, it will have a status of **Enabled** but have an option to **Configure using Azure Monitor Agent**. Click this option to open the same configuration page as a new machine.




Select the option **Configure using Azure Monitor Agent**.





## Both agents installed

:::image type="content" source="media/vminsights-azure-monitor-agent/both-agents-installed.png" alt-text="Both agents installed":::


## Next steps

To learn how to use the Performance monitoring feature, see [View VM insights Performance](../vm/vminsights-performance.md). To view discovered application dependencies, see [View VM insights Map](../vm/vminsights-maps.md).
