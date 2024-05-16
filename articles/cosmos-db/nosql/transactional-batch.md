---
title: Transactional batch operations in Azure Cosmos DB using the .NET, Java or Python SDK 
description: Learn how to use TransactionalBatch in the Azure Cosmos DB .NET, Java SDK or Python SDK to perform a group of point operations that either succeed or fail. 
author: stefArroyo
ms.author: esarroyo
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-python
ms.topic: conceptual
ms.date: 10/27/2020
---

# Transactional batch operations in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Transactional batch describes a group of point operations that need to either succeed or fail together with the same partition key in a container. Operations are defined, added to the batch, and the batch is executed. If all operations succeed in the order they're described within the transactional batch operation, the transaction will be committed. However, if any operation fails, the entire transaction is rolled back.

## What's a transaction in Azure Cosmos DB

A transaction in a typical database can be defined as a sequence of operations performed as a single logical unit of work. Each transaction provides ACID (Atomicity, Consistency, Isolation, Durability) property guarantees.

* **Atomicity** guarantees that all the operations done inside a transaction are treated as a single unit, and either all of them are committed or none of them are.
* **Consistency** makes sure that the data is always in a valid state across transactions.
* **Isolation** guarantees that no two transactions interfere with each other – many commercial systems provide multiple isolation levels that can be used based on the application needs.
* **Durability** ensures that any change that is committed in a database will always be present.
Azure Cosmos DB supports [full ACID compliant transactions with snapshot isolation](database-transactions-optimistic-concurrency.md) for operations within the same [logical partition key](../partitioning-overview.md).

## Transactional batch operations and stored procedures

Azure Cosmos DB currently supports stored procedures, which also provide the transactional scope on operations. However, transactional batch operations offer the following benefits:

* **Language option** – Transactional batch is supported on the SDK and language you work with already, while stored procedures need to be written in JavaScript.
* **Code versioning** – Versioning application code and onboarding it onto your CI/CD pipeline is much more natural than orchestrating the update of a stored procedure and making sure the rollover happens at the right time. It also makes rolling back changes easier.
* **Performance** – Reduced latency on equivalent operations by up to 30% when compared to the stored procedure execution.
* **Content serialization** – Each operation within a transactional batch can use custom serialization options for its payload.

## How to create a transactional batch operation

### [.NET](#tab/dotnet)

When creating a transactional batch operation, start with a container instance and call [CreateTransactionalBatch](/dotnet/api/microsoft.azure.cosmos.container.createtransactionalbatch):

```csharp
PartitionKey partitionKey = new PartitionKey("road-bikes");

TransactionalBatch batch = container.CreateTransactionalBatch(partitionKey);
```

Next, add multiple operations to the batch:

```csharp
Product bike = new (
    id: "68719520766",
    category: "road-bikes",
    name: "Chropen Road Bike"
);

batch.CreateItem<Product>(bike);

Part part = new (
    id: "68719519885",
    category: "road-bikes",
    name: "Tronosuros Tire",
    productId: bike.id
);

batch.CreateItem<Part>(part);
```

Finally, call [ExecuteAsync](/dotnet/api/microsoft.azure.cosmos.transactionalbatch.executeasync) on the batch:

```csharp
using TransactionalBatchResponse response = await batch.ExecuteAsync();
```

Once the response is received, examine if the response is successful. If the response indicates a success, extract the results:

```csharp
if (response.IsSuccessStatusCode)
{
    TransactionalBatchOperationResult<Product> productResponse;
    productResponse = response.GetOperationResultAtIndex<Product>(0);
    Product productResult = productResponse.Resource;

    TransactionalBatchOperationResult<Part> partResponse;
    partResponse = response.GetOperationResultAtIndex<Part>(1);
    Part partResult = partResponse.Resource;
}
```

> [!IMPORTANT]
> If there's a failure, the failed operation will have a status code of its corresponding error. All the other operations will have a 424 status code (failed dependency). If the operation fails because it tries to create an item that already exists, a status code of 409 (conflict) is returned. The status code enables one to identify the cause of transaction failure.

### [Java](#tab/java)

When creating a transactional batch operation, call [CosmosBatch.createCosmosBatch](/java/api/com.azure.cosmos.models.cosmosbatch.createcosmosbatch):

```java
PartitionKey partitionKey = new PartitionKey("road-bikes");

CosmosBatch batch = CosmosBatch.createCosmosBatch(partitionKey);
```

Next, add multiple operations to the batch:

```java
Product bike = new Product();
bike.setId("68719520766");
bike.setCategory("road-bikes");
bike.setName("Chropen Road Bike");

batch.createItemOperation(bike);

Part part = new Part();
part.setId("68719519885");
part.setCategory("road-bikes");
part.setName("Tronosuros Tire");
part.setProductId(bike.getId());

batch.createItemOperation(part);
```

Finally, use a container instance to call [executeCosmosBatch](/java/api/com.azure.cosmos.cosmoscontainer.executecosmosbatch) with the batch:

```java
CosmosBatchResponse response = container.executeCosmosBatch(batch);
```

Once the response is received, examine if the response is successful. If the response indicates a success, extract the results:

```java
if (response.isSuccessStatusCode())
{
    List<CosmosBatchOperationResult> results = response.getResults();
}
```

> [!IMPORTANT]
> If there's a failure, the failed operation will have a status code of its corresponding error. All the other operations will have a 424 status code (failed dependency). If the operation fails because it tries to create an item that already exists, a status code of 409 (conflict) is returned. The status code enables one to identify the cause of transaction failure.

### [Python](#tab/python)

Get or create a container instance:

```python
container = database.create_container_if_not_exists(id="batch_container",
                                                        partition_key=PartitionKey(path='/road_bikes'))
```
In Python, Transactional Batch operations look very similar to the singular operations apis, and are tuples containing (operation_type_string, args_tuple, batch_operation_kwargs_dictionary). Below are sample items that will be used to demonstrate batch operations functionality:

```python

create_demo_item = {
    "id": "68719520766",
    "category": "road-bikes",
    "name": "Chropen Road Bike"
}

# for demo, assume that this item already exists in the container. 
# the item id will be used for read operation in the batch
read_demo_item1 = {
    "id": "68719519884",
    "category": "road-bikes",
    "name": "Tronosuros Tire",
    "productId": "68719520766"
}

# for demo, assume that this item already exists in the container. 
# the item id will be used for read operation in the batch
read_demo_item2 = {
    "id": "68719519886",
    "category": "road-bikes",
    "name": "Tronosuros Tire",
    "productId": "68719520766"
}

# for demo, assume that this item already exists in the container. 
# the item id will be used for read operation in the batch
read_demo_item3 = {
    "id": "68719519887",
    "category": "road-bikes",
    "name": "Tronosuros Tire",
    "productId": "68719520766"
}

# for demo, we'll upsert the item with id 68719519885
upsert_demo_item = {
    "id": "68719519885",
    "category": "road-bikes",
    "name": "Tronosuros Tire Upserted",
    "productId": "68719520768"
}

# for replace demo, we'll replace the read_demo_item2 with this item
replace_demo_item = {
    "id": "68719519886",
    "category": "road-bikes",
    "name": "Tronosuros Tire replaced",
    "productId": "68719520769"
}

# for replace with etag match demo, we'll replace the read_demo_item3 with this item
# The use of etags and if-match/if-none-match options allows users to run conditional replace operations
# based on the etag value passed. When using if-match, the request will only succeed if the item's latest etag
# matches the passed in value. For more on optimistic concurrency control, see the link below:
# https://learn.microsoft.com/azure/cosmos-db/nosql/database-transactions-optimistic-concurrency
replace_demo_item_if_match_operation = {
    "id": "68719519887",
    "category": "road-bikes",
    "name": "Tronosuros Tireh",
    "wasReplaced": "Replaced based on etag match"
    "productId": "68719520769"
}

```

Prepare the operations to be added to the batch:

```python
create_item_operation = ("create", (create_demo_item,), {})
read_item_operation = ("read", ("68719519884",), {})
delete_item_operation = ("delete", ("68719519885",), {})
upsert_item_operation = ("upsert", (upsert_demo_item,), {})
replace_item_operation = ("replace", ("68719519886", replace_demo_item), {})
replace_item_if_match_operation = ("replace",
                                       ("68719519887", replace_demo_item_if_match_operation),
                                       {"if_match_etag": container.client_connection.last_response_headers.get("etag")})
```
Add the operations to the batch:

```python
batch_operations = [
        create_item_operation,
        read_item_operation,
        delete_item_operation,
        upsert_item_operation,
        replace_item_operation,
        replace_item_if_match_operation
    ]
```

Finally, execute the batch:

```python
try:
    # Run that list of operations
    batch_results = container.execute_item_batch(batch_operations=batch_operations, partition_key="road_bikes")
    # Batch results are returned as a list of item operation results - or raise a CosmosBatchOperationError if
    # one of the operations failed within your batch request.
    print("\nResults for the batch operations: {}\n".format(batch_results))
except exceptions.CosmosBatchOperationError as e:
        error_operation_index = e.error_index
        error_operation_response = e.operation_responses[error_operation_index]
        error_operation = batch_operations[error_operation_index]
        print("\nError operation: {}, error operation response: {}\n".format(error_operation, error_operation_response))
    # [END handle_batch_error]
```
> **Note for using patch operation and replace_if_match_etag operation in the batch** <br>
The batch operation kwargs dictionary is limited, and only takes a total of three different key values. In the case of wanting to use conditional patching within the batch, the use of filter_predicate key is available for the patch operation, or in case of wanting to use etags with any of the operations, the use of the if_match_etag/if_none_match_etag keys is available as well.<br>
>```python
> batch_operations = [
>        ("replace", (item_id, item_body), {"if_match_etag": etag}),
>        ("patch", (item_id, operations), {"filter_predicate": filter_predicate, "if_none_match_etag": etag}),
>    ]
>```


> [!IMPORTANT]
> If there's a failure, the failed operation will have a status code of its corresponding error. All the other operations will have a 424 status code (failed dependency). If the operation fails because it tries to create an item that already exists, a status code of 409 (conflict) is returned. The status code enables one to identify the cause of transaction failure.
---

## How are transactional batch operations executed

When the Transactional Batch is executed, all operations in the Transactional Batch are grouped, serialized into a single payload, and sent as a single request to the Azure Cosmos DB service.

The service receives the request and executes all operations within a transactional scope, and returns a response using the same serialization protocol. This response is either a success, or a failure, and supplies individual operation responses per operation.

The SDK exposes the response for you to verify the result and, optionally, extract each of the internal operation results.

## Limitations

Currently, there are two known limits:

* The Azure Cosmos DB request size limit constrains the size of the Transactional Batch payload to not exceed 2 MB, and the maximum execution time is 5 seconds.
* There's a current limit of 100 operations per Transactional Batch to ensure the performance is as expected and within SLAs.

## Next steps

* Learn more about [what you can do with TransactionalBatch](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/TransactionalBatch)

* Visit our [samples](samples-dotnet.md) for more ways to use our Azure Cosmos DB .NET SDK
