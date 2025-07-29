---
title: Best practices for Kubernetes-hosted client apps
description: Learn about best practices for using Azure Cache for Redis in Kubernetes-hosted client applications.
ms.custom: linux-related-content, ignite-2024
ms.topic: conceptual
ms.date: 05/28/2025
appliesto:
  - ✅ Azure Cache for Redis

---

# Kubernetes-hosted client applications

This article provides best practices for using Azure Cache for Redis in Kubernetes-hosted client applications.

## Stagger multiple connections

Make sure to stagger multiple pod connections to a Redis server. Starting multiple pods in a short time without staggering causes a sudden spike in the number of client connections, leading to high load on the Redis server and possible timeouts.

Also avoid shutting down multiple pods at the same time. Failing to stagger shutdown might cause a steep dip in the number of connections leading to CPU pressure.

## Provide sufficient pod resources

Make sure to give the pod running your client application enough CPU and memory resources. Client applications running close to their resource limits can lead to timeouts.

## Provide sufficient node resources

The pod running the client application can be affected by other pods running on the same node, and throttle Redis connections or IO operations. Make sure the nodes that run your client application pods have enough memory, CPU, and network bandwidth. Insufficient amounts of these resources could result in connectivity issues.

## Check TCP settings for Linux applications

If your Azure Redis client application runs on a Linux-based container, make sure your TCP settings match the [TCP settings for Linux-hosted client applications](cache-best-practices-connection.md#tcp-settings-for-linux-hosted-client-applications).

## Avoid connection collision with Istio

<!-- Currently, Azure Cache for Redis uses ports 15xxx for clustered caches to expose cluster nodes to client applications. As documented [here](https://istio.io/latest/docs/ops/deployment/application-requirements/#ports-used-by-istio), the same ports are also used by _Istio.io_ sidecar proxy called _Envoy_ and could interfere with creating connections, especially on port 15001 and 15006. -->

If you use Istio with an Azure Managed Redis cluster, consider excluding potential collision ports with the following [Istio annotation](https://istio.io/latest/docs/reference/config/annotations/):

```console
annotations:
  traffic.sidecar.istio.io/excludeOutboundPorts: "15000,15001,15004,15006,15008,15009,15020"
```

To avoid connection interference:

- Consider using a nonclustered cache or an Azure Managed Redis cache instead.
- Avoid configuring Istio sidecars on pods running Azure Redis client code.

## Related content

- [Development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
