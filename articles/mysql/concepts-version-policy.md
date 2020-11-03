---
title: Versioning policy - Azure Database for MySQL - Single Server and Flexible Server (Preview)
description: Describes the policy around MySQL major and minor versions in Azure Database for MySQL
author: sr-msft
ms.author: srranga
ms.service: mysql
ms.topic: conceptual
ms.date: 11/03/2020
ms.custom: fasttrack-edit
---
# Azure Database for MySQL versioning policy

This page describes the Azure Database for MySQL versioning policy, and is applicable to Azure Database for MySQL - Single Server and Azure Database for MySQL - Flexible Server (Preview) deployment modes.

## Supported  MySQL versions

Azure Database for MySQL supports the following database versions.

| Version | Single Server | Flexible Server (Preview) |
| ----- | :------: | :----: |
| MySQL 8 | X |  | 
| MySQL 5.7 | X | X |
| MySQL 5.6| X |  |


## Major version support
Each major version of MySQL will be supported by Azure Database for MySQL from the date on which Azure begins supporting the version until the version is retired by the MySQL community, as provided in the [versioning policy](https://en.wikipedia.org/wiki/mysql).

## Minor version support
Azure Database for MySQL automatically performs minor version upgrades to the Azure preferred MySQL version as part of periodic maintenance. 

## Major version retirement policy
The table below provides the retirement details for MySQL major versions. The dates follow the [MySQL versioning policy](https://en.wikipedia.org/wiki/mysql).

| Version | What's New | Azure support start date | Retirement date|
| ----- | ----- | ------ | ----- |
| [MySQL 5.6](https://dev.mysql.com/doc/relnotes/mysql/5.6/)| [Features](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-49.html)  | March 20, 2018 | February, 2021
| [MySQL 5.7](https://dev.mysql.com/doc/relnotes/mysql/5.7/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-31.html) | March 20, 2018 | October, 2023
| [MySQL 8](https://mysqlserverteam.com/whats-new-in-mysql-8-0-generally-available/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html)) | December 11, 2019 | April, 2026


## Retired MySQL engine versions not supported in Azure MySQL

After the retirement date for each MySQL database version, if you continue running the retired version, note the following restrictions:
- As the community will not be releasing any further bug fixes or security fixes, Azure for MySQL will not patch the retired database engine for any bugs or security issues or otherwise take security measures with regard to the retired database engine. You may experience security vulnerabilities or other issues as a result. However, Azure will continue to perform periodic maintenance and patching for the host, OS, containers, and any other service-related components.
- If any support issue you may experience relates to the MySQL database, we will be unable to provide you with support. In such cases, you will have to upgrade your database in order for us to provide you with any support.
- You will not be able to create new database servers for the retired version. However, you will be able to perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Database for MySQL may only be available to supported database server versions.
- Uptime SLAs will apply solely to Azure Database for MySQL service-related issues and not to any downtime caused by database engine-related bugs.  
- In the event of a serious database security vulnerability identified in the retired database version, Azure may choose to automatically upgrade your database to a higher version.


## Next steps
- See Azure Database for MySQL - Single Server [supported versions](./concepts-supported-versions.md)
- See Azure Database for MySQL - Flexible Server (Preview) [supported versions](flexible-server/concepts-supported-versions.md)
- See MySQL [dump and restore](./concepts-migrate-dump-restore.md) to perform upgrades.
