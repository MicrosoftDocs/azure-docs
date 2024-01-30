---
title: Connect to Azure Cosmos DB using Compass
description: Learn how to use MongoDB Compass to store and manage data in Azure Cosmos DB.
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 08/26/2021
author: gahl-levy
ms.author: gahllevy
---

# Use MongoDB Compass to connect to Azure Cosmos DB's API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This tutorial demonstrates how to use [MongoDB Compass](https://www.mongodb.com/products/compass) when storing and/or managing data in Azure Cosmos DB. We use the Azure Cosmos DB's API for MongoDB for this walk-through. For those of you unfamiliar, Compass is a GUI for MongoDB. It is commonly used to visualize your data, run ad-hoc queries, along with managing your data.

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB.

## Prerequisites

To connect to your Azure Cosmos DB account using MongoDB Compass, you must:

* Download and install [Compass](https://www.mongodb.com/products/compass)
* Have your Azure Cosmos DB [connection string](connect-account.md) information

## Connect to Azure Cosmos DB's API for MongoDB

To connect your Azure Cosmos DB account to Compass, you can follow the below steps:

1. Retrieve the connection information for your Azure Cosmos DB account configured with Azure Cosmos DB's API MongoDB using the instructions [here](connect-account.md).

    :::image type="content" source="./media/connect-using-compass/mongodb-compass-connection.png" alt-text="Screenshot of the connection string blade":::

2. Click on the button that says **Copy to clipboard** next to your **Primary/Secondary connection string** in Azure Cosmos DB. Clicking this button will copy your entire connection string to your clipboard.

    :::image type="content" source="./media/connect-using-compass/mongodb-connection-copy.png" alt-text="Screenshot of the copy to clipboard button":::

3. Open Compass on your desktop/machine and click on **Connect** and then **Connect to...**.

4. Compass will automatically detect a connection string in the clipboard, and will prompt to ask whether you wish to use that to connect. Click on **Yes** as shown in the screenshot below.

    :::image type="content" source="./media/connect-using-compass/mongodb-compass-detect.png" alt-text="Screenshot shows a dialog box explaining that you have a connection string on your clipboard.":::

    > [!NOTE]
    > If Compass does not automatically detect your connection string, you can still manually paste it into the application.

5. Upon clicking **Yes** in the above step, your details from the connection string will be automatically populated. Remove the value automatically populated in the **Replica Set Name** field to ensure that is left blank.

    :::image type="content" source="./media/connect-using-compass/mongodb-compass-replica.png" alt-text="Screenshot shows the Replica Set Name text box.":::

6. Click on **Connect** at the bottom of the page. Your Azure Cosmos DB account and databases should now be visible within MongoDB Compass.

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB's API for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
