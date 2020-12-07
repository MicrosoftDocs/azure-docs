---
title: 'Tutorial: Send Event Hubs data to data warehouse - Event Grid'
description: 'Tutorial: Describes how to use Azure Event Grid and Event Hubs to migrate data to a Azure Synapse Analytics. It uses an Azure Function to retrieve a Capture file.'
ms.topic: tutorial
ms.date: 07/07/2020
ms.custom: devx-track-csharp, devx-track-azurecli
---

# Tutorial: Stream big data into a data warehouse
Azure [Event Grid](overview.md) is an intelligent event routing service that enables you to react to notifications (events) from apps and services. For example, it can trigger an Azure Function to process Event Hubs data that has been captured to an Azure Blob storage or Azure Data Lake Storage, and migrate the data to other data repositories. This [Event Hubs and Event Grid integration sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/e2e/EventHubsCaptureEventGridDemo) shows you how to use Event Hubs with Event Grid to seamlessly migrate captured Event Hubs data from blob storage to a Azure Synapse Analytics.

![Application overview](media/event-grid-event-hubs-integration/overview.png)

This diagram depicts the workflow of the solution you build in this tutorial: 

1. Data sent to an Azure event hub is captured in an Azure blob storage.
2. When the data capture is complete, an event is generated and sent to an Azure event grid. 
3. The event grid forwards this event data to an Azure function app.
4. The function app uses the blob URL in the event data to retrieve the blob from the storage. 
5. The function app migrates the blob data to an Azure Synapse Analytics. 

In this article, you take the following steps:

> [!div class="checklist"]
> * Use an Azure Resource Manager template to deploy the infrastructure: an event hub, a storage account, a function app, a dedicated SQL pool.
> * Create a table in the dedicated SQL pool.
> * Add code to the function app.
> * Subscribe to the event. 
> * Run app that sends data to the event hub.
> * View migrated data in data warehouse.

[!INCLUDE [event-grid-event-hubs-functions-synapse-analytics.md](../../includes/event-grid-event-hubs-functions-synapse-analytics.md)]

## Next steps

* To learn about differences in the Azure messaging services, see [Choose between Azure services that deliver messages](compare-messaging-services.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* For an introduction to Event Hubs Capture, see [Enable Event Hubs Capture using the Azure portal](../event-hubs/event-hubs-capture-enable-through-portal.md).
* For more information about setting up and running the sample, see [Event Hubs Capture and Event Grid sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/e2e/EventHubsCaptureEventGridDemo).
