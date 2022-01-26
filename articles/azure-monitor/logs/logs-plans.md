---
title: Azure Monitor Basic Logs
description: Use Azure Monitor Basic Logs to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases.
author: bwren
ms.author: bwren
ms.reviewer: osalzberg
ms.topic: conceptual
ms.date: 01/20/2022

---

# Azure Monitor Basic Logs (Preview)
Basic Logs is a feature of Azure Monitor that reduces the cost for high-value verbose logs that don’t require analytics and alerts. Tables in a Log Analytics workspace that are configured as Basic logs have a reduced cost for ingestion with limitations on log queries and other Azure Monitor features.


[Logs plans overview](media/basic-logs-overview/logs-plans-overview.png)





## When to use Basic Logs
Basic logs are intended to support data that you need to collect but only require infrequent access to. These are typically high value logs that you may need to retain for purposes such as compliance or infrequent troubleshooting. 

## Extracting valuable data
You may have tables that you want to configure as Basic logs because you don't require regular access to the bulk of their data, but these tables may have some data that is valuable. For example, there may be scalar columns in the table or even scalar values embedded in the text of other columns.

There are two strategies to handle these kinds of logs:

-	Configure them as Basic Logs only query them occasionally for compliancy and troubleshooting. This pattern is usually used for low-value and highly verbose logs.
-	Create a transform in the DCR that collects the table or in the default DCR for the workspace that extracts the required data and stores it in a table.
Parse them and extract the scalars from the text. Once parsed, these logs can be used for analytics and every mechanism that Azure Monitor supports. This pattern is usually used for high-value logs.

Azure Monitor Logs provides tools for both strategies and the ability to apply both on the same data stream. Custom transforms (**TODO:** add link to transform documentation) can be used to parse logs as they are ingested to filter unnecessary logs. 

## Log queries
[Log queries using Basic Logs](basic-logs-query.md) are expected to be infrequent and relatively simple. There is an additional cost of these queries, and they support a subset of the KQL language.

If you need more advanced queries on Basic Logs, then create [Search Job](search-jobs.md) that will send results of a query to an Analytics table that you can then use with standard log queires.

## Next steps

- [Configure a table for Basic Logs.](basic-logs-configure.md)
- [Query Basic Logs](basic-logs-query.md)
- [Create a Search Job](search-jobs.md)