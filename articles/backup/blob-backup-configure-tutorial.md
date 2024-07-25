---
title: Tutorial - Configure vaulted backup for Azure Blobs using Azure Backup
description: In this tutorial, learn how to configure vaulted backup for Azure Blobs.
ms.topic: tutorial
ms.date: 07/24/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Configure vaulted backup for Azure Blobs using Azure Backup

This tutorial describes how to create a backup policy and configure vaulted backup for Azure Blobs from the Azure portal.

[!INCLUDE [blob-vaulted-backup-introduction.md](../../includes/blob-vaulted-backup-introduction.md)]

## Prerequisites

Before you configure blob vaulted backup, ensure that:

- You have a Backup vault to configure Azure Blob backup. If you haven't created the Backup vault, [create one](blob-backup-configure-manage.md?tabs=vaulted-backup#create-a-backup-vault).
- You assign permissions to the Backup vault on the storage account. [Learn more](blob-backup-configure-manage.md?tabs=vaulted-backup#grant-permissions-to-the-backup-vault-on-storage-accounts).

## Before you start

Things to remember before you start configuring blob vaulted backup:

- Vaulted backup of blobs is a managed offsite backup solution that transfers data to the backup vault and retains as per the retention configured in the backup policy. You can retain data for a maximum of *10 years*.
- Currently, you can use the vaulted backup solution to restore data to a different storage account only. While performing restores, ensure that the target storage account doesn't contain any *containers* with the same name as those backed up in a recovery point. If any conflicts arise due to the same name of containers, the restore operation fails.
- Storage accounts to be backed up need to have *cross-tenant replication* enabled. To ensure if the checkbox for this setting is enabled, go to the **storage account** > **Object replication** > **Advanced settings**.

For more information about the supported scenarios, limitations, and availability, see the [support matrix](blob-backup-support-matrix.md).


[!INCLUDE [blob-backup-azure-portal-create-policy.md](../../includes/blob-backup-azure-portal-create-policy.md)]

[!INCLUDE [blob-backup-azure-portal-configure-backup.md](../../includes/blob-backup-azure-portal-configure-backup.md)]


## Next step

[Restore Azure Blobs using Azure Backup](blob-restore.md).
