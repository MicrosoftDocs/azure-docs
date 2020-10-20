---
title: Premium tier for Azure Data Lake Storage | Microsoft Docs
description: Put description here. 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 10/20/2020
ms.author: normesta
---

# Premium tier for Azure Data Lake Storage

Azure Data Lake Storage Gen2 now supports the [premium performance](storage-blob-performance-tiers.md#premium-performance) tier. 

## Workloads that benefit from this tier

Sub-heading text goes here.

Interactive workloads. These workloads require instant updates and user feedback, such as e-commerce and mapping applications, interactive video applications, etc. For example, in an e-commerce application, less frequently viewed items are likely not cached. However, they must be instantly displayed to the customer on demand. As another example, data scientists, analysts and developers can derive time-sensitive insights even faster by running queries on data stored in ADLS Premium. 

IOT/Streaming Analytics. In an IoT scenario, lots of smaller write operations might be pushed to the cloud every second. Large amounts of data might be taken in, aggregated for analysis purposes, and then deleted almost immediately. The high ingestion capabilities of ADLS Premium make it efficient for this type of workload. 

Artificial intelligence/machine learning (AI/ML). AI/ML deals with the consumption and processing of different data types like visuals, speech, and text. This high-performance computing type of workload deals with large amounts of data that requires rapid response and efficient ingestion times for data analysis. 

Data transformation. Processes that require constant editing, modification, and conversion of data require instant updates. For accurate data representation, consumers of this data must see these changes reflected immediately.  

## Determining the cost-effectiveness of choosing this tier

ADLS Premium has higher data storage cost, but lower transaction cost compared to data stored in the regular hot tier. This makes it cost effective for workloads with very high transaction rates.  

The table below showcases when ADLS Premium will be cost effective compared to ADLS hot tier for different read-write mixes.  

Columns represent transactions/TB/month.   

Rows represent % of reads over writes.   

Positive data values indicate percentage cost reduction when using ADLS Premium.   

e.g., For a 70/30 read-write mix analytics workload in US East 2, when transactions/TB/month reach 90M/TB and higher (or ~35 TPS/TB and higher), ADLS Premium is more cost effective than ADLS standard tier.  

> [!div class="mx-imgBorder"]
> ![image goes here](./media/premium-tier-for-data-lake-storage/premium-performance-data-lake-storage-cost-analysis-table.png)

## Getting started 

There is no dedicated tier for Data Lake Storage. That term refers to the availability of the premium tier to accounts that have a hierarchical namespace. To gain access to this tier, create a new blockblobstorage account, and then enable the hierarchical namespace feature on that account. For specific guidance, see [Create a storage account for Azure Data Lake Storage Gen2](create-data-lake-storage-account.md).

## Next steps

Put something here.
