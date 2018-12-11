---
title: Working with Azure Cosmos DB stored procedures, triggers and user-defined functions
description: This article introduces the concepts for Azure Cosmos DB stored procedures, triggers and user-defined functions
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/08/2018
ms.author: mjbrown
ms.reviewer: sngun

---

# Working with Azure Cosmos DB stored procedures, triggers and user-defined functions

Azure Cosmos DB provides language-integrated, transactional execution of JavaScript lets you write **stored procedures**, **triggers**, and **user-defined functions (UDFs)** natively in JavaScript when using the Cosmos DB SQL API. This enables you to write your logic in JavaScript that can be executed inside the database engine. You can create and execute triggers, stored procedures and UDFs using [Azure portal](https://portal.azure.com/) and the [Cosmos DB SQL API client SDKs](how-to-use-sprocs-triggers-udfs.md).

## Benefits of implementing logic via Stored Procedures, Triggers or UDFs

Writing stored procedures and user-defined functions (UDFs) in JavaScript has a number of intrinsic advantages to build rich applications:

- **Procedural Logic:** JavaScript as a high-level programming language that provides rich and familiar interface to express business logic. You can perform a complex sequence of operations on the data.

- **Atomic Transactions:** Cosmos DB guarantees that database operations performed inside a single stored procedure or trigger are atomic. This atomic functionality lets an application combine related operations in a single batch, so that either all of them succeed or none of them succeed.

- **Performance:** The fact that JSON is intrinsically mapped to the JavaScript language type system allows for a number of optimizations like lazy materialization of JSON documents in the buffer pool and making them available on-demand to the executing code. There are other performance benefits associated with shipping business logic to the database, which include:

    - *Batching:* You can group operations like inserts and submit them in bulk. The network traffic latency costs and the store overhead to create separate transactions are reduced significantly.

    - *Pre-compilation:* Stored procedures, triggers, and UDFs are implicitly pre-compiled to the byte code format in order to avoid compilation cost at the time of each script invocation. Pre-compilation ensures invocation of stored procedures is fast and have a low footprint.

    - *Sequencing:* Sometimes operations need a triggering mechanism that may perform one or additional updates to the data. Aside from atomicity, this is also a lot more performant when executing on the server side.

- **Encapsulation:** Stored procedures can be used to group logic in one place, which has these advantages. First, it adds an abstraction layer on top of the data, which enables you to evolve your applications independently from the data. This layer of abstraction is advantageous when the data is schema-less and frees you from adding additional logic directly into your application. This abstraction lets your keep their data secure by streamlining the access from the scripts.

> [!TIP]
> Stored procedures are best suited for operations that are write heavy. When deciding where to use stored procedures, Optimize around encapsulating the maximum amount of writes possible. Generally speaking, stored procedures are not the most efficient means for doing large numbers of read operations so using stored procedures to batch large numbers of reads to return to the client will not yield the desired benefit.

## Transactions

Transaction in a typical database can be defined as a sequence of operations performed as a single logical unit of work. Each transaction provides **ACID guarantees**. ACID is a well-known acronym that stands for: **A**tomicity, **C**onsistency, **I**solation and **D**urability. Atomicity guarantees that all the work done inside a transaction is treated as a single unit, where either all of it is committed or none of it is. Consistency makes sure that the data is always in a valid state across transactions. Isolation guarantees that no two transactions interfere with each other – many commercial systems provide multiple isolation levels that can be used based on the application needs. Durability ensures that any change that is committed in a database will always be present.

In Cosmos DB, JavaScript runtime is hosted inside the database engine. Hence, requests made within stored procedures and triggers execute in the same scope as the database session. This feature enables Cosmos DB to guarantee ACID for all operations that are part of a stored procedure or trigger. For examples, see [How to implement transactions](how-to-write-sprocs-triggers-udfs.md#transactions).

### Scope of a transaction

If a stored procedure is associated with a Cosmos container, then the stored procedure is executed in the transaction scope of a logical partition key. Each stored procedure execution must include a logical partition key value corresponding to the scope the transaction must run under. For more information, see [Azure Cosmos DB Partitioning](partition-data.md).

### Commit and rollback

Transactions are deeply and natively integrated into the Cosmos DB JavaScript programming model. Inside a JavaScript function, all operations are automatically wrapped under a single transaction. If the JavaScript logic in a stored procedure completes without any exceptions, all the operations within the transaction are committed to the database. Statements like `BEGIN TRANSACTION` and `COMMIT TRANSACTION` (familiar to relational databases) are implicit in Cosmos DB. If there are any exceptions from the script, the Cosmos DB JavaScript runtime will roll back the entire transaction. As such, throwing an exception is effectively equivalent to a `ROLLBACK TRANSACTION` in Cosmos DB.

### Data consistency

Stored procedures and triggers are always executed on the primary replica of a Cosmos container. This ensures that reads from stored procedures offer [strong consistency](consistency-levels-tradeoffs.md). Queries using user-defined functions can be executed on the primary or any secondary replica. Stored procedures and triggers are intended to support transactional writes – meanwhile read-only logic is best implemented as application-side logic and queries using the [Cosmos DB SQL API SDKs](sql-api-dotnet-samples), which will help you saturate database throughput. See [Consistency Levels in Cosmos DB](consistency-levels.md).

## Bounded execution

All Cosmos operations must complete within the server specified request timeout duration. This constraint applies to JavaScript functions (i.e., stored procedures, triggers, and user-defined functions). If an operation does not complete within that time limit, the transaction is rolled back.

You can either ensure that your JavaScript functions finish within the time limit or implement a continuation-based model to batch/resume execution. In order to simplify development of stored procedures and triggers to handle time limits, all functions under the Cosmos container (e.g., create, read, update and delete of Cosmos DB items) return a Boolean value that represents whether that operation will complete. If this value is false, it is an indication that the procedure must wrap up execution because the script is running up against time and/or RU boundaries. Operations queued prior to the first unaccepted store operation are guaranteed to complete if the stored procedure completes in time and does not queue any more requests. Thus, operations should be queued one at a time by using JavaScript’s callback convention to manage the script’s control flow. Because scripts are executed in a server-side environment, they are strictly governed. Scripts that repeatedly violate execution boundaries may be marked inactive and unable to execute – and will need to be recreated and fixed to honor execution boundaries.

JavaScript functions are also subject to [provisioned throughput capacity](request-units.md) (i.e., RU/sec). JavaScript functions could potentially use up a large number of RUs within a short time and might get rate-limited, if the provisioned throughput capacity limit is reached. It is important to note that scripts consume additional RUs in addition to the RUs spent executing database operations, although these database operations are slightly less expensive than executing the same operations from the client. See [Request Units](request-units.md) and [Provision throughput on Cosmos containers and databases](set-throughput.md) and [How to implement bounded execution for stored procedures](how-to-write-sprocs-triggers-udfs.md#bounded-execution).

## Triggers

### Pre-triggers

Cosmos DB provides triggers that can be triggered by an operation on a Cosmos DB item. For example, you can specify a pre-trigger when you are creating an item. In this case, the pre-trigger will run before the item is created. Pre-triggers cannot have any input parameters. The request object can be used to update the document body from original request, if needed. When triggers are registered, users can specify the operations that it can run with. If a trigger was created with `TriggerOperation.Create`, this means using the trigger in a replace operation will not be permitted. For examples, see [How to write triggers](how-to-write-sprocs-triggers-udfs.md#triggers).

### Post-triggers

Post-triggers, like pre-triggers, are associated with an operation on a Cosmos DB item and don’t take any input parameters. They run *after* the operation has completed and have access to the response message that is sent to the client. For examples, see [How to write triggers](how-to-write-sprocs-triggers-udfs.md#triggers).

## <a id="udfs">User-defined functions</a>

User-defined functions (UDFs) are used to extend the SQL API query language grammar and implement custom business logic easily. They can only be called from inside queries. UDFs do not have access to the context object and are meant to be used as compute only JavaScript. Therefore, UDFs can be run on secondary replicas in Cosmos DB. For examples, see [How to write user-defined functions](how-to-write-sprocs-triggers-udfs.md#udfs).

## <a id="jsqueryapi">JavaScript language integrated query API</a>

In addition to issuing queries using SQL API query grammar, the [server-side SDK](https://azure.github.io/azure-cosmosdb-js-server) allows you to perform queries using a JavaScript interface without any knowledge of SQL. The JavaScript query API allows you to programmatically build queries by passing predicate functions into chainable function calls. Queries are parsed by the JavaScript runtime and are executed efficiently inside Cosmos DB. To learn about JavaScript Query API support in Cosmos DB, see [Working with JavaScript language integrated query API](js-query-api.md). For examples, see [How to write stored procedures and triggers using Javascript Query API](how-to-write-js-query-api.md#)

## Next steps

Learn more concepts and how-to write and use stored procedures, triggers and user-defined functions in Azure Cosmos DB:

- [How to write stored procedures, triggers and user-defined functions](how-to-write-sprocs-triggers-udfs.md)
- [How to use stored procedures, triggers, user-defined functions](how-to-use-sprocs-triggers-udfs.md)
- [Working with JavaScript language integrated query API](js-query-api.md)
