---
title: Volume Mount
description: Manage volume mounting options within Azure CycleCloud.
author: mvrequa
ms.date: 01/10/2020
ms.author: adjohnso
---

# Mounting Volumes

Specifying a volume attaches the device(s) to your instance, but does not mount and format the device. If you prefer to have the volumes mounted and formatted when the node is started, set the optional attribute `Mount` to the name of the mountpoint configuration you wish to use with that volume:

``` ini
[[[volume reference-data]]]
Size = 100
Mount = data              # The name of the mountpoint to use with this volume
```

The mountpoint named `data` is then defined in the configuration section on the node:

``` ini
[[[configuration cyclecloud.mounts.data]]]
mountpoint = /mount
fs_type = ext4
```

The above configuration specifies that you are configuring a `cyclecloud.mountpoint` named `data` using all volumes which include `Mount = data`. This volume would be formatted with the `ext4` filesystem and would appear at `/mount`.

## Devices

By defining volumes with a `mountpoint` attribute, the device names will be automatically assigned and used for a given mountpoint. However, you can customize a mountpoint with your own device names. For example:

``` ini
[[node scheduler]]
  [[[configuration cyclecloud.mounts.data]]]
  mountpoint = /data
  Azure.LUN=0
```

In Azure, devices are assigned using [Logical Unit Numbers (LUN)](/powershell/module/servicemanagement/azure.service/add-azuredatadisk)

In most cases, Azure CycleCloud will automatically assign devices for you. Specifying devices manually is advanced usage, and useful in cases where the image you are using for your node has volumes that will be automatically attached because their attachment was baked into the image. Specifying the devices by hand can also be useful when the ordering of devices has special meaning.

> [!NOTE]
> The reserved name `boot` is used to modify the built-in boot volume.

## Advanced Usage

The previous example was a fairly simple: mounting a single, pre-formatted snapshot to a node. However, more advanced mounting can take place, including RAIDing multiple devices together, encrypting, and formatting new filesystems. As an example, the following will describes how to RAID several volumes together and encrypt them before mounting them as a single device on a node:

``` ini
[[node scheduler]]
....
  [[[volume vol1]]]
  VolumeId = vol-1234abcd
  Mount = giant

  [[[volume vol2]]]
  VolumeId = vol-5678abcd
  Mount = giant

  [[[volume vol3]]]
  VolumeId = vol-abcd1234
  Mount = giant

  [[[configuration cyclecloud.mounts.giant]]]
  mountpoint = /mnt/giant
  fs_type = xfs
  raid_level = 0
  encryption.bits = 256
  encryption.key = "0123456789abcdef9876543210"
```

The above example shows there are three volumes that should be attached to the node named `scheduler`, and that their mountpoint is named `giant`. The configuration for the mountpoint says that these three volumes should be RAIDed together using `raid_level = 0` for RAID0, formatted using the `xfs` filesystem, and the resulting device should be mounted at `/mnt/giant`. The device should also have block level encryption using 256-bit AES with an encryption key as defined in the template.

## Server-Side Encryption with Azure Disk Encryption Sets
CycleCloud supports server-side encryption (SSE) for OS and data disk Volumes using [Azure Disk Encryption Sets](/azure/virtual-machines/disk-encryption).
Azure uses _Platform Managed Keys_ (PMK) by default. However, to use _Customer Managed Keys_ (CMK), you must first set up an Azure Disk Encryption Set and a Key Vault with your key.
Follow the documention here to [set up your Disk Encryption Set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal).  

Record the ``Resource ID`` of the Disk Encryption Set when you create it.  You can find this in the Azure Portal under **Properties** in the **Disk Encryption Sets** blade.

To apply SSE with CMK to your CycleCloud node's volumes add the following to your ``[[[volume]]]`` definition:

``` ini
DiskEncryptionSetId = /subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/diskEncryptionSets/$DISK-ENCRYPTION-SET-NAME
```

For example:

``` ini
[[node scheduler]]
....
  [[[volume encryptedVolume]]]
  VolumeId = vol-1234abcd
  Mount = encrypted

  # Insert your RESOURCE ID here:
  DiskEncryptionSetId = /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResouceGroup/providers/Microsoft.Compute/diskEncryptionSets/myCMKDiskEncryptionSet

  [[[configuration cyclecloud.mounts.encrypted]]]
  mountpoint = /mnt/encrypted
  fs_type = ext4
  raid_level = 0

```

> [!NOTE]
> The simplified syntax above was introduced in CycleCloud 8.5. For prior versions, you must use `Azure.Encryption.DiskEncryptionSetId` instead:
>
> `Azure.Encryption.DiskEncryptionSetId = /subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/diskEncryptionSets/$DISK-ENCRYPTION-SET-NAME`.
> However, you do not need to set `Azure.Encryption.Type`.

See the [Volume Configuration Reference](../cluster-references/volume-reference.md) for details.

## Mounting Configuration Options

| Option  | Definition  |
| ------  | ----------  |
| mountpoint            | The place where the device(s) will be mounted after any additional configuration is applied. If a mountpoint is not specified, the name of the mount will be used as part of the mountpoint. For example, if your mount was named ‘data’, the mountpoint would default to ‘/media/data’.|
| options               | Any non-default options to use when mounting the device. |
| fs_type               | The filesystem to use when formatting and/or mounting. Available options are: ext3, ext4, xfs.|
| size                  | The size of the filesystem to create when formatting the device(s). Omitting this parameter will use all the space on the device. Size can be specified using M for megabytes (e.g. 150M for 150MB) G for gigabytes (e.g. 200G for 20GB), or percentages (e.g. 100% to use all of the available space).  |
| disabled              | If true, the mountpoint will not be created. Useful for quick toggling of mounts for testing and to disable automatic ephemeral mounting. Default: false. |
| raid_level            | The type of RAID configuration to use when multiple devices/volumes are being used. Defaults to a value of 0, meaning RAID0, but other raid levels can be used such as 1 or 10.|
| raid_device_symlink   | When a raid device is created, specifying this attribute will create a symbolic link to the raid device. By default, this attribute is not set and therefore no symlink is created. This should be set in cases where you need access to the underlying raid device. |
| devices               | This is a list of devices that should compose the mountpoint. In general, this parameter shouldn’t need to be specified (as CycleCloud will set this for you based on [[[volume]]] sections), but you can manually specify the devices if so desired.    |
| vg_name               | Devices are configured on Linux using the Logical Volume Manager (LVM). The volume group name will be automatically assigned, but in cases where a specific name is used, this attribute can be set. The default is set to `cyclecloud-vgX`, where X is an automatically assigned number. |
| lv_name               | Devices are configured on Linux using the Logical Volume Manager (LVM). This value is automatically assigned and does not need specification, but if you want to use a custom logical volume name, it can be specified using this attribute. Defaults to `lv0`.  |
| order                 | By specifying an order, you can control the order in which mountpoints are mounted. The default order value for all mountpoints is 1000, except for ‘ephemeral’ which is 0 (ephemeral is always mounted first by default). You can override this behaviour on a case-by-case basis as needed. |
| encryption.bits       | The number of bits to use when encrypting the filesystem. Standard values are `128` or `256` bit AES encryption. This value is required if encryption is desired. |
| encryption.key        | The encryption key to use when encrypting the filesystem. If omitted, a random 2048 bit key will be generated. The automatically generated key is useful for when you are encrypting disks that do not persist between reboots (e.g. encrypting ephemeral devices). |
| encryption.name       | The name of the encrypted filesystem, used when saving encryption keys. Defaults to `cyclecloud_cryptX`, where X is an automatically generated number. |
| encryption.key_path   | The location of the file the key will be written on disk to. Defaults to `/root/cyclecloud_cryptX.key`, where X is a automatically generated number.  |

## Mounting Configuration Defaults

Use these options to set system defaults for mountpoints, which will be used unless otherwise specified:

| Options  | Definition  |
| -------  | ----------  |
| cyclecloud.mount_defaults.fs_type          | The filesystem type to use for mounts, if not otherwise specified. Default: ext3/ext4 (depending on the platform).  |
| cyclecloud.mount_defaults.size             | The default filesystem size to use, if not otherwise specified. Default: 50GB. |
| cyclecloud.mount_defaults.raid_level       | The default raid level to use if multiple devices are assigned to the mountpoint. Default: 0 (RAID0). |
| cyclecloud.mount_defaults.encryption.bits  | The default encryption level unless otherwise specified. Default: undefined.  |
