---
title: Secure File Transfer protocol support in Azure Blob Storage (preview) | Microsoft Docs
description: Blob storage now supports the Secure File Transfer (SFTP) protocol. 
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 08/31/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)

Blob storage now supports the Secure File Transfer (SFTP) protocol. You can use an SFTP client to securely connect to an Azure Storage account, and then upload and download files. 

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: North US, Central US, East US, Canada, West Europe, North Europe, Australia, Switzerland, Germany West Central, and East Asia.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

For step-by-step guidance, see [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](secure-file-transfer-protocol-support-how-to.md).

## SFTP and the hierarchical namespace

SFTP protocol support requires blobs to be organized into on a hierarchical namespace. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized.  The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. Different protocols extend from the hierarchical namespace. The SFTP protocol is one of the these available protocols.  

## Permissions model

### Local users

Local Users is a new form of identity management provided with SFTP for Blob Storage. Create and configure users within your SFTP-enabled storage account and grant access to one or more root containers.

Capabilities Overview:

Up to 1000 users per account
Each user can access up to 100 containers

Questions - do local users need to be uniquely named across all accounts or only within a specific account

### Authentication methods

Specify read/write/create/list/delete permissions for each container
Specify home directory (container) to place each user

Authentication:

Public Key - This is the most common form of authentication for SSH. With Public Key authentication, the user must possess an SSH Key pair and the server (Azure Storage) must possess the Public Key. When the user begins to connect, it sends a message with the public key and signature. The server will validate the message and check that the user and key are recognized in the account.

When you setup a local user, you'll have three options:

| Option | Description |
|----|----|
| Generate a new key pair | Description goes here. |
| Use existing key stored in Azure | Description goes here. |
| Use existing public key | Description goes here. |

Password - This method of authentication uses an Azure-generated password. The password can be regenerated, but can not be retrieved. 

### Directory permissions

Explain the purpose of the default home directory
  
## Known issues and limitations

See the [Known issues](secure-file-transfer-protocol-known-issues.md) article for a complete list of issues and limitations with the current release of SFTP support.

## Pricing

See the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page for data storage and transaction costs. 

## See also

- [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](network-file-system-protocol-support-how-to.md)
- [Known issues with Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)