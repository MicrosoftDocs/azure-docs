---
title: Supported versions in Azure Database for PostgreSQL - Single Server
description: Describes the supported versions in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/11/2019
ms.custom: fasttrack-edit
---
# Supported PostgreSQL database versions
Microsoft aims to support n-2 versions of the PostgreSQL engine in Azure Database for PostgreSQL - Single Server. The versions would be the current major version on Azure (n) and the two prior major versions (-2).

Azure Database for PostgreSQL currently supports the following versions:

## PostgreSQL Version 11.2
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/11/static/release-11-2.html) to learn more about improvements and fixes in this minor version.

>[!NOTE]
> PostgreSQL version 11 is available in preview. Support for creation using the Azure portal is being rolled out and may not yet be available in your region. You can use the [Azure CLI](quickstart-create-server-database-azure-cli.md) to create a Postgres 11 server in any region. For example, `az postgres server create -g group -n server -u username -p password -l westeurope --sku-name GP_Gen5_2 --version 11`.

## PostgreSQL Version 10.7
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/10/static/release-10-7.html) to learn more about improvements and fixes in this minor version.

## PostgreSQL Version 9.6.12
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/release-9-6-12.html) to learn more about improvements and fixes in this minor version.

## PostgreSQL Version 9.5.16
Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.5/static/release-9-5-16.html) to learn about improvements and fixes in this minor version.

## Managing updates and upgrades
Azure Database for PostgreSQL automatically manages minor version patches. Currently, major version upgrade is not supported. For example, upgrading from PostgreSQL 9.5 to PostgreSQL 9.6 is not supported. If you would like to upgrade to the next major version, create a database [dump and restore](./howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

> Note that prior to PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number (for example, 9.5 to 9.6 was considered a _major_ version upgrade).
> As of version 10, only a change in the first number is considered a major version upgrade (for example, 10.0 to 10.1 is a _minor_ version upgrade, and 10 to 11 is a _major_ version upgrade).

## Next steps
For information about the support of different PostgreSQL extensions, see [PostgreSQL Extensions](concepts-extensions.md).
