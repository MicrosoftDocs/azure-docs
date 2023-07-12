---
title: Supported versions - Azure Database for PostgreSQL - Single Server
description: Describes the supported Postgres major and minor versions in Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
ms.custom: fasttrack-edit
adobe-target: true
---

# Supported PostgreSQL major versions

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Please see [Azure Database for PostgreSQL versioning policy](concepts-version-policy.md) for support policy details.

Azure Database for PostgreSQL currently supports the following major versions:

## PostgreSQL version 11

The current minor release is 11.17. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/11/release-11-17.html) to learn more about improvements and fixes in this minor release.

## PostgreSQL version 10

The current minor release is 10.22. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/10/release-10-22.html) to learn more about improvements and fixes in this minor release.

## PostgreSQL version 9.6 (retired)

Aligning with Postgres community's [versioning policy](https://www.postgresql.org/support/versioning/), Azure Database for PostgreSQL has retired PostgreSQL version 9.6 as of November 11, 2021.  See [Azure Database for PostgreSQL versioning policy](concepts-version-policy.md) for more details and restrictions. If you're running this major version, upgrade to a higher version, preferably to PostgreSQL 11 at your earliest convenience.

## PostgreSQL version 9.5 (retired)

Aligning with Postgres community's [versioning policy](https://www.postgresql.org/support/versioning/), Azure Database for PostgreSQL has retired PostgreSQL version 9.5 as of February 11, 2021.  See [Azure Database for PostgreSQL versioning policy](concepts-version-policy.md) for more details and restrictions. If you're running this major version, upgrade to a higher version, preferably to PostgreSQL 11 at your earliest convenience.

## Managing upgrades

The PostgreSQL project regularly issues minor releases to fix reported bugs. Azure Database for PostgreSQL automatically patches servers with minor releases during the service's monthly deployments.

Automatic in-place upgrades for major versions are not supported. To upgrade to a higher major version, you can 
   * Use one of the methods documented in [major version upgrades using dump and restore](./how-to-upgrade-using-dump-and-restore.md).
   * Use [pg_dump and pg_restore](./how-to-migrate-using-dump-and-restore.md) to move a database to a server created with the new engine version.
   * Use [Azure Database Migration service](../../dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal.md) for doing online upgrades.

### Version syntax

Before PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number. For example, 9.5 to 9.6 was considered a _major_ version upgrade. As of version 10, only a change in the first number is considered a major version upgrade. For example, 10.0 to 10.1 is a _minor_ release upgrade. Version 10 to 11 is a _major_ version upgrade.

## Next steps

For information on supported PostgreSQL extensions, see [the extensions document](concepts-extensions.md).
