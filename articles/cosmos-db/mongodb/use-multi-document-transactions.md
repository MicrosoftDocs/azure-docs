---
title: Use multi-document transactions in Azure Cosmos DB for MongoDB
description: Learn how to create a sample Mongo shell app that can execute a multi-document transaction (all-or-nothing semantic) on a fixed collection in Azure Cosmos DB for MongoDB 4.0. 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 03/02/2021
ms.author: gahllevy
ms.devlang: javascript
ms.custom: ignite-2022
---

# Use Multi-document transactions in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

In this article, you'll create a Mongo shell app that executes a multi-document transaction on a fixed collection in Azure Cosmos DB for MongoDB with server version 4.0.

## What are multi-document transactions?

In Azure Cosmos DB for MongoDB, operations on a single document are atomic. Multi-document transactions enable applications to execute atomic operations across multiple documents. It offers "all-or-nothing" semantics to the operations. On commit, the changes made inside the transactions are persisted and if the transaction fails, all changes inside the transaction are discarded.

Multi-document transactions follow **ACID** semantics:

* Atomicity: All operations treated as one​
* Consistency: Data committed is valid​
* Isolation: Isolated from other operations​
* Durability: Transaction data is persisted when client is told so​

## Requirements

Multi-document transactions are supported within an unsharded collection in API version 4.0. Multi-document transactions are not supported across collections or in sharded collections in 4.0. The timeout for transactions is a fixed 5 seconds.

All drivers that support wire protocol version 4.0 or greater will support Azure Cosmos DB for MongoDB multi-document transactions.

## Run multi-document transactions in MongoDB shell
> [!Note]
> This example does not work in the MongoSH beta (shell) embedded in MongoDB Compass.

1. Open a command prompt, go to the directory where Mongo shell version 4.0 and higher is installed:

   ```powershell
   cd <path_to_mongo_shell_>
   ```

2. Create a mongo shell script *connect_friends.js* and add the following content

   ```javascript
   // insert data into friends collection
   db.getMongo().getDB("users").friends.insert({name:"Tom"})
   db.getMongo().getDB("users").friends.insert({name:"Mike"})
   // start transaction
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

    // commit transaction
    session.commitTransaction();

    ```

3. Run the following command to execute the multi-document transaction. The host, port, user, and key can be found in the Azure portal.

   ```powershell
   mongo "<HOST>:<PORT>" -u "<USER>" -p "KEY" --ssl connect_friends.js
   ```

## Next steps

Explore what's new in [Azure Cosmos DB for MongoDB 4.0](feature-support-40.md)
