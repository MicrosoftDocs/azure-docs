---
title: Restore data in Azure to a Windows Server or Windows computer
description: Learn how to restore data stored in Azure to a Windows Server or Windows computer.
services: backup
author: saurabhsensharma
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 9/7/2018
ms.author: saurse
---
# Restore files to a Windows server or Windows client machine using Resource Manager deployment model

This article explains how to restore data from a backup vault. To restore data, you use the Recover Data wizard in the Microsoft Azure Recovery Services (MARS) agent. When you restore data, it is possible to:

* Restore data to the same machine from which the backups were taken.
* Restore data to an alternate machine.

In January 2017, Microsoft released a Preview update to the MARS agent. Along with bug fixes, this update enables Instant Restore, which allows you to mount a writeable recovery point snapshot as a recovery volume. You can then explore the recovery volume and copy files to a local computer thereby selectively restoring files.

> [!NOTE]
> The [January 2017 Azure Backup update](https://support.microsoft.com/en-us/help/3216528?preview) is required if you want to use Instant Restore to restore data. Also the backup data must be protected in vaults in locales listed in the support article. Consult the [January 2017 Azure Backup update](https://support.microsoft.com/en-us/help/3216528?preview) for the latest list of locales that support Instant Restore. Instant Restore is **not** currently available in all locales.
>

Use Instant Restore with Recovery Services vaults in the Azure portal. If you stored data in Backup vaults, they have been converted to Recovery Services vaults. If you want to use Instant Restore, download the MARS update, and follow the procedures that mention Instant Restore.

[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)]

## Use Instant Restore to recover data to the same machine

If you accidentally deleted a file and wish to restore it to the same machine (from which the backup is taken), the following steps will help you recover the data.

1. Open the **Microsoft Azure Backup** snap in. If you don't know where the snap in was installed, search the computer or server for **Microsoft Azure Backup**.

    The desktop app should appear in the search results.

2. Click **Recover Data** to start the wizard.

    ![Recover Data](./media/backup-azure-restore-windows-server/recover.png)

3. On the **Getting Started** pane, to restore the data to the same server or computer, select **This server (`<server name>`)** and click **Next**.

    ![Choose This server option to restore the data to the same machine](./media/backup-azure-restore-windows-server/samemachine_gettingstarted_instantrestore.png)

4. On the **Select Recovery Mode** pane, choose
**Individual files and folders** and then click **Next**.

    ![Browse files](./media/backup-azure-restore-windows-server/samemachine_selectrecoverymode_instantrestore.png)
> [!IMPORTANT]
> The option to restore *Individual Files and Folders* requires .NET Framework 4.5.2 or higher. If you do not see the *Individual Files and Folders* option, you must upgrade .NET Framework to version 4.5.2 or higher and try again.

> [!TIP]
> The *Individual Files and Folders* option allows for quick access to the recovery point data. It is suitable for recovering individual files, with sizes totalling not more than 80 GB in size and offers transfer/copy speeds up to 6 MBps during recovery. The *Volume* option recovers all backed up data in a given Volume. This option provides faster transfer speeds (upto 60 MBps), which is ideal for recovering large sized data or entire volumes.

5. On the **Select Volume and Date** pane, select the volume that contains the files and/or folders you want to restore.

    On the calendar, select a recovery point. You can restore from any recovery point in time. Dates in **bold** indicate the availability of at least one recovery point. Once you select a date, if multiple recovery points are available, choose the specific recovery point from the **Time** drop-down menu.

    ![Volume and Date](./media/backup-azure-restore-windows-server/samemachine_selectvolumedate_instantrestore.png)

6. Once you have chosen the recovery point to restore, click **Mount**.

    Azure Backup mounts the local recovery point, and uses it as a recovery volume.

7. On the **Browse and Recover Files** pane, click **Browse** to open Windows Explorer and find the files and folders you want.

    ![Recovery options](./media/backup-azure-restore-windows-server/samemachine_browserecover_instantrestore.png)


8. In Windows Explorer, copy the files and/or folders you want to restore and paste them to any location local to the server or computer. You can open or stream the files directly from the recovery volume and verify that you are recovering the correct versions.

    ![Copy and paste files and folders from mounted volume to local location](./media/backup-azure-restore-windows-server/samemachine_copy_instantrestore.png)


9. When you are finished restoring the files and/or folders, on the **Browse and Recovery Files** pane, click **Unmount**. Then click **Yes** to confirm that you want to unmount the volume.

    ![Unmount the volume and confirm](./media/backup-azure-restore-windows-server/samemachine_unmount_instantrestore.png)

    > [!Important]
    > If you do not click Unmount, the Recovery Volume will remain mounted for 6 hours from the time when it was mounted. However, the mount time is extended upto a maximum of 24 hours in case of an ongoing file-copy. No backup operations will run while the volume is mounted. Any backup operation scheduled to run during the time when the volume is mounted, will run after the recovery volume is unmounted.
    >


## Use Instant Restore to restore data to an alternate machine
If your entire server is lost, you can still recover data from Azure Backup to a different machine. The following steps illustrate the workflow.


The terminology used in these steps includes:

* *Source machine* – The original machine from which the backup was taken and which is currently unavailable.
* *Target machine* – The machine to which the data is being recovered.
* *Sample vault* – The Recovery Services vault to which the *Source machine* and *Target machine* are registered. <br/>

> [!NOTE]
> Backups can't be restored to a target machine running an earlier version of the operating system. For example, a backup taken from a Windows 7 computer can be restored on a Windows 8, or later, computer. A backup taken from a Windows 8 computer cannot be restored to a Windows 7 computer.
>
>

1. Open the **Microsoft Azure Backup** snap in on the *Target machine*.

2. Ensure the *Target machine* and the *Source machine* are registered to the same Recovery Services vault.

3. Click **Recover Data** to open the **Recover Data wizard**.

    ![Recover Data](./media/backup-azure-restore-windows-server/recover.png)

4. On the **Getting Started** pane, select **Another server**

    ![Another Server](./media/backup-azure-restore-windows-server/alternatemachine_gettingstarted_instantrestore.png)

5. Provide the vault credential file that corresponds to the *Sample vault*, and click **Next**.

    If the vault credential file is invalid (or expired), download a new vault credential file from the *Sample vault* in the Azure portal. Once you provide a valid vault credential, the name of the corresponding Backup Vault appears.


6. On the **Select Backup Server** pane, select the *Source machine* from the list of displayed machines and provide the passphrase. Then click **Next**.

    ![List of machines](./media/backup-azure-restore-windows-server/alternatemachine_selectmachine_instantrestore.png)

7. On the **Select Recovery Mode** pane, select **Individual files and folders** and click **Next**.

    ![Search](./media/backup-azure-restore-windows-server/alternatemachine_selectrecoverymode_instantrestore.png)

8. On the **Select Volume and Date** pane, select the volume that contains the files and/or folders you want to restore.

    On the calendar, select a recovery point. You can restore from any recovery point in time. Dates in **bold** indicate the availability of at least one recovery point. Once you select a date, if multiple recovery points are available, choose the specific recovery point from the **Time** drop-down menu.

    ![Search items](./media/backup-azure-restore-windows-server/alternatemachine_selectvolumedate_instantrestore.png)

9. Click **Mount** to locally mount the recovery point as a recovery volume on your *Target machine*.

10. On the **Browse and Recover Files** pane, click **Browse** to open Windows Explorer and find the files and folders you want.

    ![Encryption](./media/backup-azure-restore-windows-server/alternatemachine_browserecover_instantrestore.png)

11. In Windows Explorer, copy the files and/or folders from the recovery volume and paste them to your *Target machine* location. You can open or stream the files directly from the recovery volume and verify the correct versions are recovered.

    ![Encryption](./media/backup-azure-restore-windows-server/alternatemachine_copy_instantrestore.png)

12. When you are finished restoring the files and/or folders, on the **Browse and Recovery Files** pane, click **Unmount**. Then click **Yes** to confirm that you want to unmount the volume.

    ![Encryption](./media/backup-azure-restore-windows-server/alternatemachine_unmount_instantrestore.png)

    > [!Important]
    > If you do not click Unmount, the Recovery Volume will remain mounted for 6 hours from the time when it was mounted. However, the mount time is extended upto a maximum of 24 hours in case of an ongoing file-copy. No backup operations will run while the volume is mounted. Any backup operation scheduled to run during the time when the volume is mounted, will run after the recovery volume is unmounted.
    >

## Next steps
* Now that you've recovered your files and folders, you can [manage your backups](backup-azure-manage-windows-server.md).
