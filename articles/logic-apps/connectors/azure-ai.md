---
title: Connect to Azure AI services
description: Connect to Azure OpenAI and Azure AI Search from a Standard workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/01/2024
---

# Connect to Azure AI services from a Standard workflow in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To integrate enterprise data and services with AI technologies, you can use the Azure OpenAI and Azure AI Search built-in connectors in automated Standard logic app workflows. These connectors support multiple authentication types, such as API keys, Microsoft Entra ID, and managed identities. They can also connect to Azure OpenAI Service and Azure AI Search endpoints behind firewalls so that your workflows securely connect to your AI resources in Azure.

This guide provides an overview and examples for how to use the Azure OpenAI and Azure AI Search connector operations in your workflow.

- [What is Azure OpenAI Service](../../ai-services/openai/overview)
- [What is Azure AI Search](../../search/search-what-is-azure-search)

## Why use Azure Logic Apps to integrate with AI services?

Usually, building AI solutions involves several key steps and requires a few building blocks. Primarily, you need to have a dynamic ingestion pipeline and a chat interface that can communicate with large language models (LLMs) and vector databases.

You can assemble various components, not only to perform data ingestion but also to provide a robust backend for the chat interface. This backend facilitates entering prompts and generates dependable responses during interactions. However, creating the code to manage and control all these elements can prove challenging, which is the case for most solutions.

Azure Logic Apps offers a low code approach and simplifies backend management by providing prebuilt connectors that you use as building blocks to streamline the backend process. This approach lets you focus on sourcing your data and making sure that search results provide current and relevant information. With these AI connectors, your workflow acts as an orchestration engine that transfers data between AI services and other components that you want to integrate.

For more information, see the following resources:

- [Introduction to large language models](/training/modules/introduction-large-language-models/) and 
- [Guide to working with large language models](/ai/playbook/technology-guidance/generative-ai/working-with-llms/)
- [What is a vector database](/semantic-kernel/memories/vector-db)

## Example scenarios

The following scenarios describe only a couple examples for how you can use AI connectors in your workflow:

### Create a knowledge base for your enterprise data 

Azure Logic Apps provides [over 1,000 Microsoft-managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) and [natively running built-in connectors](/azure/logic-apps/connectors/built-in/reference/) for your workflow to securely connect with almost any data source, such as SharePoint, Oracle DB, Salesforce, OneDrive, Dropbox, SAP, IBM, and so on. Each connector provides operations, which include triggers, actions, or both, for you to use in your workflow.

For example, you can select from many trigger types to make your automated workflow run on a schedule or based on specific events, such as the uploading of new documents to a SharePoint site. With so many operations for you to choose, you can create a knowledge base and easily build a document ingestion pipeline using vector embeddings for these documents in Azure AI Search.

For more information, see the following resources:

- [Vectors in Azure AI Search](../../search/vector-search-overview.md)
- [What are embeddings](/semantic-kernel/memories/embeddings)
- [Understand embeddings in Azure OpenAI](../../ai-services/openai/concepts/understand-embeddings)

## Generate completions

An Azure Logic Apps workflow can accept input, while Azure OpenAI Service can perform completion operations. These capabilities mean that your workflow can ingest real-time questions, generate answers about your data, or send automated responses using Azure OpenAI. You can immediately send the responses back to the client or to an approval workflow for verification.

For more information, see the following resources:

- [Introduction to prompt engineering](../../ai-services/openai/concepts/prompt-engineering)
- [Learn how to generate or manipulate text](../../ai-services/openai/how-to/completions)

## Connector technical reference

### Azure OpenAI

Azure OpenAI Service provides access to [OpenAI's powerful language models](https://openai.com/product), which include GPT-4, GPT-4 Turbo with Vision, GPT-3.5-Turbo, and the Embeddings model series. With the Azure OpenAI connector, your workflow can connect to Azure OpenAI Service and get OpenAI embeddings for your data or generate chat completions.

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks without using an on-premises data gateway. |

| Operation name | Description |
|----------------|-------------|
| **Gets single embedding** ||
| **Gets multiple embeddings** ||
| **Gets chat completions** ||

### Azure AI Search

Azure AI Search is platform for AI-powered information retrieval that helps developers build rich search experiences and generative AI apps by combining large language models with enterprise data. With the Azure AI Search connector, your workflow can connect to Azure AI Search to index documents and perform vector searches on your data.

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks without using an on-premises data gateway. |

| Operation name | Description |
|----------------|-------------|
| **Index a document** ||
| **Index documents** ||
| **Vector search** ||

### Authentication

Both AI connectors support multiple ways to authenticate with your AI service endpoint. These options provide robust authentication that meets most customers' needs. Both AI connectors can also directly connect to Azure OpenAI and Azure AI Search services inside virtual networks. 

The following list describes these options, all which require that you provide the service's endpoint. 

| Authentication type | Description |
|---------------------|-------------|
| Key-based authentication | Provide the API key or admin generated by the AI service. |
| Microsoft Entra ID, previously Azure Active Directory | Provide information such as your Entra tenant, client ID, and password to authenticate as an Entra user. |
| Managed identity | After you enable managed identity authentication on your AI service and your logic app resource, you can use that identity to authenticate access for the connector. |

For more information, see the following resources:

- [Authenticate requests to Azure AI services](../../ai-services/authentication)
- [What is Microsoft Entra ID](/entra/fundamentals/whatis)
- [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)
- [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../authenticate-with-managed-identity?tabs=standard)

## Example: Ingest data and create chat

This example shows how to use the Azure OpenAI and Azure AI Search connectors to break down the backend logic for ingesting data and conducting simple chat conversations into two key workflows. For faster performance, create stateless workflows that, by default, don't save and store the history for each run.

### Prerequisites

[Requirements](https://github.com/Azure/logicapps/tree/master/ai-sample#prerequisites)

### Sample link

[Create a chat with your data](https://github.com/Azure/logicapps/tree/master/ai-sample)

### Data ingestion workflow

To save considerable time and effort when you build an ingestion pipeline, implement the following pattern with any data source. This approach simplifies not only the coding aspect but also guarantees that your workflows have effective authentication, monitoring, and deployment processes in place.

Each step in this process not only provides faster performance when run in a stateless workflow, but also makes sure that the AI seamlessly extracts all the crucial information from your data files. This pattern encapsulates all the advantages and benefits currently offered by Standard workflows in single-tenant Azure Logic Apps.

| Step | Task | Underlying operation | Description |
|------|------|----------------------|-------------|
| 1 | Check for new data. | **When an HTTP request is received** | A trigger that monitors for new documents, either based on a scheduled recurrence or in response to specific events, such as an uploaded new file in a specific storage system, for example, SharePoint, OneDrive, or Azure Blob Storage. |
| 2 | Get the data's location. | **HTTP** | An action that gets the URL for the document in the specified storage system. |
| 3 | Get the data. | **Compose** | A **Data Operations** action that concatenates strings. |
| 4 | Tokenize the data. | **HTTP** | An action that [tokenizes output from the **Compose** action](../../ai-services/openai/overview#tokens). |
| 5 | Convert data to JSON. | **Parse JSON** | A **Data Operations** action that converts the tokenized output to a JSON array. |
| 6 | | **Select** | A **Data Operations** action that selects outputs from the JSON array. |
| 7 | Generate the embeddings. | **Get multiple embeddings** | An **Azure OpenAI** action that creates embeddings. |
| 8 | Select the data and embeddings. | **Select** | A **Data Operations** action that selects the JSON outputs and embeddings. | 
| 9 | Index the data. | **Index documents** | An **Azure AI Search** action that indexes the selected content. |

### Chat workflow

As your vector databases continue to ingest data, make sure the data is easily searchable so that when a user asks a question, the backend logic app workflow can process the prompt and generate a reliable response.

The following pattern is only one example that shows how a chat workflow might look:

1. Capture the prompt.

   Add a trigger that captures the customer's question in JSON format. This example uses the Request trigger.

1. Train the model. 

   Add an action that adapts to sample responses. This example is modeled on the GitHub example.

1. Generate the query.

   Add an action that crafts search queries for the vector database.

1. Convert the query into an embedding.

   Add an action that transforms queries into vector embeddings.

1. Run the vector search.

   Execute searches in the chosen database.

1. Create prompt. 

   Add an action that uses straightforward JavaScript to build prompts.
	
1. Perform chat completion.

   Add an action that connects to the chat completion API, which guarantees reliable responses in chat conversations.

## See also

[Azure OpenAI and AI Search connectors for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/public-preview-of-azure-openai-and-ai-search-in-app-connectors/ba-p/4049584)