---
title: Create and manage a knowledge base for agents in Standard logic app workflows
description: Learn how to create a knowledge hub, upload knowledge artifacts, and use Retrieval-Augmented Generation (RAG) with agents in Azure Logic Apps.
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/28/2026
# Customer intent: As a logic app developer, I want to create a knowledge base from unstructured documents so that my agents can retrieve relevant information using RAG.
---

# Create and manage a knowledge base for agents in Standard logic app workflows

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Organizations generate vast amounts of unstructured data from documents, spreadsheets, APIs, and internal systems. The Knowledge Base as a Service (KBaaS) capability in Azure Logic Apps simplifies the process of transforming this unstructured data into usable knowledge that agents in your workflows can consume. By providing an abstraction layer over Azure Cosmos DB and Azure OpenAI, KBaaS enables you to ingest, process, and retrieve structured knowledge without building a custom Retrieval-Augmented Generation (RAG) pipeline.

This guide shows you how to set up the required connections, create a knowledge hub, upload knowledge artifacts, and use the knowledge hub as a tool for agents in Standard logic app workflows.

## How the knowledge base works

The knowledge base service consists of two pipelines:

- **Ingestion pipeline**: When you upload a document (knowledge artifact) to a knowledge hub, the service automatically parses, chunks, summarizes, and vectorizes the content, and then stores the results in Azure Cosmos DB.

- **Retrieval pipeline**: When an agent queries a knowledge hub, the service rewrites the query if needed, generates a vector representation, performs a semantic search against Azure Cosmos DB, and returns the most relevant chunks to the large language model (LLM) for response generation.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Standard logic app resource and workflow. If you need to create one, see [Create Standard logic app workflows in the Azure portal](create-single-tenant-workflows-azure-portal.md).

- An Azure OpenAI resource with the following deployed models:

  - A completions model, for example, **gpt-4o**
  - An embeddings model, for example, **text-embedding-3-small**

  For more information, see [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource).

- An Azure Cosmos DB for NoSQL account with [vector search enabled](/azure/cosmos-db/nosql/vector-search).

  > [!IMPORTANT]
  >
  > The vector search feature must be enabled on your Azure Cosmos DB account before you create a knowledge hub. This operation can take up to 15 minutes to take effect. For more information, see [Enable vector search in Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/vector-search#enroll-in-the-vector-search-preview-feature).

## Configure app settings for the knowledge hub connection

Before you create a knowledge hub, you must add the required connection information as app settings in your Standard logic app.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Settings**, select **Environment variables**.

1. On the **App settings** tab, add the following settings with the corresponding values from your Azure OpenAI and Azure Cosmos DB resources:

   | App setting | Description |
   |-------------|-------------|
   | **agent_openAIEndpoint** | The endpoint URL for your Azure OpenAI resource. |
   | **agent_openAIKey** | The access key for your Azure OpenAI resource. |
   | **cosmosdbEndpoint** | The endpoint URL for your Azure Cosmos DB account. |
   | **cosmosdbKey** | The access key for your Azure Cosmos DB account. |

1. Select **Apply** to save your changes.

## Create a knowledge hub connection

After you configure the app settings, create a knowledge hub connection in the **connections.json** file for your logic app. This connection defines the Azure OpenAI models and Azure Cosmos DB account used by the knowledge hub.

1. In your logic app project, open the **connections.json** file.

1. Add a `knowledgeHubConnections` entry with the following structure:

   ```json
   {
     "knowledgeHubConnections": {
       "<connection-name>": {
         "completionsOpenAI": {
           "completionsModel": "gpt-4o",
           "openAI": {
             "authentication": {
               "key": "@appsetting('agent_openAIKey')",
               "type": "Key"
             },
             "endpoint": "@appsetting('agent_openAIEndpoint')"
           }
         },
         "embeddingsOpenAI": {
           "embeddingsModel": "text-embedding-3-small",
           "openAI": {
             "authentication": {
               "key": "@appsetting('agent_openAIKey')",
               "type": "Key"
             },
             "endpoint": "@appsetting('agent_openAIEndpoint')"
           }
         },
         "cosmosDB": {
           "authentication": {
             "key": "@appsetting('cosmosdbKey')",
             "type": "Key"
           },
           "endpoint": "@appsetting('cosmosdbEndpoint')"
         },
         "displayName": "<connection-display-name>"
       }
     }
   }
   ```

   Replace the following placeholder values:

   | Placeholder | Value |
   |-------------|-------|
   | `<connection-name>` | A name for your knowledge hub connection. Use the same name as the knowledge hub that you plan to create so that the retrieval action can associate the correct connection. |
   | `<connection-display-name>` | A human-readable label for the connection. |

   > [!NOTE]
   >
   > The connection also supports managed identity authentication. To use managed identity instead of key-based authentication, update the `authentication` sections accordingly.

<a name="create-knowledge-hub"></a>

## Create a knowledge hub

A knowledge hub is a logical container for organizing related knowledge artifacts, such as documents that belong to a specific domain. For example, you might create a knowledge hub named **HRKnowledgeHub** to contain all documents related to HR policies and procedures. When you create a knowledge hub, the service sets up the required Azure Cosmos DB databases, containers, and indexing policies automatically.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, select **Knowledge Hubs**.

1. On the **Knowledge Hubs** page, select **Create**.

1. Provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*knowledge-hub-name*> | A unique name for the knowledge hub. For example, **HRKnowledgeHub**. |
   | **Description** | No | <*description*> | An optional description for the knowledge hub. |

1. Select **Create** to provision the knowledge hub.

   Behind the scenes, the service creates the following Azure Cosmos DB containers:

   | Container | Purpose |
   |-----------|---------|
   | **KnowledgeHubs** | Stores knowledge hub metadata. |
   | **KnowledgeArtifacts** | Stores artifact metadata and source document references. |
   | **KnowledgeArtifactChunks** | Stores full-text document chunks. |
   | **KnowledgeArtifactChunkSummaries** | Stores summarized chunks with vector embeddings for semantic search. |

   After the knowledge hub is created, you can add the knowledge hub as a tool for your agent.

<a name="upload-knowledge-artifacts"></a>

## Upload knowledge artifacts

Knowledge artifacts are the individual documents that you upload to a knowledge hub. The service supports unstructured document formats such as PDF, Word, and text files.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource, and then select **Knowledge Hubs**.

1. Select the knowledge hub where you want to upload artifacts.

1. On the knowledge hub page, select **Upload**.

1. Provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*artifact-name*> | A name for the knowledge artifact. For example, **HRPolicyDocument**. |
   | **Description** | No | <*description*> | An optional description for the artifact. |
   | **File** | Yes | <*file*> | The document file to upload. Supported formats include PDF, Word, and TXT. |

1. Select **Upload** to start the ingestion process.

   The service returns a **202 Accepted** response with an operation ID for tracking the progress.

   > [!NOTE]
   >
   > During ingestion, the service performs the following operations:
   >
   > 1. **Parsing**: Extracts raw content from the document.
   > 1. **Chunking**: Splits the content into overlapping fragments to optimize vector search results.
   > 1. **Summarization**: Generates a summary for each chunk by using the configured completions model.
   > 1. **Embedding**: Creates vector representations of each chunk summary by using the configured embeddings model.
   > 1. **Storage**: Saves the full-text chunks in the **KnowledgeArtifactChunks** container and the summarized vectors in the **KnowledgeArtifactChunkSummaries** container in Azure Cosmos DB.

1. Monitor the upload status in the portal or by using the operation ID.

   When ingestion is complete, the artifact status changes to **Completed**. If there's a failure, the status changes to **Failed**.

<a name="use-knowledge-hub-as-tool"></a>

## Use a knowledge hub as an agent tool

After you create a knowledge hub and upload artifacts, you can add the knowledge hub as a tool for agents in your Standard logic app workflows. When added, agents can automatically query the knowledge hub to retrieve relevant information as part of the agent loop.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource, and then open the workflow that contains your agent.

1. In the agent configuration panel, select the knowledge hub as an available tool.

   The knowledge hub appears as a tool that the agent can call during execution to retrieve semantically relevant information from your uploaded documents.

### How retrieval works

When an agent queries a knowledge hub during a workflow run, the retrieval pipeline performs the following steps:

1. **Query rewriting**: The user query and chat history are sent to the LLM to determine whether the query needs rewriting for improved relevance, such as correcting typos, expanding abbreviations, or adding synonyms.

1. **Embedding generation**: The rewritten query is processed by the embedding model to generate a vector representation.

1. **Semantic search**: Azure Cosmos DB uses the vector to search the **KnowledgeArtifactChunkSummaries** container for the most relevant chunk summaries.

1. **Chunk retrieval**: The full text of the top K matching chunks is retrieved from the **KnowledgeArtifactChunks** container.

1. **Response generation**: The retrieved chunks, chat history, and the original query are sent to the LLM to generate the final response.

<a name="manage-knowledge-hubs"></a>

## Manage knowledge hubs and artifacts

You can list, view, and delete knowledge hubs and artifacts by using the Azure portal or the REST API.

### List all knowledge hubs

To view all knowledge hubs in your logic app, go to the **Knowledge Hubs** page in the Azure portal, or use the following REST API call:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs
```

### View a specific knowledge hub

To view a specific knowledge hub and its artifacts, use the following REST API call:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeHubName}
```

The response includes the knowledge hub details and a list of all associated artifacts with their upload status.

### List artifacts in a knowledge hub

To view all artifacts in a specific knowledge hub:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeHubName}/knowledgeArtifacts
```

### Delete a knowledge artifact

Deleting an artifact removes the artifact metadata, full-text chunks, and vector embeddings from Azure Cosmos DB. The service returns a **202 Accepted** response with an operation ID for tracking deletion progress.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeHubName}/knowledgeArtifacts/{artifactName}
```

### Delete a knowledge hub

Deleting a knowledge hub removes the hub and all its associated artifacts, chunks, and summaries from Azure Cosmos DB.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeHubName}
```

## Limitations

The following limitations apply to this release:

- Only **file upload** is supported as a source type for knowledge artifacts. Azure Blob Storage and other data sources are planned for future releases.

- Only unstructured file formats (PDF, Word, TXT) are supported. Structured data formats such as JSON and CSV are planned for future releases.

- Default chunking settings are applied automatically. Custom chunking configuration isn't available in this release.

- Image parsing isn't currently supported. Only text-based content within documents is processed.

## Related content

- [What is Azure Logic Apps?](logic-apps-overview.md)
- [Create Standard logic app workflows in the Azure portal](create-single-tenant-workflows-azure-portal.md)
- [Integrated vector store - Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/vector-search)
- [Azure OpenAI Service documentation](/azure/ai-services/openai/)
