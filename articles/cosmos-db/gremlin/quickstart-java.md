---
title: Build a graph database with Java in Azure Cosmos DB
description: Presents a Java code sample you can use to connect to and query graph data in Azure Cosmos DB using Gremlin.
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.devlang: java
ms.topic: quickstart
ms.date: 03/26/2019
author: manishmsfte
ms.author: mansha
ms.custom: seo-java-july2019, seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022
---

# Quickstart: Build a graph database with the Java SDK and the Azure Cosmos DB for Gremlin
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

> [!div class="op_single_selector"]
> * [Gremlin console](quickstart-console.md)
> * [.NET](quickstart-dotnet.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Python](quickstart-python.md)
> * [PHP](quickstart-php.md)
>  

In this quickstart, you create and manage an Azure Cosmos DB for Gremlin (graph) API account from the Azure portal, and add data by using a Java app cloned from GitHub. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). 
- [Java Development Kit (JDK) 8](/java/openjdk/download#openjdk-8). Point your `JAVA_HOME` environment variable to the folder where the JDK is installed.
- A [Maven binary archive](https://maven.apache.org/download.cgi). 
- [Git](https://www.git-scm.com/downloads). 
- [Gremlin-driver 3.4.13](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver/3.4.13), this dependency is mentioned in the quickstart sample's pom.xml

## Create a database account

Before you can create a graph database, you need to create a Gremlin (Graph) database account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-graph](../includes/cosmos-db-create-dbaccount-graph.md)]

## Add a graph

[!INCLUDE [cosmos-db-create-graph](../includes/cosmos-db-create-graph.md)]

## Clone the sample application

Now let's switch to working with code. Let's clone a Gremlin API app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically.  

1. Open a command prompt, create a new folder named git-samples, then close the command prompt.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app.  

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-graph-java-getting-started.git
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-information).

The following snippets are all taken from the *C:\git-samples\azure-cosmos-db-graph-java-getting-started\src\GetStarted\Program.java* file.

This Java console app uses a [Gremlin API](introduction.md) database with the OSS [Apache TinkerPop](https://tinkerpop.apache.org/) driver. 

- The Gremlin `Client` is initialized from the configuration in the *C:\git-samples\azure-cosmos-db-graph-java-getting-started\src\remote.yaml* file.

    ```java
    cluster = Cluster.build(new File("src/remote.yaml")).create();
    ...
    client = cluster.connect();
    ```

- Series of Gremlin steps are executed using the `client.submit` method.

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

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Keys**. 

    Copy the first portion of the URI value.

    :::image type="content" source="./media/quickstart-java/copy-access-key-azure-portal.png" alt-text="View and copy an access key in the Azure portal, Keys page":::

2. Open the *src/remote.yaml* file and paste the unique ID value over `$name$` in `hosts: [$name$.graphs.azure.com]`.

    Line 1 of *remote.yaml* should now look similar to 

    `hosts: [test-graph.graphs.azure.com]`

3. Change `graphs` to `gremlin.cosmosdb` in the `endpoint` value. (If you created your graph database account before December 20, 2017, make no changes to the endpoint value and continue to the next step.)

    The endpoint value should now look like this:

    `"endpoint": "https://testgraphacct.gremlin.cosmosdb.azure.com:443/"`

4. In the Azure portal, use the copy button to copy the PRIMARY KEY and paste it over `$masterKey$` in `password: $masterKey$`.

    Line 4 of *remote.yaml* should now look similar to 

    `password: 2Ggkr662ifxz2Mg==`

5. Change line 3 of *remote.yaml* from

    `username: /dbs/$database$/colls/$collection$`

    to 

    `username: /dbs/sample-database/colls/sample-graph`

    If you used a unique name for your sample database or graph, update the values as appropriate.

6. Save the *remote.yaml* file.

## Run the console app

1. In the git terminal window, `cd` to the azure-cosmos-db-graph-java-getting-started folder.

    ```git
    cd "C:\git-samples\azure-cosmos-db-graph-java-getting-started"
    ```

2. In the git terminal window, use the following command to install the required Java packages.

   ```git
   mvn package
   ```

3. In the git terminal window, use the following command to start the Java application.
    
    ```git
    mvn exec:java -D exec.mainClass=GetStarted.Program
    ```

    The terminal window displays the vertices being added to the graph. 
    
    If you experience timeout errors, check that you updated the connection information correctly in [Update your connection information](#update-your-connection-information), and also try running the last command again. 
    
    Once the program stops, select Enter, then switch back to the Azure portal in your internet browser. 

<a id="add-sample-data"></a>
## Review and add sample data

You can now go back to Data Explorer and see the vertices added to the graph, and add additional data points.

1. In your Azure Cosmos DB account in the Azure portal, select **Data Explorer**, expand **sample-graph**, select **Graph**, and then select **Apply Filter**. 

   :::image type="content" source="./media/quickstart-java/azure-cosmosdb-data-explorer-expanded.png" alt-text="Screenshot shows Graph selected from the A P I with the option to Apply Filter.":::

2. In the **Results** list, notice the new users added to the graph. Select **ben** and notice that the user is connected to robin. You can move the vertices around by dragging and dropping, zoom in and out by scrolling the wheel of your mouse, and expand the size of the graph with the double-arrow. 

   :::image type="content" source="./media/quickstart-java/azure-cosmosdb-graph-explorer-new.png" alt-text="New vertices in the graph in Data Explorer in the Azure portal":::

3. Let's add a few new users. Select **New Vertex** to add data to your graph.

   :::image type="content" source="./media/quickstart-java/azure-cosmosdb-data-explorer-new-vertex.png" alt-text="Screenshot shows the New Vertex pane where you can enter values.":::

4. In the label box, enter *person*.

5. Select **Add property** to add each of the following properties. Notice that you can create unique properties for each person in your graph. Only the id key is required.

    key|value|Notes
    ----|----|----
    id|ashley|The unique identifier for the vertex. If you don't specify an id, one is generated for you.
    gender|female| 
    tech | java | 

    > [!NOTE]
    > In this quickstart you create a non-partitioned collection. However, if you create a partitioned collection by specifying a partition key during the collection creation, then you need to include the partition key as a key in each new vertex. 

6. Select **OK**. You may need to expand your screen to see **OK** on the bottom of the screen.

7. Select **New Vertex** again and add an additional new user. 

8. Enter a label of *person*.

9. Select **Add property** to add each of the following properties:

    key|value|Notes
    ----|----|----
    id|rakesh|The unique identifier for the vertex. If you don't specify an id, one is generated for you.
    gender|male| 
    school|MIT| 

10. Select **OK**. 

11. Select the **Apply Filter** button with the default `g.V()` filter to display all the values in the graph. All of the users now show in the **Results** list. 

    As you add more data, you can use filters to limit your results. By default, Data Explorer uses `g.V()` to retrieve all vertices in a graph. You can change it to a different [graph query](tutorial-query.md), such as `g.V().count()`, to return a count of all the vertices in the graph in JSON format. If you changed the filter, change the filter back to `g.V()` and select **Apply Filter** to display all the results again.

12. Now you can connect rakesh, and ashley. Ensure **ashley** is selected in the **Results** list, then select :::image type="content" source="./media/quickstart-java/edit-pencil-button.png" alt-text="Change the target of a vertex in a graph":::  next to **Targets** on lower right side. You may need to widen your window to see the button.

    :::image type="content" source="./media/quickstart-java/azure-cosmosdb-data-explorer-edit-target.png" alt-text="Change the target of a vertex in a graph - Azure CosmosDB":::

13. In the **Target** box enter *rakesh*, and in the **Edge label** box enter *knows*, and then select the check box.

    :::image type="content" source="./media/quickstart-java/azure-cosmosdb-data-explorer-set-target.png" alt-text="Add a connection in Data Explorer - Azure CosmosDB":::

14. Now select **rakesh** from the results list and see that ashley and rakesh are connected. 

    :::image type="content" source="./media/quickstart-java/azure-cosmosdb-graph-explorer.png" alt-text="Two vertices connected in Data Explorer - Azure CosmosDB":::

That completes the resource creation part of this tutorial. You can continue to add vertexes to your graph, modify the existing vertexes, or change the queries. Now let's review the metrics Azure Cosmos DB provides, and then clean up the resources. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB account, create a graph using the Data Explorer, and run a Java app that adds data to the graph. You can now build more complex queries and implement powerful graph traversal logic using Gremlin. 

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query.md)
