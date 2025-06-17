---  
title: KQL and the Microsoft Sentinel data lake. (Preview)
titleSuffix: Microsoft Security  
description: Exploring and interacting with the Microsoft Sentinel data lake using KQL.
author: EdB-MSFT  
ms.service: sentinel  
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 06/16/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security analyst, I want to understand how I can use KQL to explore and analyze data in the Microsoft Sentinel data lake, so that I can effectively investigate incidents and enhance my security operations.

---


# KQL and the Microsoft Sentinel data lake (Preview)

## Overview
Microsoft Sentinel Lake is a modern, cloud-native security data lake that enables advanced analytics across all your security data. It brings together logs, alerts, and asset information into a single, unified platform—designed for scale, flexibility, and long-term retention.

With Microsoft Sentinel Lake, you can store and analyze high-volume, low-fidelity logs like firewall or DNS data, asset inventories, and historical records for up to 12 years. Because storage and compute are decoupled, you can query the same copy of data using multiple tools, without moving or duplicating it.

You can explore data in Lake using Kusto Query Language (KQL) and Jupyter Notebooks, to support a wide range of scenarios, from threat hunting and investigations to enrichment and machine learning.

This article introduces the core concepts and scenarios of data lake exploration, highlights common use cases, and shows how to interact with your data using familiar tools.



## Flexible Querying with KQL

Use Kusto Query Language (KQL) to run interactive queries directly on long-term data. Analysts can:

- Explore historical data and high volume/low fidelity logs using Lake Explorer.
- Promote data to analytics tier for detections.
- Schedule recurring jobs to automate investigations.


## Jobs

Jobs are used to run queries against the data in the lake tier and promote the results to the analytics tier and summarize data in lake tier. Microsoft Sentinel data lake supports jobs in both KQL and Jupyter notebooks.

- **KQL Jobs**: Schedule queries to run on historical data and write results to custom tables in the analytics tier. For more information, see [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md).
- **Notebooks**: Use jobs in Python notebooks to prepare data for machine learning and create summary dat in the lake tier, or promote data to the analytics tier. For more information, see [Create and run notebooks in the Microsoft Sentinel data lake](notebooks.md).



## KQL Queries 

KQL queries allow you to interactively explore and analyze data in the Microsoft Sentinel Lake. You can run ad-hoc queries, create scheduled jobs, and promote data to the Analytics tier for further analysis. The KQL query editor provides a familiar interface for security analysts to work with long-term data.

### Lake exploration scenarios for KQL

The following scenarios illustrate how KQL queries in the Microsoft Sentinel Lake can be used to enhance security operations:

| Scenario | Details | Example |
|----------|---------|---------|
| Investigate security incidents using long-term historical data | Security teams often need to go beyond the default retention window to uncover the full scope of an incident. | A Tier 3 SOC analyst investigating a brute force attack uses KQL queries on lake to query data older than 90 days. After identifying suspicious activity from over a year ago, the analyst promotes the findings to the analytics tier for deeper analysis and incident correlation. |
|Detect anomalies and build behavioral baselines over time| Detection engineers rely on historical data to establish baselines and identify patterns thats may indicate malicious behavior. | A detection engineer analyzes sign-in logs over several months to detect spikes in activity. By scheduling a KQL job in the Lake, they build a time-series baseline and uncover a pattern consistent with credential abuse. |
| Enrich investigations using high-volume, low-fidelity logs | Some logs are too noisy or voluminous for the analytics tier but are still valuable for contextual analysis. | Tier 1 and 2 SOC analysts use KQL to query network and firewall logs stored only in the lake. These logs, while not in the Analytics tier, help validate alerts and provide supporting evidence during investigations. |
| Respond to emerging threats with flexible data tiering | When new threat intelligence emerges, analysts need to quickly access and act on historical data. | A threat intelligence analyst reacts to a newly published threat analytics report by running the suggested KQL queries in the lake. Upon discovering relevant activity from several months ago, the required log is promoted into the Analytics tier. To enable real-time detection for future detections, tiering policies can be adjusted on the relevant tables to mirror most recent logs into analytics tier. |
| Explore asset data from sources beyond traditional security logs | Enrich investigation using asset inventory such as Microsoft Entra ID objects and Azure resources. | Analysts can use KQL to query identity and resource asset information, such as Microsoft Entra ID users, apps, groups, or Azure Resources inventories, to correlate logs for broader context that complements existing security data. |



## Getting Started with KQL on Microsoft Sentinel Lake<<<<rename>>>>


Use KQL queries under the Lake exploration in the Defender portal to run ad-hoc interactive KQL queries directly on long-term data. KQL queries are ideal for SOC analysts investigating incidents where data may no longer reside in the Analytics tier. Queries enable forensic analysis using familiar queries without rewriting code. To get started with QKL queries see [Data lake exploration - KQL queries (Preview).](kql-queries.md).

Use Azure Data Explorer to run interactive queries on Lake. Connect to Microsoft Sentinel Lake via ADX to run interactive KQL queries across Lake tables. This is ideal for data engineers or advanced analysts who prefer the ADX interface or need to integrate with broader analytics workflow. For more information, see [Exploring and interacting with lake data using Azure Data Explorer and KQL](kql-adx-data-lake-access.md).

Run one-time KQL jobs on lake data to promote specific historical data from the lake tier to the analytics tier. Promoting data is useful for root cause analysis or zero-day detection when investigating incidents that span beyond the hot tier window. Submit a scheduled job on lake to automate recurring queries to detect anomalies or build baselines using historical data. Threat hunters can use this to monitor for unusual patterns over time and feed results into detections or dashboards. For more information, see [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md) and [Manage jobs in the Microsoft Sentinel data lake](manage-jobs.md).



## Known Limitations
- Supported Kusto commands.
- Using out-of-the-box or custom functions isn't currently supported in Lake Explorer.
- Calling external data via KQL query in Lake isn't supported.
- `ingestion_time()` function isn't supported on tables in Lake.
- Kusto interactive query limitations such as default 10-minutes timeout or 64MB of data are applied.
- Interactive queries are limited to show up to 30,000 results. To obtain results beyond 30,000 rows, it is recommended to submit a KQL job.

## Related content

- [Microsoft Sentinel data lake overview (Preview)](overview.md)
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md)
- [Manage jobs in the Microsoft Sentinel data lake](manage-jobs.md)
- [Create and run notebooks in the Microsoft Sentinel data lake](notebooks.md)