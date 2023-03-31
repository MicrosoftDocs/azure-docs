---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Configure pricing tier or dedicated cluster to optimize your cost depending on your usage.
> - Configure tables used for debugging, troubleshooting, and auditing as Basic Logs.
> - Configure data retention and archiving.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Configure pricing tier or dedicated cluster for your Log Analytics workspaces. | By default, Log Analytics workspaces will use pay-as-you-go pricing with no minimum data volume. If you collect enough amount of data, you can significantly decrease your cost by using a [commitment tier](logs/cost-logs.md#commitment-tiers) or [dedicated cluster](logs/logs-dedicated-clusters.md), which allows you to commit to a daily minimum of data collected in exchange for a lower rate.<br><br>See [Azure Monitor Logs cost calculations and options](logs/cost-logs.md) for details on commitment tiers and guidance on determining which is most appropriate for your level of usage. See [Usage and estimated costs](usage-estimated-costs.md#usage-and-estimated-costs) to view estimated costs for your usage at different pricing tiers.
| Configure tables used for debugging, troubleshooting, and auditing as Basic Logs. | Tables in a Log Analytics workspace configured for [Basic Logs](logs/basic-logs-configure.md) have a lower ingestion cost in exchange for limited features and a charge for log queries. If you query these tables infrequently, this query cost can be more than offset by the reduced ingestion cost.<br><br>See [Configure Basic Logs in Azure Monitor](logs/basic-logs-configure.md) for more information about Basic Logs and [Query Basic Logs in Azure Monitor](.//logs/basic-logs-query.md) for details on query limitations. |
| Configure data retention and archiving. | There is a charge for retaining data in a Log Analytics workspace beyond the default of 30 days (90 days in Sentinel if enabled on the workspace). If you need to retain data for compliance reasons or for occasional investigation or analysis of historical data, configure [Archived Logs](logs/data-retention-archive.md), which allows you to retain data for up to seven years at a reduced cost.<br><br>See [Configure data retention and archive policies in Azure Monitor Logs](logs/data-retention-archive.md) for details on how to configure your workspace and how to work with archived data. |