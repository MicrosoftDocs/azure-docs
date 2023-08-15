---
title: Examples for Azure Cosmos DB for Table SDK for .NET
description: Find .NET SDK examples on GitHub for common tasks using the Azure Cosmos DB for Table.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Examples for Azure Cosmos DB for Table SDK for .NET

[!INCLUDE[Table](../includes/appliesto-table.md)]

> [!div class="op_single_selector"]
>
> * [.NET](samples-dotnet.md)
>

The [cosmos-db-table-api-dotnet-samples](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples) GitHub repository includes multiple sample projects. These projects illustrate how to perform common operations on Azure Cosmos DB for Table resources.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* Azure Cosmos DB for Table account. [Create a API for Table account](how-to-create-account.md).
* [.NET 6.0 or later](https://dotnet.microsoft.com/download)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Samples

The sample projects are all self-contained and are designed to be ran individually without any dependencies between projects.

### Client

| Task | API reference |
| :--- | ---: |
| [Create a client with connection string](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples/blob/v12/101-client-connection-string/Program.cs#L11-L13) | [``CosmosClient(string)``](/dotnet/api/azure.data.tables.tableserviceclient.-ctor#azure-data-tables-tableserviceclient-ctor(system-string)) |
| [Create a client with ``DefaultAzureCredential``](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples/blob/v12/102-client-default-credential/Program.cs#L20-L23) | [``TableServiceClient(Uri, TokenCredential)``](/dotnet/api/azure.data.tables.tableserviceclient.-ctor#azure-data-tables-tableserviceclient-ctor(system-uri-azure-azuresascredential)) |
| [Create a client with custom ``TokenCredential``](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples/blob/v12/103-client-secret-credential/Program.cs#L25-L28) | [``TableServiceClient(Uri, TokenCredential)``](/dotnet/api/azure.data.tables.tableserviceclient.-ctor#azure-data-tables-tableserviceclient-ctor(system-uri-azure-azuresascredential)) |

### Tables

| Task | API reference |
| :--- | ---: |
| [Create a table](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples/blob/v12/200-create-table/Program.cs#L18-L22) | [``TableClient.CreateIfNotExistsAsync``](/dotnet/api/azure.data.tables.tableclient.createifnotexistsasync) |

### Items

| Task | API reference |
| :--- | ---: |
| [Create an item using TableEntity](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples/blob/v12/250-create-item-tableentity/Program.cs#L25-L36) | [``TableClient.AddEntityAsync<>``](/dotnet/api/azure.data.tables.tableclient.addentityasync#azure-data-tables-tableclient-addentityasync-1(-0-system-threading-cancellationtoken)) |
| [Create an item using ITableEntity](https://github.com/azure-samples/cosmos-db-table-api-dotnet-samples/blob/v12/251-create-item-itableentity/Program.cs#L25-L37) | [``TableClient.AddEntityAsync<>``](/dotnet/api/azure.data.tables.tableclient.addentityasync#azure-data-tables-tableclient-addentityasync-1(-0-system-threading-cancellationtoken)) |
| [Point read an item](https://github.com/Azure-Samples/cosmos-db-table-api-dotnet-samples/blob/v12/276-read-item-itableentity/Program.cs#L42-L45) | [``TableClient.GetEntityAsync<>``](/dotnet/api/azure.data.tables.tableclient.getentityasync) |

## Next steps

Dive deeper into the SDK to read data and manage your Azure Cosmos DB for Table resources.

> [!div class="nextstepaction"]
> [Get started with Azure Cosmos DB for Table and .NET](how-to-dotnet-get-started.md)
