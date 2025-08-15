---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 06/30/2024
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes-smb
# create-volumes-dual-protocol
# azure-netapp-files-create-volumes
# Customer intent: As a cloud administrator, I want to understand the volume quota options for Azure NetApp Files, so that I can select the appropriate volume size and ensure compliance with regional capacity requirements.
---

Regular volumes quotas are between 50 GiB and 100 TiB. Large volume quotas range from 50 TiB to 1 PiB in size. If you intend for the volume quota to fall in the large volume range, select **Yes**. Volume quotas are entered in GiB.

>[!IMPORTANT]
> If this is your first time using large volumes, you must first [register the feature](../large-volumes-requirements-considerations.md#register-the-feature) and request [an increase in regional capacity quota](../azure-netapp-files-resource-limits.md#request-limit-increase).
>
>Regular volumes cannot be converted to large volumes. Large volumes can't be resized to less than 50 TiB. To understand the requirements and considerations of large volumes, see [Requirements and considerations for large volumes](../large-volumes-requirements-considerations.md). For other limits, see [Resource limits](../azure-netapp-files-resource-limits.md#resource-limits).
