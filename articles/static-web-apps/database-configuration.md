---
title: Database connection configuration in Azure Static Web Apps
description: Configure your static web app to connect to a database.
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/02/2023
---

# Database connection configuration in Azure Static Web Apps (preview)

Each database requires configuration to work with Static Web Apps database connections.

You need to:

- Configure your database's firewall to accept network access from the Static Web Apps workers.
- Allow network access from Azure resources.

Use this table for details about firewall and Managed Identity configuration for your database.

| Name | Type | Firewall | Managed Identity |
|---|---|---|---|
| [Cosmos DB](/azure/cosmos-db/distributed-nosql) |  | [Configure firewall](/azure/cosmos-db/how-to-configure-firewall#configure-ip-policy) | [Configure Managed Identity](/azure/cosmos-db/managed-identity-based-authentication) |
| [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql&preserve-view=true) |  | [Configure firewall](/azure/azure-sql/database/firewall-configure?view=azuresql&preserve-view=true#connections-from-inside-azure) | [Configure Managed Identity](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity?view=azuresql&preserve-view=true) |
| [Azure Database for MySQL](/azure/mysql/single-server/overview#azure-database-for-mysql---flexible-server) | Flex | [Configure firewall](/azure/mysql/flexible-server/concepts-networking-public#allow-all-azure-ip-addresses) | [Configure Managed Identity](/azure/mysql/flexible-server/how-to-azure-ad) |
| [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) | Flex | [Configure firewall](/azure/postgresql/flexible-server/concepts-networking#allowing-all-azure-ip-addresses) | [Configure Managed Identity](/azure/postgresql/flexible-server/how-to-connect-with-managed-identity) |
| [Azure Database for PostgreSQL (single)](/azure/postgresql/single-server/overview-single-server) | Single | [Configure firewall](/azure/postgresql/single-server/concepts-firewall-rules#connecting-from-azure) | [Configure Managed Identity](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connect-from-function-app-with-managed-identity-to-azure/ba-p/1517032) |

Once your database security settings are properly configured, you can connect a database to your static web app.

## Next steps

> [!div class="nextstepaction"]
> [Add a database to your static web app](database-add.md)