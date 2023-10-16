---
title: Supported versions - Azure Database for MariaDB
description: Learn which versions of the MariaDB server are supported in the Azure Database for MariaDB service.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: conceptual
ms.date: 06/24/2022
---
# Supported Azure Database for MariaDB server versions

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Azure Database for MariaDB has been developed from the open-source [MariaDB Server](https://downloads.mariadb.org/), using the InnoDB engine.

MariaDB uses the X.Y.Z naming scheme. X is the major version, Y is the minor version, and Z is the patch version.

> [!NOTE]
> In the service, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MariaDB set in the gateway, not the actual version running on your MariaDB server instance. To determine the version of your MariaDB server instance, use the `SELECT VERSION();` command.

Azure Database for MariaDB currently supports the following version:

## MariaDB Version 10.2

Patch version: 10.2.32

Refer to the [MariaDB documentation](https://mariadb.com/kb/en/mariadb-10232-release-notes/) to learn more about improvements and fixes in this version.

## MariaDB Version 10.3

Patch version: 10.3.23

Refer to the [MariaDB documentation](https://mariadb.com/kb/en/mariadb-10323-release-notes/) to learn more about improvements and fixes in this version.

The community support for MariaDB version 10.3 is ending on 25 May 2023. To avoid any disruption, we're  **extending the support for MariaDB version 10.3 on Azure Database for MariaDB until September 2025** to ensure business continuity. The extended support for MariaDB v10.3 includes:

* Monthly updates and fixes to address underlying infrastructure, OS, and service level issues on version 10.3 for Azure Database for MariaDB.
* Any critical fixes for the MariaDB engine or service required to maintain the availability, reliability, and security of the service.
* You are able to create new MariaDB servers with version 10.3 until further notice.
* You are able to perform point-in-time restores and create read replicas for your existing MariaDB servers until September 2025.

There won't be any new minor version releases, new engine features, or fixes in Azure Database for MariaDB that don't pertain to the server availability or security, after 25 May 2023.

## Managing updates and upgrades

The service automatically manages upgrades for patch updates. For example, 10.2.21 to 10.2.23.

Currently, minor and major version upgrades aren't supported. For example, upgrading from MariaDB 10.2 to MariaDB 10.3 isn't supported. If you'd like to upgrade from 10.2 to 10.3, take a [dump and restore](./howto-migrate-dump-restore.md) it to a server that was created with the new engine version.

## Next steps

- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md).
