---
title: Supported versions in Azure Database for MySQL
description: Describes the supported versions in Azure Database for MySQL.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 3/13/2019
---
# Supported Azure Database for MySQL server versions

Azure Database for MySQL has been developed from [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB engine.

MySQL uses the X.Y.Z naming scheme. X is the major version, Y is the minor version, and Z is the bug fix release. For more information about the scheme, see the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/which-version.html).

Azure Database for MySQL currently supports the following versions:

## MySQL Version 5.6

Bug fix release: 5.6.42

Refer to the MySQL [release notes](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-42.html) to learn more about improvements and fixes in MySQL 5.6.42.

## MySQL Version 5.7

Bug fix release: 5.7.24

Refer to the MySQL [release notes](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-24.html) to learn about improvements and fixes in MySQL 5.7.24.

> [!NOTE]
> In the service, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt.

## Managing updates and upgrades
The service automatically manages patching for bug fix version updates. For example, 5.7.20 to 5.7.21.  

Currently, minor and major version upgrades aren't supported. For example, upgrading from MySQL 5.6 to MySQL 5.7 isn't supported. If you'd like to upgrade from 5.6 to 5.7, take a [dump and restore](./concepts-migrate-dump-restore.md) it to a server that was created with the new engine version.

## Next steps

For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)
