---
title: Create Knowledge Bases for Agentic Workflows
description: Create knowledge bases from unstructured data so agentic workflows can retrieve relevant content in Azure Logic Apps by using Retrieval-Augmented Generation (RAG).
services: logic-apps
ms.services: azure-logic-apps, azure-cosmos-db
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.date: 04/10/2026
#Customer intent: As an AI integration developer who works with Azure Logic Apps, I want to create knowledge bases from unstructured documents so my agentic workflows can retrieve relevant information.
---

# Create a knowledge base for agentic workflows to use in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Your organization generates unstructured data from documents, spreadsheets, APIs, and internal systems. By using the Knowledge Base-as-a-Service (KBaaS) capability in Azure Logic Apps, you can convert this content into a structured and more searchable *knowledge base* that agent loops in agentic workflows can use to complete tasks. A knowledge base is a logical *container* that organizes related knowledge sources such as documents or files related to a specific domain.

For example, you might create a knowledge base that contains all the documents related to HR policies and procedures. When you create a knowledge base, the KBaaS automatically sets up the required Azure Cosmos DB databases, containers, and indexing policies.

This guide shows how to create a *knowledge base*, upload knowledge sources, and add the knowledge base as a tool that an agent loop can use in a Standard agentic workflow. For more information, see [Azure Cosmos DB databases, containers, and items](/azure/cosmos-db/resource-model#azure-cosmos-db-containers.md).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An Azure OpenAI resource. For more information, see [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource).

  - Your resource needs the following deployed models:

    - A completions model, such as **gpt-4o**
    - An embeddings model, such as **text-embedding-3-small**

  - To create a connection later between your OpenAI resource and knowledge base, you need the following values from your OpenAI resource:

    - Endpoint URL
    - Access key. See [Authentication](#authentication).

- An Azure Cosmos DB for NoSQL account. For more information, see [Quickstart: Create an Azure Cosmos DB for NoSQL account using the Azure portal](/azure/cosmos-db/quickstart-portal).

  - Before you create your knowledge base, [enable vector search](/azure/cosmos-db/nosql/vector-search#enroll-in-the-vector-search-preview-feature) on your Cosmos DB account. This operation might take up to 15 minutes before completion. For more information, see [Vector search in Azure Cosmos DB for NoSQL](/azure/cosmos-db/vector-search).

  - To create a connection later between your Cosmos DB and knowledge base, you need the following values from your Cosmos DB:

    - Endpoint URL
    - Access key. See [Authentication](#authentication).

- A Standard logic app and agentic workflow. You can work on either the logic app resource in the Azure portal or project in Visual Studio Code.

  For more information, see:

  - [Create autonomous agentic workflows without human interactions in Azure Logic Apps](/azure/logic-apps/create-autonomous-agent-workflows?tabs=standard)
  - [Create conversational agentic workflows with chat interactions in Azure Logic Apps](/azure/logic-apps/create-conversational-agent-workflows?tabs=standard)

## How the knowledge base works

KBaaS simplifies data transformation and provides an abstraction layer over Azure Cosmos DB and Azure OpenAI so that your workflows can more easily consume, process, and retrieve structured knowledge without building a custom Retrieval-Augmented Generation (RAG) pipeline. 

The KBaaS has the following pipelines:

- *Ingestion pipeline*: When you upload a document, or knowledge source, to your knowledge base, the service automatically parses, chunks, summarizes, and vectorizes the content. The service then stores the results in Azure Cosmos DB.

- *Retrieval pipeline*: When the agent loop queries your knowledge base, the service rewrites the query if needed, generates a vector representation, performs a semantic search against Azure Cosmos DB, and returns the most relevant chunks to the large language model (LLM) for response generation.

## Limitations

This release currently supports only the following capabilities:

- Uploaded files as the source type for knowledge sources. Other source types are in planning.
- Unstructured file formats such as PDF, Word, and TXT. Structured data formats such as JSON and CSV are in planning.
- Text-based content parsing in documents, not images.
- Default chunking settings, not custom chunking.

## Authentication

The KBaaS capability supports authentication by using [Microsoft Entra ID](/entra/identity/authentication/overview-authentication) with a [managed identity](/entra/identity/managed-identities-azure-resources/overview) or an API key. If possible, [set up and use a managed identity](/azure/logic-apps/authenticate-with-managed-identity) for optimal and superior security. You don't have to manually provide and manage credentials, secrets, or access keys. After you enable managed identity authentication, in the `knowledgeHubConnections` JSON object described in this guide, update the corresponding `authentication` sections.

If you use an API key, secure and protect sensitive and personal data, such as credentials, secrets, access keys, connection strings, certificates, thumbprints, and similar information with the highest available or supported level of security. Securely store such information by using Microsoft Entra ID and [Azure Key Vault](/azure/key-vault/general/overview). Don't hardcode this information, share with other users, or save in plain text anywhere that others can access. Set up a plan to rotate or revoke secrets in case they become compromised.

For more information, see the following resources:

- [Automate secrets rotation in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation)
- [Best practices for protecting secrets](/azure/security/fundamentals/secrets-best-practices)
- [Secrets in Azure Key Vault](/azure/key-vault/secrets/)

## 1: Add app settings for the knowledge base

Before you create a knowledge base, add the required knowledge base connection information as app settings to your Standard logic app resource:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Settings**, select **Environment variables**.

1. On the **App settings** tab toolbar, select **Add**.

1. On the **Add/Edit application setting** pane, add each app setting with the corresponding value, and then select **Apply** to save your changes:

   | App setting name | Description |
   |------------------|-------------|
   | **agent_openAIEndpoint** | The OpenAI resource endpoint URL. |
   | **agent_openAIKey** | The OpenAI resource access key. |
   | **cosmosdbEndpoint** | The Cosmos DB account endpoint URL. |
   | **cosmosdbKey** | The Cosmos DB account access key. |

1. Continue to the next section to create the knowledge base connection.

## 2: Set up the knowledge base connection

After you add the app settings, set up the knowledge base connection in your logic app's *connections.json* file. This connection defines the OpenAI models and Cosmos DB account that the knowledge base uses.

### 2a: Open the connections.json file

Based on whether you're working in the Azure portal or Visual Studio Code, follow the steps to open the *connections.json* file.

#### [Azure portal](#tab/portal)

1. On the logic app sidebar, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**.

1. Confirm that you want to leave the Azure portal and go to the Kudu Services page.

1. On the **Kudu+** toolbar, from the **Debug Console** menu, select **CMD**.

1. Go to the following folder: **site/wwwroot**

1. Next to the **connections.json** file, select **Edit** (pencil icon) to open the file.

#### [Visual Studio Code](#tab/visual-studio-code)

1. Open the logic app project workspace.

1. On the Activity Bar, open the **Explorer** window.

1. From the logic app project, open the **connections.json** file.

---

### 2b: Add the `knowledgeHubConnections` object

At the file's root level, add the `knowledgeHubConnections` JSON object with the following structure. Manually replace the placeholders with the specified values:

| Placeholder | Required | Value |
|-------------|----------|-------|
| `<connection-name>` | Yes | A name for your knowledge base connection. Use the same name as the knowledge base that you plan to create so that the retrieval action can associate the correct connection. |
| `<connection-display-name>` | Yes | A human-readable label for the connection. |

```json
{
   "agentConnections": {},
   "managedApiConnections": {},
   "serviceProviderConnections": {},
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
         "cosmosDB": {
            "authentication": {
               "key": "@appsetting('cosmosdbKey')",
               "type": "Key"
            },
            "endpoint": "@appsetting('cosmosdbEndpoint')"
         },
         "displayName": "<connection-display-name>",
         "embeddingsOpenAI": {
            "embeddingsModel": "text-embedding-3-small",
            "openAI": {
               "authentication": {
                  "key": "@appsetting('agent_openAIKey')",
                  "type": "Key"
               },
               "endpoint": "@appsetting('agent_openAIEndpoint')"
            }
         }
      }
   }
}
```

<a name="create-knowledge-base"></a>

## 3: Create a knowledge base

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Agents**, select **Knowledge base**.

1. On the **Knowledge base** page, select **Add files**.

1. On the **Add files** pane, complete the following tasks:

   1. In the **Group** section, enter the following information:

      | Parameter | Required | Description |
      |-----------|----------|-------------|
      | **Name** | Yes | The name of the group that organizes files in your knowledge base. Enter a new name or select an existing group. |
      | **Description** | No | An optional description for the group. |

   1. In the **Add files** section, select **browse to upload**, or drag and drop files to your group. For each file, enter the following information:

      | Property | Required | Value | Description |
      |----------|----------|-------|-------------|
      | **Name** | Yes | <*source-name*> | A name for the file as a knowledge source, for example, `HRPolicyDocument`. |
      | **Description** | No | <*source-description*> | An optional description for the file as a knowledge source. |

1. When you finish, select **Add**.

   The KBaaS creates the following Cosmos DB containers:

   | Container | Purpose |
   |-----------|---------|
   | **KnowledgeHubs** | Stores knowledge base metadata. |
   | **KnowledgeArtifacts** | Stores source metadata and source document references. |
   | **KnowledgeArtifactChunks** | Stores full-text document chunks. |
   | **KnowledgeArtifactChunkSummaries** | Stores summarized chunks with vector embeddings for semantic search. |

   The KBaaS returns a **202 Accepted** response with an operation ID for tracking the upload progress.

   During the upload process, the KBaaS performs operations to parse, chunk, summarize, embed, and store vectorized content in the Cosmos DB container. When the process completes, the source status changes to **Completed** or **Failed**, based on the result.

1. Monitor the upload status in the Azure portal or by using the operation ID.

1. After KBaaS finishes, continue to the next section so you can add the knowledge base as a tool for your agent loop to use in your agentic Standard workflow.

<a name="add-knowledge-base-as-tool"></a>

## 4: Add the knowledge base as a tool

You can now add the knowledge base to your agent loop to use as a tool in your agentic Standard workflows. Agent loops automatically query the knowledge base to retrieve semantically relevant information from your uploaded documents.

1. In the same Standard logic app that has your knowledge base, in the designer, open your agentic workflow, and select the agent loop you want.

1. In the agent information pane, in the **Knowledge base** section, from the **Sources** list, select the knowledge base.

1. To upload more files to your knowledge base, select **+ Upload**.

<a name="manage-knowledge-bases"></a>

## Manage knowledge bases and sources

To list, view, and delete knowledge bases or sources, use the Azure portal or REST API.

### List all knowledge bases

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Agents**, select **Knowledge base**.

Or, make the following REST API call:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs
```

### View a specific knowledge base

In the Azure portal, from the **Knowledge base** page, select the knowledge base name.

Or, make the following REST API call:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeBaseName}
```

The response includes the knowledge base information, a list with the associated sources, and their upload status.

### List sources in a knowledge base

In the Azure portal, select the knowledge base to view its sources.

Or, make the following REST API call:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeBaseName}/knowledgeArtifacts
```

### Delete a knowledge source

This operation removes the source metadata, full-text chunks, and vector embeddings from Cosmos DB. The service returns a **202 Accepted** response with an operation ID for tracking deletion progress.

1. In the Azure portal, select the knowledge base to view its sources.

1. Select the source. On the toolbar, select **Delete**.

Or, make the following REST API call:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeBaseName}/knowledgeArtifacts/{artifactName}
```

### Delete a knowledge base

This operation removes the knowledge base and associated sources, chunks, and summaries from Cosmos DB.

1. In the Azure portal, select the knowledge base.

1. On the toolbar, select **Delete**.

Or, make the following REST API call:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{logicAppName}/hostruntime/runtime/webhooks/workflow/api/management/knowledgehubs/{knowledgeBaseName}
```

## Related content

- [What is Azure Logic Apps?](logic-apps-overview.md)
- [Azure OpenAI Service](/azure/cognitive-services/openai/)
- [Azure Cosmos DB Vector Search](/azure/cosmos-db/nosql/vector-search)
- [Integrated vector store - Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/vector-search)
