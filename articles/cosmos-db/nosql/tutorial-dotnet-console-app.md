---
title: |
  Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL
description:  |
  .NET tutorial to create a console application that adds data to Azure Cosmos DB for NoSQL.
author: seesharprun
ms.author: sidandrews
ms.reviewer: esarroyo
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: tutorial
ms.date: 11/02/2022
ms.devlang: csharp
ms.custom: devx-track-dotnet, ignite-2022, cosmos-dev-refresh, cosmos-dev-dotnet-path
---

# Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Console app language selector](includes/tutorial-console-app-selector.md)]

The Azure SDK for .NET allows you to add data to an API for NoSQL container either how-to-dotnet-create-item.md#create-an-item-asynchronously or by using a [transactional batch](transactional-batch.md?tabs=dotnet). This tutorial will walk through the process of create a new .NET console application that adds multiple items to a container.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a database using API for NoSQL
> - Create a .NET console application and add the Azure SDK for .NET
> - Add individual items into an API for NoSQL container
> - Retrieve items efficient from an API for NoSQL container
> - Create a transaction with batch changes for the API for NoSQL container
>

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [Visual Studio Code](https://code.visualstudio.com)
- [.NET 6 (LTS) or later](https://dotnet.microsoft.com/download/dotnet/6.0)
- Experience writing C# applications.

## Create API for NoSQL resources

First, create an empty database in the existing API for NoSQL account. You'll create a container using the Azure SDK for .NET later.

1. Navigate to your existing API for NoSQL account in the [Azure portal](https://portal.azure.com/).

1. In the resource menu, select **Keys**.

    :::image type="content" source="media/tutorial-dotnet-console-app/resource-menu-keys.png" lightbox="media/tutorial-dotnet-console-app/resource-menu-keys.png" alt-text="Screenshot of an API for NoSQL account page. The Keys option is highlighted in the resource menu.":::

1. On the **Keys** page, observe and record the value of the **URI** and **PRIMARY KEY** fields. These values will be used throughout the tutorial.

    :::image type="content" source="media/tutorial-dotnet-console-app/page-keys.png" alt-text="Screenshot of the Keys page with the URI and Primary Key fields highlighted.":::

1. In the resource menu, select **Data Explorer**.

    :::image type="content" source="media/tutorial-dotnet-console-app/resource-menu-data-explorer.png" alt-text="Screenshot of the Data Explorer option highlighted in the resource menu.":::

1. On the **Data Explorer** page, select the **New Database** option in the command bar.

    :::image type="content" source="media/tutorial-dotnet-console-app/page-data-explorer-new-database.png" alt-text="Screenshot of the New Database option in the Data Explorer command bar.":::

1. In the **New Database** dialog, create a new container with the following settings:

    | | Value |
    | --- | --- |
    | **Database id** | `cosmicworks` |
    | **Database throughput type** | **Manual** |
    | **Database throughput amount** | `400` |

    :::image type="content" source="media/tutorial-dotnet-console-app/dialog-new-database.png" alt-text="Screenshot of the New Database dialog in the Data Explorer with various values in each field.":::

1. Select **OK** to create the database.

## Create .NET console application

Now, you'll create a new .NET console application and import the Azure SDK for .NET by using the `Microsoft.Azure.Cosmos` library from NuGet.

1. Open a terminal in an empty directory.

1. Create a new console application using the `console` built-in template

    ```bash
    dotnet new console --langVersion preview
    ```

1. Add the **3.31.1-preview** version of the `Microsoft.Azure.Cosmos` package from NuGet.

    ```bash
    dotnet add package Microsoft.Azure.Cosmos --version 3.31.1-preview
    ```

1. Also, add the **pre-release** version of the `System.CommandLine` package from NuGet.

    ```bash
    dotnet add package System.CommandLine --prerelease
    ```

1. Also, add the `Humanizer` package from NuGet.

    ```bash
    dotnet add package Humanizer
    ```

1. Build the console application project.

    ```bash
    dotnet build
    ```

1. Open Visual Studio Code using the current project folder as the workspace.

    > [!TIP]
    > You can run `code .` in the terminal to open Visual Studio Code and automatically open the working directory as the current workspace.

1. Navigate to and open the **Program.cs** file. Delete all of the existing code in the file.

1. Add this code to the file to use the **System.CommandLine** library to parse the command line for two strings passed in through the `--first` and `--last` options.

    ```csharp
    using System.CommandLine;
    
    var command = new RootCommand();
    
    var nameOption = new Option<string>("--name") { IsRequired = true };
    var emailOption = new Option<string>("--email");
    var stateOption = new Option<string>("--state") { IsRequired = true };
    var countryOption = new Option<string>("--country") { IsRequired = true };
    
    command.AddOption(nameOption);
    command.AddOption(emailOption);
    command.AddOption(stateOption);
    command.AddOption(countryOption);
    
    command.SetHandler(
        handle: CosmosHandler.ManageCustomerAsync, 
        nameOption, 
        emailOption,
        stateOption,
        countryOption
    );
    
    await command.InvokeAsync(args);
    ```

    > [!NOTE]
    > For this tutorial, it's not entirely important that you understand how the command-line parser works. The parser has four options that can be specified when the application is running. Three of the options are required since they will be used to construct the ID and partition key fields.

1. At this point, the project won't build since you haven't defined the static `CosmosHandler.ManageCustomerAsync` method yet.

1. **Save** the **Program.cs** file.

## Add items to a container using the SDK

Next, you'll use individual operations to add items into the API for NoSQL container. In this section, you'll define the  `CosmosHandler.ManageCustomerAsync` method.

1. Create a new **CosmosHandler.cs** file.

1. In the **CosmosHandler.cs** file, add a new using directive for the `Humanizer` and `Microsoft.Azure.Cosmos` namespaces.

    ```csharp
    using Humanizer;
    using Microsoft.Azure.Cosmos;
    ```

1. Create a new static class named `CosmosHandler`.

    ```csharp
    public static class CosmosHandler
    { }
    ```

1. Just to validate this app will work, create a short implementation of the static `ManageCustomerAsync` method to print the command-line input.

    ```csharp
    public static async Task ManageCustomerAsync(string name, string email, string state, string country)
    {
        await Console.Out.WriteLineAsync($"Hello {name} of {state}, {country}!");
    }
    ```

1. **Save** the **CosmosHandler.cs** file.

1. Back in the terminal, run the application.

    ```bash
    dotnet run -- --name 'Mica Pereira' --state 'Washington' --country 'United States'
    ```

1. The output of the command should be a fun greeting.

    ```output
    Hello Mica Pereira of Washington, United States!
    ```

1. Return to the **CosmosHandler.cs** file.

1. Within the static **CosmosHandler** class, add a new `private static readonly` member of type `CosmosClient` named `_client`.

    ```csharp
    private static readonly CosmosClient _client;
    ```

1. Create a new static constructor for the `CosmosHandler` class.

    ```csharp
    static CosmosHandler()
    { }
    ```

1. Within the constructor, create a new instance of the `CosmosClient` class passing in two string parameters with the **URI** and **PRIMARY KEY** values you previously recorded in the lab. Store this new instance in the `_client` member.

    ```csharp
    static CosmosHandler()
    {
        _client = new CosmosClient(
            accountEndpoint: "<uri>", 
            authKeyOrResourceToken: "<primary-key>"
        );
    }
    ```

1. Back within the static **CosmosHandler** class, create a new asynchronous method named `GetContainerAsync` that returns an `Container`.

    ```csharp
    private static async Task<Container> GetContainer()
    { }
    ```

1. For the next steps, add this code within the `GetContainerAsync` method.

    1. Get the `cosmicworks` database and store it in a variable named `database`.

        ```csharp
        Database database = _client.GetDatabase("cosmicworks");
        ```

    1. Create a new generic `List<>` of `string` values within a list of hierarchical partition key paths and store it in a variable named `keyPaths`.

        ```csharp
        List<string> keyPaths = new()
        {
            "/address/country",
            "/address/state"
        };
        ```

    1. Create a new `ContainerProperties` variable with the name of the container (`customers`) and the list of partition key paths.

        ```csharp
        ContainerProperties properties = new(
            id: "customers",
            partitionKeyPaths: keyPaths
        );
        ```

    1. Use the `CreateContainerIfNotExistsAsync` method to supply the container properties and retrieve the container. This method will, per the name, asynchronously create the container if it doesn't already exist within the database. Return the result as the output of the `GetContainerAsync` method.

        ```csharp
        return await database.CreateContainerIfNotExistsAsync(
            containerProperties: properties
        );
        ```

1. Delete all of the code within the `ManageCustomerAsync` method.

1. For the next steps, add this code within the `ManageCustomerAsync` method.

    1. Asynchronously call the `GetContainerAsync` method and store the result in a variable named `container`.

        ```csharp
        Container container = await GetContainerAsync();
        ```

    1. Create a new variable named `id` that uses the `Kebaberize` method from **Humanizer** to transform the `name` method parameter.

        ```csharp
        string id = name.Kebaberize();
        ```

        > [!NOTE]
        > The `Kebaberize` method will replace all spaces with hyphens and conver the text to lowercase.

    1. Create a new anonymous typed item using the `name`, `state`, and `country` method parameters and the `id` variable. Store the item as a variable named `customer`.

        ```csharp
        var customer = new {
            id = id,
            name = name,
            address = new {
                state = state,
                country = country
            }
        };
        ```

    1. Use the container's asynchronous `CreateItemAsync` method to create a new item in the container and assign the HTTP response metadata to a variable named `response`.

        ```csharp
        var response = await container.CreateItemAsync(customer);
        ```

    1. Write the values of the `response` variable's `StatusCode` and `RequestCharge` properties to the console. Also write the value of the `id` variable.

        ```csharp
        Console.WriteLine($"[{response.StatusCode}]\t{id}\t{response.RequestCharge} RUs");
        ```

1. **Save** the **CosmosHandler.cs** file.

1. Back in the terminal, run the application again.

    ```bash
    dotnet run -- --name 'Mica Pereira' --state 'Washington' --country 'United States'
    ```

1. The output of the command should include a status and request charge for the operation.

    ```output
    [Created]       mica-pereira    7.05 RUs
    ```

    > [!NOTE]
    > Your request charge may vary.

1. Run the application one more time.

    ```bash
    dotnet run -- --name 'Mica Pereira' --state 'Washington' --country 'United States'
    ```

1. This time, the program should crash. If you scroll through the error message, you'll see the crash occurred because of a conflict in the unique identifier for the items.

    ```output
    Unhandled exception: Microsoft.Azure.Cosmos.CosmosException : Response status code does not indicate success: Conflict (409);Reason: (
        Errors : [
          "Resource with specified id or name already exists."
        ]
    );
    ```

## Retrieve an item using the SDK

Now that you've created your first item in the container, you can use the same SDK to retrieve the item. Here, you'll query and point read the item to compare the difference in request unit (RU) consumption.

1. Return to or open the **CosmosHandler.cs** file.

1. Delete all lines of code from the `ManageCustomerAsync` method except for the first two lines.

    ```csharp
    public static async Task ManageCustomerAsync(string name, string email, string state, string country)
    {
        Container container = await GetContainerAsync();

        string id = name.Kebaberize();
    }
    ```

1. For the next steps, add this code within the `ManageCustomerAsync` method.

    1. Use the container's asynchronous `CreateItemAsync` method to create a new item in the container and assign the HTTP response metadata to a variable named `response`.

        ```csharp
        var response = await container.CreateItemAsync(customer);
        ```

    1. Create a new string named `sql` with a SQL query to retrieve items where a filter (`@id`) matches.

        ```csharp
        string sql = """
        SELECT
            *
        FROM customers c
        WHERE c.id = @id
        """;
        ```

    1. Create a new `QueryDefinition` variable named `query` passing in the `sql` string as the only query parameter. Also, use the `WithParameter` fluid method to apply the value of the variable `id` to the `@id` parameter.

        ```csharp
        var query = new QueryDefinition(
            query: sql
        )
            .WithParameter("@id", id);
        ```

    1. Use the `GetItemQueryIterator<>` generic method and the `query` variable to create an iterator that gets data from Azure Cosmos DB. Store the iterator in a variable named `feed`. Wrap this entire expression in a using statement to dispose the iterator later.

        ```csharp
        using var feed = container.GetItemQueryIterator<dynamic>(
            queryDefinition: query
        );
        ```

    1. Asynchronously call the `ReadNextAsync` method of the `feed` variable and store the result in a variable named `response`.

        ```csharp
        var response = await feed.ReadNextAsync();
        ```

    1. Write the values of the `response` variable's `StatusCode` and `RequestCharge` properties to the console. Also write the value of the `id` variable.

        ```csharp
        Console.WriteLine($"[{response.StatusCode}]\t{id}\t{response.RequestCharge} RUs");
        ```

1. **Save** the **CosmosHandler.cs** file.

1. Back in the terminal, run the application to read the single item using a SQL query.

    ```bash
    dotnet run -- --name 'Mica Pereira'
    ```

1. The output of the command should indicate that the query required multiple RUs.

    ```output
    [OK]    mica-pereira    2.82 RUs
    ```

1. Back in the **CosmosHandler.cs** file, delete all lines of code from the `ManageCustomerAsync` method again except for the first two lines.

    ```csharp
    public static async Task ManageCustomerAsync(string name, string email, string state, string country)
    {
        Container container = await GetContainerAsync();

        string id = name.Kebaberize();
    }
    ```

1. For the next steps, add this code within the `ManageCustomerAsync` method.

    1. Create a new instance of `PartitionKeyBuilder` by adding the `state` and `country` parameters as a multi-part partition key value.

        ```csharp
        var partitionKey = new PartitionKeyBuilder()
            .Add(country)
            .Add(state)
            .Build();
        ```

    1. Use the container's `ReadItemAsync<>` method to point read the item from the container using the `id` and `partitionKey` variables. Save the result in a variable named `response`.

        ```csharp
        var response = await container.ReadItemAsync<dynamic>(
            id: id, 
            partitionKey: partitionKey
        );
        ```

    1. Write the values of the `response` variable's `StatusCode` and `RequestCharge` properties to the console. Also write the value of the `id` variable.

        ```csharp
        Console.WriteLine($"[{response.StatusCode}]\t{id}\t{response.RequestCharge} RU");
        ```

1. **Save** the **CosmosHandler.cs** file again.

1. Back in the terminal, run the application one more time to point read the single item.

    ```bash
    dotnet run -- --name 'Mica Pereira' --state 'Washington' --country 'United States'
    ```

1. The output of the command should indicate that the query required a single RU.

    ```output
    [OK]    mica-pereira    1 RUs
    ```

## Create a transaction using the SDK

Finally, you'll take the item you created, read that item, and create a different related item as part of a single transaction using the Azure SDK for .NET.

1. Return to or open the **CosmosHandler.cs** file.

1. Delete these lines of code from the `ManageCustomerAsync` method.

    ```csharp
    var response = await container.ReadItemAsync<dynamic>(
        id: id, 
        partitionKey: partitionKey
    );

    Console.WriteLine($"[{response.StatusCode}]\t{id}\t{response.RequestCharge} RUs");
    ```

1. For the next steps, add this new code within the `ManageCustomerAsync` method.

    1. Create a new anonymous typed item using the `name`, `state`, and `country` method parameters and the `id` variable. Store the item as a variable named `customerCart`. This item will represent a real-time shopping cart for the customer that is currently empty.

        ```csharp
        var customerCart = new {
            id = $"{Guid.NewGuid()}",
            customerId = id,
            items = new string[] {},
            address = new {
                state = state,
                country = country
            }
        };
        ```

    1. Create another new anonymous typed item using the `name`, `state`, and `country` method parameters and the `id` variable. Store the item as a variable named `customerCart`. This item will represent shipping and contact information for the customer.

        ```csharp
        var customerContactInfo = new {
            id = $"{id}-contact",
            customerId = id,
            email = email,
            location = $"{state}, {country}",
            address = new {
                state = state,
                country = country
            }
        };
        ```

    1. Create a new batch using the container's `CreateTransactionalBatch` method passing in the `partitionKey` variable. Store the batch in a variable named `batch`. Use fluent methods to perform the following actions:

        | Method | Parameter |
        | --- | --- |
        | `ReadItem` | `id` string variable |
        | `CreateItem` | `customerCart` anonymous type variable |
        | `CreateItem` | `customerContactInfo` anonymous type variable |

        ```csharp
        var batch = container.CreateTransactionalBatch(partitionKey)
            .ReadItem(id)
            .CreateItem(customerCart)
            .CreateItem(customerContactInfo);
        ```

    1. Use the batch's `ExecuteAsync` method to start the transaction. Save the result in a variable named `response`.

        ```csharp
        using var response = await batch.ExecuteAsync();
        ```

    1. Write the values of the `response` variable's `StatusCode` and `RequestCharge` properties to the console. Also write the value of the `id` variable.

        ```csharp
        Console.WriteLine($"[{response.StatusCode}]\t{response.RequestCharge} RUs");
        ```

1. **Save** the **CosmosHandler.cs** file again.

1. Back in the terminal, run the application one more time to point read the single item.

    ```bash
    dotnet run -- --name 'Mica Pereira' --state 'Washington' --country 'United States'
    ```

1. The output of the command should show the request units used for the entire transaction.

    ```output
    [OK]    16.05 RUs
    ```

    > [!NOTE]
    > Your request charge may vary.

## Validate the final data in the Data Explorer

To wrap up things, you'll use the Data Explorer in the Azure portal to view the data, and container you created in this tutorial.

1. Navigate to your existing API for NoSQL account in the [Azure portal](https://portal.azure.com/).

1. In the resource menu, select **Data Explorer**.

    :::image type="content" source="media/tutorial-dotnet-console-app/resource-menu-data-explorer.png" alt-text="Screenshot of the Data Explorer option highlighted in the resource menu.":::

1. On the **Data Explorer** page, expand the `cosmicworks` database, and then select the `customers` container.

    :::image type="content" source="media/tutorial-dotnet-web-app/section-data-container.png" alt-text="Screenshot of the selected container node within the database node.":::

1. In the command bar, select **New SQL query**.

    :::image type="content" source="media/tutorial-dotnet-console-app/page-data-explorer-new-sql-query.png" alt-text="Screenshot of the New SQL Query option in the Data Explorer command bar.":::

1. In the query editor, observe this SQL query string.

    ```sql
    SELECT * FROM c
    ```

1. Select **Execute Query** to run the query and observe the results.

    :::image type="content" source="media/tutorial-dotnet-console-app/page-data-explorer-execute-query.png" alt-text="Screenshot of the Execute Query option in the Data Explorer command bar.":::

1. The results should include a JSON array with three items created in this tutorial. Observe that all of the items have the same hierarchical partition key value, but unique ID fields. The example output included is truncated for brevity.

    ```output
    [
      {
        "id": "mica-pereira",
        "name": "Mica Pereira",
        "address": {
          "state": "Washington",
          "country": "United States"
        },
        ...
      },
      {
        "id": "33d03318-6302-4559-b5c0-f3cc643b2f38",
        "customerId": "mica-pereira",
        "items": [],
        "address": {
          "state": "Washington",
          "country": "United States"
        },
        ...
      },
      {
        "id": "mica-pereira-contact",
        "customerId": "mica-pereira",
        "email": null,
        "location": "Washington, United States",
        "address": {
          "state": "Washington",
          "country": "United States"
        },
        ...
      }
    ]
    ```

## Clean up resources

When no longer needed, delete the database used in this tutorial. To do so, navigate to the account page, select **Data Explorer**, select the `cosmicworks` database, and then select **Delete**.

## Next steps

Now that you've created your first .NET console application using Azure Cosmos DB, try the next tutorial where you'll update an existing web application to use Azure Cosmos DB data.

> [!div class="nextstepaction"]
> [Tutorial: Develop an ASP.NET web application with Azure Cosmos DB for NoSQL](tutorial-dotnet-web-app.md)
