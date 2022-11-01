---
title: Get started with table storage using Visual Studio (cloud services) 
description: How to get started using Azure Table storage in a cloud service project in Visual Studio after connecting to a storage account using Visual Studio connected services
services: storage
author: ghogen
manager: jillfra
ms.assetid: a3a11ed8-ba7f-4193-912b-e555f5b72184
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: "vs-azure, devx-track-csharp"
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 12/02/2016
ms.author: ghogen
ROBOTS: NOINDEX,NOFOLLOW
---
# Getting started with Azure table storage and Visual Studio connected services (cloud services projects)
[!INCLUDE [storage-try-azure-tools-tables](../../includes/storage-try-azure-tools-tables.md)]

## Overview

[!INCLUDE [Cloud Services (classic) deprecation announcement](../cloud-services/includes/deprecation-announcement.md)]


This article describes how to get started using Azure table storage in Visual Studio after you have created or referenced an Azure storage account in a cloud services project by using the Visual Studio **Add Connected Services** dialog. The **Add Connected Services** operation installs the appropriate NuGet packages to access Azure storage in your project and adds the connection string for the storage account to your project configuration files.

The Azure Table storage service enables you to store large amounts of structured data. The service is a NoSQL datastore that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data.

To get started, you first need to create a table in your storage account. We'll show you how to create an Azure table in code, and also how to perform basic table and entity operations, such as adding, modifying, reading and reading table entities. The samples are written in C\# code and use the [Microsoft Azure Storage client library for .NET](/previous-versions/azure/dn261237(v=azure.100)).

**NOTE:** Some of the APIs that perform calls out to Azure storage are asynchronous. See [Asynchronous programming with Async and Await](/previous-versions/hh191443(v=vs.140)) for more information. The code below assumes async programming methods are being used.

* See [Get started with Azure Table storage using .NET](../cosmos-db/tutorial-develop-table-dotnet.md) for more information on programmatically manipulating tables.
* See [Storage documentation](/azure/storage/) for general information about Azure Storage.
* See [Cloud Services documentation](/azure/cloud-services/) for general information about Azure cloud services.
* See [ASP.NET](https://www.asp.net) for more information about programming ASP.NET applications.

## Access tables in code
To access tables in cloud service projects, you need to include the following items to any C# source files that access Azure table storage.

1. Make sure the namespace declarations at the top of the C# file include these **using** statements.
   
    ```csharp
    using Microsoft.Framework.Configuration;
    using Azure.Data.Table;
    using System.Collections.Generic
    using System.Threading.Tasks;
    using LogLevel = Microsoft.Framework.Logging.LogLevel;
    ```
2. Get a **AzureStorageConnectionString** object to create a **TableServiceClient** that performs account-level operations like creating and deleting tables.
   
    ```csharp
    string storageConnString = "_AzureStorageConnectionString"
    ```

   > [!NOTE]
   > Use all of the above code in front of the code in the following samples.
   
3. Get a **TableServiceClient** object to reference the table objects in your storage account.
   
    ```csharp
    // Create the table service client.
    TableServiceClient tableServiceClient = new TableServiceClient(storageConnString);
    ```

4. Get a **TableClient** reference object to reference a specific table and entities.
   
    ```csharp
    // Get a reference to a table named "peopleTable".
    TableClient peopleTable = tableServiceClient.GetTableClient("peopleTable");
    ```

## Create a table in code
To create the Azure table, just add a call to **CreateIfNotExistsAsync** to the after you get a **TableClient** object as described in the "Access tables in code" section.

```csharp
// Create the TableClient if it does not exist.
await peopleTable.CreateIfNotExistsAsync();
```

## Add an entity to a table
To add an entity to a table, create a class that defines the properties of your entity. The following code defines an entity class called **CustomerEntity** that uses the customer's first name as the row key and the last name as the partition key.

```csharp
public class CustomerEntity : ITableEntity
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

AddEntity operations involving entities are done using the **TableClient** object that you created earlier in "Access tables in code." The **AddEntity** method represents the operation to be done. The following code example shows how to create a **TableClient** object and a **CustomerEntity** object. To prepare the operation, a **AddEntity** is inserting the customer entity into the table.

```csharp
// Create a new customer entity.
CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
customer1.Email = "Walter@contoso.com";
customer1.PhoneNumber = "425-555-0101";

// Inserts the customer entity.
peopleTable.AddEntity(customer1)
```


## Insert a batch of entities
You can insert multiple entities into a table in a single write operation. The following code example creates two entity objects ("Jeff Smith" and "Ben Smith"), adds them to a **addEntitiesBatch** object using the AddRange method, and then starts the operation by calling **TableClient.SubmitTransactionAsync**.

```csharp
// Create a list of 2 entities with the same partition key.
List<CustomerEntity> entityList = new List<CustomerEntity>
{
    new CustomerEntity("Smith", "Jeff")
    {
        { "Email", "Jeff@contoso.com" },
        { "PhoneNumber", "425-555-0104" }
    },
    new CustomerEntity("Smith", "Ben")
    {
        { "Email", "Ben@contoso.com" },
        { "PhoneNumber", "425-555-0102" }
    },
};

// Create the batch.
List<TableTransactionAction> addEntitiesBatch = new List<TableTransactionAction>();

// Add the entities to be added to the batch.
addEntitiesBatch.AddRange(entityList.Select(e => new TableTransactionAction(TableTransactionActionType.Add, e)));

// Submit the batch.
Response<IReadOnlyList<Response>> response = await peopleTable.SubmitTransactionAsync(addEntitiesBatch).ConfigureAwait(false);
```

## Get all of the entities in a partition
To query a table for all of the entities in a partition, use a **Query** method. The following code example specifies a filter for entities where 'Smith' is the partition key. This example prints the fields of each entity in the query results to the console.

```csharp
Pageable<CustomerEntity> queryResultsFilter = peopleTable.Query<CustomerEntity>(filter: "PartitionKey eq 'Smith'");

// Print the fields for each customer.
foreach (CustomerEntity qEntity in queryResultsFilter)
{
    Console.WriteLine("{0}, {1}\t{2}\t{3}", qEntity.PartitionKey, qEntity.RowKey, qEntity.Email, qEntity.PhoneNumber);
}
```


## Get a single entity
You can write a query to get a single, specific entity. The following code uses a **GetEntityAsync** method to specify a customer named 'Ben Smith'. This method returns just one entity, rather than a collection, and the returned value in **GetEntityAsync.Result** is a **CustomerEntity** object. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the **Table** service.

```csharp
var singleResult = peopleTable.GetEntityAsync<CustomerEntity>("Smith", "Ben");

// Print the phone number of the result.
if (singleResult.Result != null)
    Console.WriteLine(((CustomerEntity)singleResult.Result).PhoneNumber);
else
    Console.WriteLine("The phone number could not be retrieved.");
```

## Delete an entity
You can delete an entity after you find it. The following code looks for a customer entity named "Ben Smith", and if it finds it, it deletes it.

```csharp
var singleResult = peopleTable.GetEntityAsync<CustomerEntity>("Smith", "Ben");

CustomerEntity deleteEntity = (CustomerEntity)singleResult.Result;

// Delete the entity given the partition and row key.
if (deleteEntity != null)
{
    await peopleTable.DeleteEntity(deleteEntity.PartitionKey, deleteEntity.RowKey);

    Console.WriteLine("Entity deleted.");
}

else
    Console.WriteLine("Couldn't delete the entity.");
```

## Next steps
[!INCLUDE [vs-storage-dotnet-tables-next-steps](../../includes/vs-storage-dotnet-tables-next-steps.md)]
