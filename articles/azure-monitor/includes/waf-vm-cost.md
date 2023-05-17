---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - 

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Collect only required data from agents. | Reduce your data ingestion costs by filtering data that you don't use for alerting or analysis from collection. See []() for guidance on data to collect for different monitoring scenarios. Use [XPath]() filtering as much possible to avoid a potential charge for filtering too much data using transformations. Use [transformations](../essentials/data-collection-transformations.md) for record filtering using complex logic and for filtering columns with data that you don't require.  |
| Identify top sources of data collection. | Use [Log Analytics workspace insights](../logs/log-analytics-workspace-insights-overview.md) and log queries in [Analyze usage in Log Analytics workspace](../logs/analyze-usage.md) to identify your machines that send the most data and the tables that collect the most data. These represent your best opportunity to reduce costs. |
| Migrate from Log Analytics agent to Azure Monitor agent. | If you still have VMs with the Log Analytics agent, [migrate them to Azure Monitor agent](../agents/azure-monitor-agent-migration.md) so you can take advantage of better data filtering use unique configurations with different sets of VMs.  Configuration for data collection by the Log Analytics agent is done on the workspace, so all agents connecting to the workspace receive the same configuration. Data collection rules used by Azure Monitor agent can be tuned to the specific monitoring requirements of different sets of VMs.  |
| Enable collection of processes and dependencies in VM insights only if you use the data. | Processes and dependency data in VM insights is required for the [Map](../vm/vminsights-maps.md) feature and provides valuable data for log queries including attributes for VMs, details on running processes, and process dependencies on other services. If you don't use this data though, then disable its collection in your [VM insights configuration](../vm/vminsights-enable-portal.md). |
| Reduce polling frequency of performance counters. | If you're using a data collection rule to send performance data to your Log Analytics workspace,  |
| Ensure that VMs aren't sending duplicate data. | Any configuration that uses multiple agents on a single machine or where you multi-home agents to send data to multiple workspaces may incur charges for the same data multiple times. If you do multi-home agents or create similar data collection rules, make sure you're sending unique data to each workspace. See [Analyze usage in Log Analytics workspace](../logs/analyze-usage.md) for guidance on analyzing your collected data to make sure you aren't collecting duplicate data. If you're migrating between agents, continue to use the Log Analytics agent until you migrate to the Azure Monitor agent rather than using both together unless you can ensure that each is collecting unique data. |