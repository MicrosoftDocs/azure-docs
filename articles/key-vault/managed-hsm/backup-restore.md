---
title: Full backup/restore and selective restore for Azure Managed HSM
description: This document explains full backup/restore and selective restore.
services: key-vault
author: mbaldwin
tags: azure-key-vault
ms.custom: devx-track-azurecli

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 01/09/2024
ms.author: mbaldwin
# Customer intent: As a developer using Key Vault I want to know the best practices so I can implement them.
---
# Full backup and restore and selective key restore

> [!NOTE]
> This feature is only available for resource type managed HSM.

Managed HSM supports creating a full backup of the entire contents of the HSM including all keys, versions, attributes, tags, and role assignments. The backup is encrypted with cryptographic keys associated with the HSM's security domain.

Backup is a data plane operation. The caller initiating the backup operation must have permission to perform dataAction **Microsoft.KeyVault/managedHsm/backup/start/action**.

Only following built-in roles have permission to perform full backup:
- Managed HSM Administrator
- Managed HSM Backup

There are two ways to execute a full backup/restore:
1. Assigning a User-Assigned Managed Identity (UAMI) to the Managed HSM service. You can back up and restore your MHSM using a user assigned managed identity regardless of whether your storage account has public network access or private network access enabled. If storage account is behind a private endpoint, the UAMI method works with trusted service bypass to allow for backup and restore.
2. Using storage container SAS token with permissions 'crdw'. Backing up and restoring using storage container SAS token requires your storage account to have public network access enabled.

You must provide the following information to execute a full backup:
- HSM name or URL
- Storage account name
- Storage account blob storage container
- User assigned managed identity OR storage container SAS token with permissions 'crdw'

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

#### Prerequisites if backing up and restoring using user assigned managed identity:

1. Ensure you have the Azure CLI version 2.56.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).
2. Create a user assigned managed identity.
3. Create a storage account (or use an existing storage account).
4. If public network access is disabled on your storage account, enable trusted service bypass on the storage account in the “Networking” tab, under “Exceptions.”
5. Provide ‘storage blob data contributor’ role access to the user assigned managed identity created in step #2 by going to the “Access Control” tab on the portal -> Add Role Assignment. Then select “managed identity” and select the managed identity created in step#2 -> Review + Assign
6. Create the Managed HSM and associate the managed identity with below command.
   ```azurecli-interactive
   az keyvault create --hsm-name mhsmdemo2 –l mhsmlocation -- retention-days 7 --administrators "initialadmin" --mi-user-assigned "/subscriptions/subid/resourcegroups/mhsmrgname/providers/Microsoft.ManagedIdentity/userAssignedIdentities/userassignedidentitynamefromstep2" 
   ```
 If you have an existing Managed HSM, associate the managed identity by updating the MHSM with the below command. 
  ```azurecli-interactive
   az keyvault update-hsm --hsm-name mhsmdemo2 --mi-user-assigned "/subscriptions/subid/resourcegroups/mhsmrgname/providers/Microsoft.ManagedIdentity/userAssignedIdentities/userassignedidentitynamefromstep2" 
   ```

## Full backup

Backup is a long running operation but immediately returns a Job ID. You can check the status of backup process using this Job ID. The backup process creates a folder inside the designated container with a following naming pattern **`mhsm-{HSM_NAME}-{YYYY}{MM}{DD}{HH}{mm}{SS}`**, where HSM_NAME is the name of managed HSM being backed up and YYYY, MM, DD, HH, MM, mm, SS are the year, month, date, hour, minutes, and seconds of date/time in UTC when the backup command was received.

While the backup is in progress, the HSM might not operate at full throughput as some HSM partitions will be busy performing the backup operation.

### Backup HSM using user assigned managed identity
```azurecli-interactive
az keyvault backup start --use-managed-identity true --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer
  ```
### Backup HSM using SAS token

```azurecli-interactive
# time for 500 minutes later for SAS token expiry

end=$(date -u -d "500 minutes" '+%Y-%m-%dT%H:%MZ')

# Get storage account key

skey=$(az storage account keys list --query '[0].value' -o tsv --account-name mhsmdemobackup --subscription {subscription-id})

# Create a container

az storage container create --account-name  mhsmdemobackup --name mhsmdemobackupcontainer  --account-key $skey

# Generate a container sas token

sas=$(az storage container generate-sas -n mhsmdemobackupcontainer --account-name mhsmdemobackup --permissions crdw --expiry $end --account-key $skey -o tsv --subscription {subscription-id})

# Backup HSM

az keyvault backup start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --subscription {subscription-id}

```

## Full restore

Full restore allows you to completely restore the contents of the HSM with a previous backup, including all keys, versions, attributes, tags, and role assignments. Everything currently stored in the HSM will be wiped out, and it will return to the same state it was in when the source backup was created.

> [!IMPORTANT]
> Full restore is a very destructive and disruptive operation. Therefore it is mandatory to have completed a full backup at least 30 minutes prior to a `restore` operation can be performed.

Restore is a data plane operation. The caller starting the restore operation must have permission to perform dataAction **Microsoft.KeyVault/managedHsm/restore/start/action**. The source HSM where the backup was created and the destination HSM where the restore will be performed **must** have the same Security Domain. See more [about Managed HSM Security Domain](security-domain.md).

There are 2 ways to execute a full restore. You must provide the following information to execute a full restore:
- HSM name or URL
- Storage account name
- Storage account blob container
- User assigned managed identity OR storage container SAS token with permissions `rl` 
- Storage container folder name where the source backup is stored

Restore is a long running operation but will immediately return a Job ID. You can check the status of the restore process using this Job ID. When the restore process is in progress, the HSM enters a restore mode and all data plane command (except check restore status) are disabled.

### Restore HSM using user assigned managed identity
```azurecli-interactive
az keyvault restore start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --backup-folder mhsm-backup-foldername --use-managed-identity true
  ```
### Restore HSM using SAS token

```azurecli-interactive
# time for 500 minutes later for SAS token expiry

end=$(date -u -d "500 minutes" '+%Y-%m-%dT%H:%MZ')

# Get storage account key

skey=$(az storage account keys list --query '[0].value' -o tsv --account-name mhsmdemobackup --subscription {subscription-id})

# Generate a container sas token

sas=$(az storage container generate-sas -n mhsmdemobackupcontainer --account-name mhsmdemobackup --permissions rl --expiry $end --account-key $skey -o tsv --subscription {subscription-id})

# Restore HSM

az keyvault restore start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --backup-folder mhsm-mhsmdemo-2020083120161860
```

## Selective key restore

Selective key restore allows you to restore one individual key with all its key versions from a previous backup to an HSM.

### Selective key restore using user assigned managed identity
```
az keyvault restore start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --backup-folder mhsm-backup-foldername --use-managed-identity true --key-name rsa-key2
  ```

### Selective key restore using SAS token
```
az keyvault restore start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --backup-folder mhsm-mhsmdemo-2020083120161860 -–key-name rsa-key2
```

## Next Steps
- See [Manage a Managed HSM using the Azure CLI](key-management.md).
- Learn more about [Managed HSM Security Domain](security-domain.md)
