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
ms.date: 11/03/2017
ms.author: mimig

---

# Developing with Azure Cosmos DB Table API and Azure Table storage

Azure Cosmos DB Table API and Azure Table storage share the same table data model and expose the same create, delete, update, and query operations through their SDKs. 

## Developing with the Azure Cosmos DB Table API

At this time, the [Azure Cosmos DB Table API](table-introduction.md) has one .NET SDK available, the [Windows Azure Storage Premium Table (preview)](https://aka.ms/tableapinuget). This library has the same classes and method signatures as the public [Windows Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage), but also has the ability to connect to Azure Cosmos DB accounts using the Table API (preview). For a quickstart and tutorial using the Azure Cosmos DB Table API, see the following articles:
- Quickstart: [Azure Cosmos DB: Build a .NET application using the Table API](create-table-dotnet.md)
- Tutorial: [Azure Cosmos DB: Develop with the Table API in .NET](tutorial-develop-table-dotnet.md)

Additional information about working with the Table API is available in the [FAQ: Develop with the Table API](faq.md#develop-with-the-table-api) article.

## Developing with the Azure Table storage

[Azure Table storage](table-storage-overview.md) has many SDKs available and tutorials available, all of which are now available in the [Azure Table storage](table-storage-overview.md) section. These articles are being updated as interoperability between the Azure Table storage SDKs and Azure Cosmos DB Table APIs becomes available.  





