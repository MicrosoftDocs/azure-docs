---
title: Connecting to a database with Azure Static Web Apps
description: Learn about the database connection features of Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 03/03/2023
---

# Connecting to a database with Azure Static Web Apps (preview)

The Azure Static Web Apps database connection feature allows you to access a database from your static web app without writing custom server-side code.

Once you create a connection between your web application and database, you can manipulate data with full support for CRUD operations, built-in authorization, and relationships.

Based on the [Data API builder](/azure/data-api-builder), Azure Static Web Apps takes REST and GraphQL requests and converts them to database queries.

Features supported by database connections include:

| Feature | Description |
|---|---|
| **Integrated security** | Built-in integration with Azure Static Web Apps authentication and authorization security model. The same role-based security used to secure routes is available for API endpoints. |
| **Full CRUD-based operations**  | Refer to the tutorials for [Azure Cosmos DB](database-azure-cosmos-db.md), [Azure SQL](database-azure-sql.md), [MySQL](database-mysql.md), or [PostgreSQL](database-postgresql.md) for an example on how to manipulate data in your application. |
| **Supports SQL and NoSQL** | You can use relational and document databases as your application's database. |
| **Serverless architecture** | Connections scale from 0 to 1 worker (during preview). |
| **Database relationships** | Supported only via the GraphQL  endpoint. |
| **CLI support** | Develop locally with the [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli). Use the `--data-api-location` option to handle requests to data APIs in development just as they're handled in the cloud. |

## Supported databases

The following table shows support for different relational and NoSQL databases.

| Name | Type | Description | REST | GraphQL |
|---|---|---|---|---|
| [Azure Cosmos DB](/azure/cosmos-db/distributed-nosql) | Standard | Globally distributed database platform for both NoSQL and relational databases of any scale.<br><br>In addition to the [standard configuration](database-configuration.md), a [`gql` schema file](/azure/data-api-builder/get-started/get-started-azure-cosmos-db#add-book-schema-file) is required for GraphQL endpoints. | | ✔ |
| [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql&preserve-view=true) | Standard | Family of managed, secure, and intelligent products that use the SQL Server database engine in the Azure cloud. | ✔ | ✔ |
| [Azure Database for MySQL](/azure/mysql/single-server/overview#azure-database-for-mysql---flexible-server) | Flex |  Relational database service in the Microsoft cloud based on the MySQL Community Edition | ✔ | ✔ |
| [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) | Flex | Fully managed PostgreSQL database-as-a-service that handles mission-critical workloads with predictable performance and dynamic scalability. | ✔ | ✔ |
| [Azure Database for PostgreSQL (single)](/azure/postgresql/single-server/overview-single-server) | Single | Fully managed PostgreSQL database. | ✔ | ✔ |

You can use the following connection types for database access:

- Connection string
- User-assigned Managed Identity
- System-assigned Managed Identity


## Endpoint location

Access to data endpoints are available off the `/data-api` path.

The following table shows you how requests route to different parts of a static web app:

| Path | Description |
|---|---|
| `example.com/api/*` | [API functions](add-api.md) |
| `example.com/data-api/*` | Database connection endpoints that support REST and GraphQL requests. |
| `example.com/*` | Static content |

When you configure database connections on your website, you can configure the REST or GraphQL suffix of the `/data-api/*` route. The `/data-api` prefix is a convention of Static Web Apps and can't be changed.

## Configuration

There are two steps to configuring a database connection in Static Web Apps. You need to connect your database to your static web app in the Azure portal, and update your database connections configuration file.

See [Database connection configuration in Azure Static Web Apps](database-configuration.md) for more detail.

## Local development

The Azure Static Web Apps CLI (SWA CLI) includes support for working with database connections during local development.

The CLI activates the local `/data-api` endpoint, and proxies requests from port `4280` to the appropriate port for database access.

Here's an example command that starts the SWA CLI with a database connection:

```bash
swa start ./src --data-api-location swa-db-connections
```

This command starts the SWA CLI in the *src* directory. The `--data-api-location` option tells the CLI that a folder named *swa-db-connections* holds the *[staticwebapp.database.config.json](https://github.com/MicrosoftDocs/data-api-builder-docs/blob/main/data-api-builder/configuration-file.md)* file.

> [!NOTE]
> In development, if you use a connection string to authenticate, use the `env()` function to read a connection string from an environment variable. The string passed in to the `env` function must be surrounded by quotes.

## Role-based security

When you define an entity in the *staticwebapp.database.config.json* file, you can specify a list of roles required to access an entity endpoint.

The following [configuration](database-configuration.md) fragment requires the *admin* role to access all actions (`create`, `read`, `update`, `delete`) on the *orders* entity.

```json
{
...
"entities": { 
  "Orders": { 
    "source": "dbo.Orders", 
    "permissions": [ 
      { 
        "actions": ["*"], 
        "role": "admin" 
      }
    ]
 }
}
...
}
```

When you make calls to an endpoint that requires a role, the following conditions are required:

1. The current user must be authenticated.
1. The current user must be a member of the required role.
1. The REST or GraphQL request must include a header with the key of `X-MS-API-ROLE` and a value of the role name matching what's listed in the entity configuration rules.

    For instance, the following snippet shows how to pass the *admin* role in a request header.

    ```javascript
    {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-MS-API-ROLE": "admin"
      },
      body: JSON.stringify(requestPayload)
    }
    ```

## Constraints

- Databases must be accessible by Azure's infrastructure.
- During public preview, database connections scale from 0 to 1 database worker.


## Next steps

> [!div class="nextstepaction"]
> [Configure your database](database-configuration.md)
