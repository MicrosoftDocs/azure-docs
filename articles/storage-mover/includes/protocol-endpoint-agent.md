---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 10/17/2025
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
| AWS S3                | Azure blob container                         | AWS (Amazon Web Services) S3 buckets with Glacier or Glacier Deep Archive storage classes can't be migrated. |
| SMB 2.x and 3.x mount   | Azure file share (SMB) | SMB 1.x sources and NFS Azure file shares are currently not supported.                  |
| SMB 2.x and 3.x mount | Azure blob container                         | Containers with Flatnamespace (FNS) and Hierarchical Namespace Service (HNS) feature enabled are supported and the ADLS Gen2 REST API set is used for migration. |
| NFS 3 and 4 mount       | Azure blob container                         | Containers with Flatnamespace (FNS) and Hierarchical Namespace Service (HNS) feature enabled are supported and the ADLS Gen2 REST API set is used for migration. |
| NFS 3 and 4 mount     | Azure file share (NFS 4.1)        | NFS Azure file shares is supported with NFS v3/4 source |                

