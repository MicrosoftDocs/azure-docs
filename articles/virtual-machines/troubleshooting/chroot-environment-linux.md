---
title: Chroot environment in a Linux Rescue VM.
description: This article describes how to troubleshoot the chroot environment in the Rescue virtual machine (VM) in Linux.
mservices: virtual-machines-linux
documentationcenter: ''
author: kailashmsft
manager: dcscontentpm
editor: ''
tags: ''

ms.service: virtual-machines-linux
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.date: 05/05/2020
ms.author: kaib

---

# Chroot environment in a Linux Rescue VM

This article describes how to troubleshoot the chroot environment in the Rescue virtual machine (VM) in Linux.

## Ubuntu 16.x && Ubuntu 18.x

1. Stop or de-allocate the affected VM.
1. Create a rescue VM image of the same OS version, in same resource group (RSG) and location using managed disk.
1. Use the Azure portal to take a snapshot of the affected virtual machine's OS disk.
1. Create a disk out of the snapshot of the OS disk, and attach it to the Rescue VM.
1. Once the disk has been created, Troubleshoot the chroot environment in the Rescue VM.

   1. Access your VM as the root user using the following command:

      `#sudo su -`

   1. Find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses **dmesg** to filter on **SCSI** disks:

      `dmesg | grep SCSI`

      Your output will be similar to the following example. In this example, we want the **sdc** disk:

      ```
      [    0.294784] SCSI subsystem initialized
      [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
      [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
      [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
      [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
      ```

   1. Use the following commands to access the chroot environment:

      ```
      #mkdir /rescue
      #mount /dev/sdc1 /rescue
      #mount /dev/sdc15 /rescue/boot/efi
      #cd /rescue

      #mount -t proc proc proc
      #mount -t sysfs sys sys/
      #mount -o bind /dev dev/
      #mount -o bind /dev/pts dev/pts/
      #mount -o bind /run run/
      #chroot /rescue
      ```

   1. Troubleshoot the chroot environment.

   1. Use the following commands to exit the chroot environment:

      ```
      #exit

      #umount /rescue/proc/
      #umount /rescue/sys/
      #umount /rescue/dev/pts
      #umount /rescue/dev/
      #umount /rescue/run
      #cd /
      #umount /rescue/boot/efi
      #umount /rescue
      ```

      > [!NOTE]
      > If you receive the error `unable to unmount /rescue`, add -l option to the umount command.
      >
      > Example: `umount -l /rescue`

1. Detach the disk from the rescue VM and perform a disk swap with the original VM.
1. Start the original VM and check its connectivity.

## RHEL/Centos/Oracle 6.x && Oracle 8.x && RHEL/Centos 7.x with RAW Partitions

1. Stop or de-allocate the affected VM.
1. Create a Rescue VM image of the same OS version, in same resource group (RSG) and location using managed disk.
1. Use the Azure portal to take a snapshot of the affected virtual machine's OS disk.
1. Create a disk out of the snapshot of the OS disk, and attach it to the Rescue VM.
1. Once the disk has been created, Troubleshoot the chroot environment in the Rescue VM.

   1. Access your VM as the root user using the following command:

      `#sudo su -`

   1. Find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses **dmesg** to filter on **SCSI** disks:

      `dmesg | grep SCSI`

      Your output will be similar to the following example. In this example, we want the **sdc** disk:

      ```
      [    0.294784] SCSI subsystem initialized
      [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
      [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
      [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
      [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
      ```

   1. Use the following commands to access the chroot environment:

      ```
      #mkdir /rescue
      #mount -o nouuid /dev/sdc2 /rescue
      #mount -o nouuid /dev/sdc1 /rescue/boot/
      #cd /rescue

      #mount -t proc proc proc
      #mount -t sysfs sys sys/
      #mount -o bind /dev dev/
      #mount -o bind /dev/pts dev/pts/
      #mount -o bind /run run/
      #chroot /rescue
      ```

   1. Troubleshoot the chroot environment.

   1. Use the following commands to exit the chroot environment:

      ```
      #exit

      #umount /rescue/proc/
      #umount /rescue/sys/
      #umount /rescue/dev/pts
      #umount /rescue/dev/
      #umount /rescue/run
      #cd /
      #umount /rescue/boot/efi
      #umount /rescue
      ```

      > [!NOTE]
      > If you receive the error `unable to unmount /rescue`, add -l option to the umount command.
      >
      > Example: `umount -l /rescue`

1. Detach the disk from the rescue VM and perform a disk swap with the original VM.
1. Start the original VM and check its connectivity.

## RHEL/Centos 7.x with LVM

   > [!NOTE]
   > If your original VM includes Logical Volume Manager (LVM) on the OS Disk, create the Rescue VM using the image with Raw Partitions on the OS Disk.

1. Stop or de-allocate the affected VM.
1. Create a Rescue VM image of the same OS version, in same resource group (RSG) and location using managed disk.
1. Use the Azure portal to take a snapshot of the affected virtual machine's OS disk.
1. Create a disk out of the snapshot of the OS disk, and attach it to the Rescue VM.
1. Once the disk has been created, Troubleshoot the chroot environment in the Rescue VM.

   1. Access your VM as the root user using the following command:

      `#sudo su -`

   1. Find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses **dmesg** to filter on **SCSI** disks:

      `dmesg | grep SCSI`

      Your output will be similar to the following example. In this example, we want the **sdc** disk:

      ```
      [    0.294784] SCSI subsystem initialized
      [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
      [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
      [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
      [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
      ```

   1. Use the following command to activate the logical volume group:

      ```
      #vgscan --mknodes
      #vgchange -ay
      #lvscan
      ```

   1. Use the `lsblk` command to retrieve the lvm names:

      ```
      [user@myvm ~]$ lsblk
      NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
      sda                 8:0    0   64G  0 disk
      ├─sda1              8:1    0  500M  0 part /boot
      ├─sda2              8:2    0   63G  0 part /
      sdb                 8:16   0    4G  0 disk
      └─sdb1              8:17   0    4G  0 part /mnt/resource
      sdc                 8:0    0   64G  0 disk
      ├─sdc1              8:1    0  500M  0 part
      ├─sdc2              8:2    0   63G  0 part
      ├─sdc3              8:3    0    2M  0 part
      ├─sdc4              8:4    0   63G  0 part
        ├─rootvg-tmplv  253:0    0    2G  0 lvm  
        ├─rootvg-usrlv  253:1    0   10G  0 lvm  
        ├─rootvg-optlv  253:2    0    2G  0 lvm  
        ├─rootvg-homelv 253:3    0    1G  0 lvm  
        ├─rootvg-varlv  253:4    0    8G  0 lvm  
        └─rootvg-rootlv 253:5    0    2G  0 lvm
      ```

   1. Use the following commands to access the chroot environment:

      ```
      #mkdir /rescue
      #mount /dev/mapper/rootvg-rootlv /rescue
      #mount /dev/mapper/rootvg-varlv /rescue/var
      #mount /dev/mapper/rootvg-homelv /rescue/home
      #mount /dev/mapper/rootvg-usrlv /rescue/usr
      #mount /dev/mapper/rootvg-tmplv /rescue/tmp
      #mount /dev/mapper/rootvg-optlv /rescue/opt
      #mount /dev/sdc2 /rescue/boot/
      #mount /dev/sdc1 /rescue/boot/efi
      #cd /rescue

      #mount -t proc proc proc
      #mount -t sysfs sys sys/
      #mount -o bind /dev dev/
      #mount -o bind /dev/pts dev/pts/
      #mount -o bind /run run/
      #chroot /rescue
      ```

   1. Troubleshoot the chroot environment.

   1. Use the following commands to exit the chroot environment:

      ```
      #exit

      #umount /rescue/proc/
      #umount /rescue/sys/
      #umount /rescue/dev/pts
      #umount /rescue/dev/
      #umount /rescue/run
      #cd /
      #umount /rescue/boot/efi
      #umount /rescue/boot
      #umount /rescue/home
      #umount /rescue/var
      #umount /rescue/usr
      #umount /rescue/tmp
      #umount /rescue/opt
      #umount /rescue
      ```

      > [!NOTE]
      > If you receive the error `unable to unmount /rescue`, add -l option to the umount command.
      >
      > Example: `umount -l /rescue`

1. Detach the disk from the rescue VM and perform a disk swap with the original VM.
1. Start the original VM and check its connectivity.

## RHEL 8.x with LVM

   > [!NOTE]
   > If your original VM includes Logical Volume Manager (LVM) on the OS Disk, create the Rescue VM using the image with Raw Partitions on the OS Disk.

1. Stop or de-allocate the affected VM.
1. Create a Rescue VM image of the same OS version, in same resource group (RSG) and location using managed disk.
1. Use the Azure portal to take a snapshot of the affected virtual machine's OS disk.
1. Create a disk out of the snapshot of the OS disk, and attach it to the Rescue VM.
1. Once the disk has been created, Troubleshoot the chroot environment in the Rescue VM.

   1. Access your VM as the root user using the following command:

      `#sudo su -`

   1. Find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses **dmesg** to filter on **SCSI** disks:

      `dmesg | grep SCSI`

      Your output will be similar to the following example. In this example, we want the **sdc** disk:

      ```
      [    0.294784] SCSI subsystem initialized
      [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
      [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
      [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
      [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
      ```

   1. Use the following command to activate the logical volume group:

      ```
      #vgscan --mknodes
      #vgchange -ay
      #lvscan
      ```

   1. Use the `lsblk` command to retrieve the lvm names:

      ```
      [user@myvm ~]$ lsblk
      NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
      sda                 8:0    0   64G  0 disk
      ├─sda1              8:1    0  500M  0 part /boot
      ├─sda2              8:2    0   63G  0 part /
      sdb                 8:16   0    4G  0 disk
      └─sdb1              8:17   0    4G  0 part /mnt/resource
      sdc                 8:0    0   64G  0 disk
      ├─sdc1              8:1    0  500M  0 part
      ├─sdc2              8:2    0   63G  0 part
      │ ├─rootvg-tmplv  253:0    0    2G  0 lvm  
      │ ├─rootvg-usrlv  253:1    0   10G  0 lvm  
      │ ├─rootvg-homelv 253:2    0    1G  0 lvm  
      │ ├─rootvg-varlv  253:3    0    8G  0 lvm  
      │ └─rootvg-rootlv 253:4    0    2G  0 lvm  
      ├─sdc14             8:14   0    4M  0 part
      └─sdc15             8:15   0  495M  0 part
      ```

   1. Use the following commands to access the chroot environment:

      ```
      #mkdir /rescue
      #mount /dev/mapper/rootvg-rootlv /rescue
      #mount /dev/mapper/rootvg-varlv /rescue/var
      #mount /dev/mapper/rootvg-homelv /rescue/home
      #mount /dev/mapper/rootvg-usrlv /rescue/usr
      #mount /dev/mapper/rootvg-tmplv /rescue/tmp
      #mount /dev/sdc1 /rescue/boot/
      #mount /dev/sdc15 /rescue/boot/efi
      #cd /rescue

      #mount -t proc proc proc
      #mount -t sysfs sys sys/
      #mount -o bind /dev dev/
      #mount -o bind /dev/pts dev/pts/
      #mount -o bind /run run/
      #chroot /rescue
      ```

   1. Troubleshoot the chroot environment.

   1. Use the following commands to exit the chroot environment:

      ```
      #exit

      #umount /rescue/proc/
      #umount /rescue/sys/
      #umount /rescue/dev/pts
      #umount /rescue/dev/
      #umount /rescue/run
      #cd /
      #umount /rescue/boot/efi
      #umount /rescue/boot
      #umount /rescue/home
      #umount /rescue/var
      #umount /rescue/usr
      #umount /rescue/tmp
      #umount /rescue
      ```

      > [!NOTE]
      > If you receive the error `unable to unmount /rescue`, add -l option to the umount command.
      >
      > Example: `umount -l /rescue`

1. Detach the disk from the rescue VM and perform a disk swap with the original VM.
1. Start the original VM and check its connectivity.

## Oracle 7.x

1. Stop or de-allocate the affected VM.
1. Create a Rescue VM image of the same OS version, in same resource group (RSG) and location using managed disk.
1. Use the Azure portal to take a snapshot of the affected virtual machine's OS disk.
1. Create a disk out of the snapshot of the OS disk, and attach it to the Rescue VM.
1. Once the disk has been created, Troubleshoot the chroot environment in the Rescue VM.

   1. Access your VM as the root user using the following command:

      `#sudo su -`

   1. Find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses **dmesg** to filter on **SCSI** disks:

      `dmesg | grep SCSI`

      Your output will be similar to the following example. In this example, we want the **sdc** disk:

      ```
      [    0.294784] SCSI subsystem initialized
      [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
      [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
      [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
      [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
      ```

   1. Use the following commands to access the chroot environment:

      ```
      #mkdir /rescue
      #mount -o nouuid /dev/sdc2 /rescue
      #mount -o nouuid /dev/sdc1 /rescue/boot/
      #mount /dev/sdc15 /rescue/boot/efi
      #cd /rescue

      #mount -t proc proc proc
      #mount -t sysfs sys sys/
      #mount -o bind /dev dev/
      #mount -o bind /dev/pts dev/pts/
      #mount -o bind /run run/
      ##chroot /rescue
      ```

   1. Troubleshoot the chroot environment.

   1. Use the following commands to exit the chroot environment:

      ```
      #exit

      #umount /rescue/proc/
      #umount /rescue/sys/
      #umount /rescue/dev/pts
      #umount /rescue/dev/
      #umount /rescue/run
      #cd /
      #umount /rescue/boot/efi
      #umount /rescue/boot
      #umount /rescue
      ```

      > [!NOTE]
      > If you receive the error `unable to unmount /rescue`, add -l option to the umount command.
      >
      > Example: `umount -l /rescue`

1. Detach the disk from the rescue VM and perform a disk swap with the original VM.
1. Start the original VM and check its connectivity.

## SUSE-SLES 12 SP4, SUSE-SLES 12 SP4 For SAP && ## SUSE-SLES 15 SP1, SUSE-SLES 15 SP1 For SAP

1. Stop or de-allocate the affected VM.
1. Create a Rescue VM image of the same OS version, in same resource group (RSG) and location using managed disk.
1. Use the Azure portal to take a snapshot of the affected virtual machine's OS disk.
1. Create a disk out of the snapshot of the OS disk, and attach it to the Rescue VM.
1. Once the disk has been created, Troubleshoot the chroot environment in the Rescue VM.

   1. Access your VM as the root user using the following command:

      `#sudo su -`

   1. Find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses **dmesg** to filter on **SCSI** disks:

      `dmesg | grep SCSI`

      Your output will be similar to the following example. In this example, we want the **sdc** disk:

      ```
      [    0.294784] SCSI subsystem initialized
      [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
      [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
      [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
      [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
      ```

   1. Use the following commands to access the chroot environment:

      ```
      #mkdir /rescue
      #mount -o nouuid /dev/sdc4 /rescue
      #mount -o nouuid /dev/sdc3 /rescue/boot/
      #mount /dev/sdc2 /rescue/boot/efi
      #cd /rescue

      #mount -t proc proc proc
      #mount -t sysfs sys sys/
      #mount -o bind /dev dev/
      #mount -o bind /dev/pts dev/pts/
      #mount -o bind /run run/
      #chroot /rescue
      ```

   1. Troubleshoot the chroot environment.

   1. Use the following commands to exit the chroot environment:

      ```
      #exit

      #umount /rescue/proc/
      #umount /rescue/sys/
      #umount /rescue/dev/pts
      #umount /rescue/dev/
      #umount /rescue/run
      #cd /
      #umount /rescue/boot/efi
      #umount /rescue/boot
      #umount /rescue
      ```

      > [!NOTE]
      > If you receive the error `unable to unmount /rescue`, add -l option to the umount command.
      >
      > Example: `umount -l /rescue`

1. Detach the disk from the rescue VM and perform a disk swap with the original VM.
1. Start the original VM and check its connectivity.

## Next Steps

- [Troubleshoot ssh connection](troubleshoot-ssh-connection.md)