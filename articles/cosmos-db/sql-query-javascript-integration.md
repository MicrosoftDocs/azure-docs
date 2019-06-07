---
title: SQL query JavaScript integration
description: Learn about Azure Cosmos DB Javascript integration
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: tisande

---
## <a id="JavaScriptIntegration"></a>JavaScript integration

Azure Cosmos DB provides a programming model for executing JavaScript-based application logic directly on containers, using stored procedures and triggers. This model supports:

* High-performance transactional CRUD operations and queries against items in a container, by virtue of the deep integration of the JavaScript runtime within the database engine.
* A natural modeling of control flow, variable scoping, and assignment and integration of exception-handling primitives with database transactions. 

For more information about Azure Cosmos DB JavaScript integration, see the [JavaScript server-side API](sql-query-execution.md#JavaScriptServerSideApi) section.

### Operator evaluation

Cosmos DB, by virtue of being a JSON database, draws parallels with JavaScript operators and evaluation semantics. Cosmos DB tries to preserve JavaScript semantics in terms of JSON support, but the operation evaluation deviates in some instances.

In the SQL API, unlike in traditional SQL, the types of values are often not known until the API retrieves the values from the database. In order to efficiently execute queries, most of the operators have strict type requirements.

Unlike JavaScript, the SQL API doesn't perform implicit conversions. For instance, a query like `SELECT * FROM Person p WHERE p.Age = 21` matches items that contain an `Age` property whose value is `21`. It doesn't match any other item whose `Age` property matches possibly infinite variations like `twenty-one`, `021`, or `21.0`. This contrasts with JavaScript, where string values are implicitly cast to numbers based on operator, for example: `==`. This SQL API behavior is crucial for efficient index matching.

## Next steps

- [SQL query examples](how-to-sql-query.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Model document data](modeling-data.md)
