---
title: Quickstart integrated vectorization
titleSuffix: Azure AI Search
description: Use the Import and vectorize data wizard to automate data chunking and vectorization in a search index.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: quickstart
ms.date: 05/30/2024
---

# Quickstart: Import and vectorize data wizard (preview)

> [!IMPORTANT]
> **Import and vectorize data** wizard is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). By default, it targets the [2024-05-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

Get started with [integrated vectorization (preview)](vector-search-integrated-vectorization.md) using the **Import and vectorize data** wizard in the Azure portal. This wizard calls a user-specified embedding model to vectorize content during indexing and for queries.

In this preview version of the wizard:

+ Source data is either blobs in Azure Storage or files in OneLake, using the default parsing mode (one search document per blob or file).
+ Index schema is nonconfigurable. Source fields include `content` (chunked and vectorized), `metadata_storage_name` for title, and a `metadata_storage_path` for the document key, represented as `parent_id` in the Index.
+ Chunking is nonconfigurable. The effective settings are:

  ```json
  textSplitMode: "pages",
  maximumPageLength: 2000,
  pageOverlapLength: 500
  ```

For more configuration and data source options, try Python or the REST APIs. See [integrated vectorization sample](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/integrated-vectorization/azure-search-integrated-vectorization-sample.ipynb) for details.

## Prerequisites

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ Azure AI Search, in any region and on any tier, with two caveats:

  First, role-based access control isn't available on the free tier. Basic tier and higher  provide role-based access control, which is required for *OneLake indexing* and recommended for connections to embedding models.

  Second, for multimodal embeddings with Azure AI Vision or image-related transformations, your search service must be in the *same region* as Azure AI Vision. Currently, those regions are: SwedenCentral, EastUS, NorthEurope, WestEurope, WestUS, SoutheastAsia, KoreaCentral, FranceCentral, AustraliaEast, WestUS2, SwitzerlandNorth, JapanEast. [Check the documentation](/azure/ai-services/computer-vision/how-to/image-retrieval?tabs=csharp) for an updated list.

+ A supported embedding model: [Azure OpenAI](https://aka.ms/oai/access) endpoint with deployments, [Azure AI Vision](/azure/ai-services/computer-vision/how-to/image-retrieval) in a supported region, or [Azure AI Studio model catalog](/azure/ai-studio/what-is-ai-studio) (and hub and project) with model deployments.

+ A supported data source: [Azure Storage account](/azure/storage/common/storage-account-overview) or a [OneLake lakehouse](search-how-to-index-onelake-files.md). For Azure Storage, use a standard performance (general-purpose v2) account. Access tiers can be hot, cool, and cold.

+ Role assignments or API keys are required for connections to embedding models and data sources. Instructions are provided in this article.

+ All components (data source and embedding endpoint) must have public access enabled for the portal nodes to be able to access them. Otherwise, the wizard fails. After the wizard runs, firewalls and private endpoints can be enabled on the different integration components for security. 

   If private endpoints are already present and can't be disabled, the alternative option is to run the respective end-to-end flow from a script or program from a virtual machine within the same virtual network as the private endpoint. Here's a [Python code sample](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python/code/integrated-vectorization) for integrated vectorization. In the same [GitHub repo](https://github.com/Azure/azure-search-vector-samples/tree/main) are samples in other programming languages. 

## Check for space

If you're starting with the free service, you're limited to three indexes, three data sources, three skillsets, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

## Check for service identity

We recommend role assignments for search service connections to other resources. 

1. On Azure AI Search, [enable role-based access](search-security-rbac.md#enable-role-based-access-for-data-plane-operations).

1. Configure your search service to [use a system or user-assigned managed identity](search-howto-managed-identities-data-sources.md#create-a-system-managed-identity). 

In the following sections, you can assign the search service managed identity to roles in other services. Steps for role assignments are provided where applicable.

## Check for semantic ranking

This wizard supports semantic ranking, but only on Basic tier and higher, and only if semantic ranking is already [enabled on your search service](semantic-how-to-enable-disable.md). If you're using a billable tier, check to see if semantic ranking is enabled.

## Prepare sample data

This section points you to data that works for this quickstart.

### [**Azure Storage**](#tab/sample-data-storage)

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure Storage account.

1. In the navigation pane, under **Data Storage**, select **Containers**.

1. Create a new container and then upload the [health-plan PDF documents](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/health-plan) used for this quickstart.

1. On **Access control**, assign [Storage Blob Data Reader](search-howto-managed-identities-data-sources.md#assign-a-role) on the container to the search service identity. Or, get a connection string to the storage account from the **Access keys** page.

### [**OneLake**](#tab/sample-data-onelake)

1. Sign in to the [Power BI](https://powerbi.com/) and [create a workspace](/fabric/data-engineering/tutorial-lakehouse-get-started).

1. In Power BI, select **Workspaces** from the left-hand menu and open the workspace you created.

1. Assign permissions at the workspace level:

   1. Select **Manage access** in the top right menu.
   1. Select **Add people or groups**.
   1. Enter the name of your search service. For example, if the URL is `https://my-demo-service.search.windows.net`, the search service name is `my-demo-service`. 
   1. Select a role. The default is **Viewer**, but you need **Contributor** to pull data into a search index.

1. Load the sample data:

   1. From the **Power BI** switcher located at the bottom left, select **Data Engineering**.

   1. In the Data Engineering screen, select **Lakehouse** to create a lakehouse.

   1. Provide a name and then select **Create** to create and open the new lakehouse.

   1. Select **Upload files** and then upload the [health-plan PDF documents](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/health-plan) used for this quickstart.

1. Before leaving the lakehouse, copy the URL, or get the workspace and lakehouse IDs, so that you can specify the lakehouse in the wizard. The URL is in this format: `https://msit.powerbi.com/groups/00000000-0000-0000-0000-000000000000/lakehouses/11111111-1111-1111-1111-111111111111?experience=data-engineering`

---

<a name="connect-to-azure-openai"></a>
<!-- This bookmark is used in an FWLINK. Do not change. -->

## Set up embedding models

Integrated vectorization and the **Import and vectorize data** wizard tap into deployed embedding models during indexing to convert text and images into vectors.

You can use embedding models deployed in Azure OpenAI, Azure AI Vision for multimodal embeddings, or in the model catalog in Azure AI Studio.

### [**Azure OpenAI**](#tab/model-aoai)

**Import and vectorize data** supports: text-embedding-ada-002, text-embedding-3-large, text-embedding-3-small. Internally, the wizard uses the [AzureOpenAIEmbedding skill](cognitive-search-skill-azure-openai-embedding.md) to connect to Azure OpenAI.

Use these instructions to assign permissions or get an API key for search service connection to Azure OpenAI. You should set up permissions or have connection information in hand before running the wizard.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure OpenAI resource.

1. Set up permissions:

   1. Select **Access control** from the left menu.

   1. Select **Add** and then select **Add role assignment**.

   1. Under **Job function roles**, select [**Cognitive Services OpenAI User**](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) and then select **Next**.

   1. Under **Members**, select **Managed identity** and then select **Members**.

   1. Filter by subscription and resource type (Search services), and then select the managed identity of your search service.

   1. Select **Review + assign**.

1. On the Overview page, select **Click here to view endpoints** and **Click here to manage keys** if you need to copy an endpoint or API key. You can paste these values into the wizard if you're using an Azure OpenAI resource with key-based authentication.

1. Under **Resource Management** and **Model deployments**, select **Manage Deployments** to open Azure AI Studio. 

1. Copy the deployment name of text-embedding-ada-002 or another supported embedding model. If you don't have an embedding model, deploy one now.

### [**Azure AI Vision**](#tab/model-ai-vision)

**Import and vectorize data** supports Azure AI Vision image retrieval using multimodal embeddings (version 4.0). Internally, the wizard uses the [multimodal embeddings skill](cognitive-search-skill-vision-vectorize.md) to connect to Azure AI Vision.

1. [Create an Azure AI Vision service in a supported region](/azure/ai-services/computer-vision/how-to/image-retrieval?tabs=csharp#prerequisites). 

1. Make sure your Azure AI Search service is in the same region

1. After the service is deployed, go to the resource and select **Access control** to assign **Cognitive Services OpenAI Contributor** to your search service's managed identity. Optionally, you can use key-based authentication for the connection.

Once these steps are complete, you should be able to select Azure AI Vision vectorizer in the **Import and vectorize data wizard**.

### [**Azure AI Studio model catalog**](#tab/model-catalog)

**Import and vectorize data** supports Azure, Cohere, and Facebook embedding models in the Azure AI Studio model catalog, but doesn't currently support OpenAI-CLIP. Internally, the wizard uses the [AML skill](cognitive-search-aml-skill.md) to connect to the catalog.

Use these instructions to assign permissions or get an API key for search service connection to Azure OpenAI. You should set up permissions or have connection information in hand before running the wizard.

1. For model catalog, you should have an [Azure OpenAI resource](/azure/ai-services/openai/how-to/create-resource), a [hub in Azure AI Studio](/azure/ai-studio/how-to/create-projects), and a [project](/azure/ai-studio/how-to/create-projects). Hubs and projects with the same name can share connection information and permissions.

1. Deploy a supported embedding model to the model catalog in your project. 

1. For role-based access control, create two role assignments: one for Azure AI Search, and another AI Studio project. Assign [**Cognitive Services OpenAI User**](/azure/ai-services/openai/how-to/role-based-access-control) for embeddings and vectorization.

---

## Start the wizard

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import and vectorize data**.

   :::image type="content" source="media/search-get-started-portal-import-vectors/command-bar.png" alt-text="Screenshot of the wizard command.":::

## Connect to your data

The next step is to connect to a data source to use for the search index.

1. In the **Import and vectorize data** wizard on the **Connect to your data** tab, expand the **Data Source** dropdown list and select **Azure Blob Storage** or **OneLake**.

1. Specify the Azure subscription.

1. For OneLake, specify the lakehouse URL or provide the workspace and lakehouse IDs.

1. For Azure Storage, select the account and container that provides the data. 

1. Specify whether you want [deletion detection](search-howto-index-changed-deleted-blobs.md).

1. Select **Next**.

## Vectorize your text

In this step, specify the embedding model used to vectorize chunked data.

1. Specify whether deployed models are on Azure OpenAI, the Azure AI Studio model catalog, or an existing Azure AI Vision multimodal resource in the same region as Azure AI Search.

1. Specify the Azure subscription.

1. For Azure OpenAI, select the service, model deployment, and authentication type. See [Set up embedding models](#set-up-embedding-models) for details.

1. For AI Studio catalog, select the project, model deployment, and authentication type. See [Set up embedding models](#set-up-embedding-models) for details.

1. For AI Vision vectorization, select the account. See [Set up embedding models](#set-up-embedding-models) for details.

1. Select the checkbox acknowledging the billing impact of using these resources.

1. Select **Next**.

## Vectorize and enrich your images

If your content includes images, you can apply AI in two ways:

+ Use a supported image embedding model from the catalog, or choose the Azure AI Vision multimodal embeddings API to vectorize images. 
+ Use OCR to recognize text in images. 

Azure AI Search and your Azure AI resource must be in the same region.

1. Specify the kind of connection the wizard should make. For image vectorization, it can connect to embedding models in Azure AI Studio or Azure AI Vision.

1. Specify the subscription.

1. For Azure AI Studio model catalog, specify the project and deployment. See [Setting up an embedding model](#set-up-embedding-models) for details.

1. Optionally, you can crack binary images (for example, scanned document files) and [use OCR](cognitive-search-skill-ocr.md) to recognize text.

1. Select the checkbox acknowledging the billing impact of using these resources.

1. Select **Next**.

## Advanced settings

1. Optionally, you can add [semantic ranking](semantic-search-overview.md) to rerank results at the end of query execution, promoting the most semantically relevant matches to the top.

1. Optionally, specify a [run time schedule](search-howto-schedule-indexers.md) for the indexer.

1. Select **Next**.

## Run the wizard

1. On Review and create, specify a prefix for the objects created when the wizard runs. A common prefix helps you stay organized.

1. Select **Create** to run the wizard. This step creates the following objects:

   + Data source connection.

   + Index with vector fields, vectorizers, vector profiles, vector algorithms. You aren't prompted to design or modify the default index during the wizard workflow. Indexes conform to the [2024-05-01-preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

   + Skillset with [Text Split skill](cognitive-search-skill-textsplit.md) for chunking and an embedding skill for vectorization. The embedding skill is either the [AzureOpenAIEmbeddingModel skill](cognitive-search-skill-azure-openai-embedding.md) for Azure OpenAI or [AML skill](cognitive-search-aml-skill.md) for Azure AI Studio model catalog.

   + Indexer with field mappings and output field mappings (if applicable).

If you can't select Azure AI Vision vectorizer, make sure you have an Azure AI Vision resource in a supported region, and that your search service managed identity has **Cognitive Services OpenAI User** permissions.

If you can't progress through the wizard because other options aren't available (for example, you can't select a data source or an embedding model), revisit the role assignments. Error messages indicate that models or deployments don't exist, when in fact the real issue is that the search service doesn't have permission to access them.

## Check results

Search explorer accepts text strings as input and then vectorizes the text for vector query execution.

1. In the Azure portal, under **Search Management** and **Indexes**, select the index your created.

1. Optionally, select **Query options** and hide vector values in search results. This step makes your search results easier to read.

   :::image type="content" source="media/search-get-started-portal-import-vectors/query-options.png" alt-text="Screenshot of the query options button.":::

1. Select **JSON view** so that you can enter text for your vector query in the **text** vector query parameter. 

   :::image type="content" source="media/search-get-started-portal-import-vectors/select-json-view.png" alt-text="Screenshot of JSON selector.":::

   This wizard offers a default query that issues a vector query on the "vector" field, returning the 5 nearest neighbors. If you opted to hide vector values, your default query includes a "select" statement that excludes the vector field from search results.

   ```json
   {
      "select": "chunk_id,parent_id,chunk,title",
      "vectorQueries": [
          {
             "kind": "text",
             "text": "*",
             "k": 5,
             "fields": "vector"
          }
       ]
   }
   ```

1. Replace the text `"*"` with a question related to health plans, such as *"which plan has the lowest deductible"*.

1. Select **Search** to run the query.

   :::image type="content" source="media/search-get-started-portal-import-vectors/search-results.png" alt-text="Screenshot of search results.":::

   You should see 5 matches, where each document is a chunk of the original PDF. The title field shows which PDF the chunk comes from.

1. To see all of the chunks from a specific document, add a filter for the title field for a specific PDF:

   ```json
   {
      "select": "chunk_id,parent_id,chunk,title",
      "filter": "title eq 'Benefit_Options.pdf'",
      "count": true,
      "vectorQueries": [
          {
             "kind": "text",
             "text": "*",
             "k": 5,
             "fields": "vector"
          }
       ]
   }

## Clean up

Azure AI Search is a billable resource. If it's no longer needed, delete it from your subscription to avoid charges.

## Next steps

This quickstart introduced you to the **Import and vectorize data** wizard that creates all of the objects necessary for integrated vectorization. If you want to explore each step in detail, try an [integrated vectorization sample](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/integrated-vectorization/azure-search-integrated-vectorization-sample.ipynb).
