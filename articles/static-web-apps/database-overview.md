---
title: Connecting to a database with Azure Static Web Apps
description: Learn about the database connection features of Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 02/02/2023
---

# Connecting to a database with Azure Static Web Apps (preview)

 The Azure Static Web Apps database connection feature allows you to access your database without writing custom server-side code.

The database is exposed via the `/data-api` endpoint.
The feature supports REST and GraphQL, and you can control whether they're enabled

Integrated security
Secured connections to your database

out-of-the-box CRUD access to your database

Serverless

[Azure Data API Builder](https://github.com/Azure/data-api-builder)

[configuration file](https://github.com/Azure/data-api-builder/blob/main/docs/configuration-file.md)

## Use cases

Examples, not an exhaustive list of scenarios.

| Type | Description |
|---|---|
| Content management systems (CMS) |  |
| Marketing sites |  |
| Line-of-business applications |  |

## Supported databases

| Name | Type | Description |
|---|---|---|
| [Cosmos DB](/azure/cosmos-db/distributed-nosql) |  | Globally distributed database platform for both NoSQL and relational databases of any scale.  |
| [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql&preserve-view=true) |  | Family of managed, secure, and intelligent products that use the SQL Server database engine in the Azure cloud. |
| [Azure Database for MySQL](/azure/mysql/single-server/overview#azure-database-for-mysql---flexible-server) | Flex |  Relational database service in the Microsoft cloud based on the MySQL Community Edition |
| [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) | Flex | Fully managed PostgreSQL database-as-a-service that handles mission-critical workloads with predictable performance and dynamic scalability. |
| [Azure Database for PostgreSQL (single)](/azure/postgresql/single-server/overview-single-server) | Single | Fully managed PostgreSQL database. |

### Connection authentication types

| Type | Description |
|---|---|
| Connection string | Use the `env()` function to read a connection string from an environment variable. |
| System-assigned Managed Identity |  |
| User-assigned Managed Identity |  |

## Big picture

## Constraints

The database must be accessible by Azure's infrastructure. What is the IP address range/domain range to allowlist? Sajeetharan Sinnathurai
During public preview, the Database connections will scale from 0 to 1 worker.

## Next steps

> [!div class="nextstepaction"]
> [Configure your database](database-configuration.md)