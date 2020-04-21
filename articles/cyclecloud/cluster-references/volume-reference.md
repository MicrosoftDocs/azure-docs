---
title: Cluster Template Reference - Volumes
description: Volume reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 03/10/2020
ms.author: adjohnso
---

# Volumes

[Volume](~/how-to/mount-disk.md) objects are rank 3 and subordinate to `node` and `nodearray`. A Volume represents an Azure Disk.

## Example

Adding a `[[[volume]]]` section to a node will create an Azure Disk and attach it to the VM.

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
      SSD = true

    [[[volume data]]]
      VolumeId = /subscriptions/8XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/my-rg/providers/Microsoft.Compute/disks/datadisk
```

Attribute values that begin with `$` are referencing parameters.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
Size | String | (Required) Size of disk in GB
VolumeId | String | Resource ID for existing Azure Disk.
SSD | Boolean | If true, use premium disk sku. Otherwise, use standard disk. Default: `false`.  
Azure.Lun | Integer | Override the auto-assigned LUN ID.
Mount | String | Name of mount construct, described in `configuration` object
Azure.Caching | String | [none, readonly, readwrite] Default: `none`.
Persistent | Boolean | If false, disk will be deleted when VM is deleted. Default: `false`.
Disabled | Boolean | If true, this volume will be ignored. Default: `false`.
Azure.SourceUri | String | URI of blob to import into managed disk.
Azure.StorageAccountId | String | Azure resource ID of storage account containing SourceUri blob. Required if blob is in a different subscription.
Azure.SourceResourceId | String | Azure resource ID of source snapshot or managed disk.

### Boot Volume

For each node, the volume named `boot` exposes some available configuration of the OS boot volume.

>[!NOTE] 
>This section is ignored if EphemeralOSDisk is set

``` ini
  [[node scheduler]]
    [[[volume boot]]]
      Size = 100
      SSD = true
```
