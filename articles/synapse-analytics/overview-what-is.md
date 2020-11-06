---
title: What is Azure Synapse Analytics? 
description: An Overview of Azure Synapse Analytics 
services: synapse-analytics 
author: saveenr 
ms.service: synapse-analytics 
ms.topic: overview 
ms.subservice: overview
ms.date: 10/28/2020 
ms.author: saveenr 
ms.reviewer: jrasnick
---

# What is Azure Synapse Analytics (workspaces preview)?

[!INCLUDE [preview](includes/note-preview.md)]

Enterprise analytics must work at massive scale on any kind of data, whether raw, refined, or highly curated. This typically requires enterprises to stitch together big data and data warehousing technologies into complex data pipelines that work across data in relational stores and data lakes. These kinds of solutions are difficult to build, maintain, and secure. Their complexity delays delivering the insight enterprises need.

**Azure Synapse** is an integrated analytics service that accelerates time to insight across data warehouses and big data systems. Azure Synapse brings together the best of **SQL** technologies used in enterprise data warehousing, **Spark** technologies used for big data, and **Pipelines** for data integration and ETL/ELT. **Synapse Studio** provides a unified experience for management, monitoring, coding, and security. Synapse has deep integration with other Azure services such as **PowerBI**, **CosmosDB**, and **AzureML**.

## Key features & benefits

### Industry-leading SQL

* **Synapse SQL** is a distributed query system that enables enterprises to implement data warehousing and data virtualization 
scenarios using standard and familiar T-SQL experiences. It also expands the capabilities of SQL to address streaming and machine learning scenarios.

* Synapse SQL offers both **serverless** and **dedicated** resource models, offering consumption and billing options to fit your needs. For predictable performance and cost, create dedicated SQL pools to reserve processing power for data stored in SQL tables. For unplanned or bursty workloads, use the always-available, serverless SQL endpoint.
* Use built-in **streaming** capabilities to land data from cloud data sources into SQL tables
* Integrate AI with SQL by using **machine learning** models to score data using the [T-SQL PREDICT function](https://docs.microsoft.com/sql/t-sql/queries/predict-transact-sql?view=azure-sqldw-latest)

### Industry-standard Apache Spark

**Apache Spark for Azure Synapse** deeply and seamlessly integrates Apache Spark--the most popular open source big data engine used for data preparation, data engineering, ETL, and machine learning.

* ML models with SparkML algorithms and AzureML integration for Apache Spark 2.4 with built-in support for Linux Foundation Delta Lake.
* Simplified resource model that frees you from having to worry about managing clusters.
* Fast Spark start-up and aggressive autoscaling.
* Built-in support for .NET for Spark allowing you to reuse your C# expertise and existing .NET code within a Spark application.

### Interop of SQL and Apache Spark on your Data Lake

Azure Synapse removes the traditional technology barriers between using SQL and Spark together. You can seamlessly mix and match based on your needs and expertise.

* A shared Hive-compatible metadata system allows tables defined on files in the data lake to be seamlessly consumed by either Spark or Hive.
* SQL and Spark can directly explore and analyze Parquet, CSV, TSV, and JSON files stored in the data lake.
* Fast scalable load and unload for data going between SQL and Spark databases

### Built-in data integration via pipelines

Azure Synapse comes built-in with the same Data Integration engine and experiences as Azure Data Factory, allowing you to create rich at-scale ETL pipelines without leaving Synapse Analytics.

* Ingest data from 90+ data sources
* Code-Free ETL with Data flow activities
* Orchestrate Notebooks, Spark jobs, Stored procedures, SQL scripts, and more

### Unified management, monitoring, and security

Azure Synapse provides a single way for enterprises to manage analytics resources, monitor usage and activity, and enforce security.

* Assign users to Role to simplify access to analytics resources
* Fine-grained access control on data and code
* A single dashboard to monitor resources, usage, and users across SQL and Spark

### Synapse Studio

**Synapse Studio** is the web-native experience that ties everything together for data engineers, allowing them in one location to do every task they need to build a complete solution.

* Build an end-to-end analytics solution in one place: ingest, explore, prepare, orchestrate, visualize
* Industry-leading productivity for data engineers writing SQL or Spark code: authoring, debugging, and performance optimization
* Integrate with enterprise CI/CD processes

## Next steps

* [Get started with Azure Synapse Analytics](get-started.md)
* [Create a workspace](quickstart-create-workspace.md)
* [Use serverless SQL pool](quickstart-sql-on-demand.md)
