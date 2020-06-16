---
title: Azure Table Storage support in Azure Cosmos DB
description: Learn how Azure Cosmos DB Table API and Azure Storage Tables work together by sharing the same table data model an operations
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: overview
ms.date: 05/21/2020
author: sakash279
ms.author: akshanka
ms.reviewer: sngun
---

# Developing with Azure Cosmos DB Table API and Azure Table storage

Azure Cosmos DB Table API and Azure Table storage share the same table data model and expose the same create, delete, update, and query operations through their SDKs.

[!INCLUDE [storage-table-cosmos-comparison](../../includes/storage-table-cosmos-comparison.md)]

## Developing with the Azure Cosmos DB Table API

At this time, the [Azure Cosmos DB Table API](table-introduction.md) has four SDKs available for development: 

* [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table): .NET SDK. This library targets .NET Standard and has the same classes and method signatures as the public [Windows Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage), but also has the ability to connect to Azure Cosmos DB accounts using the Table API. Users of .NET Framework library [Microsoft.Azure.CosmosDB.Table](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.Table/) are recommended to upgrade to [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) as it is in maintenance mode and will be deprecated soon.

* [Python SDK](table-sdk-python.md): The new Azure Cosmos DB Python SDK is the only SDK that supports Azure Table storage in Python. This SDK connects with both Azure Table storage and Azure Cosmos DB Table API.

* [Java SDK](table-sdk-java.md): This Azure Storage SDK has the ability to connect to Azure Cosmos DB accounts using the Table API.

* [Node.js SDK](table-sdk-nodejs.md): This Azure Storage SDK has the ability to connect to Azure Cosmos DB accounts using the Table API.


Additional information about working with the Table API is available in the [FAQ: Develop with the Table API](table-api-faq.md) article.

## Developing with Azure Table storage

Azure Table storage has these SDKs available for development:

- The [Microsoft.Azure.Storage.Blob](https://www.nuget.org/packages/Microsoft.Azure.Storage.Blob/), [Microsoft.Azure.Storage.File](https://www.nuget.org/packages/Microsoft.Azure.Storage.File/), [Microsoft.Azure.Storage.Queue](https://www.nuget.org/packages/Microsoft.Azure.Storage.Queue/), and [Microsoft.Azure.Storage.Common](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/) libraries allow you to work with the Azure Table storage service. If you are using the Table API in Azure Cosmos DB, you can instead use the [Microsoft.Azure.CosmosDB.Table](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.Table/) library.
- [Python SDK](https://github.com/Azure/azure-cosmos-table-python). The Azure Cosmos DB Table SDK for Python supports the Table Storage service (because Azure Table Storage and Cosmos DB's Table API share the same features and functionalities, and in an effort to factorize our SDK development efforts, we recommend to use this SDK).
- [Azure Storage SDK for Java](https://github.com/azure/azure-storage-java). This Azure Storage SDK provides a client library in Java to consume Azure Table storage.
- [Node.js SDK](https://github.com/Azure/azure-storage-node). This SDK provides a Node.js package and a browser-compatible JavaScript client library to consume the storage Table service.
- [AzureRmStorageTable PowerShell module](https://www.powershellgallery.com/packages/AzureRmStorageTable). This PowerShell module has cmdlets to work with storage Tables.
- [Azure Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp/). This library enables you to build applications against Azure Storage.
- [Azure Storage Table Client Library for Ruby](https://github.com/azure/azure-storage-ruby/tree/master/table). This project provides a Ruby package that makes it easy to access Azure storage Table services.
- [Azure Storage Table PHP Client Library](https://github.com/Azure/azure-storage-php/tree/master/azure-storage-table). This project provides a PHP client library that makes it easy to access Azure storage Table services.


   





