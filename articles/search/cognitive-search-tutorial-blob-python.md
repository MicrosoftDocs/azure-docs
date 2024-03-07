---
title: 'Tutorial: Skillsets using Python'
titleSuffix: Azure AI Search
description: Use a notebook and the Azure SDK for Python to create skillsets. This skillset applies AI transformations and analyses to create searchable content from images and unstructured text.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: python
ms.topic: tutorial
ms.date: 03/06/2024
ms.custom:
  - devx-track-python
  - ignite-2023
---

# Python Tutorial: Use skillsets to generate searchable content in Azure AI Search

In this tutorial, learn how to use the [Azure SDK for Python](https://pypi.org/project/azure-search-documents/) to create an [AI enrichment pipeline](cognitive-search-concept-intro.md) for content extraction and transformations during indexing.

Skillsets add AI processing to raw content, making that content more uniform and searchable. Once you know how skillsets work, you can support a broad range of transformations: from image analysis, to natural language processing, to customized processing that you provide externally.

This tutorial helps you learn how to:

> [!div class="checklist"]
> + Define objects in an enrichment pipeline
> + Build a skillset that invokes OCR, language detection, entity recognition, and key phrase extraction
> + Execute the pipeline to invoke transformations, and to create and load a search index
> + Check the results using full text search

If you don't have an Azure subscription, open a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Overview

This tutorial uses Python and the [**azure-search-documents**](https://pypi.org/project/azure-search-documents/) client library to create a data source, index, indexer, and skillset.

The [indexer](search-indexer-overview.md) drives each step in the pipeline, starting with content extraction of sample data (unstructured text and images) in a blob container on Azure Storage.

Once content is extracted, the [skillset](cognitive-search-working-with-skillsets.md) executes built-in skills from Microsoft to find and extract information. These skills include Optical Character Recognition (OCR) on images, language detection on text, key phrase extraction, and entity recognition (organizations). New information created by the skillset is sent to fields in an [index](search-what-is-an-index.md). Once the index is populated, you can use the fields in queries, facets, and filters.

## Prerequisites

+ Python (3.11 or later)

+ [Visual Studio Code](https://code.visualstudio.com/download) with the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and [Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

+ [Azure Storage](/azure/storage/common/storage-account-create)

+ [Azure AI Search](search-create-app-portal.md)

+ [Sample data files (mixed media)](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/ai-enrichment-mixed-media)

> [!NOTE]
> You can use the free search service for this tutorial. A free search service limits you to three indexes, three indexers, and three data sources. This tutorial creates one of each. Before starting, make sure you have room on your service to accept the new resources.

### Upload sample data to Azure Storage

1. In Azure Storage, create a new container and name it *cog-search-demo*.

1. [Upload the sample data files](/azure/storage/blobs/storage-quickstart-blobs-portal).

   :::image type="content" source="media/cognitive-search-tutorial-blob/sample-files.png" alt-text="Screenshot of the files in File Explorer." border="true":::

1. Get a storage connection string so that you can formulate a connection in Azure AI Search.

   1. On the left, select **Access keys**.

   1. Copy the connection string for either key one or key two. The connection string is similar to the following example:

      ```http
      DefaultEndpointsProtocol=https;AccountName=cogsrchdemostorage;AccountKey=<your account key>;EndpointSuffix=core.windows.net
      ```

### Azure AI services

AI enrichment is backed by Azure AI services, including Language service and Azure AI Vision for natural language and image processing. For small workloads like this tutorial, you can use the free allocation of twenty transactions per indexer. For larger workloads, [attach an Azure AI Services multi-region resource to a skillset](cognitive-search-attach-cognitive-services.md) for pay-as-you-go pricing.

### Azure AI Search

The third component is Azure AI Search, which you can [create in the portal](search-create-service-portal.md) or [find an existing search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) in your subscription.

You can use the Free tier to complete this walkthrough.

### Copy a key and URL

For this tutorial, connections to Azure AI Search require an endpoint and an API key. You can get these values from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com), navigate to the search service **Overview** page, and copy the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. Under **Settings** > **Keys**, copy an admin key. Admin keys are used to add, modify, and delete objects. There are two interchangeable admin keys. Copy either one.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Screenshot of the URL and API keys in the Azure portal.":::

A valid API key establishes trust, on a per request basis, between the application sending the request and the search service handling it.

## Set up your environment

Use Visual Studio Code with the Python extension to create a new notebook.

Alternatively, download the notebook from [Azure-Search-python-samples repo](https://github.com/Azure-Samples/azure-search-python-samples/tree/main/Tutorial-AI-Enrichment) and open it in Visual Studio Code.

1. Install packages:

    ```python
    pip install azure-search-documents
    ```

1. Load libraries:

    ```python
    import json
    import requests
    from pprint import pprint
    ```

1. Define the names for the data source, index, indexer, and skillset. Run this script to set up the names for this tutorial.

    ```python
    # Define the names for the data source, skillset, index and indexer
    datasource_name = "cogsrch-py-datasource"
    skillset_name = "cogsrch-py-skillset"
    index_name = "cogsrch-py-index"
    indexer_name = "cogsrch-py-indexer"
    ```

1. In another cell, paste the following script, replacing the placeholders for your search service (YOUR-SEARCH-SERVICE-NAME) and admin API key (YOUR-ADMIN-API-KEY), and then run it to set up the search service endpoint.

    ```python
    # Setup the endpoint
    endpoint = 'https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/'
    headers = {'Content-Type': 'application/json',
               'api-key': '<YOUR-ADMIN-API-KEY>'}
    params = {
        'api-version': '2020-06-30'
    }
    ```

## Create the pipeline

In Azure AI Search, AI processing occurs during indexing (or data ingestion). This part of the tutorial creates four objects: data source, index definition, skillset, indexer. 

### Step 1: Create a data source

A [data source object](/rest/api/searchservice/create-data-source) provides the connection string to the Blob container containing the sample data files.

In the following script, replace the placeholder YOUR-BLOB-RESOURCE-CONNECTION-STRING with the connection string for the blob you created in the previous step. Replace the placeholder YOUR-BLOB-CONTAINER-NAME with the name of your container. Then, run the script to create a data source named `cogsrch-py-datasource`.

```python
# Create a data source
datasourceConnectionString = "<YOUR-BLOB-RESOURCE-CONNECTION-STRING>"
datasource_payload = {
    "name": datasource_name,
    "description": "Demo files to demonstrate Azure AI Search capabilities.",
    "type": "azureblob",
    "credentials": {
        "connectionString": datasourceConnectionString
    },
    "container": {
        "name": "<YOUR-BLOB-CONTAINER-NAME>"
    }
}
r = requests.put(endpoint + "/datasources/" + datasource_name,
                 data=json.dumps(datasource_payload), headers=headers, params=params)
print(r.status_code)
```

The request should return a status code of 201 confirming success.

In the Azure portal, on the search service dashboard page, verify that the cogsrch-py-datasource appears in the **Data sources** list. Select **Refresh** to update the page.

:::image type="content" source="media/cognitive-search-tutorial-blob-python/py-data-source-tile.png" alt-text="Data sources tile in the portal" border="false":::

### Step 2: Create a skillset

In this step, you'll define a set of enrichment steps using [built-in skills](cognitive-search-predefined-skills.md) from Microsoft:

+ [Entity Recognition](cognitive-search-skill-entity-recognition-v3.md) for extracting the names of organizations from content in the blob container.

+ [Language Detection](cognitive-search-skill-language-detection.md) to identify the content's language.

+ [Text Split](cognitive-search-skill-textsplit.md) to break large content into smaller chunks before calling the key phrase extraction skill. Key phrase extraction accepts inputs of 50,000 characters or less. A few of the sample files need splitting up to fit within this limit.

+ [Key Phrase Extraction](cognitive-search-skill-keyphrases.md) to pull out the top key phrases. 

Run the following script to create a skillset called `cogsrch-py-skillset`.

```python
# Create a skillset
skillset_payload = {
    "name": skillset_name,
    "description":
    "Extract entities, detect language and extract key-phrases",
    "skills":
    [
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
            "categories": ["Organization"],
            "defaultLanguageCode": "en",
            "inputs": [
                {
                    "name": "text", 
                    "source": "/document/content"
                }
            ],
            "outputs": [
                {
                    "name": "organizations", 
                    "targetName": "organizations"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
            "inputs": [
                {
                    "name": "text", 
                    "source": "/document/content"
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
            "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
            "textSplitMode": "pages",
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
                    "name": "textItems",
                    "targetName": "pages"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
            "context": "/document/pages/*",
            "inputs": [
                {
                    "name": "text", 
                    "source": "/document/pages/*"
                },
                {
                    "name": "languageCode", 
                    "source": "/document/languageCode"
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

r = requests.put(endpoint + "/skillsets/" + skillset_name,
                 data=json.dumps(skillset_payload), headers=headers, params=params)
print(r.status_code)
```

The request should return a status code of 201 confirming success.

The key phrase extraction skill is applied for each page. By setting the context to `"document/pages/*"`, you run this enricher for each member of the document/pages array (for each page in the document).

Each skill executes on the content of the document. During processing, Azure AI Search cracks each document to read content from different file formats. Text found in the source file is placed into a `content` field, one for each document. Therefore, set the input as `"/document/content"`.

A graphical representation of a portion of the skillset is shown below.

:::image type="content" source="media/cognitive-search-tutorial-blob/skillset.png" alt-text="Understand a skillset" border="false":::

Outputs can be mapped to an index, used as input to a downstream skill, or both, as is the case with language code. In the index, a language code is useful for filtering. As an input, language code is used by text analysis skills to inform the linguistic rules around word breaking.

For more information about skillset fundamentals, see [How to define a skillset](cognitive-search-defining-skillset.md).

### Step 3: Create an index

In this section, you define the index schema by specifying the fields to include in the searchable index, and setting the search attributes for each field. Fields have a type and can take attributes that determine how the field is used (searchable, sortable, and so forth). Field names in an index aren't required to identically match the field names in the source. In a later step, you add field mappings in an indexer to connect source-destination fields. For this step, define the index using field naming conventions pertinent to your search application.

This exercise uses the following fields and field types:

| field-names: | ID         | content   | languageCode | keyPhrases         | organizations     |
|--------------|----------|-------|----------|--------------------|-------------------|
| field-types: | Edm.String|Edm.String| Edm.String| List<Edm.String>  | List<Edm.String>  |

Run this script to create the index named `cogsrch-py-index`.

```python
# Create an index
index_payload = {
    "name": index_name,
    "fields": [
        {
            "name": "id",
            "type": "Edm.String",
            "key": "true",
            "searchable": "true",
            "filterable": "false",
            "facetable": "false",
            "sortable": "true"
        },
        {
            "name": "content",
            "type": "Edm.String",
            "sortable": "false",
            "searchable": "true",
            "filterable": "false",
            "facetable": "false"
        },
        {
            "name": "languageCode",
            "type": "Edm.String",
            "searchable": "true",
            "filterable": "false",
            "facetable": "false"
        },
        {
            "name": "keyPhrases",
            "type": "Collection(Edm.String)",
            "searchable": "true",
            "filterable": "false",
            "facetable": "false"
        },
        {
            "name": "organizations",
            "type": "Collection(Edm.String)",
            "searchable": "true",
            "sortable": "false",
            "filterable": "false",
            "facetable": "false"
        }
    ]
}

r = requests.put(endpoint + "/indexes/" + index_name,
                 data=json.dumps(index_payload), headers=headers, params=params)
print(r.status_code)
```

The request should return a status code of 201 confirming success.

To learn more about defining an index, see [Create Index (REST API)](/rest/api/searchservice/create-index).

### Step 4: Create and run an indexer

An [Indexer](/rest/api/searchservice/create-indexer) drives the pipeline. The three components you've created thus far (data source, skillset, index) are inputs to an indexer. Creating the indexer on Azure AI Search is the event that puts the entire pipeline into motion. 

To tie these objects together in an indexer, you must define field mappings.

+ The `"fieldMappings"` are processed before the skillset, mapping source fields from the data source to target fields in an index. If field names and types are the same at both ends, no mapping is required.

+ The `"outputFieldMappings"` are processed after the skillset, referencing `"sourceFieldNames"` that don't exist until document cracking or enrichment creates them. The `"targetFieldName"` is a field in an index.

Besides hooking up inputs to outputs, you can also use field mappings to flatten data structures. For more information, see [How to map enriched fields to a searchable index](cognitive-search-output-field-mapping.md).

Run this script to create an indexer named `cogsrch-py-indexer`.

```python
# Create an indexer
indexer_payload = {
    "name": indexer_name,
    "dataSourceName": datasource_name,
    "targetIndexName": index_name,
    "skillsetName": skillset_name,
    "fieldMappings": [
        {
            "sourceFieldName": "metadata_storage_path",
            "targetFieldName": "id",
            "mappingFunction":
            {"name": "base64Encode"}
        },
        {
            "sourceFieldName": "content",
            "targetFieldName": "content"
        }
    ],
    "outputFieldMappings":
    [
        {
            "sourceFieldName": "/document/organizations",
            "targetFieldName": "organizations"
        },
        {
            "sourceFieldName": "/document/pages/*/keyPhrases/*",
            "targetFieldName": "keyPhrases"
        },
        {
            "sourceFieldName": "/document/languageCode",
            "targetFieldName": "languageCode"
        }
    ],
    "parameters":
    {
        "maxFailedItems": -1,
        "maxFailedItemsPerBatch": -1,
        "configuration":
        {
            "dataToExtract": "contentAndMetadata",
            "imageAction": "generateNormalizedImages"
        }
    }
}

r = requests.put(endpoint + "/indexers/" + indexer_name,
                 data=json.dumps(indexer_payload), headers=headers, params=params)
print(r.status_code)
```

The request should return a status code of 201 soon, however, the processing can take several minutes to complete. Although the data set is small, analytical skills, such as image analysis, are computationally intensive and take time.

You can [monitor indexer status](#check-indexer-status) to determine when the indexer is running or finished.

> [!TIP]
> Creating an indexer invokes the pipeline. If there is a problem accessing the data, mapping inputs and outputs, or with the order of operations, it will appear at this stage. To re-run the pipeline with code or script changes, you may need to delete objects first. For more information, see [Reset and re-run](#reset).

#### About the request body

The script sets `"maxFailedItems"`  to -1, which instructs the indexing engine to ignore errors during data import. This is useful because there are so few documents in the demo data source. For a larger data source, you would set the value to greater than 0.

Also notice the `"dataToExtract":"contentAndMetadata"` statement in the configuration parameters. This statement tells the indexer to  extract the content from different file formats and the metadata related to each file.

When content is extracted, you can set `imageAction` to extract text from images found in the data source. The `"imageAction":"generateNormalizedImages"` configuration, combined with the OCR Skill and Text Merge Skill, tells the indexer to extract text from the images (for example, the word "stop" from a traffic Stop sign), and embed it as part of the content field. This behavior applies to both the images embedded in the documents (think of an image inside a PDF) and images found in the data source, for instance a JPG file.

<a name="check-indexer-status"></a>

## Monitor indexing

Once the indexer is defined, it runs automatically when you submit the request. Depending on which skills you defined, indexing can take longer than you expect. To find out whether the indexer  processing is complete, run the following script.

```python
# Get indexer status
r = requests.get(endpoint + "/indexers/" + indexer_name +
                 "/status", headers=headers, params=params)
pprint(json.dumps(r.json(), indent=1))
```

In the response, monitor the `"lastResult"` for its `"status"` and `"endTime"` values. Periodically run the script to check the status. When the indexer has completed, the status will be set to "success", an "endTime" will be specified, and the response will include any errors and warnings that occurred during enrichment.

:::image type="content" source="media/cognitive-search-tutorial-blob-python/py-indexer-is-created.png" alt-text="Indexer is created" border="false":::

Warnings are common with some source file and skill combinations and don't always indicate a problem. Many warnings are benign. For example, if you index a JPEG file that doesn't have text, you'll see the warning in this screenshot.

:::image type="content" source="media/cognitive-search-tutorial-blob-python/py-indexer-warning-example.png" alt-text="Example indexer warning" border="false":::

## Search

After indexing is finished, run queries that return the contents of the index or individual fields. 

First, get the index definition showing all of the fields. Visual Studio Code limits the output to 30 lines by default, but provides an option to open the output in a text editor. Use that option to view the full output. The output is the index schema, with the name, type, and attributes of each field.

```python
# Query the service for the index definition
r = requests.get(endpoint + "/indexes/" + index_name,
                 headers=headers, params=params)
pprint(json.dumps(r.json(), indent=1))
```

Next, submit a second query for `"*"` to return all contents of a single field, such as `organizations`. See [Search Documents (REST API)](/rest/api/searchservice/search-documents) for more information about the request. 

```python
# Query the index to return the contents of organizations
r = requests.get(endpoint + "/indexes/" + index_name +
                 "/docs?&search=*&$select=organizations", headers=headers, params=params)
pprint(json.dumps(r.json(), indent=1))
```

If you'd like to continue testing from this notebook, repeat the above commands using other fields: `content`, `languageCode`, `keyPhrases`, and `organizations` in this exercise. 

> [!TIP]
> A better search experience might be switching to [Search Explorer](search-explorer.md) in the Azure portal or [creating a demo search app](search-create-app-portal.md) from the index you just created.

<a name="reset"></a>

## Reset and rerun

In the early stages of development, it's practical to delete the objects from Azure AI Search and allow your code to rebuild them. Resource names are unique. Deleting an object lets you recreate it using the same name.

You can use the portal to delete indexes, indexers, data sources, and skillsets. When you delete the indexer, you can optionally, selectively delete the index, skillset, and data source at the same time.

:::image type="content" source="media/cognitive-search-tutorial-blob-python/py-delete-indexer-delete-all.png" alt-text="Delete search objects in the portal" border="false":::

You can also delete them using a script. The following script deletes a skillset. 

```python
# delete the skillset
r = requests.delete(endpoint + "/skillsets/" + skillset_name,
                    headers=headers, params=params)
pprint(json.dumps(r.json(), indent=1))
```

Status code 204 is returned on successful deletion.

## Takeaways

This tutorial demonstrates the basic steps for building an enriched indexing pipeline through the creation of component parts: a data source, skillset, index, and indexer.

[Built-in skills](cognitive-search-predefined-skills.md) were introduced, along with skillset definitions and a way to chain skills together through inputs and outputs. You also learned that `outputFieldMappings` in the indexer definition is required for routing enriched values from the pipeline into a searchable index on an Azure AI Search service.

Finally, you learned how to test the results and reset the system for further iterations. You learned that issuing queries against the index returns the output created by the enriched indexing pipeline. In this release, there's a mechanism for viewing internal constructs (enriched documents created by the system). You also learned how to check the indexer status and what  objects must be deleted before rerunning a pipeline.

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the All resources or Resource groups link in the left-navigation pane.

## Next steps

Now that you're familiar with all of the objects in an AI enrichment pipeline, let's take a closer look at skillset definitions and individual skills.

> [!div class="nextstepaction"]
> [How to create a skillset](cognitive-search-defining-skillset.md)
