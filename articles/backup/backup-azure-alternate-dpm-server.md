---
title: Recover data from an Azure Backup Server
description: Recover the data you've protected to a Recovery Services vault from any Azure Backup Server registered to that vault.
ms.topic: how-to
ms.date: 01/24/2023
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Recover data from Azure Backup Server

This article describes how to recover data from Azure Backup Server.

You can use Azure Backup Server to recover the data you've backed-up to a Recovery Services vault. The process for doing so is integrated into the Azure Backup Server management console, and is similar to the recovery workflow for other Azure Backup components.

> [!NOTE]
> This article is applicable for [System Center Data Protection Manager 2012 R2 with UR7 or later](https://support.microsoft.com/kb/3065246), combined with the [latest Azure Backup agent](https://aka.ms/azurebackup_agent).

## Recover the data

To recover data from an Azure Backup Server, follow these steps:

1. On the **Recovery** tab of the Azure Backup Server management console, select **'Add External DPM'** (at the top left of the screen).

    ![Screenshot shows how to add external DPM.](./media/backup-azure-alternate-dpm-server/add-external-dpm.png)
2. Download new **vault credentials** from the vault associated with the **Azure Backup Server** where the data is being recovered, choose the Azure Backup Server from the list of Azure Backup Servers registered with the Recovery Services vault, and provide the **encryption passphrase** associated with the server whose data is being recovered.

    ![Screenshot shows how to download the external DPM credentials.](./media/backup-azure-alternate-dpm-server/external-dpm-credentials.png)

   > [!NOTE]
   > Only Azure Backup Servers associated with the same registration vault can recover each other’s data.


    Once the External Azure Backup Server is successfully added, you can browse the data of the external server and the local Azure Backup Server from the **Recovery** tab.
3. Browse the available list of production servers protected by the external Azure Backup Server and select the appropriate data source.

    ![Screenshot shows how to browse external DPM server.](./media/backup-azure-alternate-dpm-server/browse-external-dpm.png)
4. Select **the month and year** from the **Recovery points** drop down, select the required **Recovery date** for when the recovery point was created, and select the **Recovery time**.

    A list of files and folders appears in the bottom pane, which can be browsed and recovered to any location.

    ![Screenshot shows the external DPM Server recovery points.](./media/backup-azure-alternate-dpm-server/external-dpm-recoverypoint.png)
5. Right-click the appropriate item and select **Recover**.

    ![Screenshot shows how to start external DPM recovery.](./media/backup-azure-alternate-dpm-server/recover.png)
6. Review the **Recover Selection**. Verify the data and time of the backup copy being recovered, as well as the source from which the backup copy was created. If the selection is incorrect, select **Cancel** to navigate back to recovery tab to select appropriate recovery point. If the selection is correct, select **Next**.

    ![Screenshot shows the external DPM recovery summary.](./media/backup-azure-alternate-dpm-server/external-dpm-recovery-summary.png)
7. Select **Recover to an alternate location**. **Browse** to the correct location for the recovery.

    ![Screenshot shows how to start the external DPM recovery to an alternate location.](./media/backup-azure-alternate-dpm-server/external-dpm-recovery-alternate-location.png)
8. Choose the option related to **create copy**, **Skip**, or **Overwrite**.

   * **Create copy** - creates a copy of the file if there's a name collision.
   * **Skip** - if there's a name collision, it doesn't recover the file, which leaves the original file.
   * **Overwrite** - if there's a name collision, it overwrites the existing copy of the file.

     Choose the appropriate option to **Restore security**. You can apply the security settings of the destination computer where the data is being recovered or the security settings that were applicable to product at the time the recovery point was created.

     Identify whether a **Notification** is sent, once the recovery successfully completes.

     ![Screenshot shows how to view the external DPM recovery notifications.](./media/backup-azure-alternate-dpm-server/external-dpm-recovery-notifications.png)
9. The **Summary** screen lists the options chosen so far. Once you select **Recover**, the data is recovered to the appropriate on-premises location.

    ![Screenshot shows how to view the external DPM recovery options summary.](./media/backup-azure-alternate-dpm-server/external-dpm-recovery-options-summary.png)

   > [!NOTE]
   > The recovery job can be monitored in the **Monitoring** tab of the Azure Backup Server.


    ![Screenshot shows how to monitor the recovery.](./media/backup-azure-alternate-dpm-server/monitoring-recovery.png)
10. You can select **Clear External DPM** on the **Recovery** tab of the DPM server to remove the view of the external DPM server.

    ![Screenshot shows how to clear external DPM.](./media/backup-azure-alternate-dpm-server/clear-external-dpm.png)

## Troubleshoot error messages

| Error Message | Cause | Resolution |
|:--- |:--- |:--- |
|This server is not registered to the vault specified by the vault credential. | This error appears when the vault credential file selected doesn't belong to the Recovery Services vault associated with Azure Backup Server on which the recovery is attempted. | Download the vault credential file from the Recovery Services vault to which the Azure Backup Server is registered. |
|Either the recoverable data isn't available or the selected server isn't a DPM server. | There are no other Azure Backup Servers registered to the Recovery Services vault, or the servers haven't yet uploaded the metadata, or the selected server isn't an Azure Backup Server (using Windows Server or Windows Client). | If there are other Azure Backup Servers registered to the Recovery Services vault, ensure that the latest Azure Backup agent is installed. <br>If there are other Azure Backup Servers registered to the Recovery Services vault, wait for a day after installation to start the recovery process. The nightly job will upload the metadata for all the protected backups to cloud. The data will be available for recovery. |
|No other DPM server is registered to this vault. | There are no other Azure Backup Servers  that are registered to the vault from which the recovery is being attempted. | If there are other Azure Backup Servers registered to the Recovery Services vault, ensure that the latest Azure Backup agent is installed.<br>If there are other Azure Backup Servers registered to the Recovery Services vault, wait for a day after installation to start the recovery process. The nightly job uploads the metadata for all protected backups to cloud. The data will be available for recovery. |
|The encryption passphrase provided does not match with passphrase associated with the following server: **\<server name>** | The encryption passphrase used in the process of encrypting the data from the Azure Backup Server’s data that's being recovered doesn't match the encryption passphrase provided. The agent is unable to decrypt the data, and so the recovery fails. | Provide the exact same encryption passphrase associated with the Azure Backup Server whose data is being recovered. |

## Next steps

Read the other FAQs:

* [Common questions](backup-azure-vm-backup-faq.yml) about Azure VM backups
* [Common questions](backup-azure-file-folder-backup-faq.yml) about the Azure Backup agent
