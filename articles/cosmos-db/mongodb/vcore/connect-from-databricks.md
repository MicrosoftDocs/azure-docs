---
title: Working with Azure Cosmos DB for MongoDB vCore from Azure Databricks
description: This article is the main page for Azure Cosmos DB for MongoDB vCore integration from Azure Databricks.
author: Gary3207Lee
ms.author: yongl
ms.reviewer: krmeht
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 03/08/2024
---

# Connect to Azure Cosmos DB for MongoDB vCore from Azure Databricks
[!INCLUDE[MongoDB vCore](./introduction.md)]

This article walks you through connecting Azure Cosmos DB for MongoDB vCore using Spark connector for Databricks. It walks through basic  basic Data Manipulation Language(DML) operations like Read, Write, Create Views or Temporary Tables, Filtering and Running Aggregations using python code.

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

### Data Sample Set

For the purpose of this lab we will be using the Mongo Citibike2019 data set. You can import it from here
[CitiBike Trip History 2019](https://citibikenyc.com/system-data)
We have loaded it into a database called "CitiBikeDB" and the collection "CitiBike2019"
We are setting the variables database and collection to point to the data loaded and we shall be using these variable in the examples below
```python
database="CitiBikeDB"
collection="CitiBike2019"
```

### Read data from Azure Cosmos DB for MongoDB vCore

The general syntax looks like this :
```python
df_vcore = spark.read.format("mongo").option("database", database).option("spark.mongodb.input.uri", connectionString_vcore).option("collection",collection).load()
```

You can validate the data frame loaded as follows :
```python
df_vcore.printSchema()
display(df_vcore)
```

Let's see this with an example :
```python
df_vcore = spark.read.format("mongo").option("database", database).option("spark.mongodb.input.uri", connectionString_vcore).option("collection",collection).load()
df_vcore.printSchema()
display(df_vcore)
```

Output :
**Schema**
 :::image type="content" source="./media/connect-from-databricks/print-schema.png" alt-text="Screenshot of the Print Schema.":::

**DataFrame**
 :::image type="content" source="./media/connect-from-databricks/display-dataframe.png" alt-text="Screenshot of the Display DataFrame.":::

### Filter data from Azure Cosmos DB for MongoDB vCore

The general syntax looks like this :
```python
df_v = df_vcore.filter(df_vcore[column number/column name] == [filter condition])
display(df_v)
```

Let's see this with an example :
```python
df_v = df_vcore.filter(df_vcore[2] == 1970)
display(df_v)
```

Output:
 :::image type="content" source="./media/connect-from-databricks/display-filtered-data.png" alt-text="Screenshot of the Display Filtered DataFrame.":::

### Create a view or temporary table and run SQL queries against it

The general syntax looks like this :
```python
df_[dataframename].createOrReplaceTempView("[View Name]")
spark.sql("SELECT * FROM [View Name]")
```

Let's see this with an example :
```python
df_vcore.createOrReplaceTempView("T_VCORE")
df_v = spark.sql(" SELECT * FROM T_VCORE WHERE birth_year == 1970 and gender == 2 ")
display(df_v)
```

Output:
 :::image type="content" source="./media/connect-from-databricks/display-sql-query.png" alt-text="Screenshot of the Display SQL Query.":::

### Write data to Azure Cosmos DB for MongoDB vCore

The general syntax looks like this :
```python
df.write.format("mongo").option("spark.mongodb.output.uri", connectionString).option("database",database).option("collection","<collection_name>").mode("append").save()
```

Let's see this with an example :
```python
df_vcore.write.format("mongo").option("spark.mongodb.output.uri", connectionString_vcore).option("database",database).option("collection","CitiBike2019").mode("append").save()
```

This command does not have an output as it will write directly to the collection. You can cross check if the record is updated using a read command.

### Read data from Azure Cosmos DB for MongoDB vCore collection running an Aggregation Pipeline

[Aggregation Pipeline](../tutorial-aggregation.md) is a powerful capability that allows to pre-process and transform data within Azure CosmosDB for MongoDB. It's a great match for  real-time analytics, dashboards, report generation with roll-ups, sums & averages with 'server-side' data post-processing. (Note: there is a [whole book written about it](https://www.practical-mongodb-aggregations.com/front-cover.html)).  <br/>
Azure Cosmos DB for MongoDB even supports [rich secondary/compound indexes](../indexing.md) to extract, filter, and process only the data it needs – for example, analyzing all customers located in a specific geography right within the database without first having to load the full data-set, minimizing data-movement and reducing latency. <br/>
You can find the syntax in the hyperlinks above. 

Below is an example of using aggregate function :

```python
pipeline = "[{ $group : { _id : '$birth_year', totaldocs : { $count : 1 }, totalduration: {$sum: '$tripduration'}} }]"
df_vcore = spark.read.format("mongo").option("database", database).option("spark.mongodb.input.uri", connectionString_vcore).option("collection",collection).option("pipeline", pipeline).load()
display(df_vcore)
```

Output:
 :::image type="content" source="./media/connect-from-databricks/display-aggregate-data.png" alt-text="Screenshot of the Display Aggregate Data.":::

## Next steps

The following articles demonstrate Spark integration with Azure Cosmos DB for MongoDB vCore. 
 
* [How to Connect with Studio3T](how-to-connect-studio-3t.md)
