---
title: Supported versions
description: Describes the supported PostgreSQL major and minor versions in Azure Database for PostgreSQL - Flexible Server.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 05/06/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Supported PostgreSQL versions in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server currently supports the following major versions.

## PostgreSQL version 16

PostgreSQL version 16 is now generally available in all Azure regions. The current minor release is **[!INCLUDE [minorversions-16](./includes/minorversion-16.md)]**. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/release/16.2/) to learn more about improvements and fixes in this release. New servers are created with this minor version. 

## PostgreSQL version 15

The current minor release is **[!INCLUDE [minorversions-15](./includes/minorversion-15.md)]**. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/release/15.4/) to learn more about improvements and fixes in this release. New servers are created with this minor version. 

## PostgreSQL version 14

The current minor release is **[!INCLUDE [minorversions-14](./includes/minorversion-14.md)]**. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/release/14.11/) to learn more about improvements and fixes in this release. New servers are created with this minor version.

## PostgreSQL version 13

The current minor release is **[!INCLUDE [minorversions-13](./includes/minorversion-13.md)]**. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/release/13.14/) to learn more about improvements and fixes in this release. New servers are created with this minor version. 

## PostgreSQL version 12

The current minor release is **[!INCLUDE [minorversions-12](./includes/minorversion-12.md)]**. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/release/12.18/) to learn more about improvements and fixes in this release. New servers are created with this minor version. Your existing servers are automatically upgraded to the latest supported minor version in your future scheduled maintenance window.

## PostgreSQL version 11

The current minor release is **[!INCLUDE [minorversions-11](./includes/minorversion-11.md)]**. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/release/11.22/) to learn more about improvements and fixes in this release. New servers are created with this minor version. Your existing servers are automatically upgraded to the latest supported minor version in your future scheduled maintenance window.

## PostgreSQL version 10 and older

We don't support PostgreSQL version 10 and older for Azure Database for PostgreSQL flexible server. Use the [Azure Database for PostgreSQL single server](../concepts-supported-versions.md) deployment option if you require older versions.

## Managing upgrades

The PostgreSQL project regularly issues minor releases to fix reported bugs. Azure Database for PostgreSQL flexible server automatically patches servers with minor releases during the service's monthly deployments.

It's also possible to do in-place major version upgrades by using the [major version upgrade](./concepts-major-version-upgrade.md) feature. This feature greatly simplifies the upgrade process of an instance from a major version (PostgreSQL 11, for example) to any higher supported version (like PostgreSQL 16).

## Supportability and retirement policy of the underlying operating system

Azure Database for PostgreSQL flexible server is a fully managed open-source database. The underlying operating system is an integral part of the service. Microsoft continually works to ensure ongoing security updates and maintenance for security compliance and vulnerability mitigation, whether a partner or an internal vendor provides them. Automatic upgrades during scheduled maintenance help keep your managed database secure, stable, and up to date.

## Managing PostgreSQL engine defects

Microsoft has a team of committers and contributors who work full time on the open-source Postgres project and are long-term members of the community. Our contributions include features, performance enhancements, bug fixes, and security patches, among other things. Our open-source team also incorporates feedback from our Azure fleet (and customers) when prioritizing work. But keep in mind that the Postgres project has its own independent contribution guidelines, review process, and release schedule.

When we identify a defect with PostgreSQL engine, we take immediate action to mitigate the problem. If it requires code change, we fix the defect to address the production issue, if possible. We work with the community to incorporate the fix as quickly as possible.

## Next steps

Learn about [PostgreSQL extensions](concepts-extensions.md).
