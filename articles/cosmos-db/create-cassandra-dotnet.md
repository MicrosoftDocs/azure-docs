---
title: 'Quickstart: Cassandra API with .NET - Azure Cosmos DB | Microsoft Docs'
description: This quickstart shows how to use the Azure Cosmos DB Cassandra API to create a profile application with the Azure portal and .NET
services: cosmos-db
author: mimig1
manager: jhubbard
documentationcenter: ''

ms.assetid: 73839abf-5af5-4ae0-a852-0f4159bc00a0
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: mimig

---

# Quickstart: Build a Cassandra web app with .NET and Azure Cosmos DB

This quickstart shows how to use .NET and the Azure Cosmos DB [Cassandra API](cassandra-introduction.md) to build a profile app by cloning an example from GitHub. This quickstart also walks you through the creation of an Azure Cosmos DB account by using the web-based Azure portal.   

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, table, key-value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

## Prerequisites

Access to the Azure Cosmos DB Cassandra API preview program. If you haven't applied for access yet, [sign up now](https://aka.ms/cosmosdb-cassandra-signup).

If you don't already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] Alternatively, you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments.

<a id="create-account"></a>
## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../../includes/cosmos-db-create-dbaccount-cassandra.md)]


## Clone the sample application

Now let's switch to working with code. Let's clone a Cassandra API app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app. 

    ```bash
    cd "C:\git-samples"
    ```

2. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-dotnet-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. The snippets are all taken from the `uprofile.js` file. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

* User name and password is set using the connection string page in the Azure portal.  

   ```csharp
   const authProviderLocalCassandra = new cassandra.auth.PlainTextAuthProvider(config.username, config.password);
   ```

* The `client` is initialized with contactPoint information. The contactPoint is retrieved from the Azure portal.

    ```csharp
   const client = new cassandra.Client({contactPoints: [config.contactPoint], authProvider: authProviderLocalCassandra});
    ```

* The `client` connects to the Azure Cosmos DB Cassandra API.

    ```csharp
    client.connect(next);
    ```

* A new keyspace is created.

    ```csharp
    function createKeyspace(next) {
    	var query = "CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' } ";
    	client.execute(query, next);
    	console.log("created keyspace");    
  }
    ```

* A new table is created.

   ```csharp
   function createTable(next) {
   	var query = "CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text)";
    	client.execute(query, next);
    	console.log("created table");
   },
   ```

* Key/value entities are inserted.

    ```csharp
    ...
    {
          query: 'INSERT INTO  uprofile.user  (user_id, user_name , user_bcity) VALUES (?,?,?)',
          params: [5, 'SubbannaG', 'Belgaum', '2017-10-3136']
        }
    ];
    client.batch(queries, { prepare: true}, next);
    ```

* Query to get get all key values.

    ```csharp
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

    ```csharp
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

    Use the copy buttons on the right side of the screen to copy the USERNAME value.

    ![View and copy an access key in the Azure portal, Keys blade](./media/create-cassandra-dotnet/keys.png)

2. In Visual Studio 2017, open the web.config file. 

3. Copy the USERNAME value from the portal (using the copy button) and make it the value of the endpoint key in web.config. 

    `<add key="endpoint" value="FILLME" />`

4. Then copy the PASSWORD value from the portal and make it the value of the authKey in web.config. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

    `<add key="authKey" value="FILLME" />`
    
## Run the web app
1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type *DocumentDB*.

3. From the results, install the **Microsoft.Azure.DocumentDB** library. This installs the Microsoft.Azure.DocumentDB package as well as all dependencies.

4. Click CTRL + F5 to run the application. Your app displays in your the command window. 

    ![View and verify the output](./media/create-cassandra-dotnet/output.png)

    You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run a web app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](cassandra-import-data.md)
