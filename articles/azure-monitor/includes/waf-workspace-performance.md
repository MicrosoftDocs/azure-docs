---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Add workspaces to a dedicated cluster.
> - Configure log query auditing and use Log Analytics workspace insights to identify slow and inefficient queries.

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Add workspaces to a [dedicated cluster](../logs/logs-dedicated-clusters.md). | Cross-workspace queries run faster when workspaces included in the query are linked to the same cluster. |
| Configure [log query auditing](../logs/query-audit.md) and use Log Analytics workspace insights to [identify slow and inefficient queries](../logs/log-analytics-workspace-insights-overview.md#query-audit-tab). | Log query auditing stores the compute time required to run each each query and the time until results are returned. Log Analytics workspace insights uses this data to list potentially inefficient queries in your workspace. Consider rewriting these queries to improve their performance. Refer to [Optimize log queries in Azure Monitor](../logs/query-optimization.md) for guidance on optimizing your log queries. |