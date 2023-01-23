---
title: Database connection configuration in Azure Static Web Apps
description: Configure your static web app to connect to a database.
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 01/23/23
---

# Database connection configuration in Azure Static Web Apps (preview)

In order to allow access to your database, your database must:

Configure your database's firewall to accept network access from Static Web Apps' workers. You must allow network access from Azure resources. To configure this, refer to the below documentation according to your database type.

| Type | If using Managed Identity |
|---|---|
| [CosmosDB](/azure/cosmos-db/how-to-configure-firewall#configure-ip-policy) | [Configure Managed Identity](/azure/cosmos-db/managed-identity-based-authentication) |
| [Azure SQL](/azure/azure-sql/database/firewall-configure?view=azuresql#connections-from-inside-azure) | [Configure Managed Identity](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity?view=azuresql) |
| [Azure Database for MySQL (flex)](/azure/mysql/flexible-server/concepts-networking-public#allow-all-azure-ip-addresses) | [Configure Managed Identity](/azure/mysql/flexible-server/how-to-azure-ad) |
| [Azure Database for PostgreSQL (flex)](/azure/postgresql/flexible-server/concepts-networking#allowing-all-azure-ip-addresses) | [Configure Managed Identity](/azure/postgresql/flexible-server/how-to-connect-with-managed-identity) |
| [Azure Database for PostgreSQL (single)](/azure/postgresql/single-server/concepts-firewall-rules#connecting-from-azure) | [Configure Managed Identity](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connect-from-function-app-with-managed-identity-to-azure/ba-p/1517032) |

## Next steps

> [!div class="nextstepaction"]
> [Add a database to your static web app](database-add.md)