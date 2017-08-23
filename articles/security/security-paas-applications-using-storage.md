---
title: Securing PaaS applications using Azure Storage | Microsoft Docs
description: " Learn about Azure Storage security best practices for securing your PaaS web and mobile applications. "
services: security
documentationcenter: na
author: TomShinder
manager: MBaldwin
editor: ''

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/25/2017
ms.author: TomShinder

---
# Securing PaaS web and mobile applications using Azure Storage
In this article, we discuss a collection of Azure Storage security best practices for securing your PaaS web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

The [Azure Storage security guide](../storage/common/storage-security-guide.md) is a great source for detailed information about Azure Storage and security.  This article addresses at a high level some of the concepts found in the security guide and links to the security guide, as well as other sources, for more information.

## Azure Storage
Azure makes it possible to deploy and use storage in ways not easily achievable on-premises. With Azure storage, you can reach high levels of scalability and availability with relatively little effort. Not only is Azure storage the foundation for Windows and Linux Azure Virtual Machines, it can also support large distributed applications.

Azure storage provides the following four services: Blob storage, Table storage, Queue storage, and File storage. To learn more, see [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md).

## Best practices
This article addresses the following best practices:

- Access protection:
   - Shared Access Signatures (SAS)
   - Managed disk
   - Role-Based Access Control (RBAC)

- Storage encryption:
   - Client side encryption for high value data
   - Azure Disk Encryption for virtual machines (VMs)
   - Storage Service Encryption

## Access protection
### Use Shared Access Signature instead of a storage account key

In an IaaS solution, usually running Windows Server or Linux virtual machines, files are protected from disclosure and tampering threats using access control mechanisms. On Windows you’d use [access control lists (ACL)](../virtual-network/virtual-networks-acl.md) and on Linux you’d probably use [chmod](https://en.wikipedia.org/wiki/Chmod). Essentially, this is exactly what you would do if you were protecting files on a server in your own data center today.

PaaS is different. One of the most common ways to store files in Microsoft Azure is to use [Azure Blob storage](../storage/storage-dotnet-how-to-use-blobs.md). A difference between Blob storage and other file storage is the file I/O, and the protection methods that come with file I/O.

Access control is critical. To help you control access to Azure storage, the system will generate two 512-bit storage account keys (SAKs) when you [create a storage account](../storage/common/storage-create-storage-account.md). The level of key redundancy makes it possible for you to avoid service interrupt during routine key rotation.

Storage access keys are high priority secrets and should only be accessible to those responsible for storage access control. If the wrong people get access to these keys, they will have complete control of storage and could replace, delete or add files to storage. This includes malware and other types of content that can potentially compromise your organization or your customers.

You still need a way to provide access to objects in storage. To provide more granular access you can take advantage of [Shared Access Signature](../storage/common/storage-dotnet-shared-access-signature-part-1.md) (SAS). The SAS makes it possible for you to share specific objects in storage for a pre-defined time-interval and with specific permissions. A Shared Access Signature allows you to define:

- The interval over which the SAS is valid, including the start time and the expiry time.
- The permissions granted by the SAS. For example, a SAS on a blob might grant a user read and write permissions to that blob, but not delete permissions.
- An optional IP address or range of IP addresses from which Azure Storage accepts the SAS. For example, you might specify a range of IP addresses belonging to your organization. This provides another measure of security for your SAS.
- The protocol over which Azure Storage accepts the SAS. You can use this optional parameter to restrict access to clients using HTTPS.

SAS allows you to share content the way you want to share it without giving away your Storage Account Keys. Always using SAS in your application is a secure way to share your storage resources without compromising your storage account keys.

To learn more, see [Using Shared Access Signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md) (SAS). To learn more about potential risks and recommendations to mitigate those risks, see [Best practices when using SAS](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

### Use managed disks for VMs

When you choose [Azure Managed Disks](../storage/storage-managed-disks-overview.md), Azure manages the storage accounts that you use for your VM disks. All you need to do is choose the type of disk (Premium or Standard) and the disk size; Azure storage will do the rest. You don’t have to worry about scalability limits that might have otherwise required to you to multiple storage accounts.

To learn more, see [Frequently Asked Questions about managed and unmanaged premium disks](../storage/storage-faq-for-disks.md).

### Use Role-Based Access Control

Earlier we discussed using Shared Access Signature (SAS) to grant limited access to objects in your storage account to other clients, without exposing your account storage account key. Sometimes the risks associated with a particular operation against your storage account outweigh the benefits of SAS. Sometimes it's simpler to manage access in other ways.

Another way to manage access is to use [Azure Role-Based Access Control](../active-directory/role-based-access-control-what-is.md) (RBAC). With RBAC, you focus on giving employees the exact permissions they need, based on the need to know and least privilege security principles. Too many permissions can expose an account to attackers. Too few permissions means that employees can't get their work done efficiently. RBAC helps address this problem by offering fine-grained access management for Azure. This is imperative for organizations that want to enforce security policies for data access.

You can leverage built-in RBAC roles in Azure to assign privileges to users. Consider using Storage Account Contributor for cloud operators that need to manage storage accounts and Classic Storage Account Contributor role to manage classic storage accounts. For cloud operators that need to manage VMs but not the virtual network or storage account to which they are connected, consider adding them to the Virtual Machine Contributor role.

Organizations that do not enforce data access control by leveraging capabilities such as RBAC may be giving more privileges than necessary for their users. This can lead to data compromise by allowing some users access to data they shouldn’t have in the first place.

To learn more about RBAC see:

- [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md)
- [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md)
- [Azure Storage Security Guide](../storage/common/storage-security-guide.md) for detail on how to secure your storage account with RBAC

## Storage encryption
### Use client-side encryption for high value data

Client-side encryption enables you to programmatically encrypt data in transit before uploading to Azure Storage and programmatically decrypt data when retrieving it from storage.  This provides encryption of data in transit but it also provides encryption of data at rest.  Client-side encryption is the most secure method of encrypting your data but it does require you to make programmatic changes to your application and put key management processes in place.

Client-side encryption also enables you to have sole control over your encryption keys.  You can generate and manage your own encryption keys.  Client-side encryption uses an envelope technique where the Azure storage client library generates a content encryption key (CEK) that is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key and can be managed locally or stored in [Azure Key Vault](../key-vault/key-vault-whatis.md).

Client-side encryption is built into the Java and the .NET storage client libraries.  See [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](../storage/storage-client-side-encryption.md) for information on encrypting data within client applications and generating and managing your own encryption keys.

### Azure Disk Encryption for VMs
Azure Disk Encryption is a capability that helps you encrypt your Windows and Linux IaaS virtual machine disks. Azure Disk Encryption leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide volume encryption for the OS and the data disks. The solution is integrated with Azure Key Vault to help you control and manage the disk-encryption keys and secrets in your key vault subscription. The solution also ensures that all data on the virtual machine disks are encrypted at rest in your Azure storage.

See [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption.md).

### Storage Service Encryption
When [Storage Service Encryption](../storage/storage-service-encryption.md) for File storage is enabled, the data is encrypted automatically using AES-256 encryption. Microsoft handles all the encryption, decryption, and key management. This feature is available for LRS and GRS redundancy types.

## Next steps
This article introduced you to a collection of Azure Storage security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](security-paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure App Services](security-paas-applications-using-app-services.md)
- [Securing PaaS databases in Azure](security-paas-applications-using-sql.md)
