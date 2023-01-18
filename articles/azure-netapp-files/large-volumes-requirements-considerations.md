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
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/19/2023
ms.author: anfdocs
---
# Requirements and considerations for large volumes (preview)

This article describes the requirements and considerations you need to be aware of before using [large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes) on Azure NetApp Files.

## Register the feature 

The large volumes feature for Azure NetApp Files is currently in public preview. This preview is offered under the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) and is controlled via Azure Feature Exposure Control (AFEC) settings on a per subscription basis. 

Follow the registration steps if you're using the feature for the first time.

1.  Register the feature by running the following commands:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. -->

## Requirements and considerations

* Existing regular volumes cannot be resized over 100 TiB. You cannot convert regular Azure NetApp Files volumes to large volumes.
* Large volumes must be created at a size greater than 100 TiB. A single volume cannot exceed 500 TiB.  
* Large volume cannot be resized below 100 TiB and can only be resized up to 30% of lowest provisioned size. 
* You cannot create a large volume from a backup.
* You cannot create a backup from a large volume.
<!-- * You cannot use Standard storage with cool access with large volumes. -->
* Large volumes are not currently supported with cross-region replication.
* You cannot create a large volume with application volume groups.
* Large volumes are not currently supported with cross-zone replication.
* Throughput ceilings for the three performance tiers (Standard, Premium, and Ultra) of large volumes are based on the existing 100-TiB maximum capacity targets. You'll be able to grow to 500 TiB with the throughput ceiling as per the table below. 

| Capacity tier | Volume size (TiB) | Throughput (MiB/s) |
| --- | --- | --- |
| Standard | 100 to 500 | 1,600 |
| Premium | 100 to 500 | 6,400 | 
| Ultra | 100 to 500 | 10,240 | 

## Configure large volumes 

>[!IMPORTANT]
>Before you can use large volumes, you must first request [an increase in regional capacity quota](azure-netapp-files-resource-limits.md#request-limit-increase).

Once your capacity quota has increased, you can create volumes that are up to 500 TiB in size. When creating a volume, after you designate the volume quota, you must select **Yes** for the **Large volume** field. Once created, you can manage your large volumes in the same manner as regular volumes. 

## Next steps

* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
