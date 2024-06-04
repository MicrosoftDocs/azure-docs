---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

[Azure Backup](../articles/backup/backup-overview.md) now allows you to configure both [operational](../articles/backup/blob-backup-overview.md?tabs=operational-backup) and [vaulted](../articles/backup/blob-backup-overview.md?tabs=vaulted-backup) backups to protect block blobs in your storage accounts.

Vaulted backup of blobs is a managed offsite backup solution that stores the backup data in a general v2 storage account, enabling you to protect your backup data against ransomware attacks or source data loss due to malicious or rogue admin. 

With vaulted backup, you can:

- Define the backup schedule to create recovery points and the retention settings that determine how long the backups will be retained in the vault.
- Configure and manage the vaulted and operational backups using a single backup policy.
- Copy and store the backup data in the Backup vault, thus providing an offsite copy of data that can be retained for a maximum of 10 years.