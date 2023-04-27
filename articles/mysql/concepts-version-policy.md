---
title: Version support policy - Azure Database for MySQL - Single Server and Flexible Server
description: Describes the policy around MySQL major and minor versions in Azure Database for MySQL
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 03/29/2023
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
ms.custom: fasttrack-edit
---

# Azure Database for MySQL version support policy

[!INCLUDE [applies-to-mysql-single-flexible-server](includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](includes/Azure-database-for-mysql-single-server-deprecation.md)]

This page describes the Azure Database for MySQL versioning policy and applies to Azure Database for MySQL - Single Server and Azure Database for MySQL - Flexible Server (Preview) deployment modes.

## Supported MySQL versions

Azure Database for MySQL has been developed from [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB storage engine. The service supports the community's current major versions, namely MySQL 5.6, 5.7, and 8.0. MySQL uses the X.Y.Z. naming scheme where X is the major version, Y is the minor version, and Z is the bug fix release. For more information about the scheme, see the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/which-version.html).

Azure Database for MySQL currently supports the following major and minor versions of MySQL:

| Version | [Single Server](single-server/overview.md)<br />Current minor version | [Flexible Server](flexible-server/overview.md)<br />Current minor version |
| :--- | :--- | :--- |
| MySQL Version 5.6 | [5.6.47](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-47.html)(Retired) | Not supported |
| MySQL Version 5.7 | [5.7.32](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-29.html) | [5.7.40](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-40.html) |
| MySQL Version 8.0 | [8.0.15](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-15.html) | [8.0.31](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-31.html) |

> [!NOTE]  
> In the Single Server deployment option, a gateway redirects the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt. If your application has a requirement to connect to a specific major version, say v5.7 or v8.0, you can do so by changing the port in your server connection string as explained in our documentation [here.](concepts-supported-versions.md#connect-to-a-gateway-node-that-is-running-a-specific-mysql-version)

> [!IMPORTANT]  
> MySQL v5.6 is retired on Single Server as of February 2021. Starting September 1st, 2021, you cannot create new v5.6 servers on Azure Database for MySQL - Single Server deployment option. However, you can perform point-in-time recoveries and create read replicas for your existing servers.

Read the version support policy for retired versions in [version support policy documentation.](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql)

## Major version support

Each major version of MySQL is supported by Azure Database for MySQL from the date Azure begins supporting the version until the version is retired by the MySQL community, as provided in the [versioning policy](https://www.mysql.com/support/eol-notice.html).

## Minor version support

Azure Database for MySQL automatically performs minor version upgrades to the Azure-preferred MySQL version as part of periodic maintenance.

## Major version retirement policy

The table below provides the retirement details for MySQL major versions. The dates follow the [MySQL versioning policy](https://www.mysql.com/support/eol-notice.html).

| Version | What's New | Azure support start date | Retirement date |
| --- | --- | --- | --- |
| [MySQL 5.6](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/)| [Features](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-49.html)  | March 20, 2018 | February 2021
| [MySQL 5.7](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-31.html) | March 20, 2018 | October 2023
| [MySQL 8](https://mysqlserverteam.com/whats-new-in-mysql-8-0-generally-available/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html)) | December 11, 2019 | April 2026

## Retired MySQL engine versions not supported in Azure Database for MySQL

After the retirement date for each MySQL database version, if you continue running the retired version, note the following restrictions:

- As the community won't release any further bug fixes or security fixes, Azure Database for MySQL won't patch the retired database engine for any bugs, or security issues or otherwise take security measures regarding the retired database engine. However, Azure continues performing periodic maintenance and patching for the host, OS, containers, and other service-related components.
- If any support issue you may experience relates to the MySQL database, we may be unable to support you. In such cases, you have to upgrade your database for us to provide you with any support.
- You won't be able to create new database servers for the retired version. However, you can perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Database for MySQL may only be available to supported database server versions.
- Uptime S.L.A.s apply solely to Azure Database for MySQL service-related issues and not to any downtime caused by database engine-related bugs.
- In the extreme event of a serious threat to the service caused by the MySQL database engine vulnerability identified in, the retired database version, Azure may choose to stop the compute node of your database server from securing the service first. You are asked to upgrade the server before bringing the server online. During the upgrade process, your data is always protected using automatic backups performed on the service, which can be used to restore to the older version if desired.

## Next steps

- See MySQL [dump and restore](single-server/concepts-migrate-dump-restore.md) to perform upgrades.
