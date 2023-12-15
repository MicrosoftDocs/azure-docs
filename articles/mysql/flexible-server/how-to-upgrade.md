---
title: Azure Database for MySQL - flexible server - major version upgrade
description: Learn how to upgrade major version for an Azure Database for MySQL - Flexible server.
ms.service: mysql
ms.subservice: flexible-server
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: how-to
author: code-sidd
ms.author: sisawant
ms.reviewer: maghan
ms.date: 10/12/2022
---

# Major version upgrade in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

>[!Note]
> This article contains references to the term slave, a term that Microsoft no longer uses. When the term is removed from the software, we will remove it from this article.

This article describes how you can upgrade your MySQL major version in-place in Azure Database for MySQL - Flexible server.
This feature enables customers to perform in-place upgrades of their MySQL 5.7 servers to MySQL 8.0 without any data movement or the need to make any application connection string changes.

>[!Important]
> - Major version upgrade is currently unavailable for version 5.7 servers based on the Burstable SKU.
> - Duration of downtime varies based on the size of the database instance and the number of tables it contains.
> - When initiating a major version upgrade for Azure MySQL via Rest API or SDK, please avoid modifying other properties of the service in the same request. The simultaneous changes are not permitted and may lead to unintended results or request failure. Please conduct property modifications in separate operations post-upgrade completion.
> - Upgrading the major MySQL version is irreversible. Your deployment might fail if validation identifies that the server is configured with any features that are [removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals) or [deprecated](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-deprecations). You can make necessary configuration changes on the server and try upgrade again.

## Prerequisites

-	Read Replicas with MySQL version 5.7 should be upgraded before Primary Server for replication to be compatible between different MySQL versions, read more on [Replication Compatibility between MySQL versions](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-compatibility.html).
- Before you upgrade your production servers, we **strongly recommend** you use the official Oracle [MySQL Upgrade checker tool](https://go.microsoft.com/fwlink/?linkid=2230525) to test your database schema compatibility and perform necessary regression test to verify application compatibility with features [removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals)/[deprecated](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-deprecations) in the new MySQL version.
- Trigger [on-demand backup](./how-to-trigger-on-demand-backup.md) before you perform major version upgrade on your production server, which can be used to [rollback to version 5.7](./how-to-restore-server-portal.md) from the full on-demand backup taken.


## Perform a Planned major version upgrade from MySQL 5.7 to MySQL 8.0 using the Azure portal

To perform a major version upgrade of an Azure Database for MySQL 5.7 server using the Azure portal, perform the following steps.

1.	In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.7 server.
    >[!Important]
    > We recommend performing upgrade first on restored copy of the server rather than upgrading production directly. See [how to perform point-in-time restore](./how-to-restore-server-portal.md).

2.	On the **Overview** page, in the toolbar, select **Upgrade**.

    >[!Important]
    > Before upgrading visit link for list of [features removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals) in MySQL 8.0.
    > Verify deprecated [sql_mode](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_mode) values and remove/deselect them from your current Flexible Server 5.7 using Server Parameters Blade on your Azure Portal to avoid deployment failure.
    > [sql_mode](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_mode) with values NO_AUTO_CREATE_USER, NO_FIELD_OPTIONS, NO_KEY_OPTIONS and NO_TABLE_OPTIONS are no longer supported in MySQL 8.0.

    :::image type="content" source="./media/how-to-upgrade/1-how-to-upgrade.png" alt-text="Screenshot showing Azure Database for MySQL Upgrade.":::

3.	In the **Upgrade** sidebar, in the **MySQL version to upgrade** text box, verify the major MySQL version you want to upgrade to, i.e., 8.0.

    :::image type="content" source="./media/how-to-upgrade/2-how-to-upgrade.png" alt-text="Screenshot showing Upgrade.":::

    Before you can upgrade your primary server, you first need to have upgraded any associated read replica servers. Until this is completed, **Upgrade** will be disabled.

4.	On the primary server, select the confirmation message to verify that all replica servers have been upgraded, and then select **Upgrade**. 

    :::image type="content" source="./media/how-to-upgrade/4-how-to-upgrade.png" alt-text="Screenshot showing upgrade.":::

    On read replica and standalone servers, **Upgrade** is enabled by default.

## Perform a Planned major version upgrade from MySQL 5.7 to MySQL 8.0 using the Azure CLI

To perform a major version upgrade of an Azure Database for MySQL 5.7 server using the Azure CLI, perform the following steps.

1.	Install the [Azure CLI](/cli/azure/install-azure-cli) for Windows or use the [Azure CLI](../../cloud-shell/overview.md) in Azure Cloud Shell to run the upgrade commands.

    This upgrade requires version 2.40.0 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed. Run az version to find the version and dependent libraries that are installed. To upgrade to the latest version, run az upgrade.

2.	After you sign in, run the [az mysql server upgrade](/cli/azure/mysql/server#az-mysql-server-upgrade) command.

    ```azurecli
    az mysql flexible-server upgrade --name {your mysql server name} --resource-group {your resource group} --subscription {your subscription id} --version 8
    ```

3.	Under the confirmation prompt, type **y** to confirm or **n** to stop the upgrade process, and then press Enter.

## Perform a major version upgrade from MySQL 5.7 to MySQL 8.0 on a read replica server using the Azure portal

To perform a major version upgrade of an Azure Database for MySQL 5.7 server to MySQL 8.0 on a read replica using the Azure portal, perform the following steps.

1.	In the Azure portal, select your existing Azure Database for MySQL 5.7 read replica server.

2.	On the **Overview** page, in the toolbar, select **Upgrade**.

>[!Important]
> Before upgrading visit link for list of [features removed](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html#mysql-nutshell-removals) in MySQL 8.0.
>Verify deprecated [sql_mode](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_sql_mode) values and remove/deselect them from your current Flexible Server 5.7 using Server Parameters Blade on your Azure Portal to avoid deployment failure.

3.	In the **Upgrade** section, select **Upgrade** to upgrade an Azure Database for MySQL 5.7 read replica server to MySQL 8.0.

    A notification appears to confirm that upgrade is successful.

4.	On the **Overview** page, confirm that your Azure Database for MySQL read replica server is running version is 8.0.

5.	Now, go to your primary server and perform major version upgrade on it.

## Perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replicas

To perform a major version upgrade of an Azure Database for MySQL 5.7 server to MySQL 8.0 with minimal downtime using read replica servers, perform the following steps.

1.	In the Azure portal, select your existing Azure Database for MySQL 5.7.

2.	Create a [read replica](./how-to-read-replicas-portal.md) from your primary server.

3.	[Upgrade](#perform-a-planned-major-version-upgrade-from-mysql-57-to-mysql-80-using-the-azure-cli) your read replica to version 8.0.

4.	After you confirm that the replica server is running version 8.0, stop your application from connecting to your primary server.

5.	Check replication status to ensure that the replica has caught up with the primary so that all data is in sync and that no new operations are being performed on the primary.

6.	Confirm with the show slave status command on the replica server to view the replication status.

    ```azurecli
     SHOW SLAVE STATUS\G
    ```
    If the state of Slave_IO_Running and Slave_SQL_Running is **yes** and the value of Seconds_Behind_Master is **0**, replication is working well. Seconds_Behind_Master indicates how late the replica is. If the value isn't **0**, then the replica is still processing updates. After you confirm that the value of Seconds_Behind_Master is ****, it's safe to stop replication.

7.	Promote your read replica to primary by stopping replication.

8.	Set Server Parameter read_only to **0** (OFF) to start writing on promoted primary.

9.  Point your application to the new primary (former replica) which is running server 8.0. Each server has a unique connection string. Update your application to point to the (former) replica instead of the source.

>[!Note]
> This scenario only incur downtime during steps 4 through 7.

## Frequently asked questions

- **Will this cause downtime of the server and if so, how long?**

  To have minimal downtime during upgrades, follow the steps mentioned under - [Perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replicas](#perform-minimal-downtime-major-version-upgrade-from-mysql-57-to-mysql-80-using-read-replicas).
  The server will be unavailable during the upgrade process, so we recommend you perform this operation during your planned maintenance window. The estimated downtime depends on the database size, storage size provisioned (IOPs provisioned), and the number of tables on the database. The upgrade time is directly proportional to the number of tables on the server. To estimate the downtime for your server environment, we recommend to first perform upgrade on restored copy of the server.


- **What happens to my backups after upgrade?**

  All backups (automated/on-demand) taken before major version upgrade, when used for restoration will always restore to a server with older version (5.7).
  All the backups (automated/on-demand) taken after major version upgrade will restore to server with upgraded version (8.0). It's highly recommended to take on-demand backup before you perform the major version upgrade for an easy rollback.

- **I'm currently using Burstable SKU, does Microsoft plan to support major version upgrade for this SKU in the future?**
  
  Burstable SKU is not able to support major version upgrade due to the performance limitation of this SKU.Microsoft is still working on a way to make this SKU available for major version upgrade
  
  If you need to perform a major version upgrade on your Azure MySQL Flexible Server and are currently using Burstable SKU, one temporary solution would be to upgrade to General Purpose or Business Critical SKU, perform the upgrade, and then switch back to Burstable SKU.
  
  Please note that upgrading to a higher SKU may involve a change in pricing and may result in increased costs for your deployment. However, since the upgrade process is not expected to take a long time, the additional costs should not be significant.
    


## Next steps
- Learn more about [how to configure scheduled maintenance](./how-to-maintenance-portal.md) for your Azure Database for MySQL - Flexible Server.
- Learn about what's new in [MySQL version 8.0](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html).
