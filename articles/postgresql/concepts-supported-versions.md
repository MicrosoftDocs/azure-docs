---
title: Supported versions in Azure Database for PostgreSQL - Single Server
description: Describes the supported versions in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---
# Supported PostgreSQL database versions
Microsoft aims to support n-2 versions of the PostgreSQL engine in Azure Database for PostgreSQL - Single Server. The versions would be the current major version on Azure (n) and the two prior major versions (-2).

Azure Database for PostgreSQL currently supports the following versions:

## PostgreSQL Version 10.7
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/10/static/release-10-7.html) to learn more about improvements and fixes in this minor version.

## PostgreSQL Version 9.6.12
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/release-9-6-12.html) to learn more about improvements and fixes in this minor version.

## PostgreSQL Version 9.5.16
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.5/static/release-9-5-16.html) to learn about improvements and fixes in this minor version.

## Managing updates and upgrades
Azure Database for PostgreSQL automatically manages minor version patches. Currently, major version upgrade is not supported. For example, upgrading from PostgreSQL 9.5 to PostgreSQL 9.6 is not supported. If you would like to upgrade to the next major version, create a database [dump and restore](./howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

## Next steps
For information about the support of different PostgreSQL extensions, see [PostgreSQL Extensions](concepts-extensions.md).
