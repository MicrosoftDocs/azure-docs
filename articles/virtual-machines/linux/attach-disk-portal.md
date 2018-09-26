---
title: Attach a data disk to a Linux VM | Microsoft Docs
description: Use the portal to attach new or existing data disk to a Linux VM.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 5e1c6212-976c-4962-a297-177942f90907
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 07/12/2018
ms.author: cynthn

---
# Use the portal to attach a data disk to a Linux VM 
This article shows you how to attach both new and existing disks to a Linux virtual machine through the Azure portal. You can also [attach a data disk to a Windows VM in the Azure portal](../windows/attach-managed-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

Before you attach disks to your VM, review these tips:

* The size of the virtual machine controls how many data disks you can attach. For details, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* To use Premium storage, you need a DS-series or GS-series virtual machine. You can use both Premium and Standard disks with these virtual machines. Premium storage is available in certain regions. For details, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../windows/premium-storage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* Disks attached to virtual machines are actually .vhd files stored in Azure. For details, see [About disks and VHDs for virtual machines](about-disks-and-vhds.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* After attaching the disk, you need to [connect to the Linux VM to mount the new disk](#connect-to-the-linux-vm-to-mount-the-new-disk).


## Find the virtual machine
1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the left menu, click **Virtual Machines**.
3. Select the virtual machine from the list.
4. To the Virtual machines page, in **Essentials**, click **Disks**.
   
    ![Open disk settings](./media/attach-disk-portal/find-disk-settings.png)


## Attach a new disk

1. On the **Disks** pane, click **+ Add data disk**.
2. Click the drop-down menu for **Name** and select **Create disk**:

    ![Create Azure managed disk](./media/attach-disk-portal/create-new-md.png)

3. Enter a name for your managed disk. Review the default settings, update as necessary, and then click **Create**.
   
   ![Review disk settings](./media/attach-disk-portal/create-new-md-settings.png)

4. Click **Save** to create the managed disk and update the VM configuration:

   ![Save new Azure Managed Disk](./media/attach-disk-portal/confirm-create-new-md.png)

5. After Azure creates the disk and attaches it to the virtual machine, the new disk is listed in the virtual machine's disk settings under **Data Disks**. As managed disks are a top-level resource, the disk appears at the root of the resource group:

   ![Azure Managed Disk in resource group](./media/attach-disk-portal/view-md-resource-group.png)

## Attach an existing disk
1. On the **Disks** pane, click **+ Add data disk**.
2. Click the drop-down menu for **Name** to view a list of existing managed disks accessible to your Azure subscription. Select the managed disk to attach:

   ![Attach existing Azure Managed Disk](./media/attach-disk-portal/select-existing-md.png)

3. Click **Save** to attach the existing managed disk and update the VM configuration:
   
   ![Save Azure Managed Disk updates](./media/attach-disk-portal/confirm-attach-existing-md.png)

4. After Azure attaches the disk to the virtual machine, it's listed in the virtual machine's disk settings under **Data Disks**.

## Connect to the Linux VM to mount the new disk
To partition, format, and mount your new disk so your Linux VM can use it, SSH into your VM. For more information, see [How to use SSH with Linux on Azure](mac-create-ssh-keys.md). The following example connects to a VM with the public DNS entry of *mypublicdns.westus.cloudapp.azure.com* with the username *azureuser*: 

```bash
ssh azureuser@mypublicdns.westus.cloudapp.azure.com
```

Once connected to your VM, you're ready to attach a disk. First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

```bash
dmesg | grep SCSI
```

The output is similar to the following example:

```bash
[    0.344460] SCSI subsystem initialized
[    0.819969] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 247)
[    1.057449] sd 1:0:1:0: [sdb] Attached SCSI disk
[    1.101998] sd 0:0:0:0: [sda] Attached SCSI disk
[    1.253212] sd 3:0:0:1: [sdd] Attached SCSI disk
[    1.318284] sd 3:0:0:0: [sdc] Attached SCSI disk
[   11.339570] Loading iSCSI transport class v2.0-870.
```
You can confirm current disk mount status using `df -h` command.

```bash
df -h
```

The output is similar to the following example:

``` bash
Filesystem      Size  Used Avail Use% Mounted on
udev             28G     0   28G   0% /dev
tmpfs           5.6G  9.0M  5.5G   1% /run
/dev/sda1        49G   37G   12G  76% /
tmpfs            28G     0   28G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs            28G     0   28G   0% /sys/fs/cgroup
/dev/sdc1        99G   14G   80G  15% /data
/dev/sdb1       335G   67M  318G   1% /mnt
tmpfs           5.6G     0  5.6G   0% /run/user/1003
```

Here, you can see the gap of mounted disk and not. Here, *sdd* is the disk that we want. Partition the disk with `fdisk`, make it a primary disk on partition 1, and accept the other defaults. The following example starts the `fdisk` process on */dev/sdd*:

```bash
sudo fdisk /dev/sdd
```

Use the `n` command to add a new partition. In this example, we also choose `p` for a primary partition and accept the rest of the default values. The output will be similar to the following example:

```bash
Welcome to fdisk (util-linux 2.27.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0xbb806b11.

Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
Partition number (1-4, default 1): 1
First sector (2048-2145386495, default 2048):
Last sector, +sectors or +size{K,M,G,T,P} (2048-2145386495, default 2145386495):

Created a new partition 1 of type 'Linux' and of size 1023 GiB.
```

Print the partition table by typing `p` and then use `w` to write the table to disk and exit. The output should look similar to the following example:

```bash
Command (m for help): p
Disk /dev/sdd: 1023 GiB, 1098437885952 bytes, 2145386496 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xbb806b11

Device     Boot Start        End    Sectors  Size Id Type
/dev/sdd1        2048 2145386495 2145384448 1023G 83 Linux

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

Now, write a file system to the partition with the `mkfs` command. Specify your filesystem type and the device name. The following example creates an *ext4* filesystem on the */dev/sdc1* partition that was created in the preceding steps:

```bash
sudo mkfs -t ext4 /dev/sdd1
```

The output is similar to the following example:

```bash
mke2fs 1.42.13 (17-May-2015)
Creating filesystem with 268173056 4k blocks and 67043328 inodes
Filesystem UUID: a26cbd10-75bf-497d-bed3-877833b833b3
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968,
        102400000, 214990848

Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done
```

Now, create a directory to mount the file system using `mkdir`. The following example creates a directory at */datadrive*:

```bash
sudo mkdir /datadrive
```

Use `mount` to then mount the filesystem. The following example mounts the */dev/sdc1* partition to the */datadrive* mount point:

```bash
sudo mount /dev/sdd1 /datadrive
```

To ensure that the drive is remounted automatically after a reboot, it must be added to the */etc/fstab* file. It is also highly recommended that the UUID (Universally Unique IDentifier) is used in */etc/fstab* to refer to the drive rather than just the device name (such as, */dev/sdc1*). If the OS detects a disk error during boot, using the UUID avoids the incorrect disk being mounted to a given location. Remaining data disks would then be assigned those same device IDs. To find the UUID of the new drive, use the `blkid` utility:

```bash
sudo -i blkid
```

The output looks similar to the following example:

```bash
/dev/sda1: UUID="11111111-1b1b-1c1c-1d1d-1e1e1e1e1e1e" TYPE="ext4"
/dev/sdb1: UUID="22222222-2b2b-2c2c-2d2d-2e2e2e2e2e2e" TYPE="ext4"
/dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4"
/dev/sdd1: UUID="44444444-4b4b-4c4c-4d4d-4e4e4e4e4e4e" TYPE="ext4"
```

> [!NOTE]
> Improperly editing the **/etc/fstab** file could result in an unbootable system. If unsure, refer to the distribution's documentation for information on how to properly edit this file. It is also recommended that a backup of the /etc/fstab file is created before editing.

Next, open the */etc/fstab* file in a text editor as follows:

```bash
sudo vi /etc/fstab
```

In this example, use the UUID value for the */dev/sd1* device that was created in the previous steps, and the mountpoint of */datadrive*. Add the following line to the end of the */etc/fstab* file:

```bash
UUID=44444444-4b4b-4c4c-4d4d-4e4e4e4e4e4e   /datadrive   ext4   defaults,nofail   1   2
```

> [!NOTE]
> Later removing a data disk without editing fstab could cause the VM to fail to boot. Most distributions provide either the *nofail* and/or *nobootwait* fstab options. These options allow a system to boot even if the disk fails to mount at boot time. Consult your distribution's documentation for more information on these parameters.
> 
> The *nofail* option ensures that the VM starts even if the filesystem is corrupt or the disk does not exist at boot time. Without this option, you may encounter behavior as described in [Cannot SSH to Linux VM due to FSTAB errors](https://blogs.msdn.microsoft.com/linuxonazure/2016/07/21/cannot-ssh-to-linux-vm-after-adding-data-disk-to-etcfstab-and-rebooting/)

### TRIM/UNMAP support for Linux in Azure
Some Linux kernels support TRIM/UNMAP operations to discard unused blocks on the disk. This feature is primarily useful in standard storage to inform Azure that deleted pages are no longer valid and can be discarded, and can save money if you create large files and then delete them.

There are two ways to enable TRIM support in your Linux VM. As usual, consult your distribution for the recommended approach:

* Use the `discard` mount option in */etc/fstab*, for example:

    ```bash
    UUID=44444444-4b4b-4c4c-4d4d-4e4e4e4e4e4e   /datadrive   ext4   defaults,discard   1   2
    ```
* In some cases, the `discard` option may have performance implications. Alternatively, you can run the `fstrim` command manually from the command line, or add it to your crontab to run regularly:
  
    **Ubuntu**
  
    ```bash
    sudo apt-get install util-linux
    sudo fstrim /datadrive
    ```
  
    **RHEL/CentOS**

    ```bash
    sudo yum install util-linux
    sudo fstrim /datadrive
    ```

## Next steps
You can also [attach a data disk](add-disk.md) using the Azure CLI.
