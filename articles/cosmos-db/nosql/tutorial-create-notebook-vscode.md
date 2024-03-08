---
title: |
  Tutorial: Create a Jupyter Notebook to analyze data in your Azure Cosmos DB for NoSQL account
description: |
  Learn how to use Visual Studio Code Jupyter notebooks to import data to Azure Cosmos DB for NoSQL and analyze the data.
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: overview 
ms.date: 10/09/2023
author: seesharprun
ms.author: sidandrews
ms.reviewer: dech
---

# Tutorial: Create a Jupyter Notebook to analyze data in your Azure Cosmos DB for NoSQL account using Visual Studio Code Jupyter notebooks

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This tutorial walks through how to use the Visual Studio Code Jupyter notebooks to interact with your Azure Cosmos DB for NoSQL account. You'll see how to connect to your account, import data, and run queries.

## Prerequisites

### [Python](#tab/python)
- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [Install Visual Studio Code](https://code.visualstudio.com/download) and [setup your environment](https://code.visualstudio.com/docs/datascience/jupyter-notebooks) to use notebooks.

### [C#](#tab/csharp)
- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [Install Visual Studio Code](https://code.visualstudio.com/download) and [setup your environment](https://code.visualstudio.com/docs/datascience/jupyter-notebooks) to use notebooks.
- Install the [Polyglot notebooks extension](https://code.visualstudio.com/docs/languages/polyglot) for Visual Studio Code.
---

## Create a new notebook

In this section, you'll create the Azure Cosmos database, container, and import the retail data to the container.

### [Python](#tab/python)

1. Open Visual Studio Code.
1. Run the **Create: New Jupyter Notebook** command from the Command Palette (Ctrl+Shift+P) or create a new .ipynb file in your workspace.

### [C#](#tab/csharp)
1. Open Visual Studio Code.
1. Run the **Polyglot Notebook: Create new blank notebook** command from the Command Palette (Ctrl+Shift+P).

    :::image type="content" source="media/tutorial-create-notebook-vscode/create-notebook-csharp.png" alt-text="Screenshot of Create new Polyglot notebook command in Visual Studio Code.":::

1. Select the .ipynb file extension. 
1. Select C# as the default language.
---

> [!TIP]
> Now that the new notebook has been created, you can save it and name it something like **AnalyzeRetailData.ipynb**.

## Create a database and container using the SDK

### [Python](#tab/python)

1. Start in the default code cell.

1. Install the Azure.cosmos package. Run this cell before continuing.
    ```python
    %pip install azure.cosmos
    ```

1. Import any packages you require for this tutorial.

    ```python
    import azure.cosmos
    from azure.cosmos.partition_key import PartitionKey
    from azure.cosmos import CosmosClient
    ```

1. Create a new instance of CosmosClient.
    ```python
    endpoint = "<FILL ME>"
    key = "<FILL ME>"
    cosmos_client = CosmosClient(url=endpoint, credential=key)
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

    :::image type="content" source="media/tutorial-create-notebook-vscode/run-cell-python.png" alt-text="Screenshot of Execute cell in Visual Studio Code Jupyter notebook.":::
    
### [C#](#tab/csharp)

1. Start in the default code cell.

1. Install the Microsoft.Azure.Cosmos NuGet package. Run this cell before proceeding.
    ```csharp
    #r "nuget: Microsoft.Azure.Cosmos"
    ```
1. Create a new code cell.

1. Import any packages you require for this tutorial.

    ```csharp
    using Microsoft.Azure.Cosmos;
    ```

1. Create a new instance of the client type using the built-in SDK. Fill in the URI endpoint and key of your Azure Cosmos DB account. You can find these values in the **Keys** page in your Azure Cosmos DB account.

    ```csharp
    var endpoint = "<FILL ME>";
    var key = "<FILL ME>";

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

1. Select **Execute Cell** to create the database and container resource.

    :::image type="content" source="media/tutorial-create-notebook-vscode/run-cell-csharp.png" alt-text="Screenshot of Execute cell in Visual Studio Code Jupyter C# notebook.":::

---

## Import data into container

### [Python](#tab/python)

1. Add a new code cell

1. Within the code cell, add the following code to upload data from this url: <https://cosmosnotebooksdata.blob.core.windows.net/notebookdata/websiteData.json>.
    ```python
        import urllib.request
        import json
        
        with urllib.request.urlopen("https://cosmosnotebooksdata.blob.core.windows.net/notebookdata/websiteData.json") as url:
            docs = json.loads(url.read().decode())
        
        for doc in docs:
            container.upsert_item(doc)
    ```
1. Run the cell. This will take 45 seconds to 1 minute to run.


### [C#](#tab/csharp)

1. Add a new code cell.

1. In the code cell, create a new C# class to represent an item in the container. Run the cell.

    ```csharp
    public class Record
    {
      public string id { get; set; }
      public int CartID { get; set; }
      public string Action { get; set; }
      public decimal Price { get; set; }
      public string Country { get; set; }
      public string Item { get; set; }
    }
    ```

1. Add a new code cell.

1. Within the code cell, add the following code to upload data from this url: <https://cosmosnotebooksdata.blob.core.windows.net/notebookdata/websiteData.json>.
    ```csharp
    using System.Net.Http;
    using System.Text.Json;
    using System.IO;
    
    var dataURL = "https://cosmosnotebooksdata.blob.core.windows.net/notebookdata/websiteData.json";
    var jsonData = new HttpClient().GetStringAsync(dataURL).Result;
    
    Record[] result = JsonSerializer.Deserialize<Record[]>(jsonData);
    
    foreach (Record record in result) {
        await container.UpsertItemAsync<Record>(record, new PartitionKey(record.CartID)); //43 seconds
    }
    ```

1. Run the cell. This will take 45 seconds to 1 minute to run.

---

## Analyze your data

### [Python](#tab/python)

1. Create another new code cell.

1. In the code cell, use a SQL query to populate a [Pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame). Run this cell.

    ```python
    import pandas as pd
    from pandas import DataFrame
    
    QUERY = "SELECT c.Action, c.Price as ItemRevenue, c.Country, c.Item FROM c"
    results = container.query_items(
        query=QUERY, enable_cross_partition_query=True
    )
    
    df_cosmos = pd.DataFrame(results)
    ```

1. Create another new code cell.

1. In the code cell, output the top **10** items from the dataframe. Run this cell.

    ```python
    df_cosmos.head(10)
    ```

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

1. In the code cell, import the **pandas** package to customize the output of the dataframe. Run this cell.

    ```python
    import pandas as pd    
    df_cosmos.groupby("Item").size().reset_index()
    ```

1. Observe the output of running the command.

    | | Item | Test |
    | --- | --- | --- |
    | **0** | Flip Flop Shoes | 66 |
    | **1** | Necklace | 55 |
    | **2** | Athletic Shoes | 111 |
    | **...** | ... | ... |
    | **45** | Windbreaker Jacket| 56 |



### [C#](#tab/csharp)

1. Create a new code cell.

1. In the code cell, add code to [execute a SQL query using the SDK](query/index.yml) storing the output of the query in a variable of type <xref:System.Collections.Generic.List%601> named **results**.

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

1. In the code cell, create a dictionary by adding unique permutations of the **Item** field as the key and the sum of the **Price** field as the value. This gives the total sales for each item. Run this cell.

    ```csharp
    var dictionary = new Dictionary<string, decimal>();
    
    foreach(var result in results)
    {
        if (dictionary.ContainsKey(result.Item)) {
            dictionary[result.Item] += result.Price;
        }
        else {
            dictionary.TryAdd (result.Item, result.Price); 
    
        }
    }
    
    dictionary
    ```

1. Observe the output with unique combinations of the **Item** and **Price** fields.

    ```output
    ...
    Black Tee: 603
    Flannel Shirt: 1199.40
    Socks: 210.00
    Rainjacket: 2695
    ...
    ```

---

## Next steps
- [Get started with the Azure Cosmos DB for NoSQL client library for .NET](quickstart-dotnet.md)
- [Get started with the Azure Cosmos DB for NoSQL client library for Python](quickstart-python.md)