---
title: "Tutorial: Add an Azure Cosmos DB database connection in Azure Static Web Apps"
description: Learn to add a  Azure Cosmos DB database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 02/28/2023
zone_pivot_groups: static-web-apps-api-protocols
---

# Tutorial: Add an Azure Cosmos DB database connection in Azure Static Web Apps (preview)

In this tutorial, you learn how to connect an Azure Cosmos DB for NoSQL database to your static web app. Once configured, you can make REST or GraphQL requests to the built-in `/data-api` endpoint to manipulate data without having to write backend code.

For the sake of simplicity, this tutorial shows you how to use an Azure database for local development purposes, but you may also use a local database server for your local development needs.

> [!NOTE]
> This tutorial shows how to use Azure Cosmos DB for NoSQL. If you would like to use another database, refer to the [Azure SQL](database-azure-sql.md), [MySQL](database-mysql.md), or [PostgreSQL](database-postgresql.md) tutorials.

:::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from Cosmos DB in the developer tools console window.":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Link a Azure Cosmos DB for NoSQL database to your static web app
> * Create, read, update, and delete data

## Prerequisites

To complete this tutorial, you need to have an existing Azure Cosmos DB for NoSQL database and static web app.

| Resource | Description |
|---|---|
| [Azure CosmosDB for NoSQL Database/azure/cosmos-db/nosql/quickstart-portal) | If you don't already have one, follow the steps in the [Create an Azure Cosmos DB database](/azure/cosmos-db/nosql/quickstart-portal) guide. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide to create a *No Framework* static web app. |

Begin by configuring your database to work with the Azure Static Web Apps database connection feature.

## Configure database connectivity

Azure Static Web Apps must have network access to your database for database connections to work. Additionally, to use an Azure database for local development, you need to configure your database to allow requests from your own IP address.

1. Go to your Azure CosmosDB for NoSQL account in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Networking**.

1. Under the *Public access* section, select **All networks**. This action allows you to use the cloud database for local development, that your deployed Static Web Apps resource can access your database, and that you can query your database from the portal. 

1. Select **Save**.

## Get database connection string for local development

To use your Azure database for local development, you need to retrieve the connection string of your database. You may skip this step if you plan to use a local database for development purposes.

1. Go to your Azure Cosmos DB for NoSQL account in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Keys**.

1. From the *PRIMARY CONNECTION STRING* box, copy the connection string and set it aside in a text editor.

## Create sample data

Create a sample table and seed it with sample data to match the tutorial.

1. On the left-hand navigation window, select **Data Explorer**.

1. Select **New Container**. Enter the Database ID as `Create new`, and enter `MyTestPersonDatabase` as value.

1. Enter the Container ID of `MyTestPersonTable`.

1. Enter a partition key of `Id` (this will be prefixed by `/`).

1. Select **OK**.

1. Select the *MyTestPersonTable* container. 

1. Select its *Items*.

1. Select **New Item** and enter the following value:

```
{
    "id": "1",
    "Name": "Sunny"
}
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
    export DATABASE_CONNECTION_STRING="<YOUR_CONNECTION_STRING>"
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
    swa db init --database-type cosmosdb_nosql --cosmosdb_nosql-database MyTestPersonDatabase
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    swa db init --database-type cosmosdb_nosql --cosmosdb_nosql-database MyTestPersonDatabase
    ```

    ---

    The `init` command creates the *staticwebapp.database.config.json* file in the *swa-db-connections* folder.

1. Paste in this sample schema into the *staticwebapp.schema.config.json* file you generated.

    Since Cosmos DB for NoSQL is a document database, Azure Static Web Apps database connections cannot extract the schema of your database. The *staticwebapp.schema.config.json* file allows you to specify the schema of your Cosmos DB for NoSQL database for Static Web Apps.

    ```gql
    type Person @model {
      Id: ID
      Name: String
    }
    ```

1. Paste in this sample configuration into file *staticwebapp.database.config.json* you generated. Notice that CosmosDB for NoSQL has additional options in the `data-source` object to indicate the CosmosDB database and the schema file needed for database connections to understand the schema of the database.

```json
{
  "$schema": "https://go.microsoft.com/fwlink/?linkid=2226079",
  "data-source": {
    "database-type": "cosmosdb_nosql",
    "options": {
      "database": "MyTestPersonDatabase",
      "schema": "staticwebapp.database.schema.gql",
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
