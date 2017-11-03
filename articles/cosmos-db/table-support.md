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

The Azure Cosmos DB Table API and Azure Table storage share the same data model and expose very similar create, delete, update, and query operations through both their SDKs. 

For more information about the benefits of each service and the interoperability between the two, see the following articles:
- [Introduction to Azure Cosmos DB: Table API](table-introduction.md)
- [FAQ: Develop with the Table API](faq.md#develop-with-the-table-api-preview)
- [Azure Table storage overview](table-storage-overview.md)

At this time the Azure Cosmos DB Table API has one .NET SDK available, the [Windows Azure Storage Premium Table](https://aka.ms/premiumtablenuget) (preview). This library has the same classes and method signatures as the public [Windows Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage), but also has the ability to connect to Azure Cosmos DB accounts using the [Table API](table-introduction.md) (preview). For a quickstart and tutorial using the Azure Cosmos DB Table API, see the following:
- Quickstart: [Azure Cosmos DB: Build a .NET application using the Table API](create-table-dotnet.md)
- Tutorial: [Azure Cosmos DB: Develop with the Table API in .NET](tutorial-develop-table-dotnet.md)

Azure Table storage has many SDKs available and tutorials available, all of which are now availabe in this section. These articles are actively being updated to include information about Azure Cosmos DB Table API as well, as these SDKs provide interoperability between the two Azure services. 






