---
title: Versioning policy
description: Describes the policy around Postgres major and minor versions in Azure Database for PostgreSQL - Single Server and Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Database for PostgreSQL - Flexible Server versioning policy

[!INCLUDE [applies-to-postgresql-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This page describes the Azure Database for PostgreSQL flexible server versioning policy, and is applicable to these deployment modes:

* Azure Database for PostgreSQL single server
* Azure Database for PostgreSQL flexible server

## Supported PostgreSQL versions

Azure Database for PostgreSQL flexible server supports the following database versions.

| Version | Azure Database for PostgreSQL single server | Azure Database for PostgreSQL flexible server |
| ----- | :------: | :----: |
| PostgreSQL 16 |   | X |
| PostgreSQL 15 |   | X |
| PostgreSQL 14 |   | X |
| PostgreSQL 13 |   | X |
| PostgreSQL 12 |   | X |
| PostgreSQL 11 | X | X |
| *PostgreSQL 10 (retired)* | See [policy](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql-flexible-server) |  |
| *PostgreSQL 9.6 (retired)* | See [policy](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql-flexible-server) |  |
| *PostgreSQL 9.5 (retired)* | See [policy](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql-flexible-server) |  |

## Major version support

Each major version of PostgreSQL will be supported by Azure Database for PostgreSQL flexible server from the date on which Azure begins supporting the version until the version is retired by the PostgreSQL community. Refer to [PostgreSQL community versioning policy](https://www.postgresql.org/support/versioning/).

## Minor version support

Azure Database for PostgreSQL flexible server automatically performs minor version upgrades to the Azure preferred PostgreSQL version as part of periodic maintenance.

## Major version retirement policy

The table below provides the retirement details for PostgreSQL major versions. The dates follow the [PostgreSQL community versioning policy](https://www.postgresql.org/support/versioning/).

|Version|What's New                   |Azure support start date|Retirement date (Azure)                      |
|-------|-----------------------------|------------------------|---------------------------------------------|
|[PostgreSQL 16](https://www.postgresql.org/about/news/postgresql-16-released-2715/)|[Features](https://www.postgresql.org/docs/16/release-16.html)|15-Oct-23               |9-Nov-28                                     |
|[PostgreSQL 15](https://www.postgresql.org/about/news/postgresql-15-released-2526/)|[Features](https://www.postgresql.org/docs/15/release-15.html)|15-May-23               |11-Nov-27                                    |
|[PostgreSQL 14](https://www.postgresql.org/about/news/postgresql-14-released-2318/)|[Features](https://www.postgresql.org/docs/14/release-14.html)|29-Jun-22               |12-Nov-26                                    |
|[PostgreSQL 13](https://www.postgresql.org/about/news/postgresql-13-released-2077/)|[Features](https://www.postgresql.org/docs/13/release-13.html)|25-May-21               |13-Nov-25                                    |
|[PostgreSQL 12](https://www.postgresql.org/about/news/postgresql-12-released-1976/)|[Features](https://www.postgresql.org/docs/12/release-12.html)|22-Sep-20               |14-Nov-24                                    |
|[PostgreSQL 11](https://www.postgresql.org/about/news/postgresql-11-released-1894/)|[Features](https://www.postgresql.org/docs/11/release-11.html)|24-Jul-19               |9-Nov-25                                     |
|[PostgreSQL 10 (retired)](https://www.postgresql.org/about/news/postgresql-10-released-1786/)|[Features](https://wiki.postgresql.org/wiki/New_in_postgres_10)|4-Jun-18                |10-Nov-22                                    |
|[PostgreSQL 9.5 (retired)](https://www.postgresql.org/about/news/postgresql-132-126-1111-1016-9621-and-9525-released-2165/)|[Features](https://www.postgresql.org/docs/9.5/release-9-5.html)|18-Apr-18               |11-Feb-21                                    |
|[PostgreSQL 9.6 (retired)](https://www.postgresql.org/about/news/postgresql-96-released-1703/)|[Features](https://wiki.postgresql.org/wiki/NewIn96)|18-Apr-18               |11-Nov-21                                    |

## PostgreSQL 11 support

Azure is extending its support for PostgreSQL 11 within both the Azure Database for PostgreSQL Single Server and Azure Database for PostgreSQL Flexible Server platforms. This extended support timeline is designed to provide more time for users to plan and [migrate to Azure Database for PostgreSQL flexible server](../migrate/concepts-single-to-flexible.md) for higher PostgreSQL versions.

### Single Server Support:
- Until March 28, 2025, users can continue to create and utilize PostgreSQL 11 servers on the Azure Database for PostgreSQL Single Server, except for creation through the Azure portal. It's important to note that other [restrictions](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql-flexible-server) associated with retired PostgreSQL engines still apply.
- Azure will offer updates incorporating minor versions provided by the PostgreSQL community for PostgreSQL 11 servers until November 9, 2023.

### Flexible Server Support
- Users can create and operate PostgreSQL 11 servers on Azure Database for PostgreSQL Flexible Server until November 9, 2025. 
- Similar to the Single Server, updates with PostgreSQL community provided minor versions will be available for PostgreSQL 11 servers until November 9, 2023.
- From November 9, 2023, to November 9, 2025, while users can continue using and creating new instances of PostgreSQL 11 on the Flexible Server, they will be subject to the [restrictions](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql-flexible-server) of other retired PostgreSQL engines.

This extension of Postgres 11 support is part of Azure's commitment to providing a seamless migration path and ensuring continued functionality for users.

## Retired PostgreSQL engine versions not supported in Azure Database for PostgreSQL flexible server

You might continue to run the retired version in Azure Database for PostgreSQL flexible server. However, note the following restrictions after the retirement date for each PostgreSQL database version:
- As the community won't be releasing any further bug fixes or security fixes, Azure Database for PostgreSQL flexible server won't patch the retired database engine for any bugs or security issues, or otherwise take security measures regarding the retired database engine. You might experience security vulnerabilities or other issues as a result. However, Azure continues to perform periodic maintenance and patching for the host, OS, containers, and any other service-related components.
- If any support issue you might experience relates to the PostgreSQL engine itself, as the community no longer provides the patches, we might not be able to provide you with support. In such cases, you have to upgrade your database to one of the supported versions.
- You won't be able to create new database servers for the retired version. However, you'll be able to perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Database for PostgreSQL flexible server might only be available to supported database server versions.
- Uptime SLAs apply solely to Azure Database for PostgreSQL flexible server service-related issues and not to any downtime caused by database engine-related bugs.  
- In the extreme event of a serious threat to the service caused by the PostgreSQL database engine vulnerability identified in, the retired database version, Azure might choose to stop your database server to secure the service. In such case, you are notified to upgrade the server before bringing the server online.
- The new extensions introduced for Azure Postgres Flexible Server will not be supported on the community retired postgres versions.

  
## PostgreSQL version syntax

Before PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number. For example, 9.5 to 9.6 was considered a _major_ version upgrade. As of version 10, only a change in the first number is considered a major version upgrade. For example, 10.0 to 10.1 is a _minor_ release upgrade. Version 10 to 11 is a _major_ version upgrade.

## Next steps

- See Azure Database for PostgreSQL single server [supported versions](../single-server/concepts-supported-versions.md).
- See Azure Database for PostgreSQL flexible server [supported versions](concepts-supported-versions.md).
