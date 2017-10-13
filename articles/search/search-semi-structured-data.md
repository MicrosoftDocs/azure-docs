---
title: Search semi-structured data in Azure cloud storage
description: Searching semi-structured blob data using Azure Search.
author: roygara
manager: timlt

ms.service: search
ms.topic: tutorial
ms.date: 10/12/2017
ms.author: rogara
ms.custom: mvc
---

# Search semi-structured data in cloud storage

In this two-part tutorial series, you learn how to search semi-structured and unstructured data using Azure search. This tutorial shows you how to search semi-structured data, such as JSON, stored in Azure blobs. Semi-structured data contains tags or markings which separate content within the data. It differs from structured data in that it is not formally structured according to a data model, such as a relational database schema.

In this part we cover how to:

> [!div class="checklist"]
> * Create an Azure Search Service using the REST API
> * Use the Azure Search Service to search your container

## Prerequisites

To complete this tutorial:
* Complete the [previous tutorial](../storage/blobs/storage-unstructured-search.md)
* Install a REST client
* Gain familiarity with REST API queries

## Setup

To complete this tutorial you need a REST client. For the purposes of this tutorial, we are using [Postman](https://www.getpostman.com/). Feel free to use a different REST client if you're already comfortable with a particular one.

After installing Postman, launch it.

If this is your first time making REST calls to Azure, here's a brief introduction of the important components for this tutorial: The request method for every call in this tutorial is "POST." The header keys are "Content-type" and "api-key." The values of the header keys are "application/json" and your "admin key" (the admin key is a placeholder for your search primary key) respectively. The body is where you place the actual contents of your call. Depending on the client you're using, there may be some variations on how you construct your query, but those are the basics.

  ![Semi-structured search](media/search-semi-structured-data/postmanoverview.png)

For the REST calls covered in this tutorial, your search api-key is required. You can find your api-key under **Keys** inside your search service. This api-key must be in the header of every API call (replace "admin key" in the preceding screenshot with it) this tutorial directs you to make. Retain the key since you need it for each call.

  ![Semi-structured search](media/search-semi-structured-data/keys.png)

## Download the sample data

A sample data set has been prepared for you. **Download [clinical-trials-json.zip](https://github.com/Azure-Samples/storage-blob-integration-with-cdn-search-hdi/raw/master/clinical-trials-json.zip)** and unzip it to its own folder.

Contained in the sample are example JSON files, which were originally text files obtained from [clinicaltrials.gov](https://clinicaltrials.gov/ct2/results). We have converted them to JSON for your convenience.

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com).

## Upload the sample data

In the Azure portal, navigate back to the storage account created in the [previous tutorial](./storage-unstructured-search.md). Then open the **data** container, and click **Upload**.

Click **Advanced**, enter "clinical-trials-json", and then upload all of the JSON files you downloaded.

  ![Semi-structured search](media/search-semi-structured-data/clinicalupload.png)

After the upload completes, the files should appear in their own subfolder inside the data container.

## Connect your search service to your container

We are using the REST API to perform the connection because the UI does not currently support JSON indexing.

The query string must contain **api-version=2016-09-01-Preview** and each call should return a **201 Created**. The generally available api-version does not yet have the capability to handle json as a jsonArray, currently only the preview api-version does.

Execute the following three API calls from your REST client.

### Create a datasource

A data source specifies what data to index.

The endpoint of this call is `https://[service name].search.windows.net/datasources?api-version=2016-09-01-Preview`. Replace `[service name]` with the name of your search service.

For this call, you need the name of your storage account and your storage account key. The storage account key can be found in the Azure portal inside your storage account's **Access Keys**. The location is shown in the following image:

  ![Semi-structured search](media/search-semi-structured-data/storagekeys.png)

Make sure to replace the `[storage account name]` and `[storage account key]` in the body of your call before executing the call.

```json
{
    "name" : "clinical-trials-json",
    "type" : "azureblob",
    "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=[storage account name];AccountKey=[storage account key];" },
    "container" : { "name" : "data", "query" : "clinical-trials-json" }
}
```

The response should look like:

```json
{
    "@odata.context": "https://exampleurl.search.windows.net/$metadata#datasources/$entity",
    "@odata.etag": "\"0x8D505FBC3856C9E\"",
    "name": "clinical-trials-json",
    "description": null,
    "type": "azureblob",
    "subtype": null,
    "credentials": {
        "connectionString": "DefaultEndpointsProtocol=https;AccountName=[mystorageaccounthere];AccountKey=[[myaccountkeyhere]]];"
    },
    "container": {
        "name": "data",
        "query": "clinical-trials-json"
    },
    "dataChangeDetectionPolicy": null,
    "dataDeletionDetectionPolicy": null
}
```

### Create an index
    
The second API call creates an index. An index specifies all the parameters and their attributes.

The URL for this call is `https://[service name].search.windows.net/indexes?api-version=2016-09-01-Preview`. Replace `[service name]` with the name of your search service.

First replace the URL. Then copy and paste the following code into your body and run the query.

```json
{
  "name": "clinical-trials-json-index",  
  "fields": [
  {"name": "FileName", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": false, "filterable": false, "sortable": true},
  {"name": "Description", "type": "Edm.String", "searchable": true, "retrievable": false, "facetable": false, "filterable": false, "sortable": false},
  {"name": "MinimumAge", "type": "Edm.Int32", "searchable": false, "retrievable": true, "facetable": true, "filterable": true, "sortable": true},
  {"name": "Title", "type": "Edm.String", "searchable": true, "retrievable": true, "facetable": false, "filterable": true, "sortable": true},
  {"name": "URL", "type": "Edm.String", "searchable": false, "retrievable": false, "facetable": false, "filterable": false, "sortable": false},
  {"name": "MyURL", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": false, "filterable": false, "sortable": false},
  {"name": "Gender", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": true, "filterable": true, "sortable": false},
  {"name": "MaximumAge", "type": "Edm.Int32", "searchable": false, "retrievable": true, "facetable": true, "filterable": true, "sortable": true},
  {"name": "Summary", "type": "Edm.String", "searchable": true, "retrievable": true, "facetable": false, "filterable": false, "sortable": false},
  {"name": "NCTID", "type": "Edm.String", "key": true, "searchable": true, "retrievable": true, "facetable": false, "filterable": true, "sortable": true},
  {"name": "Phase", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": true, "filterable": true, "sortable": false},
  {"name": "Date", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": false, "filterable": false, "sortable": true},
  {"name": "OverallStatus", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": true, "filterable": true, "sortable": false},
  {"name": "OrgStudyId", "type": "Edm.String", "searchable": true, "retrievable": true, "facetable": false, "filterable": true, "sortable": false},
  {"name": "HealthyVolunteers", "type": "Edm.String", "searchable": false, "retrievable": true, "facetable": true, "filterable": true, "sortable": false},
  {"name": "Keywords", "type": "Collection(Edm.String)", "searchable": true, "retrievable": true, "facetable": true, "filterable": false, "sortable": false},
  {"name": "metadata_storage_last_modified", "type":"Edm.DateTimeOffset", "searchable": false, "retrievable": true, "filterable": true, "sortable": false},
  {"name": "metadata_storage_size", "type":"Edm.String", "searchable": false, "retrievable": true, "filterable": true, "sortable": false},
  {"name": "metadata_content_type", "type":"Edm.String", "searchable": true, "retrievable": true, "filterable": true, "sortable": false}
  ],
  "suggesters": [
  {
    "name": "sg",
    "searchMode": "analyzingInfixMatching",
    "sourceFields": ["Title"]
  }
  ]
}
```

The response should look like:

```json
{
    "@odata.context": "https://exampleurl.search.windows.net/$metadata#indexes/$entity",
    "@odata.etag": "\"0x8D505FC00EDD5FA\"",
    "name": "clinical-trials-json-index",
    "fields": [
        {
            "name": "FileName",
            "type": "Edm.String",
            "searchable": false,
            "filterable": false,
            "retrievable": true,
            "sortable": true,
            "facetable": false,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": null,
            "synonymMaps": []
        },
        {
            "name": "Description",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "retrievable": false,
            "sortable": false,
            "facetable": false,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": null,
            "synonymMaps": []
        },
        ...
          "scoringProfiles": [],
    "defaultScoringProfile": null,
    "corsOptions": null,
    "suggesters": [],
    "analyzers": [],
    "tokenizers": [],
    "tokenFilters": [],
    "charFilters": []
}
```

### Create an indexer

An indexer connects the data source to the target search index and optionally provides a schedule to automate the data refresh.

The URL for this call is `https://[service name].search.windows.net/indexers?api-version=2016-09-01-Preview`. Replace `[service name]` with the name of your search service.

First replace the URL. Then copy and paste the following code into your body and run the query.

```json
{
  "name" : "clinical-trials-json-indexer",
  "dataSourceName" : "clinical-trials-json",
  "targetIndexName" : "clinical-trials-json-index",
  "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
}
```

The response should look like:

```json
{
    "@odata.context": "https://exampleurl.search.windows.net/$metadata#indexers/$entity",
    "@odata.etag": "\"0x8D505FDE143D164\"",
    "name": "clinical-trials-json-indexer",
    "description": null,
    "dataSourceName": "clinical-trials-json",
    "targetIndexName": "clinical-trials-json-index",
    "schedule": null,
    "parameters": {
        "batchSize": null,
        "maxFailedItems": null,
        "maxFailedItemsPerBatch": null,
        "base64EncodeKeys": null,
        "configuration": {
            "parsingMode": "jsonArray"
        }
    },
    "fieldMappings": [],
    "enrichers": [],
    "disabled": null
}
```

## Search your JSON files

Now that your search service has been connected to your data container, you can begin searching your files.

Open up the Azure portal and navigate back to your search service. Just like you did in the previous tutorial.

  ![Unstructured search](media/search-semi-structured-data/indexespane.png)

### User-defined metadata search

As before, the data can be queried in a number of ways: full text search, system properties, or user-defined metadata. Both system properties and user-defined metadata may only be searched with the `$select` parameter if they were marked as **retrievable** during creation of the target index. Parameters in the index may not be altered once they are created. However, additional parameters may be added.

An example of a basic query is `$select=Gender,metadata_storage_size`, which limits the return to those two parameters.

  ![Semi-structured search](media/search-semi-structured-data/lastquery.png)

An example of more complex query would be `$filter=MinimumAge ge 30 and MaximumAge lt 75`, which returns only results where the parameters MinimumAge is greater than or equal to 30 and MaximumAge is less than 75.

  ![Semi-structured search](media/search-semi-structured-data/metadatashort.png)

If you'd like to experiment and try a few more queries yourself, feel free to do so. Know that you can use Logical operators (and, or, not) and comparison operators (eq, ne, gt, lt, ge, le). String comparisons are case-sensitive.

The `$filter` parameter only works with metadata that were marked filterable at the creation of your index.

## Next steps

In this tutorial, you learned about searching semi-structured data using Azure search, such as how to:

> [!div class="checklist"]
> * Create an Azure Search Service using the REST API
> * Use the Azure Search Service to search your container

Follow this link to learn more about search.

> [!div class="nextstepaction"]
> [What is Azure Search](search-what-is-azure-search.md)