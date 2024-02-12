---
title: Real-time apps with Azure SignalR Service and Azure Functions
description: Learn about how Azure SignalR Service and Azure Functions together allow you to create real-time serverless web applications.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 02/14/2023
ms.author: lianwei
---

# Real-time apps with Azure SignalR Service and Azure Functions

Azure SignalR Services combined with Azure Functions allows you to run real-time messaging web apps in a serverless environment. This article provides an overview of how the services work together.

Azure SignalR Service and Azure Functions are both fully managed, highly scalable services that allow you to focus on building applications instead of managing infrastructure. It's common to use the two services together to provide real-time communications in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment.

## Integrate real-time communications with Azure services

The Azure Functions service allows you to write code in [several languages](../azure-functions/supported-languages.md), including JavaScript, Python, C#, and Java that triggers whenever events occur in the cloud. Examples of these events include:

- HTTP and webhook requests
- Periodic timers
- Events from Azure services, such as:
  - Event Grid
  - Event Hubs
  - Service Bus
  - Azure Cosmos DB change feed
  - Storage blobs and queues
  - Logic Apps connectors such as Salesforce and SQL Server

By using Azure Functions to integrate these events with Azure SignalR Service, you have the ability to notify thousands of clients whenever events occur.

Some common scenarios for real-time serverless messaging that you can implement with Azure Functions and SignalR Service include:

- Visualize IoT device telemetry on a real-time dashboard or map.
- Update data in an application when documents update in Azure Cosmos DB.
- Send in-app notifications when new orders are created in Salesforce.

## SignalR Service bindings for Azure Functions

The SignalR Service bindings for Azure Functions allow an Azure Function app to publish messages to clients connected to SignalR Service. Clients can connect to the service using a SignalR client SDK that is available in .NET, JavaScript, and Java, with more languages coming soon.

<!-- Are there more lanaguages now? -->

### An example scenario

An example of how to use the SignalR Service bindings is using Azure Functions to integrate with Azure Cosmos DB and SignalR Service to send real-time messages when new events appear on an Azure Cosmos DB change feed.

![Azure Cosmos DB, Azure Functions, SignalR Service](media/signalr-concept-azure-functions/signalr-cosmosdb-functions.png)

1. A change is made in an Azure Cosmos DB collection.
2. The change event is propagated to the Azure Cosmos DB change feed.
3. An Azure Functions is triggered by the change event using the Azure Cosmos DB trigger.
4. The SignalR Service output binding publishes a message to SignalR Service.
5. The SignalR Service publishes the message to all connected clients.

### Authentication and users

SignalR Service allows you to broadcast messages to all or a subset of clients, such as those belonging to a single user. You can combine the SignalR Service bindings for Azure Functions with App Service authentication to authenticate users with providers such as Microsoft Entra ID, Facebook, and Twitter. You can then send messages directly to these authenticated users.

## Next steps

For full details on how to use Azure Functions and SignalR Service together visit the following resources:

- [Azure Functions development and configuration with SignalR Service](signalr-concept-serverless-development-config.md)
- [Enable automatic updates in a web application using Azure Functions and SignalR Service](/training/modules/automatic-update-of-a-webapp-using-azure-functions-and-signalr)

To try out the SignalR Service bindings for Azure Functions, see:

- [Azure SignalR Service Serverless Quickstart - C#](signalr-quickstart-azure-functions-csharp.md)
- [Azure SignalR Service Serverless Quickstart - JavaScript](signalr-quickstart-azure-functions-javascript.md)
- [Enable automatic updates in a web application using Azure Functions and SignalR Service](/training/modules/automatic-update-of-a-webapp-using-azure-functions-and-signalr).
