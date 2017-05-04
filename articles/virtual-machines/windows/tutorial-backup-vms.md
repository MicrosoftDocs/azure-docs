---
title: Backup Azure Windows VMs | Microsoft Docs'
description: Protect your Windows VMs by backing them up using Azure Backup.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/04/2017
ms.author: cynthn
---
# Back up Windows virtual machines in Azure

## Backup overview

You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery pointy you can restore the whole VM or just specific files. This article explains how to restore a single file to a VM.

### How does Azure back up virtual machines?
When the Azure Backup service initiates a backup job at the scheduled time, it triggers the backup extension to take a point-in-time snapshot. The Azure Backup service uses the _VMSnapshot_ extension. The extension is installed during the first VM backup if the VM is running. If the VM is not running, the Backup service takes a snapshot of the underlying storage (since no application writes occur while the VM is stopped).

When taking a snapshot of Windows VMs, the Backup service coordinates with the Volume Shadow Copy Service (VSS) to get a consistent snapshot of the virtual machine's disks. Once the Azure Backup service takes the snapshot, the data is transferred to the vault. To maximize efficiency, the service identifies and transfers only the blocks of data that have changed since the previous backup.

![Azure virtual machine backup architecture](../../backup/media/backup-azure-vms-introduction/vmbackup-architecture.png)

When the data transfer is complete, the snapshot is removed and a recovery point is created.


## Create a backup
Create a simple scheduled daily backup to a Recovery Services Vault. 

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the menu on the left, select **Virtual machines**. 
3. From the list, select a VM to back up.
4. On the VM blade, in the **Settings** section, click **Backup**. The **Enable backup** blade opens.
5. In **Recovery Services vault**, click **Create new** and provide the name for the new vault. A new vault is created in the same Resource Group and location as the virtual machine.
6. Click **Backup policy**. For this example, keep the defaults and click **OK**.
7. On the **Enable backup** blade, click **Enable Backup**. This will create a daily backup based on the default schedule.
10. To create an initial recovery point, on the **Backup** blade click **Backup now**.
11. On the **Backup Now** blade, click the calendar icon, use the calendar control to select the last day this recovery point is retained, and click **Backup**.

The first backup takes about 20 minutes. Proceed to the next part of this tutorial after you backup is finished.

## Recover a file

If you accidentally delete or make changes to a file, you can use File Recovery to recover the file from your backup vault. File Recovery uses a script that runs on the VM, to mount the a recovery point as local drive. These drives will remain mounted for 12 hours so that you can copy files from the recovery point and restore them to the VM.  

For this example, we are showing a Windows VM with IIS installed. We will delete the image file that is used in the default web page for IIS. 

1. Open a browser and connect to the IP address of the VM to show the default IIS page.
2. Connect to the VM.
3. On the VM, open **File Explorer** and navigate to \inetpub\wwwroot and delete the file **iisstart.png**.
4. On your local computer, refresh the browser to see that the image is gone.
5. On your local computer, open a new tab and go the the [Azure portal](portal.azure.com).
6. In the menu on the left, select **Virtual machines**. 
7. From the list, select the VM.
8. On the VM blade, in the **Settings** section, click **Backup**. The **Backup** blade opens. 
9. In the menu at the top of the blade, select **File Recovery (Preview)**. The **File Recovery (Preview) blade opens.
10. In **Step 1: Select recovery point**, select a recovery point from the drop-down.
11. In **Step 2: Download script to browse and recover files**, click the **Download Executable** button. Save the downloaded file to your **Downloads** folder.
12. On your local machine, open **File Explorer** and navigate to your **Downloads** folder and copy the downloaded .exe file. The filename will be prefixed by your VM name. 
13. On your VM (over the RDP connection) paste the .exe file to the Desktop of your VM. 
14. Navigate to the desktop of your VM and double-click on the .exe. This will launch a command prompt and then mount the recovery point as a file share that you can access. When it is finished creating the share, type **q** to close the command prompt.
15. Open file explorer and navigate to the drive letter that was used for the file share.
16. Navigate to \inetpub\wwwroot and copy **iisstart.png** from the file share and paste it into \inetpub\wwwroot. For example, copy F:\inetpub\wwwroot\iisstart.png and paste it into c:\inetpub\wwwroot to recover the file.
17. On your local machine, open the browser tab where you are connected to the VM and the IIS default page. Press CTRL + F5 to refersh the browser page and you should now see that the image has been restored.
18. When you are done recovering files, got back to the browser and in **Step 3: Unmount the disks after recovery** click the **Unmount Disks** button.








