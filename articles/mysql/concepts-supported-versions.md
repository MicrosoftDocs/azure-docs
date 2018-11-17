---
title: Supported versions in Azure Database for MySQL
description: Describes the supported versions in Azure Database for MySQL.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.topic: article
ms.date: 10/10/2018
---
# Supported Azure Database for MySQL server versions
Azure Database for MySQL has been developed from [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB engine. Azure Database for MySQL currently supports the following versions:

## MySQL Version 5.6.39
Refer to the MySQL [documentation](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-39.html) to learn more about improvements and fixes in MySQL 5.6.39.

## MySQL Version 5.7.21
Refer to the MySQL [documentation](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-21.html) to learn about improvements and fixes in MySQL 5.7.21.

> [!NOTE]
> In the service, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt.

## Managing updates and upgrades
The service automatically manages patching for bug fix version updates. Currently, minor version upgrade is not supported. For example, upgrading from MySQL 5.6 to MySQL 5.7 is not supported. If you would like to upgrade to the next minor version, take a [dump and restore](./concepts-migrate-dump-restore.md) it to a server that was created with the new engine version.

## Next steps

For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)
