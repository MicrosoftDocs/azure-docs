---
title: Connect a Data Factory to Azure Purview
description: Learn about how to connect a Data Factory to Azure Purview

services: data-factory
ms.author: lle
author: lrtoyou1223
manager: shwang
ms.reviewer: craigg
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: [seo-lt-2019, references_regions]
ms.date: 12/3/2020
---

# Connect Data Factory to Azure Purview (Preview)
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article will explain how to connect data factory to Azure Purview and how to report data lineage of ADF activities Copy data, Data flow and Execute SSIS package.

## Connect data factory to Azure Purview
Azure Purview is a new cloud service for use by data users centrally manage data governance across their data estate spanning cloud and on-prem environments. You can connect your data factory to Azure Purview and the connection allows you to leverage Azure Purview for capturing lineage data of Copy, Data flow and Execute SSIS package. 
For how to register data factory in Azure Purview, see [How to connect Azure Data Factory and Azure Purview](https://docs.microsoft.com/azure/purview/how-to-link-azure-data-factory). 

## Report Lineage data to Azure Purview
When customers run Copy, Data flow or Execute SSIS package activity in Azure data factory, customers could get the dependency relationship and have a high-level overview of whole workflow process among data sources and destination.
For how to collect lineage from Azure data factory, see [data factory lineage](https://docs.microsoft.com/azure/purview/how-to-link-azure-data-factory#supported-azure-data-factory-activities).

## Next steps
[Catalog lineage user guide](https://docs.microsoft.com/azure/purview/catalog-lineage-user-guide)

[Tutorial: Push Data Factory lineage data to Azure Purview](turorial-push-lineage-to-purview.md)