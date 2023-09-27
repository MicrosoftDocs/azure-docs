---
title: Quickstart - Manage data with Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL
description: This quickstart presents a code sample for the Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL that you can use to connect to and query data in your Azure Cosmos DB account
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: quickstart
ms.date: 03/01/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022
---

# Quickstart: Manage data with Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Node.js](quickstart-nodejs.md)
> * [Java](quickstart-java.md)
> * [Spring Data](quickstart-java-spring-data.md)
> * [Python](quickstart-python.md)
> * [Spark v3](quickstart-spark.md)
> * [Go](quickstart-go.md)
>

This tutorial is a quick start guide to show how to use Azure Cosmos DB Spark Connector to read from or write to Azure Cosmos DB. Azure Cosmos DB Spark Connector supports Spark 3.1.x and 3.2.x and 3.3.x.

Throughout this quick tutorial, we rely on [Azure Databricks Runtime 12.2 with Spark 3.3.2](/azure/databricks/release-notes/runtime/12.2) and a Jupyter Notebook to show how to use the Azure Cosmos DB Spark Connector.

You should be able to use any language supported by Spark (PySpark, Scala, Java, etc.), or any Spark interface you are familiar with (Jupyter Notebook, Livy, etc.).

## Prerequisites

* An Azure account with an active subscription.

  * No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.

* [Azure Databricks](/azure/databricks/release-notes/runtime/12.2) runtime 12.2 with Spark 3.3.2

* (Optional) [SLF4J binding](https://www.slf4j.org/manual.html) is used to associate a specific logging framework with SLF4J.

SLF4J is only needed if you plan to use logging, also download an SLF4J binding, which will link the SLF4J API with the logging implementation of your choice. See the [SLF4J user manual](https://www.slf4j.org/manual.html) for more information.

Install Azure Cosmos DB Spark Connector in your spark cluster [using the latest version for Spark 3.3.x](https://aka.ms/azure-cosmos-spark-3-3-download).

The getting started guide is based on PySpark/Scala and you can run the following code snippet in an Azure Databricks PySpark/Scala notebook.

## Create databases and containers

First, set Azure Cosmos DB account credentials, and the Azure Cosmos DB Database name and container name.

#### [Python](#tab/python)

```python
cosmosEndpoint = "https://REPLACEME.documents.azure.com:443/"
cosmosMasterKey = "REPLACEME"
cosmosDatabaseName = "sampleDB"
cosmosContainerName = "sampleContainer"

cfg = {
  "spark.cosmos.accountEndpoint" : cosmosEndpoint,
  "spark.cosmos.accountKey" : cosmosMasterKey,
  "spark.cosmos.database" : cosmosDatabaseName,
  "spark.cosmos.container" : cosmosContainerName,
}
```

#### [Scala](#tab/scala)

```scala
val cosmosEndpoint = "https://REPLACEME.documents.azure.com:443/"
val cosmosMasterKey = "REPLACEME"
val cosmosDatabaseName = "sampleDB"
val cosmosContainerName = "sampleContainer"

val cfg = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
  "spark.cosmos.accountKey" -> cosmosMasterKey,
  "spark.cosmos.database" -> cosmosDatabaseName,
  "spark.cosmos.container" -> cosmosContainerName
)
```
---

Next, you can use the new Catalog API to create an Azure Cosmos DB Database and Container through Spark.

#### [Python](#tab/python)

```python
# Configure Catalog Api to be used
spark.conf.set("spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", cosmosMasterKey)

# create an Azure Cosmos DB database using catalog api
spark.sql("CREATE DATABASE IF NOT EXISTS cosmosCatalog.{};".format(cosmosDatabaseName))

# create an Azure Cosmos DB container using catalog api
spark.sql("CREATE TABLE IF NOT EXISTS cosmosCatalog.{}.{} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')".format(cosmosDatabaseName, cosmosContainerName))
```

#### [Scala](#tab/scala)

```scala
// Configure Catalog Api to be used
spark.conf.set(s"spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", cosmosMasterKey)

// create an Azure Cosmos DB database using catalog api
spark.sql(s"CREATE DATABASE IF NOT EXISTS cosmosCatalog.${cosmosDatabaseName};")

// create an Azure Cosmos DB container using catalog api
spark.sql(s"CREATE TABLE IF NOT EXISTS cosmosCatalog.${cosmosDatabaseName}.${cosmosContainerName} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')")
```
---

When creating containers with the Catalog API, you can set the throughput and [partition key path](../partitioning-overview.md#choose-partitionkey) for the container to be created.

For more information, see the full [Catalog API](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/catalog-api.md) documentation.

## Ingest data

The name of the data source is `cosmos.oltp`, and the following example shows how you can write a memory dataframe consisting of two items to Azure Cosmos DB:

#### [Python](#tab/python)

```python
spark.createDataFrame((("cat-alive", "Schrodinger cat", 2, True), ("cat-dead", "Schrodinger cat", 2, False)))\
  .toDF("id","name","age","isAlive") \
   .write\
   .format("cosmos.oltp")\
   .options(**cfg)\
   .mode("APPEND")\
   .save()
```

#### [Scala](#tab/scala)

```scala
spark.createDataFrame(Seq(("cat-alive", "Schrodinger cat", 2, true), ("cat-dead", "Schrodinger cat", 2, false)))
  .toDF("id","name","age","isAlive")
   .write
   .format("cosmos.oltp")
   .options(cfg)
   .mode("APPEND")
   .save()
```
---

Note that `id` is a mandatory field for Azure Cosmos DB.

For more information related to ingesting data, see the full [write configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#write-config) documentation.

## Query data

Using the same `cosmos.oltp` data source, we can query data and use `filter` to push down filters:

#### [Python](#tab/python)

```python
from pyspark.sql.functions import col

df = spark.read.format("cosmos.oltp").options(**cfg)\
 .option("spark.cosmos.read.inferSchema.enabled", "true")\
 .load()

df.filter(col("isAlive") == True)\
 .show()
```

#### [Scala](#tab/scala)

```scala
import org.apache.spark.sql.functions.col

val df = spark.read.format("cosmos.oltp").options(cfg).load()

df.filter(col("isAlive") === true)
 .withColumn("age", col("age") + 1)
 .show()
```
---

For more information related to querying data, see the full [query configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#query-config) documentation.

## Partial document update using Patch

Using the same `cosmos.oltp` data source, we can do partial update in Azure Cosmos DB using Patch API:

#### [Python](#tab/python)

```python
cfgPatch = {"spark.cosmos.accountEndpoint": cosmosEndpoint,
          "spark.cosmos.accountKey": cosmosMasterKey,
          "spark.cosmos.database": cosmosDatabaseName,
          "spark.cosmos.container": cosmosContainerName,
          "spark.cosmos.write.strategy": "ItemPatch",
          "spark.cosmos.write.bulk.enabled": "false",
          "spark.cosmos.write.patch.defaultOperationType": "Set",
          "spark.cosmos.write.patch.columnConfigs": "[col(name).op(set)]"
          }

id = "<document-id>"
query = "select * from cosmosCatalog.{}.{} where id = '{}';".format(
    cosmosDatabaseName, cosmosContainerName, id)

dfBeforePatch = spark.sql(query)
print("document before patch operation")
dfBeforePatch.show()

data = [{"id": id, "name": "Joel Brakus"}]
patchDf = spark.createDataFrame(data)

patchDf.write.format("cosmos.oltp").mode("Append").options(**cfgPatch).save()

dfAfterPatch = spark.sql(query)
print("document after patch operation")
dfAfterPatch.show()
```

For more samples related to partial document update, see the GitHub code sample [Patch Sample](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/Python/patch-sample.py).


#### [Scala](#tab/scala)

```scala
val cfgPatch = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
        "spark.cosmos.accountKey" -> cosmosMasterKey,
        "spark.cosmos.database" -> cosmosDatabaseName,
        "spark.cosmos.container" -> cosmosContainerName,
        "spark.cosmos.write.strategy" -> "ItemPatch",
        "spark.cosmos.write.bulk.enabled" -> "false",
         
        "spark.cosmos.write.patch.columnConfigs" -> "[col(name).op(set)]"
      )

val id = "<document-id>"
val query = s"select * from cosmosCatalog.${cosmosDatabaseName}.${cosmosContainerName} where id = '$id';"

val dfBeforePatch = spark.sql(query)
println("document before patch operation")
dfBeforePatch.show()
val patchDf =  Seq(
        (id,  "Joel Brakus")
      ).toDF("id", "name")

patchDf.write.format("cosmos.oltp").mode("Append").options(cfgPatch).save()
val dfAfterPatch = spark.sql(query)
println("document after patch operation")
dfAfterPatch.show()
```

For more samples related to partial document update, see the GitHub code sample [Patch Sample](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/Scala/PatchSample.scala).

---

## Schema inference

When querying data, the Spark Connector can infer the schema based on sampling existing items by setting `spark.cosmos.read.inferSchema.enabled` to `true`.

#### [Python](#tab/python)

```python
df = spark.read.format("cosmos.oltp").options(**cfg)\
 .option("spark.cosmos.read.inferSchema.enabled", "true")\
 .load()
 
df.printSchema()


# Alternatively, you can pass the custom schema you want to be used to read the data:

customSchema = StructType([
      StructField("id", StringType()),
      StructField("name", StringType()),
      StructField("type", StringType()),
      StructField("age", IntegerType()),
      StructField("isAlive", BooleanType())
    ])

df = spark.read.schema(customSchema).format("cosmos.oltp").options(**cfg)\
 .load()
 
df.printSchema()

# If no custom schema is specified and schema inference is disabled, then the resulting data will be returning the raw Json content of the items:

df = spark.read.format("cosmos.oltp").options(**cfg)\
 .load()
 
df.printSchema()
```

#### [Scala](#tab/scala)

```scala
val cfgWithAutoSchemaInference = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
  "spark.cosmos.accountKey" -> cosmosMasterKey,
  "spark.cosmos.database" -> cosmosDatabaseName,
  "spark.cosmos.container" -> cosmosContainerName,
  "spark.cosmos.read.inferSchema.enabled" -> "true"                          
)

val df = spark.read.format("cosmos.oltp").options(cfgWithAutoSchemaInference).load()
df.printSchema()

df.show()
```
---

For more information related to schema inference, see the full [schema inference configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#schema-inference-config) documentation.

## Raw JSON support for Spark Connector
 When working with Cosmos DB, you may come across documents that contain an array of entries with potentially different structures. These documents typically have an array called "tags" that contains items with varying structures, along with a "tag_id" field that serves as an entity type identifier. To handle patching operations efficiently in Spark, you can use a custom function that handles the patching of such documents.

**Sample document that can be used**


```
{
    "id": "Test01",
    "document_type": "tag",
    "tags": [
        {
            "tag_id": "key_val",
            "params": "param1=val1;param2=val2"
        },
        {
            "tag_id": "arrays",
            "tags": "tag1,tag2,tag3"
        }
    ]
}
```

#### [Python](#tab/python)

```python

def init_sequences_db_config():
    #Configure Config for Cosmos DB Patch and Query
    global cfgSequencePatch
    cfgSequencePatch = {"spark.cosmos.accountEndpoint": cosmosEndpoint,
          "spark.cosmos.accountKey": cosmosMasterKey,
          "spark.cosmos.database": cosmosDatabaseName,
          "spark.cosmos.container": cosmosContainerNameTarget,
          "spark.cosmos.write.strategy": "ItemPatch", # Partial update all documents based on the patch config
          "spark.cosmos.write.bulk.enabled": "true",
          "spark.cosmos.write.patch.defaultOperationType": "Replace",
          "spark.cosmos.read.inferSchema.enabled": "false"
          }
    
def adjust_tag_array(rawBody):
    print("test adjust_tag_array")
    array_items = json.loads(rawBody)["tags"]
    print(json.dumps(array_items))
    
    output_json = [{}]

    for item in array_items:
        output_json_item = {}
        # Handle different tag types
        if item["tag_id"] == "key_val":
            output_json_item.update({"tag_id" : item["tag_id"]})
            params = item["params"].split(";")
            for p in params:
                key_val = p.split("=")
                element = {key_val[0]: key_val[1]}
                output_json_item.update(element)

        if item["tag_id"] == "arrays":
            tags_array = item["tags"].split(",")
            output_json_item.update({"tags": tags_array})
                        
        output_json.append(output_json_item)

    # convert to raw json
    return json.dumps(output_json)


init_sequences_db_config()

native_query = "SELECT c.id, c.tags, c._ts from c where EXISTS(SELECT VALUE t FROM t IN c.tags WHERE IS_DEFINED(t.tag_id))".format()

# the custom query will be processed against the Cosmos endpoint
cfgSequencePatch["spark.cosmos.read.customQuery"] = native_query
# Cosmos DB patch column configs
cfgSequencePatch["spark.cosmos.write.patch.columnConfigs"] = "[col(tags_new).path(/tags).op(set).rawJson]"

# load df
df_relevant_sequences = spark.read.format("cosmos.oltp").options(**cfgSequencePatch).load()
print(df_relevant_sequences)
df_relevant_sequences.show(20, False)
if not df_relevant_sequences.isEmpty():
    print("Found sequences to patch")
    
    # prepare udf function
    tags_udf= udf(lambda a: adjust_tag_array(a), StringType())

    df_relevant_sequences.show(20, False)

    # apply udf function for patching raw json
    df_relevant_sequences_adjusted = df_relevant_sequences.withColumn("tags_new", tags_udf("_rawBody"))
    df_relevant_sequences_adjusted.show(20, False)

    # write df
    output_df = df_relevant_sequences_adjusted.select("id","tags_new")
    output_df.write.format("cosmos.oltp").mode("Append").options(**cfgSequencePatch).save()

```
#### [Scala](#tab/scala)
```scala
var cfgSequencePatch = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
  "spark.cosmos.accountKey" -> cosmosMasterKey,
  "spark.cosmos.database" -> cosmosDatabaseName,
  "spark.cosmos.container" -> cosmosContainerName,
  "spark.cosmos.write.strategy" -> "ItemPatch", // Partial update all documents based on the patch config
  "spark.cosmos.write.bulk.enabled" -> "false",
  "spark.cosmos.write.patch.defaultOperationType" -> "Replace",
  "spark.cosmos.read.inferSchema.enabled" -> "false"
)

def patchTags(rawJson: String): String = {
  implicit val formats = DefaultFormats
  val json = JsonMethods.parse(rawJson)
  val tagsArray = (json \ "tags").asInstanceOf[JArray]
  var outList = new ListBuffer[Map[String, Any]]

  tagsArray.arr.foreach { tag =>
    val tagId = (tag \ "tag_id").extract[String]
    var outMap = Map.empty[String, Any]

    // Handle different tag types
    tagId match {
      case "key_val" =>
        val params = (tag \ "params").extract[String].split(";")
        for (p <- params) {
          val paramVal = p.split("=")
          outMap += paramVal(0) -> paramVal(1)
        }
      case "arrays" =>
        val tags = (tag \ "tags").extract[String]
        val tagList = tags.split(",")
        outMap += "arrays" -> tagList
      case _ => {}
    }
    outList += outMap
  }
  // convert to raw json
  write(outList)
}

val nativeQuery = "SELECT c.id, c.tags, c._ts from c where EXISTS(SELECT VALUE t FROM t IN c.tags WHERE IS_DEFINED(t.tag_id))"

// the custom query will be processed against the Cosmos endpoint
cfgSequencePatch += "spark.cosmos.read.customQuery" -> nativeQuery

//Cosmos DB patch column configs
cfgSequencePatch += "spark.cosmos.write.patch.columnConfigs" -> "[col(tags_new).path(/tags).op(set).rawJson]"

// load df
val dfRelevantSequences = spark.read.format("cosmos.oltp").options(cfgSequencePatch).load()
dfRelevantSequences.show(20, false)

if(!dfRelevantSequences.isEmpty){
  println("Found sequences to patch")

  // prepare udf function
  val patchTagsUDF = udf(patchTags _)

  // apply udf function for patching raw json
  val dfRelevantSequencesAdjusted = dfRelevantSequences.withColumn("tags_new", patchTagsUDF(dfRelevantSequences("_rawBody")))
  
  dfRelevantSequencesAdjusted.show(20, false)
  
  var outputDf = dfRelevantSequencesAdjusted.select("id","tags_new")

  // write df
  outputDf.write.format("cosmos.oltp").mode("Append").options(cfgSequencePatch).save()
}

```

---
## Configuration reference

The Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL has a complete configuration reference that provides more advanced settings for writing and querying data, serialization, streaming using change feed, partitioning and throughput management and more. For a complete listing with details, see our [Spark Connector Configuration Reference](https://aka.ms/azure-cosmos-spark-3-config) on GitHub.


## Azure Active Directory authentication

1. Following the instructions on how to [register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal).

1. You should still be in Azure portal > Azure Active Directory > App Registrations. In the `Certificates & secrets` section, create a new secret. Save the value for later. 

1. Click on the overview tab and find the values for `clientId` and `tenantId`, along with `clientSecret` that you created earlier, and `cosmosEndpoint`, `subscriptionId`, and `resourceGroupName`from your account. Create a notebook as below and replace the configurations with the appropriate values:


    #### [Python](#tab/python)
    
    ```python
    cosmosDatabaseName = "AADsampleDB"
    cosmosContainerName = "sampleContainer"
    authType = "ServicePrinciple"
    cosmosEndpoint = "<replace with URI of your Cosmos DB account>"
    subscriptionId = "<replace with subscriptionId>"
    tenantId = "<replace with Directory (tenant) ID from the portal>"
    resourceGroupName = "<replace with the resourceGroup name>"
    clientId = "<replace with Application (client) ID from the portal>"
    clientSecret = "<replace with application secret value you created earlier>"
    
    cfg = {
        "spark.cosmos.accountEndpoint" : cosmosEndpoint,
        "spark.cosmos.auth.type" : authType,
        "spark.cosmos.account.subscriptionId" : subscriptionId,
        "spark.cosmos.account.tenantId" : tenantId,
        "spark.cosmos.account.resourceGroupName" : resourceGroupName,
        "spark.cosmos.auth.aad.clientId" : clientId,
        "spark.cosmos.auth.aad.clientSecret" : clientSecret,
        "spark.cosmos.database" : cosmosDatabaseName,
        "spark.cosmos.container" : cosmosContainerName
    }

    # Configure Catalog Api to be used
    spark.conf.set("spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.type", authType)
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.account.subscriptionId", subscriptionId)
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.account.tenantId", tenantId)
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.account.resourceGroupName", resourceGroupName)
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientId", clientId)
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientSecret", clientSecret)

    # create an Azure Cosmos DB database using catalog api
    spark.sql("CREATE DATABASE IF NOT EXISTS cosmosCatalog.{};".format(cosmosDatabaseName))
    
    # create an Azure Cosmos DB container using catalog api
    spark.sql("CREATE TABLE IF NOT EXISTS cosmosCatalog.{}.{} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')".format(cosmosDatabaseName, cosmosContainerName))
    
    spark.createDataFrame((("cat-alive", "Schrodinger cat", 2, True), ("cat-dead", "Schrodinger cat", 2, False)))\
      .toDF("id","name","age","isAlive") \
       .write\
       .format("cosmos.oltp")\
       .options(**cfg)\
       .mode("APPEND")\
       .save()
    
    ```
    
    #### [Scala](#tab/scala)
    
    ```scala
    val cosmosDatabaseName = "AADsampleDB"
    val cosmosContainerName = "sampleContainer"
    val authType = "ServicePrinciple"
    val cosmosEndpoint = "<replace with URI of your Cosmos DB account>"
    val subscriptionId = "<replace with subscriptionId>"
    val tenantId = "<replace with Directory (tenant) ID from the portal>"
    val resourceGroupName = "<replace with the resourceGroup name>"
    val clientId = "<replace with Application (client) ID from the portal>"
    val clientSecret = "<replace with application secret value you created earlier>"
      
    val cfg = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
          "spark.cosmos.auth.type" -> authType,
          "spark.cosmos.account.subscriptionId" -> subscriptionId,
          "spark.cosmos.account.tenantId" -> tenantId,
          "spark.cosmos.account.resourceGroupName" -> resourceGroupName,
          "spark.cosmos.auth.aad.clientId" -> clientId,
          "spark.cosmos.auth.aad.clientSecret" -> clientSecret,
          "spark.cosmos.database" -> cosmosDatabaseName,
          "spark.cosmos.container" -> cosmosContainerName
    )

    // Configure Catalog Api to be used
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.type", authType)
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.account.subscriptionId", subscriptionId)
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.account.tenantId", tenantId)
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.account.resourceGroupName", resourceGroupName)
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientId", clientId)
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientSecret", clientSecret)
    
    // create an Azure Cosmos DB database using catalog api
    spark.sql(s"CREATE DATABASE IF NOT EXISTS cosmosCatalog.${cosmosDatabaseName};")
    
    // create an Azure Cosmos DB container using catalog api
    spark.sql(s"CREATE TABLE IF NOT EXISTS cosmosCatalog.${cosmosDatabaseName}.${cosmosContainerName} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')")
    
    spark.createDataFrame(Seq(("cat-alive", "Schrodinger cat", 2, true), ("cat-dead", "Schrodinger cat", 2, false)))
      .toDF("id","name","age","isAlive")
       .write
       .format("cosmos.oltp")
       .options(cfg)
       .mode("APPEND")
       .save()
    ```
    --- 

    > [!TIP]
    > In this quickstart example credentials are assigned to variables in clear-text, but for security we recommend the usage of secrets. Review instructions on how to secure credentials in Azure Synapse Apache Spark with [linked services using the TokenLibrary](../../synapse-analytics/spark/apache-spark-secure-credentials-with-tokenlibrary.md). Or if using Databricks, review how to create an [Azure Key Vault backed secret scope](/azure/databricks/security/secrets/secret-scopes#--create-an-azure-key-vault-backed-secret-scope) or a [Databricks backed secret scope](/azure/databricks/security/secrets/secret-scopes#create-a-databricks-backed-secret-scope). For configuring secrets, review how to [add secrets to your Spark configuration](/azure/databricks/security/secrets/secrets#read-a-secret).

1. Create a role using the `az role definition create` command. Pass in the Cosmos DB account name and resource group, followed by a body of JSON that defines the custom role. The following example creates a role named `SparkConnectorAAD` with permissions to read and write items in Cosmos DB containers. The role is also scoped to the account level using `/`.

    ```azurecli-interactive
    resourceGroupName='<myResourceGroup>'
    accountName='<myCosmosAccount>'
    az cosmosdb sql role definition create \
       --account-name $accountName \
       --resource-group $resourceGroupName \
       --body '{
           "RoleName": "SparkConnectorAAD",
           "Type": "CustomRole",
           "AssignableScopes": ["/"],
           "Permissions": [{
               "DataActions": [
                   "Microsoft.DocumentDB/databaseAccounts/readMetadata",
                   "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
                   "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
               ]
           }]
       }'
    ```

1. Now list the role definition you created to fetch its ID:

    ```azurecli-interactive
        az cosmosdb sql role definition list --account-name $accountName --resource-group $resourceGroupName 
    ```

1. This should bring back a response like the below. Record the `id` value.

    ```json
        [
          {
            "assignableScopes": [
              "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>"
            ],
            "id": "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDB/databaseAccounts/<myCosmosAccount>/sqlRoleDefinitions/<roleDefinitionId>",
            "name": "<roleDefinitionId>",
            "permissions": [
              {
                "dataActions": [
                  "Microsoft.DocumentDB/databaseAccounts/readMetadata",
                  "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
                  "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
                ],
                "notDataActions": []
              }
            ],
            "resourceGroup": "<myResourceGroup>",
            "roleName": "MyReadWriteRole",
            "sqlRoleDefinitionGetResultsType": "CustomRole",
            "type": "Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions"
          }
        ]
    ```

1. Now go to Azure portal > Azure Active Directory > **Enterprise Applications** and search for the application you created earlier. Record the Object ID found here.

    > [!NOTE]
    > Make sure to use its Object ID as found in the **Enterprise applications** section of the Azure Active Directory portal blade (and not the App registrations section you used earlier).

1. Now create a role assignment. Replace the `<aadPrincipalId>` with Object ID you recorded above (note this is NOT the same as Object ID visible from the app registrations view you saw earlier). Also replace `<myResourceGroup>` and `<myCosmosAccount>` accordingly in the below. Replace `<roleDefinitionId>` with the `id` value fetched from running the `az cosmosdb sql role definition list` command you ran above. Then run in Azure CLI:

    ```azurecli-interactive
    resourceGroupName='<myResourceGroup>'
    accountName='<myCosmosAccount>'
    readOnlyRoleDefinitionId='<roleDefinitionId>' # as fetched above
    # For Service Principals make sure to use the Object ID as found in the Enterprise applications section of the Azure Active Directory portal blade.
    principalId='<aadPrincipalId>'
    az cosmosdb sql role assignment create --account-name $accountName --resource-group $resourceGroupName --scope "/" --principal-id $principalId --role-definition-id $readOnlyRoleDefinitionId
    ```

1. Now that you have created an Azure Active Directory application and service principal, created a custom role, and assigned that role permissions to your Cosmos DB account, you should be able to run your notebook. 

## Migrate to Spark 3 Connector

If you are using our older Spark 2.4 Connector, you can find out how to migrate to the Spark 3 Connector [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/migration.md).

## Next steps

* Azure Cosmos DB Apache Spark 3 OLTP Connector for API for NoSQL: [Release notes and resources](sdk-java-spark-v3.md)
* Learn more about [Apache Spark](https://spark.apache.org/).
* Learn how to configure [throughput control](throughput-control-spark.md).
* Check out more [samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples).
