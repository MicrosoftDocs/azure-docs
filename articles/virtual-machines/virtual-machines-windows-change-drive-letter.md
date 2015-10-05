<properties
	pageTitle="Change the drive letter of the temporary disk | Microsoft Azure"
	description="Change the drive letter of the temporary disk on a Windows virtual machine created with the classic deployment model."
	services="virtual-machines"
	documentationCenter=""
	authors="cynthn
"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/27/2015"
	ms.author="cynthn"/>

#Change the drive letter of the Windows temporary disk on a virtual machine created with the classic deployment model

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers creating resources with the classic deployment model.

If you need to use the D drive to store data, follow these instructions to use a different drive for the temporary disk. Never use the temporary disk to store data that you need to keep.

Before you begin, you'll need a data disk attached to the virtual machine so you can store the Windows page file (pagefile.sys) during this procedure. See [How to attach a data disk to a Windows virtual machine][Attach] if you don't have one. For instructions on how to find out what disks are attached, see "Find the disk" in [How to detach a data disk from a Windows virtual machine][Detach].

If you want to use an existing data disk on the D drive, make sure you've also uploaded the VHD to the Storage account. For instructions, see steps 3 and 4 in [Create and upload a Windows Server VHD to Azure][VHD].

> [AZURE.WARNING] If you resize or "Stop (Deallocate)" a virtual machine, this may trigger placement of the virtual machine to a new hypervisor. A planned or unplanned maintenance event may also trigger this placement. In this scenario, the temporary disk will be reassigned to the first available drive letter. If you have an application that specifically requires the "D" drive, ensure that after moving the pagefile, you assign a new persistent disk and assign it the letter D. Azure will not take back the letter D.

> [AZURE.WARNING] If you resize a virtual machine after explicitly moving the pagefile, note that you may encounter an error on boot if the new virtual machine's temporary disk is not large enough to contain the pagefile of the original VM size. You may also encounter this error if the temporary drive was not set to the next available drive letter, causing Windows to reference an invalid drive letter in pagefile configuration while Azure creates the temporary drive with the next available drive letter.

##Change the drive letter

1. Log on to the virtual machine. For details, see [How to log on to a virtual machine running Windows Server][Logon].

2. Move pagefile.sys from the D drive to another drive.

3. Restart the virtual machine.

4. Log on again and change the drive letter from D to E.

5. From the [Azure portal](http://manage.windowsazure.com), attach an existing data disk or an empty data disk.

6.	Log on to the virtual machine again, initialize the disk, and assign D as the drive letter for the disk you just attached.

7.	Verify that E is mapped to the temporary disk.

8.	Move pagefile.sys from the other drive to the E drive.

9.	Restart the virtual machine.



## Additional resources
[How to log on to a virtual machine running Windows Server][Logon]

[How to detach a data disk from a Windows virtual machine][Detach]

[About Azure Storage accounts][Storage]

<!--Link references-->
[Attach]: storage-windows-attach-disk.md



[VHD]: virtual-machines-create-upload-vhd-windows-server.md

[Logon]: virtual-machines-log-on-windows-server.md

[Detach]: storage-windows-detach-disk.md

[Storage]: ../storage-whatis-account.md
