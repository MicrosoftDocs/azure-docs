---
title: Support matrix for Azure Backup for PostgreSQL flexible server and elastic cluster (v2)
description: Provides a summary of supported scenarios, configurations, and limitations for Azure Backup for Azure Database for PostgreSQL flexible server and elastic cluster (v2).
ms.topic: reference
ms.service: azure-backup
ms.date: 09/28/2026
ms.custom: references_regions
---

# Support matrix for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) (preview)

Azure Backup allows you to protect Azure PostgreSQL flexible servers and elastic clusters with physical (disk snapshot) backups. This article summarizes the supported regions, scenarios, configurations, and limitations of the v2 experience.

## Supported regions for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

Vaulted backups are available in all public regions except Austria East, Belgium Central, Chile Central, Indonesia Central, Israel Northwest, Malaysia South, Malaysia West, Mexico Central, Qatar Central, South Central US 2, Southeast US, Southeast US 3, Southeast US 5, Southwest US and West India.

## Supported datasources and configurations for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

The following table lists the supported datasources and configurations for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2):

| Item | Support |
|---|---|
| Azure Database for PostgreSQL flexible server | Supported |
| Azure Database for PostgreSQL elastic cluster | Supported |
| PostgreSQL major version | PostgreSQL 15 and later |
| Compute tier | General Purpose and Memory Optimized |
| Disk type and maximum size | Premium SSD v1 up to 32 TB; Premium SSD v2 up to 64 TB |
| Server role | Primary servers only |
| Customer Managed Key on the server or cluster | Supported |
| High availability enabled on the source server | Supported |
| Virtual network or private endpoint on the source server or cluster | Supported through Trusted Access |
| Backup vault location | Must be in the same region as the datasource |
| Backup vault subscription | Same or different subscription, within the same tenant as the datasource |
| Backup vault with Customer Managed Key encryption | Supported |
| Backup vault immutability (WORM) | Supported. Recovery points can be made immutable so they can't be altered or deleted before their retention expires. |
| Soft delete, Multi-user authorization, and Multi-factor authenticaion on the vault | Supported |
| User-assigned managed identity | Supported for granting permissions on the datasource and on the Backup vault |

## Supported backup scenarios for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) supports the following backup scenarios: 

- The entire server or cluster is backed up. Backup of individual databases isn't supported.
- Elastic cluster up to 8 nodes is supported.
- The first backup of a datasource is a full backup; every backup after that is incremental. Azure Backup performs an initial replication again automatically if the snapshot chain is broken.
- Backup schedules of daily or weekly are supported, with a minimum recovery point objective of one day.
- Retention can be set from 7 days up to 10 years, with independent retention durations for daily, weekly, monthly, and yearly recovery points.
- On-demand (ad hoc) backups are supported after protection is configured.
- One backup instance is supported per datasource. Multiple protection of the same server isn't supported, so a server is protected either by the v1 stack or by the v2 stack, never both.
- The backup policy associated with a backup instance can be changed after protection is configured.
- A backup job is marked **Successful** once the managed disk snapshot has been copied to the vault.
- Recovery point metadata, including the PostgreSQL version the backup was taken on, is visible on each recovery point.
- WORM immutable backups are supported. When immutability is enabled and locked on the Backup vault, recovery points can't be altered, overwritten, or deleted before their configured retention period expires, by any user including a vault administrator.

## Supported restore scenarios for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) supports the following restore scenarios: 

- Restores are performed as **Restore as Server** to an alternate location. The target flexible server or elastic cluster must be created before the restore is triggered.
- Data in unlogged tables is not preserved and is lost upon restore.
- The target can be in a different subscription within the same tenant.
- Cross region restore is supported.
- Restore operations from backups taken on PostgreSQL versions that are no longer supported are not guaranteed.
- Restore is supported even after the source datasource has been deleted.
- A restore job is marked **Successful** only when the entire recovery point has been restored.
- A recovery point taken on a Premium SSD v1 server restores to a Premium SSD v1 target. A recovery point taken on a Premium SSD v2 server restores to a Premium SSD v2 target.

### Target requirements for restore

The target flexible server or elastic cluster must meet all of the following criteria, which Azure Backup validates before the restore operation starts:

- The server or cluster must be empty.
- The server or cluster must not be on the Burstable compute tier.
- The target server or cluster must use the same PostgreSQL major version as the source server when the backup was taken.The restore fails if the versions don't match.
- The target server or cluster must have the same disk size as the source server. The restore fails if the target disk size is less than the source disk size, even though the recovery point requires lesser space on the target disk.
- The server or cluster must not have high availability configured.
- The server or cluster must not have a geo-replica configured, and it must not itself be a geo-replica.
- The server or cluster must be in the same region as the Backup vault.

## Limitations for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

The v2 experience has the following limitations:

- **Item-level backup and restore isn't supported.** You can't back up or restore an individual database, table, or object.
- **Burstable compute tier isn't supported.** Configuring backup on a Burstable server fails with a user error. [Scale the server to General Purpose or Memory Optimized first](/azure/postgresql/scale/how-to-scale-compute).
- **PostgreSQL 14 and earlier aren't supported.** Backup configuration fails for servers that use these versions. You must [upgrade to a supported major version](/azure/postgresql/configure-maintain/concepts-major-version-upgrade) before you configure backup, or continue to protect the server with v1.
- **Backup is supported only for primary servers.** You can't configure backup for read replicas or geo-replicas. If you try to configure backup for a replica, the operation fails with a user error.
- **The one-day recovery point objective (RPO) isn't guaranteed in all scenarios.** The initial backup and subsequent initial replication transfer the entire disk contents and can take more than one day for large servers and clusters. Backups can also exceed one day for servers with high daily data churns or servers that use Premium SSD v2.
- **Moving a protected item from v1 to v2 is one way.** To return to v1, stop protection and reconfigure backup on the v1 stack.
- **Backup configuration doesn't automatically apply to the new primary server after a planned geo-failover.** The existing backup configuration remains associated with the previous primary server, and its backups start to fail after the failover. To protect the new primary server, configure backup on that server.

## Next step

- [About Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) (preview).](backup-azure-postgresql-flex-server-elastic-cluster-v2-overview.md)

## Related content

- [Support matrix for Azure Database for PostgreSQL - Flexible Server (v1).](backup-azure-database-postgresql-flex-support-matrix.md).
