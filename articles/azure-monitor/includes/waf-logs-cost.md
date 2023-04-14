---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Configure pricing tier for the amount of data that each Log Analytics workspace typically collects.
> - Configure tables used for debugging, troubleshooting, and auditing as Basic Logs.
> - Configure data retention and archiving.
> - Regularly analyze collected data to identify trends and anomalies.
> - Create an alert when data collection is high.
> - Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget.

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Configure pricing tier for the amount of data that each Log Analytics workspace typically collects. | By default, Log Analytics workspaces will use pay-as-you-go pricing with no minimum data volume. If you collect enough data, you can significantly decrease your cost by using a [commitment tier](../logs/cost-logs.md#commitment-tiers), which allows you to commit to a daily minimum of data collected in exchange for a lower rate. If you collect enough data across workspaces in a single region, you can link them to a [dedicated cluster](../logs/logs-dedicated-clusters.md) and combine their collected volume using [cluster pricing](../logs/cost-logs.md#dedicated-clusters).<br><br>See [Azure Monitor Logs cost calculations and options](../logs/cost-logs.md) for details on commitment tiers and guidance on determining which is most appropriate for your level of usage. See [Usage and estimated costs](../usage-estimated-costs.md#usage-and-estimated-costs) to view estimated costs for your usage at different pricing tiers.  |
| Configure tables used for debugging, troubleshooting, and auditing as Basic Logs. | Tables in a Log Analytics workspace configured for [Basic Logs](../logs/basic-logs-configure.md) have a lower ingestion cost in exchange for limited features and a charge for log queries. If you query these tables infrequently and don't use them for alerting, this query cost can be more than offset by the reduced ingestion cost. |
| Configure data retention and archiving. | There is a charge for retaining data in a Log Analytics workspace beyond the default of 30 days (90 days in Sentinel if enabled on the workspace). Consider your particular requirements for having data readily available for log queries. If you need to retain data for occasional investigation or analysis of historical data, configure [Archived Logs](../logs/data-retention-archive.md), which allows you to retain data for up to seven years at a reduced cost and still have access to it through [search jobs](../logs/search-jobs.md) or [restoring a set of data](../logs/restore.md) to the workspace. |
| Regularly analyze collected data to identify trends and anomalies.  | Use [Log Analytics workspace insights](../logs/log-analytics-workspace-insights-overview.md) to periodically review the amount of data collected in your workspace. In addition to helping you understand the amount of data collected by different sources, it will identify anomalies and upward trends in data collection that could result in excess cost. Further analyze data collection using methods in [Analyze usage in Log Analytics workspace](../logs/analyze-usage.md) to determine if there's additional configuration that can decrease your usage further. This is particularly important when you add a new set of data sources, such as a new set of virtual machines or onboard a new service. |
| Create an alert when data collection is high. | To avoid unexpected bills, you should be [proactively notified anytime you experience excessive usage](../logs/analyze-usage.md#send-alert-when-data-collection-is-high). Notification allows you to address any potential anomalies before the end of your billing period. |
| Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget. | A [daily cap](../logs/daily-cap.md) disables data collection in a Log Analytics workspace for the rest of the day after your configured limit is reached. This shouldn't be used as a method to reduce costs as described in [When to use a daily cap](../logs/daily-cap.md#when-to-use-a-daily-cap).<br><br>If you do set a daily cap, in addition to [creating an alert when the cap is reached](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts),ensure that you also [create an alert rule to be notified when some percentage has been reached (90% for example)](../logs/analyze-usage.md#send-alert-when-data-collection-is-high). This gives you an opportunity to investigate and address the cause of the increased data before the cap shuts off data collection. |
