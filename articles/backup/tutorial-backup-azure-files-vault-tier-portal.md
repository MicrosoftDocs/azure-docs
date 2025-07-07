---
title: Tutorial - Back up Azure Files using Azure portal
description: Learn how to back up Azure Files using  Azure portal. 
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: tutorial
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As an IT administrator, I want to back up Azure Files using the portal so that I can ensure data protection against accidental or malicious deletions without maintaining on-premises infrastructure.
---

#  Tutorial: Back up Azure Files using Azure portal

This tutorial describes how to back up Azure Files using  Azure portal. 

Azure Files backup is a native cloud solution that protects your data and eliminates on-premises maintenance overheads. Azure Backup seamlessly integrates with Azure File Sync, centralizing your file share data and backups. The simple, reliable, and secure solution allows you to protect your enterprise file shares using [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups, ensuring data recovery for accidental or malicious deletion.


## Prerequisites

Before you back up Azure Files, ensure that the following prerequisites are met:

-  Check that the File Share is present in one of the supported storage account types. Review the [support matrix](azure-file-share-support-matrix.md).
- Identify or [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) in the same region and subscription as the storage account that hosts the File Share.
- If the storage account access has restrictions, check the firewall settings of the account to ensure the exception **Allow Azure services on the trusted services list to access this storage account** is in grant state. You can refer to [this](../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) link for the steps to grant an exception.
- [Create a backup policy for protection of Azure Files](quick-backup-azure-files-vault-tier-portal.md).


[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

[!INCLUDE [Configure Azure Files vaulted backup.](../../includes/configure-azure-files-vaulted-backup.md)]

## Run an on-demand backup job

Occasionally, you might want to generate a backup snapshot, or recovery point, outside of the times scheduled in the backup policy. A common reason to generate an on-demand backup is right after you configure the backup policy. Based on the schedule in the backup policy, it might be hours or days until a snapshot is taken. To protect your data until the backup policy engages, initiate an on-demand backup. Creating an on-demand backup is often required before you make planned changes to your file shares.

**Choose an entry point**

# [Recovery Services vault](#tab/recovery-services-vault)

To run an on-demand backup, follow these steps:

1. Go to the **Recovery Services vault** and select **Backup items** from the menu.

1. On the **Backup items** pane, select the **Backup Management Type** as **Azure Storage (Azure Files)**.

1. Select the item for which you want to run an on-demand backup job.

1. In the **Backup Item** menu, select **Backup now**. Because this backup job is on demand, there's no retention policy associated with the recovery point.

   :::image type="content" source="./media/backup-afs/azure-file-share-backup-now.png" alt-text="Screenshot showing to select Backup now." lightbox="./media/backup-afs/azure-file-share-backup-now.png":::

1. The **Backup Now** pane opens. Specify the last day you want to retain the recovery point. You can have a maximum retention of 10 years for an on-demand backup.

   :::image type="content" source="./media/backup-afs/azure-file-share-on-demand-backup-retention.png" alt-text="Screenshot showing to choose retention date.":::

1. Select **OK** to confirm the on-demand backup job that runs.

1. Monitor the portal notifications to keep track of backup job run completion.

   To monitor the job progress in the **Recovery Services vault** dashboard, go to **Recovery Services vault** > **Backup Jobs** > **In progress**.

# [File share pane](#tab/file-share-pane)

To run an on-demand backup, follow these steps:

1. Open the file share’s **Overview** pane for which you want to take an on-demand backup.

1. Under the **Operation** section, select **Backup**. 

   The context pane appears that lists **Vault Essentials**. Select **Backup Now** to take an on-demand backup.

   ![Screenshot shows how to select Backup Now.](./media/backup-afs/select-backup-now.png)

1. The **Backup Now** pane opens. Specify the retention for the recovery point. You can have a maximum retention of 10 years for an on-demand backup.

   ![Screenshot shows the option how to retain backup date.](./media/backup-afs/retain-backup-date.png)

1. Select **OK** to confirm.

>[!NOTE]
>Azure Backup locks the storage account when you configure protection for any file share in the corresponding account. This feature provides protection against accidental deletion of a storage account with backed up file shares.

---

## Best practices

* Don't delete snapshots created by Azure Backup. Deleting snapshots can result in loss of recovery points and/or restore failures.

* Don't remove the lock taken on the storage account by Azure Backup. Deletion of the lock can make your storage account prone to accidental deletion. Learn more [about protect your resources with lock](/azure/azure-resource-manager/management/lock-resources).



## Next steps

- [Restore Azure Files using Azure portal](restore-afs.md?tabs=full-share-recovery).
- Restore Azure Files using [Azure PowerShell](restore-afs-powershell.md), [Azure CLI](restore-afs-cli.md), [REST API](restore-azure-file-share-rest-api.md).
- Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).



 





