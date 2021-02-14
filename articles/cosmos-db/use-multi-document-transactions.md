---
title: 'Use Multi-Document Transactions'
description: Create a sample mongo shell app that can execute a multi-document transaction on a fixed collection in Azure Cosmos DB API for MongoDB 4.0
author: gahl-levy
ms.service: cosmos-db
ms.subservice: 
ms.topic: how-to
ms.date: 02/12/2021
ms.author: gahllevy

---

# Use Multi-Document Transactions

In this quick start, you'll create a sample mongo shell app that can execute a multi-document transaction on a fixed collection in Azure Cosmos DB API for MongoDB 4.0.

## What are Multi-Document Transactions?

In Azure Cosmos DB API for MongoDB, operations on a single document are atomic. Multi-document transactions enable applications to execute atomic operations across multiple documents. It offers "all-or-nothing" semantics to the operations. On commit, the changes made inside the transactions are persisted and if the transaction fails, all changes inside the transaction are discarded.

Multi-document transactions follow **ACID** semantics:

* Atomicity: All operations treated as one​
* Consistency: Data committed is valid​
* Isolation: Isolated from other operations​
* Durability: Transaction data is persisted when client is told so​

## Requirements

Multi-document transactions are supported within a unsharded collection in 4.0. Multi-document transactions are not supported across collections or in sharded collections.

All drivers that support wire protocol version 4.0 or greater will support Azure Cosmos DB API for MongoDB multi-document transactions.

## Multi-Document Transactions in Mongo Shell

1. Open a command prompt, go to directory of mongo shell (version 4.0+)

    ```powershell
    cd <path_to_mongo_shell_>
    ```

2. Create a mongo shell script connect_friends.js and add the following content

    ```javascript
    // insert data into friends collection
    db.getMongo().getDB("users").friends.insert({name:"Tom"})
    db.getMongo().getDB("users").friends.insert({name:"Mike"})

    // start a transaction
    var session = db.getMongo().startSession();
    var friendsCollection = session.getDatabase("users").friends;
    session.startTransaction();

    // operations in transaction
    try {
        friendsCollection.updateOne({ name: "Tom" }, { $set: { friendOf: "Mike" } } );
        friendsCollection.updateOne({ name: "Mike" }, { $set: { friendOf: "Tom" } } );
    } catch (error) {
        // abort transaction on error
        session.abortTransaction();
        throw error;
    }

    // commit transaction.
    session.commitTransaction();

    ```

3. Run the following command to execute the multi-document transaction. This command creates a friend link between the two friends

    ```powershell
    mongo "<HOST>:<PORT>" -u "<USER>" -p "KEY" --ssl connect_friends.js
    ```

## Next steps

Explore what's new in [Azure Cosmos DB API for MongoDB 4.0](mongodb-feature-support-40.md)
