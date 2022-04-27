---
title: "Quickstart: OCR and image analysis"
titleSuffix: Azure Cognitive Search
description: Use the Import Data wizard and AI cognitive skills to apply OCR and image analysis to identify and extract searchable text from image files.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 10/07/2021
ms.custom: mode-ui
---

# Quickstart: Apply OCR and image analysis using the Import data wizard

Learn how AI enrichment in Azure Cognitive Search adds Optical Character Recognition (OCR) and image analysis to create searchable content from image files. 

In this quickstart, you'll run the **Import data** wizard to analyze visual content in JPG files. The content consists of photographs of signs. Output is a searchable index containing captions, tags, and text identified through OCR, all of which is queryable in the portal using [Search explorer](search-explorer.md). 

To prepare, you'll create a few resources and upload sample files before running the wizard.

Prefer to start with code? Try the [.NET tutorial](cognitive-search-tutorial-blob-dotnet.md), [Python tutorial](cognitive-search-tutorial-blob-python.md), or [REST tutorial](cognitive-search-tutorial-blob-dotnet.md) instead.

## Prerequisites

Before you begin, have the following prerequisites in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ Azure Cognitive Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

+ Azure Storage account with Blob Storage. [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal) or [find an existing account](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/). 

  + Choose the same subscription if you want the wizard to find your storage account and set up the connection.
  + Choose the same region as Azure Cognitive Search to avoid bandwidth charges.
  + Choose the StorageV2 (general purpose V2).

> [!NOTE]
> This quickstart also uses [Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) for the AI. Because the workload is so small, Cognitive Services is tapped behind the scenes for free processing for up to 20 transactions. This means that you can complete this exercise without having to create an additional Cognitive Services resource.

## Set up your data

In the following steps, set up a blob container in Azure Storage to store heterogeneous content files.

1. [Download sample data](https://github.com/Azure-Samples/azure-search-sample-data) from GitHub. There are multiple data sets. Use the files in the **unsplash-images\jpg-signs** folder for this quickstart.

1. Upload the sample data to a blob container.

   1. Sign in to the [Azure portal](https://portal.azure.com/) and find your storage account.
   1. In the left navigation pane, select **Containers**.
   1. [Create a container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) named "signs". Use the default public access level.
   1. In the "signs" container, select **Upload** to upload the files from your local **unsplash-images\jpg-signs** folder.

You should have 10 files containing photographs of signs.

There is a second subfolder that includes landmark buildings. If you want to [attach a Cognitive Services key](cognitive-search-attach-cognitive-services.md), you can include these files as well to see how image analysis works over image files that do not include embedded text. The key is necessary for jobs that exceed the free allotment.

You are now ready to move on the Import data wizard.

## Run the Import data wizard

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) and on the Overview page, click **Import data** on the command bar to set up cognitive enrichment in four steps.

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command" border="true":::

### Step 1 - Create a data source

1. In **Connect to your data**, choose **Azure Blob Storage**. Choose an existing connection to the storage account and container you created. Give the data source a name, and use default values for the rest. 

   :::image type="content" source="media/cognitive-search-quickstart-blob/connect-to-signs.png" alt-text="Azure blob configuration" border="true":::

### Step 2 - Add cognitive skills

Next, configure AI enrichment to invoke OCR and image analysis. 

1. For this quickstart, we are using the **Free** Cognitive Services resource. The sample data consists of 19 files, so the daily, per-indexer allotment of 20 free transactions on Cognitive Services is sufficient for this quickstart. 

   :::image type="content" source="media/cognitive-search-quickstart-blob/free-enrichments.png" alt-text="Attach free Cognitive Services processing" border="true":::

1. In the same page, expand **Add enrichments** and make tree selections:

   Enable OCR and merge all text into merged_content field.

   Choose "Generate tags from images" and "Generate captions from images".

   :::image type="content" source="media/cognitive-search-quickstart-blob/select-ocr-image-enrichments.png" alt-text="Attach Cognitive Services select services for skillset" border="true":::

   For image analysis, images are split from text during document cracking. The "merged_content" field re-associates text and images in the AI enrichment pipeline.

### Step 3 - Configure the index

An index contains your searchable content and the **Import data** wizard can usually infer the schema for you by sampling the data. In this step, review the generated schema and potentially revise any settings. Below is the default schema created for the demo data set.

For this quickstart, the wizard does a good job setting reasonable defaults:  

+ Default fields are based on properties for existing blobs plus new fields to contain enrichment output (for example, `text`, `layoutText`, `imageCaption`). Data types are inferred from metadata and by data sampling.

+ Default document key is *metadata_storage_path* (selected because the field contains unique values).

+ Default attributes are **Retrievable** and **Searchable**. **Searchable** allows full text search a field. **Retrievable** means field values can be returned in results. The wizard assumes you want these fields to be retrievable and searchable because you created them via a skillset.

  :::image type="content" source="media/cognitive-search-quickstart-blob/index-fields-ocr-images.png" alt-text="Index fields" border="true":::

Marking a field as **Retrievable** does not mean that the field *must* be present in the search results. You can precisely control search results composition by using the **$select** query parameter to specify which fields to include. For text-heavy fields like `content`, the **$select** parameter is your solution for shaping manageable search results to the human users of your application, while ensuring client code has access to all the information it needs via the **Retrievable** attribute.

### Step 4 - Configure the indexer

The indexer is a high-level resource that drives the indexing process. It specifies the data source name, a target index, and frequency of execution. The **Import data** wizard creates several objects, and of them is always an indexer that you can run repeatedly.

1. In the **Indexer** page, you can accept the default name and click the **Once** schedule option to run it immediately. 

   :::image type="content" source="media/cognitive-search-quickstart-blob/indexer-signs.png" alt-text="Indexer definition" border="true":::

1. Click **Submit** to create and simultaneously run the indexer.

## Monitor status

Cognitive skills indexing takes longer to complete than typical text-based indexing. To monitor progress, go to the Overview page and select the **Indexers** tab in the middle of page.

  :::image type="content" source="media/cognitive-search-quickstart-blob/indexer-status-signs.png" alt-text="Indexer status" border="true":::

To check details about execution status, select an indexer from the list.

## Query in Search explorer

After an index is created, you can run queries to return results. In the portal, use **Search explorer** for this task. 

1. On the search service dashboard page, click **Search explorer** on the command bar.

1. Select **Change Index** at the top to select the index you created.

1. In Query string, enter a search string to query the index, such as `search=sign&searchFields=imageTags&$select=text,imageCaption,imageTags&$count=true`, and then select **Search**.

   :::image type="content" source="media/cognitive-search-quickstart-blob/search-explorer-query-string-signs.png" alt-text="Query string in search explorer" border="true":::

Results are returned as JSON, which can be verbose and hard to read, especially in large documents originating from Azure blobs. Some tips for searching in this tool include the following techniques:

+ Append `$select` to specify which fields to include in results.
+ Append `searchField` to scope full text search to specific fields.
+ Use CTRL-F to search within the JSON for specific properties or terms.

  :::image type="content" source="media/cognitive-search-quickstart-blob/search-explorer-results-signs.png" alt-text="Search explorer example" border="true":::

Query strings are case-sensitive so if you get an "unknown field" message, check **Fields** or **Index Definition (JSON)** to verify name and case. 

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

Cognitive Search has other built-in skills that can be exercised in the Import data wizard. The next quickstart uses entity recognition, language detection, and text translation. 

> [!div class="nextstepaction"]
> [Quickstart: Translate text and recognize entities using the Import data wizard](cognitive-search-quickstart-blob.md)
