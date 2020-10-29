---
title: Transactional batch operations in Azure Cosmos DB using the .NET SDK 
description: Learn how to use TransactionalBatch in the Azure Cosmos DB .NET SDK to perform a group of point operations that either succeed or fail. 
author: stefArroyo 
ms.author: esarroyo
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/27/2020
---

# Transactional batch operations in Azure Cosmos DB using the .NET SDK

Transactional batch describes a group of point operations that need to either succeed or fail together with the same partition key in a container. In the .NET SDK, the `TranscationalBatch` class is used to define this batch of operations. If all operations succeed in the order they are described within the transactional batch operation, the transaction will be committed. However, if any operation fails, the entire transaction is rolled back.

## What's a transaction in Azure Cosmos DB

A transaction in a typical database can be defined as a sequence of operations performed as a single logical unit of work. Each transaction provides ACID (Atomicity, Consistency, Isolation, Durability) property guarantees.

* **Atomicity** guarantees that all the operations done inside a transaction are treated as a single unit, and either all of them are committed or none of them are.
* **Consistency** makes sure that the data is always in a valid state across transactions.
* **Isolation** guarantees that no two transactions interfere with each other – many commercial systems provide multiple isolation levels that can be used based on the application needs.
* **Durability** ensures that any change that is committed in a database will always be present.
Azure Cosmos DB supports [full ACID compliant transactions with snapshot isolation](database-transactions-optimistic-concurrency.md) for operations within the same [logical partition key](partitioning-overview.md).

## Transactional batch operations Vs stored procedures

Azure Cosmos DB currently supports stored procedures, which also provide the transactional scope on operations. However, transactional batch operations offer the following benefits:

* **Language option** – Transactional batch is supported on the SDK and language you work with already, while stored procedures need to be written in JavaScript.
* **Code versioning** – Versioning application code and onboarding it onto your CI/CD pipeline is much more natural than orchestrating the update of a stored procedure and making sure the rollover happens at the right time. It also makes rolling back changes easier.
* **Performance** – Reduced the latency on equivalent operations up to 30% when compared to the stored procedure execution.
* **Content serialization** – Each operation within a transactional batch can leverage custom serialization options for its payload.

## How to create a transactional batch operation

When creating a transactional batch operation, you begin from a container instance and call `CreateTransactionalBatch`:

```csharp
string partitionKey = "The Family";
ParentClass parent = new ParentClass(){ Id = "The Parent", PartitionKey = partitionKey, Name = "John", Age = 30 };
ChildClass child = new ChildClass(){ Id = "The Child", ParentId = parent.Id, PartitionKey = partitionKey };
TransactionalBatch batch = container.CreateTransactionalBatch(new PartitionKey(parent.PartitionKey)) 
  .CreateItem<ParentClass>(parent)
  .CreateItem<ChildClass>(child);
```

Next, you'll need to call the `ExecuteAsync`:

```csharp
TransactionalBatchResponse batchResponse = await batch.ExecuteAsync();
```

Once the response is received, you'll need to examine if it is successful or not, and extract the results:

```csharp
using (batchResponse)
{
  if (batchResponse.IsSuccessStatusCode)
  {
    TransactionalBatchOperationResult<ParentClass> parentResult = batchResponse.GetOperationResultAtIndex<ParentClass>(0);
    ParentClass parentClassResult = parentResult.Resource;
    TransactionalBatchOperationResult<ChildClass> childResult = batchResponse.GetOperationResultAtIndex<ChildClass>(1);
    ChildClass childClassResult = childResult.Resource;
  }
}
```

If there is a failure, the failed operation will have a status code of its corresponding error. Whereas all the other operations will have a 424 status code (failed dependency). In the example below, the operation fails because it tries to create an item that already exists (409 HttpStatusCode.Conflict). Status codes make it easier to identify the cause of transaction failure.

```csharp
// Parent's birthday!
parent.Age = 31;
// Naming two children with the same name, should abort the transaction
ChildClass anotherChild = new ChildClass(){ Id = "The Child", ParentId = parent.Id, PartitionKey = partitionKey };
TransactionalBatchResponse failedBatchResponse = await container.CreateTransactionalBatch(new PartitionKey(partitionKey))
  .ReplaceItem<ParentClass>(parent.Id, parent)
  .CreateItem<ChildClass>(anotherChild)
  .ExecuteAsync();

using (failedBatchResponse)
{
  if (!failedBatchResponse.IsSuccessStatusCode)
  {
    TransactionalBatchOperationResult<ParentClass> parentResult = failedBatchResponse.GetOperationResultAtIndex<ParentClass>(0);
    // parentResult.StatusCode is 424
    TransactionalBatchOperationResult<ChildClass> childResult = failedBatchResponse.GetOperationResultAtIndex<ChildClass>(1);
    // childResult.StatusCode is 409
  }
}
```

## How are transactional batch operations executed

When the `ExecuteAsync` method is called, all operations in the `TransactionalBatch` object are grouped, serialized into a single payload, and sent as a single request to the Azure Cosmos DB service.

The service receives the request and executes all operations within a transactional scope, and returns a response using the same serialization protocol. This response is either a success, or a failure, and contains all the individual operation responses internally.

The SDK exposes the response for you to verify the result and, optionally, extract each of the internal operation results.

## Limitations

Currently, there are two known limits:

* Azure Cosmos DB request size limit specifies the size of the `TransactionalBatch` payload cannot exceed 2 MB, and the maximum execution time is 5 seconds.
* There is a current limit of 100 operations per `TransactionalBatch` to make sure the performance is as expected and within SLAs.

## Next steps

* Learn more about [what you can do with TransactionalBatch](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/TransactionalBatch)

* Visit our [samples](sql-api-dotnet-v3sdk-samples.md) for more ways to use our Cosmos DB .NET SDK
