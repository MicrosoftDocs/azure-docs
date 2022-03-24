---
title: How to manage Azure Tables with the Azure SDK for Go 
description: Store structured data in the cloud using the Azure Tables client library for Go.
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: golang 
ms.topic: sample
ms.date: 03/24/2022
author: Duffney
ms.author: jduffney 
---

# How to use the Azure SDK for Go with Azure Tables

[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

[!INCLUDE [storage-selector-table-include](../../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

In this article, you'll learn how to use the Azure SDK for Go to create, list, and delete Azure Tables and Table entities.

Azure Table allows you to store structured NoSQL data in the cloud by providing you with a key attribute store with a schemaless design. Because Azure Table storage is schemaless, it's easy to adapt your data to the evolving needs of your applications. Access to table's data and API is a fast and cost-effectrive solution for many applications.

You can use the Table storage or the Azure Cosmos DB to store flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

Follow this article to learn how to manage Azure Table storage using the Azure SDK for Go.

## ## Prerequisites

You need the following:

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Go installed**: Version 1.16 or [above](https://golang.org/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)

## Setup your environment

```azurecli
az group create --name myResourceGroup --location eastus
```

```azurecli
az storage account create --name <storageAccountName> --resource-group myResourceGroup --location eastus --sku Standard_LRS
```

```azurecli
az storage table create --account-name <storageAccountName> --account-key 'storageKey' --name mytable
```

```azurecli
go get github.com/Azure/azure-sdk-for-go/sdk/data/aztables
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

## Create the sample application

```azurecli
go mod init azTableSample
```

Create a file called `main.go`, then copy the following code into the file:

```go

```

## Code examples

### Authenticate the client

### Create a table

### Create an entity

### Get an entitiy

### Delete an entity

### Delete a table

## Run the code

## Clean up resources

## Next steps

> [!div class="nextstepaction"]
> [Import table data to the Table API](table-import.md)