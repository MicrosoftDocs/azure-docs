---
title: 'Tutorial: Migrate event data to Azure Synapse Analytics - Azure Event Hubs'
description: Describes how to use Azure Event Grid and Functions to migrate Event Hubs captured data to Azure Synapse Analytics.
services: event-hubs
ms.date: 12/07/2020
ms.topic: tutorial
ms.custom: devx-track-csharp
---

# Tutorial: Migrate captured Event Hubs data to Azure Synapse Analytics using Event Grid and Azure Functions
Azure Event Hubs [Capture](./event-hubs-capture-overview.md) enables you to automatically capture the streaming data in Event Hubs in an Azure Blob storage or Azure Data Lake Storage. This tutorial shows you how to migrate captured Event Hubs data from Storage to Azure Synapse Analytics by using an Azure function that's triggered by [Event Grid](../event-grid/overview.md).

[!INCLUDE [event-grid-event-hubs-functions-synapse-analytics.md](../../includes/event-grid-event-hubs-functions-synapse-analytics.md)]

## Next steps 
You can use powerful data visualization tools with your data warehouse to achieve actionable insights.

This article shows how to use [Power BI with Azure Synapse Analytics](/power-bi/connect-data/service-azure-sql-data-warehouse-with-direct-connect)