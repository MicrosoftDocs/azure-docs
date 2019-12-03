---
title: Supported versions - Azure Database for PostgreSQL - Single Server
description: Describes the supported Postgres major and minor versions in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 12/03/2019
ms.custom: fasttrack-edit
---
# Supported PostgreSQL major versions
Microsoft aims to support n-2 versions of the PostgreSQL engine in Azure Database for PostgreSQL - Single Server. The versions would be the current major version on Azure (n) and the two prior major versions (-2).

Azure Database for PostgreSQL currently supports the following major versions:

## PostgreSQL version 11
The current minor release is 11.5. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/11/static/release-11-5.html) to learn more about improvements and fixes in this minor release.

## PostgreSQL version 10
The current minor release is 10.10. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/10/static/release-10-10.html) to learn more about improvements and fixes in this minor release.

## PostgreSQL version 9.6
The current minor release is 9.6.15. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/release-9-6-15.html) to learn more about improvements and fixes in this minor release.

## PostgreSQL version 9.5
The current minor release is 9.5.19. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/9.5/static/release-9-5-19.html) to learn about improvements and fixes in this minor release.

## Managing upgrades
The PostgreSQL project regularly issues minor releases to fix reported bugs. Azure Database for PostgreSQL automatically patches servers with minor releases during the service's monthly deployments. 

Automatic major version upgrade is not supported. For example, there is not an automatic upgrade from PostgreSQL 9.5 to PostgreSQL 9.6. To upgrade to the next major version, create a [database dump and restore](./howto-migrate-using-dump-and-restore.md) to a server that was created with the new engine version.

### Version syntax
Before PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number. For example, 9.5 to 9.6 was considered a _major_ version upgrade. As of version 10, only a change in the first number is considered a major version upgrade. For example, 10.0 to 10.1 is a _minor_ release upgrade. Version 10 to 11 is a _major_ version upgrade.

## Next steps
For information on supported PostgreSQL extensions, see [the extensions document](concepts-extensions.md).
