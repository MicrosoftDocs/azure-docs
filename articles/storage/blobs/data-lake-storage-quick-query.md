---
title: Azure Data Lake Storage quick query (Preview)
description: Quick query (Preview) is a new capability for Azure Data Lake Storage that enables applications and analytics frameworks to dramatically optimize data processing by retrieving only the data that is required for a processing operation.
author: normesta
ms.topic: conceptual
ms.author: normesta
ms.reviewer: jamesbak
ms.date: 11/14/2019
ms.service: storage
ms.subservice: data-lake-storage-gen2
---

# Azure Data Lake Storage quick query (Preview)

Quick query (Preview) is a new capability for Azure Data Lake Storage that enables applications and analytics frameworks to dramatically optimize data processing by retrieving only the data that they require to perform a given operation. This reduces the time and processing power that is required to gain critical insights into stored data.

> [!NOTE]
> The quick query feature is in public preview, and is available in the region1, region2, and region3 regions. To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this form](https://aka.ms/adlsquickquerypreview). 

## Overview

Quick query accepts filtering *predicates* and *projections* which enable applications to filter rows and columns at the time that data is read from disk. Only the data that meets the conditions of a predicate are transferred over the network to the application. This reduces network latency and compute cost.  

You can use SQL to specify the row filter predicates and column projections in a quick query request. A request processes only one file. Therefore, advanced relational features of SQL, such as joins and group by aggregates, aren't supported. Quick query supports CSV and Json formatted data as input to each request.

The following diagram illustrates how a typical application uses quick query to process data.

![Quick query overview](./media/data-lake-storage-quick-query/quick-query.png)

The quick query feature isn't limited to Data Lake Storage (storage accounts that have the hierarchical namespace enabled on them). Quick query is completely compatible with the blobs in storage accounts that **don't** have a hierarchical namespace enabled on them. This means that you can achieve the same reduction in network latency and compute costs when you process data that you already have stored as blobs in storage accounts.

For an example of how to use quick query in a .NET application, see [Filter data by using Azure Data Lake Storage quick query](data-lake-storage-quick-query-how-to-dotnet.md).

## Better performance at a lower cost

Quick query optimizes performance by reducing the amount of data that gets transferred and processed by your application.

To calculate an aggregated value, applications commonly retrieve **all** of the data from a file, and then process and filter the data locally. An analysis of the input/output patterns for analytics workloads reveal that applications typically require only 20% of the data that they read to perform any given calculation. This statistic is true even after applying techniques such as [partition pruning](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-optimize-hive-query#hive-partitioning). This means that 80% of that data is needlessly transferred across the network, parsed, and filtered by applications. This pattern, essentially designed to remove unneeded data, incurs a significant compute cost.  

Even though Azure features an industry-leading network, in terms of both throughput and latency, needlessly transferring data across that network is still costly for application performance. By filtering out the unwanted data during the storage request, quick query eliminates this cost.

Additionally, the CPU load that is required to parse and filter unneeded data requires your application to provision a greater number and larger VMs in order to do it's work. By transferring this compute load to quick query, applications can realize significant cost savings.

## Pricing

Due to the increased compute load within the Azure Data Lake Storage service, the pricing model for using quick query differs from the normal Azure Data Lake Storage transaction model. Quick query charges a cost for the amount of data scanned as well as a cost for the amount of data returned to the caller.

Despite the change to the billing model, Quick query's pricing model is designed to lower the total cost of ownership for a workload, given the reduction in the much more expensive VM costs.

## Next steps

- [Quick query enrollment form](https://aka.ms/adlsquickquerypreview)	
- [Filter data by using Azure Data Lake Storage quick query](data-lake-storage-quick-query-how-to-dotnet.md)
- Quick query SQL language reference
- Quick query REST API reference



