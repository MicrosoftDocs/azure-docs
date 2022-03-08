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


In this quickstart, you will build a sample Go application that uses the Azure SDK for Go to manage a Cosmos DB SQL API account.

Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities. 

To learn more about Azure Cosmos DB, go to [Azure Cosmos DB](/azure/cosmos-db/introduction).

## Prerequisites

- A Cosmos DB Account. You options are:
    * Within an Azure active subscription:
        * [Create an Azure free Account](https://azure.microsoft.com/free) or use your existing subscription 
        * [Visual Studio Monthly Credits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers)
        * [Azure Cosmos DB Free Tier](../optimize-dev-test.md#azure-cosmos-db-free-tier)
    * Without an Azure active subscription:
        * [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/), a tests environment that lasts for 30 days.
        * [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) 
- [Go 1.16 or higher](https://golang.org/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)


## Create an Auzre Cosmos account

For this quickstart you'll need to create an Azure resource group and a Cosmos DB account.

Run the following commands to create the necessary Azure resources:

```azurecli
az group create --name myResourceGroup --location eastus
az cosmosdb create --name my-cosmosdb-account --resource-group myResourceGroup
```

## Create a new Go app

With your Azure resource group and Cosmos DB account created, setup your Go app. 

Run the `go mod init` command to create a new Go module.

```bash
go mod init cosmos_get_started
```

Use the `go get` command to install the [azcosmos](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos) package.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos
```

Next, create a new file named `main.go`.

## Write the sample code

This section walk you through creating a sample Go application that uses the Azure Cosmos DB SQL API account and the Azure SDK for Go. You'll learn how to: authenticate to Azure with a client, create a Cosmos database and container, and insert, query, and delete items from the Cosmos database.

Add the following code to the `main.go` file:

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

func main() {
	//Load the environment variables
	endpoint, ok := os.LookupEnv("AZURE_COSMOS_URI")
	if !ok {
		panic("AZURE_COSMOS_ENDPOINT could not be found")
	}

	key, ok := os.LookupEnv("AZURE_COSMOS_PRIMARY_KEY")
	if !ok {
		panic("AZURE_COSMOS_KEY could not be found")
	}

	// Create a new CosmosDB client
	cred, err := azcosmos.NewKeyCredential(key)
	if err != nil {
		log.Fatal("Failed to create a credential: ", err)
	}

	client, err := azcosmos.NewClientWithKey(endpoint, cred, nil)
	if err != nil {
		log.Fatal("Failed to create a client: ", err)
	}

	//Create a Cosmos database
	databaseProperties := azcosmos.DatabaseProperties{ID: "ToDoListDB"}

	databaseResp, err := client.CreateDatabase(context.Background(), databaseProperties, nil)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Database created. ActivityId %s\n", databaseResp.ActivityID)

	//Create a Cosmos container inside the database
	database, err := client.NewDatabase("ToDoListDB") //returns struct that represents a database.
	if err != nil {
		panic(err)
	}

	properties := azcosmos.ContainerProperties{
		ID: "ToDoItems",
		PartitionKeyDefinition: azcosmos.PartitionKeyDefinition{
			Paths: []string{"/category"},
		},
	}

	resp, err := database.CreateContainer(context.Background(), properties, nil)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Container created. ActivityId %s", resp.ActivityID)

	// Create an item inside the Cosmos container
	container, err := client.NewContainer("ToDoListDB", "ToDoItems")
	if err != nil {
		panic(err)
	}

	pk := azcosmos.NewPartitionKeyString("personal") //specifies the value of the partition key

	item := map[string]string{ //change to interface{} if you want to store any other type of data
		"id":          "1",
		"category":    "personal",
		"name":        "groceries",
		"description": "Pick up apples and strawberries",
		"isComplete":  "false",
	}

	marshalled, err := json.Marshal(item)
	if err != nil {
		panic(err)
	}

	itemResponse, err := container.CreateItem(context.Background(), pk, marshalled, nil)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Item created. ActivityId %s consuming %v RU \n", itemResponse.ActivityID, itemResponse.RequestCharge)

	// Read an item from a Cosmos container
	getResponse, err := container.ReadItem(context.Background(), pk, "1", nil)
	if err != nil {
		panic(err)
	}

	var getResponseBody map[string]interface{} //interface{} is a generic type accepting any value types returned
	err = json.Unmarshal([]byte(getResponse.Value), &getResponseBody)
	if err != nil {
		panic(err)
	}

	fmt.Println("Read item with Id 1:")

	for key, value := range getResponseBody {
		fmt.Printf("%s: %v\n", key, value)
	}

	//delete an item from a Cosmos container
	delResponse, err := container.DeleteItem(context.Background(), pk, "1", nil)

	if err != nil {
		panic(err)
	}
	//change to map output category, id, name
	fmt.Printf("Item deleted. ActivityId %s consuming %v RU", delResponse.ActivityID, delResponse.RequestCharge)
}
```

To learn more about the different elements in an Azure Cosmos account, see [Azure Cosmos DB resource model](/azure/cosmos-db/account-databases-containers-items).

## Run the code

To authenticate, you need to pass the Azure Cosmos account credentials to the application.

Get your Azure Cosmos account credentials by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos account.

1. Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** of your account. You will add the URI and keys values to an environment variable in the next step.

After you have copied the **URI** and **PRIMARY KEY** of your account, save them to a new environment variable on the local machine running the application.

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

Run the following command to execute the app:

```bash
go run main.go
```

---

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a databae, container, and an item entry. Now import additional data to your Azure Cosmos DB account. 

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB for the SQL API](../import-data.md)
