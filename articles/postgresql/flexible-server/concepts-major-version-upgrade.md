---
title: Major version upgrades in Azure Database for PostgreSQL - Flexible Server
description: Learn how to use Azure Database for PostgreSQL - Flexible Server to do in-place major version upgrades of PostgreSQL on a server.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: rajsell, maghan
ms.date: 05/21/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - references_regions
---

# Major version upgrades in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

Azure Database for PostgreSQL flexible server supports PostgreSQL versions 16, 15, 14, 13, 12, and 11. The Postgres community releases a new major version that contains new features about once a year. Additionally, each major version receives periodic bug fixes in the form of minor releases. Minor version upgrades include changes that are backward compatible with existing applications. Azure Database for PostgreSQL flexible server periodically updates the minor versions during a customer's maintenance window.

Major version upgrades are more complicated than minor version upgrades. They can include internal changes and new features that might not be backward compatible with existing applications.

Azure Database for PostgreSQL flexible server has a feature that performs an in-place major version upgrade of the server with just a click. This feature simplifies the upgrade process by minimizing the disruption to users and applications that access the server.

In-place upgrades retain the server name and other settings of the current server after the upgrade of a major version. They don't require data migration or changes to the application connection strings. In-place upgrades are faster and involve shorter downtime than data migration.

## Process

Here are some of the important considerations with in-place major version upgrades:

- During the process of an in-place major version upgrade, Azure Database for PostgreSQL flexible server runs a pre-check procedure to identify any potential issues that might cause the upgrade to fail.

  If the pre-check finds any incompatibilities, it creates a log event that shows that the upgrade pre-check failed, along with an error message.

  If the pre-check is successful, Azure Database for PostgreSQL flexible server stops the service and takes an implicit backup just before starting the upgrade. The service can use this backup to restore the database instance to its previous version if there's an upgrade error.

- Azure Database for PostgreSQL flexible server uses the [pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html) tool to perform in-place major version upgrades. The service provides the flexibility to skip versions and upgrade directly to later versions.

- During an in-place major version upgrade of a server that's enabled for high availability (HA), the service disables HA, performs the upgrade on the primary server, and then re-enables HA after the upgrade is complete.

- Most extensions are automatically upgraded to later versions during an in-place major version upgrade, with [some exceptions](#limitations).

- The process of an in-place major version upgrade for Azure Database for PostgreSQL flexible server automatically deploys the latest supported minor version.

- An in-place major version upgrade is an offline operation that results in a brief period of downtime. The downtime is typically less than 15 minutes. The duration can vary, depending on the number of system tables involved.

- Long-running transactions or high workload before the upgrade might increase the time taken to shut down the database and increase upgrade time.

- After an in-place major version upgrade is successful, there are no automated ways to revert to the earlier version. However, you can perform a point-in-time recovery (PITR) to a time before the upgrade to restore the previous version of the database instance.

## Post upgrade/migrate

After the major version upgrade is complete, we recommend to run the `ANALYZE` command  in each database to refresh the `pg_statistic` table. Otherwise, you may run into performance issues.

```SQL
postgres=> analyze;
ANALYZE
```

## Major version upgrade logs

Major version upgrade logs (`PG_Upgrade_Logs`) provide direct access to detailed [server logs](./how-to-server-logs-portal.md). Integrating `PG_Upgrade_Logs` into your upgrade process can help ensure a smoother and more transparent transition to new PostgreSQL versions.

You can configure your major version upgrade logs in the same way as server logs, by using the following server parameters:

- To turn on the feature, set `logfiles.download_enable` to `ON`.
- To define the retention of log files in days, use `logfiles.retention_days`.

### Setup of upgrade logs

To start using `PG_Upgrade_Logs`, you can configure the logs through either the Azure portal or the [Azure CLI](./how-to-server-logs-cli.md). Choose the method that best fits your workflow.

You can access the upgrade logs through the UI for server logs. There, you can monitor the progress and details of your PostgreSQL major version upgrades in real time. This UI provides a centralized location for viewing logs, so you can more easily track and troubleshoot the upgrade process.

### Benefits of using upgrade logs

- **Insightful diagnostics**: `PG_Upgrade_Logs` provides valuable insights into the upgrade process. It captures detailed information about the operations performed, and it highlights any errors or warnings that occur. This level of detail is instrumental in diagnosing and resolving problems that might arise during the upgrade, for a smoother transition.
- **Streamlined troubleshooting**: With direct access to these logs, you can quickly identify and address potential upgrade obstacles, reduce downtime, and minimize the impact on your operations. The logs serve as a crucial troubleshooting tool by enabling more efficient and effective problem resolution.

## Limitations  

If pre-check operations fail for an in-place major version upgrade, the upgrade fails with a detailed error message for all the following limitations:

- In-place major version upgrades currently don't support read replicas. If you have a server that acts as a read replica, you need to delete the replica before you perform the upgrade on the primary server. After the upgrade, you can re-create the replica.

- Azure Database for PostgreSQL - Flexible Server requires the ability to send and receive traffic to destination ports 5432 and 6432 within the virtual network where the flexible server is deployed, and to Azure Storage for log archiving.

  If you configure network security groups (NSGs) to restrict traffic to or from your flexible server within its deployed subnet, be sure to allow traffic to destination ports 5432 and 6432 within the subnet. Allow traffic to Azure Storage by using the service tag **Azure Storage** as a destination.

  If network rules aren't set up properly, HA is not enabled automatically after a major version upgrade, and you should manually enable HA. Modify your NSG rules to allow traffic for the destination ports and storage, and to enable an HA feature on the server.

- In-place major version upgrades don't support certain extensions, and there are some limitations to upgrading certain extensions. The following extensions are unsupported for all PostgreSQL versions: `Timescaledb`, `pgaudit`, `dblink`, `orafce`, `pg_partman`, `postgres_fdw`.

- When you're upgrading servers with the PostGIS extension installed, set the `search_path` server parameter to explicitly include:
  
  - Schemas of the PostGIS extension.
  - Extensions that depend on PostGIS.
  - Extensions that serve as dependencies for the following extensions: `postgis`, `postgis_raster`, `postgis_sfcgal`, `postgis_tiger_geocoder`, `postgis_topology`, `address_standardizer`, `address_standardizer_data_us`, `fuzzystrmatch` (required for `postgis_tiger_geocoder`).

- Servers configured with logical replication slots aren't supported.

## Next steps

- Learn how to [perform a major version upgrade](./how-to-perform-major-version-upgrade-portal.md).
- Learn about [zone-redundant high availability](./concepts-high-availability.md).
- Learn about [backup and recovery](./concepts-backup-restore.md).
