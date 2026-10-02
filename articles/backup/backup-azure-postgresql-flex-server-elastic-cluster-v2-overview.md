---
title: About Azure Backup for PostgreSQL flexible server and elastic cluster (v2)
description: Learn how Azure Backup protects Azure Database for PostgreSQL flexible servers and elastic clusters using physical (disk snapshot) backups.
ms.topic: overview
ms.service: azure-backup
ms.date: 09/28/2026
---

# About Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) (preview)

**Azure Backup for PostgreSQL Flexible Server and Elastic Cluster v2 (preview)** provides an enhanced backup capability designed to address key limitations of the existing v1 solution and supports a broader range of backup needs. V2 uses physical backups based on managed disk snapshots, replacing the logical `pg_dump` backup approach used in v1. 

## Why use Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

The v2 backup solution provides greater flexibility for protecting and recovering Azure PostgreSQL Flexible Server or Elastic Cluster workloads. It uses incremental snapshots of the underlying managed disks instead of the logical backup approach used by v1, addressing limitations related to server size, backup frequency, and recovery options. 

The following table compares the capabilities available with v1 and v2 backup.  

| Capability | v1 (generally available) | v2 (preview) |
|---|---|---|
| Backup technology | Logical backup (`pg_dump`) | Physical backup from managed disk snapshots |
| Datasources protected | Flexible server | Flexible server and elastic cluster |
| Maximum size | 1 TB | 32 TB on Premium SSD v1; 64 TB on Premium SSD v2 |
| Backup frequency | One backup per week | Daily and weekly schedules (1-day RPO) |
| Backup type | Full backups only | First backup is full; subsequent backups are incremental |
| Restore | Restore as files to a storage container, then import with native tools | Restore as server directly to a target flexible server or elastic cluster |
| Maximum retention | Up to 10 years | Up to 10 years |

## Key capabilities of Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

This feature includes the following key capabilities:

- **Vaulted, isolated long-term backups:** Takes snapshots in your tenant and streams backups to the Backup vault. This capability isolates the backup data from the source subscription and account. The vault protects the data with Azure role-based access control (RBAC), [soft delete](secure-by-default.md), and [Multi-user authorization](multi-user-authorization-concept.md) (if enabled).

- **WORM immutable backups:** Enables [immutability (WORM)](backup-azure-immutable-vault-concept.md) on the Backup vault to prevent any user (including a vault administrator) from altering, overwriting, or deleting recovery points before their retention period expires. This protection helps safeguard your backups against ransomware and accidental or malicious deletion and supports WORM compliance requirements.

- **Flexible backup policies:** Supports **daily** or **weekly** scheduled backups and on-demand backups after you configure protection. You can set independent retention periods for daily, weekly, monthly, and yearly recovery points, ranging from **7 days to 10 years**. 

- **Incremental data movement:** Transfers the full disk data during the first backup and only the changed data blocks in subsequent backups, making backups efficient for multi-terabyte servers. If the previous snapshot is unavailable, Azure Backup automatically starts the initial replication again without any user intervention.

<!-- - **Transactionally consistent, application-safe backups:** Both the data files and the active write-ahead log (WAL) reside on the managed disk, so the disk snapshot captures a consistent image. During restore, the WAL contained in the snapshot is replayed to bring the server to a transactionally consistent point. No application-side quiescing is needed and there's no need to offload the backup to a separate point-in-time-restored server, as v1 does.-->

- **Restore as Server:** Restores a recovery point directly to a pre-created target PostgreSQL flexible server or elastic cluster. The restore doesn't require an intermediate storage account or a manual `pg_restore` operation.

- **Centralized backup management:** Provides a centralized experience through Resiliency in Azure to view and manage backup and restore jobs, protected items, alerts, and reports alongside other workloads protected by Azure Backup.

## Backup flow for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

The backup flow for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) works as follows: 

1. You grant the Backup vault's managed identity the required permissions on the source flexible server or elastic cluster. In the Azure portal, you can assign the missing roles inline during configuration.
2. You configure a backup policy that defines the schedule and the retention rules, and select the datasource to protect.
3. On each scheduled run, Azure Backup asks the PostgreSQL resource provider to create a managed disk snapshot of the server's disks and waits for the snapshot to fully hydrate.
4. Azure Backup obtains time-bound access to the current snapshot and to the previous snapshot, computes the difference between them, and moves only the difference into the Backup vault. The first backup has no previous snapshot, so it transfers the full contents.
5. Azure Backup marks the backup job as **Successful** when the snapshot data is copied to the vault. Recovery points are then retained and pruned as per the retention rules in the policy.

## Restore flow for Azure Database for PostgreSQL flexible server and elastic cluster vaulted backup (v2)

The restore flow for Azure Database for PostgreSQL flexible server or elastic cluster vaulted backup (v2) works as follows: 

1. You create the target Azure Database for PostgreSQL flexible server or elastic cluster where the backup needs to be restored. Azure Backup restores disk content onto an existing target; it doesn't create the target location automatically.
2. You select the recovery point in the Backup vault and choose the target. Azure Backup validates the target against the recovery point (that includes PostgreSQL major version, disk size, disk type, SKU tier, and network configuration) before triggering the restore operation.
3. Azure Backup writes the recovery point contents on the target server disks.
4. The PostgreSQL resource provider starts the restored server and the restored server becomes online in a transactionally consistent state. 

Because the restore writes a full disk image, the restore time scales with the size of the recovery point. For multiterabyte servers, plan for a recovery time objective measured in hours to days rather than minutes.

## Azure Backup authentication with the PostgreSQL server

The Azure Backup service connects to the source server through the PostgreSQL resource provider, using the Backup vault's managed identity. The vault's identity requires permissions on the source server for backup and on the target server for restore. When you configure protection or trigger a restore from the Azure portal, Azure Backup validates the permissions it needs and offers to assign the missing roles inline. If you don't have write access on the server, you can download a role assignment template and have a database administrator run it.

You can also use a user-assigned managed identity to grant permissions on the datasource and on the Backup vault.

Azure Backup uses managed identities to authenticate with your PostgreSQL server and requires the following permissions: 

| Identity type | Description |
|---|---|---|
| Backup vault managed identity | Grant the Backup vault’s managed identity the required permissions on the source server for backup and on the target server for restore. When you configure backup or restore, Azure Backup validates the required permissions and lets you assign any missing roles. |
| User-assigned managed identity | Use a user-assigned managed identity to grant the required permissions on the data source and the Backup vault. |

## Customer-managed key support

Azure Backup supports servers encrypted with a customer-managed key (CMK). Azure Backup reads snapshot data in decrypted form and stores it in the vault encrypted at rest, either with a platform-managed key or with the CMK you configure on the Backup vault. During restore, the data is written to the target server's disk and re-encrypted at rest with that server's key. If you need data to be protected with your own key end-to-end, configure a CMK on the source server, on the target server, and on the Backup vault.

## Migrate from v1 to v2 experience

You can move an existing v1 protected item to v2 and continue to use the same backup policy and Backup vault. The protected item remains unchanged, and your existing v1 recovery points remain available.

> [!IMPORTANT]
> The move to v2 is one-way. To return to v1, you must stop protection and delete the backup instance before configuring backup again by using v1. 

Before you migrate a protected item to v2, ensure that you meet the following prerequisites: 

- **PostgreSQL version**: If your server runs PostgreSQL 14 or earlier, [upgrade it to PostgreSQL 15 or later](/azure/postgresql/configure-maintain/concepts-major-version-upgrade).
- **Compute tier**: If your server uses the Burstable compute tier, [scale it to General Purpose or Memory Optimized](/azure/postgresql/scale/how-to-scale-compute).

If the server doesn't meet these prerequisites, the move fails with a user error. 

After you move the protected item to v2, your existing v1 recovery points remain available. The restore method depends on the backup version used to create the recovery point: 
- For recovery points created with v1, use **Restore as Files**. 
- For recovery points created with v2, use **Restore as Server**. 

You can use the backup type shown for each recovery point to identify whether it belongs to v1 or v2. 

[Learn how to migrate an existing v1 protected item to v2 (preview)](backup-azure-postgresql-flex-server-elastic-cluster-v2-migrate.md). 

## Understand pricing for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)

Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) incurs the following charges:

- **Protected instance fee**: charged per protected instance based on the size of the datasource, on a per-unit basis.
- **Backup storage fee**: charged on the total data stored in the vault, based on the redundancy configured on the Backup vault.

To learn more about pricing, including applicable charges and billing details, see the [pricing page](https://azure.microsoft.com/pricing/details/backup/).

Because v2 supports daily backups for larger servers, your retention settings primarily determine the storage cost. You can retain daily recovery points for a few months and use weekly, monthly, and yearly recovery points for longer retention.

## Next steps

- [Support matrix for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2)](backup-azure-postgresql-flex-server-elastic-cluster-v2-support-matrix.md)
- [Tutorial for Azure PostgreSQL flexible server and elastic cluster vaulted backup (v2) using Azure portal](backup-azure-postgresql-flex-server-elastic-cluster-v2-tutorial.md)
- [Migrate backup instance from v1 to v2 solution](backup-azure-postgresql-flex-server-elastic-cluster-v2-migrate.md)
