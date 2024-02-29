---
title: 'Migrate from CouchBase to Azure Cosmos DB for NoSQL'
description: Step-by-Step guidance for migrating from CouchBase to Azure Cosmos DB for NoSQL
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 02/11/2020
ms.author: mansha
author: manishmsfte
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate from CouchBase to Azure Cosmos DB for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB is a scalable, globally distributed, fully managed database. It provides guaranteed low latency access to your data. To learn more about Azure Cosmos DB, see the [overview](../introduction.md) article. This article provides instructions to migrate Java applications that are connected to Couchbase to a API for NoSQL account in Azure Cosmos DB.

## Differences in nomenclature

The following are the key features that work differently in Azure Cosmos DB when compared to Couchbase:

| Couchbase | Azure Cosmos DB |
|--|--|
| Couchbase server | Account |
| Bucket | Database |
| Bucket | Container/Collection |
| JSON Document | Item / Document |

## Key differences

* Azure Cosmos DB has an "ID" field within the document whereas Couchbase has the ID as a part of bucket. The "ID" field is unique across the partition.

* Azure Cosmos DB scales by using the partitioning or sharding technique. Which means it splits the data into multiple shards/partitions. These partitions/shards are created based on the partition key property that you provide. You can select the partition key to optimize read as well write operations or read/write optimized too. To learn more, see the [partitioning](../partitioning-overview.md) article.

* In Azure Cosmos DB, it is not required for the top-level hierarchy to denote the collection because the collection name already exists. This feature makes the JSON structure much simpler. The following is an example that shows differences in the data model between Couchbase and Azure Cosmos DB:

   **Couchbase**: Document ID =  "99FF4444"

    ```json
    {
      "TravelDocument":
      {
       "Country":"India",
      "Validity" : "2022-09-01",
        "Person":
        {
          "Name": "Manish",
          "Address": "AB Road, City-z"
        },
        "Visas":
        [
          {
          "Country":"India",
          "Type":"Multi-Entry",
          "Validity":"2022-09-01"
          },
          {
          "Country":"US",
          "Type":"Single-Entry",
          "Validity":"2022-08-01"
          }
        ]
      }
    }
   ```

   **Azure Cosmos DB**: Refer "ID" within the document as shown below

    ```json
    {
      "id" : "99FF4444",
    
      "Country":"India",
       "Validity" : "2022-09-01",
        "Person":
        {
          "Name": "Manish",
          "Address": "AB Road, City-z"
        },
        "Visas":
        [
          {
          "Country":"India",
          "Type":"Multi-Entry",
          "Validity":"2022-09-01"
          },
          {
          "Country":"US",
          "Type":"Single-Entry",
          "Validity":"2022-08-01"
          }
        ]
      }
    
    ```
         
## Java SDK support

Azure Cosmos DB has following SDKs to support different Java frameworks:

* Async SDK
* Spring Boot SDK

The following sections describe when to use each of these SDKs. Consider an example where we have three types of workloads:

## Couchbase as document repository & spring data-based custom queries

If the workload that you are migrating is based on Spring Boot Based SDK, then you can use the following steps:

1. Add parent to the POM.xml file:

   ```java
   <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>2.1.5.RELEASE</version>
      <relativePath/>
   </parent>
   ```

1. Add properties to the POM.xml file:

   ```java
   <azure.version>2.1.6</azure.version>
   ```

1. Add dependencies to the POM.xml file:

   ```java
   <dependency>
       <groupId>com.microsoft.azure</groupId>
       <artifactId>azure-cosmosdb-spring-boot-starter</artifactId>
       <version>2.1.6</version>
   </dependency>
   ```

1. Add application properties under resources and specify the following. Make sure to replace the URL, key, and database name parameters:

   ```java
      azure.cosmosdb.uri=<your-cosmosDB-URL>
      azure.cosmosdb.key=<your-cosmosDB-key>
      azure.cosmosdb.database=<your-cosmosDB-dbName>
   ```

1. Define the name of the collection in the model. You can also specify further annotations. For example, ID, partition key to denote them explicitly:

   ```java
   @Document(collection = "mycollection")
       public class User {
           @id
           private String id;
           private String firstName;
           @PartitionKey
           private String lastName;
       }
   ```

The following are the code snippets for CRUD operations:

### Insert and update operations

Where *_repo* is the object of repository and *doc* is the POJO class’s object. You can use `.save` to insert or upsert (if document with specified ID found). The following code snippet shows how to insert or update a doc object:

`_repo.save(doc);`

### Delete Operation

Consider the following code snippet, where doc object will have ID and partition key mandatory to locate and delete the object:

`_repo.delete(doc);`

### Read Operation

You can read the document with or without specifying the partition key. If you don’t specify the partition key, then it is treated as a cross-partition query. Consider the following code samples, first one will perform operation using ID and partition key field. Second example uses a regular field & without specifying the partition key field.

* ```_repo.findByIdAndName(objDoc.getId(),objDoc.getName());```
* ```_repo.findAllByStatus(objDoc.getStatus());```

That’s it, you can now use your application with Azure Cosmos DB. Complete code sample for the example described in this doc is available in the [CouchbaseToCosmosDB-SpringCosmos](https://github.com/Azure-Samples/couchbaseTocosmosdb/tree/main/SpringCosmos) GitHub repo.

## Couchbase as a document repository & using N1QL queries

N1QL queries is the way to define queries in the Couchbase.

|N1QL Query | Azure Cosmos DB Query|
|-------------------|-------------------|
|SELECT META(`TravelDocument`).id AS id, `TravelDocument`.* FROM `TravelDocument` WHERE `_type` = "com.xx.xx.xx.xxx.xxx.xxxx " and country = 'India’ and ANY m in Visas SATISFIES m.type == 'Multi-Entry' and m.Country IN ['India', Bhutan’] ORDER BY ` Validity` DESC LIMIT 25 OFFSET 0 | SELECT c.id,c FROM c JOIN m in  c.country=’India’ WHERE c._type = " com.xx.xx.xx.xxx.xxx.xxxx" and c.country = 'India' and m.type = 'Multi-Entry' and m.Country IN ('India', 'Bhutan') ORDER BY c.Validity DESC OFFSET 0 LIMIT 25 |

You can notice the following changes in your N1QL queries:

* You don’t need to use the META keyword or refer to the first-level document. Instead you can create your own reference to the container. In this example, we have considered it as "c" (it can be anything). This reference is used as a prefix for all the first-level fields. Fr example, c.id, c.country etc.

* Instead of "ANY" now you can do a join on subdocument and refer it with a dedicated alias such as "m". Once you have created alias for a subdocument you need to use alias. For example, m.Country.

* The sequence of OFFSET is different in Azure Cosmos DB query, first you need to specify OFFSET then LIMIT. 
It is recommended not to use Spring Data SDK if you are using maximum custom defined queries as it can have unnecessary overhead at the client side while passing the query to Azure Cosmos DB. Instead we have a direct Async Java SDK, which can be utilized much efficiently in this case.

### Read operation

Use the Async Java SDK with the following steps:

1. Configure the following dependency onto the POM.xml file:

   ```java
   <!-- https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb -->
   <dependency>
       <groupId>com.microsoft.azure</groupId>
       <artifactId>azure-cosmos</artifactId>
       <version>3.0.0</version>
   </dependency>
   ```

1. Create a connection object for Azure Cosmos DB by using the `ConnectionBuilder` method as shown in the following example. Make sure you put this declaration into the bean such that the following code should get executed only once:

   ```java
   ConnectionPolicy cp=new ConnectionPolicy();
   cp.connectionMode(ConnectionMode.DIRECT);
    
   if(client==null)
      client= CosmosClient.builder()
         .endpoint(Host)//(Host, PrimaryKey, dbName, collName).Builder()
          .connectionPolicy(cp)
          .key(PrimaryKey)
          .consistencyLevel(ConsistencyLevel.EVENTUAL)
          .build();
   
   container = client.getDatabase(_dbName).getContainer(_collName);
   ```

1. To execute the query, you need to run the following code snippet:

   ```java
   Flux<FeedResponse<CosmosItemProperties>> objFlux= container.queryItems(query, fo);
   ```

Now, with the help of above method you can pass multiple queries and execute without any hassle. In case you have the requirement to execute one large query, which can be split into multiple queries then try the following code snippet instead of the previous one:

```java
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

With the previous code, you can run queries in parallel and increase the distributed executions to optimize. Further you can run the insert and update operations too:

### Insert operation

To insert the document, run the following code:

```java
Mono<CosmosItemResponse> objMono= container.createItem(doc,ro);
```

Then subscribe to Mono as:

```java
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

### Upsert operation

Upsert operation requires you to specify the document that needs to be updated. To fetch the complete document, you can use the snippet mentioned under heading read operation then modify the required field(s). The following code snippet upserts the document:

```java
Mono<CosmosItemResponse> obs= container.upsertItem(doc, ro);
```
Then subscribe to mono. Refer to the mono subscription snippet in insert operation.

### Delete operation

Following snippet will do delete operation:

```java
CosmosItem objItem= container.getItem(doc.Id, doc.Tenant);
Mono<CosmosItemResponse> objMono = objItem.delete(ro);
```

Then subscribe to mono, refer mono subscription snippet in insert operation. The complete code sample is available in the [CouchbaseToCosmosDB-AsyncInSpring](https://github.com/Azure-Samples/couchbaseTocosmosdb/tree/main/AsyncInSpring) GitHub repo.

## Couchbase as a key/value pair

This is a simple type of workload in which you can perform lookups instead of queries. Use the following steps for key/value pairs:

1. Consider having "/ID" as primary key, which will makes sure you can perform lookup operation directly in the specific partition. Create a collection and specify "/ID" as partition key.

1. Switch off the indexing completely. Because you will execute lookup operations, there is no point of carrying indexing overhead. To turn off indexing, sign into Azure portal, goto Azure Cosmos DB Account. Open the **Data Explorer**, select your **Database** and the **Container**. Open the **Scale & Settings** tab and select the  **Indexing Policy**. Currently indexing policy looks like the following:
    
   ```json
   {
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/\"_etag\"/?"
        }
    ]
    }
   ````

   Replace the above indexing policy with the following policy:

   ```json
   {
    "indexingMode": "none",
    "automatic": false,
    "includedPaths": [],
    "excludedPaths": []
    }
   ```

1. Use the following code snippet to create the connection object. Connection Object (to be placed in @Bean or make it static):

   ```java
   ConnectionPolicy cp=new ConnectionPolicy();
   cp.connectionMode(ConnectionMode.DIRECT);
   
   if(client==null)
      client= CosmosClient.builder()
         .endpoint(Host)//(Host, PrimaryKey, dbName, collName).Builder()
          .connectionPolicy(cp)
          .key(PrimaryKey)
          .consistencyLevel(ConsistencyLevel.EVENTUAL)
          .build();
    
   container = client.getDatabase(_dbName).getContainer(_collName);
   ```

Now you can execute the CRUD operations as follows:

### Read operation

To read the item, use the following snippet:

```java        
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
```

### Insert operation

To insert an item, you can perform the following code:

```java
Mono<CosmosItemResponse> objMono= container.createItem(doc,ro);
```

Then subscribe to mono as:

```java
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

### Upsert operation

To update the value of an item, refer the code snippet below:

```java
Mono<CosmosItemResponse> obs= container.upsertItem(doc, ro);
```
Then subscribe to mono, refer mono subscription snippet in insert operation.

### Delete operation

Use the following snippet to execute the delete operation:

```java
CosmosItem objItem= container.getItem(id, id);
Mono<CosmosItemResponse> objMono = objItem.delete(ro);
```

Then subscribe to mono, refer mono subscription snippet in insert operation. The complete code sample is available in the [CouchbaseToCosmosDB-AsyncKeyValue](https://github.com/Azure-Samples/couchbaseTocosmosdb/tree/main/AsyncKeyValue) GitHub repo.

## Data Migration

There are two ways to migrate data.

* **Use Azure Data Factory:** This is the most recommended method to migrate the data. Configure the source as Couchbase and sink as Azure Cosmos DB for NoSQL, see the Azure [Azure Cosmos DB Data Factory connector](../../data-factory/connector-azure-cosmos-db.md) article for detailed steps.

## Next Steps

* To do performance testing, see [Performance and scale testing with Azure Cosmos DB](./performance-testing.md) article.
* To optimize the code, see [Performance tips for Azure Cosmos DB](./performance-tips-async-java.md) article.
* Explore Java Async V3 SDK, [SDK reference](https://github.com/Azure/azure-cosmosdb-java/tree/v3) GitHub repo.
