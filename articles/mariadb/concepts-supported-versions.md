---
title: Supported versions in Azure Database for MariaDB
description: Describes the supported versions in Azure Database for MariaDB.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 06/11/2019
---
# Supported Azure Database for MariaDB server versions

Azure Database for MariaDB has been developed from the open source [MariaDB Server](https://downloads.mariadb.org/), using the InnoDB engine. Azure Database for MariaDB currently supports the following version:

## MariaDB Version 10.2

Refer to the [MariaDB documentation](https://mariadb.com/kb/en/library/mariadb-10223-release-notes/) to learn more about improvements and fixes in MariaDB 10.2.23.

## MariaDB Version 10.3

Refer to the [MariaDB documentation](https://mariadb.com/kb/en/library/mariadb-10314-release-notes/) to learn more about improvements and fixes in MariaDB 10.3.14.

> [!NOTE]
> In the service, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MariaDB set in the gateway, not the actual version running on your MariaDB server instance. To determine the version of your MariaDB server instance, use the `SELECT VERSION();` command at the MySQL prompt.

## Managing updates and upgrades

The service automatically manages patching for minor version updates.

## Next steps

- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md).
