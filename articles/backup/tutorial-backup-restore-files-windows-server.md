---
title: Tutorial - Recover items to Windows Server by using Azure Backup
description: In this tutorial, learn how to use the Microsoft Azure Recovery Services Agent (MARS) agent to recover items from Azure to a Windows Server.
ms.service: backup
ms.topic: tutorial
ms.date: 04/19/2024
ms.custom: mvc, engagement-fy24
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Tutorial: Recover files from Azure to a Windows Server

This tutorial describes how to recover files from Azure to a Windows Server.

Azure Backup enables the recovery of individual items from backups of your Windows Server. Recovering individual files is helpful if you must quickly restore files that are accidentally deleted. This tutorial covers how you can use the Microsoft Azure Recovery Services Agent (MARS) agent to recover items from backups you have already performed in Azure.

## Before you start

Ensure that you have [backed up a Windows Server to Azure](backup-windows-with-mars-agent.md) and have at least one recovery point of your Windows Server files in Azure.

## Initiate recovery of individual items

A helpful user interface wizard named Microsoft Azure Backup is installed with the Microsoft Azure Recovery Services (MARS) agent. The Microsoft Azure Backup wizard works with the Microsoft Azure Recovery Services (MARS) agent to retrieve backup data from recovery points stored in Azure. Use the Microsoft Azure Backup wizard to identify the files or folders you want to restore to Windows Server.

To start recovery of individual items, follow these steps:

1. Open the **Microsoft Azure Backup** snap-in. You can find it by searching your machine for **Microsoft Azure Backup**.

    :::image type="content" source="./media/tutorial-backup-restore-files-windows-server/mars.png" alt-text="Screenshot shows the Microsoft Azure Backup snap-in." lightbox="./media/tutorial-backup-restore-files-windows-server/mars.png":::

2. In the wizard, select **Recover Data** in the **Actions Pane** of the agent console to start the **Recover Data** wizard.

   :::image type="content" source="./media/tutorial-backup-restore-files-windows-server/mars-recover-data.png" alt-text="Screenshot shows how to select Recover Data." lightbox="./media/tutorial-backup-restore-files-windows-server/mars-recover-data.png":::

3. On the **Getting Started** page, select **This server (server name)** and select **Next**.

4. On the **Select Recovery Mode** page, select **Individual files and folders** and then select **Next** to begin the recovery point selection process.

5. On the **Select Volume and Date** page, select the volume that contains the files or folders you want to restore, and select **Mount**. Select a date, and select a time from the drop-down menu that corresponds to a recovery point. Dates in **bold** indicate the availability of at least one recovery point on that day.

    :::image type="content" source="./media/tutorial-backup-restore-files-windows-server/mars-select-date.png" alt-text="Screenshot shows how to select volume and date." lightbox="./media/tutorial-backup-restore-files-windows-server/mars-select-date.png":::

    When you select **Mount**, Azure Backup makes the recovery point available as a disk. Browse and recover files from the disk.

## Restore items from a recovery point

1. Once the recovery volume is mounted, select **Browse** to open Windows Explorer and find the files and folders you wish to recover.

    :::image type="content" source="./media/tutorial-backup-restore-files-windows-server/mars-browse-recover.png" alt-text="Screenshot shows how to select Browse." lightbox="./media/tutorial-backup-restore-files-windows-server/mars-browse-recover.png":::

    You can open the files directly from the recovery volume and verify the files.

2. In Windows Explorer, copy the files and folders you want to restore and paste them to any desired location on the server.

    :::image type="content" source="./media/tutorial-backup-restore-files-windows-server/mars-final.png" alt-text="Screenshot shows how to copy the files and folders." lightbox="./media/tutorial-backup-restore-files-windows-server/mars-final.png":::

3. When you're finished restoring the files and folders, on the **Browse and Recovery Files** page of the **Recover Data** wizard, select **Unmount**.

    :::image type="content" source="./media/tutorial-backup-restore-files-windows-server/unmount-and-confirm.png" alt-text="Screenshot shows how to select unmount." lightbox="./media/tutorial-backup-restore-files-windows-server/unmount-and-confirm.png":::

4. Select **Yes** to confirm that you want to unmount the volume.

    Once the snapshot is unmounted, **Job Completed** appears in the **Jobs** pane in the agent console.

## Next steps

This completes the tutorials on backing up and restoring Windows Server data to Azure. To learn more about Azure Backup, see the PowerShell sample for backing up encrypted virtual machines.

> [!div class="nextstepaction"]
> [Back up encrypted VM](./scripts/backup-powershell-sample-backup-encrypted-vm.md)
