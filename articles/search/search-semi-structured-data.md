---
title: 'Tutorial: Index semi-structured data in JSON blobs'
titleSuffix: Azure AI Search
description: Learn how to index and search semi-structured Azure JSON blobs using Azure AI Search REST APIs and Postman.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: tutorial
ms.date: 01/18/2023
#Customer intent: As a developer, I want an introduction the indexing Azure blob data for Azure AI Search.
---

# Tutorial: Index JSON blobs from Azure Storage using REST

Azure AI Search can index JSON documents and arrays in Azure Blob Storage using an [indexer](search-indexer-overview.md) that knows how to read semi-structured data. Semi-structured data contains tags or markings which separate content within the data. It splits the difference between unstructured data, which must be fully indexed, and formally structured data that adheres to a data model, such as a relational database schema, that can be indexed on a per-field basis.

This tutorial uses Postman and the [Search REST APIs](/rest/api/searchservice/) to perform the following tasks:

> [!div class="checklist"]
> * Configure an Azure AI Search data source for an Azure blob container
> * Create an Azure AI Search index to contain searchable content
> * Configure and run an indexer to read the container and extract searchable content from Azure Blob Storage
> * Search the index you just created

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

+ [Azure Storage](../storage/common/storage-account-create.md)
+ [Postman app](https://www.postman.com/downloads/)
+ [Create](search-create-service-portal.md) or [find an existing search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) 

> [!Note]
> You can use the free service for this tutorial. A free search service limits you to three indexes, three indexers, and three data sources. This tutorial creates one of each. Before starting, make sure you have room on your service to accept the new resources.

## Download files

[Clinical-trials-json.zip](https://github.com/Azure-Samples/storage-blob-integration-with-cdn-search-hdi/raw/master/clinical-trials-json.zip) contains the data used in this tutorial. Download and unzip this file to its own folder. Data originates from [clinicaltrials.gov](https://clinicaltrials.gov/ct2/results), converted to JSON for this tutorial.

## 1 - Create services

This tutorial uses Azure AI Search for indexing and queries, and Azure Blob Storage to provide the data. 

If possible, create both in the same region and resource group for proximity and manageability. In practice, your Azure Storage account can be in any region.

### Start with Azure Storage

1. Sign in to the [Azure portal](https://portal.azure.com) and click **+ Create Resource**.

1. Search for *storage account* and select Microsoft's Storage Account offering.

   :::image type="content" source="media/cognitive-search-tutorial-blob/storage-account.png" alt-text="Create Storage account" border="false":::

1. In the Basics tab, the following items are required. Accept the defaults for everything else.

   + **Resource group**. Select an existing one or create a new one, but use the same group for all services so that you can manage them collectively.

   + **Storage account name**. If you think you might have multiple resources of the same type, use the name to disambiguate by type and region, for example *blobstoragewestus*. 

   + **Location**. If possible, choose the same location used for Azure AI Search and Azure AI services. A single location voids bandwidth charges.

   + **Account Kind**. Choose the default, *StorageV2 (general purpose v2)*.

1. Click **Review + Create** to create the service.

1. Once it's created, click **Go to the resource** to open the Overview page.

1. Click **Blobs** service.

1. [Create a Blob container](../storage/blobs/storage-quickstart-blobs-portal.md) to contain sample data. You can set the Public Access Level to any of its valid values.

1. After the container is created, open it and select **Upload** on the command bar.

   :::image type="content" source="media/search-semi-structured-data/upload-command-bar.png" alt-text="Upload on command bar" border="false":::

1. Navigate to the folder containing the sample files. Select all of them and then click **Upload**.

   :::image type="content" source="media/search-semi-structured-data/clinicalupload.png" alt-text="Upload files" border="false":::

After the upload completes, the files should appear in their own subfolder inside the data container.

### Azure AI Search

The next resource is Azure AI Search, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this walkthrough. 

As with Azure Blob Storage, take a moment to collect the access key. Further on, when you begin structuring requests, you will need to provide the endpoint and admin api-key used to authenticate each request.

### Get a key and URL

REST calls require the service URL and an access key on every request. A search service is created with both, so if you added Azure AI Search to your subscription, follow these steps to get the necessary information:

1. Sign in to the [Azure portal](https://portal.azure.com), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Get an HTTP endpoint and access key" border="false":::

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## 2 - Set up Postman

Start Postman and set up an HTTP request. If you are unfamiliar with this tool, see [Create a search index using REST APIs](search-get-started-rest.md).

The request methods for every call in this tutorial are **POST** and **GET**. You'll make three API calls to your search service to create a data source, an index, and an indexer. The data source includes a pointer to your storage account and your JSON data. Your search service makes the connection when loading the data.

In Headers, set "Content-type" to `application/json` and set `api-key` to the admin api-key of your Azure AI Search service. Once you set the headers, you can use them for every request in this exercise.

  :::image type="content" source="media/search-get-started-rest/postman-url.png" alt-text="Postman request URL and header" border="false":::

URIs must specify an api-version and each call should return a **201 Created**. The generally available api-version for using JSON arrays is `2020-06-30`.

## 3 - Create a data source

The [Create Data Source API](/rest/api/searchservice/create-data-source) creates an Azure AI Search object that specifies what data to index.

1. Set the endpoint of this call to `https://[service name].search.windows.net/datasources?api-version=2020-06-30`. Replace `[service name]` with the name of your search service. 

1. Copy the following JSON into the request body.

    ```json
    {
        "name" : "clinical-trials-json-ds",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=[storage account name];AccountKey=[storage account key];" },
        "container" : { "name" : "[blob container name]"}
    }
    ```

1. Replace the connection string with a valid string for your account.

1. Replace "[blob container name]" with the container you created for the sample data. 

1. Send the request. The response should look like:

    ```json
    {
        "@odata.context": "https://exampleurl.search.windows.net/$metadata#datasources/$entity",
        "@odata.etag": "\"0x8D505FBC3856C9E\"",
        "name": "clinical-trials-json-ds",
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

## 4 - Create an index

The second call is [Create Index API](/rest/api/searchservice/create-index), creating an Azure AI Search index that stores all searchable data. An index specifies all the parameters and their attributes.

1. Set the endpoint of this call to `https://[service name].search.windows.net/indexes?api-version=2020-06-30`. Replace `[service name]` with the name of your search service.

1. Copy the following JSON into the request body.

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
      ]
    }
   ```

1. Send the request. The response should look like:

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
          }
    ```

## 5 - Create and run an indexer

An indexer connects to the data source, imports data into the target search index, and optionally provides a schedule to automate the data refresh. The REST API is [Create Indexer](/rest/api/searchservice/create-indexer).

1. Set the URI for this call to `https://[service name].search.windows.net/indexers?api-version=2020-06-30`. Replace `[service name]` with the name of your search service.

1. Copy the following JSON into the request body.

    ```json
    {
      "name" : "clinical-trials-json-indexer",
      "dataSourceName" : "clinical-trials-json-ds",
      "targetIndexName" : "clinical-trials-json-index",
      "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
    }
    ```

1. Send the request. The request is processed immediately. When the response comes back, you will have an index that is full-text searchable. The response should look like:

    ```json
    {
        "@odata.context": "https://exampleurl.search.windows.net/$metadata#indexers/$entity",
        "@odata.etag": "\"0x8D505FDE143D164\"",
        "name": "clinical-trials-json-indexer",
        "description": null,
        "dataSourceName": "clinical-trials-json-ds",
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

## 6 - Search your JSON files

You can start searching as soon as the first document is loaded.

1. Change the verb to **GET**.

1. Set the URI for this call to `https://[service name].search.windows.net/indexes/clinical-trials-json-index/docs?search=*&api-version=2020-06-30&$count=true`. Replace `[service name]` with the name of your search service.

1. Send the request. This is an unspecified full text search query that returns all of the fields marked as retrievable in the index, along with a document count. The response should look like:

    ```json
    {
        "@odata.context": "https://exampleurl.search.windows.net/indexes('clinical-trials-json-index')/$metadata#docs(*)",
        "@odata.count": 100,
        "value": [
            {
                "@search.score": 1.0,
                "FileName": "NCT00000102.txt",
                "MinimumAge": 14,
                "Title": "Congenital Adrenal Hyperplasia: Calcium Channels as Therapeutic Targets",
                "MyURL": "https://azure.storagedemos.com/clinical-trials/NCT00000102.txt",
                "Gender": "Both",
                "MaximumAge": 35,
                "Summary": "This study will test the ability of extended release nifedipine (Procardia XL), a blood pressure medication, to permit a decrease in the dose of glucocorticoid medication children take to treat congenital adrenal hyperplasia (CAH).",
                "NCTID": "NCT00000102",
                "Phase": "Phase 1/Phase 2",
                "Date": "ClinicalTrials.gov processed this data on October 25, 2016",
                "OverallStatus": "Completed",
                "OrgStudyId": "NCRR-M01RR01070-0506",
                "HealthyVolunteers": "No",
                "Keywords": [],
                "metadata_storage_last_modified": "2019-04-09T18:16:24Z",
                "metadata_storage_size": "33060",
                "metadata_content_type": null
            },
            . . . 
    ```

1. Add the `$select` query parameter to limit the results to fewer fields: `https://[service name].search.windows.net/indexes/clinical-trials-json-index/docs?search=*&$select=Gender,metadata_storage_size&api-version=2020-06-30&$count=true`.  For this query, 100 documents match, but by default, Azure AI Search only returns 50 in the results.

   :::image type="content" source="media/search-semi-structured-data/lastquery.png" alt-text="Parameterized query" border="false":::

1. An example of more complex query would include `$filter=MinimumAge ge 30 and MaximumAge lt 75`, which returns only results where the parameters MinimumAge is greater than or equal to 30 and MaximumAge is less than 75. Replace the `$select` expression with the `$filter` expression.

   :::image type="content" source="media/search-semi-structured-data/metadatashort.png" alt-text="Semi-structured search" border="false":::

You can also use Logical operators (and, or, not) and comparison operators (eq, ne, gt, lt, ge, le). String comparisons are case-sensitive. For more information and examples, see [Create a simple query](search-query-simple-examples.md).

> [!NOTE]
> The `$filter` parameter only works with metadata that were marked filterable at the creation of your index.

## Reset and rerun

In the early experimental stages of development, the most practical approach for design iteration is to delete the objects from Azure AI Search and allow your code to rebuild them. Resource names are unique. Deleting an object lets you recreate it using the same name.

You can use the portal to delete indexes, indexers, and data sources. Or use **DELETE** and provide URLs to each object. The following command deletes an indexer.

```http
DELETE https://[YOUR-SERVICE-NAME].search.windows.net/indexers/clinical-trials-json-indexer?api-version=2020-06-30
```

Status code 204 is returned on successful deletion.

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the All resources or Resource groups link in the left-navigation pane.

## Next steps

Now that you're familiar with the basics of Azure Blob indexing, let's take a closer look at indexer configuration for JSON blobs in Azure Storage.

> [!div class="nextstepaction"]
> [Configure JSON blob indexing](search-howto-index-json-blobs.md)
