---
title: Search semi-structured data in Azure cloud Storage
description: Tutorial - Search semi-structured data in cloudSstorage 
services: storage
documentationcenter: storage
author: rogara
manager: tamram
editor: 
tags: 

ms.assetid: 
ms.service: storage
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: storage
ms.workload: 
ms.date: 09/07/2017
ms.author: rogara
ms.custom: mvc
---

# Search semi-structured data in cloud Storage

This tutorial is part two of a two-part series. In these tutorials, you learn how to search semi-structured and unstructured data. Semi-structured data is data that is not formally structured such as data models commonly associated with relational databases but contains tags or markings which separate content within the data. An example of this would be JSON.

In this part you learn how to:

> [!div class="checklist"]
> * Create an Azure Search Service using the REST API
> * Use the Azure Search Service to search your container

## Prerequisites

To complete this tutorial:

* Complete the [previous tutorial](./storage-unstructured-search.md)
* A REST client
* Some familiarity with REST API queries

## Setup

In order to successfully complete this tutorial you will be required to have a REST client. If you do not already have one feel free to obtain one from the internet, there are numerous freely available ones. For the purposes of this tutorial we will be using [Postman](https://www.getpostman.com/) and we will show you how to properly use it with Azure.

After installing postman, launch it.


The search api-key is required, it can be found under **Keys** inside your search service. This api-key must be in the header of every API call this tutorial directs you to make. So note it down.

  ![Semi-structured search](media/storage-unstructured-structured-search/keys.png)

If this is your first time using a rest client, here's a brief rundown of the components important to this tutorial: "POST" is denoting what type of REST call you are telling your client to make, the content-type and api-key are header keys, application/json and your "admin key" (remember this is a placeholder for your search primary key) are the values for your header keys, and the rest of the call (including the brackets) is the body of your call. Depending on what client you're using there may be some variations on how you construct your query but that's the gist of it.

## Download the sample data

For this tutorial, a sample data set has been prepared for you. **Download [clinical-trials-json.zip](https://github.com/roygara/storage-blob-integration-with-cdn-search-hdi/raw/master/clinical-trials-json.zip)** and unzip it to its own folder.

Contained in the sample is a set of example JSON files, which were originally text files obtained from [clinicaltrials.gov](https://clinicaltrials.gov/ct2/results). We have already converted them to JSON for your convenience.

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com).

## Upload the sample data

Navigate back to the storage account from the previous tutorial, open the **data** container, and click **Upload**.

Click **Advanced** and enter "clinical-trials-json", then upload all of the JSON files you downloaded.

After the upload completes they will now appear in their own subfolder inside the data container.

## Connect your search service to your blob storage

In the last tutorial, we connected our search service to our storage via the UI. In this tutorial, we make the connection via the API. We are using the REST API to perform the connection because the UI does not currently support JSON indexing.

The URL (also known as an endpoint) for each call must end with **api-version=2016-09-01-Preview** and each call should return a **201 Created.** The generally available api-version does not yet have the capability to handle json as a jsonArray, currently only the preview api-version does.

 Additionally, the `[service name]` in every example URL is the name of the search service created in the last tutorial. So note the name of your search service down as well. An example would be: `https://mysearch.search.windows.net/datasources?api-version=2016-09-01-Preview`

You will also need the name of your storage account and your storage account key, the storage account key can be found in the in your storage account under **Access Keys**. As pictured below:

  ![Semi-structured search](media/storage-unstructured-structured-search/storagekeys.png)

Execute the following three API calls.

The first API call creates a data source, which is what you use to specify what data to index. 

    POST https://[service name].search.windows.net/datasources?api-version=2016-09-01-Preview
    Content-Type: application/json
    api-key: [admin key]
    
    {
        "name" : "clinical-trials-json",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=[storage account name];AccountKey=[storage account key];" },
        "container" : { "name" : "data", "query" : "clinical-trials-json" }
    }

The second API call creates an index, it sets all the parameters and their attributes.

    POST https://[service name].search.windows.net/indexes?api-version=2016-09-01-Preview
    Content-Type: application/json   
    api-key: [admin key] 
    
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

The third and final call creates an indexer. An indexer connects the data source to the target search index and (optionally) provides a schedule to automate the data refresh.

    POST https://[service name].search.windows.net/indexers?api-version=2016-09-01-Preview
    Content-Type: application/json
    api-key: [admin key]
    
    {
      "name" : "clinical-trials-json-indexer",
      "dataSourceName" : "clinical-trials-json",
      "targetIndexName" : "clinical-trials-json-index",
      "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
    }



## Search your JSON files

Now that the search service has been connected to your blob data container you can begin searching your files.

Open the portal up and navigate back to your search service. Open up the search explorer, as shown in the previous tutorial.

As before, the data can be queried in a number of ways: particular terms (such as Myopia), the full data set, system properties, or user-defined metadata. Both system properties and user-defined metadata may only be searched with the select parameter if they were marked as retrievable during creation of the target index. Once parameters are created in the target index they may not be altered, though additional parameters may be added.

A basic example query would be `$select=Gender,metadata_storage_size`, which limits the return to those two parameters.

  ![Semi-structured search](media/storage-unstructured-structured-search/lastquery.png)

A more complex query would be `$filter=MinimumAge ge 20 and MaximumAge lt 75` which will return only results in which the parameters MinimumAge is greater than or equal to 20 and MaximumAge is less than 75.

## Clean-up

Now that you've completed the tutorial, you can go ahead and clean up all your resources.

The quickest way to accomplish this is to delete the resource group you created for the tutorial.

In this tutorial, you learned about searching semi-structured data such as how to:

> [!div class="checklist"]
> * Create an Azure Search Service using the REST API
> * Use the Azure Search Service to search your container