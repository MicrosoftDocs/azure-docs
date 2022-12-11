---
title: Azure Database for MySQL - flexible server - major version upgrade
description: Learn how to upgrade major version for an Azure Database for MySQL - Flexible server.
ms.service: mysql
ms.subservice: flexible-server
ms.custom: ignite-2022
ms.topic: how-to
author: code-sidd
ms.author: sisawant
ms.reviewer: maghan
ms.date: 10/12/2022
---

# Major version upgrade in Azure Database for MySQL - Flexible Server (Preview)

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

>[!Note]
> This article contains references to the term slave, a term that Microsoft no longer uses. When the term is removed from the software, we will remove it from this article.

This article describes how you can upgrade your MySQL major version in-place in Azure Database for MySQL Flexible server.
This feature will enable customers to perform in-place upgrades of their MySQL 5.7 servers to MySQL 8.0 with a select of button without any data movement or the need of any application connection string changes.

>[!Important]
> - Major version upgrade for Azure database for MySQL Flexible Server is available in public preview.
> - Major version upgrade is currently not available for Burstable SKU 5.7 servers.
> - Duration of downtime will vary based on the size of your database instance and the number of tables on the database.
> - Upgrading major MySQL version is irreversible. Your deployment might fail if validation identifies the server is configured with any features that are [removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals) or [deprecated](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-deprecations). You can make necessary configuration changes on the server and try upgrade again

## Prerequisites

-	Read Replicas with MySQL version 5.7 should be upgraded before Primary Server for replication to be compatible between different MySQL versions, read more on [Replication Compatibility between MySQL versions](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-compatibility.html).
- Before you upgrade your production servers, we strongly recommend you to test your application compatibility and verify your database compatibility with features [removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals)/[deprecated](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-deprecations) in the new MySQL version.
- Trigger [on-demand backup](./how-to-trigger-on-demand-backup.md)  before you perform major version upgrade on your production server, which can be used to [rollback to version 5.7](./how-to-restore-server-portal.md) from the full on-demand backup taken.


## Perform Planned Major version upgrade from MySQL 5.7 to MySQL 8.0 using Azure portal

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.7 server.
    >[!Important]
    > We recommend performing upgrade first on restored copy of the server rather than upgrading production directly. See [how to perform point-in-time restore](./how-to-restore-server-portal.md).

2.	From the overview page, select the Upgrade button in the toolbar

    >[!Important]
    > Before upgrading visit link for list of [features removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals) in MySQL 8.0.
    > Verify deprecated [sql_mode](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_mode) values and remove/deselect them from your current Flexible Server 5.7 using Server Parameters Blade on your Azure Portal to avoid deployment failure.
    > [sql_mode](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_mode) with values NO_AUTO_CREATE_USER, NO_FIELD_OPTIONS, NO_KEY_OPTIONS and NO_TABLE_OPTIONS are no longer supported in MySQL 8.0.

    :::image type="content" source="./media/how-to-upgrade/1-how-to-upgrade.png" alt-text="Screenshot showing Azure Database for MySQL Upgrade.":::

3. In the Upgrade sidebar, verify Major Upgrade version to upgrade i.e 8.0.

    :::image type="content" source="./media/how-to-upgrade/2-how-to-upgrade.png" alt-text="Screenshot showing Upgrade.":::

4. For Primary Server, select on confirmation checkbox, to confirm that all your replica servers are upgraded before primary server. Once confirmed that all your replicas are upgraded, Upgrade button will be enabled. For your read-replicas and standalone servers, Upgrade button will be enabled by default.

    :::image type="content" source="./media/how-to-upgrade/3-how-to-upgrade.png" alt-text="Screenshot showing confirmation.":::

5.	Once Upgrade button is enabled, you can select on Upgrade button to proceed with deployment.

    :::image type="content" source="./media/how-to-upgrade/4-how-to-upgrade.png" alt-text="Screenshot showing upgrade.":::

## Perform Planned Major version upgrade from MySQL 5.7 to MySQL 8.0 using Azure CLI

Follow these steps to perform major version upgrade for your Azure Database of MySQL 5.7 server using Azure CLI.

1. Install [Azure CLI](/cli/azure/install-azure-cli) for Windows or use [Azure CLI](../../cloud-shell/overview.md) in Azure Cloud Shell to run the upgrade commands.

    This upgrade requires version 2.40.0 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed. Run az version to find the version and dependent libraries that are installed. To upgrade to the latest version, run az upgrade.

2. After you sign in, run the [az mysql server upgrade](/cli/azure/mysql/server#az-mysql-server-upgrade) command.

    ```azurecli
    az mysql server upgrade --name testsvr --resource-group testgroup --subscription MySubscription --version 8.0
    ```

3. Under confirmation prompt, type “y” for confirming or “n” to stop the upgrade process and enter.

## Perform major version upgrade from MySQL 5.7 to MySQL 8.0 on read replica using Azure portal

1. In the Azure portal, select your existing Azure Database for MySQL 5.7 read replica server.

2. From the Overview page, select the Upgrade button in the toolbar.
>[!Important]
> Before upgrading visit link for list of [features removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals) in MySQL 8.0.
>Verify deprecated [sql_mode](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_mode) values and remove/deselect them from your current Flexible Server 5.7 using Server Parameters Blade on your Azure Portal to avoid deployment failure.

3. In the Upgrade section, select Upgrade button to upgrade Azure database for MySQL 5.7 read replica server to 8.0 server.

4. A notification will confirm that upgrade is successful.

5. From the Overview page, confirm that your Azure database for MySQL read replica server version is 8.0.

6. Now go to your primary server and perform major version upgrade on it.

## Perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replicas

1.	In the Azure portal, select your existing Azure Database for MySQL 5.7.

2.	Create a [read replica](./how-to-read-replicas-portal.md) from your primary server.

3.	Upgrade your [read replica to version](#perform-planned-major-version-upgrade-from-mysql-57-to-mysql-80-using-azure-cli) 8.0.

4.	Once you confirm that the replica server is running on version 8.0, stop your application from connecting to your primary server.

5.	Check replication status, and make sure replica is all caught up with primary, so all the data is in sync and ensure there are no new operations performed in primary.
Confirm with the show slave status command on the replica server to view the replication status.

    ```azurecli
     SHOW SLAVE STATUS\G
    ```
    If the state of Slave_IO_Running and Slave_SQL_Running are "yes" and the value of Seconds_Behind_Master is "0", replication is working well. Seconds_Behind_Master indicates how late the replica is. If the value isn't "0", it means that the replica is processing updates. Once you confirm Seconds_Behind_Master is "0" it's safe to stop replication.

6.	Promote your read replica to primary by stopping replication.

7.	Set Server Parameter read_only to 0 that is, OFF to start writing on promoted primary.

    Point your application to the new primary (former replica) which is running server 8.0. Each server has a unique connection string. Update your application to point to the (former) replica instead of the source.

>[!Note]
> This scenario will have downtime during steps 4, 5 and 6 only.

## Frequently asked questions

- Will this cause downtime of the server and if so, how long?
  To have minimal downtime during upgrades, follow the steps mentioned under - [Perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replicas](#perform-minimal-downtime-major-version-upgrade-from-mysql-57-to-mysql-80-using-read-replicas).
  The server will be unavailable during the upgrade process, so we recommend you perform this operation during your planned maintenance window. The estimated downtime depends on the database size, storage size provisioned (IOPs provisioned), and the number of tables on the database. The upgrade time is directly proportional to the number of tables on the server. To estimate the downtime for your server environment, we recommend to first perform upgrade on restored copy of the server.


- When will this upgrade feature be GA?
  The GA of this feature will be planned by December 2022. However, the feature is production ready and fully supported by Azure so you should run it with confidence in your environment. As a recommended best practice, we strongly suggest you run and test it first on a restored copy of the server so you can estimate the downtime during upgrade, and perform application compatibility test before you run it on production.

- What happens to my backups after upgrade?
  All backups (automated/on-demand) taken before major version upgrade, when used for restoration will always restore to a server with older version (5.7).
  All the backups (automated/on-demand) taken after major version upgrade will restore to server with upgraded version (8.0). It's highly recommended to take on-demand backup before you perform the major version upgrade for an easy rollback.


## Next steps
- Learn more on [how to configure scheduled maintenance](./how-to-maintenance-portal.md) for your Azure Database for MySQL flexible server.
- Learn about what's new in [MySQL version 8.0](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html).
