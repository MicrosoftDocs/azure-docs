# KQL jobs, summary rules, and search jobs

This article compares KQL jobs, summary rules, and search jobs in Microsoft Sentinel. These features let you query and analyze data in Microsoft Sentinel, and each serves different purposes and use cases.

+ **KQL jobs**: Run ad hoc or scheduled asynchronous queries on data stored in the Microsoft Sentinel data lake. They're best for incident investigations using historical logs, enrichment using low-fidelity logs, and scenarios that need queries with joins or unions across multiple tables. For more information, see [KQL jobs](kql-jobs.md).

+ **Summary rules**: Run scheduled queries that aggregate and store insights from large sets of log data. They're ideal for frequent summarization tasks, like aggregating high-volume logs such as network insights. These rules run in the background and populate custom tables in Log Analytics. For more information, see [Summary rules](../summary-rules.md).

+ **Search jobs**: Run one-time, long-running asynchronous queries across large datasets. Search jobs are useful when you need to hydrate large volumes of data from a single table into a new custom table within the Analytics tier as a one-time operation for further investigation or forensic analysis. For more information, see [Search jobs](../search-jobs.md).

## Feature comparison

| Feature              | KQL Jobs                               | Summary Rules                      | Search jobs                      |
|----------------------|----------------------------------------|------------------------------------|----------------------------------|
| **Purpose**          | Run ad-hoc or scheduled queries for investigation and enrichment   | Aggregate and store insights from high-volume logs        | Run async queries on large datasets to store results in the analytics tier  |
| **Data tier**        | Microsoft Sentinel data lake tier   | Analytics, auxiliary, basic, data lake (except for tables in the default workspace)       | Analytics, auxiliary, basic, data lake (except for tables in the default workspace) |     
| **Workspace scope**  | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace connected to Microsoft Defender | Any Microsoft Sentinel workspace  |
| **Table scope**      | Multiple tables                     | Multiple tables                                     | Single table                                                        |
| **Query language**   | KQL jobs supported operators   | KQL (summarize required)<br>KQL operators supported except for:<br>• Cross-resource queries<br>• Plugins that reshape the data schema<br>• User-defined functions aren't supported | Limited KQL operators  |
| **Join support**     | Supported                      | Analytics tier: supported<br>Basic: join up to five Analytics tables using lookup operator   | Not supported |
| **Scheduling frequency** | On-demand<br>Daily, weekly, monthly  | 20 mins to 24 hours                                 | On-demand (long-running searches support up to a 24-hour timeout)  |
| **Lookback period**  | Up to 12 years                           | Up to 1 day                                         | Up to 12 years                                                            |
| **Timespan**         |  -                                       |      -                                              | Up to 1 year                                                              |
| **Timeout**          | 1 hour                                   | 10 minutes                                          | 24 hours                                                            |
| **Pricing model**    | GB data analyzed                         | Analytics tier: free<br>Basic and auxiliary tier: Data scan Log Analytics pricing model | GB data analyzed                |


The following table summarizes when to use each feature:

|Feature| Scenario|
|---|---|
|**KQL jobs**|•	You're onboarded to the Sentinel data lake.<br>•	You require lookback greater than 24 hours.<br>•	You want to query historical data (up to 12 years).<br>•	You need to run complex queries involving full KQL operators including joins or unions.<br>•	You need ad-hoc investigation capabilities.<br>•	Data is in default workspace.|
|**Summary rules**|<br>•	Your tenant is not onboarded to Microsoft Sentinel data lake, and your data may still reside in Auxiliary or Basic tiers.<br>•	You need lookback within 24 hours.<br>•	You need frequent summarization (for example, every 20 minutes)<br>•	You want to use out-of-the-box templates.<br>•	You are using summary rules out-of-the-box templates.
|**Search jobs**|•	Your Microsoft Sentinel workspace is not connected to Defender portal and your data resides in Analytics or basic tiers.<br>•	You have data in archive tier. Note: If you are onboarded to Microsoft Sentinel data lake, to access data older than your onboarding date, use search jobs. For data from your onboarding date onward, use KQL jobs.<br>•	You need to hydrate large volumes of data from a single table. <br>•	Your use case involves targeted extraction rather than frequent summarization or complex multi-table joins.<br>•	You want to analyze up to 1 year of historical data within a table from any data tiers.

