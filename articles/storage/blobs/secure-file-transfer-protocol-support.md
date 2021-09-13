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

Blob storage now supports the Secure File Transfer (SFTP) protocol. You can use an SFTP client to securely connect to an Azure Storage account, and then manage your objects by using file system semantics.

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: Central US, East US, Canada, West Europe, Australia, East Asia, and North Europe.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

## SFTP and the hierarchical namespace

SFTP protocol support requires blobs to be organized into on a hierarchical namespace. You can enable a hierarchical namespace when you create a storage account. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized.  The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. Different protocols extend from the hierarchical namespace. The SFTP protocol is one of the these available protocols.   
  
## Get started

For step-by-step guidance, see [Mount Blob storage by using the Secure File Transfer (SFTP) protocol](secure-file-transfer-protocol-support-how-to.md).

## Known issues and limitations

See the [Known issues](secure-file-transfer-protocol-known-issues.md) article for a complete list of issues and limitations with the current release of SFTP support.

## Pricing

See the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page for data storage and transaction costs. 

## See also

- [Connect to Azure Blob Storage by using the Secure File Transfer (SFTP) protocol (preview)](network-file-system-protocol-support-how-to.md)
- [Known issues with Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)