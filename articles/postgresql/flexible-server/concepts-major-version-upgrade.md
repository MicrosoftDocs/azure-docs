---
title: Major Version Upgrade  - Azure Database for PostgreSQL - Flexible Server 
description: Learn about the concepts of in-place major version upgrade with Azure Database for PostgreSQL - Flexible Server
author: kabharati
ms.author: kabharati
ms.reviewer: rajsell
ms.date: 02/08/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: references_regions
ms.topic: conceptual
---

# Major Version Upgrade for PostgreSQL Flexible Server 

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

> [!NOTE]


## Overview

Azure Database for PostgreSQL Flexible Server supports PostgreSQL versions 11, 12, 13, 14 and 15. Postgres community releases a new major version containing new features about once a year. Additionally, major version receives periodic bug fixes in the form of minor releases. Minor version upgrades include changes that are backward-compatible with existing applications. Azure Database for PostgreSQL Flexible Server periodically updates the minor versions during customer’s maintenance window. Major version upgrades are more complicated than minor version upgrades as they can include internal changes and new features that may not be backward-compatible with existing applications. 

Azure Database for PostgreSQL Flexible Server Postgres has now introduced in-place major version upgrade feature that performs an in-place upgrade of the server with just a click. In-place major version upgrade simplifies the upgrade process minimizing the disruption to users and applications accessing the server. In-place upgrades are a simpler way to upgrade the major version of the instance, as they retain the server name and other settings of the current server after the upgrade, and don't require data migration or changes to the application connection strings. In-place upgrades are faster and involve shorter downtime than data migration. 


## Process

Here are some of the important considerations with in-place major version upgrade. 

- During in-place major version upgrade process,  Flexible Server runs a pre-check procedure to identify any potential issues that might cause the upgrade to fail. If the pre-check finds any incompatibilities, it creates a log event showing that the upgrade pre-check failed, along with an error message. 

- If the pre-check is successful, then Flexible Server stops the service and takes an implicit backup just before starting the upgrade. This backup can be used to restore the database instance to its previous version if there's an upgrade error. 

- Flexible Server uses  **pg_upgrade** utility to perform in-place major version upgrades and  provides the flexibility to skip versions and upgrade directly to higher versions. 

-	During an in-place major version upgrade of a High Availability (HA) enabled server, the service disables HA, performs the upgrade on the primary server, and then re-enables HA after the upgrade is complete. 

-	Most extensions are automatically upgraded to higher versions during an in-place major version upgrade, with some exceptions. Refer **limitations** section for more details. 

-	In-place major version upgrade process for Flexible Server automatically deploys the latest supported minor version. 

-	The process of performing an in-place major version upgrade is an offline operation that results in a brief period of downtime. Typically, the downtime is under 15 minutes, although the duration may vary depending on the number of system tables involved

-	Long-running transactions or high workload before the upgrade might increase the time taken to shut down the database and increase upgrade time. 

-	If an in-place major version upgrade fails, the service restores the server to its previous state using a backup taken as part of step 2.

-	Once the in-place major version upgrade is successful, there are no automated ways to revert to the earlier version. However, you can perform a Point-In-Time Recovery (PITR) to a time prior to the upgrade to restore the previous version of the database instance.

## Limitations:  

If in-place major version upgrade pre-check operations fail then it aborts with a detailed error message for all the below limitations.

- In-place major version upgrade currently doesn't support read replicas, so if you have a read replica enabled server, you need to delete the replica before performing the upgrade on the primary server. After the upgrade, you can recreate the replica. 

- In-place major version upgrade doesn't support certain extensions and there are some limitations to upgrading certain extensions. The extensions **Timescaledb**, **pgaudit**, **dblink**, **orafce** and **postgres_fdw** are unsupported for all PostgreSQL versions. 

-	Please ensure that the **PostGIS** extensions, installed within a specific schema, are included in your search_path server parameter. It is necessary to update this server parameter to encompass those schemas before proceeding with major version upgrade.

-	Servers configured with logical replication slots aren't supported. 





## How to Perform in-place major version upgrade: 

It's recommended to perform a dry run of the in-place major version upgrade in a non-production environment before upgrading the production server. It allows you to identify any application incompatibilities and validate that the upgrade completes successfully before upgrading the production environment. You can perform a Point-In-Time Recovery (PITR) of your production server and test the upgrade in the non-production environment. Addressing these issues before the production upgrade minimizes downtime and ensures a smooth upgrade process. 

**Steps**

1. You can perform in-place major version upgrade using Azure portal or CLI (command-line interface).  Click the **Upgrade** button in Overview blade.




  :::image type="content" source="media/concepts-major-version-upgrade/upgrade-tab.png" alt-text="Diagram of Upgrade tab to perform in-place major version upgrade.":::




2. You'll see an option to select the major version of your choice, you have an option to skip versions to directly upgrade to higher versions. Choose the version and click **Upgrade**. 




:::image type="content" source="media/concepts-major-version-upgrade/set-postgresql-version.png" alt-text="Diagram of PostgreSQL version to Upgrade.":::




3. During upgrade, users have to wait for the process to complete. You can resume accessing the server once the server is back online. 




:::image type="content" source="media/concepts-major-version-upgrade/deployment-progress.png" alt-text="Diagram of deployment progress for major version upgrade.":::






4. Once the upgrade is successful,you can expand the **Deployment details** tab and click **Operation details**  to see more information about upgrade process like duration, provisioning state etc. 






:::image type="content" source="media/concepts-major-version-upgrade/deployment-success.png" alt-text="Diagram of successful deployment of for major version upgrade.":::





5. You can click on the **Go to resource** tab to validate your upgrade. You notice that server name remained unchanged and PostgreSQL version upgraded to desired higher version with the latest minor version. 





:::image type="content" source="media/concepts-major-version-upgrade/upgrade-verification.png" alt-text="Diagram of Upgraded version to Flexible Server after major version upgrade.":::


## Post Upgrade

Run the **ANALYZE** operation to refresh the pg_statistic table. You should do this for every database on all your Flexible Server. Optimizer statistics aren't transferred during a major version upgrade, so you need to regenerate all statistics to avoid performance issues. Run the command without any parameters to generate statistics for all regular tables in the current database, as follows


```
ANALYZE VERBOSE
```
> [!NOTE]   
>
> The VERBOSE flag is optional, but using it shows you the progress. 

## Next steps

- Learn about [business continuity](./concepts-business-continuity.md).
- Learn about [zone-redundant high availability](./concepts-high-availability.md).
- Learn about [backup and recovery](./concepts-backup-restore.md).

