---
title: What is SQL on-demand (preview)
description: SQL on-demand (preview) overview
services: synapse analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 09/10/2019
ms.author: fipopovi
ms.reviewer: jrasnick
---

# What is SQL on-demand (preview)? 

SQL on-demand (preview) is a service that queries over the data in your data lake. It democratizes access to all your data by providing the following functionalities:

- A familiar T-SQL syntax to query data in place without the need to copy or load data into a specialized store. 
- Integrated connectivity via the T-SQL interface that offers a wide range of business intelligence and ad-hoc querying tools, including the most popular drivers. 

SQL on-demand is a distributed data processing system built for large-scale data and compute functions. Its high functionality enables you to analyze your big data in seconds to minutes, depending on the workload. Thanks to built-in query execution fault-tolerance, the system provides high reliability and success rates even for long-running queries involving massive data sets.

## Current functionalities 

The SQL on-demand preview is currently able to query the data in the form of files located in Azure Storage, e.g., Windows Azure Storage Blob (WASB), and
Azure Data Lake Storage (ADLS). For additional information regarding preview terms, review the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) article. 

Also during preview, there could be limitations in the scale and performance of your queries, whether at individual query or workspace levels. Private Link functionality will become available during the early stages of the preview. 

The currently supported ad-hoc querying tool is Azure Data Studio. SQL Server Management Studio (SSMS) can be used to connect and query, although some options won't work. It will not be fully supported until GA. Make  sure that you're using the latest versions of the  tools mentioned above.


## Serverless

SQL on-demand is serverless. You don't have infrastructure to setup or clusters to maintain. A default endpoint is provided within every Azure Synapse Analytics workspace. So, you can start querying data as soon as the workspace is created. There's no charge for resources reserved. You're only charged for the data scanned through your queries. As such, SQL on-demand is a true pay-per-use model. 

## Spark

If you use Spark for data preparation, cleansing, or enrichment, you can query any Spark tables you've created directly from SQL on-demand.  You can also use Private Link to bring the SQL on-demand endpoint into your private virtual network by mapping it to a private IP address. You'll keep your data secure by using familiar SQL-based security mechanisms. 


## Who is SQL on-demand for?

If you need to explore data in the data lake, or optimize your existing data transformation pipeline, you can benefit from using SQL on-demand. It's suitable for the following scenarios:

- Basic discovery and exploration: Quickly reason about the data in various formats (Parquet, CSV, JSON) within your data lake so you can plan how to extract optimal value from it.
- Logical data warehouse: Provide a relational abstraction on top of raw or disparate data without relocating and transforming data. You'll have an always up-to-date view of your data.
- Data transformation: A simple, scalable, and high performing way to transform data in the lake using T-SQL. You're able to feed the data to BI and other tools, or load it into a relational data store such as SQL Analytics databases, Azure SQL Database, etc.

Different professional roles can benefit from SQL on-demand:

- Data Engineers can explore the lake, transform and prepare data using this service, and simplify their data transformation pipelines.
- Data Scientists can swiftly analyze the content and structure of the data in the lake by using features such as [OPENROWSET](develop-openrowset.md) and automatic schema inference.
- Data Analysts can conduct exploratory data analysis and use Spark tables by utilizing the familiar T-SQL language, or their favorite tools, to connect to SQL on-demand.
- BI Professionals can quickly create Power BI reports on top of data in the lake and Spark tables. 

## Next steps
For more information, see the following articles:
- [Connect to your endpoint](connect-overview.md)
- [Query your files](develop-storage-files-overview.md)