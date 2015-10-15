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
	ms.date="10/14/2015"
	ms.author="cynthn"/>

# Change drive letters for a Windows VM so that you can use the D: drive as a data drive

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.


If you need to use the D drive to store data, follow these instructions to use a different drive letter for the temporary disk. Never use the temporary disk to store data that you need to keep.

Before you begin, you'll need to attach the data disk to the virtual machine. See [How to attach a data disk to a Windows virtual machine][Attach]. If you want to use an existing data disk as the D drive, make sure you've also uploaded the VHD to the Storage account. For instructions, see steps 3 and 4 in [Create and upload a Windows Server VHD to Azure][VHD].


## Temporarily move pagefile.sys to C drive

1. Connect to the virtual machine. 

2. Right-click the **Start** menu and select **System**

3. In the left-hand menu, select **Advanced system settings**.

4. In the **Performance** section, select **Settings**.

5. Under the **Advanced** tab in the **Virtual memory** section, select **Change**.

6. Select the **D** drive and then click **No paging file** and then click **Set**.

7. Select the **C** drive and then click **System managed size** and then click **Set**.

8. Click Apply. You will get a warning that the computer needs to be restarted for the changes to take affect.

9. In the Azure Management console, select the VM and at the bottom of the page, click **RESTART**.


##Change the drive letter for the temporary drive

1. Once the VM restarts, log back on to the VM.

2. In Server Manager, select **File and Storage Services** from the left pane and then select **Volumes**.

3. Right-click on **D**, the Temporary Storage drive, and select **Manage Drive Letter and Access Paths**.

4. Under Drive letter, select drive **G** and then click **OK**. 

5. Right-click on the data disk, and select **Manage Drive Letter and Access Paths**.

6. Under Drive letter, select drive **D** and then click **OK**. 

## Force the temporary storage drive on to drive E

In order to make sure the temporary disk is drive E you need to hard reboot the VM. When the VM starts after a hard reboot the temporary disk will be assigned to the first available drive letter, which will be **E**. 

1. In the Azure Management portal, select the VM and at the bottom of the page, click **SHUT DOWN**. You will be warned that the IP address will be released, click OK on the message.

2. When the VM status turns to **Stopped ((deallocated))**, click **START**.


## Move pagefile.sys back to the temporary storage drive on E

1. Connect to the VM.

2. Right-click the **Start** menu and select **System**

3. In the left-hand menu, select **Advanced system settings**.

4. In the **Performance** section, select **Settings**.

5. Under the **Advanced** tab in the **Virtual memory** section, select **Change**.

6. Select the OS drive **C** and click **No paging file** and then click **Set**.

7. Select the temporary storage drive **E** and then click **System managed size** and then click **Set**.

8. Click **Apply**. You will get a warning that the computer needs to be restarted for the changes to take affect.

9. In the Azure Management console, select the VM and at the bottom of the page, click **RESTART**.




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
