---
title: Data ingestion time in Azure Log Analytics | Microsoft Docs
description: Explains the different factors that affect latency in collecting data in Azure Log Analytics.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: 67710115-c861-40f8-a377-57c7fa6909b4
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/25/2018
ms.author: bwren

---
# Data ingestion time in Log Analytics
Azure Log Analytics is a very high scale data service that serves tens of thousands of customers sending terabytes of data each month at a growing pace. There are often questions about the time that the time that data is created by a monitored resource and when it becomes available in Log Analytics. This article article explains the different factors that affect this latency.

## What is the SLA for Log Analytics?
The Log Analytics SLA is a legal binding agreement that defines when Microsoft refunds money when the service doesn’t meet its goals. This isn't based on the typical performance of the system but its worst case which accounts for potential catastrophic situations. 


## Typical latency
Latency refers to the time that data is created on the monitored system and the time that it comes available for analysis in Log Analytics. The typical latency to ingest data into Log Analytics is between 3 and 10 minutes. The specific latency for any particular data will vary depending on a variety of factors explained below.

Today, 95% of the data is ingested in less than 7 minutes, and Microsoft is constantly working to reduce this time. 


## What is ingestion time?
Latency refers to the time that data is created on the monitored system and the time that it comes available for analysis in Log Analytics. This time is comprised of the following:

Agent time - The time to discover an event, collect the event, and send it to Log Analytics ingestion point as a log record. In most cases, this process is handled by an agent.

Pipeline time - The time for the ingestion pipeline to process the log record. This includes parsing the properties of the event and potentially processing required to XXX.

Indexing time – The time spent to ingest a log record into Log Analytics Big Data store.

### Agent collection latency
Agents and management solutions use different strategies to collect the data on the machine which may affect the latency. Some specific examples include:

- Windows events, syslog events, and performance metrics are collected immediately. Linux performance counters are polled at 30 second intervals.
- IIS logs and custom logs are collected once their timestamp changes. For IIS logs, this is influenced by the [rollover schedule configured on IIS](). 
- Active Directory Replication solution performs its assessment every five days, while the Active Directory Assessment solution performs a weekly assessment of your AD infrastructure. The agent will collect these logs only when assessment is complete.

### Agent upload frequency
To ensure Log Analytics agent is lightweight, the agent buffers logs and periodically uploads them to Log Analytics. Upload frequency varies between 30 sec to 2min based on the type of data, with most data uploaded under 1 minute. Network conditions may negatively affect the latency of this data to reach Log Analytics ingestion point.

### Azure diagnostics logs and metrics 
Depending on the Azure service, it can take 1-5 minutes for data to be available. It may take an additional 30-60 seconds for logs and 3 minutes for metrics for data to be send to Log Analytics ingestion point.  

### Management solutions collection
Some solutions do not collect their data from an agent and may use a collection method that introduces additional latency. Some solutions collect data at regular intervals without attempting near-real time collection. Specific examples include: 

- Office 365 solution polls activity logs using the Office 365 Management Activity API which currently does not provide any near-real time latency guarantees.
- Windows Analytics solutions (e.g. Update Compliance) data is collected by the solution at a daily frequency.

Refer to the documentation for each solution to determine its collection frequency.

### Pipeline-process time
Once log records are ingested into Log Analytics pipeline, they're written to temporary storage to ensure tenant isolation and to make sure that data isn't lost. This process typically adds 5-15 seconds. Some management solutions implement heavier algorithms to aggregate data and derive insights as data is streaming in. For example, the Network Performance Monitoring aggregates incoming data over 3 minute intervals, effectively adding 3 minute latency. 

### New custom data types provisioning
When a new type of custom data is created from a [custom log]() or the [Data Collector API](), the system creates a dedicated storage container. This is a one-time overhead that occurs only on the first appearance of this data type. 

### Surge protection
The top priority of Log Analytics is to ensure that no customer data is lost, so the system has  built-in protection for data surges. This includes buffers to ensure that even under immense load, the system will keep on functioning. Under normal load, these controls add less than a minute, but in extreme conditions and failures they could add significant time while ensuring  data is safe.  

### Indexing time
There is a built-in balance for every Big Data platform between providing analytics and advanced search capabilities as opposed to providing immediate access to the data. Azure Log Analytics allows you to run very powerful queries on billions of records and get results within a few seconds. This is made possible because the infrastructure transforms the data dramatically during its ingestion and stores it in unique compact structures. The system buffers the data until enough of it is available to create these structures. This must be completed before the log record appears in search results.

This process takes more time currently takes about 5 minutes when there is low volume of data but less time at higher data rates. This seems counterintuitive, but this process allows optimization of latency for high-volume production workloads.



## Checking ingestion time
You can use data in the **Usage** table to check the average latency from the Log Analytics ingestion point. This doesn't take into account any latency before the data reaches Log Analytics.

Use the following query to view the average latency and data batches that have complied with SLA for each data type.

    Usage
    | summarize avg(AvgLatencyInSeconds), sum(BatchesWithinSla), sum(BatchesOutsideSla) by Solution, DataType

Use the following query to view the average latency and data batches that have complied with SLA for each computer.

    Usage
    | summarize avg(AvgLatencyInSeconds), sum(BatchesWithinSla), sum(BatchesOutsideSla) by Solution, DataType


You can use the **Heartbeat** table to get an estimate of latency from agents. Since Heartbeat is sent once a minute, the difference between the current time and the last heartbeat record will ideally be as close to a minute as possible.

Use the following query to list the computers with the highest latency.

    Heartbeat 
    | summarize IngestionTime = now() - max(TimeGenerated) by Computer 
    | top 50 by IngestionTime asc  

 
Use the following query in large environments summarize the l

    Heartbeat 
    | summarize IngestionTime = now() - max(TimeGenerated) by Computer 
    | summarize percentiles(IngestionTime, 50,95,99)  


You can replace the Heartbeat table for every other agent-based data types that is saturated with data. Note that if the data type doesn’t have enough data, it would show the time of the most recent data that was sent. 


## Alerts
You can use [alerts in Azure](../monitoring-and-diagnostics/monitoring-overview-unified-alerts.md) to proactively notify you when an important condition occurs. You can base [alert rules on log searches in Log Analytics](../monitoring-and-diagnostics/monitor-alerts-unified-log.md) which allows you to implement complex logic across all your collected data. The minimum interval for a log search alert though is currently every give minutes.

[Metric alerts](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md) are more responsive than log alerts since they're optimized for speed. They cannot use data from Log Analytics though and rely on relatively simple logic using [metrics](../monitoring-and-diagnostics/monitoring-overview-metrics.md) collected in Azure.

A typical alerting strategy is to use metric alerts whenever possible because of their responsiveness. Use log alerts when you require log data or more complex logic.


## Next steps
* Learn about [solutions](log-analytics-add-solutions.md) that add functionality to Log Analytics and also collect data into the workspace.
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions.  
* Configure [alerts](log-analytics-alerts.md) to proactively notify you of critical data collected from data sources and solutions.
