---
title: What is Azure Synapse Analytics? 
description: An Overview of Azure Synapse Analytics 
services: synapse-analytics 
author: saveenr 
ms.service: synapse-analytics 
ms.topic: overview 
ms.subservice:
ms.date: 04/15/2020 
ms.author: saveenr 
ms.reviewer: jrasnick
---

# What is Azure Synapse Analytics (workspaces preview)?

[!INCLUDE [preview](includes/note-preview.md)]

Today enterprise analytics requires operating at massive scale on any kind of data, whether raw, refined, or highly curated. In the past, building these kinds of analytics solutions required enterprises to stitch together big data and data warehousing technologies such as Spark and SQL. Next, they'd need to integrate them into rich data pipelines that work across data in relational stores and data lakes.  

Solutions like this are difficult to build, configure, secure, and maintain, which delays the swift extraction of intelligent insight.

**Azure Synapse** is an integrated analytics service that accelerates time to insight from all data at any scale, across data warehouses and big data analytics systems​. It brings together the best of the **SQL** technologies used in enterprise data warehousing, **Spark** technologies used in big data analytics, and **Pipelines** to orchestrate activities and data movement.

Azure Synapse comes with a web-native **Studio** user experience that provides a single experience and model for management, monitoring, coding, and security.

Azure Synapse provides the simplest and fastest way for an enterprise to gather insights on any data at any size, using the analytics they're most familiar with. It integrates deeply with **Power BI** allowing data engineers to build analytics solutions that work end-to-end to provide Business Intelligence.

Additionally, Azure Synapse facilitates predictive model building and advanced analytics with machine learning via its built-in support for **AzureML**.

## Key features & benefits

### Industry-leading SQL

* **Synapse SQL** is a distributed query system that enables enterprises to implement data warehousing and data virtualization 
scenarios using standard T-SQL experiences familiar to data engineers. It also expands the capabilities of SQL to address streaming and machine learning scenarios.

* Synapse SQL offers both **serverless** and **provisioned** resource models, offering consumption and billing options to fit your needs. For predictable performance and cost, provision pools to reserve processing power for data stored in SQL tables. For unplanned or bursty workloads, use the serverless, always-available SQL endpoint.
* Use built-in **streaming** capabilities to land data from cloud data sources into SQL tables
* Integrate AI with SQL, by using **machine learning** models to score data using the T-SQL PREDICT function

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

### Built-in orchestration via pipelines

Azure Synapse comes built-in with the same Data Integration engine and experiences as Azure Data Factory, allowing you to create rich data pipelines without using a separate orchestration engine.

* Move data between Azure Synapse and 90+ on-premises data sources
* Orchestrate Notebooks, Pipelines, Spark jobs, SQL Scripts, Stored procedures
* Code-Free ETL with Data flow activities

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

* [Create a workspace](quickstart-create-workspace.md)
* [Use Synapse Studio](quickstart-synapse-studio.md)
* [Create a SQL pool](quickstart-create-sql-pool-portal.md)
* [Use SQL on-demand](quickstart-sql-on-demand.md)
* [Create an Apache Spark pool](quickstart-create-apache-spark-pool-portal.md)
