---
title: "Tutorial: Add a PostgreSQL database connection in Azure Static Web Apps"
description: Learn to add a PostgreSQL database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 02/28/2023
zone_pivot_groups: static-web-apps-api-protocols
---

# Tutorial: Add a PostgreSQL database connection in Azure Static Web Apps (preview)

In this tutorial, you learn how to connect an Azure Database for PostgreSQL Single Server or Flexible Server database to your static web app. Once configured, you can make REST or GraphQL requests to the built-in `/data-api` endpoint to manipulate data without having to write backend code.

For the sake of simplicity, this tutorial shows you how to use an Azure database for local development purposes, but you may also use a local database server for your local development needs.

> [!NOTE]
> This tutorial shows how to use Azure Database for PostgreSQL Flexible Server or Single Server. If you would like to use another database, refer to the [Azure Cosmos DB](database-azure-cosmosdb.md), [Azure SQL](database-azure-sql.md), or [MySQL](database-mysql.md) tutorials.

:::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from PostgreSQL selection in the developer tools console window.":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Link an Azure Database for PostgreSQL Flexible Server or Single Server database to your static web app
> * Create, read, update, and delete data

## Prerequisites

To complete this tutorial, you need to have an existing Azure Database for PostgreSQL Flexible Server or Single Server and static web app. Additionally, you need to install Azure Data Studio.

| Resource | Description |
|---|---|
| [Azure Database for PostgreSQL Flexible Server](/azure/postgresql/flexible-server/quickstart-create-server-portal) or [Azure Database for PostgreSQL Single Server Database](/azure/postgresql/single-server/quickstart-create-server-database-portal) | If you don't already have one, follow the steps in the [create an Azure Database for PostgreSQL Flexible Server database](/azure/postgresql/flexible-server/quickstart-create-server-portal) guide, or in the [create an Azure Database for PostgeSQL Single Server database](/azure/postgresql/single-server/quickstart-create-server-database-portal) guide. If you plan to use a connection string authentication for Static Web Apps' database connections, ensure that you create your Azure Database for PostgreSQL Server with PostgreSQL authentication. You can change this if you want to use managed identity later on. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide to create a *No Framework* static web app. |
| [Azure Data Studio, with the PostgreSQL extension](/sql/azure-data-studio/quickstart-postgres) | If you don't already have this installed, follow the guide to install [Azure Data Studio, with the PostgreSQL extension](/sql/azure-data-studio/quickstart-postgres). Alternatively, you may use any other tool to query your PostgreSQL database, such as PgAdmin. |

Begin by configuring your database to work with the Azure Static Web Apps database connection feature.

## Configure database connectivity

Azure Static Web Apps must have network access to your database for database connections to work. Additionally, to use an Azure database for local development, you need to configure your database to allow requests from your own IP address.

1. Go to your Azure Database for PostgreSQL Server in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Networking**.

1. Under the *Firewall rules* section, select the **Add your current client IP address** button. This ensures that you can use this database for your local development.

1. Under the *Firewall rules* section, select the **Allow public access from any Azure service within Azure to this server** checkbox. This ensures that your deployed Static Web Apps resource can access your database.

1. Select **Save**.

## Get database connection string for local development

To use your Azure database for local development, you need to retrieve the connection string of your database. You may skip this step if you plan to use a local database for development purposes.

1. Go to your Azure Database for PostgreSQL Server in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Connection strings**.

1. From the *ADO.NET* box, copy the connection string and set it aside in a text editor.

Make sure to replace the `{your_password}` placeholder in the connection string with your password, and the `{your_database}` placeholder with the database name `MyTestPersonDatabase`, which is the name of the database you create in the following steps. Append `Trust Server Certificate=True;` to the connection string to use this connection string for local development.

## Create sample data

Create a sample table and seed it with sample data to match the tutorial. This tutorial uses [Azure Data Studio](/sql/azure-data-studio/quickstart-postgres), but you may use PgAdmin or any other tool. 

1. In Azure Data Studio, [create a connection to your Azure Database for PostgreSQL Server](/sql/azure-data-studio/quickstart-postgres#connect-to-postgresql)

1. Right click your server, and select **New Query**. Run the following querying to create a database named `MyTestPersonDatabase`. 

    ```sql
    CREATE DATABASE "MyTestPersonDatabase";
    ```

1. Right click your server, and select **Refresh**.

1. Right click your `MyTestPersonDatabase` and select **New Query**. Run the following query to create a new table named `MyTestPersonTable`.

    ```sql
    CREATE TABLE "MyTestPersonTable" (
        "Id" SERIAL PRIMARY KEY,
        "Name" VARCHAR(25) NULL
    );
    ```

1. Run the following queries to add data into the *MyTestPersonTable* table.

    ```sql
    INSERT INTO "MyTestPersonTable" ("Name")
    VALUES ('Sunny');

    INSERT INTO "MyTestPersonTable" ("Name")
    VALUES ('Dheeraj');
    ```

## Configure the static web app

The rest this tutorial focuses on editing your static web app's source code to make use of database connections locally.  

> [!IMPORTANT]
> The following steps assume you are working with the static web app created in the [getting started guide](getting-started.md). If you are using a different project, make sure to adjust the following git commands to match your branch names.

1. Switch to the `main` branch.

    ```bash
    git checkout main
    ```

1. Synchronize your local version with what's on GitHub by using `git pull`.

    ```bash
    git pull origin main
    ```

### Create the database configuration file

Next, create the configuration file that your static web app uses to interface with the database.

1. Open your terminal and create a new variable to hold your connection string. The specific syntax may vary depending on the shell type you're using.

    # [Bash](#tab/bash)

    ```bash
    DATABASE_CONNECTION_STRING="<YOUR_CONNECTION_STRING>"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $env:DATABASE_CONNECTION_STRING='<YOUR_CONNECTION_STRING>'
    ```

    ---

    Make sure to replace `<YOUR_CONNECTION_STRING>` with the connections string value you set aside in a text editor.

1. Use the `swa db init` command to generate a database configuration file.

    # [Bash](#tab/bash)

    ```bash
    swa db init --database-type postgresql
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    swa db init --database-type postgresql
    ```

    ---

    The `init` command creates the *staticwebapp.database.config.json* file in the *swa-db-connections* folder.

1. Paste in this sample into file *staticwebapp.database.config.json* you generated.

```json
{
  "$schema": "https://go.microsoft.com/fwlink/?linkid=2226079",
  "data-source": {
    "database-type": "postgresql",
    "options": {
      "set-session-context": false 
    },
    "connection-string": "@env('DATABASE_CONNECTION_STRING')"
  },
  "runtime": {
    "rest": {
      "enabled": true,
      "path": "/rest"
    },
    "graphql": {
      "allow-introspection": true,
      "enabled": true,
      "path": "/graphql"
    },
    "host": {
      "mode": "production",
      "cors": {
        "origins": ["http://localhost:4280"],
        "allow-credentials": false
      },
      "authentication": {
        "provider": "StaticWebApps"
      }
    }
  },
  "entities": {
    "Person": {
      "source": "MyTestPersonTable",
      "permissions": [
        {
          "actions": ["*"],
          "role": "anonymous"
        }
      ]
    }
  }
}
```

Before moving on to the next step, review the following table that explains different aspects of the configuration file. For full documentation on the configuration file and functionality such as relationships and policies for item-level security, refer to [Data API Builder documentation](https://github.com/Azure/data-api-builder/blob/main/docs/configuration-file.md).

| Feature | Explanation |
|---|---|
| **Database connection** | In development, the runtime reads the connection string from the value of the connection string in the configuration file. While you can specify your connection string directly in the configuration file, a best practice is to store connection strings in a local environment variable. You can refer to environment variable values in the configuration file via the `@env('DATABASE_CONNECTION_STRING')` notation. The value of the connection string gets overwritten by Static Web Apps for the deployed site with the information collected when you connect your database. |
| **API endpoint** | The REST endpoint is available via `/data-api/rest` while the GraphQL endpoint is available through `/data-api/graphql` as configured in this configuration file. You may configure the REST and GraphQL paths, but the `/data-api` prefix is not configurable. |
| **API Security** | The `runtime.host.cors` settings allow you to define allowed origins that can make requests to the API. In this case, the configuration reflects a development environment and allowlists the *http://localhost:4280* location. |
| **Entity model** | Defines the entities exposed via routes in the REST API, or as types in the GraphQL schema. In this case, the name *Person*, is the name exposed to the endpoint while `entities.<NAME>.source` is the database schema and table mapping. Notice how the API endpoint name doesn't need to be identical to the table name. |
| **Entity security** | Permissions rules listed in the `entity.<NAME>.permissions` array control the authorization settings for an entity. You can secure an entity with roles in the same way you [secure routes with roles](./configuration.md#securing-routes-with-roles).  |

> [!NOTE]
> The configuration file's `connection-string`, `host.mode`, and `graphql.allow-introspection` properties are overwritten when you deploy your site. Your connection string is overwritten with the authentication details collected when you connect your database to your Static Web Apps resource. The `host.mode` property is set to `production`, and the `graphql.allow-introspection` is set to `false`. These overrides provide consistency in your configuration files across your development and production workloads, while ensuring your Static Web Apps resource with database connections enabled is secure and production-ready.

With the static web app configured to connect to the database, you can now verify the connection.

[!INCLUDE [Database connection  - client code](../../includes/static-web-apps-database-connection-client-code.md)]

## Clean up resources

If you want to remove the resources created during this tutorial, you need to unlink the database and remove the sample data.

1. **Unlink database**: Open your static web app in the Azure portal. Under the *Settings* section, select **Database connection**. Next to the linked database, select **View details**. In the *Database connection details* window, select the **Unlink** button.

1. **Remove sample data**: In your database, delete the table named `MyTestPersonTable`.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
