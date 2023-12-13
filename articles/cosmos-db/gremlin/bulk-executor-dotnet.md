---
title: Ingest data in bulk in Azure Cosmos DB for Gremlin by using a bulk executor library
description: Learn how to use a bulk executor library to massively import graph data into an Azure Cosmos DB for Gremlin container.
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: how-to
ms.date: 05/10/2022
author: manishmsfte
ms.author: mansha
ms.devlang: csharp, java
ms.custom: ignite-2022, devx-track-dotnet, devx-track-extended-java
---

# Ingest data in bulk in the Azure Cosmos DB for Gremlin by using a bulk executor library

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

Graph databases often need to ingest data in bulk to refresh an entire graph or update a portion of it. Azure Cosmos DB, a distributed database and the backbone of the Azure Cosmos DB for Gremlin, is meant to perform best when the loads are well distributed. Bulk executor libraries in Azure Cosmos DB are designed to exploit this unique capability of Azure Cosmos DB and provide optimal performance. For more information, see [Introducing bulk support in the .NET SDK](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk).

In this tutorial, you learn how to use the Azure Cosmos DB bulk executor library to import and update *graph* objects into an Azure Cosmos DB for Gremlin container. During this process, you use the library to create *vertex* and *edge* objects programmatically and then insert multiple objects per network request.

Instead of sending Gremlin queries to a database, where the commands are evaluated and then executed one at a time, you use the bulk executor library to create and validate the objects locally. After the library initializes the graph objects, it allows you to send them to the database service sequentially. 

By using this method, you can increase data ingestion speeds as much as a hundredfold, which makes it an ideal way to perform initial data migrations or periodic data movement operations. 

The bulk executor library now comes in the following varieties.

## .NET
### Prerequisites

Before you begin, make sure that you have the following:

* Visual Studio 2019 with the Azure development workload. You can get started with the [Visual Studio 2019 Community Edition](https://visualstudio.microsoft.com/downloads/) for free.

* An Azure subscription. If you don't already have a subscription, you can [create a free Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cosmos-db). 

   Alternatively, you can [create a free Azure Cosmos DB account](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription.

* An Azure Cosmos DB for Gremlin database with an *unlimited collection*. To get started, go to [Azure Cosmos DB for Gremlin in .NET](./quickstart-dotnet.md).

* Git. To begin, go to the [git downloads](https://git-scm.com/downloads) page.

#### Clone

To use this sample, run the following command:

```bash
git clone https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor.git
```

To get the sample, go to `.\azure-cosmos-graph-bulk-executor\dotnet\src\`.

#### Sample

```csharp

IGraphBulkExecutor graphBulkExecutor = new GraphBulkExecutor("MyConnectionString", "myDatabase", "myContainer");

List<IGremlinElement> gremlinElements = new List<IGremlinElement>();
gremlinElements.AddRange(Program.GenerateVertices(Program.documentsToInsert));
gremlinElements.AddRange(Program.GenerateEdges(Program.documentsToInsert));
BulkOperationResponse bulkOperationResponse = await graphBulkExecutor.BulkImportAsync(
    gremlinElements: gremlinElements,
    enableUpsert: true);
```

### Execute

Modify the parameters, as described in the following table:

| Parameter|Description |
|---|---|
|`ConnectionString`| Your service connection string, which you'll find in the **Keys** section of your Azure Cosmos DB for Gremlin account. It's formatted as `AccountEndpoint=https://<account-name>.documents.azure.com:443/;AccountKey=<account-key>;`. |
|`DatabaseName`, `ContainerName`|The names of the target database and container.|
|`DocumentsToInsert`| The number of documents to be generated (relevant only to synthetic data).|
|`PartitionKey` | Ensures that a partition key is specified with each document during data ingestion.|
|`NumberOfRUs` | Is relevant only if a container doesn't already exist and it needs to be created during execution.|

[Download the full sample application in .NET](https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor/tree/main/dotnet).

## Java

### Sample usage

The following sample application illustrates how to use the GraphBulkExecutor package. The samples use either the *domain* object annotations or the *POJO* (plain old Java object) objects directly. We recommend that you try both approaches to determine which one better meets your implementation and performance demands.

### Clone

To use the sample, run the following command:

```bash
git clone https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor.git
```
To get the sample, go to `.\azure-cosmos-graph-bulk-executor\java\`.

### Prerequisites

To run this sample, you need to have the following software:

* OpenJDK 11
* Maven
* An Azure Cosmos DB account that's configured to use the Gremlin API

### Sample

```java
private static void executeWithPOJO(Stream<GremlinVertex> vertices,
                                        Stream<GremlinEdge> edges,
                                        boolean createDocs) {
        results.transitionState("Configure Database");
        UploadWithBulkLoader loader = new UploadWithBulkLoader();
        results.transitionState("Write Documents");
        loader.uploadDocuments(vertices, edges, createDocs);
    }
```

### Configuration

To run the sample, refer to the following configuration and modify it as needed.

The */resources/application.properties* file defines the data that's required to configure Azure Cosmos DB. The required values are described in the following table:

| Property | Description |
| --- | --- |
| `sample.sql.host` | The value that's provided by Azure Cosmos DB. Ensure that you're using the .NET SDK URI, which you'll find in the **Overview** section of the Azure Cosmos DB account.|
| `sample.sql.key` |  You can get the primary or secondary key from the **Keys** section of the Azure Cosmos DB account. |
| `sample.sql.database.name` |  The name of the database within the Azure Cosmos DB account to run the sample against. If the database isn't found, the sample code creates it. |
| `sample.sql.container.name` |  The name of the container within the database to run the sample against. If the container isn't found, the sample code creates it. |
| `sample.sql.partition.path` |  If you need to create the container, use this value to define the `partitionKey` path. |
| `sample.sql.allow.throughput` |  The container will be updated to use the throughput value that's defined here. If you're exploring various throughput options to meet your performance demands, be sure to reset the throughput on the container when you're done with your exploration. There are costs associated with leaving the container provisioned with a higher throughput. |

### Execute

After you've modified the configuration according to your environment, run the following command:

```bash
mvn clean package 
```

For added safety, you can also run the integration tests by changing the `skipIntegrationTests` value in the *pom.xml* file to `false`.

After you've run the unit tests successfully, you can run the sample code:

```bash
java -jar target/azure-cosmos-graph-bulk-executor-1.0-jar-with-dependencies.jar -v 1000 -e 10 -d
```

Running the preceding command executes the sample with a small batch (1,000 vertices and roughly 5,000 edges). Use the command-line arguments in the following sections to tweak the volumes that are run and which sample version to run.

### Command-line arguments

Several command-line arguments are available while you're running this sample, as described in the following table:

| Argument&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
| --- | --- |
| `--vertexCount` (`-v`) |  Tells the application how many person vertices to generate. |
| `--edgeMax` (`-e`) |  Tells the application the maximum number of edges to generate for each vertex. The generator randomly selects a number from 1 to the value you provide. |
| `--domainSample` (`-d`) |  Tells the application to run the sample by using the person and relationship domain structures instead of the `GraphBulkExecutors`, `GremlinVertex`, and `GremlinEdge` POJOs. |
| `--createDocuments` (`-c`) |  Tells the application to use `create` operations. If the argument isn't present, the application defaults to using `upsert` operations. |

### Detailed sample information

#### Person vertex

The person class is a simple domain object that's been decorated with several annotations to help a transformation into the `GremlinVertex` class, as described in the following table:

| Class annotation | Description |
| --- | --- |
| `GremlinVertex` |  Uses the optional `label` parameter to define all vertices that you create by using this class. |
| `GremlinId` |  Used to define which field will be used as the `ID` value. The field name on the person class is ID, but it isn't required. |
| `GremlinProperty` |  Used on the `email` field to change the name of the property when it's stored in the database.
| `GremlinPartitionKey` |  Used to define which field on the class contains the partition key. The field name you provide should match the value that's defined by the partition path on the container. |
| `GremlinIgnore` |  Used to exclude the `isSpecial` field from the property that's being written to the database. |

#### The RelationshipEdge class

The `RelationshipEdge` class is a versatile domain object. By using the field level label annotation, you can create a dynamic collection of edge types, as shown in the following table:

| Class annotation | Description |
| --- | --- |
| `GremlinEdge` |  The `GremlinEdge` decoration on the class defines the name of the field for the specified partition key. When you create an edge document, the assigned value comes from the source vertex information. |
| `GremlinEdgeVertex` |  Two instances of `GremlinEdgeVertex` are defined, one for each side of the edge (source and destination). Our sample has the field's data type as `GremlinEdgeVertexInfo`. The information provided by the `GremlinEdgeVertex` class is required for the edge to be created correctly in the database. Another option would be to have the data type of the vertices be a class that has been decorated with the `GremlinVertex` annotations. |
| `GremlinLabel` |  The sample edge uses a field to define the `label` value. It allows various labels to be defined, because it uses the same base domain class. |

### Output explained

The console finishes its run with a JSON string that describes the run times of the sample. The JSON string contains the following information:

| JSON string | Description |
| --- | --- |
| startTime |  The `System.nanoTime()` when the process started. |
| endTime |  The `System.nanoTime()` when the process finished. |
| durationInNanoSeconds |  The difference between the `endTime` and `startTime` values. |
| durationInMinutes |  The `durationInNanoSeconds` value, converted into minutes. The `durationInMinutes` value is represented as a float number, not a time value. For example, a value of 2.5 represents 2 minutes and 30 seconds. |
| vertexCount |  The volume of generated vertices, which should match the value that's passed into the command-line execution. |
| edgeCount |  The volume of generated edges, which isn't static and is built with an element of randomness. |
| exception |  Populated only if an exception is thrown when you attempt to make the run. |

#### States array

The states array gives insight into how long each step within the execution takes. The steps are described in the following table:

| Execution&nbsp;step | Description |
| --- | --- |
| Build&nbsp;sample&nbsp;vertices |  The amount of time it takes to fabricate the requested volume of person objects. |
| Build sample edges |  The amount of time it takes to fabricate the relationship objects. |
| Configure database |  The amount of time it takes to configure the database, based on the values that are provided in `application.properties`. |
| Write documents |  The amount of time it takes to write the documents to the database. |

Each state contains the following values:

| State value | Description |
| --- | --- |
| `stateName` |  The name of the state that's being reported. |
| `startTime` |  The `System.nanoTime()` value when the state started. |
| `endTime` |  The `System.nanoTime()` value when the state finished. |
| `durationInNanoSeconds` |  The difference between the `endTime` and `startTime` values. |
| `durationInMinutes` |  The `durationInNanoSeconds` value, converted into minutes. The `durationInMinutes` value is represented as a float number, not a time value. For example, a value of 2.5 represents 2 minutes and 30 seconds. |

## Next steps

* For more information about the classes and methods that are defined in this namespace, review the [BulkExecutor Java open source documentation](https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor/tree/main/java/src/main/java/com/azure/graph/bulk/impl).
* See [Bulk import data to the Azure Cosmos DB SQL API account by using the .NET SDK](../nosql/tutorial-dotnet-bulk-import.md) article. This bulk mode documentation is part of the .NET V3 SDK.
