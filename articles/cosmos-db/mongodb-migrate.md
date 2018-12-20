---
title: 'Tutorial: Use mongoimport and mongorestore with the Azure Cosmos DB API for MongoDB | Microsoft Docs'
description: 'In this tutorial, you learn how to use mongoimport and mongorestore to import data to an API for a MongoDB account.'
keywords: mongoimport, mongorestore
services: cosmos-db
author: SnehaGunda

ms.service: cosmos-db
ms.component: cosmosdb-mongo
ms.topic: tutorial
ms.date: 05/07/2018
ms.author: sngun
ms.custom: mvc
Customer intent: As a developer, I want to migrate the data from my existing MongoDB workloads to a MongoDB API account in Azure Cosmos DB, so that the overhead to manage resources is handled by Azure Cosmos DB.
---

# Tutorial: Migrate your data to an Azure Cosmos DB API account for MongoDB

As a developer, you might have applications that use NoSQL document data. You can use a MongoDB API account in Azure Cosmos DB to store and access this document data. You can also migrate data from your existing applications to the MongoDB API. This tutorial provides instructions on how to migrate data stored in MongoDB to an Azure Cosmos DB MongoDB API account. If you import data from MongoDB and plan to use it with the Azure Cosmos DB SQL API, you should use the [Data Migration tool](import-data.md) to import the data.

In this tutorial, you will:

> [!div class="checklist"]
> * Prepare a migration plan.
> * Migrate data by using mongoimport.
> * Migrate data by using mongorestore.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

### Plan for the migration

This section describes how to plan for data migration by estimating the RU charges, latency, 

#### Pre-create and scale your collections

By default, Azure Cosmos DB provisions a new MongoDB collection with 1,000 request units per second (RU/sec). Before you migrate with mongoimport or mongorestore, pre-create all your collections from the [Azure portal](https://portal.azure.com) or from MongoDB drivers and tools. If the data size is greater than 10 GB, create a partitioned collection with an appropriate shard key.

From the [Azure portal](https://portal.azure.com), increase your collections throughput for the migration from 1,000 RUs/sec for a single partition collection and 2,500 RUs/sec for a sharded collection. With the higher throughput, you can avoid rate limiting and migrate in less time. You can reduce the throughput immediately after the migration to save costs.

In addition to provisioning RUs/sec at the collection level, you can also provision RUs/sec for a set of collections at the parent database level. At the parent level, you must pre-create the database and collections and define a shard key for each collection.

You can create sharded collections through your favorite tool, driver, or SDK. In this example, we use the Mongo Shell to create a sharded collection:

```bash
db.runCommand( { shardCollection: "admin.people", key: { region: "hashed" } } )
```

The command returns the following results:

```JSON
{
    "_t" : "ShardCollectionResponse",
    "ok" : 1,
    "collectionsharded" : "admin.people"
}
```

#### Calculate the approximate RU charge for a single document write

From the MongoDB Shell, connect to your Azure Cosmos DB MongoDB API account. You can find instructions in [Connect a MongoDB application to Azure Cosmos DB](connect-mongodb-account.md).

Next, run a sample insert command by using one of your sample documents:
   
```bash
db.coll.insert({ "playerId": "a067ff", "hashedid": "bb0091", "countryCode": "hk" })
```
        
Run the command ```db.runCommand({getLastRequestStatistics: 1})```.

You receive a response like the following output:
     
```bash
globaldb:PRIMARY> db.runCommand({getLastRequestStatistics: 1})
{
    "_t": "GetRequestStatisticsResponse",
    "ok": 1,
    "CommandName": "insert",
    "RequestCharge": 10,
    "RequestDurationInMilliSeconds": NumberLong(50)
}
```
        
Take note of the request charge.
    
#### Determine the latency from your machine to the Azure Cosmos DB cloud service
    
Enable verbose logging from the MongoDB Shell with the command ```setVerboseShell(true)```.
    
Run a basic query against the database with the command ```db.coll.find().limit(1)```.

You receive a response like the following output:

```bash
Fetched 1 record(s) in 100(ms)
```
        
Before you run the migration, remove the inserted document to ensure there are no duplicate documents. You can remove documents with the command ```db.coll.remove({})```.

#### Calculate the approximate values for the batchSize and numInsertionWorkers properties

For the *batchSize* property, divide the total provisioned RUs by the RUs consumed from your single document write, as completed in the section "Determine the latency from your machine to the Azure Cosmos DB cloud service." If the calculated value is less than or equal to 24, use that number as the property value. If the calculated value is greater than 24, set the property value to 24.
    
For the value of the *numInsertionWorkers* property, use this equation:

*`numInsertionWorkers`* `= (Provisioned RUs throughput * Latency in seconds) / (`*`batchSize`* `* Consumed RUs for a single write)`.

We can use the following values to calculate a value for the *numInsertionWorkers* property:

| Property | Value |
|--------|-----|
| *batchSize* | 24 |
| Provisioned RUs | 10,000 |
| Latency | 0.100 s |
| Consumed RUs | 10 RUs |
| *numInsertionWorkers* | (10,000 RUs x 0.100 s) / (24 x 10 RUs) = **4.1666** |

Run the **monogoimport** migration command. The command parameters are described later in this article.

```bash
mongoimport.exe --host cosmosdb-mongodb-account.documents.azure.com:10255 -u cosmosdb-mongodb-account -p <Your_MongoDB_password> --ssl --sslAllowInvalidCertificates --jsonArray --db dabasename --collection collectionName --file "C:\sample.json" --numInsertionWorkers 4 --batchSize 24
```

You can also use the **monogorestore** command. Make sure all collections have the throughput set at or above the number of RUs used in the previous calculations.
   
```bash
mongorestore.exe --host cosmosdb-mongodb-account.documents.azure.com:10255 -u cosmosdb-mongodb-account -p <Your_MongoDB_password> --ssl --sslAllowInvalidCertificates ./dumps/dump-2016-12-07 --numInsertionWorkersPerCollection 4 --batchSize 24
```

### Complete the prerequisites

After you plan for migration, complete the following steps: 

* **Before you migrate**: Make sure you have some sample MongoDB data before you start the migration. If you don't have a sample MongoDB database, you can download and install the [MongoDB community server](https://www.mongodb.com/download-center), create a sample database, and use the mongoimport.exe or mongorestore.exe to upload sample data. 

* **Increase throughput**: The duration of your data migration depends on the amount of throughput you set up for an individual collection or a set of collections. Be sure to increase the throughput for larger data migrations. After you complete the migration, decrease the throughput to save costs. 

* **Enable SSL**: Azure Cosmos DB has strict security requirements and standards. Be sure to enable SSL when you interact with your account. The procedures in this article include how to enable SSL for the mongoimport and mongorestore commands.

* **Create Azure Cosmos DB resources**: Before you start the migration, pre-create all your collections from the Azure portal. If you migrate to an Azure Cosmos DB account that has database-level throughput, make sure to provide a partition key when you create the Azure Cosmos DB collections.

* **Get your connection string**: In the [Azure portal](https://portal.azure.com), select the **Azure Cosmos DB** entry on the left. Under **Subscriptions**, select your account name. Under **Connection String**, select **Connection String**. The right side of the portal shows the information you need to connect to your account:

    ![Connection String information](./media/mongodb-migrate/ConnectionStringBlade.png)

## Use mongoimport

To import data to your Azure Cosmos DB account, use the following template.

```bash
mongoimport.exe --host <your_hostname>:10255 -u <your_username> -p <your_password> --db <your_database> --collection <your_collection> --ssl --sslAllowInvalidCertificates --type json --file "C:\sample.json"
```

Replace the \<your_hostname>, \<your_username>, and \<your_password> parameters with the specific values for your account. In the following example, we use **sampleDB** as the value for \<your_database>, and **sampleColl** as the value for \<your_collection>:

```bash
mongoimport.exe --host cosmosdb-mongodb-account.documents.azure.com:10255 -u cosmosdb-mongodb-account -p <Your_MongoDB_password> --ssl --sslAllowInvalidCertificates --db sampleDB --collection sampleColl --type json --file "C:\Users\admin\Desktop\*.json"
```

## Use mongorestore

To restore data to your Azure Cosmos DB account configured for MongoDB API, use the following template to execute the import.

Template:

```bash
mongorestore.exe --host <your_hostname>:10255 -u <your_username> -p <your_password> --db <your_database> --collection <your_collection> --ssl --sslAllowInvalidCertificates <path_to_backup>
```

Replace the \<your_hostname>, \<your_username>, and \<your_password> parameters with the specific values for your account. In the following example, we use **./dumps/dump-2016-12-07** as the value for \<path_to_backup>:

```bash
mongorestore.exe --host cosmosdb-mongodb-account.documents.azure.com:10255 -u cosmosdb-mongodb-account -p <Your_MongoDB_password> --db mydatabase --collection mycollection --ssl --sslAllowInvalidCertificates ./dumps/dump-2016-12-07
```

## Clean up resources

When it's no longer needed, you can delete the resource group, Azure Cosmos DB account, and all related resources. Use the following steps to delete the resource group:

1. Navigate to the resource group where you created the Azure Cosmos DB account.
1. Select **Delete resource group**.
1. Confirm the name of the resource group to delete, and select **Delete**.

## Next steps

Proceed to the next tutorial to learn how to query MongoDB data by using Azure Cosmos DB. 

> [!div class="nextstepaction"]
> [How to query MongoDB data](../cosmos-db/tutorial-query-mongodb.md)
