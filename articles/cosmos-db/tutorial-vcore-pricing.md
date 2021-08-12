---
title: 'Tutorial: Convert the number of vcores-per-server or vCPU-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration'
description: 'Tutorial: Convert the number of vcores-per-server or vCPU-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration'
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: tutorial
ms.date: 08/12/2021
---
# Tutorial: Convert the number of vcores-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

In this article, we show you how to estimate Azure Cosmos DB RU/s in the scenario where you need to compare total cost of ownership (TCO) between your status-quo nonrelational database solution and Azure Cosmos DB, i.e. if you are considering planning an app migration or data migration to Azure Cosmos DB. This tutorial helps you to generate a ballpark TCO comparison regardless of what nonrelational database solution you currently employ, and regardless of whether your status-quo database solution is self-managed on-premise, self-managed in the cloud, or managed by a PaaS database service.

1. Identify the number of vcores-per-server or vCPU-per-server in your status quo solution

2. Convert vcores-per-server or vCPU-per-server to RU/s

    | vCores/vCPU | RU/s (SQL API) | RU/s (Mongo API) | RU/s (Cassandra API) | RU/s (Gremlin API) |
    |-------------|----------------|------------------|----------------------|--------------------|
    | 1           | 615            |            1000  | -                    | -                  |
    | 2           | 1230            |            2000  | -                    | -                  |
    | 4           | 2460            |            4000  | -                    | -                  |
    | 8           | 4920            |            8000  | -                    | -                  |
    | 16           | 9840            |            16000  | -                    | -                  |
    | 32           | 19680            |            32000  | -                    | -                  |
    | 64           | 39360            |            64000  | -                    | -                  |
    | 128           | 78720            |            128000  | -                    | -                  |

3. Compare TCO

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the SQL APIs

You can now proceed to the next tutorial to learn how to develop locally using the Azure Cosmos DB local emulator.

> [!div class="nextstepaction"]
> [Develop locally with the emulator](local-emulator.md)

[regions]: https://azure.microsoft.com/regions/