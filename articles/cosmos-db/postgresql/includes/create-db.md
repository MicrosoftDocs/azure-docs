---
 title: include file
 description: include file
 author: jonels-msft
 ms.service: cosmos-db
 ms.subservice: postgresql
 ms.topic: include
 ms.date: 06/06/2023
 ms.author: jonels
ms.custom: include file, ignite-2022
---

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Create a cluster

Sign in to the [Azure portal](https://portal.azure.com) and follow these steps to create an Azure Cosmos DB for PostgreSQL cluster:

# [Direct link](#tab/direct)

Go to [Create an Azure Cosmos DB for PostgreSQL cluster](https://portal.azure.com/#view/Microsoft_Azure_DocumentDB/CreatePostgreSQL.ReactView) in the Azure portal.

# [Portal search](#tab/portal-search)

1. In the [Azure portal](https://portal.azure.com), search for *cosmosdb* and select **Azure Cosmos DB** from the results.

   :::image type="content" source="media/quickstart-create-portal/portal-search.png" alt-text="Screenshot showing search for cosmosdb.":::

1. On the **Azure Cosmos DB** screen, select **Create**.

   :::image type="content" source="media/quickstart-create-portal/create-button.png" alt-text="Screenshot showing Create for Azure Cosmos DB.":::

1. On the **Select API option** screen, select **Create** on the **PostgreSQL** tile.

   :::image type="content" source="media/quickstart-create-portal/deployment-option.png" alt-text="Screenshot of the Select API options screen.":::

---

On the **Create an Azure Cosmos DB for PostgreSQL cluster** form:

1. Fill out the information on the **Basics** tab.

   :::image type="content" source="media/quickstart-create-portal/basics.png" alt-text="Screenshot showing the Basics tab of the Create screen.":::

   Most options are self-explanatory, but keep in mind:

   * The cluster name determines the DNS name your applications use to connect, in the form `<node-qualifier>-<clustername>.<uniqueID>.postgres.cosmos.azure.com`.
   * You can choose a major PostgreSQL version such as 15. Azure Cosmos DB for PostgreSQL always supports the latest Citus version for the selected major Postgres version.
   * The admin username must be the value `citus`.
   * You can leave database name at its default value 'citus' or define your only database name. You can't rename database after cluster provisioning.

1. Select **Next : Networking** at the bottom of the screen.
1. On the **Networking** screen, select **Allow public access from Azure services and resources within Azure to this cluster**.

   :::image type="content" source="media/quickstart-create-portal/networking.png" alt-text="Screenshot showing the Networking tab of the Create screen.":::

1. Select **Review + create**, and when validation passes, select **Create** to create the cluster.

1. Provisioning takes a few minutes. The page redirects to monitor deployment. When the status changes
   from **Deployment is in progress** to **Your deployment is complete**, select **Go to resource**.
