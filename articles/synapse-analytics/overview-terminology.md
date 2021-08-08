---
title: Terminology - Azure Synapse Analytics
description: Reference guide walking user through Azure Synapse Analytics
services: synapse-analytics
author: saveenr
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: overview
ms.date: 08/08/2021
ms.author: saveenr
ms.reviewer: jrasnick
---

# Azure Synapse Analytics terminology

This document guides you through the basic concepts of Azure Synapse Analytics.

## Basics

A **Synapse workspace** is a securable collaboration boundary for doing cloud-based enterprise analytics in Azure. A workspace is deployed in a specific region and has an associated ADLS Gen2 account and file system (for storing temporary data). A workspace is under a resource group.

A workspace allows you to perform analytics with SQL and Apache spark. Resources available for SQL and Spark analytics are organized into SQL and Spark **pools**.

## Linked services

A workspace can contain any number of **Linked service**, essentially connection strings that define the connection information needed for the workspace to connect to external resources.

## Synapse SQL

**Synapse SQL** is the ability to do T-SQL based analytics in Synapse workspace. Synapse SQL has two consumption models: dedicated and serverless.  For the dedicated model, use **dedicated SQL pools**. A workspace can have any number of these pools. To use the serverless model, use the **serverless SQL pools**. Every workspace has one of these pools.

Inside Synapse Studio, you can work with SQL pools by running **SQL scripts**.

## Apache Spark for Synapse

To use Spark analytics, create and use **serverless Apache Spark pools** in your Synapse workspace. When you start using a Spark pool, the workspaces creates a **spark session** to handle the resources associated with that session.

There are two ways within Synapse to use Spark:

* **Spark Notebooks** for doing data Data Science and Engineering use Scala, PySpark, C#, and SparkSQL
* **Spark job definitions** for running batch Spark jobs using jar files.

## Pipelines

Pipelines are how Azure Synapse provides Data Integration - allowing you to move data between services and orchestrate activities.

* **Pipeline** are logical grouping of activities that perform a task together.
* **Activities** defines actions within a Pipeline to perform on data such as copying data, running a Notebook or a SQL script.
* **Data flows** are a specific kind of activity that provide a no-code experience for doing data transformation that uses Synapse Spark under-the-covers.
* **Trigger** - Executes a pipeline. It can be run manually or automatically (schedule, tumbling window or event-based)
* **Integration dataset** - Named view of data that simply points or references the data to be used in an activity as input and output. It belongs to a Linked Service.

## Data Explorer

Azure Synapse Analytics Data Explorer provides customers with an interactive query experience to unlock insights from log and telemetry data.

* **Data Explorer pools** are dedicated clusters that includes two or more compute nodes with local SSD storage (hot cache) for optimized query performance and multiple blob storage (cold cache) for persistance.
* **Data Explorer databases** are hosted on Data Explorer pools and are logical entities made up of collections of tables and other database objects. You can have more than one database per pool.
* **Tables** are database objects that contain data that is organized using a traditional relational data model. Data is stored in records that adhere to Data Explorer's well-defined table schema that defines an ordered list of columns, each column having a name and scalar data type. Scalar data types can be structured (*int*, *real*, *datetime*, or *timespan*), semi-structured (*dynamic*), or free text (*string*). The dynamic type is similar to JSON in that it can hold a single scalar value, an array, or a dictionary of such values.
* **External Tables** are tables that reference a storage or SQL data source outside the Data Explorer database. Similar to tables, an external table has a well-defined schema (an ordered list of column name and data type pairs). Unlike Data Explorer tables where data is ingested into Data Explorer pools, external tables operate on data stored and managed outside pools. External tables don't persist any data and are used to query or export data to an external data store.

## Next steps

* [Get started with Azure Synapse Analytics](get-started.md)
* [Create a workspace](quickstart-create-workspace.md)
* [Use serverless SQL pool](quickstart-sql-on-demand.md)
* [Create a Data Explorer pool using Synapse Studio](data-explorer/data-explorer-create-pool-studio.md)
* [Query data with data explorer pools](data-explorer/data-explorer-query-with-pool.md)
