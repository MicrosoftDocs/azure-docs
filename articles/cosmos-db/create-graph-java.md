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
ms.date: 08/04/2017
ms.author: denlee

---
# Azure Cosmos DB: Build a Java application using the Graph API

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quickstart walks you through the Azure portal tools available for Azure Cosmos DB and shows you how to quickly create a console app using the OSS [Gremlin Java](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver) driver. The instructions in this tutorial can be followed on any operating system that is capable of running Java. By completing this tutorial you'll be familiar with creating and modifying graph resources in either the UI or programatically, whichever is your preference. 

## Prerequisites

* [Java Development Kit (JDK) 1.7+](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](http://maven.apache.org/download.cgi) and [install](http://maven.apache.org/install.html) a [Maven](http://maven.apache.org/) binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-graph](../../includes/cosmos-db-create-dbaccount-graph.md)]

## Add a graph

[!INCLUDE [cosmos-db-create-graph](../../includes/cosmos-db-create-graph.md)]

<a id="add-sample-data"></a>
## Add sample data

You can now add data to your new graph using Data Explorer.

1. In Data Explorer, the new graph appears in the Graphs pane. Expand the **sample-database** database, expand the **sample-graph** graph, click **Graph**, and then click **Apply Filter**. 

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-data-explorer-expanded.png)
  
2. Click the **New Vertex** button to add data to your graph.

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-data-explorer-new-vertex.png)

3. Enter a label of *ashley* then enter the following keys and values:


    key|value|Notes
    ----|----|----
    userid | ashley1986 |Because we created a partitioned graph, the partition key (`userid` in this tutorial) must be one of the properties set on a new vertex. If you do not set the a key to the partition key value, the Vertex will not save.
    gender|female| 
    tech | java | 
    id|ashley|The unique identifier for the vertex. If you don't specify an id, one is generated for you.

4. Click **New Vertex** again and add an additional new user. Enter a label of *rakesh* then enter the following keys and values:

    key|value|Notes
    ----|----|----
    userid | rakesh1979 |Because we created a partitioned graph, the partition key (`userid` in this tutorial) must be one of the properties set on a new vertex. If you do not set the a key to the partition key value, the Vertex will not save.
    gender|male| 
    school|MIT| 
    id|rakesh|The unique identifier for the vertex. If you don't specify an id, one is generated for you.

5. Click **Apply Filter** with the default `g.V()` filter. All of the users now show in the **Results** list. As you add more data you can use filters to limit your results. By default, Data Explorer uses `g.V()` to retrieve all vertices in a graph, but you can change that to a different [graph query](tutorial-query-graph.md), such as `g.V().count()`, to return a count of all the vertices in the graph in JSON format.

6. Now we'll connect the users. Ensure **ashley** in selected in the **Results** list, then click the edit button next to **Targets** on lower far right. You may need to widen your window to see the **Properties** area.

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-data-explorer-edit-target.png)

7. In the **Target** box type *rakesh*, and in the **Edge label** box type *knows*, and then click the check box.

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-data-explorer-set-target.png)

    Now select **rakesh** from the results list and you'll see that ashley and rakesh are connected. You can move the vertices around on the graph viewer and zoom in and out. 

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-graph-explorer.png)

    You can also use Data Explorer to create stored procedures, UDFs, and triggers to perform server-side business logic as well as scale throughput. Data Explorer exposes all of the built-in programmatic data access available in the APIs, but provides easy access to your data in the Azure portal.

## Clone the sample application

Now let's clone a Graph API (preview) app from github, set the connection string, and run it. You see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `cd` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-graph-java-getting-started.git
    ```

## Review the code

Let's make a quick review of what's happening in the app. Open the `Program.java` file from the \src\GetStarted folder and find these lines of code. 

* The Gremlin `Client` is initialized from the configuration in `src/remote.yaml`.

    ```java
    cluster = Cluster.build(new File("src/remote.yaml")).create();
    ...
    client = cluster.connect();
    ```

* A series of Gremlin steps are executed using the `client.submit` method.

    ```java
    ResultSet results = client.submit(gremlin);

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

1. In the git terminal window, `cd` to the azure-cosmos-db-graph-java-getting-started folder.

2. In the git terminal window, type `mvn package` to install the required Java packages.

3. In the git terminal window, run `mvn exec:java -D exec.mainClass=GetStarted.Program` in the terminal window to start your Java application.

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

