---  
title: KQL and the Microsoft Sentinel data lake
titleSuffix: Microsoft Security  
description: Exploring and interacting with the Microsoft Sentinel data lake using KQL
author: EdB-MSFT  
ms.service: microsoft-sentinel
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 08/27/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security analyst, I want to understand how I can use KQL to explore and analyze data in the Microsoft Sentinel data lake, so that I can effectively investigate incidents and enhance my security operations.

---

# KQL and the Microsoft Sentinel data lake
 
With Microsoft Sentinel data lake, you can store and analyze high-volume, low-fidelity logs like firewall or DNS data, asset inventories, and historical records for up to 12 years. Because storage and compute are decoupled, you can query the same copy of data using multiple tools, without moving or duplicating it.

You can explore data in the data lake using Kusto Query Language (KQL) and Jupyter Notebooks, to support a wide range of scenarios, from threat hunting and investigations to enrichment and machine learning.

This article introduces the core concepts and scenarios of data lake exploration, highlights common use cases, and shows how to interact with your data using familiar tools.

## KQL interactive queries

Use Kusto Query Language (KQL) to run interactive queries directly on the data lake over multiple workspaces. 

Using KQL, analysts can:

+ Investigate and respond using historical data: Use long-term data in the data lake to gather forensic evidence, investigate an incident, detect patterns, and respond incidents.
+ Enrich investigations with high-volume logs: Leverage noisy or low-fidelity data stored in the data lake to add context and depth to security investigations.
+ Correlate asset and logs data in the data lake: Query asset inventories and identity logs to connect user activity with resources and uncover broader attack.

Use **KQL queries** under  **Microsoft Sentinel** > **Data lake exploration** in the Defender portal to run ad-hoc interactive KQL queries directly on long-term data. **Data lake exploration** is available after the [onboarding](sentinel-lake-onboarding.md) process has been completed. KQL queries are ideal for SOC analysts investigating incidents where data may no longer reside in the analytics tier. Queries enable forensic analysis using familiar queries without rewriting code. To get started with KQL queries see [Data lake exploration - KQL queries](kql-queries.md). 

## KQL jobs 

KQL jobs are one-time or scheduled asynchronous KQL queries on data in the Microsoft Sentinel data lake. Jobs are useful for investigative and analytical scenarios for example; 
+ Long-running one-time queries for incident investigations and incident response (IR)
+ Data aggregation tasks that support enrichment workflows using low-fidelity logs
+ Historical threat intelligence (TI) matching scans for retrospective analysis
+ Anomaly detection scans that identify unusual patterns across multiple tables
+ Promote data from the data lake to the analytics tier to enable incident investigation or log correlation.

Run one-time KQL jobs on the data lake to promote specific historical data from the data lake tier to the analytics tier, or create custom summary tables in the data lake tier. Promoting data is useful for root cause analysis or zero-day detection when investigating incidents that span beyond the analytics tier window. Submit a scheduled job on data lake to automate recurring queries to detect anomalies or build baselines using historical data. Threat hunters can use this to monitor for unusual patterns over time and feed results into detections or dashboards. For more information, see [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md) and [Manage jobs in the Microsoft Sentinel data lake](kql-manage-jobs.md).


## Exploration scenarios

The following scenarios illustrate how KQL queries in the Microsoft Sentinel data lake can be used to enhance security operations:

| Scenario | Details | Example |
|--------------|---------|---------|
| **Investigate security incidents using long-term historical data** | Security teams often need to go beyond the default retention window to uncover the full scope of an incident. | A Tier 3 SOC analyst investigating a brute force attack uses KQL queries against the data lake to query data older than 90 days. After identifying suspicious activity from over a year ago, the analyst promotes the findings to the analytics tier for deeper analysis and incident correlation. |
| **Detect anomalies and build behavioral baselines over time** | Detection engineers rely on historical data to establish baselines and identify patterns that may indicate malicious behavior. | A detection engineer analyzes sign-in logs over several months to detect spikes in activity. By scheduling a KQL job in the data lake, they build a time-series baseline and uncover a pattern consistent with credential abuse. |
| **Enrich investigations using high-volume, low-fidelity logs** | Some logs are too noisy or voluminous for the analytics tier but are still valuable for contextual analysis. | SOC analysts use KQL to query network and firewall logs stored only in the data lake. These logs, while not in the analytics tier, help validate alerts and provide supporting evidence during investigations. |
| **Respond to emerging threats with flexible data tiering** | When new threat intelligence emerges, analysts need to quickly access and act on historical data. | A threat intelligence analyst reacts to a newly published threat analytics report by running the suggested KQL queries in the data lake. Upon discovering relevant activity from several months ago, the required log is promoted into the analytics tier. To enable real-time detection for future detections, tiering policies can be adjusted on the relevant tables to mirror most recent logs into analytics tier. |
| **Explore asset data from sources beyond traditional security logs** | Enrich investigation using asset inventory such as Microsoft Entra ID objects and Azure resources. | Analysts can use KQL to query identity and resource asset information, such as Microsoft Entra ID users, apps, groups, or Azure Resources inventories, to correlate logs for broader context that complements existing security data. |


## Related content

- [Microsoft Sentinel data lake overview](sentinel-lake-overview.md)
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md)
- [Manage jobs in the Microsoft Sentinel data lake](kql-manage-jobs.md)
- [Create and run notebooks in the Microsoft Sentinel data lake](notebooks-overview.md)