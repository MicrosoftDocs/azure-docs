---
title: "Tutorial: Add a MySQL database connection in Azure Static Web Apps"
description: Learn to add a MySQL database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 03/15/2023
zone_pivot_groups: static-web-apps-api-protocols
---

# Tutorial: Add a MySQL database connection in Azure Static Web Apps (preview)

In this tutorial, you learn how to connect an Azure Database for MySQL Flexible Server database to your static web app. Once configured, you can make REST or GraphQL requests to the built-in `/data-api` endpoint to manipulate data without having to write backend code.

For the sake of simplicity, this tutorial shows you how to use an Azure database for local development purposes, but you may also use a local database server for your local development needs.

> [!NOTE]
> This tutorial shows how to use Azure Database for MySQL Flexible Server. If you would like to use another database, refer to the [Azure Cosmos DB](database-azure-cosmos-db.md), [Azure SQL](database-azure-sql.md), or [PostgreSQL](database-postgresql.md) tutorials.

:::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from MySQL in the developer tools console window.":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Link an Azure Database for MySQL database to your static web app
> * Create, read, update, and delete data

## Prerequisites

To complete this tutorial, you need to have an existing Azure Database for MySQL database and static web app. Additionally, you need to install Azure Data Studio.

| Resource | Description |
|---|---|
| [Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/quickstart-create-server-portal) | If you need to create a database, follow the steps in the [create an Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/quickstart-create-server-portal) guide. If you plan to use a connection string authentication for your web app, ensure that you create your database with MySQL authentication. You can change this setting later if you want to use managed identity later on. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide to create a *No Framework* static web app.  |
| [Azure Data Studio, with the MySQL extension](/sql/azure-data-studio/quickstart-mysql) | If you don't already have Azure Data Studio installed, follow the guide to install [Azure Data Studio, with the MySQL extension](/sql/azure-data-studio/quickstart-mysql). Alternatively, you may use any other tool to query your MySQL database, such as MySQL Workbench. |

Begin by configuring your database to work with the Azure Static Web Apps database connection feature.

## Configure database connectivity

Azure Static Web Apps must have network access to your database for database connections to work. Additionally, to use an Azure database for local development, you need to configure your database to allow requests from your own IP address.

1. Go to your Azure Database for MySQL Server Flexible Server in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Networking**.

1. Under the *Firewall rules* section, select the **Add your current client IP address** button. This step ensures that you can use this database for your local development.

1. Under the *Firewall rules* section, select the **Allow public access from any Azure service within Azure to this server** checkbox. This step ensures that your deployed Static Web Apps resource can access your database.

1. Select **Save**.

## Get database connection string for local development

To use your Azure database for local development, you need to retrieve the connection string of your database. You may skip this step if you plan to use a local database for development purposes.

1. Go to your Azure Database for MySQL Server Flexible Server in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Connect**.

1. In the *Connect from your app* section, select the ADO.NET connection string and set it aside in a text editor.

1. Replace the `{your_password}` placeholder in the connection string with your password.

1. Replace the `{your_database}` placeholder with the database name `MyTestPersonDatabase`. You'll create the `MyTestPersonDatabase` in the coming steps.

1. Delete the *SslMode* and the *SslCa* sections of the connection string as these require extra steps and are intended for production purposes.

## Create sample data

Create a sample table and seed it with sample data to match the tutorial. Here, you can use [Azure Data Studio](/sql/azure-data-studio/quickstart-mysql), but you may use MySQL Workbench or any other tool. 

1. In Azure Data Studio, [create a connection to your Azure MySQL Flexible Server](/sql/azure-data-studio/quickstart-mysql#connect-to-mysql).

1. Right-click your server, and create a new database. Enter `MyTestPersonDatabase` as the database name, and select the charset to be `utf8mb4` and the collation of `utf8mb4_0900_ai_ci`.

1. Right-click your server and select **Refresh**.

1. Right-click your `MyTestPersonDatabase` database and select **New Query**. Run the following script to create a new table named `MyTestPersonTable`.

    ```sql
    CREATE TABLE MyTestPersonTable (
        Id INT AUTO_INCREMENT NOT NULL,
        Name VARCHAR(25) NULL,
        PRIMARY KEY (Id)
    );
    ```

1. Run the following script to add data into the `MyTestPersonTable` table.

    ```sql
    INSERT INTO MyTestPersonTable (Name)
    VALUES ('Sunny');

    INSERT INTO MyTestPersonTable (Name)
    VALUES ('Dheeraj');
    ```

1. Right-click your `MyTestPersonTable` table and select **Select Top 1000** to verify there's data in your database.

## Configure the static web app

The rest this tutorial focuses on editing your static web app's source code to make use of database connections locally.  

> [!IMPORTANT]
> The following steps assume you are working with the static web app created in the [getting started guide](getting-started.md). If you are using a different project, make sure to adjust the following git commands to match your branch names.

1. Switch to the `main` branch.

    # [Bash](#tab/bash)

    ```bash
    git checkout main
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    git checkout main
    ```

    ---

1. Synchronize your local version with what's on GitHub by using `git pull`.

    # [Bash](#tab/bash)

    ```bash
    git pull origin main
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    git pull origin main
    ```

    ---

### Create the database configuration file

Next, create the configuration file that your static web app uses to interface with the database.

1. Open your terminal and create a new variable to hold your connection string. The specific syntax may vary depending on the shell type you're using.

    # [Bash](#tab/bash)

    ```bash
    export DATABASE_CONNECTION_STRING='<YOUR_CONNECTION_STRING>'
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $env:DATABASE_CONNECTION_STRING='<YOUR_CONNECTION_STRING>'
    ```

    ---

    Make sure to replace `<YOUR_CONNECTION_STRING>` with the connections string value you set aside in a text editor.

1. Use npm to install or update the Static Web Apps CLI. Select which command is best for your situation.

    To install, use `npm install`.

    # [Bash](#tab/bash)

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    npm install -g @azure/static-web-apps-cli
    ```

    ---

    To update, use `npm update`.

    # [Bash](#tab/bash)

    ```bash
    npm update
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    npm update
    ```

    ---

1. Use the `swa db init` command to generate a database configuration file.

    # [Bash](#tab/bash)

    ```bash
    swa db init --database-type mysql
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    swa db init --database-type mysql
    ```

    ---

    The `init` command creates the *staticwebapp.database.config.json* file in the *swa-db-connections* folder.

1. Paste in this sample into file *staticwebapp.database.config.json* you generated.

```json
{
  "$schema": "https://github.com/Azure/data-api-builder/releases/latest/download/dab.draft.schema.json",
  "data-source": {
    "database-type": "mysql",
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

Before moving on to the next step, review the following table that explains different aspects of the configuration file. For full documentation on the configuration file, refer to [Data API Builder documentation](/azure/data-api-builder/configuration-file).

| Feature | Explanation |
|---|---|
| **Database connection** | In development, the runtime reads the connection string from the value of the connection string in the configuration file. While you can specify your connection string directly in the configuration file, a best practice is to store connection strings in a local environment variable. You can refer to environment variable values in the configuration file via the `@env('DATABASE_CONNECTION_STRING')` notation. The value of the connection string gets overwritten by Static Web Apps for the deployed site with the information collected when you connect your database. |
| **API endpoint** | The REST endpoint is available via `/data-api/rest` while the GraphQL endpoint is available through `/data-api/graphql` as configured in this configuration file. You may configure the REST and GraphQL paths, but the `/data-api` prefix isn't configurable. |
| **API Security** | The `runtime.host.cors` settings allow you to define allowed origins that can make requests to the API. In this case, the configuration reflects a development environment and allowlists the *http://localhost:4280* location. |
| **Entity model** | Defines the entities exposed via routes in the REST API, or as types in the GraphQL schema. In this case, the name *Person*, is the name exposed to the endpoint while `entities.<NAME>.source` is the database schema and table mapping. Notice how the API endpoint name doesn't need to be identical to the table name. |
| **Entity security** | Permissions rules listed in the `entity.<NAME>.permissions` array control the authorization settings for an entity. You can secure an entity with roles in the same way you [secure routes with roles](./configuration.md#securing-routes-with-roles).  |

> [!NOTE]
> The configuration file's `connection-string`, `host.mode`, and `graphql.allow-introspection` properties are overwritten when you deploy your site. Your connection string is overwritten with the authentication details collected when you connect your database to your Static Web Apps resource. The `host.mode` property is set to `production`, and the `graphql.allow-introspection` is set to `false`. These overrides provide consistency in your configuration files across your development and production workloads, while ensuring your Static Web Apps resource with database connections enabled is secure and production-ready.

With the static web app configured to connect to the database, you can now verify the connection.

[!INCLUDE [Database connection  - client code](../../includes/static-web-apps-database-connection-client-code.md)]

## Connect the database to your static web app

Use the following steps to create a connection between the Static Web Apps instance of your site and your database.

1. Open your static web app in the Azure portal.

1. In the *Settings* section, select **Database connection**.

1. Under the *Production* section, select the **Link existing database** link.

1. In the *Link existing database* window, enter the following values:

    | Property | Value |
    |---|---|
    | Database Type | Select your database type from the dropdown list. |
    | Subscription | Select your Azure subscription from the dropdown list. |
    | Resource Name | Select the database server name that has your desired database. |
    | Database Name | Select the name of the database you want to link to your static web app. |
    | Authentication Type | Select **Connection string**, and enter the MySQL user name and password. |

1. Select **OK**.

## Verify that your database is connected to your Static Web Apps resource

Once you've connected your database to your static web app and the site is finished building, use the following steps to verify the database connection.

1. Open your static web app in the Azure portal.

1. In the *Essentials* section, select the **URL** of your Static Web Apps resource to navigate to your static web app.

1. Select the **List** button to list all items.

    The output should resemble what's shown in this screenshot.

    :::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from listing records from the database in the developer tools console window.":::

## Clean up resources

If you want to remove the resources created during this tutorial, you need to unlink the database and remove the sample data.

1. **Unlink database**: Open your static web app in the Azure portal. Under the *Settings* section, select **Database connection**. Next to the linked database, select **View details**. In the *Database connection details* window, select the **Unlink** button.

1. **Remove sample data**: In your database, delete the table named `MyTestPersonTable`.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
