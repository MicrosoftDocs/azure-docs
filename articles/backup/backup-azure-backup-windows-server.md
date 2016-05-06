<properties
   pageTitle="Back up Windows Server or Windows Client files and folders to Azure | Microsoft Azure"
   description="Backup a Windows Server or Windows Client to Azure with this simple procedure. You can backup Windows files and folders to the cloud in a few easy steps."
   services="backup"
   documentationCenter=""
   authors="Jim-Parker"
   manager="jwhit"
   editor=""
   keywords="windows server backup; backup windows server"/>

<tags
   ms.service="backup"
   ms.workload="storage-backup-recovery"
	 ms.tgt_pltfrm="na"
	 ms.devlang="na"
	 ms.topic="article"
	 ms.date="02/05/2016"
	 ms.author="jimpark;"/>

# Back up Windows Server or Windows Client files and folders to Azure
It’s easy to back up Windows files and folders to Azure with this simple procedure. If you haven't already done so, complete the [prerequisites](backup-configure-vault.md#before-you-start) to prepare your environment to back up your Windows machine before you proceed.

## Back up files and folders
1. Once the machine is registered, open the Microsoft Azure Backup mmc snap-in.

    ![Search result](./media/backup-azure-backup-windows-server/result.png)

2. Click **Schedule Backup**

    ![Schedule a Windows Server Backup](./media/backup-azure-backup-windows-server/schedulebackup.png)

3. Select the items you wish to back up. Azure Backup on a Windows Server/Windows Client (i.e without System Center Data Protection Manager) enables you to protect files and folders.

    ![Items for Windows Server Backup](./media/backup-azure-backup-windows-server/items.png)

4. Specify the backup schedule and retention policy which is explained in detail in the following [article](backup-azure-backup-cloud-as-tape.md).

5. Choose the method for sending the initial backup. Your choice of completing the initial seeding is dependent on the amount of data you wish to back up and your internet upload link speed. If you plan to back up GB’s/TB’s of data over a high latency, low bandwidth connection, it is recommended that you complete the initial backup by shipping a disk to the nearest Azure data center. This is called “Offline Backup” and is covered in detail in this [article](backup-azure-backup-import-export.md). If you have a sufficient bandwidth connection we recommend that you complete the initial backup over the network.

    ![Initial Windows Server backup](./media/backup-azure-backup-windows-server/initialbackup.png)

6. After the schedule backup process is completed, go back to the mmc snap in and click **Back up Now** to complete the initial seeding over the network.

    ![Windows Server backup now](./media/backup-azure-backup-windows-server/backupnow.png)

7. After the initial seeding is completed, the **Jobs** view in the Azure Backup console indicates the status.

    ![IR complete](./media/backup-azure-backup-windows-server/ircomplete.png)

## Next Steps
- [Manage Windows Server or Windows Client](backup-azure-manage-windows-server.md)
- [Restore Windows Server or Windows Client from Azure](backup-azure-restore-windows-server.md)
- [Azure Backup FAQ](backup-azure-backup-faq.md)
- Visit the [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933)
