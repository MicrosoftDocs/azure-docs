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
# Customer intent: As a cloud migration planner, I want to utilize dependency analysis for my on-premises or Azure VMware Solution servers, so that I can accurately group and assess them for migration to ensure smooth application functionality and avoid potential outages post-migration.
---

# Dependency analysis

This article describes dependency analysis in Azure Migrate: Discovery and assessment.

Dependency analysis identifies dependencies between discovered on-premises or Azure VMware Solution servers. It provides these advantages:

- You can gather servers into groups for assessment, more accurately, with greater confidence.
- You can identify servers that must be migrated together. This is especially useful if you're not sure which servers are part of an app deployment that you want to migrate to Azure.
- You can identify whether servers are in use, and which servers can be decommissioned instead of migrated.
- Analyzing dependencies helps ensure that nothing is left behind, and thus avoids surprise outages after migration.
- [Review](common-questions-discovery-dependency-analysis.md#what-is-dependency-analysis) common questions about dependency analysis.

## Analysis types

There are two options for deploying dependency analysis

**Option** | **Details** | **Public cloud** | **Azure Government**
----  |---- | ---- |----
**Agentless** | Generally available for VMware VMs, Hyper-V VMs, bare-metal servers, and servers running on other public clouds like AWS, GCP etc. | Supported | Supported
**Agent-based analysis** | Azure Migrate no longer supports agent-based dependency visualization. However, if you still want to use agent-based dependency visualization, install [Azure Monitor VM Insights](/azure/azure-monitor/vm/monitor-vm) on each server that you want to analyze.
Please note that agent-based dependency analysis is not free, and Log Analytics workspace usage charges will apply. For pricing details, see [Azure Monitor pricing](/pricing/details/monitor/). | Supported | Not supported.

## Agentless analysis

Agentless dependency analysis works by capturing TCP connection data from servers for which it's enabled. No agents are installed on servers. Connections with the same source server and process, and destination server, process, and port are grouped logically into a dependency. You can visualize captured dependency data in a map view, or export it as a CSV. No agents are installed on servers you want to analyze.

### Dependency data

After discovery of dependency data begins, polling begins:

- The Azure Migrate appliance polls TCP connection data from servers every five minutes to gather data.
- Polling gathers this data:

    - Name of processes that have active connections.
    - Name of applications that run processes with active connections.
    - Destination port on the active connections.

- The gathered data is processed on the Azure Migrate appliance, to deduce identity information, and is sent to Azure Migrate every six hours.


## Agent-based analysis

Azure Migrate recommends the use of agentless dependency analysis and no longer provides support for agent based dependency visualization. However, if you still want to use agent-based dependency visualization, you can directly install [Azure Monitor VM Insights](/azure/azure-monitor/vm/monitor-vm) on each server that you want to analyze.

Please note that agent-based dependency analysis is not free, and Log Analytics workspace usage charges will apply. For pricing details, see [Azure Monitor pricing](/pricing/details/monitor/).

## Next steps

- [Try out](how-to-create-group-machine-dependencies-agentless.md) agentless dependency visualization for servers on VMware.
- Review [common questions](common-questions-discovery-dependency-analysis.md#what-is-dependency-analysis) about dependency visualization.
