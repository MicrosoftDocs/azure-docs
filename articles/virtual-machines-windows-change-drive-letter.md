<properties title="How To Change the Drive Letter of the Windows Temporary Disk" pageTitle="How To Change the Drive Letter of the Windows Temporary Disk" description="Describes how to remap the temporary disk on a Windows VM in Azure" metaKeywords="" services="virtual machines" solutions="" documentationCenter="" authors="kathydav" videoId="" scriptId="" />

#How To Change the Drive Letter of the Windows Temporary Disk

<p> You can change the drive letter of the temporary disk if you need to use the D drive for another purpose. Most likely you'd do this to support an application or service that uses the D drive as a permanent storage location. 

Before you begin, make sure you’ve got the following: 

- One attached data disk that you can use to store the Windows page file (pagefile.sys) during this procedure. For instructions, see [How to Attach a Data Disk to a Windows Virtual Machine](../storage-windows-attach-disk).
- If you want to use an existing data disk on the D drive, the uploaded VHD available in the storage account. For instructions, see 


##Change the drive letter

1. Log in to the virtual machine. 

2. Move pagefile.sys from the D drive to another drive.

3. Restart  the virtual machine.

4. 	Log in again and change the drive letter from D to E.

5.	From the [Azure Management Portal](http://manage.windowsazure.com), attach an existing data disk or an empty data disk.

6.	Log in to the virtual machine again, initialize the disk, and assign D as the drive letter for the disk you just attached.

7.	Verify that E is mapped to the Temporary Storage disk.

8.	Move pagefile.sys from the other drive to the E drive.

##Additional Resources
[How to Log on to a Virtual Machine Running Windows Server]

[How to Detach a Data Disk from a Virtual Machine]

[What is a Storage Account?]

<!--Link references-->
[How to Log on to a Virtual Machine Running Windows Server]: ../virtual-machines-log-on-windows-server/
[How to Detach a Data Disk from a Virtual Machine]: ../storage-windows-detach-disk/
[What is a Storage Account?]: ../storage-whatis-account/
