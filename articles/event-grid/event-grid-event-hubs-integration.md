---
title: 'Tutorial: Send Event Hubs data to data warehouse - Event Grid'
description: Describes how to store Event Hubs captured data in Azure Synapse Analytics via Azure Functions and Event Grid triggers. 
ms.topic: tutorial
ms.date: 12/07/2020
ms.custom: devx-track-csharp
---

# Tutorial: Stream big data into a data warehouse
Azure [Event Grid](overview.md) is an intelligent event routing service that enables you to react to notifications or events from apps and services. For example, it can trigger an Azure Function to process Event Hubs data that's captured to a Blob storage or Data Lake Storage. This [sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/e2e/EventHubsCaptureEventGridDemo) shows you how to use Event Grid and Azure Functions to migrate captured Event Hubs data from blob storage to Azure Synapse Analytics, specifically a dedicated SQL pool.

[!INCLUDE [event-grid-event-hubs-functions-synapse-analytics.md](./includes/event-grid-event-hubs-functions-synapse-analytics.md)]

## Next steps

* To learn about differences in the Azure messaging services, see [Choose between Azure services that deliver messages](compare-messaging-services.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* For an introduction to Event Hubs Capture, see [Enable Event Hubs Capture using the Azure portal](../event-hubs/event-hubs-capture-enable-through-portal.md).
* For more information about setting up and running the sample, see [Event Hubs Capture and Event Grid sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/e2e/EventHubsCaptureEventGridDemo).
