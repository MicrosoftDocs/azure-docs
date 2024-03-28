---
title: Major version upgrade
description: Learn about the concepts of in-place major version upgrade with Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: rajsell
ms.date: 03/18/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: references_regions
ms.topic: conceptual
---

# Major version upgrade for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

Azure Database for PostgreSQL flexible server supports PostgreSQL versions 11, 12, 13, 14, 15, and 16. Postgres community releases a new major version containing new features about once a year. Additionally, major version receives periodic bug fixes in the form of minor releases. Minor version upgrades include changes that are backward-compatible with existing applications. Azure Database for PostgreSQL flexible server periodically updates the minor versions during customer’s maintenance window. Major version upgrades are more complicated than minor version upgrades as they can include internal changes and new features that may not be backward-compatible with existing applications. 

## Overview 

Azure Database for PostgreSQL flexible server has now introduced an in-place major version upgrade feature that performs an in-place upgrade of the server with just a click. In-place major version upgrade simplifies the upgrade process minimizing the disruption to users and applications accessing the server. In-place upgrades are a simpler way to upgrade the major version of the instance, as they retain the server name and other settings of the current server after the upgrade, and don't require data migration or changes to the application connection strings. In-place upgrades are faster and involve shorter downtime than data migration. 


## Process

Here are some of the important considerations with in-place major version upgrade. 

- During in-place major version upgrade process, Azure Database for PostgreSQL flexible server runs a pre-check procedure to identify any potential issues that might cause the upgrade to fail. If the pre-check finds any incompatibilities, it creates a log event showing that the upgrade pre-check failed, along with an error message. 

- If the pre-check is successful, then Azure Database for PostgreSQL flexible server stops the service and takes an implicit backup just before starting the upgrade. This backup can be used to restore the database instance to its previous version if there's an upgrade error. 

- Azure Database for PostgreSQL flexible server uses [pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html) utility to perform in-place major version upgrades and provides the flexibility to skip versions and upgrade directly to higher versions. 

-	During an in-place major version upgrade of a High Availability (HA) enabled server, the service disables HA, performs the upgrade on the primary server, and then re-enables HA after the upgrade is complete. 

-	Most extensions are automatically upgraded to higher versions during an in-place major version upgrade, with some exceptions. Refer **limitations** section for more details. 

-	In-place major version upgrade process for Azure Database for PostgreSQL flexible server automatically deploys the latest supported minor version. 

-	The process of performing an in-place major version upgrade is an offline operation that results in a brief period of downtime. Typically, the downtime is under 15 minutes, although the duration may vary depending on the number of system tables involved.

-	Long-running transactions or high workload before the upgrade might increase the time taken to shut down the database and increase upgrade time. 

-	If an in-place major version upgrade fails, the service restores the server to its previous state using a backup taken as part of second step described in this list.

-	Once the in-place major version upgrade is successful, there are no automated ways to revert to the earlier version. However, you can perform a Point-In-Time Recovery (PITR) to a time prior to the upgrade to restore the previous version of the database instance.

## Major Version Upgrade Logs 

Major Version Upgrade Logs (PG_Upgrade_Logs) provides direct access to detailed logs through the [Server Logs](./how-to-server-logs-portal.md). Here’s how to integrate `PG_Upgrade_Logs` into your upgrade process, ensuring a smoother and more transparent transition to new PostgreSQL versions.

You can configure your Major Version Upgrade Logs in the same way as [Server Logs](./how-to-server-logs-portal.md), above using the Server Parameters
* `logfiles.download_enable` ON to enable this feature.
* `logfiles.retention_days` to define logfile retention in days.

#### Setting Up PostgreSQL Version Upgrade Logs
- **Access via Azure portal or CLI**: To start utilizing the PG_Upgrade_Logs feature, you can configure and access the logs either through the Azure portal or by using the [Command Line Interface (CLI)](./how-to-server-logs-cli.md). This flexibility allows you to choose the method that best fits your workflow.
- **Server Logs UI**: Once set up, the upgrade logs will be accessible through the Server Logs UI, where you can monitor the progress and details of your PostgreSQL major version upgrades in real time. This provides a centralized location for viewing logs, making it easier to track and troubleshoot the upgrade process.

#### Utilizing Upgrade Logs for Troubleshooting

- **Insightful Diagnostics**: The PG_Upgrade_Logs feature provides valuable insights into the upgrade process, capturing detailed information about the operations performed and highlighting any errors or warnings that occur. This level of detail is instrumental in diagnosing and resolving issues that may arise during the upgrade, ensuring a smoother transition.
- **Streamlined Troubleshooting**: With direct access to these logs, you can quickly identify and address potential upgrade obstacles, reducing downtime and minimizing the impact on your operations. The logs serve as a crucial tool in your troubleshooting arsenal, enabling more efficient and effective problem resolution.

## Limitations  

If in-place major version upgrade pre-check operations fail, then the upgrade aborts with a detailed error message for all the below limitations.

- In-place major version upgrade currently doesn't support read replicas, so if you have a read replica enabled server, you need to delete the replica before performing the upgrade on the primary server. After the upgrade, you can recreate the replica.

- Azure Database for PostgreSQL - Flexible Server requires the ability to send and receive traffic to destination ports 5432, and 6432 within VNET where Flexible Server is deployed, as well as to Azure storage for log archival. If you configure Network Security Groups (NSG) to restrict traffic to or from your Flexible Server within its deployed subnet, make sure to allow traffic to destination ports 5432 and 6432 within the subnet and to Azure storage by using service tag **Azure Storage** as a destination.If network rules are not set up properly HA is not enabled automatically post a major version upgrade and you should manually enable HA. Modify your NSG rules to allow traffic for the destination ports and storage as requested above and enable a high availability feature on the server.

- In-place major version upgrade doesn't support certain extensions and there are some limitations to upgrading certain extensions. The extensions **Timescaledb**, **pgaudit**, **dblink**, **orafce**, **pg_partman**, and **postgres_fdw** are unsupported for all PostgreSQL versions. 

-	When upgrading servers with PostGIS extension installed, set the `search_path` server parameter to explicitly include the schemas of the PostGIS extension, extensions that depend on PostGIS, and extensions that serve as dependencies for the below extensions.
  **e.g postgis,postgis_raster,postgis_sfcgal,postgis_tiger_geocoder,postgis_topology,address_standardizer,address_standardizer_data_us,fuzzystrmatch (required for postgis_tiger_geocoder).**

-	Servers configured with logical replication slots aren't supported. 

- In-place major version upgrade doesn't yet support upgrading to version 16, our team is actively working on this feature.
 
## Next steps

- Learn about [perform major version upgrade](./how-to-perform-major-version-upgrade-portal.md).
- Learn about [zone-redundant high availability](./concepts-high-availability.md).
- Learn about [backup and recovery](./concepts-backup-restore.md).

