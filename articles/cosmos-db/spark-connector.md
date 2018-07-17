---
title: Connecting Apache Spark to Azure Cosmos DB | Microsoft Docs
description: Use this tutorial to learn about the Azure Cosmos DB Spark connector that enables you to connect Apache Spark to Azure Cosmos DB to perform distributed aggregations and data sciences on the multi-tenant globally distributed database system from Microsoft that's designed for the cloud.
keywords: apache spark
services: cosmos-db
author: tknandu
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2018
ms.author: ramkris

---

# Accelerate real-time big-data analytics by using the Spark to Azure Cosmos DB connector
 
The Spark to Azure Cosmos DB connector enables Azure Cosmos DB to act as an input or output for Apache Spark jobs. Connecting [Spark](http://spark.apache.org/) to [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) accelerates your ability to solve fast-moving data science problems where you can use Azure Cosmos DB to quickly persist and query data. The Spark to Azure Cosmos DB connector efficiently utilizes the native Azure Cosmos DB managed indexes. The indexes enable updateable columns when you perform analytics and push-down predicate filtering against fast-changing globally distributed data, which range from Internet of Things (IoT) to data science and analytics scenarios.

Learn more about the Spark to Azure Cosmos DB connector in this video:

> [!VIDEO https://channel9.msdn.com/Events/Connect/2017/T135/player] 

## Connector components

The Spark to Azure Cosmos DB connector utilizes the following components:

* [Azure Cosmos DB](http://documentdb.com) enables customers to provision and elastically scale both throughput and storage across any number of geographical regions.  

* [Apache Spark](http://spark.apache.org/) is a powerful open source processing engine that's built around speed, ease of use, and sophisticated analytics.  

* [Apache Spark cluster on Azure Databricks](https://docs.azuredatabricks.net/getting-started/index.html)  to run spark jobs on the spark cluster.

## Connect Apache Spark to Azure Cosmos DB

There are two approaches to connect Apache Spark and Azure Cosmos DB:

1. By using [Azure Cosmos DB SQL Python SDK](https://github.com/Azure/azure-documentdb-python), a Python-based spark to Cosmos DB connector, which is also referred to as “pyDocumentDB”.  

2. By using the [Azure Cosmos DB SQL Java SDK](https://github.com/Azure/azure-documentdb-java)  a Java-based spark to Cosmos DB connector.


**Supported versions**

| Component | Version |
|---------|-------|
|Apache Spark| 2.1.x, 2.2.x, 2.3.x |
| Scala|2.11|
| Databricks runtime version | > 3.4 |
| Azure Cosmos DB SQL Java SDK | 1.16.2 |

## Connect by using Python or pyDocumentDB SDK

The following image shows the architecture of pyDocumentDB SDK implementation:

![Spark to Azure Cosmos DB data flow via pyDocumentDB DB](./media/spark-connector/spark-pydocumentdb.png)


### Data flow

Data flow of the pyDocumentDB implementation is as follows:

* The master node of spark connects to the Azure Cosmos DB gateway node through pyDocumentDB. A user specifies the spark and Azure Cosmos DB connections only. Connections to the respective master and gateway nodes are transparent to the user.  

* The gateway node makes the query against Azure Cosmos DB where the query subsequently runs against the collection's partitions in the data nodes. The response for those queries is sent back to the gateway node, and that result set is returned to the spark master node.  

* Subsequent queries (for example, against a spark data frame) are sent to the Spark worker nodes for processing.  

Communication between spark and Azure Cosmos DB is limited to the spark master node and Azure Cosmos DB gateway nodes. The queries go as fast as the transport layer between these two nodes allows.

Run the following steps to connect spark to Azure Cosmos DB by using pyDocumentDB SDK:

1. Create an [Azure Databricks workspace](../azure-databricks/quickstart-create-databricks-workspace-portal.md#create-an-azure-databricks-workspace) and a [spark cluster](../azure-databricks/quickstart-create-databricks-workspace-portal.md#create-a-spark-cluster-in-databricks) (Databricks runtime version 4.0 (includes Apache Spark 2.3.0, Scala 2.11) within that workspace.  

2. Once the cluster is created and is running, navigate to **Workspace** > **Create** > **Library**.  
3. From the New Library dialog box, choose **Upload Python Egg or PyPi** as the source, provide **pydocumentdb** as the name and select **Install Library**. PyDocumentdb SDK is already published to the pip packages so you can find it and install. 

   ![Create and attach library](./media/spark-connector/create-library.png)

4. After the library is installed, attach it to the cluster you created earlier.  

5. Next navigate to the **Workspace** > **Create** > **Notebook**.  

6. In the **Create Notebook** dialog box, enter a user-friendly name, choose **Python** as the language. From the drop down select the cluster that you created earlier and select **Create**.  

7. The simplicity of the communication transport makes execution of a query from spark to Azure Cosmos DB by using pyDocumentDB relatively simple. Next you will run few spark queries by using the flights sample data hosted in “doctorwho” Cosmos DB account which is publicly accessible. The HTML version of the notebook is hosted in the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark/tree/master) GitHub repository. You should download the repository files and navigate to `\samples\Documentation_Samples\Read_Batch_PyDocumentDB.html` you can import the notebook to your Azure Databricks account and run it. The following section explains the functionality of the code blocks in detailed.

The following code snippet shows how to import the pyDocumentDB SDK and run a query in the spark context. As noted in the code snippet, the pyDocumentDB SDK contains the connection parameters required to connect to the Azure Cosmos DB account. It imports the required libraries, configures master key and host to create the Azure Cosmos DB client (pydocumentdb.document_client).


```python
# Import Necessary Libraries
import pydocumentdb
from pydocumentdb import document_client
from pydocumentdb import documents
import datetime

# Configuring the connection policy (allowing for endpoint discovery)
connectionPolicy = documents.ConnectionPolicy()
connectionPolicy.EnableEndpointDiscovery
connectionPolicy.PreferredLocations = ["Central US", "East US 2", "Southeast Asia", "Western Europe","Canada Central"]

# Set keys to connect to Azure Cosmos DB
masterKey = 'le1n99i1w5l7uvokJs3RT5ZAH8dc3ql7lx2CG0h0kK4lVWPkQnwpRLyAN0nwS1z4Cyd1lJgvGUfMWR3v8vkXKA=='
host = 'https://doctorwho.documents.azure.com:443/'
client = document_client.DocumentClient(host, {'masterKey': masterKey}, connectionPolicy)

```

Next you can run queries, the following code snippet connects to the airports.codes collection in the DoctorWho account and runs a query to extract the airport cities in Washington state. 

```python
# Configure Database and Collections
databaseId = 'airports'
collectionId = 'codes'

# Configurations the Azure Cosmos DB client will use to connect to the database and collection
dbLink = 'dbs/' + databaseId
collLink = dbLink + '/colls/' + collectionId

# Set query parameter
querystr = "SELECT c.City FROM c WHERE c.State='WA'"

```

After the query is executed, the result is a “query_iterable.QueryIterable” that is converted to a Python list, which is then converted to a spark data frame. 

```python
# Query documents
query = client.QueryDocuments(collLink, querystr, options=None, partition_key=None)

# Query for partitioned collections
# query = client.QueryDocuments(collLink, query, options= { 'enableCrossPartitionQuery': True }, partition_key=None)

# Create `df` Spark DataFrame from `elements` Python list
df = spark.createDataFrame(list(query))

# Show data
df.show()
```

## Considerations when using pyDocumentDB SDK
Connecting spark to Azure Cosmos DB by using pyDocumentDB SDK is recommended in the following scenarios:

* You want to use Python.  

* You are returning a relatively small result set from Azure Cosmos DB to spark. Note that the underlying dataset in Azure Cosmos DB can be quite large and you are applying filters or running predicate filters against your Azure Cosmos DB source.

## Connect by using the Java SDK

The following image shows the architecture of Azure Cosmos DB SQL Java SDK implementation and data moves between the spark worker nodes:

![Data flow in the Spark to Azure Cosmos DB connector](./media/spark-connector/spark-connector.png)

### Data flow

The data flow of the Java SDK implementation is as follows:

* The spark master node connects to the Azure Cosmos DB gateway node to obtain the partition map. A user specifies only the spark and Azure Cosmos DB connections. Connections to the respective master and gateway nodes are transparent to the user.  

* This information is provided back to the spark master node. At this point, you should be able to parse the query to determine the partitions and their locations in Azure Cosmos DB that you need to access.  

* This information is transmitted to the spark worker nodes.  

* The spark worker nodes connect to the Azure Cosmos DB partitions directly to extract the data and return the data to the spark partitions in the worker nodes.  

Communication between spark and Azure Cosmos DB is significantly faster because of the data movement is between the spark worker nodes and the Azure Cosmos DB data nodes (partitions). In this document, you will send some sample twitter data to Azure Cosmos DB account and run spark queries by using that data. Use the following steps to write sample Twitter data to Azure Cosmos DB:

1. Create an [Azure Cosmos DB SQL API account](create-sql-api-dotnet.md#create-a-database-account) and [add a collection](create-sql-api-dotnet.md#add-a-collection) to the account.  

2. Download the [TwitterCosmosDBFeed](https://github.com/tknandu/TwitterCosmosDBFeed) sample from GitHub, which is used to write sample Twitter data to Azure Cosmos DB.  

3. Open a command prompt and install Tweepy and pyDocumentdb modules by running the following commands:

   ```bash
   pip install tweepy==3.3.0
   pip install pyDocumentDB
   ```

4. Extract the contents of Twitter feed sample and open the config.py file. Update the masterKey, host, databaseId, collectionId, and preferredLocations values.  

5. Navigate to `http://apps.twitter.com/` and register the Twitter feed script as a new application. After choosing a name and application for your app, you will be provided with a **consumer key, consumer secret, access token and access token secret**. Copy these values and update them in config.py file to provide the application programmatic access to Twitter.   

6. Save the config.py file. Open command prompt and run the python application by using the following command:

   ```bash
   Python driver.py
   ```

7. Navigate to the Azure Cosmos DB collection in the portal and verify that the twitter data is written to the collection.

### Find and attach Java SDK to the spark cluster

1. Create an [Azure Databricks workspace](../azure-databricks/quickstart-create-databricks-workspace-portal.md#create-an-azure-databricks-workspace) and a [spark cluster](../azure-databricks/quickstart-create-databricks-workspace-portal.md#create-a-spark-cluster-in-databricks) (Databricks runtime version 4.0 (includes Apache Spark 2.3.0, Scala 2.11) within that workspace.  

2. Once the cluster is created and is running, navigate to **Workspace** > **Create** > **Library**.  

3. From the New Library dialog box, choose **Maven Coordinate** as the source, provide the coordinate value **com.microsoft.azure:azure-cosmosdb-spark_2.3.0_2.11:1.2.0**, and select **Create Library**. The Maven dependencies are resolved, and the package is added to your workspace. In the above maven coordinate format, 2.3.0 represents the spark version, 2.11 represents the scala version, and 1.2.0 represents the Azure Cosmos DB connector version. 

4. After the library is installed, attach it to the cluster you created earlier. 

This article demonstrates the use of spark connector Java SDK in the following scenarios:

* Read twitter data from Azure Cosmos DB  

* Read twitter data that is streaming to Azure Cosmos DB  

* Write twitter data to Azure Cosmos DB 

### Read twitter data from Azure Cosmos DB
 
In this section, you run spark queries to read a batch of Twitter data from Azure Cosmos DB. The HTML version of the notebook is hosted in the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark/tree/master) GitHub repository. You should download the repository files and navigate to `\samples\Documentation_Samples\Read_Batch_Twitter_Data.html` you can import the notebook to your Azure Databricks account, update the account URI, master key, database, collection names and run it or you can create the notebook as follows:

1. Navigate to your Azure Databricks account and select the **Workspace** > **Create** > **Notebook**. 

2. In the **Create Notebook** dialog box, enter a user-friendly name, choose **Python** as the language, from the drop down select the cluster that you created earlier and select **Create**.  

3. Update the endpoint, master key, database and collection values to connect to the account and read tweets by using spark.read.format() command.

   ```python
   # Configuration Map
   tweetsConfig = {
   "Endpoint" : "<Your Azure Cosmos DB endpoint>",
   "Masterkey" : "<Primary key of your Azure Cosmos DB account>",
   "Database" : "<Your Azure Cosmos DB database name>",
   "Collection" : "<Your Azure Cosmos DB collection name>", 
   "preferredRegions" : "East US",
   "SamplingRatio" : "1.0",
   "schema_samplesize" : "200000",
   "query_custom" : "SELECT c.id, c.created_at, c.user.screen_name, c.user.lang, c.user.location, c.text, c.retweet_count, c.entities.hashtags, c.entities.user_mentions, c.favorited, c.source FROM c"
   }
   # Read Tweets
   tweets = spark.read.format("com.microsoft.azure.cosmosdb.spark").options(**tweetsConfig).load()
   tweets.createOrReplaceTempView("tweets")
   #tweets.cache()

   ```

4. Run the query to get the count of tweets by different hashtags from the cached data. 

   ```python
   %sql
   select hashtags.text, count(distinct id) as tweets
   from (
   select 
     explode(hashtags) as hashtags,
     id
   from tweets
   ) a
   group by hashtags.text
   order by tweets desc
   limit 10
   ```

Java SDK supports the following values for configuration mapping: 

|Setting  |Description  |
|---------|---------|
|query_maxdegreeofparallelism  | Sets the number of concurrent operations run at the client side during parallel query execution. If it is set to a value that is greater than 0, it limits the number of concurrent operations to the assigned value. If it is set to less than 0, the system automatically decides the number of concurrent operations to run. As the Connector maps each collection partition with an executor, this value won't have any effect on the reading operation.        |
|query_maxbuffereditemcount     |    Sets the maximum number of items that can be buffered at the client side during parallel query execution. If it is set to a value that is greater than 0, it limits the number of buffered items to the assigned value. If it is set to less than 0, the system automatically decides the number of items to buffer.     |
|query_enablescan    |   Sets the option to enable scans on the queries which couldn't be served because indexing was opted out on the requested paths.       |
|query_disableruperminuteusage  |  Disables Request Units(RUs)/minute capacity to serve the query if regular provisioned RUs/second is exhausted.       |
|query_emitverbosetraces   |   Sets the option to allow queries to emit out verbose traces for investigation.      |
|query_pagesize  |   Sets the size of the query result page for each query request. To optimize for throughput, use a large page size to reduce the number of round trips to fetch queries results.      |
|query_custom  |  Sets the Azure Cosmos DB query to override the default query when fetching data from Azure Cosmos DB. Note that when this value is provided, it will be used in place of a query with pushed down predicates as well.     |

Depending on the scenario, different configuration values should be used to optimize the performance and throughput. Note that the configuration key is currently case-insensitive, and the configuration value is always a string.

### Read twitter data that is streaming to Azure Cosmos DB

In this section, you run spark queries to read a change feed of streaming twitter data. While you run the queries in this section, make sure that your Twitter feed app is running and pumping data to Azure Cosmos DB. The HTML version of the notebook is hosted in the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark/tree/master) GitHub repository. You should download the repository files and navigate to `\samples\Documentation_Samples\Read_Stream_Twitter_Data.html` you can import the notebook to your Azure Databricks account, update the account URI, master key, database, collection names and run it or you can create the notebook as follows:

1. Navigate to your Azure Databricks account and select the **Workspace** > **Create** > **Notebook**.  

2. In the **Create Notebook** dialog box, enter a user-friendly name, choose **Scala** as the language, from the drop down select the cluster that you created earlier and select **Create**.  

3. Update the endpoint, master key, database and collection values to connect to the account.

   ```scala
   // This script does the following:
   // - creates a structured stream from a Twitter feed CosmosDB collection (on top of change feed)
   // - get the count of tweets
   import com.microsoft.azure.cosmosdb.spark._
   import com.microsoft.azure.cosmosdb.spark.schema._
   import com.microsoft.azure.cosmosdb.spark.config.Config
   import org.codehaus.jackson.map.ObjectMapper
   import com.microsoft.azure.cosmosdb.spark.streaming._
   import java.time._

   val sourceConfigMap = Map(
   "Endpoint" -> "<Your Azure Cosmos DB endpoint>",
   "Masterkey" -> "<Primary key of your Azure Cosmos DB account>",
   "Database" -> "<Your Azure Cosmos DB database name>",
   "Collection" -> "<Your Azure Cosmos DB collection name>", 
   "ConnectionMode" -> "Gateway",
   "ChangeFeedCheckpointLocation" -> "/tmp",
   "changefeedqueryname" -> "Streaming Query from Cosmos DB Change Feed Internal Count")
   ```
4. Start reading change feed as a stream by using the spark.readStream.format() command:

   ```scala
   var streamData = spark.readStream.format(classOf[CosmosDBSourceProvider].getName).options(sourceConfigMap).load()
   ```
5. Start streaming query to console:

   ```scala
   //**RUN THE ABOVE FIRST AND KEEP BELOW IN SEPARATE CELL
   val query = streamData.withColumn("countcol", streamData.col("id").substr(0,0)).groupBy("countcol").count().writeStream.outputMode("complete").format("console").start()
   ```

Java SDK supports the following values for configuration mapping:

|Setting  |Description  |
|---------|---------|
|readchangefeed   |  Indicates that the collection content is fetched from CosmosDB Change Feed. The default value is false.       |
|changefeedqueryname |   A custom string to identify the query. The connector keeps track of the collection continuation tokens for different change feed queries separately. If readchangefeedis true, this is a required configuration which cannot take empty value.      |
|changefeedcheckpointlocation  |   A path to local file storage to persist continuation tokens in case of node failures.      |
|changefeedstartfromthebeginning  |  Sets whether change feed should start from the beginning (true) or from the current point (false). By default, it starts from the current (false).       |
|rollingchangefeed  |   A Boolean value indicating whether the change feed should be from the last query. The default value is false, which means the changes will be counted from the first read of the collection.      |
|changefeedusenexttoken  |   A Boolean value to support processing failure scenarios. It is used to indicate that the current change feed batch has been handled gracefully and the RDD should use the next continuation tokens to get the subsequent batch of changes.      |
| InferStreamSchema | A Boolean value that indicated whether the schema of the streaming data should be sampled at the start of streaming. By default, this value is set to true. If this parameter is set to true and the streaming data’s schema changes after the data is sampled, newly added properties will be dropped in the streaming data frame. <br/><br/> If you want the streaming data frame to be schema agnostic, set this parameter to false. In this mode, the body of the documents read from Azure Cosmos DB change feed are wrapped into a ‘body’ property in the resultant streaming data frame aside from system property values.
 |

### Connection settings

Java SDK supports the following connection settings:

|Setting  |Description  |
|---------|---------|
|connectionmode   |  Sets the connection mode that the internal DocumentClient should use to communicate with Azure Cosmos DB. Allowed values are **DirectHttps** (default value) and **Gateway**. The DirectHttps connection mode routes the requests directly to the CosmosDB partitions and provides some latency advantage.       |
|connectionmaxpoolsize   |  Sets the value of connection pool size that is used by internal DocumentClient. The default value is 100.       |
|connectionidletimeout  |  Sets the timeout value for idle connections in seconds. The default value is 60.       |
|query_maxretryattemptsonthrottledrequests    |  Sets the maximum number of retries. This value is used in case of a request failure due to rate limiting on the client. If it's not specified, the default value is 1000 retry attempts.       |
|query_maxretrywaittimeinseconds   |  Sets the maximum retry time in seconds. By default, it is 1000 seconds.       |

### Write twitter data to Azure Cosmos DB 

In this section, you run spark queries to write a batch of twitter data to a new collection in the same database. The HTML version of the notebook is hosted in the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark/tree/master) GitHub repository. You should download the repository files and navigate to `\samples\Documentation_Samples\Write_Batch_Twitter_Data.html` you can import the notebook to your Azure Databricks account, update the account URI, master key, database, collection names and run it or you can create the notebook as follows:

1. Navigate to your Azure Databricks account and select the **Workspace** > **Create** > **Notebook**.  

2. In the **Create Notebook** dialog box, enter a user-friendly name, choose **Scala** as the language, from the drop down select the cluster that you created earlier and select **Create**.  

3. Update the endpoint, master key, database and collection values to connect to the database collection to read and write twitter data.

   ```scala
   %scala
   // Import Necessary Libraries
   import org.joda.time._
   import org.joda.time.format._
   import com.microsoft.azure.cosmosdb.spark.schema._
   import com.microsoft.azure.cosmosdb.spark._
   import com.microsoft.azure.cosmosdb.spark.config.Config

   // Maps
   val readConfigMap = Map(
   "Endpoint" -> "<Your Azure Cosmos DB endpoint>",
   "Masterkey" -> "<Primary key of your Azure Cosmos DB account>",
   "Database" -> "<Your Azure Cosmos DB database name>",
   "Collection" -> "<Your Azure Cosmos DB source collection name>", 
   "preferredRegions" -> "East US",
   "SamplingRatio" -> "1.0",
   "schema_samplesize" -> "200000",
   "query_custom" -> "SELECT c.id, c.created_at, c.user.screen_name, c.user.location, c.text, c.retweet_count, c.entities.hashtags, c.entities.user_mentions, c.favorited, c.source FROM c"
   )
   val writeConfigMap = Map(
   "Endpoint" -> "<Your Azure Cosmos DB endpoint>",
   "Masterkey" -> "<Primary key of your Azure Cosmos DB account>",
   "Database" -> "<Your Azure Cosmos DB database name>",
   "Collection" -> "<Your Azure Cosmos DB destination collection name>", 
   "preferredRegions" -> "East US",
   "SamplingRatio" -> "1.0",
   "schema_samplesize" -> "200000"
   ) 

   // Configs
   // get read
   val readConfig = Config(readConfigMap)
   val tweets = spark.read.cosmosDB(readConfig)
   tweets.createOrReplaceTempView("tweets")
   tweets.cache()

   // get write
   val writeConfig = Config(writeConfigMap)
   ```
4. Run the query to get the count of tweets by different hashtags from the cached data. 

   ```scala
   %sql
   select hashtags.text, count(distinct id) as tweets
   from (
   select 
     explode(hashtags) as hashtags,
     id
   from tweets
   ) a
   group by hashtags.text
   order by tweets desc
   limit 10
   ```

5. Create new data frame of tweets tags and save the data to the new collection. After running the following code, you can go back to portal and verify that the data is written to the collection. 

   ```scala
   %scala
   // Import SaveMode so you can Overwrite, Append, ErrorIfExists, Ignore
   import org.apache.spark.sql.{Row, SaveMode, SparkSession}

   // Create new DataFrame of tweets tags
   val tweets_bytags = spark.sql("select '2018-06-12' as currdt, hashtags.text as hashtags, count(distinct id) as tweets from ( select explode(hashtags) as hashtags, id from tweets ) a group by hashtags.text order by tweets desc limit 10")

   // Save to Cosmos DB (using Append in this case)
   // Ensure the baseConfig contains a Read-Write Key
   // The key provided in our examples is a Read-Only Key

   tweets_bytags.write.mode(SaveMode.Overwrite).cosmosDB(writeConfig)
   ```

Java SDK supports the following values for configuration mapping:

|Setting  |Description  |
|---------|---------|
| BulkImport | A Boolean value that indicates whether data should be imported by using the BulkExecutor library. By default, this value is set to true. |
|WritingBatchSize  |   Indicates the batch size to use when writing data to Azure Cosmos DB collection. <br/><br/> If BulkImport parameter is set to true, then WritingBatchSize parameter indicates the batch size of documents supplied as input to the importAll API of the BulkExecutor library. By default, this value is set to 100K. <br/><br/> If BulkImport parameter is set to false, then WritingBatchSize parameter indicates the batch size to use when writing to Azure Cosmos DB collection. The connector sends createDocument/upsertDocument requests asynchronously in batch. The larger the batch size the more throughput we can achieve as long as the cluster resources are available. On the other hand, specify a smaller number batch size to limit the rate and RU consumption. By default, writing batch size is set to 500.  |
|Upsert   |  A Boolean value string indicating whether upsertDocument should be used instead of CreateDocument when writing to CosmosDB collection.   |
| WriteThroughputBudget |  An integer string that represents the number of RU\s that you want to allocate to the bulk ingestion spark job out of the total throughput allocated to the collection. |


### Write twitter data that is streaming to Azure Cosmos DB 

In this section, you run spark queries to write change feed of streaming twitter data to a new collection in the same database. The HTML version of the notebook is hosted in the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark/tree/master) GitHub repository. You should download the repository files and navigate to `\samples\Documentation_Samples\Write_Stream_Twitter_Data.html` you can import the notebook to your Azure Databricks account, update the account URI, master key, database, collection names and run it or you can create the notebook as follows:

1. Navigate to your Azure Databricks account and select the **Workspace** > **Create** > **Notebook**.  

2. In the **Create Notebook** dialog box, enter a user-friendly name, choose **Scala** as the language, from the drop down select the cluster that you created earlier and select **Create**.  

3. Update the endpoint, master key, database and collection values to connect to the database collection to read and write twitter data.

   ```scala
   import com.microsoft.azure.cosmosdb.spark._
   import com.microsoft.azure.cosmosdb.spark.schema._
   import com.microsoft.azure.cosmosdb.spark.config.Config
   import com.microsoft.azure.cosmosdb.spark.streaming._

   // Configure connection to Azure Cosmos DB Change Feed (Trades)
   val ConfigMap = Map(
   // Account settings
   "Endpoint" -> "<Your Azure Cosmos DB endpoint>",
   "Masterkey" -> "<Primary key of your Azure Cosmos DB account>",
   "Database" -> "<Your Azure Cosmos DB database name>",
   "Collection" -> "<Your Azure Cosmos DB source collection name>", 
   // Change feed settings
   "ReadChangeFeed" -> "true",
   "ChangeFeedStartFromTheBeginning" -> "true",
   "ChangeFeedCheckpointLocation" -> "dbfs:/cosmos-feed",
   "ChangeFeedQueryName" -> "Structured Stream Read",
   "InferStreamSchema" -> "true"
   )
   ```
4. Start reading change feed as a stream by using the spark.readStream.format() command:
 
   ```scala
   // Start reading change feed of trades as a stream
   var streamdata = spark
     .readStream
     .format(classOf[CosmosDBSourceProvider].getName)
     .options(ConfigMap)
     .load()
   ```

5. Define the configuration of the destination collection and start the streaming job by using writeStream.format() method:

   ```scala
   val sinkConfigMap = Map(
   "Endpoint" -> "<Your Azure Cosmos DB endpoint>",
   "Masterkey" -> "<Primary key of your Azure Cosmos DB account>",
   "Database" -> "<Your Azure Cosmos DB database name>",
   "Collection" -> "<Your Azure Cosmos DB destination collection name>", 
   "checkpointLocation" -> "streamingcheckpointlocation6",
   "WritingBatchSize" -> "100",
   "Upsert" -> "true")

   // Start the stream writer
   val streamingQueryWriter = streamdata
    .writeStream
    .format(classOf[CosmosDBSinkProvider].getName)
    .outputMode("append")
    .options(sinkConfigMap)
    .start()
 ```

Java SDK supports the following values for configuration mapping:

|Setting  |Description  |
|---------|---------|
|Upsert   |  A Boolean value string indicating whether upsertDocument should be used instead of CreateDocument when writing to CosmosDB collection.   |
|checkpointlocation  |   A path to local file storage to persist continuation tokens in case of node failures.   |
|WritingBatchSize  |  Indicates the batch size to use when writing data to Azure Cosmos DB collection. The connector sends createDocument/upsertDocument requests asynchronously in batch. The larger the batch size the more throughput we can achieve as long as the cluster resources are available. On the other hand, specify a smaller number batch size to limit the rate and RU consumption. By default, writing batch size is set to 500.  |


## Considerations when using Java SDK

Connecting spark to Azure Cosmos DB by using Java SDK is recommended in the following scenarios:

* You want to use Python and/or Scala.  

* You have a large amount of data to transfer between Apache Spark and Azure Cosmos DB, the Java SDK has higher performance when compared to the pyDocumentDB. To give you an idea about the query performance difference, see the [Query Test Runs wiki](https://github.com/Azure/azure-cosmosdb-spark/wiki/Query-Test-Runs).

## Next steps

If you haven't already, download the Spark to Azure Cosmos DB connector from the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark) GitHub repository and explore the additional resources in the repo:

* [Distributed Aggregations Examples](https://github.com/Azure/azure-cosmosdb-spark/wiki/Aggregations-Examples)
* [Sample Scripts and Notebooks](https://github.com/Azure/azure-cosmosdb-spark/tree/master/samples)

You might also want to review the [Apache Spark SQL, DataFrames, and Datasets Guide](http://spark.apache.org/docs/latest/sql-programming-guide.html) and the [Apache Spark on Azure HDInsight](../hdinsight/spark/apache-spark-jupyter-spark-sql.md) article.
