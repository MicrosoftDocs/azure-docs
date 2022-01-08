---
title: Azure Monitor Logs
description: Learn the basics of Azure Monitor Logs, which is used for advanced analysis of monitoring data.
documentationcenter: ''
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 10/22/2020
ms.author: bwren
---

# Azure Monitor Logs types

## Types of log data
Most data stored in Logs is available to all Azure Monitor features and log queries using the fell KQL language. You 

## Basic logs


## Archived logs
Archived logs store log data for very long periods of time, up to 7 years, at a reduced cost with limitations on its usage.

Organizations need to keep data for long periods of time. In many cases, this requirement is driven by compliancy and the need to be able to respond when an incident or a legal issue arise. Archived logs are designed to enable these scenarios by removing the cost barrier and the management overhead.

Administrator will be able to configure any table to be archived once its configured retention elapses. This include both tables that were ingested as analytics logs and tables that were ingested as Basic Logs. For Basic Logs the retention is always 8 days and then archive can be added. Analytics logs retention varies between 30 days and 2 years (730 days). Once this retention period ends, data can be archived. Data can be archived to total of 7 years including the initial retention. E.g. if table is configured for 2 years of initial retention, archive can add up to 5 more years. Note that archive is only per-table configuration, it cannot be configured for all tables in the workspace.
Standard queries will not cover archived logs. E.g. if a table contains 90 days of retention, only these 90 days would be accessible for standard queries. 

There are two methods to access archived logs: 

- **Search Jobs**: these are queries that fetch records and make the results available as an analytics log table – allowing the user to use all the richness of Log Analytics. Search jobs run asynchronously and may be used to scan very high volume of data. Use them when there are specific records that are relevant. Search jobs are charged according to the volume of the data they scan.
- **Restore**: this tool allows an admin to restore a whole chunk of a table based on dates. It will make a specific time range of any table available as analytics logs and will allocate additional compute resources to handle their processing. Use restore when there is a temporary need to run many queries on large volume of data. Restore is charge according to the volume of the data and the time it is available.

Other than query, there are also limitations on the usage of purge. 

If data is used for analytics or it is retrieved frequently, it is recommended to keep it with logs retention to enable analytics and troubleshooting. Archive is recommended for data that is less frequently used.


## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer. Tables are structured the same, and both use KQL. 

The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience of using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data). 

## Next steps

- Learn about [log queries](./log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](../essentials/data-platform-metrics.md).
- Learn about the [monitoring data available](../agents/data-sources.md) for various resources in Azure.