---
title: "Troubleshoot: Reading UTF-8 text from CSV or PARQUET files using serverless SQL pool"
description: Reading UTF-8 text from CSV or PARQUET files using serverless SQL pool in Azure Synapse Analytics
author: julieMSFT
ms.author: jrasnick
ms.topic: troubleshooting
ms.service: synapse-analytics
ms.subservice: sql
ms.date: 11/24/2020
---

# Troubleshoot reading UTF-8 text from CSV or Parquet files using serverless SQL pool in Azure Synapse Analytics

This article provides troubleshooting steps for reading UTF-8 text from CSV or Parquet files using serverless SQL pool in Azure Synapse Analytics.

When UTF-8 text is read from a CSV or PARQUET file using serverless SQL pool, some special characters like ü and ö are incorrectly converted if the query returns VARCHAR columns with non-UTF8 collations. This is a known issue in SQL Server and Azure SQL. Non-UTF8 collation is the default in Synapse SQL so customer queries will be affected. Customers who use standard English characters and some subset of extended Latin characters may not notice the conversion errors. The incorrect conversion is explained in more detail in [Always use UTF-8 collations to read UTF-8 text in serverless SQL pool](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/always-use-utf-8-collations-to-read-utf-8-text-in-serverless-sql/ba-p/1883633)

## Workaround

The workaround to this issue is to always use UTF-8 collation when reading UTF-8 text  from CSV or PARQUET files.

-	In many cases, you just need to set UTF8 collation on the database (metadata operation).
-	If you did not specify UTF8 collation on external tables that read UTF8 data, you need to re-create impacted external tables and set UTF8 collation on VARCHAR columns (metadata operation).


## Next steps

* [CETAS with Synapse SQL](../sql/develop-tables-cetas.md)
* [Quickstart: Use serverless SQL pool](../quickstart-sql-on-demand.md)
