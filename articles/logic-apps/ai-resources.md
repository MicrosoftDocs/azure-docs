---
title: AI playbook, examples, and samples
description: Learn about AI integration examples, samples, and other resources using Standard and Consumption workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: conceptual
ms.date: 01/23/2025
#CustomerIntent: I want a guide that introduces starting points, building blocks, examples, samples, and other resources to help me learn about using AI in my integration solutions using Standard and Consumption workflows in Azure Logic Apps.
---

# AI playbook, examples, and other resources for workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

AI capabilities play a fast and growing role in applications and other software by performing useful, time-saving, or novel tasks, such as chat interactions. These capabilities also help you build integration workloads across services, systems, apps, and data in your enterprise or organization.

This guide provides building blocks, examples, samples, and other resources that help show how to use AI services, such as Azure OpenAI and Azure AI Search, alongside other services, systems, apps, and data that work together in integration solutions built as automated workflows in Azure Logic Apps.

> [!NOTE]
>
> AI building blocks, such as built-in operations and connectors, are available for both Consumption and 
> Standard workflows. However, the examples, samples, and resources use Standard workflows as examples. 
> Stay tuned as this article evolves over time with more guidance.

## Building blocks for AI solutions

This section describes built-in operations and links to documentation that you can use to build Standard workflows for AI integration scenarios, such as document ingestion and making it possible for customers to "chat with the data."

For example, the **Azure OpenAI** and **Azure AI Search** connectors provide operations that simplify backend processes with codeless setup and reduce complexity around integrating AI capabilities into your workflows. These operations don't require any custom code, logic, or configuration to use. This no-code approach helps you automate complex workflows whether the task is document parsing, data chunking, or powering generative AI models, which helps you unlock your data's full potential with minimal effort.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Video overview** | - [Modernize enterprise integration with Azure Integration Services](https://ignite.microsoft.com/sessions/BRK150) <br><br>- [Integrate AI into your workflows with Azure Logic Apps](https://www.youtube.com/live/Lxw9epgl_FM) <br><br>- [Accelerate generative AI development with Azure Logic Apps - Integrate 2024](https://youtu.be/HSl8OI-aT3A) |

#### Prep your content

The following operations help you prepare content for consumption by AI services, data ingestion, and chat interactions:

| Name | Connector or operation? | Capabilities |
|------|-------------------------|--------------|
| **Parse a document** | Action <br>(built in)| Converts content into tokenized string output so that a workflow can read and parse thousands of documents with file types such as PDF, DOCX, CSV, PPT, HTML, and others in multiple languages. <br><br>This action helps you prepare content for consumption by Azure AI services in your workflows. For example, connector operations for Azure AI services such as **Azure OpenAI** and **Azure AI Search** usually expect tokenized input and can handle only a limited number of tokens. |
| **Chunk text** | Action <br>(built in) | Splits a tokenized string into pieces for subsequent actions to more easily consume in the same workflow. <br><br>This action helps you prepare content for consumption by Azure AI services in your workflows. For example, connector operations for Azure AI services such as **Azure OpenAI** and **Azure AI Search** usually expect tokenized input and can handle only a limited number of tokens. |
| **Azure OpenAI** | Connector <br>(built in) | Provides operations for AI capabilities such as ingesting data, generating embeddings, and chat completion, which are critical for creating sophisticated AI applications. You can integrate the natural language processing capabilities in Azure OpenAI with the intelligent search capabilities in Azure AI Search and other connectors that help you access and work with vector stores without having to write code. |

#### Data indexing and vector databases

The following connectors provide operations for data indexing and retrieval, working with vector databases, search, and standard databases.

| Name | Connector | Capabilities |
|------|-----------|--------------|
| **Azure AI Search** | Connector <br>(built in) | Provides operations for AI capabilities such as enhancing data retrieval with indexing, advanced vector operations, and hybrid search operations. |
| **SQL Server** | Connector <br>(built in) | Provides operations for working with rows, tables, and stored procedures in an SQL database. |
| **Azure Cosmos DB** | Connector <br>(Azure-managed and hosted) | Provides operations for working with documents and stored procedures in a globally distributed, elastic, independently scalable, and multi-model database. <br><br>**Note**: This service was previously named Azure DocumentDB. |

#### More resources

For more information, see the following resources:

| Resource type | Release | Link |
|---------------|---------|------|
| **Documentation** | Various | - [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text) <br><br>- [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai) <br><br>- [Azure OpenAI built-in operations reference](/azure/logic-apps/connectors/built-in/reference/openai) <br><br>- [Azure AI Search built-in operations reference](/azure/logic-apps/connectors/built-in/reference/azureaisearch)  <br><br>- [Connect to SQL database from workflows in Azure Logic Apps](/azure/connectors/connectors-create-api-sqlazure?tabs=standard) <br><br>- [SQL Server built-in operations reference](/azure/logic-apps/connectors/built-in/reference/sql)  <br><br>- [Process and create documents in Azure Cosmos DB with Azure Logic Apps](/azure/connectors/connectors-create-api-cosmos-db?tabs=standard) <br><br>- [Azure Cosmos DB connector reference](/connectors/documentdb) |
| **Blog article** | Generally available | - [Azure OpenAI and Azure AI Search connectors are now generally available for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%93%A2-announcement-azure-openai-and-azure-ai-search-connectors-are-now-generally-av/4163682) <br><br>- [Automate RAG indexing: Azure Logic Apps & AI Search for source document processing](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/automate-rag-indexing-azure-logic-apps--ai-search-for-source-document-processing/4266083) |
| **Blog article** | Public preview | [Azure OpenAI and Azure AI Search connectors are in public preview for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584) |
| **Demo video** | Generally available | [Build an end-to-end RAG-based AI application with Azure Logic Apps (Standard)](https://youtu.be/6QO4hKBmTR0) |
| **Demo video** | Public preview | [Ingest document data into Azure AI Search and chat with data using Azure Logic Apps](https://youtu.be/tiU5yCvMW9o) |
| **GitHub sample** | Generally available | [Create a chat with your data (RAG) - Azure Logic Apps project](https://github.com/Azure/logicapps/tree/master/LogicApps-AI-RAG-Demo) |
| **GitHub sample** | Public preview | [Create a chat with your data - Azure Logic Apps project](https://github.com/Azure/logicapps/tree/master/ai-sample) |

## Near real time chat with data

The following sections describe ways that you can set up near-real time chat capabilities for your data using Azure Logic Apps and various AI services.

#### Build Azure OpenAI Assistants with Azure Logic Apps

With Azure OpenAI, you can easily build agent-like features into your applications by using the Assistants API. Although the capability to build agents previously existed, the process often required significant engineering, external libraries, and multiple integrations. However, now with Assistants, you can rapidly create customized stateful copilots that are trained on their enterprise data and can handle diverse tasks by using the latest GPT models, tools, and knowledge. The current release includes features such as File Search and Browse tools, enhanced data security features, improved controls, new models, expanded region support, and various enhancements that make it easy to go from prototyping to production.

You can now build Assistants by calling Azure Logic Apps workflows as AI functions. Without writing any code, you can discover, import, and invoke workflows in Azure OpenAI Studio from the Azure OpenAI Assistants playground. The Assistants playground enumerates and lists all the workflows in your subscription that are eligible for function calling.

To test Assistants with function calling, you can import workflows as AI functions using a browse and select experience. Function specification generation and other configurations are automatically pulled from Swagger for your workflow. Function calling invokes workflows based on user prompts, while all the appropriate parameters are passed in based on the definition.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | - [Build Azure OpenAI assistants with function calling](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/announcing-azure-openai-service-assistants-public-preview-refresh/4143217) <br><br>- [Azure AI Assistants with Azure Logic Apps](https://techcommunity.microsoft.com/discussions/azure-ai-services/azure-ai-assistants-with-logic-apps/4246711) |
| **Demo video** | [Azure Logic Apps as an AI plugin](https://youtu.be/cW0t2WvqtCc) |
| **Documentation** | [Call Azure Logic Apps workflows as functions using Azure OpenAI Assistants](/azure/ai-services/openai/how-to/assistants-logic-apps) |

#### Integrate with Semantic Kernel

This lightweight, open-source development kit helps you easily build AI agents and integrate the latest AI models into your C#, Python, or Java codebase. At the simplest level, the kernel is a dependency injection container that manages all services and plugins that your AI application needs to run. If you provide all your services and plugins to the kernel, the AI seamlessly uses these components as needed. As the central component, the kernel serves as an efficient middleware that helps you quickly deliver enterprise-grade solutions.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Integrate Standard logic app workflows as plugins with Semantic Kernel: Step-by-step guide](https://techcommunity.microsoft.com/blog/integrationsonazureblog/integrate-logic-app-workflows-as-plugins-with-semantic-kernel-step-by-step-guide/4210854) |
| **GitHub sample** | [Semantic Kernel for Azure Logic Apps](https://github.com/Azure/logicapps/tree/shahparth-lab-patch-2-semantic-kernel/Git-SK) |
| **Documentation** | [Introduction to Semantic Kernel](/semantic-kernel/overview/) |

## Manage intelligent document collection and processing

With Azure AI Document Intelligence and Azure Logic Apps, you can build intelligent document processing workflows when you have massive amounts of data with a wide variety of data types that is stored in forms and documents. Document Intelligence helps you manage the speed around collecting and processing data. In Azure Logic Apps, the Document Intelligence connector provides operations that help you extract text and other information from various documents.

> [!NOTE]
>
> The Document Intelligence connector is currently named **Form Recognizer** in the workflow 
> designer's connector gallery for Azure Logic Apps. You can find the connector's operations, 
> which are hosted and run in multitenant Azure, under the **Shared** label in the gallery.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Demo video** | [Invoice processing with Azure Logic Apps and AI](https://youtu.be/mXyI7EpYLyw?feature=shared) |
| **Documentation** | - [Create a Document Intelligence workflow with Azure Logic Apps](/azure/ai-services/document-intelligence/tutorial/logic-apps) <br>- [Form Recognizer connector reference](/connectors/formrecognizer) |

<a name="rag-details"></a>

## Retrieval-augmented generation (RAG)

To generate original output for tasks such as answering questions and completing sentences, generative AI models or large language models (LLM) such as ChatGPT are trained using vast volumes of static data and billions of parameters. [Retrieval-augmented generation](/azure/search/retrieval-augmented-generation-overview) is a way to add information retrieval capabilities to an LLM and modify its interactions so that the LLM can respond to user queries by referencing content that augments the model's own training data. With this capability, an LLM can use domain-specific or updated information and implement use cases for providing chatbot access to internal company data or factual information provided by an authoritative source.

RAG extends an LLM's already powerful capabilities to specific domains or an organization's internal knowledge base without having to retrain the model. The RAG architecture also provides a cost-effective approach to improve and keep LLM output relevant, accurate, and useful.

#### Examples

The following examples show ways that apply or implement the RAG pattern using Standard workflows in Azure Logic Apps.

##### Create an end-to-end RAG-based AI application with Azure Logic Apps

[Build an end-to-end RAG-based AI application with Azure Logic Apps (Standard)](https://youtu.be/6QO4hKBmTR0)

##### Chat with insurance data

This example uses a classic RAG pattern where a workflow ingests an insurance company's documents and data so that employees can ask questions about their benefits and options for plan coverage.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Azure OpenAI and Azure AI Search connectors are in public preview for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584) |
| **Demo video** | [Ingest document data into your Azure AI Search service and chat with your data with Azure Logic Apps](https://youtu.be/tiU5yCvMW9o) |
| **GitHub sample** | [Create a chat with your data - Standard logic app project](https://github.com/Azure/logicapps/tree/master/ai-sample) |

##### Automate answers to StackOverflow questions

This example shows how a workflow can automatically answer new StackOverflow questions with a specific hashtag by using the **Azure OpenAI** and **Azure AI Search** connectors. The sample can ingest previous posts and product documentation so that when a new question is available, the solution can automatically answer by using the knowledge base and then asking a human to approve the response before posting on StackOverflow.

You can customize this workflow to trigger daily, weekly, or monthly, based on your preference, and set up your own automated response system for any hashtag, which streamlines community support. You can also adapt this solution for tickets in Outlook, ServiceNow, or other platforms by using Azure Logic Apps connectors for secure access.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Automate responses to StackOverflow queries using Azure OpenAI and Azure Logic Apps](https://techcommunity.microsoft.com/blog/integrationsonazureblog/automate-responses-to-stackoverflow-queries-using-openai-and-logic-apps/4182590) |
| **GitHub sample** | [Automate responses to unanswered StackOverflow questions](https://github.com/Azure/logicapps/tree/helpdesk-sample-1/testAILA) |

## Ingest documents and chat with data

Data is the cornerstone for any AI application and unique for each organization. When you build any AI application, efficient data ingestion is critical for success. No matter where your data resides, you can integrate AI into new and existing business processes using little or no code by building Standard workflows with Azure Logic Apps.

With over 1,400 enterprise connectors and operations, Azure Logic Apps makes it possible for you to quickly access and perform tasks with a wide range of services, systems, applications, and databases. When you use these connectors alongside AI services, such as Azure OpenAI and Azure AI Search, your organization can transform workloads such as automating routine tasks, enhancing customer interactions with chat capabilities, providing access to organizational data when necessary, and generating intelligent insights or responses. Along with these operations, Azure Logic Apps also offers prebuilt workflow templates that ingest data from many common data sources, such as SharePoint, Azure File Storage, Blob Storage, SFTP, and more, to help you quickly build and your applications.

For example, when you integrate AI services by using the **Azure OpenAI** and **Azure AI Search** connector operations in your workflows, your organization can seamlessly implement the retrieval-augmented generation (RAG) pattern. This architecture includes an information retrieval system and augments the training data for a large language model (LLM) by referencing domain-specific or authoritative knowledge without having to retrain the model, which minimizes cost. For more information, see the [Retrieval-augmented generation (RAG) section](#rag-details) later in this guide.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Ingest documents for generative AI applications from 1,000+ data sources using Azure Logic Apps](https://techcommunity.microsoft.com/blog/integrationsonazureblog/document-ingestion-for-gen-ai-applications-using-logic-apps-from-1000-data-sourc/4250675) | 
| **Demo video** | [Ingest document based on RAG using Azure Logic Apps (Standard)](https://youtu.be/4Gv5Amv82yY) |

## Quickstart with workflow templates

When you add a new workflow to your Standard logic app, you can select a prebuilt template as your starting point. Each template follows a common workflow pattern that supports a specific scenario. You can also create workflow templates that you can then share with other workflow developers by publishing them in the templates GitHub repository.

The following table describes some example workflow templates:

| Document source | Template description | AI services |
|-----------------|----------------------|-------------|
| SharePoint Online | Ingest and index files using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |
| OneDrive | Ingest and index files using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |
| Azure Blob Storage | Retrieve, parse, and chunk a file from a blob storage container. Process each chunk to generate embeddings, map embeddings to an Azure SQL DB table schema. Finally, index the files in a SQL DB vector table for retrieval and analysis. | - Azure OpenAI |

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Templates for Azure Logic Apps Standard are now in public preview](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%93%A2-announcement-templates-for-azure-logic-apps-standard-are-now-in-public-previe/4224229) |
| **Demo video** | [Standard workflow templates for Azure Logic Apps](https://youtu.be/6Fvy4fkad3M) |
| **Documentation** | - [Create a Standard workflow in single-tenant Azure Logic Apps](/azure/logic-apps/create-single-tenant-workflows-azure-portal) <br><br>- [Create and publish workflow templates for Azure Logic Apps](/azure/logic-apps/create-publish-workflow-templates) <br><br>- [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text) <br><br>- [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai) |

## Related content

- [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text)
- [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai)
