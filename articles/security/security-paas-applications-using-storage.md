---
title: Securing PaaS applications using Azure Storage | Microsoft Docs
description: " Learn about Azure Storage security best practices for securing your PaaS web and mobile applications. "
services: security
documentationcenter: na
author: TomSh
manager: MBaldwin
editor: ''

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/27/2017
ms.author: terrylan

---
# Securing PaaS web and mobile applications using Azure Storage
In this article, we discuss a collection of Azure Storage security best practices for securing your PaaS web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

The [Azure Storage security guide](../storage/storage-security-guide.md) is a great source for detailed information about Azure Storage and security.  This article will address at a high level some of the concepts found in the security guide and link to the security guide, as well as other sources, for more information.

## Azure Storage
Cloud computing enables new scenarios for applications requiring scalable, durable, and highly available storage for their data – which is exactly why Microsoft developed Azure Storage. In addition to making it possible for you to deploy large-scale applications to support new scenarios, Azure Storage also provides the storage foundation for Azure Virtual Machines (Windows and Linux).

Azure storage provides the following four services: Blob storage, Table storage, Queue storage, and File storage. See [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md) to learn more.

## Best practices
This article will address the following best practices:

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

PaaS is different. One of the most common ways to store files in Microsoft Azure is to use [Azure Blob storage](../storage/storage-dotnet-how-to-use-blobs.md). The big difference between Blob storage and other file storage is the file I/O, and the protection methods that come with file I/O.

When you [create a storage account](../storage/storage-create-storage-account.md#manage-your-storage-account), Azure generates two 512-bit storage account keys, which are used for authentication when the storage account is accessed. By providing two storage account keys, Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

You should avoid sharing your storage account keys with anyone else. Why? Giving out your storage account key grants complete access. Someone could use your keys to replace your files with virus-infected versions, or steal your data.

To permit access to storage resources without giving out your account keys, you can use a [Shared Access Signature](../storage/storage-dotnet-shared-access-signature-part-1.md) (SAS). An SAS provides access to a resource in your account for an interval that you define and with the permissions that you specify. An SAS gives you granular control over what type of access you grant to clients who have the SAS, including:

- The interval over which the SAS is valid, including the start time and the expiry time.
- The permissions granted by the SAS. For example, a SAS on a blob might grant a user read and write permissions to that blob, but not delete permissions.
- An optional IP address or range of IP addresses from which Azure Storage will accept the SAS. For example, you might specify a range of IP addresses belonging to your organization. This provides another measure of security for your SAS.
- The protocol over which Azure Storage will accept the SAS. You can use this optional parameter to restrict access to clients using HTTPS.

SAS lets you grant limited access to objects in your storage account to other clients, without exposing your storage account key. Always using SAS in your application is a secure way to share your storage resources without compromising your storage account keys.

See [Using Shared Access Signatures](../storage/storage-dotnet-shared-access-signature-part-1.md) (SAS) to learn more. See [Best practices when using SAS](../storage/storage-dotnet-shared-access-signature-part-1.md#best-practices-when-using-sas) to learn more about potential risks and recommendations to mitigate those risks.

### Use managed disks for VMs

When you choose [Azure Managed Disks](../storage/storage-managed-disks-overview.md), Azure manages the storage accounts that you use for your VM disks. You specify the disk type (Premium or Standard) and the size of the disk that you need. Azure creates and manages the disk for you. You don't have to worry about placing the disks in multiple storage accounts to ensure that you stay within scalability limits for your storage accounts. Azure handles that for you.

See [Frequently Asked Questions about managed and unmanaged premium disks](../storage/storage-faq-for-disks.md) to learn more.

### Use Role-Based Access Control

Earlier we discussed using Shared Access Signature (SAS) to grant limited access to objects in your storage account to other clients, without exposing your account storage account key. Sometimes the risks associated with a particular operation against your storage account outweigh the benefits of SAS. Sometimes it's simpler to manage access in other ways.

Another way to manage access is to use [Azure Role-Based Access Control](../active-directory/role-based-access-control-what-is.md) (RBAC). With RBAC, you focus on giving employees the exact permissions they need, based on the need to know and least privilege security principles. Too many permissions can expose an account to attackers. Too few permissions means that employees can't get their work done efficiently. RBAC helps address this problem by offering fine-grained access management for Azure. This is imperative for organizations that want to enforce security policies for data access.

You can leverage built-in RBAC roles in Azure to assign privileges to users. Consider using Storage Account Contributor for cloud operators that need to manage storage accounts and Classic Storage Account Contributor role to manage classic storage accounts. For cloud operators that needs to manage VMs and storage account, consider adding them to Virtual Machine Contributor role.

Organizations that do not enforce data access control by leveraging capabilities such as RBAC may be giving more privileges than necessary for their users. This can lead to data compromise by having some users having access to data that they shouldn’t have in the first place.

You can learn more about Azure RBAC by reading the article [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md). See the [Azure Storage Security Guide](../storage/storage-security-guide.md#how-to-secure-your-storage-account-with-role-based-access-control-rbac) for detail on how to secure your storage account with RBAC.

## Storage encryption
### Use client-side encryption for high value data

Client-side encryption enables you to programmatically encrypt data in transit before uploading to Azure Storage and programmatically decrypt data when retrieving it from storage.  This provides encryption of data in transit but it also provides encryption of data at rest.  Client-side encryption is the most secure method of encrypting your data but it does require you to make programmatic changes to your application and put key management processes in place.

Client-side encryption also enables you to have sole control over your encryption keys.  You can generate and manage your own encryption keys.  Client-side encryption uses an envelope technique where the Azure storage client library generates a content encryption key (CEK) that is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key and can be managed locally or stored in [Azure Key Vault](../key-vault/key-vault-whatis.md).

Client-side encryption is built into the Java and the .NET storage client libraries.  See [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](../storage/storage-client-side-encryption.md) for information on encrypting data within client applications and generating and managing your own encryption keys.

### Azure Disk Encryption for VMs
Azure Disk Encryption is a capability that helps you encrypt your Windows and Linux IaaS virtual machine disks. Azure Disk Encryption leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide volume encryption for the OS and the data disks. The solution is integrated with Azure Key Vault to help you control and manage the disk-encryption keys and secrets in your key vault subscription. The solution also ensures that all data on the virtual machine disks are encrypted at rest in your Azure storage.

See [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption.md).

### Storage Service Encryption
When [Storage Service Encryption](../storage/storage-service-encryption.md) for File storage is enabled, the data will be encrypted automatically. Microsoft will handle all the encryption, decryption, and key management in a fully transparent fashion. All data will be encrypted using 256-bit AES encryption, also known as AES-256, one of the strongest block ciphers available. Customers will be able to enable this feature on both the LRS and GRS redundancy types of File storage.

## Next steps
This article introduced you to a collection of Azure Storage security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](security-paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure App Services](security-paas-applications-using-app-services.md)
- [Securing PaaS databases in Azure](security-paas-applications-using-sql.md)
