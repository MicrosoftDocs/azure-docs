---
title: Use Robo 3T to connect to Azure Cosmos DB for MongoDB vCore
description: Learn how to connect to Azure Cosmos DB for MongoDB vCore using Robo 3T
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 07/07/2023
author: lucasbfernandes
ms.author: lucasbo
---
# Use Robo 3T with Azure Cosmos DB's API for MongoDB vCore
[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

To connect to Azure Cosmos DB account using Robo 3T, you must:

* Download and install [Robo 3T](https://robomongo.org/)
* Have your Azure Cosmos DB [connection string](quickstart-portal.md#get-cluster-credentials) information

> [!NOTE]
> Currently, Robo 3T v1.2 and lower versions are supported with Azure Cosmos DB's API for MongoDB vCore.

## Connect using Robo 3T

To add your Azure Cosmos DB account to the Robo 3T connection manager, perform the following steps:

1. Retrieve the connection information for your Azure Cosmos DB account configured with Azure Cosmos DB's API MongoDB vCore using the instructions [here](quickstart-portal.md#get-cluster-credentials).

    :::image type="content" source="./media/connect-using-robomongo/connectionstring.png" alt-text="Screenshot of the connection string page":::
2. Run the *Robo 3T* application.

3. Click the connection button under **File** to manage your connections. Then, click **New Connection** in the **Connection Manager** window, which will open up another window where you can paste the connection credentials.

4. In the connection credentials window, choose the first option and paste your Azure Cosmos DB for MongoDB vCore connection string.

    :::image type="content" source="./media/connect-using-robomongo/connectionconfiguration.png" alt-text="Screenshot of the Robo 3T connection credentials window":::
5. On the **SSL** tab, check **Use SSL protocol to connect**.

    :::image type="content" source="./media/connect-using-robomongo/connectionssl.png" alt-text="Screenshot of the Robo 3T new connection SSL Tab":::
6. Finally, click **Test Connection** in the bottom left to verify that you are able to connect, then click **Save**.
