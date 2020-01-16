---
title: 'Migrate from CouchBase to Azure Cosmos DB SQL API'
description: Step-by-Step guidance for migrating from CouchBase to Azure Cosmos DB SQL API
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/16/2020
ms.custom: seodec18
ms.author: mansha
author: mansha
manager: madhang
---
# Migrate from CouchBase to Azure Cosmos DB SQL API

## Overview
This guidance is created for JAVA applications, which are connecting to Couchbase and would like to migrate to Azure Cosmos DB API.
## Introduction to Azure Cosmos DB
Azure Cosmos DB is massively scalable, globally distributed, fully managed database, which is built to provide guaranteed low latency access.
Following are the highlights of Azure Cosmos DB:
1. First database with global distribution turnkey capability, refer [here](./distribute-data-globally).
2. Deliver massive storage / throughput scalability using partitions, refer [here](./partitioning-overview). 
3. Provide guaranteed single digit millisecond latency at 99th percentile, refer [here](./optimize-cost-reads-writes.md).
4. No fixed schema, user can choose to specify schema per document and still expects performance, refer [here](./index-overview).
5. Five well-defined consistency model, [here](./consistency-levels-choosing) is the guidance for selecting the correct model.
6. Using ChangeFeed, Azure Cosmos DB can be used for event based workloads,  refer [here](./change-feed) for more details.
7. Built-in operation analytics using Apache Spark, refer [here](./spark-api-introduction) for overview & [here](./lambda-architecture) for reference of lambda architecture.
8. Azure Cosmos DB has Enterprise grade security & compliance inbuilt (include certification from PCI DSS), refer [here](./database-security) for more details.
9. Online backup and restore included, refer [here](./online-backup-and-restore) for more details.
10. It supports bulk operations using BulkExecutor, refer [here](./sql-api-sdk-bulk-executor-java) for more details.

## Difference in nomenclature

|   Couchbase     |   Cosmos DB   |
| ---------------:|--------------:|
|Couchbase server|	Account       |
|Bucket           | Database      |
|Bucket	          | Container/Collection |
|JSON Document	  | Item / Document |

## Key Differences
1. Azure Cosmos DB will have “id” field inside the document as compared to Couchbase having it as part of bucket. Please note the “id” field will be unique across the partition.
2. For Sharding - Azure Cosmos DB does scale using Partitioning/sharding technique, which means it needs to split the data into multiple shards/partitions. These partitions/shards will get created based on a field provided by you need to provide a partition key, one can have partition this key selected as read as well write optimized or can have read/write optimized too, refer partitioning [here](./partition-data).
3. There is absolutely no need to have first-level hierarchy to denote collection. As the collection name already there. It will make the JSON structure much simpler. Let us look at the example, the data model can have the following change:

![Data Model Comparison Table](./media/couchbase-cosmos-migration/DataModelComparisonTable.png)


## Support of JAVA
Azure Cosmos DB has following SDK to support different flavors in JAVA:
1. Async SDK
2. Spring boot SDK

Following is the guidance when to use which SDK. Let us consider an example where we have three types of workloads:

## Couchbase as Document repository & have Spring Data method-based custom queries
If your workload is based on Spring Data Based SDK, then you can follow the steps below:
Step-1: Add parent on your POM:
```<language>
<parent>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-parent</artifactId>
   <version>2.1.5.RELEASE</version>
   <relativePath/>
</parent>
```
Step-1a: Add properties in the POM:
```
<azure.version>2.1.6</azure.version>
	Step-1b: Add Dependency in the POM:
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-cosmosdb-spring-boot-starter</artifactId>
    <version>2.1.6</version>
</dependency>
```
Step-2: Add application.properties under resources and specify the following:
```azure.cosmosdb.uri=your-cosmosDb-uri
    azure.cosmosdb.key=your-cosmosDb-key
    azure.cosmosdb.database=your-cosmosDb-dbName
```
Step-3: Define name of collection at the model, you can also specify further annotations for example, id, partitionkey to denote it explicitly:
```@Document(collection = "mycollection")
    public class User {
        @id
        private String id;
        private String firstName;
        @PartitionKey
        private String lastName;
    }
```
Following are the code snippets for CRUD operations:
### Insert / Update Operation
Where _repo is the object of Repository & doc is the POJO class’s object, you can just use.save to insert or upsert (if document with specified id found). Consider the following code snippet:
```_repo.save(doc);```
### Delete Operation
Doc object will have Id & partition key mandatory to locate and delete the object. Consider the following code snippet
```_repo.delete(doc);```
#### Read Operation
You can read the document with or without specifying partition key, just remember if you don’t specify the partition key then it will be treated as a cross-partition query. Consider following code samples, first one will perform operation using id and partition key field and second using regular field & without specifying the partition key field
1.	```_repo.findByIdAndName(objDoc.getId(),objDoc.getName());```
2.	```_repo.findAllByStatus(objDoc.getStatus());```

That’s it, you can now playaround with Azure Cosmos DB.
Full sample code is available [here](https://github.com/manishmsfte/CouchbaseToCosmosDB/tree/master/SpringCosmos).

## Couchbase as Document Repository & using N1QL queries

|N1QL queries is the way to define queries in the Couchbase.|N1QL Query	Azure CosmosDB Query|
|-------------------:|-------------------:|
|SELECT META(`TravelDocument`).id AS id, `TravelDocument`.* FROM `TravelDocument` WHERE `_type` = "com.xx.xx.xx.xxx.xxx.xxxx " and country = 'India’ and ANY m in Visas SATISFIES m.type == 'Multi-Entry' and m.Country IN ['India', Bhutan’] ORDER BY ` Validity` DESC LIMIT 25 OFFSET 0	| SELECT c.id,c FROM c JOIN m in  c.country=’India’ WHERE c._type = " com.xx.xx.xx.xxx.xxx.xxxx" and c.country = 'India' and m.type = 'Multi-Entry' and m.Country IN ('India', 'Bhutan') ORDER BY c.Validity DESC OFFSET 0 LIMIT 25 |

You would have noticed the following changes in comparison to N1QL queries:
1. You don’t need to use META or refer to first-level document, instead you can create your own reference to collection. In our case, we have considered it as c (it can be anything whichever make sense to you), which is required to prefix with . for all the first level fields e.g. c.id, c.country etc.
2. Instead of ANY now you can do a joining of sub document and refer it with a dedicated alias in our case we have use m. Please note, once we have created alias for subdocument and then whenever we refer field of subdocument we need to use alias e.g. m.Country
3. Sequence OFFSET is changed, first you need to specify OFFSET then LIMIT. BTW, they aren’t mandatory, and you can skip it without any issues.
Now, it is recommended not to use Spring Data SDK if you are using maximum custom defined queries as it will have unnecessary overhead at the client side while passing the query to Cosmos DB. Instead we have a direct ASYNC JAVA SDK, which can be utilized much efficiently in this case.

### Read Operation
To use Async Java SDK, try the following steps:
Step-1: Configure the following dependency onto the POM file:
```<!-- https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb -->
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-cosmos</artifactId>
    <version>3.0.0</version>
</dependency>
```
Step-2: Create connection object for Azure Cosmos DB using ConnectionBuilder, refer the following code (make sure you put this declaration into the bean such that the following code should get executed only once):
```
ConnectionPolicy cp=new ConnectionPolicy();
cp.connectionMode(ConnectionMode.DIRECT);

if(client==null)
	client= CosmosClient.builder()
			.endpoint(Host)//(Host, MasterKey, dbName, collName).Builder()
		    .connectionPolicy(cp)
		    .key(MasterKey)
		    .consistencyLevel(ConsistencyLevel.EVENTUAL)
		    .build();	

container = client.getDatabase(_dbName).getContainer(_collName);
```
Step-3: To execute the query, you need to perform the following code snippet:
```
Flux<FeedResponse<CosmosItemProperties>> objFlux= container.queryItems(query, fo);
```
Now, with the help of above method you can pass multiple queries and execute without any hassle. In case you have requirement to execute one large query, which can be split into multiple queries then try the following code snippet instead of the above one:
```
for(SqlQuerySpec query:queries)
{
	objFlux= container.queryItems(query, fo);
	objFlux .publishOn(Schedulers.elastic())
					.subscribe(feedResponse->
						{
							if(feedResponse.results().size()>0)
							{
								_docs.addAll(feedResponse.results());
							}
							
						},
						Throwable::printStackTrace,latch::countDown);
		lstFlux.add(objFlux);
		}
						
		Flux.merge(lstFlux);
		latch.await();
}
```
With the above-mentioned code, you will be able to perform queries in parallel and increase the distributed executions to optimize. Further you can perform the following operations too:
### Insert Operation
To insert the document, you can perform the following code:
```	
Mono<CosmosItemResponse> objMono= container.createItem(doc,ro);
```
Then subscribe to Mono as:
```
CountDownLatch latch=new CountDownLatch(1);
objMono .subscribeOn(Schedulers.elastic())
        .subscribe(resourceResponse->
        {
	        if(resourceResponse.statusCode()!=successStatus)
		        {
			        throw new RuntimeException(resourceResponse.toString());
		        }
	        },
        Throwable::printStackTrace,latch::countDown);
latch.await();
				
```
### Upsert Operation
Upsert operation requires you to specify the document which needs to be updated. To fetch the complete document you can use snippet mentioned under heading read operation then modify the required field(s). The below code snippet will upsert the document:
```
Mono<CosmosItemResponse> obs= container.upsertItem(doc, ro);
```
Then subscribe to mono, refer mono subscription snippet in insert operation.

### Delete Operation
Following snippet will do delete operation:
```		
CosmosItem objItem= container.getItem(doc.Id, doc.Tenant);
Mono<CosmosItemResponse> objMono = objItem.delete(ro);
```
Then subscribe to mono, refer mono subscription snippet in insert operation.

Full sample code is available [here](https://github.com/manishmsfte/CouchbaseToCosmosDB/tree/master/AsyncInSpring).

## Couchbase as key/value pair
This is a simple type of workload in which you will be performing lookups instead of queries. Now, please follow the steps:
Step-1: Consider having “/id” as primary key, which will make sure you will be able lookup directly in the specific partition. Create collection and specify “/id” as partition key.

Step-2: Switch off the indexing completely, as you will be executing lookups hence there is no point of carrying indexing overhead. Navigate to Portal-->Cosmos DB Account-->Data Explorer-->click on your Database-->click on your Collection-->Scale & Settings-->Indexing Policy. It will look like the following string:
```
{
    "indexingMode": "consistent",
    "includedPaths": 
    [
        {
            "path": "/*",
            "indexes": 
            [
                {
                    "kind": "Range",
                    "dataType": "Number"
                },
                {
                    "kind": "Range",
                    "dataType": "String"
                },
                {
                    "kind": "Spatial",
                    "dataType": "Point"
                }
           ]
       }
    ],
    "excludedPaths": 
    [
        {
            "path": "/path/to/single/excluded/property/?"
        },
        {
            "path": "/path/to/root/of/multiple/excluded/properties/*"
        }
    ]
}
````

Replace it with the following policy:
```
{
    "indexingMode": "none"
}
```
Step-3: Follow the below mentioned code snippet:
Connection Object (to be placed in @Bean or make it static):
```
ConnectionPolicy cp=new ConnectionPolicy();
cp.connectionMode(ConnectionMode.DIRECT);

if(client==null)
	client= CosmosClient.builder()
			.endpoint(Host)//(Host, MasterKey, dbName, collName).Builder()
		    .connectionPolicy(cp)
		    .key(MasterKey)
		    .consistencyLevel(ConsistencyLevel.EVENTUAL)
		    .build();	

container = client.getDatabase(_dbName).getContainer(_collName);
````
Now you can execute CRUD operation as:
#### Read Operation
To read the item, use the following snippet:
```        
CosmosItemRequestOptions ro=new CosmosItemRequestOptions();
ro.partitionKey(new PartitionKey(documentId));
CountDownLatch latch=new CountDownLatch(1);
		
var objCosmosItem= container.getItem(documentId, documentId);
Mono<CosmosItemResponse> objMono = objCosmosItem.read(ro);
objMono .subscribeOn(Schedulers.elastic())
        .subscribe(resourceResponse->
        {
	        if(resourceResponse.item()!=null)
	        {
		        doc= resourceResponse.properties().toObject(UserModel.class);
	        }
        },
        Throwable::printStackTrace,latch::countDown);
latch.await();
````

### Insert Operation
To insert an item, you can perform the following code:
```	
Mono<CosmosItemResponse> objMono= container.createItem(doc,ro);
```

Then subscribe to mono as:
```
CountDownLatch latch=new CountDownLatch(1);
objMono.subscribeOn(Schedulers.elastic())
		.subscribe(resourceResponse->
		{
			if(resourceResponse.statusCode()!=successStatus)
				{
					throw new RuntimeException(resourceResponse.toString());
				}
			},
		Throwable::printStackTrace,latch::countDown);
latch.await();
```
### Upsert Operation
To update the value of an item, refer the code snippet below:
```
Mono<CosmosItemResponse> obs= container.upsertItem(doc, ro);
````
Then subscribe to mono, refer mono subscription snippet in insert operation.
### Delete Operation
Following snippet to execute delete operation:
```		
CosmosItem objItem= container.getItem(id, id);
Mono<CosmosItemResponse> objMono = objItem.delete(ro);
```
Then subscribe to mono, refer mono subscription snippet in insert operation.
Full sample code is available [here](https://github.com/manishmsfte/CouchbaseToCosmosDB/tree/master/AsyncKeyValue).
## Data Migration:
There are two ways to migrate data. 
1. Use Azure Data Factory: This is the most recommended method to migrate the data, configure source as couchbase and sink as Azure Cosmos DB SQL API, refer [here](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-cosmos-db)
2. Use Azure Cosmos DB data import tool: To migrate using VMs with less amount of data, refer [here](./import-data)

## References
1. Java Async SDK version 3.0.0, refer https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmos/3.0.0 
2. Java Spring Boot SDK version 2.1.6, refer https://search.maven.org/artifact/com.microsoft.azure/azure-cosmosdb-spring-boot-starter/2.1.6/jar 	
