---
title: Back up Azure file shares in the Azure portal
description: Learn how to use the Azure portal to back up Azure file shares in the Recovery Services vault
ms.topic: conceptual
ms.date: 01/20/2020
---

# Back up Azure file shares

This article explains how to  back up [Azure file shares](../storage/files/storage-files-introduction.md) from the Azure portal.

In this article, you'll learn how to:

* Create a Recovery Services vault.
* Configure backup from the Recovery Services vault
* Configure backup from the file share pane
* Run an on-demand backup job to create a restore point

## Prerequisites

* [Learn](azure-file-share-backup-overview.md) about the Azure file share snapshot-based backup solution.
* Ensure that the file share is present in one of the [supported storage account types](azure-file-share-support-matrix.md).
* Identify or create a [Recovery Services vault](#create-a-recovery-services-vault) in the same region as the storage account that hosts the file share.

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Configure backup from the Recovery Services vault

The following steps explain how you can configure backup for multiple file shares from the Recovery Services vault pane:

1. In the [Azure portal](https://portal.azure.com/), open the Recovery Services vault you want to use for configuring backup for the file share.

1. In the **Recovery Services vault** pane, select the **+Backup** from the menu on the top.

   ![Recovery Services vault](./media/backup-afs/recovery-services-vault.png)

    1. In the **Backup Goal** pane, set **Where is your workload running?** to **Azure** by selecting the **Azure** option from the drop-down list.

          ![Choose Azure as workload](./media/backup-afs/backup-goal.png)

    2. In **What do you want to back up?**, select **Azure File Share** from the drop-down list.

          ![Select Azure FileShare](./media/backup-afs/select-azure-file-share.png)

    3. Select **Backup** to register the Azure file share extension in the vault.

          ![Select Backup to associate the Azure file share with vault](./media/backup-afs/register-extension.png)

1. After you select **Backup**, the **Backup** pane opens. To select the storage account hosting the file share that you want to protect, select the **Select** link text below the **Storage Account** textbox.

   ![Choose the Select link](./media/backup-afs/choose-select-link.png)

1. The **Select Storage Account Pane** opens on the right, listing a set of discovered supported storage accounts. They're either associated with this vault or present in the same region as the vault, but not yet associated to any Recovery Services vault.

1. From the list of discovered storage accounts, select an account, and select **OK**.

   ![Select from the discovered storage accounts](./media/backup-afs/select-discovered-storage-account.png)

1. The next step is to select the file shares you want to back up. Select the **Add** button in the **FileShares to Backup** section.

   ![Select the file shares to back up](./media/backup-afs/select-file-shares-to-back-up.png)

1. The **Select File Shares** context pane opens on the right. Azure searches the storage account for file shares that can be backed up. If you recently added your file shares and don't see them in the list, allow some time for the file shares to appear.

1. From the **Select File Shares** list, select one or more of the file shares you want to back up. Select **OK**.

   ![Select the file shares](./media/backup-afs/select-file-shares.png)

1. To choose a backup policy for your file share, you have three options:

   * Choose the default policy.<br>
   This option allows you to enable daily backup that will be retained for 30 days. If you don’t have an existing backup policy in the vault, the backup pane opens with the default policy settings. If you want to choose the default settings, you can directly select **Enable backup**.

   * Create a new policy <br>

      1. To create a new backup policy for your file share, select the link text below the drop-down list in the **Backup Policy** section.<br>

         ![Create new policy](./media/backup-afs/create-new-policy.png)

      1. The **Backup Policy** context pane opens on the right. Specify a policy name in the text box and choose the retention period according to your requirement. Only the daily retention option is enabled by default. If you want to have weekly, monthly, or yearly retention, select the corresponding checkbox and provide the desired retention value.

      1. After specifying the retention values and a valid policy name, select **OK**.<br>

         ![Give policy name and retention values](./media/backup-afs/policy-name.png)

   * Choose one of the existing backup policies <br>

      To choose one of the existing backup policies for configuring protection, select the desired policy from the **Backup policy** drop-down list.<br>

      ![Choose existing policy](./media/backup-afs/choose-existing-policy.png)

1. Select **Enable Backup** to start protecting the file share.

   ![Choose enable backup](./media/backup-afs/enable-backup.png)

After you set a backup policy, a snapshot of the file shares is taken at the scheduled time. The recovery point is also retained for the chosen period.

>[!NOTE]
>Azure Backup now supports policies with daily/weekly/monthly/yearly retention for Azure file share backup.

## Configure backup from the file share pane

The following steps explain how you can configure backup for individual file shares from the respective file share pane:

1. In the [Azure portal](https://portal.azure.com/), open the storage account hosting the file share you want to back up.

1. Once in the storage account, select the tile labeled **File shares**. You can also navigate to **File shares** via the table of contents for the storage account.

   ![Storage account](./media/backup-afs/storage-account.png)

1. In the file share listing, you should see all the file shares present in the storage account. Select the file share you want to back up.

   ![File shares list](./media/backup-afs/file-shares-list.png)

1. Select **Backup** under the **Operations** section of the file share pane. The **Configure backup** pane will load on the right.

   ![Configure backup pane](./media/backup-afs/configure-backup.png)

1. For the Recovery Services vault selection, do one of the following:

    * If you already have a vault, select the **Select existing** Recovery Services vault radio button, and choose one of the existing vaults from **Vault Name** drop down menu.

       ![Select existing vault](./media/backup-afs/select-existing-vault.png)

    * If you don't have a vault, select the **Create new** Recovery Services vault radio button. Specify a name for the vault. It's created in the same region as the file share. By default, the vault is created in the same resource group as the file share. If you want to choose a different resource group, select **Create New** link below the **Resource Type** drop down and specify a name for the resource group. Select **OK** to continue.

       ![Create new vault](./media/backup-afs/create-new-vault.png)

      >[!IMPORTANT]
      >If the storage account is registered with a vault, or there are few protected shares within the storage account hosting the file share you're trying to protect, the Recovery Services vault name will be pre-populated and you won’t be allowed to edit it [Learn more here](backup-azure-files-faq.yml#why-can-t-i-change-the-vault-to-configure-backup-for-the-file-share-).

1. For the **Backup Policy** selection, do one of the following:

    * Leave the default policy. It will schedule daily backups with a retention of 30 days.

    * Select an existing backup policy, if you have one, from the **Backup Policy** drop-down menu.

       ![Choose backup policy](./media/backup-afs/choose-backup-policy.png)

    * Create a new policy with daily/weekly/monthly/yearly retention according to your requirement.  

         1. Select the **Create a new policy** link text.

         2. The **Backup Policy** context pane opens on the right. Specify a policy name in the text box and choose the retention period according to your requirement. Only the daily retention option is enabled by default. If you want to have weekly, monthly, or yearly retention, select the corresponding checkbox and provide the desired retention value.

         3. After specifying the retention values and a valid policy name, select **OK**.

            ![Create new backup policy](./media/backup-afs/create-new-backup-policy.png)

1. Select **Enable backup** to start protecting the file share.

   ![Select Enable backup](./media/backup-afs/select-enable-backup.png)

1. You can track the configuration progress in the portal notifications, or by monitoring the backup jobs under the vault you're using to protect the file share.

   ![Portal notifications](./media/backup-afs/portal-notifications.png)

1. After the completion of the configure backup operation, select **Backup** under the **Operations** section of the file share pane. The context pane listing **Vault Essentials** will load on the right. From there, you can trigger on-demand backup and restore operations.

   ![Vault essentials](./media/backup-afs/vault-essentials.png)

## Run an on-demand backup job

Occasionally, you might want to generate a backup snapshot, or recovery point, outside of the times scheduled in the backup policy. A common reason to generate an on-demand backup is right after you've configured the backup policy. Based on the schedule in the backup policy, it might be hours or days until a snapshot is taken. To protect your data until the backup policy engages, initiate an on-demand backup. Creating an on-demand backup is often required before you make planned changes to your file shares.

### From the Recovery Services vault

1. Open the Recovery Services vault you used to back up your file share. On the **Overview** pane, select **Backup items** under the **Protected items** section.

   ![Select Backup items](./media/backup-afs/backup-items.png)

1. After you select **Backup items**, a new pane that lists all **Backup Management Types** appears next to the **Overview** pane.

   ![List of Backup Management Types](./media/backup-afs/backup-management-types.png)

1. From the **Backup Management Type** list, select **Azure Storage (Azure Files)**. You'll see a list of all the file shares and the corresponding storage accounts backed up by using this vault.

   ![Azure Storage (Azure Files) backup items](./media/backup-afs/azure-files-backup-items.png)

1. From the list of Azure file shares, select the file share you want. The **Backup Item** details appear. On the **Backup Item** menu, select **Backup now**. Because this backup job is on demand, there's no retention policy associated with the recovery point.

   ![Select Backup now](./media/backup-afs/backup-now.png)

1. The **Backup Now** pane opens. Specify the last day you want to retain the recovery point. You can have a maximum retention of 10 years for an on-demand backup.

   ![Choose retention date](./media/backup-afs/retention-date.png)

1. Select **OK** to confirm the on-demand backup job that runs.

1. Monitor the portal notifications to keep a track of backup job run completion. You can monitor the job progress in the vault dashboard. Select **Backup Jobs** > **In progress**.

### From the file share pane

1. Open the file share’s **Overview** pane for which you want to take an on-demand backup.

1. Select **Backup** under the **Operation** section. The context pane listing **Vault Essentials** will load on the right. Select **Backup Now** to take an on-demand backup.

   ![Select Backup Now](./media/backup-afs/select-backup-now.png)

1. The **Backup Now** pane opens. Specify the retention for the recovery point. You can have a maximum retention of 10 years for an on-demand backup.

   ![Retain backup date](./media/backup-afs/retain-backup-date.png)

1. Select **OK** to confirm.

>[!NOTE]
>Azure Backup locks the storage account when you configure protection for any file share in the corresponding account. This provides protection against accidental deletion of a storage account with backed up file shares.

## Best practices

* Don't delete snapshots created by Azure Backup. Deleting snapshots can result in loss of recovery points and/or restore failures.

* Don't remove the lock taken on the storage account by Azure Backup. If you delete the lock, your storage account will be prone to accidental deletion and if it's deleted, you'll lose your snapshots or backups.

## Next steps

Learn how to:

* [Restore Azure file shares](restore-afs.md)
* [Manage Azure file share backups](manage-afs-backup.md)
