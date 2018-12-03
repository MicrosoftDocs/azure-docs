---
title: 'Quickstart: Cassandra API with Node.js - Azure Cosmos DB'
description: This quickstart shows how to use the Azure Cosmos DB Cassandra API to create a profile application with Node.js
services: cosmos-db
author: SnehaGunda
ms.author: sngun
ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.custom: quick start connect, mvc
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 09/24/2018
---
# Quickstart: Build a Cassandra app with Node.js and Azure Cosmos DB

> [!div class="op_single_selector"]
> * [.NET](create-cassandra-dotnet.md)
> * [Java](create-cassandra-java.md)
> * [Node.js](create-cassandra-nodejs.md)
> * [Python](create-cassandra-python.md)
>  

This quickstart shows how to use Node.js and the Azure Cosmos DB [Cassandra API](cassandra-introduction.md) to build a profile app by cloning an example from GitHub. This quickstart also shows you how to use the web-based Azure portal to create an Azure Cosmos DB account.

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, table, key-value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] Alternatively, you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments.

In addition, you need:
* [Node.js](https://nodejs.org/en/) version v0.10.29 or higher
* [Git](http://git-scm.com/)

## Create a database account

Before you can create a document database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Clone the sample application

Now let's clone a Cassandra API app from github, set the connection string, and run it. You see how easy it is to work with data programmatically. 

1. Open a command prompt. Create a new folder named `git-samples`. Then, close the command prompt.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash. Use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-nodejs-getting-started.git
    ```

## Review the code

This step is optional. If you're interested to learn how the code creates the database resources, you can review the following snippets. The snippets are all taken from the `uprofile.js` file in the `C:\git-samples\azure-cosmos-db-cassandra-nodejs-getting-started` folder. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

* The username and password values were set using the connection string page in the Azure portal. The `path\to\cert` provides a path to an X509 certificate. 

   ```nodejs
   var ssl_option = {
        cert : fs.readFileSync("path\to\cert"),
        rejectUnauthorized : true,
        secureProtocol: 'TLSv1_2_method'
        };
   const authProviderLocalCassandra = new cassandra.auth.PlainTextAuthProvider(config.username, config.password);
   ```

* The `client` is initialized with contactPoint information. The contactPoint is retrieved from the Azure portal.

    ```nodejs
    const client = new cassandra.Client({contactPoints: [config.contactPoint], authProvider: authProviderLocalCassandra, sslOptions:ssl_option});
    ```

* The `client` connects to the Azure Cosmos DB Cassandra API.

    ```nodejs
    client.connect(next);
    ```

* A new keyspace is created.

    ```nodejs
    function createKeyspace(next) {
    	var query = "CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {\'class\': \'NetworkTopologyStrategy\', \'datacenter1\' : \'1\' }";
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
          params: [5, 'IvanaV', 'Belgaum', '2017-10-3136']
        }
    ];
    client.batch(queries, { prepare: true}, next);
    ```

* Query to get all key values.

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

Now go back to the Azure portal to get your connection string information and copy it into the app. The connection string enables your app to communicate with your hosted database.

1. In the [Azure portal](http://portal.azure.com/), select **Connection String**. 

    Use the ![Copy button](./media/create-cassandra-nodejs/copy.png) button on the right side of the screen to copy the top value, the CONTACT POINT.

    ![View and copy the CONTACT POINT, USERNAME,and PASSWORD from the Azure portal, connection string page](./media/create-cassandra-nodejs/keys.png)

2. Open the `config.js` file. 

3. Paste the CONTACT POINT value from the portal over `<FillMEIN>` on line 4.

    Line 4 should now look similar to 

    `config.contactPoint = "cosmos-db-quickstarts.cassandra.cosmosdb.azure.com:10350"`

4. Copy the USERNAME value from the portal and paste it over `<FillMEIN>` on line 2.

    Line 2 should now look similar to 

    `config.username = 'cosmos-db-quickstart';`
    
5. Copy the PASSWORD value from the portal and paste it over `<FillMEIN>` on line 3.

    Line 3 should now look similar to

    `config.password = '2Ggkr662ifxz2Mg==';`

6. Save the `config.js` file.
    
## Use the X509 certificate

1. Download the Baltimore CyberTrust Root certificate locally from [https://cacert.omniroot.com/bc2025.crt](https://cacert.omniroot.com/bc2025.crt). Rename the file using the file extension `.cer`.

   The certificate has serial number `02:00:00:b9` and SHA1 fingerprint `d4🇩🇪20:d0:5e:66:fc:53:fe:1a:50:88:2c:78:db:28:52:ca:e4:74`.

2. Open `uprofile.js` and change the `path\to\cert` to point to your new certificate.

3. Save `uprofile.js`.

## Run the Node.js app

1. In the git terminal window, run `npm install` to install the required npm modules.

2. Run `node uprofile.js` to start your node application.

3. Verify the results as expected from the command line.

    ![View and verify the output](./media/create-cassandra-nodejs/output.png)

    Press CTRL + C to stop execution of the program and close the console window. 

4. In the Azure portal, open **Data Explorer** to query, modify, and work with this new data. 

    ![View the data in Data Explorer](./media/create-cassandra-nodejs/data-explorer.png) 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a container using the Data Explorer, and run an app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](cassandra-import-data.md)


