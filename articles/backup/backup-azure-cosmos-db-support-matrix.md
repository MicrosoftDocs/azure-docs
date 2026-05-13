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


# Support matrix for Azure Cosmos DB (preview)

You can use [Azure Backup](./backup-overview.md) to protect [Azure Cosmos DB](./cosmos-db/overview.md). This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Backup for Cosmos DB is generally available in all public cloud regions. Sovereign regions are currently not supported. 

## Support scenarios

Consider the following support scenarios for Azure Backup for Cosmos DB:

- Cosmos DB accounts with either NoSQL or MongoDB API using [Request Units (RUs)](./cosmos-db/request-units.md) are supported. 
- Only weekly backups are supported (RPO of 7 days) 
- Azure Backup for Cosmos DB supports only those Cosmos DB accounts which are on [continuous (PITR) backup mode](./cosmos-db/continuous-backup-restore-introduction.md). 
- Cross subscription restores are supported.
- Restore operation to an empty Cosmos DB account is supported. 
- Cosmos DB account should have pubic access enabled.
- Cosmos DB accounts with partitions upto 2,500 are supported (roughly 125 TB). 
- On-demand backups are full backups of the source Cosmos DB account. 

## Limitation

Azure Backup for Cosmos DB includes the following limitations:

- Cosmos DB account within a NSP is not supported yet.
- Cross region restore of backups is not supported yet.
- Backup and restore operations where primary write region of Cosmos DB account is different from Backup Vault region are not supported yet. 
- Cosmos DB account with hierarchical partition keys is not supported.
- Cosmos DB account with Per-Partition Automatic Failover (PPAF) enabled is not supported.
- Item level backup and item level restore are not supported. 
- Restore operation is not supported to a Serverless target Cosmos DB account. 
- Restore operation is not supported to a target Cosmos DB account where throughput limit is set.


## Next steps

- [Back up Azure Cosmos DB using Azure portal](backup-azure-cosmos-db.md)
