---
title: Message replication tasks and applications - Azure Service Bus | Microsoft Docs
description: This article provides an overview of building message replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 09/28/2021
---

# Message replication tasks and applications

As explained in the [message replication and cross-region federation](service-bus-federation-overview.md) article, replication of message sequences between pairs of Service Bus entities and between Service Bus and other message sources and targets generally leans on Azure Functions.

[Azure Functions](../azure-functions/functions-overview.md) is a scalable and reliable execution environment for configuring and running serverless applications, including [message replication and federation](service-bus-federation-overview.md) tasks.

In this overview, you will learn about Azure Functions' built-in capabilities for such applications, about  code blocks that you can adapt and modify for transformation tasks, and about how to configure an Azure Functions application such that it integrates ideally with Service Bus and other Azure Messaging services. For many details, this article will point to the Azure Functions documentation.

[!INCLUDE [messaging-replicator-functions](../../includes/messaging-replicator-functions.md)]
