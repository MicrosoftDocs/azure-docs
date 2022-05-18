---
title: Bulk ingestion in Azure Cosmos DB Gremlin API using BulkExecutor
description: Learn how to use the bulk executor library to massively import graph data into an Azure Cosmos DB Gremlin API container.
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: how-to
ms.date: 05/10/2022
author: manishmsfte
ms.author: mansha
ms.devlang: csharp, java

---

# Bulk ingestion in Azure Cosmos DB Gremlin API using BulkExecutor
[!INCLUDE[appliesto-gremlin-api](../includes/appliesto-gremlin-api.md)]

Graph database often has a use case to perform bulk ingestion to refresh the entire graph or update a portion of it. Cosmos DB, which is a distributed database and backbone of Azure Cosmos DB - Gremlin API, is meant to perform if the load is well distributed. BulkExecutor libraries in Cosmos DB designed to exploit this unique capability of Cosmos DB and provide the best performance, refer [here](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk).

This tutorial provides instructions about using Azure Cosmos DB's bulk executor library to import and update graph objects into an Azure Cosmos DB Gremlin API container. This process makes use to create Vertex and Edge objects programmatically to then insert multiple of them per network request.

Instead of sending Gremlin queries to a database, where the command is evaluated and then executed one at a time, using the BulkExecutor library will require to create and validate the objects locally. After initializing, the graph objects, the library allows you to send graph objects to the database service sequentially. Using this method, data ingestion speeds can be increased up to 100x, which makes it an ideal method for initial data migrations or periodical data movement operations. 

It's now available in following flavors:

## .NET
### Prerequisites
* Visual Studio 2019 with the Azure development workload. You can get started with the [Visual Studio 2019 Community Edition](https://visualstudio.microsoft.com/downloads/) for free.
* An Azure subscription. You can create [a free Azure account here](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cosmos-db). Alternatively, you can create a Cosmos database account with [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription.
* An Azure Cosmos DB Gremlin API database with an **unlimited collection**. The guide shows how to get started with [Azure Cosmos DB Gremlin API in .NET](./create-graph-dotnet.md).
* Git. For more information check out the [Git Downloads page](https://git-scm.com/downloads).
#### Clone
To run this sample, run the `git clone` command below:
```bash
git clone https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor.git
```
The sample is available at path .\azure-cosmos-graph-bulk-executor\dotnet\src\

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
Modify the following parameters as:

Parameter|Description
---|---
`ConnectionString`|It is **your .NET SDK endpoint** found in the Overview section of your Azure Cosmos DB Gremlin API database account. It has the format of `https://your-graph-database-account.documents.azure.com:443/`
`DatabaseName`, `ContainerName`|These parameters are the **target database and container names**. 
`DocumentsToInsert`| Number of documents to be generated (only relevant to generate synthetic data)
`PartitionKey` | To ensure partition key is specified along with each document while ingestion.
`NumberOfRUs` | Only relevant if container doesn't exists and needs to be created as part of execution

Download the full sample application in .NET from [here](https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor/tree/main/dotnet).

## JAVA

### Sample usage

The sample application is provided to illustrate how to use the GraphBulkExecutor package. Samples are available for using either the Domain object annotations or using the POJO objects directly. It's recommended, to try both approaches, to determine which better meets your implementation and performance demands.

### Clone
To run the sample, run the `git clone` command below:
```bash
git clone https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor.git
```
The sample is available at .\azure-cosmos-graph-bulk-executor\java\

### Prerequisites

To run this sample, you'll need to have the following software:

* OpenJDK 11
* Maven
* An Azure Cosmos DB Account configured to use the Gremlin API

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

To run the sample, refer the configuration as follows and modify as needed:
### Configuration

The /resources/application.properties file defines the data required to configure the Cosmos DB the required values are:

* **sample.sql.host**: It's the value provided by the Azure Cosmos DB. Ensure you use the ".NET SDK URI", which can be located on the Overview section of the Cosmos DB Account.
* **sample.sql.key**: You can get the primary or secondary key from the Keys section of the Cosmos DB Account.
* **sample.sql.database.name**: The name of the database within the Cosmos DB account to run the sample against. If the database isn't found, the sample code will create it.
* **sample.sql.container.name**: The name of the container within the database to run the sample against. If the container isn't found, the sample code will create it.
* **sample.sql.partition.path**: If the container needs to be created, this value will be used to define the partitionKey path.
* **sample.sql.allow.throughput**: The container will be updated to use the throughput value defined here. If you're exploring different throughput options to meet your performance demands, make sure to reset the throughput on the container when done with your exploration. There are costs associated with leaving the container provisioned with a higher throughput.

### Execute

Once the configuration is modified as per your environment, then run the command:

```bash
mvn clean package 
```

For added safety, you can also run the integration tests by changing the "skipIntegrationTests" value in the pom.xml to
false.

Assuming the Unit tests were run successfully. You can run the command line to execute the sample code:

```bash
java -jar target/azure-cosmos-graph-bulk-executor-1.0-jar-with-dependencies.jar -v 1000 -e 10 -d
```

Running the above commands will execute the sample with a small batch (1k Vertices and roughly 5k Edges). Use the following command lines arguments to tweak the volumes run and which sample version to run.

### Command line Arguments

There are several command line arguments are available while running this sample, which is detailed as:

* **--vertexCount** (-v): Tells the application how many person vertices to generate.
* **--edgeMax** (-e): Tells the application what the maximum number of edges to generate for each Vertex. The generator will randomly select a number between 1 and the value provided here.
* **--domainSample** (-d): Tells the application to run the sample using the Person and Relationship domain structures instead of the GraphBulkExecutors GremlinVertex and GremlinEdge POJOs.
* **--createDocuments** (-c): Tells the application to use create operations. If not present, the application will default to using upsert operations.

### Details about the sample

#### Person Vertex

The Person class is a fairly simple domain object that has been decorated with several annotations to help the
transformation into the GremlinVertex class. They are as follows:

* **GremlinVertex**: Notice how we're using the optional "label" parameter to define all Vertices created using this class.
* **GremlinId**: Being used to define which field will be used as the ID value. While the field name on the Person class is ID, it isn't required.
* **GremlinProperty**: Is being used on the email field to change the name of the property when stored in the database.
* **GremlinPartitionKey**: Is being used to define which field on the class contains the partition key. The field name provided here should match the value defined by the partition path on the container.
* **GremlinIgnore**: Is being used to exclude the isSpecial field from the property being written to the database.

#### Relationship Edge

The RelationshipEdge is a fairly versatile domain object. Using the field level label annotation allows for a dynamic
collection of edge types to be created. The following annotations are represented in this sample domain edge:

* **GremlinEdge**: The GremlinEdge decoration on the class, defines the name of the field for the specified partition key. The value assigned, when the edge document is created, will come from the source vertex information.
* **GremlinEdgeVertex**: Notice that there are two instances of GremlinEdgeVertex defined. One for each side of the edge (Source and Destination).  Our sample has the field's data type as GremlinEdgeVertexInfo. The information provided by GremlinEdgeVertex class is required for the edge to be created correctly in the database. Another option would be to have the data type of the vertices be a class that has been decorated with the GremlinVertex annotations.
* **GremlinLabel**: The sample edge is using a field to define what the label value is. It allows different labels to  be defined while still using the same base domain class.

### Output Explained

The console will finish its run with a json string describing the run times of the sample. The json string contains the
following information.

* **startTime**: The System.nanoTime() when the process started.
* **endtime**: The System.nanoTime() when the process completed.
* **durationInNanoSeconds**: The difference between the endTime and the startTime.
* **durationInMinutes**: The durationInNanoSeconds converted into minutes. Important to note that durationInMinutes is represented as a float number, not a time value. For example,  a value 2.5 would be 2 minutes and 30 seconds.
* **vertexCount**: The volume of vertices generated which should match the value passed into the command line execution.
* **edgeCount**: The volume of edges generated which isn't static and it's built with an element of randomness.
* **exception**: Only populated when there was an exception thrown when attempting to make the run.

#### States Array

The states array gives insight into how long each step within the execution takes. The steps that occur are:

* **Build sample vertices**: The time it takes to fabricate the requested volume of Person objects.
* **Build sample edges**: The time it takes to fabricate the Relationship objects.
* **Configure Database**: The amount of time it took to get the database configured based on the values provided in the
  application.properties.
* **Write Documents**: The total time it took to write the documents to the database.

Each state will contain the following values:

* **stateName**: The name of the state being reported.
* **startTime**: The System.nanoTime() when the state started.
* **endtime**: The System.nanoTime() when the state completed.
* **durationInNanoSeconds**: The difference between the endTime and the startTime.
* **durationInMinutes**: The durationInNanoSeconds converted into minutes. Important to note that durationInMinutes is represented as a float number, not a time value. for example, a value 2.5 would be 2 minutes and 30 seconds.

## Next steps

* Review the [BulkExecutor Java, which is Open Source](https://github.com/Azure-Samples/azure-cosmos-graph-bulk-executor/tree/main/java/src/main/java/com/azure/graph/bulk/impl) for more details about the classes and methods defined in this namespace.
* Review the [BulkMode, which is part of .NET V3 SDK](../sql/tutorial-sql-api-dotnet-bulk-import.md)