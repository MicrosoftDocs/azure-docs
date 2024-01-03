---
title: Requirements and considerations for large volumes | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using large volumes.  
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.custom: references_regions
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/02/2023
ms.author: anfdocs
---
# Requirements and considerations for large volumes (preview)

This article describes the requirements and considerations you need to be aware of before using [large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes) on Azure NetApp Files.

## Register the feature 

The large volumes feature for Azure NetApp Files is currently in public preview. This preview is offered under the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) and is controlled via Azure Feature Exposure Control (AFEC) settings on a per subscription basis. 

To enroll in the preview for large volumes, use the [large volumes preview sign-up form](https://aka.ms/anflargevolumespreviewsignup).

## Requirements and considerations

The following requirements and considerations apply to large volumes. For performance considerations of *regular volumes*, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

* Existing regular volumes can't be resized over 100 TiB.
* You can't convert regular Azure NetApp Files volumes to large volumes.
* You must create a large volume at a size greater than 100 TiB. A single volume can't exceed 500 TiB.  
* You can't resize a large volume to less than 100 TiB.
* You can only resize a large to be volume up to 30%, of lowest provisioned size. 
* Large volumes are currently not supported with Azure NetApp Files backup.
* Large volumes aren't currently supported with cross-region replication.
* You can't create a large volume with application volume groups.
* Large volumes aren't currently supported with cross-zone replication.
* Currently, large volumes aren't suited for database (HANA, Oracle, SQL Server, etc.) data and log volumes. For database workloads requiring more than a single volume’s throughput limit, consider deploying multiple regular volumes.
* Throughput ceilings for the three performance tiers (Standard, Premium, and Ultra) of large volumes are based on the existing 100-TiB maximum capacity targets. You're able to grow to 500 TiB with the throughput ceiling per the following table:  
    
    | Capacity tier | Volume size (TiB) | Throughput (MiB/s) |
    | --- | --- | --- |
    | Standard | 100 to 500 | 1,600 |
    | Premium | 100 to 500 | 6,400 | 
    | Ultra | 100 to 500 | 10,240 | 
    
* Large volumes aren't currently supported with standard storage with cool access.
## Supported regions

Support for Azure NetApp Files large volumes is available in the following regions:

* Australia East
* Australia Southeast
* Brazil South
* Canada Central
* Central India
* Central US
* East US
* East US 2
* Germany West Central
* Japan East
* North Europe
* Qatar Central
* South Africa North 
* South Central US
* Southeast Asia
* Switzerland North
* UAE North
* UK West
* UK South
* West Europe
* West US
* West US 2
* West US 3

## Configure large volumes 

>[!IMPORTANT]
>Before you can use large volumes, you must first request [an increase in regional capacity quota](azure-netapp-files-resource-limits.md#request-limit-increase).

Once your [regional capacity quota](regional-capacity-quota.md) has increased, you can create volumes that are up to 500 TiB in size. When creating a volume, after you designate the volume quota, you must select **Yes** for the **Large volume** field. Once created, you can manage your large volumes in the same manner as regular volumes. 

## Next steps

* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
