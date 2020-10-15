---
title: Azure Cache for Redis monitoring and troubleshooting FAQs
description: Learn the answers to common questions that help you monitor and troubleshoot Azure Cache for Redis
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 08/06/2020
---
# Azure Cache for Redis monitoring and troubleshooting FAQs
This article provides answers to common questions about how to monitor and troubleshoot Azure Cache for Redis.

## Common questions and answers
This section covers the following FAQs:

* [How do I monitor the health and performance of my cache?](#how-do-i-monitor-the-health-and-performance-of-my-cache)
* [Why am I seeing timeouts?](#why-am-i-seeing-timeouts)
* [Why was my client disconnected from the cache?](#why-was-my-client-disconnected-from-the-cache)

### How do I monitor the health and performance of my cache?
Microsoft Azure Cache for Redis instances can be monitored in the [Azure portal](https://portal.azure.com). You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. For more information, see [Monitor Azure Cache for Redis](cache-how-to-monitor.md).

The Azure Cache for Redis **Resource menu** also contains several tools for monitoring and troubleshooting your caches.

* **Diagnose and solve problems** provides information about common issues and strategies for resolving them.
* **Resource health** watches your resource and tells you if it's running as expected. For more information about the Azure Resource health service, see [Azure Resource health overview](../resource-health/resource-health-overview.md).
* **New support request** provides options to open a support request for your cache.

These tools enable you to monitor the health of your Azure Cache for Redis instances and help you manage your caching applications. For more information, see the "Support & troubleshooting settings" section of [How to configure Azure Cache for Redis](cache-configure.md).

### Why am I seeing timeouts?
Timeouts happen in the client that you use to talk to Redis. When a command is sent to the Redis server, the command is queued up and Redis server eventually picks up the command and executes it. However the client can time out during this process and if it does an exception is raised on the calling side. For more information on troubleshooting timeout issues, see [client-side troubleshooting](cache-troubleshoot-client.md) and [StackExchange.Redis timeout exceptions](cache-troubleshoot-timeouts.md#stackexchangeredis-timeout-exceptions).

### Why was my client disconnected from the cache?
The following are some common reason for a cache disconnect.

* Client-side causes
  * The client application was redeployed.
  * The client application performed a scaling operation.
    * In the case of Cloud Services or Web Apps, this may be due to autoscaling.
  * The networking layer on the client side changed.
  * Transient errors occurred in the client or in the network nodes between the client and the server.
  * The bandwidth threshold limits were reached.
  * CPU bound operations took too long to complete.
* Server-side causes
  * On the standard cache offering, the Azure Cache for Redis service initiated a fail-over from the primary node to the replica node.
  * Azure was patching the instance where the cache was deployed
    * This can be for Redis server updates or general VM maintenance.


## Next steps

For more information about monitoring and troubleshooting your Azure Cache for Redis instances, see [How to monitor Azure Cache for Redis](cache-how-to-monitor.md) and the various troubleshoot guides.

Learn about other [Azure Cache for Redis FAQs](cache-faq.md).
