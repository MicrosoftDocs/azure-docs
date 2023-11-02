---
title: Database Migration Assistant utility
titleSuffix: Azure Cosmos DB for MongoDB
description: This doc provides an overview of the Database Migration Assistant legacy utility.
author: sandeep-nair
ms.author: sandnair
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: 
ms.topic: conceptual
ms.date: 04/20/2023
---

# Database Migration Assistant utility (legacy)

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

> [!IMPORTANT]  
> Database Migration Assistant is a preliminary legacy utility meant to assist you with the pre-migration steps. Microsoft recommends you to use the [Azure Cosmos DB Migration for MongoDB extension](/azure-data-studio/extensions/database-migration-for-mongo-extension) for all pre-migration steps.

### Programmatic discovery using the Database Migration Assistant

You may use the [Database Migration Assistant](https://github.com/AzureCosmosDB/Cosmos-DB-Migration-Assistant-for-API-for-MongoDB) (DMA) to assist you with the discovery stage and create the data estate migration sheet programmatically.

It's easy to [setup and run DMA](https://github.com/AzureCosmosDB/Cosmos-DB-Migration-Assistant-for-API-for-MongoDB#how-to-run-the-dma) through an Azure Data Studio client. It can be run from any machine connected to your source MongoDB environment.

You can use either one of the following DMA output files as the data estate migration spreadsheet:

* `workload_database_details.csv` - Gives a database-level view of the source workload. Columns in file are: Database Name, Collection count, Document Count, Average Document Size, Data Size, Index Count and Index Size.
* `workload_collection_details.csv` - Gives a collection-level view of the source workload. Columns in file are: Database Name, Collection Name, Doc Count, Average Document Size, Data size, Index Count, Index Size and Index definitions.

Here's a sample database-level migration spreadsheet created by DMA:

| DB Name | Collection Count | Doc Count | Avg Doc Size | Data Size | Index Count | Index Size |
| --- | --- | --- | --- | --- | --- | --- |
| `bookstoretest` | 2 | 192200 | 4144 | 796572532 | 7 | 260636672 |
| `cosmosbookstore` | 1 | 96604 | 4145 | 400497620 | 1 | 1814528 |
| `geo` | 2 | 25554 | 252 | 6446542 | 2 | 266240 |
| `kagglemeta` | 2 | 87934912 | 190 | 16725184704 | 2 | 891363328 |
| `pe_orig` | 2 | 57703820 | 668 | 38561434711 | 2 | 861605888 |
| `portugeseelection` | 2 | 30230038 | 687 | 20782985862 | 1 | 450932736 |
| `sample_mflix` | 5 | 75583 | 691 | 52300763 | 5 | 798720 |
| `test` | 1 | 22 | 545 | 12003 | 0 | 0 |
| `testcol` | 26 | 46 | 88 | 4082 | 32 | 589824 |
| `testhav` | 3 | 2 | 528 | 1057 | 3 | 36864 |
| **TOTAL:** | **46** | **176258781** | | **72.01 GB** | | **2.3 GB** |

### Programmatic assessment using the Database Migration Assistant

[Database Migration Assistant](https://github.com/AzureCosmosDB/Cosmos-DB-Migration-Assistant-for-API-for-MongoDB) (DMA) also assists you with the assessment stage of pre-migration planning.

Refer to the section [Programmatic discovery using the Database Migration Assistant](#programmatic-discovery-using-the-database-migration-assistant) to know how to setup and run DMA.

The DMA notebook runs a few assessment rules against the resource list it gathers from source MongoDB. The assessment result lists the required and recommended changes needed to proceed with the migration.

The results are printed as an output in the DMA notebook and saved to a CSV file - `assessment_result.csv`.

> [!NOTE]
> Database Migration Assistant does not perform an end-to-end assessment. It is a preliminary utility meant to assist you with the pre-migration steps.

