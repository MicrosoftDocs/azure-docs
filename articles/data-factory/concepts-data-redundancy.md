---
title: Data redundancy in Azure Data Factory | Microsoft Docs
description: 'Learn about meta-data redundancy mechanisms in Azure Data Factory'
author: nabhishek
ms.reviewer: abnarain
ms.service: data-factory
ms.subservice: concepts
ms.topic: conceptual
ms.date: 02/08/2023
ms.author: abnarain
---

# **Azure Data Factory data redundancy**

Azure Data Factory data includes metadata (pipeline, datasets, linked services, integration runtime, and triggers) and monitoring data (pipeline, trigger, and activity runs). 

In all regions (except Brazil South and Southeast Asia), Azure Data Factory data is stored and replicated in the [paired region](../availability-zones/cross-region-replication-azure.md#azure-paired-regions) to protect against metadata loss. During regional datacenter failures, Microsoft may initiate a regional failover of your Azure Data Factory instance. In most cases, no action is required on your part. When the Microsoft-managed failover has completed, you'll be able to access your Azure Data Factory in the failover region. 

Due to data residency requirements in Brazil South, and Southeast Asia, Azure Data Factory data is stored on [local region only](../storage/common/storage-redundancy.md#locally-redundant-storage). For Southeast Asia, all the data are stored in Singapore. For Brazil South, all data are stored in Brazil. When the region is lost due to a significant disaster, Microsoft won't be able to recover your Azure Data Factory data.  

> [!NOTE]
> Microsoft-managed failover does not apply to self-hosted integration runtime (SHIR) since this infrastructure is typically customer-managed. If the SHIR is set up on Azure VM, then the recommendation is to leverage [Azure site recovery](../site-recovery/site-recovery-overview.md) for handling the [Azure VM failover](../site-recovery/azure-to-azure-architecture.md) to another region.



## **Using source control in Azure Data Factory**

To ensure you can track and audit the changes made to your metadata, you should consider setting up source control for your Azure Data Factory. It will also enable you to access your metadata JSON files for pipelines, datasets, linked services, and trigger. Azure Data Factory enables you to work with different Git repository (Azure DevOps and GitHub). 

 Learn how to set up [source control in Azure Data Factory](./source-control.md). 

> [!NOTE]
> In case of a disaster (loss of region), new data factory can be provisioned manually or in an automated fashion. Once the new data factory has been created, you can restore your pipelines, datasets and linked services JSON from the existing Git repository. 



## **Data stores**

Azure Data Factory enables you to move data among data stores located on-premises and in the cloud. To ensure business continuity with your data stores, you should refer to the business continuity recommendations for each of these data stores. 

 

## See also

- [Azure Regional Pairs](../availability-zones/cross-region-replication-azure.md)
- [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/)
