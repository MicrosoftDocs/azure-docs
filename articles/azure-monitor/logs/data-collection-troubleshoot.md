---
title: Troubleshoot why data is no longer being collected in Azure Monitor
description: Steps to take if data is no longer being collected in Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 08/06/2024
---
 
# Troubleshoot why data is no longer being collected in Azure Monitor
This article explains how to detect when data collection in Azure Monitor stops and details steps you can take to address data collection issues.

> [!IMPORTANT]
> If you're troubleshooting data collection for a scenario that uses a data collection rule (DCR) such as Azure Monitor agent or Logs ingestion API, see [Monitor and troubleshoot DCR data collection in Azure Monitor](../essentials/data-collection-monitor.md) for additional troubleshooting information.

## Daily cap reached

The [daily cap](daily-cap.md) limits the amount of data that a Log Analytics workspace can collect in a day. When the daily cap is reached, data collection stops until the reset time. You can either wait for collection to automatically restart, or increase the daily data volume limit.

#### Check Log Analytics workspace data collection status

When data collection in a Log Analytics workspace stops, an event with a type of **Operation** is created in the workspace. Run the following query to check whether you're reaching the daily limit and missing data: 

```kusto
Operation | where OperationCategory == 'Data Collection Status'
```

When data collection stops, the **OperationStatus** is **Warning**. When data collection starts, the **OperationStatus** is **Succeeded**.

To be notified when data collection stops, use the steps described in the [Alert when daily cap is reached](daily-cap.md#alert-when-daily-cap-is-reached) section. To configure an e-mail, webhook, or runbook action for the alert rule, use the steps described in [create an action group](../alerts/action-groups.md). 

## Ingestion volume rate limit reached
The [default ingestion volume rate limit](../service-limits.md#log-analytics-workspaces) for data sent from Azure resources using diagnostic settings is approximately 6 GB/min per workspace. This is an approximate value because the actual size can vary between data types, depending on the log length and its compression ratio. This limit doesn't apply to data that's sent from agents or the [Logs ingestion API](logs-ingestion-api-overview.md). 

If you send data at a higher rate to a single workspace, some data is dropped, and an event is sent to the **Operation** table in your workspace every six hours while the threshold continues to be exceeded. If your ingestion volume continues to exceed the rate limit or you're expecting to reach it sometime soon, you can request an increase to your workspace by sending an email to LAIngestionRate@microsoft.com or by opening a support request. 

#### Check whether your workspace reached its data ingestion rate limit

Use this query to retrieve the record that indicates the data ingestion rate limit was reached.

```kusto
Operation 
| where OperationCategory == "Ingestion" 
| where Detail startswith "The rate of data crossed the threshold"
```
## Legacy free pricing tier daily ingestion limit reached 
If your Log Analytics workspace is in the [legacy Free pricing tier](cost-logs.md#legacy-pricing-tiers) and has collected more than 500 MB of data in a day, data collection stops for the rest of the day. Wait until the following day for collection to automatically restart, or change to a paid pricing tier.

## Azure Monitor Agent not sending data

[Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) collects data from virtual machines and sends the data to Azure Monitor. An agent might stop sending data to your Log Analytics workspace in various scenarios. For example, when [Azure Site Recovery](/azure/site-recovery/site-recovery-overview) recovers a virtual machine in a disaster recovery scenario, the resource ID of the machine changes, requiring reinstallation of Azure Monitor Agent on the machine.

#### Check the health of agents sending data to your workspace

Azure Monitor Agent instances installed on all virtual machines that send data to your Log Analytics workspace send a heartbeat to the [Heartbeat table](/azure/azure-monitor/reference/tables/heartbeat) every minute.

Run this query to list VMs that haven't reported a heartbeat in the last five minutes:

```kusto
Heartbeat 
| where TimeGenerated > ago(24h)
| summarize LastCall = max(TimeGenerated) by Computer, _ResourceId
| where LastCall < ago(5m)
```

## Azure subscription is suspended 
Your Azure subscription could be in a suspended state for one of the following reasons:

- Free trial ended
- Azure pass expired
- Monthly spending limit reached (such as on an MSDN or Visual Studio subscription)

## Other Log Analytics workspace limits

There are other Log Analytics limits, some of which depend on the Log Analytics pricing tier. For more information, see [Azure subscription and service limits, quotas, and constraints](../service-limits.md#log-analytics-workspaces).


## Next steps

- See [Analyze usage in Log Analytics workspace](../logs/analyze-usage.md) for details on analyzing the data in your workspace to determine to source of any higher than expected usage and opportunities to reduce your amount of data collected.
