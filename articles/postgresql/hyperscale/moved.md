---
title: Where is Azure Database for PostgreSQL - Hyperscale (Citus)
description: Hyperscale (Citus) is now Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
recommendations: false
ms.date: 10/13/2022
---

# Azure Database for PostgreSQL - Hyperscale (Citus) is now Azure Cosmos DB for PostgreSQL

Existing Hyperscale (Citus) server groups will automatically become [Azure
Cosmos DB for PostgreSQL](../../cosmos-db/postgresql/introduction.md) clusters
under the new name, with zero downtime.  All features and pricing, including
reserved compute pricing and regional availability, will be preserved under the
new name.

Once the name change is complete, all Hyperscale (Citus) information such as
product overview, pricing information, documentation, and more will be moved
under the Azure Cosmos DB sections in the Azure portal.

> [!NOTE]
>
> The name change in the Azure portal for existing Hyperscale (Citus) customers
> will happen at the end of October. During this process, the cluster may
> temporarily disappear in the Azure portal in both Hyperscale (Citus) and
> Azure Cosmos DB. There will be no service downtime for users of the database,
> only a possible interruption in the portal administrative interface.

## Find your cluster in the renamed service

View the list of Azure Cosmos DB for PostgreSQL clusters in your subscription.

# [Direct link](#tab/direct)

Go to the [list of Azure Cosmos DB for PostgreSQL clusters](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DocumentDb%2FdatabaseAccounts) in the Azure portal.

# [Portal search](#tab/portal-search)

In the [Azure portal](https://portal.azure.com), search for `cosmosdb` and
select **Azure Cosmos DB** from the results.

:::image type="content" source="media/moved/portal-search.png" alt-text="Screenshot showing search for cosmosdb.":::

---

Your cluster will appear in this list. Once it's listed in Azure Cosmos DB, it
will no longer appear as an Azure Database for PostgreSQL server group.

## Next steps

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for PostgreSQL >](../../cosmos-db/postgresql/quickstart-create-portal.md)
