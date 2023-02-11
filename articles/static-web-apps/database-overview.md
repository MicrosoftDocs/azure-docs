---
title: Connecting to a database with Azure Static Web Apps
description: Learn about the database connection features of Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 02/11/2023
---

# Connecting to a database with Azure Static Web Apps (preview)

 The Azure Static Web Apps database connection feature allows you to access a database from your static web app without writing custom server-side code.

Built on the [Azure Data API Builder](https://github.com/Azure/data-api-builder),  REST and GraphQL requests and converts them to database queries

Data API Builder is responsible for converting REST and GraphQL requests into database queries

are available off the `/data-api` endpoint.

define connection context

entities with permissions

Linking an existing Azure database to your static web app

The same role-based security used to secure routes is available for API endpoints.

Built-in integration with Azure Static Web Apps authentication and authorization security model.

file *staticwebapp.database.config.json*

Supports database relationships

Integrated security
Secured connections to your database
Full CRUD-based operations 

Serverless

Examples, not an exhaustive list of scenarios.

| Type | Description |
|---|---|
| Content management systems (CMS) |  |
| Marketing sites |  |
| Line-of-business applications |  |

Supported by the SWA CLI for local development


| Path | Description |
|---|---|
| `example.com/*` | Static content |
| `example.com/api/*` | API functions |
| `example.com/data-api/*` | Database connection endpoints. |

data-api is the base and then you configure the REST and/or GraphQL endpoints in the [configuration file](https://github.com/Azure/data-api-builder/blob/main/docs/configuration-file.md)



## SWA CLI

Provisions the data-api endpoint and proxies requests to 4280 to the appropriate port for the database access



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

## Constraints

* The database must be accessible by Azure's infrastructure.
* During public preview, the Database connections will scale from 0 to 1 worker.

## Next steps

> [!div class="nextstepaction"]
> [Configure your database](database-configuration.md) 

allows you to access an Azure databases without needing to implement a server side api
Works with SQL and NoSQL datqabases
Omtegrated security
Local and cloud development
