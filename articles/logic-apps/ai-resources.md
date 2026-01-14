---
title: AI Playbook, Examples, and Samples
description: Learn about AI integration examples, samples, and other resources for Standard and Consumption workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: concept-article
ms.collection: ce-skilling-ai-copilot
ms.date: 09/14/2025
ms.update-cycle: 180-days
#Customer intent: As an AI developer, I want a guide that introduces starting points, building blocks, examples, samples, and other resources so I can learn how I can use AI in my integration solutions using Standard and Consumption workflows in Azure Logic Apps.
---

# Playbook, examples, samples, and other resources for AI workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

AI capabilities play a fast and growing role in applications and other software by performing useful, time-saving, or novel tasks like chat interactions. These capabilities can also work with other services, systems, apps, and data sources to help build integration workloads for enterprises and organizations.

This guide provides building blocks, examples, and other resources that show how to use AI services like Azure OpenAI, Azure AI Foundry, and Azure AI Search with Azure Logic Apps to build automated workflows for AI integration solutions.

## AI agent and model-powered workflows (Preview)

Azure Logic Apps supports Standard logic app workflows that complete tasks by using *agents* with *large language models* (LLMs). An agent uses an iterative looped process to solve complex, multistep problems. An LLM is a trained program that recognizes patterns and performs jobs without human interaction.

For example, an LLM can perform the following tasks:

- Analyze, interpret, and reason about information such as instructions, prompts, and inputs.
- Make decisions based on results and available data.
- Formulate and return answers to the prompter based on the agent's instructions.

After you create a Standard logic app, you can add a workflow that uses the **Autonomous Agents** or **Conversational Agents** workflow type. These workflow types create a partial workflow that includes an empty **Agent** action. Based on your selected workflow type, you can then set up the agent to work without or with human interaction, which happens through an integrated chat interface.

> [!TIP]
>
> If you choose to start with a nonagent **Stateful** workflow, 
> you can always add an **Agent** action later.

The agent uses natural language and the connected LLM to interpret previously provided instructions or real-time human interactions, respectively. The agent also uses model-generated outputs to do work. The model helps the agent provide the following capabilities:

- Accept information about the agent's role, how to operate, and how to respond.
- Receive and respond to instructions and prompt requests.
- Process inputs, analyze data, and make choices based on available information.
- Choose *tools* to complete the tasks necessary to fulfill requests. In AI scenarios, a tool is a sequence with one or more actions that complete a task.
- Adapt to environments that require flexibility and are fluid, dynamic, unpredictable, or unstable.

With [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) available to help you build tools for agents to use, agent workflows support many scenarios that greatly benefit from agent and model capabilities.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Documentation** | [Workflows with AI agents and models in Azure Logic Apps](agent-workflows-concepts.md) |
| **Documentation** | [Create autonomous agent workflows in Azure Logic Apps](create-autonomous-agent-workflows.md) |
| **Documentation** | [Create conversational agent workflows in Azure Logic Apps](create-conversational-agent-workflows.md) |
| **Lab** | [Build your first autonomous agent workflow in Azure Logic Apps](https://azure.github.io/logicapps-labs/docs/logicapps-ai-course/build_autonomous_agents/create-first-autonomous-agent) |
| **Lab** | [Build your first conversational agent workflow in Azure Logic Apps](https://azure.github.io/logicapps-labs/docs/logicapps-ai-course/build_conversational_agents/create-first-conversational-agent) |
| **Blog article** | [Ushering in the era of multi-agentic business process automation](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%8E%89-azure-logic-apps-ushering-in-the-era-of-multi-agentic-business-process-automa/4452275) |
| **Video demo** | [Codeful and declarative multiple agents](https://youtu.be/sQaAzhkzT6E) |

## Building blocks for AI solutions

This section describes built-in operations and links to documentation that helps you build Standard workflows for AI integration scenarios, such as document ingestion. These operations make it possible for customers to "chat with the data."

For example, the **Azure OpenAI** and **Azure AI Search** connectors provide operations that simplify backend processes with codeless setup. These operations don't require any custom code, logic, or configuration to use.

This no-code approach reduces the complexity around integrating AI capabilities into your workflows. You can automate complex workflows for tasks like document parsing, data chunking, or powering AI models to unlock your data's full potential with minimal effort.

AI building blocks, such as built-in operations and connectors, are available for both Consumption and Standard workflows. The examples, samples, and resources use Standard workflows for illustration.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Video overview** | [Modernize enterprise integration with Azure Integration Services](https://www.youtube.com/watch?v=FneX7J4Zj_k) |
| **Video overview** | [Integrate AI into your workflows with Azure Logic Apps](https://www.youtube.com/live/Lxw9epgl_FM) |
| **Video overview** | [Accelerate generative AI development with Azure Logic Apps - Integrate 2024](https://youtu.be/HSl8OI-aT3A) |

### Prepare your content

The following built-in actions and connectors help you prepare content for consumption by AI services, data ingestion, and chat interactions.

| Name | Capabilities |
|------|--------------|
| **Parse a document** | This built-in action converts content into tokenized string output, so a workflow can read and parse thousands of documents with file types such as PDF, DOCX, CSV, PPT, HTML, and others in multiple languages. <br><br>This action helps you prepare content for consumption by Azure AI services in your workflows. For example, connector operations for Azure AI services such as **Azure OpenAI** and **Azure AI Search** usually expect tokenized input and can handle only a limited number of tokens. |
| **Chunk text** | This built-in action splits a tokenized string into pieces for easier consumption by subsequent actions in the same workflow. This action helps you prepare content for consumption by Azure AI services in your workflows. Connector operations for Azure AI services such as **Azure OpenAI** and **Azure AI Search** usually expect tokenized input and can handle only a limited number of tokens. |
| **Azure OpenAI** | This built-in connector provides operations for AI capabilities such as ingesting data, generating embeddings, and chat completion that are critical for creating sophisticated AI applications. You can integrate the natural language processing capabilities in Azure OpenAI with the intelligent search capabilities in Azure AI Search and other connectors. These integrations help you access and work with vector stores without needing to write code. |

### Data indexing and vector databases

The following connectors provide operations for data indexing and retrieval when you work with vector databases, search, and standard databases.

| Name | Capabilities |
|------|--------------|
| **Azure AI Search** | This built-in connector provides operations for AI capabilities such as enhancing data retrieval with indexing, advanced vector operations, and hybrid search operations. |
| **SQL Server** | This built-in connector provides operations for working with rows, tables, and stored procedures in SQL databases. |
| **Azure Cosmos DB** | This managed connector provides operations for working with documents and stored procedures in a globally distributed, elastic, independently scalable, and multimodel databases. <br><br>**Note**: This service was formerly named Azure DocumentDB. |

### More resources

For more information, see the following resources:

| Resource type | Release | Link |
|---------------|---------|------|
| **Documentation** | Various | [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text) |
| **Documentation** | Various | [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai) |
| **Documentation** | Various | [Azure OpenAI built-in operations reference](/azure/logic-apps/connectors/built-in/reference/openai) |
| **Documentation** | Various | [Azure AI Search built-in operations reference](/azure/logic-apps/connectors/built-in/reference/azureaisearch) |
| **Documentation** | Various | [Connect to SQL database from workflows in Azure Logic Apps](/azure/connectors/connectors-create-api-sqlazure?tabs=standard) |
| **Documentation** | Various | [SQL Server built-in operations reference](/azure/logic-apps/connectors/built-in/reference/sql) |
| **Documentation** | Various | [Process and create documents in Azure Cosmos DB with Azure Logic Apps](/azure/connectors/connectors-create-api-cosmos-db?tabs=standard) |
| **Documentation** | Various | [Azure Cosmos DB connector reference](/connectors/documentdb) |
| **Blog article** | Generally available | [Azure OpenAI and Azure AI Search connectors are now generally available for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%93%A2-announcement-azure-openai-and-azure-ai-search-connectors-are-now-generally-av/4163682) |
| **Blog article** | Generally available | [Automate RAG indexing: Azure Logic Apps & AI Search for source document processing](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/automate-rag-indexing-azure-logic-apps--ai-search-for-source-document-processing/4266083) |
| **Blog article** | Public preview | [Azure OpenAI and Azure AI Search connectors are in public preview for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584) |
| **Demo video** | Generally available | [Build an end-to-end RAG-based AI application with Azure Logic Apps (Standard)](https://youtu.be/6QO4hKBmTR0) |
| **Demo video** | Public preview | [Ingest document data into Azure AI Search and chat with data using Azure Logic Apps](https://youtu.be/tiU5yCvMW9o) |
| **GitHub sample** | Generally available | [Create a chat with your data (RAG) - Azure Logic Apps project](https://github.com/Azure/logicapps/tree/master/LogicApps-AI-RAG-Demo) |
| **GitHub sample** | Public preview | [Create a chat with your data - Azure Logic Apps project](https://github.com/Azure/logicapps/tree/master/ai-sample) |

## Near real time chat with data

The following sections describe ways that you can set up near-real time chat capabilities for your data using Azure Logic Apps and various AI services.

### Build Azure OpenAI Assistants with Azure Logic Apps

With Azure OpenAI, you can easily build agent-like features into your applications by using the Assistants API. Although the capability to build agents existed previously, the process often required significant engineering, external libraries, and multiple integrations.

With Assistants, you can now rapidly create customized stateful copilots that are trained on their enterprise data and can handle diverse tasks by using the latest Generative Pretrained Transformer (GPT) models, tools, and knowledge. The current release includes features such as File Search and Browse tools, enhanced data security features, improved controls, new models, and expanded region support. These enhancements ease the transition from prototyping to production.

You can now build Assistants by calling Azure Logic Apps workflows as AI functions. You can discover, import, and invoke workflows in Azure OpenAI Studio from the Azure OpenAI Assistants playground without writing any code. The Assistants playground enumerates and lists all the workflows in your subscription that are eligible for function calling.

To test Assistants with function calling, you can import workflows as AI functions using a browse and select experience. Function specification generation and other configurations are automatically pulled from Swagger for your workflow. Function calling invokes workflows based on user prompts. All the appropriate parameters are passed in based on the definition.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Documentation** | [Call Azure Logic Apps workflows as functions using Azure OpenAI Assistants](/azure/ai-services/openai/how-to/assistants-logic-apps) |
| **Blog article** | [Build Azure OpenAI assistants with function calling](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/announcing-azure-openai-service-assistants-public-preview-refresh/4143217) |
| **Blog article** | [Azure AI Assistants with Azure Logic Apps](https://techcommunity.microsoft.com/discussions/azure-ai-services/azure-ai-assistants-with-logic-apps/4246711) |
| **Demo video** | [Azure Logic Apps as an AI plugin](https://youtu.be/cW0t2WvqtCc) |

### Integrate with Semantic Kernel

This lightweight, open-source development kit helps you easily build AI agents and integrate the latest AI models into your C#, Python, or Java codebase. At the simplest level, the kernel is a dependency injection container that manages all services and plugins that your AI application needs to run.

If you provide all your services and plugins to the kernel, the AI seamlessly uses these components as needed. As the central component, the kernel serves as an efficient middleware that helps you quickly deliver enterprise-grade solutions.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Integrate Standard logic app workflows as plugins with Semantic Kernel: Step-by-step guide](https://techcommunity.microsoft.com/blog/integrationsonazureblog/integrate-logic-app-workflows-as-plugins-with-semantic-kernel-step-by-step-guide/4210854) |
| **GitHub sample** | [Semantic Kernel for Azure Logic Apps](https://github.com/Azure/logicapps/tree/shahparth-lab-patch-2-semantic-kernel/Git-SK) |
| **Documentation** | [Introduction to Semantic Kernel](/semantic-kernel/overview/) |

## Manage intelligent document collection and processing

You can use Azure AI Document Intelligence and Azure Logic Apps to build intelligent document processing workflows. The Document Intelligence connector provides operations that help you extract text and information from various documents. Document Intelligence helps you manage the speed in collecting and processing massive amounts of data stored in forms and documents with a wide variety of data types.

> [!NOTE]
>
> The Document Intelligence connector is currently named **Form Recognizer** in the workflow 
> designer's connector gallery for Azure Logic Apps. You can find the connector's operations, 
> which are hosted and run in multitenant Azure, under the **Shared** label in the gallery.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Documentation** | [Create a Document Intelligence workflow with Azure Logic Apps](/azure/ai-services/document-intelligence/tutorial/logic-apps) |
| **Documentation** | [Form Recognizer connector reference](/connectors/formrecognizer) |
| **Demo video** | [Invoice processing with Azure Logic Apps and AI](https://youtu.be/mXyI7EpYLyw?feature=shared) |

<a name="rag-details"></a>

## Retrieval-augmented generation (RAG)

Generative AI models or LLMs like ChatGPT are trained to generate output for tasks such as answering questions and completing sentences by using large volumes of static data and billions of parameters. [Retrieval-augmented generation](/azure/search/retrieval-augmented-generation-overview) adds information retrieval capabilities to an LLM and modifies its interactions so it can respond to user queries by referencing content that augments its training data.

An LLM can use RAG to let chatbots access domain-specific or updated information. RAG can help you implement use cases that incorporate internal company data or factual information provided by an authoritative source.

RAG extends an LLM's already powerful capabilities to specific domains or an organization's internal knowledge base without having to retrain the model. The RAG architecture also provides a cost-effective approach to improving and keeping LLM output relevant, accurate, and useful.

### RAG examples

The following examples show ways that apply or implement the RAG pattern using Standard workflows in Azure Logic Apps.

#### Create an end-to-end RAG-based AI application with Azure Logic Apps

[Build an end-to-end RAG-based AI application with Azure Logic Apps (Standard)](https://youtu.be/6QO4hKBmTR0)

#### Chat with insurance data

This example uses a classic RAG pattern where a workflow ingests an insurance company's documents and data so that employees can ask questions about their benefits and options for plan coverage. For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Azure OpenAI and Azure AI Search connectors are in public preview for Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584) |
| **Demo video** | [Ingest document data into your Azure AI Search service and chat with your data with Azure Logic Apps](https://youtu.be/tiU5yCvMW9o) |
| **GitHub sample** | [Create a chat with your data - Standard logic app project](https://github.com/Azure/logicapps/tree/master/ai-sample) |

#### Automate answers to StackOverflow questions

This example shows how a workflow can automatically answer new StackOverflow questions that have a specific hashtag by using the **Azure OpenAI** and **Azure AI Search** connectors. The sample can ingest previous posts and product documentation. When a new question is available, the solution can automatically answer by using the knowledge base and then asking a human to approve the response before posting on StackOverflow.

You can customize this workflow to trigger daily, weekly, or monthly, and streamline community support by setting up your own automated response system for any hashtag. You can also adapt this solution for tickets in Outlook, ServiceNow, or other platforms by using Azure Logic Apps connectors for secure access.

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Automate responses to StackOverflow queries using Azure OpenAI and Azure Logic Apps](https://techcommunity.microsoft.com/blog/integrationsonazureblog/automate-responses-to-stackoverflow-queries-using-openai-and-logic-apps/4182590) |
| **GitHub sample** | [Automate responses to unanswered StackOverflow questions](https://github.com/Azure/logicapps/tree/helpdesk-sample-1/testAILA) |

## Ingest documents and chat with data

Data is the cornerstone for any AI application and is unique for each organization. When you build an AI application, efficient data ingestion is critical for success. No matter where your data resides, you can integrate AI into new and existing business processes by building Standard workflows that use little or no code.

More than 1,400 enterprise connectors and operations let you use Azure Logic Apps to quickly access and perform tasks with a wide range of services, systems, applications, and databases. When you use these connectors with AI services like Azure OpenAI and Azure AI Search, your organization can transform workloads like the following:

- Automate routine tasks.
- Enhance customer interactions with chat capabilities.
- Provide access to organizational data when necessary.
- Generate intelligent insights or responses.

For example, when you integrate AI services by using the **Azure OpenAI** and **Azure AI Search** connector operations in your workflows, your organization can seamlessly implement the RAG pattern. RAG minimizes cost by using an information retrieval system to reference domain-specific or authoritative knowledge and augment an LLM's training without having to retrain the model. For more information, see the [Retrieval-augmented generation (RAG)](#rag-details) and the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Ingest documents for generative AI applications from 1,000+ data sources using Azure Logic Apps](https://techcommunity.microsoft.com/blog/integrationsonazureblog/document-ingestion-for-gen-ai-applications-using-logic-apps-from-1000-data-sourc/4250675) | 
| **Demo video** | [Ingest document based on RAG using Azure Logic Apps (Standard)](https://youtu.be/4Gv5Amv82yY) |

## Quickstart with workflow templates

To support AI integration and help you quickly build your applications, Azure Logic Apps includes prebuilt workflow templates that ingest data from many common data sources, such as SharePoint, Azure File Storage, Blob Storage, and Secure File Transfer Protocol (SFTP). When you add a new workflow to your Standard or Consumption logic app, you can select a prebuilt template as your starting point.

Each template follows a common workflow pattern that supports a specific scenario. You can also create workflow templates that you can then share with other workflow developers by publishing them in the GitHub templates repository.

The following table describes some example workflow templates:

| Document source | Template description | AI services used |
|-----------------|----------------------|------------------|
| Azure AI Document Intelligence | Standard: Analyze complex documents using Azure OpenAI. | Azure OpenAI |
| Azure Blob Storage | Standard: <br>- Ingest and index files using the RAG pattern. <br>- Ingest and vectorize documents into Azure Cosmos DB for NoSQL using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |
| Azure File Storage | Standard: <br>- Ingest documents into AI Search on a schedule. <br>- Ingest and index files on a schedule using the RAG pattern. <br>- Ingest and index files using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |
| Request-based | Standard: <br>- Chat with your documents using the RAG pattern. <br>- Ingest and index documents using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |
| OneDrive for Business | Consumption: <br>- Vectorize files from OneDrive for Business to AI Search on a schedule. <br><br>Standard: <br>- Ingest and index files using the RAG pattern. <br>- Ingest documents from OneDrive to AI Search on a schedule. | - Azure OpenAI <br>- Azure AI Search |
| SAP | Consumption: <br>- Synchronize business partners to SharePoint folder using OData. |
| SFTP | Standard: Ingest and index files using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |
| SharePoint Online | Consumption: <br>- Vectorize files from SharePoint Online to AI Search on request. <br><br>Standard: <br>- Ingest and index files using the RAG pattern. <br>- Index documents to AI Search. Retrieve and reason with Azure OpenAI LLMs using the RAG pattern. | - Azure OpenAI <br>- Azure AI Search |

For more information, see the following resources:

| Resource type | Link |
|---------------|------|
| **Blog article** | [Templates for Azure Logic Apps Standard are now in public preview](https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%93%A2-announcement-templates-for-azure-logic-apps-standard-are-now-in-public-previe/4224229) |
| **Demo video** | [Standard workflow templates for Azure Logic Apps](https://youtu.be/6Fvy4fkad3M) |
| **Documentation** | [Create a Standard workflow in single-tenant Azure Logic Apps](/azure/logic-apps/create-single-tenant-workflows-azure-portal) |
| **Documentation** | [Create and publish workflow templates for Azure Logic Apps](/azure/logic-apps/create-publish-workflow-templates) |
| **Documentation** | [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text) |
| **Documentation** | [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai) |

## Related content

- [Parse or chunk content for Standard workflows in Azure Logic Apps](/azure/logic-apps/parse-document-chunk-text)
- [Connect to Azure AI services from Standard workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai)
