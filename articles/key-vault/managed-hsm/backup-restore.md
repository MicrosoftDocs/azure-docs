---
title: Full backup/restore and selective restore
description: This document explains full backup/restore and selective restore
services: key-vault
author: amitbapat
manager: msmbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: ambapat
# Customer intent: As a developer using Key Vault I want to know the best practices so I can implement them.
---
# Full backup/restore and selective restore

> [!NOTE] This feature is only available for resource type managed HSM.

## Full backup

Managed HSM supports creating a full backup of the entire contents of the HSM including all keys, versions, attributes, tags, and role assignments. The backup is encrypted with cryptographic keys associated with the HSM's security domain. 

Backup is a data plane operation. The caller initiating the backup operation must have permission to perform dataAction **Microsoft.KeyVault/managedHsm/backup/start/action**. 

Only following built-in roles have permission to perform full backup:
- Managed HSM Administrator
- Managed HSM Backup

You need to provide following information to execute a full backup:
- HSM name or URL
- Storage account name
- Storage account blob storage container
- Storage container SAS token with permissions `crdw`

Backup is a long running operation. After issuing the backup command it immediately returns with a Job ID. You can check the status of backup process using this Job ID. The backup process creates a folder inside the designated container with a following naming pattern **`mhsm-{HSM_NAME}-{YYYY}{MM}{DD}{HH}{mm}{SS}`**, where HSM_NAME is the name of managed HSM being backed up and YYYY, MM, DD, HH, MM, mm, SS are the year, month, date, hour, minutes and seconds of date/time in UTC when the backup command was received.

While the backup is in progress the HSM may not operate at full throughput as some HSM partitions will be busy performing the backup operation.


## Full restore

Full restore allows you to completely restore the contents of the HSM with a previous backup. This includes all keys, versions, attributes, tags, and role assignments. This will effectively wipe out everything currently stored in the HSM and return it to the same state when the source backup was created.

> [!IMPORTANT] Full restore is a very destructive and disruptive operation. Therefore it is mandatory to have completed a full backup within last 30 minutes before a `restore` operation can be performed.

Restore is a data plane operation. The caller initiating the restore operation must have permission to perform dataAction **Microsoft.KeyVault/managedHsm/restore/start/action**. The source HSM where the backup was created and the destination HSM where the restore will be performed **must** have the same Security Domain. See more [about Managed HSM Security Domain](security-domain.md).


You need to provide following information to execute a full restore:
- HSM name or URL
- Storage account name
- Storage account blob container
- Storage container SAS token with permissions `rl`
- Storage container folder name where the source backup is store

Restore is a long running operation. After issuing the restore command it immediately returns with a Job ID. You can check the status of the restore process using this Job ID. When the restore process is in progress, the HSM enters a restore mode and all data plane command (except check restore status) are disabled.

## Selective restore

Selective restore allows you to restore one single key from a full HSM backup. This is a quick way to restore a permanently deleted key from an existing backup.



## Next Steps
- See [Manage a Managed HSM using the Azure CLI](manage-with-cli.md) to learn how to use Azure CLI to perform backup and restore operations.
- Learn more about [Managed HSM Security Domain](security-domain.md)