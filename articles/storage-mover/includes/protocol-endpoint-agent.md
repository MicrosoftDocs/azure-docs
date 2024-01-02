---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 10/30/2023
ms.service: azure-storage-mover
---
<!-- 
!########################################################
STATUS: In-progress

CONTENT: Draft

REVIEW Stephen/Fabian: Not started

Document score: 100 (103 words and 0 issues)

!########################################################
-->

<!--The current Azure Storage Mover release supports migrations from NFS or SMB source shares on a NAS or server device within your network. Data from SMB source shares can be migrated to Azure file shares, while files hosted on NFS shares can be migrated to Azure blob containers.-->

The current Azure Storage Mover release supports only certain, specific source-target pair migration path scenarios. One supported source-target pair consists of an NFS share on a NAS or server device within your network and an Azure blob container. Another pair consists of an SMB share and an Azure file share. Migrating data between other source-target pairs, such as source data on an NFS share to an Azure file share target, is currently unsupported.

The following table identifies the currently supported source-to-destination scenarios:

|Protocol   |Source        |Target                          |Agent version required |
|-----------|--------------|--------------------------------|-----------------------|
|SMB        |SMB mount     |Azure file share                |2.0.287                |
|NFS        |NFS mount     |Azure blob storage container    |1.1.256                |
