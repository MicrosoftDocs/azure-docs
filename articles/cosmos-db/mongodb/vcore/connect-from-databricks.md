---
title: Working with Azure Cosmos DB for MongoDB vCore from Azure Databricks
description: This article is the main page for Azure Cosmos DB for MongoDB vCore integration from Azure Databricks.
author: Gary Lee, Kruti Mehta
ms.author: yongl
ms.reviewer: krutim
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 03/08/2024
---

# Connect to Azure Cosmos DB for MongoDB vCore from Azure Databricks
[!INCLUDE[MongoDB vCore](../includes/appliesto-mongodb-vcore.md)]

This article is one among a series of articles on Azure Cosmos DB for MongoDB vCore integration from Azure Databricks. The articles cover connectivity, Data Definition Language(DDL) operations, basic Data Manipulation Language(DML) operations, and advanced Azure Cosmos DB for MongoDB vCore integration from Spark. 

## Prerequisites
* [Provision an Azure Cosmos DB for MongoDB vCore cluster.](quickstart-portal.md)

* Provision your choice of Spark environment [Azure Databricks](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal).

## Dependencies for connectivity
* **Spark connector for MongoDV vCore:**
  Spark connector is used to connect to Azure Cosmos DB for MongoDB Atlas.  Identify and use the version of the connector located in [Maven central](hhttps://mvnrepository.com/artifact/org.mongodb.spark/mongo-spark-connector) that is compatible with the Spark and Scala versions of your Spark environment. We recommend an environment that supports Spark 3.2.1 or higher, and the spark connector available at maven coordinates `org.mongodb.spark:mongo-spark-connector_2.12:3.0.1`.

* **Azure Cosmos DB for MongoDB connection strings:** Your Azure Cosmos DB for MongoDB vCore connection string, user name, and passwords.

## Provision an Azure Databricks cluster

You can follow instructions to [provision an Azure Databricks cluster](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal). We recommend selecting Databricks runtime version 7.6, which supports Spark 3.0.

:::image type="content" source="./media/migrate-databricks/databricks-cluster-creation.png" alt-text="Diagram of databricks new cluster creation.":::


## Add dependencies

Add the MongoDB Connector for Spark library to your cluster to connect to both native MongoDB and Azure Cosmos DB for MongoDB endpoints. In your cluster, select **Libraries** > **Install New** > **Maven**, and then add `org.mongodb.spark:mongo-spark-connector_2.12:3.0.1` Maven coordinates.

:::image type="content" source="./media/migrate-databricks/databricks-cluster-dependencies.png" alt-text="Diagram of adding databricks cluster dependencies.":::


Select **Install**, and then restart the cluster when installation is complete.

> [!NOTE]
> Make sure that you restart the Databricks cluster after the MongoDB Connector for Spark library has been installed.

After that, you may create a Scala or Python notebook for migration.


## Create Python notebook to connect to Azure Cosmos DB for MongoDB vCore

Create a Python Notebook in Databricks. Make sure to enter the right values for the variables before running the following codes

### Update Spark configuration with the Azure Cosmos DB for MongoDB connection string

1. Note the connect string under the **Settings** -> **Connection strings** in Azure Cosmos DB MongoDB vCore Resource in Azure Portal. It has the form of "mongodb+srv://\<user>\:\<password>\@\<database_name>.mongocluster.cosmos.azure.com"
2. Back in Databricks in your cluster configuration, under **Advanced Options** (bottom of page), paste the connection string for both the `spark.mongodb.output.uri` and `spark.mongodb.input.uri` variables. Plase populate the username and password field appropriatly. This way all the workbooks you are running on the cluster will use this configuration. 
3. Alternativley you can explictly set the `option` when calling APIs like: `spark.read.format("mongo").option("spark.mongodb.input.uri", connectionString).load()`. If congigured the variables in the cluster, you don't have to set the option.

```python
connectionString_vcore="mongodb+srv://<user>:<password>@<database_name>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

database="<database_name>"
collection="<collection_name>"
```

### Read data from Azure Cosmos DB for MongoDB vCore

```python
df_vcore = spark.read.format("mongo").option("database", database).option("spark.mongodb.input.uri", connectionString_vcore).option("collection",collection).load()

df_vcore.printSchema()

display(df_vcore)
```

### Filter data from Azure Cosmos DB for MongoDB vCore

```python
df_vcore = spark.read.format("mongo").option("database", database).option("spark.mongodb.input.uri", connectionString_vcore).option("collection",collection).load()

#### Using Filter Function
df_v = df_vcore.filter(df_vcore[2] == 1970)
display(df_v)

#### Create Temp View and Using SparkSQL
df_vcore.createOrReplaceTempView("T_VCORE")
df_v = spark.sql(" SELECT * FROM T_VCORE WHERE birth_year == 1970 and gender == 2 ")
display(df_v)
```

### Write data to Azure Cosmos DB for MongoDB vCore

```python
df.write.format("mongo").option("spark.mongodb.output.uri", connectionString).option("database",database).option("collection","<collection_name>").mode("append").save()
```

### Read data from Azure Cosmos DB for MongoDB vCore collection running an Aggregation Pipeline

[Aggregation Pipeline](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/tutorial-aggregation) is a powerful capability that allows to pre-process and transform data within Azure CosmosDB for MongoDB. It's a great match for  real-time analytics, dashboards, report generation with roll-ups, sums & averages with 'server-side' data post-processing. (Note: there is a [whole book written about it](https://www.practical-mongodb-aggregations.com/front-cover.html)).  <br/>
Azure Cosmos DB for MongoDB even supports  [rich secondary/compound indexes](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/indexing) to extract, filter, and process only the data it needs – for example, analyzing all customers located in a specific geography right within the database without first having to load the full data-set, minimizing data-movement and reducing latency. <br/>
The below aggregation pipeline in our example has 4 stages:<br/>
1. **Match** stage : filters all documents which has "printer paper" in the items array. <br />
2. **Unwind** stage : undwind the items array <br />
3. **Add fields** stage : which will add a new field cald "totalSale" which is quantity of items sold * item price. <br />
4. **Project** stage : only project "saleDate" and "totalSale" in the output

```python
pipeline="[{'$match': { 'items.name':'printer paper' }}, {'$unwind': { path: '$items' }}, {'$addFields': { totalSale: { \
	'$multiply': [ '$items.price', '$items.quantity' ] } }}, {'$project': { saleDate:1,totalSale:1,_id:0 }}]"
df = spark.read.format("mongo").option("database", database).option("collection", collection).option("pipeline", pipeline).option("partitioner", "MongoSinglePartitioner").option("spark.mongodb.input.uri", connectionString).load()
display(df)
```


## Next steps

The following articles demonstrate Spark integration with Azure Cosmos DB for Apache Cassandra. 
 
* [DDL operations](spark-ddl-operations.md)
* [Create/insert operations](spark-create-operations.md)
* [Read operations](spark-read-operation.md)
* [Upsert operations](spark-upsert-operations.md)
* [Delete operations](spark-delete-operation.md)
* [Aggregation operations](spark-aggregation-operations.md)
* [Table copy operations](spark-table-copy-operations.md)
