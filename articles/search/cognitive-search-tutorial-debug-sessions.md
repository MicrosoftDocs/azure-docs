---
title: 'Tutorial: Debug skillsets'
titleSuffix: Azure AI Search
description: Practice creating and completing a debug session on an Azure AI Search skillset. This tutorial provides a buggy sample skillset that you resolve in a debug session.

author: HeidiSteen
ms.author: heidist
manager: nitinme
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: tutorial
ms.date: 08/20/2024
---

# Tutorial: Fix a skillset using Debug Sessions

In Azure AI Search, a skillset coordinates the actions of skills that analyze, transform, or create searchable content. Frequently, the output of one skill becomes the input of another. When inputs depend on outputs, mistakes in skillset definitions and field associations can result in missed operations and data.

**Debug Sessions** is an Azure portal tool that provides a holistic visualization of a skillset that executes on Azure AI Search. Using this tool, you can drill down to specific steps to easily see where an action might be falling down.

In this article, use **Debug Sessions** to find and fix missing inputs and outputs. The tutorial is all-inclusive. It provides sample data, a REST file that creates objects, and instructions for debugging problems in the skillset.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

+ Azure AI Search. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial. The free tier doesn't provide managed identity support for an Azure AI Search service. You must use keys for connections to Azure Storage.

+ Azure Storage account with [Blob storage](../storage/blobs/index.yml), used for hosting sample data, and for persisting cached data created during a debug session. If you're using a free search service, the storage account must have shared access keys enabled and it must allow public network access.

+ [Visual Studio Code](https://code.visualstudio.com/download) with a [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

+ [Sample PDFs (clinical trials)](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/_ARCHIVE/clinical-trials/clinical-trials-pdf-19).

+ [Sample debug-sessions.rest file](https://github.com/Azure-Samples/azure-search-rest-samples/blob/main/Debug-sessions/debug-sessions.rest) used to create the enrichment pipeline.

> [!NOTE]
> This tutorial also uses [Azure AI services](https://azure.microsoft.com/services/cognitive-services/) for language detection, entity recognition, and key phrase extraction. Because the workload is so small, Azure AI services is tapped behind the scenes for free processing for up to 20 transactions. This means that you can complete this exercise without having to create a billable Azure AI services resource.

## Set up the sample data

This section creates the sample data set in Azure Blob Storage so that the indexer and skillset have content to work with.

1. [Download sample data (clinical-trials-pdf-19)](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/_ARCHIVE/clinical-trials/clinical-trials-pdf-19), consisting of 19 files.

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal) or [find an existing account](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/). 

   + Choose the same region as Azure AI Search to avoid bandwidth charges.

   + Choose the StorageV2 (general purpose V2) account type.

1. Navigate to the Azure Storage services pages in the portal and create a Blob container. Best practice is to specify the access level "private". Name your container `clinicaltrialdataset`.

1. In container, select **Upload** to upload the sample files you downloaded and unzipped in the first step.

1. While in the portal, copy the connection string for Azure Storage. You can get the connection string from **Settings** > **Access Keys** in the portal.

## Copy a key and URL

This tutorial uses API keys for authentication and authorization. You need the search service endpoint and an API key, which you can get from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com), navigate to the **Overview** page, and copy the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. Under **Settings** > **Keys**, copy an admin key. Admin keys are used to add, modify, and delete objects. There are two interchangeable admin keys. Copy either one.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Screenshot of the URL and API keys in the Azure portal.":::

A valid API key establishes trust, on a per request basis, between the application sending the request and the search service handling it.

## Create data source, skillset, index, and indexer

In this section, create a "buggy" workflow that you can fix in this tutorial. 

1. Start Visual Studio Code and open the `debug-sessions.rest` file.

1. Provide the following variables: search service URL, search services admin API key, storage connection string, and the name of the blob container storing the PDFs.

1. Send each request in turn. Creating the indexer takes several minutes to complete.

1. Close the file.

## Check results in the portal

The sample code intentionally creates a buggy index as a consequence of problems that occurred during skillset execution. The problem is that the index is missing data. 

1. In Azure portal, on the search service **Overview** page, select the **Indexes** tab. 

1. Select *clinical-trials*.

1. Enter this JSON query string in Search explorer's JSON view. It returns fields for specific documents (identified by the unique `metadata_storage_path` field).

   ```json
   "search": "*",
   "select": "metadata_storage_path, organizations, locations",
   "count": true
    ```

1. Run the query. You should see empty values for `organizations` and `locations`.

    These fields should have been populated through the skillset's [Entity Recognition skill](cognitive-search-skill-entity-recognition-v3.md), used to detect organizations and locations anywhere within the blob's content. In the next exercise, you'll debug the skillset to determine what went wrong.

Another way to investigate errors and warnings is through the Azure portal.

1. Open the **Indexers** tab and select *clinical-trials-idxr*.

   Notice that while the indexer job succeeded overall, there were warnings.

1. Select **Success** to view the warnings (if there were mostly errors, the detail link would be **Failed**). You'll see a long list of every warning emitted by the indexer.

   :::image type="content" source="media/cognitive-search-debug/portal-indexer-errors-warnings.png" alt-text="Screenshot of view warnings." :::

## Start your debug session

1. From the search service left-navigation pane, under **Search management**, select **Debug sessions**.

1. Select **+ Add Debug Session**.

1. Give the session a name. 

1. In Indexer template, provide the indexer name. The indexer has references to the data source, the skillset, and index.

1. Select the storage account.

1. **Save** the session. 

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-create-session.png" lightbox="media/cognitive-search-debug/debug-tutorial-create-session.png" alt-text="Screenshot of Debug session definition page." :::
  
1. A debug session opens to the settings page. You can make modifications to the initial configuration and override any defaults. A debug session only works with a single document. The default is to accept the first document in the collection as the basis of your debug sessions. You can [choose a specific document to debug](cognitive-search-how-to-debug-skillset.md#create-a-debug-session) by providing its URI in Azure Storage.

1. When the debug session has finished initializing, you should see a skills workflow with mappings and a search index. The enriched document data structure appears in a details pane on the side. We excluded it from the following screenshot so that you could see more of the workflow.

   :::image type="content" source="media/cognitive-search-debug/debug-execution-complete1.png" lightbox="media/cognitive-search-debug/debug-execution-complete1.png" alt-text="Screenshot of Debug Session visual editor." :::

## Find issues with the skillset

Any issues reported by the indexer are indicated as **Errors** and **Warnings**.

Notice that the number of errors and warning is a much smaller list than the one displayed earlier because this list is only detailing the errors for a single document. Like the list displayed by the indexer, you can select on a warning message and see the details of this warning.

Select **Warnings** to review the notifications. You should see four:

+ "Could not execute skill because one or more skill inputs were invalid. Required skill input is missing. Name: 'text', Source: '/document/content'."

+ "Could not map output field 'locations' to search index. Check the 'outputFieldMappings' property of your indexer.
Missing value '/document/merged_content/locations'."

+ "Could not map output field 'organizations' to search index. Check the 'outputFieldMappings' property of your indexer.
Missing value '/document/merged_content/organizations'."

+ "Skill executed but may have unexpected results because one or more skill inputs were invalid.
Optional skill input is missing. Name: 'languageCode', Source: '/document/languageCode'. Expression language parsing issues: Missing value '/document/languageCode'."

Many skills have a "languageCode" parameter. By inspecting the operation, you can see that this language code input is missing from the `EntityRecognitionSkill.#1`, which is the same entity recognition skill that is having trouble with 'locations' and 'organizations' output. 

Because all four notifications are about this skill, your next step is to debug this skill. If possible, start by solving input issues first before moving on to output issues.

## Fix missing skill input values

1. On the work surface, select the skill that's reporting the warnings. In this tutorial, it's the entity recognition skill.

1. The Skill details pane opens to the right with sections for iterations and their respective inputs and outputs, skill settings for the JSON definition of the skill, and messages for any errors and warnings that this skill is emitting.

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-skill-detail.png" alt-text="Screenshot of the skill details pane.":::

1. Hover over each input (or select an input) to show the values in the **Expression evaluator**. Notice that the displayed result for this input doesn’t look like a text input. It looks like a series of new line characters `\n \n\n\n\n` instead of text. The lack of text means that no entities can be identified, so either this document fails to meet the prerequisites of the skill, or there's another input that should be used instead.

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-skill-input-null.png" alt-text="Screenshot of skill input showing null values.":::

1. Switch back to **Enriched data structure** and review the enrichment nodes for this document. Notice the `\n \n\n\n\n` for "content" has no originating source, but another value for "merged_content" has OCR output. Although there's no indication, the content of this PDF appears to be a JPEG file, as evidenced by the extracted and processed text in "merged_content".

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-enriched-document-merged-content.png" alt-text="Screenshot of Enriched Data Structure." :::

1. Switch back to the skill and select **Skillset settings** to open the JSON definition.

1. Change the expression from `/document/content` to `/document/merged_content`, and then select **Save**. Notice that the warning is no longer listed.

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-edit-skill.png" alt-text="Screenshot of Expression Evaluator for fixed merged_content input." :::

1. Select **Run** in the session's window menu. This kicks off another execution of the skillset using the document. 

1. Once the debug session execution completes, notice that the warnings count has reduced by one. Warnings show that the error for text input is gone, but the other warnings remain. The next step is to address the warning about the missing or empty value `/document/languageCode`.

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-three-warnings.png" alt-text="Screenshot of updated errors and warnings.":::

1. Select the skill and hover over `/document/languageCode`. The value for this input is null, which isn't a valid input.

1. As with the previous issue, start by reviewing the **Enriched data structure** for evidence of its nodes. Notice that there's no "languageCode" node, but there's one for "language". So, there's a typo in the skill settings. 

1. Copy the expression `/document/language`.

1. In the Skill details pane, select **Skill Settings** for the #1 skill and paste the new value, `/document/language`.

1. Select **Save**.

1. Select **Run**.

1. After the debug session execution completes, you can check the results in the Skills detail pane. When you hover over `/document/language`, you should see `en` as the value in the **Expression evaluator**.

Notice that the input warnings are gone. There now remain just the two warnings about output fields for organizations and locations.

## Fix missing skill output values

The messages say to check the 'outputFieldMappings' property of your indexer, so lets start there.

1. Select **Output Field Mappings** on the work surface. Notice that the output field mappings are missing.

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-no-output-mappings.png" alt-text="Screenshot of the output field mappings.":::

1. As a first step, confirm that the search index has the expected fields. In this case, the index has fields for "locations" and "organizations".

1. If there's no problem with the index, the next step is to check skill outputs. As before, select the **Enriched data structure**, and scroll the nodes to find "locations" and "organizations". Notice that the parent is "content" instead of "merged_content". The context is wrong.

1. Switch back to Skills detail pane for the entity recognition skill.

1. In **Skill Settings**, change `context` to `document/merged_content`. At this point, you should have three modifications to the skill definition altogether.

   :::image type="content" source="media/cognitive-search-debug/debug-tutorial-skill-fixes-all.png" alt-text="Screenshot of the skill definition with all modifications indicated.":::

1. Select **Save**.

1. Select **Run**.

All of the errors have been resolved.

## Commit changes to the skillset

When the debug session was initiated, the search service created a copy of the skillset. This was done to protect the original skillset on your search service. Now that you have finished debugging your skillset, the fixes can be committed (overwrite the original skillset). 

Alternatively, if you aren't ready to commit changes, you can save the debug session and reopen it later.

1. Select **Commit changes** in the main Debug sessions menu.

1. Select **OK** to confirm that you wish to update your skillset.

1. Close Debug session and open **Indexers** from the left navigation pane.

1. Select 'clinical-trials-idxr'.

1. Select **Reset**.

1. Select **Run**.

1. Select **Refresh** to show the status of the reset and run commands.

When the indexer has finished running, there should be a green checkmark and the word Success next to the time stamp for the latest run in the **Execution history** tab. To ensure that the changes have been applied:

1. In the left navigation pane, open **Indexes**.

1. Select 'clinical-trials' index and in the Search explorer tab, enter this query string: `$select=metadata_storage_path, organizations, locations&$count=true` to return fields for specific documents (identified by the unique `metadata_storage_path` field).

1. Select **Search**.

The results should show that organizations and locations are now populated with the expected values.

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

The free service is limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

This tutorial touched on various aspects of skillset definition and processing. To learn more about concepts and workflows, refer to the following articles:

+ [How to map skillset output fields to fields in a search index](cognitive-search-output-field-mapping.md)

+ [Skillsets in Azure AI Search](cognitive-search-working-with-skillsets.md)

+ [How to configure caching for incremental enrichment](cognitive-search-incremental-indexing-conceptual.md)
