---
title: Best practices for hosting a Kubernetes client application
description: Learn how to host a Kubernetes client application.
ms.custom: linux-related-content, ignite-2024
ms.topic: conceptual
ms.date: 11/10/2023
---

# Kubernetes-hosted client application

## Client connections from multiple pods

When you have multiple pods connecting to a Redis server, make sure the new connections from the pods are created in a staggered manner. If multiple pods start in a short time without staggering, it causes a sudden spike in the number of client connections created. The high number of connections leads to high load on the Redis server and might cause timeouts.

Avoid the same scenario when shutting down multiple pods at the same time. Failing to stagger shutdown might cause a steep dip in the number of connections that leads to CPU pressure.

## Sufficient pod resources

Ensure that the pod running your client application is given enough CPU and memory resources. If the client application is running close to its resource limits, it can result in timeouts.

## Sufficient node resources

A pod running the client application can be affected by other pods running on the same node and throttle Redis connections or IO operations. So always ensure that the node on which your client application pods run have enough memory, CPU, and network bandwidth. Running low on any of these resources could result in connectivity issues.

## Linux-hosted client applications and TCP settings

If your Azure Cache for Redis client application runs on a Linux-based container, we recommend updating some TCP settings. These settings are detailed in [TCP settings for Linux-hosted client applications](cache-best-practices-connection.md#tcp-settings-for-linux-hosted-client-applications).

## Potential connection collision with _Istio/Envoy_

<!-- Currently, Azure Cache for Redis uses ports 15xxx for clustered caches to expose cluster nodes to client applications. As documented [here](https://istio.io/latest/docs/ops/deployment/application-requirements/#ports-used-by-istio), the same ports are also used by _Istio.io_ sidecar proxy called _Envoy_ and could interfere with creating connections, especially on port 15001 and 15006. -->

When using _Istio_ with an Azure Managed Redis cluster, consider excluding the potential collision ports with an [istio annotation](https://istio.io/latest/docs/reference/config/annotations/).

```
annotations:
  traffic.sidecar.istio.io/excludeOutboundPorts: "15000,15001,15004,15006,15008,15009,15020"
```

To avoid connection interference, we recommend:

- Consider using a nonclustered cache or an Enterprise tier cache instead
- Avoid configuring _Istio_ sidecars on pods running Azure Cache for Redis client code

## Related content

- [Development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
