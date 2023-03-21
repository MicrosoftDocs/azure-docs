---
title: Azure Table Storage support in Azure Cosmos DB
description: Learn how Azure Cosmos DB for Table and Azure Table Storage work together by sharing the same table data model and operations.
ms.service: cosmos-db
ms.subservice: table
ms.topic: how-to
ms.date: 03/07/2023
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.devlang: cpp, csharp, java, javascript, php, python, ruby
ms.custom: ignite-2022
---

# Develop with Azure Cosmos DB for Table and Azure Table Storage
[!INCLUDE[Table](../includes/appliesto-table.md)]

Azure Cosmos DB for Table and Azure Table Storage share the same table data model and expose the same *create*, *delete*, *update*, and *query* operations through their SDKs.

> [!NOTE]
> The *serverless capacity mode* is now available on Azure Cosmos DB API for Table. For more information, see [Azure Cosmos DB serverless](../serverless.md).

[!INCLUDE [storage-table-cosmos-comparison](../../../includes/storage-table-cosmos-comparison.md)]

## Azure SDKs

### Current release

The following SDK packages work with both the Azure Cosmos DB for Table and Table Storage.

- **.NET**. Use the [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables/) available on NuGet.

- **Python**. Use the [azure-data-tables](https://pypi.org/project/azure-data-tables/) available from PyPi.

- **JavaScript/TypeScript**. Use the [@azure/data-tables](https://www.npmjs.com/package/@azure/data-tables) package available on npm.js.  

- **Java**. Use the [azure-data-tables](https://mvnrepository.com/artifact/com.azure/azure-data-tables/12.0.0) package available on Maven.

### Prior releases

The following SDK packages work only with Azure Cosmos DB for Table.

- **.NET**. [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables/) available on NuGet. The Azure Tables client library can seamlessly target either Table Storage or Azure Cosmos DB for Table service endpoints with no code changes.

- **Python**. [azure-cosmosdb-table](https://pypi.org/project/azure-cosmosdb-table/) available from PyPi. This SDK connects with both Table Storage and Azure Cosmos DB for Table.

- **JavaScript/TypeScript**. [azure-storage](https://www.npmjs.com/package/azure-storage) package available on npm.js. This Azure Storage SDK has the ability to connect to Azure Cosmos DB accounts using the API for Table.

- **Java**. [Microsoft Azure Storage Client SDK for Java](https://mvnrepository.com/artifact/com.microsoft.azure/azure-storage) on Maven. This Azure Storage SDK has the ability to connect to Azure Cosmos DB accounts using the API for Table.

- **C++**. [Azure Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp/). This library enables you to build applications against Azure Storage.

- **Ruby**. [Azure Storage Table Client Library for Ruby](https://github.com/azure/azure-storage-ruby/tree/master/table). This project provides a Ruby package that makes it easy to access Azure storage Table services.

- **PHP**. [Azure Storage Table PHP Client Library](https://github.com/Azure/azure-storage-php/tree/master/azure-storage-table). This project provides a PHP client library that makes it easy to access Azure storage Table services.

- **PowerShell**. [AzureRmStorageTable PowerShell module](https://www.powershellgallery.com/packages/AzureRmStorageTable). This PowerShell module has cmdlets to work with storage Tables.

## Next steps

- [Create a container in Azure Cosmos DB for Table](how-to-create-container.md)
