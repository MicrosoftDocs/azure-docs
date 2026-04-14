---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 11/11/2025
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes-smb
# create-volumes-dual-protocol
# azure-netapp-files-create-volumes
# object-rest-api-access-configure.md
# Customer intent: As a cloud administrator, I want to understand the volume quota options for Azure NetApp Files, so that I can select the appropriate volume size and ensure compliance with regional capacity requirements.
---

Regular volumes quotas are between 50 GiB and 100 TiB. Large volume quotas range from 50 TiB to 1 PiB in size. To create a volume in this size range, select **Yes**. Volume quotas are entered in GiB.

>[!IMPORTANT]
> Before using large volumes, you must first [register the feature](../large-volumes-requirements-considerations.md#register-the-feature) and request [an increase in regional capacity quota](../azure-netapp-files-resource-limits.md#request-limit-increase).
>
>Regular volumes cannot be converted to large volumes. Large volumes can't be resized to less than 50 TiB. To understand the requirements and considerations of large volumes, see [Requirements and considerations for large volumes](../large-volumes-requirements-considerations.md). For other limits, see [Resource limits](../azure-netapp-files-resource-limits.md#resource-limits).

* **Large volume type**

    * To create a volume between 50 TiB and 1 PiB, select **Large volume**.
    * If you plan to enable cool access and want to scale to 7.2 PiB, select **Extra-large volume 7.2 PiB**. Ensure you meet the [requirements for large volumes up to 7.2 PiB](../large-volumes-requirements-considerations.md#requirements-and-considerations-for-large-volumes-up-to-72-pib-preview).

* **Breakthrough mode**

    If you're using breakthrough mode to increase throughput and quota, select the box.

    You must first be registered to use breakthrough mode. For registration and other considerations, see [breakthrough mode](../large-volumes-requirements-considerations.md#register-for-breakthrough-mode).
