---
title: Supported versions in Azure Database for MySQL
description: Describes the supported versions in Azure Database for MySQL.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 03/22/2018
---
# Supported Azure Database for MySQL server versions
Azure Database for MySQL has been developed from [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB engine.  Azure Database for MySQL currently supports the following versions:

## MySQL Version 5.6.38
Refer to the MySQL [documentation](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-38.html) to learn more about improvements and fixes in MySQL 5.6.38.

## MySQL Version 5.7.20
Refer to the MySQL [documentation](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-20.htmll) to learn about improvements and fixes in MySQL 5.7.20.

> [!NOTE]
> While Azure Database for MySQL currently supports MySQL server versions 5.6.38 and 5.7.20, after the connection is established, the MySQL server instance displays a hardcoded value (#define SERVER_VERSION "5.6.26.0") for the version, rather than the actual version. To determine the actual version running in the MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt or MySQL Workbench.

## Managing updates and upgrades
Azure Database for MySQL automatically manages patching for minor version updates. Major version upgrades, For example upgrading from MySQL 5.6 to MySQL 5.7, are  not supported.

## Next steps

For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)
