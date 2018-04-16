---
title: Get started with cognitive search preview in Azure Search | Microsoft Docs
description: Roadmap for design and development of a cognitive search solution in Azure Search, transforming unstructured data into searchable content.
services: search
manager: cgronlun
author: HeidiSteen
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: heidist
---
# Get started with cognitive search preview

This article provides a roadmap for developers creating a cognitive search solution in Azure Search, including how to provision resources, learning the basic workflow, and testing your work.

This exercise creates multiple objects: an Azure blob data source, a skillset, an index. All objects are pulled together in an indexer definition, executing as an end-to-end pipeline that pulls data from its source, enriches it, and deposits it into an Azure Search index.

## Prerequisites

To perform each step, you can use a REST test tool such as Telerik Fiddler or Postman to formulate HTTP REST calls. For guidance, see [Explore Azure Search REST APIs using Fiddler or Postman](https://docs.microsoft.com/azure/search/search-fiddler).

Use the [Azure portal](https://portal.azure.com/) to create services used in an end-to-end workflow. You can search for the services you want to create.

 ![Dashboard portal](./media/cognitive-search-get-start-preview/create-service-full-portal.png)

## Step 1: Set up the Azure Search Service

First, sign up for the Azure Search service.

+ Choose a region that has the cognitive search preview. Currently, the preview is available in **West Central US**.

  Important: This is the only region that provides the private preview. Before you go into production, you may need to recreate the service in a new region.

+ Choose a tier. You can create one free service per subscription, but resource limits (3 indexes and 16 MB maximum blob size) and a cap on indexing (2 minutes) might be insufficient for exercising the full capabilities of cognitive search. We strongly recommend using a [paid tier](https://azure.microsoft.com/pricing/details/search/), such as Basic, for this feature. To review limits for different tiers, see [Service Limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity).

+ Use the same resource group for all resources you create today to make cleanup easier.
+ Pin the service to the dashboard for fast access to service information.

  ![Service definition page in the portal](./media/cognitive-search-get-start-preview/create-search-service.png)

After the service is created, collect the following information once the service is created: "endpoint", "api-key". You can use either the primary or secondary key.

  ![Endpoint and key information in the portal](./media/cognitive-search-get-start-preview/create-search-collect-info.png)

## Step 2: Set up Azure blob service and load sample data

The augmentation pipeline pulls from Azure data sources. Source data must originate from a [supported data source type](https://docs.microsoft.com/azure/search/search-indexer-overview). For this exercise, we use blob storage to showcase multiple content types.

Sample files help you complete this exercise. Sample data consists of a very small file set of different types. Copy the files from [Sample Files](https://1drv.ms/f/s!As7Oy81M_gVPa-LCb5lC_3hbS-4) to your blob storage container. There are multiple ways of creating Azure blob containers (and uploading files). 

+ Option 1: [Microsoft Azure Storage Explorer](http://storageexplorer.com/). For step-by-step instructions, see [Quickstart: blobs using Azure Storage Explorer](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-storage-explorer).
+ Option 2: Create containers and upload files directly from the Azure portal, although the experience requires more steps. For more information, see [Quickstart: blobs using the Azure portal](https://docs.microsoft.com/zure/storage/blobs/storage-quickstart-blobs-portal).

After sample files are loaded, get a Connection String for your blob storage. You could do that by navigating to you storage account in the Azure Portal. There click on the **Access keys** tab, and then copy the **Connection String**  field.

You should see a URL with this format that looks a lot like this:

```
DefaultEndpointsProtocol=https;AccountName=cogsrchdemostorage;AccountKey=y5NIlE4wFVBIyrCi392GzZl+JO4TEGdqOerqfbT79C8zrn28Te8DsWlxvKKnjh69P/HM5k50ztz2shOt8vqlbg==;EndpointSuffix=core.windows.net
```
Note that there are many ways to specify the connection string, for instance you could provide a shared access signature instead. To learn more about the different mechanisms to specify data source credentials, you can read the [Indexing Azure Blob Storage](https://docs.microsoft.com/en-us/azure/search/search-howto-indexing-azure-blob-storage) documentation.

## Step 3: Create a data source

Now that your services and source files are ready to use, define a new Azure Search [data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source) with the information necessary for retrieving source data. 

In the request header, provide the service name and api-key that was generated for your search service. In the request body, specify the blob container name and shared access signature.

### Sample Request
```http
POST https://[service name].search.windows.net/datasources?api-version=2017-11-11-Preview
Content-Type: application/json  
api-key: [admin key]  
```
#### Request Body Syntax
```json
{   
    "name" : "demodata",  
    "description" : "Demo files to demonstrate cognitive search capabilities.",  
    "type" : "azureblob",
    "credentials" :
    { "connectionString" :
      "DefaultEndpointsProtocol=https;=<your account name>;AccountName=<your account name>;AccountKey=<your account key>;"
    },  
    "container" : { "name" : "basicdemo" }
}  
```

For a complete explanation of how to define a data source, see the [Create Data Source](https://docs.microsoft.com/rest/api/searchservice/create-data-source) documentation.


## Step 4: Create a skillset

In this step, define a set of enrichment steps that you want to apply to your data. We call each of the enrichment steps a *skill*, and the set of enrichment steps a *skillset*. You can use [predefined cognitive skills](cognitive-search-predefined-skills.md) that are part of Cognitive Search, but the pipeline is also extensible so you can create your own skills and hook them up as part of the enrichment pipeline.

For this exercise, start by defining four enrichment steps to run on your data:

1. Extract the names of organizations from the content of documents in the blob container using the [named entity recognition skill](cognitive-search-skill-named-entity-recognition.md). 

2. Identify the language of a document using the [language detection skill](cognitive-search-skill-language-detection.md).

3. Extract the top key-phrases from the document using the [key phrase extraction skill](cognitive-search-skill-keyphrases.md). Use the language detected in the previous step as an input. 

4. Since the key-phrase skill only works with text that is at most 5,000 characters, use the [pagination skill](cognitive-search-skill-pagination.md) to break the content into several pages first before calling the key phrase extraction skill.

Each step executes on the content of the document. During processing, Azure Search cracks each document to read content from different file formats. Found text originating in the source file is placed into a generated ```content``` field, one for each document. As such, you can set the input as ```"/document/content"```.

A graphical representation of the skillset is shown below:

![](media/cognitive-search-get-start-preview/skillset.png)

### Sample Request
Make sure to replace the service name and the admin key in the request below. Reference the skillset name ```demoskillset``` for the rest of this demo.

```http
PUT https://[servicename].search.windows.net/skillsets/demoskillset?api-version=2017-11-11-Preview
api-key: [admin key]
Content-Type: application/json
```
#### Request Body Syntax
```json
{
  "description": 
  "Extract entities, detect language and extract key-phrases",
  "skills":
  [
    {
      "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
      "categories": [ "Organization" ],
      "defaultLanguageCode": "en",
      "inputs": [
        {
          "name": "text", "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "organizations", "targetName": "organizations"
        }
      ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
      "inputs": [
        {
          "name": "text", "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "languageCode",
          "targetName": "languageCode"
        }
      ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.PaginationSkill",
      "maximumPageLength": 4000,
      "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      },
      { 
        "name": "languageCode",
        "source": "/document/languageCode"
      }
    ],
    "outputs": [
      {
        "name": "pages",
        "targetName": "pages"
      }
    ]
  },
  {
      "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
      "context": "/document/pages/*",
      "inputs": [
        {
          "name": "text", "source": "/document/pages/*"
        },
        {
          "name":"languageCode", "source": "/document/languageCode"
        }
      ],
      "outputs": [
        {
          "name": "keyPhrases",
          "targetName": "keyPhrases"
        }
      ]
    }
  ]
}
```
Notice how the key phrase extraction skill is applied for each page. By setting the context to ```"document/pages/*"``` you run this enricher for each member of the document/pages array (for each page in the document).

To learn how to define the skillset in more detail, see the [How to define a skillset](cognitive-search-defining-skillset.md).

## Step 5: Create an index

Now let's define what fields to include in the searchable index, and the search attributes for each field. Fields have a type and can take attributes that determine how the field is used (searchable, sortable, and so forth). Field names in an index are not required to identically match the field names in the source. In a later step, you will add field mappings in an indexer to connect source-destination fields. For this step, define the index using whatever field naming conventions make sense for your search application.

This exercise uses the following fields and field types.

| field-names: | id       | content   | language | keyphrases         | organizations     |
|--------------|----------|-------|----------|--------------------|-------------------|
| field-types: | Edm.String|Edm.String| Edm.String| List<Edm.String>  | List<Edm.String>  |


### Sample Request
Make sure to replace the service name and the admin key in the request below.
Recall that ```demoindex``` is the index name in this exercise.

```http
PUT https://[servicename].search.windows.net/indexes/demoindex?api-version=2017-11-11-Preview
api-key: [api-key]
Content-Type: application/json
```
#### Request Body Syntax

```json
{
  "fields": [
    {
      "name": "id",
      "type": "Edm.String",
      "key": true,
      "searchable": true,
      "filterable": false,
      "facetable": false,
      "sortable": true
    },
    {
      "name": "content",
      "type": "Edm.String",
      "sortable": false,
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "language",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "keyphrases",
      "type": "Collection(Edm.String)",
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "organizations",
      "type": "Collection(Edm.String)",
      "searchable": true,
      "sortable": false,
      "filterable": false,
      "facetable": false
    }
  ]
}
```

To learn more about defining an index, see [Create an Azure Search Index](ref-create-index.md).


## Step 6: Create an indexer, map fields, and execute transformations

So far, you have created a data source, a skillset, and an index. All become part of an indexer that pulls each piece together into a single multi-phased operation. That said, you need to add a bit of glue between these components before you can run it. In this step, you define field mappings, which are part of the indexer definition.

For non-enriched indexing, the indexer definition provides an optional *fieldMappings* section if field names or data types do not precisely match, or if you want to use a function.

For cognitive search workloads having an enrichment pipeline, an indexer requires *outputFieldMappings*. These mappings are used when an internal process (the enrichment pipeline) is the source of field values. Behaviors unique to *outputFieldMappings* include the ability to handle complex types created as part of enrichment (through the shaper skill). Also, there may be many elements per document (for instance, multiple organizations in a document). The *outputFieldMappings* construct can direct the system to "flatten" collections of elements into a single record.

### Sample Request
Make sure to replace the service name and the admin key in the request below.
Also, provide the name of your indexer. You can reference it as ```demoindexer``` for the rest of this exercise.

```
PUT https://[servicename].search.windows.net/indexers/demoindexer?api-version=2017-11-11-Preview
api-key: [api-key]
Content-Type: application/json
```
#### Request Body Syntax

```json
{
  "name":"demoindexer",	
  "dataSourceName" : "demodata",
  "targetIndexName" : "demoindex",
  "skillsetName" : "demoskillset",
  "fieldMappings" : [
        {
          "sourceFieldName" : "metadata_storage_path",
          "targetFieldName" : "id",
          "mappingFunction" : { "name" : "base64Encode" }
        },
        {
          "sourceFieldName" : "content",
          "targetFieldName" : "content"
        }
   ],
  "outputFieldMappings" : 
  [
        {
          "sourceFieldName" : "/document/organizations", 
          "targetFieldName" : "organizations"
        },
        {
          "sourceFieldName" : "/document/pages/*/keyPhrases/*", 
          "targetFieldName" : "keyphrases"
        },
        {
            "sourceFieldName": "/document/languageCode",
            "targetFieldName": "language"
        }      
  ],
  "parameters":
  {
  	"maxFailedItems":-1,
  	"maxFailedItemsPerBatch":-1,
  	"configuration": 
    {
    	"dataToExtract": "contentAndMetadata",
     	"imageAction": "embedTextInContentField"
		}
  }
}

```
Notice that maxFailedItems is set to -1 which instructs the indexing engine to ignore errors during data import.  This is useful when there are few documents in the demo data source.  If the data source was larger, you would want to set that to a value greater than 0.

Also notice ```"dataToExtract":"contentAndMetadata"``` statement in the configuration parameters. This tells the indexer to automatically extract the content from different file formats as well as metadata related to each file. 

When content is extracted, you may in addition tell the system what to do about the images it finds using ```ImageAction```. The ```"ImageAction":"embedTextInContentField"``` tells the indexer to extract text from the images it finds and embed it as part of the content field. Note this behavior will apply to both the images embedded in the documents (think of an image inside a PDF), as well as images found in the data source -- for instance a JPG file.  

### Check indexer status

Once the indexer is defined, it runs automatically when you submit the request. Send the following request to check the indexer status.

```http
GET https://[servicename].search.windows.net/indexers/demoindexer/status?api-version=2017-11-11-Preview
api-key: [api-key]
Content-Type: application/json
```

The response tells you whether the indexer is running. After indexing is finished, GET STATUS reports any errors and warnings that occurred during enrichment.  
 
## Step 7: Verify content

To check your work, run queries that return the contents of individual fields. By default, Azure Search returns the top 50 results. The sample data is small so the defaults work fine. However, when working with larger data sets, you might need to include parameters in the query string to return more results. For instructions, see [How to page results in Azure Search](https://docs.microsoft.com/en-us/azure/search/search-pagination-page-layout).

As a verification step, query for "*" to return all contents of a single field.

```http
GET https://[servicename].search.windows.net/indexes/demoindex/docs?search=*&api-version=2017-11-11-Preview
api-key: [api-key]
Content-Type: application/json
```

The syntax can also be scoped to a single field: content, language, keyphrases, and organizations in this exercise.

You can use GET or POST, depending on query string complexity and length. For more information, see [Query using the REST API](https://docs.microsoft.com/azure/search/search-query-rest-api).

### Test the user experience

Run representative queries to determine whether additional features are necessary for improving the user experience. Depending on the change, you might need to rebuild the index by rerunning the indexer. For more information and examples, see [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents).


## Accessing the enriched document

*For the private preview*, we added a mechanism that allows you to see the structure of the enriched document. Enriched documents are temporary structures created during enrichment, and then deleted when the process is complete.

To capture an enriched document created during indexing, you can add a field called ```enriched``` to your index. The indexer automatically dumps into it a string representation of all the enrichments for that document.

The enriched field will contain a string that is a logical representation of the in memory enriched document in json.  The field value is a valid json document, however, quotes are escaped so you'll need to replace \" with " in order to view the document as formatted json.  The enriched field is intended for debugging purposes only to help you understand the logical shape of the content that expressions are being evaluated against.

This implementation is temporary, likely to be replaced by public preview or general release. For now, it can be a useful tool to understand what's going on and help you debug your skillset.

Repeat the previous exercise, including an `enriched` field to capture the contents of an enriched document:

#### Request Body Syntax
```json
{
  "fields": [
    {
      "name": "id",
      "type": "Edm.String",
      "key": true,
      "searchable": true,
      "filterable": false,
      "facetable": false,
      "sortable": true
    },
    {
      "name": "content",
      "type": "Edm.String",
      "sortable": false,
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "language",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "keyphrases",
      "type": "Collection(Edm.String)",
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "organizations",
      "type": "Collection(Edm.String)",
      "searchable": true,
      "sortable": false,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "enriched",
      "type": "Edm.String",
      "searchable": false,
      "sortable": false,
      "filterable": false,
      "facetable": false
    }
  ]
}
```

## Creating your own custom skills.

This exercise does not walk you through custom skill definition, but if you plan to create a custom skill at some point, or if you want to step through the [custom skill example](cognitive-search-create-custom-skill-example.md), one approach for providing the skill is using an [Azure Function](https://docs.microsoft.com/azure/azure-functions/functions-overview). Use of an Azure Function comes at an additional cost. See the [pricing page](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview#pricing) for details.

## Next steps

+ [How to map fields into your index](cognitive-search-output-field-mapping.md)
+ [How to create a skillset or augmentation pipeline](cognitive-search-defining-skillset.md)
+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a custom interface](cognitive-search-custom-skill-interface.md)
+ [Example: creating a custom skill](cognitive-search-create-custom-skill-example.md)