---
title: Use Studio 3T to connect to Azure Cosmos DB for MongoDB vCore
description: Learn how to connect to Azure Cosmos DB for MongoDB vCore using Studio 3T
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 07/07/2023
author: lucasbfernandes
ms.author: lucasbo
---
# Use Studio 3T with Azure Cosmos DB's API for MongoDB vCore
[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

To connect to Azure Cosmos DB account using Studio 3T, you must:

* Download and install [Studio 3T](https://robomongo.org/)
* Have your Azure Cosmos DB [connection string](quickstart-portal.md#get-cluster-credentials) information

> [!NOTE]
> Currently, Studio 3T v1.4.4 and lower versions are supported with Azure Cosmos DB's API for MongoDB vCore.

## Connect using Studio 3T

To add your Azure Cosmos DB account to the Studio 3T connection manager, perform the following steps:

1. Retrieve the connection information for your Azure Cosmos DB account configured with Azure Cosmos DB's API MongoDB vCore using the instructions [here](quickstart-portal.md#get-cluster-credentials).

    :::image type="content" source="./media/connect-using-robomongo/connectionstring.png" alt-text="Screenshot of the connection string page":::
2. Run the *Studio 3T* application.

3. Click the connection button under **File** to manage your connections. Then, click **New Connection** in the **Connection Manager** window, which will open up another window where you can paste the connection credentials.

4. In the connection credentials window, choose the first option and paste your Azure Cosmos DB for MongoDB vCore connection string. Click **Next** to move forward.

    :::image type="content" source="./media/connect-using-robomongo/newconnection.png" alt-text="Screenshot of the Studio 3T connection credentials window":::
5. Choose a **Connection name** and double check your connection credentials. 

    :::image type="content" source="./media/connect-using-robomongo/connectionconfiguration.png" alt-text="Screenshot of the Studio 3T connection details window":::
6. On the **SSL** tab, check **Use SSL protocol to connect**.

    :::image type="content" source="./media/connect-using-robomongo/connectionssl.png" alt-text="Screenshot of the Studio 3T new connection SSL Tab":::
7. Finally, click **Test Connection** in the bottom left to verify that you are able to connect, then click **Save**.
