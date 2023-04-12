---
title: Major version upgrade in Azure Database for MySQL - Single Server
description: This article describes how you can upgrade major version for Azure Database for MySQL - Single Server 
ms.service: mysql
ms.subservice: single-server
author: code-sidd 
ms.author: sisawant
ms.topic: how-to
ms.date: 06/20/2022
---

# Major version upgrade in Azure Database for MySQL single server

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we will remove it from this article.

> [!IMPORTANT]
> Major version upgrade for Azure database for MySQL single server is in public preview.

This article describes how you can upgrade your MySQL major version in-place in Azure Database for MySQL single server.

This feature will enable customers to perform in-place upgrades of their MySQL 5.6 servers to MySQL 5.7 with a click of button without any data movement or the need of any application connection string changes.

> [!NOTE]
> * Major version upgrade is only available for major version upgrade from MySQL 5.6 to MySQL 5.7.
> * The server will be unavailable throughout the upgrade operation. It is therefore recommended to perform upgrades during your planned maintenance window. You can consider [performing minimal downtime major version upgrade from MySQL 5.6 to MySQL 5.7 using read replica.](#perform-minimal-downtime-major-version-upgrade-from-mysql-56-to-mysql-57-using-read-replicas)

## Perform major version upgrade from MySQL 5.6 to MySQL 5.7 using Azure portal

Follow these steps to perform major version upgrade for your Azure Database of MySQL 5.6 server using Azure portal

> [!IMPORTANT]
> We recommend to perform upgrade first on restored copy of the server rather than upgrading production directly. See [how to perform point-in-time restore](how-to-restore-server-portal.md#point-in-time-restore).

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.6 server.

2. From the **Overview** page, click the **Upgrade** button in the toolbar.

3. In the **Upgrade** section, select **OK** to upgrade Azure database for MySQL 5.6 server to 5.7 server.

   :::image type="content" source="./media/how-to-major-version-upgrade-portal/upgrade.png" alt-text="Azure Database for MySQL - overview - upgrade":::

4. A notification will confirm that upgrade is successful.


## Perform major version upgrade from MySQL 5.6 to MySQL 5.7 using Azure CLI

Follow these steps to perform major version upgrade for your Azure Database of MySQL 5.6 server using Azure CLI

> [!IMPORTANT]
> We recommend to perform upgrade first on restored copy of the server rather than upgrading production directly. See [how to perform point-in-time restore](how-to-restore-server-cli.md#server-point-in-time-restore).

1. Install [Azure CLI for Windows](/cli/azure/install-azure-cli) or use Azure CLI in [Azure Cloud Shell](../../cloud-shell/overview.md) to run the upgrade commands. 
 
   This upgrade requires version 2.16.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. Run az version to find the version and dependent libraries that are installed. To upgrade to the latest version, run az upgrade.

2. After you sign in, run the [az mysql server upgrade](/cli/azure/mysql/server#az-mysql-server-upgrade) command:

   ```azurecli
   az mysql server upgrade --name testsvr --resource-group testgroup --subscription MySubscription --target-server-version 5.7"
   ```
   
   The command prompt shows the "-Running" message. After this message is no longer displayed, the version upgrade is complete.

## Perform major version upgrade from MySQL 5.6 to MySQL 5.7 on read replica using Azure portal

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.6 read replica server.

2. From the **Overview** page, click the **Upgrade** button in the toolbar.

3. In the **Upgrade** section, select **OK** to upgrade Azure database for MySQL 5.6 read replica server to 5.7 server.

   :::image type="content" source="./media/how-to-major-version-upgrade-portal/upgrade.png" alt-text="Azure Database for MySQL - overview - upgrade":::

4. A notification will confirm that upgrade is successful.

5. From the **Overview** page, confirm that your Azure database for MySQL read replica server version is 5.7.

6. Now go to your primary server and [Perform major version upgrade](#perform-major-version-upgrade-from-mysql-56-to-mysql-57-using-azure-portal) on it.

## Perform minimal downtime major version upgrade from MySQL 5.6 to MySQL 5.7 using read replicas

You can perform minimal downtime major version upgrade from MySQL 5.6 to MySQL 5.7 by utilizing read replicas. The idea is to upgrade the read replica of your server to 5.7 first and later failover your application to point to read replica and make it a new primary.

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.6.

2. Create a [read replica](./concepts-read-replicas.md#create-a-replica) from your primary server.

3. [Upgrade your read replica](#perform-major-version-upgrade-from-mysql-56-to-mysql-57-on-read-replica-using-azure-portal) to version 5.7.

4. Once you confirm that the replica server is running on version 5.7, stop your application from connecting to your primary server.
 
5. Check replication status, and make sure replica is all caught up with primary so all the data is in sync and ensure there are no new operations performed in primary.

   Call the [`show slave status`](https://dev.mysql.com/doc/refman/5.7/en/show-slave-status.html) command on the replica server to view the replication status.

   ```sql
   SHOW SLAVE STATUS\G
   ```

   If the state of `Slave_IO_Running` and `Slave_SQL_Running` are "yes" and the value of `Seconds_Behind_Master` is "0", replication is working well. `Seconds_Behind_Master` indicates how late the replica is. If the value isn't "0", it means that the replica is processing updates. Once you confirm `Seconds_Behind_Master` is "0" it's safe to stop replication.

6. Promote your read replica to primary by [stopping replication](./how-to-read-replicas-portal.md#stop-replication-to-a-replica-server).

7. Point your application to the new primary (former replica) which is running server 5.7. Each server has a unique connection string. Update your application to point to the (former) replica instead of the source.

> [!NOTE]
> This scenario will have downtime during steps 4, 5 and 6 only.


## Frequently asked questions

### When will this upgrade feature be GA as we have MySQL v5.6 in our production environment that we need to upgrade?

The GA of this feature is planned before MySQL v5.6 retirement. However, the feature is production ready and fully supported by Azure so you should run it with confidence on your environment. As a recommended best practice, we strongly suggest you to run and test it first on a restored copy of the server so you can estimate the downtime during upgrade, and perform application compatibility test before you run it on production. For more information, see [how to perform point-in-time restore](how-to-restore-server-portal.md#point-in-time-restore) to create a point in time copy of your server. 

### Will this cause downtime of the server and if so, how long?

Yes, the server will be unavailable during the upgrade process so we recommend you perform this operation during your planned maintenance window. The estimated downtime depends on the database size, storage size provisioned (IOPs provisioned), and the number of tables on the database. The upgrade time is directly proportional to the number of tables on the server.The upgrades of Basic SKU servers are expected to take longer time as it is on standard storage platform. To estimate the downtime for your server environment, we recommend to first perform upgrade on restored copy of the server. Consider [performing minimal downtime major version upgrade from MySQL 5.6 to MySQL 5.7 using read replica.](#perform-minimal-downtime-major-version-upgrade-from-mysql-56-to-mysql-57-using-read-replicas)

### What happens if we do not choose to upgrade our MySQL v5.6 server before February 5, 2021?

You can still continue running your MySQL v5.6 server as before. Azure **will never** perform force upgrade on your server. However, the restrictions documented in [Azure Database for MySQL versioning policy](../concepts-version-policy.md) will apply.

## Next steps

Learn about [Azure Database for MySQL versioning policy](../concepts-version-policy.md).