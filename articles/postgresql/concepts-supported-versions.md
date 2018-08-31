---
title: Supported versions in Azure Database for PostgreSQL
description: Describes the supported versions in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 06/01/2018
---
# Supported PostgreSQL Database Versions
Microsoft aims to support n-2 versions of the PostgreSQL engine in the Azure Database for PostgreSQL service, meaning the currently released major version (n) and the two prior major versions (-2).

Azure Database for PostgreSQL currently supports the following versions:

## PostgreSQL Version 10.3
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/10/static/release-10-3.html) to learn more about improvements and fixes in PostgreSQL 10.3.

## PostgreSQL Version 9.6.7
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/release-9-6-7.html) to learn more about improvements and fixes in PostgreSQL 9.6.7.

## PostgreSQL Version 9.5.11
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.5/static/release-9-5-11.html) to learn about improvements and fixes in PostgreSQL 9.5.11.

## Managing updates and upgrades
Azure Database for PostgreSQL automatically manages patching for minor version updates. Currently, major version upgrade is not supported. For example, upgrading from PostgreSQL 9.5 to PostgreSQL 9.6 is not supported.

## Next steps
For information about the support of different PostgreSQL extensions, see [PostgreSQL Extensions](concepts-extensions.md).
