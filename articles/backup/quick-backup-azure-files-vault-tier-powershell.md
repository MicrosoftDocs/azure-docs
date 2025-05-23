---
title: Quickstart - Configure vaulted backup for Azure Files using Azure PowerShell
description: Learn how to configure vaulted backup for Azure Files using Azure PowerShell.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Configure vaulted backup for Azure Files using Azure PowerShell

This quickstart describes how to configure vaulted backup for Azure Files using Azure PowerShell. You can also configure backup with [Azure CLI](quick-backup-azure-files-vault-tier-cli.md) or in the [Azure portal](tutorial-backup-azure-files-vault-tier-portal.md#configure-backup).

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. Vaulted backups offer an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions. You can:

- Define backup schedules and retention settings.
- Store backup data in the Recovery Service vault, retaining it for up to **10 years**.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that the following prerequisites are met:

- [Download the latest version of Azure PowerShell](/powershell/azure/install-azure-powershell).
- Ensure that File Share is in a supported storage account type. See the [Azure Files backup support matrix](azure-file-share-support-matrix.md).

- Allow **Azure services on the trusted services list**  in the **Firewall settings** to access the storage account, if access is restricted. Learn [how to grant an exception](/azure/storage/common/storage-network-security?tabs=azure-portal#manage-exceptions).
- Use an existing Recovery Services vault. If you don't have the vault, [create one](backup-azure-afs-automation.md?tabs=vault-standard#create-a-recovery-services-vault).
- [Configure a Backup policy](backup-azure-afs-automation.md?tabs=vault-standard#configure-a-backup-policy) for the backup operation.

## Configure backup

To configure vaulted backup for Azure Files, use the [`Enable-AzRecoveryServicesBackupProtection`](/powershell/module/az.recoveryservices/enable-azrecoveryservicesbackupprotection) cmdlet. 

>[!Note]
>After the policy is associated with the vault, backups are triggered in accordance with the policy schedule.
The following example cmdlet configures protection for the Azure Files `testAzureFS` in storage account `testStorageAcct`, with the policy `dailyafs`:

```azurepowershell-interactive
Enable-AzRecoveryServicesBackupProtection -StorageAccountName "testStorageAcct" -Name "testAzureFS" -Policy $afsPol
```

The cmdlet gives the output similar to the following one when the **configure-protection job** is complete:

```OUTPUT
WorkloadName       Operation            Status                 StartTime                                                                                                         EndTime                   JobID
------------             ---------            ------               ---------                                  -------                   -----
testAzureFS       ConfigureBackup      Completed            11/12/2018 2:15:26 PM     11/12/2018 2:16:11 PM     ec7d4f1d-40bd-46a4-9edb-3193c41f6bf6
```

## Next steps

- [Restore Azure Files using Azure PowerShell](restore-afs-powershell.md).
- Restore Azure Files using [Azure portal](restore-afs.md), [Azure CLI](restore-afs-cli.md), [REST API](restore-azure-file-share-rest-api.md).
- Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).

 





