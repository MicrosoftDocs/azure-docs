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

This article provides a roadmap for developers creating a cognitive search solution in Azure Search, including how to provision resources, typical workflow, order of operation, and testing your work.

You can use a web API testing tool like Postman or Fiddler to perform the steps outlined below. For more information about using this tool with Azure Search, see [Test with Fiddler or Postman](search-fiddler.md).

## Provision Azure services

Use the [Azure portal](https://portal.azure.com/) to create services used in an end-to-end workflow.

### Create an Azure Search service

+ Choose a region that has the cognitive search preview. Currently, the preview is available in **West Central US**.
+ Choose a tier. You can create one free service per subscription, but it won't give you the capacity necessary for completing the tutorial or exercising the full capabilities of cognitive search. We strongly recommend using a [paid tier](https://azure.microsoft.com/pricing/details/search/), such as Basic, for this feature.

Collect the following information once the service is created: "endpoint", "api-key"

### Create an Azure data storage service

The augmentation pipeline pulls from Azure data sources. Source data must originate from a supported data source type. 

Get the endpoint or storage account, and key. ...sign-up.

Optionally, for custom enrichers, you can use Azure Function for the implementation. Use of an Azure Function comes at an additional cost. See the [pricing page](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview#pricing) for details.

### Create an Azure Function (optional)

If you are creating a custom skill, one approach is to provide the skill an Azure Function. ...sign-up.


### Collect user-specific data values

Assuming Azure Search, Azure blob storage, and custom enrichers, you would need the following values at a minimum:

  YOUR_SEARCH_SERVICE_NAME
  YOUR_SEARCH_SERVICE_KEY
  BLOB_CONNECTION_STRING
  BLOB_CONTAINER_NAME
  AZURE_FUNCTION_WEB_API_CUSTOM_SKILL_URL


## Create a data source

+ Assemble a subset of source files representative of the source data at large; choose files that help you evaluate whether key phrase works, NER works, etc.
+ PDFs as an example
+ host these on Azure blob storage, or another service.

Know the fields you want to work with.

## Choose skills and order of operations


## Create skillset


## Map fields

Part of the indexer, but do it at this point.


## Create an index

+ Define fields for searchable content. You need: a content field, metadata fields, index-date(refresh) for basic blob indexer, for NER add organizations/people/locations, for keyphrase add ???, for bing entity,

```http
PUT https://YOUR_SERVICE.search.windows.net/indexes/YOUR_INDEX_NAME?api-version=2017-11-11-preview HTTP/1.1
api-key: YOUR_SERVICE_KEY
Content-Type: application/json
```

The JSON body of the request is the index schema:

```json
{
  "fields": [
    {
      "name": "id",
      "type": "Edm.String",
      "searchable": true,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": false,
      "key": true
    },
    {
      "name": "metadata",
      "type": "Edm.String",
      "searchable": false,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false
    },
    {
      "name": "text",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "retrievable": false,
      "sortable": false,
      "facetable": false,
      "synonymMaps": [
        "cryptonyms"
      ]
    },
    {
      "name": "entities",
      "type": "Collection(Edm.String)",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": false,
      "facetable": true}  
  ]
}

```


## Define and run an indexer

Assemble all the pieces

Add data source
Add index
Add skillset
Define field mappings
Run once

## Evaluate the results

You have to do a search query. Use Search Explorer in the portal, or a web api tool like fiddler.

Step 1: verification query -- syntax for returning all results (search=*) on a field by field basis (select param).

Step 2: test customer experience -- run representative queries; see if you need azure search features such as analyzers or scoring profiles to improve results.

## See also

+ [Create Skillset (REST API)](ref-create-skillset.md)
+ [How to create a skillset or augmentation pipeline](cognitive-search-defining-skillset.md)
+ [How to create custom cognitive skills](cognitive-search-creating-custom-skills.md)