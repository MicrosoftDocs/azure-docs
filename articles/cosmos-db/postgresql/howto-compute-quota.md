---
title: Change compute quotas - Azure portal - Azure Cosmos DB for PostgreSQL
description: Learn how to increase vCore quotas per region in Azure Cosmos DB for PostgreSQL from the Azure portal.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/30/2023
---

# Change compute quotas in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure enforces a vCore quota per subscription per region. There are two
independently adjustable limits: vCores for coordinator nodes, and vCores for
worker nodes.

## Request quota increase

1. Select **New Support Request** in the Azure portal menu for your
   cluster.
2. Fill out **Summary** with the quota increase request for your region, for
   example *Quota increase in West Europe region.*
3. These fields should be autoselected, but verify:
   - **Issue Type** should be **Technical**.
   - **Service type** should be **Azure Cosmos DB for PostgreSQL**.
4. For **Problem type**, select **Create, Update, and Drop Resources**.
5. For **Problem subtype**, select **Scaling Compute**.
6. Select **Next** to view recommended solutions, and then select **Return to support request**.
7. Select **Next** again. Under **Problem details**, provide the following information:
   - For **When did the problem start**, the date, time, and timezone when the problem started, or select **Not sure, use current time**.
   - For **Description**, quota increase details, for example *Need to increase worker node quota in West Europe to 512 vCores*.

:::image type="content" source="media/howto-compute-quota/support-request.png" alt-text="Screenshot that shows a support request in the Azure portal.":::

## Next steps

* Learn about other [quotas and limits](reference-limits.md).
