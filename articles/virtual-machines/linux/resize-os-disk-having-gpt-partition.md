---
title: Resize OS Disk having GPT Partition.
description: This article provides instructions to resize the OS Disk having GPT Partition.
author: kailashmsft
ms.service: security
ms.topic: article
ms.author: kaib
ms.date: 05/03/2020

ms.custom: seodec18

---


# Resize OS Disk having GPT Partition.

**This scenario applies only for OS Disk having GPT Partition.**  
This article describes how to increase the OS Disk having GPT partition in linux.

## How to identify if OS Disk is having GPT (or) GPT Partition.

There are many ways in which you can Identify if the Disk is partitioned using MBR (or) GPT partitions.

**parted** command is used to identify if the disk partition has been created using MBR (or) GPT partition.

Example for **MBR** Partition:

```
     [root@rhel6 ~]# parted -l /dev/sda
     Model: Msft Virtual Disk (scsi)
     Disk /dev/sda: 107GB
     Sector size (logical/physical): 512B/512B
     Partition Table: msdos
     Number  Start   End     Size    Type     File system  Flags
     1      1049kB  525MB   524MB   primary  ext4         boot
     2      525MB   34.4GB  33.8GB  primary  ext4
     [root@rhel6 ~]#
```
In the above output, we have to look for "Partition Table".
We could see that the value is **msdos**,  which means the disk is having "MBR" Partition.

Example for **GPT** Partition.
 
```
     [root@rhel7lvm ~]# parted -l /dev/sda
     Model: Msft Virtual Disk (scsi)
     Disk /dev/sda: 68.7GB
     Sector size (logical/physical): 512B/512B
     Partition Table: gpt
     Disk Flags:

     Number  Start   End     Size    File system  Name                  Flags
     1      1049kB  525MB   524MB   fat16        EFI System Partition  boot
     2      525MB   1050MB  524MB   xfs
     3      1050MB  1052MB  2097kB                                     bios_grub
     4      1052MB  68.7GB  67.7GB                                     lvm
```
In the above output, we have to look for "Partition Table".
We could see that the value is **gpt**, which means the disk is having "GPT" partition.
    
After validating your VM is having GPT Partition On OS Disk,
Proceed forward for increasing the OS Disk.

## Environment

- Linux Endorsed distributions

## Procedure

>[!NOTE] 
>Please a take a backup of the VM (or) snapshot of OS Disk before procedding further.

### Ubuntu 16.x && 18.x

1. Stop the VM.
2. Increase the size of the OSDisk from the portal.
3. Start the VM && Login to the VM && become a **root** user.
4. The OSDisk will have increased file system size.
   
   Here the OS Disk is resized to 100 GB from portal.
 
```
     root@ubuntu:~# df -Th
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
     root@ubuntu1604:~#

```
   From the above output, we could see that "/dev/sda1 mounted on /" is having 97 GB now.

### SUSE 12 SP4 && SUSE SLES 15 && SUSE SLES 15 For SAP

1. Stop the VM.
2. Increase the size of the OSDisk from the portal.
3. Start the VM.
4. Perform the below steps to increase the size of the OS Disk.

     4.1 Access your VM and become root user using below command.

             #sudo su -
         
     4.2 Install the "gptfdisk" package,  which is required for increasing the OS Disk.

             #zypper install gptfdisk -y

     4.3 To be able to see the largest sector available on the disk, run the below command.

             #sgdisk -e /dev/sda

     4.4 Resize the partition without deleting it, using below command.
         Parted has an option named "resizepart" to resize the partition without deleting it.
         The number 4 after resizepart, means resize the 4TH partition.
                  
             #parted -s /dev/sda "resizepart 4 -1" quit
    
     4.5 Check using below command if the partition is increased.

             #lsblk
         
             susesels15serialconsole:~ # lsblk
             NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
             sda      8:0    0  100G  0 disk
             ├─sda1   8:1    0    2M  0 part
             ├─sda2   8:2    0  512M  0 part /boot/efi
             ├─sda3   8:3    0    1G  0 part /boot
             └─sda4   8:4    0 98.5G  0 part /                                               
             sdb      8:16   0   20G  0 disk
             └─sdb1   8:17   0   20G  0 part /mnt/resource
    
         From the above output we could see that "/dev/sda4 partition is now having 98.5 GB.

     4.6 Identify the type of file system on the OSDisk using "blkid" command
    
             #blkid
         
             susesels15serialconsole:~ # blkid
             /dev/sda1: PARTLABEL="p.legacy" PARTUUID="0122fd4c-0069-4a45-bfd4-98b97ccb6e8c"
             /dev/sda2: SEC_TYPE="msdos" LABEL_FATBOOT="EFI" LABEL="EFI" UUID="00A9-D170" TYPE="vfat" PARTLABEL="p.UEFI" PARTUUID="abac3cd8-949b-4e83-81b1-9636493388c7"
             /dev/sda3: LABEL="BOOT" UUID="aa2492db-f9ed-4f5a-822a-1233c06d57cc" TYPE="xfs" PARTLABEL="p.lxboot" PARTUUID="dfb36c61-b15f-4505-8e06-552cf1589cf7"
             /dev/sda4: LABEL="ROOT" UUID="26104965-251c-4e8d-b069-5f5323d2a9ba" TYPE="xfs" PARTLABEL="p.lxroot" PARTUUID="50fecee0-f22b-4406-94c3-622507e2dbce"
             /dev/sdb1: UUID="95239fce-ca97-4f03-a077-4e291588afc9" TYPE="ext4" PARTUUID="953afef3-01"

     4.7 Based on the file system type use the appropriate commands to resize the file system.
		 
                 For xfs:
			     #xfs_growfs /
                 
                 susesels15serialconsole:~ # xfs_growfs /
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
                           
         	     For ext4 
		         #resize2fs /dev/sda4 

     4.8 Verify the increased file system size "df -Th"


             #df -Th

             susesels15serialconsole:~ # df -Th
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
             susesels15serialconsole:~ #

         We can see the increased the file system size for the OSDisk

### RHEL 7.x with LVM

1. Stop the VM.
2. Increase the size of the OSDisk from the portal.
3. Start the VM.
4. Perform the below steps to increase the size of the OS Disk.

    4.1 Access your VM and become root user using below command.

             #sudo su -
         
     4.2 Install the "gptfdisk" package, which is required for increasing the OS Disk.

             #yum install gdisk -y

     4.3 To be able to see the largest sector available on the disk, run the below command.

             #sgdisk -e /dev/sda

     4.4 Resize the partition without deleting it, using below command.
         Parted has an option named "resizepart" to resize the partition without deleting it.
         The number 4 after resize part, means resize the 4TH partition.
                  
             #parted -s /dev/sda "resizepart 4 -1" quit
    
     4.5 Check using below command if the partition is increased.

         #lsblk
         [root@rhel7lvm ~]# lsblk
         NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
         fd0                 2:0    1    4K  0 disk
         sda                 8:0    0  100G  0 disk
         ├─sda1              8:1    0  500M  0 part /boot/efi
         ├─sda2              8:2    0  500M  0 part /boot
         ├─sda3              8:3    0    2M  0 part
         └─sda4              8:4    0   99G  0 part
         ├─rootvg-tmplv  253:0    0    2G  0 lvm  /tmp
         ├─rootvg-usrlv  253:1    0   10G  0 lvm  /usr
         ├─rootvg-optlv  253:2    0    2G  0 lvm  /opt
         ├─rootvg-homelv 253:3    0    1G  0 lvm  /home
         ├─rootvg-varlv  253:4    0    8G  0 lvm  /var
         └─rootvg-rootlv 253:5    0    2G  0 lvm  /
         sdb                 8:16   0   50G  0 disk
         └─sdb1              8:17   0   50G  0 part /mnt/resource

         From the above output we could see that "/dev/sda4 partition is now having 98.5 GB.

     4.7 use the below command to resize the Physical Volume (pv)

         #pvresize /dev/sda4
            
         [root@rhel7lvm ~]# pvresize /dev/sda4
         Physical volume "/dev/sda4" changed
         1 physical volume(s) resized or updated / 0 physical volume(s) not resized
         
         [root@rhel7lvm ~]# pvs
         PV         VG     Fmt  Attr PSize   PFree
         /dev/sda4  rootvg lvm2 a--  <99.02g <74.02g

         From the above output we could see that the PV is resized to 99.02 GB. 

     4.8 In this case, we are resizing the /dev/mapper/rootvg-rootlv by 10 GB using the below command, which would also resize the file system.

         #lvresize -r -L +10G /dev/mapper/rootvg-rootlv

         [root@rhel7lvm ~]# lvresize -r -L +10G /dev/mapper/rootvg-rootlv
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
         
     4.9 Verify whether the /dev/mapper/rootvg-rootlv has increased file system or not using below command.

         #df -Th /    
         [root@rhel7lvm ~]# df -Th /
         Filesystem                Type  Size  Used Avail Use% Mounted on
         /dev/mapper/rootvg-rootlv xfs    12G   71M   12G   1% /
         [root@rhel7lvm ~]#

>[!NOTE] 

>we can use the same procedure to resize any other logical volume.
>We just need to change the lv name in  the step 4.8



## Next Steps

- [Resize Disk](expand-disks.md)