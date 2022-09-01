---
title: Manage large volume in Azure NetApp Files | Microsoft Docs
description: Learn how to configure volumes between 100 TiB and 500 TiB in Azure NetApp Files. 
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
author: b-ahibbard
ms.author: anfdocs
ms.date: 09/01/2022
---

# Manager large volumes in Azure NetApp Files (Preview)

Azure NetApp Files allows you to create volumes up to 500 TiB in size, exceeding the previous 100 TiB limit. Large volumes begin at a capacity of 102,401 GiB and scale up to 500 TiB, whereas regular Azure NetApp Files volumes, which are offered between 100 GiB and 102,400 GiB. 

> [!IMPORTANT]
> Large volumes for Azure NetApp Files is currently in public preview. This preview is offered under the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) and is controlled via Azure Feature Exposure Control (AFEC) settings on a per subscription basis. To access this feature, contact your account team. 

## Considerations and requirements 

* Existing volumes cannot be resized over 100 TiB. You cannot currently convert Azure NetApp Files to large volumes.
* Large volumes must be created at a size greater than 100 TiB. A single volume cannot exceed 500 TiB.  
* Large volumes dp not support all operations that are currently supported for volumes smaller than the 100 TiB limit. You cannot:
    * Use large volumes in a cross-region replication relationship
    * Create a large volume from a backup
    * Create a backup from a large volume
    * Use cool tiering: if you are using the Standard performance tier, you can move large volumes to cool access <!-- remove depending on cool access release -->
    * Create a large volume with application volume groups 
    
* Throughput ceilings for the three performance tiers (Standard, Premium, and Ultra) of large volumes is based on the existing 100 TiB maximum capacity targets. Customers will be able to grow to 500 TiB with the throughput ceiling as per the table below. 

| Capacity tier | Volume size (TiB) | Throughput (MiB/s) |
| --- | --- | --- |
| Standard | 100 to 500 | 1,600 |
| Premium | 100 to 500 | 6,400 | 
| Ultra | 100 to 500 | 10,240 | 

## Configure large volumes 

You must first request [an increase in regional capacity quota](azure-netapp-files-resource-limits.md#request-limit-increase) before you can use large volumes. 

Once your capacity quota has increased, you can create volumes to 500 TiB in size. Large Volumes are managed the same way as existing Azure NetApp Files Volumes. Large volumes are managed with the same interfaces as volumes less than 100 TiB in size. 

For information on creating and resizing a volume in Azure NetApp Files, refer to: 
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume ](create-volumes-dual-protocol.md)
* [Resize a capacity pool or volume](azure-netapp-files-resize-capacity-pools-or-volumes.md)

 ## Error messages and troubleshooting 

Learn how to resolve common errors when creating a large volume. 

| Error condition | Resolution |
| - | - |
|  Warning message when you try to resize a large volume: `The value must be between 100 and 102400` | Ignore the  warning message and select **OK** to proceed with volume resize operation. | 
| When resizing a volume less than 100 TiB in size to a large volume (greater than 100 TiB), the request fails with the expected error message but the volume shows up in the Azure portal in a failed state. | Volume shows as failed, but subsequent volume operations are successful. Ignore the failed state of volume. |
|

## Next steps
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume ](create-volumes-dual-protocol.md)
* [Resize a capacity pool or volume](azure-netapp-files-resize-capacity-pools-or-volumes.md)
