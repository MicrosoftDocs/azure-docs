---
title: Use MongoChef for Azure Cosmos DB | Microsoft Docs
description: 'Learn how to use MongoChef with an Azure Cosmos DB: API for MongoDB account'
keywords: mongochef
services: cosmos-db
author: AndrewHoh
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: 352c5fb9-8772-4c5f-87ac-74885e63ecac
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/23/2017
ms.author: anhoh

---
# Use MongoChef with an Azure Cosmos DB: API for MongoDB account

To connect to an Azure Cosmos DB: API for MongoDB account, you must:

* Download and install [MongoChef](http://3t.io/mongochef)
* Have your Azure Cosmos DB: API for MongoDB account [connection string](connect-mongodb-account.md) information

## Create the connection in MongoChef
To add your Azure Cosmos DB: API for MongoDB account to the MongoChef connection manager, perform the following steps.

1. Retrieve your Azure Cosmos DB: API for MongoDB connection information using the instructions [here](connect-mongodb-account.md).

    ![Screen shot of the connection string blade](./media/mongodb-mongochef/ConnectionStringBlade.png)
2. Click **Connect** to open the Connection Manager, then click **New Connection**

    ![Screen shot of the MongoChef connection manager](./media/mongodb-mongochef/ConnectionManager.png)
3. In the **New Connection** window, on the **Server** tab, enter the HOST (FQDN) of the Azure Cosmos DB: API for MongoDB account and the PORT.

    ![Screen shot of the MongoChef connection manager server tab](./media/mongodb-mongochef/ConnectionManagerServerTab.png)
4. In the **New Connection** window, on the **Authentication** tab, choose Authentication Mode **Standard (MONGODB-CR or SCARM-SHA-1)** and enter the USERNAME and PASSWORD.  Accept the default authentication db (admin) or provide your own value.

    ![Screen shot of the MongoChef connection manager authentication tab](./media/mongodb-mongochef/ConnectionManagerAuthenticationTab.png)
5. In the **New Connection** window, on the **SSL** tab, check the **Use SSL protocol to connect** check box and the **Accept server self-signed SSL certificates** radio button.

    ![Screen shot of the MongoChef connection manager SSL tab](./media/mongodb-mongochef/ConnectionManagerSSLTab.png)
6. Click the **Test Connection** button to validate the connection information, click **OK** to return to the New Connection window, and then click **Save**.

    ![Screen shot of the MongoChef test connection window](./media/mongodb-mongochef/TestConnectionResults.png)

## Use MongoChef to create a database, collection, and documents
To create a database, collection, and documents using MongoChef, perform the following steps.

1. In **Connection Manager**, highlight the connection and click **Connect**.

    ![Screen shot of the MongoChef connection manager](./media/mongodb-mongochef/ConnectToAccount.png)
2. Right click the host and choose **Add Database**.  Provide a database name and click **OK**.

    ![Screen shot of the MongoChef Add Database option](./media/mongodb-mongochef/AddDatabase1.png)
3. Right click the database and choose **Add Collection**.  Provide a collection name and click **Create**.

    ![Screen shot of the MongoChef Add Collection option](./media/mongodb-mongochef/AddCollection.png)
4. Click the **Collection** menu item, then click **Add Document**.

    ![Screen shot of the MongoChef Add Document menu item](./media/mongodb-mongochef/AddDocument1.png)
5. In the Add Document dialog, paste the following and then click **Add Document**.

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
6. Add another document, this time with the following content.

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
7. Execute a sample query. For example, search for families with the last name 'Andersen' and return the parents and state fields.

    ![Screen shot of Mongo Chef query results](./media/mongodb-mongochef/QueryDocument1.png)

## Next steps
* Explore Azure Cosmos DB: API for MongoDB [samples](mongodb-samples.md).
