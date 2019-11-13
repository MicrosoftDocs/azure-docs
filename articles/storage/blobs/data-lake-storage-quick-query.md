---
title: Azure Data Lake Storage Quick Query (Preview)
description: Azure Data Lake Storage Quick Query (Preview)
author: normesta
ms.topic: conceptual
ms.author: normesta
ms.reviewer: jamesbak
ms.date: 11/13/2019
ms.service: storage
ms.subservice: data-lake-storage-gen2
---

# Azure Data Lake Storage Quick Query (Preview)

Azure Data Lake Storage is the storage service for creating enterprise Data Lakes in Azure. Quick query (Preview) is a new capability for Azure Data Lake Storage that enables applications and analytics frameworks to dramatically optimize data processing by retrieving only the subset of data that they require. This reduces the time and processing power that's required to gain critical insights into your data.

> [!NOTE]
> The quick query feature is in public preview, and is available in the region1, region2, and region3 regions. To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this form](https://aka.ms/adlsquickquerypreview). 

## Overview of the quick query feature

Quick query accepts filtering *predicates* which enables your applications to filter rows and columns at the moment when data is read from disk. Only the data that meets the conditions of the predicate is transferred over the network to the application. This significantly reduces network latency and compute cost.  

Your applications can use a reduced SQL grammar to specify the row filter predicates and column projections of a quick query request. A request can process only one file. Therefore, advanced relational features of SQL, such as joins and group by aggregates, aren't supported. Quick query supports CSV, Json and Parquet formatted data as input to each request.

The following diagram illustrates how applications use quick query to process data

![Quick query overview](./media/data-lake-storage-quick-query/quick-query.png)

The quick query feature isn't limited to Data Lake Storage. It's completely compatible with the blobs in storage accounts that don't have a hierarchical namespace enabled on them. This means that you can gain achieve the same reduction in network latency and compute costs when you process data that you already have stored as blobs in storage accounts.

To learn how to use quick query in a .NET application, see [Filter data by using Azure Data Lake Storage quick query](https://aka.ms/adlsquickquerypreview).

## Quick query improves performance and reduces costs

Data processing applications and analytics frameworks consume structured and semi-structured data in a variety of file formats (For example: CSV, Json, and Parquet). To calculate an aggregated value, an application typically, retrieves **all** of the data from files, parses the data, applies filtering criteria, and calculates the aggregated value.  

In fact, an analysis of the input/output patterns for analytics workloads reveal that applications typically require only 20% of the data that they read to perform any given calculation. This statistic is true even after applying techniques such as [partition pruning](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-optimize-hive-query#hive-partitioning). This means that 80% of that data is needlessly transferred across the network, parsed, and filtered by the application. This impacts the performance of your application. 

This pattern, essentially designed to remove unneeded data, incurs a significant compute cost.  While Azure features an industry leading network, in terms of both throughput and latency, needlessly transferring data across that network negatively impacts application performance. Quick query significantly improves performance and reduces data transfer costs by filtering out unwanted data as part of the request. Having to parse and filter unneeded data can lead to applications provisioning a larger number of virtual machines to meet the CPU load requirements. By trading this compute load off to quick query, applications are able to realize significant cost savings.

## The cost to use quick query

Due to the increased compute load within the Azure Data Lake Storage service, the pricing model for using quick query differs from the normal Azure Data Lake Storage transaction model. Quick query charges a cost for the amount of data scanned as well as a cost for the amount of data returned to the caller.

Despite the change to the billing model, Quick query's pricing model is designed to lower the total cost of ownership for a workload, given the reduction in the much more expensive VM costs.

## Next steps

- [Quick query enrollment form](https://aka.ms/adlsquickquerypreview)	
- [Filter data by using Azure Data Lake Storage quick query](https://aka.ms/adlsquickquerypreview)
- Quick query SQL language reference
- Quick query REST API reference



