---
title: 'Quickstart: Cassandra API with Node.js - Azure Cosmos DB | Microsoft Docs'
description: This quickstart shows how to use the Azure Cosmos DB Cassandra API to create a profile application with the Azure portal and Node.js
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 4732e57d-32ed-40e2-b148-a8df4ff2630d
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 11/15/2017
ms.author: govindk

---
# Quickstart: Build a Cassandra web app with Node.js and Azure Cosmos DB

This quickstart shows how to use Node.js and the Azure Cosmos DB [Cassandra API](cassandra-introduction.md) to build a profile app by cloning an example from GitHub. This quickstart also walks you through the creation of an Azure Cosmos DB account by using the web-based Azure portal.

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, table, key-value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

## Prerequisites

* Access to the Azure Cosmos DB Cassandra API preview program. If you haven't applied for access yet, [sign up now](https://aka.ms/cosmosdb-cassandra-signup).
* [Node.js](https://nodejs.org/en/) version v0.10.29 or higher
* [Git](http://git-scm.com/)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] Alternatively, you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments.


## Create a database account

Before you can create a document database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Clone the sample application

Now let's clone a Cassandra API app from github, set the connection string, and run it. You see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app. 

    ```bash
    cd "C:\git-samples"
    ```

2. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-nodejs-getting-started.git
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. The snippets are all taken from the `uprofile.js` file in the C:\git-samples\azure-cosmos-db-cassandra-nodejs-getting-started folder. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

* User name and password is set using the connection string page in the Azure portal.  

   ```nodejs
   const authProviderLocalCassandra = new cassandra.auth.PlainTextAuthProvider(config.username, config.password);
   ```

* The `client` is initialized with contactPoint information. The contactPoint is retrieved from the Azure portal.

    ```nodejs
   const client = new cassandra.Client({contactPoints: [config.contactPoint], authProvider: authProviderLocalCassandra});
    ```

* The `client` connects to the Azure Cosmos DB Cassandra API.

    ```nodejs
    client.connect(next);
    ```

* A new keyspace is created.

    ```nodejs
    function createKeyspace(next) {
    	var query = "CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' } ";
    	client.execute(query, next);
    	console.log("created keyspace");    
  }
    ```

* A new table is created.

   ```nodejs
   function createTable(next) {
   	var query = "CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text)";
    	client.execute(query, next);
    	console.log("created table");
   },
   ```

* Key/value entities are inserted.

    ```nodejs
    ...
    {
          query: 'INSERT INTO  uprofile.user  (user_id, user_name , user_bcity) VALUES (?,?,?)',
          params: [5, 'SubbannaG', 'Belgaum', '2017-10-3136']
        }
    ];
    client.batch(queries, { prepare: true}, next);
    ```

* Query to get get all key values.

    ```nodejs
   var query = 'SELECT * FROM uprofile.user';
    client.execute(query, { prepare: true}, function (err, result) {
      if (err) return next(err);
      result.rows.forEach(function(row) {
        console.log('Obtained row: %d | %s | %s ',row.user_id, row.user_name, row.user_bcity);
      }, this);
      next();
    });
    ```  
    
* Query to get a key-value.

    ```nodejs
    function selectById(next) {
    	console.log("\Getting by id");
    	var query = 'SELECT * FROM uprofile.user where user_id=1';
    	client.execute(query, { prepare: true}, function (err, result) {
      	if (err) return next(err);
      		result.rows.forEach(function(row) {
        	console.log('Obtained row: %d | %s | %s ',row.user_id, row.user_name, row.user_bcity);
      	}, this);
      	next();
    	});
    }
    ```  

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app. This enables your app to communicate with your hosted database.

1. In the [Azure portal](http://portal.azure.com/), click **Connection String**. 

    Use the ![Copy button](./media/create-cassandra-nodejs/copy.png) button on the right side of the screen to copy the top value, the CONTACT POINT.

    ![View and copy the CONTACT POINT, USERNAME,and PASSWORD from the Azure portal, connection string page](./media/create-cassandra-nodejs/keys.png)

2. Open the `config.js` file. 

3. Paste the CONTACT POINT value from the portal over `<FillMEIN>` on line 4.

    Line 4 should now look similar to 

    `config.contactPoint = "cosmos-db-quickstarts.documents.azure.com:10350"`

4. Copy the USERNAME value from the portal and paste it over `<FillMEIN>` on line 2.

    Line 2 should now look similar to 

    `config.username = 'cosmos-db-quickstart';`
    
5. Copy the PASSWORD value from the portal and paste it over `<FillMEIN>` on line 3.

    Line 3 should now look similar to

    `config.password = '2Ggkr662ifxz2Mg==';`

6. Save the config.js file.
    
## Run the app

1. In the git terminal window, run `npm install` to install the required npm modules.

2. Run `node uprofile.js` to start your node application.

3. Verify the results as expected from the command line.

    You can now go back to Data Explorer to see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run an app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](cassandra-import-data.md)


