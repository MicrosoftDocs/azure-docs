---
title: Examples for Azure Cosmos DB Table API SDK for .NET
description: Find .NET SDK examples on GitHub for common tasks using the Azure Cosmos DB Table API.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp
---

# Examples for Azure Cosmos DB Table API SDK for .NET

[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

> [!div class="op_single_selector"]
>
> * [.NET](samples-dotnet.md)
>

The [cosmos-db-table-api-dotnet-samples](https://github.com/Azure-Samples/cosmos-db-table-api-dotnet-samples) GitHub repository includes multiple sample projects. These projects illustrate how to perform common operations on Azure Cosmos DB Table API resources.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* Azure Cosmos DB Table API account. [Create a Table API account](how-to-create-account.md).
* [.NET 6.0 or later](https://dotnet.microsoft.com/download)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Samples

The sample projects are all self-contained and are designed to be ran individually without any dependencies between projects.

### Client

| Task | API reference |
| :--- | ---: |
| [Create a client with connection string](https://github.com/Azure-Samples/cosmos-db-table-api-dotnet-samples/blob/v12/101-client-connection-string/Program.cs#L11-L13) |[``CosmosClient(string)``](/dotnet/api/azure.data.tables.tableserviceclient.-ctor#azure-data-tables-tableserviceclient-ctor(system-string)) |
| [Create a client with ``DefaultAzureCredential``](https://github.com/Azure-Samples/cosmos-db-table-api-dotnet-samples/blob/v12/102-client-default-credential/Program.cs#L20-L23) |[``TableServiceClient(Uri, TokenCredential)``](/dotnet/api/azure.data.tables.tableserviceclient.-ctor#azure-data-tables-tableserviceclient-ctor(system-uri-azure-azuresascredential)) |
| [Create a client with custom ``TokenCredential``](https://github.com/Azure-Samples/cosmos-db-table-api-dotnet-samples/blob/v12/103-client-secret-credential/Program.cs#L25-L28) |[``TableServiceClient(Uri, TokenCredential)``](/dotnet/api/azure.data.tables.tableserviceclient.-ctor#azure-data-tables-tableserviceclient-ctor(system-uri-azure-azuresascredential)) |

## Next steps

Dive deeper into the SDK to read data and manage your Azure Cosmos DB Table API resources.

> [!div class="nextstepaction"]
> [Get started with Azure Cosmos DB Table API and .NET](how-to-dotnet-get-started.md)
