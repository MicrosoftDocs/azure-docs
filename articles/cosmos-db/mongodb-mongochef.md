---
title: Use Studio 3T to connect to Azure Cosmos DB's API for MongoDB
description: Learn how to connect to an Azure Cosmos DB's API for MongoDB using Studio 3T.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 03/20/2020
author: timsander1
ms.author: tisande
ms.custom: seodec18
---
# Connect to an Azure Cosmos account using Studio 3T

To connect to an Azure Cosmos DB's API for MongoDB using Studio 3T, you must:

* Download and install [Studio 3T](https://studio3t.com/).
* Have your Azure Cosmos account's [connection string](connect-mongodb-account.md) information.

## Create the connection in Studio 3T

To add your Azure Cosmos account to the Studio 3T connection manager, use the following steps:

1. Retrieve the connection information for your Azure Cosmos DB's API for MongoDB account using the instructions in the [Connect a MongoDB application to Azure Cosmos DB](connect-mongodb-account.md) article.

    :::image type="content" source="./media/mongodb-mongochef/ConnectionStringBlade.png" alt-text="Screenshot of the connection string page":::

2. Click **Connect** to open the Connection Manager, then click **New Connection**

    :::image type="content" source="./media/mongodb-mongochef/ConnectionManager.png" alt-text="Screenshot of the Studio 3T connection manager":::
3. In the **New Connection** window, on the **Server** tab, enter the HOST (FQDN) of the Azure Cosmos account and the PORT.

    :::image type="content" source="./media/mongodb-mongochef/ConnectionManagerServerTab.png" alt-text="Screenshot of the Studio 3T connection manager server tab":::
4. In the **New Connection** window, on the **Authentication** tab, choose Authentication Mode **Basic (MONGODB-CR or SCARM-SHA-1)** and enter the USERNAME and PASSWORD.  Accept the default authentication db (admin) or provide your own value.

    :::image type="content" source="./media/mongodb-mongochef/ConnectionManagerAuthenticationTab.png" alt-text="Screenshot of the Studio 3T connection manager authentication tab":::
5. In the **New Connection** window, on the **SSL** tab, check the **Use SSL protocol to connect** check box and the **Accept server self-signed SSL certificates** radio button.

    :::image type="content" source="./media/mongodb-mongochef/ConnectionManagerSSLTab.png" alt-text="Screenshot of the Studio 3T connection manager SSL tab":::
6. Click the **Test Connection** button to validate the connection information, click **OK** to return to the New Connection window, and then click **Save**.

    :::image type="content" source="./media/mongodb-mongochef/TestConnectionResults.png" alt-text="Screenshot of the Studio 3T test connection window":::

## Use Studio 3T to create a database, collection, and documents
To create a database, collection, and documents using Studio 3T, perform the following steps:

1. In **Connection Manager**, highlight the connection and click **Connect**.

    :::image type="content" source="./media/mongodb-mongochef/ConnectToAccount.png" alt-text="Screenshot of the Studio 3T connection manager":::
2. Right-click the host and choose **Add Database**.  Provide a database name and click **OK**.

    :::image type="content" source="./media/mongodb-mongochef/AddDatabase1.png" alt-text="Screenshot of the Studio 3T Add Database option":::
3. Right-click the database and choose **Add Collection**.  Provide a collection name and click **Create**.

    :::image type="content" source="./media/mongodb-mongochef/AddCollection.png" alt-text="Screenshot of the Studio 3T Add Collection option":::
4. Click the **Collection** menu item, then click **Add Document**.

    :::image type="content" source="./media/mongodb-mongochef/AddDocument1.png" alt-text="Screenshot of the Studio 3T Add Document menu item":::
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

    :::image type="content" source="./media/mongodb-mongochef/QueryDocument1.png" alt-text="Screenshot of Mongo Chef query results":::

## Next steps

- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.
