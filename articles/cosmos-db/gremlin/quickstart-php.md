---
title: 'Quickstart: Gremlin API with PHP - Azure Cosmos DB'
description: Follow this quickstart to run a PHP console application that populates an Azure Cosmos DB for Gremlin database in the Azure portal.
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.devlang: php
ms.topic: quickstart
ms.date: 06/29/2022
author: manishmsfte
ms.author: mansha
ms.custom: mode-api, kr2b-contr-experiment, ignite-2022
---
# Quickstart: Create an Azure Cosmos DB graph database with PHP and the Azure portal

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

> [!div class="op_single_selector"]
> * [Gremlin console](quickstart-console.md)
> * [.NET](quickstart-dotnet.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Python](quickstart-python.md)
> * [PHP](quickstart-php.md)
>  

In this quickstart, you create and use an Azure Cosmos DB [Gremlin (Graph) API](introduction.md) database by using PHP and the Azure portal.

Azure Cosmos DB is Microsoft's multi-model database service that lets you quickly create and query document, table, key-value, and graph databases, with global distribution and horizontal scale capabilities. Azure Cosmos DB provides five APIs: Core (SQL), MongoDB, Gremlin, Azure Table, and Cassandra.

You must create a separate account to use each API. In this article, you create an account for the Gremlin (Graph) API.

This quickstart walks you through the following steps:

- Use the Azure portal to create an Azure Cosmos DB for Gremlin (Graph) API account and database.
- Clone a sample Gremlin API PHP console app from GitHub, and run it to populate your database.
- Use Data Explorer in the Azure portal to query, add, and connect data in your database.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)] Alternatively, you can [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb) without an Azure subscription.
- [PHP](https://php.net/) 5.6 or newer installed.
- [Composer](https://getcomposer.org/download) open-source dependency management tool for PHP installed.

## Create a Gremlin (Graph) database account

First, create a Gremlin (Graph) database account for Azure Cosmos DB.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** from the left menu.

   :::image type="content" source="../includes/media/cosmos-db-create-dbaccount-graph/create-nosql-db-databases-json-tutorial-0.png" alt-text="Screenshot of Create a resource in the Azure portal.":::   

1. On the **New** page, select **Databases** > **Azure Cosmos DB**.

1. On the **Select API Option** page, under **Gremlin (Graph)**, select **Create**.

1. On the **Create Azure Cosmos DB Account - Gremlin (Graph)** page, enter the following required settings for the new account:

   - **Subscription**: Select the Azure subscription that you want to use for this account.
   - **Resource Group**: Select **Create new**, then enter a unique name for the new resource group.
   - **Account Name**: Enter a unique name between 3-44 characters, using only lowercase letters, numbers, and hyphens. Your account URI is *gremlin.azure.com* appended to your unique account name.
   - **Location**: Select the Azure region to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to the data.

   :::image type="content" source="../includes/media/cosmos-db-create-dbaccount-graph/azure-cosmos-db-create-new-account.png" alt-text="Screenshot showing the Create Account page for Azure Cosmos DB for a Gremlin (Graph) account.":::

1. For this quickstart, you can leave the other fields and tabs at their default values. Optionally, you can configure more details for the account. See [Optional account settings](#optional-account-settings).

1. Select **Review + create**, and then select **Create**. Deployment takes a few minutes.

1. When the **Your deployment is complete** message appears, select **Go to resource**.

   You go to the **Overview** page for the new Azure Cosmos DB account.

   :::image type="content" source="../includes/media/cosmos-db-create-dbaccount-graph/azure-cosmos-db-graph-created.png" alt-text="Screenshot showing the Azure Cosmos DB Quick start page.":::

### Optional account settings

Optionally, you can also configure the following settings on the **Create Azure Cosmos DB Account - Gremlin (Graph)** page.

- On the **Basics** tab:

  |Setting|Value|Description |
  |---|---|---|
  |**Capacity mode**|**Provisioned throughput** or **Serverless**|Select **Provisioned throughput** to create an account in [provisioned throughput](../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../serverless.md) mode.|
  |**Apply Azure Cosmos DB free tier discount**|**Apply** or **Do not apply**|With Azure Cosmos DB free tier, you get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/).|

  > [!NOTE]
  > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you don't see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.
  
- On the **Global Distribution** tab:

  |Setting|Value|Description |
  |---|---|---|
  |**Geo-redundancy**|**Enable** or **Disable**|Enable or disable global distribution on your account by pairing your region with a pair region. You can add more regions to your account later.|
  |**Multi-region Writes**|**Enable** or **Disable**|Multi-region writes capability allows you to take advantage of the provisioned throughput for your databases and containers across the globe.|

  > [!NOTE]
  > The following options aren't available if you select **Serverless** as the **Capacity mode**:
  > - **Apply Free Tier Discount**
  > - **Geo-redundancy**
  > - **Multi-region Writes**

- Other tabs:

  - **Networking**: Configure [access from a virtual network](../how-to-configure-vnet-service-endpoint.md).
  - **Backup Policy**: Configure either [periodic](../configure-periodic-backup-restore.md) or [continuous](../provision-account-continuous-backup.md) backup policy.
  - **Encryption**: Use either a service-managed key or a [customer-managed key](../how-to-setup-cmk.md#create-a-new-azure-cosmos-account).
  - **Tags**: Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

## Add a graph
   
1. On the Azure Cosmos DB account **Overview** page, select **Add Graph**.

   :::image type="content" source="../includes/media/cosmos-db-create-dbaccount-graph/azure-cosmos-db-add-graph.png" alt-text="Screenshot showing the Add Graph on the Azure Cosmos DB account page.":::

1. Fill out the **New Graph** form. For this quickstart, use the following values:

   - **Database id**: Enter *sample-database*. Database names must be between 1 and 255 characters, and can't contain `/ \ # ?` or a trailing space.
   - **Database Throughput**: Select **Manual**, so you can set the throughput to a low value.
   - **Database Max RU/s**: Change the throughput to *400* request units per second (RU/s). If you want to reduce latency, you can scale up throughput later.
   - **Graph id**: Enter *sample-graph*. Graph names have the same character requirements as database IDs.
   - **Partition key**: Enter */pk*. All Cosmos DB accounts need a partition key to horizontally scale. To learn how to select an appropriate partition key, see [Use a partitioned graph in Azure Cosmos DB](partitioning.md).

   :::image type="content" source="../includes/media/cosmos-db-create-graph/azure-cosmosdb-data-explorer-graph.png" alt-text="Screenshot showing the Azure Cosmos DB Data Explorer, New Graph page.":::

1. Select **OK**. The new graph database is created.

### Get the connection keys

Get the Azure Cosmos DB account connection keys to use later in this quickstart.

1. On the Azure Cosmos DB account page, select **Keys** under **Settings** in the left navigation.

1. Copy and save the following values to use later in the quickstart:

   - The first part (Azure Cosmos DB account name) of the **.NET SDK URI**.
   - The **PRIMARY KEY** value.

   :::image type="content" source="media/quickstart-php/keys.png" alt-text="Screenshot that shows the access keys for the Azure Cosmos DB account.":::


## Clone the sample application

Now, switch to working with code. Clone a Gremlin API app from GitHub, set the connection string, and run the app to see how easy it is to work with data programmatically.

1. In git terminal window, such as git bash, create a new folder named *git-samples*.

   ```bash
   mkdir "C:\git-samples"
   ```

1. Switch to the new folder.

   ```bash
   cd "C:\git-samples"
   ```

1. Run the following command to clone the sample repository and create a copy of the sample app on your computer.

   ```bash
   git clone https://github.com/Azure-Samples/azure-cosmos-db-graph-php-getting-started.git
   ```

Optionally, you can now review the PHP code you cloned. Otherwise, go to [Update your connection information](#update-your-connection-information).

### Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. The snippets are all taken from the *connect.php* file in the *C:\git-samples\azure-cosmos-db-graph-php-getting-started* folder.

- The Gremlin `connection` is initialized in the beginning of the `connect.php` file, using the `$db` object.

  ```php
  $db = new Connection([
      'host' => '<your_server_address>.graphs.azure.com',
      'username' => '/dbs/<db>/colls/<coll>',
      'password' => 'your_primary_key'
      ,'port' => '443'

      // Required parameter
      ,'ssl' => TRUE
  ]);
  ```

- A series of Gremlin steps execute, using the `$db->send($query);` method.

  ```php
  $query = "g.V().drop()";
  ...
  $result = $db->send($query);
  $errors = array_filter($result);
  }
  ```

## Update your connection information

1. Open the *connect.php* file in the *C:\git-samples\azure-cosmos-db-graph-php-getting-started* folder.

1.  In the `host` parameter, replace `<your_server_address>` with the Azure Cosmos DB account name value you saved from the Azure portal.

1. In the `username` parameter, replace `<db>` and `<coll>` with your database and graph name. If you used the recommended values of `sample-database` and `sample-graph`, it should look like the following code:

   `'username' => '/dbs/sample-database/colls/sample-graph'`

1. In the `password` parameter, replace `your_primary_key` with the PRIMARY KEY value you saved from the Azure portal.

   The `Connection` object initialization should now look like the following code:

   ```php
   $db = new Connection([
       'host' => 'testgraphacct.graphs.azure.com',
       'username' => '/dbs/sample-database/colls/sample-graph',
       'password' => '2Ggkr662ifxz2Mg==',
       'port' => '443'

       // Required parameter
       ,'ssl' => TRUE
   ]);
   ```

1. Save the *connect.php* file.

## Run the console app

1. In the git terminal window, `cd` to the *azure-cosmos-db-graph-php-getting-started* folder.

   ```git
   cd "C:\git-samples\azure-cosmos-db-graph-php-getting-started"
   ```

1. Use the following command to install the required PHP dependencies.

   ```
   composer install
   ```

1. Use the following command to start the PHP application.
    
    ```
    php connect.php
    ```

    The terminal window displays the vertices being added to the graph. 
    
    If you experience timeout errors, check that you updated the connection information correctly in [Update your connection information](#update-your-connection-information), and also try running the last command again.
    
    Once the program stops, press Enter.

<a id="add-sample-data"></a>
## Review and add sample data

You can now go back to Data Explorer in the Azure portal, see the vertices added to the graph, and add more data points.

1. In your Azure Cosmos DB account in the Azure portal, select **Data Explorer**, expand **sample-database** and **sample-graph**, select **Graph**, and then select **Execute Gremlin Query**.

   :::image type="content" source="./media/quickstart-php/azure-cosmosdb-data-explorer-expanded.png" alt-text="Screenshot that shows Graph selected with the option to Execute Gremlin Query.":::

1. In the **Results** list, notice the new users added to the graph. Select **ben**, and notice that they're connected to **robin**. You can move the vertices around by dragging and dropping, zoom in and out by scrolling the wheel of your mouse, and expand the size of the graph with the double-arrow.

   :::image type="content" source="./media/quickstart-php/azure-cosmosdb-graph-explorer-new.png" alt-text="Screenshot that shows new vertices in the graph in Data Explorer.":::

1. Add a new user. Select the **New Vertex** button to add data to your graph.

   :::image type="content" source="./media/quickstart-php/azure-cosmosdb-data-explorer-new-vertex.png" alt-text="Screenshot that shows the New Vertex pane where you can enter values.":::

1. Enter a label of *person*.

1. Select **Add property** to add each of the following properties. You can create unique properties for each person in your graph. Only the **id** key is required.

   Key | Value | Notes
   ----|----|----
   **id** | ashley | The unique identifier for the vertex. If you don't specify an id, one is generated for you.
   **gender** | female | 
   **tech** | java | 

    > [!NOTE]
    > In this quickstart you create a non-partitioned collection. However, if you create a partitioned collection by specifying a partition key during the collection creation, then you need to include the partition key as a key in each new vertex. 

1. Select **OK**.

1. Select **New Vertex** again and add another new user. 

1. Enter a label of *person*.

1. Select **Add property** to add each of the following properties:
   
   Key | Value | Notes
   ----|----|----
   **id** | rakesh | The unique identifier for the vertex. If you don't specify an id, one is generated for you.
   **gender** | male | 
   **school** | MIT | 

1. Select **OK**. 

1. Select **Execute Gremlin Query** with the default `g.V()` filter to display all the values in the graph. All the users now show in the **Results** list.

   As you add more data, you can use filters to limit your results. By default, Data Explorer uses `g.V()` to retrieve all vertices in a graph. You can change to a different [graph query](tutorial-query.md), such as `g.V().count()`, to return a count of all the vertices in the graph in JSON format. If you changed the filter, change the filter back to `g.V()` and select **Execute Gremlin Query** to display all the results again.

1. Now you can connect rakesh and ashley. Ensure **ashley** is selected in the **Results** list, then select the edit icon next to **Targets** at lower right.

   :::image type="content" source="./media/quickstart-php/azure-cosmosdb-data-explorer-edit-target.png" alt-text="Screenshot that shows changing the target of a vertex in a graph.":::

1. In the **Target** box, type *rakesh*, and in the **Edge label** box type *knows*, and then select the check mark.

   :::image type="content" source="./media/quickstart-php/azure-cosmosdb-data-explorer-set-target.png" alt-text="Screenshot that shows adding a connection between ashley and rakesh in Data Explorer.":::

1. Now select **rakesh** from the results list, and see that ashley and rakesh are connected. 

   :::image type="content" source="./media/quickstart-php/azure-cosmosdb-graph-explorer.png" alt-text="Screenshot that shows two vertices connected in Data Explorer.":::

You've completed the resource creation part of this quickstart. You can continue to add vertexes to your graph, modify the existing vertexes, or change the queries.

You can review the metrics that Azure Cosmos DB provides, and then clean up the resources you created.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

This action deletes the resource group and all resources within it, including the Azure Cosmos DB for Gremlin (Graph) account and database.

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for Gremlin (Graph) account and database, clone and run a PHP app, and work with your database using the Data Explorer. You can now build more complex queries and implement powerful graph traversal logic using Gremlin.

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query.md)
