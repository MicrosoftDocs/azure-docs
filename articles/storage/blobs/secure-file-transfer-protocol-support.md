---
title: Secure File Transfer protocol support in Azure Blob Storage | Microsoft Docs
description: Blob storage now supports the Secure File Transfer (SFTP) protocol. Put more description here.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 08/31/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Secure File Transfer (SFTP) protocol support in Azure Blob Storage

Blob storage now supports the Secure File Transfer (SFTP) protocol. This support provides .... 

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## SFTP and the hierarchical namespace

SFTP protocol support requires blobs to be organized into on a hierarchical namespace. You can enable a hierarchical namespace when you create a storage account. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized.  The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. Different protocols extend from the hierarchical namespace. The SFTP protocol is one of the these available protocols.   
  
## General workflow

Put an outline of steps here.

For step-by-step guidance, see [Mount Blob storage by using the Secure File Transfer (SFTP) protocol](secure-file-transfer-protocol-support-how-to.md).

## Known issues and limitations

See the [Known issues](secure-file-transfer-protocol-known-issues.md) article for a complete list of issues and limitations with the current release of SFTP support.

## Pricing

See the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page for data storage and transaction costs. 

## See also

- [Mount Blob storage by using Secure File Transfer (SFTP) protocol](network-file-system-protocol-support-how-to.md)
- [Known issues](secure-file-transfer-protocol-known-issues.md)