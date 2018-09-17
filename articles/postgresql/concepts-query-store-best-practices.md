---
title: Query Store best practices in Azure Database for PostgreSQL
description: This article describes best practices for the Query Store in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/24/2018
---

# Query Store best practices

The Query Store feature is in public preview.

Applies to: Azure Database for PostgreSQL 9.6 and 10

This article outlines the best practices for using Query Store with your workload.

## Use Query Performance Insight in Azure PostgreSQL
If you run Query Store in Azure PostgreSQL, you can use Query Performance Insight to analyze query performance over time.

While you can use a UI tool such as PgAdmin to get detailed resource consumption for all your queries (memory, IO, etc.), Query Performance Insight gives you a quick and efficient visualization for your database.

## Keep Query Store adjusted to your workload
Configure Query Store based on your workload and performance troubleshooting requirements. The default parameters are sufficient to start, but you should monitor how Query Store behaves over time and adjust its configuration accordingly.

In particular, note the following parameters:

**pg_qs.retention_period_in_days**
This parameter specifies, in days, the data retention period window for pg_qs. Older query and statistics data is deleted. By default, Query Store is configured to retain the data for 7 days. Avoid keeping historical data you do not plan to use. Increase the value if you need to retain data for longer.

**pg_qs.query_capture_mode**
This parameter specifies the query capture policy for Query Store.
- All – Captures all queries including nested queries, such as statements within functions
- Top – Captures top queries - i.e. those issued by clients
- None – Query Store stops capturing new queries. This is the default option.

**pgms_wait_sampling.history_period**
This parameter specifies the frequency, in milliseconds, at which wait events are sampled. The shorter the period, the more frequently sampling wait events and more information will be retrieved, at the price of more resource consumption. Increase this period if the server is under load.

**pgms_wait_sampling.query_capture_mode**
This parameter specifies the query capture policy for wait statistics in the Query Store.
- All – Captures all wait events
- None – Query Store stops sampling

It is recommended to configure the value to 'All' only during the window of investigation.

Use the [Azure portal](howto-configure-server-logs-in-portal.md) or [Azure CLI](howto-configure-server-logs-using-cli.md) to get or set a different value for a parameter.


## Avoid using non-parameterized queries
Using non-parameterized queries when that is not absolutely necessary (for example in case of ad-hoc analysis) is not a best practice. Cached plans cannot be reused which forces Query Optimizer to compile queries for every unique query text.

Also, Query Store can rapidly exceed the size quota because of potentially a large number of different query texts.

As a result, performance of your workload will be sub-optimal and Query Store might might be constantly deleting the data trying to keep up with the incoming queries.

Consider the following options:
	• Parameterize queries where applicable, for example, wrap queries inside a stored procedure.
	• Compare the number of distinct query_hash values with the total number of entries in query_store.query_texts. If the ratio is close to 1 your workload is generating different queries.
Set the Query Capture Mode to TOP to automatically filter out nested queries.

