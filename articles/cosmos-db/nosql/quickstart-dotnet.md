---
title: Quickstart - Client library for .NET
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a .NET web application to manage Azure Cosmos DB for NoSQL account resources in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: quickstart
ms.date: 10/10/2023
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, passwordless-dotnet, devx-track-azurecli, devx-track-dotnet
# CustomerIntent: As a developer, I want to learn the basics of the .NET client library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQL client library for .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Quickstart selector](includes/quickstart-selector.md)]

Get started with the Azure Cosmos DB client library for .NET to create databases, containers, and items within your account. Follow these steps to deploy a sample application and explore the code. In this quickstart, you use the Azure Developer CLI (`azd`) and the `Microsoft.Azure.Cosmos` library to connect to a newly created Azure Cosmos DB for NoSQL account.

[API reference documentation](/dotnet/api/microsoft.azure.cosmos) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) | [Samples](samples-dotnet.md)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Deploy the Azure Developer CLI template

TODO

1. TODO

    ```azurecli-interactive
    cd ~/clouddrive
    mkdir cosmos-db-nosql-dotnet-quickstart
    cd ~/clouddrive/cosmos-db-nosql-dotnet-quickstart
    ```

1. TODO

    ```azurecli-interactive
    azd init --template cosmos-db-nosql-dotnet-quickstart
    ```

1. TODO

    ```azurecli-interactive
    azd up
    ```

1. TODO

    :::image type="content" source="media/quickstart-dotnet/web-application.png" alt-text="Screenshot of the running web application.":::

## Walk through the .NET library code

TODO

### Create an Azure Cosmos DB client

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Program.cs" range="8-11":::

### Get a database

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" range="5-7":::

### Get a container

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" range="5-7":::

### Create an item

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" range="5-7":::

### Execute a query

TODO

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" range="5-7":::

## Clean up resources

When you no longer need the sample application or resources, remove the corresponding deployment.

```azurecli-interactive
azd down
```

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL](tutorial-dotnet-console-app.md)
