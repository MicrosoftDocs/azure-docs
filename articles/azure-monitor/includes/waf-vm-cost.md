---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 06/08/2023
---

### Design checklist

> [!div class="checklist"]
> - Migrate from Log Analytics agent to Azure Monitor agent for granular data filtering.
> - Filter data that you don't require from agents.
> - Determine whether you'll use VM insights and what data to collect.
> - Reduce polling frequency of performance counters.
> - Ensure that VMs aren't sending duplicate data.
> - Use Log Analytics workspace insights to analyze billable costs and identify cost saving opportunities.
> - Migrate your SCOM environment to Azure Monitor SCOM Managed Instance.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Migrate from Log Analytics agent to Azure Monitor agent for granular data filtering. | If you still have VMs with the Log Analytics agent, [migrate them to Azure Monitor agent](../agents/azure-monitor-agent-migration.md) so you can take advantage of better data filtering and use unique configurations with different sets of VMs.  Configuration for data collection by the Log Analytics agent is done on the workspace, so all agents receive the same configuration. Data collection rules used by Azure Monitor agent can be tuned to the specific monitoring requirements of different sets of VMs. The Azure Monitor agent also allows you to use [transformations](../essentials/data-collection-transformations.md) to filter data being collected. |
| Filter data that you don't require from agents. | Reduce your data ingestion costs by filtering data that you don't use for alerting or analysis. See [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) for guidance on data to collect for different monitoring scenarios and [Control costs](../vm/monitor-virtual-machine-data-collection.md#control-costs) for specific guidance on filtering data to reduce your costs. |
| Determine what data to collect with VM insights. | [VM insights](../vm/vminsights-overview.md) is a great feature to quickly get started with monitoring your VMs and provides powerful features such as [Map](../vm/vminsights-maps.md) and performance trend views. If you don't use the Map feature or the data that it collects, then you should disable collection of processes and dependency data in your [VM insights configuration](../vm/vminsights-enable-portal.md) to save on data ingestion costs. |
| Reduce polling frequency of performance counters. | If you're using a [data collection rule to send performance data](../agents/data-collection-rule-azure-monitor-agent.md) to your Log Analytics workspace, you can reduce their polling frequency to reduce the amount of data collected. |
| Ensure that VMs aren't sending duplicate data. | If you multi-home agents or you create similar data collection rules, make sure you're sending unique data to each workspace. See [Analyze usage in Log Analytics workspace](../logs/analyze-usage.md) for guidance on analyzing your collected data to make sure you aren't collecting duplicate data. If you're migrating between agents, continue to use the Log Analytics agent until you migrate to the Azure Monitor agent rather than using both together unless you can ensure that each is collecting unique data. |
| Use Log Analytics workspace insights to analyze billable costs and identify cost saving opportunities. | [Log Analytics workspace insights](../logs/log-analytics-workspace-insights-overview.md) shows you the billable data collected in each table and from each VM. Use this information to identify your top machines and tables since they represent your best opportunity to reduce costs by filtering data. Use this insight and log queries in [Analyze usage in Log Analytics workspace](../logs/analyze-usage.md) to further analyze the effects of configuration changes. |
| Migrate your SCOM environment to Azure Monitor SCOM Managed Instance. | Migrate your existing SCOM environment to [Azure Monitor SCOM Managed Instance](/system-center/scom/migrate-to-operations-manager-managed-instance) to support any management packs that can't be [replaced by Azure Monitor](../vm/monitor-virtual-machine-management-packs.md#migrate-management-pack-logic-for-vm-workloads). SCOM managed instance removes the requirement to maintain local management servers and database servers, reducing your overall cost to maintain your SCOM infrastructure. |