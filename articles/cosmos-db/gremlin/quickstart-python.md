---
title: 'Quickstart: Gremlin API with Python - Azure Cosmos DB'
description: This quickstart shows how to use the Azure Cosmos DB for Gremlin to create a console application with the Azure portal and Python
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.devlang: python
ms.topic: quickstart
ms.date: 02/14/2023
author: manishmsfte
ms.author: mansha
ms.custom: devx-track-python, mode-api, ignite-2022, py-fresh-zinc
---
# Quickstart: Create a graph database in Azure Cosmos DB using Python and the Azure portal
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

> [!div class="op_single_selector"]
> * [Gremlin console](quickstart-console.md)
> * [.NET](quickstart-dotnet.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Python](quickstart-python.md)
> * [PHP](quickstart-php.md)
>  

In this quickstart, you create and manage an Azure Cosmos DB for Gremlin (graph) API account from the Azure portal, and add data by using a Python app cloned from GitHub. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription.
- [Python 3.7+](https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy) including [pip](https://pip.pypa.io/en/stable/installing/) package installer.
- [Python Driver for Gremlin](https://github.com/apache/tinkerpop/tree/master/gremlin-python).

  You can also install the Python driver for Gremlin by using the `pip` command line:

   ```bash
   pip install gremlinpython==3.7.*
   ```

- [Git](https://git-scm.com/downloads).

## Create a database account

Before you can create a graph database, you need to create a Gremlin (Graph) database account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-graph](../includes/cosmos-db-create-dbaccount-graph.md)]

## Add a graph

[!INCLUDE [cosmos-db-create-graph](../includes/cosmos-db-create-graph.md)]

## Clone the sample application

Now let's switch to working with code. Let's clone a Gremlin API app from GitHub, set the connection string, and run it. You'll see how easy it's to work with data programmatically.  

1. Run the following command to clone the sample repository to your local machine. This command creates a copy of the sample app on your computer. Start at in the root of the folder where you typically store GitHub repositories.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-graph-python-getting-started.git
    ```

1. Change to the directory where the sample app is located.

    ```bash
    cd azure-cosmos-db-graph-python-getting-started
    ```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. The snippets are all taken from the *connect.py* file in the repo [git-samples\azure-cosmos-db-graph-python-getting-started](https://github.com/Azure-Samples/azure-cosmos-db-graph-python-getting-started). Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-information).

* The Gremlin `client` is initialized in *connect.py* with `client.Client()`. Make sure to replace `<YOUR_DATABASE>` and `<YOUR_CONTAINER_OR_GRAPH>` with the values of your account's database name and graph name:

    ```python
    ...
    client = client.Client('wss://<YOUR_ENDPOINT>.gremlin.cosmosdb.azure.com:443/','g', 
        username="/dbs/<YOUR_DATABASE>/colls/<YOUR_CONTAINER_OR_GRAPH>", 
        password="<YOUR_PASSWORD>")
    ...
    ```

* A series of Gremlin steps (queries) are declared at the beginning of the *connect.py* file. They're then executed using the `client.submitAsync()` method. For example, to run the cleanup graph step, you'd use the following code:

    ```python
    client.submitAsync(_gremlin_cleanup_graph)
    ```

## Update your connection information

Now go back to the Azure portal to get your connection information and copy it into the app. These settings enable your app to communicate with your hosted database.

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Keys**. 

    Copy the first portion of the **URI** value.

    :::image type="content" source="./media/quickstart-python/keys.png" alt-text="View and copy an access key in the Azure portal, Keys page":::

2. Open the *connect.py* file, find the `client.Client()` definition, and paste the URI value over `<YOUR_ENDPOINT>` in here:

    ```python
    client = client.Client('wss://<YOUR_ENDPOINT>.gremlin.cosmosdb.azure.com:443/','g', 
        username="/dbs/<YOUR_DATABASE>/colls/<YOUR_COLLECTION_OR_GRAPH>", 
        password="<YOUR_PASSWORD>")
    ```

    The URI portion of the client object should now look similar to this code:

    ```python
    client = client.Client('wss://test.gremlin.cosmosdb.azure.com:443/','g', 
        username="/dbs/<YOUR_DATABASE>/colls/<YOUR_COLLECTION_OR_GRAPH>", 
        password="<YOUR_PASSWORD>")
    ```

3. Change the second parameter of the `client` object to replace the `<YOUR_DATABASE>` and `<YOUR_COLLECTION_OR_GRAPH>` strings. If you used the suggested values, the parameter should look like this code:

    `username="/dbs/sample-database/colls/sample-graph"`

    The entire `client` object should now look like this code:

    ```python
    client = client.Client('wss://test.gremlin.cosmosdb.azure.com:443/','g', 
        username="/dbs/sample-database/colls/sample-graph", 
        password="<YOUR_PASSWORD>")
    ```

4. On the **Keys** page, use the copy button to copy the **PRIMARY KEY** and paste it over `<YOUR_PASSWORD>` in the `password=<YOUR_PASSWORD>` parameter.

    The `client` object definition should now look similar to the following:
    ```python
    client = client.Client('wss://test.gremlin.cosmosdb.azure.com:443/','g', 
        username="/dbs/sample-database/colls/sample-graph", 
        password="asdb13Fadsf14FASc22Ggkr662ifxz2Mg==")
    ```

6. Save the *connect.py* file.

## Run the console app

1. Start in a terminal window in the root of the folder where you cloned the sample app. If you are using Visual Studio Code, you can open a terminal window by selecting **Terminal** > **New Terminal**. Typically, you'll create a virtual environment to run the code. For more information, see [Python virtual environments](https://docs.python.org/3/tutorial/venv.html).

    ```bash
    cd azure-cosmos-db-graph-python-getting-started
    ```

1. Install the required Python packages.

   ```
   pip install -r requirements.txt
   ```

1. Start the Python application.
    
    ```
    python connect.py
    ```

    The terminal window displays the vertices and edges being added to the graph. 
    
    If you experience timeout errors, check that you updated the connection information correctly in [Update your connection information](#update-your-connection-information), and also try running the last command again. 
    
    Once the program stops, press Enter, then switch back to the Azure portal in your internet browser.

<a id="add-sample-data"></a>
## Review and add sample data

After the vertices and edges are inserted, you can now go back to Data Explorer and see the vertices added to the graph, and add more data points.

1. In your Azure Cosmos DB account in the Azure portal, select **Data Explorer**, expand **sample-database**, expand **sample-graph**, select **Graph**, and then select **Execute Gremlin Query**. 

   :::image type="content" source="./media/quickstart-python/azure-cosmosdb-data-explorer-expanded.png" alt-text="Screenshot shows Graph selected from the A P I with the option to Execute Gremlin Query.":::

2. In the **Results** list, notice three new users are added to the graph. You can move the vertices around by dragging and dropping, zoom in and out by scrolling the wheel of your mouse, and expand the size of the graph with the double-arrow. 

   :::image type="content" source="./media/quickstart-python/azure-cosmosdb-graph-explorer-new.png" alt-text="New vertices in the graph in Data Explorer in the Azure portal":::

3. Let's add a few new users. Select the **New Vertex** button to add data to your graph.

   :::image type="content" source="./media/quickstart-python/azure-cosmosdb-data-explorer-new-vertex.png" alt-text="Screenshot shows the New Vertex pane where you can enter values.":::

4. Enter a label of *person*.

5. Select **Add property** to add each of the following properties. Notice that you can create unique properties for each person in your graph. Only the ID key is required.

    key|value|Notes
    ----|----|----
    pk|/pk| 
    id|ashley|The unique identifier for the vertex. If you don't specify an ID, one is generated for you.
    gender|female| 
    tech | java | 

    > [!NOTE]
    > In this quickstart create a non-partitioned collection. However, if you create a partitioned collection by specifying a partition key during the collection creation, then you need to include the partition key as a key in each new vertex. 

6. Select **OK**. You may need to expand your screen to see **OK** on the bottom of the screen.

7. Select **New Vertex** again and add another new user. 

8. Enter a label of *person*.

9. Select **Add property** to add each of the following properties:

    key|value|Notes
    ----|----|----
    pk|/pk| 
    id|rakesh|The unique identifier for the vertex. If you don't specify an ID, one is generated for you.
    gender|male| 
    school|MIT| 

10. Select **OK**. 

11. Select the **Execute Gremlin Query** button with the default `g.V()` filter to display all the values in the graph. All of the users now show in the **Results** list. 

    As you add more data, you can use filters to limit your results. By default, Data Explorer uses `g.V()` to retrieve all vertices in a graph. You can change it to a different [graph query](tutorial-query.md), such as `g.V().count()`, to return a count of all the vertices in the graph in JSON format. If you changed the filter, change the filter back to `g.V()` and select **Execute Gremlin Query** to display all the results again.

12. Now we can connect **rakesh** and **ashley**. Ensure **ashley** is selected in the **Results** list, then select the edit button next to **Targets** on lower right side. You may need to widen your window to see the **Properties** area.

    :::image type="content" source="./media/quickstart-python/azure-cosmosdb-data-explorer-edit-target.png" alt-text="Change the target of a vertex in a graph":::

13. In the **Target** box type *rakesh*, and in the **Edge label** box type *knows*, and then select the check.

    :::image type="content" source="./media/quickstart-python/azure-cosmosdb-data-explorer-set-target.png" alt-text="Add a connection between ashley and rakesh in Data Explorer":::

14. Now select **rakesh** from the results list and see that ashley and rakesh are connected. 

    :::image type="content" source="./media/quickstart-python/azure-cosmosdb-graph-explorer.png" alt-text="Two vertices connected in Data Explorer":::

That completes the resource creation part of this tutorial. You can continue to add vertexes to your graph, modify the existing vertexes, or change the queries. Now let's review the metrics Azure Cosmos DB provides, and then clean up the resources. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB account, create a graph using the Data Explorer, and run a Python app to add data to the graph. You can now build more complex queries and implement powerful graph traversal logic using Gremlin. 

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query.md)
