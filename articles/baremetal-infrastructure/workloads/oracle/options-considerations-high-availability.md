---
title: Options or Oracle BareMetal Infrastructure servers
description: Learn about the options and considerations for Oracle BareMetal Infrastructure servers.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/15/2021
---

# Options for Oracle BareMetal Infrastructure servers

In this article, we'll consider options and recommendations to get the highest level of protection and performance running Oracle on BareMetal Infrastructure servers. 

## Data Guard protection modes

Data Guard offers protection unavailable solely through Oracle Real Applications Cluster (RAC), logical replication (such as GoldenGate), and storage-based replication. 

| Protection mode | Description |
| --- | --- |
| **Maximum Performance** | The default protection mode. It provides the highest level of protection without impacting the performance of the primary database. Data is considered committed as soon as it has been written to the primary database redo stream. It's then replicated to the standby database asynchronously. Generally, the standby database receives it within seconds, but no guarantee is given to that effect. This mode typically meets business requirements (alongside lag monitoring) without needing low latency network connectivity between the primary and standby sites.<br /><br />It provides the best operational persistence; however, it doesn't guarantee zero data loss.   |
| **Maximum Availability** | Provides the highest level of protection without impacting the primary database's availability. Data is never considered committed to the primary database until it has also been committed to at least one standby database. If the primary database can't write the redo changes to at least one standby database, it falls back to Maximum Performance mode rather than become unavailable. <br /><br />It allows the service to continue if the standby site is unavailable. If only one site is working, then only one copy of the data will be maintained until the second site is online and sync is re-established. |
| **Maximum Protection** | Provides a similar protection level to maximum availability. The primary database shuts down with the added feature if it can't write the redo changes to at least one standby database. This ensures that data loss can't occur, but at the expense of more fragile availability. |

>[!IMPORTANT]
>If you need a recovery point objective (RPO) of zero, we recommend the Maximum Availability configuration. Then RPO can be guaranteed even when multiple failures occur. For example, even in the case of a network outage from the primary database followed by the loss of the primary database sometime afterward while the network outage is still in effect.

### Data Guard deployment patterns

Oracle lets you configure multiple destinations for redo generation, allowing for multiple standby databases. The most common configuration is shown in the following figure, a single standby database in a different region.

:::image type="content" source="media/oracle-high-availability/default-data-guard-deployment.png" alt-text="Diagram showing Oracle's default Data Guard deployment.":::

Data Guard is configured in Maximum Performance mode for a default deployment. This configuration  provides near real-time data replication via asynchronous redo transport. The standby database doesn't need to run inside of a RAC deployment, but we recommend it meets the performance demands of the primary site.

We recommend a deployment like that shown in the following figure for environments that require strict uptime or an RPO of zero. The Maximum Availability configuration consists of a local standby database applying redo in synchronous mode and a second standby database running in a remote region.

:::image type="content" source="media/oracle-high-availability/max-availability-data-guard-deployment.png" alt-text="Diagram showing maximum availability Data Guard deployment.":::

You can create a local standby database when application performance will suffer by running the database and application servers in separate regions. In this configuration, a local standby database is used when planned or unplanned maintenance is needed on the primary cluster. You can run these databases with synchronous replication because they're in the same region, ensuring no data lost between them.

### Data Guard configuration considerations

The Data Guard Broker should be implemented, as it simplifies implementing a Data Guard configuration and ensures that best practices are adhered to. It provides performance monitoring functionality and greatly simplifies the switchover, failover, and reinstantiation procedures.

Data Guard allows you to run an observer process, which monitors all databases in a Data Guard configuration to determine database availability. If a primary database fails, the Data Guard Observer can automatically start a failover to a standby database in the configuration. You can implement the Data Guard Observer with multiple observers based on the number of physical sites (up to three). 

This observer should be located on the infrastructure that will support the application tier. The primary Observer should always exist on the physical site where the primary database is not located. We recommend caution in automating failover operations triggered by a Data Guard Observer. First be sure your applications are designed and tested to provide acceptable service when the database runs in a separate location.

If the application is only able to operate locally, failover to the secondary site must be manual. Environments that require high availability levels (99.99% or 99.999% uptime) should use both a local and remote standby database, as shown in the preceding figure. In these cases, the parameter FastStartFailoverTarget will only be set to the local standby database.

For all applications that support cross-site application/database access, FastStartFailoverTarget is set to all standby databases in the Data Guard configuration.

### Active Data Guard

Oracle Active Data Guard (ADG) is a superset of basic Data Guard capabilities included with Oracle Database Enterprise Edition. It provides the added following features, which will be used across the Oracle Exadata deployment:

- Unique corruption detection and automatic repair.
- Rapid failover to the synchronized replica of production – manual or automatic.
- Offload production workload to a synchronized standby open read-only.
- Database rolling upgrades and standby. First patching using physical standby.
- Offload incremental backups to standby.
- Zero data loss data recovery protection across any distance without impacting performance.

The white paper available at [https://www.oracle.com/technetwork/database/availability/dg-adg-technical-overview-wp-5347548.pdf](https://www.oracle.com/technetwork/database/availability/dg-adg-technical-overview-wp-5347548.pdf) provides a good overview of the preceding features as shown in the following figure.

:::image type="content" source="media/oracle-high-availability/active-data-guard-features.png" alt-text="Diagram showing an overview of Oracle's Active Data Guard features.":::

## Backup recommendations

Be sure to back up your databases. Use the restore and recover features to restore a database to the same or another system, or to recover database files.

It is important to create a backup recovery strategy to protect Oracle Database Appliance databases from data loss. Such loss could result from a physical problem with a disk that causes a failure of a read or write to a disk file required to run the database. User error can also cause data loss. The backup feature provides the ability to **point in time restore (PITR) restore the database, System Change Number (SCN) recovery, and latest recovery**. You can create a backup policy in the Browser User Interface or from the command-line interface.

The following backup options are available:

- Back up to NFS storage volume (Fast Recovery Area-FRA- /u98).
- Using Azure NetApp Files SnapCenter – snapshot.

Process to consider:

- Manual or automatic backups.
- Automatic backups are written to NFS storage volumes (for example, /u98).
- Backups run between 12:00 AM – 6:00 AM in the database system's time zone.
- Present retention periods: 7, 15, 30, 45, and 60 days.

- Recover database from a backup stored in Object storage:
  - To the last known good state with the least possible data loss.
  - Using timestamp specified.
  - Using the SCN specified.
  - BackupReport – _uses SCN from backup report instead of specified SCN_.

:::image type="content" source="media/oracle-high-availability/customer-db-backup-to-fra.png" alt-text="Diagram showing customer Database back up to FRA (/u98) and non-FRA (/u95).":::

### Backup policy

The backup policy defines the backup details. When you create a backup policy, you define the destination for database backups FRA (NFS location) and define the recovery window.

By default, the BASIC compression algorithm is used. When using LOW, MEDIUM, or HIGH compression algorithms for Disk or NFS backup policy, there are license considerations.

### Backup levels

Specify the backup level when you take a backup.

- Level 0 - Full
- Level 1 – Incremental
- LongTerm/ Archievelog - except for backup retention policy, use non-FRA location (for example, /u95).

## Next steps

Learn how to recover your Oracle database when a failure does occur:

> [!div class="nextstepaction"]
> [Recover your Oracle database on Azure BareMetal Infrastructure](oracle-high-availability-recovery.md)
