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
This article describes the changes in VM insights to support the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md). VM insights requires an agent to collect information from the guest operating system of virtual machines and virtual machine scale sets. [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) is meant replace the Log Analytics agent which was the only one used by VM insights. Support for machines running Azure Monitor agent is currently in public preview. 


## Compare agents
Azure Monitor agent includes several advantages over Log Analytics agent, and is the preferred agent for virtual machines and virtual machine scale sets. See [Migrate to Azure Monitor agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for comparison of the agent and information on migrating.


## Changes to enabling VM insights
See [Enable VM insights overview](vminsights-enable-overview.md) for a summary of configuration options and requirements. The following sections describe changes in configuration process when using the Azure Monitor agent.

### Workspace configuration
You no longer need to [enable VM insights on the Log Analytics workspace](vminsights-configure-workspace.md) since the VMinsights management pack isn't used by Azure Monitor agent.


### Data collection rule
Azure Monitor agent uses [data collection rules](../essentials/data-collection-rule-overview.md) to configure its data collection. VM insights creates a data collection rule that is automtically deployed if you enable your machine using the Azure portal. If you use other methods to onboard your machines, then you may need to install the data collection rule first.

### Agent deployment
There are minor changes to the the process for onboarding virtual machines and virtual machine scale sets to VM insights in the Azure portal. Select **Not monitored** tab on the **Overview** page, and then click **Enable** next to the virtual machine you want to enable for monitoring. You must now select which agent you want to use, and you must select a data collection rule for Azure Monitor agent. See [Enable VM insights in the Azure portal](vminsights-enable-portal.md) for details and [Enable VM insights overview](vminsights-enable-overview.md) for other onboarding options.


## Changes to Overview page

The following changes have been made to the **Overiew** page in VM insights.

- **Data collection rule** column has replaced the **Workspace** column. This either shows the data collection rules used by the Azure Monitor agent for each machine, or it gives the option to configure with the Azure Monitor agent.


## Migrate from Log Analytics agent
The Azure Monitor agent and the Log Analytics agent can both be installed on the same machine during migration. If a virtual machine was already onboarded to VM insights with the Log Analytics agent, it will have a status of **Enabled** but have an option to **Configure using Azure Monitor Agent**. Click this option to add the Azure Monitor agent.

You should be careful that running both agents may lead to duplication of data and increased cost. If a machine has both agents installed, you'll have a warning in the Azure portal that you may be collecting duplicate data. 

:::image type="content" source="media/vminsights-azure-monitor-agent/both-agents-installed.png" alt-text="Both agents installed":::


You must remove the Log Analytics agent yourself from any machines that are using it. Before you do this, ensure that the machine is not relying any other solutions that require the Log Analytics agent. See [Migrate to Azure Monitor agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for details. 

After you verify that no Log Analytics agents are still connected to your Log Analytics workspace, disable collection from all Log Analytics agents by [removing the VM insights solution from the workspace](vminsights-configure-workspace.md). 




## Next steps

To learn how to use the Performance monitoring feature, see [View VM insights Performance](../vm/vminsights-performance.md). To view discovered application dependencies, see [View VM insights Map](../vm/vminsights-maps.md).
