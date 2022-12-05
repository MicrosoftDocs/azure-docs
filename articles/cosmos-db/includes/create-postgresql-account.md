---
services: cosmos-db
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: include
ms.date: 11/07/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: include file
---

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Select API option** page, select the **Create** option within the **PostgreSQL** section. Azure Cosmos DB has six APIs: NoSQL, MongoDB, PostgreSQL, Apache Cassandra, Apache Gremlin, and Table. [Learn more about the API for PostgreSQL](../postgresql/index.yml).

    :::image type="content" source="media/create-postgresql-account/api-choices.png" lightbox="media/create-postgresql-account/api-choices.png" alt-text="Screenshot of select API option page for Azure Cosmos DB.":::

1. On the **Create an Azure Cosmos DB for PostgreSQL cluster** page, enter the following information:

    | Setting | Value |
    | --- | --- |
    | Subscription | Select the Azure subscription that you wish to use for this Azure Cosmos account. |
    | Resource Group | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    | Cluster Name | Enter a name to identify your Azure Cosmos account. The name will be used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
    | Location | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
    | Scale | Leave to default setting. |
    | PostgreSQL version | Select version **14**. |
    | Admin username | Leave to default setting (**citus**). |
    | Password | Enter a unique password for the admin user. |

   :::image type="content" source="media/create-postgresql-account/new-account.png" lightbox="media/create-postgresql-account/new-account.png" alt-text="Screenshot of new account page for API for PostgreSQL.":::

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB for PostgreSQL account page.

   :::image type="content" source="media/create-postgresql-account/deployment-complete.png" lightbox="media/create-postgresql-account/deployment-complete.png" alt-text="Screenshot of deployment page for an API for PostgreSQL resource.":::
