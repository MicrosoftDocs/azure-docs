<properties 
	pageTitle="How To Change the Drive Letter of the Windows Temporary Disk" 
	description="Describes how to remap the temporary disk on a Windows VM in Azure" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/15/2015" 
	ms.author="kathydav"/>

#How To Change the Drive Letter of the Windows Temporary Disk

If you need to use the D drive to store data, follow these instructions to use a different drive for the temporary disk. Never use the temporary drive to store data that you need to keep.

Before you begin, you'll need a data disk attached to the virtual machine so you can store the Windows page file (pagefile.sys) during this procedure. See [How to Attach a Data Disk to a Windows Virtual Machine] if you don't have one. For instructions how to find out what disks are attached, see "Manage your disks" in [About Virtual Machine Disks in Azure].

If you want to use an existing data disk on the D drive, make sure you've also uploaded the VHD to the storage account. For instructions, see steps 3 and 4 in [Create and Upload a Windows Server VHD to Azure].

> [AZURE.WARNING] If you resize a virtual machine and doing that moves the virtual machine to a different host, the temporary drive changes back to the D drive.

##Change the drive letter

1. Log in to the virtual machine. 

2. Move pagefile.sys from the D drive to another drive.

3. Restart the virtual machine.

4. 	Log in again and change the drive letter from D to E.

5.	From the [Azure Management Portal](http://manage.windowsazure.com), attach an existing data disk or an empty data disk.

6.	Log in to the virtual machine again, initialize the disk, and assign D as the drive letter for the disk you just attached.

7.	Verify that E is mapped to the Temporary Storage disk.

8.	Move pagefile.sys from the other drive to the E drive.

##Additional Resources
[How to Log on to a Virtual Machine Running Windows Server]

[How to Detach a Data Disk from a Virtual Machine]

[About Azure Storage Accounts]

<!--Link references-->
[How to Attach a Data Disk to a Windows Virtual Machine]: storage-windows-attach-disk.md
[About Virtual Machine Disks in Azure]: http.md://msdn.microsoft.com/library/azure/dn790303.aspx
[Create and Upload a Windows Server VHD to Azure]: virtual-machines-create-upload-vhd-windows-server.md
[How to Log on to a Virtual Machine Running Windows Server]: virtual-machines-log-on-windows-server.md
[How to Detach a Data Disk from a Virtual Machine]: storage-windows-detach-disk.md
[About Azure Storage Accounts]: storage-whatis-account.md


