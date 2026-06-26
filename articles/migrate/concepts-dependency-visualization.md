---
title: Dependency analysis in Azure Migrate Discovery and assessment
description: Describes how to use dependency analysis for assessment using Azure Migrate Discovery and assessment.
ms.topic: concept-article
author: habibaum
ms.author: v-uhabiba 
ms.service: azure-migrate
ms.date: 06/06/2025
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

::: moniker range="migrate"

## Dependency analysis options in Azure Migrate

Azure Migrate provides two options for dependency analysis:

- **Agentless dependency analysis** is generally available for VMware VMs, Hyper-V VMs, physical servers, and servers running in other public clouds such as AWS and GCP. It is supported in both Azure Public Cloud and Azure Government and is the recommended approach for dependency visualization and analysis.
-  **Agent-based dependency analysis** is supported only in the classic view and isn't available in the new experience. The classic view is scheduled for deprecation by the end of 2026. Until then, you can continue to access Log Analytics workspaces for servers where agent-based dependency analysis is already enabled. However, you can't onboard new servers for agent-based dependency analysis. For information, see [Set up dependency visualization](how-to-create-group-machine-dependencies.md).

::: moniker-end

::: moniker range="migrate-classic"

## Analysis types

There are two options for deploying dependency analysis

**Option** | **Details** | **Public cloud** | **Azure Government**
----  |---- | ---- |----
**Agentless analysis** | Generally available for VMware VMs, Hyper-V VMs, physical servers, and servers running on other public clouds like AWS, GCP etc. | Supported | Supported
**Agent-based analysis** | Uses the [Service Map solution](/previous-versions/azure/azure-monitor/vm/service-map) in Azure Monitor, to enable dependency analysis and visualization.<br/><br/> You need to install agents on each source server that you want to analyze. | Supported | Not supported.

::: moniker-end

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

## Next steps

- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency visualization.
- [Try out](how-to-create-group-machine-dependencies-agentless.md) agentless dependency visualization.
- Review [common questions](common-questions-discovery-dependency-analysis.md#what-is-dependency-analysis) about dependency visualization.
