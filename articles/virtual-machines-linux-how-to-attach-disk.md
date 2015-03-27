<properties 
	pageTitle="Attach a disk to a virtual machine running Linux in Azure" 
	description="Learn how to attach a data disk to an Azure virtual machine and initialize it so it's ready for use." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/26/2015" 
	ms.author="kathydav"/>

#How to Attach a Data Disk to a Linux Virtual Machine

You can attach both empty disks and disks that contain data. In both cases, the disks are actually .vhd files that reside in an Azure storage account. Also in both cases, after you attach the disk, you'll need to initialize it so it's ready for use. 

> [AZURE.NOTE] It's a best practice to use one or more separate disks to store a virtual machine's data. When you create an Azure virtual machine, it has an operating system disk and a temporary disk. **Do not use the temporary disk to store data.** As the name implies, it provides temporary storage only. It offers no redundancy or backup because it doesn't reside in Azure storage. 
> The temporary disk is typically managed by the Azure Linux Agent and automatically mounted to **/mnt/resource** (or **/mnt** on Ubuntu images). On the other hand, on Linux the data disk might be named by the kernel as `/dev/sdc`. If that's the case, you'll need to partition, format, and mount that resource. See the [Azure Linux Agent User Guide](http://www.windowsazure.com/manage/linux/how-to-guides/linux-agent-guide/) for more information.

- [How to: Attach an empty disk](#attachempty)
- [How to: Attach an existing disk](#attachexisting)
- [How to: Initialize a new data disk in Linux](#initializeinlinux)

[WACOM.INCLUDE [howto-attach-disk-windows-linux](../includes/howto-attach-disk-windows-linux.md)]

##<a id="initializeinlinux"></a>How to: Initialize a new data disk in Linux



1. Connect to the virtual machine by using the steps listed in [How to log on to a virtual machine running Linux][logonlinux].



2. In the SSH window, type the following command, and then enter the password for the account that you created to manage the virtual machine:

		# sudo grep SCSI /var/log/messages

	>[AZURE.NOTE] For recent Ubuntu distributions, you may need to use `sudo grep SCSI /var/log/syslog` because logging to `/var/log/messages` might be disabled by default. 

	You can find the identifier of the last data disk that was added in the messages that are displayed.



	![Get the disk messages](./media/virtual-machines-linux-how-to-attach-disk/DiskMessages.png)



3. In the SSH window, type the following command to create a new device, and then enter the account password:

		# sudo fdisk /dev/sdc

	>[AZURE.NOTE] In this example you may need to use `sudo -i` on some distributions if /sbin or /usr/sbin are not in your `$PATH`.


4. Type **n** to create a new partition.


	![Create new device](./media/virtual-machines-linux-how-to-attach-disk/DiskPartition.png)

5. Type **p** to make the partition the primary partition, type **1** to make it the first partition, and then type enter to accept the default value for the cylinder.


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

[logonlinux]: virtual-machines-linux-how-to-log-on.md
