---
title: AI playbook, examples, and samples
description: Learn about examples, samples, and other resources for integrating AI with Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: conceptual
ms.date: 11/11/2024
#CustomerIntent: I want examples, samples, and other resources to help me learn how to integrate Ai into logic app workflows.
---

# AI playbook and examples for Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

This guide provides examples, samples, and other resources that can help learn how to integrate Azure AI services, such as Azure OpenAI and Azure AI Search, with Standard workflows in Azure Logic Apps.

## Documentation

- [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text)

  This guide shows how to convert content into tokens and split up content for easier consumption by Azure AI connectors, such as the **Azure AI Search** and **Azure OpenAI**.

In addition, the **Parse a document** and **Chunk text** operations help you prepare content for building document ingestion workflows so that you can make it possible for customers to "chat with the data".  
in a handful of steps without a single line of code

Without any custom logic or configuration, the **Parse a document** operation enables your workflow to read and parse thousands of documents in multiple languages and with file types such as PDF, DOCX, PPT, HTML, and more.

This no-code approach enables you to automate complex workflows—whether it’s document parsing, data chunking, or powering generative AI models—helping you unlock the full potential of your data with minimal effort.

 

by using the actions named [**Parse a document**] and [**Chunk text**](/azure/logic-apps/parse-document-chunk-text)

the Azure AI Search or Azure OpenAI actions expect tokenized input and can handle only a limited number of tokens.

For these scenarios, use the Data Operations actions named Parse a document and Chunk text in your Standard logic app workflow. These actions respectively transform content, such as a PDF document, CSV file, Excel file, and so on, into tokenized string output and then split the string into pieces, based on the number of tokens. You can then reference and use these outputs with subsequent actions in your workflow.

  For more information about the **Parse a document** and **Chunk text** operations, see [Blog articles](#blog-articles).

- [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai)

  This guide shows how to access Azure AI services, such as **Azure AI Search** and **Azure OpenAI**, from your Standard workflow and examples for how to use these connector operations.


<a name="blog-articles"></a>

## Azure OpenAI Assistants

| Resource type | Link |
|---------------|------|
| **Blog article** | [Build Azure OpenAI assistants with function calling](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/announcing-azure-openai-service-assistants-public-preview-refresh/4143217) |

For more information, see [Call Azure Logic Apps workflows as functions using Azure OpenAI Assistants](/azure/ai-services/openai/how-to/assistants-logic-apps).

## Document ingestion and chat with data

When you build any AI application, efficient data ingestion is critical for success. Azure Logic Apps includes over 1,400 enterprise connectors and operations that provide access to a wide range of services, systems, applications, and databases.

In addition to these out-of-the-box actions, Azure Logic Apps also offers pre-built templates for data ingestion from many common data sources, including SharePoint, Azure File Storage, Blob Storage, SFTP, and more, helping you rapidly build and deploy your applications.

By leveraging connectors like Azure OpenAI and Azure AI Search, businesses can seamlessly implement the Retrieval-Augmented Generation (RAG) pattern, allowing the ingestion and retrieval of data from multiple sources with ease.

| Resource type | Link |
|---------------|------|
| **Blog article** | [Ingest documents for generative AI applications from 1,000+ data sources using Azure Logic Apps](https://techcommunity.microsoft.com/blog/integrationsonazureblog/document-ingestion-for-gen-ai-applications-using-logic-apps-from-1000-data-sourc/4250675) | 
| **Demo video** | [Ingest document based on RAG using Azure Logic Apps (Standard)](https://youtu.be/4Gv5Amv82yY) |

### Azure OpenAI and Azure AI Search connectors (Generally available)


  | Resource type | Link |
  |---------------|------|
  | **Blog article** | [Azure OpenAI and Azure AI Search connectors are now generally available for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%93%A2-announcement-azure-openai-and-azure-ai-search-connectors-are-now-generally-av/4163682) |
  | **Demo video** | [Build an end-to-end RAG-based AI application with Azure Logic Apps (Standard)](https://youtu.be/6QO4hKBmTR0) |
  | **GitHub sample** | [Create a chat with your data - Azure Logic Apps project](https://github.com/Azure/logicapps/tree/master/LogicApps-AI-RAG-Demo). |

For more information, see [Automate RAG indexing: Azure Logic Apps & AI Search for source document processing](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/automate-rag-indexing-azure-logic-apps--ai-search-for-source-document-processing/4266083).

### Azure OpenAI and Azure AI Search connectors (Public Preview)

  | Resource type | Link |
  |---------------|------|
  | **Blog article** | [Azure OpenAI and Azure AI Search connectors are in public preview for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584) |
  | **Demo video** | [Ingest document data into Azure AI Search and chat with data using Azure Logic Apps](https://youtu.be/tiU5yCvMW9o) |
  | **GitHub sample** | [Create a chat with your data - Azure Logic Apps project](https://github.com/Azure/logicapps/tree/master/ai-sample). |

## Retrieval-augmented generation (RAG)

To generate original output for tasks such as answering questions and completing sentences, generative AI models or large language models (LLM) such as ChatGPT are trained using vast volumes of static data and billions of parameters. [Retrieval-augmented generation](/azure/search/retrieval-augmented-generation-overview) is a way to add information retrieval capabilities to an LLM and modify its interactions so that the LLM can respond to user queries by referencing specified documents, which augment the model's own training data. With this capability, an LLM can use domain-specific or updated information and implement use cases for providing chatbot access to internal company data or factual information provided by an authoritative source.

RAG extends an LLM's already powerful capabilities to specific domains or an organization's internal knowledge base without having to retrain the model. The RAG architecture also provides a cost-effective approach to improve and keep LLM output relevant, accurate, and useful.

### Examples

The following examples show ways that apply or implement the RAG pattern using Standard workflows in Azure Logic Apps.

#### Chat with insurance data

This example uses a classic RAG pattern where a workflow ingests an insurance company's documents and data so that employees can ask questions about their benefits and options for plan coverage.

| Resource type | Link |
|---------------|------|
| **Blog article** | [Azure OpenAI and Azure AI Search connectors are in public preview for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584) |
| **Demo video** | [Ingest document data into your Azure AI Search service and chat with your data with Azure Logic Apps](https://youtu.be/tiU5yCvMW9o) |
| **GitHub sample** | [Create a chat with your data - Standard logic app project](https://github.com/Azure/logicapps/tree/master/ai-sample) |

#### Automate answers to StackOverflow questions

This example shows how a workflow can automatically answer new StackOverflow questions with a specific hashtag by using the Azure AI Search and Azure OpenAI connectors. The sample can ingest previous posts and product documentation so that when a new question is available, the solution can automatically answer by using the knowledge base and then asking a human to approve the response before posting on StackOverflow.

You can customize this workflow to trigger daily, weekly, or monthly, based on your preference, and set up your own automated response system for any hashtag, which streamlines community support. You can also adapt this solution for tickets in Outlook, ServiceNow, or other platforms by using Azure Logic Apps connectors for secure access.

| Resource type | Link |
|---------------|------|
| **Blog article** | [Automate responses to StackOverflow queries using Azure OpenAI and Azure Logic Apps](https://techcommunity.microsoft.com/blog/integrationsonazureblog/automate-responses-to-stackoverflow-queries-using-openai-and-logic-apps/4182590) |
| **GitHub sample** | [Automate responses to unanswered StackOverflow questions](https://github.com/Azure/logicapps/tree/helpdesk-sample-1/testAILA) |

## Integrate with Semantic Kernel

This lightweight, open-source development kit helps you easily build AI agents and integrate the latest AI models into your C#, Python, or Java codebase. At the simplest level, the kernel is a dependency injection container that manages all services and plugins that your AI application needs to run. If you provide all your services and plugins to the kernel, the AI seamlessly uses these components as needed. As the central component, the kernel serves as an efficient middleware that helps you quickly deliver enterprise-grade solutions. For more information, see [Introduction to Semantic Kernel](/semantic-kernel/overview/).

| Resource type | Link |
|---------------|------|
| **Blog article** | [Integrate Standard logic app workflows as plugins with Semantic Kernel: Step-by-step guide](https://techcommunity.microsoft.com/blog/integrationsonazureblog/integrate-logic-app-workflows-as-plugins-with-semantic-kernel-step-by-step-guide/4210854) |
| **GitHub sample** | [Semantic Kernel for Azure Logic Apps](https://github.com/Azure/logicapps/tree/shahparth-lab-patch-2-semantic-kernel/Git-SK) |

## Related content
