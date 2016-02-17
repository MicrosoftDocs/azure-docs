<properties
   pageTitle="Maximizing Data Aggregation and Query Performance with Elasticsearch on Azure | Microsoft Azure"
   description="A summary of considerations when optimizing query and search performance for Elasticsearch."
   services=""
   documentationCenter="na"
   authors="mabsimms"
   manager="marksou"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="01/29/2016"
   ms.author="mabsimms"/>
   
# Maximizing Data Aggregation and Query Performance with Elasticsearch on Azure

This article is [part of a series](guidance-elasticsearch-introduction.md). 

A primary reason for using Elasticsearch is to support searches through data. Users should be able to quickly locate the information for which they are looking. Additionally, the system must enable users to ask questions of the data, seek correlations, and come to conclusions that can drive business decisions; this processing is what differentiates data from information.

This document summarizes options that you can consider when determining the best way to optimize your system for query and search performance.

All performance recommendations depend largely on the scenarios that apply to your situation, the volume of data that you are indexing, and the rate at which applications and users query your data. You should carefully test the results of any change in configuration or indexing structure using your own data and workloads to assess the benefits to your specific scenarios. To this end, this document also describes a number of benchmarks that were performed for one specific scenario implemented by using different configurations. You can adapt the approach taken to assess the performance of your own systems. 

## Index and Query Performance Considerations

This section describes some common factors that you should think about when designing indexes that need to support fast querying and searching.

### Storing Multiple Types in an Index

An Elasticsearch index can contain multiple types. It may be better to avoid this approach and create a separate index for each type. Consider the following points:

- Different types might specify different analyzers, and it is not always clear which analyzer Elasticsearch should use if a query is performed at the index level rather than at the type level. See [Avoiding Type Gotchas](https://www.elastic.co/guide/en/elasticsearch/guide/current/mapping.html#_avoiding_type_gotchas) for details.

Shards for indexes that hold multiple types will likely be bigger than those for indexes that contain a single type. The bigger a shard, the more effort is required by Elasticsearch to filter data when performing queries.

If there is a significant mismatch between data volumes for the types, information for one type can become sparsely distributed across many shards reducing the efficiency of searches that retrieve this data.

![](./media/guidance-elasticsearch/query-performance1.png)

***Figure 1. The effects of sharing an index between types***

Figure 1 depicts this scenario. In the upper part of the diagram, the same index is shared by documents of type A and type B. There are many more documents of type A than type B. Searches for type A will involve querying all four shards. The lower part of the diagram shows the effect if separate indexes are created for each type. In this case, searches for type A will only require accessing two shards.

Small shards can be more evenly distributed than large shards, making it easier for Elasticsearch to spread the load across nodes.

Different types might have different retention periods. It can be difficult to archive old data that shares shards with active data.

However, under some circumstances sharing an index across types can be efficient if:

- Searches regularly span types held in the same index.

- The types only have a small number of documents each; maintaining a separate set of shards for each type can become a significant overhead in this case.

### Optimizing Index Types

An Elasticsearch index contains a copy of the original JSON documents that were used to populate it. This information is held in the [*\_source*](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html#mapping-source-field) field of each indexed item. This data is not searchable, but by default is returned by *get* and *search* requests. However, this field incurs overhead and occupies storage, making shards larger and increasing the volume of I/O performed. You can disable the *\_source* field on a per type basis:

```http
PUT my_index
{
    "mappings": {
		"my_type": {
			"_source": {
				"enabled": false
			}
		}
	}
}
```

Disabling this field also removes the ability to perform the following operations:

- Updating data in the index by using the *update* API.
- Performing searches that return highlighted data.
- Re-indexing from one Elasticsearch index directly to another.
- Changing mappings or analysis settings.
- Debugging queries by viewing the original document.
 
### Re-indexing Data

The number of shards available to an index ultimately determines the capacity of the index. You can take an initial (and informed) guess at how many shards will be required, but you should always consider your document re-indexing strategy up front. In many cases, re-indexing may be an intended task as data grows; you may not want to allocate a large number of shards to an index initially, for the sake of search optimization, but allocate new shards as the volume of data expands. In other cases re-indexing might need to be performed on a more ad-hoc basis if your estimates about data volume growth simply prove to be inaccurate.

> [AZURE.NOTE] Re-indexing might not be necessary for data that ages quickly. In this case, an application might create a new index for each period of time. Examples include performance logs or audit data which could be stored in a fresh index each day.

Re-indexing effectively involves creating a new index from the data in an old one, and then removing the old index. If an index is large, this process can take time, and you may need to ensure that the data remains searchable during this period. For this reason, you should create an [alias for each index](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-aliases.html), and queries should retrieve data through these aliases. While re-indexing, keep the alias pointing at the old index, and then switch it to reference the new index once re-indexing is complete. This approach is also useful for accessing time-based data which creates a new index each day; to access the current data use an alias that rolls over to the new index as it is created.

<!-- TODO - internal link to query tuning -->

<span id="_Query_Tuning" class="anchor"><span id="_Optimizing_Resources_for" class="anchor"></span></span>

### Managing Mappings

Elasticsearch uses mappings to determine how to interpret the data that occurs in each field in a document. Each type has its own mapping, which effectively defines a schema for that type. Elasticsearch uses this information to generate inverted indexes for each field in the documents in a type. In any document, each field has a datatype (such as *string*, *date*, or *long*) and a value. You can specify the mappings for an index when the index is first created, or they can be inferred by Elasticsearch when new documents are added to a type. However, consider the following points:

- Mappings generated dynamically can cause errors depending on how fields are interpreted when documents are added to an index. For example, document 1 could contain a field A that holds a number and causes Elasticsearch to add a mapping that specifies that this field is a *long*. If a subsequent document is added in which field A contains non-numeric data, then it will fail. In this case, field A should probably have been interpreted as a string when the first document was added. Specifying this mapping when the index is created can help to prevent such problems.

- Design your documents to avoid generating excessively large mappings as this can add significant overhead when performing searches, consume lots of memory, and also cause queries to fail to find data. Adopt a consistent naming convention for fields in documents that share the same type. For example, don’t use field names such as "first\_name", "FirstName", and "forename" in different documents; use the same field name in each document. Additionally, do not attempt to use values as keys (this is a common approach in Column-Family databases, but can cause inefficiencies and failures with Elasticsearch.) For more information, see [Mapping Explosion](https://www.elastic.co/blog/found-crash-elasticsearch#mapping-explosion).

- Use *not\_analyzed* to avoid tokenization where appropriate. For example, if a document contains a string field named *data* that holds the value "ABC-DEF" then you might attempt to perform a search for all documents that match this value as follows:

```http
GET /myindex/mydata/_search
{
	"query" : {
		"filtered" : {
			"filter" : {
				"term" : {
					"data" : "ABC-DEF"
				}
			}
		}
	}
}
```

However, this search will fail to return the expected results due to the way in which the string ABC-DEF is tokenized when it is indexed; it will be effectively split into two tokens, ABC and DEF, by the hyphen. This feature is designed to support full text searching, but if you want the string to be interpreted as a single atomic item you should disable tokenization when the document is added to the index. You can use a mapping such as this:

```http
PUT /myindex
{
	"mappings" : {
		"mydata" : {
			"properties" : {
				"data" : {
					"type" : "string",
					"index" : "not_analyzed"
				}
			}
		}
	}
}
```

For more information, see [Finding Exact Values](https://www.elastic.co/guide/en/elasticsearch/guide/current/_finding_exact_values.html#_term_filter_with_text).

### Using Doc Values

Many queries and aggregations require that data is sorted as part of the search operation. Sorting requires being able to map one or more terms to a list of documents. To assist in this process, Elasticsearch can load all of the values for a field used as a sort key into memory. This information is known as *fielddata*. The intent is that caching fielddata in memory incurs less I/O and might be faster than repeatedly reading the same data from disk. However, if a field has high cardinality then storing the fielddata in memory can consume a lot of heap space, possibly impacting the ability to perform other concurrent operations, or even exhausting storage causing Elasticsearch to fail.

As an alternative approach, Elasticsearch also supports *doc values*. A doc value is similar to an item of in-memory fielddata except that it is stored and disk and created when data is stored in an index (fielddata is constructed dynamically when a query is performed.) Doc values do not consume heap space, and so are useful for queries that sort or aggregate data across fields that can contain a very large number of unique values. Additionally, the reduced pressure on the heap can help to offset the performance differences between retrieving data from disk and reading from memory; garbage collection is likely to occur less often, and other concurrent operations that utilize memory are less likely to be effected.

You enable or disable doc values on a per-property basis in an index using the *doc\_values* attribute, as shown by the following example:

```http
PUT /myindex
{
	"mappings" : {
		"mydata" : {
			"properties" : {
				"data" : {
					...
				"doc_values": true
				}
			}
		}
	}
}
```

> [AZURE.NOTE] Doc values are enabled by default with Elasticsearch version 2.0.0 onwards.

The exact impact of using doc values is likely to be highly specific to your own data and query scenarios, so be prepared to conduct performance testing to establish their usefulness. You should also note that doc values do not work with analyzed string fields. For more information, see [Doc Values](https://www.elastic.co/guide/en/elasticsearch/guide/current/doc-values.html#doc-values).

### Using Client Nodes

All queries are processed by the node that first receives the request. This node sends further requests to all other nodes containing shards for the indices being queried, and then accumulates the results for returning the response. If a query involves aggregating data or performing complex computations, the initial node is responsible for performing the appropriate processing. If your system has to support a relatively small number of complex queries, consider creating a pool of client nodes to alleviate the load from the data nodes. Conversely, if your system has to handle a large number of simple queries, then submit these requests direct to the data nodes, and use a load balancer to distribute the requests evenly.

### Using Replicas to Reduce Query Contention

A common strategy to boost the performance of queries is to create many replicas of each index. Data retrieval operations can be satisfied by fetching data from a replica. However, this strategy can severely impact the performance of data ingestion operations, so it needs to be used with care in scenarios that involve mixed workloads. Additionally, this strategy is only of benefit if replicas are distributed across nodes and do not compete for resources with primary shards that are part of the same index. Remember that it is possible to increase or decrease the number of replicas for an index dynamically.

### Using the Shard Request Cache

Elasticsearch can cache the local data requested by queries on each shard in memory. This enables queries that access the same data to run more quickly; data can be retrieved from memory rather than disk storage. The data in the cache is invalidated when the shard is refreshed and the data has changed; the frequency of refreshes is governed by the value of the *refresh\_interval* setting of the index. The shard request cache for an index is disabled by default, but you can enable it as follows:

```http
PUT /myindex/_settings
{
	"index.requests.cache.enable": true
}
```

The shard request cache is most suitable for information that remains relatively static, such as historical or logging data.

## Testing and Analyzing Aggregation and Search Performance
This section describes the results of a series of tests that were performed against varying cluster and index configurations. Each test started with an empty index which was populated as the test proceeded by performing bulk insert operations (each operation added 1000 documents). At the same time, a number of queries designed to search for specific data and to generate aggregations were repeated at 5 second intervals. The purpose of the tests was to establish how query performance was effected by the volume of data.

Each document in the index had the same schema. This table summarizes the fields in the schema:

  Name                          | Type         | Notes |
  ----------------------------- | ------------ | -------------------------------------------------------- |
  Organization                  | String      | The test generates 200 unique organizations. |
  CustomField1 - CustomField5   |String       |These are five string fields which are set to the empty string.|
  DateTimeRecievedUtc           |Timestamp    |The date and time at which the document was added.|
  Host                          |String       |This field is set to the empty string.|
  HttpMethod                    |String       |This field is set to one of the following values: “POST”,”GET”,”PUT”.|
  HttpReferrer                  |String       |This field is set to the empty string.|
  HttpRequest                   |String       |This field is populated with random text between 10 and 200 characters in length.|
  HttpUserAgent                 |String       |This field is set to the empty string.|
  HttpVersion                   |String       |This field is set to the empty string.|
  OrganizationName              |String       |This field is set to the same value as the Organization field.|
  SourceIp                      |IP           |This field contains an IP address indicating the "origin" of the data. |
   SourceIpAreaCode              |Long         |This field is set to 0.|
  SourceIpAsnNr                 |String       |This field is set to "AS\#\#\#\#\#".|
  SourceIpBase10                |Long         |This field is set to 500.|
  SourceIpCountryCode           |String       |This field contains a 2-character country code. |
  SourceIpCity                  |String       |This field contains a string identifying a city in a country. |
  SourceIpLatitude              |Double       |This field contains a random value.|
  SourceIpLongitude             |Double       |This field contains a random value.|
  SourceIpMetroCode             |Long         |This field is set to 0.|
  SourceIpPostalCode            |String       |This field is set to the empty string.|
  SourceLatLong                 |Geo\_point   |This field is set to a random geo point.|
  SourcePort                    |String       |This field is populated with the string representation of a random number|
  TargetIp                      |IP           |This is populated with a random IP address in the range 0.0.100.100 to 255.9.100.100|
  SourcedFrom                   |String       |This field is set to the string “MonitoringCollector”.|
  TargetPort                    |String       |This field is populated with the string representation of a random number|
  Rating                        |String       |This field is populated with one of 20 different string values selected at random.|
  UseHumanReadableDateTimes     |Boolean      |This field is set to false.|

The following queries were performed as a batch by each iteration of the test (the names in italics are used to refer to these queries in the remainder of this document):

- How many documents with each *Rating* value have been entered in the last 15 minutes (*Count By Rating*)?

- How many documents have been added in each 5 minute interval during the last 15 minutes (*Count Over Time*)?

- How many documents of each *Rating* value have been added for each country in the last 15 minutes (*Hits By Country*)?

- Which 15 organizations occur most frequently in documents added in the last 15 minutes (*Top 15 Organizations*)?

- How many different organizations occur in documents added in the last 15 minutes (*Unique Count Organizations*)?

- How many documents have been added in the last 15 minutes (*Total Hits Count*)?

- How many different *SourceIp* values occur in documents added in the last 15 minutes (*Unique IP Count*)?

<!-- The definition of the index and the details of the queries are outlined in the [appendix](#appendix-the-query-and-aggregation-performance-test).
-->
The tests were performed to understand the effects of the following variables:

- **Disk type**. The test was performed on a 6-node cluster of D4 VMs using standard storage (HDDs) and repeated on a 6-node cluster of DS4 VMs using premium storage (SSDs).

- **Machine size - scaling up**. The test was performed on a 6-node cluster comprising DS3 VMs (designated as the *small* cluster), repeated on a cluster of DS4 VMs (the *medium* cluster), and repeated again on a cluster of DS14 machines (the *large* cluster). The following table summarizes the key characteristics of each VM SKU:

Cluster   |VM SKU          |Number of Cores   |Number of Data Disks   |RAM (GB)|
--------- |--------------- |----------------- |---------------------- |--------|
Small     |Standard DS3    |4                 |8                      |14      |
Medium    |Standard DS4    |8                 |16                     |28      |
Large     |Standard DS14   |16                |32                     |112     |

<!--
- **Cluster size - scaling out**. The test was performed on clusters of DS14 VMs comprising 1, 3, and 6 nodes.

- **Number of index replicas**. The test was performed using indexes configured with 1 and 2 replicas.
-->

- **Doc values**. Initially the tests were performed with the index setting *doc\_values* set to *true*. Selected tests were repeated with *doc_values* set to *false*.

<!--
- **Caching**. The test was conducted with the shard request cache enabled on the index.

- **Dedicated client nodes**. The test was performed by using a pool of dedicated client nodes to connect applications performing queries to the cluster.

- **Number of shards**. The test was repeated using varying numbers of shards to establish whether queries ran more efficiently across indexes containing fewer, larger shards or more, smaller shards.
-->

<!--
> [AZURE.NOTE] You can repeat the tests yourself. The test plans and scripts are available online, and the document [How-To: Run the Automated Elasticsearch Query Tests](TODO) describes how to use these assets to conduct your own testing.
-->

### Performance Results – Disk Type

The table below summarizes the response times of the work performed by running the test on the 6-node cluster of D4 VMs (using HDDs), and on the 6-node cluster of DS4 VMs (using SSDs). The configuration of Elasticsearch in both clusters was the same. The data was spread across 16 disks on each node, and each node had 14GB of RAM allocated to the JVM running Elasticsearch; the remaining memory (also 14GB) was left for operating system use. Each test ran for 24 hours. This period was selected to enable the effects of the increasing volume of data to become apparent and to allow the system to stabilize:

  Cluster   |Operation/Query              |Average Response Time (ms)|
 -----------|---------------------------- |--------------------------|
  D4        |Ingestion                    |978                       |
            |Count By Rating              |103                       |
            |Count Over Time              |134                       |
            |Hits By Country              |199                       |
            |Top 15 Organizations         |137                       |
            |Unique Count Organizations   |139                       |
            |Unique IP Count              |510                       |
            |Total Hits Counts            |89                        |
  DS4       |Ingestion                    |511                       |
            |Count By Rating              |187                       |
            |Count Over Time              |411                       |
            |Hits By Country              |402                       |
            |Top 15 Organizations         |307                       |
            |Unique Count Organizations   |320                       |
            |Unique IP Count              |841                       |
            |Total Hits Counts            |236                       |

At first glance, it would appear that the DS4 cluster performed queries less well than the D4 cluster, 
at times doubling (or worse) the response time. This does not tell the whole story though. The next 
table shows the number of ingestion operations performed by each cluster (remember that each operation 
loads 1000 documents):

 Cluster   | Ingestion Operations
 ----------|---------------------
  D4       | 264769              
  DS4      | 503157              

The DS4 cluster was able to load nearly twice as much data than the D4 cluster during the test. Therefore, 
when analyzing the response times for each operation, you also need to consider how many documents each 
query has to scan, and how many documents are returned. 

These are dynamic figures as the volume of 
documents in the index is continually growing. You cannot simply divide 503137 by 264769 (the number of 
ingestion operations performed by each cluster) and then multiply the result by the average response 
time for each query performed by the D4 cluster to give a comparative figure as this ignores the amount 
of I/O being performed concurrently by the ingestion operation. 

Instead, you should measure the physical 
amount of data being written to and read from disk as the test proceeds. The JMeter test plan captures 
this information for each node. The summarized results were:

  Cluster   |Average bytes written/read by each operation|
  --------- |--------------------------------------------|
  D4        |13471557                                    |
  DS4       |24643470                                    |

These figures show that the DS4 cluster was able to sustain an I/O rate approximately 1.8 times that 
of the D4 cluster. Given that, apart from nature of the disks, all other resources are the same, 
the difference must be due to using SSDs rather HDDs.

To help justify this conclusion, the following graphs illustrate the how the I/O was performed over 
time by each cluster:

![](./media/guidance-elasticsearch/query-performance2.png)

The graph for the D4 cluster shows significant variation, especially during the first half of the test. 
This was likely due to throttling to reduce the I/O rate. In the initial stages of the test, the 
queries are able to run quickly as there is little data to analyze. The disks in the D4 cluster are 
therefore likely to be operating close to their IOPS capacity, although each I/O operation might not 
be returning much data. The DS4 cluster is able to support a higher IOPS rate and does not suffer 
the same degree of throttling; the I/O rates are more regular. 

To illustrate this theory, the next pair of graphs show how the CPU was blocked by disk I/O over 
time (the disk wait times shown in the graphs are the proportion of the time that the CPU spent 
waiting for I/O):

![](./media/guidance-elasticsearch/query-performance3.png)

It is important to understand that in this test scenario, there are two predominant reasons for 
I/O operations to block the CPU:

- The I/O subsystem could be reading or writing data to or from disk.

- The I/O subsystem could be throttled by the host environment. Azure disks backed by 
standard storage have a maximum throughput of 500 IOPS, while those backed by premium storage 
have a maximum throughput of 5000 IOPS.

For the D4 cluster, the amount of time spent waiting for I/O during the first half of the test 
correlates closely in an inverted manner with the graph showing the I/O rates; periods of low I/O 
correspond to periods of significant time the CPU spends blocked.  

This indicates that I/O is being throttled. As more data is added to the cluster the situation 
changes, and in the second half of the test peaks in I/O wait times correspond with peaks in 
I/O throughput. At this point, the CPU is blocked while performing real I/O. Again, with the DS4 cluster, 
the time spent waiting for I/O is much more even, and each peak matches an equivalent peak in 
I/O performance rather than a trough; this implies that there is little or no throttling occurring.

There is one other factor to consider. During the test, the D4 cluster generated 10584 ingestion errors, 
and 21 query errors. The test on the DS4 cluster produced no errors.

### Performance Results – Scaling Up

The table below summarizes the results of running the tests on the medium (DS4), and large (DS14) clusters. Each VM used SSDs to hold the data. Each test ran for 24 hours:

|  Cluster        |Operation/Query              |Number of Requests   |Average Response Time (ms)|
|  -------------- |---------------------------- |-------------------- |--------------------------|
|  Medium (DS4)   |Ingestion                    |503157               |511                       |
|                 |Count By Rating              |6958                 |187                       |
|                 |Count Over Time              |6958                 |411                       |
|                 |Hits By Country              |6958                 |402                       |
|                 |Top 15 Organizations         |6958                 |307                       |
|                 |Unique Count Organizations   |6956                 |320                       |
|                 |Unique IP Count              |6955                 |841                       |
|                 |Total Hits Counts            |6958                 |236                       |
|  Large (DS14)   |Ingestion                    |502714               |511                       |
|                 |Count By Rating              |7041                 |201                       |
|                 |Count Over Time              |7040                 |298                       |
|                 |Hits By Country              |7039                 |363                       |
|                 |Top 15 Organizations         |7038                 |244                       |
|                 |Unique Count Organizations   |7037                 |283                       |
|                 |Unique IP Count              |7037                 |681                       |
|                 |Total Hits Counts            |7038                 |200                       |

<!-- 
DISCUSSION POINTS:

Similar volume of data ingested – same disk configuration for each cluster, and ingestion rate is 
constrained by I/O performance?

Average response time for queries decreases with SKU.

Show CPU graphs

Show memory utilization – more data cached, fewer GCs, etc.

-->

<!--
To isolate the effects of the ingestion operations and show how query performance varies as nodes scale up, a second set of tests was performed using the same nodes. The ingestion part of the test was omitted, and the index on each node was pre-populated with 100 million documents. An amended set of queries was performed; the time element limiting documents to those added in the last 15 minutes was removed as the data was now static. The tests ran for 90 minutes; there is less need to allow the system to stabilize due to the fixed amount of data. The following table summarizes the results obtained on each cluster:

> [AZURE.NOTE] The amended version of the test that omits the data ingestion process and that uses a set of indexes containing 100 million documents is referred to as the *query-only* test in the remainder of this document. You should not compare the performance of the queries in this test with that of the tests that perform ingestion and query operations because the queries have been modified and the volume of documents involved is different.

 |Cluster        |Operation/Query              |Number of Requests   Average Response Time (ms)
 | --------------| ----------------------------| -------------------- ----------------------------
 | Small (DS3)   | Count By Rating             |                      
 |               | Count Over Time             |                      
 |               | Hits By Country             |                      
 |               | Top 15 Organizations        |                      
 |               | Unique Count Organizations  |                      
 |               | Unique IP Count             |                      
 |               | Total Hits Counts           |                      
 | Medium (DS4)  | Count By Rating             |                      
 |               | Count Over Time             |                      
 |               | Hits By Country             |                      
 |               | Top 15 Organizations        |                      
 |               | Unique Count Organizations  |                      
 |               | Unique IP Count             |                      
 |               | Total Hits Counts           |                      
 | Large (DS14)  | Count By Rating             |                      
 |               | Count Over Time             |                      
 |               | Hits By Country             |                      
 |               | Top 15 Organizations        |                      
 |               | Unique Count Organizations  |                      
 |               | Unique IP Count             |                      
 |               | Total Hits Counts           |                      

### Performance Results – Scaling Out
-->


<!--
To show the system scales out with the number of nodes, tests were run using DS14 clusters comprising 1, 3, and 6 nodes. This time, only the query-only test was performed, using 100 million documents and running for 90 minutes:

> [AZURE.NOTE] For detailed information on how scaling out can affect the behavior of data ingestion operations, see the document [Maximizing Data Ingestion Performance with Elasticsearch on Azure](https://github.com/mspnp/azure-guidance/blob/master/Elasticsearch-Data-Ingestion-Performance.md).

|  Cluster   |Operation/Query              |Number of Requests   |Average Response Time (ms)
|  --------- |---------------------------- |-------------------- |----------------------------
|  1 Node    |Count By Rating              |                     |
|            |Count Over Time              |                     |
|            |Hits By Country              |                     |
|            |Top 15 Organizations         |                     |
|            |Unique Count Organizations   |                     |
|            |Unique IP Count              |                     |
|            |Total Hits Counts            |                     |
|  3 Nodes   |Count By Rating              |                     |
|            |Count Over Time              |                     |
|            |Hits By Country              |                     |
|            |Top 15 Organizations         |                     |
|            |Unique Count Organizations   |                     |
|            |Unique IP Count              |                     |
|            |Total Hits Counts            |                     |
|  6 Nodes   |Count By Rating              |                     |
|            |Count Over Time              |                     |
|            |Hits By Country              |                     |
|            |Top 15 Organizations         |                     |
|            |Unique Count Organizations   |                     |
|            |Unique IP Count              |                     |
|            |Total Hits Counts            |                     |
-->

<!--
### Performance Results – Number of Replicas

The ingestion and query tests were run against an index with a single replica. The tests were repeated on the 6-node DS4 and DS14 clusters using an index configured with two replicas. All tests ran for 24 hours. The table below shows the comparative results for one and two replicas:

|  Cluster|  Operation/Query            | response time 1 Replica (ms)| response time 2 Replicas (ms) | % Difference in Response Time
|  -------| ----------------------------| ----------------------------|----------- -------------------|--------------------- --------
|  DS4    |   Ingestion                 |   511                       |               655             |                          +28%
|         |   Count By Rating           |   187                       |               168             |                          -10%
|         |   Count Over Time           |   411                       |               309             |                          -25%
|         |   Hits By Country           |   402                       |               562             |                          +40%
|         |   Top 15 Organizations      |   307                       |               366             |                          +19%
|         |   Unique Count Organizations|   320                       |               378             |                          +18%
|         |   Unique IP Count           |   841                       |               987             |                          +17%
|         |   Total Hits Counts         |   236                       |               236             |                          +0%
|  DS14   |   Ingestion                 |   511                       |               618             |                          +21%
|         |   Count By Rating           |   201                       |               275             |                          +37%
|         |   Count Over Time           |   298                       |               466             |                          +56%
|         |   Hits By Country           |   363                       |               529             |                          +46%
|         |   Top 15 Organizations      |   244                       |               407             |                          +67%
|         |   Unique Count Organizations|   283                       |               403             |                          +42%
|         |   Unique IP Count           |   681                       |               823             |                          +21%
|         |   Total Hits Counts         |   200                       |               221             |                          +11%


NEED \## OF DOCUMENTS RETURNED TO JUSTIFY THIS DATA, OTHERWISE PERF FOR 2 REPLICAS LOOKS OFF!

PRESENT QUERY-ONLY TEST RESULTS TO SHOW BETTER RESULTS
-->

### Performance Results – Doc Values

The ingestion and query tests were conducted with doc values enabled, causing Elasticsearch to store 
data used for sorting fields on disk. The tests were repeated with doc values disabled, so Elasticsearch
 constructed fielddata dynamically and cached it in memory. All tests ran for 24 hours. 
 
 The table below compares the response times for tests run against clusters of 6 nodes built using 
 D4, DS4, and DS14 VMs.

|  Cluster   |Operation/Query            |Doc Values Enabled (ms) |  Doc Values Disabled (ms)  | % Difference       |
|  --------- |---------------------------| -----------------------|--------------------------  |--------------------|
|  D4        |Ingestion                  |  978                   |        835                 |           -15%     |
|            |Count By Rating            |  103                   |        132                 |           +28%     |
|            |Count Over Time            |  134                   |        189                 |           +41%     |
|            |Hits By Country            |  199                   |        259                 |           +30%     |
|            |Top 15 Organizations       |  137                   |        184                 |           +34%     |
|            |Unique Count Organizations |  139                   |        197                 |           +42%     |
|            |Unique IP Count            |  510                   |        604                 |           +18%     |
|            |Total Hits Counts          |  89                    |        134                 |           +51%     |
|  DS4       |Ingestion                  |  511                   |        581                 |           +14%     |
|            |Count By Rating            |  187                   |        190                 |           +2%      |
|            |Count Over Time            |  411                   |        409                 |           -0.5%    |
|            |Hits By Country            |  402                   |        414                 |           +3%      |
|            |Top 15 Organizations       |  307                   |        284                 |           -7%      |
|            |Unique Count Organizations |  320                   |        313                 |           -2%      |
|            |Unique IP Count            |  841                   |        955                 |           +14%     |
|            |Total Hits Counts          |  236                   |        281                 |           +19%     |
|  DS14      |Ingestion                  |  511                   |        571                 |           +12%     |
|            |Count By Rating            |  201                   |        232                 |           +15%     |
|            |Count Over Time            |  298                   |        341                 |           +14%     |
|            |Hits By Country            |  363                   |        457                 |           +26%     |
|            |Top 15 Organizations       |  244                   |        338                 |           +39%     |
|            |Unique Count Organizations |  283                   |        350                 |           +24%     |
|            |Unique IP Count            |  681                   |        909                 |           +33%     |
|            |Total Hits Counts          |  200                   |        245                 |           +23%     |


<!--
The next table compares the number of ingestion operations performed by the tests:

  Cluster   Ingestion Operations – Doc Values Enabled   \## Ingestion Operations – Doc Values Disabled   % Difference in \## Ingestion Operations
  --------- ---------------------------------------------- ----------------------------------------------- -----------------------------------------
  D4        264769                                         408690                                          +54%
  DS4       503137                                         578237                                          +15%
  DS14      502714                                         586472                                          +17%

The improved ingestion rates occur with doc values disabled as less data is being written to disk as documents are inserted. The improved performance is especially noticeable with the D4 VM using HDDs to store data. In this case, the response time for ingestion operations also decreased by 15% (see the first table in this section). This could be due to the reduced pressure on the HDDs which were likely running close to their IOPS limits in the test with doc values enabled; see the [Disk Type](#performance-results-disk-type) test for more information. The following graph compares the I/O performance of the D4 VMs with doc values enabled (values held on disk) and doc values disabled (values held in memory):

![](./media/guidance-elasticsearch/query-performance4.png)

In contrast, the ingestion figures for the VMs using SSDs show a small increase in the number of documents but also an increase in the response time of the ingestion operations. With one or two small exceptions, the query response times were also worse. The SSDs are less likely to be running close to their IOPS limits with doc values enabled, so changes in performance are more likely due to increased processing activity and the overhead of managing the JVM heap. This is evident by comparing the CPU utilization with doc values enabled and disabled. The next graph highlights this data for the DS4 cluster, where most of the CPU utilization moves from the 30%-40% band with doc values enabled, to the 40%-50% band with doc values disabled (the DS14 cluster showed a similar trend):

![](./media/guidance-elasticsearch/query-performance5.png)

To isolate the effects that doc values on query performance from data ingestion, a pair of query-only tests were performed for each cluster as follows:

In the first test, the Elasticsearch index was created with doc values enabled, the index was pre-populated with 100 million documents, and then modified set of queries used by the replica tests were performed repeatedly for 90 minutes while performance statistics were gathered.

In the second test, the Elasticsearch index was created with doc values disabled, populated, and then subjected to the same query load for the same period as the first test.
-->

<!--
## Appendix: The Query and Aggregation Performance Test

This appendix describes the performance test performed against the Elasticsearch cluster. The tests were run by using JMeter running on a separate set of VMs. Details the configuration of the test environment are described in the document How-To: Create a Performance Testing Environment for Elasticsearch. To perform your own testing, you can create your own JMeter test plan manually following the guidance in this appendix, or you can use the automated test scripts available separately. See the document How-To: Run the Automated Elasticsearch Query Tests for further information.

The data query workload performed the set of queries described below while performing a large-scale upload of documents at the same time (the data was uploaded by using a JUnit test, following the same approach for the data ingestion tests described in the document Maximizing Data Ingestion Performance with Elasticsearch on Azure.) The purpose of this workload was to simulate a production environment where new data is constantly being added while searches are performed. The queries were structured to retrieve only the most recent data from documents added in the last 15 minutes.

Each document was stored in a single index named *sample*, and had the type *ctip*. You can use the following HTTP request to create the index. The *number\_of\_replicas* and *number\_of\_shards* settings varied from the values shown below in many of the tests. Additionally, for the tests that used fielddata rather than doc values, each property was annotated with the attribute *"doc\_values" : false*.

**Important**. The index was dropped and recreated prior to each test run.

```http
PUT /sample
{  
    "settings" : {
        "number_of_replicas": 1,
        "refresh_interval": "30s",
        "number_of_shards": "5",
        "index.translog.durability": "async"    
    },
    "ctip": {
        "mappings": {
            "event": {
                "_all": {
                    "enabled": false
                },
                "_timestamp": {
                    "enabled": true,
                    "store": true,
                    "format": "date_time"
                },
                "properties": {
                    "Organization": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "CustomField1": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "CustomField2": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "CustomField3": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "CustomField4": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "CustomField5": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "DateTimeReceivedUtc": {
                        "type": "date",
                        "format": "dateOptionalTime"
                    },
                    "Host": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "HttpMethod": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "HttpReferrer": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "HttpRequest": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "HttpUserAgent": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "HttpVersion": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "OrganizationName": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourceIp": {
                        "type": "ip"
                    },
                    "SourceIpAreaCode": {
                        "type": "long"
                    },
                    "SourceIpAsnNr": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourceIpBase10": {
                        "type": "long"
                    },
                    "SourceIpCity": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourceIpCountryCode": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourceIpLatitude": {
                        "type": "double"
                    },
                    "SourceIpLongitude": {
                        "type": "double"
                    },
                    "SourceIpMetroCode": {
                        "type": "long"
                    },
                    "SourceIpPostalCode": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourceIpRegion": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourceLatLong": {
                        "type": "geo_point",
                        "doc_values": true,
                        "lat_lon": true,
                        "geohash": true
                    },
                    "SourcePort": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "SourcedFrom": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "TargetIp": {
                        "type": "ip"
                    },
                    "TargetPort": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "Rating": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "UseHumanReadableDateTimes": {
                        "type": "boolean"
                    }
                }
            }
        }
    }
}

```

The following queries were performed by the test:

- How many documents with each *Rating* value have been entered in the last 15 minutes?

```http
GET /sample/ctip/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "DateTimeReceivedUtc": {
              "gte": "now-15m",
              "lte": "now"
            }
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 0,
  "aggs": {
    "2": {
      "terms": {
        "field": "Rating",
        "size": 5,
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}

```

- How many documents have been added in each 5 minute interval during the last 15 minutes?

```http
GET /sample/ctip/_search 
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "DateTimeReceivedUtc": {
              "gte": "now-15m",
              "lte": "now"
            }
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 0,
  "sort": [],
  "aggs": {
    "2": {
      "date_histogram": {
        "field": "DateTimeReceivedUtc",
        "interval": "5m",
        "time_zone": "America/Los_Angeles",
        "min_doc_count": 1,
        "extended_bounds": {
          "min": "now-15m",
          "max": "now"
        }
      }
    }
  }
}

```

- How many documents of each *Rating* value have been added for each country in the last 15 minutes?

```http
GET /sample/ctip/_search 
{
  "query": {
    "filtered": {
      "query": {
        "query_string": {
          "query": "*",
          "analyze_wildcard": true
        }
      },
      "filter": {
        "bool": {
          "must": [
            {
              "query": {
                "query_string": {
                  "query": "*",
                  "analyze_wildcard": true
                }
              }
            },
            {
              "range": {
                "DateTimeReceivedUtc": {
                  "gte": "now-15m",
                  "lte": "now"
                }
              }
            }
          ],
          "must_not": []
        }
      }
    }
  },
  "size": 0,
  "aggs": {
    "2": {
      "terms": {
        "field": "Rating",
        "size": 5,
        "order": {
          "_count": "desc"
        }
      },
      "aggs": {
        "3": {
          "terms": {
            "field": "SourceIpCountryCode",
            "size": 15,
            "order": {
              "_count": "desc"
            }
          }
        }
      }
    }
  }
}

```

- Which 15 organizations occur most frequently in documents added in the last 15 minutes?

``` http
GET /sample/ctip/_search
{
  "query": {
    "filtered": {
      "query": {
        "query_string": {
          "query": "*",
          "analyze_wildcard": true
        }
      },
      "filter": {
        "bool": {
          "must": [
            {
              "query": {
                "query_string": {
                  "query": "*",
                  "analyze_wildcard": true
                }
              }
            },
            {
              "range": {
                "DateTimeReceivedUtc": {
                  "gte": "now-15m",
                  "lte": "now"
                }
              }
            }
          ],
          "must_not": []
        }
      }
    }
  },
  "size": 0,
  "aggs": {
    "2": {
      "terms": {
        "field": "Organization",
        "size": 15,
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}

```

- How many different organizations occur in documents added in the last 15 minutes?

```http
GET /sample/ctip/_search
{
  "query": {
    "filtered": {
      "query": {
        "query_string": {
          "query": "*",
          "analyze_wildcard": true
        }
      },
      "filter": {
        "bool": {
          "must": [
            {
              "query": {
                "query_string": {
                  "query": "*",
                  "analyze_wildcard": true
                }
              }
            },
            {
              "range": {
                "DateTimeReceivedUtc": {
                  "gte": "now-15m",
                  "lte": "now"
                }
              }
            }
          ],
          "must_not": []
        }
      }
    }
  },
  "size": 0,
  "aggs": {
    "2": {
      "cardinality": {
        "field": "Organization"
      }
    }
  }
}

```

- How many documents have been added in the last 15 minutes?

```http
GET /sample/ctip/_search
{
  "query": {
    "filtered": {
      "query": {
        "query_string": {
          "query": "*",
          "analyze_wildcard": true
        }
      },
      "filter": {
        "bool": {
          "must": [
            {
              "query": {
                "query_string": {
                  "analyze_wildcard": true,
                  "query": "*"
                }
              }
            },
            {
              "range": {
                "DateTimeReceivedUtc": {
                  "gte": "now-15m",
                  "lte": "now"
                }
              }
            }
          ],
          "must_not": []
        }
      }
    }
  },
  "size": 0,
  "aggs": {}
}

```

- How many different *SourceIp* values occur in documents added in the last 15 minutes?

```http
GET /sample/ctip/_search
{
  "query": {
    "filtered": {
      "query": {
        "query_string": {
          "query": "*",
          "analyze_wildcard": true
        }
      },
      "filter": {
        "bool": {
          "must": [
            {
              "query": {
                "query_string": {
                  "query": "*",
                  "analyze_wildcard": true
                }
              }
            },
            {
              "range": {
                "DateTimeReceivedUtc": {
                  "gte": "now-15m",
                  "lte": "now"
                }
              }
            }
          ],
          "must_not": []
        }
      }
    }
  },
  "size": 0,
  "aggs": {
    "2": {
      "cardinality": {
        "field": "SourceIp"
      }
    }
  }
} 

```
-->
