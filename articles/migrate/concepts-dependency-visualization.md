---
title: Dependency analysis in Azure Migrate Server Assessment
description: Describes how to use dependency analysis for assessment using Azure Migrate Server Assessment.
ms.topic: conceptual
ms.date: 03/11/2020
---

# Dependency analysis

This article describes dependency analysis in Azure Migrate:Server Assessment.

## Overview

Dependency analysis helps you to identify dependencies between on-premises machines that you want to assess and migrate to Azure. 

- In Azure Migrate:Server Assessment, you gather machines into a group, and then assess the group. Dependency analysis helps you to group machines more accurately, with high confidence for assessment.
- Dependency analysis enables you to identify machines that must be migrated together. You can identify whether machines are in use, or if they can be decommissioned instead of migrated.
- Analyzing dependencies helps ensure that nothing is left behind, and avoid surprise outages during migration.
- Analysis is especially useful if you're not sure whether machines are part of an app deployment that you want to migrate to Azure.
- [Review](common-questions-discovery-assessment.md#what-is-dependency-visualization) common questions about dependency analysis.

There are two options for deploying dependency analysis

- **Agent-based**: Agent-based dependency analysis requires agents to be installed on each on-premises machine that you want to analyze.
- **Agentless**: With agentless analysis, you don't need to install agents on machines you want to cross-check. This option is currently in preview, and is only available for VMware VMs.

> [!NOTE]
> Dependency analysis isn't available in Azure Government.

## Agentless analysis

Agentless dependency analysis works by capturing TCP connection data from machines for which it's enabled. No agents are installed on machines you want to analyze.

### Collected data

After dependency discovery starts, the appliance polls data from machines every five minutes to gather data. This data is collected from guest VMs via vCenter Server, using vSphere APIs. The gathered data is processed on the Azure Migrate appliance, to deduce identity information, and is sent to Azure Migrate every six hours.

Polling gathers this data from machines: 
- Name of processes that have active connections.
- Name of application that run processes that have active connections.
- Destination port on the active connections.

## Agent-based analysis

For agent-based analysis, Server Assessment uses the [Service Map solution](../azure-monitor/insights/service-map.md) in Azure Monitor to enable dependency visualization and analysis. The [Microsoft Monitoring Agent/Log Analytics agent](../azure-monitor/platform/agents-overview.md#log-analytics-agent) and the [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent), must be installed on each machine you want to analyze.

### Collected data

For agent-based visualization, the following data is collected:

- Source machine server name, process, application name.
- Destination machine server name, process, application name, and port.
- Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 


## Compare agentless and agent-based

The differences between agentless visualization and agent-based visualization are summarized in the table.

**Requirement** | **Agentless** | **Agent-based**
--- | --- | ---
Support | This option is currently in preview, and is only available for VMware VMs. [Review](migrate-support-matrix-vmware.md#agentless-dependency-analysis-requirements) supported operating systems. | In general availability (GA).
Agent | No need to install agents on machines you want to cross-check. | Agents to be installed on each on-premises machine that you want to analyze: The [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows), and the [Dependency agent](https://docs.microsoft.com/azure/azure-monitor/platform/agents-overview#dependency-agent). 
Log Analytics | Not required. | Azure Migrate uses the [Service Map](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-service-map) solution in [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) for dependency analysis. 
How it works | Captures TCP connection data on machines enabled for dependency visualization. After discovery, it gathers data at intervals of five minutes. | Service Map agents installed on a machine gather data about TCP processes and inbound/outbound connections for each process.
Data | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port. | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port.<br/><br/> Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 
Visualization | Dependency map of single server can be viewed over a duration of one hour to 30 days. | Dependency map of a single server.<br/><br/> Map can be viewed over an hour only.<br/><br/> Dependency map of a group of servers.<br/><br/> Add and remove servers in a group from the map view.
Data export | Can't currently be downloaded in tabular format. | Data can be queried with Log Analytics.



## Next steps
- Review the requirements for setting up agent-based analysis for [VMware VMs](migrate-support-matrix-vmware.md#agent-based-dependency-analysis-requirements), [physical servers](migrate-support-matrix-physical.md#agent-based-dependency-analysis-requirements), and [Hyper-V VMs](migrate-support-matrix-hyper-v.md#agent-based-dependency-analysis-requirements).
- [Review](migrate-support-matrix-vmware.md#agentless-dependency-analysis-requirements) the requirements for agentless analysis of VMware VMs.
- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency visualization
- [Try out](how-to-create-group-machine-dependencies-agentless.md) agentless dependency visualization for VMware VMs.
- Review [common questions](common-questions-discovery-assessment.md#what-is-dependency-visualization) about dependency visualization.


