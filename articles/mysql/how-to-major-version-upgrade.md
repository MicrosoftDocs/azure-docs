---
title: Major version upgrade - Azure portal - Azure Database for MySQL - Single Server
description: This article describes how you can upgrade major version for Azure Database for MySQL - Single Server using Azure portal
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 11/16/2020
---
# Major version upgrade in Azure Database for MySQL Single Server using the Azure portal

> [!IMPORTANT]
> Major version upgrade for Azure database for MySQL Single Server is in public preview.

This article describes how you can upgrade your MySQL major version in-place in Azure Database for MySQL single server.

This feature will enable customers to perform in-place upgrades of their MySQL 5.6 servers to MySQL 5.7 with a click of button without any data movement or the need of any application connection string changes.

> [!Note]
> * Major version upgrade is only available for major version upgrade from MySQL 5.6 to MySQL 5.7<br>
> * Major version upgrade is not supported on replica server yet.
> * The server will be unavailable throughout the upgrade operation. It is therefore recommended to perform upgrades during your planned maintenance window.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for MySQL Single Server](quickstart-create-mysql-server-database-using-azure-portal.md)

## Perform major version upgrade from MySQL 5.6 to MySQL 5.7

Follow these steps to perform major version upgrade for your Azure Database of MySQL 5.6 server

> [!IMPORTANT]
> We recommend to perform upgrade first on restored copy of the server rather than upgrading production directly. See [how to perform point-in-time restore](howto-restore-server-portal.md#point-in-time-restore). 

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.6 server.

2. From the **Overview** page, click the **Upgrade** button in the toolbar.

3. In the **Upgrade** section, select **OK** to upgrade Azure database for MySQL 5.6 server to 5.7 server.

    :::image type="content" source="./media/how-to-major-version-upgrade-portal/upgrade.png" alt-text="Azure Database for MySQL - overview - upgrade":::

4. A notification will confirm that upgrade is successful.

## Frequently asked questions

**1. When will this upgrade feature be GA as we have MySQL v5.6 in our production environment that we need to upgrade?**

The GA of this feature is planned before MySQL v5.6 retirement. However, the feature is production ready and fully supported by Azure so you should run it with confidence on your environment. As a recommended best practice, we strongly suggest you to run and test it first on a restored copy of the server so you can estimate the downtime during upgrade, and perform application compatibility test before you run it on production. For more information, see [how to perform point-in-time restore](howto-restore-server-portal.md#point-in-time-restore) to create a point in time copy of your server. 

**2. Will this cause downtime of the server and if so, how long?**

Yes, the server will be unavailable during the upgrade process so we recommend you perform this operation during your planned maintenance window. The estimated downtime depends on the database size, storage size provisioned (IOPs provisioned), and the number of tables on the database. The upgrade time is directly proportional to the number of tables on the server.The upgrades of Basic SKU servers are expected to take longer time as it is on standard storage platform. To estimate the downtime for your server environment, we recommend to first perform upgrade on restored copy of the server.  

**3. It is noted that it is not supported on replica server yet. What does that mean concrete?**

Currently, major version upgrade is not supported for replica server, which means you should not run it for servers involved in replication (either source or replica server). If you would like to test the upgrade of the servers involved in replication before we add the replica support for upgrade feature, we would recommend following steps:

1. During your planned maintenance, [stop replication and delete replica server](howto-read-replicas-portal.md) after capturing its name and all the configuration information (Firewall settings, server parameter configuration if it is different from source server).
2. Perform upgrade of the source server.
3. Provision a new read replica server with the same name and configuration settings captured in step 1. The new replica server will be on v5.7 automatically after the source server is upgraded to v5.7.

**4. What will happen if we do not choose to upgrade our MySQL v5.6 server before February 5, 2021?**

You can still continue running your MySQL v5.6 server as before. Azure **will never** perform force upgrade on your server. However, the restrictions documented in [Azure Database for MySQL versioning policy](concepts-version-policy.md) will apply.

## Next steps

Learn about [Azure Database for MySQL versioning policy](concepts-version-policy.md).
