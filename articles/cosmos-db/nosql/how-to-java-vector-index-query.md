---
title: Index and query vector data in Java
titleSuffix: Azure Cosmos DB for NoSQL
description: Add vector data Azure Cosmos DB for NoSQL and then query the data efficiently in your Java application.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 08/01/2023
ms.custom: query-reference, devx-track-dotnet
---

# Index and query vectors in Azure Cosmos DB for NoSQL in .NET. 

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]
Vector search in Azure Cosmos DB for NoSQL is currently a Preview feature. UYou are required to register for the preview before use. This article covers the following steps: 

1. Registering for the preview of Vector Search in Azure Cosmos DB for NoSQL 
2. Setting up the Azure Cosmos DB container for vector search 
3. Authoring vector embedding policy 
4. Adding vector indexes to the container indexing policy 
5. Creating a container with vector indexes and vector embedding policy 
6. Performing a vector search on the stored data. 
7. This guide walks through the process of creating vector data, indexing the data, and then querying the data in a container.


## Prerequisites
- An existing Azure Cosmos DB for NoSQL account.
  - If you don't have an Azure subscription, [Try Azure Cosmos DB for NoSQL free](https://cosmos.azure.com/try/).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for NoSQL account](how-to-create-account.md).
- Latest version of the Azure Cosmos DB [.NET](sdk-dotnet-v3.md) SDK.

## Registering for the preview
Vector search for Azure Cosmos DB for NoSQL requires preview feature registration at the subscription level using [Azure Feature Enablement Control (AFEC)](../../azure-resource-manager/management). Please follow the below steps to register: 

1. Navigate to your Subscription page 

2. Under the “Settings” menu in the left panel, click on the “Preview features” 

3. Search for “Vector” in the search bar for the Preview features 

4. Check the “Vector search in Azure Cosmos DB for NoSQL” and click Register. 

This will enroll every Azure Cosmos DB resource in your subscription in the vector search preview. Please note that the registration request will be auto-approved, however it may take several minutes to take effect. After this time, you can follow the subsequent steps. 

## Understanding the steps involved in vector search 

The following steps assume that you know how to [setup a Cosmos DB NoSQL account and create a database(quickstart-portal). The vector search feature is currently not supported on the existing containers, so you need to create a new container and specify the container-level vector embedding policy, and the vector indexing policy at the time of container creation. 

Let’s take an example of creating a database for an internet-based bookstore and you are storing Title, Author, ISBN, and Description for each book. We’ll also define two properties to contain vector embeddings. The first is the “contentVector” property, which contains [text embeddings](../../ai-services/openai/concepts/models#embeddings ) generated from the text content of the book (for example, concatenating the “title” “author” “isbn” and “description” properties before creating the embedding). The second is “coverImageVector”, which is generated from [images of the book’s cover](../../ai-services/computer-vision/concept-image-retrieval). 

Create and store vector embeddings for the fields on which you want to perform vector search. 

Specify the vector embedding paths in the vector embedding policy. 

Include any desired vector indexes in the indexing policy for the container. 

For subsequent sections of this article, we’ll consider the below structure for the items stored in our container: 

```json
{
"title": "book-title", 
"author": "book-author", 
"isbn": "book-isbn", 
"description": "book-description", 
"contentVector": [2, -1, 4, 3, 5, -2, 5, -7, 3, 1], 
"coverImageVector": [0.33, -0.52, 0.45, -0.67, 0.89, -0.34, 0.86, -0.78] 
} 
```

## Creating a vector embedding policy for your container.
Next, you need to define a container vector policy. This will provide information that is used to inform the Azure Cosmos DB query engine how to handle vector properties in the VectorDistance system functions, such as distance function, and data types, without having to define them in each query. This also informs the vector indexing policy of necessary information, should you choose to specify one.
The following information is included in the contain vector policy:

   * “path”: what properties contain vectors  
   * “datatype”: What type are the vector’s elements (default Float32)  
   * “dimensions”: The length of each vector in the path (default 1536)  
   * “distanceFunction”: The metric used to compute distance/similarity (default Cosine)  

For our example with book details, the vector policy may look like the example JSON below: 

```csharp 
  Database db = await client.CreateDatabaseIfNotExistsAsync("vector-benchmarking");
  List<Embedding> embeddings = new List<Embedding>()
  {
      new Embedding()
      {
          Path = "/coverImageVector",
          DataType = VectorDataType.Float32,
          DistanceFunction = DistanceFunction.Cosine,
          Dimensions = 8,
      },
      new Embedding()
      {
          Path = "/contentVector",
          DataType = VectorDataType.Float32,
          DistanceFunction = DistanceFunction.Cosine,
          Dimensions = 10,
      }
  };
``` 


## Creating a vector index in the indexing policy 
Once the vector embedding paths are decided, vector indexes need to be added to the indexing policy. Currently, the vector search feature for Azure Cosmos DB for NoSQL is supported only on new containers so you need to apply the vector policy during the time of container creation and it can’t be modified later.  For this example, the indexing policy would look something like below: 

```csharp 
  Collection<Embedding> collection = new Collection<Embedding>(embeddings);
  ContainerProperties properties = new ContainerProperties(id: "vector-container", partitionKeyPath: "/id")
  {   
      VectorEmbeddingPolicy = new(collection),
      IndexingPolicy = new IndexingPolicy()
      {
          VectorIndexes = new()
          {
              new VectorIndexPath()
              {
                  Path = "/vector",
                  Type = VectorIndexType.QuantizedFlat,
              }
          }
      },
  };
``` 

> [!IMPORTANT]
> Currently vector search in Azure Cosmos DB for NoSQL is supported on new containers only. You need to set both the container vector policy and any vector indexing policy during the time of container creation as it can’t be modified later. Both policies will be modifiable in a future improvement to the preview feature.

## Running vector similarity search query 

Once you have created a container with the desired vector policy, and inserted vector data into the container, you can conduct a vector search using the [Vector Distance](query/vectordistance.md) system function in a query.  Suppose you want to search for books about food recipes by looking at the description, you first need to get the embeddings for your query text. In this case, you might want to generate embeddings for the query text – “food recipe”. Once you have the embedding for your search query, you can use it in the VectorDistance function in the vector search query and get all the items that are similar to your query as shown below: 

```sql
SELECT c.title, VectorDistance(c.contentVector, [1,2,3,4,5,6,7,8,9,10]) AS SimilarityScore   
FROM c  
ORDER BY VectorDistance(c.contentVector, [1,2,3,4,5,6,7,8,9,10])   
```

This query will retrieve the book titles along with similarity scores with respect to your query. This vector search query can be used in our SDKs as shown below:

```csharp 
  float[] embedding = float[] {1f,2f,3f,4f,5f,6f,7f,8f,9f,10f}
  var queryDef = new QueryDefinition(
      query: $"SELECT c.title, VectorDistance(c.contentVector,@embedding) AS SimilarityScore  FROM c"
      ).WithParameter("@embedding", embedding);
  using FeedIterator<Object> feed = container.GetItemQueryIterator<Object>(
      queryDefinition: queryDef
  );
  while (feed.HasMoreResults) 
  {
      FeedResponse<Object> response = await feed.ReadNextAsync();
      foreach ( Object item in response)
      {
          Console.WriteLine($"Found item:\t{item}");
      }
  }
``` 

## Next steps
- [VectorDistance system function](query/vectordistance.md)
- [Vector indexing](../index-policy.md)
- [Setup Azure Cosmos DB for NoSQL for vector search](../vector-search.md).
