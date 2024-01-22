---
title: Use Robo 3T to connect to Azure Cosmos DB
description: Learn how to connect to Azure Cosmos DB using Robo 3T and Azure Cosmos DB's API for MongoDB
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 08/26/2021
author: gahl-levy
ms.author: gahllevy
---
# Use Robo 3T with Azure Cosmos DB's API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

To connect to Azure Cosmos DB account using Robo 3T, you must:

* Download and install [Robo 3T](https://robomongo.org/)
* Have your Azure Cosmos DB [connection string](connect-account.md) information

## Connect using Robo 3T

To add your Azure Cosmos DB account to the Robo 3T connection manager, perform the following steps:

1. Retrieve the connection information for your Azure Cosmos DB account configured with Azure Cosmos DB's API MongoDB using the instructions [here](connect-account.md).

    :::image type="content" source="./media/connect-using-robomongo/connectionstringblade.png" alt-text="Screenshot of the connection string blade":::
2. Run the *Robomongo* application.

3. Click the connection button under **File** to manage your connections. Then, click **Create** in the **MongoDB Connections** window, which will open up the **Connection Settings** window.

4. In the **Connection Settings** window, choose a name. Then, find the **Host** and **Port** from your connection information in Step 1 and enter them into **Address** and **Port**, respectively.

    :::image type="content" source="./media/connect-using-robomongo/manageconnections.png" alt-text="Screenshot of the Robomongo Manage Connections":::
5. On the **Authentication** tab, click **Perform authentication**. Then, enter your Database (default is *Admin*), **User Name** and **Password**.
Both **User Name** and **Password** can be found in your connection information in Step 1.

    :::image type="content" source="./media/connect-using-robomongo/authentication.png" alt-text="Screenshot of the Robomongo Authentication Tab":::
6. On the **SSL** tab, check **Use SSL protocol**, then change the **Authentication Method** to **Self-signed Certificate**.

    :::image type="content" source="./media/connect-using-robomongo/ssl.png" alt-text="Screenshot of the Robomongo SSL Tab":::
7. Finally, click **Test** to verify that you are able to connect, then **Save**.

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB's API for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
