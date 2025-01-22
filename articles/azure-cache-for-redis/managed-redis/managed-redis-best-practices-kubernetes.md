---
title: Best practices for hosting a Kubernetes client application for Azure Managed Redis (preview)
description: Learn how to host a Kubernetes client application that uses Azure Managed Redis.

ms.service: azure-managed-redis
ms.custom: linux-related-content, ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Kubernetes-hosted client application with Azure Managed Redis (preview)

## Client connections from multiple pods

When you have multiple pods connecting to a Redis server, make sure the new connections from the pods are created in a staggered manner. If multiple pods start in a short time without staggering, it causes a sudden spike in the number of client connections created. The high number of connections leads to high load on the Redis server and might cause timeouts.

Avoid the same scenario when shutting down multiple pods at the same time. Failing to stagger shutdown might cause a steep dip in the number of connections that leads to CPU pressure.

## Sufficient pod resources

Ensure that the pod running your client application is given enough CPU and memory resources. If the client application is running close to its resource limits, it can result in timeouts.

## Sufficient node resources

A pod running the client application can be affected by other pods running on the same node and throttle Redis connections or IO operations. So always ensure that the node on which your client application pods run have enough memory, CPU, and network bandwidth. Running low on any of these resources could result in connectivity issues.

## Linux-hosted client applications and TCP settings

If your Azure Managed Redis (preview) client application runs on a Linux-based container, we recommend updating some TCP settings. These settings are detailed in [TCP settings for Linux-hosted client applications](managed-redis-best-practices-connection.md#tcp-settings-for-linux-hosted-client-applications).

## Related content

- [Development](managed-redis-best-practices-development.md)
- [Azure Cache for Redis development FAQs](managed-redis-development-faq.yml)
