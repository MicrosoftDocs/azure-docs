---
title: Azure Security Control - Data Recovery
description: Azure Security Control Data Recovery
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Data Recovery

Ensure that all system data, configurations, and secrets are automatically backed up on a regular basis.

## 9.1: Ensure regular automated back ups

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 9.1 | 10.1 | Customer |

Enable Azure Backup and configure the backup source (Azure VMs, SQL Server, or File Shares), as well as the desired frequency and retention period.

- [How to enable Azure Backup](../../backup/index.yml)

## 9.2: Perform complete system backups and backup any customer managed keys

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 9.2 | 10.2 | Customer |

Enable Azure Backup and target VM(s), as well as the desired frequency and retention periods. Backup customer managed keys within Azure Key Vault.

- [How to enable Azure Backup](../../backup/index.yml)

- [How to backup key vault keys in Azure](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

## 9.3: Validate all backups including customer managed keys

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 9.3 | 10.3 | Customer |

Ensure ability to periodically perform data restoration of content within Azure Backup. Test restoration of backed up customer managed keys.

- [How to recover files from Azure Virtual Machine backup](../../backup/backup-azure-restore-files-from-vm.md)

- [How to restore key vault keys in Azure](/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

## 9.4: Ensure protection of backups and customer managed keys

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 9.4 | 10.4 | Customer |

For on-premises backup, encryption-at-rest is provided using the passphrase you provide when backing up to Azure. For Azure VMs, data is encrypted-at-rest using Storage Service Encryption (SSE). Use Azure role-based access control to protect backups and customer managed keys.  

Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.  If Azure Storage is used to store backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted. 

- [Understand Azure RBAC](../../role-based-access-control/overview.md)

- [How to enable Soft-Delete and Purge protection in Key Vault](../../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)

- [Soft delete for Azure Storage blobs](../../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)


## Next steps

- See the next Security Control:  [Incident Response](security-control-incident-response.md)