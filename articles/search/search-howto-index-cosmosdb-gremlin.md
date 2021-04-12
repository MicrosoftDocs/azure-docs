---
title: Search over Azure Cosmos DB Gremlin API data (preview)
titleSuffix: Azure Cognitive Search
description: Import data from Azure Cosmos DB Gremlin API into a searchable index in Azure Cognitive Search. Indexers automate data ingestion for selected data sources like Azure Cosmos DB.

author: vkurpad 
manager: luisca
ms.author: vikurpad
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/11/2021
---

# How to index data available through Cosmos DB Gremlin API using an indexer (preview)

> [!IMPORTANT]
> The Cosmos DB Gremlin API indexer is currently in preview. Preview functionality is provided without a service level agreement and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> You can request access to the preview by filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview).
> For this preview, we recommend using the [REST API version 2020-06-30-Preview](search-api-preview.md). There is currently limited portal support and no .NET SDK support.

> [!WARNING]
> In order for Azure Cognitive Search to index data in Cosmos DB through the Gremlin API, [Cosmos DB's own indexing](https://docs.microsoft.com/azure/cosmos-db/index-overview) must also be enabled and set to [Consistent](https://docs.microsoft.com/azure/cosmos-db/index-policy#indexing-mode). This is the default configuration for Cosmos DB. Azure Cognitive Search indexing will not work without Cosmos DB indexing already enabled.

[Azure Cosmos DB indexing](https://docs.microsoft.com/azure/cosmos-db/index-overview) and [Azure Cognitive Search indexing](search-what-is-an-index.md) are distinct operations, unique to each service. Before you start Azure Cognitive Search indexing, your Azure Cosmos DB database must already exist.

This article shows you how to configure Azure Cognitive Search to index content from Azure Cosmos DB using the Gremlin API. This workflow creates an Azure Cognitive Search index and loads it with existing text extracted from Azure Cosmos DB using the Gremlin API.

## Get started

You can use the [preview REST API](https://docs.microsoft.com/rest/api/searchservice/index-2020-06-30-preview) to index Azure Cosmos DB data that's available through the Gremlin API by following a three-part workflow common to all indexers in Azure Cognitive Search: create a data source, create an index, create an indexer. In the process below, data extraction from Cosmos DB starts when you submit the Create Indexer request.

By default the Azure Cognitive Search Cosmos DB Gremlin API indexer will make every vertex in your graph a document in the index. Edges will be ignored. If you would like different behavior, refer to the custom query examples later in this article.

### Step 1 - Assemble inputs for the request

For each request, you must provide the service name and admin key for Azure Cognitive Search (in the POST header), and the storage account name and key for blob storage. You can use [Postman] (search-get-started-postman.md) or any REST API client to send HTTPS requests to Azure Cognitive Search.

Copy and save the following values for use in your request:

+ Azure Cognitive Search service name
+ Azure Cognitive Search admin key
+ Cosmos DB Gremlin API connection string

You can find these values in the Azure portal:

1. In the portal pages for Azure Cognitive Search, copy the search service URL from the Overview page.

2. In the left navigation pane, click **Keys** and then copy either the primary or secondary key.

3. Switch to the portal pages for your Cosmos DB account. In the left navigation pane, under **Settings**, click **Keys**. This page provides a URI, two sets of connection strings, and two sets of keys. Copy one of the connection strings to Notepad.

### Step 2 - Create a data source

A **data source** specifies the data to index, credentials, and policies for identifying changes in the data (such as modified or deleted documents inside your collection). The data source is defined as an independent resource so that it can be used by multiple indexers.

To create a data source, formulate a POST request:

```http
    POST https://[service name].search.windows.net/datasources?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [Search service admin key]
    
    {
        "name": "mycosmosdbgremlindatasource",
        "type": "cosmosdb",
        "credentials": {
            "connectionString": "AccountEndpoint=https://myCosmosDbEndpoint.documents.azure.com;AccountKey=myCosmosDbAuthKey;ApiKind=Gremlin;Database=myCosmosDbDatabaseId"
        },
        "container": { "name": "myGraphId", "query": null }
    }
```

The body of the request contains the data source definition, which should include the following fields:

| Field   | Description |
|---------|-------------|
| **name** | Required. Choose any name to represent your data source object. |
|**type**| Required. Must be `cosmosdb`. |
|**credentials** | Required. The **connectionString** must include an AccountEndpoint, AccountKey, ApiKind, and Database. The ApiKind is **Gremlin**.</br></br>For example:<br/>`AccountEndpoint=https://<Cosmos DB account name>.documents.azure.com;AccountKey=<Cosmos DB auth key>;Database=<Cosmos DB database id>;ApiKind=Gremlin`<br/><br/>The AccountEndpoint must use the `*.documents.azure.com` endpoint.
| **container** | Contains the following elements: <br/>**name**: Required. Specify the ID of the graph.<br/>**query**: Optional. You can specify a query to reshape a graph into a schema that Azure Cognitive Search can index.</br></br>If no query is provided the indexer will index each vertex in the graph as a document in the index and edge information will not be indexed. To index the edges, set the query to `g.E()`. |
| **dataChangeDetectionPolicy** | Incremental progress will be enabled by default using `_ts` as the high water mark column. |
|**dataDeletionDetectionPolicy** | Optional. See [Indexing Deleted Documents](#DataDeletionDetectionPolicy) section.|

### Step 3 - Create a target search index

[Create a target Azure Cognitive Search index](/rest/api/searchservice/create-index) if you don't have one already. The following example creates an index with id, label, and description fields:

```http
    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
    Content-Type: application/json
    api-key: [Search service admin key]

	{
       "name": "mysearchindex",
       "fields": [
        {
            "name": "rid",
            "type": "Edm.String",
            "facetable": false,
            "filterable": false,
            "key": true,
            "retrievable": true,
            "searchable": true,
            "sortable": false,
            "analyzer": "standard.lucene",
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "synonymMaps": [],
            "fields": []
        },{
            "name": "id",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "retrievable": true,
            "sortable": false,
            "facetable": false,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": "standard.lucene",
            "synonymMaps": []
        }, {
            "name": "label",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "retrievable": true,
            "sortable": false,
            "facetable": false,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": "standard.lucene",
            "synonymMaps": []
       }]
     }
```

Ensure that the schema of your target index is compatible with your graph.

For partitioned collections, the default document key is Azure Cosmos DB's `_rid` property, which Azure Cognitive Search automatically renames to `rid` because field names cannot start with an underscore character. Also, Azure Cosmos DB `_rid` values contain characters that are invalid in Azure Cognitive Search keys. For this reason, the `_rid` values should be Base64 encoded if you would like to make it your document key.

### Mapping between JSON Data Types and Azure Cognitive Search Data Types
| JSON data type | Compatible target index field types |
| --- | --- |
| Bool |Edm.Boolean, Edm.String |
| Numbers that look like integers |Edm.Int32, Edm.Int64, Edm.String |
| Numbers that look like floating-points |Edm.Double, Edm.String |
| String |Edm.String |
| Arrays of primitive types, for example ["a", "b", "c"] |Collection(Edm.String) |
| Strings that look like dates |Edm.DateTimeOffset, Edm.String |
| GeoJSON objects, for example { "type": "Point", "coordinates": [long, lat] } |Edm.GeographyPoint |
| Other JSON objects |N/A |

### Step 4 - Configure and run the indexer

Once the index and data source have been created, you're ready to create the indexer:

```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
      "name": "mycosmosdbgremlinindexer",
      "description": "My Cosmos DB Gremlin API indexer",
      "dataSourceName": "mycosmosdbgremlindatasource",
      "targetIndexName": "mysearchindex"
    }
```

This indexer will start running after it's created and only run once. You can add the optional schedule parameter to the request to set your indexer to run on a schedule. For more information about defining indexer schedules, see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

For more details on the Create Indexer API, check out [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).

<a name="DataDeletionDetectionPolicy"></a>

## Indexing deleted documents

When graph data is deleted, you might want to delete its corresponding document from the search index as well. The purpose of a data deletion detection policy is to efficiently identify deleted data items and delete the full document from the index. The data deletion detection policy isn't meant to delete partial document information. Currently, the only supported policy is the `Soft Delete` policy (deletion is marked with a flag of some sort), which is specified as follows:

```http
    {
        "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
        "softDeleteColumnName" : "the property that specifies whether a document was deleted",
        "softDeleteMarkerValue" : "the value that identifies a document as deleted"
    }
```

If you are using a custom query, make sure that the property referenced by `softDeleteColumnName` is projected by the query.

The following example creates a data source with a soft-deletion policy:

```http
    POST https://[service name].search.windows.net/datasources?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [Search service admin key]
    
    {
        "name": "mycosmosdbgremlindatasource",
        "type": "cosmosdb",
        "credentials": {
            "connectionString": "AccountEndpoint=https://myCosmosDbEndpoint.documents.azure.com;AccountKey=myCosmosDbAuthKey;ApiKind=Gremlin;Database=myCosmosDbDatabaseId"
        },
        "container": { "name": "myCollection" },
        "dataChangeDetectionPolicy": {
            "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
            "highWaterMarkColumnName": "`_ts`"
        },
        "dataDeletionDetectionPolicy": {
            "@odata.type": "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
            "softDeleteColumnName": "isDeleted",
            "softDeleteMarkerValue": "true"
        }
    }
```

<a name="MappingGraphData"></a>

## Mapping graph data to a search index

The Cosmos DB Gremlin API indexer will automatically map a couple pieces of graph data for you:

1. The indexer will map `_rid` to an `rid` field in the index if it exists. Note that if you would like to use the `rid` value as a key in your index you should Base64 encode the key since `_rid` can contain characters that are invalid in Azure Cognitive Search document keys.

1. The indexer will map `_id` to an `id` field in the index if it exists.

1. When querying your Cosmos DB database using the Gremlin API you may notice that the JSON output for each property has an `id` and a `value`. Azure Cognitive Search Cosmos DB indexer will automatically map the properties `value` into a field in your search index that has the same name as the property if it exists. In the following example, 450 would be mapped to a `pages` field in the search index.

```http
    {
        "id": "Cookbook",
        "label": "book",
        "type": "vertex",
        "properties": {
          "pages": [
            {
              "id": "48cf6285-a145-42c8-a0aa-d39079277b71",
              "value": "450"
            }
          ]
        }
    }
```

If you are using a custom query you may find that you need to use [Output Field Mappings](cognitive-search-output-field-mapping.md) in order to map your custom query output to the fields in your index. You'll likely want to use Output Field Mappings instead of [Field Mappings](search-indexer-field-mappings.md) since the custom query will likely have complex data.

For example, let's say that your custom query produces this simplified output:

```http
    [
      {
        "vertex": {
          "id": "Cookbook",
          "label": "book",
          "type": "vertex",
          "properties": {
            "pages": [
              {
                "id": "48cf6085-a211-42d8-a8ea-d38642987a71",
                "value": "450"
              }
            ],
          }
        },
        "written_by": [
          {
            "yearStarted": "2017"
          }
        ]
      }
    ]
```

If you would like to map the value of `pages` in the JSON above to a `totalpages` field in your index, you can add the following [Output Field Mapping](cognitive-search-output-field-mapping.md) to your indexer definition:

```http
    ... // rest of indexer definition 
    "outputFieldMappings": [
        {
          "sourceFieldName": "/document/vertex/pages",
          "targetFieldName": "totalpages"
        }
    ]
```

Notice how the Output Field Mapping starts with `/document` and does not include a reference to the properties key in the JSON. This is because the indexer puts each document under the `/document` node when ingesting the graph data and the indexer also automatically allows you to reference the value of `pages` by simple referencing `pages` instead of having to reference the first object in the array of `pages`.

If you would like to map the value of `yearStarted` to a Collection(Edm.String) named `startYear` you can add the following [Output Field Mapping](cognitive-search-output-field-mapping.md) to your indexer definition:

```http
    ... // rest of indexer definition 
    "outputFieldMappings": [
        {
          "sourceFieldName": "/document/written_by/*/yearStarted",
          "targetFieldName": "years"
        }
    ]
```

Notice in this mapping you're taking every object in the `written_by` array and putting its `yearStarted` into the `years` field in the index.

## Custom queries

> [!WARNING]
> The default `batchSize` for Cosmos DB Gremlin API is 10,000. The exception to this rule is when you use a custom query with no data change tracking policy. In that scenario, the indexer will attempt to index all documents that can be returned in a single Cosmos DB query run based on the Cosmos DB query limits. With this specific configuration, the `batchSize` parameter for the indexer will be ignored.

When indexing content from Cosmos DB Gremlin API into an Azure Cognitive Search index, graph data will be represented as documents in an index. As part of the indexing process it can be helpful to reshape your graph data to better fit a search index schema. You can do this by adding a custom query to your data source.

Custom queries will reshape the data into a format more suitable for the index, but you may still have to use Field Mappings to point the data to the right field in the index. More information on mapping data can be found in the [Mapping graph data section](#MappingGraphData).

### Custom Query Examples
Below are a few examples for how you can add a custom query to your data source definition so that you can reshape the data to better fit a search index. These examples don't show every scenario but highlight a couple common ones.

For every example scenario below:

1. The custom queries are based on the following graph:

    ![](./media/search-howto-index-cosmosdb-gremlin/sample-graph.png)

1. `_ts` is being used as the `highWaterMarkColumnName`. This is required if you enable a data change tracking policy.

1. Although the graph data is being reshaped to better fit an index, you may still need to use Field Mappings to map your graph data to fields in the index. More information about mapping graph data to an index can be found in the [Mapping graph data section](#MappingGraphData).

#### Scenario 1: Each vertex or edge is a document in the index

Below is a list of examples for how to index vertices and edges as documents in your index.

1. Index every vertex or a particular type of vertex as individual documents in the index.

    By default, the indexer will index every vertex in the graph as a document in the index. This will not include edge information. If this is your desired scenario, you do not need to provide a custom query:
    
    ```http
        "query" : null
    ```

    If you would only like to index vertices that are books as documents in your index:
    
    ```http
        "query" : "g.V().hasLabel('book').has('_ts',gte(@HighWaterMark)).order().by('_ts',incr)"
    ```

1. Index every edge or a particular type of edge as individual documents in the index.

    The follow query will index all edges as documents in the index:

    ```http
        "query" : "g.E()"
    ```

    If you would only like to index edges that have label *written_by* as documents in your index:

    ```http
        "query" : "g.E().hasLabel('written_by').has('_ts',gte(@HighWaterMark)).order().by('_ts',incr)"
    ```

1. If you would like to index all vertices as documents and all edges as separate documents in the index we recommend creating two indexers and having one index all vertices and the other index all edges. Point both indexers to the same index.

#### Scenario 2: Each vertex and its edges are a document in the index

If you would like to index every book with its outgoing edge information as a document in the index, you can provide the below custom query when creating the data source to properly shape your graph data. This query will output the vertex `_ts` value, the vertex `_rid` value, the vertex information, and an array of ids and yearStarted years from the outgoing edges into one object that can be indexed as a single document in the index.

> [!WARNING]
> The below example is a cross partition query. If you have a large dataset this may result in a high number of [Request Units (RUs)](https://docs.microsoft.com/azure/cosmos-db/request-units) against your Cosmos DB database. As a result, you may see performance issues with your graph database while the indexer is running this query.

```http
    "query" : "g.V().hasLabel('book')
                    .has('_ts',gte(@HighWaterMark))
                    .order().by('_ts',incr)
                    .project('_ts','_rid','vertex','written_by')
                    .by('_ts')
                    .by('_rid')
                    .by()
                    .by(outE()
                        .hasLabel('written_by')
                        .project('id','yearStarted')
                        .by('id')
                        .by('yearStarted')
                        .fold())"
```

If you have set the data change detection policy, this example determines if a book vertex should be updated in the index based on the book vertex `_ts` value getting updated. This means that if a book vertex already exists and has been indexed in Azure Cognitive Search, then an outgoing edge is added to that vertex, the edge information for that document in the index won't get updated unless the vertex is updated too. To avoid missing edge updates, you can update the vertex when updating an edge so that its `_ts` value gets updated.

#### Scenario 3: Each vertex and the vertices its connected to are a single document in the index

In this scenario we want to index each book as a document in the index and in each document we also want to include information about the author and publisher for that book. The author and publisher information come from different vertices that the book is connected to. With this custom query each document in the index can include the book information, author id, and the publisher id.

> [!WARNING]
> The below example is a cross partition query. If you have a large dataset this may result in a high number of [Request Units (RUs)](https://docs.microsoft.com/azure/cosmos-db/request-units) against your Cosmos DB database. As a result, you may see performance issues with your graph database while the indexer is running this query.

```http
    "query" : "g.V().hasLabel('book')
                    .has('_ts',gte(@HighWaterMark))
                    .order().by('_ts',incr)
                    .project('_ts','_rid','vertex','publisher','author')
                    .by('_ts')
                    .by('_rid')
                    .by()
                    .by(out('published_by')
                        .values('id')
                        .fold())
                    .by(out('written_by')
                        .values('id')
                        .fold())"
```

If you have set the data change detection policy, this example determines if a book vertex should be updated in the index based on the book vertex `_ts` value getting updated. This means that if a book vertex already exists and has been indexed in Azure Cognitive Search, then an outgoing edge is added to that vertex, the edge information for that document in the index won't get updated unless the vertex is updated too. To avoid missing edge updates, you can update the vertex when updating an edge so that it's `_ts` gets updated.

#### Scenario 4: Each vertex, its edges, and its connected vertices are a single document in the index

In this scenario we want to index each book as a document in the index and in each document we also want to include information about the author, the publisher, and the edges that connect them. With this custom query each document in the index can include the book information, author id, publisher id, and information about the edges that connect them.

> [!WARNING]
> The below example is a cross partition query. If you have a large dataset this may result in a high number of [Request Units (RUs)](https://docs.microsoft.com/azure/cosmos-db/request-units) against your Cosmos DB database. As a result, you may see performance issues with your graph database while the indexer is running this query.

```http
    "query" : "g.V().hasLabel('book')
                    .has('_ts',gte(@HighWaterMark))
                    .order().by('_ts',incr)
                    .project('_ts','_rid','vertex','publisher','author')
                    .by('_ts')
                    .by('_rid')
                    .by()
                    .by(out('published_by')
                        .values('id')
                        .fold())
                    .by(outE('written_by')
                        .as('yearStarted')
                        .inV()
                        .as('name')
                        .select('yearStarted','name')
                        .by(values('yearStarted'))
                        .by(values('id'))
                        .fold())"
```

If you have set the data change detection policy, this example determines if a book vertex should be updated in the index based on the book vertex `_ts` value getting updated. This means that if a book vertex already exists and has been indexed in Azure Cognitive Search, then an outgoing edge is added to that vertex, the edge information for that document in the index won't get updated unless the vertex is updated too. To avoid missing edge updates, you can update the vertex when updating an edge so that it's `_ts` gets updated.

## Next steps

* To learn more about Azure Cosmos DB Gremlin API, see the [Introduction to Azure Cosmos DB: Gremlin API](https://docs.microsoft.com/azure/cosmos-db/graph-introduction).
* To learn more about Azure Cognitive Search, see the [Search service page](https://azure.microsoft.com/services/search/).