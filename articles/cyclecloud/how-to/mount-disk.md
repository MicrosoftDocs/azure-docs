---
title: Volume Mount
description: Manage volume mounting options within Azure CycleCloud.
author: mvrequa
ms.date: 07/01/2025
ms.author: adjohnso
---

# Mounting volumes

When you specify a volume, you attach the devices to your instance but don't mount or format the device. To mount and format the volumes when the node starts, set the optional attribute `Mount` to the name of the mountpoint configuration you want to use with that volume:

``` ini
[[[volume reference-data]]]
Size = 100
Mount = data              # The name of the mountpoint to use with this volume
```

Define the mountpoint named `data` in the configuration section on the node:

``` ini
[[[configuration cyclecloud.mounts.data]]]
mountpoint = /mount
fs_type = ext4
```

This configuration sets up a `cyclecloud.mountpoint` named `data` that uses all volumes with `Mount = data`. You format this volume with the `ext4` filesystem, and it appears at `/mount`.

## Devices

When you define volumes with a `mountpoint` attribute, the system automatically assigns device names for each mountpoint. However, you can customize a mountpoint with your own device names. For example:

``` ini
[[node scheduler]]
  [[[configuration cyclecloud.mounts.data]]]
  mountpoint = /data
  Azure.LUN=0
```

In Azure, you assign devices by using [Logical Unit Numbers (LUN)](/powershell/module).

In most cases, Azure CycleCloud automatically assigns devices for you. Manually specifying devices is an advanced usage. It's helpful when the image you use for your node includes volumes that the image automatically attaches. Manually specifying devices is also helpful when the order of devices matters.

> [!NOTE]
> Use the reserved name `boot` to modify the built-in boot volume.

## Advanced usage

The previous example is a fairly simple one: mounting a single, pre-formatted snapshot to a node. However, you can use more advanced mounting techniques, including RAIDing multiple devices together, encrypting devices, and formatting new filesystems. For example, the following configuration RAIDs several volumes together and encrypts them before mounting them as a single device on a node:

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

This example shows that you attach three volumes to the node named `scheduler`, and their mountpoint is named `giant`. The configuration for the mountpoint says that you RAID these three volumes together using `raid_level = 0` for RAID0, format them using the `xfs` filesystem, and mount the resulting device at `/mnt/giant`. You also use block level encryption with 256-bit AES and define the encryption key in the template.

## Disk encryption
CycleCloud supports server-side encryption (SSE) for OS and data disk volumes using [Azure Disk Encryption Sets](/azure/virtual-machines/disk-encryption).
Azure uses _Platform Managed Keys_ (PMK) by default. To use _Customer Managed Keys_ (CMK), set up an Azure Disk Encryption Set and a Key Vault with your key.
See the documentation for [set up your Disk Encryption Set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal).  

Record the ``Resource ID`` of the Disk Encryption Set when you create it. You can find this ID in the Azure portal under **Properties** in the **Disk Encryption Sets** blade.

To apply SSE with CMK to your CycleCloud node's volumes, add the following code to your ``[[[volume]]]`` definition:

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
> CycleCloud 8.5 introduced the simplified syntax. For earlier versions, use `Azure.Encryption.DiskEncryptionSetId` instead:
>
> `Azure.Encryption.DiskEncryptionSetId = /subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/diskEncryptionSets/$DISK-ENCRYPTION-SET-NAME`.
> You don't need to set `Azure.Encryption.Type`.

CycleCloud 8.5 also supports [Confidential disk encryption](/azure/confidential-computing/confidential-vm-overview#confidential-os-disk-encryption). This scheme protects all critical partitions of the disk and makes the protected disk content accessible only to the VM. Confidential disk encryption is per disk and requires the *Security Encryption Type* to be set to `DiskWithVMGuestState`. 

For example, to use confidential encryption on the OS disk:

``` ini
[[node scheduler]]
  [[[volume boot]]]

  ConfidentialDiskEncryptionSetId = /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResouceGroup/providers/Microsoft.Compute/diskEncryptionSets/myCMKDiskEncryptionSet
  SecurityEncryptionType = DiskWithVMGuestState
```

For more information, see the [Volume Configuration Reference](../cluster-references/volume-reference.md).

## Mounting configuration options

| Option  | Definition  |
| ------  | ----------  |
| mountpoint            | The place where you mount the devices after applying any extra configuration. If you don't specify a mountpoint, the mount name becomes part of the mountpoint. For example, if you name your mount `data`, the mountpoint defaults to `/media/data`.|
| options               | Any non-default options to use when mounting the device. |
| fs_type               | The filesystem to use when formatting and/or mounting. Available options are: ext3, ext4, xfs.|
| size                  | The size of the filesystem to create when formatting the devices. If you omit this parameter, the command uses all the space on the device. Specify size using M for megabytes (for example, 150M for 150 MB), G for gigabytes (for example, 200G for 20 GB), or percentages (for example, 100% to use all of the available space).  |
| disabled              | If true, the mountpoint isn't created. This setting is useful for quickly toggling mounts for testing and to disable automatic ephemeral mounting. Default: false. |
| raid_level            | The type of RAID configuration to use when you use multiple devices or volumes. The default value is 0, which means RAID0. You can use other RAID levels such as 1 or 10.|
| raid_device_symlink   | When you create a RAID device, specify this attribute to create a symbolic link to the RAID device. By default, this attribute isn't set and no symlink is created. Set this attribute if you need access to the underlying RAID device. |
| devices               | List of devices that compose the mount point. In general, you don't need to specify this parameter because CycleCloud sets it for you based on [[[volume]]] sections. However, you can manually specify the devices if you want.    |
| vg_name               | On Linux, you configure devices using the Logical Volume Manager (LVM). The volume group name is automatically assigned, but you can set this attribute if you want to use a specific name. The default is `cyclecloud-vgX`, where X is an automatically assigned number. |
| lv_name               | Devices are configured on Linux using the Logical Volume Manager (LVM). The system automatically assigns this value, so you don't need to specify it. If you want to use a custom logical volume name, specify it with this attribute. Defaults to `lv0`.  |
| order                 | By specifying an order, you can control the order in which mountpoints are mounted. The default order value for all mountpoints is 1000, except for `ephemeral` which is 0 (`ephemeral` is always mounted first by default). You can override this behavior as needed. |
| encryption.bits       | The number of bits to use when encrypting the filesystem. Standard values are `128` or `256` bit AES encryption. You must provide this value if you want encryption. |
| encryption.key        | The encryption key to use when encrypting the filesystem. If you omit this key, the system generates a random 2,048-bit key. The automatically generated key is useful when you're encrypting disks that don't persist between reboots (for example, when encrypting ephemeral devices). |
| encryption.name       | The name of the encrypted filesystem, used when saving encryption keys. Defaults to `cyclecloud_cryptX`, where X is an automatically generated number. |
| encryption.key_path   | The location of the file where the key is written on disk. Defaults to `/root/cyclecloud_cryptX.key`, where X is an automatically generated number.  |

## Mounting configuration defaults

Use these options to set system defaults for mountpoints. The system uses these defaults unless you specify otherwise:

| Options  | Definition  |
| -------  | ----------  |
| cyclecloud.mount_defaults.fs_type          | The filesystem type to use for mounts if you don't specify one. Default: ext3 or ext4, depending on the platform.  |
| cyclecloud.mount_defaults.size             | The default filesystem size to use if you don't specify one. Default: 50 GB. |
| cyclecloud.mount_defaults.raid_level       | The default raid level to use if you assign multiple devices to the mountpoint. Default: 0 (RAID0). |
| cyclecloud.mount_defaults.encryption.bits  | The default encryption level if you don't specify one. Default: undefined.  |
