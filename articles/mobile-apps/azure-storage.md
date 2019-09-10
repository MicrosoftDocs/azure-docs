---
title: Azure Storage
description: Learn how to leverage Azure Storage in your applications
author: elamalani

ms.assetid: 12bbb070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 08/09/2019
ms.author: emalani
---

# Azure Storage
Azure Storage is Microsoft's cloud storage solution for modern application that offers a massively scalable object store for data objects, a file system service for the cloud, a messaging store for reliable messaging, and a NoSQL store. Azure Storage is:
- **Durable and highly available**. Redundancy ensures that your data is safe in the event of transient hardware failures. You can also opt to replicate data across datacenters or geographical regions for additional protection from local catastrophe or natural disaster. Data replicated in this way remains highly available in the event of an unexpected outage.
- **Secure** as all data written to Azure Storage is encrypted by the service. Azure Storage provides you with fine-grained control over who has access to your data.
- **Scalable** as the services are designed to be massively scalable to meet the data storage and performance needs of today's applications.
- **Managed** as Azure handles hardware maintenance, updates, and critical issues for you.
- The data is **accessible** from anywhere in the world over HTTP or HTTPS. Microsoft provides client libraries in a variety of languages, including .NET, Java, Node.js, Python, PHP, Ruby, Go, and others, as well as a mature REST API. Scripting is supported in Azure PowerShell or Azure CLI and the Azure portal and Azure Storage Explorer offer easy visual solutions for working with your data.

## Azure Storage Services

1. ### **Azure Blob Storage**
    [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) offers object storage solution for the cloud and is optimized for storing massive amounts of unstructured data that does not adhere to a particular data model or definition, such as text or binary. It supports client libraries in veriry of languages and is designed for:
    - Serving images or documents directly to a browser.
    - Storing files for distributed access. 
    - Streaming video and audio.
    - Writing to log files.
    - Storing data for backup and restore, disaster recovery, and archiving.
    - Storing data for analysis by an on-premises or Azure-hosted service.

    **References**
   - [Azure Portal](https://portal.azure.com) to create a Storage account
   - [Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
   - [Quickstarts](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal)
   - [Samples] (https://docs.microsoft.com/en-us/azure/storage/common/storage-samples-dotnet?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
   
2. ### **Azure Table Storage**
    [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/) is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. Azure Table storage stores large amounts of structured data. The service is a NoSQL datastore which accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data. Common uses of Table storage include:
    - Storing TBs of structured data capable of serving web scale applications
    - Storing datasets that don't require complex joins, foreign keys, or stored procedures and can be denormalized for fast access
    - Quickly querying data using a clustered index
    - Accessing data using the OData protocol and LINQ queries with WCF Data Service .NET Libraries
    
    You can use Table storage to store and query huge sets of structured, non-relational data, and your tables will scale as demand increases.

    **References**
    - [Azure Portal](https://portal.azure.com) to create an Azure storage table
    - [Documentation](https://docs.microsoft.com/en-us/azure/storage/tables/table-storage-overview)
    - [Samples](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-develop-table-dotnet?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fstorage%2Ftables%2FTOC.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
    - [Quickstarts](https://docs.microsoft.com/en-us/azure/storage/tables/table-storage-quickstart-portal)

3. ### **Azure Files**
    [Azure Files](https://azure.microsoft.com/en-us/services/storage/files/) enables you to set up highly available network file shares that can be accessed by using the standard Server Message Block (SMB) protocol. Multiple VMs can share the same files with both read and write access. You can also read the files using the REST interface or the storage client libraries. You can access the files from anywhere in the world using a URL that points to the file and includes a shared access signature (SAS) token. You can generate SAS tokens; they allow specific access to a private asset for a specific amount of time.
    
    Azure file shares can be used to:
    - Replace or supplement on-premises file servers: Popular operating systems such as Windows, macOS, and Linux can directly mount Azure file shares wherever they are in the world. Azure file shares can also be replicated with Azure File Sync to Windows Servers, either on-premises or in the cloud, for performance and distributed caching of the data where it's being used.
    - **Lift and shift" applications** to the cloud that expect a file share to store file application or user data.
    - Simplify cloud development:
        Azure Files can also be used in numerous ways to simplify new cloud development projects. For example:
        - Shared application settings: A common pattern for distributed applications is to have configuration files in a centralized location where they can be accessed from many application instances. Application instances can load their configuration through the File REST API, and humans can access them as needed by mounting the SMB share locally.
        - Diagnostic share: An Azure file share is a convenient place for cloud applications to write their logs, metrics, and crash dumps. Logs can be written by the application instances via the File REST API, and developers can access them by mounting the file share on their local machine. This enables great flexibility, as developers can embrace cloud development without having to abandon any existing tooling they know and love.
        - Dev/Test/Debug: When developers or administrators are working on VMs in the cloud, they often need a set of tools or utilities. Copying such utilities and tools to each VM can be a time consuming exercise. By mounting an Azure file share locally on the VMs, a developer and administrator can quickly access their tools and utilities, no copying required.

    **References**
    - [Azure Portal](https://portal.azure.com) to create an Azure storage table
    - [Documentation](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction)
    - [Quickstarts](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-quick-create-use-windows)


3. ### **Azure Queues**
    [Azure Queue Storage](https://azure.microsoft.com/en-us/services/storage/queues/) is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size and a queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously.
    
    **References**
    - [Azure Portal](https://portal.azure.com) to create an Azure storage table
    - [Documentation](https://docs.microsoft.com/en-us/azure/storage/queues/)
    - [Quickstarts](https://docs.microsoft.com/en-us/azure/storage/queues/storage-quickstart-queues-portal)
    - [Samples](https://docs.microsoft.com/en-us/azure/storage/common/storage-samples-dotnet?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
