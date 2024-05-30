---
title: Back up Azure File shares in the Azure portal
description: Learn how to use the Azure portal to back up Azure File shares in the Recovery Services vault
ms.topic: how-to
ms.date: 04/05/2024
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure File shares

This article describes how to back up [Azure File shares](../storage/files/storage-files-introduction.md) from the Azure portal.

Azure File share backup is a native, cloud based backup solution that protects your data in the cloud and eliminates additional maintenance overheads involved in on-premises backup solutions. The Azure Backup service smoothly integrates with Azure File Sync, and allows you to centralize your file share data as well as your backups. This simple, reliable, and secure solution enables you to configure protection for your enterprise file shares by using [snapshot backup](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted backup (preview)](azure-file-share-backup-overview.md?tabs=vault-standard) in a few simple steps with an assurance that you can recover your data in case of any accidental or malicious deletion.

[Learn about](azure-file-share-backup-overview.md) the Azure File share snapshot-based backup solution.

>[!Note]
>Vaulted backup for Azure File share is currently in preview and available in limited regions mentioned [here](azure-file-share-support-matrix.md?tabs=vault-tier#supported-regions).

## Prerequisites

* Ensure that the file share is present in one of the supported storage account types. Review the [support matrix](azure-file-share-support-matrix.md).
* Identify or create a [Recovery Services vault](#create-a-recovery-services-vault) in the same region and subscription as the storage account that hosts the file share.
* In case you have restricted access to your storage account, check the firewall settings of the account to ensure that the exception "Allow Azure services on the trusted services list to access this storage account" is granted. You can refer to [this](../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) link for the steps to grant an exception.

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Configure the backup

You can configure *snapshot backup* and *vaulted backup (preview)* for Azure File share from *Backup center* or *File share blade*.

**Choose an entry point**

# [Backup center](#tab/backup-center)

To configure backup for multiple file shares from the Backup center, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Backup center** and select **+Backup**.

   :::image type="content" source="./media/backup-afs/backup-center-configure-inline.png" alt-text="Screenshot showing to configure Backup for Azure File." lightbox="./media/backup-afs/backup-center-configure-expanded.png":::

1. On the **Start: Configure Backup** blade, select **Azure Files (Azure Storage)** as the datasource type, select the vault that you want to protect the file shares with, and then select **Continue**.

   :::image type="content" source="./media/backup-afs/azure-file-share-select-vault.png" alt-text="Screenshot showing to select Azure Files.":::

1. Click **Select** to select the storage account that contains the file shares to be backed-up.

   The **Select storage account** blade opens on the right, which lists a set of discovered supported storage accounts. They're either associated with this vault or present in the same region as the vault, but not yet associated to any Recovery Services vault.

   :::image type="content" source="./media/backup-afs/azure-file-share-select-storage-account-inline.png" alt-text="Screenshot showing to select a storage account." lightbox="./media/backup-afs/azure-file-share-select-storage-account-expanded.png":::

1. On the **Select storage account** blade, from the list of discovered storage accounts, select an account, and select **OK**.

   :::image type="content" source="./media/backup-afs/azure-file-share-confirm-storage-account-inline.png" alt-text="Screenshot showing to select one of the discovered storage accounts." lightbox="./media/backup-afs/azure-file-share-confirm-storage-account-expanded.png":::
   
   >[!NOTE]
   >If a storage account is present in a different region than the vault, it won't be present in the list of discovered storage accounts.

1. On the **Configure Backup** blade, under the **FileShares to Backup** section, select the *file shares type* you want to back up, and then select **Add**.

   :::image type="content" source="./media/backup-afs/azure-select-file-share-inline.png" alt-text="Screenshot showing to select the file shares to back up." lightbox="./media/backup-afs/azure-select-file-share-expanded.png":::

1. The **Select file shares** context blade opens on the right. Azure searches the storage account for file shares that can be backed up. If you recently added your file shares and don't see them in the list, allow some time for the file shares to appear.

1. On the **Select file shares** blade, from the *file shares* list, select one or more file shares you want to back up, and then select **OK**.

1. On the **Configure Backup** blade, under **Policy Details**, choose an existing *backup policy* from the list for your file share protection or create a new policy.

   To create a new backup policy, you can configure the following attributes in the backup policy:

   1. On the **Configure Backup** blade, select **Create new** under **Policy Details**.

   1. On the **Create policy** blade, provide the *policy name*.

   1. On **Backup tier**, select one of the following tiers:

      - **Snapshot**: Enables only snapshot-based backups that are stored locally and can only provide protection in case of accidental deletions.
      - **Vault-Standard (Preview)**: Provides comprehensive data protection.

   1. Configure the *backup schedule* as per the requirement. You can configure up to *six backups* a day. The snapshots are taken as per the schedule defined in the policy. In case of vaulted backup, the data from the last snapshot of the day is transferred to the vault.

   1. Configure the *Snapshot retention* and *Vault retention (preview)* duration to determine the expiry date of the recovery points.

      >[!Note]
      >The *vault tier (preview)* provides longer retention than the *snapshot tier*. 
   1. Select **OK** to create the backup policy.

      :::image type="content" source="./media/backup-afs/create-backup-policy-for-azure-file-share.png" alt-text="Screenshot shows how to create a new backup policy for Azure File share." lightbox="./media/backup-afs/create-backup-policy-for-azure-file-share.png":::

1. On the **Configure Backup** blade, select **Enable Backup** to start protecting the file share.

   ![Screenshot shows how to enable backup.](./media/backup-afs/enable-backup.png)



# [File share blade](#tab/file-share-pane)

The following steps explain how you can configure backup for individual file shares from the respective file share blade:

1. In the [Azure portal](https://portal.azure.com/), open the storage account hosting the file share you want to back up.

1. On the *storage account*, select the **File shares** tile.

   Alternatively, you can go to **File shares** from the table of contents for the storage account.

   ![Storage account](./media/backup-afs/storage-account.png)

1. On the **File share settings** blade, all the file shares present in the storage account appear. Select the file share you want to back up.

   ![Screenshot shows the File shares list.](./media/backup-afs/file-shares-list.png)

1. On the *file share* blade, under the **Operations** section, select **Backup**.

   The *Azure Backup configuration* blade appears on the right.

   ![Screenshot shows how to open the Configure backup blade.](./media/backup-afs/configure-backup.png)

1. To select the Recovery Services vault, do one of the following:

    * If you already have a vault, click **Select existing** under **Recovery Services vault**, and choose one of the existing vaults from **Vault Name** drop down menu.

       ![Screenshot shows how to select an existing vault.](./media/backup-afs/select-existing-vault.png)

    * If you don't have a vault, select **Create new** under **Recovery Services vault**, and then specify a name for the vault. It's created in the same region as the file share. By default, the vault is created in the same resource group as the file share. If you want to choose a different resource group, under the **Resource Type** dropdown, select **Create new**, and then specify a name for the resource group. Select **OK** to continue.

       ![Screenshot shows how to create a new vault.](./media/backup-afs/create-new-vault.png)

      >[!IMPORTANT]
      >If the storage account is registered with a vault, or there are few protected shares within the storage account hosting the file share you're trying to protect, the Recovery Services vault name will be pre-populated and you won’t be allowed to edit it [Learn more here](backup-azure-files-faq.yml#why-can-t-i-change-the-vault-to-configure-backup-for-the-file-share-).

1. Under **Choose backup policy**, select an existing *backup policy* from the list or create a new *backup policy* for Azure File share.

   ![Screenshot shows how to choose a backup policy.](./media/backup-afs/choose-backup-policy.png)

   To create a new backup policy, follow these steps:

   1. Select **Create a new policy**.

   1. On the **Create policy** blade, provide the *policy name*.
   1. On **Backup tier**, select one of the following tiers:
      - **Snapshot**: Enables only snapshot-based backups that are stored locally and can only provide protection in case of accidental deletions.
      - **Vault-Standard (Preview)**: Provides comprehensive data protection.

   1. Configure the *backup schedule* as per the requirement. You can configure up to *six backups* a day. The snapshots are taken as per the schedule defined in the policy. In case of vaulted backup, the data from the last snapshot of the day is transferred to the vault.

   1. Configure the *Snapshot retention* and *Vault retention (preview)* duration to determine the expiry date of the recovery points.

      >[!Note]
      >The *vault tier* provides longer retention than the *snapshot tier*. 
   1. Select **OK** to create the backup policy.

      :::image type="content" source="./media/backup-afs/create-backup-policy-for-azure-file-share.png" alt-text="Screenshot shows the creation of a new backup policy for Azure File share." lightbox="./media/backup-afs/create-backup-policy-for-azure-file-share.png":::

1. On the *Azure Files* datasource blade, select **Enable Backup** to start protecting the file share.

   ![Select Enable backup](./media/backup-afs/select-enable-backup.png)

1. You can track the configuration progress in the portal notifications, or by monitoring the backup jobs under the vault you're using to protect the file share.

   ![Screenshot shows the Azure portal notifications.](./media/backup-afs/portal-notifications.png)

1. After the configuration of backup is complete, select **Backup** under the **Operations** section of the *file share* blade.

   The context blade opens on the right. From the list of *Vault Essentials*, you can trigger on-demand backup and restore operations.

   ![Screenshot shows the list of Vault Essentials.](./media/backup-afs/vault-essentials.png)

---

## Run an on-demand backup job

Occasionally, you might want to generate a backup snapshot, or recovery point, outside of the times scheduled in the backup policy. A common reason to generate an on-demand backup is right after you've configured the backup policy. Based on the schedule in the backup policy, it might be hours or days until a snapshot is taken. To protect your data until the backup policy engages, initiate an on-demand backup. Creating an on-demand backup is often required before you make planned changes to your file shares.

**Choose an entry point**

# [Backup center](#tab/backup-center)

To run an on-demand backup, follow these steps:

1. Go to **Backup center** and select **Backup Instances** from the menu.

   Filter for **Azure Files (Azure Storage)** as the datasource type.

   :::image type="content" source="./media/backup-afs/azure-file-share-backup-instances-inline.png" alt-text="Screenshot showing to select Backup instances." lightbox="./media/backup-afs/azure-file-share-backup-instances-expanded.png":::

1. Select the item for which you want to run an on-demand backup job.

1. In the **Backup Item** menu, select **Backup now**. Because this backup job is on demand, there's no retention policy associated with the recovery point.

   :::image type="content" source="./media/backup-afs/azure-file-share-backup-now-inline.png" alt-text="Screenshot showing to select Backup now." lightbox="./media/backup-afs/azure-file-share-backup-now-expanded.png":::

1. The **Backup Now** blade opens. Specify the last day you want to retain the recovery point. You can have a maximum retention of 10 years for an on-demand backup.

   :::image type="content" source="./media/backup-afs/azure-file-share-on-demand-backup-retention.png" alt-text="Screenshot showing to choose retention date.":::

1. Select **OK** to confirm the on-demand backup job that runs.

1. Monitor the portal notifications to keep a track of backup job run completion.

   To monitor the job progress in the **Backup center** dashboard, select **Backup center** -> **Backup Jobs** -> **In progress**.

# [File share blade](#tab/file-share-pane)

To run an on-demamd backup, follow these steps:

1. Open the file share’s **Overview** blade for which you want to take an on-demand backup.

1. Under the **Operation** section, select **Backup**. 

   The context blade appears on the right that lists **Vault Essentials**. Select **Backup Now** to take an on-demand backup.

   ![Screenshot shows how to select Backup Now.](./media/backup-afs/select-backup-now.png)

1. The **Backup Now** blade opens. Specify the retention for the recovery point. You can have a maximum retention of 10 years for an on-demand backup.

   ![Screenshot shows the option how to retain backup date.](./media/backup-afs/retain-backup-date.png)

1. Select **OK** to confirm.

>[!NOTE]
>Azure Backup locks the storage account when you configure protection for any file share in the corresponding account. This provides protection against accidental deletion of a storage account with backed up file shares.

---

## Best practices

* Don't delete snapshots created by Azure Backup. Deleting snapshots can result in loss of recovery points and/or restore failures.

* Don't remove the lock taken on the storage account by Azure Backup. Deletion of the lock can make your storage account prone to accidental deletion.

## Next steps

Learn how to:

* [Restore Azure File shares](restore-afs.md).
* [Manage Azure File share backups](manage-afs-backup.md).
