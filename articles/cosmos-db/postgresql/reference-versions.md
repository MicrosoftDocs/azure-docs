---
title: Supported versions – Azure Cosmos DB for PostgreSQL
description: PostgreSQL versions available in Azure Cosmos DB for PostgreSQL
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/27/2023
---

# Supported database versions in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

## PostgreSQL versions

The version of PostgreSQL running in a cluster is
customizable during creation. Azure Cosmos DB for PostgreSQL currently supports the
following major [PostgreSQL
versions](https://www.postgresql.org/docs/release/):

### PostgreSQL version 16

The current minor release is 16.0. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/16.0/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 15

The current minor release is 15.4. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/15.4/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 14

The current minor release is 14.9. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/14.9/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 13

The current minor release is 13.12. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/13.12/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 12

The current minor release is 12.16. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/12.16/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 11

> [!CAUTION]
> PostgreSQL community ended support for PostgreSQL 11 on November 9, 2023. See [restrictions](./reference-versions.md#retired-postgresql-engine-versions-not-supported-in-azure-cosmos-db-for-postgresql) that apply to the retired PostgreSQL major versions in Azure Cosmos DB for PostgreSQL. Learn about [in-place upgrades for major PostgreSQL versions](./concepts-upgrade.md) in Azure Cosmos DB for PostgreSQL.

The current minor release is 11.21. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/11.21/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 10 and older

We don't support PostgreSQL version 10 and older for Azure Cosmos DB for PostgreSQL.

## PostgreSQL version syntax

Before PostgreSQL version 10, the [PostgreSQL versioning
policy](https://www.postgresql.org/support/versioning/) considered a _major
version_ upgrade to be an increase in the first _or_ second number. For
example, 9.5 to 9.6 was considered a _major_ version upgrade. As of version 10,
only a change in the first number is considered a major version upgrade. For
example, 10.0 to 10.1 is a _minor_ release upgrade. Version 10 to 11 is a
_major_ version upgrade.

## PostgreSQL version support and retirement

Azure Cosmos DB for PostgreSQL supports each major version of PostgreSQL from the date on which Azure begins supporting the version until the PostgreSQL community retires that 
major PostgreSQL version. Refer to [PostgreSQL community
versioning policy](https://www.postgresql.org/support/versioning/).

Azure Cosmos DB for PostgreSQL automatically performs minor version updates to
the latest PostgreSQL version available on Azure as part of periodic maintenance.

### Major version retirement policy

The table below provides the retirement details for PostgreSQL major versions in Azure Cosmos DB for PostgreSQL.
The dates follow the [PostgreSQL community versioning
policy](https://www.postgresql.org/support/versioning/).

| Version | What's New | Supported since | Retirement date (Azure)|
| ------- | ---------- | ------------------------ | ---------------------- |
| [PostgreSQL 11](https://www.postgresql.org/about/news/postgresql-11-released-1894/) | [Features](https://www.postgresql.org/docs/11/release-11.html) | May 7, 2019  | Nov 9, 2023  (**retired**) |
| [PostgreSQL 12](https://www.postgresql.org/about/news/postgresql-12-released-1976/) | [Features](https://www.postgresql.org/docs/12/release-12.html) | Apr 6, 2021  | Nov 14, 2024 |
| [PostgreSQL 13](https://www.postgresql.org/about/news/postgresql-13-released-2077/) | [Features](https://www.postgresql.org/docs/13/release-13.html) | Apr 6, 2021  | Nov 13, 2025 |
| [PostgreSQL 14](https://www.postgresql.org/about/news/postgresql-14-released-2318/) | [Features](https://www.postgresql.org/docs/14/release-14.html) | Oct 1, 2021  | Nov 12, 2026 |
| [PostgreSQL 15](https://www.postgresql.org/about/news/postgresql-15-released-2526/) | [Features](https://www.postgresql.org/docs/15/release-15.html) | Oct 20, 2022 | Nov 11, 2027 |
| [PostgreSQL 16](https://www.postgresql.org/about/news/postgresql-16-released-2715/) | [Features](https://www.postgresql.org/docs/16/release-16.html) | Sep 28, 2023 | Nov 9, 2028  |

### Retired PostgreSQL engine versions not supported in Azure Cosmos DB for PostgreSQL

You may continue to run the retired version in Azure Cosmos DB for PostgreSQL.
However, note the following restrictions after the retirement date for each
PostgreSQL database version:

- As the community will not be releasing any further bug fixes or security fixes, Azure Cosmos DB for PostgreSQL will not patch the retired database engine for any bugs or security issues, or otherwise take security measures with regard to the retired database engine. You may experience security vulnerabilities or other issues as a result. However, Azure will continue to perform periodic maintenance and patching for the host, OS, containers, and any other service-related components.
- If any support issue you may experience relates to the PostgreSQL engine itself, as the community no longer provides the patches, we may not be able to provide you with support. In such cases, you will have to upgrade your database to one of the supported versions.
- You will not be able to create new database servers for the retired version. However, you will be able to perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Cosmos DB for PostgreSQL may only be available to supported database server versions.
- Uptime SLAs will apply solely to Azure Cosmos DB for PostgreSQL service-related issues and not to any downtime caused by database engine-related bugs.  
- In the extreme event of a serious threat to the service caused by the PostgreSQL database engine vulnerability identified in the retired database version, Azure may choose to stop your database server to secure the service. In such case, you will be notified [to upgrade the server](./howto-upgrade.md) before bringing the server online.

## Citus and other extension versions

Depending on which version of PostgreSQL is running in a cluster,
different [versions of PostgreSQL extensions](reference-extensions.md)
will be installed as well. In particular, PostgreSQL 14, PostgreSQL 15, and PostgreSQL 16 come with Citus 12, PostgreSQL 13 comes with Citus 11, PostgreSQL 12 comes with Citus 10, and earlier PostgreSQL versions come with Citus 9.5.

## Next steps

* See which [extensions](reference-extensions.md) are installed in
  which versions.
* Learn to [create a cluster](quickstart-create-portal.md).
* Lean about [in-place Postgres and Citus major version upgrades](./concepts-upgrade.md).