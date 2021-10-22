---
title: Known issues with SFTP in Azure Blob Storage (preview) | Microsoft Docs
description: Learn about limitations and known issues of Secure File Transfer Protocol (SFTP) support in Azure Blob Storage.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/07/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Known issues with Secure File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)

This article describes limitations and known issues of SFTP protocol support in Azure Blob Storage.

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: North US, Central US, East US, Canada, West Europe, North Europe, Australia, Switzerland, Germany West Central, and East Asia.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

## Authorization

- Storage account local users are the only form of identity management that is currently supported. 

  Azure Active Directory (Azure AD), shared access signature (SAS) and account key authorization are not yet supported. 

- POSIX access control lists (ACL) are not yet supported.
 
## Networking

- Partitioned DNS endpoints are not supported. 

## Performance

- Upload performance with default settings for some clients can be slow. Some of this is expected because of the many small blocks that are written by default. For OpenSSH, increasing the buffer size option to 100,000 will help (`For example: sftp -B 100000 testaccount.user1@testaccount.blob.core.windows.net`). Also consider using multiple connections to transfer data. For example, if you use WinSCP, you can use a maximum of 9 concurrent connections to upload multiple files.

  > [!NOTE]
  > a buffer size of 262000 can be used for OpenSSH on Linux accompanied by -R 32.


- There's a 4 minute timeout for idle or inactive connections. OpenSSH will appear to hang and then disconnect. Some clients reconnect automatically.

- Maximum file size upload is limited by client message size:

  - 32k message (OpenSSH default) * 50k blocks = 1.52GB
  - 100k message (OpenSSH Windows max) * 50k = 4.77GB
  - 256k message (OpenSSH Linux max) * 50k = 12.20GB

## Other

- Cross-container rename (move) is not yet supported.

- Symbolic links are not supported.

## See also

- [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Mount Blob storage by using Secure File Transfer (SFTP) protocol](network-file-system-protocol-support-how-to.md)