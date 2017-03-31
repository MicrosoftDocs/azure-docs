---
title: Connecting Apache Spark to Azure DocumentDB | Microsoft Docs
description: Learn about the Azure DocumentDB Spark connector allowing you to connect Apache Spark to Azure DocumentDB to perform distributed aggregations and data sciences on Microsoft's multi-tenant globallly distributed database system designed for the cloud.
keywords: DocumentDB, NoSQL, connector, Spark, Apache Spark, data scienes, distributed aggregations
services: documentdb
documentationcenter: ''
author: denlee
manager: jhubbard
editor: monicar

ms.assetid: a73b4ab3-0786-42fd-b59b-555fce09db6e
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/24/2017
ms.author: denlee

---

This [azure-documentdb-spark](https://github.com/Azure/azure-documentdb-spark/) is in *public preview*; the project provides a client library that allows Azure DocumentDB to act as an input source or output sink for Spark jobs.  This connector involves the following components:

* [Azure DocumentDB](http://documentdb.com) is Microsoft’s multi-tenant, [globally distributed database system](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-distribute-data-globally) designed for the cloud. DocumentDB allows customers to provision and elastically scale both, throughput as well as storage across any number of geographical regions. The service offers guaranteed low latency at the 99th percentile, a guaranteed 99.99% high availability and [multiple well-defined consistency models](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-consistency-levels) to developers.

* [Apache Spark](http://spark.apache.org/) is a powerful open source processing engine built around speed, ease of use, and sophisticated analytics. 

* [Apache Spark on Azure HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql): You can deploy Apache Spark in the cloud for mission critical deployments using [Azure HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/apache-spark/).

Fast connectivity between Apache Spark and Azure DocumentDB accelerates your ability to solve your fast moving Data Sciences problems where your data can be quickly persisted and retrieved using Azure DocumentDB. With the Spark to DocumentDB connector, you can more easily solve scenarios including (but not limited to) blazing fast IoT scenarios, update-able columns when performing analytics, push-down predicate filtering, and performing advanced analytics to data sciences against your fast changing data against a geo-replicated managed document store with guaranteed SLAs for consistency, availability, low latency, and throughput.



Officially supported versions:

| ...       | Version |
| --------- | ------- |
| Apache Spark     | 2.0+    |
| Scala     | 2.11    |
| Azure DocumentDB Java SDK | 1.9.6 |
 
This user guide helps you run some simple samples with the python (via `pyDocumentDB`) and scala interface.


There will be two approaches for connectivity between Apache Spark and Azure DocumentDB:
- Using `pyDocumentDB` ([Azure DocumentDB Python SDK](https://github.com/Azure/azure-documentdb-python))
- Create a Java-based Spark-DocumentDB connector based utilizing the [Azure DocumentDB Java SDK](https://github.com/Azure/azure-documentdb-java).

## pyDocumentDB
The current [`pyDocumentDB SDK`](https://github.com/Azure/azure-documentdb-python) allows us to connect `Spark` to `DocumentDB` via the following diagram flow.

![Spark to DocumentDB Data Flow via pyDocumentDB](https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/Azure-DocumentDB-Spark_pyDocumentDB.png)

The data flow is as follows:

1. Connection is made from Spark master node to DocumentDB gateway node via `pyDocumentDB`.  Note, user only specifies Spark and DocumentDB connections, the fact that it connects to the respective master and gateway nodes is transparent to the user.
2. Query is made against DocuemntDB (via the gateway node) where the query subsequently runs the query against the collection's partitions in the data nodes.   The response for those queries is sent back to the gateway node and that resultset is returned to Spark master node.
3. Any subsequent queries (e.g. against a Spark DataFrame) is sent to the Spark worker nodes for processing.

The important call out is that communication between Spark and DocumentDB is limited to the Spark master node and DocumentDB gateway nodes.  The queries will go as fast as the transport layer is between these two nodes.

### Installing pyDocumentDB
You can install `pyDocumentDB` on your driver node using `pip`, i.e:

```
pip install pyDocumentDB
```


### Connecting Spark to DocumentDB via pyDocumentDB 
But in return for the simplicity of the communication transport, executing a query from Spark to DocumentDB using `pyDocumentDB` is relatively simple.

Below is a code snippet on how to use `pyDocumentDB` within a Spark context.

```
# Import Necessary Libraries
import pydocumentdb
from pydocumentdb import document_client
from pydocumentdb import documents
import datetime

# Configuring the connection policy (allowing for endpoint discovery)
connectionPolicy = documents.ConnectionPolicy()
connectionPolicy.EnableEndpointDiscovery 
connectionPolicy.PreferredLocations = ["Central US", "East US 2", "Southeast Asia", "Western Europe","Canada Central"]


# Set keys to connect to DocumentDB 
masterKey = 'le1n99i1w5l7uvokJs3RT5ZAH8dc3ql7lx2CG0h0kK4lVWPkQnwpRLyAN0nwS1z4Cyd1lJgvGUfMWR3v8vkXKA==' 
host = 'https://doctorwho.documents.azure.com:443/'
client = document_client.DocumentClient(host, {'masterKey': masterKey}, connectionPolicy)
```

As noted in the code snippet:

* The DocumentDB python SDK contains the all the necessary connection parameters including the preferred locations (i.e. choosing which read replica in what priority order).
*  Just import the necessary libraries and configure your `masterKey` and `host` to create the DocumentDB *client* (`pydocumentdb.document_client`).


### Executing Spark Queries via pyDocumentDB
Below is an examples using the above `DocumentDB` instance via the specified `read-only` keys.  This code snippet below connects to the `airports.codes` collection (in the DoctorWho account as specified earlier) running a query to extract the airport cities in Washington state. 

```
# Configure Database and Collections
databaseId = 'airports'
collectionId = 'codes'

# Configurations the DocumentDB client will use to connect to the database and collection
dbLink = 'dbs/' + databaseId
collLink = dbLink + '/colls/' + collectionId


# Set query parameter
querystr = "SELECT c.City FROM c WHERE c.State='WA'"

# Query documents
query = client.QueryDocuments(collLink, querystr, options=None, partition_key=None)

# Query for partitioned collections
# query = client.QueryDocuments(collLink, query, options= { 'enableCrossPartitionQuery': True }, partition_key=None)

# Push into list `elements`
elements = list(query)
```

Once the query has been executed via `query`, the result is a `query_iterable.QueryIterable` that is converted into a Python list. A Python list can be easily converted into a Spark DataFrame using the code below.

```
# Create `df` Spark DataFrame from `elements` Python list
df = spark.createDataFrame(elements)
```

### Scenarios
Connecting Spark to DocumentDB using `pyDocumentDB` are typically for scenarios where:

* You want to use `python`
* You are returning a relatively small resultset from DocumentDB to Spark.  Note, the underlying dataset within DocumentDB can be quite large.  It is more that you are applying filters - i.e. running predicate filters - against your DocumentDB source.  

.

## Spark to DocumentDB Connector

> IMPORTANT: This experimental connector is in public preview

The Spark to DocumentDB connector that will utilize the [Azure DocumentDB Java SDK](https://github.com/Azure/azure-documentdb-java) will utilize the following flow:

![](https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/Azure-DocumentDB-Spark_Connector.png)

The data flow is as follows:

1. Connection is made from Spark master node to DocumentDB gateway node to obtain the partition map.  Note, user only specifies Spark and DocumentDB connections, the fact that it connects to the respective master and gateway nodes is transparent to the user.
2. This information is provided back to the Spark master node.  At this point, we should be able to parse the query to determine which partitions (and their locations) within DocumentDB we need to access.
3. This information is transmitted to the Spark worker nodes ...
4. Thus allowing the Spark worker nodes to connect directly to the DocumentDB partitions directly to extract the data that is needed and bring the data back to the Spark partitions within the Spark worker nodes.

The important call out is that communication between Spark and DocumentDB is significantly faster because the data movement is between the Spark worker nodes and the DocumentDB data nodes (partitions).

### Building the Azure DocumentDB Spark Connector
Currently, this connector project uses maven so to build without dependencies, you can run:
```
mvn clean package
```
You can also download the latest versions of the jar within the *releases* folder.

### Including the Azure DocumentDB Spark JAR
Prior to executing any code, you will first need to include the Azure DocumentDB Spark JAR.  If you are using the `spark-shell`, then you can include the JAR using the `--jars` option.  

```
spark-shell --master $master --jars /$location/azure-documentdb-spark-0.0.1-jar-with-dependencies.jar
```

or if you want to execute the jar without dependencies:

```
spark-shell --master $master --jars /$location/azure-documentdb-spark-0.0.1.jar,/$location/azure-documentdb-1.9.6.jar
```

If you are using a notebook service such as Azure HDInsight Jupyter notebook service, you can use the `spark magic` commands:

```
%%configure
{ "jars": ["wasb:///example/jars/azure-documentdb-1.9.6.jar","wasb:///example/jars/azure-documentdb-spark-0.0.1.jar"],
  "conf": {
    "spark.jars.excludes": "org.scala-lang:scala-reflect"
   }
}
```

The `jars` command allows you to include the two jars needed for `azure-documentdb-spark` (itself and the Azure DocumentDB Java SDK) and excludes `scala-reflect` so it does not interfere with the Livy calls made (Jupyter notebook > Livy > Spark).


### Connecting Spark to DocumentDB via the azure-documentdb-spark
While the communication transport is a little more complicated, executing a query from Spark to DocumentDB using `azure-documentdb-spark` is significantly faster.

Below is a code snippet on how to use `azure-documentdb-spark` within a Spark context.

```
// Import Necessary Libraries
import org.joda.time._
import org.joda.time.format._
import com.microsoft.azure.documentdb.spark.schema._
import com.microsoft.azure.documentdb.spark._
import com.microsoft.azure.documentdb.spark.config.Config

// Configure connection to your collection
val readConfig2 = Config(Map("Endpoint" -> "https://doctorwho.documents.azure.com:443/",
"Masterkey" -> "le1n99i1w5l7uvokJs3RT5ZAH8dc3ql7lx2CG0h0kK4lVWPkQnwpRLyAN0nwS1z4Cyd1lJgvGUfMWR3v8vkXKA==",
"Database" -> "DepartureDelays",
"preferredRegions" -> "Central US;East US2;",
"Collection" -> "flights_pcoll", 
"SamplingRatio" -> "1.0"))
 
// Create collection connection 
val coll = spark.sqlContext.read.DocumentDB(readConfig2)
coll.createOrReplaceTempView("c")
```

As noted in the code snippet:

- `azure-documentdb-spark` contains the all the necessary connection parameters including the preferred locations (i.e. choosing which read replica in what priority order).
- Just import the necessary libraries and configure your masterKey and host to create the DocumentDB client.

### Executing Spark Queries via azure-documentdb-spark

Below is an example using the above DocumentDB instance via the specified read-only keys. This code snippet below connects to the DepartureDelays.flights_pcoll collection (in the DoctorWho account as specified earlier) running a query to extract the flight delay information of flights departing from Seattle.

```
// Queries
var query = "SELECT c.date, c.delay, c.distance, c.origin, c.destination FROM c WHERE c.origin = 'SEA'"
val df = spark.sql(query)

// Run DF query (count)
df.count()

// Run DF query (show)
df.show()
```

### Scenarios

Connecting Spark to DocumentDB using `azure-documentdb-spark` are typically for scenarios where:

* You want to use Scala (we will update it to include a Python wrapper as noted in [Issue 3: Add Python wrapper and examples](https://github.com/Azure/azure-documentdb-spark/issues/3)
* You have a large amount of data to transfer between Apache Spark and DocumentDB


To give you an idea of the query performance difference, please refer to [Query Test Runs](https://github.com/Azure/azure-documentdb-spark/wiki/Query-Test-Runs) in this wiki.

## Distributed Aggregation Example
Below are some examples of how you can do distributed aggregations and analytics using Apache Spark and Azure DocumentDB together.  Note, Azure DocumentDB already has support for aggregations (link to blog goes here) so here is how you can take it to the next level with Apache Spark.

Note, these aggregations are in reference to the [Spark to DocumentDB Connector Notebook](https://github.com/Azure/azure-documentdb-spark/blob/master/samples/notebooks/Spark-to-DocumentDB_Connector.ipynb)

### Connecting to Flights Sample Data
For these aggregations examples, we are accessing some flight performance data stored in our **DoctorWho** DocumentDB database.  To connect to it, you will need to utilize the following code snippet below:

```
// Import Spark to DocumentDB Connector
import com.microsoft.azure.documentdb.spark.schema._
import com.microsoft.azure.documentdb.spark._
import com.microsoft.azure.documentdb.spark.config.Config

// Connect to DocumentDB Database
val readConfig2 = Config(Map("Endpoint" -> "https://doctorwho.documents.azure.com:443/",
"Masterkey" -> "le1n99i1w5l7uvokJs3RT5ZAH8dc3ql7lx2CG0h0kK4lVWPkQnwpRLyAN0nwS1z4Cyd1lJgvGUfMWR3v8vkXKA==",
"Database" -> "DepartureDelays",
"preferredRegions" -> "Central US;East US 2;",
"Collection" -> "flights_pcoll", 
"SamplingRatio" -> "1.0"))

// Create collection connection 
val coll = spark.sqlContext.read.DocumentDB(readConfig2)
coll.createOrReplaceTempView("c")
```

With this, we will also run a base query which transfer the filtered set of data we want from DocumentDB to Spark (where the latter can perform distributed aggregates).  In this case, we are asking for flights departing from Seattle (SEA).

```
// Run, get row count, and time query
val originSEA = spark.sql("SELECT c.date, c.delay, c.distance, c.origin, c.destination FROM c WHERE c.origin = 'SEA'")
originSEA.createOrReplaceTempView("originSEA")
```

The results below are from running the queries using Jupyter notebook service.  Note, all of these code snippets are generic and not specific to any service.

### Running LIMIT and COUNT queries
Just like you're used to in SQL / Spark SQL, let's start off with a `LIMIT` query:

<img src="https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/aggregations/1.%20Spark%20SQL%20Query.png" width=650px>


The next query being a simple and fast `COUNT` query:

<img src="https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/aggregations/2.%20Count%20Query.png" width=650px>


### GROUP BY query
In this next set, now we can easily run `GROUP BY` queries against our DocumentDB database:

```
select destination, sum(delay) as TotalDelays 
from originSEA 
group by destination 
order by sum(delay) desc limit 10
```
<img src="https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/aggregations/4.%20Group%20By%20Query%20Graph.png" width=650px>


### DISTINCT, ORDER BY query
And here is a `DISTINCT, ORDER BY` query:

<img src="https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/aggregations/5.%20Order%20By%20Query.png" width=650px>


### Continuing Flights Data Analysis
Below are some example queries to continue the analysis of our flights data:

#### Top 5 Delayed Destinations (Cities) departing from Seattle
```
select destination, sum(delay) 
from originSEA
where delay < 0 
group by destination 
order by sum(delay) limit 5
```
<img src="https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/aggregations/7.%20Top%205%20Delays%20Seattle%20Graph.png" width=650px>


#### Calculate median delays by destination cities departing from Seattle
```
select destination, percentile_approx(delay, 0.5) as median_delay 
from originSEA
where delay < 0 
group by destination 
order by percentile_approx(delay, 0.5)
```

<img src="https://github.com/Azure/azure-documentdb-spark/blob/master/docs/images/aggregations/9.%20Median%20Delay%20Graph.png" width=650px>


## References
For more information, please refer to:

* [azure-documentdb-spark](https://github.com/Azure/azure-documentdb-spark) GitHub repository
 * [Azure DocumentDB Spark Connector User Guide](https://github.com/Azure/azure-documentdb-spark/wiki/Azure-DocumentDB-Spark-Connector-User-Guide)
 * [Distributed Aggregations Examples](https://github.com/Azure/azure-documentdb-spark/wiki/Aggregations-Examples)
 * [Sample Scripts and Notebooks](https://github.com/Azure/azure-documentdb-spark/tree/master/samples)
* [Azure DocumentDB](http://documentdb.com)
* [Apache Spark](http://spark.apache.org/)
* [Apache Spark SQL, DataFrames and Datasets Guide](http://spark.apache.org/docs/latest/sql-programming-guide.html)
* [Apache Spark on Azure HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql)



