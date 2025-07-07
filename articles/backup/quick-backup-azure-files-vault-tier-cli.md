---
title: Quickstart - Configure vaulted backup for Azure Files using Azure CLI
description: Learn how to configure vaulted backup for Azure Files using Azure CLI.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a DevOps engineer, I want to configure vaulted backup for Azure Files using the command line, so that I can automate backup processes and ensure data protection against ransomware and other threats."
---

#  Quickstart: Configure vaulted backup for Azure Files using Azure CLI

This quickstart describes how to configure vaulted backup for Azure Files using Azure CLI. The Azure CLI is used to create and manage Azure resources from the command line or in scripts. You can also perform these steps with [Azure PowerShell](quick-backup-azure-files-vault-tier-powershell.md) or in the [Azure portal](tutorial-backup-azure-files-vault-tier-portal.md#configure-backup).

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. Vaulted backups offer an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions. You can:

- Define backup schedules and retention settings.
- Store backup data in the Recovery Service vault, retaining it for up to **10 years**.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that the following prerequisites are met:

- Use Bash in [Azure Cloud Shell](/azure/cloud-shell/overview). See the [Quickstart guide](/azure/cloud-shell/quickstart).

- [Install Azure CLI](/cli/azure/install-azure-cli) to run CLI Commands Locally. For Windows or macOS, use a Docker container. Learn [how to use Docker container](/cli/azure/run-azure-cli-docker).
  To install and upgrade Azure CLI locally, follow these steps:

  1. Sign in using the [`az login`](/cli/azure/reference-index#az-login) command and follow the instructions on the **Terminal**.
     For other sign-in options, See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).
  1. When prompted, install the Azure CLI extension. See [how to use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  1. Check the Azure CLI version  by using the [`az version`](/cli/azure/reference-index?#az-version) and update if needed with the [`az upgrade`](/cli/azure/reference-index?#az-upgrade) command.

     >[!Note]
     >The Azure CLI version must be **2.0.18 or higher**. Azure Cloud Shell already has the latest version.

- Ensure that File Share is in a supported storage account type. See the [Azure Files backup support matrix](azure-file-share-support-matrix.md).

- Allow **Azure services on the trusted services list**  in the **Firewall settings** to access the storage account, if access is restricted. Learn [how to grant an exception](/azure/storage/common/storage-network-security?tabs=azure-portal#manage-exceptions).
- Use an existing Recovery Services vault. If you don't have the vault, [create one](backup-afs-cli.md#create-a-recovery-services-vault).
- [Create a Backup policy](manage-afs-backup-cli.md?tabs=vault-standard#create-a-backup-policy) for the backup operation.

## Configure backup

To configure vaulted backup for Azure Files, use the [`az backup protection enable-for-azurefileshare`](/cli/azure/backup/protection#az-backup-protection-enable-for-azurefileshare) command.

The following example command enables backup for the `afs0` File Share in the `afsbugbash0` storage account using the schedule 1 backup policy:

```azurecli-interactive
az backup protection enable-for-azurefileshare -p "vaultpol" --resource-group myResourceGroup --vault-name myRecoveryServicesVault  --storage-account "afsbugbash0" --azure-file-share "afs0" 
output
(azcli) C:\Users\testuser\Downloads\CLIForAFS\azure-cli>az backup protection enable-for-azurefileshare -p "snappol" --resource-group "myResourceGroup " --vault-name "afsbugbashvault" --storage-account "afsbugbash0" --azure-file-share "afs0"
{
  "eTag": null,
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup /providers/Microsoft.RecoveryServices/vaults/ myRecoveryServicesVault  /backupFabrics/Azure/protectionContainers/StorageContainer;storage;myResourceGroup ;afsbugbash0/protectedItems/AzureFileShare;9031e290ca28baa9cb64903a30247d2b9ff3ca143a5e1a37c7afec6b2ff1a2e4",
  "location": null,
  "name": "AzureFileShare;9031e290ca28baa9cb64903a30247d2b9ff3ca143a5e1a37c7afec6b2ff1a2e4",
  "properties": {
    "backupManagementType": "AzureStorage",
    "backupSetName": null,
    "containerName": "StorageContainer;storage;myResourceGroup ;afsbugbash0",
    "createMode": null,
    "deferredDeleteTimeInUtc": null,
    "deferredDeleteTimeRemaining": null,
    "extendedInfo": null,
    "friendlyName": "afs0",
    "isArchiveEnabled": false,
    "isDeferredDeleteScheduleUpcoming": null,
    "isRehydrate": null,
    "isScheduledForDeferredDelete": null,
    "kpisHealths": null,
    "lastBackupStatus": "Completed",
    "lastBackupTime": "2025-01-16T23:02:10.801858+00:00",
    "lastRecoveryPoint": null,
    "policyId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.RecoveryServices/vaults/ myRecoveryServicesVault  /backupPolicies/vaultpol",
    "policyName": null,
    "protectedItemType": "AzureFileShareProtectedItem",
    "protectionState": "Protected",
    "protectionStatus": "Healthy",
    "resourceGuardOperationRequests": null,
    "softDeleteRetentionPeriod": 0,
    "softDeleteRetentionPeriodInDays": null,
    "sourceResourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup /providers/Microsoft.storage/storageAccounts/afsbugbash0",
    "vaultId": "https://management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup /providers/Microsoft.RecoveryServices/vaults/afsbugbashvault",
    "workloadType": "AzureFileShare"
  },
  "resourceGroup": "myResourceGroup ",
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems"
}
```

## Next steps

- [Restore Azure Files using CLI](restore-afs-cli.md).
- Restore Azure Files using [Azure portal](restore-afs.md), [Azure PowerShell](restore-afs-powershell.md), [REST API](restore-azure-file-share-rest-api.md).
- Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).

 





