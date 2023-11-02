---
title: Use the Azure Table client library for Go
description: Store structured data in the cloud using the Azure Table client library for Go.
ms.service: cosmos-db
ms.subservice: table
ms.devlang: golang 
ms.custom: ignite-2022, devx-track-go
ms.topic: sample
ms.date: 03/24/2022
author: seesharprun
ms.author: sidandrews 
---

# How to use the Azure SDK for Go with Azure Table

[!INCLUDE[Table](../includes/appliesto-table.md)]

[!INCLUDE [storage-selector-table-include](../../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

In this article, you'll learn how to create, list, and delete Azure Tables and Table entities with the Azure SDK for Go.

Azure Table allows you to store structured NoSQL data in the cloud by providing you with a key attribute store with a schemaless design. Because Azure Table storage is schemaless, it's easy to adapt your data to the evolving needs of your applications. Access to table's data and API is a fast and cost-effective solution for many applications.

You can use the Table storage or the Azure Cosmos DB to store flexible datasets like user data for web applications, address books, device information. Or other types of metadata your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

Follow this article to learn how to manage Azure Table storage using the Azure SDK for Go.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Go installed**: Version 1.17 or [above](https://golang.org/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)

## Set up your environment

To follow along with this tutorial you'll need an Azure resource group, a storage account, and a table resource. Run the following commands to set up your environment:

1. Create an Azure resource group.
 
    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```

2. Next create an Azure storage account for your new Azure Table.
 
    ```azurecli
    az storage account create --name <storageAccountName> --resource-group myResourceGroup --location eastus --sku Standard_LRS
    ```

3. Create a table resource.
 
    ```azurecli
    az storage table create --account-name <storageAccountName> --account-key 'storageKey' --name mytable
    ```

### Install packages

You'll need two packages to manage Azure Table with Go; [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity), and [aztables](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/aztables). The `azidentity` package provides you with a way to authenticate to Azure. And the `aztables` packages give you the ability to manage the tables resource in Azure. Run the following Go commands to install these packages:

```azurecli
go get github.com/Azure/azure-sdk-for-go/sdk/data/aztables
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

To learn more about the ways to authenticate to Azure, check out [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication).


## Create the sample application

Once you have the packages installed, you create a sample application that uses the Azure SDK for Go to manage Azure Table. Run the `go mod` command to create a new module named `azTableSample`.

```azurecli
go mod init azTableSample
```

Next, create a file called `main.go`, then copy below into it: 

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

type PurchasedEntity struct {
    aztables.Entity
    Price float32
    ProductName string
    OnSale bool
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
            var myEntity PurchasedEntity 
            err = json.Unmarshal(entity, &myEntity)
            if err != nil {
                panic(err)
            }
            fmt.Println("Return custom type [PurchasedEntity]")
            fmt.Printf("Price: %v; ProductName: %v; OnSale: %v\n", myEntity.Price, myEntity.ProductName, myEntity.OnSale)
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

    fmt.Println("Querying a specific entity...")
    queryEntity(client) 

    fmt.Println("Deleting an entity...")
    deleteEntity(client) 

    fmt.Println("Deleting a table...")
    deleteTable(client)
}

```

> [!IMPORTANT]
> Ensure that the account you authenticated with has the proper accces policy to manage your Azure storage account. To run the above code you're account needs to have at a minimum the Storage Blob Data Contributor role and the Storage Table Data Contributor role.


## Code examples

### Authenticate the client

```go
// Lookup environment variables
accountName, ok := os.LookupEnv("AZURE_STORAGE_ACCOUNT")
if !ok {
  panic("AZURE_STORAGE_ACCOUNT environment variable not found")
}

tableName, ok := os.LookupEnv("AZURE_TABLE_NAME")
if !ok {
  panic("AZURE_TABLE_NAME environment variable not found")
}

// Create a credential
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  panic(err)
}

// Create a table client
serviceURL := fmt.Sprintf("https://%s.table.core.windows.net/%s", accountName, tableName)
client, err := aztables.NewClient(serviceURL, cred, nil)
if err != nil {
  panic(err)
}
```

### Create a table

```go
// Create a table and discard the response
_, err := client.Create(context.TODO(), nil)
if err != nil {
  panic(err)
}
```

### Create an entity

```go
// Define the table entity as a custom type
type InventoryEntity struct {
    aztables.Entity
    Price       float32
    Inventory   int32
    ProductName string
    OnSale      bool
}

// Define the entity values
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

// Marshal the entity to JSON
marshalled, err := json.Marshal(myEntity)
if err != nil {
    panic(err)
}

// Add the entity to the table
_, err = client.AddEntity(context.TODO(), marshalled, nil) // needs Storage Table Data Contributor role
if err != nil {
    panic(err)
}
```

### Get an entity

```go
// Define the new custom type
type PurchasedEntity struct {
    aztables.Entity
    Price       float32
    ProductName string
    OnSale      bool
}

// Define the query filter and options
filter := fmt.Sprintf("PartitionKey eq '%v' or RowKey eq '%v'", "pk001", "rk001")
options := &aztables.ListEntitiesOptions{
    Filter: &filter,
    Select: to.StringPtr("RowKey,Price,Inventory,ProductName,OnSale"),
    Top:    to.Int32Ptr(15),
}

// Query the table for the entity
pager := client.List(options)
for pager.More() {
    resp, err := pager.NextPage(context.Background())
    if err != nil {
        panic(err)
    }
    for _, entity := range resp.Entities {
        var myEntity PurchasedEntity
        err = json.Unmarshal(entity, &myEntity)
        if err != nil {
            panic(err)
        }
        fmt.Println("Return custom type [PurchasedEntity]")
        fmt.Printf("Price: %v; ProductName: %v; OnSale: %v\n", myEntity.Price, myEntity.ProductName, myEntity.OnSale)
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

All that's left is to run the application. But before you do that, you need to set up your environment variables. Create two environment variables and set them to the appropriate value using the following commands:

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

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a table using the Data Explorer, and run an app. Now you can query your data using the API for Table.  

> [!div class="nextstepaction"]
> [Query Azure Cosmos DB by using the API for Table](tutorial-query.md)
