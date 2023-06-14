---
title: Questions about discovery and dependency analysis in Azure Migrate
description: Get answers to common questions about discovery and dependency analysis in Azure Migrate.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 02/28/2023
ms.custom: engagement-fy23
---

# Discovery and dependency analysis - Common questions

This article answers common questions about discovery and dependency analysis in Azure Migrate. If you've other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about the [Azure Migrate appliance](common-questions-appliance.md)
- Questions about [Migration and modernization](common-questions-server-migration.md)
- Get questions answered in the [Azure Migrate forum](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureMigrate)

## What is dependency visualization?

Dependency visualization can help you assess groups of servers to migrate with greater confidence. Dependency visualization cross-checks machine dependencies before you run an assessment. It helps ensure that nothing is left behind, and it helps avoid unexpected outages when you migrate to Azure. Azure Migrate uses the Service Map solution in Azure Monitor to enable dependency visualization. [Learn more](concepts-dependency-visualization.md).

> [!NOTE]
> Agent-based dependency analysis isn't available in Azure Government. You can  use agentless dependency analysis

## What's the difference between agent-based and agentless?

The differences between agentless visualization and agent-based visualization are summarized in the table.

**Requirement** | **Agentless** | **Agent-based**
--- | --- | ---
Support | Generally available for VMware VMs, Hyper-V VMs, bare-metal servers, and servers running on other public clouds like AWS, GCP etc. | In General Availability (GA).
Agent | No need to install agents on machines you want to cross-check. | Agents to be installed on each on-premises machine that you want to analyze: The [Microsoft Monitoring agent (MMA)](../azure-monitor/agents/agent-windows.md), and the [Dependency agent](../azure-monitor/vm/vminsights-dependency-agent-maintenance.md). 
Prerequisites | [Review](concepts-dependency-visualization.md#agentless-analysis) the prerequisites and deployment requirements. | [Review](concepts-dependency-visualization.md#agent-based-analysis) the prerequisites and deployment requirements.
Log Analytics | Not required. | Azure Migrate uses the [Service Map](../azure-monitor/vm/service-map.md) solution in [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md) for dependency visualization. [Learn more](concepts-dependency-visualization.md#agent-based-analysis).
How it works | Captures TCP connection data on machines enabled for dependency visualization. After discovery, it gathers data at intervals of five minutes. | Service Map agents installed on a machine gather data about TCP processes and inbound/outbound connections for each process.
Data | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port. | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port.<br/><br/> Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 
Visualization | Dependency map of single server can be viewed over a duration of one hour to 30 days. | Dependency map of a single server.<br/><br/> Map can be viewed over an hour only.<br/><br/> Dependency map of a group of servers.<br/><br/> Add and remove servers in a group from the map view.
Data export | Last 30 days data can be downloaded in a CSV format. | Data can be queried with Log Analytics.

## Do I need to deploy the appliance for agentless dependency analysis?

Yes, the [Azure Migrate appliance](migrate-appliance.md) must be deployed.

## Do I pay for dependency visualization?

No. Learn more about [Azure Migrate pricing](https://azure.microsoft.com/pricing/details/azure-migrate/).

## What do I install for agent-based dependency visualization?

To use agent-based dependency visualization, download and install agents on each on-premises machine that you want to evaluate:

- [Microsoft Monitoring Agent (MMA)](../azure-monitor/agents/agent-windows.md)
- [Dependency agent](../azure-monitor/vm/vminsights-dependency-agent-maintenance.md)
- If you've machines that don't have internet connectivity, download and install the Log Analytics gateway on them.

You need these agents only if you use agent-based dependency visualization.

## Can I use an existing workspace?

Yes, for agent-based dependency visualization you can attach an existing workspace to the migration project and use it for dependency visualization.

## Can I export the dependency visualization report?

No, the dependency visualization report in agent-based visualization can't be exported. However, Azure Migrate uses Service Map, and you can use the [Service Map REST API](/rest/api/servicemap/machines/listconnections) to retrieve the dependencies in JSON format.

## Can I automate agent installation?

For agent-based dependency visualization:

- Use a [script to install the Dependency agent](../azure-monitor/vm/vminsights-enable-hybrid.md#dependency-agent).
- For MMA, [use the command line or automation](../azure-monitor/agents/log-analytics-agent.md#installation-options), or use a [script](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab).
- In addition to scripts, you can use deployment tools like Microsoft Configuration Manager and Intigua to deploy the agents.

## What operating systems does MMA support?

- View the list of [Windows operating systems that MMA supports](../azure-monitor/agents/log-analytics-agent.md#installation-options).
- View the list of [Linux operating systems that MMA supports](../azure-monitor/agents/log-analytics-agent.md#installation-options).

## Can I visualize dependencies for more than one hour?

For agent-based visualization, you can visualize dependencies for up to one hour. You can go back as far as one month to a specific date in history, but the maximum duration for visualization is one hour. For example, you can use the time duration in the dependency map to view dependencies for yesterday, but you can view dependencies only for a one-hour window. However, you can use Azure Monitor logs to [query dependency data](./how-to-create-group-machine-dependencies.md) for a longer duration.

For agentless visualization, you can view the dependency map of a single server from a duration of between an hour and 30 days.

## Can I visualize dependencies for groups of more than 10 servers?

You can [visualize dependencies](./how-to-create-a-group.md#refine-a-group-with-dependency-mapping) for groups that have up to 10 servers. If you've a group that has more than 10 servers, we recommend that you split the group into smaller groups, and then visualize the dependencies.

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).