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

This guide provides examples, samples, and other resources to help you learn how you can integrate Azure AI services, such as Azure OpenAI and Azure AI Search, with Standard workflows in Azure Logic Apps.

## AI-related operations documentation

The following sections describe built-in operations and documentation that you can use to build Standard workflows for AI integration scenarios, such as document ingestion and making it possible for customers to "chat with the data". 

### Parse a document and chunk text operations

The **Parse a document** and **Chunk text** built-in or "in-app" actions help you prepare content for Azure AI services to consume in your workflows. Connectors for Azure AI services such as **Azure OpenAI** and **Azure AI Search** usually expect tokenized input and can handle only a limited number of tokens.

| Action | Description |
|--------|-------------|
| **Parse a document** | This action converts content into tokenized string output so that a workflow can read and parse thousands of documents with file types such as PDF, DOCX, CSV, PPT, HTML, and others in multiple languages. |
| **Chunk text** | This action splits a tokenized string into pieces for subsequent actions in the same workflow to easily consume. |

Both these actions don't require any custom logic or configuration to use. This no-code approach helps you automate complex workflows whether the task is document parsing, data chunking, or powering generative AI models, which helps you unlock your data's full potential with minimal effort. 

For a guide that shows how to use these actions in your Standard workflow, see [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text).

### Azure OpenAI and Azure AI Search operations

The **Azure AI Search** and **Azure OpenAI** built-in or "in-app" connectors provide operations that help you integrate the natural language processing capabilities in Azure Open AI with the intelligent search capabilities in Azure AI Search. These connectors simplify backend processes with codeless setup and reduce complexity around integrating AI capabilities into your workflows.

| Connector | Description |
|-----------|-------------|
| **Azure OpenAI** | This connector provides operations with AI capabilities such as generate embeddings and chat completion, which are critical for creating sophisticated AI applications. |
| **Azure AI Search** | This connector provides operations that enhance data retrieval with indexing, advanced vector, and hybrid search operations. |

For a guide that shows how to use these connector operations in your Standard workflow, see [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai).

## Ingest documents and chat with data

Data is the cornerstone for any AI application and unique for each organization. When you build any AI application, efficient data ingestion is critical for success. Regardless where your data resides and with little or no code, you can more easily integrate AI into new and existing business processes by building Standard workflows with Azure Logic Apps.

With over 1,400 enterprise connectors and operations, Azure Logic Apps makes it possible for you to quickly access and perform tasks with a wide range of services, systems, applications, and databases. When you use these connectors alongside AI services, your organization can transform workloads such as automating routine tasks, enhancing customer interactions, and generating intelligent insights. 

Along with these operations, Azure Logic Apps also offers prebuilt workflow templates for data ingestion from many common data sources, such as SharePoint, Azure File Storage, Blob Storage, SFTP, and more, to help you quickly build and your applications.

For example, when you use operations from connectors such as **Azure OpenAI** and **Azure AI Search** in your workflows, your organization can seamlessly implement the retrieval-augmented generation (RAG) pattern. This architecture makes it easier to ingest and retrieve data from multiple sources.

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

## Build Assistants with Azure Logic apps

With Azure OpenAI, you can easily build agent-like features into your applications by using the Assistants API. Although the capability to build agents previously existed, the process often required significant engineering, external libraries, and multiple integrations. However, now with Assistants, you can rapidly create customized stateful copilots that are trained on their enterprise data and can handle diverse tasks by using the latest GPT models, tools, and knowledge. The current release includes features such as File Search and Browse tools, enhanced data security features, improved controls, new models, expanded region support, and various enhancements that make it easy to go from prototyping to production.

You can now build Assistants by calling Azure Logic Apps workflows as AI functions. Without writing any code, you can discover, import, and invoke workflows in Azure OpenAI Studio from the Azure OpenAI Assistants playground. The Assistants playground enumerates and lists all the workflows in your subscription that are eligible for function calling.

To test Assistants with function calling, you can import workflows as AI functions using a browse and select experience. Function specification generation and other configuration is automatically pulled from Swagger for your workflow. Function calling invokes workflows based on user prompts, while all the appropriate parameters are passed in based on the definition.

| Resource type | Link |
|---------------|------|
| **Blog article** | [Build Azure OpenAI assistants with function calling](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/announcing-azure-openai-service-assistants-public-preview-refresh/4143217) |

For more information, see [Call Azure Logic Apps workflows as functions using Azure OpenAI Assistants](/azure/ai-services/openai/how-to/assistants-logic-apps).

## Integrate with Semantic Kernel

This lightweight, open-source development kit helps you easily build AI agents and integrate the latest AI models into your C#, Python, or Java codebase. At the simplest level, the kernel is a dependency injection container that manages all services and plugins that your AI application needs to run. If you provide all your services and plugins to the kernel, the AI seamlessly uses these components as needed. As the central component, the kernel serves as an efficient middleware that helps you quickly deliver enterprise-grade solutions. For more information, see [Introduction to Semantic Kernel](/semantic-kernel/overview/).

| Resource type | Link |
|---------------|------|
| **Blog article** | [Integrate Standard logic app workflows as plugins with Semantic Kernel: Step-by-step guide](https://techcommunity.microsoft.com/blog/integrationsonazureblog/integrate-logic-app-workflows-as-plugins-with-semantic-kernel-step-by-step-guide/4210854) |
| **GitHub sample** | [Semantic Kernel for Azure Logic Apps](https://github.com/Azure/logicapps/tree/shahparth-lab-patch-2-semantic-kernel/Git-SK) |

## Related content
