---
title: Examples for Azure Cosmos DB for NoSQL SDK for .NET
description: Find .NET SDK examples on GitHub for common tasks using the Azure Cosmos DB for NoSQL.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: sample
ms.date: 07/06/2022
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Examples for Azure Cosmos DB for NoSQL SDK for .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Samples selector](includes/samples-selector.md)]

The [cosmos-db-nosql-dotnet-samples](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples) GitHub repository includes multiple sample projects. These projects illustrate how to perform common operations on Azure Cosmos DB for NoSQL resources.

## Prerequisites

- An Azure account with an active subscription. Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb).
- Azure Cosmos DB for NoSQL account. [Create a API for NoSQL account](how-to-create-account.md).
- [.NET 6.0 or later](https://dotnet.microsoft.com/download)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Samples

The sample projects are all self-contained and are designed to be ran individually without any dependencies between projects.

### Client

| Task | API reference |
| :--- | ---: |
| [Create a client with endpoint and key](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/101-client-endpoint-key/Program.cs#L11-L14) |[``CosmosClient(string, string)``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.-ctor#microsoft-azure-cosmos-cosmosclient-ctor(system-string-system-string-microsoft-azure-cosmos-cosmosclientoptions)) |
| [Create a client with connection string](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/102-client-connection-string/Program.cs#L11-L13) |[``CosmosClient(string)``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.-ctor#microsoft-azure-cosmos-cosmosclient-ctor(system-string-microsoft-azure-cosmos-cosmosclientoptions)) |
| [Create a client with ``DefaultAzureCredential``](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/103-client-default-credential/Program.cs#L20-L23) |[``CosmosClient(string, TokenCredential)``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.-ctor#microsoft-azure-cosmos-cosmosclient-ctor(system-string-azure-core-tokencredential-microsoft-azure-cosmos-cosmosclientoptions)) |
| [Create a client with custom ``TokenCredential``](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/104-client-secret-credential/Program.cs#L25-L28) |[``CosmosClient(string, TokenCredential)``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.-ctor#microsoft-azure-cosmos-cosmosclient-ctor(system-string-azure-core-tokencredential-microsoft-azure-cosmos-cosmosclientoptions)) |

### Databases

| Task | API reference |
| :--- | ---: |
| [Create a database](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/200-create-database/Program.cs#L19-L21) |[``CosmosClient.CreateDatabaseIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseifnotexistsasync) |

### Containers

| Task | API reference |
| :--- | ---: |
| [Create a container](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/225-create-container/Program.cs#L26-L30) |[``Database.CreateContainerIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync) |

### Items

| Task | API reference |
| :--- | ---: |
| [Create an item](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/250-create-item/Program.cs#L35-L46) |[``Container.CreateItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.createitemasync) |
| [Point read an item](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/275-read-item/Program.cs#L51-L54) |[``Container.ReadItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.readitemasync) |
| [Query multiple items](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples/blob/main/300-query-items/Program.cs#L64-L80) |[``Container.GetItemQueryIterator<>``](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) |

## Next steps

Dive deeper into the SDK to import more data, perform complex queries, and manage your Azure Cosmos DB for NoSQL resources.

> [!div class="nextstepaction"]
> [Get started with Azure Cosmos DB for NoSQL and .NET](how-to-dotnet-get-started.md)
