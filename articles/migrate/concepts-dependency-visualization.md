---
title: Dependency analysis in Azure Migrate Discovery and assessment
description: Describes how to use dependency analysis for assessment using Azure Migrate Discovery and assessment.
ms.topic: conceptual
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.service: azure-migrate
ms.date: 08/24/2023
ms.custom: engagement-fy24
---

# Dependency analysis

This article describes dependency analysis in Azure Migrate: Discovery and assessment.

Dependency analysis identifies dependencies between discovered on-premises servers. It provides these advantages:

- You can gather servers into groups for assessment, more accurately, with greater confidence.
- You can identify servers that must be migrated together. This is especially useful if you're not sure which servers are part of an app deployment that you want to migrate to Azure.
- You can identify whether servers are in use, and which servers can be decommissioned instead of migrated.
- Analyzing dependencies helps ensure that nothing is left behind, and thus avoids surprise outages after migration.
- [Review](common-questions-discovery-dependency-analysis.md#what-is-dependency-visualization) common questions about dependency analysis.

## Analysis types

There are two options for deploying dependency analysis

**Option** | **Details** | **Public cloud** | **Azure Government**
----  |---- | ---- |----
**Agentless** | Generally available for VMware VMs, Hyper-V VMs, bare-metal servers, and servers running on other public clouds like AWS, GCP etc. | Supported | Supported
**Agent-based analysis** | Uses the [Service Map solution](/previous-versions/azure/azure-monitor/vm/service-map) in Azure Monitor, to enable dependency visualization and analysis.<br/><br/> You need to install agents on each on-premises server that you want to analyze. | Supported | Not supported.

## Agentless analysis

Agentless dependency analysis works by capturing TCP connection data from servers for which it's enabled. No agents are installed on servers. Connections with the same source server and process, and destination server, process, and port are grouped logically into a dependency. You can visualize captured dependency data in a map view, or export it as a CSV. No agents are installed on servers you want to analyze.

### Dependency data

After discovery of dependency data begins, polling begins:

- The Azure Migrate appliance polls TCP connection data from servers every five minutes to gather data.
- Polling gathers this data:

    - Name of processes that have active connections.
    - Name of application that run processes that have active connections.
    - Destination port on the active connections.

- The gathered data is processed on the Azure Migrate appliance, to deduce identity information, and is sent to Azure Migrate every six hours.


## Agent-based analysis

For agent-based analysis, Azure Migrate: Discovery and assessment uses the [Service Map](/previous-versions/azure/azure-monitor/vm/service-map) solution in Azure Monitor. You install the [Microsoft Monitoring Agent/Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) and the [Dependency agent](../azure-monitor/vm/vminsights-dependency-agent-maintenance.md), on each server you want to analyze.

### Dependency data

Agent-based analysis provides this data:

- Source server name, process, application name.
- Destination server name, process, application name, and port.
- Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries.

## Compare agentless and agent-based

The differences between agentless visualization and agent-based visualization are summarized in the table.

**Requirement** | **Agentless** | **Agent-based**
--- | --- | ---
**Support** | Generally Available for VMware VMs, Hyper-V VMs, Physical servers, or servers running on other public clouds like AWS and GCP. | In general availability (GA).
**Agent** | No agents needed on servers you want to analyze. | Agents required on each on-premises server that you want to analyze.
**Log Analytics** | Not required. | Azure Migrate uses the [Service Map](/previous-versions/azure/azure-monitor/vm/service-map) solution in [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md) for dependency analysis.<br/><br/> You associate a Log Analytics workspace with a project. The workspace must reside in the East US, Southeast Asia, or West Europe regions. The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).
**Process** | Captures TCP connection data. After discovery, it gathers data at intervals of five minutes. | Service Map agents installed on a server gather data about TCP processes, and inbound/outbound connections for each process.
**Data** | Source server name, process, application name.<br/><br/> Destination server name, process, application name, and port. | Source server name, process, application name.<br/><br/> Destination server name, process, application name, and port.<br/><br/> Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 
**Visualization** | Dependency map of single server can be viewed over a duration of one hour to 30 days. | Dependency map of a single server.<br/><br/> Dependency map of a group of servers.<br/><br/>  Map can be viewed over an hour only.<br/><br/> Add and remove servers in a group from the map view.
Data export | Last 30 days data can be downloaded in a CSV format. | Data can be queried with Log Analytics.



## Next steps

- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency visualization.
- [Try out](how-to-create-group-machine-dependencies-agentless.md) agentless dependency visualization for servers on VMware.
- Review [common questions](common-questions-discovery-dependency-analysis.md#what-is-dependency-visualization) about dependency visualization.
