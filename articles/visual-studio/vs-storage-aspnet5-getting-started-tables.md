---
title: How to get started with table storage and Visual Studio connected services (ASP.NET Core) | Microsoft Docs
description: How to get started with Azure Table storage in an ASP.NET Core project in Visual Studio after connecting to a storage account using Visual Studio connected services
services: storage
author: ghogen
manager: douge
ms.assetid: c3c451d1-71ff-4222-a348-c41c98a02b85
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 11/14/2017
ms.author: ghogen
---
# How to get started with Azure Table storage and Visual Studio connected services

[!INCLUDE [storage-try-azure-tools-tables](../../includes/storage-try-azure-tools-tables.md)]

This article describes how to get started using Azure Table storage in Visual Studio after you have created or referenced an Azure storage account in an ASP.NET Core project by using the Visual Studio **Connected Services** feature. The **Connected Services** operation installs the appropriate NuGet packages to access Azure storage in your project and adds the connection string for the storage account to your project configuration files. (See [Storage documentation](https://azure.microsoft.com/documentation/services/storage/) for general information about Azure Storage.)

The Azure Table storage service enables you to store large amounts of structured data. The service is a NoSQL data store that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data. For more general information about using Azure Table storage, see [Get started with Azure Table storage using .NET](../storage/storage-dotnet-how-to-use-tables.md).

To get started, first create a table in your storage account. This article then shows how to create a table  in C# and how to perform basic table operations such as adding, modifying, reading, and removing table entries.  The code uses the Azure Storage Client Library for .NET. For more information about ASP.NET, see [ASP.NET](https://www.asp.net).

Some of the Azure Storage APIs are asynchronous, and the code in this article assumes async methods are being used. See [Asynchronous programming](https://docs.microsoft.com/dotnet/csharp/async) for more information.

## Access tables in code

To access tables in ASP.NET Core projects, you need to include the following items to any C# source files that access Azure table storage.

1. Add the necessary `using` statements:

    ```csharp
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;
    using System.Threading.Tasks;
    ```

1. Get a `CloudStorageAccount` object that represents your storage account information. Use the following code, using the name of your storage account and the account key, which you can find in the storage connection string in appSettings.json:

    ```csharp
        CloudStorageAccount storageAccount = new CloudStorageAccount(
            new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
                "<name>", "<account-key>"), true);
    ```

1. Get a `CloudTableClient` object to reference the table objects in your storage account:

    ```csharp
    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
    ```

1. Get a `CloudTable` reference object to reference a specific table and entities:

    ```csharp
    // Get a reference to a table named "peopleTable"
    CloudTable peopleTable = tableClient.GetTableReference("peopleTable");
    ```

## Create a table in code

To create the Azure table, create an async method and within it, call `CreateIfNotExistsAsync()`:

```csharp
async void CreatePeopleTableAsync()
{
    // Create the CloudTable if it does not exist
    await peopleTable.CreateIfNotExistsAsync();
}
```
    
## Add an entity to a table

To add an entity to a table, you create a class that defines the properties of your entity. The following code defines an entity class called `CustomerEntity` that uses the customer's first name as the row key and last name as the partition key.

```csharp
public class CustomerEntity : TableEntity
{
    public CustomerEntity(string lastName, string firstName)
    {
        this.PartitionKey = lastName;
        this.RowKey = firstName;
    }

    public CustomerEntity() { }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }
}
```

Table operations involving entities use the `CloudTable` object you created earlier in [Access tables in code](#access-tables-in-code). The `TableOperation` object represents the operation to be done. The following code example shows how to create a `CloudTable` object and a `CustomerEntity` object. To prepare the operation, a `TableOperation` is created to insert the customer entity into the table. Finally, the operation is executed by calling `CloudTable.ExecuteAsync`.

```csharp
// Create a new customer entity.
CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
customer1.Email = "Walter@contoso.com";
customer1.PhoneNumber = "425-555-0101";

// Create the TableOperation that inserts the customer entity.
TableOperation insertOperation = TableOperation.Insert(customer1);

// Execute the insert operation.
await peopleTable.ExecuteAsync(insertOperation);
```

## Insert a batch of entities

You can insert multiple entities into a table in a single write operation. The following code example creates two entity objects ("Jeff Smith" and "Ben Smith"), adds them to a `TableBatchOperation` object using the `Insert` method, and then starts the operation by calling `CloudTable.ExecuteBatchAsync`.

```csharp
// Create the batch operation.
TableBatchOperation batchOperation = new TableBatchOperation();

// Create a customer entity and add it to the table.
CustomerEntity customer1 = new CustomerEntity("Smith", "Jeff");
customer1.Email = "Jeff@contoso.com";
customer1.PhoneNumber = "425-555-0104";

// Create another customer entity and add it to the table.
CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
customer2.Email = "Ben@contoso.com";
customer2.PhoneNumber = "425-555-0102";

// Add both customer entities to the batch insert operation.
batchOperation.Insert(customer1);
batchOperation.Insert(customer2);

// Execute the batch operation.
await peopleTable.ExecuteBatchAsync(batchOperation);
```

## Get all of the entities in a partition

To query a table for all of the entities in a partition, use a `TableQuery` object. The following code example specifies a filter for entities where 'Smith' is the partition key. This example prints the fields of each entity in the query results to the console.

```csharp
// Construct the query operation for all customer entities where PartitionKey="Smith".
TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"));

// Print the fields for each customer.
TableContinuationToken token = null;
do
{
    TableQuerySegment<CustomerEntity> resultSegment = await peopleTable.ExecuteQuerySegmentedAsync(query, token);
    token = resultSegment.ContinuationToken;

    foreach (CustomerEntity entity in resultSegment.Results)
    {
        Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
    }
} while (token != null);
```

## Get a single entity

You can write a query to get a single, specific entity. The following code uses a `TableOperation` object to specify a customer named 'Ben Smith'. The method returns just one entity, rather than a collection, and the returned value in `TableResult.Result` is a `CustomerEntity` object. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the `Table` service.

```csharp
// Create a retrieve operation that takes a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the retrieve operation.
TableResult retrievedResult = await peopleTable.ExecuteAsync(retrieveOperation);

// Print the phone number of the result.
if (retrievedResult.Result != null)
   Console.WriteLine(((CustomerEntity)retrievedResult.Result).PhoneNumber);
else
   Console.WriteLine("The phone number could not be retrieved.");
```

## Delete an entity

You can delete an entity after you find it. The following code looks for and deletes a customer entity named "Ben Smith":

```csharp
// Create a retrieve operation that expects a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the operation.
TableResult retrievedResult = await peopleTable.ExecuteAsync(retrieveOperation);

// Assign the result to a CustomerEntity object.
CustomerEntity deleteEntity = (CustomerEntity)retrievedResult.Result;

// Create the Delete TableOperation and then execute it.
if (deleteEntity != null)
{
   TableOperation deleteOperation = TableOperation.Delete(deleteEntity);

   // Execute the operation.
   await peopleTable.ExecuteAsync(deleteOperation);

   Console.WriteLine("Entity deleted.");
}

else
   Console.WriteLine("Couldn't delete the entity.");
```

## Next steps
[!INCLUDE [vs-storage-dotnet-tables-next-steps](../../includes/vs-storage-dotnet-tables-next-steps.md)]
