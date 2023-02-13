---
title: Database connection configuration in Azure Static Web Apps
description: Configure your static web app to connect to a database.
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/13/2023
---

# Database connection configuration in Azure Static Web Apps (preview)

Azure Static Web apps database connections work with various Azure databases.

As you connect a database to your static web app, you need to:

- Configure your database's firewall to accept network access from the Static Web Apps workers.
- If you're using the Managed Identity authentication type, then you need to configure your static web app's Managed Identity profile to access your database.

Use this table for details about firewall and Managed Identity configuration for your database.

| Name | Type | Firewall | Managed Identity |
|---|---|---|---|
| [Cosmos DB](/azure/cosmos-db/distributed-nosql) | Standard | [Configure firewall](/azure/cosmos-db/how-to-configure-firewall#configure-ip-policy) | [Configure Managed Identity](/azure/cosmos-db/managed-identity-based-authentication) |
| [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql&preserve-view=true) | Standard | [Configure firewall](/azure/azure-sql/database/firewall-configure?view=azuresql&preserve-view=true#connections-from-inside-azure) | [Configure Managed Identity](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity?view=azuresql&preserve-view=true) |
| [Azure Database for MySQL](/azure/mysql/single-server/overview#azure-database-for-mysql---flexible-server) | Flex | [Configure firewall](/azure/mysql/flexible-server/concepts-networking-public#allow-all-azure-ip-addresses) | [Configure Managed Identity](/azure/mysql/flexible-server/how-to-azure-ad) |
| [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) | Flex | [Configure firewall](/azure/postgresql/flexible-server/concepts-networking#allowing-all-azure-ip-addresses) | [Configure Managed Identity](/azure/postgresql/flexible-server/how-to-connect-with-managed-identity) |
| [Azure Database for PostgreSQL (single)](/azure/postgresql/single-server/overview-single-server) | Single | [Configure firewall](/azure/postgresql/single-server/concepts-firewall-rules#connecting-from-azure) | [Configure Managed Identity](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connect-from-function-app-with-managed-identity-to-azure/ba-p/1517032) |

Once your database security settings are properly configured, you can connect a database to your static web app.

There are two steps required to configure a database for your static web app: update workflow configuration and link a database.

## Update workflow configuration

1. Open your static web app's workflow configuration file.

1. Under `output_location`, create a new line with the key `data_api_location`. Set the value to the folder name where the *staticwebapps.database.config.json* file is located.

Here's a sample configuration where `data_api_location` is set to the folder named `db-config`.

```yml
app_location: "/src"
api_location: "api"
output_location: "/dist"
data_api_location: "db-config" # Folder holding the staticwebapps.database.config.json file
```

## Link a database

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

> [!div class="nextstepaction"]
> [Add a database to your static web app](database-add.md)