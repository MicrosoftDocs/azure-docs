---
title: Dependency analysis in Azure Migrate Discovery and assessment
description: Describes how to use dependency analysis for assessment using Azure Migrate Discovery and assessment.
ms.topic: concept-article
author: habibaum
ms.author: v-uhabiba 
ms.service: azure-migrate
ms.date: 09/09/2024
ms.reviewer: v-uhabiba
ms.custom: engagement-fy25
# Customer intent: As a cloud migration planner, I want to utilize dependency analysis for my on-premises servers, so that I can accurately group and assess them for migration to ensure smooth application functionality and avoid potential outages post-migration.
---

# Dependency analysis

This article describes the feature of dependency analysis in Azure Migrate. Dependency analysis identifies dependencies between discovered on-premises running in VMware, Hyper-V, physical servers or servers running on other public clouds. It provides these advantages:

- You can review the network dependencies and group the inter-dependent servers into applications running in your datacenter.
- You can identify servers that must be migrated together. This is especially useful if you're not sure which servers are part of an application deployment that you want to migrate to Azure.
- Analyzing dependencies helps ensure that nothing is left behind, and thus avoids surprise outages after migration.
- [Review](common-questions-discovery-dependency-analysis.md#what-is-dependency-analysis) common questions about dependency analysis.

## Analysis types

There are two options for deploying dependency analysis

**Option** | **Details** | **Public cloud** | **Azure Government**
----  |---- | ---- |----
**Agentless analysis** | Generally available for VMware VMs, Hyper-V VMs, physical servers, and servers running on other public clouds like AWS, GCP etc. | Supported | Supported
**Agent-based analysis** | Uses the [Service Map solution](/previous-versions/azure/azure-monitor/vm/service-map) in Azure Monitor, to enable dependency analysis and visualization.<br/><br/> You need to install agents on each source server that you want to analyze. | Supported | Not supported.

## Agentless analysis

- Agentless dependency analysis works by capturing TCP network connection data from servers for which it's enabled.
- No agents are installed on servers you want to analyze.
- Connections between the source server and process, and destination server, process, and port are grouped logically into a dependency.
- You can visualize captured dependency data in a map view, or export it as a CSV.

### Dependency data

After discovery of dependency data begins, polling begins:

- The Azure Migrate appliance polls TCP connection data from servers every five minutes to gather data.
- Polling gathers this data:

    - Name of processes that have active connections.
    - Name of applications that run processes with active connections.
    - Destination port on the active connections.

- The gathered data is processed on the Azure Migrate appliance and is sent to Azure Migrate every six hours.


## Agent-based analysis

To use agent-based dependency analysis, download and install agents on each on-premises server that you want to evaluate:

- [Azure Monitor Agent (AMA)](/azure/azure-monitor/agents/azure-monitor-agent-overview)
- [Dependency agent](/azure/azure-monitor/vm/vminsights-dependency-agent-maintenance)
- If you've machines that don't have internet connectivity, download and install the Log Analytics gateway on them.

You need these agents only if you use agent-based dependency visualization.

### Dependency data

Agent-based analysis provides this data:

- Source server name, process, application name.
- Destination server name, process, application name, and port.
- Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries.

## Compare agentless and agent-based

The differences between agentless visualization and agent-based visualization are summarized in the table.

**Requirement** | **Agentless** | **Agent-based**
--- | --- | ---
Support | Generally available for VMware VMs, Hyper-V VMs, bare-metal servers, and servers running on other public clouds like AWS, GCP etc. | In General Availability (GA).
Agent | No need to install agents on machines you want to cross-check. | Agents to be installed on each on-premises machine that you want to analyze: The [Azure Monitor Agent (AMA)](/azure/azure-monitor/agents/azure-monitor-agent-overview), and the [Dependency agent](/azure/azure-monitor/vm/vminsights-dependency-agent-maintenance). 
Prerequisites | [Review](concepts-dependency-visualization.md#agentless-analysis) the prerequisites and deployment requirements. | [Review](concepts-dependency-visualization.md#agent-based-analysis) the prerequisites and deployment requirements.
Log Analytics | Not required. | Azure Migrate uses the [VM Insights](/azure/azure-monitor/vm/vminsights-migrate-from-service-map) solution in [Azure Monitor logs](/azure/azure-monitor/logs/log-query-overview) for dependency visualization. [Learn more](concepts-dependency-visualization.md#agent-based-analysis).
How it works | Captures TCP connection data on machines enabled for dependency visualization. After discovery, it gathers data at intervals of five minutes. | Service Map agents installed on a machine gather data about TCP processes and inbound/outbound connections for each process.
Data | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port. | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port.<br/><br/> Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 
Visualization | Dependency map of single server can be viewed over a duration of one hour to 30 days. | Dependency map of a single server.<br/><br/> Map can be viewed over an hour only.<br/><br/> Dependency map of a group of servers.<br/><br/> Add and remove servers in a group from the map view.
Data export | Last 30 days data can be downloaded in a CSV format. | Data can be queried with Log Analytics.


## Next steps

- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency visualization.
- [Try out](how-to-create-group-machine-dependencies-agentless.md) agentless dependency visualization.
- Review [common questions](common-questions-discovery-dependency-analysis.md#what-is-dependency-analysis) about dependency visualization.
