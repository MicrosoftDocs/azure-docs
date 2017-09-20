---
title: Recover files from Azure to a Windows Server | Microsoft Docs
description: This tutorial details recovering items from Azure to a Windows Server.
services: backup
documentationcenter: ''
author: saurabhsensharma
manager: shivamg
editor: ''
keywords: windows server back up;restore files windows server; back up and disaster recovery

ms.assetid: 
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: saurabhsensharma;markgal;
ms.custom:

---
# Recover files from Azure to a Windows Server

Azure Backup enables the recovery of individual items from backups of your Windows Server, so that you can quickly retrieve files that are deleted accidentally. This tutorial covers how you can use the Microsoft Azure Recovery Services Agent (MARS) Agent to recover items from backups in Azure to the server where they were backed up from. In this tutorial you learn how to:

> [!div class="checklist"]
> * Initiate recovery of individual items 
> * Select a recovery point 
> * Recover items from a snapshot of the recovery point

This tutorial assumes you have already performed the steps to [Back up a Windows Server to Azure](backup-configure-vault.md) and have at least one backup of your Windows Server files in Azure. 

## Initiate recovery of individual items

Use the Microsoft Azure Recovery Services agent to identify the files or folders you want to restore to Windows Server.

1. Open the **Microsoft Azure Recovery Services** agent. You can find it by searching your machine for **Microsoft Azure Backup**.

    ![Backup pending](./media/tutorial-backup-restore-files-windows-server/mars.png)

2. Click **Recover Data** in the **Actions Pane** of the agent console to start the **Recover Data** wizard.

    ![Backup pending](./media/tutorial-backup-restore-files-windows-server/mars-recover-data.png)

3. On the **Getting Started** page, select **This server (server name)** and click **Next**.

4. On the **Select Recovery Mode** page, select **Individual files and folders** and then click **Next** to begin the recovery point selection process.
 
5. On the **Select Volume and Date** page, select the volume that contains the files and/or folders you want to restore.

    ![Backup pending](./media/tutorial-backup-restore-files-windows-server/mars-select-date.png)

6. On the calendar, select a date, and select a time from the drop-down menu on the page to be used for recovery. Dates in **bold** indicate the availability of at least one backup on that day. 
 
## Recover items from a snapshot of the recovery point

1.	Once you have chosen the recovery point to restore, click **Mount**. When you click **Mount**, Azure Backup provides a snapshot of the recovery point, and makes it available as a disk to browse and recover files.
2.	Once the recovery volume is mounted, click **Browse** to open Windows Explorer and find the files and folders you wish to recover. 

    ![Backup pending](./media/tutorial-backup-restore-files-windows-server/mars-browse-recover.png)

3.	You can open the files directly from the recovery volume and verify the files.
4.  In the Windows Explorer, copy the files and/or folders you want to restore and paste them to any desired location on the server.

    ![Backup pending](./media/tutorial-backup-restore-files-windows-server/mars-final.png)

5.	When you are finished restoring the files and/or folders, click **Unmount** on the **Browse and Recovery Files** page of the **Recover Data** wizard. 
6.	Click **Yes** to confirm that you want to unmount the volume.

    Once the snapshot is unmounted, **Job Completed** appears in the **Jobs** pane in the agent console.

## Next steps

To learn more, see the tutorial for backing up multiple virtual machines.

> [!div class="nextstepaction"]
> [Back up virtual machines at scale](tutorial-backup-azure-vm.md)
