---
title: Use Java to create a document database - Azure Cosmos DB
description: Presents a Java code sample you can use to connect to and query the Azure Cosmos DB SQL API
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: quickstart
ms.date: 10/31/2019
ms.author: sngun
ms.custom: seo-java-august2019, seo-java-september2019
---
# Quickstart: Build a Java app to manage Azure Cosmos DB SQL API data


> [!div class="op_single_selector"]
> * [.NET](create-sql-api-dotnet.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)

This quickstart shows you how to use a Java application to create and manage a document database from your Azure Cosmos DB SQL API account. First, you create an Azure Cosmos DB SQL API account using the Azure portal, create a Java app using the SQL Java SDK, and then add resources to your Cosmos DB account by using the Java application. The instructions in this quickstart can be followed on any operating system that is capable of running Java. After completing this quickstart you'll be familiar with creating and modifying Cosmos DB databases, containers in either the UI or programmatically, whichever is your preference.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

In addition: 

* [Java Development Kit (JDK) version 8](https://aka.ms/azure-jdks)
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a [Maven](https://maven.apache.org/) binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create a database account

Before you can create a document database, you need to create a SQL API account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## Add a container

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
    git clone https://github.com/Azure-Samples/azure-cosmos-java-getting-started.git
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Run the app
](#run-the-app). 

* `CosmosClient` initialization. The `CosmosClient` provides client-side logical representation for the Azure Cosmos database service. This client is used to configure and execute requests against the service.

    ```java
    //  Create sync client
    client = new CosmosClientBuilder()
        .setEndpoint(AccountSettings.HOST)
        .setKey(AccountSettings.MASTER_KEY)
        .setConnectionPolicy(ConnectionPolicy.getDefaultPolicy())
        .setConsistencyLevel(ConsistencyLevel.EVENTUAL)
        .buildClient();
    ```

* CosmosDatabase creation.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateDatabaseIfNotExistsRegion)]

* CosmosContainer creation.

    [!code-csharp[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=createContainerIfNotExists)]

* Item creation by using the `createItem` method.

    ```java
    // Any Java object within your code
    // can be serialized into JSON and written to Azure Cosmos DB
    Family andersenFamily = new Family();
    andersenFamily.setId("Andersen.1");
    andersenFamily.setLastName("Andersen");
    // More properties

    //  Create item using container that we created using sync client
    
    //  Use lastName as partitionKey for cosmos item
    //  Using appropriate partition key improves the performance of database operations
    CosmosItemRequestOptions cosmosItemRequestOptions = new CosmosItemRequestOptions(andersenFamily.getLastName());
    CosmosItemResponse item = container.createItem(andersenFamily, cosmosItemRequestOptions);

    ```
* Point reads are performed using `getItem` and `read` method

    ```java
      //  We can re-use the andersonFamily object that we created above in createItem call. 
      CosmosItem cosmosItem = container.getItem(andersonFamily.getId(), andersonFamily.getLastName());
      CosmosItemResponse cosmosItemResponse = cosmosItem.read(new CosmosItemRequestOptions(andersenFamily.getLastName()));
      
      //  Using this response to get more information on read operation. 
      cosmosItemResponse.getRequestLatency();
      cosmosItemResponse.getRequestCharge();
      //  More information can be accessed using cosmosItemResponse
    ```

* SQL queries over JSON are performed using the `queryItems` method.

    ```java
    // Set some common query options
    FeedOptions queryOptions = new FeedOptions();
    queryOptions.maxItemCount(10);
    queryOptions.setEnableCrossPartitionQuery(true);
    //  Set populate query metrics to get metrics around query executions
    queryOptions.populateQueryMetrics(true);
  
  Iterator<FeedResponse<CosmosItemProperties>> feedResponseIterator = container.queryItems(
              "SELECT * FROM Family WHERE Family.lastName IN ('Andersen', 'Wakefield', 'Johnson')", queryOptions);

    feedResponseIterator.forEachRemaining(cosmosItemPropertiesFeedResponse -> {
                System.out.println("Got a page of query result with " +
                    cosmosItemPropertiesFeedResponse.getResults().size() + " items(s)"
                    + " and request charge of " + cosmosItemPropertiesFeedResponse.getRequestCharge());
    
                System.out.println("Item Ids " + cosmosItemPropertiesFeedResponse
                    .getResults()
                    .stream()
                    .map(Resource::getId)
                    .collect(Collectors.toList()));
            });

    
    ```    

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.


1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-cosmos-java-getting-started
    ```

2. In the git terminal window, use the following command to install the required Java packages.

    ```bash
    mvn package
    ```

3. In the git terminal window, use the following command to start the Java application (replace YOUR_COSMOS_DB_HOSTNAME with the quoted URI value from the portal, and replace YOUR_COSMOS_DB_MASTER_KEY with the quoted primary key from portal)

    ```bash
    mvn exec:java -DACCOUNT_HOST=YOUR_COSMOS_DB_HOSTNAME -DACCOUNT_KEY=YOUR_COSMOS_DB_MASTER_KEY

    ```

    The terminal window displays a notification that the FamilyDB database was created. 
    
4. The app creates database with name `AzureSampleFamilyDB`
5. The app creates container with name `FamilyContainer`
6. The app will perform point reads using object ids and partition key value (which is lastName in our sample). 
7. The app will query items to retrieve all families with last name in ('Andersen', 'Wakefield', 'Johnson')

7. The app doesn't delete the created resources. Switch back to the portal to [clean up the resources](#clean-up-resources).  from your account so that you don't incur charges.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos account, document database, and container using the Data Explorer, and run an app to do the same thing programmatically. You can now import additional data into your Azure Cosmos container. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)
