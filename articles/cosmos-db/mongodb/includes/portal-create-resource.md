---
author: diberry
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
> [!TIP]
> For this quickstart, we recommend using the resource group name ``msdocs-cosmos-quickstart-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Select API option** page, select the **Create** option within the **MongoDB** section. Azure Cosmos DB has five APIs: SQL, MongoDB, Gremlin, Table, and Cassandra. [Learn more about the API for MongoDB](../../introduction.md).

   :::image type="content" source="../media/quickstart-nodejs/cosmos-api-choices.png" lightbox="../media/quickstart-nodejs/cosmos-api-choices.png" alt-text="Screenshot of select API option page for Azure Cosmos DB DB.":::

1. On the **Create Azure Cosmos DB Account** page, enter the following information:

   | Setting | Value | Description |
   | --- | --- | --- |
   | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos DB account. |
   | Resource Group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
   | Account Name | A unique name | Enter a name to identify your Azure Cosmos DB account. The name will be used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
   | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
   | Capacity mode |Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../../serverless.md) mode. |
   | Apply Azure Cosmos DB free tier discount | **Apply** or **Do not apply** |With Azure Cosmos DB free tier, you'll get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/). |
   | Version | MongoDB version  | Select the MongoDB server version that matches your application requirements.

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

   :::image type="content" source="../media/quickstart-nodejs/new-cosmos-account-page.png" lightbox="../media/quickstart-nodejs/new-cosmos-account-page.png" alt-text="Screenshot of new account page for Azure Cosmos DB DB SQL API.":::

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB account page. 

   :::image type="content" source="../media/quickstart-nodejs/cosmos-deployment-complete.png" lightbox="../media/quickstart-nodejs/cosmos-deployment-complete.png" alt-text="Screenshot of deployment page for Azure Cosmos DB DB SQL API resource.":::
