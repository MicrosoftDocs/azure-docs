---
title: Azure Cosmos DB support matrix
description: Provides a summary of support settings and limitations of Azure Cosmos DB backup.
ms.topic: reference
ms.date: 08/27/2026
ms.custom: references_regions, build-2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to understand the backup support matrix for Azure Cosmos DB so that I can effectively manage backup operations and ensure compliance with backup limitations and scenarios.
---


# Support matrix for Azure Cosmos DB vaulted backup (preview)

This article summarizes supported regions, scenarios, and the limitations for Azure Cosmos DB vaulted backup (preview).

## Supported regions

Azure Backup for Cosmos DB (preview) is available in all Azure public cloud regions. National clouds and sovereign regions are currently not supported. 

## Support scenarios

Azure Backup supports the following backup and restore scenarios for Azure Cosmos DB accounts during preview:

- Cosmos DB accounts with either NoSQL or MongoDB API using [Request Units (RUs)](/azure/cosmos-db/request-units) are supported. 
- Daily incremental backups with a weekly full backup are supported, providing a 1-day recovery point objective (RPO). Every policy must include one weekly full backup; incremental backups run on the remaining days. Incremental-only policies aren't supported. 
- Cosmos DB accounts on [continuous (PITR) backup mode](/azure/cosmos-db/continuous-backup-restore-introduction) are only supported.
- Cross subscription restores are supported.
- Cross region backups are supported.
- Restore operation to an empty, single-region target Cosmos DB account is supported.
- Restore operation to a target Cosmos DB account using the same API type as source Cosmos DB account is supported.
- Cosmos DB accounts with partitions upto 2,500 are supported (approximately 125 TB). 
- On-demand backups support full backups only. Incremental backups are always scheduled; on-demand (ad-hoc) incremental backups aren't supported.  

## Limitations

Azure Backup for Cosmos DB includes the following backup and restore limitations:

- Cosmos DB account enabled with [Network Security Perimeter (NSP)](/azure/cosmos-db/how-to-configure-nsp) isn't supported.
- Cross region restore of backups isn't supported.
- Restoring an incremental recovery point requires its backup chain to be intact — the parent full backup and all intervening incremental backups.
- A backup policy can't schedule more than one full backup per week, including custom policies created through Azure CLI or PowerShell. 
- Backup and restore aren’t supported if the Cosmos DB account’s primary write region differs from the Backup Vault region.
- Backup and restore aren’t supported if the Cosmos DB account’s primary write region differs from its deployment region.
- Cosmos DB account with hierarchical partition keys isn't supported.
- Cosmos DB account with Per-Partition Automatic Failover (PPAF) enabled isn't supported.
- Item-level backup and item level restore aren't supported. 
- Restore operation isn't supported to a Serverless target Cosmos DB account. 
- Restore operation isn't supported to a target Cosmos DB account with throughput limit configured.
- Auto-heal (automatic retry of a failed scheduled backup) applies to scheduled backups only, and only for specific transient errors. On-demand backups aren't auto-healed. 

## Next steps

[Back up Azure Cosmos DB using Azure portal (preview)](backup-azure-cosmos-db.md).
