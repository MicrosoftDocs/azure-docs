<properties
	pageTitle="Make the D drive of a VM a data disk | Microsoft Azure"
	description="Describes how to change drive letters for a Windows VM created using the classic deployment model so that you can use the D: drive as a data drive."
	services="virtual-machines"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/03/2015"
	ms.author="cynthn"/>

# Use the D drive as a data drive on a Windows VM 

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.


If you need to use the D drive to store data, follow these instructions to use a different drive letter for the temporary disk. Never use the temporary disk to store data that you need to keep.

## Attach the data disk

First, you'll need to attach the data disk to the virtual machine. To attach a new disk, see [How to attach a data disk to a Windows virtual machine][Attach]. 

If you want to use an existing data disk, make sure you've also uploaded the VHD to the Storage account. For instructions, see steps 3 and 4 in [Create and upload a Windows Server VHD to Azure][VHD]. 


## Temporarily move pagefile.sys to C drive

1. Connect to the virtual machine. 

2. Right-click the **Start** menu and select **System**.

3. In the left-hand menu, select **Advanced system settings**.

4. In the **Performance** section, select **Settings**.

5. Select the **Advanced** tab.

5. In the **Virtual memory** section, select **Change**.

6. Select the **C** drive and then click **System managed size** and then click **Set**.

7. Select the **D** drive and then click **No paging file** and then click **Set**.

8. Click Apply. You will get a warning that the computer needs to be restarted for the changes to take affect.

9. Restart the virtual machine.




## Change the drive letters 

1. Once the VM restarts, log back on to the VM.

2. Click the **Start** menu and type **diskmgmt.msc** and hit Enter. Disk Management will start.

3. Right-click on **D**, the Temporary Storage drive, and select **Change Drive Letter and Paths**.

4. Under Drive letter, select drive **G** and then click **OK**. 

5. Right-click on the data disk, and select **Change Drive Letter and Paths**.

6. Under Drive letter, select drive **D** and then click **OK**. 

7. Right-click on **G**, the Temporary Storage drive, and select **Change Drive Letter and Paths**.

8. Under Drive letter, select drive **E** and then click **OK**. 

> [AZURE.NOTE] If your VM has other disks or drives, use the same method to reassign the drive letters of the other disks and drives. You want the disk configuration to be:  
>- C: OS disk  
>- D: Data Disk  
>- E: Temporary disk



## Move pagefile.sys back to the temporary storage drive 

1. Right-click the **Start** menu and select **System**

2. In the left-hand menu, select **Advanced system settings**.

3. In the **Performance** section, select **Settings**.

4. Select the **Advanced** tab.

5. In the **Virtual memory** section, select **Change**.

6. Select the OS drive **C** and click **No paging file** and then click **Set**.

7. Select the temporary storage drive **E** and then click **System managed size** and then click **Set**.

8. Click **Apply**. You will get a warning that the computer needs to be restarted for the changes to take affect.

9. Restart the virtual machine.




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
