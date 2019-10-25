---
title: SQL Analytics on-demand | Microsoft Docs
description: Learn about SQL Analytics on-demand in Azure Synapse Analytics.
services: sql-datawarehouse
author: vvasic-msft
ms.service: sql-data-warehouse
ms.topic: overview
ms.date: 10/24/2019
ms.author: vvasic
ms.reviewer: jrasnick
---
# SQL Analytics on-demand in Azure Synapse Analytics

Every Azure Synapse Analytics workspace comes with SQL on-demand endpoint that you can use to query data in the lake.

SQL Analytics on-demand is a query service over the data in your data lake. It enables you to democratize access to all your data by providing a familiar T-SQL syntax to query data in place, without a need to copy or load data into a specialized store. In addition, the T-SQL interface enables seamless connectivity from the widest range of business intelligence and ad-hoc querying tools, as well as the most popular drivers.  

SQL Analytics on-demand is a distributed data processing system, built for large scale of data and compute, enabling you to analyze your Big Data in seconds to minutes, depending on the workload. Thanks to built-in query execution fault-tolerance, the system provides high reliability and success rates even for long-running queries involving vert large data sets. 

SQL Analytics on-demand is serverless, hence there is no infrastructure to setup or clusters to maintain. A default endpoint for this service is provided within every Azure Synapse workspace, so you can start querying data as soon as the workspace is created. There is no charge for resources reserved, you are only being charged for the data scanned by queries you run, hence this model is a true pay-per-use model.  

If you use Spark in your data pipeline, for data preparation, cleansing or enrichment, you can query any Spark tables you’ve created in the process, directly from SQL Analytics on-demand. Use Private Link to bring SQL Analytics on-demand endpoint into your private virtual network by mapping it to a private IP address. Keep your data secured using familiar SQL-based security mechanisms.  