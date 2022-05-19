---
title: 'Quickstart: Build a Go app using Azure Cosmos DB SQL API account'
description: Gives a Go code sample you can use to connect to and query the Azure Cosmos DB SQL API
author: Duffney
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: golang
ms.topic: quickstart
ms.date: 3/4/2021
ms.author: jduffney
---

# Quickstart: Build a Go application using an Azure Cosmos DB SQL API account
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
> * [.NET V3](create-sql-api-dotnet.md)
> * [.NET V4](create-sql-api-dotnet-V4.md)
> * [Java SDK v4](create-sql-api-java.md)
> * [Spring Data v3](create-sql-api-spring-data.md)
> * [Spark v3 connector](create-sql-api-spark.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Go](create-sql-api-go.md)


In this quickstart, you'll build a sample Go application that uses the Azure SDK for Go to manage a Cosmos DB SQL API account.

Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities. 

To learn more about Azure Cosmos DB, go to [Azure Cosmos DB](../introduction.md).

## Prerequisites

- A Cosmos DB Account. Your options are:
    * Within an Azure active subscription:
        * [Create an Azure free Account](https://azure.microsoft.com/free) or use your existing subscription 
        * [Visual Studio Monthly Credits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers)
        * [Azure Cosmos DB Free Tier](../optimize-dev-test.md#azure-cosmos-db-free-tier)
    * Without an Azure active subscription:
        * [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/), a tests environment that lasts for 30 days.
        * [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) 
- [Go 1.16 or higher](https://golang.org/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)


## Getting started

For this quickstart, you'll need to create an Azure resource group and a Cosmos DB account.

Run the following commands to create an Azure resource group:

```azurecli
az group create --name myResourceGroup --location eastus
```

Next create a Cosmos DB account by running the following command:

```
az cosmosdb create --name my-cosmosdb-account --resource-group myResourceGroup
```

### Install the package

Use the `go get` command to install the [azcosmos](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos) package.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos
```

## Key concepts

* A `Client` is a connection to an Azure Cosmos DB account.
* Azure Cosmos DB accounts can have multiple `databases`. A `DatabaseClient` allows you to create, read, and delete databases.
* Database within an Azure Cosmos Account can have multiple `containers`. A `ContainerClient` allows you to create, read, update, and delete containers, and to modify throughput provision.
* Information is stored as items inside containers. And the client allows you to create, read, update, and delete items in containers.

## Code examples

**Authenticate the client**

```go
	var endpoint = "<azure_cosmos_uri>"
	var key      = "<azure_cosmos_primary_key"
	
	cred, err := azcosmos.NewKeyCredential(key)
	if err != nil {
		log.Fatal("Failed to create a credential: ", err)
	}

	// Create a CosmosDB client
	client, err := azcosmos.NewClientWithKey(endpoint, cred, nil)
	if err != nil {
		log.Fatal("Failed to create cosmos client: ", err)
	}

	// Create database client
  databaseClient, err := client.NewDatabase("<databaseName>")
	if err != nil {
		log.fatal("Failed to create database client:", err)
	}

  // Create container client
	containerClient, err := client.NewContainer("<databaseName>", "<containerName>")
	if err != nil {
		log.fatal("Failed to create a container client:", err)
	}
```

**Create a Cosmos database**

```go
databaseProperties := azcosmos.DatabaseProperties{ID: "<databaseName>"}

databaseResp, err := client.CreateDatabase(context.TODO(), databaseProperties, nil)
if err != nil {
	panic(err)
}
```

**Create a container**

```go
database, err := client.NewDatabase("<databaseName>") //returns struct that represents a database.
if err != nil {
	panic(err)
}

properties := azcosmos.ContainerProperties{
	ID: "ToDoItems",
	PartitionKeyDefinition: azcosmos.PartitionKeyDefinition{
		Paths: []string{"/category"},
	},
}

resp, err := database.CreateContainer(context.TODO(), properties, nil)
if err != nil {
	panic(err)
}
```

**Create an item**

```go
container, err := client.NewContainer("<databaseName>", "<containerName>")
if err != nil {
	panic(err)
}

pk := azcosmos.NewPartitionKeyString("personal") //specifies the value of the partition key

item := map[string]interface{}{
	"id":          "1",
	"category":    "personal",
	"name":        "groceries",
	"description": "Pick up apples and strawberries",
	"isComplete":  false,
}

marshalled, err := json.Marshal(item)
if err != nil {
	panic(err)
}

itemResponse, err := container.CreateItem(context.TODO(), pk, marshalled, nil)
if err != nil {
	panic(err)
}
```

**Read an item**

```go
getResponse, err := container.ReadItem(context.TODO(), pk, "1", nil)
if err != nil {
	panic(err)
}

var getResponseBody map[string]interface{}
err = json.Unmarshal([]byte(getResponse.Value), &getResponseBody)
if err != nil {
	panic(err)
}

fmt.Println("Read item with Id 1:")

for key, value := range getResponseBody {
	fmt.Printf("%s: %v\n", key, value)
}
```

**Delete an item**

```go
delResponse, err := container.DeleteItem(context.TODO(), pk, "1", nil)

if err != nil {
	panic(err)
}
```

## Run the code

To authenticate, you need to pass the Azure Cosmos account credentials to the application.

Get your Azure Cosmos account credentials by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos account.

1. Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** of your account. You'll add the URI and keys values to an environment variable in the next step.

After you've copied the **URI** and **PRIMARY KEY** of your account, save them to a new environment variable on the local machine running the application.

Use the values copied from the Azure port to set the following environment variables:

# [Bash](#tab/bash)

```bash
export AZURE_COSMOS_URL=<Your_AZURE_COSMOS_URI>
export AZURE_COSMOS_PRIMARY_KEY=<Your_COSMOS_PRIMARY_KEY>
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_COSMOS_URL=<Your_AZURE_COSMOS_URI>
$env:AZURE_COSMOS_PRIMARY_KEY=<Your_AZURE_COSMOS_URI>
```

---

Create a new Go module by running the following command:

```bash
go mod init azcosmos
```

Create a new file named `main.go` and copy the desired code from the sample sections above.

Run the following command to execute the app:

```bash
go run main.go
```


## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a database, container, and an item entry. Now import more data to your Azure Cosmos DB account. 

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB for the SQL API](../import-data.md)