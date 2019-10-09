---
title: 'Create a knowledge store using REST - Azure Search'
description: Create an Azure Search knowledge store for persisting enrichments from cognitive search pipeline, using the REST API and Postman.

author: lobrien
services: search
ms.service: search
ms.topic: tutorial
ms.date: 10/01/2019
ms.author: laobri
 
---
# Create an Azure Search knowledge store using REST

Knowledge store is a feature in Azure Search that persists output from an AI enrichment pipeline for later analysis or other downstream processing. An AI-enriched pipeline accepts image files or unstructured text files, indexes them using Azure Search, applies AI enrichments from Cognitive Services (such as image analysis and natural language processing), and then saves results to a knowledge store in Azure storage. You can then use tools like Power BI or Storage Explorer to explore the knowledge store.

In this article, you will use the REST API interface to ingest, index, and apply AI enrichments to a set of hotel reviews. The hotel reviews are imported into Azure Blob Storage and the results are saved as a knowledge store in Azure Table Storage.

After you create the knowledge store, you can learn about accessing this knowledge store using [Storage Explorer](knowledge-store-view-storage-explorer.md) or [Power BI](knowledge-store-connect-power-bi.md).

## 1 - Create Services

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial.

+ [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample data and the knowledge store. Your storage account must use the same location (such as US-West) for your Azure Search service. The *Account kind* must be *StorageV2 (general purpose V2)* (default) or *Storage (general purpose V1)*.

+ Recommended: [Postman desktop app](https://www.getpostman.com/) for sending requests to Azure Search. You can use the REST API with any tool capable of working with HTTP requests and responses. Postman is a good choice for exploring REST APIs and will be used in this article. Further, the [source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/knowledge-store/KnowledgeStore.postman_collection.json) for this article includes a Postman collection of requests. 

## 2 - Store the Data

Load the hotel reviews CSV file into Azure Blob storage so it can be accessed by an Azure Search indexer and fed through the AI enrichment pipeline.

### Create an Azure Blob container with the data

1. [Download the hotel review data saved in a CSV file (HotelReviews_Free.csv)](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D). This data originates from Kaggle.com and contains customer feedback about hotels.
1. [Sign in to the Azure portal](https://portal.azure.com), and navigate to your Azure storage account.
1. [Create a Blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal). To create the container, in the left navigation bar for your storage account, click **Blobs**, and then click **+ Container** on the command bar.
1. For the new container **Name**, enter `hotel-reviews`.
1. Select any **Public Access Level**. We used the default.
1. Click **OK** to create the Azure Blob container.
1. Open the new `hotels-review` container, click **Upload**, and  select the **HotelReviews-Free.csv** file you downloaded in the first step.

    ![Upload the data](media/knowledge-store-create-portal/upload-command-bar.png "Upload the hotel reviews")

1. Click **Upload** to import the CSV file into Azure Blob Storage. The new container will appear.

    ![Create the Azure Blob container](media/knowledge-store-create-portal/hotel-reviews-blob-container.png "Create the Azure Blob container")

## 3 - Configure Postman

Download the [Postman collection source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/knowledge-store/KnowledgeStore.postman_collection.json) and import it into Postman using **File, Import...**. Switch to the **Collections** tab and click on the **...** button and select **Edit**. 

![Postman app showing navigation](media/knowledge-store-create-rest/postman-edit-menu.png "Navigate to the Edit menu in Postman")

In the resulting Edit dialog, navigate to the **Variables** tab. 

The **Variables** tab allows you to add values that Postman will swap in every time it encounters them within double braces. For example, Postman will replace the symbol `{{admin-key}}` with the "Current Value" of the `admin-key`. Postman will make this substitution in URLs, headers, the request body, and so forth. 

You'll find the value for `admin-key` in the Search Service's **Keys** tab. You'll need to change `search-service-name` and `storage-account-name` to the values you chose in [Step 1](#1---create-services). Set `storage-connection-string` from the value in the Storage Account's **Access Keys** tab. The other values you can leave unchanged.

![Postman app variables tab](media/knowledge-store-create-rest/postman-variables-window.png "Postman's variables window")


| Variable    | Where to get it |
|-------------|-----------------|
| `admin-key` | Search Service, **Keys** tab              |
| `api-version` | Leave as "2019-05-06-Preview" |
| `datasource-name` | Leave as "hotel-reviews-ds" | 
| `indexer-name` | Leave as "hotel-reviews-ixr" | 
| `index-name` | Leave as "hotel-reviews-ix" | 
| `search-service-name` | Search Service, main name. URL is `https://{{search-service-name}}.search.windows.net` | 
| `skillset-name` | Leave as "hotel-reviews-ss" | 
| `storage-account-name` | Storage Account, main name | 
| `storage-connection-string` | Storage Account, **Access Keys** tab, **key1** **Connection string** | 
| `storage-container-name` | Leave as "hotel-reviews" | 

### Review the request collection in Postman

Creating a Knowledge Store requires you to issue four HTTP requests: 

1. A PUT request to create the index. This index holds the data used and returned by Azure Search.
1. A POST request to create the datasource. This datasource connects your Azure Search behavior to the data and knowledge store's storage account. 
1. A PUT request to create the skillset. The skillset specifies the enrichments applied to your data and the structure of the knowledge store.
1. A PUT request to create the indexer. Running the indexer reads the data, applies the skillset, and stores the results. You must run this request last.

The [source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/knowledge-store/KnowledgeStore.postman_collection.json) contains a Postman collection with these four requests. To issue the requests, switch to the request's tab in Postman, and add `api-key` and `Content-Type` request headers. Set the value of `api-key` to `{{admin-key}}`. Set the value `Content-type` to `application/json`. 

> [!div class="mx-imgBorder"]
> ![Screenshot showing Postman's interface for headers](media/knowledge-store-create-rest/postman-headers-ui.png)

> [!Note]
> You will need to set `api-key` and `Content-type` headers in all of your requests. If a variable is recognized by Postman, it will render in 
> orange text, as with `{{admin-key}}` in the screenshot. If the variable is misspelled, it will render in red text.
>

## 4 - Create an Azure Search index

You need to create an Azure Search index to represent the data on which you're interested in searching, filtering, and doing enhancements. You create the index by issuing a PUT request to `https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}?api-version={{api-version}}`. Postman will replace symbols enclosed in double braces, such as `{{search-service-name}}`, `{{index-name}}`, and `{{api-version}}` with the values specified in [Step 3](#3---configure-postman). If you're using another tool to issue your REST commands, you'll have to substitute those variables yourself.

Specify the structure of your Azure Search index in the body of the request. In Postman, after setting the `api-key` and `Content-type` headers, switch to the **Body** pane of the request. You should see the following JSON, but if not, choose **Raw** and **JSON (application/json)** and paste the following code as the body:

```JSON
{
    "name": "{{index-name}}",
    "fields": [
        { "name": "address", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "categories", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "city", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false },
        { "name": "country", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "latitude", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "longitude", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "name", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false },
        { "name": "postalCode", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "province", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "reviews_date", "type": "Edm.DateTimeOffset", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "reviews_dateAdded", "type": "Edm.DateTimeOffset", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "reviews_rating", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "reviews_text", "type": "Edm.String", "filterable": false,  "sortable": false, "facetable": false },
        { "name": "reviews_title", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "reviews_username", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "AzureSearch_DocumentKey", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false, "key": true },
        { "name": "metadata_storage_content_type", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "metadata_storage_size", "type": "Edm.Int64", "searchable": false, "filterable": false, "sortable": false, "facetable": false},
        { "name": "metadata_storage_last_modified", "type": "Edm.DateTimeOffset", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "metadata_storage_name", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "metadata_storage_path", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "Sentiment", "type": "Collection(Edm.Double)", "searchable": false, "filterable": true, "retrievable": true, "sortable": false, "facetable": true },
        { "name": "Language", "type": "Edm.String", "filterable": true, "sortable": false, "facetable": true },
        { "name": "Keyphrases", "type": "Collection(Edm.String)", "filterable": true, "sortable": false, "facetable": true }
    ]
}

```

You'll see that this index definition is a combination of data that you'd like to present to the user (name of the hotel, review content, date, and so forth), search metadata, and AI enhancement data (Sentiment, Keyphrases, and Language).

Press the **Send** button to issue the PUT request. You should receive the status message of `201 - Created`. If you receive a different status, the **Body** pane will show a JSON response with an error message. 

## 5 - Create the Datasource

Now, you need to connect Azure Search to the hotel data you stored in [Step 2](#2---store-the-data). Creating the datasource is done with a POST to `https://{{search-service-name}}.search.windows.net/datasources?api-version={{api-version}}`. Again, you'll need to set the `api-key` and `Content-Type` headers as specified previously. 

In Postman, open the "Create Datasource" request. Switch to the **Body** pane, which should have the following code:

```json
{
  "name" : "{{datasource-name}}",
  "description" : "Demo files to demonstrate knowledge store capabilities.",
  "type" : "azureblob",
  "credentials" : { "connectionString" : "{{storage-connection-string}}" },
  "container" : { "name" : "{{storage-container-name}}" }
}
```

Press the **Send** button to issue the POST request. 

## 6 - Create the Skillset 

The next step is to specify the Skillset, which specifies both the enhancements to be applied and the Knowledge Store where the results will be stored. In Postman, open the "Create the Skillset" tab. This request sends a PUT to `https://{{search-service-name}}.search.windows.net/skillsets/{{skillset-name}}?api-version={{api-version}}`.
Set the `api-key` and `Content-type` headers as you've done previously. 

There are two large top-level objects: `"skills"` and `"knowledgeStore"`. Each object within the `"skills"` object is an enrichment service. Each enrichment service has `"inputs"` and `"outputs"`. Notice how the `LanguageDetectionSkill` has an output `targetName` of `"Language"`. The value of this node is used by most of the other skills as an input, with the source as `document/Language`. This capability of using the output of one node as the input to another is even more evident in the `ShaperSkill`, which specifies how the data will flow into the tables of the knowledge store.

The `"knowledge_store"` object connects to the storage account via the `{{storage-connection-string}}` Postman variable. Then, it contains a set of mappings between the enhanced document and tables and columns that will be available in the knowledge store itself. 

To generate the skillset, PUT the request by pressing the **Send** button in Postman.

```json
{
    "name": "{{skillset-name}}",
    "description": "Skillset to detect language, extract key phrases, and detect sentiment",
    "skills": [ 
    	{
            "@odata.type": "#Microsoft.Skills.Text.SplitSkill", 
            "context": "/document/reviews_text", "textSplitMode": "pages", "maximumPageLength": 5000,
            "inputs": [ 
                { "name": "text", "source": "/document/reviews_text" },
                { "name": "languageCode", "source": "/document/Language" }
            ],
            "outputs": [
                { "name": "textItems", "targetName": "pages" }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
            "context": "/document/reviews_text/pages/*",
            "inputs": [
                { "name": "text", "source": "/document/reviews_text/pages/*" },
                { "name": "languageCode", "source": "/document/Language" }
            ],
            "outputs": [
                { "name": "score", "targetName": "Sentiment" }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
            "context": "/document",
            "inputs": [
                { "name": "text", "source": "/document/reviews_text" }
            ],
            "outputs": [
                { "name": "languageCode", "targetName": "Language" }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
            "context": "/document/reviews_text/pages/*",
            "inputs": [
                { "name": "text",  "source": "/document/reviews_text/pages/*" },
                { "name": "languageCode",  "source": "/document/Language" }
            ],
            "outputs": [
                { "name": "keyPhrases" , "targetName": "Keyphrases" }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
            "context": "/document",
            "inputs": [
                { "name": "name",  "source": "/document/name" },
                { "name": "reviews_date",  "source": "/document/reviews_date" },
                { "name": "reviews_rating",  "source": "/document/reviews_rating" },
                { "name": "reviews_text",  "source": "/document/reviews_text" },
                { "name": "reviews_title",  "source": "/document/reviews_title" },
                { "name": "AzureSearch_DocumentKey",  "source": "/document/AzureSearch_DocumentKey" },
                { 
                    "name": "pages",
                    "sourceContext": "/document/reviews_text/pages/*",
                    "inputs": [
                        { "name": "SentimentScore", "source": "/document/reviews_text/pages/*/Sentiment" },
                        { "name": "LanguageCode", "source": "/document/Language" },
                        { "name": "Page", "source": "/document/reviews_text/pages/*" },
                        { 
                            "name": "keyphrase", "sourceContext": "/document/reviews_text/pages/*/Keyphrases/*",
                            "inputs": [
                                { "name": "Keyphrases", "source": "/document/reviews_text/pages/*/Keyphrases/*" }
                            ]
                        }
                    ]
                }
            ],
            "outputs": [
                { "name": "output" , "targetName": "tableprojection" }
            ]
        }
    ],
    "knowledgeStore": {
        "storageConnectionString": "{{storage-connection-string}}",
        "projections": [
            {
                "tables": [
                    { "tableName": "hotelReviewsDocument", "generatedKeyName": "Documentid", "source": "/document/tableprojection" },
                    { "tableName": "hotelReviewsPages", "generatedKeyName": "Pagesid", "source": "/document/tableprojection/pages/*" },
                    { "tableName": "hotelReviewsKeyPhrases", "generatedKeyName": "KeyPhrasesid", "source": "/document/tableprojection/pages/*/keyphrase/*" },
                    { "tableName": "hotelReviewsSentiment", "generatedKeyName": "Sentimentid", "source": "/document/tableprojection/pages/*/sentiment/*" }
                ],
                "objects": []
            },
            {
                "tables": [
                    { 
                        "tableName": "hotelReviewsInlineDocument", "generatedKeyName": "Documentid", "sourceContext": "/document",
                        "inputs": [
                            { "name": "name", "source": "/document/name"},
                            { "name": "reviews_date", "source": "/document/reviews_date"},
                            { "name": "reviews_rating", "source": "/document/reviews_rating"},
                            { "name": "reviews_text", "source": "/document/reviews_text"},
                            { "name": "reviews_title", "source": "/document/reviews_title"},
                            { "name": "AzureSearch_DocumentKey", "source": "/document/AzureSearch_DocumentKey" }
                        ]
                    },
                    { 
                        "tableName": "hotelReviewsInlinePages", "generatedKeyName": "Pagesid", "sourceContext": "/document/reviews_text/pages/*",
                        "inputs": [
                            { "name": "SentimentScore", "source": "/document/reviews_text/pages/*/Sentiment"},
                            { "name": "LanguageCode", "source": "/document/Language"},
                            { "name": "Page", "source": "/document/reviews_text/pages/*" }
                        ]
                    },
                    { 
                        "tableName": "hotelReviewsInlineKeyPhrases", "generatedKeyName": "kpidv2", "sourceContext": "/document/reviews_text/pages/*/Keyphrases/*",
                        "inputs": [
                            { "name": "Keyphrases", "source": "/document/reviews_text/pages/*/Keyphrases/*" }
                        ]
                    }
                ],
                "objects": []
            }
        ]
    }
}
```

## 7 - Create the Indexer

The final step is to create the indexer, which actually reads the data and activates the skillset. In Postman, switch to the "Create Indexer" request and review the body. As you can see, the definition of the indexer refers to several other resources you've already created -- the datasource, the index, and the skillset. 

The `"parameters/configuration"` object controls how the indexer ingests the data. In this case, the input data are in a single document with a header line and comma-separated values. The document key is a unique identifier for the document, which before encoding is the URL of the source document. Finally, the skillset output values such as language code, sentiment, and key phrases, are mapped to their appropriate locations in the document. Notice that while there's a single value for `Language`, `Sentiment` is applied to each element in the array of `pages`. `Keyphrases` is itself an array and is also applied to each element in the `pages` array.

After you've set the `api-key` and `Content-type` headers and confirmed that the Body of the request is similar to the source code that follows, press **Send** in Postman. Postman will PUT the request to `https://{{search-service-name}}.search.windows.net/indexers/{{indexer-name}}?api-version={{api-version}}`. Azure Search will create and run the indexer. 

```json
{
    "name": "{{indexer-name}}",
    "dataSourceName": "{{datasource-name}}",
    "skillsetName": "{{skillset-name}}",
    "targetIndexName": "{{index-name}}",
    "parameters": {
        "configuration": {
            "dataToExtract": "contentAndMetadata",
            "parsingMode": "delimitedText",
            "firstLineContainsHeaders": true,
            "delimitedTextDelimiter": ","
        }
    },
    "fieldMappings": [
        {
            "sourceFieldName": "AzureSearch_DocumentKey",
            "targetFieldName": "AzureSearch_DocumentKey",
            "mappingFunction": { "name": "base64Encode" }
        }
    ],
    "outputFieldMappings": [
        { "sourceFieldName": "/document/reviews_text/pages/*/Keyphrases/*", "targetFieldName": "Keyphrases" },
        { "sourceFieldName": "/document/Language", "targetFieldName": "Language" },
        { "sourceFieldName": "/document/reviews_text/pages/*/Sentiment", "targetFieldName": "Sentiment" }
    ]
}
```

## 8 - Run the indexer 

In the Azure portal, navigate to the Search Service's **Overview** and select the **Indexers** tab. Click on the **hotels-reviews-ixr** you created in the previous step. If the indexer has not already run, press the **Run** button. The indexing task may raise some warnings relating to language recognition as the data include some reviews written in languages that are not yet supported by the cognitive skills. 

## Next steps

Now that you've enriched your data using cognitive services and projected the results into a knowledge store, you can use Storage Explorer or Power BI to explore your enriched data set.

To learn how to explore this knowledge store using Storage Explorer, see the following walkthrough.

> [!div class="nextstepaction"]
> [View with Storage Explorer](knowledge-store-view-storage-explorer.md)

To learn how to connect this knowledge store to Power BI, see the following walkthrough.

> [!div class="nextstepaction"]
> [Connect with Power BI](knowledge-store-connect-power-bi.md)

If you want to repeat this exercise or try a different AI enrichment walkthrough, delete the *hotel-reviews-idxr* indexer. Deleting the indexer resets the free daily transaction counter back to zero.
