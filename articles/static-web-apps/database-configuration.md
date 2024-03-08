---
title: Database connection configuration in Azure Static Web Apps
description: Configure your static web app to connect to a database.
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 03/15/2023
---

# Database connection configuration in Azure Static Web Apps (preview)

Azure Static Web apps database connections work with various Azure databases.

As you connect a database to your static web app, you need to configure your database's firewall to accept network access from the Static Web Apps workers by allowing network access from Azure resources. Allowing specific Static Web Apps IP addresses isn't supported.

If you're using the Managed Identity authentication type, then you need to configure your static web app's Managed Identity profile to access your database.

Use this table for details about firewall and Managed Identity configuration for your database.

| Name | Type | Firewall | Managed Identity |
|---|---|---|---|
| [Azure Cosmos DB](/azure/cosmos-db/distributed-nosql) | Standard | [Configure firewall](/azure/cosmos-db/how-to-configure-firewall#configure-ip-policy) | [Configure Managed Identity](/azure/cosmos-db/managed-identity-based-authentication) |
| [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql&preserve-view=true) | Standard | [Configure firewall](/azure/azure-sql/database/firewall-configure?view=azuresql&preserve-view=true#connections-from-inside-azure) | [Configure Managed Identity](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity?view=azuresql&preserve-view=true) |
| [Azure Database for MySQL](/azure/mysql/single-server/overview#azure-database-for-mysql---flexible-server) | Flex | [Configure firewall](/azure/mysql/flexible-server/concepts-networking-public#allow-all-azure-ip-addresses) | Not supported |
| [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) | Flex | [Configure firewall](/azure/postgresql/flexible-server/concepts-networking#allowing-all-azure-ip-addresses) | Not supported |
| [Azure Database for PostgreSQL (single)](/azure/postgresql/single-server/overview-single-server) | Single | [Configure firewall](/azure/postgresql/single-server/concepts-firewall-rules#connecting-from-azure) | [Configure Managed Identity](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connect-from-function-app-with-managed-identity-to-azure/ba-p/1517032) |

## Configuration

You define the runtime behavior of the database connection in the `staticwebapp.database.config.json` file. Before you link a database to your static web app, you need to create this file within your repository. By convention, this file exists in the *swa-db-connections* folder at the root of your repository, but you can [relocate](#custom-configuration-folder) it if you wish.

The purpose of the configuration file is to:

- Map paths off the `/data-api` endpoint to your database tables or entities
- Expose REST or GraphQL endpoints (or both)
- Define entity security rules
- Control development configuration settings

If you're using Azure Cosmos DB with GraphQL, you also need to provide a [`gql` schema file](/azure/data-api-builder/get-started/get-started-azure-cosmos-db#add-book-schema-file).

> [!NOTE]
> Static Web Apps database connections requires a folder containing the configuration files.  This folder must contain the *staticwebapp.database.config.json* configuration file for all database types. For Cosmos DB for NoSQL databases, a *staticwebapp.database.schema.gql* schema file is also required. 
> 
> By convention, this folder is named *swa-db-connections* and placed at the root of the repository. This convention can be overridden with a [custom-configuration-folder](#custom-configuration-folder).

## Sample configuration file

The following sample configuration file shows you how to connect to an Azure SQL database and expose both REST and GraphQL endpoints. For full details on the configuration file and its supported features, refer to the [Data API Builder documentation](/azure/data-api-builder/configuration-file).

```json
{
  "$schema": "https://github.com/Azure/data-api-builder/releases/latest/download/dab.draft.schema.json",
  "data-source": {
    "database-type": "mssql",
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
      "source": "dbo.MyTestPersonTable",
      "permissions": [
        {
          "actions": ["create", "read", "update", "delete"],
          "role": "anonymous"
        }
      ]
    }
  }
}
```

| Property | Description |
|---|---|
| `$schema` | The version of the [Database API builder](/azure/data-api-builder/) used by Azure Static Web Apps to interpret the configuration file. |
| `data-source` | Configuration settings specific to the target database. The `database-type` property accepts `mssql`, `postgresql`, `cosmosdb_nosql`, or `mysql`.<br><br>The connection string is overwritten upon deployment when a database is connected to your Static Web Apps resource. During local development, the connection string defined in the configuration file is what is used to connect to the database.  |
| `runtime` | Section that defines the exposed endpoints. The `rest` and `graphql` properties control the URL fragment used to access the respective API protocol. The `host` configuration section defines settings specific to your development environment. Make sure the `origins` array include your localhost address and port. The host.mode is overwritten to `production` when a database is connected to your Static Web Apps resource. |
| `entities` | Section that maps URL path to database entities and tables. The same [role-based authentication rules](configuration.md#authentication) used to secure paths also secure database entities, and can be used to define permissions for each entity. The entities object also specifies the relationships between entities. |

### Generate configuration file

The [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli) allows you to generate a configuration file stub.

Use the `swa db init --database-type <YOUR_DATABASE_TYPE>` to generate a configuration file. By default, the CLI creates a new *staticwebapp.database.config.json* in a folder named *swa-db-connections*.

Supported database types include:

- `mssql`
- `postgresql`
- `cosmosdb_nosql`
- `mysql`

### Custom configuration folder

The default folder name for the *staticwebapp.database.config.json* file is *swa-db-connections*. If you'd like to use a different folder, you need to update your workflow file to tell the static web apps runtime where to find your configuration file. The `data_api_location` property allows you to define the location of your configuration folder.

> [!NOTE]
> Folder that holds the *staticwebapp.database.config.json* file must be at the root of your static web apps repository.

The following code shows you how to use a folder named *db-config* for the database configuration file.

```yml
app_location: "/src"
api_location: "api"
output_location: "/dist"
data_api_location: "db-config" # Folder holding the staticwebapp.database.config.json file
```


## Configure database connectivity

Azure Static Web Apps must have network access to your database for database connections to work. Additionally, to use an Azure database for local development, you need to configure your database to allow requests from your own IP address. The following are generic steps that apply to all databases. For specific steps for your database type, refer to the above links.

- Go to your database in the [Azure portal](https://portal.azure.com).
- Go to the Networking tab.
- Under the Firewall rules section, select **Add your client IPv4 address**. This step ensures that you can use this database for your local development.
- Select the **Allow Azure services and resources to access this server** checkbox. This step ensures that your deployed Static Web Apps resource can access your database.
- Select **Save**.

## Connect a database

Linking a database to your static web app establishes the production connection between your website and database when published to Azure.

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
    | Authentication Type | Select the connection type required to connect to your database. |

## Next steps

Add a database to your static web app using one of the following databases:

- [Azure Cosmos DB](database-azure-cosmos-db.md)
- [Azure SQL](database-azure-sql.md)
- [MySQL](database-mysql.md)
- [PostgreSQL](database-postgresql.md)
