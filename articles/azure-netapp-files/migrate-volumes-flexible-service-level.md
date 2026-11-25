---
title: Migrate Azure NetApp Files volumes to the Flexible service level
description: Learn how to migrate Azure NetApp Files volumes from the Standard, Premium, or Ultra service level to the Flexible service level by choosing a data movement method, planning the migration, cutting over clients, and validating the result.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/30/2026
ms.author: anfdocs
# Customer intent: As a storage administrator, I want to migrate my Azure NetApp Files volumes to the Flexible service level, so that I can set capacity pool throughput independently of pool size with minimal downtime.
---
# Migrate Azure NetApp Files volumes to the Flexible service level

The Flexible service level lets you set capacity pool throughput independently of pool size by using manual quality of service (QoS). You can't convert a Standard, Premium, or Ultra capacity pool to Flexible, and you can't move a volume into a Flexible capacity pool. Instead, you migrate by creating a new Flexible capacity pool and copying data into new volumes in that pool.

This article describes the ways to copy data from Standard, Premium, and Ultra volumes to new volumes in a Flexible capacity pool. It explains how to choose a data movement method, plan the migration, cut over clients, and validate the result.

## Supported source service levels

This guidance applies to volumes in capacity pools that use the following service levels:

* **Standard**: Up to 16 MiB/s of throughput per TiB of provisioned capacity
* **Premium**: Up to 64 MiB/s of throughput per TiB of provisioned capacity
* **Ultra**: Up to 128 MiB/s of throughput per TiB of provisioned capacity

In a Flexible capacity pool, you set the pool throughput separately from the pool size. The minimum throughput for a Flexible capacity pool is 128 MiB/s, regardless of the pool quota. The maximum throughput is 5 × 128 MiB/s per TiB, multiplied by the pool size in TiB.

For example, a 100-TiB Ultra capacity pool provides 12,800 MiB/s of throughput. You can set the throughput of a 100-TiB Flexible capacity pool to any value from 128 MiB/s to 64,000 MiB/s. For more information, see [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md).

## Migration methods

Because you can't move a volume into a Flexible capacity pool, every migration method creates a new volume in a Flexible capacity pool and copies data into it. The new volume has a new resource ID, file path, and mount target. The methods differ in how they copy the data and in how long clients wait before they can use the new volume.

> [!TIP]
> Transfer rates depend on your environment. Migrate one pilot volume first, record the actual elapsed time, and use that measurement to plan each wave instead of relying on estimates.

The following table compares the methods that use Azure NetApp Files features or host-based copy tools. For database volumes, you can also use application-level tools, as described in [Migrate by using application-level tools](#migrate-by-using-application-level-tools).

| Method | How data is copied | Timing and client access | Best fit |
| --- | --- | --- | --- |
| Snapshot restore to a new volume | Restores a snapshot of the source volume to a new volume. NFS and SMB clients can use the new volume immediately while the restore finishes in the background. The new volume includes only the snapshot you use for the restore. | The volume is available in minutes. Full hydration takes minutes to hours, depending on snapshot size. Run only one restore-snapshot-to-new-volume operation at a time. | Low-downtime default for most volumes. |
| Cross-zone or cross-region replication, then break the relationship | Transfers a baseline copy while the source volume stays online. Incremental transfers keep the remaining changes small. The destination volume includes the source volume's snapshots. | Baseline time depends on dataset size and available bandwidth. Cutover includes only the final incremental transfer and the break. | Large or busy volumes where the bulk copy should finish days before cutover. |
| Backup restore to a new volume | Restores an Azure NetApp Files backup to a new volume in a different capacity pool within the same NetApp account. | Clients can't mount the new volume until the restore finishes. Restores of volumes larger than 10 TiB can take multiple hours, and concurrent restores increase the time of each restore. | Volumes where snapshot restore and replication aren't viable. |
| Host-based copy (robocopy, rsync, or NetApp Data Migrator) | Copies files from a client host in multiple passes. The final pass copies the remaining changes during the outage window. | Longest run time. Duration scales with file count more than with capacity. | SMB environments with complex ACLs, or when you need to reorganize files during the move. |
| Application-level tools, such as SAP HANA System Replication (HSR), Oracle Data Guard, or SQL Server Always On availability groups | The application team owns data consistency and cutover. | Varies by database. | Mission-critical database volumes with an existing, proven runbook. |

## Choose a migration method

Use the following guidance to select a method for each volume or migration wave:

* Use snapshot restore to a new volume as the low-downtime default. Clients can use the new volume while the restore finishes in the background.
* Use cross-zone or cross-region replication for large or busy volumes. Complete the baseline transfer days before cutover so that only the final incremental transfer occurs in the outage window.
* Use backup restore only when snapshot restore and replication aren't viable. The new volume stays offline until the restore finishes.
* Use a host-based copy tool for SMB environments with complex ACLs, or when you need to reorganize files during the move.
* Use application-level tools for mission-critical SAP HANA or Oracle database volumes that already have a proven runbook.

## Plan the migration

Confirm regional capacity before you start any other migration work.

> [!IMPORTANT]
> Source and target volumes exist at the same time during the migration, so each region needs capacity for both the current footprint and the new Flexible capacity pools. The default regional capacity quota is 100 TiB per subscription, and you can increase it through a support request. Size the request for the full footprint that you're migrating, on top of current consumption. Include expected growth so that you don't need a second request during the migration. Submit the request and confirm availability well before the pilot. For more information, see [Regional capacity quota for Azure NetApp Files](regional-capacity-quota.md).

Run each wave of volumes through the following six phases:

1. **Confirm regional capacity.** Verify that the subscription has enough regional capacity quota.
1. **Assess.** Inventory the source volumes and their dependencies. For the information to collect, see [Gather planning information](#gather-planning-information).
1. **Size the target.** Create a new Flexible capacity pool. Set the pool throughput from measured demand rather than from the throughput ceiling of the previous service level.

    > [!NOTE]
    > You don't need to assign the full target throughput when you create the Flexible capacity pool. You can increase pool throughput at any time, so you can start with what the migration needs and increase it before cutover. You can decrease throughput only after a 24-hour cooldown period, which restarts after any throughput change. The minimum throughput for a Flexible capacity pool is 128 MiB/s.

1. **Seed the data.** Copy the data to a new volume in the Flexible capacity pool by using one of the methods in this article.
1. **Cut over.** Stop or quiesce the application, run the final delta synchronization, remount or repoint clients, validate the data, and restart the application.
1. **Decommission.** Keep the source volume unmounted as a rollback path and validate for an agreed period. Then delete the source volume and reduce the size of the original capacity pool.

### Design decisions to settle first

* **Treat the capacity pool layout as permanent.** You can't move volumes in a Flexible capacity pool to another capacity pool, so map pool boundaries to chargeback, environment, and application boundaries from the start.
* **Set throughput from measured demand.** Don't base throughput on the ceiling of the previous service level. With manual QoS, you can assign from 1 MiB/s to 4,500 MiB/s to a regular volume and up to 12,800 MiB/s to a large volume.

### Gather planning information

Collect the following information to build a sized design and a wave plan:

* A volume inventory that includes name, region, protocol, quota, consumed capacity, current service level, capacity pool, network features (Basic or Standard), encryption type (single or double), and cool access state.
* The target region for each volume, so that you can confirm regional capacity on the subscription.
* 30 to 90 days of read and write throughput peaks for each volume.
* The existing snapshot, backup, and replication policies and topology.
* Application owners and available maintenance windows for each volume.
* The volumes that support SAP HANA, Oracle, Azure VMware Solution datastores, or general file shares.
* The target chargeback or showback model, which determines capacity pool boundaries.

## Prerequisites

> [!WARNING]
> Flexible service level capacity pools currently support only single encryption. If a source volume uses double encryption at rest, you can't migrate it to the Flexible service level as currently configured. Confirm the encryption type of every source volume before you plan migration waves.

Confirm the following requirements before you create the Flexible capacity pool and the target volumes.

| Prerequisite | Requirement | Applies to |
| --- | --- | --- |
| Flexible capacity pool | Create the target capacity pool with the Flexible service level. The Flexible service level is available only for manual QoS and only on newly created capacity pools. Setting a capacity pool to manual QoS is permanent: you can change an auto QoS pool to manual QoS, but not back. The minimum pool size is 1 TiB, in 1-TiB increments. | All methods |
| Single encryption | Flexible service level capacity pools currently support only single encryption. A volume that uses double encryption at rest can't move to the Flexible service level as currently configured. | All methods |
| NetApp account and regional capacity | You can restore backups only within the same NetApp account, so create the Flexible capacity pool in the same NetApp account as the source volume. Confirm regional capacity on the subscription before any other work begins. The default regional capacity quota is 100 TiB per subscription, and you can increase it through a support request. Source and target volumes consume capacity at the same time. | NetApp account: backup restore. Regional capacity: all methods. |

For more information about creating a Flexible capacity pool, see [Create a capacity pool for Azure NetApp Files](azure-netapp-files-set-up-capacity-pool.md) and [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md).

## Migrate by using snapshot restore

Snapshot restore creates a new volume from a snapshot of the source volume. NFS and SMB clients can use the new volume immediately while the restore operation completes in the background. Use this method as the low-downtime default for most volumes.

The new volume contains the data captured in the snapshot.

To migrate a volume by using snapshot restore:

1. Stop or quiesce the application that uses the source volume.
1. Create a snapshot of the source volume.
1. Restore the snapshot to a new volume in the Flexible capacity pool, then configure the required throughput for the new volume.
1. Mount the new volume on clients by using its new mount path.
1. After the restore completes, validate the new volume and data, update the client mount configurations as required, and restart the application.

For the full procedure, see [Restore a snapshot to a new volume using Azure NetApp Files](snapshots-restore-new-volume.md).

> [!IMPORTANT]
> Run only one restore-snapshot-to-new-volume operation at a time to avoid extensive restore times. Enable backup, snapshots, and replication on the new volume only after the restore completes. Azure NetApp Files suspends cross-region and cross-zone replication operations and blocks new ones while a snapshot restores to a new volume.

## Migrate by using cross-zone or cross-region replication

Replication transfers a baseline copy of the source volume to a destination volume while the source volume stays online. Incremental transfers then keep the remaining changes small, so the outage window includes only the final incremental transfer and the break of the replication relationship. Use this method for large or busy volumes when you want the bulk copy to finish days before cutover.

Failover is a manual process: you break the replication peering and then mount the destination volume. You can also use cross-zone replication within the same zone to create an independent volume copy.

> [!NOTE]
> Replication creates a replica of the source volume, including its snapshots, so existing snapshots carry over to the Flexible volume. The number and size of snapshots on the destination can differ from the source, because snapshot policies and replication schedules affect them. When you restore a snapshot to a new volume instead, the new volume includes only the snapshot you use for the restore (the base snapshot), unless you select **Delete base snapshot**.

To migrate a volume by using replication:

1. Create the destination volume in the Flexible capacity pool. If the source volume exceeds 95% utilization, add 20% extra capacity to the destination volume. You can reduce the size after the initial replication completes.
1. Configure cross-zone or cross-region replication from the source volume to the destination volume and let the baseline transfer complete.
1. At cutover, stop or quiesce the application and let the final incremental transfer complete.
1. Break the replication peering and then mount the destination volume on clients by using its new mount path.
1. Validate the data and then restart the application.

For more information, see [Requirements and considerations for Azure NetApp Files replication](replication-requirements.md).

## Migrate by restoring from backup

Backup restore creates a new volume from an Azure NetApp Files backup. You can restore a backup to a different capacity pool within the same NetApp account. Use this method only when snapshot restore and replication aren't viable.

Clients can't mount the new volume until the restore completes, so the volume stays offline for the duration of the restore. Plan for the following requirements:

* Set the quota of the new volume to at least 20% greater than the size of the backup.
* Restore a large volume to a new large volume, and a regular volume to a new regular volume. If you restore a backup larger than 83 TiB, the new volume might run out of capacity while it processes intermediate incremental backup data sets.
* Expect a restore of a volume larger than 10 TiB to take multiple hours. Concurrent restores increase the time that each restore takes, so sequence restores by priority.

For the full procedure, see [Restore a backup to a new volume](backup-restore-new-volume.md).

## Migrate by using a host-based copy tool

Host-based copy tools, such as robocopy, rsync, or NetApp Data Migrator, copy files from a client host to the new volume. Run multiple passes while the source volume stays online, and then run a final pass in the outage window to copy the remaining changes.

This method has the longest runtime, and its duration scales with file count more than with capacity. Use it for SMB environments with complex ACLs, or when you need to reorganize files during the move. File-based copy tools update the ctime (change time) timestamp of the copied files.

## Migrate by using application-level tools

For database volumes, you can use the application's own migration tools, such as SAP HANA backup and restore, SAP HANA System Replication (HSR), Oracle Recovery Manager (RMAN), or Oracle Data Guard. With this method, the application team owns data consistency and cutover, and timing varies by database. Use this method for mission-critical database volumes that already have a proven runbook.

## Cutover impact

Storage-side actions are fast. Creating the flexible capacity pool, creating the target volume, and breaking a replication relationship are control-plane operations that finish in minutes. Plan the outage window around the following changes:

* The outage window covers stopping the application, the final delta synchronization, remounting, validation, and restart. For NFS, it includes unmounting, updating `/etc/fstab` or automount maps, and remounting. For SMB, it includes changing the share path or DFS target.
* Run waves in parallel only where the copy method allows it. For example, run only one snapshot restore to a new volume at a time.
* The target volume has a new resource ID, file path, and mount target. Update any configuration that hardcodes the old path.
* Azure Monitor diagnostic settings don't carry over to the new volume. Create diagnostic settings on the target volume, and delete the diagnostic settings of the source volume before you delete the source volume. For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings).
* Activity logs and metrics history don't carry over. The new volume starts with new activity logs and metrics, so capture a performance baseline before you start.
* Source and target volumes coexist during the migration, so both consume capacity until you delete the source. Include this period in your cost planning.

## Minimize downtime

* **Migrate a pilot first.** Move one noncritical volume from end to end, time each step, and use the measurements to build the wave plan.
* **Move the bulk copy out of the outage window.** Use snapshot restore, which makes the volume usable immediately while it hydrates in the background, or use replication with a completed baseline. Only the final delta and the remount belong in the outage window.
* **Cut over behind an abstraction.** Use DFS Namespaces for SMB, or automount maps, symbolic links, or a DNS alias for NFS, so that clients don't need per-host changes.
* **Rebuild the surrounding configuration deliberately.** Include export policies, snapshot policies, backup policies, replication relationships, quota rules, diagnostic settings, role assignments, and Terraform or ARM templates and state.

## Data protection and recovery considerations

* Keep the source volume as the rollback path. Unmount it, but don't delete it, and keep it for an agreed validation period. Rollback then becomes a remount instead of a restore.
* Re-create snapshot policies, backup policies, and replication relationships on the target volume.
* Sequence backup restores by priority, because concurrent restores increase the time that each restore takes.

## Validate the migration

Before you release the application to users, validate the following items on the target volume:

* File and directory counts match the source volume.
* ACLs and UNIX permissions match the source volume.
* LDAP or Kerberos authentication behaves as expected.
* A throughput smoke test against the assigned manual QoS value meets the pre-migration baseline.

## Limitations

Plan for the following limitations when you migrate data to the Flexible service level.

| Limitation | Details | Applies to |
| --- | --- | --- |
| Volume moves | You can't move a volume into a Flexible capacity pool, and you can't convert a Standard, Premium, or Ultra capacity pool to the Flexible service level. You also can't move volumes in a Flexible capacity pool to another capacity pool. | All methods |
| Throughput changes | You can increase the throughput of a Flexible capacity pool at any time. You can decrease it only after a 24-hour cooldown period, which restarts after any change to the pool throughput. Start with the throughput that you need, and increase it as demand grows. | All methods |
| Resource limits | 1,000 volumes per capacity pool, 2,000 volumes per subscription, and 100 capacity pools per NetApp account. The maximum size of a regular volume is 100 TiB, and large volumes start at 50 TiB. | All methods |
| Large volume replication | Cross-zone replication supports large volumes only with an hourly or daily replication schedule. | Replication |
| Cool access | Cool access is available with the Standard, Premium, Ultra, and Flexible service levels, and cool access pricing is calculated the same way for all four. You can't restore a snapshot of a volume without cool access to a volume with cool access, or the reverse. | Snapshot restore |

## Next steps

* [Create a capacity pool for Azure NetApp Files](azure-netapp-files-set-up-capacity-pool.md)
* [Manage a manual QoS capacity pool for Azure NetApp Files](manage-manual-qos-capacity-pool.md)
* [Restore a snapshot to a new volume using Azure NetApp Files](snapshots-restore-new-volume.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Requirements and considerations for Azure NetApp Files replication](replication-requirements.md)

## Related content

* [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
* [Dynamically change the service level of an Azure NetApp Files volume](dynamic-change-volume-service-level.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Regional capacity quota for Azure NetApp Files](regional-capacity-quota.md)
* [Requirements and considerations for Azure NetApp Files large volumes](large-volumes-requirements-considerations.md)
* [Manage Azure NetApp Files storage with cool access](manage-cool-access.md)
* [Data migration and protection FAQs for Azure NetApp Files](faq-data-migration-protection.md)
* [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings)
