---
title: Best practices for hosting a Kubernetes client applications
description: Learn how to host a Kubernetes client application that uses Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---

# Kubernetes-hosted client applications 

When you have multiple pods connecting to a Redis server, ensure that the new connections from the pods are created in a staggered manner. If multiple pods start up in a short duration of time, it would cause a sudden spike in the number of client connections created, which in turn leads to high server load on redis server and timeouts.

The same scenario should be avoided when shutting down multiple pods at the same time. This would cause a steep dip in the number of connections which leads to CPU pressure.

Ensure that the Kubernetes node that is going to host the pod that connects to Redis has sufficient memory, CPU and network bandwidth.  

Beware of the noisy neighbor problem. Your pod running Redis client can be affected by other pods running on the same node and throttle Redis connections or IO operations.
