---
title: Work with stored procedures, triggers, and UDFs in Azure Cosmos DB 
description: This article introduces the concepts such as stored procedures, triggers, and user-defined functions in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, devx-track-js
ms.topic: conceptual
ms.date: 08/26/2021
ms.author: sidandrews
ms.reviewer: jucocchi
---

# Stored procedures, triggers, and user-defined functions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB provides language-integrated, transactional execution of JavaScript. When using the API for NoSQL in Azure Cosmos DB, you can write **stored procedures**, **triggers**, and **user-defined functions (UDFs)** in the JavaScript language. You can write your logic in JavaScript that executed inside the database engine. You can create and execute triggers, stored procedures, and UDFs by using [Azure portal](https://portal.azure.com/), the [JavaScript language integrated query API in Azure Cosmos DB](javascript-query-api.md) or the [Azure Cosmos DB for NoSQL client SDKs](how-to-use-stored-procedures-triggers-udfs.md).

## Benefits of using server-side programming

Writing stored procedures, triggers, and user-defined functions (UDFs) in JavaScript allows you to build rich applications and they have the following advantages:

* **Procedural logic:** JavaScript as a high-level programming language that provides rich and familiar interface to express business logic. You can perform a sequence of complex operations on the data.

* **Atomic transactions:** Azure Cosmos DB database operations that are performed within a single stored procedure or a trigger are atomic. This atomic functionality lets an application combine related operations into a single batch, so that either all of the operations succeed or none of them succeed.

* **Performance:** The JSON data is intrinsically mapped to the JavaScript language type system. This mapping allows for a number of optimizations like lazy materialization of JSON documents in the buffer pool and making them available on-demand to the executing code. There are other performance benefits associated with shifting business logic to the database, which includes:

   * *Batching:* You can group operations like inserts and submit them in bulk. The network traffic latency costs and the store overhead to create separate transactions are reduced significantly.

   * *Pre-compilation:* Stored procedures, triggers, and UDFs are implicitly pre-compiled to the byte code format in order to avoid compilation cost at the time of each script invocation. Due to pre-compilation, the invocation of stored procedures is fast and has a low footprint.

   * *Sequencing:* Sometimes operations need a triggering mechanism that may perform one or additional updates to the data. In addition to Atomicity, there are also performance benefits when executing on the server side.

* **Encapsulation:** Stored procedures can be used to group logic in one place. Encapsulation adds an abstraction layer on top of the data, which enables you to evolve your applications independently from the data. This layer of abstraction is helpful when the data is schema-less and you don't have to manage adding additional logic directly into your application. The abstraction lets your keep the data secure by streamlining the access from the scripts.

> [!TIP]
> Stored procedures are best suited for operations that are write-heavy and require a transaction across a partition key value. When deciding whether to use stored procedures, optimize around encapsulating the maximum amount of writes possible. Generally speaking, stored procedures are not the most efficient means for doing large numbers of read or query operations, so using stored procedures to batch large numbers of reads to return to the client will not yield the desired benefit. For best performance, these read-heavy operations should be done on the client-side, using the Azure Cosmos DB SDK. 

> [!NOTE]
> Server-side JavaScript features including stored procedures, triggers, and user-defined functions do not support importing modules.

## Transactions

Transaction in a typical database can be defined as a sequence of operations performed as a single logical unit of work. Each transaction provides **ACID property guarantees**. ACID is a well-known acronym that stands for: **A**tomicity, **C**onsistency, **I**solation, and **D**urability. 

* Atomicity guarantees that all the operations done inside a transaction are treated as a single unit, and either all of them are committed or none of them are. 

* Consistency makes sure that the data is always in a valid state across transactions. 

* Isolation guarantees that no two transactions interfere with each other – many commercial systems provide multiple isolation levels that can be used based on the application needs. 

* Durability ensures that any change that is committed in a database will always be present.

In Azure Cosmos DB, JavaScript runtime is hosted inside the database engine. Hence, requests made within the stored procedures and the triggers execute in the same scope as the database session. This feature enables Azure Cosmos DB to guarantee ACID properties for all operations that are part of a stored procedure or a trigger. For examples, see [how to implement transactions](how-to-write-stored-procedures-triggers-udfs.md#transactions) article.

> [!TIP]
> For transaction support in Azure Cosmos DB for NoSQL, you can also implement a transactional batch using your preferred client SDK. For more information, see [Transactional batch operations in Azure Cosmos DB for NoSQL](transactional-batch.md).

### Scope of a transaction

Stored procedures are associated with an Azure Cosmos DB container and stored procedure execution is scoped to a logical partition key. Stored procedures must include a logical partition key value during execution that defines the logical partition for the scope of the transaction. For more information, see [Azure Cosmos DB partitioning](../partitioning-overview.md) article.

### Commit and rollback

Transactions are natively integrated into the Azure Cosmos DB JavaScript programming model. Within a JavaScript function, all the operations are automatically wrapped under a single transaction. If the JavaScript logic in a stored procedure completes without any exceptions, all the operations within the transaction are committed to the database. Statements like `BEGIN TRANSACTION` and `COMMIT TRANSACTION` (familiar to relational databases) are implicit in Azure Cosmos DB. If there are any exceptions from the script, the Azure Cosmos DB JavaScript runtime will roll back the entire transaction. As such, throwing an exception is effectively equivalent to a `ROLLBACK TRANSACTION` in Azure Cosmos DB.

### Data consistency

Stored procedures and triggers are always executed on the primary replica of an Azure Cosmos DB container. This feature ensures that reads from stored procedures offer [strong consistency](../consistency-levels.md). Queries using user-defined functions can be executed on the primary or any secondary replica. Stored procedures and triggers are intended to support transactional writes – meanwhile read-only logic is best implemented as application-side logic and queries using the [Azure Cosmos DB for NoSQL SDKs](samples-dotnet.md), will help you saturate the database throughput. 

> [!TIP]
> The queries executed within a stored procedure or trigger may not see changes to items made by the same script transaction. This statement applies both to SQL queries, such as `getContent().getCollection.queryDocuments()`, as well as integrated language queries, such as `getContext().getCollection().filter()`.

## Bounded execution

All Azure Cosmos DB operations must complete within the specified timeout duration. Stored procedures have a timeout limit of 5 seconds. This constraint applies to JavaScript functions - stored procedures, triggers, and user-defined functions. If an operation does not complete within that time limit, the transaction is rolled back.

You can either ensure that your JavaScript functions finish within the time limit or implement a continuation-based model to batch/resume execution. In order to simplify development of stored procedures and triggers to handle time limits, all functions under the Azure Cosmos DB container (for example, create, read, update, and delete of items) return a boolean value that represents whether that operation will complete. If this value is false, it is an indication that the procedure must wrap up execution because the script is consuming more time or provisioned throughput than the configured value. Operations queued prior to the first unaccepted store operation are guaranteed to complete if the stored procedure completes in time and does not queue any more requests. Thus, operations should be queued one at a time by using JavaScript's callback convention to manage the script's control flow. Because scripts are executed in a server-side environment, they are strictly governed. Scripts that repeatedly violate execution boundaries may be marked inactive and can't be executed, and they should be recreated to honor the execution boundaries.

JavaScript functions are also subject to [provisioned throughput capacity](../request-units.md). JavaScript functions could potentially end up using a large number of request units within a short time and may be rate-limited if the provisioned throughput capacity limit is reached. It is important to note that scripts consume additional throughput in addition to the throughput spent executing database operations, although these database operations are slightly less expensive than executing the same operations from the client.

## Triggers

Azure Cosmos DB supports two types of triggers:

### Pre-triggers

Azure Cosmos DB provides triggers that can be invoked by performing an operation on an Azure Cosmos DB item. For example, you can specify a pre-trigger when you are creating an item. In this case, the pre-trigger will run before the item is created. Pre-triggers cannot have any input parameters. If necessary, the request object can be used to update the document body from original request. When triggers are registered, users can specify the operations that it can run with. If a trigger was created with `TriggerOperation.Create`, this means using the trigger in a replace operation will not be permitted. For examples, see [How to write triggers](how-to-write-stored-procedures-triggers-udfs.md#triggers) article.

### Post-triggers

Similar to pre-triggers, post-triggers, are also associated with an operation on an Azure Cosmos DB item and they don't require any input parameters. They run *after* the operation has completed and have access to the response message that is sent to the client. For examples, see [How to write triggers](how-to-write-stored-procedures-triggers-udfs.md#triggers) article.

> [!NOTE]
> Registered triggers don't run automatically when their corresponding operations (create / delete / replace / update) happen. They have to be explicitly called when executing these operations. To learn more, see [how to run triggers](how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) article.

## <a id="udfs"></a>User-defined functions

User-defined functions (UDFs) are used to extend the API for NoSQL query language syntax and implement custom business logic easily. They can be called only within queries. UDFs do not have access to the context object and are meant to be used as compute only JavaScript. Therefore, UDFs can be run on secondary replicas.

## <a id="jsqueryapi"></a>JavaScript language-integrated query API

In addition to issuing queries using API for NoSQL query syntax, the [server-side SDK](https://azure.github.io/azure-cosmosdb-js-server) allows you to perform queries by using a JavaScript interface without any knowledge of SQL. The JavaScript query API allows you to programmatically build queries by passing predicate functions into sequence of function calls. Queries are parsed by the JavaScript runtime and are executed efficiently within Azure Cosmos DB. To learn about JavaScript query API support, see [Working with JavaScript language integrated query API](javascript-query-api.md) article. For examples, see [How to write stored procedures and triggers using JavaScript Query API](how-to-write-javascript-query-api.md) article.

## Next steps

Learn how to write and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB with the following articles:

* [How to write stored procedures, triggers, and user-defined functions](how-to-write-stored-procedures-triggers-udfs.md)

* [How to use stored procedures, triggers, and user-defined functions](how-to-use-stored-procedures-triggers-udfs.md)

* [Working with JavaScript language integrated query API](javascript-query-api.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
