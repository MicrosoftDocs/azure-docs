---
title: Overview of Azure Service Bus throttling | Microsoft Docs
description: Overview of Service Bus throttling - Standard and Premium tiers.
services: service-bus-messaging
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.topic: article
ms.date: 10/01/2019
ms.author: aschhab

---

# Throttling requests on Azure Service Bus

Cloud native solutions give a notion of *virtually* unlimited resources that can scale with your workload. While this is more true in the cloud than it is with on-premise systems, there are still limitations that exist in the cloud.

This article touches on these limitations and what can be done to work around them.

## Throttling in Azure Service Bus Standard tier

The Azure Service Bus Standard tier operates as a multi-tenant setup with a pay-as-you-go pricing model where customers share the resources for their namespace with other namespaces that may be setup in the same region. It is the recommended choice for developer, testing and QA environments along with low throughput systems.

In the past, we've had coarse throttling limits, dependent on resource utilization, which in turn depends on the number of requests that are processed by the resources. However, this has been non-deterministic and has enabled *noisy neighbors* to cause other namespaces to be throttled.

In an attempt to ensure fair usage and distribution of resources across all the Azure Service Bus Standard namespaces that use the same resources, we've recently polished our throttling logic to be token-based.

> [!NOTE]
> It is important to note that throttling is ***not new*** to Azure Service Bus, or any cloud service.
>
> Token based throttling is simply refining the way various namespaces share resources in a multi-tenant Standard tier environment and thus enabling fair usage.

### What is token based throttling?

Token based throttling limits the number of operations that can be performed on a given namespace in a specific time period. 

This is the workflow - 

  * At the start of each time period, we provide a certain number of tokens to each namespace.
  * Any operations performed by the sender or receiver client applications will be counted against these tokens (and subtracted from the available tokens).
  * If the tokens are depleted, any subsequent operations will be throttled.
  * Tokens are replenished at the start of the next time period.

### What are the token limits?

The token limits are currently set to 'X' credits every 'Y' seconds.

Not all operations are created equal. Here are the token costs of each of the operations - 

  * Data operations (Send, SendAsync, Receive, ReceiveAsync) - 
  * Management operations (Create, Read, Update, Delete on Queues, Topics, Subscriptions, Filters) - 

> [!IMPORTANT]
> While the current token limits are large, we will eventually be reducing the limits to 60 credits per 2 seconds in a phased manner.
>
> It is recommended that when designing new solutions and architectures, the Azure Service Bus Standard tier throughput expectations should be ***30 operations/second***.

## Throttling in Azure Service Bus Premium tier

## FAQs

