---  
title: Compare KQL jobs, summary rules, and search jobs
titleSuffix: Microsoft Security  
description: Compare KQL jobs, summary rules, and search jobs in Microsoft Sentinel to choose the best tool for querying and analyzing security data.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 08/19/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security analyst, I need to choose the right tool for querying and analyzing data in Microsoft Sentinel.

---

# Compare KQL jobs, summary rules, and search jobs

This article compares KQL jobs, summary rules, and search jobs in Microsoft Sentinel. These features let you query and analyze data in Microsoft Sentinel, and each serves different purposes and use cases.

+ **KQL jobs**: Run one-time or scheduled asynchronous queries on data stored in the Microsoft Sentinel data lake. They're best for incident investigations using historical logs, enrichment using low-fidelity logs, and scenarios that need queries with joins or unions across multiple tables. For more information, see [KQL jobs](kql-jobs.md).

+ **Summary rules**: Run scheduled queries that aggregate and store insights from large sets of log data. They're ideal for frequent summarization tasks, like aggregating high-volume logs such as network insights. These rules run in the background and populate custom tables in Log Analytics. For more information, see [Summary rules](../summary-rules.md).

+ **Search jobs**: Run one-time, long-running asynchronous queries across large datasets. Search jobs are useful when you need to hydrate large volumes of data from a single table into a new custom table within the Analytics tier as a one-time operation for further investigation or forensic analysis. For more information, see [Search jobs](../search-jobs.md).

## Feature comparison

| Feature              | KQL Jobs                               | Summary Rules                      | Search jobs                      |
|----------------------|----------------------------------------|------------------------------------|----------------------------------|
| **Purpose**          | Run ad-hoc or scheduled queries for investigation and enrichment   | Aggregate and store insights from high-volume logs        | Run async queries on large datasets to store results in the analytics tier  |
| **Data tier**        | Microsoft Sentinel data lake tier   | Analytics, auxiliary, basic, data lake (except for tables in the default workspace)       | Analytics, auxiliary, basic, data lake (except for tables in the default workspace) |     
| **Workspace scope**  | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace  |
| **Table scope**      | Multiple tables                     | Multiple tables                                     | Single table                                                        |
| **Query language**   | [KQL jobs supported operators](kql-jobs.md#considerations-and-limitations)   | [Limited KQL operators](/azure/azure-monitor/logs/summary-rules?tabs=api#create-or-update-a-summary-rule) | [Limited KQL operators](/azure/azure-monitor/logs/search-jobs#kql-query-considerations)  |
| **Join support**     | Supported                      | Analytics tier: supported<br>Basic: join up to five Analytics tables using [lookup](/azure/data-explorer/kusto/query/lookup-operator) operator   | Not supported |
| **Scheduling frequency** | On-demand<br>Daily, weekly, monthly  | 20 minutes to 24 hours                                 | On-demand (long-running searches support up to a 24-hour timeout)  |
| **Lookback period**  | Up to 12 years                           | Up to 1 day                                         | Up to 12 years                                                            |
| **Timespan**         |  -                                       |      -                                              | Up to 1 year                                                              |
| **Timeout**          | 1 hour                                   | 10 minutes                                          | 24 hours                                                            |
| **Maximum number of results**|	Dependent on query timeout	|500,000 records	|1 million records
| **Pricing model**    | GB of data analyzed                         | Analytics tier: free<br>Basic and auxiliary tier: Data scan Log Analytics pricing model | GB of data analyzed                |



## Usage scenarios and feature choice

The following section helps you decide which feature is best for your needs.

If you have any of the following requirements, use KQL jobs:

+ You're onboarded to the Microsoft Sentinel data lake.
+ You require lookback greater than 24 hours.
+ You want to query historical data of up to 12 years.
+ You need to run complex queries involving full KQL operators including joins or unions.
+ You need ad-hoc investigation capabilities.
+ Data is in the default workspace.


Use summary rules if you have any of the following requirements:

+ Your tenant isn't onboarded to Microsoft Sentinel data lake, and your data may still reside in Auxiliary or Basic tiers.
+ You need lookback within 24 hours.
+ You need frequent summarization (for example, every 20 minutes).
+ You want to use out-of-the-box templates.

If you have any of the following requirements, use search jobs:

+ Your Microsoft Sentinel workspace isn't connected to Defender portal and your data resides in Analytics or basic tiers.
+ You have data in archive tier. If you're onboarded to Microsoft Sentinel data lake, to access data older than your onboarding date, use search jobs. For data from your onboarding date onward, use KQL jobs.
+ You need to hydrate large volumes of data from a single table. 
+ Your use case involves targeted extraction rather than frequent summarization or complex multi-table joins.
+ You want to analyze up to one year of historical data within a table from any data tier.

## Related articles

- [KQL and the Microsoft Sentinel data lake (preview)](kql-overview.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake (preview)](notebooks-overview.md)
- [Aggregate Microsoft Sentinel data with summary rules](../summary-rules.md)
- [Search for specific events across large datasets in Microsoft Sentinel](../search-jobs.md)  
