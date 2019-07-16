---
title: Securing PaaS applications using Azure Storage | Microsoft Docs
description: "Learn about Azure Storage security best practices for securing your PaaS web and mobile applications."
services: security
documentationcenter: na
author: TomShinder
manager: barbkess
editor: ''

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/28/2018
ms.author: tomsh

---
# Best practices for securing PaaS web and mobile applications using Azure Storage
In this article, we discuss a collection of Azure Storage security best practices for securing your platform-as-a-service (PaaS) web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

Azure makes it possible to deploy and use storage in ways not easily achievable on-premises. With Azure storage, you can reach high levels of scalability and availability with relatively little effort. Not only is Azure Storage the foundation for Windows and Linux Azure Virtual Machines, it can also support large distributed applications.

Azure Storage provides the following four services: Blob storage, Table storage, Queue storage, and File storage. To learn more, see [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md).

The [Azure Storage security guide](../storage/common/storage-security-guide.md) is a great source for detailed information about Azure Storage and security. This best practices article addresses at a high level some of the concepts found in the security guide and links to the security guide, as well as other sources, for more information.

This article addresses the following best practices:

- Shared access signatures (SAS)
- Role-based access control (RBAC)
- Client side encryption for high value data
- Storage Service Encryption


## Use a shared access signature instead of a storage account key
Access control is critical. To help you control access to Azure Storage, Azure generates two 512-bit storage account keys (SAKs) when you create a storage account. The level of key redundancy makes it possible for you to avoid service interruptions during routine key rotation. 

Storage access keys are high priority secrets and should only be accessible to those responsible for storage access control. If the wrong people get access to these keys, they will have complete control of storage and could replace, delete, or add files to storage. This includes malware and other types of content that can potentially compromise your organization or your customers.

You still need a way to provide access to objects in storage. To provide more granular access you can take advantage of shared access signature (SAS). The SAS makes it possible for you to share specific objects in storage for a pre-defined time-interval and with specific permissions. A shared access signature allows you to define:

- The interval over which the SAS is valid, including the start time and the expiry time.
- The permissions granted by the SAS. For example, a SAS on a blob might grant a user read and write permissions to that blob, but not delete permissions.
- An optional IP address or range of IP addresses from which Azure Storage accepts the SAS. For example, you might specify a range of IP addresses belonging to your organization. This provides another measure of security for your SAS.
- The protocol over which Azure Storage accepts the SAS. You can use this optional parameter to restrict access to clients using HTTPS.

SAS allows you to share content the way you want to share it without giving away your storage account keys. Always using SAS in your application is a secure way to share your storage resources without compromising your storage account keys.

To learn more about shared access signature, see [Using shared access signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md). 

## Use role-based access control
Another way to manage access is to use [role-based access control](../role-based-access-control/overview.md) (RBAC). With RBAC, you focus on giving employees the exact permissions they need, based on the need to know and least privilege security principles. Too many permissions can expose an account to attackers. Too few permissions means that employees can't get their work done efficiently. RBAC helps address this problem by offering fine-grained access management for Azure. This is imperative for organizations that want to enforce security policies for data access.

You can use built-in RBAC roles in Azure to assign privileges to users. For example, use Storage Account Contributor for cloud operators that need to manage storage accounts and Classic Storage Account Contributor role to manage classic storage accounts. For cloud operators that need to manage VMs but not the virtual network or storage account to which they are connected, you can add them to the Virtual Machine Contributor role.

Organizations that do not enforce data access control by using capabilities such as RBAC may be giving more privileges than necessary for their users. This can lead to data compromise by allowing some users access to data they shouldn’t have in the first place.

To learn more about RBAC see:

- [Manage access using RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md)
- [Built-in roles for Azure resources](../role-based-access-control/built-in-roles.md)
- [Azure Storage security guide](../storage/common/storage-security-guide.md) 

## Use client-side encryption for high value data
Client-side encryption enables you to programmatically encrypt data in transit before uploading to Azure Storage, and programmatically decrypt data when retrieving it. This provides encryption of data in transit but it also provides encryption of data at rest. Client-side encryption is the most secure method of encrypting your data but it does require you to make programmatic changes to your application and put key management processes in place.

Client-side encryption also enables you to have sole control over your encryption keys. You can generate and manage your own encryption keys. It uses an envelope technique where the Azure storage client library generates a content encryption key (CEK) that is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key and can be managed locally or stored in [Azure Key Vault](../key-vault/key-vault-whatis.md).

Client-side encryption is built into the Java and the .NET storage client libraries. See [Client-side encryption and Azure Key Vault for Microsoft Azure Storage](../storage/storage-client-side-encryption.md) for information on encrypting data within client applications and generating and managing your own encryption keys.

## Enable Storage Service Encryption for data at rest
When [Storage Service Encryption](../storage/storage-service-encryption.md) for File storage is enabled, the data is encrypted automatically using AES-256 encryption. Microsoft handles all the encryption, decryption, and key management. This feature is available for LRS and GRS redundancy types.

## Next steps

This article introduced you to a collection of Azure Storage security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](security-paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure App Services](security-paas-applications-using-app-services.md)
- [Securing PaaS databases in Azure](security-paas-applications-using-sql.md)
