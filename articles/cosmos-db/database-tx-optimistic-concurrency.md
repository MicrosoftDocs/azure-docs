---
title: Database transactions and optimistic concurrency control in Azure Cosmos DB 
description: This article describes database transactions and optimistic concurrency control in Azure Cosmos DB
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: mjbrown
ms.reviewer: sngun
---

# Database transactions and optimistic concurrency control

## Database transactions

Database transactions provide a safe and predictable programming model for dealing with concurrent changes to the data. Traditional relational databases, like SQL Server allow you to write the business logic using stored-procedures and/or triggers, send it to the server for execution directly inside the database engine. With traditional relational databases, you are required to deal with two disparate programming languages: (1) the (non-transactional) application programming language, (e.g., JavaScript, Python, C#, Java, etc.), and (2) T-SQL, the transactional programming language that is natively executed by the database.

The database engine in Cosmos DB supports full ACID compliant transactions with snapshot isolation level. All database operations within the scope of a logical partition of a container are transactionally executed inside the database engine hosted by the replica of the partition. These operations include both write and read operations reading and updating *one or more items within the logical partition*. This is illustrated in the table below.

| **Operation**  | **Operation Type** | **Single or Multi Item Transaction** |
|---------|---------|---------|
| Insert (without a pre/post trigger) | Write | Single item transaction |
| Insert (with a pre/post trigger) | Write and Read | Multi item transaction |
| Replace (without a pre/post trigger) | Write | Single item transaction |
| Replace (with a pre/post trigger) | Write and Read | Multi item transaction |
| Upsert (without a pre/post trigger) | Write | Single item transaction |
| Upsert (with a pre/post trigger) | Write and Read | Multi item transaction |
| Delete (without a pre/post trigger) | Write | Single item transaction |
| Delete (with a pre/post trigger) | Write and Read | Multi item transaction |
| Execute stored procedure | Write and Read | Multi item transaction |
| System initiated execution of a merge procedure | Write | Multi item transaction |
| System initiated execution of delete of item(s) based on expiration (TTL) of an item | Write | Multi item transaction |
| Read | Read | Single-item transaction |
| Change Feed | Read | Multi item transaction |
| Paginated Read | Read | Multi item transaction |
| Paginated Query | Read | Multi item transaction |
| Execute UDF as part of the paginated query | Read | Multi item transaction |

## Multi-item transactions in JavaScript

Cosmos DB allows you to write stored procedures, pre/post triggers, user-defined-functions (UDFs) and merge procedures in JavaScript (learn more about merge procedures in [Stored-procedures, triggers, UDFs and merge procedures and Conflict types and resolution policies](tbd.md)). Cosmos DB natively supports JavaScript execution inside its database engine. You can register stored procedures, pre/post triggers, user-defined-functions (UDFs) and merge procedures on a container and later execute them transactionally, directly inside the Cosmos DB database engine. Writing application logic in JavaScript allows for natural expression of control flow, variable scoping, assignment and integration of exception handling primitives within database transactions directly in the JavaScript language.

The JavaScript-based stored procedures, triggers, UDFs and merge procedures are wrapped within an ambient ACID transaction with snapshot isolation across all items within the logical partition. During the course of its execution, if the JavaScript program throws an exception, the entire transaction is aborted and rolled-back. The resulting programming model is simple yet powerful. JavaScript developers get a "durable" programming model while still using their familiar language constructs and library primitives.

The ability to execute JavaScript directly within the database engine enables performant and transactional execution of database operations against the items of a container. Furthermore, since Cosmos DB database engine natively supports JSON and JavaScript, there is no impedance mismatch between the type systems of an application and the database.

## Optimistic concurrency control to prevent lost updates and deletes

The previous section gave an overview of how concurrent operations within a logical partition are executed under an ACID transaction. Concurrent, conflicting operations are subjected to the regular pessimistic locking (as a part of the transaction manager) of the database engine hosted by the logical partition owning the item. When two concurrent operations attempting to update the latest version of an item within a logical partition, one of them will win and the other will fail. But what if one or two operations attempting to concurrently update the same item had previously read an older value of the item (instead of the latest value)? In such a case, the database doesn’t know if the previously read value by either or both the conflicting operations was indeed the latest value of the item. Fortunately, this situation can be detected even before letting the two operations enter the transaction boundary inside the database engine with the Optimistic Concurrency Control (OCC). OCC protects your data from accidentally overwriting changes that were made by others; it also prevents others from accidentally overwriting your own changes.

The concurrent updates of an item by multiple clients are subjected to the OCC by Cosmos DB’s communication protocol layer. Cosmos DB ensures that the client-side version of the item that you are updating (or deleting) is the same as version of the item in the Cosmos container. This guarantees that your writes are protected from being overwritten accidentally by the writes of others and vice versa. In a multi-user environment, the optimistic concurrency control protects you from accidentally deleting or updating wrong version of an item. As such, items are protected against the infamous “lost update” or “lost delete” problems.

Every item stored in a Cosmos container has a system defined `__etag` property. The value of the `__etag` is automatically generated and updated by the server every time the item is updated. `__etag` can be used with the client supplied if-match request header to allow the server to decide whether an item can be conditionally updated. The value of the if-match header matches the value of the `__etag` at the server, the item is then updated. If the value of the if-match request header is no longer current, the server rejects the operation with an "HTTP 412 Precondition failure" response message. The client then can re-fetch the item to acquire the current version of the item on the server or overrides the server version with its own `__etag` value for the item. In addition, `__etag` can be used with the if-none-match header to determine whether a re-fetch of a resource is needed. See [how to use optimistic concurrency control](tbd.md).

The item’s __etag value changes every time the item is updated. For replace item operations, if-match must be explicitly expressed as a part of the request options. You can [see sample code here](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/DocumentManagement/Program.cs#L398-L446). `__etag` values are implicitly checked for all written items touched by a stored procedure. If any conflict is detected, the stored procedure will rollback the transaction (all writes within the stored procedure are applied atomically – all or none) and will throw an exception. This is a signal to the application to re-apply updates and retry the original client request.

## Next steps

Learn more about database transactions and optimistic concurrency control in the following articles:

- [Working with Cosmos databases, containers and items](tbd.md)
- [Stored-procedures, triggers, UDFs and merge procedures](tbd.md)
- [Optimistic concurrency control](tbd.md)
- [How to register and execute stored procedures, triggers, user-defined-functions (UDFs) and merge procedures](tbd.md)
- [Consistency levels](consistency-levels.md)
- [Conflict types and resolution policies](conflict-resolution-policies.md)
