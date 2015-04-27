<properties 
	pageTitle="Configure software RAID on avirtual machine running Linux in Azure" 
	description="Learn how to use mdadm to configure RAID on Linux in Azure." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="szarkos" 
	writer="szark" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/13/2015" 
	ms.author="szark"/>



# Configure Software RAID on Linux
It's a common scenario to use software RAID on Linux virtual machines in Azure to present multiple attached data disks as a single RAID device. Typically this can be used to improve performance and allow for improved throughput compared to using just a single disk.


## Attaching data disks
Two or more empty data disks will typically be needed to configure a RAID device.  This article will not go into detail on how to attach data disks to a Linux virtual machine.  Please see the Windows Azure article [attach a disk](storage-windows-attach-disk.md#attachempty) for detailed instructions on how to attach an empty data disk to a Linux virtual machine on Azure.

>[AZURE.NOTE] The ExtraSmall VM size does not support more than one data disk attached to the virtual machine.  Please see [Virtual Machine and Cloud Service Sizes for Microsoft Azure](https://msdn.microsoft.com/library/azure/dn197896.aspx) for detailed information about VM sizes and the number of data disks supported.


## Install the mdadm utility

- **Ubuntu**

		# sudo apt-get update
		# sudo apt-get install mdadm

- **CentOS & Oracle Linux**

		# sudo yum install mdadm

- **SLES and openSUSE**

		# zypper install mdadm


## Create the disk partitions
In this example we will create a single disk partition on /dev/sdc. The new disk partition will then be called /dev/sdc1.

- Start fdisk to begin creating partitions

		# sudo fdisk /dev/sdc
		Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
		Building a new DOS disklabel with disk identifier 0xa34cb70c.
		Changes will remain in memory only, until you decide to write them.
		After that, of course, the previous content won't be recoverable.

		WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
				 switch off the mode (command 'c') and change display units to
				 sectors (command 'u').

- Press 'n' at the prompt to create a **n**ew partition:

		Command (m for help): n

- Next, press 'p' to create a **p**rimary partition:

		Command action
			e   extended
			p   primary partition (1-4)
		p

- Press '1' to select partition number 1:

		Partition number (1-4): 1

- Select the starting point of the new partition, or just press `<enter>` to accept the default to place the partition at the beginning of the free space on the drive:

		First cylinder (1-1305, default 1):
		Using default value 1

- Select the size of the partition, for example type '+10G' to create a 10 gigabyte partition. Or, just press `<enter>` create a single partition that spans the entire drive:

		Last cylinder, +cylinders or +size{K,M,G} (1-1305, default 1305): 
		Using default value 1305

- Next, change the ID and **t**ype of the partition from the default ID '83' (Linux) to ID 'fd' (Linux raid auto):

		Command (m for help): t
		Selected partition 1
		Hex code (type L to list codes): fd

- Finally, write the partition table to the drive and exit fdisk:

		Command (m for help): w
		The partition table has been altered!


## Create the RAID array

1. The following example will "stripe" (RAID level 0) three partitions located on three separate data disks (sdc1, sdd1, sde1):

		# sudo mdadm --create /dev/md127 --level 0 --raid-devices 3 \
		  /dev/sdc1 /dev/sdd1 /dev/sde1

In this example, after running this command a new RAID device called **/dev/md127** will be created. Also note that if these data disks we previously part of another defunct RAID array it may be necessary to add the `--force` parameter to the `mdadm` command.


2. Create the file system on the new RAID device

	**CentOS, Oracle Linux, openSUSE and Ubuntu**

		# sudo mkfs -t ext4 /dev/md127

	**SLES**

		# sudo mkfs -t ext3 /dev/md127

3. **SLES & openSUSE** - enable boot.md and create mdadm.conf

		# sudo -i chkconfig --add boot.md
		# sudo echo 'DEVICE /dev/sd*[0-9]' >> /etc/mdadm.conf

	>[AZURE.NOTE] A reboot may be required after making these changes on SUSE systems.


## Add the new file system to /etc/fstab

**Caution:** Improperly editing the /etc/fstab file could result in an unbootable system. If unsure, please refer to the distribution's documentation for information on how to properly edit this file. It is also recommended that a backup of the /etc/fstab file is created before editing.

1. Create the desired mount point for your new file system, for example:

		# sudo mkdir /data

2. When editing /etc/fstab, the **UUID** should be used to reference the file system rather than the device name.  Use the `blkid` utility to determine the UUID for the new file system:

		# sudo /sbin/blkid
		...........
		/dev/md127: UUID="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" TYPE="ext4"

3. Open /etc/fstab in a text editor and add an entry for the new file system, for example:

		UUID=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee  /data  ext4  defaults  0  2

	Or on **SLES & openSUSE**:

		/dev/disk/by-uuid/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee  /data  ext3  defaults  0  2

	Then, save and close /etc/fstab.

4. Test that the /etc/fstab entry is correct:

		# sudo mount -a

	If this command results in an error message please check the syntax in the /etc/fstab file.

	Next run the `mount` command to ensure the file system is mounted:

		# mount
		.................
		/dev/md127 on /data type ext4 (rw)

5. (Optional) Failsafe Boot Parameters

	**fstab configuration**

	Many distributions include either the `nobootwait` or `nofail` mount parameters that may be added to the /etc/fstab file. These parameters allow for failures when mounting a particular file system and allow the Linux system to continue to boot even if it is unable to properly mount the RAID file system. Please refer to your distribution's documentation for more information on these parameters.

	Example (Ubuntu):

		UUID=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee  /data  ext4  defaults,nobootwait  0  2

	**Linux boot parameters**

	In addition to the above parameters, the kernel parameter "`bootdegraded=true`" can allow the system to boot even if the RAID is perceived as damaged or degraded, for example if a data drive is inadvertently removed from the virtual machine. By default this could also result in a non-bootable system.

	Please refer to your distribution's documentation on how to properly edit kernel parameters. For example, in many distributions (CentOS, Oracle Linux, SLES 11) these parameters may be added manually to the "`/boot/grub/menu.lst`" file.  On Ubuntu this parameter can be added to the `GRUB_CMDLINE_LINUX_DEFAULT` variable on "/etc/default/grub".

