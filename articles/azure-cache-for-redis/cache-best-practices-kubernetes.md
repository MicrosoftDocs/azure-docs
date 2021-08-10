---
title: Best practices for Connection Resilience
description: Learn how to make your Azure Cache for Redis connections resilient.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---

# Kubernetes-hosted client applications 

When you have multiple pods connecting to redis server, ensure that the new connections from the pods are created in a staggered manner. If multiple pods start up in a short duration of time, it would cause a sudden spike in the number of client connections created which in turn leads to high server load on redis server and timeouts. 

The same scenario should be avoided when shutting down multiple pods at the same time. This would cause a steep dip in the number of connections which leads to CPU pressure. 

Ensure that the Kubernetes node which is going to host the pod which will connect to Redis has sufficient memory, CPU and network bandwidth.  

Beware of the noisy neighbor problem. Your pod running redis client can be affected by other pods running on the same node and throttle redis connections or IO operations. 
