---
title: Monitor network connectivity using Azure Monitor agent
titleSuffix: Azure Network Watcher
description: Learn how to use Azure Monitor agent to monitor network connectivity with Network Watcher connection monitor.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 11/15/2023

#Customer intent: As an Azure administrator, I need use the Azure Monitor agent so I can monitor a connection using the Connection monitor.
---

# Monitor network connectivity using Azure Monitor agent with connection monitor

Connection monitor supports the Azure Monitor agent extension, which eliminates any dependency on the legacy Log Analytics agent. 

Azure Monitor agent consolidates all the features necessary to address connectivity logs and metrics data collection needs across Azure and on-premises machines compared to running various monitoring agents. 

Azure Monitor agent provides the following benefits:
* Enhanced security and performance capabilities
* Effective cost savings with efficient data collection
* Ease of troubleshooting, with simpler data collection management for the Log Analytics agent 

For more information, see [Azure Monitor agent](../azure-monitor/agents/agents-overview.md).

To start using connection monitor for monitoring, follow these steps:

* Install monitoring agents
* Create a connection monitor
* Analyze monitoring data and set alerts
* Diagnose issues in your network

The following sections provide details on the installation of monitoring agents. For more information, see [Monitor network connectivity using Connection monitor](connection-monitor-overview.md).

## Install monitoring agents for Azure and non-Azure resources

Connection monitor relies on lightweight executable files to run connectivity checks. It supports connectivity checks from both Azure and on-premises environments. The executable file that you use depends on whether your virtual machine (VM) is hosted on Azure or on-premises.

### Agents for Azure virtual machines and scale sets

To install agents for Azure virtual machines and Virtual Machine Scale Sets, see the "Agents for Azure virtual machines and Virtual Machine Scale Sets" section of [Monitor network connectivity using Connection monitor](connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets).

### Agents for on-premises machines

To make connection monitor recognize your on-premises machines as sources for monitoring, follow these steps: 

* Enable your hybrid endpoints to [Azure Arc-enabled servers](../azure-arc/overview.md).

* Connect hybrid machines by installing the [Azure Connected Machine agent](../azure-arc/servers/overview.md) on each machine.

  This agent doesn't deliver any other functionality, and it doesn't replace Azure Monitor agent. The Azure Connected Machine agent simply enables you to manage the Windows and Linux machines that are hosted outside of Azure on your corporate network or other cloud providers. 

* [Install Azure Monitor agent](../azure-monitor/agents/agents-overview.md) to enable the Network Watcher extension.

  The agent collects monitoring logs and data from the hybrid sources and delivers them to Azure Monitor.

### Enable the Network Performance Monitor solution for on-premises machines 

To enable the Network Performance Monitor solution for on-premises machines, follow these steps: 

1. In the Azure portal, go to **Network Watcher**.

1. Under **Monitoring**, select **Network Performance Monitor**. A list of workspaces with Network Performance Monitor solution enabled is displayed, filtered by **Subscriptions**. 

1. To add the Network Performance Monitor solution in a new workspace, select **Add NPM**. 

1. In **Enable Non-Azure**, select the subscription and workspace in which you want to enable the solution, and then select **Create**.
   
   After you've enabled the solution, the workspace takes a couple of minutes to be displayed.

Unlike Log Analytics agents, the Network Performance Monitor solution can be configured to send data only to a single Log Analytics workspace.

If you wish to escape the installation process for enabling the Network Watcher extension, you can proceed with the creation of connection monitor and allow auto enablement of monitoring solution on your on-premises machines. 

## Coexistence with other agents

Azure Monitor agent can coexist with, or run side by side on the same machine with, the legacy Log Analytics agent. You can continue to use their existing functionality during evaluation or migration. 

Although this coexistence allows you to begin the transition, there are certain limitations that you need to consider:

* Don't collect duplicate data, because it could alter query results and affect downstream features such as alerts, dashboards, or workbooks. 

   For example, the VM insights feature uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents. If you install Azure Monitor agent and create a data collection rule for the same events and performance data, it will result in duplicate data. Ensure that you're not collecting the same data from both agents. If you're collecting duplicate data, make sure that it's coming from different machines or going to separate destinations.

* Data duplication would also generate more charges for data ingestion and retention.

* Running two telemetry agents on the same machine would result in double the resource consumption, including but not limited to CPU, memory, storage space, and network bandwidth.

## Next steps 

- [Install the Azure Connected Machine agent](connection-monitor-connected-machine-agent.md)
