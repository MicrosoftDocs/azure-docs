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
# Use Studio 3T to connect to Azure Cosmos DB for MongoDB vCore
[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Studio 3T (also known as Robomongo or Robo 3T) is a professional GUI that offers IDE & client tools for MongoDB. It's a great tool to speed up MongoDB development with a friendly user interface. In order to connect to your Azure Cosmos DB for MongoDB vCore cluster using Studio 3T, you must:

* Download and install [Studio 3T](https://robomongo.org/)
* Have your Azure Cosmos DB for MongoDB vCore [connection string](quickstart-portal.md#get-cluster-credentials) information

## Connect using Studio 3T

To add your Azure Cosmos DB cluster to the Studio 3T connection manager, perform the following steps:

1. Retrieve the connection information for your Azure Cosmos DB for MongoDB vCore using the instructions [here](quickstart-portal.md#get-cluster-credentials).

    :::image type="content" source="./media/connect-using-robomongo/connection-string.png" alt-text="Screenshot of the connection string page.":::
2. Run the **Studio 3T** application.

3. Click the connection button under **File** to manage your connections. Then, click **New Connection** in the **Connection Manager** window, which will open up another window where you can paste the connection credentials.

4. In the connection credentials window, choose the first option and paste your connection string. Click **Next** to move forward.

    :::image type="content" source="./media/connect-using-robomongo/new-connection.png" alt-text="Screenshot of the Studio 3T connection credentials window.":::
5. Choose a **Connection name** and double check your connection credentials. 

    :::image type="content" source="./media/connect-using-robomongo/connection-configuration.png" alt-text="Screenshot of the Studio 3T connection details window.":::
6. On the **SSL** tab, check **Use SSL protocol to connect**.

    :::image type="content" source="./media/connect-using-robomongo/connection-ssl.png" alt-text="Screenshot of the Studio 3T new connection SSL Tab.":::
7. Finally, click **Test Connection** in the bottom left to verify that you are able to connect, then click **Save**.

## Next steps

- Learn [how to use Bicep templates](quickstart-bicep.md) to deploy your Azure Cosmos DB for MongoDB vCore cluster.
- Learn [how to connect your Nodejs web application](tutorial-nodejs-web-app.md) to a MongoDB vCore cluster.
- Check the [migration options](migration-options.md) to lift and shift your MongoDB workloads to Azure Cosmos DB for MongoDB vCore.