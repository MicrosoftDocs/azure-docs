---
title: 'Use Multi-Document Transactions'
description: 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: 
ms.topic: how-to
ms.date: 01/22/2019
ms.author: gahllevy

---
# Use Multi-Document Transactions

In this quickstart, you can create a a sample mongo shell app that can execute a request with transaction on a fixed collection in Cosmos DB Mongo API. Azure Cosmos DB is a multi-model database service that lets you quickly create and query collections with global distribution and horizontal scale capabilities.

## What are multi-document transactions?

In Cosmos DB mongo API, the operations on single document is atomic. Multi document transaction enables applications to execute atomic operations across multiple documents. It offers "all-or-nothing" semantics to the operations. On commit, the changes made inside the transaction is persisted and if the transaction fails, all changes inside the transaction are discarded.

## Requirements

Multi-document transaction is supported only for fixed collection. Shard collections does not support multi-document transaction.

For transactions, clients are required to use following driver version:

    Java 3.8.0          Python 3.7.0         C 1.11.0
    C# 2.7              Node 3.1.0           Ruby 2.6.0
    Perl 2.0.0          PHP (PHPC) 1.5.0     Scala 2.4.0
    Mongo shell 4.0

## Sample

Let's add a mongo shell example below

1. Open a command prompt, go to directory of mongo shell (version 4.0+)

    ```bash
    cd <path_to_mongo_shell_>
    ```

2. Create a mongo shell script connect_friends.js and add the following content. 

    ```bash

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

3. Run the following command to execute the transaction. This command create friend link between the two friends.

    ```bash
    mongo "<HOST>:<PORT>" -u "<USER>" -p "KEY" --ssl connect_friends.js
    ```


## Next steps

In this guide, you learned how to create a simple application and execute request in transaction with Cosmos DB Mongo API. You can now build more complex transactional workload using Cosmos DB Mongo API. 

