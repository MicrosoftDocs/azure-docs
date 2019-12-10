---
title: What is SQL Analytics on-demand
description: SQL Analytics on-demand overview
services: synapse analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 09/10/2019
ms.author: fipopovi
ms.reviewer: jrasnick
---

# What is SQL Analytics on-demand? 
SQL Analytics on-demand is a service that queries over the data in your data lake. It democratizes access to all your data by providing a familiar T-SQL syntax to query data in place without the need to copy or load data into a specialized store. In addition, the T-SQL interface provides integrated connectivity to a wide range of business intelligence and ad-hoc querying tools including the most popular drivers. 

SQL Analytics on-demand is a distributed data processing system built for large-scale data and compute functions.  functionality enables you to analyze your Big Data in seconds to minutes, depending on the workload. Thanks to built-in query execution fault-tolerance, the system provides high reliability and success rates even for long-running queries involving massive data sets.

SQL Analytics on-demand is serverless, hence there is no infrastructure to setup or clusters to maintain. A default endpoint is provided within every Azure Synapse workspace, so you can start querying data as soon as the workspace is created. There is no charge for resources reserved. You are only charged for the data scanned by queries you run. As such, this is a true pay-per-use model. 

If you use Spark for data preparation, cleansing or enrichment, you can query any Spark tables you’ve created directly from SQL Analytics on-demand.  Additionally, you can use Private Link to bring the SQL Analytics on-demand endpoint into your private virtual network by mapping it to a private IP address. You'll keep your data secure by using familiar SQL-based security mechanisms. 

In the initial version, SQL Analytics on-demand is able to query the data in the form of files residing in Azure Storage (WASB, ADLS). While in preview, the cost may come at a discount (up to 100%) compared to GA prices. 

Also during preview, there could be limitations in the scale and performance of your queries, whether at individual query or workspace levels. Private Link functionality will become available during the early stages of the preview. The currently supported ad-hoc querying tool is Azure Data Studio. SSMS can be used to connect and query, although some options will not work. It will be fully supported until GA. Please make sure you use the latest versions of the aforementioned tools.

## Who is SQL Analytics on-demand for?

If you need to explore data in the data lake, gain insights from it, or optimize your existing data transformation pipeline, you can benefit from using SQL Analytics on-demand. It is suitable for the following scenarios:

- Basic discovery and exploration: Quickly reason about the data in various formats (Parquet, CSV, JSON) within your data lake so you can plan how to extract insights from it.
- Logical data warehouse: Provide a relational abstraction on top of raw or disparate data without relocating and transforming data, allowing an always up-to-date view of your data.
- Data transformation: A simple, scalable, and performant way to transform data in the lake using T-SQL so it can feed to BI and other tools, or loaded into a relational data store (SQL Analytics databases, Azure SQL Database, etc.).

Different professional roles can benefit from SQL Analytics on-demand:

- Data Engineers can explore the lake, transform and prepare data using this service, and simplify their data transformation pipelines.
- Data Scientists can quickly reason about the contents and structure of the data in the lake by using features such as OPENROWSET and automatic schema inference.
- Data Analysts can explore data and Spark tables created via Data Scientists or Data Engineers by using the familiar T-SQL language or their favorite tools to connect to SQL on-demand.
- BI Professionals can quickly create Power BI reports on top of data in the lake and Spark tables. 

## Next steps

- [Connect to your endpoint](connect-overview.md)
- [Query your files](development-storage-files-overview.md)