---
title: 'Azure Cosmos DB: Build a console app with Java and the MongoDB API | Microsoft Docs'
description: Presents a Java code sample you can use to connect to and query the Azure Cosmos DB MongoDB API
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 05/10/2017
ms.author: mimig

---
# Azure Cosmos DB: Build a MongoDB API console app with Java and the Azure portal

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB account, document database, and collection using the Azure portal. You'll then build and deploy a console app built on the [MongoDB Java driver](https://docs.mongodb.com/ecosystem/drivers/java/). 

## Prerequisites

* Before you can run this sample, you must have the following prerequisites:
   * JDK 1.7+ (Run `apt-get install default-jdk` if you don't have JDK)
   * Maven (Run `apt-get install maven` if you don't have Maven)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

[!INCLUDE [mongodb-create-dbaccount](../../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Add a collection

Name your new database, **db**, and your new collection, **coll**.

[!INCLUDE [cosmos-db-create-collection](../../includes/cosmos-db-create-collection.md)]

## Clone the sample application

Now let's clone a MongoDB API app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `cd` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 

## Review the code

Let's make a quick review of what's happening in the app. Open the `Program.cs` file and you'll find that these lines of code create the Azure Cosmos DB resources. 

* The DocumentClient is initialized.

    ```java
    MongoClientURI uri = new MongoClientURI("FILLME");`

    MongoClient mongoClient = new MongoClient(uri);            
    ```

* A new database and collection are created.

    ```java
    MongoDatabase database = mongoClient.getDatabase("db");

    MongoCollection<Document> collection = database.getCollection("coll");
    ```

* Some documents are inserted using `MongoCollection.insertOne`

    ```java
    Document document = new Document("fruit", "apple")
    collection.insertOne(document);
    ```

* Some queries are performed using `MongoCollection.find`

    ```java
    Document queryResult = collection.find(Filters.eq("fruit", "apple")).first();
    System.out.println(queryResult.toJson());    	
    ```

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. From the Account, select **Quick Start**, select Java, then copy the connection string to your clipboard

2. Open the `Program.java` file, replace the argument to the MongoClientURI constructor with the connection string. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 
    
## Run the console app

1. Run `mvn package` in a terminal to install required npm modules

2. Run `mvn exec:java -D exec.mainClass=GetStarted.Program` in a terminal to start your Java application.

You can now use [Robomongo](mongodb-robomongo.md) / [Studio 3T](mongodb-mongochef.md) to query, modify, and work with this new data.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run a console app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md)


