---
title: 'Tutorial: Send Event Hubs data to data warehouse - Event Grid'
description: Describes how to store Event Hubs captured data in Azure Synapse Analytics via Azure Functions and Event Grid triggers. 
ms.topic: tutorial
ms.date: 11/14/2022
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Tutorial: Stream big data into a data warehouse
Azure [Event Grid](overview.md) is an intelligent event routing service that enables you to react to notifications or events from apps and services. For example, it can trigger an Azure function to process Event Hubs data that's captured to a Blob storage or Data Lake Storage. This [sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/e2e/EventHubsCaptureEventGridDemo) shows you how to use Event Grid and Azure Functions to migrate captured Event Hubs data from blob storage to Azure Synapse Analytics, specifically a dedicated SQL pool.

[!INCLUDE [event-grid-event-hubs-functions-synapse-analytics.md](./includes/event-grid-event-hubs-functions-synapse-analytics.md)]

## Next steps
* For more information about setting up and running the sample, see [Event Hubs Capture and Event Grid sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/e2e/EventHubsCaptureEventGridDemo).
* In this tutorial, you created an event subscription for the `CaptureFileCreated` event. For more information about this event and all the events supported by Azure Blob Storage, see [Azure Event Hubs as an Event Grid source](event-schema-event-hubs.md). 
* To learn more about the Event Hubs Capture feature, see [Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](../event-hubs/event-hubs-capture-overview.md).
* To learn about differences in the Azure messaging services, see [Choose between Azure services that deliver messages](compare-messaging-services.md).
