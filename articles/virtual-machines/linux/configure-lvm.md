---
title: Configure LVM on a virtual machine running Linux | Microsoft Docs
description: Learn how to configure LVM on Linux in Azure.
services: virtual-machines-linux
documentationcenter: na
author: szarkos
manager: gwallace
editor: tysonn
tag: azure-service-management,azure-resource-manager

ms.assetid: 7f533725-1484-479d-9472-6b3098d0aecc
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/27/2018
ms.author: szark
ms.subservice: disks

---
# Configure LVM on a Linux VM in Azure
This document will discuss how to configure Logical Volume Manager (LVM) in your Azure virtual machine. LVM may be used on the OS disk or data disks in Azure VMs, however, by default most cloud images will not have LVM configured on the OS disk. The steps below will focus on configuring LVM for your data disks.

## Linear vs. striped logical volumes
LVM can be used to combine a number of physical disks into a single storage volume. By default LVM will usually create linear logical volumes, which means that the physical storage is concatenated together. In this case read/write operations will typically only be sent to a single disk. In contrast, we can also create striped logical volumes where reads and writes are distributed to multiple disks contained in the volume group (similar to RAID0). For performance reasons, it is likely you will want to stripe your logical volumes so that reads and writes utilize all your attached data disks.

This document will describe how to combine several data disks into a single volume group, and then create a striped logical volume. The steps below are generalized to work with most distributions. In most cases the utilities and workflows for managing LVM on Azure are not fundamentally different than other environments. As usual, also consult your Linux vendor for documentation and best practices for using LVM with your particular distribution.

## Attaching data disks
One will usually want to start with two or more empty data disks when using LVM. Based on your IO needs, you can choose to attach disks that are stored in our Standard Storage, with up to 500 IO/ps per disk or our Premium storage with up to 5000 IO/ps per disk. This article will not go into detail on how to provision and attach data disks to a Linux virtual machine. See the Microsoft Azure article [attach a disk](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for detailed instructions on how to attach an empty data disk to a Linux virtual machine on Azure.

## Install the LVM utilities
* **Ubuntu**

    ```bash  
    sudo apt-get update
    sudo apt-get install lvm2
    ```

* **RHEL, CentOS & Oracle Linux**

    ```bash   
    sudo yum install lvm2
    ```

* **SLES 12 and openSUSE**

    ```bash   
    sudo zypper install lvm2
    ```

* **SLES 11**

    ```bash   
    sudo zypper install lvm2
    ```

    On SLES11, you must also edit `/etc/sysconfig/lvm` and set `LVM_ACTIVATED_ON_DISCOVERED` to "enable":

    ```sh   
    LVM_ACTIVATED_ON_DISCOVERED="enable" 
    ```

## Configure LVM
In this guide we will assume you have attached three data disks, which we'll refer to as `/dev/sdc`, `/dev/sdd` and `/dev/sde`. These paths may not match the disk path names in your VM. You can run '`sudo fdisk -l`' or similar command to list your available disks.

1. Prepare the physical volumes:

    ```bash    
    sudo pvcreate /dev/sd[cde]
    Physical volume "/dev/sdc" successfully created
    Physical volume "/dev/sdd" successfully created
    Physical volume "/dev/sde" successfully created
    ```

2. Create a volume group. In this example we are calling the volume group `data-vg01`:

    ```bash    
    sudo vgcreate data-vg01 /dev/sd[cde]
    Volume group "data-vg01" successfully created
    ```

3. Create the logical volume(s). The command below we will create a single logical volume called `data-lv01` to span the entire volume group, but note that it is also feasible to create multiple logical volumes in the volume group.

    ```bash   
    sudo lvcreate --extents 100%FREE --stripes 3 --name data-lv01 data-vg01
    Logical volume "data-lv01" created.
    ```

4. Format the logical volume

    ```bash  
    sudo mkfs -t ext4 /dev/data-vg01/data-lv01
    ```
   
   > [!NOTE]
   > With SLES11 use `-t ext3` instead of ext4. SLES11 only supports read-only access to ext4 filesystems.

## Add the new file system to /etc/fstab
> [!IMPORTANT]
> Improperly editing the `/etc/fstab` file could result in an unbootable system. If unsure, refer to the distribution's documentation for information on how to properly edit this file. It is also recommended that a backup of the `/etc/fstab` file is created before editing.

1. Create the desired mount point for your new file system, for example:

    ```bash  
    sudo mkdir /data
    ```

2. Locate the logical volume path

    ```bash    
    lvdisplay
    --- Logical volume ---
    LV Path                /dev/data-vg01/data-lv01
    ....
    ```

3. Open `/etc/fstab` in a text editor and add an entry for the new file system, for example:

    ```bash    
    /dev/data-vg01/data-lv01  /data  ext4  defaults  0  2
    ```   
    Then, save and close `/etc/fstab`.

4. Test that the `/etc/fstab` entry is correct:

    ```bash    
    sudo mount -a
    ```

    If this command results in an error message check the syntax in the `/etc/fstab` file.
   
    Next run the `mount` command to ensure the file system is mounted:

    ```bash    
    mount
    ......
    /dev/mapper/data--vg01-data--lv01 on /data type ext4 (rw)
    ```

5. (Optional) Failsafe boot parameters in `/etc/fstab`
   
    Many distributions include either the `nobootwait` or `nofail` mount parameters that may be added to the `/etc/fstab` file. These parameters allow for failures when mounting a particular file system and allow the Linux system to continue to boot even if it is unable to properly mount the RAID file system. Refer to your distribution's documentation for more information on these parameters.
   
    Example (Ubuntu):

    ```bash 
    /dev/data-vg01/data-lv01  /data  ext4  defaults,nobootwait  0  2
    ```

## TRIM/UNMAP support
Some Linux kernels support TRIM/UNMAP operations to discard unused blocks on the disk. These operations are primarily useful in standard storage to inform Azure that deleted pages are no longer valid and can be discarded. Discarding pages can save cost if you create large files and then delete them.

There are two ways to enable TRIM support in your Linux VM. As usual, consult your distribution for the recommended approach:

- Use the `discard` mount option in `/etc/fstab`, for example:

    ```bash 
    /dev/data-vg01/data-lv01  /data  ext4  defaults,discard  0  2
    ```

- In some cases the `discard` option may have performance implications. Alternatively, you can run the `fstrim` command manually from the command line, or add it to your crontab to run regularly:

    **Ubuntu**

    ```bash 
    # sudo apt-get install util-linux
    # sudo fstrim /datadrive
    ```

    **RHEL/CentOS**

    ```bash 
    # sudo yum install util-linux
    # sudo fstrim /datadrive
    ```
