---
title: include file
description: include file
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 09/28/2022
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes-smb
# create-volumes-dual-protocol
# azure-netapp-files-create-volumes
---

>[!IMPORTANT]
>Volumes are considered large if they are between 100 TiB and 500 TiB in size. Once created, volumes less than 100 TiB in size cannot be resized to large volumes. Large volumes cannot be resized to less than 100 TiB and can only be resized up to 30% of lowest provisioned size. To understand the requirements and considerations of large volumes, refer to  for using [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md#large-volumes).