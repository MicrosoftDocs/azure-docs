---
title: Azure Cosmos DB support matrix
description: Provides a summary of support settings and limitations of Azure Cosmos DB backup.
ms.topic: reference
ms.date: 05/15/2026
ms.custom: references_regions, build-2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to understand the backup support matrix for Azure Cosmos DB so that I can effectively manage backup operations and ensure compliance with backup limitations and scenarios.
---


# Support matrix for Azure Cosmos DB vaulted backup (preview)

This article summarizes supported regions, scenarios, and the limitations for Azure Cosmos DB vaulted backup (preview).

## Supported regions

Azure Backup for Cosmos DB (preview) is available in all Azure public cloud regions. Sovereign regions are currently not supported. 

## Support scenarios

Azure Backup supports the following backup and restore scenarios for Azure Cosmos DB accounts during preview:

- Cosmos DB accounts with either NoSQL or MongoDB API using [Request Units (RUs)](/azure/cosmos-db/request-units) are supported. 
- •	Only weekly backups are supported providing a 7-day recovery point objective (RPO).
- Cosmos DB accounts on [continuous (PITR) backup mode](/azure/cosmos-db/continuous-backup-restore-introduction) are only supported. 
- Cross subscription restores are supported.
- Restore operation to an empty Cosmos DB account is supported. 
- Backup is supported only when the Cosmos DB account has public access enabled.
- Cosmos DB accounts with partitions upto 2,500 are supported (approximately 125 TB). 
- On-demand backups support full backups of the source Cosmos DB account. 

## Limitation

Azure Backup for Cosmos DB includes the following backup and restore limitations:

- Cosmos DB account within a NSP isn't supported.
- Cross region restore of backups isn't supported.
- Backup and restore aren’t supported if the Cosmos DB account’s primary write region differs from the Backup Vault region.
- Cosmos DB account with hierarchical partition keys isn't supported.
- Cosmos DB account with Per-Partition Automatic Failover (PPAF) enabled isn't supported.
- Item level backup and item level restore aren't supported. 
- Restore operation isn't supported to a Serverless target Cosmos DB account. 
- Restore operation isn't supported to a target Cosmos DB account with throughput limit configured.


## Next steps

[Back up Azure Cosmos DB using Azure portal](backup-azure-cosmos-db.md)
