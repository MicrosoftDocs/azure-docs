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
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/data/aztables"
)

type InventoryEntity struct {
	aztables.Entity
	Price       float32
	Inventory   int32
	ProductName string
	OnSale      bool
}

func getClient() *aztables.Client {
	accountName, ok := os.LookupEnv("AZURE_STORAGE_ACCOUNT")
	if !ok {
		panic("AZURE_STORAGE_ACCOUNT environment variable not found")
	}

	tableName, ok := os.LookupEnv("AZURE_TABLE_NAME")
	if !ok {
		panic("AZURE_TABLE_NAME environment variable not found")
	}

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		panic(err)
	}
	serviceURL := fmt.Sprintf("https://%s.table.core.windows.net/%s", accountName, tableName)
	client, err := aztables.NewClient(serviceURL, cred, nil)
	if err != nil {
		panic(err)
	}
	return client
}

func createTable(client *aztables.Client) {
	//TODO: Check access policy, Storage Blob Data Contributor role needed
	_, err := client.Create(context.TODO(), nil)
	if err != nil {
		panic(err)
	}
}

func addEntity(client *aztables.Client) {
	myEntity := InventoryEntity{
		Entity: aztables.Entity{
			PartitionKey: "pk001",
			RowKey:       "rk001",
		},
		Price:       3.99,
		Inventory:   20,
		ProductName: "Markers",
		OnSale:      false,
	}

	marshalled, err := json.Marshal(myEntity)
	if err != nil {
		panic(err)
	}

	_, err = client.AddEntity(context.TODO(), marshalled, nil) // TODO: Check access policy, need Storage Table Data Contributor role
	if err != nil {
		panic(err)
	}
}

func listEntities(client *aztables.Client) {
	listPager := client.List(nil)
	pageCount := 0
	for listPager.More() {
		response, err := listPager.NextPage(context.TODO())
		if err != nil {
			panic(err)
		}
		fmt.Printf("There are %d entities in page #%d\n", len(response.Entities), pageCount)
		pageCount += 1
	}
}

func queryEntity(client *aztables.Client) {
        filter := fmt.Sprintf("PartitionKey eq '%s' or RowKey eq '%s'", "pk001", "rk001")
	options := &aztables.ListEntitiesOptions{
		Filter: &filter,
		Select: to.StringPtr("RowKey,Price,Inventory,ProductName,OnSale"),
		Top:    to.Int32Ptr(15),
	}

	pager := client.List(options)
	for pager.More() {
		resp, err := pager.NextPage(context.Background())
		if err != nil {
			panic(err)
		}
		for _, entity := range resp.Entities {
			var myEntity aztables.EDMEntity
			err = json.Unmarshal(entity, &myEntity)
			if err != nil {
				panic(err)
			}

			fmt.Printf("Received: %v, %v, %v, %v, %v\n", myEntity.RowKey, myEntity.Properties["Price"], myEntity.Properties["Inventory"], myEntity.Properties["ProductName"], myEntity.Properties["OnSale"])
		}
	}
}

func deleteEntity(client *aztables.Client) {
	_, err := client.DeleteEntity(context.TODO(), "pk001", "rk001", nil)
	if err != nil {
		panic(err)
	}
}

func deleteTable(client *aztables.Client) {
	_, err := client.Delete(context.TODO(), nil)
	if err != nil {
		panic(err)
	}
}

func main() {

	fmt.Println("Authenticating...")
	client := getClient()

	fmt.Println("Creating a table...")
	createTable(client)

	fmt.Println("Adding an entity to the table...")
	addEntity(client)

	fmt.Println("Calculating all entities in the table...")
	listEntities(client)

	fmt.Println("Querying a specific entitiy...")
	queryEntity(client) 

	fmt.Println("Deleting an entity...")
	deleteEntity(client) 

	fmt.Println("Deleting a table...")
	deleteTable(client)
}

```

## Code examples

### Authenticate the client

```go
accountName, ok := os.LookupEnv("AZURE_STORAGE_ACCOUNT")
if !ok {
  panic("AZURE_STORAGE_ACCOUNT environment variable not found")
}

tableName, ok := os.LookupEnv("AZURE_TABLE_NAME")
if !ok {
  panic("AZURE_TABLE_NAME environment variable not found")
}

cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  panic(err)
}
serviceURL := fmt.Sprintf("https://%s.table.core.windows.net/%s", accountName, tableName)
client, err := aztables.NewClient(serviceURL, cred, nil)
if err != nil {
  panic(err)
}
```

### Create a table

```go
_, err := client.Create(context.TODO(), nil)
if err != nil {
  panic(err)
}
```

### Create an entity

```go
type InventoryEntity struct {
	aztables.Entity
	Price       float32
	Inventory   int32
	ProductName string
	OnSale      bool
}

myEntity := InventoryEntity{
	Entity: aztables.Entity{
		PartitionKey: "pk001",
		RowKey:       "rk001",
	},
	Price:       3.99,
	Inventory:   20,
	ProductName: "Markers",
	OnSale:      false,
}

marshalled, err := json.Marshal(myEntity)
if err != nil {
	panic(err)
}

_, err = client.AddEntity(context.TODO(), marshalled, nil) // needs Storage Table Data Contributor role
if err != nil {
	panic(err)
}
```

### Get an entitiy

```go
filter := fmt.Sprintf("PartitionKey eq '%v' or RowKey eq '%v'", "pk001", "rk001")
options := &aztables.ListEntitiesOptions{
	Filter: &filter,
	Select: to.StringPtr("RowKey,Price,Inventory,ProductName,OnSale"),
	Top:    to.Int32Ptr(15),
}

pager := client.List(options)
for pager.More() {
	resp, err := pager.NextPage(context.Background())
	if err != nil {
		panic(err)
	}
	for _, entity := range resp.Entities {
		var myEntity aztables.EDMEntity
		err = json.Unmarshal(entity, &myEntity)
		if err != nil {
			panic(err)
		}

		fmt.Printf("Received: %v, %v, %v, %v, %v\n", myEntity.RowKey, myEntity.Properties["Price"], myEntity.Properties["Inventory"], myEntity.Properties["ProductName"], myEntity.Properties["OnSale"])
	}
}
```

### Delete an entity

```go
_, err := client.DeleteEntity(context.TODO(), "pk001", "rk001", nil)
if err != nil {
  panic(err)
}
```

### Delete a table

```go
_, err := client.Delete(context.TODO(), nil)
if err != nil {
  panic(err)
}
```

## Run the code

Before you run the sample application, create two environment variables and set them to the appropriate value.

# [Bash](#tab/bash)

```bash
export AZURE_STORAGE_ACCOUNT=<YourStorageAccountName> 
export AZURE_TABLE_NAME=<YourAzureTableName>
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_STORAGE_ACCOUNT=<YourStorageAccountName> 
$env:AZURE_TABLE_NAME=<YourAzureTableName>
```

---

Next, run the following `go run` command to run the app:

```bash
go run main.go
```

## Clean up resources

Run the following command to delete the resource group and all its remaining resources:

```azurecli
az group delete --resource-group myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Import table data to the Table API](table-import.md)
