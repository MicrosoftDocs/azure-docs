---
title: "Quickstart: Vectorize text and images by using the Azure portal"
titleSuffix: Azure AI Search
description: Use a wizard to automate data chunking and vectorization in a search index.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: quickstart
ms.date: 07/19/2024
---

# Quickstart: Vectorize text and images by using the Azure portal

> [!IMPORTANT]
> The **Import and vectorize data** wizard is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). By default, it targets the [2024-05-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

This quickstart helps you get started with [integrated vectorization (preview)](vector-search-integrated-vectorization.md) by using the **Import and vectorize data** wizard in the Azure portal. The wizard chunks your content and calls an embedding model to vectorize content during indexing and for queries.

Key points about the wizard:

+ Source data is either Azure Blob Storage or OneLake files and shortcuts.
+ Document parsing mode is the default (one search document per blob or file).
+ Index schema is nonconfigurable. It provides vector and nonvector fields for chunked data.
+ Chunking is nonconfigurable. The effective settings are:

  ```json
  textSplitMode: "pages",
  maximumPageLength: 2000,
  pageOverlapLength: 500
  ```

## Prerequisites

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ [Azure AI Search service](search-create-service-portal.md) in the same region as Azure AI. We recommend the Basic tier or higher.

+ [Azure Blob Storage](/azure/storage/common/storage-account-overview) or a [OneLake lakehouse](search-how-to-index-onelake-files.md).

  Azure Storage must be a standard performance (general-purpose v2) account. Access tiers can be hot, cool, and cold. Don't use Azure Data Lake Storage Gen2 (a storage account with a hierarchical namespace). This version of the wizard doesn't support Data Lake Storage Gen2.

+ An embedding model on an Azure AI platform. [Deployment instructions](#set-up-embedding-models) are in this article.

  | Provider | Supported models |
  |---|---|
  | [Azure OpenAI Service](https://aka.ms/oai/access) | text-embedding-ada-002, text-embedding-3-large, or text-embedding-3-small. |
  | [Azure AI Studio model catalog](/azure/ai-studio/what-is-ai-studio) |  Azure, Cohere, and Facebook embedding models. |
  | [Azure AI services multiservice account](/azure/ai-services/multi-service-resource) | [Azure AI Vision multimodal](/azure/ai-services/computer-vision/how-to/image-retrieval) for image and text vectorization. Azure AI Vision multimodal is available in selected regions. [Check the documentation](/azure/ai-services/computer-vision/how-to/image-retrieval?tabs=csharp) for an updated list. **To use this resource, the account must be in an available region and in the same region as Azure AI Search**. |

### Public endpoint requirements

All of the preceding resources must have public access enabled so that the portal nodes can access them. Otherwise, the wizard fails. After the wizard runs, you can enable firewalls and private endpoints on the integration components for security. For more information, see [Secure connections in the import wizards](search-import-data-portal.md#secure-connections).

If private endpoints are already present and you can't disable them, the alternative option is to run the respective end-to-end flow from a script or program on a virtual machine. The virtual machine must be on the same virtual network as the private endpoint. [Here's a Python code sample](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python/code/integrated-vectorization) for integrated vectorization. The same [GitHub repo](https://github.com/Azure/azure-search-vector-samples/tree/main) has samples in other programming languages.

### Role-based access control requirements

We recommend role assignments for search service connections to other resources.

1. On Azure AI Search, [enable roles](search-security-enable-roles.md).

1. Configure your search service to [use a managed identity](search-howto-managed-identities-data-sources.md#create-a-system-managed-identity).

1. On your data source platform and embedding model provider, create role assignments that allow search service to access data and models. [Prepare sample data](#prepare-sample-data) provides instructions for setting up roles.

A free search service supports RBAC on connections to Azure AI Search, but it doesn't support managed identities on outbound connections to Azure Storage or Azure AI Vision. This level of support means you must use key-based authentication on connections between a free search service and other Azure services. 

For more secure connections:

+ Use the Basic tier or higher.
+ [Configure a managed identity](search-howto-managed-identities-data-sources.md) and use roles for authorized access.

> [!NOTE]
> If you can't progress through the wizard because options aren't available (for example, you can't select a data source or an embedding model), revisit the role assignments. Error messages indicate that models or deployments don't exist, when in fact the real cause is that the search service doesn't have permission to access them.

### Check for space

If you're starting with the free service, you're limited to 3 indexes, data sources, skillsets, and indexers. Basic limits you to 15. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

### Check for semantic ranking

The wizard supports semantic ranking, but only on the Basic tier and higher, and only if semantic ranking is already [enabled on your search service](semantic-how-to-enable-disable.md). If you're using a billable tier, check whether semantic ranking is enabled.

## Prepare sample data

This section points you to data that works for this quickstart.

### [Azure Blob storage](#tab/sample-data-storage)

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure Storage account.

1. On the left pane, under **Data Storage**, select **Containers**.

1. Create a new container and then upload the [health-plan PDF documents](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/health-plan) used for this quickstart.

1. On the left pane, under **Access control**, assign the [Storage Blob Data Reader](search-howto-managed-identities-data-sources.md#assign-a-role) role to the search service identity. Or, get a connection string to the storage account from the **Access keys** page.

### [OneLake](#tab/sample-data-onelake)

1. Sign in to [Power BI](https://powerbi.com/) and [create a workspace](/fabric/data-engineering/tutorial-lakehouse-get-started).

1. In Power BI, select **Workspaces** on the left menu and open the workspace that you created.

1. Assign permissions at the workspace level:

   1. On the upper-right menu, select **Manage access**.

   1. Select **Add people or groups**.

   1. Enter the name of your search service. For example, if the URL is `https://my-demo-service.search.windows.net`, the search service name is `my-demo-service`.

   1. Select a role. The default is **Viewer**, but you need **Contributor** to pull data into a search index.

1. Load the sample data:

   1. From the **Power BI** switcher on the lower left, select **Data Engineering**.

   1. On the **Data Engineering** pane, select **Lakehouse** to create a lakehouse.

   1. Provide a name, and then select **Create** to create and open the new lakehouse.

   1. Select **Upload files**, and then upload the [health-plan PDF documents](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/health-plan) used for this quickstart.

1. Before you leave the lakehouse, copy the URL, or get the workspace and lakehouse IDs, so that you can specify the lakehouse in the wizard. The URL is in this format: `https://msit.powerbi.com/groups/00000000-0000-0000-0000-000000000000/lakehouses/11111111-1111-1111-1111-111111111111?experience=data-engineering`.

---

<a name="connect-to-azure-openai"></a>
<!-- This bookmark is used in an FWLINK. Do not change. -->

## Set up embedding models

The wizard can use embedding models deployed from Azure OpenAI, Azure AI Vision, or from the model catalog in Azure AI Studio.

### [Azure OpenAI](#tab/model-aoai)

The wizard supports text-embedding-ada-002, text-embedding-3-large, and text-embedding-3-small. Internally, the wizard calls the [AzureOpenAIEmbedding skill](cognitive-search-skill-azure-openai-embedding.md) to connect to Azure OpenAI.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure OpenAI resource.

1. Set up permissions:

   1. On the left menu, select **Access control**.

   1. Select **Add**, and then select **Add role assignment**.

   1. Under **Job function roles**, select [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles), and then select **Next**.

   1. Under **Members**, select **Managed identity**, and then select **Members**.

   1. Filter by subscription and resource type (search services), and then select the managed identity of your search service.

   1. Select **Review + assign**.

1. On the **Overview** page, select **Click here to view endpoints** or **Click here to manage keys** if you need to copy an endpoint or API key. You can paste these values into the wizard if you're using an Azure OpenAI resource with key-based authentication.

1. Under **Resource Management** and **Model deployments**, select **Manage Deployments** to open Azure AI Studio.

1. Copy the deployment name of `text-embedding-ada-002` or another supported embedding model. If you don't have an embedding model, deploy one now.

### [Azure AI Vision](#tab/model-ai-vision)

The wizard supports Azure AI Vision image retrieval through multimodal embeddings (version 4.0). Internally, the wizard calls the [multimodal embeddings skill](cognitive-search-skill-vision-vectorize.md) to connect to Azure AI Vision.

1. [Create an Azure AI Vision service in a supported region](/azure/ai-services/computer-vision/how-to/image-retrieval?tabs=csharp#prerequisites).

1. Make sure your Azure AI Search service is in the same region.

1. After the service is deployed, go to the resource and select **Access control** to assign the **Cognitive Services OpenAI User** role to your search service's managed identity. Optionally, you can use key-based authentication for the connection.

After you finish these steps, you should be able to select the Azure AI Vision vectorizer in the **Import and vectorize data** wizard.

> [!NOTE]
> If you can't select an Azure AI Vision vectorizer, make sure you have an Azure AI Vision resource in a supported region. Also make sure that your search service's managed identity has **Cognitive Services OpenAI User** permissions.

### [Azure AI Studio model catalog](#tab/model-catalog)

The wizard supports Azure, Cohere, and Facebook embedding models in the Azure AI Studio model catalog, but it doesn't currently support the OpenAI CLIP model. Internally, the wizard calls the [AML skill](cognitive-search-aml-skill.md) to connect to the catalog.

1. For the model catalog, you should have an [Azure OpenAI resource](/azure/ai-services/openai/how-to/create-resource), a [hub in Azure AI Studio](/azure/ai-studio/how-to/create-projects), and a [project](/azure/ai-studio/how-to/create-projects). Hubs and projects having the same name can share connection information and permissions.

1. Deploy a supported embedding model to the model catalog in your project.

1. For RBAC, create two role assignments: one for Azure AI Search, and another for the AI Studio project. Assign the [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control) role for embeddings and vectorization.

---

## Start the wizard

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import and vectorize data**.

   :::image type="content" source="media/search-get-started-portal-import-vectors/command-bar.png" alt-text="Screenshot of the command to open the wizard for importing and vectorizing data.":::

## Connect to your data

The next step is to connect to a data source to use for the search index.

### [Azure Blob storage](#tab/connect-data-storage)

1. On the **Set up your data connection** page, select **Azure Blob Storage**.

1. Specify the Azure subscription.

1. Choose the storage account and container that provide the data.

1. Specify whether you want [deletion detection](search-howto-index-changed-deleted-blobs.md) support. On subsequent indexing runs, the search index is updated to remove any search documents based on soft-deleted blobs on Azure Storage.

   + You're prompted to choose either **Native blob soft delete** or **Soft delete using custom data**.
   + Your blob container must have deletion detection enabled before you run the wizard.
   + [Enable soft delete](/azure/storage/blobs/soft-delete-blob-overview) in Azure Storage, or [add custom metadata](search-howto-index-changed-deleted-blobs.md#soft-delete-strategy-using-custom-metadata) to your blobs that indexing recognizes as a deletion flag.
   + If you choose **Soft delete using custom data**, you're prompted to provide the metadata property name-value pair.

1. Specify whether you want your search service to [connect to Azure Storage using its managed identity](search-howto-managed-identities-storage.md).

   + You're prompted to choose either a system-managed or user-managed identity. 
   + The identity should have a **Storage Blob Data Reader** role on Azure Storage. 
   + Do not skip this option. A connection error occurs during indexing if the wizard can't connect to Azure Storage.

1. Select **Next**.

### [OneLake (preview)](#tab/connect-data-onelake)

Support for OneLake indexing is in preview. For more information about supported shortcuts and limitations, see ([OneLake indexing](search-how-to-index-onelake-files.md)).

1. On the **Set up your data connection** page, select **OneLake**.

1. Specify the type of connection:

   + Lakehouse URL
   + Workspace ID and Lakehouse ID

1. For OneLake, specify the lakehouse URL, or provide the workspace and lakehouse IDs.

1. Specify whether you want your search service to connect to OneLake using its system or user managed identity. You must use a managed identity and roles for search connections to OneLake.

1. Select **Next**.

---

## Vectorize your text

In this step, specify the embedding model for vectorizing chunked data.

1. On the **Vectorize your text** page, choose the source of the embedding model:

   + Azure OpenAI
   + Azure AI Studio model catalog
   + An existing Azure AI Vision multimodal resource in the same region as Azure AI Search. If there's no [Azure AI Services multi-service account](/azure/ai-services/multi-service-resource) in the same region, this option isn't available.

1. Choose the Azure subscription.

1. Make selections according to the resource:

   + For Azure OpenAI, choose an existing deployment of text-embedding-ada-002, text-embedding-3-large, or text-embedding-3-small.

   + For AI Studio catalog, choose an existing deployment of an Azure, Cohere, and Facebook embedding model.

   + For AI Vision multimodal embeddings, select the account.

   For more information, see [Set up embedding models](#set-up-embedding-models) earlier in this article.

1. Specify whether you want your search service to authenticate using an API key or managed identity.

   + The identity should have a **Cognitive Services OpenAI User** role on the Azure AI multi-services account.

1. Select the checkbox that acknowledges the billing impact of using these resources.

1. Select **Next**.

## Vectorize and enrich your images

If your content includes images, you can apply AI in two ways:

+ Use a supported image embedding model from the catalog, or choose the Azure AI Vision multimodal embeddings API to vectorize images.

+ Use optical character recognition (OCR) to recognize text in images. This option invokes the [OCR skill](cognitive-search-skill-ocr.md) to read text from images.

Azure AI Search and your Azure AI resource must be in the same region.

1. On the **Vectorize your images** page, specify the kind of connection the wizard should make. For image vectorization, the wizard can connect to embedding models in Azure AI Studio or Azure AI Vision.

1. Specify the subscription.

1. For the Azure AI Studio model catalog, specify the project and deployment. For more information, see [Set up embedding models](#set-up-embedding-models) earlier in this article.

1. Optionally, you can crack binary images (for example, scanned document files) and [use OCR](cognitive-search-skill-ocr.md) to recognize text.

1. Select the checkbox that acknowledges the billing impact of using these resources.

1. Select **Next**.

## Choose advanced settings

1. On the **Advanced settings** page, you can optionally add [semantic ranking](semantic-search-overview.md) to rerank results at the end of query execution. Reranking promotes the most semantically relevant matches to the top.

1. Optionally, specify a [run schedule](search-howto-schedule-indexers.md) for the indexer.

1. Select **Next**.

## Finish the wizard

1. On the **Review your configuration** page, specify a prefix for the objects that the wizard will create. A common prefix helps you stay organized.

1. Select **Create**.

When the wizard completes the configuration, it creates the following objects:

+ Data source connection.

+ Index with vector fields, vectorizers, vector profiles, and vector algorithms. You can't design or modify the default index during the wizard workflow. Indexes conform to the [2024-05-01-preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

+ Skillset with the [Text Split skill](cognitive-search-skill-textsplit.md) for chunking and an embedding skill for vectorization. The embedding skill is either the [AzureOpenAIEmbeddingModel skill](cognitive-search-skill-azure-openai-embedding.md) for Azure OpenAI or the [AML skill](cognitive-search-aml-skill.md) for the Azure AI Studio model catalog.

+ Indexer with field mappings and output field mappings (if applicable).

## Check results

Search Explorer accepts text strings as input and then vectorizes the text for vector query execution.

1. In the Azure portal, go to **Search Management** > **Indexes**, and then select the index that you created.

1. Optionally, select **Query options** and hide vector values in search results. This step makes your search results easier to read.

   :::image type="content" source="media/search-get-started-portal-import-vectors/query-options.png" alt-text="Screenshot of the button for query options.":::

1. On the **View** menu, select **JSON view** so that you can enter text for your vector query in the `text` vector query parameter.

   :::image type="content" source="media/search-get-started-portal-import-vectors/select-json-view.png" alt-text="Screenshot of the menu command for opening the JSON view.":::

   The wizard offers a default query that issues a vector query on the `vector` field and returns the five nearest neighbors. If you opted to hide vector values, your default query includes a `select` statement that excludes the `vector` field from search results.

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

1. For the `text` value, replace the asterisk (`*`) with a question related to health plans, such as `Which plan has the lowest deductible?`.

1. Select **Search** to run the query.

   :::image type="content" source="media/search-get-started-portal-import-vectors/search-results.png" alt-text="Screenshot of search results.":::

   Five matches should appear. Each document is a chunk of the original PDF. The `title` field shows which PDF the chunk comes from.

1. To see all of the chunks from a specific document, add a filter for the `title` field for a specific PDF:

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

Azure AI Search is a billable resource. If you no longer need it, delete it from your subscription to avoid charges.

## Next step

This quickstart introduced you to the **Import and vectorize data** wizard that creates all of the necessary objects for integrated vectorization. If you want to explore each step in detail, try an [integrated vectorization sample](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/integrated-vectorization/azure-search-integrated-vectorization-sample.ipynb).
