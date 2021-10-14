---
title: VM insights with Azure Monitor agent (Preview)
description: Describes how to use the Azure Monitor agent with VM insights.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/13/2021
ms.custom: references_regions

---

#  VM insights with Azure Monitor agent (Preview)
This article describes using VM insights to monitor virtual machines with the Azure Monitor agent instead of the Log Analytics agent. This functionality is currently in public preview. The Azure Monitor agent is in the process of replacing the Log Analytics agent. 


## Comparing operation of agents
The Log Analytics agent can only send data to Logs. VM insights delivers a management pack to each agent that instruct it what to collect. You can't modify this management pack. Configure additional data collection, such as Windows and Syslog events, from the workspace. All agents connected to the workspace get the same configuration.

The Azure Monitor agent can send data to both Logs and Metrics. When you enable VM insights for a virtual machine, you either select an existing data collection rule or create a new one. The data collection rule tells the agent which data to collect and where to send it. You can apply a single rule to multiple virtual machines or use separate rules for unique requirements.


## Description of onboarding
Enabling a virtual machine for monitoring by VM insights includes the following steps. When you use the Azure portal to enable a machine using the process below, these steps are performed for you.

- Install the Azure Monitor agent
- Install the Dependency agent
- Create data collection rule and associate with virtual machine

## Enable VM insights
You no longer need to [enable VM insights on the Log Analytics workspace](vminsights-enable-portal.md#enable-vm-insights) since the VMinsights management pack isn't used by Azure Monitor agent.

> [!NOTE]
> You can't currently enable the Azure Monitor agent from the virtual machine's menu in the Azure portal. You must use the Azure Monitor menu.

## Changes to Get Started tab
The following changes have been made to the **Get Started** page in VM insights.

- **Data collection rule** column has been added to **Monitored**. This either shows the data collection rules used by the Azure Monitor agent for the machine, or it gives the option to configure with the Azure Monitor agent.
- **Monitor Coverage** column 

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
