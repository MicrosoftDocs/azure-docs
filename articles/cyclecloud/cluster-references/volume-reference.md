---
title: Cluster Template Reference - Volumes
description: Read reference material for including volumes in cluster templates to be used with Azure CycleCloud. A volume represents an Azure Disk.
author: adriankjohnson
ms.date: 01/07/2025
ms.author: adjohnso
ms.topic: conceptual
ms.service: azure-cyclecloud
---

# Volumes

[Volume](~/articles/cyclecloud/how-to/mount-disk.md) objects are rank 3 and subordinate to `node` and `nodearray`. A Volume represents an Azure Disk.

## Example

Adding a `[[[volume]]]` section to a node will create an Azure Disk and attach it to the VM.

::: moniker range=">=cyclecloud-8"
``` ini
[cluster my-cluster]
  [[node my-node]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    MachineType = $MachineType
    ImageName = $ImageName

    [[[volume my-volume]]]
      Size = 500

    [[[volume another-volume]]]
      Size = 1024
      StorageAccountType = StandardSSD_LRS

    [[[volume data]]]
      VolumeId = /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/my-rg/providers/Microsoft.Compute/disks/datadisk
```
::: moniker-end

Attribute values that begin with `$` are referencing parameters.

::: moniker range=">=cyclecloud-8"
Attribute | Type | Definition
------ | ----- | ----------
Size | String | (Required) Size of disk in GB
VolumeId | String | Resource id for existing Azure Disk.
StorageAccountType | String | UltraSSD_LRS, Premium_LRS, StandardSSD_LRS, Standard_LRS, PremiumV2_LRS ([Azure Disk Types](/azure/virtual-machines/linux/disks-types)) If not set, defaults to Standard_LRS or Premium_LRS depending on VM size capabilities.
DiskIOPSReadWrite | Integer | Provisioned IOPS see [Ultra Disks](/azure/virtual-machines/linux/disks-types#ultra-disk)
DiskMBPSReadWrite | Integer | Disk throughput MB/s see [Ultra Disks](/azure/virtual-machines/linux/disks-types#ultra-disk) 
Azure.Lun | Integer | Override the auto-assigned LUN ID.
Mount | String | Name of mount construct, described in `configuration` object
Azure.Caching | String | None, readonly, readwrite. Default is none.
Persistent | Boolean | If false, disk will be deleted with vm is deleted. Default is false.
Disabled | Boolean | If true, this volume will be ignored. Default is false.
SourceUri | String | URI of blob to import into managed disk.
StorageAccountId | String | Azure resource ID of storage account containing SourceUri blob. Required if blob is in a different subscription.
SourceResourceId | String | Azure resource ID of source snapshot or managed disk.
DiskEncryptionSetId (8.5+) | String | Azure resource ID of the Disk Encryption Set to enable Server-Side Encryption with CMK.
ConfidentialDiskEncryptionSetId (8.5+) | String | Azure resource ID of the Confidential Disk Encryption Set to enable Confidential encryption with CMK. Note: requires `SecurityEncryptionType=DiskWithVMGuestState`. (CycleCloud 8.5+)
SecurityEncryptionType (8.5+) | String | One of `VMGuestStateOnly` (the default) or `DiskWithVMGuestState`.
Azure.Encryption.Type | String | Deprecated, has no effect. Using a Disk Encryption Set provides CMK; otherwise, PMK is in effect.
Azure.Encryption.DiskEncryptionSetId | String | Deprecated. Use `DiskEncryptionSetId` instead, as of CycleCloud 8.5.

::: moniker-end

### Boot Volume

::: moniker range=">=cyclecloud-8"
For each node, the volume named `boot` exposes some advanced configuration of the OS boot volume. Storage type settings for the boot disk are ignored if `EphemeralOSDisk=true` is specified for the node.

``` ini
  [[node scheduler]]
  Zone = 1
    [[[volume boot]]]
      Size = 100
      StorageAccountType = UltraSSD_LRS
      DiskIOPSReadWrite = 38400
      DiskMBPSReadWrite = 2000
```
> [!NOTE]
> UltraSSD disks can only be used with availability zones (availability sets and single VM deployments outside of zones will not have the ability to attach an ultra disk).

::: moniker-end
