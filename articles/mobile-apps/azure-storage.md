---
title: Cloud storage to build highly secure, durable, scalable apps with Azure Storage
description: Learn about the services to store large structured and non-structured mobile application data in the cloud.
author: codemillmatt
ms.assetid: 12bbb070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 03/24/2020
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

## Azure Files
With [Azure Files](https://azure.microsoft.com/services/storage/files/), you can set up highly available network file shares that can be accessed by using the standard Server Message Block (SMB) protocol. Multiple VMs can share the same files with both read and write access. You can also read the files by using the REST interface or the storage client libraries. You can access the files from anywhere in the world by using a URL that points to the file and includes a Shared Access Signature (SAS) token. You can generate SAS tokens. They allow specific access to a private asset for a specific amount of time.

Azure file shares can be used to:
- **Replace or supplement on-premises file servers:** Popular operating systems such as Windows, macOS, and Linux can directly mount Azure file shares wherever they are in the world. Azure file shares can also be replicated with Azure File Sync to Windows Servers, either on-premises or in the cloud, for performance and distributed caching of the data where it's being used.
- **Lift and shift applications:** Migrate applications to the cloud that expect a file share to store file application or user data.
- **Simplify cloud development:** Azure Files can also be used in numerous ways to simplify new cloud development projects. For example:
    - **Shared application settings:** A common pattern for distributed applications is to have configuration files in a centralized location where they can be accessed from many application instances. Application instances can load their configuration through the File REST API. Users can access them as needed by mounting the SMB share locally.
    - **Diagnostic share:** An Azure file share is a convenient place for cloud applications to write their logs, metrics, and crash dumps. Logs can be written by the application instances via the File REST API. Developers can access them by mounting the file share on their local machine. This capability enables great flexibility. Developers can embrace cloud development without having to abandon the existing tooling they know.

**References**
- [Azure portal](https://portal.azure.com)
- [Azure Files documentation](/azure/storage/files/storage-files-introduction)
- [Quickstarts](/azure/storage/files/storage-files-quick-create-use-windows)

## Azure Queue storage
[Azure Queue storage](https://azure.microsoft.com/services/storage/queues/) is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls by using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue might contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously.

**References**
- [Azure portal](https://portal.azure.com)
- [Azure Queue storage documentation](/azure/storage/queues/)
- [Quickstarts](/azure/storage/queues/storage-quickstart-queues-portal)
- [Samples](/azure/storage/common/storage-samples-dotnet?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
