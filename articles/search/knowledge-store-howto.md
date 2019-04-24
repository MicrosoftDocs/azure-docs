---
title: 'How to get started with Knowledge Store - Azure Search'
description: Learn the steps for sending enriched documents created by AI indexing pipelines in Azure Search to an  Azure storage account. From there, you can view, reshape, and consume enriched documents in Azure Search and in other applications. 
manager: cgronlun
author: HeidiSteen
services: search
ms.service: search
ms.topic: quickstart
ms.date: 05/02/2019
ms.author: heidist
---
# How to get started with Knowledge Store

[Knowledge Store](knowledge-store-concept-intro.md) is a new preview feature in Azure Search that saves AI enrichments created in an indexing pipeline for knowledge mining in other apps. You can also use saved enrichments to understand and refine an Azure Search indexing pipeline.

A knowledge store is defined by a skillset. For regular Azure Search full-text search scenarios, the purpose of a skillset is providing AI enrichments to make content more searchable. For knowledge store scenarios, the role of a skillset is creating and populating multiple data structures for knowledge mining.

In this exercise, start with sample data, services, and tools to learn the basic workflow for creating and using your first knowledge store, with emphasis on skillset definition.

## Prerequisites

The following services, tools, and data are used in this quickstart. 

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial. 

+ [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample data. Your knowledge store will exist in Azure storage.

+ [Create a Cognitive Services resource](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) at the S0 pay-as-you-go tier for broad-spectrum access to the full range of skills used in AI enrichments.

+ [Postman desktop app](https://www.getpostman.com/) for sending requests to Azure Search.

+ [Postman collection](https://github.com/Azure-Samples/azure-search-postman-sample/tree/master/caselaw) with prepared requests for creating a data source, index, skillset, and indexer. Several object definitions are too long to include in this article. You must get this collection to see the index and skillset definitions in their entirety.

+ [Caselaw sample data](https://github.com/Azure-Samples/azure-search-sample-data/tree/master/caselaw) originating from the [Caselaw Access Project](https://case.law/bulk/download/) Public Bulk Data download page. Specifically, the exercise uses the first 10 documents of the first download (Arkansas). We uploaded a 10-document sample to GitHub for this exercise.

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

1. Navigate to the folder containing the **caselaw-sample.json** sample file. Select the file and then click **Upload**.


## Set up Postman

Start Postman and set up an HTTP request. If you are unfamiliar with this tool, see [Explore Azure Search REST APIs using Postman](search-fiddler.md).

+ Request method for every call in this walkthrough is **POST**.
+ Request headers (2) include the following: "Content-type" set to "application/json", "api-key" set to your "admin key" (the admin key is a placeholder for your search primary key) respectively. 
+ Request body is where you place the actual contents of your call. 

  ![Semi-structured search](media/search-semi-structured-data/postmanoverview.png)

We are using Postman to make four API calls to your search service, creating a data source, an index, a skillset, and an indexer. The data source includes a pointer to your storage account and JSON data. Your search service makes the connection when importing the data.

[Create a skillset](#create-skillset) is the focus of this walkthrough: it specifies the enrichment steps and how data is persisted in a knowledge store.

URL endpoint must specify an api-version and each call should return a **201 Created**. The preview api-version for creating a skillset with knowledge store support is `2019-05-06-Preview`.

Execute the following API calls from your REST client.

## Create a data source

The [Create Data Source API](https://docs.microsoft.com/rest/api/searchservice/create-data-source) creates an Azure Search object that specifies what data to index.

The endpoint of this call is `https://[service name].search.windows.net/datasources?api-version=2019-05-06-Preview` 

1. Replace `[service name]` with the name of your search service. 

2. For this call, the request body must include your storage account connection string and blob container name. The connection can be found in the Azure portal inside your storage account's **Access Keys**. 

   Make sure to replace the connection string and blob container name in the body of the request before executing the call.

    ```json
    {
        "name": "caselaw-ds",
        "description": null,
        "type": "azureblob",
        "subtype": null,
        "credentials": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your storage key>;EndpointSuffix=core.windows.net"
        },
        "container": {
            "name": "<your blob container name>",
            "query": null
        },
        "dataChangeDetectionPolicy": null,
        "dataDeletionDetectionPolicy": null
    }
    ```

3. Send the request. The response should be **201** and the response body should look almost identical to the request payload you provided.

    ```json
    {
        "name": "caselaw-ds",
        "description": null,
        "type": "azureblob",
        "subtype": null,
        "credentials": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your storage key>;EndpointSuffix=core.windows.net"
        },
        "container": {
            "name": "<your blob container name>",
            "query": null
        },
        "dataChangeDetectionPolicy": null,
        "dataDeletionDetectionPolicy": null
    }
    ```

## Create an index
    
The second call is [Create Index API](https://docs.microsoft.com/rest/api/searchservice/create-data-source), creating an Azure Search index that stores all searchable data. An index specifies all fields, parameters, and attributes.

You don't necessarily need an index for knowledge mining, but an indexer won't run unless an index is provided. 

The URL for this call is `https://[service name].search.windows.net/indexes?api-version=2019-05-06-Preview`

1. Replace `[service name]` with the name of your search service.

2. Copy the index definition from the Create Index request in the Postman collection into the request body. The index definition is several hundred lines, too long to print here. 

   The outer shell of an index consists of the following elements. 

   ```json
   {
      "name": "caselaw",
      "defaultScoringProfile": null,
      "fields": [],
      "scoringProfiles": [],
      "corsOptions": null,
      "suggesters": [],
      "analyzers": [],
      "tokenizers": [],
      "tokenFilters": [],
      "charFilters": [],
      "encryptionKey": null
   }
   ```

3. The `fields` collection contains the bulk of the index definition. It includes simple fields, [complex fields](search-howto-complex-data-types.md) with nested substructures, and collections.

   Review the field definition for `casebody` on lines 302-384. Notice that a complex field can contain other complex fields when hierarchical representations are needed.

   ```json
   {
    "name": "casebody",
    "type": "Edm.ComplexType",
    "fields": [
        {
            "name": "status",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": true,
            "facetable": true,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": null,
            "synonymMaps": []
        },
        {
            "name": "data",
            "type": "Edm.ComplexType",
            "fields": [
                {
                    "name": "head_matter",
                    "type": "Edm.String",
                    "searchable": true,
                    "filterable": false,
                    "retrievable": true,
                    "sortable": false,
                    "facetable": false,
                    "key": false,
                    "indexAnalyzer": null,
                    "searchAnalyzer": null,
                    "analyzer": null,
                    "synonymMaps": []
                },
                {
                    "name": "opinions",
                    "type": "Collection(Edm.ComplexType)",
                    "fields": [
                        {
                            "name": "author",
                            "type": "Edm.String",
                            "searchable": true,
                            "filterable": true,
                            "retrievable": true,
                            "sortable": false,
                            "facetable": true,
                            "key": false,
                            "indexAnalyzer": null,
                            "searchAnalyzer": null,
                            "analyzer": null,
                            "synonymMaps": []
                        },
                        {
                            "name": "text",
                            "type": "Edm.String",
                            "searchable": true,
                            "filterable": false,
                            "retrievable": true,
                            "sortable": false,
                            "facetable": false,
                            "key": false,
                            "indexAnalyzer": null,
                            "searchAnalyzer": null,
                            "analyzer": null,
                            "synonymMaps": []
                        },
                        {
                            "name": "type",
                            "type": "Edm.String",
                            "searchable": true,
                            "filterable": true,
                            "retrievable": true,
                            "sortable": false,
                            "facetable": true,
                            "key": false,
                            "indexAnalyzer": null,
                            "searchAnalyzer": null,
                            "analyzer": null,
                            "synonymMaps": []
                        }
                    ]
                },
    . . .
   ```

4. Send the request. 

   The response should be **201** and look similar to the following example, showing the first several fields:

    ```json
    {
        "name": "caselaw",
        "defaultScoringProfile": null,
        "fields": [
            {
                "name": "id",
                "type": "Edm.String",
                "searchable": true,
                "filterable": true,
                "retrievable": true,
                "sortable": true,
                "facetable": true,
                "key": true,
                "indexAnalyzer": null,
                "searchAnalyzer": null,
                "analyzer": null,
                "synonymMaps": []
            },
            {
                "name": "name",
                "type": "Edm.String",
                "searchable": true,
                "filterable": true,
                "retrievable": true,
                "sortable": true,
                "facetable": true,
                "key": false,
                "indexAnalyzer": null,
                "searchAnalyzer": null,
                "analyzer": null,
                "synonymMaps": []
            },
      . . .
    ```

<a name="create-skillset"></a>

## Create a skillset and knowledge store

The [Create Skillset API](https://docs.microsoft.com/rest/api/searchservice/create-skillset) creates an Azure Search object that specifies what cognitive skills to call, how to chain skills together, and most importantly for this walkthrough - how to specify a knowledge store.

The endpoint of this call is `https://[service name].search.windows.net/skillsets?api-version=2019-05-06-Preview`

1. Replace `[service name]` with the name of your search service.

2. Copy the skillset definition from the Create Skillset request in the Postman collection into the request body. The skillset definition is several hundred lines, too long to print here, but it is the focus of this walkthrough.

   The outer shell of a skillset consists of the following elements. The `skills` collection defines the in-memory enrichments, but the `knowledgeStore` definition specifies how the output is stored. The `cognitiveServices` definition is your connection to the AI enrichment engines.

   ```json
   {
    "name": "caselaw-ss",
    "description": null,
    "skills": [],
    "cognitiveServices": [],
    "knowledgeStore": []
   }
   ```

3. First, set `cognitiveServices` and `knowledgeStore` key and connection string. In the example, these strings are located after the skillset definition, towards the end of the request body.

    ```json
    "cognitiveServices": {
        "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
        "description": "<your cognitive services resource name>",
        "key": "<your cognitive services key>"
    },
    "knowledgeStore": {
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<your storage account name>;AccountKey=<your storage account key>;EndpointSuffix=core.windows.net",
    ```

3. Review the skills collection, in particular the Shaper skills on lines 85 and 170, respectively. The Shaper skill is important because it assembles the data structures you want for knowledge mining. During skillset execution, these structures are in-memory only, but as you move to the next step, you'll see how this output can be saved to a knowledge store for further exploration.

   The following snippet is from line 207. 

    ```json
    {
    "name": "Opinions",
    "source": null,
    "sourceContext": "/document/casebody/data/opinions/*",
    "inputs": [
        {
            "name": "Text",
            "source": "/document/casebody/data/opinions/*/text"
        },
        {
            "name": "Author",
            "source": "/document/casebody/data/opinions/*/author"
        },
        {
            "name": "Entities",
            "source": null,
            "sourceContext": "/document/casebody/data/opinions/*/text/pages/*/entities/*",
            "inputs": [
                {
                    "name": "Entity",
                    "source": "/document/casebody/data/opinions/*/text/pages/*/entities/*/value"
                },
                {
                    "name": "EntityType",
                    "source": "/document/casebody/data/opinions/*/text/pages/*/entities/*/category"
                }
             ]
          }
     ]
   }
   . . .
   ```

3. Review the `projections` element in `knowledgeStore`, starting on line 253. Projections specify the knowledge store composition. Projections are specified in tables-objects pairs, but currently only one at time. As you can see in the first projection, `tables` is specified but `objects` is not. In the second, it's the opposite.

   In Azure storage, tables will be created in Table storage for each table you create, and each object gets a container in Blob storage.

   Objects typically contain the full expression of an enrichment. Tables typically contain partial enrichments, in combinations that you arrange for specific purposes. This example shows a Cases table, but not shown are other tables like Entities, Judges, and Opinions.

    ```json
    "projections": [
    {
        "tables": [
            {
              "tableName": "Opinions",
              "generatedKeyName": "OpinionId",
              "source": "/document/Case/OpinionsSnippets/*"
            },
          . . . 
        ],
        "objects": []
    },
    {
        "tables": [],
        "objects": [
            {
                "storageContainer": "enrichedcases",
                "key": "/document/CaseFull/Id",
                "source": "/document/CaseFull"
            }
          ]
        }
      ]
    }
    ```

5. Send the request. The response should be **201** and look similar to the following example, showing the first part of the response.

    ```json
    {
    "name": "caselaw-ss",
    "description": null,
    "skills": [
        {
            "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
            "name": "SplitSkill#1",
            "description": null,
            "context": "/document/casebody/data/opinions/*/text",
            "defaultLanguageCode": "en",
            "textSplitMode": "pages",
            "maximumPageLength": 5000,
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/casebody/data/opinions/*/text
                }
            ],
            "outputs": [
                {
                    "name": "textItems",
                    "targetName": "pages"
                }
            ]
        },
        . . .
    ```

## Create and run an indexer

The [Create Indexer API](https://docs.microsoft.com/rest/api/searchservice/create-indexer) creates and immediately executes an indexer. All of the definitions you have created so far are put into motion with this step. The indexer runs immediately because it doesn't exist in the service. After it exists, a POST call to an existing indexer is an update operation.

The endpoint of this call is `https://[service name].search.windows.net/indexers?api-version=2019-05-06-Preview`

1. Replace `[service name]` with the name of your search service. 

2. For this call, the request body specifies the indexer name. A data source and index are required by the indexer. A skillset is optional for an indexer, but required for AI enrichment.

    ```json
    {
        "name": "caselaw-idxr",
        "description": null,
        "dataSourceName": "caselaw-ds",
        "skillsetName": "caselaw-ss",
        "targetIndexName": "caselaw",
        "disabled": null,
        "schedule": null,
        "parameters": {
            "batchSize": 1,
            "maxFailedItems": null,
            "maxFailedItemsPerBatch": null,
            "base64EncodeKeys": null,
            "configuration": {
                "parsingMode": "jsonLines"
            }
        },
        "fieldMappings": [],
        "outputFieldMappings": [
            {
                "sourceFieldName": "/document/casebody/data/opinions/*/text/pages/*/people/*",
                "targetFieldName": "people",
                "mappingFunction": null
            },
            {
                "sourceFieldName": "/document/casebody/data/opinions/*/text/pages/*/organizations/*",
                "targetFieldName": "orginizations",
                "mappingFunction": null
            },
            {
                "sourceFieldName": "/document/casebody/data/opinions/*/text/pages/*/locations/*",
                "targetFieldName": "locations",
                "mappingFunction": null
            },
            {
                "sourceFieldName": "/document/Case/OpinionsSnippets/*/Entities/*",
                "targetFieldName": "entities",
                "mappingFunction": null
            },
            {
                "sourceFieldName": "/document/casebody/data/opinions/*/text/pages/*/keyPhrases/*",
                "targetFieldName": "keyPhrases",
                "mappingFunction": null
            }
        ]
    }
    ```

3. Send the request. The response should be **201** and the response body should look almost identical to the request payload you provided (trimmed for brevity).

    ```json
    {
        "name": "caselaw-idxr",
        "description": null,
        "dataSourceName": "caselaw-ds",
        "skillsetName": "caselaw-ss",
        "targetIndexName": "caselaw",
        "disabled": null,
        "schedule": null,
        "parameters": {
            "batchSize": 1,
            "maxFailedItems": null,
            "maxFailedItemsPerBatch": null,
            "base64EncodeKeys": null,
            "configuration": {
                "parsingMode": "jsonLines"
            }
        },
        "fieldMappings": [],
        "outputFieldMappings": [
            {
                "sourceFieldName": "/document/casebody/data/opinions/*/text/pages/*/people/*",
                "targetFieldName": "people",
                "mappingFunction": null
            }
        ]
    }
    ```

## Explore knowledge store

You can start exploring as soon as the first document is imported. For this task, use [**Storage Explorer**](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-storage-explorer) in the portal.

It's important to realize that a knowledge store is fully detached from Azure Search. The Azure Search index and the knowledge store both contain data representation and contents, but part ways from there. Use the index for full text search, filtered search, and all the scenarios supported in Azure Search. Or, move forward with just your knowledge store, attaching other tools to analyze contents.

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