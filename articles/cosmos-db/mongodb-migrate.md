---
title: 'Migrate your MongoDB data to Azure Cosmos DB using mongoimport and mongorestore'
description: 'You will learn how to use mongoimport and mongorestore to import data to Cosmos DB.'
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: tutorial
ms.date: 12/26/2018
author: sivethe
ms.author: sivethe
Customer intent: As a developer, I want to migrate the data from my existing MongoDB to Cosmos DB.
---

# Migrate your MongoDB data to Azure Cosmos DB

 This tutorial provides instructions on how to migrate data stored in MongoDB to Azure Cosmos DB configured to use Cosmos DB's API for MongoDB. If you import data from MongoDB and plan to use it with the Azure Cosmos DB SQL API, you should use the [Data Migration tool](import-data.md) to import the data.

In this tutorial, you will:

> [!div class="checklist"]
> * Prepare a migration plan.
> * Migrate data by using mongoimport.
> * Migrate data by using mongorestore.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

Review and complete the following prerequisites before you start the migration.

### Plan for the migration

This section describes how to plan for the data migration. We'll estimate the RU charges, determine the latency from your machine to the cloud service, and calculate the batch size and number of insertion workers.


#### Pre-create and scale your collections

Before you migrate with mongoimport or mongorestore, pre-create all your collections from the [Azure portal](https://portal.azure.com) or from MongoDB drivers and tools. 

From the [Azure portal](https://portal.azure.com), increase your collections throughput for the migration. With a higher throughput, you can avoid being rate limited and migrate in less time. You can reduce the throughput immediately after the migration to save costs.

In addition to provisioning throughput at a collection level, you can also provision throughput at the database level for a set of collections to share the provisioned throughput. You need to pre-create the database and collections and define a shard key for each collection in the shared throughput database.

You can create sharded collections using your preferred tool, driver, or SDK. In this example, we use the Mongo Shell to create a sharded collection:

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

From the MongoDB Shell, connect to your Cosmos account configured to use Cosmos DB's API for MongoDB. You can find instructions in [Connect a MongoDB application to Cosmos DB](connect-mongodb-account.md).

Next, run a sample insert command by using one of your sample documents:
   
```bash
db.coll.insert({ "playerId": "a067ff", "hashedid": "bb0091", "countryCode": "hk" })
```
        
Run the command `db.runCommand({getLastRequestStatistics: 1})`.

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
    
#### Determine the latency from your machine to Cosmos DB
    
Enable verbose logging from the MongoDB Shell with the command `setVerboseShell(true)`.
    
Run a basic query against the database with the command `db.coll.find().limit(1)`.

You receive a response like the following output:

```bash
Fetched 1 record(s) in 100(ms)
```
        
Before you run the migration, remove the inserted document to ensure there are no duplicate documents. You can remove documents with the command `db.coll.remove({})`.

#### Calculate the approximate values for the batchSize and numInsertionWorkers properties

For the **batchSize** property, divide the total provisioned throughput (RUs/sec) by the RUs consumed for a single document write, as completed in the section "Determine the latency from your machine to Cosmos DB." If the calculated value is less than or equal to 24, use that number as the property value. If the calculated value is greater than 24, set the property value to 24.
    
For the value of the **numInsertionWorkers** property, use this equation:

`numInsertionWorkers = (Provisioned RUs throughput * Latency in seconds) / (batchSize * Consumed RUs for a single write)`

We can use the following values to calculate a value for the **numInsertionWorkers** property:

| Property | Value |
|--------|-----|
| **batchSize** | 24 |
| Provisioned RUs | 10,000 |
| Latency | 0.100 s |
| Consumed RUs | 10 RUs |
| **numInsertionWorkers** | (10,000 RUs x 0.100 s) / (24 x 10 RUs) = **4.1666** |

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

* **Get sample data**: Make sure you have some sample data before you start the migration. 

* **Increase throughput**: The duration of your data migration depends on the amount of throughput you provision for an individual collection or database. Be sure to increase the throughput for larger data migrations. After you complete the migration, decrease the throughput to save costs. 

* **Enable SSL**:  Cosmos DB has strict security requirements and standards. Be sure to enable SSL when you interact with your Cosmos account. The procedures in this article include how to enable SSL for the mongoimport and mongorestore commands.

* **Create Cosmos DB resources**: Before you start the migration, pre-create all your collections from the Azure portal. If you migrate to a Cosmos account that has database-level provisioned throughput, make sure to provide a partition key when you create the collections.

* **Get your connection string**: In the [Azure portal](https://portal.azure.com), select the **Azure Cosmos DB** entry on the left. Under **Subscriptions**, select your account name. Under **Connection String**, select **Connection String**. The right side of the portal shows the information you need to connect to your account:

    ![Connection String information](./media/mongodb-migrate/ConnectionStringBlade.png)

## Use mongoimport

To import data into your Cosmos account, use the following template.

```bash
mongoimport.exe --host <your_hostname>:10255 -u <your_username> -p <your_password> --db <your_database> --collection <your_collection> --ssl --sslAllowInvalidCertificates --type json --file "C:\sample.json"
```

Replace the \<your_hostname>, \<your_username>, and \<your_password> parameters with the specific values for your account. In the following example, we use **sampleDB** as the value for \<your_database>, and **sampleColl** as the value for \<your_collection>:

```bash
mongoimport.exe --host cosmosdb-mongodb-account.documents.azure.com:10255 -u cosmosdb-mongodb-account -p <Your_MongoDB_password> --ssl --sslAllowInvalidCertificates --db sampleDB --collection sampleColl --type json --file "C:\Users\admin\Desktop\*.json"
```

## Use mongorestore

To restore data to your Cosmos account configured with Cosmos DB's API for MongoDB, use the following template to execute the import.

```bash
mongorestore.exe --host <your_hostname>:10255 -u <your_username> -p <your_password> --db <your_database> --collection <your_collection> --ssl --sslAllowInvalidCertificates <path_to_backup>
```

Replace the \<your_hostname>, \<your_username>, and \<your_password> parameters with the specific values for your account. In the following example, we use **./dumps/dump-2016-12-07** as the value for \<path_to_backup>:

```bash
mongorestore.exe --host cosmosdb-mongodb-account.documents.azure.com:10255 -u cosmosdb-mongodb-account -p <Your_MongoDB_password> --db mydatabase --collection mycollection --ssl --sslAllowInvalidCertificates ./dumps/dump-2016-12-07
```

## Clean up resources

When you no longer need the resources, you can delete the resource group, Cosmos account, and all the related resources. Use the following steps to delete the resource group:

1. Go to the resource group where you created the Cosmos account.
1. Select **Delete resource group**.
1. Confirm the name of the resource group to delete, and select **Delete**.

## Next steps

Continue to the next tutorial to learn how to query data using Azure Cosmos DB's API for MongoDB. 

> [!div class="nextstepaction"]
> [How to query MongoDB data](../cosmos-db/tutorial-query-mongodb.md)
