<properties
	pageTitle="Attach a disk to a virtual machine running Linux in Azure"
	description="Learn how to attach a data disk to an Azure virtual machine and initialize it so it's ready for use."
	services="virtual-machines"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2015"
	ms.author="dkshir"/>

# How to Attach a Data Disk to a Linux Virtual Machine

You can attach both empty disks and disks that contain data. In both cases, the disks are actually .vhd files that reside in an Azure storage account. Also in both cases, after you attach the disk, you'll need to initialize it so it's ready for use. This article refers to virtual machines created using the classic deployment model.

> [AZURE.NOTE] It's a best practice to use one or more separate disks to store a virtual machine's data. When you create an Azure virtual machine, it has an operating system disk and a temporary disk. **Do not use the temporary disk to store data.** As the name implies, it provides temporary storage only. It offers no redundancy or backup because it doesn't reside in Azure storage.
> The temporary disk is typically managed by the Azure Linux Agent and automatically mounted to **/mnt/resource** (or **/mnt** on Ubuntu images). On the other hand, a data disk might be named by the Linux kernel something like `/dev/sdc`, and you'll need to partition, format, and mount this resource. See the [Azure Linux Agent User Guide][Agent] for details.

[AZURE.INCLUDE [howto-attach-disk-windows-linux](../../includes/howto-attach-disk-linux.md)]

## How to: Initialize a new data disk in Linux

1. Connect to the virtual machine. For instructions, see [How to log on to a virtual machine running Linux][Logon].



2. Next you need to find the device identifier for the data disk to initialize. There are two ways to do that:

	a) In the SSH window, type the following command, and then enter the password for the account that you created to manage the virtual machine:

			$sudo grep SCSI /var/log/messages

	For recent Ubuntu distributions, you may need to use `sudo grep SCSI /var/log/syslog` because logging to `/var/log/messages` might be disabled by default.

	You can find the identifier of the last data disk that was added in the messages that are displayed.

	![Get the disk messages](./media/virtual-machines-linux-how-to-attach-disk/DiskMessages.png)

	OR

	b) Use the `lsscsi` command to find out the device id. `lsscsi` can be installed by either `yum install lsscsi` (on Red Hat based distributions) or `apt-get install lsscsi` (on Debian based distributions). You can find the disk you are looking for by its _lun_ or **logical unit number**. For example, the _lun_ for the disks you attached can be easily seen from `azure vm disk list <virtual-machine>` as:

			~$ azure vm disk list ubuntuVMasm
			info:    Executing command vm disk list
			+ Fetching disk images
			+ Getting virtual machines
			+ Getting VM disks
			data:    Lun  Size(GB)  Blob-Name                         OS
			data:    ---  --------  --------------------------------  -----
			data:         30        ubuntuVMasm-2645b8030676c8f8.vhd  Linux
			data:    1    10        test.VHD
			data:    2    30        ubuntuVMasm-76f7ee1ef0f6dddc.vhd
			info:    vm disk list command OK

	Compare this with the output of `lsscsi` for the same sample virtual machine:

			adminuser@ubuntuVMasm:~$ lsscsi
			[1:0:0:0]    cd/dvd  Msft     Virtual CD/ROM   1.0   /dev/sr0
			[2:0:0:0]    disk    Msft     Virtual Disk     1.0   /dev/sda
			[3:0:1:0]    disk    Msft     Virtual Disk     1.0   /dev/sdb
			[5:0:0:0]    disk    Msft     Virtual Disk     1.0   /dev/sdc
			[5:0:0:1]    disk    Msft     Virtual Disk     1.0   /dev/sdd
			[5:0:0:2]    disk    Msft     Virtual Disk     1.0   /dev/sde

	The last number in the tuple in each row is the _lun_. See `man lsscsi` for more information.

3. In the SSH window, type the following command to create a new device, and then enter the account password:

		$sudo fdisk /dev/sdc

	>[AZURE.NOTE] In this example you may need to use `sudo -i` on some distributions if /sbin or /usr/sbin are not in your `$PATH`.


4. When prompted, type **n** to create a new partition.


	![Create new device](./media/virtual-machines-linux-how-to-attach-disk/DiskPartition.png)

5. When prompted, type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value for the cylinder.


	![Create partition](./media/virtual-machines-linux-how-to-attach-disk/DiskCylinder.png)



6. Type **p** to see the details about the disk that is being partitioned.


	![List disk information](./media/virtual-machines-linux-how-to-attach-disk/DiskInfo.png)



7. Type **w** to write the settings for the disk.


	![Write the disk changes](./media/virtual-machines-linux-how-to-attach-disk/DiskWrite.png)

8. Make the file system on the new partition. As an example, type the following command and then enter the account password:

		# sudo mkfs -t ext4 /dev/sdc1

	![Create file system](./media/virtual-machines-linux-how-to-attach-disk/DiskFileSystem.png)

	>[AZURE.NOTE] Note that SUSE Linux Enterprise 11 systems only support read-only access for ext4 file systems.  For these systems it is recommended to format the new file system as ext3 rather than ext4.


9. Make a directory to mount the new file system. As an example, type the following command  and then enter the account password:

		# sudo mkdir /datadrive


10. Type the following command to mount the drive:

		# sudo mount /dev/sdc1 /datadrive

	The data disk is now ready to use as **/datadrive**.


11. Add the new drive to /etc/fstab:

	To ensure the drive is re-mounted automatically after a reboot it must be added to the /etc/fstab file. In addition, it is highly recommended that the UUID (Universally Unique IDentifier) is used in /etc/fstab to refer to the drive rather than just the device name (i.e. /dev/sdc1). To find the UUID of the new drive you can use the **blkid** utility:

		# sudo -i blkid

	The output will look similar to the following:

		/dev/sda1: UUID="11111111-1b1b-1c1c-1d1d-1e1e1e1e1e1e" TYPE="ext4"
		/dev/sdb1: UUID="22222222-2b2b-2c2c-2d2d-2e2e2e2e2e2e" TYPE="ext4"
		/dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4"


	>[AZURE.NOTE] Improperly editing the **/etc/fstab** file could result in an unbootable system. If unsure, please refer to the distribution's documentation for information on how to properly edit this file. It is also recommended that a backup of the /etc/fstab file is created before editing.

	Next, open the **/etc/fstab** file in a text editor. Note that /etc/fstab is a system file, so you will need to use `sudo` to edit this file, for example:

		# sudo vi /etc/fstab

	In this example we will use the UUID value for the new **/dev/sdc1** device that was created in the previous steps, and the mountpoint **/datadrive**. Add the following line to the end of the **/etc/fstab** file:

		UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults   1   2

	Or, on systems based on SUSE Linux you may need to use a slightly different format:

		/dev/disk/by-uuid/33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /   ext3   defaults   1   2

	You can now test that the file system is mounted properly by simply unmounting and then re-mounting the file system, i.e. using the example mount point `/datadrive` created in the earlier steps:

		# sudo umount /datadrive
		# sudo mount /datadrive

	If the `mount` command produces an error, check the /etc/fstab file for correct syntax. If additional data drives or partitions are created you will need to enter them into /etc/fstab separately as well.


>[AZURE.NOTE] Subsequently removing a data disk without editing fstab could cause the VM to fail to boot. If this is a common occurrence, most distributions provide either the `nofail` and/or `nobootwait` fstab options that will allow a system to boot even if the disk fails to mount at boot time. Please consult your distribution's documentation for more information on these parameters.

## Additional Resources
[How to log on to a virtual machine running Linux][Logon]

[How to detach a disk from a Linux virtual machine ](virtual-machines-linux-how-to-detach-disk.md)

[Using the Azure CLI with the Service Management API](virtual-machines-command-line-tools.md)

<!--Link references-->
[Agent]: virtual-machines-linux-agent-user-guide.md
[Logon]: virtual-machines-linux-how-to-log-on.md
