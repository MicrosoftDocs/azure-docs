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

# Known issues with Secure File Transfer (SFTP) protocol support in Azure Blob Storage (preview)

This article describes limitations and known issues of SFTP protocol support in Azure Blob Storage.

> [!IMPORTANT]
> SFTP protocol support is currently in PREVIEW and is available in the following regions: North US, Central US, East US, Canada, West Europe, North Europe, Australia, Switzerland, Germany West Central, and East Asia.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u).

## Authorization

- Storage account local users are the only form of identity management that is currently supported. Azure Active Directory (Azure AD), shared access signature (SAS) and account key authorization are not yet supported. 

- POSIX access control lists (ACL) are not yet supported.
 
## Networking

Q. Are partitioned DNS endpoints supported for SFTP?

A. Not for private preview

## Performance

- Upload performance with default settings for some clients can be slow. Some of this is expected because of the many small blocks that are written by default. For OpenSSH, increasing the buffer size option to 100,000 will help. ("-B 100000")

- 4 minute timeout for an idle/inactive connection - some clients reconnect automatically. OpenSSH will appear to hang and then disconnect. 

- Max file size upload is limited by client message size:

  - 32k message (OpenSSH default) * 50k blocks = 1.52GB
  - 100k message (OpenSSH Windows max) * 50k = 4.77GB
  - 256k message (OpenSSH Linux max) * 50k = 12.20GB

Upload performance with default settings for some clients can be slow. Some of this is expected because of the many small blocks that are written by default. For Windows OpenSSH, increasing the buffer size option to 100,000 will help. ("-B 100000")
sftp -B 100000 testaccount.user1@testaccount.blob.core.windows.net 
Note: 262000 can be used for OpenSSH on Linux accompanied by -R 32

There are unavoidable network bottlenecks due to the nature of both TCP and SSH protocols

Solution? Use multiple connections to transfer data when possible (multi file uploads). With WinSCP for example, a max of 9 concurrent connections can be used to upload multiple files.

## Other

- Cross-container rename (move) is not yet supported.

- Symbolic links are not supported.

## See also

- [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Mount Blob storage by using Secure File Transfer (SFTP) protocol](network-file-system-protocol-support-how-to.md)