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

To integrate enterprise data and services with AI technologies, you can use the Azure OpenAI Service and Azure AI Search built-in connectors in your automated workflows. These connectors support multiple authentication types, such as connection keys, Microsoft Entra, and managed identities. They also connect to Azure OpenAI and Azure AI Search endpoints behind firewalls so that your workflows connect securely to your AI resources in Azure.

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

The following scenarios describe only a few ways that you can use AI connectors in your workflow:

### Build a knowledge base from your enterprise data 

With over 1,000 connectors, Azure Logic Apps can securely connect to almost any data source, such as SharePoint, Oracle DB, 

With many types of triggers, you can make these automations run on a schedule or based on events such as arrivals of new documents in a SharePoint site. 

So, you can build a knowledge base with vector embeddings for these documents in Azure AI Search. 

easily build a document ingestion pipelines 



For more information, see the following resources:

- [Vectors in Azure AI Search](../../search/vector-search-overview.md)
- [What are embeddings](/semantic-kernel/memories/embeddings)
- [Understand embeddings in Azure OpenAI](../../ai-services/openai/concepts/understand-embeddings)

Generating completions 


With Azure OpenAI’s completion operation, you can generate responses to questions about your data. For example, you can generate answers to real-time questions or automate responses to emails. With Logic Apps ability to accept input, your user's question can be ingested into your workflow and response to those questions can be generated using the Azure OpenAI’s completion operation. You can immediately send those responses back to the client or send them to an approval workflow for verification. 

## Connector technical reference

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks with a connection string without an on-premises data gateway. |

Azure OpenAI Service provides access to OpenAI's powerful language models including the GPT-4, GPT-4 Turbo with Vision, GPT-3.5-Turbo, and Embeddings model series. More information on Azure OpenAI here. The Azure OpenAI provider enables you to connect your workflow to your Azure OpenAI service. Use this provider to get OpenAI embeddings for your data or generate chat completions.  



 Outlined below are just some of the scenarios these new built-in connectors can enable. 

