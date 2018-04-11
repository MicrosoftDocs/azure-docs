---
title: Azure Table Storage support in Azure Cosmos DB | Microsoft Docs
description: Learn how Azure Cosmos DB Table API and Azure Storage Tables work together.
services: cosmos-db
author: mimig1
manager: jhubbard
documentationcenter: ''

ms.assetid: 378f00f2-cfd9-4f6b-a9b1-d1e4c70799fd
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: mimig

---

# Developing with Azure Cosmos DB Table API and Azure Table storage

Azure Cosmos DB Table API and Azure Table storage share the same table data model and expose the same create, delete, update, and query operations through their SDKs. 

## Developing with the Azure Cosmos DB Table API

At this time, the [Azure Cosmos DB Table API](table-introduction.md) has four SDKs available for development: 
- [Microsoft.Azure.CosmosDB.Table](https://aka.ms/tableapinuget) .NET SDK. This library has the same classes and method signatures as the public [Windows Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage), but also has the ability to connect to Azure Cosmos DB accounts using the Table API. 
- [Python SDK](table-sdk-python.md). The new Azure Cosmos DB Python SDK is the only SDK that supports Azure Table storage in Python. This SDK connects with both Azure Table storage and Azure Cosmos DB Table API.
- [Java SDK](table-sdk-java.md). This Azure Storage SDK has the ability to connect to Azure Cosmos DB accounts using the Table API.
- [Node.js SDK](table-sdk-nodejs.md). This Azure Storage SDK has the ability to connect to Azure Cosmos DB accounts using the Table API.

Additional information about working with the Table API is available in the [FAQ: Develop with the Table API](faq.md#develop-with-the-table-api) article.

## Developing with the Azure Table storage

[Azure Table storage](table-storage-overview.md) has many SDKs available and tutorials available, all of which are now available in the [Azure Table storage](table-storage-overview.md) section. These articles are being updated as interoperability between the Azure Table storage SDKs and Azure Cosmos DB Table APIs becomes available.  





