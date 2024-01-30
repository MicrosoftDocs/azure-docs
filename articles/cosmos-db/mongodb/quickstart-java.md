---
title: 'Quickstart: Build a web app using the Azure Cosmos DB for MongoDB and Java SDK'
description: Learn to build a Java code sample you can use to connect to and query using Azure Cosmos DB's API for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: java
ms.topic: quickstart
ms.date: 04/26/2022
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022, devx-track-extended-java
---

# Quickstart: Create a console app with Java and the API for MongoDB in Azure Cosmos DB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Python](quickstart-python.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Go](quickstart-go.md)
>

In this quickstart, you create and manage an Azure Cosmos DB for API for MongoDB account from the Azure portal, and add data by using a Java SDK app cloned from GitHub. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. You can also use the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) with the connection string `.mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true`.
- [Java Development Kit (JDK) version 8](https://adoptium.net/temurin/releases/?version=8). 
- [Maven](https://maven.apache.org/download.cgi). Or run `apt-get install maven` to install Maven.
- [Git](https://git-scm.com/downloads). 

## Create a database account

[!INCLUDE [mongodb-create-dbaccount](../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Add a collection

Name your new database **db**, and your new collection **coll**.

[!INCLUDE [cosmos-db-create-collection](../includes/cosmos-db-mongodb-create-collection.md)] 

## Clone the sample application

Now let's clone an app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a command prompt, create a new folder named git-samples, then close the command prompt.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash, and use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-getting-started.git
    ```

3. Then open the code in your favorite editor. 

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

The following snippets are all taken from the *Program.java* file.

This console app uses the [MongoDB Java driver](https://www.mongodb.com/docs/drivers/java-drivers/). 

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

1. From your Azure Cosmos DB account, select **Quick Start**, select **Java**, then copy the connection string to your clipboard.

2. Open the *Program.java* file, replace the argument to the MongoClientURI constructor with the connection string. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 
    
## Run the console app

1. Run `mvn package` in a terminal to install required packages

2. Run `mvn exec:java -D exec.mainClass=GetStarted.Program` in a terminal to start your Java application.

You can now use [Robomongo](connect-using-robomongo.md) / [Studio 3T](connect-using-mongochef.md) to query, modify, and work with this new data.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for MongoDB account, add a database and container using Data Explorer, and add data using a Java console app. You can now import additional data to your Azure Cosmos DB database. 

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
