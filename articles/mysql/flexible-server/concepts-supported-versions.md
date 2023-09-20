---
title: Supported versions - Azure Database for MySQL - Flexible Server
description: Learn which versions of the MySQL server are supported in the Azure Database for MySQL - Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd 
ms.author: sisawant
ms.custom: event-tier1-build-2022
ms.date: 05/24/2022
---

# Supported versions for Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible Server is powered by [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB engine.

MySQL uses the X.Y.Z naming scheme. X is the major version, Y is the minor version, and Z is the bug fix release. For more information about the scheme, see the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/which-version.html).

> [!NOTE]
> To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt.

Azure Database for MySQL currently supports the following versions:

## MySQL Version 5.7

Bug fix release: 5.7.40

Refer to the MySQL [release notes](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-40.html) to learn more about improvements and fixes in this version.

## MySQL Version 8

Bug fix release: 8.0.32

Refer to the MySQL [release notes](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-32.html) to learn more about improvements and fixes in this version.


The service performs automated patching of the underlying hardware, OS, and database engine. The patching includes security and software updates. For MySQL engine, minor version upgrades are also included as part of the planned maintenance release. Users can configure the patching schedule to be system managed or define their custom schedule. During the maintenance schedule, the patch is applied and server may require a restart as part of the patching process to complete the update. With the custom schedule, users can make their patching cycle predictable and choose a maintenance window with minimum impact to the business. In general, the service follows monthly release schedule as part of the continuous integration and release.


## Managing updates and upgrades
The service automatically manages patching for bug fix version updates. For example, 5.7.29 to 5.7.30.

## Next steps

> [!div class="nextstepaction"]
>[Build a PHP app on Windows with MySQL](../../app-service/tutorial-php-mysql-app.md)<br/>
>[Build PHP app on Linux with MySQL](../../app-service/tutorial-php-mysql-app.md?pivots=platform-linux%253fpivots%253dplatform-linux)<br/>
>[Build Java based Spring App with MySQL](/azure/developer/java/spring-framework/spring-app-service-e2e?tabs=bash)<br/>
