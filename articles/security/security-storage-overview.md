<properties
   pageTitle="Azure Storage Security Overview | Microsoft Azure"
   description=" Azure Storage is the cloud storage solution for modern applications that rely on durability, availability, and scalability to meet the needs of their customers. This article provides an overview of the core Azure security features that can be used with Azure Storage. "
   services="security"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="terrylan"/>

# Azure Storage Security Overview

Azure Storage is the cloud storage solution for modern applications that rely on durability, availability, and scalability to meet the needs of their customers. Azure Storage provides a comprehensive set of security capabilities:

- The storage account can be secured using Role-Based Access Control and Azure Active Directory.
- Data can be secured in transit between an application and Azure by using Client-Side Encryption, HTTPS, or SMB 3.0.
- Data can be set to be automatically encrypted when written to Azure Storage using Storage Service Encryption.
- OS and Data disks used by virtual machines can be set to be encrypted using Azure Disk Encryption.
- Delegated access to the data objects in Azure Storage can be granted using Shared Access Signatures.

This article will provide an overview of each of these core security features that can be used with Azure Storage. Links are provided to articles that will give details of each feature so you can learn more.  

For a more detailed look at security in Azure Storage see the [Azure Storage security guide](../storage/storage-security-guide.md).

Here are the core features to be covered in this article:

- Role-Based Access Control
- Managing storage account keys
- Delegated access to storage objects
- Encryption in transit
- Encryption at rest/Storage Service Encryption
- Storage analytics

## Role-Based Access Control (RBAC)

You can secure your storage account with Role-Based Access Control (RBAC). Each Azure subscription is associated with one Azure Active Directory (AD) tenant. Users, groups, and applications from that directory can manage resources in the Azure subscription. These access rights are granted by assigning the appropriate RBAC role to users, groups, and applications at a certain scope.

You can use RBAC to grant access to the management operations of your Azure Storage account. Using RBAC, you control who can:

- Manage that storage account.
- Read the storage account keys and use those keys to access the blobs, queues, tables, and files.
- Regenerate storage keys.

Learn more:

- [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-configure.md)

## Managing storage account keys

When you create a storage account, Azure generates two 512-bit storage access keys, which are used for authentication when the storage account is accessed. By providing two storage access keys, Azure enables you to regenerate the keys with no interruption to your storage service or access to that service. You can maintain connections to the storage account by using one access key while you regenerate the other access key.

Storage account keys, along with the storage account name, can be used to access the data objects stored in the storage account, e.g. blobs, entities within a table, queue messages, and files on an Azure file share. Using RBAC, you control access to the storage account keys which controls access to the data objects themselves.

Learn more:

- [About Azure Storage Accounts](../storage/storage-create-storage-account.md)

## Delegated access to storage objects

A Shared Access Signature (SAS) is a string containing a security token that can be attached to a URI that allows you to delegate access to storage objects and specify restraints such as the permissions and the date/time range of access.

Giving out your storage account key is like sharing the keys of your storage kingdom. It grants complete access. With a SAS, you can give a client just the permissions required for a limited amount of time.  You can:

- Grant access to blobs, containers, queue messages, files, and tables. With tables, you can actually grant permission to access a range of entities in the table by specifying the partition and row key ranges to which you want the user to have access.
- Specify that requests made using SAS are restricted to a certain IP address or IP address range external to Azure.
- Require that requests are made using a specific protocol (HTTPS or HTTP/HTTPS). This means if you only want to allow HTTPS traffic, you can set the required protocol to HTTPS only, and HTTP traffic will be blocked.

Learn more:

- [Understanding the SAS model](../storage/storage-dotnet-shared-access-signature-part-1.md)

## Encryption in transit
Encryption in transit is a mechanism of protecting data when it is transmitted across networks. With Azure Storage you can secure data using:

- Transport-level encryption, such as HTTPS when you transfer data into or out of Azure Storage.
- Wire encryption, such as SMB 3.0 encryption for Azure File Shares.
- Client-side encryption, to encrypt the data before it is transferred into storage and to decrypt the data after it is transferred out of storage.

### Transport-level encryption

To ensure the security of your Azure Storage data you can encrypt the data between the client and Azure Storage. You can [enable HTTPS](../app-service-web/web-sites-configure-ssl-certificate.md) when calling the REST APIs or accessing objects in storage. Also, [Shared Access Signatures](../storage/storage-dotnet-shared-access-signature-part-1.md) (SAS), which can be used to delegate access to Azure Storage objects. These include an optional parameter, “protocol”, which you can use to specify that only the HTTPS protocol can be used when using SAS. This ensures that anybody sending out links with SAS tokens will use the proper protocol.

### Wire encryption for file share access

SMB 3.0 supports encryption, and can be used with Windows Server 2012 R2, Windows 8, Windows 8.1, and Windows 10, allowing cross-region access and even access on the desktop.

Azure File Shares can be used with Linux virtual machines. The Linux SMB client does not yet support encryption, so access is only allowed within an Azure region. Encryption support for Linux is on the roadmap. When they add encryption you will have the same network level encryption for access to Azure File Shares on Linux as you do for Windows.

Learn more:

- [How to use Azure File Storage with Linux](../storage/storage-how-to-use-files-linux.md)
- [Get started with Azure File storage on Windows](../storage/storage-dotnet-how-to-use-files.md)
- [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)

### Client-side encryption

Client-side encryption helps you ensure that your data is secure while being transferred between a client application and Azure Storage. The data is encrypted before being transferred into Azure Storage. When retrieving the data from Azure Storage, the data is decrypted after it is received on the client side. Even though the data is encrypted going across the wire, you can also use HTTPS to help mitigate network errors affecting the integrity of the data.

Learn more:

- [Client-Side Encryption for Microsoft Azure Storage](https://blogs.msdn.microsoft.com/windowsazurestorage/2015/04/28/client-side-encryption-for-microsoft-azure-storage-preview/)
- [Cloud security controls series: Encrypting Data in Transit](http://blogs.microsoft.com/cybertrust/2015/08/10/cloud-security-controls-series-encrypting-data-in-transit/)

## Encryption at rest

There are three Azure features that provide encryption of data that is “at rest”:

- Storage Service Encryption
- Client-side Encryption
- Azure Disk Encryption

### Storage Service Encryption

Storage Service Encryption allows you to request that the storage service automatically encrypt data when writing it to Azure Storage. When you read the data from Azure Storage, it will be decrypted by the storage service before being returned. This enables you to secure your data without having to modify code or add code to any applications.

[Azure Storage Service Encryption](https://azure.microsoft.com/services/storage/) is available for [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/). For details on other Azure storage types, see [File](https://azure.microsoft.com/services/storage/files/), [Disk (Premium Storage)](https://azure.microsoft.com/services/storage/premium-storage/), [Table](https://azure.microsoft.com/services/storage/tables/), and [Queue](https://azure.microsoft.com/services/storage/queues/).

Learn More:

- [Azure Storage Service Encryption for Data at Rest](../storage/storage-service-encryption.md)

### Client-side Encryption

We mentioned Client-side Encryption when discussing encryption in transit. This feature allows you to programmatically encrypt your data in a client application before sending it across the wire to be written to Azure Storage, and to programmatically decrypt your data after retrieving it from Azure Storage.

This does provide encryption in transit, but it also provides the feature of encryption at rest. Note that although the data is encrypted in transit, you can use HTTPS to take advantage of the built-in data integrity checks which help mitigate network errors affecting the integrity of the data.

Learn More:

- [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](../storage/storage-client-side-encryption.md)

### Azure Disk Encryption

Azure Disk Encryption for virtual machines (VMs) helps you address organizational security and compliance requirements by encrypting your VM disks (including boot and data disks) with keys and policies you control in [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

Disk Encryption for VMs works for Linux and Windows operating systems. It also uses Key Vault to help you safeguard, manage, and audit use of your disk encryption keys. All the data in your VM disks is encrypted at rest by using industry-standard encryption technology in your Azure Storage accounts. The Disk Encryption solution for Windows is based on [Microsoft BitLocker Drive Encryption](https://technet.microsoft.com/library/cc732774.aspx), and the Linux solution is based on [dm-crypt](https://en.wikipedia.org/wiki/Dm-crypt).

Learn more:

- [Azure Disk Encryption for Windows and Linux IaaS Virtual Machines](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0)

## Storage analytics

For each storage account, you can enable Azure Storage Analytics to perform logging and store metrics data. This is a great tool to use when you want to check performance metrics or troubleshoot the performance of a storage account.

Another piece of data you can see in the storage analytics logs is the authentication method used by someone when they access storage. For example, with Blob Storage, you can see if they used a Shared Access Signature or the storage account keys, or if the blob accessed was public.

Learn more:

- [Storage Analytics](../storage/storage-analytics.md)
- [Storage Analytics Log Format](https://msdn.microsoft.com/library/azure/hh343259.aspx)
- [Monitor a Storage Account in the Azure portal](../storage/storage-monitor-storage-account.md)
- [End-to-End Troubleshooting using Azure Storage Metrics and Logging, AzCopy, and Message Analyzer](../storage/storage-e2e-troubleshooting.md)
