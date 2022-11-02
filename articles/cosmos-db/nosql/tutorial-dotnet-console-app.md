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
> - Modify existing items in an API for NoSQL container
> - Create a transaction with batch changes for the API for NoSQL container
>

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](../try-free.md) before you commit.
- [Visual Studio Code](https://code.visualstudio.com)
- [.NET 6 (LTS) or later](https://dotnet.microsoft.com/download/dotnet/6.0)
- Experience writing C# applications.

## Create API for NoSQL resources

First, create an empty database in the existing API for NoSQL account. You'll create a container using the Azure SDK for .NET later.

1. Navigate to your existing API for NoSQL account in the [Azure portal](https://portal.azure.com/).

1. In the resource menu, select **Keys**.

    :::image type="content" source="media/tutorial-dotnet-console-app/resource-menu-keys.png" lightbox="media/tutorial-dotnet-web-app/resource-menu-keys.png" alt-text="Screenshot of an API for NoSQL account page. The Keys option is highlighted in the resource menu.":::

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
    dotnet new console
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
        handle: CosmosHandler.CreateCustomerAsync, 
        nameOption, 
        emailOption,
        stateOption,
        countryOption
    );
    
    await command.InvokeAsync(args);
    ```

    > [!NOTE]
    > For this tutorial, it's not entirely important that you understand how the command-line parser works. The parser has four options that can be specified when the application is running. Three of the options are required since they will be used to construct the ID and partition key fields.

1. At this point, the project won't build since you haven't defined the static `CosmosHandler.CreateCustomerAsync` method yet.

1. **Save** the **Program.cs** file.

## Add items to a container using the SDK

Next, you'll use individual operations to add items into the API for NoSQL container. In this section, you'll define the  `CosmosHandler.CreateCustomerAsync` method.

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

1. Just to validate this app will work, create a short implementation of the static `CreateCustomerAsync` method to print the command-line input.

    ```csharp
    public static async Task CreateCustomerAsync(string name, string email, string state, string country)
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

1. Delete all of the code within the `CreateCustomerAsync` method.

1. For the next steps, add this code within the `CreateCustomerAsync` method.

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

## Change existing items in a container using the SDK

## Create a transaction using the SDK

## Clean up resources

When no longer needed, delete the database used in this tutorial. To do so, navigate to the account page, select **Data Explorer**, select the `cosmicworks` database, and then select **Delete**.

## Next steps

Now that you've created your first .NET console application using Azure Cosmos DB, try the next tutorial where you'll update an existing web application to use Azure Cosmos DB data.

> [!div class="nextstepaction"]
> [Tutorial: Develop an ASP.NET web application with Azure Cosmos DB for NoSQL](tutorial-dotnet-web-app.md)
