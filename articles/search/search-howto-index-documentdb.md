---
title: Indexing a DocumentDB data source for Azure Search | Microsoft Docs
description: This article shows you how to create an Azure Search indexer with DocumentDB as a data source.
services: search
documentationcenter: ''
author: chaosrealm
manager: pablocas
editor: 

ms.assetid: 
ms.service: documentdb
ms.devlang: rest-api
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: search
ms.date: 04/11/2017
ms.author: eugenesh

---
# Connecting DocumentDB with Azure Search using indexers

If you want to implement a great search experience over your DocumentDB data, you can use an Azure Search indexer to pull data into an Azure Search index. In this article, we show you how to integrate Azure DocumentDB with Azure Search without having to write any code to maintain indexing infrastructure.

To set up a DocumentDB indexer, you must have an [Azure Search service](search-create-service-portal.md), and create an index, datasource, and finally the indexer. You can create these objects using the [portal](search-import-data-portal.md), [.NET SDK](/dotnet/api/microsoft.azure.search), or [REST API](/rest/api/searchservice/) for all non-.NET languages. 

If you opt for the portal, the [Import data wizard](search-import-data-portal.md) guides you through the creation of all these resources.

> [!NOTE]
> You can launch the **Import data** wizard from the DocumentDB dashboard to simplify indexing for that data source. In left-navigation, go to **Collections** > **Add Azure Search** to get started.

<a name="Concepts"></a>
## Azure Search indexer concepts
Azure Search supports the creation and management of data sources (including DocumentDB) and indexers that operate against those data sources.

A **data source** specifies the data to index, credentials, and policies for identifying changes in the data (such as modified or deleted documents inside your collection). The data source is defined as an independent resource so that it can be used by multiple indexers.

An **indexer** describes how the data flows from your data source into a target search index. An indexer can be used to:

* Perform a one-time copy of the data to populate an index.
* Sync an index with changes in the data source on a schedule. The schedule is part of the indexer definition.
* Invoke on-demand updates to an index as needed.

<a name="CreateDataSource">
## Step 1: Create a data source
Issue an HTTP POST request to create a new data source:

    POST https://[Search service name].search.windows.net/datasources?api-version=2016-09-01
    Content-Type: application/json
    api-key: [Search service admin key]

	{
        "name": "mydocdbdatasource",
        "type": "documentdb",
        "credentials": {
            "connectionString": "AccountEndpoint=https://myDocDbEndpoint.documents.azure.com;AccountKey=myDocDbAuthKey;Database=myDocDbDatabaseId"
        },
        "container": { "name": "myDocDbCollectionId", "query": null },
        "dataChangeDetectionPolicy": {
            "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
            "highWaterMarkColumnName": "_ts"
        }
    }

The body of the request contains the data source definition, which should include the following fields:

* **name**: Choose any name to represent your DocumentDB database.
* **type**: Must be `documentdb`.
* **credentials**:
  
  * **connectionString**: Required. Specify the connection info to your Azure DocumentDB database in the following format: `AccountEndpoint=<DocumentDB endpoint url>;AccountKey=<DocumentDB auth key>;Database=<DocumentDB database id>`
* **container**:
  
  * **name**: Required. Specify the id of the DocumentDB collection to be indexed.
  * **query**: Optional. You can specify a query to flatten an arbitrary JSON document into a flat schema that Azure Search can index.
* **dataChangeDetectionPolicy**: Recommended. See [Data Change Detection Policy](#DataChangeDetectionPolicy) below.
* **dataDeletionDetectionPolicy**: Optional. See [Data Deletion Detection Policy](#DataDeletionDetectionPolicy) below.

### Using queries to shape indexed data
You can specify a DocumentDB query to flatten nested properties or arrays, project JSON properties, and filter the data to be indexed. 

Example document:

    {
        "userId": 10001,
        "contact": {
            "firstName": "andy",
            "lastName": "hoh"
        },
        "company": "microsoft",
        "tags": ["azure", "documentdb", "search"]
    }

Filter query:

    SELECT * FROM c WHERE c.company = "microsoft" and c._ts >= @HighWaterMark

Flattening query:

    SELECT c.id, c.userId, c.contact.firstName, c.contact.lastName, c.company, c._ts FROM c WHERE c._ts >= @HighWaterMark
    
    
Projection query:

    SELECT VALUE { "id":c.id, "Name":c.contact.firstName, "Company":c.company, "_ts":c._ts } FROM c WHERE c._ts >= @HighWaterMark


Array flattening query:

    SELECT c.id, c.userId, tag, c._ts FROM c JOIN tag IN c.tags WHERE c._ts >= @HighWaterMark

<a name="CreateIndex"></a>
## Step 2: Create an index
Create a target Azure Search index if you don’t have one already. You can do this from the [Azure portal UI](search-create-index-portal.md) or by using the [Create Index REST API](/rest/api/searchservice/create-index) or [Index class](/dotnet/api/microsoft.azure.search.models.index).

The following example creates an index with an id and description field:

    POST https://[Search service name].search.windows.net/indexes?api-version=2016-09-01
    Content-Type: application/json
    api-key: [Search service admin key]

	{
       "name": "mysearchindex",
       "fields": [{
         "name": "id",
         "type": "Edm.String",
         "key": true,
         "searchable": false
       }, {
         "name": "description",
         "type": "Edm.String",
         "filterable": false,
         "sortable": false,
         "facetable": false,
         "suggestions": true
       }]
     }

Ensure that the schema of your target index is compatible with the schema of the source JSON documents or the output of your custom query projection.

> [!NOTE]
> For partitioned collections, the default document key is DocumentDB's `_rid` property, which gets renamed to `rid` in Azure Search. Also, DocumentDB's `_rid` values contain characters that are invalid in Azure Search keys. For this reason, the `_rid` values are Base64 encoded.
> 
> 

### Mapping between JSON Data Types and Azure Search Data Types
| JSON DATA TYPE | COMPATIBLE TARGET INDEX FIELD TYPES |
| --- | --- |
| Bool |Edm.Boolean, Edm.String |
| Numbers that look like integers |Edm.Int32, Edm.Int64, Edm.String |
| Numbers that look like floating-points |Edm.Double, Edm.String |
| String |Edm.String |
| Arrays of primitive types e.g. "a", "b", "c" |Collection(Edm.String) |
| Strings that look like dates |Edm.DateTimeOffset, Edm.String |
| GeoJSON objects e.g. { "type": "Point", "coordinates": [long, lat] } |Edm.GeographyPoint |
| Other JSON objects |N/A |

<a name="CreateIndexer"></a>
## Step 3: Create an indexer

The following example creates an indexer that copies data from the collection referenced by the `myDocDbDataSource` data source to the `mySearchIndex` index on a schedule that starts on Jan 1, 2015 UTC and runs hourly.

    POST https://[Search service name].search.windows.net/indexers?api-version=2016-09-01
    Content-Type: application/json
    api-key: [Search service admin key]

	{
        "name" : "mysearchindexer",
        "dataSourceName" : "mydocdbdatasource",
        "targetIndexName" : "mysearchindex",
        "schedule" : { "interval" : "PT1H", "startTime" : "2015-01-01T00:00:00Z" }
    }

The body of the request contains the indexer definition, which includes the following fields:

* **name**: Required. The name of the indexer.
* **dataSourceName**: Required. The name of an existing data source.
* **targetIndexName**: Required. The name of an existing index.
* **schedule**: Optional. See [Indexing Schedule](#IndexingSchedule) below.

<a name="IndexingSchedule"></a>
### Running indexer on a schedule
An indexer can optionally specify a schedule to run the indexer periodically. A schedule has the following attributes:

* **interval**: Required. A duration value that specifies an interval or period for indexer runs. The smallest allowed interval is 5 minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours.
* **startTime**: Optional. An UTC datetime that specifies when the indexer should start running.

<a id="RunIndexer"></a>
### Running indexer on-demand
In addition to running periodically on a schedule, an indexer can also be invoked on demand by issuing an HTTP POST request:

    POST https://[Search service name].search.windows.net/indexers/[indexer name]/run?api-version=2016-09-01
    api-key: [Search service admin key]

You will receive an HTTP 202 Accepted response if the indexer was successfully invoked, but the actual indexer processing will happen asynchronously. You can monitor the indexer status in the portal or using the Get Indexer Status API which we describe next.

<a name="GetIndexerStatus"></a>
### Getting indexer status
You can retrieve the current status and execution history of an indexer:

    GET https://[Search service name].search.windows.net/indexers/[indexer name]/status?api-version=2016-09-01
    api-key: [Search service admin key]

The response contains information about overall indexer status, the last (or in-progress) indexer invocation, and the history of recent indexer invocations if present.

    {
        "status":"running",
        "lastResult": {
            "status":"success",
            "errorMessage":null,
            "startTime":"2014-11-26T03:37:18.853Z",
            "endTime":"2014-11-26T03:37:19.012Z",
            "errors":[],
            "itemsProcessed":11,
            "itemsFailed":0,
            "initialTrackingState":null,
            "finalTrackingState":null
         },
        "executionHistory":[ {
            "status":"success",
             "errorMessage":null,
            "startTime":"2014-11-26T03:37:18.853Z",
            "endTime":"2014-11-26T03:37:19.012Z",
            "errors":[],
            "itemsProcessed":11,
            "itemsFailed":0,
            "initialTrackingState":null,
            "finalTrackingState":null
        }]
    }

Execution history contains up to the 50 most recent completed executions, which are sorted in reverse chronological order (so the latest execution comes first in the response).

<a name="DataChangeDetectionPolicy"></a>
## Capturing changed documents
The purpose of a data change detection policy is to efficiently identify changed data items. Currently, the only supported policy is the `High Water Mark` policy using the `_ts` (timestamp) property provided by DocumentDB - which is specified as follows:

    {
        "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName" : "_ts"
    }

Using this policy is highly recommended to ensure good indexer performance. 

If you are using a custom query, make sure that the `_ts` property is projected by the query. 

<a name="DataDeletionDetectionPolicy"></a>
### Capturing deleted documents
When rows are deleted from the source table, you should delete those rows from the search index as well. The purpose of a data deletion detection policy is to efficiently identify deleted data items. Currently, the only supported policy is the `Soft Delete` policy (deletion is marked with a flag of some sort), which is specified as follows:

    {
        "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
        "softDeleteColumnName" : "the property that specifies whether a document was deleted",
        "softDeleteMarkerValue" : "the value that identifies a document as deleted"
    }

If you are using a custom query, make sure that the property referenced by `softDeleteColumnName` is projected by the query.

The following example creates a data source with a soft-deletion policy:

	POST https://[Search service name].search.windows.net/datasources?api-version=2016-09-01
    Content-Type: application/json
    api-key: [Search service admin key]

    {
        "name": "mydocdbdatasource",
        "type": "documentdb",
        "credentials": {
            "connectionString": "AccountEndpoint=https://myDocDbEndpoint.documents.azure.com;AccountKey=myDocDbAuthKey;Database=myDocDbDatabaseId"
        },
        "container": { "name": "myDocDbCollectionId" },
        "dataChangeDetectionPolicy": {
            "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
            "highWaterMarkColumnName": "_ts"
        },
        "dataDeletionDetectionPolicy": {
            "@odata.type": "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
            "softDeleteColumnName": "isDeleted",
            "softDeleteMarkerValue": "true"
        }
    }

## <a name="NextSteps"></a>Next steps
Congratulations! You have just learned how to integrate Azure DocumentDB with Azure Search using the indexer for DocumentDB.

* To learn how more about Azure DocumentDB, see the [DocumentDB service page](https://azure.microsoft.com/services/documentdb/).
* To learn how more about Azure Search, see the [Search service page](https://azure.microsoft.com/services/search/).