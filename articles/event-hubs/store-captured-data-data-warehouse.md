---
title: 'Tutorial: Migrate event data to Azure Synapse Analytics - Azure Event Hubs'
description: 'Tutorial: This tutorial shows you how to capture data from your event hub into Azure Synapse Analytics by using an Azure function triggered by an event grid.' 
services: event-hubs
ms.date: 06/23/2020
ms.topic: tutorial
ms.custom: devx-track-csharp
---

# Tutorial: Migrate captured Event Hubs data to Azure Synapse Analytics using Event Grid and Azure Functions
Event Hubs [Capture](./event-hubs-capture-overview.md) is the easiest way to automatically deliver streamed data in Event Hubs to an Azure Blob storage or Azure Data Lake store. You can subsequently process and deliver the data to any other storage destinations of your choice, such as Azure Synapse Analytics or Cosmos DB. In this tutorial, you learn how you to capture data from your event hub into Azure Synapse Analytics by using an Azure function triggered by an [event grid](../event-grid/overview.md).

[!INCLUDE [event-grid-event-hubs-functions-synapse-analytics.md](../../includes/event-grid-event-hubs-functions-synapse-analytics.md)]

## Next steps 
You can use powerful data visualization tools with your data warehouse to achieve actionable insights.

This article shows how to use [Power BI with Azure Synapse Analytics](/power-bi/connect-data/service-azure-sql-data-warehouse-with-direct-connect)