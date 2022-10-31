---
title: Supported versions – Azure Cosmos DB for PostgreSQL
description: PostgreSQL versions available in Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 10/14/2022
---

# Supported database versions in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

## PostgreSQL versions

The version of PostgreSQL running in a cluster is
customizable during creation. Azure Cosmos DB for PostgreSQL currently supports the
following major [PostgreSQL
versions](https://www.postgresql.org/docs/release/):

### PostgreSQL version 14

The current minor release is 14.5. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/14.5/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 13

The current minor release is 13.8. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/13.8/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 12

The current minor release is 12.12. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/12.12/) to
learn more about improvements and fixes in this minor release.

### PostgreSQL version 11

The current minor release is 11.17. Refer to the [PostgreSQL
documentation](https://www.postgresql.org/docs/release/11.17/) to
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

Each major version of PostgreSQL will be supported by Azure Cosmos DB for
PostgreSQL from the date on which Azure begins supporting the version until the
version is retired by the PostgreSQL community. Refer to [PostgreSQL community
versioning policy](https://www.postgresql.org/support/versioning/).

Azure Cosmos DB for PostgreSQL automatically performs minor version upgrades to
the Azure preferred PostgreSQL version as part of periodic maintenance.

### Major version retirement policy

The table below provides the retirement details for PostgreSQL major versions in Azure Cosmos DB for PostgreSQL.
The dates follow the [PostgreSQL community versioning
policy](https://www.postgresql.org/support/versioning/).

| Version | What's New | Supported since | Retirement date (Azure)|
| ------- | ---------- | ------------------------ | ---------------------- |
| [PostgreSQL 11](https://www.postgresql.org/about/news/postgresql-11-released-1894/) | [Features](https://www.postgresql.org/docs/11/release-11.html) | May 7, 2019	| November 9, 2023  |
| [PostgreSQL 12](https://www.postgresql.org/about/news/postgresql-12-released-1976/) | [Features](https://www.postgresql.org/docs/12/release-12.html) | Apr 6, 2021 	| November 14, 2024
| [PostgreSQL 13](https://www.postgresql.org/about/news/postgresql-13-released-2077/) | [Features](https://www.postgresql.org/docs/13/release-13.html) | Apr 6, 2021 	| November 13, 2025
| [PostgreSQL 14](https://www.postgresql.org/about/news/postgresql-14-released-2318/) | [Features](https://www.postgresql.org/docs/14/release-14.html) | Oct 1, 2021 | November 12, 2026

### Retired PostgreSQL engine versions not supported in Azure Cosmos DB for PostgreSQL

You may continue to run the retired version in Azure Cosmos DB for PostgreSQL.
However, note the following restrictions after the retirement date for each
PostgreSQL database version:

- As the community will not be releasing any further bug fixes or security fixes, Azure Cosmos DB for PostgreSQL will not patch the retired database engine for any bugs or security issues, or otherwise take security measures with regard to the retired database engine. You may experience security vulnerabilities or other issues as a result. However, Azure will continue to perform periodic maintenance and patching for the host, OS, containers, and any other service-related components.
- If any support issue you may experience relates to the PostgreSQL engine itself, as the community no longer provides the patches, we may not be able to provide you with support. In such cases, you will have to upgrade your database to one of the supported versions.
- You will not be able to create new database servers for the retired version. However, you will be able to perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Cosmos DB for PostgreSQL may only be available to supported database server versions.
- Uptime SLAs will apply solely to Azure Cosmos DB for PostgreSQL service-related issues and not to any downtime caused by database engine-related bugs.  
- In the extreme event of a serious threat to the service caused by the PostgreSQL database engine vulnerability identified in the retired database version, Azure may choose to stop your database server to secure the service. In such case, you will be notified to upgrade the server before bringing the server online.

## Citus and other extension versions

Depending on which version of PostgreSQL is running in a cluster,
different [versions of PostgreSQL extensions](reference-extensions.md)
will be installed as well. In particular, PostgreSQL 14 comes with Citus 11, PostgreSQL versions 12 and 13 come with
Citus 10, and earlier PostgreSQL versions come with Citus 9.5.

## Next steps

* See which [extensions](reference-extensions.md) are installed in
  which versions.
* Learn to [create a cluster](quickstart-create-portal.md).
