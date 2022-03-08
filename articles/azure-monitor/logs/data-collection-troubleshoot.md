---
title: Troubleshoot why Log Analytics is no longer collecting data
description: Steps to take if data is no longer being collected in Log Analytics workspace in Azure Monitor.
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Troubleshoot why Log Analytics is no longer collecting data

If you're on the legacy Free pricing tier and have sent more than 500 MB of data in a day, data collection stops for the rest of the day. Reaching the daily limit is a common reason that Log Analytics stops collecting data, or data appears to be missing. Log Analytics creates an **Operation** type event when data collection starts and stops. Run the following query in search to check whether you're reaching the daily limit and missing data: 

```kusto
Operation | where OperationCategory == 'Data Collection Status'
```

When data collection stops, the **OperationStatus** is **Warning**. When data collection starts, the **OperationStatus** is **Succeeded**. The following table lists reasons that data collection stops and a suggested action to resume data collection.

|Reason collection stops| Solution| 
|-----------------------|---------|
|Daily cap of your workspace was reached|Wait for collection to automatically restart, or increase the daily data volume limit described in manage the maximum daily data volume. The daily cap reset time is shows on the **Daily Cap** page. |
| Your workspace has hit the [Data Ingestion Volume Rate](../service-limits.md#log-analytics-workspaces) | The default ingestion volume rate limit for data sent from Azure resources using diagnostic settings is approximately 6 GB/min per workspace. This is an approximate value because the actual size can vary between data types, depending on the log length and its compression ratio. This limit doesn't apply to data that's sent from agents or the Data Collector API. If you send data at a higher rate to a single workspace, some data is dropped, and an event is sent to the Operation table in your workspace every 6 hours while the threshold continues to be exceeded. If your ingestion volume continues to exceed the rate limit or you are expecting to reach it sometime soon, you can request an increase to your workspace by sending an email to LAIngestionRate@microsoft.com or by opening a support request. The event to look for that indicates a data ingestion rate limit can be found by the query `Operation | where OperationCategory == "Ingestion" | where Detail startswith "The rate of data crossed the threshold"`. |
|Daily limit of legacy Free pricing tier  reached |Wait until the following day for collection to automatically restart, or change to a paid pricing tier.|
|Azure subscription is in a suspended state due to:<br> Free trial ended<br> Azure pass expired<br> Monthly spending limit reached (such as on an MSDN or Visual Studio subscription)|Convert to a paid subscription<br> Remove limit, or wait until limit resets|

To be notified when data collection stops, use the steps described in the [Alert when daily cap is reached](#alert-when-daily-cap-is-reached) section. To configure an e-mail, webhook, or runbook action for the alert rule, use the steps described in [create an action group](../alerts/action-groups.md). 

## Limits summary

There are additional Log Analytics limits, some of which depend on the Log Analytics pricing tier. These are documented at [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#log-analytics-workspaces).


## Next steps

- See [Log searches in Azure Monitor Logs](../logs/log-query-overview.md) to learn how to use the search language. You can use search queries to perform additional analysis on the usage data.
- Use the steps described in [create a new log alert](../alerts/alerts-metric.md) to be notified when a search criteria is met.
- Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers.
- To configure an effective event collection policy, review [Microsoft Defender for Cloud filtering policy](../../security-center/security-center-enable-data-collection.md).
- Change [performance counter configuration](../agents/data-sources-performance-counters.md).
- To modify your event collection settings, review [event log configuration](../agents/data-sources-windows-events.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
