---
title: |
  Tutorial: Create a Jupyter Notebook in Azure Cosmos DB for NoSQL to analyze and visualize data (preview)
description: |
  Learn how to use built-in Jupyter notebooks to import data to Azure Cosmos DB for NoSQL, analyze the data, and visualize the output.
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: overview 
ms.date: 09/29/2022
author: seesharprun
ms.author: sidandrews
ms.reviewer: dech
---

# Tutorial: Create a Jupyter Notebook in Azure Cosmos DB for NoSQL to analyze and visualize data (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!IMPORTANT]
> The Jupyter Notebooks feature of Azure Cosmos DB is currently in a preview state and is progressively rolling out to all customers over time.

This tutorial walks through how to use the Jupyter Notebooks feature of Azure Cosmos DB to import sample retail data to an Azure Cosmos DB for NoSQL account. You'll see how to use the Azure Cosmos DB magic commands to run queries, analyze the data, and visualize the results.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.

## Create a new notebook

In this section, you'll create the Azure Cosmos database, container, and import the retail data to the container.

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer.**

1. Select **New Notebook**.

    :::image type="content" source="media/tutorial-create-notebook/new-notebook-option.png" lightbox="media/tutorial-create-notebook/new-notebook-option.png" alt-text="Screenshot of the Data Explorer with the 'New Notebook' option highlighted.":::

1. In the confirmation dialog that appears, select **Create**.

    > [!NOTE]
    > A temporary workspace will be created to enable you to work with Jupyter Notebooks. When the session expires, any notebooks in the workspace will be removed.

1. Select the kernel you wish to use for the notebook.

### [Python](#tab/python)

:::image type="content" source="media/tutorial-create-notebook/python-kernel.png" alt-text="Screenshot of the Python kernel option in the notebook editor.":::

### [C#](#tab/csharp)

:::image type="content" source="media/tutorial-create-notebook/csharp-kernel.png" alt-text="Screenshot of the C# kernel option in the notebook editor.":::

---

> [!TIP]
> Now that the new notebook has been created, you can rename it to something like **VisualizeRetailData.ipynb**.

## Create a database and container using the SDK

### [Python](#tab/python)

1. Start in the default code cell.

1. Import any packages you require for this tutorial.

    ```python
    import azure.cosmos
    from azure.cosmos.partition_key import PartitionKey
    ```

1. Create a database named **RetailIngest** using the built-in SDK.

    ```python
    database = cosmos_client.create_database_if_not_exists('RetailIngest')
    ```

1. Create a container named **WebsiteMetrics** with a partition key of `/CartID`.

    ```python
    container = database.create_container_if_not_exists(id='WebsiteMetrics', partition_key=PartitionKey(path='/CartID'))
    ```

1. Select **Run** to create the database and container resource.

    :::image type="content" source="media/tutorial-create-notebook/run-cell.png" alt-text="Screenshot of the 'Run' option in the menu.":::

### [C#](#tab/csharp)

1. Start in the default code cell.

1. Import any packages you require for this tutorial.

    ```csharp
    using Microsoft.Azure.Cosmos;
    ```

1. Create a new instance of the client type using the built-in SDK.

    ```csharp
    var cosmosClient = new CosmosClient(Cosmos.Endpoint, Cosmos.Key);
    ```

1. Create a database named **RetailIngest**.

    ```csharp
    Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync("RetailIngest");
    ```

1. Create a container named **WebsiteMetrics** with a partition key of `/CartID`.

    ```csharp
    Container container = await database.CreateContainerIfNotExistsAsync("WebsiteMetrics", "/CartID");
    ```

1. Select **Run** to create the database and container resource.

    :::image type="content" source="media/tutorial-create-notebook/run-cell.png" alt-text="Screenshot of the 'Run' option in the menu.":::

---

## Import data using magic commands

1. Add a new code cell.

1. Within the code cell, add the following magic command to upload, to your existing container, the JSON data from this url: <https://cosmosnotebooksdata.blob.core.windows.net/notebookdata/websiteData.json>

    ```python
    %%upload --databaseName RetailIngest --containerName WebsiteMetrics --url https://cosmosnotebooksdata.blob.core.windows.net/notebookdata/websiteData.json
    ```

1. Select **Run Active Cell** to only run the command in this specific cell.

    :::image type="content" source="media/tutorial-create-notebook/run-active-cell.png" alt-text="Screenshot of the 'Run Active Cell' option in the menu.":::

    > [!NOTE]
    > The import command should take 5-10 seconds to complete.

1. Observe the output from the run command. Ensure that **2,654** documents were imported.

    ```output
    Documents successfully uploaded to WebsiteMetrics
    Total number of documents imported:
      Success: 2654
      Failure: 0
    Total time taken : 00:00:04 hours
    Total RUs consumed : 27309.660000001593
    ```

## Visualize your data

### [Python](#tab/python)

1. Create another new code cell.

1. In the code cell, use a SQL query to populate a [Pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame).

    ```python
    %%sql --database RetailIngest --container WebsiteMetrics --output df_cosmos
    SELECT c.Action, c.Price as ItemRevenue, c.Country, c.Item FROM c
    ```

1. Select **Run Active Cell** to only run the command in this specific cell.

1. Create another new code cell.

1. In the code cell, output the top **10** items from the dataframe.

    ```python
    df_cosmos.head(10)
    ```

1. Select **Run Active Cell** to only run the command in this specific cell.

1. Observe the output of running the command.

    | | Action | ItemRevenue | Country | Item |
    | --- | --- | --- | --- | --- |
    | **0** | Purchased | 19.99 | Macedonia | Button-Up Shirt |
    | **1** | Viewed | 12.00 | Papua New Guinea | Necklace |
    | **2** | Viewed | 25.00 | Slovakia (Slovak Republic) | Cardigan Sweater |
    | **3** | Purchased | 14.00 | Senegal | Flip Flop Shoes |
    | **4** | Viewed | 50.00 | Panama | Denim Shorts |
    | **5** | Viewed | 14.00 | Senegal | Flip Flop Shoes |
    | **6** | Added | 14.00 | Senegal | Flip Flop Shoes |
    | **7** | Added | 50.00 | Panama | Denim Shorts |
    | **8** | Purchased | 33.00 | Palestinian Territory | Red Top |
    | **9** | Viewed | 30.00 | Malta | Green Sweater |

1. Create another new code cell.

1. In the code cell, import the **pandas** package to customize the output of the dataframe.

    ```python
    import pandas as pd
    pd.options.display.html.table_schema = True
    pd.options.display.max_rows = None
    
    df_cosmos.groupby("Item").size()
    ```

1. Select **Run Active Cell** to only run the command in this specific cell.

1. In the output, select the **Line Chart** option to view a different visualization of the data.

    :::image type="content" source="media/tutorial-create-notebook/pandas-python-line-chart.png" alt-text="Screenshot of the Pandas dataframe visualization for the data as a line chart.":::

### [C#](#tab/csharp)

1. Create a new code cell.

1. In the code cell, create a new C# class to represent an item in the container.

    ```csharp
    public class Record
    {
      public string Action { get; set; }
      public decimal Price { get; set; }
      public string Country { get; set; }
      public string Item { get; set; }
    }
    ```

1. Create another new code cell.

1. In the code cell, add code to [execute a SQL query using the SDK](quickstart-dotnet.md#query-items) storing the output of the query in a variable of type <xref:System.Collections.Generic.List%601> named **results**.

    ```csharp
    using System.Collections.Generic;
    
    var query = new QueryDefinition(
        query: "SELECT c.Action, c.Price, c.Country, c.Item FROM c"
    );
    
    FeedIterator<Record> feed = container.GetItemQueryIterator<Record>(
        queryDefinition: query
    );
    
    var results = new List<Record>();
    while (feed.HasMoreResults)
    {
        FeedResponse<Record> response = await feed.ReadNextAsync();
        foreach (Record result in response)
        {
            results.Add(result);
        }
    }
    ```

1. Create another new code cell.

1. In the code cell, create a dictionary by adding unique permutations of the **Item** field as the key and the data in the **Price** field as the value.

    ```csharp
    var dictionary = new Dictionary<string, decimal>();

    foreach(var result in results)
    {
        dictionary.TryAdd (result.Item, result.Price); 
    }

    dictionary
    ```

1. Select **Run Active Cell** to only run the command in this specific cell.

1. Observe the output with unique combinations of the **Item** and **Price** fields.

    ```output
    ...
    Denim Jacket:31.99
    Fleece Jacket:65
    Sandals:12
    Socks:3.75
    Sandal:35.5
    Light Jeans:80
    ...
    ```

1. Create another new code cell.

1. In the code cell, output the **results** variable.

    ```csharp
    results
    ```

1. Select **Run Active Cell** to only run the command in this specific cell.

1. In the output, select the **Box Plot** option to view a different visualization of the data.

    :::image type="content" source="media/tutorial-create-notebook/pandas-csharp-box-plot.png" alt-text="Screenshot of the Pandas dataframe visualization for the data as a box plot.":::

---

## Persist your notebook

1. In the **Notebooks** section, open the context menu for the notebook you created for this tutorial and select **Download**.

    :::image type="content" source="media/tutorial-create-notebook/download-notebook.png" alt-text="Screenshot of the notebook context menu with the 'Download' option.":::

    > [!TIP]
    > To save your work permanently, save your notebooks to a GitHub repository or download the notebooks to your local machine before the session ends.

## Next steps

- [Learn about the Jupyter Notebooks feature in Azure Cosmos DB](../notebooks-overview.md)
- [Import notebooks from GitHub into an Azure Cosmos DB for NoSQL account](tutorial-import-notebooks.md)
- [Review the FAQ on Jupyter Notebook support](../notebooks-faq.yml)
