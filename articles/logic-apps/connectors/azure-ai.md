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

## Example workflow

For the backend logic, you can break this process down into two key workflows:

- Ingestion

Developers can set up triggers to retrieve PDF files, either on recurrence or in response to specific events, such as the arrival of a new file in a chosen storage system like SharePoint or OneDrive. Here's a simplified workflow process for how that ingestion may look like:

- Data acquisition: Retrieve data from any third-party storage system.
Data Tokenization: In this scenario, tokenizing a PDF document.
Embeddings Generation: Utilize Azure OpenAI to create embeddings.
Document Indexing: Index the document using AI Search.
thumbnail image 2 of blog post titled 
	
	
	 
	
	
	
				
		
			
				
						
							Use Logic Apps to build intelligent OpenAI applications
							
						
					
			
		
	
			
	
	
	
	
	

 

By implementing this pattern with any data sources, developers can save considerable time and effort while building ingestion pipelines. This approach simplifies not just the coding aspect but also guarantees that your workflows have effective authentication, monitoring, and deployment processes in place. Essentially, it encapsulates all the advantages offered by the Logic App (Standard) as of today.

 

Chat Workflow:

As data continues to be ingested in vector databases, it should be easily searchable so that when a user asks a question, logic apps backend can process the prompt and generate a reliable response.

Here is how chat workflow may look like:

Prompt capture: Capturing JSON via HTTP request trigger
Model training: Adapting to sample responses (modeled on GitHub example)
Query generation: Crafting search queries for vector database
Embedding conversion: Transforming queries into vector embeddings
Vector search operation: Executing searches in the preferred database
Prompt creation and chat completion: Use straightforward JavaScript to build prompts and connect with the chat completion API, guaranteeing reliable responses in chat conversations.
thumbnail image 3 of blog post titled 
	
	
	 
	
	
	
				
		
			
				
						
							Use Logic Apps to build intelligent OpenAI applications
							
						
					
			
		
	
			
	
	
	
	
	

 

Every step in the process, from generating embeddings and tokenizing to vector searching, not only promises swift performance due to the stateless workflow but also assures that the AI seamlessly extracts all crucial insights and information from your data files.

It goes without saying that in today's fast-paced tech environment, conserving time and development resources in creating OpenAI applications is crucial. That is why we are thrilled to share this capability, streamlining the process for developers to build dynamic ingestion or chat workflows with just a few essential building blocks.

 