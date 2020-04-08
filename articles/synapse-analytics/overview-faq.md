---
title: FAQ - Azure Synapse Analytics
description: FAQ for Azure Synapse Analytics
services: synapse-analytics
author: ArnoMicrosoft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 10/09/2019
ms.author: acomet
ms.reviewer: jrasnick
---

# Azure Synapse Analytics frequently asked questions

In this guide, you'll find the most frequently asked questions for Synapse Analytics.

## General

### Q: What is Azure Synapse Analytics

A: Azure Synapse is an integrated data platform for BI, AI, and continuous intelligence. It connects various Analytics runtimes such as SQL and Spark through a single platform that provides a unified way to:

- Secure your analytics resources: network, managing single sign-on  access to pool, data, and development artifacts.
- Easily Monitor and quickly optimize, react, and debug  events happening in your workspace activities at any layer.
- Manage your metadata across engines. Create a Spark table and it will be automatically available in your SQL Analytics databases.
- Interact with the data through a unified user experience. Synapse Studio brings Big Data Developers, Data Engineers, DBAs, Data Analysts, and Data Scientists on the same platform.

### Q: How do I get started with Azure Synapse Analytics

A: To start using Azure Synapse Analytics, create a Synapse workspace (it's free!) and create the resources that you want under that workspace. You can follow one of our quickstart tutorials that will walk you through simple use case. You can also find sample notebooks and SQL scripts into our repository. If you need to connect to public dataset, create a new linked service with the following attributes:

- azure_storage_account_name = "azureopendatastorage"
- azure_storage_sas_token = "" (write **""**)

### Q: What are the main components of Azure Synapse Analytics

A: Azure Synapse has the following capabilities:

- SQL Analytics offers analytics capabilities either with SQL pool or SQL on-demand (preview) (Serverless).
- Apache Spark pool (preview) with full support for Scala, Python, SparkSQL, and C#
- Data Flow offering a code-free big data transformation experience
- Data Integration & Orchestration to bring your data and operationalize all of your code development
- Studio to access all of these capabilities through a single Web UI

### Q: How does Azure Synapse Analytics relate to Azure SQL Data Warehouse

A: Azure Synapse Analytics is an evolution of Azure SQL Data Warehouse into an analytics platform, which includes SQL pool as the data warehouse solution. This platform combines data exploration, ingestion, transformation, preparation, and serving analytics layer.

## Use cases

### Q: What is a good use case for Synapse SQL pool

A: SQL pool is the heart of your data warehouse needs. It's the leading data warehouse solution in [price/performance](https://azure.microsoft.com/services/sql-data-warehouse/compare/). SQL pool is the industry-leading cloud data warehouse solution because you can:

- serve a large and mixed variety of workloads without impact in performance thanks to high concurrency and workload isolation
- secure your data easily through advanced features ranging from network security to fine-grain access
- benefit from a wide range of eco-system

### Q: What is a good use case for Spark in Synapse

A: Our first goal is to provide a great Data Engineering experience for transforming data over the lake in batch or stream. Its tight and simple integration to our data orchestration makes the operationalization of your development work straightforward.

Another use case for Spark is for a Data Scientist to:

- extract a feature
- explore data
- train a model

### Q: What is a good use case for SQL on-demand in Synapse

A: SQL on-demand is a query service over the data in your data lake. It enables you to democratize access to all your data by providing a familiar T-SQL syntax to query data in place, without a need to copy or load data into a specialized store.

Use case examples include the following:

- basic discovery and exploration - provides data analysts, emerging data scientists and data engineers with an easy path to first insight into data living in their data lake with schema on read T-SQL queries
- logical data warehouse - data analysts can run full expressiveness of T-SQL language to directly query and analyze the data residing in Azure Storage and use familiar BI tools (e.g., Azure Analyses Services, Power BI Premium, etc.) to refresh dashboards by rerunning Starlight Query queries
- "single query" ETL - allows data engineers to transform Azure Storage based data from one format to another, filter, aggregate, etc. in massively parallel processing fashion, persist query results to Azure Storage and make them immediately available for further processing in Starlight Query or other services of interest

### Q: What is a good use case for data flow in Synapse

A: Data flow allows data engineers to develop graphical data transformation logic without writing code. The resulting data flows are executed as activities within Data Integration & Orchestration. Data flow activities can be operationalized via existing scheduling, control, flow, and monitoring capabilities.

## Security and Access

A: End-to-end single sign-on experience is an important authentication process in Synapse Analytics. Managing and passing through the identity via a full AAD integration is a must.

### Q: How do I get access to files and folders in the ADLSg2

A: Access to files and folders is currently managed through ADLSg2. For more information, see [Data Lake storage access control](../storage/blobs/data-lake-storage-access-control.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Q: Can I use third-party business intelligence tools to access Azure Synapse Analytics

A: Yes, you can use your third-party business applications, like Tableau and Power BI, to connect to SQL pool and SQL on-demand. Spark supports IntelliJ.

### Q: Does Azure Synapse Analytics provide APIs

A: Yes, we provide an SDK to programmatically interact with Azure Synapse Analytics. More information is available [here] on which operations are supported by Synapse.
