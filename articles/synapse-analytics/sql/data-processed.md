---
title: Data processed
description: This document describes how data processed is calculated when querying data in Azure storage using serverless SQL pool.
services: synapse analytics 
author: filippopovic 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: sql
ms.date: 11/05/2020
ms.author: fipopovi
ms.reviewer: jrasnick 
---

## Data processed

Data processed is the amount of data temporarily stored in the system while executing a query and consists of:

- Amount of data read from storage – which includes:
  - Amount of data read while reading data 
  - Amount of data read while reading metadata (for file formats that contain metadata, like Parquet) 
- Amount of data in intermediate results – data transferred among nodes during query execution, including data transfer to your endpoint, in uncompressed format. 
- Amount of data written to storage – if you use CETAS to export your result set to storage, you will be charged for bytes written out and the amount of data processed for SELECT part of CETAS.

Reading files from storage is highly optimized and utilizes:

- Prefetching - which may add a small overhead to the amount of data read. If a query reads a whole file, there will be no overhead, but if file is read partially, like in TOP N queries, a bit more data will be read with prefetching.
- Optimized CSV parser – if you use PARSER_VERSION=’2.0’ to read CSV files it will result in slightly increased amounts of data read from storage.  Optimized CSV parser reads files in parallel in chunks of equal size. There is no guarantee that chunks will contain whole rows and to make sure all rows are parsed, small fragments of adjacent chunks will be read also adding small overhead.

## Statistics

Serverless SQL pool query optimizer relies on statistics to generate an optimal query execution plan. You can create statistics manually or they will be created automatically by serverless SQL pool. Either way, statistics are created by executing a separate query that returns a specific column at provided sample rate. This query has an associated amount of data processed.

If you run the same or any other query that would benefit from created statistics, statistics will be reused if possible and there will be no additional data processed for statistics creation.

Note that creating statistics for a Parquet column will result in reading only relevant column from files, while creating statistics for CSV column will result in reading and parsing whole files.

## Rounding

The amount of data processed will be rounded up to the nearest MB per query, with a minimum 10 MB data processed per query.

## What is not included in data processed

- Server-level metadata (like logins, roles, server-level credentials)
- Databases you create in your endpoint as those databases contain only metadata (like users, roles, schemas, views, inline TVFs, stored procedures, database scoped credentials, external data sources, external file formats, external tables)
  - Please note that if you use schema inference, fragments of files will be read to infer column names and data types 
- DDL statements except CREATE STATISTICS as it will process data from storage based on specified sample percentage
- Metadata-only queries

## Reduce amount of data processed

You can optimize your per-query amount of data processed and get better performance by partitioning and converting your data to compressed columnar format like Parquet.

## Examples

Let's say that there are two tables, each having the same data in 5 equally sized columns:

- population_csv table backed by 5 TB of CSV files
- population_parquet table backed by 1 TB of Parquet files – this table is smaller than previous one as Parquet contains compressed data
- very_small_csv table backed by 100KB of CSV files



**Query #1**: SELECT SUM(population) FROM population_csv

This query will read and parse whole files to get values for the population column. Nodes will process fragments of this table, population sum for each fragment will be transferred among nodes and the final sum will be transferred to your endpoint. This query will process 5TB of data plus small overhead for transferring sums of fragments.

**Query #2**: SELECT SUM(population) FROM population_parquet

Querying compressed and column-oriented format like Parquet results in reading significantly less data than in previous query as serverless SQL pool will read single compressed column instead with of whole file. In this case 0.2TB will be read (5 equal sized columns, 0.2TB each). Nodes will process fragments of this table, population sum for each fragment will be transferred among nodes and final sum will be transferred to your endpoint. This query will process 0.2TB plus a small overhead for transferring sums of fragments.

**Query #3**: SELECT * FROM population_parquet

This query will read all columns and transfer all data in uncompressed format. If compression format is 5:1, it will process 6TB as it will read 1TB + transfer 5TB of uncompressed data.

**Query #4**: SELECT COUNT(*) FROM very_small_csv

This query will read whole files. Total size of files in storage for this table is 100KB. Nodes will process fragments of this table, sum for each fragment will be transferred among nodes and the final sum will be transferred to your endpoint. This query will process bit more than 100KB and amount of data processed for this query will be rounded up to 10MB as specified in [Rounding](#rounding).

## Next steps

To learn how to optimize your queries for performance, check [Best practices for serverless SQL pool](best-practices-sql-on-demand.md).
