---
title: Dependency analysis in Azure Migrate Server Assessment
description: Describes how to use dependency analysis for assessment using Azure Migrate Server Assessment.
ms.topic: conceptual
ms.date: 06/14/2020
---

# Dependency analysis

This article describes dependency analysis in Azure Migrate:Server Assessment.


Dependency analysis identifies dependencies between discovered on-premises machines. It provides these advantages: 

- You can gather machines into groups for assessment, more accurately, with greater confidence.
- You can identify machines that must be migrated together. This is especially useful if you're not sure which machines are part of an app deployment that you want to migrate to Azure.
- You can identify whether machines are in use, and which machines can be decommissioned instead of migrated.
- Analyzing dependencies helps ensure that nothing is left behind, and thus avoids surprise outages after migration.
- [Review](common-questions-discovery-assessment.md#what-is-dependency-visualization) common questions about dependency analysis.


## Analysis types

There are two options for deploying dependency analysis

**Option** | **Details** | **Public cloud** | **Azure Government**
----  |---- | ---- 
**Agentless** | Polls data from VMware VMs using vSphere APIs.<br/><br/> You don't need to install agents on VMs.<br/><br/> This option is currently in preview, for  VMware VMs only. | Supported. | Supported.
**Agent-based analysis** | Uses the [Service Map solution](../azure-monitor/insights/service-map.md) in Azure Monitor, to enable dependency visualization and analysis.<br/><br/> You need to install agents on each on-premises machine that you want to analyze. | Supported | Not supported.


## Agentless analysis

Agentless dependency analysis works by capturing TCP connection data from machines for which it's enabled. No agents are installed on VMs. Connections with the same source server and process, and destination server, process, and port are grouped logically into a dependency. You can visualize captured dependency data in a map view, or export it as a CSV. No agents are installed on machines you want to analyze.

### Dependency data

After discovery of dependency data begins, polling begins:

- The Azure Migrate appliance polls TCP connection data from machines every five minutes to gather data.
- Data is collected from guest VMs via vCenter Server, using vSphere APIs.
- Polling gathers this data:

    - Name of processes that have active connections.
    - Name of application that run processes that have active connections.
    - Destination port on the active connections.

- The gathered data is processed on the Azure Migrate appliance, to deduce identity information, and is sent to Azure Migrate every six hour


## Agent-based analysis

For agent-based analysis, Server Assessment uses the [Service Map](../azure-monitor/insights/service-map.md) solution in Azure Monitor. You install the [Microsoft Monitoring Agent/Log Analytics agent](../azure-monitor/platform/agents-overview.md#log-analytics-agent) and the [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent), on each machine you want to analyze.

### Dependency data

Agent-based analysis provides this data:

- Source machine server name, process, application name.
- Destination machine server name, process, application name, and port.
- Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 



## Compare agentless and agent-based

The differences between agentless visualization and agent-based visualization are summarized in the table.

**Requirement** | **Agentless** | **Agent-based**
--- | --- | ---
**Support** | In preview for VMware VMs  only. [Review](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless) supported operating systems. | In general availability (GA).
**Agent** | No agents needed on machines you want to analyze. | Agents required on each on-premises machine that you want to analyze.
**Log Analytics** | Not required. | Azure Migrate uses the [Service Map](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-service-map) solution in [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) for dependency analysis. 
**Process** | Captures TCP connection data. After discovery, it gathers data at intervals of five minutes. | Service Map agents installed on a machine gather data about TCP processes, and inbound/outbound connections for each process.
**Data** | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port. | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port.<br/><br/> Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 
**Visualization** | Dependency map of single server can be viewed over a duration of one hour to 30 days. | Dependency map of a single server.<br/><br/> Dependency map of a group of servers.<br/><br/>  Map can be viewed over an hour only.<br/><br/> Add and remove servers in a group from the map view.
Data export | Last 30 days data can be downloaded in a CSV format. | Data can be queried with Log Analytics.



## Next steps

- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency visualization.
- [Try out](how-to-create-group-machine-dependencies-agentless.md) agentless dependency visualization for VMware VMs.
- Review [common questions](common-questions-discovery-assessment.md#what-is-dependency-visualization) about dependency visualization.


