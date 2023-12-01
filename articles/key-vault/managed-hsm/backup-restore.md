---
title: Full backup/restore and selective restore for Azure Managed HSM
description: This document explains full backup/restore and selective restore
services: key-vault
author: mbaldwin
tags: azure-key-vault
ms.custom: devx-track-azurecli

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 10/23/2023
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

You must provide following information to execute a full backup:
- HSM name or URL
- Storage account name
- Storage account blob storage container
- Storage container SAS token with permissions `crdw`

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Full backup

Backup is a long running operation but will immediately return a Job ID. You can check the status of backup process using this Job ID. The backup process creates a folder inside the designated container with a following naming pattern **`mhsm-{HSM_NAME}-{YYYY}{MM}{DD}{HH}{mm}{SS}`**, where HSM_NAME is the name of managed HSM being backed up and YYYY, MM, DD, HH, MM, mm, SS are the year, month, date, hour, minutes, and seconds of date/time in UTC when the backup command was received.

While the backup is in progress, the HSM might not operate at full throughput as some HSM partitions will be busy performing the backup operation.

> [!IMPORTANT]
> Public internet access must **not** be blocked from the storage accounts being used to backup or restore resources.


```azurecli-interactive
# time for 500 minutes later for SAS token expiry

end=$(date -u -d "500 minutes" '+%Y-%m-%dT%H:%MZ')

# Get storage account key

skey=$(az storage account keys list --query '[0].value' -o tsv --account-name mhsmdemobackup --subscription a1ba9aaa-b7f6-4a33-b038-6e64553a6c7b)

# Create a container

az storage container create --account-name  mhsmdemobackup --name mhsmdemobackupcontainer  --account-key $skey

# Generate a container sas token

sas=$(az storage container generate-sas -n mhsmdemobackupcontainer --account-name mhsmdemobackup --permissions crdw --expiry $end --account-key $skey -o tsv --subscription a1ba9aaa-b7f6-4a33-b038-6e64553a6c7b)

# Backup HSM

az keyvault backup start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --subscription 361da5d4-a47a-4c79-afdd-d66f684f4070
```

## Full restore

Full restore allows you to completely restore the contents of the HSM with a previous backup, including all keys, versions, attributes, tags, and role assignments. Everything currently stored in the HSM will be wiped out, and it will return to the same state it was in when the source backup was created.

> [!IMPORTANT]
> Full restore is a very destructive and disruptive operation. Therefore it is mandatory to have completed a full backup at least 30 minutes prior to a `restore` operation can be performed.

Restore is a data plane operation. The caller starting the restore operation must have permission to perform dataAction **Microsoft.KeyVault/managedHsm/restore/start/action**. The source HSM where the backup was created and the destination HSM where the restore will be performed **must** have the same Security Domain. See more [about Managed HSM Security Domain](security-domain.md).

You must provide the following information to execute a full restore:
- HSM name or URL
- Storage account name
- Storage account blob container
- Storage container SAS token with permissions `rl`
- Storage container folder name where the source backup is stored

Restore is a long running operation but will immediately return a Job ID. You can check the status of the restore process using this Job ID. When the restore process is in progress, the HSM enters a restore mode and all data plane command (except check restore status) are disabled.

```azurecli-interactive
#### time for 500 minutes later for SAS token expiry

end=$(date -u -d "500 minutes" '+%Y-%m-%dT%H:%MZ')

# Get storage account key

skey=$(az storage account keys list --query '[0].value' -o tsv --account-name mhsmdemobackup --subscription a1ba9aaa-b7f6-4a33-b038-6e64553a6c7b)

# Generate a container sas token

sas=$(az storage container generate-sas -n mhsmdemobackupcontainer --account-name mhsmdemobackup --permissions rl --expiry $end --account-key $skey -o tsv --subscription a1ba9aaa-b7f6-4a33-b038-6e64553a6c7b)
```

## Restore HSM

```
az keyvault restore start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --backup-folder mhsm-mhsmdemo-2020083120161860
```

## Selective key restore

Selective key restore allows you to restore one individual key with all its key versions from a previous backup to an HSM.

```
az keyvault restore start --hsm-name mhsmdemo2 --storage-account-name mhsmdemobackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --backup-folder mhsm-mhsmdemo-2020083120161860 -–key-name rsa-key2
```

## Next Steps
- See [Manage a Managed HSM using the Azure CLI](key-management.md).
- Learn more about [Managed HSM Security Domain](security-domain.md)
