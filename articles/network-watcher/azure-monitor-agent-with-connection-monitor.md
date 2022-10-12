---
title: Monitor Network Connectivity using Azure Monitor Agent
description: This article describes how to monitor network connectivity in Connection Monitor using the Azure monitor agent.
services: network-watcher
author: v-ksreedevan
ms.service: network-watcher
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/11/2022
ms.author: v-ksreedevan
#Customer intent: I need to monitor a connection using Azure Monitor agent.
---

# Monitor Network Connectivity using Azure Monitor Agent with Connection Monitor

Connection Monitor supports the Azure Monitor Agent extension, thereby eliminating the dependency on the legacy Log Analytics agent. 

With Azure Monitor Agent, a single agent consolidates all the features necessary to address all connectivity logs and metrics data collection needs across Azure and On-premises machines compared to running various monitoring agents. 

The Azure Monitor Agent provides enhanced security and performance capabilities, effective cost savings with efficient data collection and ease of troubleshooting with simpler data collection management for Log Analytics agent. 

[Learn more](../azure-monitor/agents/agents-overview.md) about Azure Monitor Agent.

To start using Connection Monitor for monitoring, do the following:
* Install monitoring agents
* Create a connection monitor
* Analyze monitoring data and set alerts
* Diagnose issues in your network

The following sections provide details on the installation of Monitor Agents. For more information, see [Connection Monitor](connection-monitor-overview.md).

## Installing monitoring agents for Azure and Non-Azure resources

The Connection Monitor relies on lightweight executable files to run connectivity checks. It supports connectivity checks from both Azure environments and on-premises environments. The executable file that you use depends on whether your VM is hosted on Azure or on-premises.

### Agents for Azure virtual machines and scale sets

Refer [here](connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets) to install agents for Azure virtual machines and scale sets.

### Agents for on-premises machines

To make Connection Monitor recognize your on-premises machines as sources for monitoring, do the following: 
* Enable your hybrid endpoints to [ARC Enabled Servers](../azure-arc/overview.md).
* Connect hybrid machines by installing the [Azure Connected Machine agent](../azure-arc/servers/overview.md) on each machine.
  This agent doesn't deliver any other functionality, and it doesn't replace the Azure Monitor Agent. The Azure Connected Machine agent simply enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud providers. 
* Install the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) to enable the Network Watcher extension.
* The agent collects monitoring logs and data from the hybrid sources and delivers it to Azure Monitor.

## Coexistence with other agents

The Azure Monitor agent can coexist (run side by side on the same machine) with the legacy Log Analytics agents so that you can continue to use their existing functionality during evaluation or migration. While this allows you to begin the transition, given the limitations, you must review the following:
* Ensure that you do not collect duplicate data because it could alter query results and affect downstream features like alerts, dashboards, or workbooks. For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data. So, ensure you're not collecting the same data from both agents. If you are, ensure they're collecting from different machines or going to separate destinations.
* Besides data duplication, this would also generate more charges for data ingestion and retention.
* Running two telemetry agents on the same machine would result in double the resource consumption, including but not limited to CPU, memory, storage space and network bandwidth.

## Next steps 

- Install [Azure Connected machine agent](connection-monitor-connected-machine-agent.md).
