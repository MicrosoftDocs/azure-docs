---
title: Interact with Azure Cosmos DB using Apache Spark 3 in Azure Synapse Link
description: How to interact with Azure Cosmos DB using Apache Spark 3 in Azure Synapse Link
author: Rodrigossz
ms.service: azure-synapse-analytics
ms.topic: quickstart
ms.subservice: synapse-link
ms.date: 03/04/2025
ms.author: rosouz
ms.custom: cosmos-db, mode-other
---

# Interact with Azure Cosmos DB using Apache Spark 3 in Azure Synapse Link

In this article, you learn how to interact with Azure Cosmos DB using Synapse Apache Spark 3. Customers can use Scala, Python, SparkSQL, and C#, for analytics, data engineering, data science, and data exploration scenarios in [Azure Synapse Link for Azure Cosmos DB](/azure/cosmos-db/synapse-link).

The following capabilities are supported while interacting with Azure Cosmos DB:
* Synapse Apache Spark 3 allows you to analyze data in your Azure Cosmos DB containers that are enabled with Azure Synapse Link in near real-time without impacting the performance of your transactional workloads. The following two options are available to query the Azure Cosmos DB [analytical store](/azure/cosmos-db/analytical-store-introduction) from Spark:
    + Load to Spark DataFrame
    + Create Spark table
* Synapse Apache Spark also allows you to ingest data into Azure Cosmos DB. It is important to note that data is always ingested into Azure Cosmos DB containers through the transactional store. When Synapse Link is enabled, any new inserts, updates, and deletes are then automatically synced to the analytical store.
* Synapse Apache Spark also supports Spark structured streaming with Azure Cosmos DB as a source and a sink. 

The following sections walk you through the syntax. You can also checkout the Learn module on how to [Query Azure Cosmos DB with Apache Spark for Azure Synapse Analytics](/training/modules/query-azure-cosmos-db-with-apache-spark-for-azure-synapse-analytics/). Gestures in Azure Synapse Analytics workspace are designed to provide an easy out-of-the-box experience to get started. Gestures are visible when you right-click on an Azure Cosmos DB container in the **Data** tab of the Synapse workspace. With gestures, you can quickly generate code and tailor it to your needs. Gestures are also perfect for discovering data with a single click.

> [!IMPORTANT]
> You should be aware of some constraints in the analytical schema that could lead to the unexpected behavior in data loading operations.
> As an example, only first 1,000 properties from transactional schema are available in the analytical schema, properties with spaces are not available, etc. If you are experiencing some unexpected results, check the [analytical store schema constraints](/azure/cosmos-db/analytical-store-introduction#schema-constraints) for more details.

## Query Azure Cosmos DB analytical store

Customers can load analytical store data to Spark DataFrames or create Spark tables.

The difference in experience is around whether underlying data changes in the Azure Cosmos DB container should be automatically reflected in the analysis performed in Spark. When Spark DataFrames are registered, or a Spark table is created, Spark fetches analytical store metadata for efficient pushdown. It is important to note that since Spark follows a lazy evaluation policy. You need to take action to fecth the last snapshot of the data in Spark DataFrames or SparkSQL queries. 

In the case of **loading to Spark DataFrame**, the fetched metadata is cached through the lifetime of the Spark session and hence subsequent actions invoked on the DataFrame are evaluated against the snapshot of the analytical store at the time of DataFrame creation.

On the other hand, in the case of **creating a Spark table**, the metadata of the analytical store state is not cached in Spark and is reloaded on every SparkSQL query execution against the Spark table.

To conclude, you can choose between loading a snapshot to Spark DataFrame or querying a Spark table for the latest snapshot.

> [!NOTE]
> To query Azure Cosmos DB for MongoDB accounts, learn more about the [full fidelity schema representation](/azure/cosmos-db/analytical-store-introduction#analytical-schema) in the analytical store and the extended property names to be used.

> [!NOTE]
> All `options` are case sensitive.

## Authentication

Now Spark 3.x customers can authenticate to Azure Cosmos DB analytical store using trusted identities access tokens or database account keys. Tokens are more secure as they are short lived, and assigned to the required permission using Cosmos DB RBAC.

The connector now supports two auth types, `MasterKey` and `AccessToken` for the `spark.cosmos.auth.type` property.

### Master key authentication

Use the key to read a dataframe using spark:

```scala
val config = Map(
    "spark.cosmos.accountEndpoint" -> "<endpoint>",
    "spark.cosmos.accountKey" -> "<key>",
    "spark.cosmos.database" -> "<db>",
    "spark.cosmos.container" -> "<container>"
)

val df = spark.read.format("cosmos.olap").options(config).load()
df.show(10)
```

### Access token authentication

The new keyless authentication introduces support for access tokens:

```scala
val config = Map(
    "spark.cosmos.accountEndpoint" -> "<endpoint>",
    "spark.cosmos.auth.type" -> "AccessToken",
    "spark.cosmos.auth.accessToken" -> "<accessToken>",
    "spark.cosmos.database" -> "<db>",
    "spark.cosmos.container" -> "<container>"
)

val df = spark.read.format("cosmos.olap").options(config).load()
df.show(10)
```

#### Access token authentication requires role assignment

To use the access token approach, you need to generate access tokens. Since access tokens are associated with Azure identities, correct role-based access control (RBAC) must be assigned to the identity. The role assignment is on data plane level, and you must have minimum control plane permissions to perform the role assignment.

The Identity Access Management (IAM) role assignments from Azure portal are on control plane level and don't affect the role assignments on data plane. Data plane role assignments are only available via Azure CLI. The `readAnalytics` action is required to read data from analytical store in Cosmos DB and is not part of any predefined roles. As such we must create a custom role definition. In addition to the `readAnalytics` action, also add the actions required for Data Reader. Create a JSON file with the following content and name it role_definition.json

```JSON
{
  "RoleName": "CosmosAnalyticsRole",
  "Type": "CustomRole",
  "AssignableScopes": ["/"],
  "Permissions": [{
    "DataActions": [
      "Microsoft.DocumentDB/databaseAccounts/readAnalytics",
      "Microsoft.DocumentDB/databaseAccounts/readMetadata",
      "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read",
      "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery",
      "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed"
    ]
  }]
}
```

#### Access Token authentication requires Azure CLI

 - Log into Azure CLI: `az login`
 - Set the default subscription which has your Cosmos DB account: `az account set --subscription <name or id>`
 - Create the role definition in the desired Cosmos DB account: `az cosmosdb sql role definition create --account-name <cosmos-account-name> --resource-group <resource-group-name> --body @role_definition.json`
 - Copy over the role `definition id` returned: `/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/< cosmos-account-name >/sqlRoleDefinitions/<a-random-generated-guid>`
 - Get the principal ID of the identity that you want to assign the role to. The identity could be an Azure app registration, a virtual machine, or any other supported Azure resource. Assign the role to the principal using: `az cosmosdb sql role assignment create --account-name "<cosmos-account-name>" --resource-group "<resource-group>" --scope "/" --principal-id "<principal-id-of-identity>" --role-definition-id "<role-definition-id-from-previous-step>"`

> [!Note]
> When using an Azure app registration, Use the `Object Id` as the service principal ID. Also, the principal ID and the Cosmos DB account must be in the same tenant.


#### Generating the access token - Synapse Notebooks

The recommended method for Synapse Notebooks is to use service principal with a certificate to generate access tokens. Click [here](../spark/apache-spark-secure-credentials-with-tokenlibrary.md) for more information.

```scala
The following code snippet has been validated to work in a Synapse notebook
val tenantId = "<azure-tenant-id>"
val clientId = "<client-id-of-service-principal>"
val kvLinkedService = "<azure-key-vault-linked-service>"
val certName = "<certificate-name>"
val token = mssparkutils.credentials.getSPTokenWithCertLS(
  "https://<cosmos-account-name>.documents.azure.com/.default",
  "https://login.microsoftonline.com/" + tenantId, clientId, kvLinkedService, certName)
```

Now you can use the access token generated in this step to read data from analytical store when auth type is set to access token.

> [!Note]
> When using an Azure app registration, use the application (Client Id).

> [!Note]
> Currently, Synapse doesn’t support generating access tokens using the azure-identity package in notebooks. Furthermore, synapse VHDs don’t include azure-identity package and its dependencies. Click [here](../synapse-service-identity.md) for more information.


### Load to Spark DataFrame

In this example, you create a Spark DataFrame that points to the Azure Cosmos DB analytical store. You can then perform more analysis by invoking Spark actions against the DataFrame. This operation doesn't impact the transactional store.

The syntax in **Python** would be the following:
```python
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

df = spark.read.format("cosmos.olap")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .load()
```

The equivalent syntax in **Scala** would be the following:
```scala
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

val df_olap = spark.read.format("cosmos.olap").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>").
    load()
```

### Create Spark table

In this example, you create a Spark table that points the Azure Cosmos DB analytical store. You can then perform additional analysis by invoking SparkSQL queries against the table. This operation doesn't impact transactional store or incur data movement. If you decide to delete this Spark table, the underlying Azure Cosmos DB container and the corresponding analytical store will not be affected. 

This scenario is convenient to reuse Spark tables through third-party tools and provide accessibility to the underlying data for the run-time.

The syntax to create a Spark table is as follows:
```sql
%%sql
-- To select a preferred list of regions in a multi-region Azure Cosmos DB account, add spark.cosmos.preferredRegions '<Region1>,<Region2>' in the config options

create table call_center using cosmos.olap options (
    spark.synapse.linkedService '<enter linked service name>',
    spark.cosmos.container '<enter container name>'
)
```

> [!NOTE]
> If you have scenarios where the schema of the underlying Azure Cosmos DB container changes over time; and if you want the updated schema to automatically reflect in the queries against the Spark table, you can achieve this by setting the `spark.cosmos.autoSchemaMerge`  option to `true` in the Spark table options.


## Write Spark DataFrame to Azure Cosmos DB container

In this example, you write a Spark DataFrame into an Azure Cosmos DB container. This operation impacts the performance of transactional workloads and consume request units provisioned on the Azure Cosmos DB container or the shared database.

The syntax in **Python** would be the following:
```python
# Write a Spark DataFrame into an Azure Cosmos DB container
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

YOURDATAFRAME.write.format("cosmos.oltp")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .mode('append')\
    .save()
```

The equivalent syntax in **Scala** would be the following:
```scala
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

import org.apache.spark.sql.SaveMode

df.write.format("cosmos.oltp").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>").
    mode(SaveMode.Append).
    save()
```

## Load streaming DataFrame from container
In this gesture, you use Spark Streaming capability to load data from a container into a dataframe. The data is stored in the primary data lake account (and file system) you connected to the workspace. 
> [!NOTE]
> If you are looking to reference external libraries in Synapse Apache Spark, learn more [here](../spark/apache-spark-azure-portal-add-libraries.md). For instance, if you are looking to ingest a Spark DataFrame to a container of Azure Cosmos DB for MongoDB, you can use the MongoDB connector for Spark [here](https://docs.mongodb.com/spark-connector/master/).

## Load streaming DataFrame from Azure Cosmos DB container
In this example, you use Spark's structured streaming to load data from an Azure Cosmos DB container into a Spark streaming DataFrame, using the change feed functionality in Azure Cosmos DB. The checkpoint data used by Spark will be stored in the primary data lake account (and file system) that you connected to the workspace.

The syntax in **Python** would be the following:
```python
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

dfStream = spark.readStream\
    .format("cosmos.oltp.changeFeed")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .option("spark.cosmos.changeFeed.startFrom", "Beginning")\
    .option("spark.cosmos.changeFeed.mode", "Incremental")\
    .load()
```

The equivalent syntax in **Scala** would be the following:
```scala
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

val dfStream = spark.readStream.
    format("cosmos.oltp.changeFeed").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>").
    option("spark.cosmos.changeFeed.startFrom", "Beginning").
    option("spark.cosmos.changeFeed.mode", "Incremental").
    load()
```

## Write streaming DataFrame to Azure Cosmos DB container
In this example, you write a streaming DataFrame into an Azure Cosmos DB container. This operation impacts the performance of transactional workloads and consume Request Units provisioned on the Azure Cosmos DB container or shared database. If the folder */localWriteCheckpointFolder* isn't created (in the example below), it is automatically created. 

The syntax in **Python** would be the following:

```python
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

streamQuery = dfStream\
    .writeStream\
    .format("cosmos.oltp")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .option("checkpointLocation", "/tmp/myRunId/")\
    .outputMode("append")\
    .start()

streamQuery.awaitTermination()
```

The equivalent syntax in **Scala** would be the following:
```scala
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

val query = dfStream.
            writeStream.
            format("cosmos.oltp").
            outputMode("append").
            option("spark.synapse.linkedService", "<enter linked service name>").
            option("spark.cosmos.container", "<enter container name>").
            option("checkpointLocation", "/tmp/myRunId/").
            start()

query.awaitTermination()
```


## Next steps

* [Samples to get started with Azure Synapse Link on GitHub](https://aka.ms/cosmosdb-synapselink-samples)
* [Learn what is supported in Azure Synapse Link for Azure Cosmos DB](./concept-synapse-link-cosmos-db-support.md)
* [Connect to Synapse Link for Azure Cosmos DB](../quickstart-connect-synapse-link-cosmos-db.md)
* Check out the Learn module on how to [Query Azure Cosmos DB with Apache Spark for Azure Synapse Analytics](/training/modules/query-azure-cosmos-db-with-apache-spark-for-azure-synapse-analytics/).
