---
title: Group multiple operations in transactions
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Support atomicity, consistency, isolation, and durability with transactions in Azure Cosmos DB for MongoDB vCore.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 08/28/2023
# CustomerIntent: As a developer, I want to use transactions so that I can group multiple operations together.
---

# Group multiple operations in transactions in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

It's common to want to group multiple operations into a single transaction to either commit or rollback together. In database principles, transactions typically implement four key **ACID** principles. ACID stands for:

- **Atomicity**: Transactions complete entirely or not at all.
- **Consistency**: Databases transition from one consistent state to another.
- **Isolation**: Individual transactions are shielded from simultaneous ones.
- **Durability**: Finished transactions are permanent, ensuring data remains consistent, even during system failures.

The ACID principles in database management ensure transactions are processed reliably. Azure Cosmos DB for MongoDB vCore implements these principles, enabling you to create transactions for multiple operations.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).

## Create a transaction

Create a new transaction using the appropriate methods from the developer language of your choice. These methods typically include some wrapping mechanism to group multiple transactions together, and a method to commit the transaction.

### [JavaScript](#tab/javascript)

> [!NOTE]
> The samples in this section assume you have a collection variable named `collection`.

1. Use `startSession()` to create a client session for the transaction operation.

    ```javascript
    const transactionSession = client.startSession();
    ```

1. Create a transaction using `withTransaction()` and place all relevant transaction operations within the callback.

    ```javascript
    await transactionSession.withTransaction(async () => {
        await collection.insertOne({ name: "Coolarn shirt", price: 38.00 }, transactionSession);
        await collection.insertOne({ name: "Coolarn shirt button", price: 1.50 }, transactionSession);
    });
    ```

1. Commit the transaction using `commitTransaction()`.

    ```javascript
    transactionSession.commitTransaction();
    ```

1. Use `endSession()` to end the transaction session.

    ```javascript
    transactionSession.endSession();
    ```

### [Java](#tab/java)

> [!NOTE]
> The samples in this section assume you have a collection variable named `databaseCollection`.

1. Use `startSession()` to create a client session for the transaction operation within a `try` block.

    ```java
    try (ClientSession session = client.startSession()) {
    }
    ```

1. Create a transaction using `startTransaction()`.

    ```java
    session.startTransaction();
    ```

1. Include all relevant transaction operations.

    ```java
    collection.insertOne(session, new Document().append("name", "Coolarn shirt").append("price", 38.00));
    collection.insertOne(session, new Document().append("name", "Coolarn shirt button").append("price", 1.50));
    ```

1. Commit the transaction using `commitTransaction()`.

    ```java
    clientSession.commitTransaction();
    ```

### [Python](#tab/python)

> [!NOTE]
> The samples in this section assume you have a collection variable named `coll`.

1. Use `start_session()` to create a client session for the transaction operation.

    ```python
    with client.start_session() as ts:
    ```

1. Within the session block, create a transaction using `start_transaction()`.

    ```python
    ts.start_transaction()
    ```

1. Include all relevant transaction operations.

    ```python
    coll.insert_one({ 'name': 'Coolarn shirt', 'price': 38.00 }, session=ts)
    coll.insert_one({ 'name': 'Coolarn shirt button', 'price': 1.50 }, session=ts)
    ```

1. Commit the transaction using `commit_transaction()`.

    ```python
    ts.commit_transaction()
    ```

---

## Roll back a transaction

Occasionally, you may be required to undo a transaction before it's committed.

### [JavaScript](#tab/javascript)

1. Using an existing transaction session, abort the transaction with `abortTransaction()`.

    ```javascript
    transactionSession.abortTransaction();
    ```

1. End the transaction session.

    ```javascript
    transactionSession.endSession();
    ```

### [Java](#tab/java)

1. Using an existing transaction session, abort the transaction with `()`.

    ```java
    clientSession.abortTransaction();
    ```

### [Python](#tab/python)

1. Using an existing transaction session, abort the transaction with `abort_transaction()`.

    ```javascript
    ts.abort_transaction()
    ```

---

## Next step

> [!div class="nextstepaction"]
> [Build a Node.js web application](tutorial-nodejs-web-app.md)
