---
title: Create an Azure Cosmos DB graph database with Java | Microsoft Docs
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
ms.topic: quickstart
ms.date: 10/20/2017
ms.author: denlee

---
# Azure Cosmos DB: Create a graph database using Java and the Azure portal

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. Using Azure Cosmos DB, you can quickly create and query managed document, table, and graph databases. 

This quickstart creates a simple graph database using the Azure portal tools for Azure Cosmos DB. This quickstart also shows you how to quickly create a Java console app using a graph database using the OSS [Gremlin Java](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver) driver. The instructions in this quickstart can be followed on any operating system that is capable of running Java. This quickstart familiarizes you with creating and modifying graphs in either the UI or programmatically, whichever is your preference. 

## Prerequisites
[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

In addition:

* [Java Development Kit (JDK) 1.7+](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](http://maven.apache.org/download.cgi) and [install](http://maven.apache.org/install.html) a [Maven](http://maven.apache.org/) binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create a database account

Before you can create a graph database, you need to create a Gremlin (Graph) database account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-graph](../../includes/cosmos-db-create-dbaccount-graph.md)]

## Add a graph

You can now use the Data Explorer tool in the Azure portal to create a graph database. 

1. Click **Data Explorer** > **New Graph**.

    The **Add Graph** area is displayed on the far right, you may need to scroll right to see it.

    ![The Azure portal Data Explorer, Add Graph page](./media/create-graph-java/azure-cosmosdb-data-explorer-graph.png)

2. In the **Add graph** page, enter the settings for the new graph.

    Setting|Suggested value|Description
    ---|---|---
    Database ID|sample-database|Enter *sample-database* as the name for the new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    Graph ID|sample-graph|Enter *sample-graph* as the name for your new collection. Graph names have the same character requirements as database IDs.
    Storage Capacity|Fixed (10 GB)|Change the value to **Fixed (10 GB)**. This value is the storage capacity of the database.
    Throughput|400 RUs|Change the throughput to 400 request units per second (RU/s). If you want to reduce latency, you can scale up the throughput later.
    Partition key|Leave blank|For the purpose of this quickstart, leave the partition key blank.

3. Once the form is filled out, click **OK**.

## Clone the sample application

Now let's switch to working with code. Let's clone a Graph API app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically.  

1. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app.  

    ```bash
    cd "C:\git-samples"
    ```

2. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-graph-java-getting-started.git
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. The snippets are all taken from the `Program.java` file in the C:\git-samples\azure-cosmos-db-graph-java-getting-started\src\GetStarted folder. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

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

## Update your connection information

Now go back to the Azure portal to get your connection information and copy it into the app. These settings enable your app to communicate with your hosted database.

1. In the [Azure portal](http://portal.azure.com/), click **Keys**. 

    Copy the first portion of the URI value.

    ![View and copy an access key in the Azure portal, Keys page](./media/create-graph-java/keys.png)
2. Open the src/remote.yaml file and paste the value over `$name$` in `hosts: [$name$.graphs.azure.com]`.

    Line 1 of remote.yaml should now look similar to 

    `hosts: [test-graph.graphs.azure.com]`

3. In the Azure portal, use the copy button to copy the PRIMARY KEY and paste it over `$masterKey$` in `password: $masterKey$`.

    Line 4 of remote.yaml should now look similar to 

    `password: 2Ggkr662ifxz2Mg==`

4. Change line 3 of remote.yaml from

    `username: /dbs/$database$/colls/$collection$`

    to 

    `username: /dbs/sample-database/colls/sample-graph`

5. Save the remote.yaml file.

## Run the console app

1. In the git terminal window, `cd` to the azure-cosmos-db-graph-java-getting-started folder.

    ```git
    cd "C:\git-samples\azure-cosmos-db-graph-java-getting-started"
    ```

2. In the git terminal window, type `mvn package` to install the required Java packages.

3. In the git terminal window, run `mvn exec:java -D exec.mainClass=GetStarted.Program` to start your Java application.

    The terminal window displays the vertices being added to the graph. Once the program stops, switch back to the Azure portal in your internet browser. 

<a id="add-sample-data"></a>
## Review and add sample data

You can now go back to Data Explorer and see the vertices added to the graph, and add additional data points.

1. Click **Data Explorer**, expand **sample-graph**, click **Graph**, and then click **Apply Filter**. 

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-data-explorer-expanded.png)

2. In the **Results** list, notice the new users added to the graph. Select **ben** and notice that he's connected to robin. You can move the vertices around by dragging and dropping, zoom in and out by scrolling the wheel of your mouse, and expand the size of the graph with the double-arrow. 

   ![New vertices in the graph in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-graph-explorer-new.png)

3. Let's add a few new users. Click the **New Vertex** button to add data to your graph.

   ![Create new documents in Data Explorer in the Azure portal](./media/create-graph-java/azure-cosmosdb-data-explorer-new-vertex.png)

4. Enter a label of *person*.

5. Click **Add property** to add each of the following properties. Notice that you can create unique properties for each person in your graph. Only the id key is required.

    key|value|Notes
    ----|----|----
    id|ashley|The unique identifier for the vertex. If you don't specify an id, one is generated for you.
    gender|female| 
    tech | java | 

    > [!NOTE]
    > In this quickstart we create a non-partitioned collection. However, if you create a partitioned collection by specifying a partition key during the collection creation, then you need to include the partition key as a key in each new vertex. 

6. Click **OK**. You may need to expand your screen to see **OK** on the bottom of the screen.

7. Click **New Vertex** again and add an additional new user. 

8. Enter a label of *person*.

9. Click **Add property** to add each of the following properties:

    key|value|Notes
    ----|----|----
    id|rakesh|The unique identifier for the vertex. If you don't specify an id, one is generated for you.
    gender|male| 
    school|MIT| 

10. Click **OK**. 

11. Click **Apply Filter** with the default `g.V()` filter to display all the values in the graph. All of the users now show in the **Results** list. 

    As you add more data, you can use filters to limit your results. By default, Data Explorer uses `g.V()` to retrieve all vertices in a graph. You can change it to a different [graph query](tutorial-query-graph.md), such as `g.V().count()`, to return a count of all the vertices in the graph in JSON format. If you changed the filter, change the filter back to `g.V()` and click **Apply Filter** to display all the results again.

12. Now we can connect rakesh and ashley. Ensure **ashley** in selected in the **Results** list, then click the edit button next to **Targets** on lower right side. You may need to widen your window to see the **Properties** area.

   ![Change the target of a vertex in a graph](./media/create-graph-java/azure-cosmosdb-data-explorer-edit-target.png)

13. In the **Target** box type *rakesh*, and in the **Edge label** box type *knows*, and then click the check.

   ![Add a connection between ashley and rakesh in Data Explorer](./media/create-graph-java/azure-cosmosdb-data-explorer-set-target.png)

14. Now select **rakesh** from the results list and see that ashley and rakesh are connected. 

   ![Two vertices connected in Data Explorer](./media/create-graph-java/azure-cosmosdb-graph-explorer.png)

   That completes the resource creation part of this tutorial.You can continue to add vertexes to your graph, modify the existing vertexes, or change the queries. Now let's review the metrics Azure Cosmos DB provides, and then clean up the resources. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a graph using the Data Explorer, and run an app. You can now build more complex queries and implement powerful graph traversal logic using Gremlin. 

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query-graph.md)

