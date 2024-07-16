---
title: Integrate Azure AI services with your workflows
description: Integrate data in Standard workflows with Azure OpenAI and Azure AI Search for Azure Logic Apps.
author: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/29/2024
---

# Integrate Azure AI services with Standard workflows in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To integrate enterprise data and services with AI technologies, you can use the Azure OpenAI and Azure AI Search built-in connectors in automated Standard logic app workflows. These connectors support multiple authentication types, such as API keys, Microsoft Entra ID, and managed identities. They can also connect to Azure OpenAI Service and Azure AI Search endpoints behind firewalls so that your workflows securely connect to your AI resources in Azure.

This guide provides an overview and examples for how to use the Azure OpenAI and Azure AI Search connector operations in your workflow.

- [What is Azure OpenAI Service](../../ai-services/openai/overview.md)
- [What is Azure AI Search](../../search/search-what-is-azure-search.md)

## Why use Azure Logic Apps to integrate with AI services?

Usually, building AI solutions involves several key steps and requires a few building blocks. Primarily, you need to have a dynamic ingestion pipeline and a chat interface that can communicate with large language models (LLMs) and vector databases.

You can assemble various components, not only to perform data ingestion but also to provide a robust backend for the chat interface. This backend facilitates entering prompts and generates dependable responses during interactions. However, creating the code to manage and control all these elements can prove challenging, which is the case for most solutions.

Azure Logic Apps offers a low code approach and simplifies backend management by providing prebuilt connectors that you use as building blocks to streamline the backend process. This approach lets you focus on sourcing your data and making sure that search results provide current and relevant information. With these AI connectors, your workflow acts as an orchestration engine that transfers data between AI services and other components that you want to integrate.

For more information, see the following resources:

- [Introduction to large language models](/training/modules/introduction-large-language-models/)
- [Guide to working with large language models](/ai/playbook/technology-guidance/generative-ai/working-with-llms/)
- [What is a vector database](/semantic-kernel/memories/vector-db)

## Connector technical reference

### Azure OpenAI

Azure OpenAI Service provides access to [OpenAI's language models](https://openai.com/product), which include GPT-4, GPT-4 Turbo with Vision, GPT-3.5-Turbo, and the Embeddings model series. With the Azure OpenAI connector, your workflow can connect to Azure OpenAI Service and get OpenAI embeddings for your data or generate chat completions.

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks without using an on-premises data gateway. <br><br>For more information, see [Azure OpenAI built-in connector reference](/azure/logic-apps/connectors/built-in/reference/openai). |

### Azure AI Search

Azure AI Search is platform for AI-powered information retrieval that helps developers build rich search experiences and generative AI apps by combining large language models with enterprise data. With the Azure AI Search connector, your workflow can connect to Azure AI Search to index documents and perform vector searches on your data.

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks without using an on-premises data gateway. <br><br>For more information, see [Azure AI Search built-in connector reference](/azure/logic-apps/connectors/built-in/reference/azureaisearch). |

### Authentication

Both AI connectors support multiple ways to authenticate with your AI service endpoint. These options provide robust authentication that meets most customers' needs. Both AI connectors can also directly connect to Azure OpenAI and Azure AI Search services inside virtual networks. 

The following list describes these options, all which require that you provide the service's endpoint. 

| Authentication type | Description |
|---------------------|-------------|
| Key-based authentication | Provide the API key or admin generated by the AI service. |
| Microsoft Entra ID, previously Azure Active Directory | Provide information such as your Entra tenant, client ID, and password to authenticate as an Entra user. |
| Managed identity | After you enable managed identity authentication on your AI service and your logic app resource, you can use that identity to authenticate access for the connector. |

For more information, see the following resources:

- [Authenticate requests to Azure AI services](../../ai-services/authentication.md)
- [What is Microsoft Entra ID](/entra/fundamentals/whatis)
- [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)
- [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../authenticate-with-managed-identity.md?tabs=standard)

## Add an Azure OpenAI or Azure AI Search action to your workflow

Currently, the built-in connectors for Azure OpenAI and Azure AI Search provide only actions, not triggers. You can start your workflow with any trigger that fits your scenario or needs, and then [follow these general steps to add actions for Azure OpenAI, Azure AI Search, and other operations](../create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

## Scenarios

The following scenarios describe only two of the many ways that you can use AI connector operations in your workflows:

### Create a knowledge base for your enterprise data 

Azure Logic Apps provides [over 1,000 Microsoft-managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) and [natively running built-in connectors](/azure/logic-apps/connectors/built-in/reference/) for your workflow to securely connect with almost any data source, such as SharePoint, Oracle DB, Salesforce, OneDrive, Dropbox, SAP, IBM, and so on. Each connector provides operations, which include triggers, actions, or both, for you to use in your workflow.

For example, you can select from many trigger types to make your automated workflow run on a schedule or based on specific events, such as the uploading of new documents to a SharePoint site. With so many operations for you to choose, you can create a knowledge base and easily build a document ingestion pipeline using vector embeddings for these documents in Azure AI Search.

For more information, see the following resources:

- [Vectors in Azure AI Search](../../search/vector-search-overview.md)
- [What are embeddings](/semantic-kernel/memories/embeddings)
- [Understand embeddings in Azure OpenAI](../../ai-services/openai/concepts/understand-embeddings.md)

### Generate completions

An Azure Logic Apps workflow can accept input, while Azure OpenAI Service can perform completion operations. These capabilities mean that your workflow can ingest real-time questions, generate answers about your data, or send automated responses using Azure OpenAI. You can immediately send the responses back to the client or to an approval workflow for verification.

For more information, see the following resources:

- [Introduction to prompt engineering](../../ai-services/openai/concepts/prompt-engineering.md)
- [Learn how to generate or manipulate text](../../ai-services/openai/how-to/completions.md)

## Example scenario with sample code: Ingest data and create chat interactions

This example shows how to use the Azure OpenAI and Azure AI Search connectors to break down the backend logic for ingesting data and conducting simple chat conversations into two key workflows. For faster performance, create stateless workflows that, by default, don't save and store the history for each run.

### Sample code

[Create a chat using ingested data](https://github.com/Azure/logicapps/tree/master/ai-sample)

### Prerequisites

See the [sample code requirements](https://github.com/Azure/logicapps/tree/master/ai-sample#prerequisites).

The following [cross-environment parameter values](../create-parameters-workflows.md) are also used by the workflow operations in this example:

| Parameter name | Description |
|----------------|-------------|
| **aisearch_admin_key** | The admin key for Azure AI Search |
| **aisearch_endpoint** | The endpoint URL for the Azure AI Search example |
| **aisearch_index_name** | The index to use for the Azure AI Search example |
| **openapi_api_key** | The API key for Azure OpenAI |
| **openai_deployment_id** | The deployment ID for the Azure OpenAI example |
| **openai_endpoint** | The endpoint URL for the Azure OpenAI example |
| **tokenize_function_url** | The URL for a custom Azure function that batches and tokenizes data, which is required for Azure OpenAI to properly create embeddings for this example. <br><br>For more information about this function, see the [sample code for "Create a chat using ingested data"](https://github.com/Azure/logicapps/tree/master/ai-sample). |

### Video: Learn how to build AI applications using logic apps

[Learn how to build AI applications using logic apps](https://www.youtube.com/watch?v=tiU5yCvMW9o)

### Ingest data workflow

To save considerable time and effort when you build an ingestion pipeline, implement the following pattern with any data source. This pattern encapsulates all the advantages and benefits currently offered by Standard workflows in single-tenant Azure Logic Apps.

Each step in this pattern makes sure that the AI seamlessly extracts all the crucial information from your data files. If run as a stateless workflow, this pattern also provides faster performance. This approach simplifies not only the coding aspect but also guarantees that your workflows have effective authentication, monitoring, and deployment processes in place.

:::image type="content" source="media/azure-ai/ingest-data-workflow.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and workflow operations that implement data ingestion functionality." lightbox="media/azure-ai/ingest-data-workflow.png":::

| Step | Task | Underlying operation | Description |
|------|------|----------------------|-------------|
| 1 | Check for new data. | **When an HTTP request is received** | A trigger that either polls or waits for new data to arrive, either based on a scheduled recurrence or in response to specific events respectively. Such an event might be a new file that's uploaded to a specific storage system, such as SharePoint, OneDrive, or Azure Blob Storage. <br><br>In this example, the **Request** trigger operation waits for an HTTP or HTTPS request sent from another endpoint. The request includes the URL for a new uploaded document. |
| 2 | Get the data. | **HTTP** | An **HTTP** action that retrieves the uploaded document using the file URL from the trigger output. |
| 3 | Compose document details. | **Compose** | A **Data Operations** action that concatenates various items. <br><br>This example concatenates key-value information about the document. |
| 4 | Tokenize the data. | **HTTP** | An **HTTP** action that calls a custom Azure function that [batches and tokenizes](../../ai-services/openai/overview.md#tokens) the output from the **Compose** action. |
| 5 | Convert tokenized data to JSON. | **Parse JSON** | A **Data Operations** action that converts the tokenized string output into a JSON array. |
| 6 | Select JSON array items. | **Select** | A **Data Operations** action that selects multiple items from the JSON array. |
| 7 | Generate the embeddings. | **Get multiple embeddings** | An **Azure OpenAI** action that creates embeddings for each JSON array item. |
| 8 | Select embeddings and other information. | **Select** | A **Data Operations** action that selects embeddings and other document information. | 
| 9 | Index the data. | **Index documents** | An **Azure AI Search** action that indexes the data based on each selected embedding. |

### Chat workflow

As your vector databases continue to ingest data, make sure the data is easily searchable so that when a user asks a question, the backend logic app workflow can process the prompt and generate a reliable response.

The following pattern is only one example that shows how a chat workflow might look:

:::image type="content" source="media/azure-ai/chat-workflow.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and workflow operations that implement a chat interaction." lightbox="media/azure-ai/chat-workflow.png":::

| Step | Task | Underlying operation | Description |
|------|------|----------------------|-------------|
| 1 | Wait for input prompt. | **When an HTTP request is received** | A trigger that either polls or waits for new data to arrive, either based on a scheduled recurrence or in response to specific events respectively. <br><br>In this example, the **Request** trigger waits for and captures the customer's question. |
| 2 | Input system message for the model. | **Compose** | A **Data Operations** action that provides input to train the model. |
| 3 | Input sample questions and responses. | **Compose** | A **Data Operations** action that provides sample customer questions and associated roles to train the model. | 
| 4 | Input system message for search query. | **Compose** | A **Data Operations** action that provides search query input to train the model. | 
| 5 | Generate search query. | **Execute JavaScript Code** | An **Inline Code** action that uses JavaScript to create a search query for the vector store, based on the outputs from the preceding **Compose** actions. |
| 6 | Convert query to embedding. | **Get chat completions** | An **Azure OpenAI** action that connects to the chat completion API, which guarantees reliable responses in chat conversations. <br><br>In this example, the action accepts search queries and roles as input to the model and returns vector embeddings as output. |
| 7 | Get an embedding. | **Get an embedding** | An **Azure OpenAI** action that gets a single vector embedding. |
| 8 | Search the vector database. | **Search vectors** | An **Azure AI Search** action that executes searches in the vector store. |
| 9 | Create prompt. | **Execute JavaScript Code** | An **Inline Code** action that uses JavaScript to build prompts. |
| 10 | Perform chat completion. | **Get chat completions** | An **Azure OpenAI** action that connects to the chat completion API, which guarantees reliable responses in chat conversations. <br><br>In this example, the action accepts prompts and roles as input to the model and returns model-generated responses as output. |
| 11 | Return a response. | **Response** | A **Request** action that returns the results to the caller when you use the **Request** trigger. |

## See also

[Azure OpenAI and AI Search connectors for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/public-preview-of-azure-openai-and-ai-search-in-app-connectors/ba-p/4049584)
