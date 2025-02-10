---
title: Tutorial - the Azure portal for Azure Files vaulted backup using Azure Backup
description: Learn how to create a policy and configure backup for Azure Files to vault-tier with the Azure portal.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: tutorial
ms.date: 10/07/2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Tutorial: Create a policy and configure vaulted backup for Azure Files

This tutorial describes how to configure vaulted backup for Azure Files using the Azure portal. You can also configure backup with Azure CLI or Azure PowerShell.

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. Vaulted backups offer an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions. You can:

- Define backup schedules and retention settings.
- Store backup data in the Recovery Service vault, retaining it for up to **10 years**.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that the following prerequisites are met:

-  Check that the file share is present in one of the supported storage account types. Review the [support matrix](azure-file-share-support-matrix.md).
- Identify or [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) in the same region and subscription as the storage account that hosts the file share.
- [Create a backup policy for Azure File share vaulted backup](manage-afs-backup.md#create-a-new-policy).
- If the storage account access has restrictions, check the firewall settings of the account to ensure the exception **Allow Azure services on the trusted services list to access this storage account** is in grant state. You can refer to [this](../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) link for the steps to grant an exception.


[!INCLUDE [Configure Azure Files vaulted backup.](../../includes/configure-azure-files-vaulted-backup.md)]


## Next step

- [Restore Azure file shares using Azure portal](restore-afs.md?tabs=full-share-recovery)
- [Manage Azure file share backups using Azure portal](manage-afs-backup.md)


 





