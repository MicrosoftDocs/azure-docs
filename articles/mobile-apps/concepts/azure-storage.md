---
title: Cloud storage to build highly secure, durable, scalable apps with Azure Storage
description: Learn about the services to store large structured and non-structured mobile application data in the cloud.
author: codemillmatt
ms.assetid: 12bbb070-9b3c-4faf-8588-ccff02097224
ms.service: mobile-services
ms.topic: article
ms.date: 06/05/2020
ms.author: masoucou
---

# Cloud storage for highly secure, durable, scalable apps with Azure Storage
[Azure Storage](https://azure.microsoft.com/services/storage/) is Microsoft's cloud storage solution for modern applications that offers a massively scalable object store for data objects, a file system service for the cloud, a messaging store for reliable messaging, and a NoSQL store. Azure Storage is:
- **Durable and highly available:** Redundancy ensures that your data is safe in the event of transient hardware failures. You can also opt to replicate data across datacenters or geographical regions for additional protection from local catastrophe or natural disaster. Data replicated in this way remains highly available in the event of an unexpected outage.
- **Secure:** All data written to Azure Storage is encrypted by the service. Azure Storage provides you with fine-grained control over who has access to your data.
- **Scalable:** Services are designed to be massively scalable to meet the data storage and performance needs of today's applications.
- **Managed:** Azure handles hardware maintenance, updates, and critical issues for you.
- **Accessible:** The data is accessible from anywhere in the world over HTTP or HTTPS. Microsoft provides client libraries in a variety of languages, such as .NET, Java, Node.js, Python, PHP, Ruby, and Go, and a mature REST API. Scripting is supported in Azure PowerShell or the Azure CLI. The Azure portal and Azure Storage Explorer offer easy visual solutions for working with your data.

Use the following services to enable cloud storage in your mobile apps.

## Azure Blob storage
[Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) offers an object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data that doesn't adhere to a particular data model or definition, such as text or binary. It supports variety of languages that client libraries use. Blob storage is designed to:
- Serve images or documents directly to a browser.
- Store files for distributed access.
- Stream video and audio.
- Write to log files.
- Store data for backup and restore, disaster recovery, and archiving.
- Store data for analysis by an on-premises or Azure-hosted service.

**References**
- [Azure portal](https://portal.azure.com)
- [Azure Blob storage documentation](/azure/storage/blobs/storage-blobs-introduction)
- [Quickstarts](/azure/storage/blobs/storage-quickstart-blobs-portal)
- [Samples](/azure/storage/common/storage-samples-dotnet?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

## Azure Table storage
[Azure Table storage](https://azure.microsoft.com/services/storage/tables/) is a service that stores structured NoSQL data in the cloud and provides a key or attribute store with a schemaless design. Azure Table storage stores large amounts of structured data. The service is a NoSQL data store, which accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, nonrelational data. Table storage is typically used to:
- Store terabytes of structured data capable of serving web-scale applications.
- Store datasets that don't require complex joins, foreign keys, or stored procedures and can be denormalized for fast access.
- Quickly query data by using a clustered index.
- Access data by using the OData protocol and LINQ queries with Windows Communication Foundation (WCF) Data Services .NET libraries.

You can use Table storage to store and query huge sets of structured, nonrelational data. Your tables scale as demand increases.

**References**
- [Azure portal](https://portal.azure.com)
- [Azure Table storage documentation](/azure/storage/tables/table-storage-overview)
- [Samples](/azure/cosmos-db/tutorial-develop-table-dotnet?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fstorage%2Ftables%2FTOC.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
- [Quickstarts](/azure/storage/tables/table-storage-quickstart-portal)

## Azure Queue storage
[Azure Queue storage](https://azure.microsoft.com/services/storage/queues/) is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls by using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue might contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously.

**References**
- [Azure portal](https://portal.azure.com)
- [Azure Queue storage documentation](/azure/storage/queues/)
- [Quickstarts](/azure/storage/queues/storage-quickstart-queues-portal)
- [Samples](/azure/storage/common/storage-samples-dotnet?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
