---
title: Azure CycleCloud Cluster Template Reference | Microsoft Docs
description: Volume reference for cluster templates for use with Azure CycleCloud
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Volumes

Volume objects are subordinate in rank to `node`. Volume represents an Azure Disk.

## Example

Adding a `[[[volume]]]` section to a node will create an Azure Disk and attach it to the vm.

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
      VolumeId = /subscriptions/8FADA0F6-602B-4BC6-82F8-EF4701B65C87/resourceGroups/my-rg/providers/Microsoft.Compute/disks/datadisk
```

The `$` is a reference to a parameter name.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
`Size` | String | (Required) Size of disk in GB
`VolumeId` | String | Resource id for existing Azure Disk.
`SSD` | Boolean | If true use premium disk sku otherwise use standard disk. Default is false.  Planned obsolescence in favor of `Azure.StorageSkuTier` or `Azure.StorageSkuName`
`Azure.Lun` | Integer | Override the auto-assigned LUN ID.
`Mount` | String | Name of mount construct, described in `configuration` object
`Azure.Caching` | String | None, readonly, readwrite. Default is none.
`Persistent` | Boolean | If false, disk will be deleted with vm is deleted. Default is false.

### Boot Volume

For each node, the volume named `boot` exposes some available configuration
of the OS boot volume.

``` ini
  [[node scheduler]]
    [[[volume boot]]]
      Size = 100
      Azure.StorageSkuName = PremiumLRS
```
