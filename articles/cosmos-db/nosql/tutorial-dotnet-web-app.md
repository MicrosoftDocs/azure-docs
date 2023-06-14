---
title: |
  Tutorial: Develop an ASP.NET web application with Azure Cosmos DB for NoSQL
description:  |
  ASP.NET tutorial to create a web application that queries data from Azure Cosmos DB for NoSQL.
author: seesharprun
ms.author: sidandrews
ms.reviewer: esarroyo
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: tutorial
ms.date: 12/02/2022
ms.devlang: csharp
ms.custom: devx-track-dotnet, ignite-2022, cosmos-dev-refresh, cosmos-dev-dotnet-path
---

# Tutorial: Develop an ASP.NET web application with Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Web app language selector](includes/tutorial-web-app-selector.md)]

The Azure SDK for .NET allows you to query data in an API for NoSQL container using [LINQ in C#](how-to-dotnet-query-items.md#query-items-using-linq-asynchronously) or a [SQL query string](how-to-dotnet-query-items.md#query-items-using-a-sql-query-asynchronously). This tutorial will walk through the process of updating an existing ASP.NET web application that uses placeholder data to instead query from the API.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create and populate a database and container using API for NoSQL
> - Create an ASP.NET web application from a template
> - Query data from the API for NoSQL container using the Azure SDK for .NET
>

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [Visual Studio Code](https://code.visualstudio.com)
- [.NET 6 (LTS) or later](https://dotnet.microsoft.com/download/dotnet/6.0)
- Experience writing C# applications.

## Create API for NoSQL resources

First, you'll create a database and container in the existing API for NoSQL account. You'll then populate this account with data using the `cosmicworks` dotnet tool.

1. Navigate to your existing API for NoSQL account in the [Azure portal](https://portal.azure.com/).

1. In the resource menu, select **Keys**.

    :::image type="content" source="media/tutorial-dotnet-web-app/resource-menu-keys.png" lightbox="media/tutorial-dotnet-web-app/resource-menu-keys.png" alt-text="Screenshot of an API for NoSQL account page. The Keys option is highlighted in the resource menu.":::

1. On the **Keys** page, observe and record the value of the **URI**, **PRIMARY KEY**, and **PRIMARY CONNECTION STRING*** fields. These values will be used throughout the tutorial.

    :::image type="content" source="media/tutorial-dotnet-web-app/page-keys.png" alt-text="Screenshot of the Keys page with the URI, Primary Key, and Primary Connection String fields highlighted.":::

1. In the resource menu, select **Data Explorer**.

    :::image type="content" source="media/tutorial-dotnet-web-app/resource-menu-data-explorer.png" alt-text="Screenshot of the Data Explorer option highlighted in the resource menu.":::

1. On the **Data Explorer** page, select the **New Container** option in the command bar.

    :::image type="content" source="media/tutorial-dotnet-web-app/page-data-explorer-new-container.png" alt-text="Screenshot of the New Container option in the Data Explorer command bar.":::

1. In the **New Container** dialog, create a new container with the following settings:

    | Setting | Value |
    | --- | --- |
    | **Database id** | `cosmicworks` |
    | **Database throughput type** | **Manual** |
    | **Database throughput amount** | `4000` |
    | **Container id** | `products` |
    | **Partition key** | `/categoryId` |

    :::image type="content" source="media/tutorial-dotnet-web-app/dialog-new-container.png" alt-text="Screenshot of the New Container dialog in the Data Explorer with various values in each field.":::

    > [!IMPORTANT]
    > In this tutorial, we will first scale the database up to 4,000 RU/s in shared throughput to maximize performance for the data migration. Once the data migration is complete, we will scale down to 400 RU/s of provisioned throughput.

1. Select **OK** to create the database and container.

1. Open a terminal to run commands to populate the container with data.

    > [!TIP]
    > You can optionally use the Azure Cloud Shell here.

1. Install a **pre-release**version of the `cosmicworks` dotnet tool from NuGet.

    ```bash
    dotnet tool install --global cosmicworks  --prerelease
    ```

1. Use the `cosmicworks` tool to populate your API for NoSQL account with sample product data using the **URI** and **PRIMARY KEY** values you recorded earlier in this lab. Those recorded values will be used for the `endpoint` and `key` parameters respectively.

    ```bash
    cosmicworks \
        --datasets product \
        --endpoint <uri> \
        --key <primary-key>
    ```

1. Observe the output from the command line tool. It should add more than 200 items to the container. The example output included is truncated for brevity.

    ```output
    ...
    Revision:       v4
    Datasets:
            product
    
    Database:       [cosmicworks]   Status: Created
    Container:      [products]      Status: Ready
    
    product Items Count:    295
    Entity: [9363838B-2D13-48E8-986D-C9625BE5AB26]  Container:products      Status: RanToCompletion
    ...
    Container:      [product]       Status: Populated
    ```

1. Return to the **Data Explorer** page for your account.

1. In the **Data** section, expand the `cosmicworks` database node and then select **Scale**.

    :::image type="content" source="media/tutorial-dotnet-web-app/section-data-database-scale.png" alt-text="Screenshot of the Scale option within the database node.":::

1. Reduce the throughput from **4,000** down to **400**.

    :::image type="content" source="media/tutorial-dotnet-web-app/section-scale-throughput.png" alt-text="Screenshot of the throughput settings for the database reduced down to 400 RU/s.":::

1. In the command bar, select **Save**.

    :::image type="content" source="media/tutorial-dotnet-web-app/page-data-explorer-save.png" alt-text="Screenshot of the Save option in the Data Explorer command bar.":::

1. In the **Data** section, expand and select the **products** container node.

    :::image type="content" source="media/tutorial-dotnet-web-app/section-data-container.png" alt-text="Screenshot of the expanded container node within the database node.":::

1. In the command bar, select **New SQL query**.

    :::image type="content" source="media/tutorial-dotnet-web-app/page-data-explorer-new-sql-query.png" alt-text="Screenshot of the New SQL Query option in the Data Explorer command bar.":::

1. In the query editor, add this SQL query string.

    ```sql
    SELECT
      p.sku,
      p.price
    FROM products p
    WHERE p.price < 2000
    ORDER BY p.price DESC
    ```

1. Select **Execute Query** to run the query and observe the results.

    :::image type="content" source="media/tutorial-dotnet-web-app/page-data-explorer-execute-query.png" alt-text="Screenshot of the Execute Query option in the Data Explorer command bar.":::

1. The results should be a paginated array of all items in the container with a `price` value that is less than **2,000** sorted from highest price to lowest. For brevity, a subset of the output is included here.

    ```output
    [
      {
        "sku": "BK-R79Y-48",
        "price": 1700.99
      },
      ...
      {
        "sku": "FR-M94B-46",
        "price": 1349.6
      },
    ...
    ```

1. Replace the content of the query editor with this query and then select **Execute Query** again to observe the results.

    ```sql
    SELECT
      p.name,
      p.categoryName,
      p.tags
    FROM products p
    JOIN t IN p.tags
    WHERE t.name = "Tag-32"
    ```

1. The results should be a smaller array of items filtered to only contain items that include at least one tag with a **name** value of `Tag-32`. Again, a subset of the output is included here for brevity.

    ```output
    ...
    {
    "name": "ML Mountain Frame - Black, 44",
    "categoryName": "Components, Mountain Frames",
    "tags": [
        {
        "id": "18AC309F-F81C-4234-A752-5DDD2BEAEE83",
        "name": "Tag-32"
        }
    ]
    },
    ...
    ```

## Create ASP.NET web application

Now, you'll create a new ASP.NET web application using a sample project template. You'll then explore the source code and run the sample to get acquainted with the application before adding Azure Cosmos DB connectivity using the Azure SDK for .NET.

> [!IMPORTANT]
> This tutorial transparently pulls packages from [NuGet](https://nuget.org). You can use [`dotnet nuget list source`](/dotnet/core/tools/dotnet-nuget-list-source#examples) to verify your package sources. If you do not have NuGet as a package source, use [`dotnet nuget add source`](/dotnet/core/tools/dotnet-nuget-add-source#examples) to install the site as a source.

1. Open a terminal in an empty directory.

1. Install the `cosmicworks.template.web` project template package from NuGet.

    ```bash
    dotnet new install cosmicworks.template.web
    ```

1. Create a new web application project using the newly installed `dotnet new cosmosdbnosql-webapp` template.

    ```bash
    dotnet new cosmosdbnosql-webapp
    ```

1. Build and run the web application project.

    ```bash
    dotnet run
    ```

1. Observe the output of the run command. The output should include a list of ports and URLs where the application is running.

    ```output
    ...
    info: Microsoft.Hosting.Lifetime[14]
          Now listening on: http://localhost:5000
    info: Microsoft.Hosting.Lifetime[14]
          Now listening on: https://localhost:5001
    info: Microsoft.Hosting.Lifetime[0]
          Application started. Press Ctrl+C to shut down.
    info: Microsoft.Hosting.Lifetime[0]
          Hosting environment: Production
    ...
    ```

1. Open a new browser and navigate to the running web application. Observe all three pages of the running application.

    :::image type="content" source="media/tutorial-dotnet-web-app/sample-application-placeholder-data.png" lightbox="media/tutorial-dotnet-web-app/sample-application-placeholder-data.png" alt-text="Screenshot of the sample web application running with placeholder data.":::

1. Stop the running application by terminating the running process.

    > [!TIP]
    > Use the <kbd>Ctrl</kbd>+<kbd>C</kbd> command to stop a running process.Alternatively, you can close and re-open the terminal.

1. Open Visual Studio Code using the current project folder as the workspace.

    > [!TIP]
    > You can run `code .` in the terminal to open Visual Studio Code and automatically open the working directory as the current workspace.

1. Navigate to and open the **Services/ICosmosService.cs** file. Observe the ``RetrieveActiveProductsAsync`` and ``RetrieveAllProductsAsync`` default method implementations. These methods create a static list of products to use when running the project for the first time. A truncated example of one of the methods is provided here.

    ```csharp
    public async Task<IEnumerable<Product>> RetrieveActiveProductsAsync()
    {
        await Task.Delay(1);

        return new List<Product>()
        {
            new Product(id: "baaa4d2d-5ebe-45fb-9a5c-d06876f408e0", categoryId: "3E4CEACD-D007-46EB-82D7-31F6141752B2", categoryName: "Components, Road Frames", sku: "FR-R72R-60", name: """ML Road Frame - Red, 60""", description: """The product called "ML Road Frame - Red, 60".""", price: 594.83000000000004m),
           ...
            new Product(id: "d5928182-0307-4bf9-8624-316b9720c58c", categoryId: "AA5A82D4-914C-4132-8C08-E7B75DCE3428", categoryName: "Components, Cranksets", sku: "CS-6583", name: """ML Crankset""", description: """The product called "ML Crankset".""", price: 256.49000000000001m)
        };
    }
    ```

1. Navigate to and open the **Services/CosmosService.cs** file. Observe the current implementation of the **CosmosService** class. This class implements the **ICosmosService** interface but doesn't override any methods. In this context, the class will use the default interface implementation until an override of the implementation is provided in the interface.

    ```csharp
    public class CosmosService : ICosmosService
    { }
    ```

1. Finally, navigate to and open the **Models/Product.cs** file. Observe the record type defined in this file. This type will be used in queries throughout this tutorial.

    ```csharp
    public record Product(
        string id,
        string categoryId,
        string categoryName,
        string sku,
        string name,
        string description,
        decimal price
    );
    ```

## Query data using the .NET SDK

Next, you'll add the Azure SDK for .NET to this sample project and use the library to query data from the API for NoSQL container.

1. Back in the terminal, add the `Microsoft.Azure.Cosmos` package from NuGet.

    ```bash
    dotnet add package Microsoft.Azure.Cosmos
    ```

1. Build the project.

    ```bash
    dotnet build
    ```

1. Back in Visual Studio Code, navigate again to the **Services/CosmosService.cs** file.

1. Add a new using directive for the `Microsoft.Azure.Cosmos` and `Microsoft.Azure.Cosmos.Linq` namespaces.

    ```csharp
    using Microsoft.Azure.Cosmos;
    using Microsoft.Azure.Cosmos.Linq;
    ```

1. Within the **CosmosService** class, add a new `private readonly` member of type `CosmosClient` named `_client`.

    ```csharp
    private readonly CosmosClient _client;
    ```

1. Create a new empty constructor for the `CosmosService` class.

    ```csharp
    public CosmosService()
    { }
    ```

1. Within the constructor, create a new instance of the `CosmosClient` class passing in a string parameter with the **PRIMARY CONNECTION STRING** value you previously recorded in the lab. Store this new instance in the `_client` member.

    ```csharp
    public CosmosService()
    { 
        _client = new CosmosClient(
            connectionString: "<primary-connection-string>"
        );
    }
    ```

1. Back within the **CosmosService** class, create a new `private` property of type `Container` named `container`. Set the **get accessor** to return the `cosmicworks` database and `products` container.

    ```csharp
    private Container container
    {
        get => _client.GetDatabase("cosmicworks").GetContainer("products");
    }
    ```

1. Create a new asynchronous method named `RetrieveAllProductsAsync` that returns an `IEnumerable<Product>`.

    ```csharp
    public async Task<IEnumerable<Product>> RetrieveAllProductsAsync()
    { }
    ```

1. For the next steps, add this code within the `RetrieveAllProductsAsync` method.

    1. Use the `GetItemLinqQueryable<>` generic method to get an object of type `IQueryable<>` that you can use to construct a Language-integrated query (LINQ). Store that object in a variable named `queryable`.

        ```csharp
        var queryable = container.GetItemLinqQueryable<Product>();
        ```

    1. Construct a LINQ query using the `Where` and `OrderByDescending` extension methods. Use the `ToFeedIterator` extension method to create an iterator to get data from Azure Cosmos DB and store the iterator in a variable named `feed`. Wrap this entire expression in a using statement to dispose the iterator later.

        ```csharp
        using FeedIterator<Product> feed = queryable
            .Where(p => p.price < 2000m)
            .OrderByDescending(p => p.price)
            .ToFeedIterator();
        ```

    1. Create a new variable named `results` using the generic `List<>` type.

        ```csharp
        List<Product> results = new();
        ```

    1. Create a **while** loop that will iterate until the `HasMoreResults` property of the `feed` variable returns false. This loop will ensure that you loop through all pages of server-side results.

        ```csharp
        while (feed.HasMoreResults)
        { }
        ```

    1. Within the **while** loop, asynchronously call the `ReadNextAsync` method of the `feed` variable and store the result in a variable named `response`.

        ```csharp
        while (feed.HasMoreResults)
        {
            var response = await feed.ReadNextAsync();
        }
        ```

    1. Still within the **while** loop, use a **foreach** loop to go through each item in the response and add them to the `results` list.

        ```csharp
        while (feed.HasMoreResults)
        {
            var response = await feed.ReadNextAsync();
            foreach (Product item in response)
            {
                results.Add(item);
            }
        }
        ```

    1. Return the `results` list as the output of the `RetrieveAllProductsAsync` method.

        ```csharp
        return results;
        ```

1. Create a new asynchronous method named `RetrieveActiveProductsAsync` that returns an `IEnumerable<Product>`.

    ```csharp
    public async Task<IEnumerable<Product>> RetrieveActiveProductsAsync()
    { }
    ```

1. For the next steps, add this code within the `RetrieveActiveProductsAsync` method.

    1. Create a new string named `sql` with a SQL query to retrieve multiple fields where a filter (`@tagFilter`) is applied to **tags** array of each item.

        ```csharp
        string sql = """
        SELECT
            p.id,
            p.categoryId,
            p.categoryName,
            p.sku,
            p.name,
            p.description,
            p.price,
            p.tags
        FROM products p
        JOIN t IN p.tags
        WHERE t.name = @tagFilter
        """;
        ```

    1. Create a new `QueryDefinition` variable named `query` passing in the `sql` string as the only query parameter. Also, use the `WithParameter` fluid method to apply the value `Tag-75` to the `@tagFilter` parameter.

        ```csharp
        var query = new QueryDefinition(
            query: sql
        )
            .WithParameter("@tagFilter", "Tag-75");
        ```

    1. Use the `GetItemQueryIterator<>` generic method and the `query` variable to create an iterator that gets data from Azure Cosmos DB. Store the iterator in a variable named `feed`. Wrap this entire expression in a using statement to dispose the iterator later.

        ```csharp
        using FeedIterator<Product> feed = container.GetItemQueryIterator<Product>(
            queryDefinition: query
        );
        ```

    1. Use a **while** loop to iterate through multiple pages of results and store the value in a generic `List<>` named **results**. Return the **results** as the output of the `RetrieveActiveProductsAsync` method.

        ```csharp
        List<Product> results = new();
        
        while (feed.HasMoreResults)
        {
            FeedResponse<Product> response = await feed.ReadNextAsync();
            foreach (Product item in response)
            {
                results.Add(item);
            }
        }

        return results;
        ```

1. **Save** the **Services/CosmosClient.cs** file.

    > [!TIP]
    > If you are unsure that your code is correct, you can check your source code against the [sample code](https://github.com/Azure-Samples/cosmos-db-nosql-dotnet-sample-web/blob/sample/Services/CosmosService.cs) on GitHub.

## Validate the final application

Finally, you'll run the application with **hot reloads** enabled. Running the application will validate that your code can access data from the API for NoSQL.

1. Back in the terminal, run the application.

    ```bash
    dotnet run
    ```

1. The output of the run command should include a list of ports and URLs where the application is running. Open a new browser and navigate to the running web application. Observe all three pages of the running application. Each page should now include live data from Azure Cosmos DB.

## Clean up resources

When no longer needed, delete the database used in this tutorial. To do so, navigate to the account page, select **Data Explorer**, select the `cosmicworks` database, and then select **Delete**.

## Next steps

Now that you've created your first .NET web application using Azure Cosmos DB, you can now dive deeper into the SDK to import more data, perform complex queries, and manage your Azure Cosmos DB for NoSQL resources.

> [!div class="nextstepaction"]
> [Get started with Azure Cosmos DB for NoSQL and .NET](how-to-dotnet-get-started.md)
