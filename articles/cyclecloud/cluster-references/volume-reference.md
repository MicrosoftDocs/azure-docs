---
title: Cluster Template Reference - Volumes
description: Read reference material for including volumes in cluster templates to be used with Azure CycleCloud. A volume represents an Azure Disk.
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
ms.topic: conceptual
ms.service: azure-cyclecloud
---

# Volumes

[Volume](~/articles/cyclecloud/how-to/mount-disk.md) objects are rank 3 and subordinate to `node` and `nodearray` objects. A volume represents an Azure Disk.

## Example

Adding a `[[[volume]]]` section to a node creates an Azure Disk and attaches it to the VM.

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
:::

Attribute values that start with `$` reference parameters.

::: moniker range=">=cyclecloud-8"
Attribute | Type | Definition
------ | ----- | ----------
Size | String | (Required) Size of disk in GB
VolumeId | String | Resource ID for existing Azure Disk.
StorageAccountType | String | UltraSSD_LRS, Premium_LRS, StandardSSD_LRS, Standard_LRS, PremiumV2_LRS ([Azure Disk Types](/azure/virtual-machines/linux/disks-types)) If you don't set this value, the default is Standard_LRS or Premium_LRS depending on the VM size capabilities.
DiskIOPSReadWrite | Integer | Provisioned IOPS. See [Ultra Disks](/azure/virtual-machines/linux/disks-types#ultra-disk).
DiskMBPSReadWrite | Integer | Disk throughput MB/s. See [Ultra Disks](/azure/virtual-machines/linux/disks-types#ultra-disk).
Azure.Lun | Integer | Override the auto-assigned LUN ID.
Mount | String | Name of mount construct, described in the `configuration` object.
Azure.Caching | String | None, readonly, readwrite. Default is none.
Persistent | Boolean | If false, the disk is deleted when the VM is deleted. Default is false.
Disabled | Boolean | If true, the volume is ignored. Default is false.
SourceUri | String | URI of the blob to import into managed disk.
StorageAccountId | String | Azure resource ID of the storage account containing the SourceUri blob. Required if the blob is in a different subscription.
SourceResourceId | String | Azure resource ID of the source snapshot or managed disk.
DiskEncryptionSetId (8.5+) | String | Azure resource ID of the Disk Encryption Set to enable server-side encryption with CMK.
ConfidentialDiskEncryptionSetId (8.5+) | String | Azure resource ID of the Confidential Disk Encryption Set to enable confidential encryption with CMK. Note: Requires `SecurityEncryptionType=DiskWithVMGuestState`. (CycleCloud 8.5+)
SecurityEncryptionType (8.5+) | String | One of `VMGuestStateOnly` (the default) or `DiskWithVMGuestState`.
Azure.Encryption.Type | String | Deprecated. Has no effect. If you use a Disk Encryption Set, you get CMK; otherwise, you get PMK.
Azure.Encryption.DiskEncryptionSetId | String | Deprecated. Use `DiskEncryptionSetId` instead, as of CycleCloud 8.5.

::: moniker-end

### Boot Volume

::: moniker range=">=cyclecloud-8"
For each node, the volume named `boot` exposes some advanced configuration of the OS boot volume. The cluster ignores storage type settings for the boot disk if you specify `EphemeralOSDisk=true` for the node.

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
> You can only use UltraSSD disks with availability zones. You can't use UltraSSD disks with availability sets or single VM deployments outside of zones.

::: moniker-end
