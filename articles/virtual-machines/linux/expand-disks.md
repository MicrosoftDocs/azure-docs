---
title: Expand virtual hard disks on a Linux VM
description: Learn how to expand virtual hard disks on a Linux VM with the Azure CLI.
author: pagienge
ms.service: storage
ms.collection: linux
ms.topic: how-to
ms.date: 02/07/2023
ms.author: pagienge
ms.subservice: disks
ms.custom: references_regions, ignite-fall-2021, devx-track-azurecli 
---

# Expand virtual hard disks on a Linux VM

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article describes how to expand managed disks for a Linux virtual machine (VM). You can [add data disks](add-disk.md) to provide for additional storage space, and you can also expand an existing data disk. The default virtual hard disk size for the operating system (OS) is typically 30 GB on a Linux VM in Azure. This article covers expanding either OS disks or data disks.

> [!WARNING]
> Always make sure that your filesystem is in a healthy state, your disk partition table type (GPT or MBR) will support the new size, and ensure your data is backed up before you perform disk expansion operations. For more information, see the [Azure Backup quickstart](../../backup/quick-backup-vm-portal.md). 

## <a id="identifyDisk"></a>Identify Azure data disk object within the operating system ##

In the case of expanding a data disk when there are several data disks present on the VM, it may be difficult to relate the Azure LUNs to the Linux devices.  If the OS disk needs expansion, it will be clearly labeled in the Azure portal as the OS disk.

Start by identifying the relationship between disk utilization, mount point, and device, with the ```df``` command.

```bash
df -Th
```

```output
Filesystem                Type      Size  Used Avail Use% Mounted on
/dev/sda1                 xfs        97G  1.8G   95G   2% /
<truncated>
/dev/sdd1                 ext4       32G   30G  727M  98% /opt/db/data
/dev/sde1                 ext4       32G   49M   30G   1% /opt/db/log
```

Here we can see, for example, the `/opt/db/data` filesystem is nearly full, and is located on the `/dev/sdd1` partition.  The output of `df` will show the device path regardless of whether the disk is mounted by device path or the (preferred) UUID in the fstab.  Also take note of the Type column, indicating the format of the filesystem.  This will be important later.

Now locate the LUN which correlates to `/dev/sdd` by examining the contents of `/dev/disk/azure/scsi1`.  The output of the following `ls` command will show that the device known as `/dev/sdd` within the Linux OS is located at LUN1 when looking in the Azure portal.

```bash
sudo ls -alF /dev/disk/azure/scsi1/
```

```output
total 0
drwxr-xr-x. 2 root root 140 Sep  9 21:54 ./
drwxr-xr-x. 4 root root  80 Sep  9 21:48 ../
lrwxrwxrwx. 1 root root  12 Sep  9 21:48 lun0 -> ../../../sdc
lrwxrwxrwx. 1 root root  12 Sep  9 21:48 lun1 -> ../../../sdd
lrwxrwxrwx. 1 root root  13 Sep  9 21:48 lun1-part1 -> ../../../sdd1
lrwxrwxrwx. 1 root root  12 Sep  9 21:54 lun2 -> ../../../sde
lrwxrwxrwx. 1 root root  13 Sep  9 21:54 lun2-part1 -> ../../../sde1
```

## Expand an Azure Managed Disk

### Expand without downtime

You can expand your managed disks without deallocating your VM. The host cache setting of your disk doesn't change whether or not you can expand a data disk without deallocating your VM.

This feature has the following limitations:

[!INCLUDE [virtual-machines-disks-expand-without-downtime-restrictions](../../../includes/virtual-machines-disks-expand-without-downtime-restrictions.md)]

### Expand Azure Managed Disk

Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and are signed in to an Azure account by using [az login](/cli/azure/reference-index#az-login).

This article requires an existing VM in Azure with at least one data disk attached and prepared. If you don't already have a VM that you can use, see [Create and prepare a VM with data disks](tutorial-manage-disks.md#create-and-attach-disks).

In the following samples, replace example parameter names such as *myResourceGroup* and *myVM* with your own values.

> [!IMPORTANT]
> If your disk meets the requirements in [Expand without downtime](#expand-without-downtime), you can skip step 1 and 3.

1. Operations on virtual hard disks can't be performed with the VM running. Deallocate your VM with [az vm deallocate](/cli/azure/vm#az-vm-deallocate). The following example deallocates the VM named *myVM* in the resource group named *myResourceGroup*:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

    > [!NOTE]
    > The VM must be deallocated to expand the virtual hard disk. Stopping the VM with `az vm stop` doesn't release the compute resources. To release compute resources, use `az vm deallocate`.

1. View a list of managed disks in a resource group with [az disk list](/cli/azure/disk#az-disk-list). The following example displays a list of managed disks in the resource group named *myResourceGroup*:

    ```azurecli
    az disk list \
        --resource-group myResourceGroup \
        --query '[*].{Name:name,Gb:diskSizeGb,Tier:accountType}' \
        --output table
    ```

    Expand the required disk with [az disk update](/cli/azure/disk#az-disk-update). The following example expands the managed disk named *myDataDisk* to *200* GB:

    ```azurecli
    az disk update \
        --resource-group myResourceGroup \
        --name myDataDisk \
        --size-gb 200
    ```

    > [!NOTE]
    > When you expand a managed disk, the updated size is rounded up to the nearest managed disk size. For a table of the available managed disk sizes and tiers, see [Azure Managed Disks Overview - Pricing and Billing](../managed-disks-overview.md).

1. Start your VM with [az vm start](/cli/azure/vm#az-vm-start). The following example starts the VM named *myVM* in the resource group named *myResourceGroup*:

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Expand a disk partition and filesystem
> [!NOTE]
> While there are many tools that may be used for performing the partition resizing, the tools detailed in the remainder of this document are the same tools used by certain automated processes such as cloud-init.  As described here, the  `growpart` tool with the `gdisk` package provides universal compatibility with GUID Partition Table (GPT) disks, as older versions of some tools such as `fdisk` did not support GPT.

### Detecting a changed disk size

If a data disk was expanded without downtime using the procedure mentioned previously, the disk size won't be changed until the device is rescanned, which normally only happens during the boot process. This rescan can be called on-demand with the following procedure.  In this example we have detected using the methods in this document that the data disk is currently `/dev/sda` and has been resized from 256GB to 512GB.

1. Identify the currently recognized size on the first line of output from `fdisk -l /dev/sda`

   ```bash
   sudo fdisk -l /dev/sda
   ```

   ```output
   Disk /dev/sda: 256 GiB, 274877906944 bytes, 536870912 sectors
   Disk model: Virtual Disk
   Units: sectors of 1 * 512 = 512 bytes
   Sector size (logical/physical): 512 bytes / 4096 bytes
   I/O size (minimum/optimal): 4096 bytes / 4096 bytes
   Disklabel type: dos
   Disk identifier: 0x43d10aad
   
   Device     Boot Start       End   Sectors  Size Id Type
   /dev/sda1        2048 536870878 536868831  256G 83 Linux
   ```

1. Insert a `1` character into the rescan file for this device.  Note the reference to sda, this would change if a different disk device was resized.

   ```bash
   sudo echo 1 > /sys/class/block/sda/device/rescan
   ```

1. Verify that the new disk size has been recognized

   ```bash
   sudo fdisk -l /dev/sda
   ```

   ```output
   Disk /dev/sda: 512 GiB, 549755813888 bytes, 1073741824 sectors
   Disk model: Virtual Disk
   Units: sectors of 1 * 512 = 512 bytes
   Sector size (logical/physical): 512 bytes / 4096 bytes
   I/O size (minimum/optimal): 4096 bytes / 4096 bytes
   Disklabel type: dos
   Disk identifier: 0x43d10aad
   
   Device     Boot Start       End   Sectors  Size Id Type
   /dev/sda1        2048 536870878 536868831  256G 83 Linux
   ```

The remainder of this article uses the OS disk for the examples of the procedure for increasing the size of a volume at the OS level.  If the expanded disk is a data disk, use the [previous guidance for identifying the data disk device](#identifyDisk), and follow these instructions as a guideline, substituting the data disk device (for example `/dev/sda`), partition numbers, volume names, mount points, and filesystem formats, as necessary.

All Linux OS guidance should be viewed as generic and may apply on any distribution, but generally matches the conventions of the named marketplace publisher.  Reference the Red Hat documents for the package requirements on any distribution claiming Red Hat compatibility, such as CentOS and Oracle.

### Increase the size of the OS disk

The following instructions apply to endorsed Linux distributions.

> [!NOTE]
> Before you proceed, make a full backup copy of your VM, or at a minimum take a snapshot of your OS disk.

# [Ubuntu](#tab/ubuntu)

On Ubuntu 16.x and newer, the root partition of the OS disk and filesystems will be automatically expanded to utilize all free contiguous space on the root disk by cloud-init, provided there's a small bit of free space for the resize operation.  For this circumstance the sequence is simply

1. Increase the size of the OS disk as detailed previously
1. Restart the VM, and then access the VM using the **root** user account.
1. Verify that the OS disk now displays an increased file system size.

As shown in the following example, the OS disk has been resized from the portal to 100 GB. The **/dev/sda1** file system mounted on **/** now displays 97 GB.

```bash
df -Th
```

```output
Filesystem     Type      Size  Used Avail Use% Mounted on
udev           devtmpfs  314M     0  314M   0% /dev
tmpfs          tmpfs      65M  2.3M   63M   4% /run
/dev/sda1      ext4       97G  1.8G   95G   2% /
tmpfs          tmpfs     324M     0  324M   0% /dev/shm
tmpfs          tmpfs     5.0M     0  5.0M   0% /run/lock
tmpfs          tmpfs     324M     0  324M   0% /sys/fs/cgroup
/dev/sda15     vfat      105M  3.6M  101M   4% /boot/efi
/dev/sdb1      ext4       20G   44M   19G   1% /mnt
tmpfs          tmpfs      65M     0   65M   0% /run/user/1000
user@ubuntu:~#
```

# [SUSE](#tab/suse)

To increase the OS disk size in SUSE 12 SP4, SUSE SLES 12 for SAP, SUSE SLES 15, and SUSE SLES 15 for SAP:

1. Follow the procedure above to expand the disk in the Azure infrastructure.

1. Access your VM as the **root** user by using the ```sudo``` command after logging in as another user:

   ```bash
   sudo -i
   ```

1. Use the following command to install the **growpart** package, which will be used to resize the partition, if it isn't already present:

   ```bash
   zypper install growpart
   ```

1. Use the `lsblk` command to find the partition mounted on the root of the file system (**/**). In this case, we see that partition 4 of device **sda** is mounted on **/**:

   ```bash
   lsblk
   ```

   ```output
   NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
   sda      8:0    0   48G  0 disk
   ├─sda1   8:1    0    2M  0 part
   ├─sda2   8:2    0  512M  0 part /boot/efi
   ├─sda3   8:3    0    1G  0 part /boot
   └─sda4   8:4    0 28.5G  0 part /
   sdb      8:16   0    4G  0 disk
   └─sdb1   8:17   0    4G  0 part /mnt/resource
   ```

1. Resize the required partition by using the `growpart` command and the partition number determined in the preceding step:

   ```bash
   growpart /dev/sda 4
   ```

   ```output
   CHANGED: partition=4 start=3151872 old: size=59762655 end=62914527 new: size=97511391 end=100663263
   ```

1. Run the `lsblk` command again to check whether the partition has been increased.

   The following output shows that the **/dev/sda4** partition has been resized to 46.5 GB:

   ```bash
   lsblk
   ```

   ```output
   NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
   sda      8:0    0   48G  0 disk
   ├─sda1   8:1    0    2M  0 part
   ├─sda2   8:2    0  512M  0 part /boot/efi
   ├─sda3   8:3    0    1G  0 part /boot
   └─sda4   8:4    0 46.5G  0 part /
   sdb      8:16   0    4G  0 disk
   └─sdb1   8:17   0    4G  0 part /mnt/resource
   ```

1. Identify the type of file system on the OS disk by using the `lsblk` command with the `-f` flag:

   ```bash
   lsblk -f
   ```

   ```output
   NAME   FSTYPE LABEL UUID                                 MOUNTPOINT
   sda
   ├─sda1
   ├─sda2 vfat   EFI   AC67-D22D                            /boot/efi
   ├─sda3 xfs    BOOT  5731a128-db36-4899-b3d2-eb5ae8126188 /boot
   └─sda4 xfs    ROOT  70f83359-c7f2-4409-bba5-37b07534af96 /
   sdb
   └─sdb1 ext4         8c4ca904-cd93-4939-b240-fb45401e2ec6 /mnt/resource
   ```

1. Based on the file system type, use the appropriate commands to resize the file system.

   For **xfs**, use this command:

   ```bash
   xfs_growfs /
   ```

   Example output:

   ```output
   meta-data=/dev/sda4              isize=512    agcount=4, agsize=1867583 blks
            =                       sectsz=512   attr=2, projid32bit=1
            =                       crc=1        finobt=0 spinodes=0 rmapbt=0
            =                       reflink=0
   data     =                       bsize=4096   blocks=7470331, imaxpct=25
            =                       sunit=0      swidth=0 blks
   naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
   log      =internal               bsize=4096   blocks=3647, version=2
            =                       sectsz=512   sunit=0 blks, lazy-count=1
   realtime =none                   extsz=4096   blocks=0, rtextents=0
   data blocks changed from 7470331 to 12188923
   ```

   For **ext4**, use this command:

   ```bash
   resize2fs /dev/sda4
   ```

1. Verify the increased file system size for **df -Th** by using this command:

   ```bash
   df -Thl
   ```

   Example output:

   ```output
   Filesystem     Type      Size  Used Avail Use% Mounted on
   devtmpfs       devtmpfs  445M  4.0K  445M   1% /dev
   tmpfs          tmpfs     458M     0  458M   0% /dev/shm
   tmpfs          tmpfs     458M   14M  445M   3% /run
   tmpfs          tmpfs     458M     0  458M   0% /sys/fs/cgroup
   /dev/sda4      xfs        47G  2.2G   45G   5% /
   /dev/sda3      xfs      1014M   86M  929M   9% /boot
   /dev/sda2      vfat      512M  1.1M  511M   1% /boot/efi
   /dev/sdb1      ext4      3.9G   16M  3.7G   1% /mnt/resource
   tmpfs          tmpfs      92M     0   92M   0% /run/user/1000
   tmpfs          tmpfs      92M     0   92M   0% /run/user/490
   ```

   In the preceding example, we can see that the file system size for the OS disk has been increased.

# [Red Hat/CentOS with LVM](#tab/rhellvm)

1. Follow the procedure above to expand the disk in the Azure infrastructure.

1. Access your VM as the **root** user by using the ```sudo``` command after logging in as another user:

   ```bash
   sudo -i
   ```

1. Use the `lsblk` command to determine which logical volume (LV) is mounted on the root of the file system (**/**). In this case, we see that **rootvg-rootlv** is mounted on **/**. If a different filesystem is in need of resizing, substitute the LV and mount point throughout this section.

   ```bash
   lsblk -f
   ```

   ```output
   NAME                  FSTYPE      LABEL   UUID                                   MOUNTPOINT
   fd0
   sda
   ├─sda1                vfat                C13D-C339                              /boot/efi
   ├─sda2                xfs                 8cc4c23c-fa7b-4a4d-bba8-4108b7ac0135   /boot
   ├─sda3
   └─sda4                LVM2_member         zx0Lio-2YsN-ukmz-BvAY-LCKb-kRU0-ReRBzh
      ├─rootvg-tmplv      xfs                 174c3c3a-9e65-409a-af59-5204a5c00550   /tmp
      ├─rootvg-usrlv      xfs                 a48dbaac-75d4-4cf6-a5e6-dcd3ffed9af1   /usr
      ├─rootvg-optlv      xfs                 85fe8660-9acb-48b8-98aa-bf16f14b9587   /opt
      ├─rootvg-homelv     xfs                 b22432b1-c905-492b-a27f-199c1a6497e7   /home
      ├─rootvg-varlv      xfs                 24ad0b4e-1b6b-45e7-9605-8aca02d20d22   /var
      └─rootvg-rootlv     xfs                 4f3e6f40-61bf-4866-a7ae-5c6a94675193   /
   ```

1. Check whether there's free space in the LVM volume group (VG) containing the root partition.  If there's free space, skip to step 12.

   ```bash
   vgdisplay rootvg
   ```

   ```output
   --- Volume group ---
   VG Name               rootvg
   System ID
   Format                lvm2
   Metadata Areas        1
   Metadata Sequence No  7
   VG Access             read/write
   VG Status             resizable
   MAX LV                0
   Cur LV                6
   Open LV               6
   Max PV                0
   Cur PV                1
   Act PV                1
   VG Size               <63.02 GiB
   PE Size               4.00 MiB
   Total PE              16132
   Alloc PE / Size       6400 / 25.00 GiB
   Free  PE / Size       9732 / <38.02 GiB
   VG UUID               lPUfnV-3aYT-zDJJ-JaPX-L2d7-n8sL-A9AgJb
   ```

   In this example, the line **Free  PE / Size** shows that there's 38.02 GB free in the volume group, as the disk has already been resized.

1. Install the **cloud-utils-growpart** package to provide the **growpart** command, which is required to increase the size of the OS disk and the gdisk handler for GPT disk layouts  This package is preinstalled on most marketplace images

   ```bash
   yum install cloud-utils-growpart gdisk
   ```

   In RHEL/CentOS 8.x VMs you can use `dnf` command instead of `yum`.

1. Determine which disk and partition holds the LVM physical volume (PV) or volumes in the volume group named **rootvg** by using the **pvscan** command. Note the size and free space listed between the brackets (**[** and **]**).

   ```bash
   pvscan
   ```

   ```output
   PV /dev/sda4   VG rootvg          lvm2 [<63.02 GiB / <38.02 GiB free]
   ```

1. Verify the size of the partition by using `lsblk`.

   ```bash
   lsblk /dev/sda4
   ```

   ```output
   NAME            MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
   sda4              8:4    0  63G  0 part
   ├─rootvg-tmplv  253:1    0   2G  0 lvm  /tmp
   ├─rootvg-usrlv  253:2    0  10G  0 lvm  /usr
   ├─rootvg-optlv  253:3    0   2G  0 lvm  /opt
   ├─rootvg-homelv 253:4    0   1G  0 lvm  /home
   ├─rootvg-varlv  253:5    0   8G  0 lvm  /var
   └─rootvg-rootlv 253:6    0   2G  0 lvm  /
   ```

1. Expand the partition containing this PV using *growpart*, the device name, and partition number. Doing so will expand the specified partition to use all the free contiguous space on the device.

   ```bash
   growpart /dev/sda 4
   ```

   ```output
   CHANGED: partition=4 start=2054144 old: size=132161536 end=134215680 new: size=199272414 end=201326558
   ```

1. Verify that the partition has resized to the expected size by using the `lsblk` command again. Notice that in the example **sda4** has changed from 63G to 95G.

   ```bash
   lsblk /dev/sda4
   ```

   ```output
   NAME            MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
   sda4              8:4    0  95G  0 part
   ├─rootvg-tmplv  253:1    0   2G  0 lvm  /tmp
   ├─rootvg-usrlv  253:2    0  10G  0 lvm  /usr
   ├─rootvg-optlv  253:3    0   2G  0 lvm  /opt
   ├─rootvg-homelv 253:4    0   1G  0 lvm  /home
   ├─rootvg-varlv  253:5    0   8G  0 lvm  /var
   └─rootvg-rootlv 253:6    0   2G  0 lvm  /
   ```

1. Expand the PV to use the rest of the newly expanded partition

   ```bash
   pvresize /dev/sda4
   ```

   ```output
   Physical volume "/dev/sda4" changed
   1 physical volume(s) resized or updated / 0 physical volume(s) not resized
   ```

1. Verify the new size of the PV is the expected size, comparing to original **[size / free]** values.

   ```bash
   pvscan
   ```

   ```output
   PV /dev/sda4   VG rootvg          lvm2 [<95.02 GiB / <70.02 GiB free]
   ```

1. Expand the LV by the required amount, which doesn't need to be all the free space in the volume group.  In the following example, **/dev/mapper/rootvg-rootlv** is resized from 2 GB to 12 GB (an increase of 10 GB) through the following command. This command will also resize the file system on the LV.

   ```bash
   lvresize -r -L +10G /dev/mapper/rootvg-rootlv
   ```

   Example output:

   ```output
   Size of logical volume rootvg/rootlv changed from 2.00 GiB (512 extents) to 12.00 GiB (3072 extents).
   Logical volume rootvg/rootlv successfully resized.
   meta-data=/dev/mapper/rootvg-rootlv isize=512    agcount=4, agsize=131072 blks
            =                       sectsz=4096  attr=2, projid32bit=1
            =                       crc=1        finobt=0 spinodes=0
   data     =                       bsize=4096   blocks=524288, imaxpct=25
            =                       sunit=0      swidth=0 blks
   naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
   log      =internal               bsize=4096   blocks=2560, version=2
            =                       sectsz=4096  sunit=1 blks, lazy-count=1
   realtime =none                   extsz=4096   blocks=0, rtextents=0
   data blocks changed from 524288 to 3145728
   ```

1. The `lvresize` command automatically calls the appropriate resize command for the filesystem in the LV. Verify whether **/dev/mapper/rootvg-rootlv**, which is mounted on **/**, has an increased file system size by using the `df -Th` command:

   Example output:

   ```bash
   df -Th /
   ```

   ```output
   Filesystem                Type  Size  Used Avail Use% Mounted on
   /dev/mapper/rootvg-rootlv xfs    12G   71M   12G   1% /
   ```

> [!NOTE]
> To use the same procedure to resize any other logical volume, change the **lv** name in step **12**.

# [Red Hat/CentOS without LVM](#tab/rhelraw)

1. Follow the procedure above to expand the disk in the Azure infrastructure.

1. Access your VM as the **root** user by using the ```sudo``` command after logging in as another user:

   ```bash
   sudo -i
   ```

1. When the VM has restarted, perform the following steps:

   1. Install the **cloud-utils-growpart** package to provide the **growpart** command, which is required to increase the size of the OS disk and the gdisk handler for GPT disk layouts. This package is preinstalled on most marketplace images

   ```bash
   yum install cloud-utils-growpart gdisk
   ```

   In RHEL/CentOS 8.x VMs you can use `dnf` command instead of `yum`.

1. Use the **lsblk -f** command to verify the partition and filesystem type holding the root (**/**) partition

   ```bash
   lsblk -f
   ```

   ```output
   NAME    FSTYPE LABEL UUID                                 MOUNTPOINT
   sda
   ├─sda1  xfs          2a7bb59d-6a71-4841-a3c6-cba23413a5d2 /boot
   ├─sda2  xfs          148be922-e3ec-43b5-8705-69786b522b05 /
   ├─sda14
   └─sda15 vfat         788D-DC65                            /boot/efi
   sdb
   └─sdb1  ext4         923f51ff-acbd-4b91-b01b-c56140920098 /mnt/resource
   ```

1. For verification, start by listing the partition table of the sda disk with **gdisk**.  In this example, we see a 48.0 GiB disk with partition #2 sized 29.0 GiB.  The disk was expanded from 30 GB to 48 GB in the Azure portal.

   ```bash
   gdisk -l /dev/sda
   ```

   ```output
   GPT fdisk (gdisk) version 0.8.10

   Partition table scan:
   MBR: protective
   BSD: not present
   APM: not present
   GPT: present

   Found valid GPT with protective MBR; using GPT.
   Disk /dev/sda: 100663296 sectors, 48.0 GiB
   Logical sector size: 512 bytes
   Disk identifier (GUID): 78CDF84D-9C8E-4B9F-8978-8C496A1BEC83
   Partition table holds up to 128 entries
   First usable sector is 34, last usable sector is 62914526
   Partitions will be aligned on 2048-sector boundaries
   Total free space is 6076 sectors (3.0 MiB)

   Number  Start (sector)    End (sector)  Size       Code  Name
   1         1026048         2050047   500.0 MiB   0700
   2         2050048        62912511   29.0 GiB    0700
   14            2048           10239   4.0 MiB     EF02
   15           10240         1024000   495.0 MiB   EF00  EFI System Partition
   ```

1. Expand the partition for root, in this case sda2 by using the **growpart** command.  Using this command expands the partition to use all of the contiguous space on the disk.

   ```bash
   growpart /dev/sda 2
   ```

   ```output
   CHANGED: partition=2 start=2050048 old: size=60862464 end=62912512 new: size=98613214 end=100663262
   ```

1. Now print the new partition table with **gdisk** again.  Notice that partition 2 has is now sized 47.0 GiB

   ```bash
   gdisk -l /dev/sda
   ```

   ```output
   GPT fdisk (gdisk) version 0.8.10

   Partition table scan:
   MBR: protective
   BSD: not present
   APM: not present
   GPT: present

   Found valid GPT with protective MBR; using GPT.
   Disk /dev/sda: 100663296 sectors, 48.0 GiB
   Logical sector size: 512 bytes
   Disk identifier (GUID): 78CDF84D-9C8E-4B9F-8978-8C496A1BEC83
   Partition table holds up to 128 entries
   First usable sector is 34, last usable sector is 100663262
   Partitions will be aligned on 2048-sector boundaries
   Total free space is 4062 sectors (2.0 MiB)

   Number  Start (sector)    End (sector)  Size       Code  Name
      1         1026048         2050047   500.0 MiB   0700
      2         2050048       100663261   47.0 GiB    0700
   14            2048           10239   4.0 MiB     EF02
   15           10240         1024000   495.0 MiB   EF00  EFI System Partition
   ```

1. Expand the filesystem on the partition with **xfs_growfs**, which is appropriate for a standard marketplace-generated RedHat system:

   ```bash
   xfs_growfs /
   ```

   ```output
   meta-data=/dev/sda2              isize=512    agcount=4, agsize=1901952 blks
            =                       sectsz=4096  attr=2, projid32bit=1
            =                       crc=1        finobt=0 spinodes=0
   data     =                       bsize=4096   blocks=7607808, imaxpct=25
            =                       sunit=0      swidth=0 blks
   naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
   log      =internal               bsize=4096   blocks=3714, version=2
            =                       sectsz=4096  sunit=1 blks, lazy-count=1
   realtime =none                   extsz=4096   blocks=0, rtextents=0
   data blocks changed from 7607808 to 12326651
   ```

1. Verify the new size is reflected with the **df** command

   ```bash
   df -hl
   ```

   ```output
   Filesystem      Size  Used Avail Use% Mounted on
   devtmpfs        452M     0  452M   0% /dev
   tmpfs           464M     0  464M   0% /dev/shm
   tmpfs           464M  6.8M  457M   2% /run
   tmpfs           464M     0  464M   0% /sys/fs/cgroup
   /dev/sda2        48G  2.1G   46G   5% /
   /dev/sda1       494M   65M  430M  13% /boot
   /dev/sda15      495M   12M  484M   3% /boot/efi
   /dev/sdb1       3.9G   16M  3.7G   1% /mnt/resource
   tmpfs            93M     0   93M   0% /run/user/1000
   ```

---

## Expanding without downtime classic VM SKU support

If you're using a classic VM SKU, it might not support expanding disks without downtime.

Use the following PowerShell script to determine which VM SKUs it's available with:

```azurepowershell
Connect-AzAccount
$subscriptionId="yourSubID"
$location="desiredRegion"
Set-AzContext -Subscription $subscriptionId
$vmSizes=Get-AzComputeResourceSku -Location $location | where{$_.ResourceType -eq 'virtualMachines'}

foreach($vmSize in $vmSizes){
    foreach($capability in $vmSize.Capabilities)
    {
       if(($capability.Name -eq "EphemeralOSDiskSupported" -and $capability.Value -eq "True") -or ($capability.Name -eq "PremiumIO" -and $capability.Value -eq "True") -or ($capability.Name -eq "HyperVGenerations" -and $capability.Value -match "V2"))
        {
            $vmSize.Name
       }
   }
}
```
