---
title: Build an Azure Cosmos DB Java application using the Graph API | Microsoft Docs
description: Presents a Java code sample you can use to connect to and query graph data in Azure Cosmos DB using Gremlin.
services: cosmos-db
documentationcenter: ''
author: dennyglee
manager: jhubbard
editor: ''

ms.assetid: daacbabf-1bb5-497f-92db-079910703046
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 07/14/2017
ms.author: denlee

---
# Azure Cosmos DB: Build a Java application using the Graph API

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB account for Graph API (preview), database, and graph using the Azure portal. You then build and run a console app using the OSS [Gremlin Java](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver) driver.  

## Prerequisites

* Before you can run this sample, you must have the following prerequisites:
   * JDK 1.7+ (Run `apt-get install default-jdk` if you don't have JDK), and set environment variables like `JAVA_HOME`
   * Maven (Run `apt-get install maven` if you don't have Maven)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-graph](../../includes/cosmos-db-create-dbaccount-graph.md)]

## Add a graph

[!INCLUDE [cosmos-db-create-graph](../../includes/cosmos-db-create-graph.md)]

## Clone the sample application

Now let's clone a Graph API (preview) app from github, set the connection string, and run it. You see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `cd` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-graph-java-getting-started.git
    ```

## Review the code

Let's make a quick review of what's happening in the app. Open the `Program.java` file and you find that these lines of code. 

* The Gremlin `Client` is initialized from the configuration in `src/remote.yaml`.

    ```java
    Cluster cluster = Cluster.build(new File("src/remote.yaml")).create();
    
    Client client = cluster.connect();
    ```

* A series of Gremlin steps are executed using the `client.submit` method.

    ```java
    ResultSet results = client.submit("g.V()");

    CompletableFuture<List<Result>> completableFutureResults = results.all();
    List<Result> resultList = completableFutureResults.get();

    for (Result result : resultList) {
        System.out.println(result.toString());
    }
    ```
## Update your connection string

1. Open the src/remote.yaml file. 

3. Fill in your *host*, *port*, *username*, *password*, *connectionPool*, and *serializer* configurations in the src/remote.yaml file:

    Setting|Suggested value|Description
    ---|---|---
    Hosts|[***.graphs.azure.com]|See screenshot below. This is the Gremlin URI value on the Overview page of the Azure portal, in square brackets, with the trailing :443/ removed.<br><br>This value can also be retrieved from the Keys tab, using the URI value by removing https://, changing documents to graphs, and removing the trailing :443/.
    Port|443|Set to 443.
    Username|*Your username*|The resource of the form `/dbs/<db>/colls/<coll>` where `<db>` is your database name and `<coll>` is your collection name.
    Password|*Your primary master key*|See second screenshot below. This is your primary key, which you can retrieve from the Keys page of the Azure portal, in the Primary Key box. Use the copy button on the left side of the box to copy the value.
    ConnectionPool|{enableSsl: true}|Your connection pool setting for SSL.
    Serializer|{ className: org.apache.tinkerpop.gremlin.<br>driver.ser.GraphSONMessageSerializerV1d0,<br> config: { serializeResultToString: true }}|Set to this value and delete any `\n` line breaks when pasting in the value.

    For the Hosts value, copy the **Gremlin URI** value from the **Overview** page:
![View and copy the Gremlin URI value on the Overview page in the Azure portal](./media/create-graph-java/gremlin-uri.png)

    For the Password value, copy the **Primary key** from the **Keys** page:
![View and copy your primary key in the Azure portal, Keys page](./media/create-graph-java/keys.png)

## Run the console app

1. Run `mvn package` in a terminal to install required Java packages.

2. Run `mvn exec:java -D exec.mainClass=GetStarted.Program` in a terminal to start your Java application.

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Browse using the Data Explorer

You can now go back to Data Explorer in the Azure portal and browse and query your new graph data.

* In Data Explorer, the new database appears in the Collections pane. Expand **graphdb**, **graphcoll**, and then click **Graph**.

    The data generated by the sample app is displayed in the Graphs pane.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps: 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a graph using the Data Explorer, and run an app. You can now build more complex queries and implement powerful graph traversal logic using Gremlin. 

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query-graph.md)

