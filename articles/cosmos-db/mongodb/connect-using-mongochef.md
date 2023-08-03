---
title: Use Studio 3T to connect to Azure Cosmos DB's API for MongoDB
description: Learn how to connect to an Azure Cosmos DB's API for MongoDB using Studio 3T.
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 08/26/2021
author: gahl-levy
ms.author: gahllevy
ms.custom: seodec18, ignite-2022
---
# Connect to an Azure Cosmos DB account using Studio 3T
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

To connect to an Azure Cosmos DB's API for MongoDB using Studio 3T, you must:

* Download and install [Studio 3T](https://studio3t.com/).
* Have your Azure Cosmos DB account's [connection string](connect-account.md) information.

## Create the connection in Studio 3T

To add your Azure Cosmos DB account to the Studio 3T connection manager, use the following steps:

1. Retrieve the connection information for your Azure Cosmos DB's API for MongoDB account using the instructions in the [Connect a MongoDB application to Azure Cosmos DB](connect-account.md) article.

    :::image type="content" source="./media/connect-using-mongochef/connection-string-blade.png" alt-text="Screenshot of the connection string page":::

2. Click **Connect** to open the Connection Manager, then click **New Connection**

    :::image type="content" source="./media/connect-using-mongochef/connection-manager.png" alt-text="Screenshot of the Studio 3T connection manager that highlights the New Connection button.":::
3. In the **New Connection** window, on the **Server** tab, enter the HOST (FQDN) of the Azure Cosmos DB account and the PORT.

    :::image type="content" source="./media/connect-using-mongochef/connection-manager-server-tab.png" alt-text="Screenshot of the Studio 3T connection manager server tab":::
4. In the **New Connection** window, on the **Authentication** tab, choose Authentication Mode **Basic (MONGODB-CR or SCRAM-SHA-1)** and enter the USERNAME and PASSWORD.  Accept the default authentication db (admin) or provide your own value.

    :::image type="content" source="./media/connect-using-mongochef/connection-manager-authentication-tab.png" alt-text="Screenshot of the Studio 3T connection manager authentication tab":::
5. In the **New Connection** window, on the **SSL** tab, check the **Use SSL protocol to connect** check box and the **Accept server self-signed SSL certificates** radio button.

    :::image type="content" source="./media/connect-using-mongochef/connection-manager-ssl-tab.png" alt-text="Screenshot of the Studio 3T connection manager SSL tab":::
6. Click the **Test Connection** button to validate the connection information, click **OK** to return to the New Connection window, and then click **Save**.

    :::image type="content" source="./media/connect-using-mongochef/test-connection-results.png" alt-text="Screenshot of the Studio 3T test connection window":::

## Use Studio 3T to create a database, collection, and documents
To create a database, collection, and documents using Studio 3T, perform the following steps:

1. In **Connection Manager**, highlight the connection and click **Connect**.

    :::image type="content" source="./media/connect-using-mongochef/connect-account.png" alt-text="Screenshot of the Studio 3T connection manager":::
2. Right-click the host and choose **Add Database**.  Provide a database name and click **OK**.

    :::image type="content" source="./media/connect-using-mongochef/add-database.png" alt-text="Screenshot of the Studio 3T Add Database option":::
3. Right-click the database and choose **Add Collection**.  Provide a collection name and click **Create**.

    :::image type="content" source="./media/connect-using-mongochef/add-collection.png" alt-text="Screenshot of the Studio 3T Add Collection option":::
4. Click the **Collection** menu item, then click **Add Document**.

    :::image type="content" source="./media/connect-using-mongochef/add-document.png" alt-text="Screenshot of the Studio 3T Add Document menu item":::
5. In the Add Document dialog, paste the following and then click **Add Document**.

    ```json
    {
        "_id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
            { "firstName": "Thomas" },
            { "firstName": "Mary Kay"}
        ],
        "children": [
            {
                "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
                "pets": [{ "givenName": "Fluffy" }]
            }
        ],
        "address": { "state": "WA", "county": "King", "city": "seattle" },
        "isRegistered": true
    }
    ```
    
6. Add another document, this time with the following content:

    ```json
    {
        "_id": "WakefieldFamily",
        "parents": [
            { "familyName": "Wakefield", "givenName": "Robin" },
            { "familyName": "Miller", "givenName": "Ben" }
        ],
        "children": [
            {
                "familyName": "Merriam",
                "givenName": "Jesse",
                "gender": "female", "grade": 1,
                "pets": [
                    { "givenName": "Goofy" },
                    { "givenName": "Shadow" }
                ]
            },
            {
                "familyName": "Miller",
                "givenName": "Lisa",
                "gender": "female",
                "grade": 8 }
        ],
        "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
        "isRegistered": false
    }
    ```

7. Execute a sample query. For example, search for families with the last name 'Andersen' and return the parents and state fields.

    :::image type="content" source="./media/connect-using-mongochef/query-document.png" alt-text="Screenshot of Mongo Chef query results":::

## Next steps

- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB's API for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
