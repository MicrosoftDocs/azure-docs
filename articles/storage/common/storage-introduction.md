---
title: Introduction to Azure Storage - Cloud storage on Azure
description: The Azure Storage platform is Microsoft's cloud storage solution. Azure Storage provides highly available, secure, durable, massively scalable, and redundant storage for data objects in the cloud. Learn about the services available in Azure Storage and how you can use them in your applications, services, or enterprise solutions.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: conceptual
ms.date: 01/10/2023
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: ignite-2022
---

# Introduction to Azure Storage

The Azure Storage platform is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for a variety of data objects in the cloud. Azure Storage data objects are accessible from anywhere in the world over HTTP or HTTPS via a REST API. Azure Storage also offers client libraries for developers building applications or services with .NET, Java, Python, JavaScript, C++, and Go. Developers and IT professionals can use Azure PowerShell and Azure CLI to write scripts for data management or configuration tasks. The Azure portal and Azure Storage Explorer provide user-interface tools for interacting with Azure Storage.

## Benefits of Azure Storage

Azure Storage services offer the following benefits for application developers and IT professionals:

- **Durable and highly available.** Redundancy ensures that your data is safe in the event of transient hardware failures. You can also opt to replicate data across data centers or geographical regions for additional protection from local catastrophe or natural disaster. Data replicated in this way remains highly available in the event of an unexpected outage.
- **Secure.** All data written to an Azure storage account is encrypted by the service. Azure Storage provides you with fine-grained control over who has access to your data.
- **Scalable.** Azure Storage is designed to be massively scalable to meet the data storage and performance needs of today's applications.
- **Managed.** Azure handles hardware maintenance, updates, and critical issues for you.
- **Accessible.** Data in Azure Storage is accessible from anywhere in the world over HTTP or HTTPS. Microsoft provides client libraries for Azure Storage in a variety of languages, including .NET, Java, Node.js, Python, PHP, Ruby, Go, and others, as well as a mature REST API. Azure Storage supports scripting in Azure PowerShell or Azure CLI. And the Azure portal and Azure Storage Explorer offer easy visual solutions for working with your data.

## Azure Storage data services

The Azure Storage platform includes the following data services:

- [Azure Blobs](../blobs/storage-blobs-introduction.md): A massively scalable object store for text and binary data. Also includes support for big data analytics through Data Lake Storage Gen2.
- [Azure Files](../files/storage-files-introduction.md): Managed file shares for cloud or on-premises deployments.
- [Azure Elastic SAN](../elastic-san/elastic-san-introduction.md) (preview): A fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN in Azure.
- [Azure Queues](../queues/storage-queues-introduction.md): A messaging store for reliable messaging between application components.
- [Azure Tables](../tables/table-storage-overview.md): A NoSQL store for schemaless storage of structured data.
- [Azure managed Disks](../../virtual-machines/managed-disks-overview.md): Block-level storage volumes for Azure VMs.

Each service is accessed through a storage account with a unique address. To get started, see [Create a storage account](storage-account-create.md).

Additionally, Azure provides the following specialized storage:

- [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md): Enterprise files storage, powered by NetApp: makes it easy for enterprise line-of-business (LOB) and storage professionals to migrate and run complex, file-based applications with no code change. Azure NetApp Files is managed via NetApp accounts and can be accessed via NFS, SMB and dual-protocol volumes. To get started, see [Create a NetApp account](../../azure-netapp-files/azure-netapp-files-create-netapp-account.md).

For help in deciding which data services to use for your scenario, see [Review your storage options](/azure/cloud-adoption-framework/ready/considerations/storage-options) in the Microsoft Cloud Adoption Framework.

## Review options for storing data in Azure

Azure provides a variety of storage tools and services, including Azure Storage. To determine which Azure technology is best suited for your scenario, see [Review your storage options](/azure/cloud-adoption-framework/ready/considerations/storage-options) in the Azure Cloud Adoption Framework.

## Sample scenarios for Azure Storage services

The following table compares Files, Blobs, Disks, Queues, Tables, and Azure NetApp Files, and shows example scenarios for each.

| Feature | Description | When to use |
|--------------|-------------|-------------|
| **Azure Files** |Offers fully managed cloud file shares that you can access from anywhere via the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview), [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System), and [Azure Files REST API](/rest/api/storageservices/file-service-rest-api).<br><br>You can mount Azure file shares from cloud or on-premises deployments of Windows, Linux, and macOS. | You want to "lift and shift" an application to the cloud that already uses the native file system APIs to share data between it and other applications running in Azure.<br/><br/>You want to replace or supplement on-premises file servers or NAS devices.<br><br> You want to store development and debugging tools that need to be accessed from many virtual machines. |
| **Azure Blobs** | Allows unstructured data to be stored and accessed at a massive scale in block blobs.<br/><br/>Also supports [Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md) for enterprise big data analytics solutions. | You want your application to support streaming and random access scenarios.<br/><br/>You want to be able to access application data from anywhere.<br/><br/>You want to build an enterprise data lake on Azure and perform big data analytics. |
| **Azure Elastic SAN** (preview) | Azure Elastic SAN (preview) is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability. | You want large scale storage that is interoperable with multiple types of compute resources (such as SQL, MariaDB, Azure virtual machines, and Azure Kubernetes Services) accessed via the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol.|
| **Azure Disks** | Allows data to be persistently stored and accessed from an attached virtual hard disk. | You want to "lift and shift" applications that use native file system APIs to read and write data to persistent disks.<br/><br/>You want to store data that is not required to be accessed from outside the virtual machine to which the disk is attached. |
| **Azure Queues** | Allows for asynchronous message queueing between application components. | You want to decouple application components and use asynchronous messaging to communicate between them.<br><br>For guidance around when to use Queue Storage versus Service Bus queues, see [Storage queues and Service Bus queues - compared and contrasted](../../service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted.md). |
| **Azure Tables** | Allows you to store structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. | You want to store flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires. <br/><br/>For guidance around when to use Table Storage versus Azure Cosmos DB for Table, see [Developing with Azure Cosmos DB for Table and Azure Table Storage](../../cosmos-db/table-support.md). |
| **Azure NetApp Files** | Offers a fully managed, highly available, enterprise-grade NAS service that can handle the most demanding, high-performance, low-latency workloads requiring advanced data management capabilities. | You have a difficult-to-migrate workload such as POSIX-compliant Linux and Windows applications, SAP HANA, databases, high-performance compute (HPC) infrastructure and apps, and enterprise web applications. <br></br> You require support for multiple file-storage protocols in a single service, including NFSv3, NFSv4.1, and SMB3.1.x, enables a wide range of application lift-and-shift scenarios, with no need for code changes. |

## Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud. Blob Storage is optimized for storing massive amounts of unstructured data, such as text or binary data.

Blob Storage is ideal for:

- Serving images or documents directly to a browser.
- Storing files for distributed access.
- Streaming video and audio.
- Storing data for backup and restore, disaster recovery, and archiving.
- Storing data for analysis by an on-premises or Azure-hosted service.

Objects in Blob Storage can be accessed from anywhere in the world via HTTP or HTTPS. Users or client applications can access blobs via URLs, the [Azure Storage REST API](/rest/api/storageservices/blob-service-rest-api), [Azure PowerShell](/powershell/module/azure.storage), [Azure CLI](/cli/azure/storage), or an Azure Storage client library. The storage client libraries are available for multiple languages, including [.NET](/dotnet/api/overview/azure/storage), [Java](/java/api/overview/azure/storage), [Node.js](https://azure.github.io/azure-storage-node), [Python](/python/api/overview/azure/storage), [PHP](https://azure.github.io/azure-storage-php/), and [Ruby](https://azure.github.io/azure-storage-ruby). 

Clients can also securely connect to Blob Storage by using SSH File Transfer Protocol (SFTP) and mount Blob Storage containers by using the Network File System (NFS) 3.0 protocol. 

For more information about Blob Storage, see [Introduction to Blob Storage](../blobs/storage-blobs-introduction.md).

## Azure Files

[Azure Files](../files/storage-files-introduction.md) enables you to set up highly available network file shares that can be accessed by using the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview), [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System), and [Azure Files REST API](/rest/api/storageservices/file-service-rest-api). That means that multiple VMs can share the same files with both read and write access. You can also read the files using the REST interface or the storage client libraries.

One thing that distinguishes Azure Files from files on a corporate file share is that you can access the files from anywhere in the world using a URL that points to the file and includes a shared access signature (SAS) token. You can generate SAS tokens; they allow specific access to a private asset for a specific amount of time.

File shares can be used for many common scenarios:

- Many on-premises applications use file shares. This feature makes it easier to migrate those applications that share data to Azure. If you mount the file share to the same drive letter that the on-premises application uses, the part of your application that accesses the file share should work with minimal, if any, changes.

- Configuration files can be stored on a file share and accessed from multiple VMs. Tools and utilities used by multiple developers in a group can be stored on a file share, ensuring that everybody can find them, and that they use the same version.

- Resource logs, metrics, and crash dumps are just three examples of data that can be written to a file share and processed or analyzed later.

For more information about Azure Files, see [Introduction to Azure Files](../files/storage-files-introduction.md).

Some SMB features aren't applicable to the cloud. For more information, see [Features not supported by the Azure File service](/rest/api/storageservices/features-not-supported-by-the-azure-file-service).

## Azure Elastic SAN (preview)

Azure Elastic storage area network (SAN) is Microsoft's answer to the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Elastic SAN (preview) is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.

Elastic SAN is designed for large scale IO-intensive workloads and top tier databases such as SQL, MariaDB, and support hosting the workloads on virtual machines, or containers such as Azure Kubernetes Service. Elastic SAN volumes are compatible with a wide variety of compute resources through the [iSCSI](https://en.wikipedia.org/wiki/ISCSI) protocol. Some other benefits of Elastic SAN include a simplified deployment and management interface. Since you can manage storage for multiple compute resources from a single interface, and cost optimization.

For more information about Azure Elastic SAN, see [What is Azure Elastic SAN? (preview)](../elastic-san/elastic-san-introduction.md).

## Queue Storage

The Azure Queue service is used to store and retrieve messages. Queue messages can be up to 64 KB in size, and a queue can contain millions of messages. Queues are generally used to store lists of messages to be processed asynchronously.

For example, say you want your customers to be able to upload pictures, and you want to create thumbnails for each picture. You could have your customer wait for you to create the thumbnails while uploading the pictures. An alternative would be to use a queue. When the customer finishes their upload, write a message to the queue. Then have an Azure Function retrieve the message from the queue and create the thumbnails. Each of the parts of this processing can be scaled separately, giving you more control when tuning it for your usage.

For more information about Azure Queues, see [Introduction to Queues](../queues/storage-queues-introduction.md).

## Table Storage

Azure Table Storage is now part of Azure Cosmos DB. To see Azure Table Storage documentation, see the [Azure Table Storage overview](../tables/table-storage-overview.md). In addition to the existing Azure Table Storage service, there's a new Azure Cosmos DB for Table offering that provides throughput-optimized tables, global distribution, and automatic secondary indexes. To learn more and try out the new premium experience, see [Azure Cosmos DB for Table](../../cosmos-db/table-introduction.md).

For more information about Table Storage, see [Overview of Azure Table Storage](../tables/table-storage-overview.md).

## Disk Storage

An Azure managed disk is a virtual hard disk (VHD). You can think of it like a physical disk in an on-premises server but, virtualized. Azure-managed disks are stored as page blobs, which are a random IO storage object in Azure. We call a managed disk 'managed' because it's an abstraction over page blobs, blob containers, and Azure storage accounts. With managed disks, all you have to do is provision the disk, and Azure takes care of the rest.

For more information about managed disks, see [Introduction to Azure managed disks](../../virtual-machines/managed-disks-overview.md).

## Azure NetApp Files

[Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) is an enterprise-class, high-performance, metered file storage service. Azure NetApp Files supports any workload type and is highly available by default. You can select service and performance levels, create NetApp accounts, capacity pools, volumes, and manage data protection.

For more information about Azure NetApp Files, see [Introduction to Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).

For a comparison of Azure Files and Azure NetApp Files, refer to [Azure Files and Azure NetApp Files comparison](../files/storage-files-netapp-comparison.md).

## Types of storage accounts

Azure Storage offers several types of storage accounts. Each type supports different features and has its own pricing model. For more information about storage account types, see [Azure storage account overview](storage-account-overview.md).

## Secure access to storage accounts

Every request to Azure Storage must be authorized. Azure Storage supports the following authorization methods:

- **Azure Active Directory (Azure AD) integration for blob, queue, and table data.** Azure Storage supports authentication and authorization with Azure AD for the Blob and Queue services via Azure role-based access control (Azure RBAC). Authorization with Azure AD is also supported for the Table service in preview. Authorizing requests with Azure AD is recommended for superior security and ease of use. For more information, see [Authorize access to data in Azure Storage](authorize-data-access.md).
- **Azure AD authorization over SMB for Azure Files.** Azure Files supports identity-based authorization over SMB (Server Message Block) through either Azure Active Directory Domain Services (Azure AD DS) or on-premises Active Directory Domain Services (preview). Your domain-joined Windows VMs can access Azure file shares using Azure AD credentials. For more information, see [Overview of Azure Files identity-based authentication support for SMB access](../files/storage-files-active-directory-overview.md) and [Planning for an Azure Files deployment](../files/storage-files-planning.md#identity).
- **Authorization with Shared Key.** The Azure Storage Blob, Files, Queue, and Table services support authorization with Shared Key. A client using Shared Key authorization passes a header with every request that is signed using the storage account access key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key).
- **Authorization using shared access signatures (SAS).** A shared access signature (SAS) is a string containing a security token that can be appended to the URI for a storage resource. The security token encapsulates constraints such as permissions and the interval of access. For more information, see [Using Shared Access Signatures (SAS)](storage-sas-overview.md).
- **Active Directory Domain Services with Azure NetApp Files.** Azure NetApp Files features such as SMB volumes, dual-protocol volumes, and NFSv4.1 Kerberos volumes are designed to be used with AD DS. For more information, see [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](../../azure-netapp-files/understand-guidelines-active-directory-domain-service-site.md) or learn how to [Configure ADDS LDAP over TLS for Azure NetApp Files](../../azure-netapp-files/configure-ldap-over-tls.md).

## Encryption

There are two basic kinds of encryption available for Azure Storage. For more information about security and encryption, see the [Azure Storage security guide](../blobs/security-recommendations.md).

### Encryption at rest

Azure Storage encryption protects and safeguards your data to meet your organizational security and compliance commitments. Azure Storage automatically encrypts all data prior to persisting to the storage account and decrypts it prior to retrieval. The encryption, decryption, and key management processes are transparent to users. Customers can also choose to manage their own keys using Azure Key Vault. For more information, see [Azure Storage encryption for data at rest](storage-service-encryption.md).

All Azure NetApp Files volumes are encrypted using the FIPS 140-2 standard. See [Security FAQs for Azure NetApp Files](../../azure-netapp-files/faq-security.md#can-the-storage-be-encrypted-at-rest).

### Client-side encryption

The Azure Storage client libraries provide methods for encrypting data from the client library before sending it across the wire and decrypting the response. Data encrypted via client-side encryption is also encrypted at rest by Azure Storage. For more information about client-side encryption, see [Client-side encryption with .NET for Azure Storage](storage-client-side-encryption.md).

Azure NetApp Files data traffic is inherently secure by design, as it doesn't provide a public endpoint and data traffic stays within customer-owned VNet. Data-in-flight isn't encrypted by default. However, data traffic from an Azure VM (running an NFS or SMB client) to Azure NetApp Files is as secure as any other Azure-VM-to-VM traffic. NFSv4.1 and SMB3 data-in-flight encryption can optionally be enabled. See [Security FAQs for Azure NetApp Files](../../azure-netapp-files/faq-security.md#can-the-network-traffic-between-the-azure-vm-and-the-storage-be-encrypted).

## Redundancy

To ensure that your data is durable, Azure Storage stores multiple copies of your data. When you set up your storage account, you select a redundancy option. For more information, see [Azure Storage redundancy](./storage-redundancy.md?toc=/azure/storage/blobs/toc.json).

Azure NetApp Files provides locally redundant storage with [99.99% availability](https://azure.microsoft.com/support/legal/sla/netapp/v1_1/).

## Transfer data to and from Azure Storage

You have several options for moving data into or out of Azure Storage. Which option you choose depends on the size of your dataset and your network bandwidth. For more information, see [Choose an Azure solution for data transfer](storage-choose-data-transfer-solution.md).

Azure NetApp Files provides NFS and SMB volumes. You can use any file-based copy tool to migrate data to the service. For more information, see [Data migration and protection FAQs for Azure NetApp Files](../../azure-netapp-files/faq-data-migration-protection.md).

## Pricing

When making decisions about how your data is stored and accessed, you should also consider the costs involved. For more information, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

Azure NetApp Files cloud file storage service is charged per hour based on the provisioned [capacity pool](../../azure-netapp-files/azure-netapp-files-understand-storage-hierarchy.md#capacity_pools) capacity. For more information, see [Azure NetApp Files storage pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Storage APIs, libraries, and tools

You can access resources in a storage account by any language that can make HTTP/HTTPS requests. Additionally, Azure Storage offer programming libraries for several popular languages. These libraries simplify many aspects of working with Azure Storage by handling details such as synchronous and asynchronous invocation, batching of operations, exception management, automatic retries, operational behavior, and so forth. Libraries are currently available for the following languages and platforms, with others in the pipeline:

### Azure Storage data API and library references

- [Azure Storage REST API](/rest/api/storageservices/)
- [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage)
- [Azure Storage client library for Java/Android](/java/api/overview/azure/storage)
- [Azure Storage client library for Node.js](../blobs/reference.md#javascript-client-libraries)
- [Azure Storage client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-blob)
- [Azure Storage client library for PHP](https://github.com/Azure/azure-storage-php)
- [Azure Storage client library for Ruby](https://github.com/Azure/azure-storage-ruby)
- [Azure Storage client library for C++](https://github.com/Azure/azure-storage-cpp)

### Azure Storage management API and library references

- [Storage Resource Provider REST API](/rest/api/storagerp/)
- [Storage Resource Provider Client Library for .NET](/dotnet/api/overview/azure/resourcemanager.storage-readme)
- [Storage Service Management REST API (Classic)](/previous-versions/azure/reference/ee460790(v=azure.100))
- [Azure NetApp Files REST API](../../azure-netapp-files/azure-netapp-files-develop-with-rest-api.md)

### Azure Storage data movement API

- [Storage Data Movement Client Library for .NET](/dotnet/api/microsoft.azure.storage.datamovement)

### Tools and utilities

- [Azure PowerShell Cmdlets for Storage](/powershell/module/az.storage)
- [Azure CLI Cmdlets for Storage](/cli/azure/storage)
- [AzCopy Command-Line Utility](https://aka.ms/downloadazcopy)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
- [Azure Resource Manager templates for Azure Storage](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Storage)

## Next steps

To get up and running with Azure Storage, see [Create a storage account](storage-account-create.md).
