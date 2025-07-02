---
title: Back up Azure Files in the Azure portal
description: Learn how to use the Azure portal to back up Azure Files in the Recovery Services vault
ms.topic: how-to
ms.date: 05/22/2025
ms.service: azure-backup
ms.custom: engagement-fy23
author: jyothisuri
ms.author: jsuri
# Customer intent: "As an IT administrator, I want to configure backups for Azure Files, so that I can ensure data protection against accidental or malicious deletions while minimizing on-premises maintenance."
---

# Back up Azure Files

This article describes how to back up [Azure Files](../storage/files/storage-files-introduction.md) from the Azure portal.

Azure Files backup is a native cloud solution that protects your data and eliminates on-premises maintenance overheads. Azure Backup seamlessly integrates with Azure File Sync, centralizing your file share data and backups. The simple, reliable, and secure solution allows you to protect your enterprise file shares using [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups, ensuring data recovery for accidental or malicious deletion.

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. You can:

- Define backup schedules and retention settings.
- Store backup data in the Recovery Service vault, retaining it for up to **10 years**.


## Prerequisites

* Ensure the file share is present in one of the supported storage account types. Review the [support matrix](azure-file-share-support-matrix.md).
* Identify or create a [Recovery Services vault](tutorial-backup-azure-files-vault-tier-portal.md#create-a-recovery-services-vault) in the same region and subscription as the storage account that hosts the file share.
* [Create a backup policy for protection of Azure Files](quick-backup-azure-files-vault-tier-portal.md).
* If the storage account access has restrictions, check the firewall settings of the account to ensure the exception **Allow Azure services on the trusted services list to access this storage account** is in grant state. You can refer to [this](../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) link for the steps to grant an exception.
* Ensure that you allow the **Storage account key access** in the required storage account.
* Ensure that the target storage account has the [supported configurations](azure-file-share-support-matrix.md#permitted-scope-for-copy-operationspreview).

>[!IMPORTANT]
>To perform [Cross Subscription Backup (CSB) for protecting Azure Files](azure-file-share-backup-overview.md#how-cross-subscription-backup-for-azure-files-works) in another subscription, ensure you register `Microsoft.RecoveryServices` in the **subscription of the file share** in addition to the given prerequisites.


## Configure the backup

You can configure *snapshot backup* and *vaulted backup* for Azure Files from the *Recovery Services vault* or *File share pane*.

**Choose an entry point**

# [Recovery Services vault](#tab/recovery-services-vault)

To configure backup for multiple file shares from the Recovery Services vault, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Recovery Services vault** and select **+Backup**.

   :::image type="content" source="./media/backup-afs/azure-file-configure-backup.png" alt-text="Screenshot showing to configure Backup for Azure Files." lightbox="./media/backup-afs/azure-file-configure-backup.png":::

1. On the **Backup Goal** pane, select **Azure Files (Azure Storage)** as the datasource type, select the vault that you want to protect the file shares with, and then select **Continue**.

   :::image type="content" source="./media/backup-afs/azure-file-share-select-vault.png" alt-text="Screenshot showing to select Azure Files." lightbox="./media/backup-afs/azure-file-share-select-vault.png":::

1. On the **Configure backup** pane, click **Select** to select the storage account that contains the file shares to be backed up.

   The **Select storage account** pane opens, which lists a set of discovered supported storage accounts. They're either associated with this vault or present in the same region as the vault, but not yet associated with any Recovery Services vault.

   :::image type="content" source="./media/backup-azure-files/azure-file-share-select-storage-account.png" alt-text="Screenshot showing to select a storage account." lightbox="./media/backup-azure-files/azure-file-share-select-storage-account.png":::

1. On the **Select storage account** pane, by default it list the storage accounts from the current subscription. Select an account, and select **OK**.

   If you want to configure the backup operation with a storage account in a different subscription ([Cross Subscription Backup](azure-file-share-backup-overview.md#how-cross-subscription-backup-for-azure-files-works)), choose the other subscription from the **Subscription** filter. The storage accounts from the selected subscription appear.

   :::image type="content" source="./media/backup-azure-files/azure-file-share-confirm-storage-account.png" alt-text="Screenshot showing to select one of the discovered storage accounts." lightbox="./media/backup-azure-files/azure-file-share-confirm-storage-account.png":::
   
   >[!NOTE]
   >If a storage account is present in a different region than the vault, then the storage account doesn't appear in the discovery list.

1. On the **Configure Backup** pane, under the **FileShares to Backup** section, select the *file shares type* you want to back up, and then select **Add**.

   :::image type="content" source="./media/backup-afs/azure-select-file-share.png" alt-text="Screenshot showing to select the file shares to back up." lightbox="./media/backup-afs/azure-select-file-share.png":::

1. The **Select file shares** context pane opens. Azure searches the storage account for file shares that can be backed up. If you recently added your file shares and don't see them in the list, allow some time for the file shares to appear.

1. On the **Select file shares** pane, from the *file shares* list, select one or more file shares you want to back up, and then select **OK**.

1. On the **Configure Backup** pane, under **Policy Details**, choose an existing *backup policy* from the list for your file share protection or create a new policy.

   To create a new backup policy, you can configure the following attributes in the backup policy:

   1. On the **Configure Backup** pane, select **Create new** under **Policy Details**.

   1. On the **Create policy** pane, provide the *policy name*.

   1. On **Backup tier**, select one of the following tiers:

      - **Snapshot**: Enables only snapshot-based backups that are stored locally and can only provide protection during accidental deletions.
      - **Vault-Standard**: Provides comprehensive data protection.

   1. Configure the *backup schedule* as per the requirement. You can configure up to *six backups* per day. The snapshots are taken as per the schedule defined in the policy. For vaulted backup, the data from the last snapshot of the day is transferred to the vault.

   1. Configure the *Snapshot retention* and *Vault retention* duration to determine the expiry date of the recovery points.

      >[!NOTE]
      >The *vault tier* provides longer retention than the *snapshot tier*. 
   1. Select **OK** to create the backup policy.

      :::image type="content" source="./media/backup-afs/create-backup-policy-for-azure-file-share.png" alt-text="Screenshot shows how to create a new backup policy for Azure Files." lightbox="./media/backup-afs/create-backup-policy-for-azure-file-share.png":::

1. On the **Configure Backup** pane, select **Enable Backup** to start protecting the file share.

   ![Screenshot shows how to enable backup.](./media/backup-afs/enable-backup.png)



# [File share pane](#tab/file-share-pane)

The following steps explain how you can configure backup for individual file shares from the respective file share pane:

1. In the [Azure portal](https://portal.azure.com/), open the storage account hosting the file share you want to back up.

1. On the *storage account*, select the **File shares** tile.

   Alternatively, you can go to **File shares** from the table of contents for the storage account.

   ![Storage account](./media/backup-afs/storage-account.png)

1. On the **File share settings** pane, all the file shares present in the storage account appear. Select the file share you want to back up.

   :::image type="content" source="./media/backup-afs/file-shares-list.png" alt-text="Screenshot shows the File shares list." lightbox="./media/backup-afs/file-shares-list.png":::

1. On the *file share* pane, under the **Operations** section, select **Backup**.

   The *Azure Backup configuration* pane appears.

   ![Screenshot shows how to open the Configure backup pane.](./media/backup-afs/configure-backup.png)

1. To select the Recovery Services vault, consider one of the following methods:

    * If you already have a vault, click **Select existing** under **Recovery Services vault**, and choose one of the existing vaults from **Vault Name** drop down menu.

       ![Screenshot shows how to select an existing vault.](./media/backup-afs/select-existing-vault.png)

    * If you don't have a vault, select **Create new** under **Recovery Services vault**, and then specify a name for the vault. The vault gets created in the same region as the file share. By default, the vault is created in the same resource group as the file share. If you want to choose a different resource group, under the **Resource Type** dropdown, select **Create new**, and then specify a name for the resource group. Select **OK** to continue.

       ![Screenshot shows how to create a new vault.](./media/backup-afs/create-new-vault.png)

      >[!IMPORTANT]
      >If the storage account is registered with a vault or contains protected shares, the Recovery Services vault name is prepopulated and can't be edited. [Learn more here](backup-azure-files-faq.yml#why-can-t-i-change-the-vault-to-configure-backup-for-the-file-share-).

1. Under **Choose backup policy**, select an existing *backup policy* from the list or create a new *backup policy* for Azure Files.

   ![Screenshot shows how to choose a backup policy.](./media/backup-afs/choose-backup-policy.png)

   To create a new backup policy, follow these steps:

   1. Select **Create a new policy**.

   1. On the **Create policy** pane, provide the *policy name*.
   1. On **Backup tier**, select one of the following tiers:
      - **Snapshot**: Enables only snapshot-based backups that are stored locally and can only provide protection for accidental deletions.
      - **Vault-Standard**: Provides comprehensive data protection.

   1. Configure the *backup schedule* as per the requirement. You can configure up to *six backups* per day. The snapshots are taken as per the schedule defined in the policy. For vaulted backup, the data from the last snapshot of the day is transferred to the vault.

   1. Configure the *Snapshot retention* and *Vault retention* duration to determine the expiry date of the recovery points.

      >[!NOTE]
      >The *vault tier* provides longer retention than the *snapshot tier*. 
   1. Select **OK** to create the backup policy.

      :::image type="content" source="./media/backup-afs/create-backup-policy-for-azure-file-share.png" alt-text="Screenshot shows the creation of a new backup policy for Azure Files." lightbox="./media/backup-afs/create-backup-policy-for-azure-file-share.png":::

1. On the *Azure Files* datasource pane, select **Enable Backup** to start protecting the file share.

   ![Select Enable backup](./media/backup-afs/select-enable-backup.png)

1. You can track the configuration progress in the portal notifications, or by monitoring the backup jobs under the vault you're using to protect the file share.

   ![Screenshot shows the Azure portal notifications.](./media/backup-afs/portal-notifications.png)

1. After the configuration of backup is complete, select **Backup** under the **Operations** section of the *file share* pane.

   The context pane opens. From the list of *Vault Essentials*, you can trigger on-demand backup and restore operations.

   ![Screenshot shows the list of Vault Essentials.](./media/backup-afs/vault-essentials.png)

---

Once the backup configuration is complete, you can [run an on-demand backup](tutorial-backup-azure-files-vault-tier-portal.md#run-an-on-demand-backup-job) to create the recovery point.


## Next steps

* [Restore Azure Files using Azure portal](restore-afs.md).
* Restore Azure Files using [Azure PowerShell](restore-afs-powershell.md), [Azure CLI](restore-afs-cli.md), [REST API](restore-azure-file-share-rest-api.md).
* Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).
