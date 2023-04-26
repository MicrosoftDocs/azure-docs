---
title: include file
description: include file
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 01/19/2023
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes-smb
# create-volumes-dual-protocol
# azure-netapp-files-create-volumes
---

>[!IMPORTANT]
> Large volumes are currently in preview. If this is your first time using large volumes, you must first [register the feature](../azure-netapp-files-understand-storage-hierarchy.md#large-volumes) and request [an increase in regional capacity quota](../azure-netapp-files-resource-limits.md#request-limit-increase).
>
>Volumes are considered large if they are between 100 TiB and 500 TiB in size. Once created, volumes less than 100 TiB in size cannot be resized to large volumes. Large volumes cannot be resized to less than 100 TiB and can only be resized up to 30% of lowest provisioned size. To understand the requirements and considerations of large volumes, refer to for using [Requirements and considerations for large volumes](../large-volumes-requirements-considerations.md).
