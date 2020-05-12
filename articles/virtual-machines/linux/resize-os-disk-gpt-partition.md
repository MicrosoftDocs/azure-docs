---
title: Resize an OS disk that has a GPT partition | Microsoft Docs
description: This article provides instructions on resizing an OS disk that has a GPT partition.
services: virtual-machines-linux
documentationcenter: ''
author: kailashmsft
manager: dcscontentpm
editor: ''
tags: ''

ms.service: security
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.devlang: azurecli
ms.date: 05/03/2020
ms.author: kaib
ms.custom: seodec18
---

# Resize an OS disk that has a GPT partition

> [!NOTE]
> This scenario applies only to OS disks that have a GUID Partition Table (GPT) partition.

This article describes how to increase the size of an OS disk that has a GPT partition in Linux. 

## Identify whether the OS disk has an MBR or GPT partition

Use the **parted** command to identify if the disk partition has been created with either a master boot record (MBR) partition or a GPT partition.

### MBR partition

In the following output, **Partition Table** shows a value of **msdos**. This value identifies an MBR partition.

```
[user@myvm ~]# parted -l /dev/sda
Model: Msft Virtual Disk (scsi)
Disk /dev/sda: 107GB
Sector size (logical/physical): 512B/512B
Partition Table: msdos
Number  Start   End     Size    Type     File system  Flags
1       1049kB  525MB   524MB   primary  ext4         boot
2       525MB   34.4GB  33.8GB  primary  ext4
[user@myvm ~]#
```

### GPT partition

In the following output, **Partition Table** shows a value of **gpt**. This value identifies a GPT partition.

```
[user@myvm ~]# parted -l /dev/sda
Model: Msft Virtual Disk (scsi)
Disk /dev/sda: 68.7GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name                  Flags
1       1049kB  525MB   524MB   fat16        EFI System Partition  boot
2       525MB   1050MB  524MB   xfs
3       1050MB  1052MB  2097kB                                     bios_grub
4       1052MB  68.7GB  67.7GB                                     lvm
```

If your virtual machine (VM) has a GPT partition on your OS disk, increase the size of the OS disk.

## Increase the size of the OS disk

The following instructions apply to Linux-endorsed distributions.

> [!NOTE]
> Before you proceed, make a backup copy of your VM, or take a snapshot of your OS disk.

### Ubuntu

To increase the size of the OS disk in Ubuntu 16.x and 18.x:

1. Stop the VM.
1. Increase the size of the OS disk from the portal.
1. Restart the VM, and then log in to the VM as a **root** user.
1. Verify that the OS disk now displays an increased file system size.

As shown in the following example, the OS disk has been resized from the portal to 100 GB. The **/dev/sda1** file system mounted on **/** now displays 97 GB.

```
user@myvm:~# df -Th
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
user@myvm:~#
```

### SUSE

To increase the size of the OS disk in SUSE 12 SP4, SUSE SLES 12 for SAP, SUSE SLES 15, and SUSE SLES 15 for SAP:

1. Stop the VM.
1. Increase the size of the OS disk from the portal.
1. Restart the VM.

When the VM has restarted, perform the following steps:

   1. Access your VM as a **root** user by using the following command:
   
      `#sudo su`

   1. Use the following command to install the **gptfdisk** package, which is required for increasing the size of the OS disk:

      `#zypper install gptfdisk -y`

   1. To view the largest sector available on the disk, run the following command:

      `#sgdisk -e /dev/sda`

   1. Resize the partition without deleting it by using the following command. The **parted** command has an option named **resizepart** to resize the partition without deleting it. The number 4 after **resizepart** indicates resizing the fourth partition.

      `#parted -s /dev/sda "resizepart 4 -1" quit`

   1. Run the **#lsblk** command to check whether the partition has been increased.

      The following output shows that the **/dev/sda4** partition has been resized to 98.5 GB.

      ```
      user@myvm:~ # lsblk
      NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
      sda      8:0    0  100G  0 disk
      ├─sda1   8:1    0    2M  0 part
      ├─sda2   8:2    0  512M  0 part /boot/efi
      └─sda4   8:4    0 98.5G  0 part /
      sdb      8:16   0   20G  0 disk
      └─sdb1   8:17   0   20G  0 part /mnt/resource
      ```
      
   1. Identify the type of file system on the OS disk by using the following command:

      `blkid`

      Example output:

      ```
      #blkid

      user@myvm:~ # blkid
      /dev/sda1: PARTLABEL="p.legacy" PARTUUID="0122fd4c-0069-4a45-bfd4-98b97ccb6e8c"
      /dev/sda2: SEC_TYPE="msdos" LABEL_FATBOOT="EFI" LABEL="EFI" UUID="00A9-D170" TYPE="vfat" PARTLABEL="p.UEFI" PARTUUID="abac3cd8-949b-4e83-81b1-9636493388c7"
      /dev/sda3: LABEL="BOOT" UUID="aa2492db-f9ed-4f5a-822a-1233c06d57cc" TYPE="xfs" PARTLABEL="p.lxboot" PARTUUID="dfb36c61-b15f-4505-8e06-552cf1589cf7"
      /dev/sda4: LABEL="ROOT" UUID="26104965-251c-4e8d-b069-5f5323d2a9ba" TYPE="xfs" PARTLABEL="p.lxroot" PARTUUID="50fecee0-f22b-4406-94c3-622507e2dbce"
      /dev/sdb1: UUID="95239fce-ca97-4f03-a077-4e291588afc9" TYPE="ext4" PARTUUID="953afef3-01"
      ```

   1. Based on the file system type, use the appropriate commands to resize the file system.

      For **xfs**, use the following command:

      ` #xfs_growfs /`

      Example output:

      ```
      user@myvm:~ # xfs_growfs /
      meta-data=/dev/sda4              isize=512    agcount=4, agsize=1867583 blks
               =                       sectsz=512   attr=2, projid32bit=1
               =                       crc=1        finobt=1 spinodes=0 rmapbt=0
               =                       reflink=0
      data     =                       bsize=4096   blocks=7470331, imaxpct=25
               =                       sunit=0      swidth=0 blks
      naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
      log      =internal               bsize=4096   blocks=3647, version=2
               =                       sectsz=512   sunit=0 blks, lazy-count=1
      realtime =none                   extsz=4096   blocks=0, rtextents=0
      data blocks changed from 7470331 to 25820172
      ```

      For **ext4**, use the following command:

      ```#resize2fs /dev/sda4```

   1. Verify the increased file system size for **df -Th**, by using the following command:

      `#df -Th`

      Example output:

      ```
	  user@myvm:~ # df -Th
	  Filesystem     Type      Size  Used Avail Use% Mounted on
	  devtmpfs       devtmpfs  306M  4.0K  306M   1% /dev
	  tmpfs          tmpfs     320M     0  320M   0% /dev/shm
	  tmpfs          tmpfs     320M  8.8M  311M   3% /run
	  tmpfs          tmpfs     320M     0  320M   0% /sys/fs/cgroup
	  /dev/sda4      xfs        99G  1.8G   97G   2% /
	  /dev/sda3      xfs      1014M   88M  927M   9% /boot
	  /dev/sda2      vfat      512M  1.1M  511M   1% /boot/efi
	  /dev/sdb1      ext4       20G   45M   19G   1% /mnt/resource
	  tmpfs          tmpfs      64M     0   64M   0% /run/user/1000
	  user@myvm:~ #
      ```

In the preceding example, we can see that the file system size for the OS disk has been increased.

### RHEL

To increase the size of the OS disk in RHEL 7.x with LVM:

1. Stop the VM.
1. Increase the size of the OS disk from the portal.
1. Start the VM.

When the VM has restarted, perform the following steps:

   1. Access your VM as a **root** user by using the following command:
   
      `#sudo su`

   1. Install the **gptfdisk** package, which is required to increase the size of the OS disk.

      `#yum install gdisk -y`

   1. To see the largest sector available on the disk, run the following command:

      `#sgdisk -e /dev/sda`

   1. Resize the partition without deleting it by using the following command. The **parted** command has an option named **resizepart** to resize the partition without deleting it. The number 4 after **resizepart** indicates resizing the fourth partition.

      `#parted -s /dev/sda "resizepart 4 -1" quit`
    
   1. Run the following command to verify that the partition has been increased:

      `#lsblk`

      The following output shows that the **/dev/sda4** partition has been resized to 99 GB.

      ```
      [user@myvm ~]# lsblk
      NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
      fd0                 2:0    1    4K  0 disk
      sda                 8:0    0  100G  0 disk
      ├─sda1              8:1    0  500M  0 part /boot/efi
      ├─sda2              8:2    0  500M  0 part /boot
      ├─sda3              8:3    0    2M  0 part
      └─sda4              8:4    0   99G  0 part
      ├─rootvg-tmplv    253:0    0    2G  0 lvm  /tmp
      ├─rootvg-usrlv    253:1    0   10G  0 lvm  /usr
      ├─rootvg-optlv    253:2    0    2G  0 lvm  /opt
      ├─rootvg-homelv   253:3    0    1G  0 lvm  /home
      ├─rootvg-varlv    253:4    0    8G  0 lvm  /var
      └─rootvg-rootlv   253:5    0    2G  0 lvm  /
      sdb                 8:16   0   50G  0 disk
      └─sdb1              8:17   0   50G  0 part /mnt/resource
      ```

   1. Use the following command to resize the physical volume (PV):

      `#pvresize /dev/sda4`

      The following output shows that the PV has been resized to 99.02 GB.

      ```
      [user@myvm ~]# pvresize /dev/sda4
      Physical volume "/dev/sda4" changed
      1 physical volume(s) resized or updated / 0 physical volume(s) not resized

      [user@myvm ~]# pvs
      PV         VG     Fmt  Attr PSize   PFree
      /dev/sda4  rootvg lvm2 a--  <99.02g <74.02g
      ```

   1. In the following example, **/dev/mapper/rootvg-rootlv** is being resized from 2 GB to 12 GB (an increase of 10 GB) through the following command. This command will also resize the file system.

      `#lvresize -r -L +10G /dev/mapper/rootvg-rootlv`

      Example output:

      ```
      [user@myvm ~]# lvresize -r -L +10G /dev/mapper/rootvg-rootlv
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
         
   1. Verify whether **/dev/mapper/rootvg-rootlv** has an increased file system size by using the following command:

      `#df -Th /`

      Example output:

      ```
      [user@myvm ~]# df -Th /
      Filesystem                Type  Size  Used Avail Use% Mounted on
      /dev/mapper/rootvg-rootlv xfs    12G   71M   12G   1% /
      [user@myvm ~]#
      ```

   > [!NOTE]
   > To use the same procedure to resize any other logical volume, change the **lv** name in step 7.

## Next steps

- [Resize disk](expand-disks.md)