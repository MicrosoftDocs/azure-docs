---
title: Supported versions - Azure Database for MariaDB
description: Learn which versions of the MariaDB server are supported in the Azure Database for MariaDB service.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 6/3/2020
---
# Supported Azure Database for MariaDB server versions

Azure Database for MariaDB has been developed from the open-source [MariaDB Server](https://downloads.mariadb.org/), using the InnoDB engine.

MariaDB uses the X.Y.Z naming scheme. X is the major version, Y is the minor version, and Z is the patch version.

> [!NOTE]
> In the service, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MariaDB set in the gateway, not the actual version running on your MariaDB server instance. To determine the version of your MariaDB server instance, use the `SELECT VERSION();` command.

Azure Database for MariaDB currently supports the following version:

## MariaDB Version 10.2

Patch version: 10.2.31

Refer to the [MariaDB documentation](https://mariadb.com/kb/en/mariadb-10231-release-notes/) to learn more about improvements and fixes in this version.

## MariaDB Version 10.3

Patch version: 10.3.22

Refer to the [MariaDB documentation](https://mariadb.com/kb/en/mariadb-10322-release-notes/) to learn more about improvements and fixes in this version.

## Managing updates and upgrades
The service automatically manages upgrades for patch updates. For example, 10.2.21 to 10.2.23.  

Currently, minor and major version upgrades aren't supported. For example, upgrading from MariaDB 10.2 to MariaDB 10.3 isn't supported. If you'd like to upgrade from 10.2 to 10.3, take a [dump and restore](./howto-migrate-dump-restore.md) it to a server that was created with the new engine version.

## Next steps

- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md).
