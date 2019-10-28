---
title: What is SQL Analytics on-demand #Required; update as needed page title displayed in search results. Include the brand.
description: SQL Analytics on-demand overview
services: sql-data-warehouse
author: filippopovic
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 09/10/2019
ms.author: fipopovi
ms.reviewer: jrasnick
---

# What is SQL Analytics on-demand? 
SQL Analytics on-demand is a query service over the data in your data lake. It enables you to democratize access to all your data by providing a familiar T-SQL syntax to query data in place, without a need to copy or load data into a specialized store. In addition, the T-SQL interface enables seamless connectivity from the widest range of business intelligence and ad-hoc querying tools, as well as the most popular drivers. 

SQL Analytics on-demand is a distributed data processing system, built for very large scale of data and compute, enabling you to analyze your Big Data in seconds to minutes, depending on the workload. Thanks to built-in query execution fault-tolerance, the system provides high reliability and success rates even for long-running queries involving vert large data sets.

SQL Analytics on-demand is serverless, hence there is no infrastructure to setup or clusters to maintain. A default endpoint for this service is provided within every Azure Synapse workspace, so you can start querying data as soon as the workspace is created. There is no charge for resources reserved, you are only being charged for the data scanned by queries you run, hence this is a true pay-per-use model. 

If you use Spark in your data pipeline, for data preparation, cleansing or enrichment, you can query any Spark tables you’ve created in the process, directly from SQL Analytics on-demand.  Use Private Link to bring SQL Analytics on-demand endpoint into your private virtual network by mapping it to a private IP address. Keep your data secured using familiar SQL-based security mechanisms. 

In the initial version of SQL Analytics on-demand, the service is able to query the data in form of files residing in Azure Storage (WASB, ADLS). While in preview, the charging may come at a discount (up to 100%) compared to GA prices. Also, during preview there could be limitations in scale and performance of queries, at individual query or workspace levels. Private Link functionality will become available during the early stages of the preview. Currently supported ad-hoc querying tool is Azure Data Studio. SSMS can be used to connect and query although some options will not work. It will be fully supported until GA. Please make sure you use latest versions of tools.

## Who is SQL Analytics on-demand for?

If you need to explore data in the data lake, gain insights from it or optimize your existing data transformation pipeline, you can benefit from using SQL Analytics on-demand. It is suitable for the following scenarios:

- Basic discovery and exploration - Quickly reason about the data in various formats (Parquet, CSV, JSON) in your data lake, so you can plan how to extract insights from it.
- Logical data warehouse – Provide a relational abstraction on top of raw or disparate data without relocating and transforming data, allowing always up to date view of your data.
- Data transformation - Simple, scalable and performant way to transform data in the lake using T-SQL, so it can fed to BI and other tools, or loaded into a relational data store (SQL Analytics databases, Azure SQL Database, etc.).

Different professional roles can benefit from SQL Analytics on-demand:

- Data Engineers can explore the lake, transform and prepare data using this service, and simplify their data transformation pipelines. For more information, check this tutorial
- Data Scientists can quickly reason about the contents and structure of the data in the lake, thanks to features such as OPENROWSET and automatic schema inference
- Data Analysts can explore data and Spark tables created by Data Scientists or Data Engineers using familiar T-SQL language or their favorite tools that can connect to SQL on-demand
- BI Professionals can quickly create Power BI reports on top of data in the lake and Spark tables 



## Next steps

