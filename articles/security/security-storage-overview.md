<properties
   pageTitle="Azure Storage Security Overview | Microsoft Azure"
   description=" Azure Storage is the cloud storage solution for modern applications that rely on durability, availability, and scalability to meet the needs of their customers. This article provides an overview of the core Azure security features that can be used with Azure Storage. "
   services="security"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/14/2016"
   ms.author="terrylan"/>

# Azure storage security overview

Azure Storage is the cloud storage solution for modern applications that rely on durability, availability, and scalability to meet the needs of their customers. Azure Storage provides a comprehensive set of security capabilities:

- The storage account can be secured using Role-Based Access Control and Azure Active Directory.
- Data can be secured in transit between an application and Azure by using Client-Side Encryption, HTTPS, or SMB 3.0.
- Data can be set to be automatically encrypted when written to Azure Storage using Storage Service Encryption.
- OS and Data disks used by virtual machines can be set to be encrypted using Azure Disk Encryption.
- Delegated access to the data objects in Azure Storage can be granted using Shared Access Signatures.
- The authentication method used by someone when they access storage can be tracked using Storage analytics.

For a more detailed look at security in Azure Storage see the [Azure Storage security guide](../storage/storage-security-guide.md). This guide provides a deep dive into the security features of Azure Storage such as storage account keys, data encryption in transit and at rest, and storage analytics.

This article will provide an overview of Azure security features that can be used with Azure Storage. Links are provided to articles that will give details of each feature so you can learn more.

Here are the core features to be covered in this article:

- Role-Based Access Control
- Delegated access to storage objects
- Encryption in transit
- Encryption at rest/Storage Service Encryption
- Azure Disk Encryption
- Azure Key Vault

## Role-Based Access Control (RBAC)

You can secure your storage account with Role-Based Access Control (RBAC). Restricting access based on the [need to know](https://en.wikipedia.org/wiki/Need_to_know) and [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security principles is imperative for organizations that want to enforce security policies for data access. These access rights are granted by assigning the appropriate RBAC role to groups and applications at a certain scope. You can leverage [built-in RBAC roles](../active-directory/role-based-access-built-in-roles.md), such as Storage Account Contributor, to assign privileges to users.

Learn more:

- [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-configure.md)

## Delegated access to storage objects

A shared access signature (SAS) provides delegated access to resources in your storage account. This means that you can grant a client limited permissions to objects in your storage account for a specified period of time and with a specified set of permissions, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all of the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method.

Learn more:

- [Understanding the SAS model](../storage/storage-dotnet-shared-access-signature-part-1.md)
- [Create and use a SAS with Blob storage](../storage/storage-dotnet-shared-access-signature-part-2.md)

## Encryption in transit
Encryption in transit is a mechanism of protecting data when it is transmitted across networks. With Azure Storage you can secure data using:

- [Transport-level encryption](../storage/storage-security-guide.md#encryption-in-transit), such as HTTPS when you transfer data into or out of Azure Storage.
- [Wire encryption](../storage/storage-security-guide.md#using-encryption-during-transit-with-azure-file-shares), such as SMB 3.0 encryption for Azure File Shares.
- [Client-side encryption](../storage/storage-security-guide.md#using-client-side-encryption-to-secure-data-that-you-send-to-storage), to encrypt the data before it is transferred into storage and to decrypt the data after it is transferred out of storage.

Learn more about client-side encryption:

- [Client-Side Encryption for Microsoft Azure Storage](https://blogs.msdn.microsoft.com/windowsazurestorage/2015/04/28/client-side-encryption-for-microsoft-azure-storage-preview/)
- [Cloud security controls series: Encrypting Data in Transit](http://blogs.microsoft.com/cybertrust/2015/08/10/cloud-security-controls-series-encrypting-data-in-transit/)

## Encryption at rest

For many organizations, [data encryption at rest](https://blogs.microsoft.com/cybertrust/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step towards data privacy, compliance and data sovereignty. There are three Azure features that provide encryption of data that is “at rest”:

- [Storage Service Encryption](../storage/storage-security-guide.md#encryption-at-rest) allows you to request that the storage service automatically encrypt data when writing it to Azure Storage.
- [Client-side Encryption](../storage/storage-security-guide.md#client-side-encryption) also provides the feature of encryption at rest.
- [Azure Disk Encryption](../storage/storage-security-guide.md#using-azure-disk-encryption-to-encrypt-disks-used-by-your-virtual-machines) allows you to encrypt the OS disks and data disks used by an IaaS virtual machine.

Learn more about Storage Service Encryption:

- [Azure Storage Service Encryption](https://azure.microsoft.com/services/storage/) is available for [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/). For details on other Azure storage types, see [File](https://azure.microsoft.com/services/storage/files/), [Disk (Premium Storage)](https://azure.microsoft.com/services/storage/premium-storage/), [Table](https://azure.microsoft.com/services/storage/tables/), and [Queue](https://azure.microsoft.com/services/storage/queues/).
- [Azure Storage Service Encryption for Data at Rest](../storage/storage-service-encryption.md)

## Azure Disk Encryption

Azure Disk Encryption for virtual machines (VMs) helps you address organizational security and compliance requirements by encrypting your VM disks (including boot and data disks) with keys and policies you control in [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

Disk Encryption for VMs works for Linux and Windows operating systems. It also uses Key Vault to help you safeguard, manage, and audit use of your disk encryption keys. All the data in your VM disks is encrypted at rest by using industry-standard encryption technology in your Azure Storage accounts. The Disk Encryption solution for Windows is based on [Microsoft BitLocker Drive Encryption](https://technet.microsoft.com/library/cc732774.aspx), and the Linux solution is based on [dm-crypt](https://en.wikipedia.org/wiki/Dm-crypt).

Learn more:

- [Azure Disk Encryption for Windows and Linux IaaS Virtual Machines](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0)

## Azure Key Vault

Azure Disk Encryption uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) to help you control and manage disk encryption keys and secrets in your key vault subscription, while ensuring that all data in the virtual machine disks are encrypted at rest in your Azure Storage. You should use Key Vault to audit keys and policy usage.

Learn more:

- [What is Azure Key Vault?](../key-vault/key-vault-whatis.md)
- [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md)
