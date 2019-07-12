---
title: 'Tutorial: Build a Java app with the Async Java SDK to manage a SQL API account in Azure Cosmos DB'
description: This tutorial shows you how to store and access data within a SQL API account in Azure Cosmos DB by using an Async Java application. 
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: tutorial
ms.date: 12/15/2018
ms.author: sngun
Customer intent: As a developer, I want to build a Java application with the Async Java SDK to access and manage Azure Cosmos DB resources so that customers can utilize the global distribution, elastic scaling, multi-master, and other capabilities offered by Azure Cosmos DB.

---
# Tutorial: Build a Java app with the Async Java SDK to manage data stored in a SQL API account

> [!div class="op_single_selector"]
> * [.NET](sql-api-get-started.md)
> * [.NET (Preview)](sql-api-dotnet-get-started-preview.md)
> * [.NET Core](sql-api-dotnetcore-get-started.md)
> * [.NET Core (Preview)](sql-api-dotnet-core-get-started-preview.md)
> * [Java](sql-api-java-get-started.md)
> * [Async Java](sql-api-async-java-get-started.md)
> * [Node.js](sql-api-nodejs-get-started.md)
> 

As developer, you might have applications that use NoSQL document data. You can use the SQL API account in Azure Cosmos DB to store and access this document data. This tutorial shows you how to build a Java application with the Async Java SDK to store and manage document data. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Creating and connecting to an Azure Cosmos account
> * Configuring your solution
> * Creating a collection
> * Creating JSON documents
> * Querying the collection

## Prerequisites

Make sure you have the following resources:

* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/). 

* [Git](https://git-scm.com/downloads).

* [Java Development Kit (JDK) 8+](https://aka.ms/azure-jdks).

* [Maven](https://maven.apache.org/download.cgi).

## Create an Azure Cosmos DB account

Create an Azure Cosmos account by using the following steps:

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## <a id="GitClone"></a>Clone the GitHub repository

Clone the GitHub repository for [Get Started with Azure Cosmos DB and Java](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-async-java-getting-started). For example, from a local directory, run the following to retrieve the sample project locally.

```bash
git clone https://github.com/Azure-Samples/azure-cosmos-db-sql-api-async-java-getting-started.git

cd azure-cosmos-db-sql-api-async-java-getting-started
cd azure-cosmosdb-get-started
```

The directory contains a `pom.xml` file and a `src/main/java/com/microsoft/azure/cosmosdb/sample` folder containing Java source code, including `Main.java`. The project contains code required to perform operations with Azure Cosmos DB, like creating documents and querying data within a collection. The `pom.xml` file includes a dependency on the [Azure Cosmos DB Java SDK on Maven](https://mvnrepository.com/artifact/com.microsoft.azure/azure-documentdb).

```xml
<dependency>
  <groupId>com.microsoft.azure</groupId>
  <artifactId>azure-documentdb</artifactId>
  <version>2.0.0</version>
</dependency>
```

## <a id="Connect"></a>Connect to an Azure Cosmos account

Next, head back to the [Azure portal](https://portal.azure.com) to retrieve your endpoint and primary master key. The Azure Cosmos DB endpoint and primary key are necessary for your application to understand where to connect to, and for Azure Cosmos DB to trust your application's connection. The `AccountSettings.java` file holds the primary key and URI values. 

In the Azure portal, go to your Azure Cosmos account, and then click **Keys**. Copy the URI and the PRIMARY KEY from the portal and paste it into the `AccountSettings.java` file. 

```java
public class AccountSettings 
{
  // Replace MASTER_KEY and HOST with values from your Azure Cosmos account.
    
  // <!--[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine")]-->
  public static String MASTER_KEY = System.getProperty("ACCOUNT_KEY", 
          StringUtils.defaultString(StringUtils.trimToNull(
          System.getenv().get("ACCOUNT_KEY")), "<Fill your Azure Cosmos account key>"));

  public static String HOST = System.getProperty("ACCOUNT_HOST",
           StringUtils.defaultString(StringUtils.trimToNull(
           System.getenv().get("ACCOUNT_HOST")),"<Fill your Azure Cosmos DB URI>"));
}
```

![Get keys from portal screenshot][keys]

## Initialize the client object

Initialize the client object by using the host URI and primary key values defined in the "AccountSettings.java" file.

```java
client = new AsyncDocumentClient.Builder()
         .withServiceEndpoint(AccountSettings.HOST)
         .withMasterKey(AccountSettings.MASTER_KEY)
         .withConnectionPolicy(ConnectionPolicy.GetDefault())
         .withConsistencyLevel(ConsistencyLevel.Session)
         .build();
```

## <a id="CreateDatabase"></a>Create a database

Create your Azure Cosmos DB database by using the `createDatabaseIfNotExists()` method of the DocumentClient class. A database is the logical container of JSON document storage partitioned across collections.

```java
private void createDatabaseIfNotExists() throws Exception 
{
    
    writeToConsoleAndPromptToContinue("Check if database " + databaseName + " exists.");

    String databaseLink = String.format("/dbs/%s", databaseName);

    Observable<ResourceResponse<Database>> databaseReadObs = client.readDatabase(databaseLink, null);

    Observable<ResourceResponse<Database>> databaseExistenceObs = databaseReadObs
                .doOnNext(x -> {System.out.println("database " + databaseName + " already exists.");}).onErrorResumeNext(e -> {
   // if the database doesn't already exists
   // readDatabase() will result in 404 error
   if (e instanceof DocumentClientException) 
   {
       DocumentClientException de = (DocumentClientException) e;
       // if database 
       if (de.getStatusCode() == 404) {
       // if the database doesn't exist, create it.
       System.out.println("database " + databaseName + " doesn't existed," + " creating it...");
       Database dbDefinition = new Database();
       dbDefinition.setId(databaseName);
       return client.createDatabase(dbDefinition, null);
     }
     }

    // some unexpected failure in reading database happened.
    // pass the error up.
    System.err.println("Reading database " + databaseName + " failed.");
        return Observable.error(e);     
    });

   // wait for completion
   databaseExistenceObs.toCompletable().await();

   System.out.println("Checking database " + databaseName + " completed!\n");
}
```

## <a id="CreateColl"></a>Create a collection

You can create a collection by using the `createDocumentCollectionIfNotExists()` method of the DocumentClient class. A collection is a container of JSON documents and the associated JavaScript application logic.

> [!WARNING]
> **createCollection** creates a new collection with reserved throughput, which has pricing implications. For more details, visit our [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).
> 
> 

```java
private void createDocumentCollectionIfNotExists() throws Exception 
{
    
    writeToConsoleAndPromptToContinue("Check if collection " + collectionName + " exists.");

    // query for a collection with a given id
    // if it exists nothing else to be done
    // if the collection doesn't exist, create it.

    String databaseLink = String.format("/dbs/%s", databaseName);

    // we know there is only single page of result (empty or with a match)
    client.queryCollections(databaseLink, new SqlQuerySpec("SELECT * FROM r where r.id = @id", 
            new SqlParameterCollection(new SqlParameter("@id", collectionName))), null).single() 
            .flatMap(page -> {
            if (page.getResults().isEmpty()) {
             // if there is no matching collection create the collection.
             DocumentCollection collection = new DocumentCollection();
             collection.setId(collectionName);
             System.out.println("Creating collection " + collectionName);

             return client.createCollection(databaseLink, collection, null);
            } 
            else {
              // collection already exists, nothing else to be done.
              System.out.println("Collection " + collectionName + "already exists");
              return Observable.empty();
            }
      }).toCompletable().await();

 System.out.println("Checking collection " + collectionName + " completed!\n");
    }
```

## <a id="CreateDoc"></a>Create JSON documents

Create a document by using the createDocument method of the DocumentClient class. Documents are user-defined (arbitrary) JSON content. We can now insert one or more documents. The "src/main/java/com/microsoft/azure/cosmosdb/sample/Families.java" file defines the family JSON documents. 

```java
public static Family getJohnsonFamilyDocument() {
     Family andersenFamily = new Family();
     andersenFamily.setId("Johnson" + System.currentTimeMillis());
     andersenFamily.setLastName("Johnson");

      Parent parent1 = new Parent();
      parent1.setFirstName("John");

      Parent parent2 = new Parent();
      parent2.setFirstName("Lili");

      return andersenFamily;
    }
```

## <a id="Query"></a>Query Azure Cosmos DB resources

Azure Cosmos DB supports rich queries against JSON documents stored in each collection. The following sample code shows how to query documents in Azure Cosmos DB using SQL syntax with the `queryDocuments` method.

```java
private void executeSimpleQueryAsyncAndRegisterListenerForResult(CountDownLatch completionLatch) 
{
    // Set some common query options
    FeedOptions queryOptions = new FeedOptions();
    queryOptions.setMaxItemCount(100);
    queryOptions.setEnableCrossPartitionQuery(true);

    String collectionLink = String.format("/dbs/%s/colls/%s", databaseName, collectionName);
    Observable<FeedResponse<Document>> queryObservable = client.queryDocuments(collectionLink,
           "SELECT * FROM Family WHERE Family.lastName = 'Andersen'", queryOptions);

    queryObservable.subscribe(queryResultPage -> {
            System.out.println("Got a page of query result with " +
            queryResultPage.getResults().size() + " document(s)"
            + " and request charge of " + queryResultPage.getRequestCharge());
    },
   // terminal error signal
        e -> {
          e.printStackTrace();
          completionLatch.countDown();
        },

   // terminal completion signal
         () -> {
            completionLatch.countDown();
         });
}
```

## <a id="Run"></a>Run your Java console application

To run the application from the console, go to the project folder and compile using Maven:

```bash
mvn package
```

Running `mvn package` downloads the latest Azure Cosmos DB library from Maven and produces `GetStarted-0.0.1-SNAPSHOT.jar`. Then run the app by running:

```bash
mvn exec:java -DACCOUNT_HOST=<YOUR_COSMOS_DB_HOSTNAME> -DACCOUNT_KEY= <YOUR_COSMOS_DB_MASTER_KEY>
```

You've now completed this NoSQL tutorial and have a working Java console application.

## Clean up resources

When they're no longer needed, you can delete the resource group, the Azure Cosmos account, and all the related resources. To do so, select the resource group for the virtual machine, select **Delete**, and then confirm the name of the resource group to delete.


## Next steps

In this tutorial, you've learned how to build a Java app with the Async Java SDK to manage SQL API data in Azure Cosmos DB. You can now proceed to the next article:

> [!div class="nextstepaction"]
> [Build a Node.js console app with JavaScript SDK and Azure Cosmos DB](sql-api-nodejs-get-started.md)

[keys]: media/sql-api-get-started/nosql-tutorial-keys.png
