---
title: Azure Monitor Archived Logs
description: Overview of Archived Logs which is a feature of Azure Monitor that lets you archive data from a table after its retention period.
author: bwren
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/12/2022

---

# Azure Monitor Archived Logs (Preview)
Archived Logs is a feature of Azure Monitor that allows you to archive data from a Log Analytics workspace for an extended period of time (up to 7 years) at a reduced cost with limitations on its usage. This is typically data that you must retain for compliance that must be accessed only when an incident or a legal issue arises.

## Basic operation
Configure any table in your Log Analytics workspace to be archived once its configured retention elapses. This includes tables that are configured as [Analytics Logs or Basic Logs](basic-logs-overview.md). For Analytics Logs tables, the retention can be configured from 30 days to 2 years (730 days). If archive is added to the table, then data is archived once this period is reached. If archive is added to a Basic Logs table then data is archived after 8 days since this is the retention period for all Basic Logs tables.

Each table in a workspace must be configured for archive independently. You can't configure a workspace for all tables to be archived.



## Accessing archived logs
To access archived data, you must first retrieve data from it in an Analytics Logs table using one of the following methods:

[Search Jobs](search-jobs.md) are log queries that run asynchronously and make their results available as an Analytics Logs table that you can use with standard log queries. Search jobs are charged according to the volume of data they scan, not just the data they return. Use a search job when you need to access to a specific set of records in your archived data.

[Restore](restore.md) allows you to temporarily make data from an archived table within a particular time range available as an Analytics Logs table and allocates additional compute resources to handle its processing. Restore is charge according to the volume of the data it retrieves and the duration that data is made available. Use restore when you have a temporary need to run a number of queries on large volume of data. 

> [!NOTE]
> During public preview there is no charge for archived logs and restore. The only charge for search jobs is for the ingestion of the search results.

