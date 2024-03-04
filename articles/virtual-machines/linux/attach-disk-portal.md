---
title: Attach a data disk to a Linux VM 
description: Use the portal to attach new or existing data disk to a Linux VM.
author: roygara
ms.service: azure-disk-storage
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 08/09/2023
ms.author: rogarana
ms.collection: linux
---
# Use the portal to attach a data disk to a Linux VM 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to attach both new and existing disks to a Linux virtual machine through the Azure portal. You can also [attach a data disk to a Windows VM in the Azure portal](../windows/attach-managed-disk-portal.md). 

Before you attach disks to your VM, review these tips:

* The size of the virtual machine controls how many data disks you can attach. For details, see [Sizes for virtual machines](../sizes.md).
* Disks attached to virtual machines are actually .vhd files stored in Azure. For details, see our [Introduction to managed disks](../managed-disks-overview.md).
* After attaching the disk, you need to [connect to the Linux VM to mount the new disk](#connect-to-the-linux-vm-to-mount-the-new-disk).


## Find the virtual machine
1. Go to the [Azure portal](https://portal.azure.com/) to find the VM. Search for and select **Virtual machines**.
2. Choose the VM from the list.
3. In the **Virtual machines** page, under **Settings**, choose **Disks**.


## Attach a new disk

1. On the **Disks** pane, under **Data disks**, select **Create and attach a new disk**.

1. Enter a name for your managed disk. Review the default settings, and update the **Storage type**, **Size (GiB)**, **Encryption** and **Host caching** as necessary.
   
   :::image type="content" source="./media/attach-disk-portal/create-new-md.png" alt-text="Review disk settings.":::


1. When you're done, select **Save** at the top of the page to create the managed disk and update the VM configuration.


## Attach an existing disk
1. On the **Disks** pane, under **Data disks**, select  **Attach existing disks**.
1. Select the drop-down menu for **Disk name** and select a disk from the list of available managed disks. 

1. Select **Save** to attach the existing managed disk and update the VM configuration:
   

## Connect to the Linux VM to mount the new disk
To partition, format, and mount your new disk so your Linux VM can use it, SSH into your VM. For more information, see [How to use SSH with Linux on Azure](mac-create-ssh-keys.md). The following example connects to a VM with the public IP address of *10.123.123.25* with the username *azureuser*: 

```bash
ssh azureuser@10.123.123.25
```

## Find the disk

Once connected to your VM, you need to find the disk. In this example, we're using `lsblk` to list the disks. 

```bash
lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i "sd"
```

The output is similar to the following example:

```output
sda     0:0:0:0      30G
├─sda1             29.9G /
├─sda14               4M
└─sda15             106M /boot/efi
sdb     1:0:1:0      14G
└─sdb1               14G /mnt
sdc     3:0:0:0       4G
```

In this example, the disk that was added was `sdc`. It's a LUN 0 and is 4GB.

For a more complex example, here's what multiple data disks look like in the portal:

:::image type="content" source="./media/attach-disk-portal/find-disk.png" alt-text="Screenshot of multiple disks shown in the portal.":::

In the image, you can see that there are 3 data disks: 4 GB on LUN 0, 16GB at LUN 1, and 32G at LUN 2.

Here's what that might look like using `lsblk`:

```output
sda     0:0:0:0      30G
├─sda1             29.9G /
├─sda14               4M
└─sda15             106M /boot/efi
sdb     1:0:1:0      14G
└─sdb1               14G /mnt
sdc     3:0:0:0       4G
sdd     3:0:0:1      16G
sde     3:0:0:2      32G
```

From the output of `lsblk` you can see that the 4GB disk at LUN 0 is `sdc`, the 16GB disk at LUN 1 is `sdd`, and the 32G disk at LUN 2 is `sde`.

### Prepare a new empty disk

> [!IMPORTANT]
> If you are using an existing disk that contains data, skip to [mounting the disk](#mount-the-disk). 
> The following instructions will delete data on the disk.

If you're attaching a new disk, you need to partition the disk.

The `parted` utility can be used to partition and to format a data disk.
- Use the latest version `parted` that is available for your distro.
- If the disk size is 2 tebibytes (TiB) or larger, you must use GPT partitioning. If disk size is under 2 TiB, then you can use either MBR or GPT partitioning.  


The following example uses `parted` on `/dev/sdc`, which is where the first data disk will typically be on most VMs. Replace `sdc` with the correct option for your disk. We're also formatting it using the [XFS](https://xfs.wiki.kernel.org/) filesystem.

```bash
sudo parted /dev/sdc --script mklabel gpt mkpart xfspart xfs 0% 100%
sudo mkfs.xfs /dev/sdc1
sudo partprobe /dev/sdc1
```

Use the [`partprobe`](https://linux.die.net/man/8/partprobe) utility to make sure the kernel is aware of the new partition and filesystem. Failure to use `partprobe` can cause the blkid or lslbk commands to not return the UUID for the new filesystem immediately.

### Mount the disk

Create a directory to mount the file system using `mkdir`. The following example creates a directory at `/datadrive`:

```bash
sudo mkdir /datadrive
```

Use `mount` to then mount the filesystem. The following example mounts the */dev/sdc1* partition to the `/datadrive` mount point:

```bash
sudo mount /dev/sdc1 /datadrive
```
To ensure that the drive is remounted automatically after a reboot, it must be added to the */etc/fstab* file. It's also highly recommended that the UUID (Universally Unique Identifier) is used in */etc/fstab* to refer to the drive rather than just the device name (such as, */dev/sdc1*). If the OS detects a disk error during boot, using the UUID avoids the incorrect disk being mounted to a given location. Remaining data disks would then be assigned those same device IDs. To find the UUID of the new drive, use the `blkid` utility:

```bash
sudo blkid
```

The output looks similar to the following example:

```output
/dev/sda1: LABEL="cloudimg-rootfs" UUID="11111111-1b1b-1c1c-1d1d-1e1e1e1e1e1e" TYPE="ext4" PARTUUID="1a1b1c1d-11aa-1234-1a1a1a1a1a1a"
/dev/sda15: LABEL="UEFI" UUID="BCD7-96A6" TYPE="vfat" PARTUUID="1e1g1cg1h-11aa-1234-1u1u1a1a1u1u"
/dev/sdb1: UUID="22222222-2b2b-2c2c-2d2d-2e2e2e2e2e2e" TYPE="ext4" TYPE="ext4" PARTUUID="1a2b3c4d-01"
/dev/sda14: PARTUUID="2e2g2cg2h-11aa-1234-1u1u1a1a1u1u"
/dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="xfs" PARTLABEL="xfspart" PARTUUID="c1c2c3c4-1234-cdef-asdf3456ghjk"
```

> [!NOTE]
> Improperly editing the **/etc/fstab** file could result in an unbootable system. If unsure, refer to the distribution's documentation for information on how to properly edit this file. You should create a backup of the **/etc/fstab** file is created before editing.

Next, open the **/etc/fstab** file in a text editor. Add a line to the end of the file, using the UUID value for the `/dev/sdc1` device that was created in the previous steps, and the mountpoint of `/datadrive`. Using the example from this article, the new line would look like the following:

```config
UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   xfs   defaults,nofail   1   2
```

When you're done editing the file, save and close the editor.

> [!NOTE]
> Later removing a data disk without editing fstab could cause the VM to fail to boot. Most distributions provide either the *nofail* and/or *nobootwait* fstab options. These options allow a system to boot even if the disk fails to mount at boot time. Consult your distribution's documentation for more information on these parameters.
> 
> The *nofail* option ensures that the VM starts even if the filesystem is corrupt or the disk does not exist at boot time. Without this option, you may encounter behavior as described in [Cannot SSH to Linux VM due to FSTAB errors](/archive/blogs/linuxonazure/cannot-ssh-to-linux-vm-after-adding-data-disk-to-etcfstab-and-rebooting)


## Verify the disk

You can now use `lsblk` again to see the disk and the mountpoint.

```bash
lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i "sd"
```

The output will look something like this:

```output
sda     0:0:0:0      30G
├─sda1             29.9G /
├─sda14               4M
└─sda15             106M /boot/efi
sdb     1:0:1:0      14G
└─sdb1               14G /mnt
sdc     3:0:0:0       4G
└─sdc1                4G /datadrive
```

You can see that `sdc` is now mounted at `/datadrive`.

### TRIM/UNMAP support for Linux in Azure

Some Linux kernels support TRIM/UNMAP operations to discard unused blocks on the disk. This feature is primarily useful to inform Azure that deleted pages are no longer valid and can be discarded. This feature can save money on disks that are billed based on the amount of consumed storage, such as unmanaged standard disks and disk snapshots.

There are two ways to enable TRIM support in your Linux VM. As usual, consult your distribution for the recommended approach:

* Use the `discard` mount option in */etc/fstab*, for example:

    ```config
    UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   xfs   defaults,discard   1   2
    ```
* In some cases, the `discard` option may have performance implications. Alternatively, you can run the `fstrim` command manually from the command line, or add it to your crontab to run regularly:
  
# [Ubuntu](#tab/ubuntu)

```bash
sudo apt-get install util-linux
sudo fstrim /datadrive
```

# [RHEL](#tab/rhel)

```bash
sudo yum install util-linux
sudo fstrim /datadrive
```

# [SUSE](#tab/suse)

```bash
sudo zypper install util-linux
sudo fstrim /datadrive
```
---

## Next steps

For more information, and to help troubleshoot disk issues, see [Troubleshoot Linux VM device name changes](/troubleshoot/azure/virtual-machines/troubleshoot-device-names-problems).

You can also [attach a data disk](add-disk.md) using the Azure CLI.
