---
title: Best practices for hosting a Kubernetes client application
description: Learn how to host a Kubernetes client application that uses Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---

# Kubernetes-hosted client application

## Multiple pods

When you have multiple pods connecting to a Redis server, ensure that the new connections from the pods are created in a staggered manner. If multiple pods start up in a short duration of time, it would cause a sudden spike in the number of client connections created. The high number of connections leads to high server load on the Redis server and might cause timeouts.

Avoid the same scenario when shutting down multiple pods at the same time. Failing to stagger shutdown might cause a steep dip in the number of connections that leads to CPU pressure.

## Sufficient resources

Ensure that the Kubernetes node that hosts the pod and connects to Redis server has sufficient memory, CPU, and network bandwidth.  

## Noisy neighbor problem

Beware of the noisy neighbor problem. The pod running Redis client can be affected by other pods running on the same node and throttle Redis connections or IO operations.
