---
title: Create a knowledge store using REST
titleSuffix: Azure Cognitive Search
description: Use the REST API and Postman to create an Azure Cognitive Search knowledge store for persisting enrichments from an AI enrichment pipeline.

author: lobrien
manager: nitinme
ms.author: laobri
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 11/04/2019
---
# Create an Azure Cognitive Search knowledge store by using REST

The knowledge store feature in Azure Cognitive Search persists output from an AI enrichment pipeline for later analysis or other downstream processing. An AI-enriched pipeline accepts image files or unstructured text files, indexes them by using Azure Cognitive Search, applies AI enrichments from Azure Cognitive Services (such as image analysis and natural language processing), and then saves the results to a knowledge store in Azure Storage. You can use tools like Power BI or Storage Explorer in the Azure portal to explore the knowledge store.

In this article, you use the REST API interface to ingest, index, and apply AI enrichments to a set of hotel reviews. The hotel reviews are imported into Azure Blob storage. The results are saved as a knowledge store in Azure Table storage.

After you create the knowledge store, you can learn about how to access the knowledge store by using [Storage Explorer](knowledge-store-view-storage-explorer.md) or [Power BI](knowledge-store-connect-power-bi.md).

## Create services

Create the following services:

- Create an [Azure Cognitive Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) in your current subscription. You can use a free service for this tutorial.

- Create an [Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) to store the sample data and the knowledge store. Your storage account must use the same location (such as US-West) for your Azure Cognitive Search service. The value for **Account kind** must be **StorageV2 (general purpose V2)** (default) or **Storage (general purpose V1)**.

- Recommended: Get the [Postman desktop app](https://www.getpostman.com/) for sending requests to Azure Cognitive Search. You can use the REST API with any tool that's capable of working with HTTP requests and responses. Postman is a good choice for exploring REST APIs. We use Postman in this article. Also, the [source code](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/knowledge-store) for this article includes a Postman collection of requests. 

## Store the data

Load the hotel reviews CSV file into Azure Blob storage so it can be accessed by an Azure Cognitive Search indexer and fed through the AI enrichment pipeline.

### Create a blob container by using the data

1. Download the [hotel review data](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D) saved in a CSV file (HotelReviews_Free.csv). This data originates from Kaggle.com and contains customer feedback about hotels.
1. Sign in to the [Azure portal](https://portal.azure.com) and go to your Azure storage account.
1. Create a [blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal). To create the container, in the left menu for your storage account, select **Blobs**, and then select **Container**.
1. For the new container **Name**, enter **hotel-reviews**.
1. For **Public Access Level**, select any value. We used the default.
1. Select **OK** to create the blob container.
1. Open the new **hotels-review** container, select **Upload**, and then select the HotelReviews-Free.csv file you downloaded in the first step.

    ![Upload the data](media/knowledge-store-create-portal/upload-command-bar.png "Upload the hotel reviews")

1. Select **Upload** to import the CSV file into Azure Blob storage. The new container is shown:

    ![Create the blob container](media/knowledge-store-create-portal/hotel-reviews-blob-container.png "Create the blob container")

## Configure Postman

Install and set up Postman.

### Download and install Postman

1. Download the [Postman collection source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/knowledge-store/KnowledgeStore.postman_collection.json).
1. Select **File** > **Import** to import the source code into Postman.
1. Select the **Collections** tab, and then select the **...** (ellipsis) button.
1. Select **Edit**. 
   
   ![Postman app showing navigation](media/knowledge-store-create-rest/postman-edit-menu.png "Go to the Edit menu in Postman")
1. In the **Edit** dialog box, select the **Variables** tab. 

On the **Variables** tab, you can add values that Postman swaps in every time it encounters a specific variable inside double braces. For example, Postman replaces the symbol `{{admin-key}}` with the current value that you set for `admin-key`. Postman makes the substitution in URLs, headers, the request body, and so on. 

To get the value for `admin-key`, go to the Azure Cognitive Search service and select the **Keys** tab. Change `search-service-name` and `storage-account-name` to the values you chose in [Create services](#create-services). Set `storage-connection-string` by using the value on the storage account's **Access Keys** tab. You can leave the defaults for the other values.

![Postman app variables tab](media/knowledge-store-create-rest/postman-variables-window.png "Postman's variables window")


| Variable    | Where to get it |
|-------------|-----------------|
| `admin-key` | On the **Keys** page of the Azure Cognitive Search service.  |
| `api-version` | Leave as **2019-05-06-Preview**. |
| `datasource-name` | Leave as **hotel-reviews-ds**. | 
| `indexer-name` | Leave as **hotel-reviews-ixr**. | 
| `index-name` | Leave as **hotel-reviews-ix**. | 
| `search-service-name` | The name of the Azure Cognitive Search service. The URL is `https://{{search-service-name}}.search.windows.net`. | 
| `skillset-name` | Leave as **hotel-reviews-ss**. | 
| `storage-account-name` | The storage account name. | 
| `storage-connection-string` | In the storage account, on the **Access Keys** tab, select **key1** > **Connection string**. | 
| `storage-container-name` | Leave as **hotel-reviews**. | 

### Review the request collection in Postman

When you create a knowledge store, you must issue four HTTP requests: 

- **PUT request to create the index**: This index holds the data that Azure Cognitive Search uses and returns.
- **POST request to create the datasource**: This datasource connects your Azure Cognitive Search behavior to the data and knowledge store's storage account. 
- **PUT request to create the skillset**: The skillset specifies the enrichments that are applied to your data and the structure of the knowledge store.
- **PUT request to create the indexer**: Running the indexer reads the data, applies the skillset, and stores the results. You must run this request last.

The [source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/knowledge-store/KnowledgeStore.postman_collection.json) contains a Postman collection that has the four requests. To issue the requests, in Postman, select the tab for the request. Then, add `api-key` and `Content-Type` request headers. Set the value of `api-key` to `{{admin-key}}`. Set the value `Content-type` to `application/json`. 

![Screenshot showing Postman's interface for headers](media/knowledge-store-create-rest/postman-headers-ui.png)

> [!Note]
> You must set `api-key` and `Content-type` headers in all your requests. If Postman recognizes a variable, the variable appears in 
> orange text, as with `{{admin-key}}` in the preceding screenshot. If the variable is misspelled, it appears in red text.
>

## Create an Azure Cognitive Search index

Create an Azure Cognitive Search index to represent the data that you're interested in searching, filtering, and applying enhancements to. Create the index by issuing a PUT request to `https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}?api-version={{api-version}}`. Postman replaces symbols that are enclosed in double braces (such as `{{search-service-name}}`, `{{index-name}}`, and `{{api-version}}`) with the values that you set in [Configure Postman](#configure-postman). If you use a different tool to issue your REST commands, you must substitute those variables yourself.

Set the structure of your Azure Cognitive Search index in the body of the request. In Postman, after you set the `api-key` and `Content-type` headers, go to the **Body** pane of the request. You should see the following JSON. If you don't, select **Raw** > **JSON (application/json)**, and then paste the following code as the body:

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

This index definition is a combination of data that you'd like to present to the user (the name of the hotel, review content, the date), search metadata, and AI enhancement data (Sentiment, Keyphrases, and Language).

Select **Send** to issue the PUT request. You should see the status `201 - Created`. If you see a different status, in the **Body** pane, look for a JSON response that contains an error message. 

## Create the datasource

Next, connect Azure Cognitive Search to the hotel data you stored in [Store the data](#store-the-data). To create the datasource, send a POST request to `https://{{search-service-name}}.search.windows.net/datasources?api-version={{api-version}}`. You must set the `api-key` and `Content-Type` headers as discussed earlier. 

In Postman, go to the **Create Datasource** request, and then to the **Body** pane. You should see the following code:

```json
{
  "name" : "{{datasource-name}}",
  "description" : "Demo files to demonstrate knowledge store capabilities.",
  "type" : "azureblob",
  "credentials" : { "connectionString" : "{{storage-connection-string}}" },
  "container" : { "name" : "{{storage-container-name}}" }
}
```

Select **Send** to issue the POST request. 

## Create the skillset 

The next step is to specify the skillset, which specifies both the enhancements to be applied and the knowledge store where the results will be stored. In Postman, select the **Create the Skillset** tab. This request sends a PUT to `https://{{search-service-name}}.search.windows.net/skillsets/{{skillset-name}}?api-version={{api-version}}`. Set the `api-key` and `Content-type` headers as you did earlier. 

There are two large top-level objects: `skills` and `knowledgeStore`. Each object inside the `skills` object is an enrichment service. Each enrichment service has `inputs` and `outputs`. The `LanguageDetectionSkill` has an output `targetName` of `Language`. The value of this node is used by most of the other skills as an input. The source is `document/Language`. The capability of using the output of one node as the input to another is even more evident in `ShaperSkill`, which specifies how the data flows into the tables of the knowledge store.

The `knowledge_store` object connects to the storage account via the `{{storage-connection-string}}` Postman variable. `knowledge_store` contains a set of mappings between the enhanced document and tables and columns in the knowledge store. 

To generate the skillset, select the **Send** button in Postman to PUT the request:

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

## Create the indexer

The final step is to create the indexer. The indexer reads the data and activates the skillset. In Postman, select the **Create Indexer** request, and then review the body. The definition of the indexer refers to several other resources that you already created: the datasource, the index, and the skillset. 

The `parameters/configuration` object controls how the indexer ingests the data. In this case, the input data is in a single document that has a header line and comma-separated values. The document key is a unique identifier for the document. Before encoding, the document key is the URL of the source document. Finally, the skillset output values, like language code, sentiment, and key phrases, are mapped to their locations in the document. Although there's a single value for `Language`, `Sentiment` is applied to each element in the array of `pages`. `Keyphrases` is an array that's also applied to each element in the `pages` array.

After you set the `api-key` and `Content-type` headers and confirm that the body of the request is similar to the following source code, select **Send** in Postman. Postman sends a PUT request to `https://{{search-service-name}}.search.windows.net/indexers/{{indexer-name}}?api-version={{api-version}}`. Azure Cognitive Search creates and runs the indexer. 

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

## Run the indexer 

In the Azure portal, go to the Azure Cognitive Search service's **Overview** page. Select the **Indexers** tab, and then select **hotels-reviews-ixr**. If the indexer hasn't already run, select **Run**. The indexing task might raise some warnings related to language recognition. The data includes some reviews that are written in languages that aren't yet supported by the cognitive skills. 

## Next steps

Now that you've enriched your data by using Cognitive Services and projected the results to a knowledge store, you can use Storage Explorer or Power BI to explore your enriched data set.

To learn how to explore this knowledge store by using Storage Explorer, see this walkthrough:

> [!div class="nextstepaction"]
> [View with Storage Explorer](knowledge-store-view-storage-explorer.md)

To learn how to connect this knowledge store to Power BI, see this walkthrough:

> [!div class="nextstepaction"]
> [Connect with Power BI](knowledge-store-connect-power-bi.md)

If you want to repeat this exercise or try a different AI enrichment walkthrough, delete the **hotel-reviews-idxr** indexer. Deleting the indexer resets the free daily transaction counter to zero.
