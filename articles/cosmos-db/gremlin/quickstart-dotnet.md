---
title: 'Quickstart: Gremlin library for .NET'
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: In this quickstart, connect to Azure Cosmos DB for Apache Gremlin using .NET. Then, create and traverse vertices and edges.
author: manishmsfte
ms.author: mansha
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: devx-track-azurecli, devx-track-dotnet
ms.topic: quickstart-sdk
ms.date: 09/27/2023
# CustomerIntent: As a .NET developer, I want to use a library for my programming language so that I can create and traverse vertices and edges in code.
---

# Quickstart: Azure Cosmos DB for Apache Gremlin library for .NET

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[!INCLUDE[Gremlin devlang](includes/quickstart-devlang.md)]

Azure Cosmos DB for Apache Gremlin is a fully managed graph database service implementing the popular [`Apache Tinkerpop`](https://tinkerpop.apache.org/), a graph computing framework using the Gremlin query language. The API for Gremlin gives you a low-friction way to get started using Gremlin with a service that can grow and scale out as much as you need with minimal management.

In this quickstart, you use the `Gremlin.Net` library to connect to a newly created Azure Cosmos DB for Gremlin account.

[Library source code](https://github.com/apache/tinkerpop/tree/master/gremlin-dotnet) | [Package (NuGet)](https://www.nuget.org/packages/Gremlin.Net)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? [Sign up for a free Azure account](https://azure.microsoft.com/free/).
  - Don't want an Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no subscription required.
- [.NET (LTS)](https://dotnet.microsoft.com/)
  - Don't have .NET installed? Try this quickstart in [GitHub Codespaces](https://codespaces.new/github/codespaces-blank?quickstart=1).
- [Azure Command-Line Interface (CLI)](/cli/azure/)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Setting up

This section walks you through creating an API for Gremlin account and setting up a .NET project to use the library to connect to the account.

### Create an API for Gremlin account

The API for Gremlin account should be created prior to using the .NET library. Additionally, it helps to also have the database and graph in place.

[!INCLUDE[Create account, database, and graph](includes/create-account-database-graph-cli.md)]

### Create a new .NET console application

Create a .NET console application in an empty folder using your preferred terminal.

1. Open your terminal in an empty folder.

1. Use the `dotnet new` command specifying the **console** template.

    ```bash
    dotnet new console
    ```

### Install the NuGet package

Add the `Gremlin.NET` NuGet package to the .NET project.

1. Use the `dotnet add package` command specifying the `Gremlin.Net` NuGet package.

    ```bash
    dotnet add package Gremlin.Net
    ```

1. Build the .NET project using `dotnet build`.

    ```bash
    dotnet build
    ```

    Make sure that the build was successful with no errors. The expected output from the build should look something like this:

    ```output
    Determining projects to restore...
      All projects are up-to-date for restore.
      dslkajfjlksd -> \dslkajfjlksd\bin\Debug\net6.0\dslkajfjlksd.dll
    
    Build succeeded.
        0 Warning(s)
        0 Error(s)
    ```

### Configure environment variables

To use the *NAME* and *URI* values obtained earlier in this quickstart, persist them to new environment variables on the local machine running the application.

1. To set the environment variable, use your terminal to persist the values as `COSMOS_ENDPOINT` and `COSMOS_KEY` respectively.

    ```bash
    export COSMOS_GREMLIN_ENDPOINT="<account-name>"
    export COSMOS_GREMLIN_KEY="<account-key>"
    ```

1. Validate that the environment variables were set correctly.

    ```bash
    printenv COSMOS_GREMLIN_ENDPOINT
    printenv COSMOS_GREMLIN_KEY
    ```

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create vertices](#create-vertices)
- [Create edges](#create-edges)
- [Query vertices &amp; edges](#query-vertices--edges)

The code in this article connects to a database named `cosmicworks` and a graph named `products`. The code then adds vertices and edges to the graph before traversing the added items.

### Authenticate the client

Application requests to most Azure services must be authorized. For the API for Gremlin, use the *NAME* and *URI* values obtained earlier in this quickstart.

1. Open the **Program.cs** file.

1. Delete any existing content within the file.

1. Add a using block for the `Gremlin.Net.Driver` namespace.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="imports":::

1. Create `accountName` and `accountKey` string variables. Store the `COSMOS_GREMLIN_ENDPOINT` and `COSMOS_GREMLIN_KEY` environment variables as the values for each respective variable.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="environment_variables":::

1. Create a new instance of `GremlinServer` using the account's credentials.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="authenticate_client":::

1. Create a new instance of `GremlinClient` using the remote server credentials and the **GraphSON 2.0** serializer.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="connect_client":::

### Create vertices

Now that the application is connected to the account, use the standard Gremlin syntax to create vertices.

1. Use `SubmitAsync` to run a command server-side on the API for Gremlin account. Create a **product** vertex with the following properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518371` |
    | **`name`** | `Kiama classic surfboard` |
    | **`price`** | `285.55` |
    | **`category`** | `surfboards` |

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="create_vertices_1":::

1. Create a second **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518403` |
    | **`name`** | `Montau Turtle Surfboard` |
    | **`price`** | `600.00` |
    | **`category`** | `surfboards` |

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="create_vertices_2":::

1. Create a third **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518409` |
    | **`name`** | `Bondi Twin Surfboard` |
    | **`price`** | `585.50` |
    | **`category`** | `surfboards` |

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="create_vertices_3":::

### Create edges

Create edges using the Gremlin syntax to define relationships between vertices.

1. Create an edge from the `Montau Turtle Surfboard` product named **replaces** to the `Kiama classic surfboard` product.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="create_edges_1":::

    > [!TIP]
    > This edge defintion uses the `g.V(['<partition-key>', '<id>'])` syntax. Alternatively, you can use `g.V('<id>').has('category', '<partition-key>')`.

1. Create another **replaces** edge from the same product to the `Bondi Twin Surfboard`.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="create_edges_2":::

### Query vertices &amp; edges

Use the Gremlin syntax to traverse the graph and discover relationships between vertices.

1. Traverse the graph and find all vertices that `Montau Turtle Surfboard` replaces.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="query_vertices_edges":::

1. Write to the console the static string `[CREATED PRODUCT]\t68719518403`. Then, iterate over each matching vertex using a `foreach` loop and write to the console a message that starts with `[REPLACES PRODUCT]` and includes the matching product `id` field as a suffix.

    :::code language="csharp" source="~/cosmos-db-apache-gremlin-dotnet-samples/001-quickstart/Program.cs" id="output_vertices_edges":::

## Run the code

Validate that your application works as expected by running the application. The application should execute with no errors or warnings. The output of the application includes data about the created and queried items.

1. Open the terminal in the .NET project folder.

1. Use `dotnet run` to run the application.

    ```bash
    dotnet run
    ```

1. Observe the output from the application.

    ```output
    [CREATED PRODUCT]       68719518403
    [REPLACES PRODUCT]      68719518371
    [REPLACES PRODUCT]      68719518409
    ```

## Clean up resources

When you no longer need the API for Gremlin account, delete the corresponding resource group.

[!INCLUDE[Delete account](includes/delete-account-cli.md)]

## Next step

> [!div class="nextstepaction"]
> [Create and query data using Azure Cosmos DB for Apache Gremlin](tutorial-query.md)
