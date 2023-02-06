---
title: Monitor and troubleshoot data ingestion latency in Azure Monitor Logs
description: This article explains the different factors that affect latency in collecting log data in Azure Monitor.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: eternovsky
ms.date: 01/31/2023

---

# Monitor and troubleshoot data ingestion latency in Azure Monitor Logs
Latency refers to the amount of time it takes for log data to become available in Azure Monitor Logs after it's collected from a monitored resource. The typical latency for log data in Azure Monitor Logs is between 20 seconds and three minutes. This article explains the factors that affect latency in Azure Monitor Logs and how to monitor latency in a Log Analytics workspace.


## Monitor Log Analytics workspace health

[Azure Service Health](../../service-health/overview.md) monitors the [resource health](../../service-health/resource-health-overview.md) and [service health](../../service-health/service-health-overview.md) of your Log Analytics workspace.
 
To view your Log Analytics workspace health, select **Resource health** from the Log Analytics workspace menu.

:::image type="content" source="media/data-ingestion-time/log-analytics-workspace-latency.png" lightbox="media/data-ingestion-time/log-analytics-workspace-latency.png" alt-text="Screenshot that shows the Resource health screen for a Log Analytics workspace.":::  


## Factors that affect latency

The factors that affect latency are:

- [Data collection time](#data-collection-time): The time it takes to discover an event, collect it, and send it to an Azure Monitor Logs ingestion point as a log record. 
- [Pipeline processing time](#pipeline-processing-time): The time for the ingestion pipeline to process the log record. This time period includes parsing the properties of the event and potentially adding calculated information.
- [Indexing time](#indexing-time): The time spent to ingest a log record into an Azure Monitor big data store.

The following sections detail the latency introduced by each of these factors.

### Data collection time

In most cases, Azure Monitor collects log data directly from Azure resource and uses an agent to collect data from non-Azure resources. 
#### Collection by Azure Monitor Agent

**Typical latency: Varies**

[Azure Monitor Agent](../agents/agents-overview.md) uses various strategies to collect different types collect data. For example:

| Type of data  | Collection frequency  |
|:--------------|:----------------------|
| Windows events, Syslog events, and performance metrics | Collected immediately|
| Linux performance counters | Polled at 30-second intervals|
| IIS logs and text logs | Collected when their timestamp changes | 

Azure Monitor Agent buffers log data before sending it to an Azure Monitor Logs ingestion point within a minute of the collection time.

Network conditions can affect how long it takes for data to reach an Azure Monitor Logs ingestion point.

#### Collection from Azure resources

**Typical latency: 30 seconds to 15 minutes**

Azure data adds more time to become available at an Azure Monitor Logs ingestion point for processing:

| Type of data  | Collection frequency  |
|:--------------|:----------------------|
| Azure platform metrics | Available in under a minute in the metrics database, but they take another three minutes to be exported to the Azure Monitor Logs ingestion point.|
| Resource logs | Typically, 30 to 90 seconds, depending on the Azure service.<br/> SQL Database and Azure Virtual Network currently report their logs at 5-minute intervals. Work is in progress to improve this time.<br/>To examine this latency in your environment, see the [query that follows](#investigate-latency).|
|Activity log| 30 seconds when you use the recommended subscription-level diagnostic settings to send them to Azure Monitor Logs.

### Pipeline processing time

**Typical latency: 30 to 60 seconds**

It takes 30 to 60 seconds before data that arrives at an ingestion point is available for querying.

When log records arrive at an Azure Monitor ingestion point (as identified in the [_TimeReceived](./log-standard-columns.md#_timereceived) property), they're written to temporary storage to ensure tenant isolation and to make sure that data isn't lost. This process typically takes 5 to 15 seconds.

In some cases, a few minutes of latency are introduced when Azure Monitor Agent collects logs from files. When you introduce a new type of custom data using the [Logs ingestion API](../logs/logs-ingestion-api-overview.md) or the [Data Collector API](../logs/data-collector-api.md), the system creates a dedicated storage container. This one-time overhead occurs only on the first appearance of this data type.

#### Surge protection

**Typical latency: Less than a minute, but can be more**

Azure Monitor has built-in protection for data surges to ensure that your data doesn't get lost. This protection includes buffers, so the system keeps functioning even under immense loads. Under normal loads, these controls add less than a minute of latency. In extreme conditions and when failures occur, these measures can add significant latency, while ensuring data is safe.

### Indexing time

**Typical latency: 5 minutes or less**

Azure Monitor lets you run powerful queries on billions of records and get results within seconds. This performance is made possible because the infrastructure transforms the data dramatically during its ingestion and stores it in unique compact structures. The system buffers the data until enough of it is available to create these structures. This process must be completed before the log record appears in search results.

The indexing process currently takes about 5 minutes when there's a low volume of data, but it can take less time at higher data rates. This behavior seems counterintuitive, but the process allows optimization of latency for high-volume production workloads.

## Investigate latency
Use [log queries](../logs/get-started-queries.md) to investigate [which factors might be causing latency](#factors-that-affect-latency) in your environment. 

This table specifies which log property you can use to check when the various steps in the data ingestion process occurred:

| Step | Property or function | Comments |
|:---|:---|:---|
| Record created at data source | [TimeGenerated](./log-standard-columns.md#timegenerated) <br>If the data source doesn't set this value, it will be set to the same time as _TimeReceived. | The record is dropped if the `TimeGenerated` value is older than three days at processing time. |
| Record received at Azure Monitor ingestion endpoint | [_TimeReceived](./log-standard-columns.md#_timereceived) | This field isn't optimized for mass processing and shouldn't be used to filter large datasets. |
| Record stored in workspace and available for queries | [ingestion_time()](/azure/kusto/query/ingestiontimefunction) | Use `ingestion_time()` to retrieve records that were ingested in a certain time window. Add a `TimeGenerated` filter with a larger range to compare generation and ingestion time. |

### Ingestion latency delays
You can measure the latency of a specific record by comparing the result of the [ingestion_time()](/azure/kusto/query/ingestiontimefunction) function to the `TimeGenerated` property. Use this data with various aggregations to discover how ingestion latency behaves. Examine a specific percentile of the ingestion time to get insights for large amounts of data.

For example, this query shows which computers had the highest ingestion time in the last eight hours:

``` Kusto
Heartbeat
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| extend AgentLatency = _TimeReceived - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95), percentiles(AgentLatency,50,95) by Computer 
| top 20 by percentile_E2EIngestionLatency_95 desc
```

The [percentiles() aggregation function](/azure/data-explorer/kusto/query/percentiles-aggfunction) is good for finding general trends in latency. To identify a short-term spike in latency, use the [max() aggregation function](/data-explorer/kusto/query/max-aggfunction).

To check the ingestion time for a specific computer over a period of time, use this query, which visualizes the data from the past day in a graph:

``` Kusto
Heartbeat 
| where TimeGenerated > ago(24h) //and Computer == "ContosoWeb2-Linux"  
| extend E2EIngestionLatencyMin = todouble(datetime_diff("Second",ingestion_time(),TimeGenerated))/60 
| extend AgentLatencyMin = todouble(datetime_diff("Second",_TimeReceived,TimeGenerated))/60 
| summarize percentiles(E2EIngestionLatencyMin,50,95), percentiles(AgentLatencyMin,50,95) by bin(TimeGenerated,30m) 
| render timechart
```

This query shows computer ingestion time by the country/region where the computer is located, based on IP address:

``` Kusto
Heartbeat 
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| extend AgentLatency = _TimeReceived - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95),percentiles(AgentLatency,50,95) by RemoteIPCountry 
```

Different data types originating from the agent might have different ingestion latency time, so the previous queries could be used with other types. Use the following query to examine the ingestion time of various Azure services:

``` Kusto
AzureDiagnostics 
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| extend AgentLatency = _TimeReceived - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95), percentiles(AgentLatency,50,95) by ResourceProvider
```

### Resources that stop responding
In some cases, a resource could stop sending data. To understand whether a resource is sending data, look at its most recent record, which you can identify by the standard `TimeGenerated` field.

Use the `Heartbeat` table to check the availability of a VM because a heartbeat is sent once a minute by the agent. Use the following query to list the active computers that haven’t reported a heartbeat recently:

``` Kusto
Heartbeat  
| where TimeGenerated > ago(1d) //show only VMs that were active in the last day 
| summarize NoHeartbeatPeriod = now() - max(TimeGenerated) by Computer  
| top 20 by NoHeartbeatPeriod desc 
```

## Next steps

Read the [service-level agreement](https://azure.microsoft.com/support/legal/sla/monitor/v1_3/) for Azure Monitor.
