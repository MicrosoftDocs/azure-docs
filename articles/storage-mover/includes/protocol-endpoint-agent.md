---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 07/22/2023
ms.service: azure-storage-mover
---
<!-- 
!########################################################
STATUS: COMPLETE

CONTENT: Draft

REVIEW Stephen/Fabian: Not started

Document score: 100 (52 words and 0 issues)

!########################################################
-->

As previously mentioned, only certain types of endpoints may be used as a source or a target, respectively. The following table is used to identify the supported source to destination scenarios:

|Protocol   |Source        |Destination                     |Agent version required |
|-----------|--------------|--------------------------------|-----------------------|
|SMB        |SMB mount     |Azure file share                |2.0.277                |
|NFS        |NFS mount     |Azure blob storage container    |1.1.256                |
