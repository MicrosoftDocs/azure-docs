---
title: Security features that can be used with Azure Storage | Microsoft Docs
description: This article provides an overview of the core Azure security features that can be used with Azure Storage.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/17/2018
ms.author: terrylan

---
# Azure Storage security overview

Azure Storage is the cloud storage solution for modern applications that rely on durability, availability, and scalability to meet the needs of their customers. Azure Storage provides a comprehensive set of security capabilities. You can:

* Secure the storage account by using Role-Based Access Control (RBAC) and Azure Active Directory.
* Secure data in transit between an application and Azure by using client-side encryption, HTTPS, or SMB 3.0.
* Set data to be automatically encrypted when it's written to Azure Storage by using Storage Service Encryption.
* Set OS and data disks used by virtual machines (VMs) to be encrypted by using Azure Disk Encryption.
* Grant delegated access to the data objects in Azure Storage by using shared access signatures (SASs).
* Use analytics to track the authentication method that someone is using when they access Storage.

For a more detailed look at security in Azure Storage, see the [Azure Storage security guide](../storage/common/storage-security-guide.md). This guide provides a deep dive into the security features of Azure Storage. These features include storage account keys, data encryption in transit and at rest, and storage analytics.

This article provides an overview of Azure security features that you can use with Azure Storage. Links to articles give details of each feature so you can learn more.

## Role-Based Access Control

You can help secure your storage account by using Role-Based Access Control. Restricting access based on the [need to know](https://en.wikipedia.org/wiki/Need_to_know) and [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security principles is imperative for organizations that want to enforce security policies for data access. These access rights are granted by assigning the appropriate RBAC role to groups and applications at a certain scope. You can use [built-in RBAC roles](../role-based-access-control/built-in-roles.md), such as Storage Account Contributor, to assign privileges to users.

Learn more:

* [Azure Active Directory Role-Based Access Control](../role-based-access-control/role-assignments-portal.md)

## Delegated access to storage objects

A shared access signature provides delegated access to resources in your storage account. The SAS means that you can grant a client limited permissions to objects in your storage account for a specified period and with a specified set of permissions. You can grant these limited permissions without having to share your account access keys. 

The SAS is a URI that encompasses in its query parameters all the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to provide the SAS to the appropriate constructor or method.

Learn more:

* [Understanding the SAS model](../storage/common/storage-dotnet-shared-access-signature-part-1.md)
* [Create and use an SAS with Blob storage](../storage/blobs/storage-dotnet-shared-access-signature-part-2.md)

## Encryption in transit

Encryption in transit is a mechanism of protecting data when it's transmitted across networks. With Azure Storage, you can secure data by using:

* [Transport-level encryption](../storage/common/storage-security-guide.md#encryption-in-transit), such as HTTPS, when you transfer data into or out of Azure Storage.
* [Wire encryption](../storage/common/storage-security-guide.md#using-encryption-during-transit-with-azure-file-shares), such as SMB 3.0 encryption, for Azure file shares.
* [Client-side encryption](../storage/common/storage-security-guide.md#using-client-side-encryption-to-secure-data-that-you-send-to-storage), to encrypt the data before it's transferred into Storage and to decrypt the data after it is transferred out of Storage.

Learn more about client-side encryption:

* [Client-Side Encryption for Microsoft Azure Storage](https://blogs.msdn.microsoft.com/windowsazurestorage/2015/04/28/client-side-encryption-for-microsoft-azure-storage-preview/)
* [Cloud security controls series: Encrypting Data in Transit](http://blogs.microsoft.com/cybertrust/2015/08/10/cloud-security-controls-series-encrypting-data-in-transit/)

## Encryption at rest

For many organizations, [data encryption at rest](https://blogs.microsoft.com/cybertrust/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step toward data privacy, compliance, and data sovereignty. Three Azure features provide encryption of data that's at rest:

* [Storage Service Encryption](../storage/common/storage-security-guide.md#encryption-at-rest) enables you to request that the storage service automatically encrypt data when writing it to Azure Storage.
* [Client-side encryption](../storage/common/storage-security-guide.md#client-side-encryption) also provides the feature of encryption at rest.
* [Azure Disk Encryption](../storage/common/storage-security-guide.md#using-azure-disk-encryption-to-encrypt-disks-used-by-your-virtual-machines) enables you to encrypt the OS disks and data disks that an IaaS virtual machine uses.

Learn more about Storage Service Encryption:

* [Azure Storage Service Encryption](https://azure.microsoft.com/services/storage/) is available for [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/). For details on other Azure storage types, see [Azure Files](https://azure.microsoft.com/services/storage/files/), [Disk (Premium Storage)](https://azure.microsoft.com/services/storage/premium-storage/), [Table storage](https://azure.microsoft.com/services/storage/tables/), and [Queue storage](https://azure.microsoft.com/services/storage/queues/).
* [Azure Storage Service Encryption for Data at Rest](../storage/common/storage-service-encryption.md)

## Azure Disk Encryption

Azure Disk Encryption for virtual machines helps you address organizational security and compliance requirements. It encrypts your VM disks (including boot and data disks) by using keys and policies that you control in [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

Disk Encryption for VMs works for Linux and Windows operating systems. It also uses Key Vault to help you safeguard, manage, and audit use of your disk encryption keys. All the data in your VM disks is encrypted at rest by using industry-standard encryption technology in your Azure storage accounts. The Disk Encryption solution for Windows is based on [Microsoft BitLocker Drive Encryption](https://technet.microsoft.com/library/cc732774.aspx), and the Linux solution is based on [dm-crypt](https://en.wikipedia.org/wiki/Dm-crypt).

Learn more

* [Azure Disk Encryption for Windows and Linux IaaS Virtual Machines](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0)

## Azure Storage Firewalls and Virtual networks

Azure storage allows you to enable firewall rules for your storage accounts. Once enabled they will block incoming requests for data, including requests from other Azure services. You can configure exceptions to allow traffic. Firewall rules may be enabled on existing storage accounts or during creation time.

You should use this functionality  to secure your storage accounts to a specific set of allowed networks.

For more information on Azure storage firewalls and virtual networks review the article [Configure Azure Storage Firewalls and Virtual Networks](../storage/common/storage-network-security.md)

## Azure Key Vault

Azure Disk Encryption uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) to help you control and manage disk encryption keys and secrets in your key vault subscription. It also ensures that all data in the virtual machine disks are encrypted at rest in Azure Storage. You should use Key Vault to audit keys and policy usage.

Learn more

* [What is Azure Key Vault?](../key-vault/key-vault-whatis.md)
* [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md)
