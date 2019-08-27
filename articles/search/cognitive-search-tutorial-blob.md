---
title: 'REST Tutorial: Build an AI enrichment pipeline using cognitive search - Azure Search'
description: Step through an example of text extraction and natural language processing over content in JSON blobs using Postman and the Azure Search REST APIs. 
manager: pablocas
author: luiscabrer
services: search
ms.service: search
ms.topic: tutorial
ms.date: 08/23/2019
ms.author: luisca
ms.subservice: cognitive-search
#Customer intent: As a developer, I want an introduction to the core APIs.
---

# Tutorial: Add structure to "unstructured content" with cognitive search

If you have unstructured text or image content, the [cognitive search](cognitive-search-concept-intro.md) feature of Azure Search can help you extract information and create new content that is useful for full-text search or knowledge mining scenarios. Although cognitive search can process image files (JPG, PNG, TIFF), this tutorial focuses on word-based content, applying language detection and text analytics to create new fields and information that you can leverage in queries, facets, and filters.

> [!div class="checklist"]
> * Start with whole documents (unstructured text) as PDF, MD, DOCX, and PPTX in Azure Blob storage.
> * Create a pipeline that extracts text, detects language, recognizes entities, and detects key phrases.
> * Define an index to store the output (raw content, plus pipeline-generated name-value pairs).
> * Execute the pipeline to create and load the index.
> * Explore content using full text search and a rich query syntax.

You'll need several services to complete this walkthrough, plus the [Postman desktop app](https://www.getpostman.com/) or another Web testing tool to make REST API calls. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## 1 - Download files

1. Open this [OneDrive folder](https://1drv.ms/f/s!As7Oy81M_gVPa-LCb5lC_3hbS-4) and on the top-left corner, click **Download** to copy the files to your computer. 

1. Right-click the zip file and select **Extract All**. There are 14 files of various types. You'll use 7 for this exercise.

## 2 - Create services

This walkthrough uses Azure Search for indexing and queries, Cognitive Services for AI processing, and Azure Blob storage as the data provider. When creating multiple services for one solution, place them in the same region and in the same resource group for proximity and manageability.

### Start with Azure Storage

1. [Sign in to the Azure portal](https://portal.azure.com/) and click **+ Create Resource**.

1. Search for *storage account* and select Microsoft's Storage Account offering.

   ![Create Storage account](media/cognitive-search-tutorial-blob/storage-account.png "Create Storage account")

1. In the Basics tab, the following items are required. Accept the defaults for everything else.

   + **Resource group**. Select an existing one or create a new one, but use the same group for all services so that you can manage them collectively.

   + **Storage account name**. If you think you might have multiple resources of the same type, use the name to disambiguate by type and region, for example *blobstoragewestus*. 

   + **Location**. Choose a location that can be used for Azure Search and Cognitive Services as well. A single location voids bandwidth charges, and is also a requirement for Azure Search and Cognitive Services used together in a cognitive search pipeline.

   + **Account Kind**. Choose the default, *StorageV2 (general purpose v2)*.

1. Click **Review + Create** to create the service.

1. Once it's created, click **Go to the resource** to open the Overview page.

1. Click **Blobs** service.

1. Click **+ Container** to create a container and name it *cog-search-demo*.

1. Select *cog-search-demo* and then click **Upload** to open the folder where you saved the download files. Select all of the non-image files. You should have 7 files. Click **OK** to upload.

   ![Upload sample files](media/cognitive-search-tutorial-blob/sample-files.png "Upload sample files")

1. Obtain an access key so that you can formulate a connection later on. 

   Browse back to the Overview page of your storage account (we used *blobstragewestus* as an example). In the left navigation pane, select **Access keys** and copy one of the connection strings. 

   The connection string should be a URL similar to the following example:

      ```http
      DefaultEndpointsProtocol=https;AccountName=cogsrchdemostorage;AccountKey=<your account key>;EndpointSuffix=core.windows.net
      ```

1. Save the connection string to Notepad. You'll need it later when setting up the data source connection.

### Cognitive Services

AI processing in cognitive search is backed by Cognitive Services, including Text Analytics and Computer Vision for natural language and image processing. If your task was to complete an actual prototype or project, you would provision Cognitive Services at this point so that you can attach it to indexing operations.

For this exercise, however, you can skip resource provisioning because Azure Search can connect to Cognitive Services behind the scenes and give you 20 free transactions per indexer run. Since this tutorial uses 7 transactions (7 documents), the free allocation is sufficient. For larger projects, plan on provisioning Cognitive Services at the pay-as-you-go S0 tier. For more information, see [Attach Cognitive Services](cognitive-search-attach-cognitive-services.md).

### Azure Search

The third component is Azure Search, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this walkthrough. When setting up the resource, remember to use the same resource group and location as those used for the storage account in the previous step.

As with Azure Blob storage, take a moment to collect the access key. Further on, when you begin structuring requests, you will need to provide the endpoint and admin api-key used to authenticate each request.

### Get an admin api-key and URL for Azure Search

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the name of your search service. You can confirm your service name by reviewing the endpoint URL. If your endpoint URL were `https://mydemo.search.windows.net`, your service name would be `mydemo`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

    Get the query key as well. It's a best practice to issue query requests with read-only access.

![Get the service name and admin and query keys](media/search-get-started-nodejs/service-name-and-keys.png)

All requests require an api-key in the header of every request sent to your service. A valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## 3 - Set up Postman

Start Postman and set up an HTTP request. If you are unfamiliar with this tool, see [Explore Azure Search REST APIs using Postman](search-get-started-postman.md).

The request methods used in this tutorial are **POST**, **PUT**, and **GET**. You'll use the methods to make four API calls to your search service: create a data source, a skillset, an index, and an indexer.

In Headers, set "Content-type" to `application/json` and set `api-key` to the admin api-key of your Azure Search service. Once you set the headers, you can use them for every request in this exercise.

  ![Postman request URL and header](media/search-get-started-postman/postman-url.png "Postman request URL and header")

## 4 - Create the pipeline

In Azure Search, AI processing occurs during indexing (or data ingestion). This part of the walkthrough creates four objects: data source, index definition, skillset, indexer. 

### Step 1: Create a data source

A [data source object](https://docs.microsoft.com/rest/api/searchservice/create-data-source) provides the connection string to the Blob container containing the files.

1. Use **POST** and the following URL, replacing YOUR-SERVICE-NAME with the actual name of your service.

   ```http
   https://[YOUR-SERVICE-NAME].search.windows.net/datasources?api-version=2019-05-06
   ```

1. In request **Body**, copy the following JSON definition, replacing the `connectionString` with the actual connection of your storage account. 

   Remember to edit the container name as well. We suggested "cog-search-demo" for the container name in an earlier step.

    ```json
    {
      "name" : "cog-search-demo-ds",
      "description" : "Demo files to demonstrate cognitive search capabilities.",
      "type" : "azureblob",
      "credentials" :
      { "connectionString" :
        "DefaultEndpointsProtocol=https;AccountName=<YOUR-STORAGE-ACCOUNT>;AccountKey=<YOUR-ACCOUNT-KEY>;"
      },
      "container" : { "name" : "<YOUR-BLOB-CONTAINER-NAME>" }
    }
    ```
1. Send the request. You should see a status code of 201 confirming success. 

If you got a 403 or 404 error, check the request construction: `api-version=2019-05-06` should be on the endpoint, `api-key` should be in the Header after `Content-Type`, and its value must be valid for a search service. You might want to run the JSON document through an online JSON validator to make sure the syntax is correct. 

### Step 2: Create a skillset

A [skillset object](https://docs.microsoft.com/rest/api/searchservice/create-skillset) is a set of enrichment steps applied to your content. 

1. Use **PUT** and the following URL, replacing YOUR-SERVICE-NAME with the actual name of your service.

    ```http
    https://[YOUR-SERVICE-NAME].search.windows.net/skillsets/cog-search-demo-ss?api-version=2019-05-06
    ```

1. In request **Body**, copy the JSON definition below. This skillset consists of the following built-in skills.

   | Skill                 | Description    |
   |-----------------------|----------------|
   | [Entity Recognition](cognitive-search-skill-entity-recognition.md) | Extracts the names of people, organizations, and locations from content in the blob container. |
   | [Language Detection](cognitive-search-skill-language-detection.md) | Detects the content's language. |
   | [Text Split](cognitive-search-skill-textsplit.md)  | Breaks large content into smaller chunks before calling the key phrase extraction skill. Key phrase extraction accepts inputs of 50,000 characters or less. A few of the sample files need splitting up to fit within this limit. |
   | [Key Phrase Extraction](cognitive-search-skill-keyphrases.md) | Pulls out the top key phrases. |

   Each skill executes on the content of the document. During processing, Azure Search cracks each document to read content from different file formats. Found text originating in the source file is placed into a generated ```content``` field, one for each document. As such, the input becomes ```"/document/content"```.

   For key phrase extraction, because we use the text splitter skill to break larger files into pages, the context for the key phrase extraction skill is ```"document/pages/*"``` (for each page in the document) instead of ```"/document/content"```.

    ```json
    {
      "description": "Extract entities, detect language and extract key-phrases",
      "skills":
      [
        {
          "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
          "categories": [ "Person", "Organization", "Location" ],
          "defaultLanguageCode": "en",
          "inputs": [
            { "name": "text", "source": "/document/content" }
          ],
          "outputs": [
            { "name": "persons", "targetName": "persons" },
            { "name": "organizations", "targetName": "organizations" },
            { "name": "locations", "targetName": "locations" }
          ]
        },
        {
          "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
          "inputs": [
            { "name": "text", "source": "/document/content" }
          ],
          "outputs": [
            { "name": "languageCode", "targetName": "languageCode" }
          ]
        },
        {
          "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
          "textSplitMode" : "pages",
          "maximumPageLength": 4000,
          "inputs": [
            { "name": "text", "source": "/document/content" },
            { "name": "languageCode", "source": "/document/languageCode" }
          ],
          "outputs": [
            { "name": "textItems", "targetName": "pages" }
          ]
        },
        {
          "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
          "context": "/document/pages/*",
          "inputs": [
            { "name": "text", "source": "/document/pages/*" },
            { "name":"languageCode", "source": "/document/languageCode" }
          ],
          "outputs": [
            { "name": "keyPhrases", "targetName": "keyPhrases" }
          ]
        }
      ]
    }
    ```
    A graphical representation of the skillset is shown below. 

    ![Understand a skillset](media/cognitive-search-tutorial-blob/skillset.png "Understand a skillset")

1. Send the request. Postman should return a status code of 201 confirming success. 

> [!NOTE]
> Outputs can be mapped to an index, used as input to a downstream skill, or both as is the case with language code. In the index, a language code is useful for filtering. As an input, language code is used by text analysis skills to inform the linguistic rules around word breaking. For more information about skillset fundamentals, see [How to define a skillset](cognitive-search-defining-skillset.md).

### Step 3: Create an index

An [index](https://docs.microsoft.com/rest/api/searchservice/create-index) provides the schema used to create the physical expression of your content in inverted indexes and other constructs in Azure Search. The largest component of an index is the fields collection, where data type and attributes determine contents and behaviors in Azure Search.

1. Use **PUT** and the following URL, replacing YOUR-SERVICE-NAME with the actual name of your service, to name your index.

   ```http
   https://[YOUR-SERVICE-NAME].search.windows.net/indexes/cog-search-demo-idx?api-version=2019-05-06
   ```

1. In request **Body**, copy the following JSON definition. The `content` field stores the document itself. Additional fields for `languageCode`, `keyPhrases`, and `organizations` represent new information (fields and values) created by the skillset.

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
          "name": "metadata_storage_name",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,
          "facetable": false,
          "sortable": false
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
          "name": "languageCode",
          "type": "Edm.String",
          "searchable": true,
          "filterable": false,
          "facetable": false
        },
        {
          "name": "keyPhrases",
          "type": "Collection(Edm.String)",
          "searchable": true,
          "filterable": false,
          "facetable": false
        },
        {
          "name": "persons",
          "type": "Collection(Edm.String)",
          "searchable": true,
          "sortable": false,
          "filterable": true,
          "facetable": true
        },
        {
          "name": "organizations",
          "type": "Collection(Edm.String)",
          "searchable": true,
          "sortable": false,
          "filterable": true,
          "facetable": true
        },
        {
          "name": "locations",
          "type": "Collection(Edm.String)",
          "searchable": true,
          "sortable": false,
          "filterable": true,
          "facetable": true
        }
      ]
    }
    ```

1. Send the request. Postman should return a status code of 201 confirming success. 

### Step 4: Create and run an indexer

An [Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer) drives the pipeline. The three components you have created thus far (data source, skillset, index) are inputs to an indexer. Creating the indexer on Azure Search is the event that puts the entire pipeline into motion. 

1. Use **PUT** and the following URL, replacing YOUR-SERVICE-NAME with the actual name of your service, to name your indexer.

   ```http
   https://[servicename].search.windows.net/indexers/cog-search-demo-idxr?api-version=2019-05-06
   ```

1. In request **Body**, copy the JSON definition below. Notice the field mapping elements; these mappings are important because they define the data flow. 

   The `fieldMappings` are processed before the skillset, sending content from the data source to target fields in an index. You'll use field mappings to send existing, unmodified content to the index. If field names and types are the same at both ends, no mapping is required.

   The `outputFieldMappings` are for fields created by skills, and thus processed after the skillset has run. The references to `sourceFieldNames` in `outputFieldMappings` don't exist until document cracking or enrichment creates them. The `targetFieldName` is a field in an index, defined in the index schema.

    ```json
    {
      "name":"cog-search-demo-idxr",	
      "dataSourceName" : "cog-search-demo-ds",
      "targetIndexName" : "cog-search-demo-idx",
      "skillsetName" : "cog-search-demo-ss",
      "fieldMappings" : [
        {
          "sourceFieldName" : "metadata_storage_path",
          "targetFieldName" : "id",
          "mappingFunction" :
            { "name" : "base64Encode" }
        },
        {
          "sourceFieldName" : "metadata_storage_name",
          "targetFieldName" : "metadata_storage_name",
          "mappingFunction" :
            { "name" : "base64Encode" }
        },
        {
          "sourceFieldName" : "content",
          "targetFieldName" : "content"
        }
      ],
      "outputFieldMappings" :
      [
        {
          "sourceFieldName" : "/document/persons",
          "targetFieldName" : "persons"
        },
        {
          "sourceFieldName" : "/document/organizations",
          "targetFieldName" : "organizations"
        },
        {
          "sourceFieldName" : "/document/locations",
          "targetFieldName" : "locations"
        },
        {
          "sourceFieldName" : "/document/pages/*/keyPhrases/*",
          "targetFieldName" : "keyPhrases"
        },
        {
          "sourceFieldName": "/document/languageCode",
          "targetFieldName": "languageCode"
        }
      ],
      "parameters":
      {
        "maxFailedItems":-1,
        "maxFailedItemsPerBatch":-1,
        "configuration":
        {
          "dataToExtract": "contentAndMetadata",
          "parsingMode": "default",
          "firstLineContainsHeaders": false,
          "delimitedTextDelimiter": ","
        }
      }
    }
    ```

1. Send the request. Postman should return a status code of 201 confirming successful processing. 

   Expect this step to take several minutes to complete. Even though the data set is small, analytical skills are computation-intensive. 

> [!NOTE]
> Creating an indexer invokes the pipeline. If there are problems reaching the data, mapping inputs and outputs, or order of operations, they appear at this stage. To re-run the pipeline with code or script changes, you might need to drop objects first. For more information, see [Reset and re-run](#reset).

#### About indexer parameters

The script sets ```"maxFailedItems"```  to -1, which instructs the indexing engine to ignore errors during data import. This is acceptable because there are so few documents in the demo data source. For a larger data source, you would set the value to greater than 0.

The ```"dataToExtract":"contentAndMetadata"``` statement tells the indexer to automatically extract the content from different file formats as well as metadata related to each file. 

When content is extracted, you can set ```imageAction``` to extract text from images found in the data source. The ```"imageAction":"generateNormalizedImages"``` configuration, combined with the OCR Skill and Text Merge Skill, tells the indexer to extract text from the images (for example, the word "stop" from a traffic Stop sign), and embed it as part of the content field. This behavior applies to both the images embedded in the documents (think of an image inside a PDF), as well as images found in the data source, for instance a JPG file.

## 5 - Monitor indexing

Indexing and enrichment commence as soon as you submit the Create Indexer request. Depending on which cognitive skills you defined, indexing can take a while. To find out whether the indexer is still running, send the following request to check the indexer status.

1. Use **GET** and the following URL, replacing YOUR-SERVICE-NAME with the actual name of your service, to name your indexer.

   ```http
   https://[YOUR-SERVICE-NAME].search.windows.net/indexers/cog-search-demo-idxr/status?api-version=2019-05-06
   ```

1. Review the response to learn whether the indexer is running, or to view error and warning information.  

If you are using the Free tier, the following message is expected: `"Could not extract content or metadata from your document. Truncated extracted text to '32768' characters". This message appears because blob indexing on the Free tier has a[32K limit on character extraction](search-limits-quotas-capacity.md#indexer-limits). You won't see this message for this data set on higher tiers. 

> [!NOTE]
> Warnings are common in some scenarios and do not always indicate a problem. For example, if a blob container includes image files, and the pipeline doesn't handle images, you'll get a warning stating that images were not processed.

## 6 - Search

Now that you've created new fields and information, let's run some queries to understand the value of cognitive search as it relates to a typical search scenario.

Recall that we started with blob content, where the entire document is packaged into a single `content` field. You can search this field and find matches to your queries.

1. Use **GET** and the following URL, replacing YOUR-SERVICE-NAME with the actual name of your service, to search for instances of a term or phrase, returning the `content` field and a count of the matching documents.

   ```http
   https://[YOUR-SERVICE-NAME].search.windows.net/indexes/cog-search-demo-idx?search=*&$count=true&$select=content?api-version=2019-05-06
   ```
   
   The results of this query return document contents, which is the same result you would get if used the blob indexer without the cognitive search pipeline. This field is searchable, but unworkable if you want to use facets, filters, or autocomplete.

1. Run a second query to return some of the new fields created by the pipeline (persons, organizations, locations, languageCode).

   ```http
   https://mydemo.search.windows.net/indexes/cog-search-demo-idx/docs?search=*&$count=true&$select=metadata_storage_name,persons,organizations,locations,languageCode&api-version=2019-05-06
   ```
   These fields contain new information created from the natural language processing capabilities of Cognitive Services. As you might expect, there is some noise in the results and variation across documents, but in many instances, the analytical models produce accurate results.

   The following image shows results for Satya Nadella's open letter upon assuming the CEO role at Microsoft.

   ![Pipeline output](media/cognitive-search-tutorial-blob/pipeline-output.png "Pipeline output")

<!-- 1. Shorter values are useful in filters and faceted navigation structures. This query returns a facets for locations and sorts results by language code.

   ```http
   https://[YOUR-SERVICE-NAME].search.windows.net/indexes/cog-search-demo-idx/docs?search=*&$select=persons,organizations,locations&&$filter=organizations eq 'Microsoft'&$orderby=languageCode&api-version=2019-05-06 -->
   ```

<a name="reset"></a>

## Reset and rerun

In the early experimental stages of pipeline development, the most practical approach for design iterations is to delete the objects from Azure Search and allow your code to rebuild them. Resource names are unique. Deleting an object lets you recreate it using the same name.

To reindex your documents with the new definitions:

1. Delete the index to remove persisted data. Delete the indexer to recreate it on your service.
2. Modify a skillset and index definition.
3. Recreate an index and indexer on the service to run the pipeline. 

You can use the portal to delete indexes, indexers, and skillsets, or use **DELETE** and provide URLs to each object. The following command deletes an indexer.

```http
DELETE https://[YOUR-SERVICE-NAME]].search.windows.net/indexers/cog-search-demo-idxr?api-version=2019-05-06
```

Status code 204 is returned on successful deletion.

As your code matures, you might want to refine a rebuild strategy. For more information, see [How to rebuild an index](search-howto-reindex.md).

## Takeaways

This tutorial demonstrates the basic steps for building an enriched indexing pipeline through the creation of component parts: a data source, skillset, index, and indexer.

[Predefined skills](cognitive-search-predefined-skills.md) were introduced, along with skillset definition and the mechanics of chaining skills together through inputs and outputs. You also learned that `outputFieldMappings` in the indexer definition is required for routing enriched values from the pipeline into a searchable index on an Azure Search service.

Finally, you learned how to test results and reset the system for further iterations. You learned that issuing queries against the index returns the output created by the enriched indexing pipeline. 

## Clean up resources

The fastest way to clean up after a tutorial is by deleting the resource group containing the Azure Search service and Azure Blob service. Assuming you put both services in the same group, delete the resource group now to permanently delete everything in it, including the services and any stored content that you created for this tutorial. In the portal, the resource group name is on the Overview page of each service.

## Next steps

Customize or extend the pipeline with custom skills. Creating a custom skill and adding it to a skillset allows you to onboard text or image analysis that you write yourself. 

> [!div class="nextstepaction"]
> [Example: Creating a custom skill for cognitive search](cognitive-search-create-custom-skill-example.md)


<!-- Output is a full text searchable index on Azure Search. You can enhance the index with other standard capabilities, such as [synonyms](search-synonyms.md), [scoring profiles](https://docs.microsoft.com/rest/api/searchservice/add-scoring-profiles-to-a-search-index), [analyzers](search-analyzers.md), and [filters](search-filters.md).

This tutorial runs on the Free service, but the number of free transactions is limited to 20 documents per day. If you want to run this tutorial more than once in the same day, use a smaller file set so that you can fit in more runs.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The following services, tools, and data are used in this tutorial. 

+ [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample data. Make sure the storage account is in the same region as Azure Search.

+ [Postman desktop app](https://www.getpostman.com/) is used for making REST calls to Azure Search.

+ [Sample data](https://1drv.ms/f/s!As7Oy81M_gVPa-LCb5lC_3hbS-4) consists of a small file set of different types. 

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial.

## Prepare sample data

The enrichment pipeline pulls from Azure data sources. Source data must originate from a supported data source type of an [Azure Search indexer](search-indexer-overview.md). Azure Table Storage is not supported for cognitive search. For this exercise, we use blob storage to showcase multiple content types.

1. [Sign in to the Azure portal](https://portal.azure.com), navigate to your Azure storage account, click **Blobs**, and then click **+ Container**.

1. [Create a Blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal) to contain sample data. You can set the Public Access Level to any of its valid values.

1. After the container is created, open it and select **Upload** on the command bar to upload the sample files you downloaded in a previous step.

   ![Source files in Azure blob storage](./media/cognitive-search-quickstart-blob/sample-data.png)

1. After sample files are loaded, get the container name and a connection string for your Blob storage. You could do that by navigating to your storage account in the Azure portal. On **Access keys**, and then copy the **Connection String**  field.

   The connection string should be a URL similar to the following example:

      ```http
      DefaultEndpointsProtocol=https;AccountName=cogsrchdemostorage;AccountKey=<your account key>;EndpointSuffix=core.windows.net
      ```

There are other ways to specify the connection string, such as providing a shared access signature. To learn more about data source credentials, see [Indexing Azure Blob Storage](search-howto-indexing-azure-blob-storage.md#Credentials).

## Set up Postman

Start Postman and set up an HTTP request. If you are unfamiliar with this tool, see [Explore Azure Search REST APIs using Postman](search-get-started-postman.md).

The request methods used in this tutorial are **POST**, **PUT**, and **GET**. The header keys are "Content-type" set to "application/json" and an "api-key" set to an admin key of your Azure Search service. The body is where you place the actual contents of your call. 

  ![Semi-structured search](media/search-semi-structured-data/postmanoverview.png)

We are using Postman to make four API calls to your search service in order to create a data source, a skillset, an index, and an indexer. The data source includes a pointer to your storage account and your JSON data. Your search service makes the connection when loading the data.


## Create a data source

Now that your services and source files are prepared, start assembling the components of your indexing pipeline. Begin with a [data source object](https://docs.microsoft.com/rest/api/searchservice/create-data-source) that tells Azure Search how to retrieve external source data.

In the request header, provide the service name you used while creating the Azure Search service, and the api-key generated for your search service. In the request body, specify the blob container name and connection string.

### Sample Request
```http
POST https://[service name].search.windows.net/datasources?api-version=2019-05-06
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
    "DefaultEndpointsProtocol=https;AccountName=<your account name>;AccountKey=<your account key>;"
  },
  "container" : { "name" : "<your blob container name>" }
}
```
Send the request. The web test tool should return a status code of 201 confirming success. 

Since this is your first request, check the Azure portal to confirm the data source was created in Azure Search. On the search service dashboard page, verify the Data Sources list has a new item. You might need to wait a few minutes for the portal page to refresh. 

  ![Data sources tile in the portal](./media/cognitive-search-tutorial-blob/data-source-tile.png "Data sources tile in the portal")

If you got a 403 or 404 error, check the request construction: `api-version=2019-05-06` should be on the endpoint, `api-key` should be in the Header after `Content-Type`, and its value must be valid for a search service. You can reuse the header for the remaining steps in this tutorial.

## Create a skillset

In this step, you define a set of enrichment steps that you want to apply to your data. You call each enrichment step a *skill*, and the set of enrichment steps a *skillset*. This tutorial uses [built-in cognitive skills](cognitive-search-predefined-skills.md) for the skillset:

+ [Language Detection](cognitive-search-skill-language-detection.md) to identify the content's language.

+ [Text Split](cognitive-search-skill-textsplit.md) to break large content into smaller chunks before calling the key phrase extraction skill. Key phrase extraction accepts inputs of 50,000 characters or less. A few of the sample files need splitting up to fit within this limit.

+ [Entity Recognition](cognitive-search-skill-entity-recognition.md) for extracting the names of organizations from content in the blob container.

+ [Key Phrase Extraction](cognitive-search-skill-keyphrases.md) to pull out the top key phrases. 

### Sample Request
Before you make this REST call, remember to replace the service name and the admin key in the request below if your tool does not preserve the request header between calls. 

This request creates a skillset. Reference the skillset name ```demoskillset``` for the rest of this tutorial.

```http
PUT https://[servicename].search.windows.net/skillsets/demoskillset?api-version=2019-05-06
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
      "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
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
      "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
      "textSplitMode" : "pages",
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

Send the request. The web test tool should return a status code of 201 confirming success. 

#### Explore the request body

Notice how the key phrase extraction skill is applied for each page. By setting the context to ```"document/pages/*"``` you run this enricher for each member of the document/pages array (for each page in the document).

Each skill executes on the content of the document. During processing, Azure Search cracks each document to read content from different file formats. Found text originating in the source file is placed into a generated ```content``` field, one for each document. As such, set the input as ```"/document/content"```.

A graphical representation of the skillset is shown below. 

![Understand a skillset](media/cognitive-search-tutorial-blob/skillset.png "Understand a skillset")

Outputs can be mapped to an index, used as input to a downstream skill, or both as is the case with language code. In the index, a language code is useful for filtering. As an input, language code is used by text analysis skills to inform the linguistic rules around word breaking.

For more information about skillset fundamentals, see [How to define a skillset](cognitive-search-defining-skillset.md).

## Create an index

In this section, you define the index schema by specifying which fields to include in the searchable index, and the search attributes for each field. Fields have a type and can take attributes that determine how the field is used (searchable, sortable, and so forth). Field names in an index are not required to identically match the field names in the source. In a later step, you add field mappings in an indexer to connect source-destination fields. For this step, define the index using field naming conventions pertinent to your search application.

This exercise uses the following fields and field types:

| field-names: | `id`       | content   | languageCode | keyPhrases         | organizations     |
|--------------|----------|-------|----------|--------------------|-------------------|
| field-types: | Edm.String|Edm.String| Edm.String| List<Edm.String>  | List<Edm.String>  |


### Sample Request
Before you make this REST call, remember to replace the service name and the admin key in the request below if your tool does not preserve the request header between calls. 

This request creates an index. Use the index name ```demoindex``` for the rest of this tutorial.

```http
PUT https://[servicename].search.windows.net/indexes/demoindex?api-version=2019-05-06
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
      "name": "languageCode",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "facetable": false
    },
    {
      "name": "keyPhrases",
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
Send the request. The web test tool should return a status code of 201 confirming success. 

To learn more about defining an index, see [Create Index (Azure Search REST API)](https://docs.microsoft.com/rest/api/searchservice/create-index).


## Create an indexer, map fields, and execute transformations

So far you have created a data source, a skillset, and an index. These three components become part of an [indexer](search-indexer-overview.md) that pulls each piece together into a single multi-phased operation. To tie these together in an indexer, you must define field mappings. 

+ The fieldMappings are processed before the skillset, mapping source fields from the data source to target fields in an index. If field names and types are the same at both ends, no mapping is required.

+ The outputFieldMappings are processed after the skillset, referencing sourceFieldNames that don't exist until document cracking or enrichment creates them. The targetFieldName is a field in an index.

Besides hooking up inputs to outputs, you can also use field mappings to flatten data structures. For more information, see [How to map enriched fields to a searchable index](cognitive-search-output-field-mapping.md).

### Sample Request

Before you make this REST call, remember to replace the service name and the admin key in the request below if your tool does not preserve the request header between calls. 

Also, provide the name of your indexer. You can reference it as ```demoindexer``` for the rest of this tutorial.

```http
PUT https://[servicename].search.windows.net/indexers/demoindexer?api-version=2019-05-06
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
      "mappingFunction" :
        { "name" : "base64Encode" }
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
      "targetFieldName" : "keyPhrases"
    },
    {
      "sourceFieldName": "/document/languageCode",
      "targetFieldName": "languageCode"
    }
  ],
  "parameters":
  {
    "maxFailedItems":-1,
    "maxFailedItemsPerBatch":-1,
    "configuration":
    {
      "dataToExtract": "contentAndMetadata",
      "imageAction": "generateNormalizedImages"
    }
  }
}
```

Send the request. The web test tool should return a status code of 201 confirming successful processing. 

Expect this step to take several minutes to complete. Even though the data set is small, analytical skills are computation-intensive. Some skills, such as image analysis, are long-running.

> [!TIP]
> Creating an indexer invokes the pipeline. If there are problems reaching the data, mapping inputs and outputs, or order of operations, they appear at this stage. To re-run the pipeline with code or script changes, you might need to drop objects first. For more information, see [Reset and re-run](#reset).

#### Explore the request body

The script sets ```"maxFailedItems"```  to -1, which instructs the indexing engine to ignore errors during data import. This is useful because there are so few documents in the demo data source. For a larger data source, you would set the value to greater than 0.

Also notice the ```"dataToExtract":"contentAndMetadata"``` statement in the configuration parameters. This statement tells the indexer to automatically extract the content from different file formats as well as metadata related to each file. 

When content is extracted, you can set ```imageAction``` to extract text from images found in the data source. The ```"imageAction":"generateNormalizedImages"``` configuration, combined with the OCR Skill and Text Merge Skill, tells the indexer to extract text from the images (for example, the word "stop" from a traffic Stop sign), and embed it as part of the content field. This behavior applies to both the images embedded in the documents (think of an image inside a PDF), as well as images found in the data source, for instance a JPG file.

## Check indexer status

Once the indexer is defined, it runs automatically when you submit the request. Depending on which cognitive skills you defined, indexing can take longer than you expect. To find out whether the indexer is still running, send the following request to check the indexer status.

```http
GET https://[servicename].search.windows.net/indexers/demoindexer/status?api-version=2019-05-06
api-key: [api-key]
Content-Type: application/json
```

The response tells you whether the indexer is running. After indexing is finished, use another HTTP GET to the STATUS endpoint (as above) to see reports of any errors and warnings that occurred during enrichment.  

Warnings are common with some source file and skill combinations and do not always indicate a problem. In this tutorial, the warnings are benign (for example, no text inputs from the JPEG files). You can review the status response for verbose information about warnings emitted during indexing.
  -->
<!-- 
## Query your index

After indexing is finished, run queries that return the contents of individual fields. By default, Azure Search returns the top 50 results. The sample data is small so the default works fine. However, when working with larger data sets, you might need to include parameters in the query string to return more results. For instructions, see [How to page results in Azure Search](search-pagination-page-layout.md).

As a verification step, query the index for all of the fields.

```http
GET https://[servicename].search.windows.net/indexes/demoindex?api-version=2019-05-06
api-key: [api-key]
Content-Type: application/json
```

The output is the index schema, with the name, type, and attributes of each field.

Submit a second query for `"*"` to return all contents of a single field, such as `organizations`.

```http
GET https://[servicename].search.windows.net/indexes/demoindex/docs?search=*&$select=organizations&api-version=2019-05-06
api-key: [api-key]
Content-Type: application/json
```

Repeat for additional fields: content, languageCode, keyPhrases, and organizations in this exercise. You can return multiple fields via `$select` using a comma-delimited list.

You can use GET or POST, depending on query string complexity and length. For more information, see [Query using the REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents).



<a name="reset"></a>

## Reset and rerun

In the early experimental stages of pipeline development, the most practical approach for design iterations is to delete the objects from Azure Search and allow your code to rebuild them. Resource names are unique. Deleting an object lets you recreate it using the same name.

To reindex your documents with the new definitions:

1. Delete the index to remove persisted data. Delete the indexer to recreate it on your service.
2. Modify a skillset and index definition.
3. Recreate an index and indexer on the service to run the pipeline. 

You can use the portal to delete indexes, indexers, and Skillsets.

```http
DELETE https://[servicename].search.windows.net/skillsets/demoskillset?api-version=2019-05-06
api-key: [api-key]
Content-Type: application/json
```

Status code 204 is returned on successful deletion.

As your code matures, you might want to refine a rebuild strategy. For more information, see [How to rebuild an index](search-howto-reindex.md). -->

<!-- ## Takeaways

This tutorial demonstrates the basic steps for building an enriched indexing pipeline through the creation of component parts: a data source, skillset, index, and indexer.

[Predefined skills](cognitive-search-predefined-skills.md) were introduced, along with skillset definition and the mechanics of chaining skills together through inputs and outputs. You also learned that `outputFieldMappings` in the indexer definition is required for routing enriched values from the pipeline into a searchable index on an Azure Search service.

Finally, you learned how to test results and reset the system for further iterations. You learned that issuing queries against the index returns the output created by the enriched indexing pipeline. In this release, there is a mechanism for viewing internal constructs (enriched documents created by the system). You also learned how to check indexer status, and which objects to delete before rerunning a pipeline.

## Clean up resources

The fastest way to clean up after a tutorial is by deleting the resource group containing the Azure Search service and Azure Blob service. Assuming you put both services in the same group, delete the resource group now to permanently delete everything in it, including the services and any stored content that you created for this tutorial. In the portal, the resource group name is on the Overview page of each service.

## Next steps

Customize or extend the pipeline with custom skills. Creating a custom skill and adding it to a skillset allows you to onboard text or image analysis that you write yourself. 

> [!div class="nextstepaction"]
> [Example: Creating a custom skill for cognitive search](cognitive-search-create-custom-skill-example.md) -->
