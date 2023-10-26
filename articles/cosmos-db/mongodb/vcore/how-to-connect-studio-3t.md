---
title: Use Studio 3T to connect
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Connect to an Azure Cosmos DB for MongoDB vCore account using the Studio 3T community tool to query data.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 08/28/2023
# CustomerIntent: As a database owner, I want to use Studio 3T so that I can connect to and query my collections.
---

# Use Studio 3T to connect to Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Studio 3T (also known as Robomongo or Robo 3T) is a professional GUI that offers IDE & client tools for MongoDB. It's a popular community tool to speed up MongoDB development with a straightforward user interface.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).
- [Studio 3T](https://robomongo.org/) community tool

## Connect using Studio 3T

To add your Azure Cosmos DB cluster to the Studio 3T connection manager, perform the following steps:

1. Retrieve the connection information for your Azure Cosmos DB for MongoDB vCore using the instructions [here](quickstart-portal.md#get-cluster-credentials).

    :::image type="content" source="./media/connect-using-robomongo/connection-string.png" alt-text="Screenshot of the connection string page.":::

1. Run the **Studio 3T** application.

1. Select the connection button under **File** to manage your connections. Then, select **New Connection** in the **Connection Manager** window, which opens another window where you can paste the connection credentials.

1. In the connection credentials window, choose the first option and paste your connection string. Select **Next** to move forward.

    :::image type="content" source="./media/connect-using-robomongo/new-connection.png" alt-text="Screenshot of the Studio 3T connection credentials window.":::

1. Choose a **Connection name** and double check your connection credentials.

    :::image type="content" source="./media/connect-using-robomongo/connection-configuration.png" alt-text="Screenshot of the Studio 3T connection details window.":::

1. On the **SSL** tab, check **Use SSL protocol to connect**.

    :::image type="content" source="./media/connect-using-robomongo/connection-ssl.png" alt-text="Screenshot of the Studio 3T new connection TLS/SSL Tab.":::

1. Finally, select **Test Connection** in the bottom left to verify that you're able to connect, then select **Save**.

## Next step

> [!div class="nextstepaction"]
> [Migration options](migration-options.md)
