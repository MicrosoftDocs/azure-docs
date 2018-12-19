---
title: Use Robomongo for Azure Cosmos DB
description: 'Learn how to use Robomongo with an Azure Cosmos DB for MongoDB API account'
keywords: robomongo
services: cosmos-db
author: SnehaGunda

ms.service: cosmos-db
ms.component: cosmosdb-mongo
ms.topic: conceptual
ms.date: 05/23/2017
ms.author: sngun

---
# Use Robomongo with an Azure Cosmos DB for MongoDB API account
To connect to an Azure Cosmos DB for MongoDB API account using Robomongo, you must:

* Download and install [Robomongo](https://robomongo.org/)
* Have your Azure Cosmos DB for MongoDB API account [connection string](connect-mongodb-account.md) information

## Connect using Robomongo
To add your Azure Cosmos DB for MongoDB API account to the Robomongo MongoDB Connections, perform the following steps.

1. Retrieve your Azure Cosmos DB for MongoDB API account connection information using the instructions [here](connect-mongodb-account.md).

    ![Screen shot of the connection string blade](./media/mongodb-robomongo/connectionstringblade.png)
2. Run *Robomongo.exe*

3. Click the connection button under **File** to manage your connections. Then, click **Create** in the **MongoDB Connections** window, which will open up the **Connection Settings** window.

4. In the **Connection Settings** window, choose a name. Then, find the **Host** and **Port** from your connection information in Step 1 and enter them into **Address** and **Port**, respectively.

    ![Screen shot of the Robomongo Manage Connections](./media/mongodb-robomongo/manageconnections.png)
5. On the **Authentication** tab, click **Perform authentication**. Then, enter your Database (default is *Admin*), **User Name** and **Password**.
Both **User Name** and **Password** can be found in your connection information in Step 1.

    ![Screen shot of the Robomongo Authentication Tab](./media/mongodb-robomongo/authentication.png)
6. On the **SSL** tab, check **Use SSL protocol**, then change the **Authentication Method** to **Self-signed Certificate**.

    ![Screen shot of the Robomongo SSL Tab](./media/mongodb-robomongo/SSL.png)
7. Finally, click **Test** to verify that you are able to connect, then **Save**.

## Next steps
* Explore Azure Cosmos DB for MongoDB API [samples](mongodb-samples.md).
