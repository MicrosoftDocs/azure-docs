---
title: Supported versions in Azure Database for MariaDB
description: Describes the supported versions in Azure Database for MariaDB.
author: ajlam
ms.author: andrela
editor: jasonwhowell
services: mariadb
ms.service: mariadb
ms.topic: conceptual
ms.date: 09/24/2018
---
# Supported Azure Database for MariaDB server versions
Azure Database for MariaDB has been developed from the open source [MariaDB Server](https://downloads.mariadb.org/), using the InnoDB engine. Azure Database for MariaDB currently supports the following version:

## MariaDB Version 10.2.17
Refer to the [MariaDB documentation](https://downloads.mariadb.org/mariadb/10.2.17/) to learn more about improvements and fixes in MariaDB 10.2.17.

> [!NOTE]
> In the service, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MariaDB set in the gateway, not the actual version running on your MariaDB server instance. To determine the version of your MariaDB server instance, use the `SELECT VERSION();` command at the MySQL prompt.

## Managing updates and upgrades
The service automatically manages patching for minor version updates.

## Next steps
For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)