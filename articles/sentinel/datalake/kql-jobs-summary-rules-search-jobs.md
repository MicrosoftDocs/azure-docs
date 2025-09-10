---  
title: KQL jobs, Notebook jobs,  summary rules, and search jobs
titleSuffix: Microsoft Security  
description: A comparison of KQL jobs, Notebook jobs, summary rules, and search jobs in Microsoft Sentinel to choose the best tool for querying and analyzing security data.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 08/19/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security analyst, I need to choose the right tool for querying and analyzing data in Microsoft Sentinel.

---

# KQL jobs, Notebook jobs, summary rules, and search jobs

This article compares KQL jobs, Notebook jobs, summary rules, and search jobs in Microsoft Sentinel. These features let you query and analyze data in Microsoft Sentinel, and each serves different purposes and use cases.

>[!NOTE]
> KQL jobs and Notebook jobs require onboarding to the Microsoft Sentinel data lake. For more information, see [Onboard to the Microsoft Sentinel data lake (preview)](./sentinel-lake-onboarding.md).

+ **KQL jobs**: Run one-time or scheduled asynchronous queries on data stored in the Microsoft Sentinel data lake. KQL jobs are best for incident investigations using historical logs, enrichment using low-fidelity logs, and scenarios that need queries with joins or unions across multiple tables. For more information, see [KQL jobs](kql-jobs.md).

+ **Notebook jobs**: Run one-time or scheduled asynchronous queries on data stored in the Microsoft Sentinel data lake. Notebook jobs are a powerful Python-based tool for long-running async queries across large scale logs for security scenarios like anomaly detection, log aggregation, and applying machine learning. The jobs run in the background and can hydrate custom tables in the Microsoft Sentinel data lake or Log Analytics For more information, see [Notebook jobs](notebook-jobs.md).

+ **Summary rules**: Run frequent summarization jobs to aggregate high volume data such as network and firewall logs. Summary rules run in the background and store results in custom tables in the analytics tier.  For more information, see [Summary rules](../summary-rules.md).

+ **Search jobs**: Run one-time, long-running asynchronous queries across large datasets. Search jobs are useful when you need to hydrate large volumes of data from a single table into a new custom table within the analytics tier for further investigation or forensic analysis. For more information, see [Search jobs](../search-jobs.md).

## Feature comparison

| Feature              | KQL Jobs                               | Notebook jobs | Summary Rules                      | Search jobs                      |
|----------------------|----------------------------------------|------------------------|------------------------------------|----------------------------------|
| **Purpose**          | Run ad-hoc or scheduled queries for investigation and enrichment | Adhoc or scheduled queries on large datasets to aggregate and store insights in custom tables in the data lake or analytics tier | Aggregate and store insights from high-volume logs | Run async queries on large datasets to store results in the analytics tier |
| **Data tier**        | Microsoft Sentinel data lake tier   | Microsoft Sentinel data lake tier, analytics tier | Analytics, auxiliary, basic, data lake (except for tables in the default workspace) | Analytics, auxiliary, basic, data lake (except for tables in the default workspace) |
| **Workspace scope**  | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace  |
| **Table scope**      | Multiple tables                     | Multiple tables       | Multiple tables                                     | Single table                      |  
| **Query language**   | [KQL jobs supported operators](kql-jobs.md#considerations-and-limitations) | Python | [Limited KQL operators](/azure/azure-monitor/logs/summary-rules?tabs=api#create-or-update-a-summary-rule) | [Limited KQL operators](/azure/azure-monitor/logs/search-jobs#kql-query-considerations)  |
| **Join support**     | Supported                      | Supported    | Analytics tier: supported<br>Basic: join up to five Analytics tables using [lookup](/azure/data-explorer/kusto/query/lookup-operator) operator   | Not supported |
| **Scheduling frequency** | On-demand<br>Daily, weekly, monthly  | On-demand<br>Daily, Weekly, Monthly | 20 minutes to 24 hours                                 | On-demand (long-running searches support up to a 24-hour timeout)  |
| **Lookback period**  | Up to 12 years                           | Up to 12 years   | Up to 1 day                                         | Up to 12 years     |
| **Timespan**         |  -                                       | - |      -                                              | Up to 1 year       |
| **Timeout**          | 1 hour                                   | 8 hours | 10 minutes                                          | 24 hours           |
| **Maximum number of results**|	Dependent on query timeout	| |500,000 records	|1 million records |
| **Pricing model**    | GB of data analyzed                         | vCore hours consumed | Analytics tier: free<br>Basic and auxiliary tier: Data scan Log Analytics pricing model | GB of data analyzed |


## Feature comparison

| Feature | KQL Jobs | Summary Rules | Search jobs |
|---|---|---|---|
| **Source data tier** | Microsoft Sentinel data lake tier | Analytics, auxiliary, basic, data lake (except for tables in the default workspace) | Analytics, data lake (except for tables in the default workspace). For non-data-lake workspaces: Auxiliary, Basic, Archived tier |
| **Workspace scope** | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace |
| **Table scope** | Multiple tables | Multiple tables | Single table |
| **Query language** | [KQL jobs supported operators](/azure/sentinel/datalake/kql-jobs#considerations-and-limitations)| Limited [KQL operators](/azure/azure-monitor/logs/summary-rules?tabs=api#create-or-update-a-summary-rule) | [Limited KQL operators](/azure/azure-monitor/logs/search-jobs#kql-query-considerations) |
| **Join support** | Supported | Analytics tier: supported; Basic: join up to five Analytics tables using [`lookup()`](/azure/data-explorer/kusto/query/lookup-operator) operator | Not supported |
| **Scheduling frequency** | On-demand; Daily, weekly, monthly | 20 minutes to 24 hours | On-demand (long-running searches support up to a 24‑hour timeout) |
| **Lookback period** | Up to 12 years | Up to 1 day | Up to 12 years |
| **Timespan** | - | - | Up to 1 year |
| **Timeout** | 1 hour | 10 minutes | 24 hours |
| **Maximum number of results** | Dependent on query timeout | 500,000 records | 100 million records |
| **Pricing model** | GB of data analyzed | Analytics tier: free; Basic and auxiliary tier: Data scan (Log Analytics pricing model) | GB of data analyzed |
| **Template support** / Health monitoring | Template Support: No<br>Health Monitoring: No | Template Support: Yes (Content Hub, ARM)<br>Health Monitoring: LASummaryLogs | Template Support: No<br>Health Monitoring: No |



## Usage scenarios and feature choice

The following section helps you decide which feature is best for your needs.

If you have any of the following requirements, use KQL jobs:

+ You need to query up to 12 years of historical data.
+ You need to run complex queries involving full KQL operators including joins or unions.
+ You need scheduled or ad-hoc investigation capabilities.

Use Notebook jobs if any of the following apply:

+ You're onboarded to the Microsoft Sentinel data lake.
+ You require analyzing large-scale data.
+ You want to query historical data of up to 12 years.
+ You need to run complex queries involving joining tables across data lake and analytics tier.
+ You need to store insights in custom tables in data lake or analytics tier.
+ You want to use a wide range of Python libraries, enabling you to use existing tools and frameworks for data analysis, machine learning, and visualization.

Use summary rules if you have any of the following requirements:

+ Data is in a workspace that isn't onboarded to Microsoft Sentinel data lake, for example data may still reside in Auxiliary or Basic tiers.
+ You need frequent summarization, for example, every 20 minutes.
+ You want to use out-of-the-box summary rules templates.

If you have any of the following requirements, use search jobs:

+ You have data in archive tier. If you're onboarded to Microsoft Sentinel data lake, to access data older than your onboarding date, use search jobs. For data from your onboarding date onward, use KQL jobs.
+ You need to hydrate large volumes of data from a single table.


## Related articles

- [KQL and the Microsoft Sentinel data lake (preview)](kql-overview.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake (preview)](notebooks-overview.md)
- [Aggregate Microsoft Sentinel data with summary rules](../summary-rules.md)
- [Search for specific events across large datasets in Microsoft Sentinel](../search-jobs.md)  
