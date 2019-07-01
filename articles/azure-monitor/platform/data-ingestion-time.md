---
title: Log data ingestion time in Azure Monitor | Microsoft Docs
description: Explains the different factors that affect latency in collecting log data in Azure Monitor.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn
ms.service: log-analytics
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/24/2019
ms.author: bwren
---
# Log data ingestion time in Azure Monitor
Azure Monitor is a high scale data service that serves thousands of customers sending terabytes of data each month at a growing pace. There are often questions about the time it takes for log data to become available after it's collected. This article explains the different factors that affect this latency.

## Typical latency
Latency refers to the time that data is created on the monitored system and the time that it comes available for analysis in Azure Monitor. The typical latency to ingest log data is between 2 and 5 minutes. The specific latency for any particular data will vary depending on a variety of factors explained below.


## Factors affecting latency
The total ingestion time for a particular set of data can be broken down into the following high-level areas. 

- Agent time - The time to discover an event, collect it, and then send it to Azure Monitor ingestion point as a log record. In most cases, this process is handled by an agent.
- Pipeline time - The time for the ingestion pipeline to process the log record. This includes parsing the properties of the event and potentially adding calculated information.
- Indexing time – The time spent to ingest a log record into Azure Monitor big data store.

Details on the different latency introduced in this process are described below.

### Agent collection latency
Agents and management solutions use different strategies to collect data from a virtual machine, which may affect the latency. Some specific examples include the following:

- Windows events, syslog events, and performance metrics are collected immediately. Linux performance counters are polled at 30-second intervals.
- IIS logs and custom logs are collected once their timestamp changes. For IIS logs, this is influenced by the [rollover schedule configured on IIS](data-sources-iis-logs.md). 
- Active Directory Replication solution performs its assessment every five days, while the Active Directory Assessment solution performs a weekly assessment of your Active Directory infrastructure. The agent will collect these logs only when assessment is complete.

### Agent upload frequency
To ensure the Log Analytics agent is lightweight, the agent buffers logs and periodically uploads them to Azure Monitor. Upload frequency varies between 30 seconds and 2 minutes depending on the type of data. Most data is uploaded in under 1 minute. Network conditions may negatively affect the latency of this data to reach Azure Monitor ingestion point.

### Azure activity logs, diagnostic logs and metrics
Azure data adds additional time to become available at Log Analytics ingestion point for processing:

- Data from diagnostic logs take 2-15 minutes, depending on the Azure service. See the [query below](#checking-ingestion-time) to examine this latency in your environment
- Azure platform metrics take 3 minutes to be sent to Log Analytics ingestion point.
- Activity log data will take about 10-15 minutes to be sent to Log Analytics ingestion point.

Once available at ingestion point, data takes additional 2-5 minutes to be available for querying.

### Management solutions collection
Some solutions do not collect their data from an agent and may use a collection method that introduces additional latency. Some solutions collect data at regular intervals without attempting near-real time collection. Specific examples include the following:

- Office 365 solution polls activity logs using the Office 365 Management Activity API, which currently does not provide any near-real time latency guarantees.
- Windows Analytics solutions (Update Compliance for example) data is collected by the solution at a daily frequency.

Refer to the documentation for each solution to determine its collection frequency.

### Pipeline-process time
Once log records are ingested into the Azure Monitor pipeline, they're written to temporary storage to ensure tenant isolation and to make sure that data isn't lost. This process typically adds 5-15 seconds. Some management solutions implement heavier algorithms to aggregate data and derive insights as data is streaming in. For example, the Network Performance Monitoring aggregates incoming data over 3-minute intervals, effectively adding 3-minute latency. Another process that adds latency is the process that handles custom logs. In some cases, this process might add few minutes of latency to logs that are collected from files by the agent.

### New custom data types provisioning
When a new type of custom data is created from a [custom log](data-sources-custom-logs.md) or the [Data Collector API](data-collector-api.md), the system creates a dedicated storage container. This is a one-time overhead that occurs only on the first appearance of this data type.

### Surge protection
The top priority of Azure Monitor is to ensure that no customer data is lost, so the system has built-in protection for data surges. This includes buffers to ensure that even under immense load, the system will keep functioning. Under normal load, these controls add less than a minute, but in extreme conditions and failures they could add significant time while ensuring data is safe.

### Indexing time
There is a built-in balance for every big data platform between providing analytics and advanced search capabilities as opposed to providing immediate access to the data. Azure Monitor allows you to run powerful queries on billions of records and get results within a few seconds. This is made possible because the infrastructure transforms the data dramatically during its ingestion and stores it in unique compact structures. The system buffers the data until enough of it is available to create these structures. This must be completed before the log record appears in search results.

This process currently takes about 5 minutes when there is low volume of data but less time at higher data rates. This seems counterintuitive, but this process allows optimization of latency for high-volume production workloads.



## Checking ingestion time
Ingestion time may vary for different resources under different circumstances. You can use log queries to identify specific behavior of your environment.

### Ingestion latency delays
You can measure the latency of a specific record by comparing the result of the [ingestion_time()](/azure/kusto/query/ingestiontimefunction) function to the _TimeGenerated_ field. This data can be used with various aggregations to find how ingestion latency behaves. Examine some percentile of the ingestion time to get insights for large amount of data. 

For example, the following query will show you which computers had the highest ingestion time over the current day: 

``` Kusto
Heartbeat
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95) by Computer 
| top 20 by percentile_E2EIngestionLatency_95 desc  
```
 
If you want to drill down on the ingestion time for a specific computer over a period of time, use the following query which also visualizes the data in a graph: 

``` Kusto
Heartbeat 
| where TimeGenerated > ago(24h) and Computer == "ContosoWeb2-Linux"  
| extend E2EIngestionLatencyMin = todouble(datetime_diff("Second",ingestion_time(),TimeGenerated))/60 
| summarize percentiles(E2EIngestionLatencyMin,50,95) by bin(TimeGenerated,30m) 
| render timechart  
```
 
Use the following query to show computer ingestion time by the country/region they are located in which is based on their IP address: 

``` Kusto
Heartbeat 
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95) by RemoteIPCountry 
```
 
Different data types originating from the agent might have different ingestion latency time, so the previous queries could be used with other types. Use the following query to examine the ingestion time of various Azure services: 

``` Kusto
AzureDiagnostics 
| where TimeGenerated > ago(8h) 
| extend E2EIngestionLatency = ingestion_time() - TimeGenerated 
| summarize percentiles(E2EIngestionLatency,50,95) by ResourceProvider
```

### Resources that stop responding 
In some cases, a resource could stop sending data. To understand if a resource is sending data or not, look at its most recent record which can be identified by the standard _TimeGenerated_ field.  

Use the _Heartbeat_ table to check the availability of a VM, since a heartbeat is sent once a minute by the agent. Use the following query to list the active computers that haven’t reported heartbeat recently: 

``` Kusto
Heartbeat  
| where TimeGenerated > ago(1d) //show only VMs that were active in the last day 
| summarize NoHeartbeatPeriod = now() - max(TimeGenerated) by Computer  
| top 20 by NoHeartbeatPeriod desc 
```

## Next steps
* Read the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/log-analytics/v1_1/) for Azure Monitor.

