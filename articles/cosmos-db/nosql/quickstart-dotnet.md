---
title: Quickstart - .NET client library
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a .NET web application that uses the client library to interact with Azure Cosmos DB for NoSQL data in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: quickstart-sdk
ms.date: 01/08/2023
zone_pivot_groups: azure-cosmos-db-quickstart-env
# CustomerIntent: As a developer, I want to learn the basics of the .NET library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQL library for .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Developer Quickstart selector](includes/quickstart/dev-selector.md)]

Get started with the Azure Cosmos DB for NoSQL client library for .NET to query data in your containers and perform common operations on individual items. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API reference documentation](/dotnet/api/microsoft.azure.cosmos) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) | [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)

## Prerequisites

[!INCLUDE[Developer Quickstart prerequisites](includes/quickstart/dev-prereqs.md)]

## Setting up

[!INCLUDE[Developer Quickstart setup](includes/quickstart/dev-setup.md)]

### Install the client library

The client library is available through NuGet, as the `Microsoft.Azure.Cosmos` package.

1. Open a terminal and navigate to the `/src/web` folder.

    ```bash
    cd ./src/web
    ```

1. If not already installed, install the `Microsoft.Azure.Cosmos` package using `dotnet add package`.

    ```bash
    dotnet add package Microsoft.Azure.Cosmos
    ```

1. Open and review the **src/web/Cosmos.Samples.NoSQL.Quickstart.Web.csproj** file to validate that the `Microsoft.Azure.Cosmos` entry exists.

## Object model

| Name | Description |
| --- | --- |
| [``]() | This class is the primary client class and is used to manage account-wide metadata or databases. |
| [``]() | This class represents a database within the account. |
| [``]() | This class is primarily used to perform read, update, and delete operations on either the container or the items stored within the container. |
| [``]() | This class represents a logical partition key. This class is required for many common operations and queries. |

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Get a database](#get-a-database)
- [Get a container](#get-a-container)
- [Create an item](#create-an-item)
- [Get an item](#read-an-item)
- [Query items](#query-items)

### Authenticate the client

[!INCLUDE[Developer Quickstart authentication explanation](includes/quickstart/dev-auth-primer.md)]

This sample creates a new instance of the `CosmosClient` class and authenticates using a `DefaultAzureCredential` instance.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::

### Get a database

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::

### Get a container

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::

### Create an item

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::

### Read an item

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::

### Query items

TODO:

```nosql
SELECT * FROM products p WHERE p.category = @category
```

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/TODO" id="TODO" highlight="TODO":::


## Clean up resources

[!INCLUDE[Developer Quickstart cleanup](includes/quickstart/dev-cleanup.md)]

## Related content

- [JavaScript/Node.js Quickstart](quickstart-nodejs.md)
- [Java Quickstart](quickstart-java.md)
- [Python Quickstart](quickstart-python.md)
- [Go Quickstart](quickstart-go.md)

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL](tutorial-dotnet-console-app.md)
