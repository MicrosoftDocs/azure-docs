---
title: Introduction to Table storage - Object storage in Azure | Microsoft Docs
description: Store structured data in the cloud using Azure Table storage, a NoSQL data store.
services: storage
ms.service: storage
author: tamram
ms.author: tamram
ms.devlang: dotnet
ms.topic: overview
ms.date: 04/23/2018
ms.subservice: tables
---
# What is Azure Table storage ? 

[!INCLUDE [storage-table-cosmos-db-tip-include](../../../includes/storage-table-cosmos-db-tip-include.md)]

Azure Table storage is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. Because Table storage is schemaless, it's easy to adapt your data as the needs of your application evolve. Access to Table storage data is fast and cost-effective for many types of applications, and is typically lower in cost than traditional SQL for similar volumes of data.

You can use Table storage to store flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

[!INCLUDE [storage-table-concepts-include](../../../includes/storage-table-concepts-include.md)]

## Next steps

* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.

* [Get started with Azure Table Storage in .NET](../../cosmos-db/tutorial-develop-table-dotnet.md)

* View the Table service reference documentation for complete details about available APIs:

    * [Storage Client Library for .NET reference](/dotnet/api/overview/azure/storage)

    * [REST API reference](/rest/api/storageservices/)