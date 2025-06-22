---
title: Quickstart - Create a backup policy for Azure Files using Azure portal
description: Learn how to create a backup policy to get started with backing up Azure Files using the Azure portal.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Create a backup policy for Azure Files using Azure portal

This quickstart describes how to create a backup policy to get started with backing up Azure Files using the Azure portal. Azure Backup policy for Azure Files defines how and when backups are created, the retention period for recovery points, and the rules for data protection and recovery.

## Prerequisites

Before you create backup policy for Azure Files, ensure that the following prerequisites are met:

-  Check that the File Share is present in one of the supported storage account types. Review the [support matrix](azure-file-share-support-matrix.md).
- Identify or [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) in the same region and subscription as the storage account that hosts the File Share.
- If the storage account access has restrictions, check the firewall settings of the account to ensure the exception **Allow Azure services on the trusted services list to access this storage account** is in grant state. You can refer to [this](../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) link for the steps to grant an exception.

## Create a Backup policy

A backup policy defines the schedule, frequency of recovery point creation, and retention duration in the Recovery Services vault.

To create a backup policy, follow these steps:

1. Go to **Business Continuity Center** > **Protection policies**, and then select **+ Create policy** > **Create backup policy**.

   :::image type="content" source="./media/tutorial-backup-azure-files-vault-tier-portal/create-backup-policy.png" alt-text="Screenshot shows how to start creating a Backup policy." lightbox="./media/tutorial-backup-azure-files-vault-tier-portal/create-backup-policy.png":::
 
2. On the **Start: Create Policy** pane, select the **Datasource type** as **Azure Files (Azure Storage)**. In the **Select vault** link, you can select a Recovery Services vault, and then select **Continue**.

   :::image type="content" source="./media/tutorial-backup-azure-files-vault-tier-portal/start-create-policy.png" alt-text="Screenshot shows how to set the datasource type and vault for the Backup policy." lightbox="./media/tutorial-backup-azure-files-vault-tier-portal/start-create-policy.png":::

3. On the **Create policy** pane, provide the policy name.
4. On Backup tier, select the tier as **Vault-Standard**.

   >[!Note]
   >- **Snapshot Tier**: This backup tier enables only snapshot-based backups that are stored locally and can only provide protection in case of accidental deletions.
   >- **Vault-Standard tier**: This tier provides comprehensive data protection.

5. Under the **Backup schedule** section, configure the backup schedule as per the requirement.

   >[!Note]
   > You can configure up to **six backups** per day. The snapshots are taken as per the schedule defined in the policy. In case of vaulted backup, the data from the last snapshot of the day is transferred to the vault.
6. Under the **Snapshot retention** and **Vault retention** sections, configure the retention duration to determine the expiry date of the recovery points, and then select **OK**.

   :::image type="content" source="./media/tutorial-backup-azure-files-vault-tier-portal/trigger-create-policy.png" alt-text="Screenshot shows how to set the backup schedule and retention duration.":::
 
7. To create the Backup policy, select **Create**.  

>[!Note]
>You can also create a backup policy on the go while configuring backup for Azure Files.

## Next steps

- [Configure backup for Azure Files using Azure portal](tutorial-backup-azure-files-vault-tier-portal.md#configure-backup).
- Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).



 





