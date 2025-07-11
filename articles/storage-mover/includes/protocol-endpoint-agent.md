---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 07/01/2025
ms.service: azure-storage-mover
---
<!-- 
!########################################################

ATTENTION: 
This is an include for several Storage Mover articles.
Handle file and content with care.

!########################################################
-->

The current Azure Storage Mover release supports full-fidelity migrations for specific source-target pair combinations. Always utilize the latest agent version to benefit from these supported sources and destinations:

|Source protocol        |Target                                                | Comments                                                                                |
|-----------------------|------------------------------------------------------|-----------------------------------------------------------------------------------------|
| S3 (Preview)          | Azure blob storage container                         | AWS S3 buckets with Glacier or Glacier Deep Archive storage classes cannot be migrated. |
| SMB 2.x & 3.x mount   | Azure blob storage container, Azure file share (SMB) | SMB 1.x sources and NFS Azure file shares are currently not supported.                  |
| SMB 2.x and 3.x mount | Azure blob storage container                         | Containers with the Hierarchical Namespace Service (HNS) feature enabled are supported and the ADLS Gen2 REST API set is used for migration. |
| NFS 3 & 4 mount       | Azure blob storage container                         | Containers with the Hierarchical Namespace Service (HNS) feature enabled are supported and the ADLS Gen2 REST API set is used for migration. |

