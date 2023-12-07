---
title: Restore options with Microsoft Azure Recovery Services (MARS) agent
description: Learn about the restore options available with the Microsoft Azure Recovery Services (MARS) agent.
ms.reviewer: mepand
ms.topic: conceptual
ms.date: 08/14/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# About restore using the Microsoft Azure Recovery Services (MARS) agent 

This article describes the restore options available with the Microsoft Azure Recovery Services (MARS) agent.

## Before you begin

- Ensure that the latest version of the [MARS agent](https://aka.ms/azurebackup_agent) is installed.
- Ensure that [network throttling](backup-windows-with-mars-agent.md#enable-network-throttling) is disabled.
- Ensure that high-speed storage with sufficient space for the [agent cache folder](./backup-azure-file-folder-backup-faq.yml) is available.
- Monitor memory and CPU resource, and ensure that sufficient resources are available for decompressing and decrypting data.
- While using the **Instant Restore** feature to mount a recovery point as a disk, use **robocopy** with multi-threaded copy option (/MT switch) to copy files efficiently from the mounted recovery point.

## Restore options

The MARS agent offers multiple restore options. Each option provides unique benefits that makes it suitable for certain scenarios.

Using the MARS agent you can:

- **[Restore Windows Server System State Backup](backup-azure-restore-system-state.md):** This option helps restore the System State as files from a recovery point in Azure Backup, and apply those to the Windows Server using the Windows Server Backup utility.  
- **[Restore all backed up files in a volume](restore-all-files-volume-mars.md):** This option recovers all backed up data in a specified volume from the recovery point in Azure Backup. It allows a faster transfer speed (up to 40 MBPS).<br>We recommend you to use this option for recovering large amounts of data, or entire volumes.
- **[Restore a specific set of backed up files and folders in a volume using PowerShell](backup-client-automation.md#restore-data-from-azure-backup):** If the paths to the files and folders relative to the volume root are known, this option allows you to restore the specified set of files and folders from a recovery point, using the faster transfer speed of the full volume restore. However, this option doesn’t provide the convenience of browsing files and folders in the recovery point using the Instant Restore option.
- **[Restore individual files and folders using Instant Restore](backup-azure-restore-windows-server.md):** This option allows quick access to the backup data by mounting volume in the recovery point as a drive. You can then browse, and copy files and folders. This option offers a copy speed of up to 6 MBPS, which is suitable for recovering individual files and folders of total size less than 80 GB. Once the required files are copied, you can unmount the recovery point.
- **Cross Region Restore for MARS (preview)**: If your Recovery Services vault uses GRS resiliency and has the [Cross Region Restore setting turned on](backup-create-recovery-services-vault.md#set-cross-region-restore), you can restore the backup data from the secondary region.

## Cross Region Restore (preview)

Cross Region Restore (CRR) allows you to restore MARS backup data from a secondary region, which is an Azure paired region. This enables you to conduct drills for audit and compliance, and recover data during the unavailability of the primary region in Azure in the case of a disaster. 

To use this feature:

1. [Turn on Cross Region Restore in your Recovery Services vault](backup-create-rs-vault.md#set-cross-region-restore). Once Cross Region Restore is enabled, you can't disable it.
2. After you turn on the feature, it can take up to *48 hours* for the backup items to be available in the secondary region. Currently, the secondary region RPO is *36 hours*, because the RPO in the primary region is *24 hours*, and it can take up to *12 hours* to replicate the backup data from the primary to secondary region.
3. To restore the backup data for the original machine, you can directly select **Secondary Region** as the source of the backup data in the wizard.

   :::image type="content" source="./media/backup-azure-restore-windows-server/select-source-region-for-restore.png" alt-text="Screenshot shows the selection for secondary region as the backup data source during Cross Region Restore.":::

4. To restore backup data for an alternate server from the secondary region, you need to download the *Secondary Region vault credential* from the Azure portal.

   :::image type="content" source="./media/about-restore-microsoft-azure-recovery-services/download-vault-credentials-for-cross-region-restore.png" alt-text="Screenshot shows how to download vault credentials for secondary region.":::

5. To automate recovery from secondary region for audit or compliance drills, [use this command](backup-client-automation.md#cross-region-restore). 

>[!Note]
>- Recovery Services vaults with private endpoint are currently not supported for Cross Region Restore with MARS.
>- Recovery Services vaults enabled with Cross Region Restore will be automatically charged at RA-GRS rates for the MARS backups stored in the vault once the feature is generally available.

## Next steps

- For additional frequently asked questions, see [MARS agent FAQs](backup-azure-file-folder-backup-faq.yml).
- For information about supported scenarios and limitations, see [Support Matrix for the backup with the MARS agent](backup-support-matrix-mars-agent.md).
