---
title: Log data ingestion time in Azure Monitor | Microsoft Docs
description: This article explains the different factors that affect latency in collecting log data in Azure Monitor.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: eternovsky
ms.date: 03/21/2022

---

# Log data ingestion time in Azure Monitor
Azure Monitor is a high-scale data service that serves thousands of customers that send terabytes of data each month at a growing pace. There are often questions about the time it takes for log data to become available after it's collected. This article explains the different factors that affect this latency.

## Average latency
Latency refers to the time that data is created on the monitored system and the time that it becomes available for analysis in Azure Monitor. The average latency to ingest log data is *between 20 seconds and 3 minutes*. The specific latency for any particular data will vary depending on several factors that are explained in this article.

## Factors affecting latency
The total ingestion time for a particular set of data can be broken down into the following high-level areas:

- **Agent time**: The time to discover an event, collect it, and then send it to a [data collection endpoint](../essentials/data-collection-endpoint-overview.md) as a log record. In most cases, this process is handled by an agent. More latency might be introduced by the network.
- **Pipeline time**: The time for the ingestion pipeline to process the log record. This time period includes parsing the properties of the event and potentially adding calculated information.
- **Indexing time**: The time spent to ingest a log record into an Azure Monitor big data store.

Details on the different latency introduced in this process are described in the following sections.

### Agent collection latency

**Time varies**

Agents and management solutions use different strategies to collect data from a virtual machine, which might affect the latency. Some specific examples are listed in the following table.

| Type of data  | Collection frequency  | Notes |
|:--------------|:----------------------|:------|
| Windows events, Syslog events, and performance metrics | Collected immediately| |
| Linux performance counters | Polled at 30-second intervals| |
| IIS logs and text logs | Collected after their timestamp changes | For IIS logs, this schedule is influenced by the [rollover schedule configured on IIS](../agents/data-sources-iis-logs.md). |
| Active Directory Replication solution | Assessment every five days | The agent collects the logs only when assessment is complete.|
| Active Directory Assessment solution | Weekly assessment of your Active Directory infrastructure | The agent collects the logs only when assessment is complete.|

### Agent upload frequency

**Under 1 minute**

To ensure the Log Analytics agent is lightweight, the agent buffers logs and periodically uploads them to Azure Monitor. Upload frequency varies between 30 seconds and 2 minutes depending on the type of data. Most data is uploaded in under 1 minute.

### Network

**Varies**

Network conditions might negatively affect the latency of this data to reach a data collection endpoint.

### Azure metrics, resource logs, activity log

**30 seconds to 15 minutes**

Azure data adds more time to become available at a data collection endpoint for processing:

- **Azure platform metrics** are available in under a minute in the metrics database, but they take another 3 minutes to be exported to the data collection endpoint.
- **Resource logs** typically add 30 to 90 seconds, depending on the Azure service. Some Azure services (specifically, Azure SQL Database and Azure Virtual Network) currently report their logs at 5-minute intervals. Work is in progress to improve this time further. To examine this latency in your environment, see the [query that follows](#check-ingestion-time).
- **Activity log** data is ingested in 30 seconds when you use the recommended subscription-level diagnostic settings to send them into Azure Monitor Logs. They might take 10 to 15 minutes if you instead use the legacy integration.

### Management solutions collection

**Varies**

Some solutions don't collect their data from an agent and might use a collection method that introduces more latency. Some solutions collect data at regular intervals without attempting near real time collection. Specific examples include:

- Microsoft 365 solution polls activity logs by using the Management Activity API, which currently doesn't provide any near real time latency guarantees.
- Windows Analytics solutions (Update Compliance, for example) data is collected by the solution at a daily frequency.

To determine a solution's collection frequency, see the [documentation for each solution](/previous-versions/azure/azure-monitor/insights/solutions).

### Pipeline-process time

**30 to 60 seconds**

After the data is available at the data collection endpoint, it takes another 30 to 60 seconds to be available for querying.

After log records are ingested into the Azure Monitor pipeline (as identified in the [_TimeReceived](./log-standard-columns.md#_timereceived) property), they're written to temporary storage to ensure tenant isolation and to make sure that data isn't lost. This process typically adds 5 to 15 seconds.

Some solutions implement heavier algorithms to aggregate data and derive insights as data is streaming in. For example, Application Insights calculates application map data; Azure Network Performance Monitoring aggregates incoming data over 3-minute intervals, which effectively adds 3-minute latency.

Another process that adds latency is the process that handles custom logs. In some cases, this process might add a few minutes of latency to logs that are collected from files by the agent.

### New custom data types provisioning

When a new type of custom data is created from a [custom log](../agents/data-sources-custom-logs.md) or the [Data Collector API](../logs/data-collector-api.md), the system creates a dedicated storage container. This one-time overhead occurs only on the first appearance of this data type.

### Surge protection

**Typically less than 1 minute, but can be more**

The top priority of Azure Monitor is to ensure that no customer data is lost, so the system has built-in protection for data surges. This protection includes buffers to ensure that even under immense load, the system will keep functioning. Under normal load, these controls add less than a minute. In extreme conditions and failures, they could add significant time while ensuring data is safe.

### Indexing time

**5 minutes or less**

There's a built-in balance for every big data platform between providing analytics and advanced search capabilities as opposed to providing immediate access to the data. With Azure Monitor, you can run powerful queries on billions of records and get results within a few seconds. This performance is made possible because the infrastructure transforms the data dramatically during its ingestion and stores it in unique compact structures. The system buffers the data until enough of it is available to create these structures. This process must be completed before the log record appears in search results.

This process currently takes about 5 minutes when there's a low volume of data, but it can take less time at higher data rates. This behavior seems counterintuitive, but this process allows optimization of latency for high-volume production workloads.

## Check ingestion time
Ingestion time might vary for different resources under different circumstances. You can use log queries to identify specific behavior of your environment. The following table specifies how you can determine the different times for a record as it's created and sent to Azure Monitor.

| Step | Property or function | Comments |
|:---|:---|:---|
| Record created at data source | [TimeGenerated](./log-standard-columns.md#timegenerated) <br>If the data source doesn't set this value, it will be set to the same time as _TimeReceived. | If at processing time the Time Generated value is older than two days, the row will be dropped. |
| Record received by the data collection endpoint | [_TimeReceived](./log-standard-columns.md#_timereceived) | This field isn't optimized for mass processing and shouldn't be used to filter large datasets. |
| Record stored in workspace and available for queries | [ingestion_time()](/azure/kusto/query/ingestiontimefunction) | We recommend using `ingestion_time()` if there's a need to filter only records that were ingested in a certain time window. In such cases, we recommend also adding a `TimeGenerated` filter with a larger range. |

### Ingestion latency delays
You can measure the latency of a specific record by comparing the result of the [ingestion_time()](/azure/kusto/query/ingestiontimefunction) function to the `TimeGenerated` property. This data can be used with various aggregations to discover how ingestion latency behaves. Examine some percentile of the ingestion time to get insights for large amounts of data.

For example, the following query will show you which computers had the highest ingestion time over the prior 8 hours:

``` Kusto
Heartbeat
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| extend AgentLatency = _TimeReceived - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95), percentiles(AgentLatency,50,95) by Computer 
| top 20 by percentile_E2EIngestionLatency_95 desc
```

The preceding percentile checks are good for finding general trends in latency. To identify a short-term spike in latency, using the maximum (`max()`) might be more effective.

If you want to drill down on the ingestion time for a specific computer over a period of time, use the following query, which also visualizes the data from the past day in a graph:

``` Kusto
Heartbeat 
| where TimeGenerated > ago(24h) //and Computer == "ContosoWeb2-Linux"  
| extend E2EIngestionLatencyMin = todouble(datetime_diff("Second",ingestion_time(),TimeGenerated))/60 
| extend AgentLatencyMin = todouble(datetime_diff("Second",_TimeReceived,TimeGenerated))/60 
| summarize percentiles(E2EIngestionLatencyMin,50,95), percentiles(AgentLatencyMin,50,95) by bin(TimeGenerated,30m) 
| render timechart
```

Use the following query to show computer ingestion time by the country/region where they're located, which is based on their IP address:

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
In some cases, a resource could stop sending data. To understand if a resource is sending data or not, look at its most recent record, which can be identified by the standard `TimeGenerated` field.

Use the `Heartbeat` table to check the availability of a VM because a heartbeat is sent once a minute by the agent. Use the following query to list the active computers that haven’t reported heartbeat recently:

``` Kusto
Heartbeat  
| where TimeGenerated > ago(1d) //show only VMs that were active in the last day 
| summarize NoHeartbeatPeriod = now() - max(TimeGenerated) by Computer  
| top 20 by NoHeartbeatPeriod desc 
```

## Next steps

Read the [service-level agreement](https://azure.microsoft.com/support/legal/sla/monitor/v1_3/) for Azure Monitor.
