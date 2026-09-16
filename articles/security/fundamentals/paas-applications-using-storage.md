---
title: Best practices for PaaS apps by using Azure Storage
description: "Learn about Azure Storage security best practices for securing your PaaS web and mobile applications."
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 05/05/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---
# Best practices for securing PaaS web and mobile applications by using Azure Storage
This article discusses a collection of Azure Storage security best practices for securing your platform-as-a-service (PaaS) web and mobile applications. Microsoft derived these best practices from experience with Azure and Azure customers.

Azure makes it possible to deploy and use storage in ways not easily achievable on-premises. With Azure Storage, you can reach high levels of scalability and availability with relatively little effort. Azure Storage is the foundation for Windows and Linux Azure Virtual Machines, and it can also support large distributed applications.

Azure Storage provides four services: Blob storage, Table storage, Queue storage, and File storage. For more information, see [Introduction to Microsoft Azure Storage](../../storage/common/storage-introduction.md).

This article addresses the following best practices:

- Shared access signatures (SAS)
- Azure role-based access control (Azure RBAC)
- Client-side encryption for high-value data
- Storage service encryption

## Use a shared access signature instead of a storage account key
Access control is critical. To help you control access to Azure Storage, Azure generates two 512-bit storage account keys (SAKs) when you create a storage account. This key redundancy helps you avoid service interruptions during routine key rotation.

Storage access keys are high-priority secrets and should only be accessible to people responsible for storage access control. If the wrong people get access to these keys, they gain complete control of storage and can replace, delete, or add files to storage. Attackers can upload malware and other types of content that might compromise your organization or your customers.

You still need a way to provide access to objects in storage. To provide more granular access, take advantage of shared access signature (SAS). SAS allows you to share specific objects in storage for a predefined time interval and with specific permissions. A shared access signature allows you to define:

- The interval over which the SAS is valid, including the start time and the expiry time.
- The permissions granted by the SAS. For example, a SAS on a blob might grant a user read and write permissions to that blob, but not delete permissions.
- An optional IP address or range of IP addresses from which Azure Storage accepts the SAS. For example, you might specify a range of IP addresses belonging to your organization. This option provides another measure of security for your SAS.
- The protocol over which Azure Storage accepts the SAS. You can use this optional parameter to restrict access to clients that use HTTPS.

SAS allows you to share content the way you want to share it without giving away your storage account keys. Always use SAS in your application to securely share your storage resources without compromising your storage account keys.

For more information about shared access signature, see [Using shared access signatures](../../storage/common/storage-sas-overview.md).

## Use Azure role-based access control
Another way to manage access is to use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). With Azure RBAC, you focus on giving employees the exact permissions they need, based on the need to know and least privilege security principles. Too many permissions can expose an account to attackers. Too few permissions means that employees can't get their work done efficiently. Azure RBAC helps address this problem by offering fine-grained access management for Azure. Access control is imperative for organizations that want to enforce security policies for data access.

You can use Azure built-in roles in Azure to assign privileges to users. For example, use Storage Account Contributor for cloud operators that need to manage storage accounts and Classic Storage Account Contributor role to manage classic storage accounts. For cloud operators that need to manage VMs but not the virtual network or storage account to which they're connected, you can add them to the Virtual Machine Contributor role.

Organizations that don't enforce data access control by using capabilities such as Azure RBAC might give users more privileges than necessary. More privileges than necessary can lead to data compromise by allowing some users access to data they shouldn't have in the first place.

For more information about Azure RBAC, see:

- [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- [Azure built-in roles](../../role-based-access-control/built-in-roles.md)
- [Security recommendations for Blob storage](../../storage/blobs/security-recommendations.md)

## Use client-side encryption for high-value data
Client-side encryption enables you to programmatically encrypt data in transit before uploading to Azure Storage, and programmatically decrypt data when retrieving it. Client-side encryption provides encryption of data in transit but it also provides encryption of data at rest. Client-side encryption is the most secure method of encrypting your data but it does require you to make programmatic changes to your application and put key management processes in place.

Client-side encryption also enables you to have sole control over your encryption keys. You can generate and manage your own encryption keys. This process uses an envelope technique where the Azure storage client library generates a content encryption key (CEK) and then wraps (encrypts) it by using the key encryption key (KEK). A key identifier identifies the KEK. The KEK can be an asymmetric key pair or a symmetric key, and you can manage it locally or store it in [Azure Key Vault](/azure/key-vault/general/overview).

Client-side encryption is built into the Java and the .NET storage client libraries. See [Client-side encryption for blobs](../../storage/blobs/client-side-encryption.md) for information on encrypting data within client applications and generating and managing your own encryption keys.

## Enable Storage service encryption for data at rest
When you enable [Storage service encryption](../../storage/common/storage-service-encryption.md) for File storage, Azure Storage automatically encrypts the data by using AES-256 encryption. Microsoft handles all the encryption, decryption, and key management. This feature is available for LRS and GRS redundancy types.

## Next steps

This article introduced you to a collection of Azure Storage security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](paas-deployments.md)
- [Securing PaaS web and mobile applications by using Azure App Service](paas-applications-using-app-services.md)
- [Securing PaaS databases in Azure](paas-applications-using-sql.md)