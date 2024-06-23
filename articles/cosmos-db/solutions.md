---
title: Best practices and solutions using AI
titleSuffix: Azure Cosmos DB
description: Review solution accelerators using both Azure Cosmos DB and Azure OpenAI. The solutions integrate AI with vector search capabilities.
author: seesharprun
ms.author: sidandrews
ms.reviewer: wangwilliam
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: best-practice
ms.date: 02/27/2024
zone_pivot_groups: azure-cosmos-db-apis-nosql-mongodb
---

# Best practices and solutions using AI and Azure Cosmos DB

::: zone pivot="api-nosql"

Use Azure Cosmos DB for NoSQL as a database for your AI-powered applications so you can grow your database as your application grows. You can also rely on the speed of Azure Cosmos DB and built-in reliability to ensure that your solution is fast and available as your needs change over time.

## Modernize AI applications

Implement vector search and an AI assistant using Azure Cosmos DB for NoSQL, Azure OpenAI, Azure Kubernetes Service, and Azure AI Search.

:::image type="content" source="media/solutions/modernize-apps-screenshot.png" alt-text="Screenshot of an AI assistants application responding to queries about various bikes for a retail shop.":::

:::image type="complex" source="media/solutions/modernize-apps-diagram.png" alt-text="Diagram of the architecture of the application modernization solution accelerator.":::
Diagram illustrating a Kubernetes-backed web application using Azure AI Search, Azure OpenAI, Azure Storage, and Azure Cosmos DB and backing services. Vectors and items are persisted in Azure Cosmos DB while files are persisted in Azure Storage.
:::image-end:::

| | Link |
| --- | --- |
| **Solution accelerator** | <https://github.com/Azure/Vector-Search-AI-Assistant/tree/cognitive-search-vector> |
| **Hackathon** | <https://github.com/Azure/Build-Modern-AI-Apps-Hackathon> |

## Payment and transaction processing

Use Azure Front Door, Azure OpenAI, Azure Kubernetes Service, Azure Static Web Apps, and Azure Cosmos DB for NoSQL to implement a payment tracking process.

:::image type="complex" source="media/solutions/payment-processing-diagram.png" alt-text="Diagram of the architecture of the payment processing solution accelerator.":::
Diagram illustrating a service that uses an Azure Static Web App and Azure Front Door as a customer interface. The solution then hosts a combination of payment APIs and worker services to process payment transactions in Azure Kubernetes Service. Finally, the Kubernetes containers store data in Azure Cosmos DB and retrieve AI completions from Azure OpenAI.
:::image-end:::

| | Link |
| --- | --- |
| **Solution accelerator** | <https://github.com/Azure/Real-time-Payment-Transaction-Processing-at-Scale> |
| **Hackathon** | <https://github.com/Azure/Real-Time-Transactions-Hackathon> |

## Medical claims transaction processing

Process complex medical claims using a solution build with Azure Event Hubs, Azure Static Web Apps, Azure Kubernetes Service, Azure OpenAI, an Azure Cosmos DB for NoSQL.

:::image type="complex" source="media/solutions/claims-processing-diagram.png" alt-text="Diagram of the architecture of the claims processing solution accelerator.":::
Diagram Illustrating an external system ingesting claims using Azure Event Hubs. Concurrently, agents are interesting with an Azure Static Web App. Worker Services and APIs are hosted in Azure Kubernetes Service. The containers use Azure OpenAI for completions. The containers also store data in Azure Cosmos DB for NoSQL, which is then analyzed and manged using Azure Synapse Analytics.
:::image-end:::

| | Link |
| --- | --- |
| **Solution accelerator** | <https://github.com/Azure/Medical-Claims-Transaction-Processing-at-scale> |
| **Hackathon** | <https://github.com/Azure/Medical-Claims-Processing-Hackathon> |

## Automate AI solutions

Automate the deployment of AI-powered solutions using tools like the new Azure Developer CLI. Use this automation to create a modern developer and operations workflow.

| | Link |
| --- | --- |
| **Sample chat application** | <https://github.com/Azure-Samples/cosmosdb-chatgpt> |
| **Training module** | [https://learn.microsoft.com/training/modules/build-chat-bot-azure-cosmos-db-openai-blazor](/training/modules/build-chat-bot-azure-cosmos-db-openai-blazor) |

::: zone-end

::: zone pivot="api-mongodb"

Use Azure Cosmos DB for MongoDB vCore as a database for your AI-powered applications so you can grow your database as your application grows. You can also rely on the speed of Azure Cosmos DB and built-in reliability to ensure that your solution is fast and available as your needs change over time.

## Retrieval augmented generation

Implement the RAG pattern using a combination of Azure Cosmos DB for MongoDB vCore, Azure OpenAI, Azure Functions, and Azure Web Apps.

| | Link |
| --- | --- |
| **Solution accelerator** | <https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore> |
| **Python notebook** | <https://github.com/Microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore> |

::: zone-end

## Next step

> [!div class="nextstepaction"]
> [Vector database](vector-database.md)
