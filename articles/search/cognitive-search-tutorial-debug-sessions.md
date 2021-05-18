---
title: "Tutorial: Use Debug Sessions to fix skillsets"
titleSuffix: Azure Cognitive Search
description: Debug sessions (preview) is an Azure portal tool used to find, diagnose, and repair problems in a skillset.

author: HeidiSteen
ms.author: heidist
manager: nitinme

ms.service: cognitive-search
ms.topic: tutorial
ms.date: 02/02/2021
---

# Tutorial: Debug a skillset using Debug Sessions

Skillsets coordinate a series of actions that analyze or transform content, where the output of one skill becomes the input of another. When inputs depend on outputs, mistakes in skillset definitions and field associations can result in missed operations and data.

**Debug sessions** in the Azure portal provides a holistic visualization of a skillset. Using this tool, you can drill down to specific steps to easily see where an action might be falling down.

In this article, you'll use **Debug sessions** to find and fix 1) a missing input, and 2) output field mappings. The tutorial is all-inclusive. It provides data for you to index (clinical trials data), a Postman collection that creates objects, and instructions for using **Debug sessions** to find and fix problems in the skillset.

> [!Important]
> Debug sessions is a preview feature provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>

## Prerequisites

Before you begin, have the following prerequisites in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure Cognitive Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

+ An Azure Storage account with [Blob storage](../storage/blobs/index.yml), used for hosting sample data, and for persisting temporary data created during a debug session.

+ [Postman desktop app](https://www.getpostman.com/) and a [Postman collection](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/Debug-sessions) to create objects using the REST APIs.

+ [Sample data (clinical trials)](https://github.com/Azure-Samples/azure-search-sample-data/tree/master/clinical-trials-pdf-19).

> [!NOTE]
> This quickstart also uses [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) for the AI. Because the workload is so small, Cognitive Services is tapped behind the scenes for free processing for up to 20 transactions. This means that you can complete this exercise without having to create an additional Cognitive Services resource.

## Set up your data

This section creates the sample data set in Azure blob storage so that the indexer and skillset have content to work with.

1. [Download sample data (clinical-trials-pdf-19)](https://github.com/Azure-Samples/azure-search-sample-data/tree/master/clinical-trials-pdf-19), consisting of 19 files.

1. [Create an Azure storage account](../storage/common/storage-account-create.md?tabs=azure-portal) or [find an existing account](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/). 

   + Choose the same region as Azure Cognitive Search to avoid bandwidth charges.

   + Choose the StorageV2 (general purpose V2) account type.

1. Navigate to the Azure Storage services pages in the portal and create a Blob container. Best practice is to specify the access level "private". Name your container `clinicaltrialdataset`.

1. In container, click **Upload** to upload the sample files you downloaded and unzipped in the first step.

1. While in the portal, get and save off the connection string for Azure Storage. You'll need it for the REST API calls that index data. You can get the connection string from **Settings** > **Access Keys** in the portal.

## Get a key and URL

REST calls require the service URL and an access key on every request. A search service is created with both, so if you added Azure Cognitive Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Get an HTTP endpoint and access key" border="false":::

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## Create data source, skillset, index, and indexer

In this section, Postman and a provided collection are used to create the Cognitive Search data source, skillset, index, and indexer. If you're unfamiliar with Postman, see [this quickstart](search-get-started-rest.md).

You will need the [Postman collection](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/Debug-sessions) created for this tutorial to complete this task. 

1. Start Postman and import the collection. Under **Files** > **New**, select the collection to import.
1. After the collection is imported, expand the actions list (...).
1. Click **Edit**.
1. Under Current Value, enter the name of your `searchService` (for example, if the endpoint is `https://mydemo.search.windows.net`, then the service name is "`mydemo`").
1. Enter the `apiKey` with either the primary or secondary key of your search service.
1. Enter the `storageConnectionString` from the keys page of your Azure Storage account.
1. Enter the `containerName` for the container you created in the storage account, and then click **Update**.

   :::image type="content" source="media/cognitive-search-debug/postman-enter-variables.png" alt-text="edit variables in Postman":::

The collection contains four different REST calls that are used to create objects used in this tutorial.

The first call creates the data source. `clinical-trials-ds`. The second call creates the skillset, `clinical-trials-ss`. The third call creates the index, `clinical-trials`. The fourth and final call creates the indexer, `clinical-trials-idxr`.

+ Open each request in turn, and click **Send** to send each request to the search service. 

After  all of the calls in the collection have been completed, close Postman and return to the Azure portal.

## Check results in the portal

The sample code intentionally creates a buggy index as a consequence of problems that occurred during skillset execution. The problem is missing data. 

1. In Azure portal, on the search service Overview page, select the **Indexes** tab. 
1. Select the `clinical-trials` index.
1. Enter this query string: `$select=metadata_storage_path, organizations, locations&$count=true` to return fields for specific documents (identified by the unique `metadata_storage_path` field).
1. Click **Search** to run the query, returning all 19 documents, showing empty values for "organizations" and "locations".

These fields should have been populated through the skillset's [Entity Recognition skill](cognitive-search-skill-entity-recognition.md), used to find organizations and locations anywhere within the blob's content. In the next exercise, you'll use Debug session to determine what went wrong.

Another way to investigate errors and warnings is through the Azure portal.

1. Open the **Indexers** tab and select `clinical-trials-idxr`.
1. Notice that while the indexer job succeeded overall, there were 57 warnings.
1. Click **Success** to view the warnings (if there were mostly errors, the detail link would be **Failed**). You'll see a long list of every warning emitted by the indexer.

   :::image type="content" source="media/cognitive-search-debug/portal-indexer-errors-warnings.png" alt-text="view warnings":::

## Start your debug session

:::image type="content" source="media/cognitive-search-debug/new-debug-session-screen-required.png" alt-text="start a new debug session":::

1. From the search overview page, click the **Debug sessions** tab.
1. Select **+ New Debug Session**.
1. Give the session a name. 
1. Connect the session to your storage account. 
1. In Indexer template, provide the indexer name. The indexer has references to the data source, the skillset, and index.
1. Accept the default document choice for the first document in the collection. 
1. **Save** the session. Saving the session will kick off the AI enrichment pipeline as defined by the skillset.

> [!Important]
> A debug session only works with a single document. You can choose which document to debug, or just use the first one.

<!-- > :::image type="content" source="media/cognitive-search-debug/debug-execution-complete1.png" alt-text="New debug session started"::: -->

When the debug session has finished initializing, the session defaults to the **AI Enrichments** tab, highlighting the **Skill Graph**. The Skill Graph provides a visual hierarchy of the skillset and its order of execution sequentially and in parallel.

## Find issues with the skillset

Any issues reported by the indexer can be found in the adjacent **Errors/Warnings** tab. 

Notice that the **Errors/Warnings** tab will provide a much smaller list than the one displayed earlier because this list is only detailing the errors for a single document. Like the list displayed by the indexer, you can click on a warning message and see the details of this warning.

Select **Errors/Warnings** to review the notifications. You should see three:

   + "Could not map output field 'locations' to search index. Check the 'outputFieldMappings' property of your indexer.
Missing value '/document/merged_content/locations'."

   + "Could not map output field 'organizations' to search index. Check the 'outputFieldMappings' property of your indexer.
Missing value '/document/merged_content/organizations'."

   + "Skill executed but may have unexpected results because one or more skill inputs was invalid.
Optional skill input is missing. Name: 'languageCode', Source: '/document/languageCode'. Expression language parsing issues: Missing value '/document/languageCode'."

   Many skills have a 'languageCode' parameter. By inspecting the operation, you can see that this language code input is missing from the `Enrichment.NerSkillV2.#1`, which is the same Entity Recognition skill that is having trouble with 'locations' and 'organizations' output. 

Because all three notifications are about this skill, your next step is to debug this skill. If possible, start by solving input issues first before moving on to outputFieldMapping issues.

 :::image type="content" source="media/cognitive-search-debug/debug-session-errors-warnings.png" alt-text="New debug session started":::

<!-- + The Skill Graph provides a visual hierarchy of the skillset and its order of execution from top to bottom. Skills that are side by side in the graph are executed in parallel. Color coding of skills in the graph indicate the types of skills that are being executed in the skillset. In the example, the green skills are text and the red skill is vision. Clicking on an individual skill in the graph will display the details of that instance of the skill in the right pane of the session window. The skill settings, a JSON editor, execution details, and errors/warnings are all available for review and editing.

+ The Enriched Data Structure details the nodes in the enrichment tree generated by the skills from the source document's contents. -->

## Fix missing skill input value

In the **Errors/Warnings** tab, there is an error for an operation labeled `Enrichment.NerSkillV2.#1`. The detail of this error explains that there is a problem with a skill input value '/document/languageCode'. 

1. Return to the **AI Enrichments** tab.
1. Click on the **Skill Graph**.
1. Click on the skill labeled **#1** to display its details in the right pane.
1. Locate the input for "languageCode".
1. Select the **</>** symbol at the beginning of the line and open the Expression Evaluator.
1. Click the **Evaluate** button to confirm that this expression is resulting in an error. It will confirm that the "languageCode" property is not a valid input.

   :::image type="content" source="media/cognitive-search-debug/expression-evaluator-language.png" alt-text="Expression Evaluator":::

There are two ways to research this error in the session. The first is to look at where the input is coming from - what skill in the hierarchy is supposed to produce this result? The Executions tab in the skill details pane should display the source of the input. If there is no source, this indicates a field mapping error.

1. Click the **Executions** tab.
1. Look at the INPUTS and find "languageCode". There is no source for this input listed. 
1. Switch the left pane to display the Enriched Data Structure. There is no mapped path corresponding to "languageCode".

   :::image type="content" source="media/cognitive-search-debug/enriched-data-structure-language.png" alt-text="Enriched Data Structure":::

There is a mapped path for "language." So, there is a typo in the skill settings. To fix this expression in the #1 skill with the expression '/document/language' will need to be updated.

1. Open the Expression Evaluator **</>** for the path "language."
1. Copy the expression. Close the window.
1. Go to the Skill Settings for the #1 skill and open the Expression Evaluator **</>** for the input "languageCode."
1. Paste the new value, '/document/language' into the Expression box and click **Evaluate**.
1. It should display the correct input "en". Click Apply to update the expression.
1. Click **Save** in the right, skill details pane.
1. Click **Run** in the session's window menu. This will kick off another execution of the skillset using the document. 

Once the debug session execution completes, click the Errors/Warnings tab and it will show that the error labeled "Enrichment.NerSkillV2.#1" is gone. However, there are still two warnings that the service could not map output fields for organizations and locations to the search index. There are missing values: '/document/merged_content/organizations' and '/document/merged_content/locations'.

## Fix missing skill output values

:::image type="content" source="media/cognitive-search-debug/warnings-missing-value-locations-organizations.png" alt-text="Errors and warnings":::

There are missing output values from a skill. To identify the skill with the error go to the Enriched Data Structure, find the value name and look at its Originating Source. In the case of the missing organizations and locations values, they are outputs from skill #1. Opening the Expression Evaluator </> for each path, will display the expressions listed as '/document/content/organizations' and '/document/content/locations', respectively.

:::image type="content" source="media/cognitive-search-debug/expression-eval-missing-value-locations-organizations.png" alt-text="Expression evaluator organizations entity":::

The output for these entities is empty and it should not be empty. What are the inputs producing this result?

1. Go to **Skill Graph** and select skill #1.
1. Select **Executions** tab in the right skill details pane.
1. Open the Expression Evaluator **</>** for the INPUT "text."

   :::image type="content" source="media/cognitive-search-debug/input-skill-missing-value-locations-organizations.png" alt-text="Input for text skill":::

The displayed result for this input doesn’t look like a text input. It looks like an image that is surrounded by new lines. The lack of text means that no entities can be identified. Looking at the hierarchy of the skillset displays the content is first processed by the #6 (OCR) skill and then passed to the #5 (Merge) skill. 

1. Select the #5 (Merge) skill in the **Skill Graph**.
1. Select the **Executions** tab in the right skill details pane and open the Expression Evaluator **</>** for the OUTPUTS "mergedText".

   :::image type="content" source="media/cognitive-search-debug/merge-output-detail-missing-value-locations-organizations.png" alt-text="Output for Merge skill":::

Here the text is paired with the image. Looking at the expression '/document/merged_content' the error in the "organizations" and "locations" paths for the #1 skill is visible. Instead of using '/document/content' it should use '/document/merged_content' for the "text" inputs.

1. Copy the expression for the "mergedText" output and close the Expression Evaluator window.
1. Select skill #1 in the **Skill Graph**.
1. Select the **Skill Settings** tab in the right skill details pane.
1. Open the Expression Evaluator **</>** for the "text" input.
1. Paste the new expression into the box. Click **Evaluate**.
1. The correct input with the added text should be displayed. Click **Apply** to update the Skill Settings.
1. Click **Save** in the right, skill details pane.
1. Click **Run** in the sessions window menu. This will kick off another execution of the skillset using the document.

After the indexer has finished running, the errors are still there. Go back to skill #1 and investigate. The input to the skill was corrected to 'merged_content' from 'content'. What are the outputs for these entities in the skill?

1. Select the **AI Enrichments** tab.
1. Select **Skill Graph** and click on skill #1.
1. Navigate the **Skill Settings** to find "outputs."
1. Open the Expression Evaluator **</>** for the "organizations" entity.

   :::image type="content" source="media/cognitive-search-debug/skill-output-detail-missing-value-locations-organizations.png" alt-text="Output for organizations entity":::

Evaluating the result of the expression gives the correct result. The skill is working to identify the correct value for the entity, "organizations." However, the output mapping in the entity's path is still throwing an error. In comparing the output path in the skill to the output path in the error, the skill that is parenting the outputs, organizations and locations under the /document/content node. While the output field mapping is expecting the results to be parented under the /document/merged_content node. In the previous step, the input changed from '/document/content' to '/document/merged_content'. The context in the skill settings needs to be changed in order to ensure the output is generated with the right context.

1. Select the **AI Enrichments** tab.
1. Select **Skill Graph** and click on skill #1.
1. Navigate the **Skill Settings** to find "context."
1. Double-click the setting for "context" and edit it to read '/document/merged_content'.
1. Click **Save** in the right, skill details pane.
1. Click **Run** in the sessions window menu. This will kick off another execution of the skillset using the document.

   :::image type="content" source="media/cognitive-search-debug/skill-setting-context-correction-missing-value-locations-organizations.png" alt-text="Context correction in skill setting":::

All of the errors have been resolved.

## Commit changes to the skillset

When the debug session was initiated, the search service created a copy of the skillset. This was done to protect the original skillset on your search service. Now that you have finished debugging your skillset, the fixes can be committed (overwrite the original skillset). 

Alternatively, if you aren't ready to commit changes, you can save the debug session and reopen it later.

1. Click **Commit changes** in the main Debug sessions menu.
1. Click **OK** to confirm that you wish to update your skillset.
1. Close Debug session and select the **Indexers** tab.
1. Open your 'clinical-trials-idxr'.
1. Click **Reset**.
1. Click **Run**. Click **OK** to confirm.

When the indexer has finished running, there should be a green checkmark and the word Success next to the time stamp for the latest run in the **Execution history** tab. To ensure that the changes have been applied:

1. In the search Overview page, select the **Index** tab.
1. Open the 'clinical-trials' index and in the Search explorer tab, enter this query string: `$select=metadata_storage_path, organizations, locations&$count=true` to return fields for specific documents (identified by the unique `metadata_storage_path` field).
1. Click **Search**.

The results should show that organizations and locations are now populated with the expected values.

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

This tutorial touched on various aspects of skillset definition and processing. To learn more about concepts and workflows, refer to the following articles:

+ [How to map skillset output fields to fields in a search index](cognitive-search-output-field-mapping.md)

+ [Skillsets in Azure Cognitive Search](cognitive-search-working-with-skillsets.md)

+ [How to configure caching for incremental enrichment](cognitive-search-incremental-indexing-conceptual.md)