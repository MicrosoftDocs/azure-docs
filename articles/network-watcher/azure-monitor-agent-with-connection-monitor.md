---
title: Monitor network connectivity by using Azure Monitor Agent
description: This article describes how to monitor network connectivity in Connection Monitor by using Azure Monitor Agent.
services: network-watcher
author: v-ksreedevan
ms.service: network-watcher
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/11/2022
ms.author: v-ksreedevan
#Customer intent: I need to monitor a connection by using Azure Monitor Agent.
---

# Monitor network connectivity by using Azure Monitor Agent with Connection Monitor

Connection Monitor supports the Azure Monitor Agent extension, which eliminates any dependency on the legacy Log Analytics agent. 

With Azure Monitor Agent, a single agent consolidates all the features necessary to address all connectivity logs and metrics data collection needs across Azure and on-premises machines compared to running various monitoring agents. 

Azure Monitor Agent provides the following benefits:
* Enhanced security and performance capabilities
* Effective cost savings with efficient data collection
* Ease of troubleshooting, with simpler data collection management for the Log Analytics agent 

[Learn more about Azure Monitor Agent](../azure-monitor/agents/agents-overview.md).

To start using Connection Monitor for monitoring, do the following:
* Install monitoring agents
* Create a connection monitor
* Analyze monitoring data and set alerts
* Diagnose issues in your network

The following sections provide details on the installation of monitoring agents. For more information, see [Monitor network connectivity by using Connection Monitor](connection-monitor-overview.md).

## Install monitoring agents for Azure and non-Azure resources

Connection Monitor relies on lightweight executable files to run connectivity checks. It supports connectivity checks from both Azure and on-premises environments. The executable file that you use depends on whether your virtual machine (VM) is hosted on Azure or on-premises.

### Agents for Azure virtual machines and scale sets

To install agents for Azure virtual machines and virtual machine scale sets, see the "Agents for Azure virtual machines and virtual machine scale sets" section of [Monitor network connectivity by using Connection Monitor](connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets).

### Agents for on-premises machines

To make Connection Monitor recognize your on-premises machines as sources for monitoring, do the following: 

* Enable your hybrid endpoints to [Azure Arc-enabled servers](../azure-arc/overview.md).

* Connect hybrid machines by installing the [Azure Connected Machine agent](../azure-arc/servers/overview.md) on each machine.

  This agent doesn't deliver any other functionality, and it doesn't replace Azure Monitor Agent. The Azure Connected Machine agent simply enables you to manage the Windows and Linux machines that are hosted outside of Azure on your corporate network or other cloud providers. 

* [Install Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) to enable the Network Watcher extension.

  The agent collects monitoring logs and data from the hybrid sources and delivers it to Azure Monitor.

## Coexistence with other agents

Azure Monitor Agent can coexist with, or run side by side on the same machine as, the legacy Log Analytics agents. You can continue to use their existing functionality during evaluation or migration. 

Although this coexistence allows you to begin the transition, there are certain limitations. Keep in mind the following considerations:

* Do not collect duplicate data, because it could alter query results and affect downstream features such as alerts, dashboards, or workbooks. 

   For example, the VM insights feature uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents. If you install Azure Monitor Agent and create a data collection rule for the same events and performance data, it will result in duplicate data. Ensure that you're not collecting the same data from both agents. If you are collecting duplicate data, make sure that it's coming from different machines or going to separate destinations.

* Data duplication would also generate more charges for data ingestion and retention.

* Running two telemetry agents on the same machine would result in double the resource consumption, including but not limited to CPU, memory, storage space, and network bandwidth.

## Next steps 

- [Install the Azure Connected Machine agent](connection-monitor-connected-machine-agent.md)
