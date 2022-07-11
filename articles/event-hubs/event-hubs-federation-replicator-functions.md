---
title: Event replication tasks and applications - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of building event replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 09/28/2021
---

# Event replication tasks and applications with Azure Functions

> [!TIP]
> For all stateful replication tasks where you need to consider the payloads of your events and 
> transform, aggregate, enrich, or reduce them, use [Azure Stream
Analytics](../stream-analytics/stream-analytics-introduction.md) instead of Azure Functions.

As explained in the [event replication and cross-region federation](event-hubs-federation-overview.md) article, stateless replication of event streams between pairs of Event Hubs and between Event Hubs and other event stream sources and targets leans on Azure Functions.

[Azure Functions](../azure-functions/functions-overview.md) is a scalable and reliable execution environment for configuring and running serverless applications, including event replication and federation tasks.

In this overview, you will learn about Azure Functions' built-in capabilities for such applications, about  code blocks that you can adapt and modify for transformation tasks, and about how to configure an Azure Functions application such that it integrates ideally with Event Hubs and other Azure Messaging services. For many details, this article will point to the Azure Functions documentation.

[!INCLUDE [messaging-replicator-functions](../../includes/messaging-replicator-functions.md)]









