---
title: "Troubleshoot: Reading UTF-8 text from CSV or PARQUET files using serverless SQL pool"
description: Reading UTF-8 text from CSV or PARQUET files using serverless SQL pool in Azure Synapse Analytics
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.topic: troubleshooting
ms.service: synapse-analytics
ms.subservice: troubleshooting
ms.date: 12/03/2020
---

# Troubleshoot reading UTF-8 text from CSV or Parquet files using serverless SQL pool in Azure Synapse Analytics

This article provides troubleshooting steps for reading UTF-8 text from CSV or Parquet files using serverless SQL pool in Azure Synapse Analytics.

When UTF-8 text is read from a CSV or PARQUET file using serverless SQL pool, some special characters like ü and ö are incorrectly converted if the query returns VARCHAR columns with non-UTF8 collations. This is a known issue in SQL Server and Azure SQL. Non-UTF8 collation is the default in Synapse SQL so customer queries will be affected. Customers who use standard English characters and some subset of extended Latin characters may not notice the conversion errors. The incorrect conversion is explained in more detail in [Always use UTF-8 collations to read UTF-8 text in serverless SQL pool](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/always-use-utf-8-collations-to-read-utf-8-text-in-serverless-sql/ba-p/1883633)

## Workaround

The workaround to this issue is to always use UTF-8 collation when reading UTF-8 text from CSV or PARQUET files.

- In many cases, you just need to set UTF8 collation on the database (metadata operation).

   ```sql
   alter database MyDB
         COLLATE Latin1_General_100_BIN2_UTF8;
   ```

- You can explicitly define collation on VARCHAR column in OPENROWSET or external table:

   ```sql
   select geo_id, cases = sum(cases)
   from openrowset(
           bulk 'latest/ecdc_cases.parquet', data_source = 'covid', format = 'parquet'
       ) with ( cases int,
                geo_id VARCHAR(6) COLLATE Latin1_General_100_BIN2_UTF8 ) as rows
   group by geo_id
   ```
 
- If you did not specify UTF8 collation on external tables that read UTF8 data, you need to re-create impacted external tables and set UTF8 collation on VARCHAR columns (metadata operation).


## Next steps

* [Query Parquet files with Synapse SQL](../sql/query-parquet-files.md)
* [Query CSV files with Synapse SQL](../sql/query-single-csv-file.md)
* [CETAS with Synapse SQL](../sql/develop-tables-cetas.md)
* [Quickstart: Use serverless SQL pool](../quickstart-sql-on-demand.md)
