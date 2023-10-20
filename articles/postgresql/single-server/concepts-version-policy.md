---
title: Versioning policy - Azure Database for PostgreSQL - Single Server and Flexible Server
description: Describes the policy around Postgres major and minor versions in Azure Database for PostgreSQL - Single Server and Flexible Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna

ms.date: 09/14/2022
ms.custom: fasttrack-edit, ignite-2022
---

# Azure Database for PostgreSQL versioning policy

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This page describes the Azure Database for PostgreSQL versioning policy, and is applicable to these deployment modes:

* Single Server
* Flexible Server

## Supported  PostgreSQL versions

Azure Database for PostgreSQL supports the following database versions.

| Version | Single Server | Flexible Server |
| ----- | :------: | :----: |
| PostgreSQL 15 |   | X |
| PostgreSQL 14 |   | X |
| PostgreSQL 13 |   | X |
| PostgreSQL 12 |   | X |
| PostgreSQL 11 | X | X |
| PostgreSQL 10 | X |   |
| *PostgreSQL 9.6 (retired)* | See [policy](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql) |  |
| *PostgreSQL 9.5 (retired)* | See [policy](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql) |  |

## Major version support

Each major version of PostgreSQL will be supported by Azure Database for PostgreSQL from the date on which Azure begins supporting the version until the version is retired by the PostgreSQL community. Refer to [PostgreSQL community versioning policy](https://www.postgresql.org/support/versioning/).

## Minor version support

Azure Database for PostgreSQL automatically performs minor version upgrades to the Azure preferred PostgreSQL version as part of periodic maintenance.

## Major version retirement policy

The table below provides the retirement details for PostgreSQL major versions. The dates follow the [PostgreSQL community versioning policy](https://www.postgresql.org/support/versioning/).

| Version | What's New | Azure support start date | Retirement date (Azure)|
| ------- | ---------- | ------------------------ | ---------------------- |
| [PostgreSQL 9.5 (retired)](https://www.postgresql.org/about/news/postgresql-132-126-1111-1016-9621-and-9525-released-2165/)| [Features](https://www.postgresql.org/docs/9.5/release-9-5.html)  | April 18, 2018	| February 11, 2021
| [PostgreSQL 9.6 (retired)](https://www.postgresql.org/about/news/postgresql-96-released-1703/) | [Features](https://wiki.postgresql.org/wiki/NewIn96) | April 18, 2018 | November 11, 2021
| [PostgreSQL 10](https://www.postgresql.org/about/news/postgresql-10-released-1786/) | [Features](https://wiki.postgresql.org/wiki/New_in_postgres_10) | June 4, 2018	| November 10, 2022
| [PostgreSQL 11](https://www.postgresql.org/about/news/postgresql-11-released-1894/) | [Features](https://www.postgresql.org/docs/11/release-11.html) | July 24, 2019	| November 9, 2024 [Single Server, Flexible Server] |
| [PostgreSQL 12](https://www.postgresql.org/about/news/postgresql-12-released-1976/) | [Features](https://www.postgresql.org/docs/12/release-12.html) | Sept 22, 2020 	| November 14, 2024
| [PostgreSQL 13](https://www.postgresql.org/about/news/postgresql-13-released-2077/) | [Features](https://www.postgresql.org/docs/13/release-13.html) | May 25, 2021 	| November 13, 2025
| [PostgreSQL 14](https://www.postgresql.org/about/news/postgresql-14-released-2318/) | [Features](https://www.postgresql.org/docs/14/release-14.html) | June 29, 2022 (Flexible Server)| November 12, 2026
| [PostgreSQL 15](https://www.postgresql.org/about/news/postgresql-15-released-2526/) | [Features](https://www.postgresql.org/docs/14/release-14.html) | May 15, 2023 (Flexible Server)| November 11, 2027

## PostgreSQL 11 support in Single Server and Flexible Server

Azure is extending support for PostgreSQL 11 in Single Server and Flexible Server by one more year until **November 9, 2024**.

- You will be able to create and use your PostgreSQL 11 servers until November 9, 2024 without any restrictions. This extended support is provided to help you with more time to plan and [migrate to Flexible server](../migrate/concepts-single-to-flexible.md) for higher PostgreSQL versions.
- Until November 9, 2023, Azure will continue to update your PostgreSQL 11 server with PostgreSQL community provided minor versions.
- Between November 9, 2023 and November 9, 2024, you can continue to use your PostgreSQL 11 servers and create new PostgreSQL servers without any restrictions. However, other retired PostgreSQL engine [restrictions](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql) apply.
- Beyond Nov 9 2024, all retired PostgreSQL engine [restrictions](#retired-postgresql-engine-versions-not-supported-in-azure-database-for-postgresql) apply.
  
## Retired PostgreSQL engine versions not supported in Azure Database for PostgreSQL

You might continue to run the retired version in Azure Database for PostgreSQL. However, note the following restrictions after the retirement date for each PostgreSQL database version:
- As the community won't be releasing any further bug fixes or security fixes, Azure Database for PostgreSQL won't patch the retired database engine for any bugs or security issues, or otherwise take security measures with regard to the retired database engine. You might experience security vulnerabilities or other issues as a result. However, Azure will continue to perform periodic maintenance and patching for the host, OS, containers, and any other service-related components.
- If any support issue you might experience relates to the PostgreSQL engine itself, as the community no longer provides the patches, we might not be able to provide you with support. In such cases, you'll have to upgrade your database to one of the supported versions.
- You won't be able to create new database servers for the retired version. However, you'll be able to perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Database for PostgreSQL might only be available to supported database server versions.
- Uptime SLAs will apply solely to Azure Database for PostgreSQL service-related issues and not to any downtime caused by database engine-related bugs.  
- In the extreme event of a serious threat to the service caused by the PostgreSQL database engine vulnerability identified in the retired database version, Azure might choose to stop your database server to secure the service. In such case, you'll be notified to upgrade the server before bringing the server online.

  
## PostgreSQL version syntax

Before PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number. For example, 9.5 to 9.6 was considered a _major_ version upgrade. As of version 10, only a change in the first number is considered a major version upgrade. For example, 10.0 to 10.1 is a _minor_ release upgrade. Version 10 to 11 is a _major_ version upgrade.

## Next steps

- See Azure Database for PostgreSQL - Single Server [supported versions](./concepts-supported-versions.md)
- See Azure Database for PostgreSQL - Flexible Server [supported versions](../flexible-server/concepts-supported-versions.md)
