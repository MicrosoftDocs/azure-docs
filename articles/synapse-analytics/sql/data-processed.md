---
title: Data processed by using serverless SQL pool
description: This document describes how the data-processed amount is calculated when you query data in Azure storage by using serverless SQL pool.
services: synapse analytics 
author: filippopovic 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: sql
ms.date: 11/05/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---

# Data processed by using serverless SQL pool in Azure Synapse Analytics

*Data processed* is the amount of data that the system temporarily stores while a query is run. Data processed consists of the following quantities:

- Amount of data read from storage. This amount includes:
  - Data read while reading data.
  - Data read while reading metadata (for file formats that contain metadata, like Parquet).
- Amount of data in intermediate results. This data is transferred among nodes while the query runs. It includes the data transfer to your endpoint, in an uncompressed format. 
- Amount of data written to storage. If you use CETAS to export your result set to storage, then you're charged for the bytes written out and the amount of data processed for the SELECT part of CETAS.

Reading files from storage is highly optimized. The process uses:

- Prefetching, which might add some overhead to the amount of data read. If a query reads a whole file, there's no overhead. If a file is read partially, like in TOP N queries, then a bit more data is read by using prefetching.
- An optimized comma-separated value (CSV) parser. If you use PARSER_VERSION='2.0' to read CSV files, then the amounts of data read from storage slightly increase. An optimized CSV parser reads files in parallel, in chunks of equal size. There's no guarantee that chunks will contain whole rows. To ensure all rows are parsed, the optimized CSV parser also reads small fragments of adjacent chunks. This process adds a small amount of overhead.

## Statistics

The serverless SQL pool query optimizer relies on statistics to generate optimal query execution plans. You can create statistics manually or they will be created automatically by serverless SQL pool. Either way, statistics are created by executing a separate query that returns a specific column at provided sample rate. This query has an associated amount of data processed.

If you run the same or any other query that would benefit from created statistics, statistics will be reused if possible and there will be no additional data processed for statistics creation.

Creating statistics for a Parquet column will result in reading only the relevant column from files. Creating statistics for a CSV column will result in reading and parsing whole files.

## Rounding

The amount of data processed will be rounded up to the nearest MB per query, with a minimum of 10 MB of data processed per query.

## What is not included in data processed

- Server-level metadata (like logins, roles, server-level credentials)
- Databases you create in your endpoint as those databases contain only metadata (like users, roles, schemas, views, inline TVFs, stored procedures, database scoped credentials, external data sources, external file formats, external tables)
  - If you use schema inference, fragments of files will be read to infer column names and data types
- DDL statements except CREATE STATISTICS as it will process data from storage based on the specified sample percentage
- Metadata-only queries

## Reduce amount of data processed

You can optimize your per-query amount of data processed and get better performance by partitioning and converting your data to a compressed columnar format like Parquet.

## Examples

Let's say that there are two tables, each having the same data in five equally sized columns:

- population_csv table backed by 5 TB of CSV files
- population_parquet table backed by 1 TB of Parquet files – this table is smaller than previous one as Parquet contains compressed data
- very_small_csv table backed by 100 KB of CSV files

**Query #1**: SELECT SUM(population) FROM population_csv

This query will read and parse whole files to get values for the population column. Nodes will process fragments of this table, the population sum for each fragment will be transferred among nodes, and the final sum will be transferred to your endpoint. This query will process 5 TB of data plus small overhead for transferring sums of fragments.

**Query #2**: SELECT SUM(population) FROM population_parquet

Querying compressed and column-oriented formats like Parquet results in reading less data than in the previous query, as serverless SQL pool will read a single compressed column instead of the whole file. In this case 0.2 TB will be read (five equal sized columns, 0.2 TB each). Nodes will process fragments of this table, the population sum for each fragment will be transferred among nodes, and the final sum will be transferred to your endpoint. This query will process 0.2 TB plus a small overhead for transferring sums of fragments.

**Query #3**: SELECT * FROM population_parquet

This query will read all columns and transfer all data in uncompressed format. If compression format is 5:1, it will process 6 TB as it will read 1 TB + transfer 5 TB of uncompressed data.

**Query #4**: SELECT COUNT(*) FROM very_small_csv

This query will read whole files. The total size of files in storage for this table is 100 KB. Nodes will process fragments of this table, the sum for each fragment will be transferred among nodes, and the final sum will be transferred to your endpoint. This query will process slightly more than 100 KB of data. The amount of data processed for this query will be rounded up to 10 MB as specified in [Rounding](#rounding).

## Next steps

To learn how to optimize your queries for performance, check [Best practices for serverless SQL pool](best-practices-sql-on-demand.md).
