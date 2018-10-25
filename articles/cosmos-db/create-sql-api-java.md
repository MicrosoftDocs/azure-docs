---
title: Create an Azure Cosmos DB document database with Java | Microsoft Docs | Microsoft Docs'
description: Presents a Java code sample you can use to connect to and query the Azure Cosmos DB SQL API
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.custom: quick start connect, mvc, devcenter
ms.devlang: java
ms.topic: quickstart
ms.date: 10/24/2018
ms.author: moderakh

---
# Azure Cosmos DB: Create a document database using Java and the Azure portal

> [!div class="op_single_selector"]
> * [.NET](create-sql-api-dotnet.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)
>  

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. Using Azure Cosmos DB, you can quickly create and query managed document, table, and graph databases.

This quickstart creates a document database using the Azure portal tools for the Azure Cosmos DB [SQL API](sql-api-introduction.md). This quickstart also shows you how to quickly create a Java console app using the [SQL Java API](sql-api-sdk-async-java). The instructions in this quickstart can be followed on any operating system that is capable of running Java. By completing this quickstart you'll be familiar with creating and modifying document database resources in either the UI or programmatically, whichever is your preference.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

In addition: 

* [Java Development Kit (JDK) 1.8+](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](http://maven.apache.org/download.cgi) and [install](http://maven.apache.org/install.html) a [Maven](http://maven.apache.org/) binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create a database account

Before you can create a document database, you need to create a SQL API account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## Add a collection

[!INCLUDE [cosmos-db-create-collection](../../includes/cosmos-db-create-collection.md)]

<a id="add-sample-data"></a>
## Add sample data

[!INCLUDE [cosmos-db-create-sql-api-add-sample-data](../../includes/cosmos-db-create-sql-api-add-sample-data.md)]

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../../includes/cosmos-db-create-sql-api-query-data.md)]

## Clone the sample application

Now let's switch to working with code. Let's clone a SQL API app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-sql-api-async-java-getting-started
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

The following snippets are all taken from the `azure-cosmos-db-sql-api-async-java-getting-started/azure-cosmosdb-get-started/src/main/java/com/microsoft/azure/cosmosdb/sample/Main.java` file.

* `AsyncDocumentClient` initialization. The [AsyncDocumentClient](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.cosmosdb.rx._async_document_client) provides client-side logical representation for the Azure Cosmos DB database service. This client is used to configure and execute requests against the service. The `FILLME` portions of this code will be updated later in the quickstart.

    ```java
       client = new AsyncDocumentClient.Builder()
                .withServiceEndpoint(FILLME)
                .withMasterKeyOrResourceToken(FILLME)
                .withConnectionPolicy(ConnectionPolicy.GetDefault())
                .withConsistencyLevel(ConsistencyLevel.Eventual)
                .build();
    ```

* [Database](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.cosmosdb._database) creation.

    ```java
    Database databaseDefinition = new Database();
    databaseDefinition.setId(databaseName);
    
    client.createDatabase(databaseDefinition, null).toCompletable().await();
    ```

* [DocumentCollection](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.cosmosdb._document_collection) creation.

    ```java
    DocumentCollection collectionDefinition = new DocumentCollection();
    collectionDefinition.setId(collectionName);

    ...

    client.createCollection(databaseLink, collectionDefinition, requestOptions).toCompletable().await();
    ```

* Document creation by using the [createDocument](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.cosmosdb._document) method.

    ```java
    // Any Java object within your code can be serialized into JSON and written to Azure Cosmos DB
    Family andersenFamily = new Family();
    andersenFamily.setId("Andersen.1");
    andersenFamily.setLastName("Andersen");
    // More properties

    String collectionLink = String.format("/dbs/%s/colls/%s", databaseName, collectionName);
    client.createCollection(collectionLink, family, null, true).toCompletable().await();

    ```

* SQL queries over JSON are performed using the [queryDocuments](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.cosmosdb.rx._async_document_client.querydocuments?view=azure-java-stable) method.

    ```java
    FeedOptions queryOptions = new FeedOptions();
    queryOptions.setPageSize(-1);
    queryOptions.setEnableCrossPartitionQuery(true);
    queryOptions.setMaxDegreeOfParallelism(-1);

    String collectionLink = String.format("/dbs/%s/colls/%s", databaseName, collectionName);
    Iterator<FeedResponse<Document>> it = client.queryDocuments(
        collectionLink,
        "SELECT * FROM Family WHERE Family.lastName = 'Andersen'", queryOptions).toBlocking().getIterator();

    System.out.println("Running SQL query...");
    while(it.hasNext()) {
        FeedResponse<Document> page = it.next();
        System.out.println(String.format("\tRead a page of results with %d items", page.getResults().size()));
        for(Document doc: page.getResults()) {
            System.out.println(String.format("\t doc %s", doc));
        }
    }
    ```    

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.


1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-cosmos-db-sql-api-async-java-getting-started/azure-cosmosdb-get-started
    ```

2. In the git terminal window, use the following command to install the required Java packages.

    ```
    mvn package
    ```

3. In the git terminal window, use the following command to start the Java application (replace YOUR_COSMOS_DB_HOSTNAME with the quoted URI value from the portal, and replace YOUR_COSMOS_DB_MASTER_KEY with the quoted primary key from portal)

    ```
    mvn exec:java -DACCOUNT_HOST=YOUR_COSMOS_DB_HOSTNAME -DACCOUNT_KEY=YOUR_COSMOS_DB_MASTER_KEY

    ```

    The terminal window displays a notification that the FamilyDB database was created. 
    
4. Press a key to create the database, and then another key to create the collection. 

    At the end of the program all the resources are deleted, so switch back to Data Explorer in your browser to see that it now contains a FamilyDB database, and FamilyCollection collection.

5. Switch to the console window and press a key to create the first document, and then another key to create the second document. Then switch back to Data Explorer to view them. 

6. Press a key to run a query and see the output in the console window. 

7. The next key you press deletes the resources. If you want to keep the resources you can press CTRL+C in the console window to end the program. Otherwise, press any key to delete the resources from your account so that you don't incur charges. 

    ![Console output](./media/create-sql-api-java/rxjava-console-output.png)


## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, document database, and collection using the Data Explorer, and run an app to do the same thing programmatically. You can now import additional data into your Azure Cosmos DB collection. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)
