---
title: Quickstart - Configure vaulted backup for Azure Blobs using Azure Backup
description: In this quickstart, learn how to configure vaulted backup for Azure Blobs.
ms.topic: quickstart
ms.date: 05/30/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Configure vaulted backup for Azure Blobs using Azure Backup

This quickstart describes how to create a backup policy and configure vaulted backup for Azure Blobs using Azure portal.

Azure Backup allows you to configure operational and vaulted backups to protect block blobs in your storage accounts.

## Prerequisites

- You need to have a Backup vault to configure Azure Blob backup. If the Backup vault isn’t present, [create one](blob-backup-configure-manage.md?tabs=vaulted-backup#create-a-backup-vault).
- Assign permissions to the Backup vault on the storage account. [Learn more](blob-backup-configure-manage.md?tabs=vaulted-backup#grant-permissions-to-the-backup-vault-on-storage-accounts).
- Create a backup policy for Azure Blobs vaulted backup. [Learn more](blob-backup-configure-manage.md?tabs=vaulted-backup#create-a-backup-policy).

## Before you start

- Vaulted backup of blobs is a managed offsite backup solution that transfers data to the backup vault and retains as per the retention configured in the backup policy. You can retain data for a maximum of *10 years*.
- Currently, you can use the vaulted backup solution to restore data to a different storage account only. While performing restores, ensure that the target storage account doesn't contain any *containers* with the same name as those backed up in a recovery point. If any conflicts arise due to the same name of containers, the restore operation fails.
- **Ensure the storage accounts that need to be backed up have cross-tenant replication enabled. You can check this by navigating to the storage account > Object replication > Advanced settings. Once here, ensure that the check-box is enabled.**

For more information about the supported scenarios, limitations, and availability, See the [support matrix](blob-backup-support-matrix.md).


[!INCLUDE [blob-backup-azure-portal-configure-backup.md](../../includes/blob-backup-azure-portal-configure-backup.md)]


## Next step

[Restore Azure Blobs](blob-restore.md)
