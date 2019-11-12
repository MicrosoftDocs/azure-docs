---
title: Supported data stores in Azure Data Share
description: Learn about the data stores that are supported for use Azure Data Share.
ms.service: data-share
author: joannapea
ms.author: joanpo
ms.topic: conceptual
ms.date: 10/30/2019
---
# Supported data stores in Azure Data Share

Azure Data Share provides open and flexible data sharing, including the ability to share from and to different data stores. Data providers can share data from one type of data store, and their data consumers can choose which data store to receive data into. 

In this article, you'll learn about the rich set of Azure data stores that are supported in Azure Data Share. You can also find information on the combinations of data stores that can be leveraged by data providers and data consumers. 

## What data stores are supported in Azure Data Share? 

The below table details the supported data sources for Azure Data Share. 

| Data store | Snapshot-based sharing | In-place sharing 
|:--- |:--- |:--- |:--- |:--- |:--- |
| Azure Blob storage |✓ | |
| Azure Data Lake Storage Gen1 |✓ | |
| Azure Data Lake Storage Gen2 |✓ ||
| Azure SQL Database |Public Preview | |
| Azure SQL Data Warehouse |Public Preview | |
| Azure Data Explorer | |[Limited preview](https://aka.ms/azuredatasharepreviewsignup) |

## Data store support matrix

Azure Data Share offers data consumers flexibility when deciding on a data store to accept data in to. For example, data being shared from Azure SQL Database can be received into Azure Data Lake Store Gen2, Azure SQL Database or Azure SQL Data Warehouse. Customers can choose which format to receive data in when configuring a received data share. 

The below table details different combinations and choices that data consumers have when accepting and configuring their data share. For more information on how to configure dataset mappings, see [how to configure dataset mappings](how-to-configure-mapping.md).

|  | Azure Blob Storage | Azure SQL Data Lake Gen1 | Azure SQL Data Lake Gen2 | Azure SQL Database | Azure SQL Data Warehouse 
|:--- |:--- |:--- |:--- |:--- |:--- |
| Azure Blob storage |✓ ||✓|
| Azure Data Lake Storage Gen1 |✓ | |✓|
| Azure Data Lake Storage Gen2 |✓ | |✓|
| Azure SQL Database |✓ | |✓|✓|✓|
| Azure SQL Data Warehouse |✓ | |✓|✓|✓|

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.
