---
title: Import data for use with the Azure Cosmos DB Table API | Microsoft Docs
description: Learn how import data to use with the Azure Cosmos DB Table API.
services: cosmos-db
author: mimig1
manager: jhubbard
documentationcenter: ''

ms.assetid: b60743e2-0227-43ab-965a-0ae3ebacd917
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: mimig

---

# Import data for use with the Azure Cosmos DB Table API

This tutorial provides instructions on importing data for use with the Azure Cosmos DB [Table API](table-introduction.md). If you have data stored in Azure Table storage, you can use either the Data Migration Tool or az copy to import your data into Azure Cosmos DB. Once your data is imported, you'll be able to take advantage of the premium capabilities Azure Cosmos DB offers, such as turnkey global distribution, Dedicated throughput, single-digit millisecond latencies at the 99th percentile, guaranteed high availability, and automatic secondary indexing.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Importing data with the Data Migration tool
> * Importing data with AzCopy

## Data Migration tool

The Azure Cosmos DB Data Migration tool is one option to import your existing Azure Table storage data. To import data with the tool, you select Azure Table storage as the source and the Azure Cosmos DB Table API as the target, and provide the rest of the information as reqested in the tool. Data can be exported in bulk, or by using sequential record import. 

Information on defining Azure Table storage as the source and Table API as the target is provided in the following sections:
- [Using Azure Table storage as a data migration source](import-data.md#AzureTableSource). 
- [Export to Table API with bulk import](import-data.md#tableapibulkexport)
- [Export to Table API with sequential record import](import-data.md#tableapiseqtarget).

## AzCopy command

Using the AzCopy command line utility is the other option for migrating data from Azure Table storage to the Azure Cosmos DB Table API. To use AzCopy, you first export your data to a manifest file as described in [Export data from Table storage](../storage/common/storage-use-azcopy.md#export-data-from-table-storage), then import the data from the manifest file to Azure Cosmos DB Table API](../storage/common/storage-use-azcopy.md#import-data-into-table-storage).

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Import data with the Data Migration tool
> * Import data with AzCopy

You can now proceed to the next tutorial and learn how to query data using the Azure Cosmos DB Table API. 

> [!div class="nextstepaction"]
>[How to query data?](../cosmos-db/tutorial-query-table.md)



