---
title: 'How to get started with Knowledge Store - Azure Search'
description: Learn the steps for sending enriched documents created by AI indexing pipelines in Azure Search to an  Azure storage account. From there, you can view, reshape, and consume enriched documents in Azure Search and in other applications. 
manager: eladz
author: Vkurpad
services: search
ms.service: search
ms.topic: quickstart
ms.date: 05/02/2019
ms.author: vikurpad
---
# How to get started with Knowledge Store

[Knowledge Store](knowledge-store-concept-intro.md) is a new preview feature in Azure Search that saves enriched documents created in an AI-based indexing pipeline. In this exercise, get started with sample data, services, and tools to learn the basic workflow for creating and using your own knowledge store.

## Prerequisites

The following services, tools, and data are used in this quickstart. 

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial. 

+ [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample data.

+ [Postman desktop app](https://www.getpostman.com/) for sending requests to Azure Search.

+ Sample data consists of a data.jsonl file used in this exercise originates from the [Caselaw Access Project](https://case.law/bulk/download/)Public Bulk Data download page. Specifically, the exercise uses the first 10 documents of the first download (Arkansas). We uploaded the 10-document sample plus the full 571-document version to the [Azure Search sample data repository](https://azure-search-sample-data) on GitHub.

## Get a key and URL

REST calls require the service URL and an access key on every request. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service.

## Prepare sample data

1. [Sign in to the Azure portal](https://portal.azure.com), navigate to your Azure storage account, click **Blobs**, and then click **+ Container**.

1. [Create a Blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal) to contain sample data. You can set the Public Access Level to any of its valid values.

1. After the container is created, open it and select **Upload** on the command bar.

   ![Upload on command bar](media/search-semi-structured-data/upload-command-bar.png "Upload on command bar")

1. Navigate to the folder containing the sample files. Select all of them and then click **Upload**.

After the upload completes, the files should appear in their own subfolder inside the data container.

## Set up Postman

Start Postman and set up an HTTP request. If you are unfamiliar with this tool, see [Explore Azure Search REST APIs using Postman](search-fiddler.md).

The request method for every call in this walkthrough is **POST**. The header keys are "Content-type" and "api-key." The values of the header keys are "application/json" and your "admin key" (the admin key is a placeholder for your search primary key) respectively. The body is where you place the actual contents of your call. Depending on the client you're using, there may be some variations on how you construct your query, but those are the basics.

  ![Semi-structured search](media/search-semi-structured-data/postmanoverview.png)

We are using Postman to make API calls to your search service in order to create a data source, an index, a skillset, and an indexer. The data source includes a pointer to your storage account and your JSON data. Your search service makes the connection when importing the data.

Query strings must specify an api-version and each call should return a **201 Created**. The preview api-version for using JSON arrays is `2019-05-06-Preview`.

Execute the following API calls from your REST client.

## Create a data source

The [Create Data Source API](https://docs.microsoft.com/rest/api/searchservice/create-data-source)creates an Azure Search object that specifies what data to index.

The endpoint of this call is `https://[service name].search.windows.net/datasources?api-version=2019-05-06`. Replace `[service name]` with the name of your search service. 

For this call, the request body must include the name of your storage account, storage account key, and blob container name. The storage account key can be found in the Azure portal inside your storage account's **Access Keys**. The location is shown in the following image:

  ![Semi-structured search](media/search-semi-structured-data/storagekeys.png)

Make sure to replace `[storage account name]`, `[storage account key]`, and `[blob container name]` in the body of your call before executing the call.

```json
{
    "name" : "clinical-trials-json",
    "type" : "azureblob",
    "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=[storage account name];AccountKey=[storage account key];" },
    "container" : { "name" : "[blob container name]"}
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
        "name": "[mycontainernamehere]",
        "query": null
    },
    "dataChangeDetectionPolicy": null,
    "dataDeletionDetectionPolicy": null
}
```

## Create an index
    
The second call is [Create Index API](https://docs.microsoft.com/rest/api/searchservice/create-data-source), creating an Azure Search index that stores all searchable data. An index specifies all the parameters and their attributes.

The URL for this call is `https://[service name].search.windows.net/indexes?api-version=2019-05-06`. Replace `[service name]` with the name of your search service.

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
## Explore knowledge store

You can start searching as soon as the first document is loaded. For this task, use [**Storage Explorer**](search-explorer.md) in the portal.

In Azure portal, open the search service **Overview** page, find the index you created in the **Indexes** list.

Be sure to choose the index you just created. 


## Takeaways

You've now created your first knowledge store in Azure storage and used Storage Explorer to view the enrichments. This is the fundamental experience for working with stored enrichments. 

## Next steps

The Shaper skill does the heavy lifting on creating granular data forms that can be combined into new shapes. As a next step, review the reference page for this skill for details on how it's used.

> [!div class="nextstepaction"]
> [Shaper skill reference](cognitive-search-skill-shaper.md)


<!---
## Keep This

How to convert unformatted JSON into an indented JSON document structure that allows you to quickly identify nested structures. Useful for creating an index that includes complex types.

1. Use Visual Studio Code.
2. Open data.jsonl
--->