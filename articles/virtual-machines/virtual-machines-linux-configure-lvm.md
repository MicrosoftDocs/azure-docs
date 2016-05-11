<properties 
	pageTitle="Configure LVM on a virtual machine running Linux | Microsoft Azure" 
	description="Learn how to configure LVM on Linux in Azure." 
	services="virtual-machines-linux" 
	documentationCenter="na" 
	authors="szarkos"  
	manager="timlt" 
	editor="tysonn"
	tag="azure-service-management,azure-resource-manager" />

<tags 
	ms.service="virtual-machines-linux" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/06/2016" 
	ms.author="szark"/>


# Configure LVM on a Linux VM in Azure

This document will discuss how to configure Logical Volume Manager (LVM) in your Azure virtual machine. While it is feasible to configure LVM on any disk attached to the virtual machine, by default most cloud images will not have LVM configured on the OS disk. This is to prevent problems with duplicate volume groups if the OS disk is ever attached to another VM of the same distribution and type, i.e. during a recovery scenario. Therefore it is recommended only to use LVM on the data disks.


## Linear vs. striped logical volumes

LVM can be used to combine a number of physical disks into a single storage volume. By default LVM will usually create linear logical volumes, which means that the physical storage is concatenated together. In this case read/write operations will typically only be sent to a single disk. In contrast, we can also create striped logical volumes where reads and writes are distributed to multiple disks contained in the volume group (i.e. similar to RAID0). For performance reasons it is likely you will want to stripe your logical volumes so that reads and writes utilize all your attached data disks.

This document will describe how to combine several data disks into a single volume group, and then create a striped logical volume. The steps below are somewhat generalized to work with most distributions. In most cases the utilities and workflows for managing LVM on Azure are not fundamentally different than other environments. As usual, please also consult your Linux vendor for documentation and best practices for using LVM with your particular distribution.


## Attaching data disks
One will usually want to start with two or more empty data disks when using LVM. Based on your IO needs, you can choose to attach disks that are stored in our Standard Storage, with up to 500 IO/ps per disk or our Premium storage with up to 5000 IO/ps per disk. This article will not go into detail on how to provision and attach data disks to a Linux virtual machine. Please see the Microsoft Azure article [attach a disk](virtual-machines-linux-add-disk.md) for detailed instructions on how to attach an empty data disk to a Linux virtual machine on Azure.

## Install the LVM utilities

- **Ubuntu**

		# sudo apt-get update
		# sudo apt-get install lvm2

- **RHEL, CentOS & Oracle Linux**

		# sudo yum install lvm2

- **SLES 12 and openSUSE**

		# sudo zypper install lvm2

- **SLES 11**

		# sudo zypper install lvm2

	On SLES11 you must also edit /etc/sysconfig/lvm and set `LVM_ACTIVATED_ON_DISCOVERED` to "enable":

		LVM_ACTIVATED_ON_DISCOVERED="enable" 


## Configure LVM
In this guide we will assume you have attached three data disks, which we'll refer to as `/dev/sdc`, `/dev/sdd` and `/dev/sde`. Note that these may not always be the same path names in your VM. You can run '`sudo fdisk -l`' or similar command to list your available disks.

1. Prepare the physical volumes:

		# sudo pvcreate /dev/sd[cde]
		  Physical volume "/dev/sdc" successfully created
		  Physical volume "/dev/sdd" successfully created
		  Physical volume "/dev/sde" successfully created


2.  Create a volume group. In this example we are calling the volume group "data-vg01":

		# sudo vgcreate data-vg01 /dev/sd[cde]
		  Volume group "data-vg01" successfully created


3. Create the logical volume(s). The command below we will create a single logical volume called "data-lv01" to span the entire volume group, but note that it is also feasible to create multiple logical volumes in the volume group.

		# sudo lvcreate --extents 100%FREE --stripes 3 --name data-lv01 data-vg01
		  Logical volume "data-lv01" created.


4. Format the logical volume

		# sudo mkfs -t ext4 /dev/data-vg01/data-lv01

  >[AZURE.NOTE] With SLES11 use "-t ext3" instead of ext4. SLES11 only supports read-only access to ext4 filesystems.


## Add the new file system to /etc/fstab

**Caution:** Improperly editing the /etc/fstab file could result in an unbootable system. If unsure, please refer to the distribution's documentation for information on how to properly edit this file. It is also recommended that a backup of the /etc/fstab file is created before editing.

1. Create the desired mount point for your new file system, for example:

		# sudo mkdir /data


2. Locate the logical volume path

		# lvdisplay
		--- Logical volume ---
		LV Path                /dev/data-vg01/data-lv01
		....


3. Open /etc/fstab in a text editor and add an entry for the new file system, for example:

		/dev/data-vg01/data-lv01  /data  ext4  defaults  0  2

	Then, save and close /etc/fstab.


4. Test that the /etc/fstab entry is correct:

		# sudo mount -a

	If this command results in an error message please check the syntax in the /etc/fstab file.

	Next run the `mount` command to ensure the file system is mounted:

		# mount
		......
		/dev/mapper/data--vg01-data--lv01 on /data type ext4 (rw)


5. (Optional) Failsafe boot parameters in /etc/fstab

	Many distributions include either the `nobootwait` or `nofail` mount parameters that may be added to the /etc/fstab file. These parameters allow for failures when mounting a particular file system and allow the Linux system to continue to boot even if it is unable to properly mount the RAID file system. Please refer to your distribution's documentation for more information on these parameters.

	Example (Ubuntu):

		/dev/data-vg01/data-lv01  /data  ext4  defaults,nobootwait  0  2
