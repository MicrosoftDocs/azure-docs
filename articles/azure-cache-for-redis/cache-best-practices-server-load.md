---
title: Best practices for Using and Monitoring the Server Load
description: Learn how to use and monitor your server load for  Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---

# Server Load Management

## Key size

Should I use small key/values or large key/values? It depends on the scenario. If your scenario requires larger keys, you can adjust the Connection Timeout and Command timeouts, then retry values and adjust your retry logic. From a Redis server perspective, smaller values give better performance. We recommend keeping key size smaller than 100kB. If you do need to store larger values in Redis; you must be aware of that latencies will be higher and you should consider setting higher ConnectionTimeout. We recommend setting it to 15 seconds. Large keys should also be avoided to protect the Redis Server memory becoming too fragmented on key evictions. 

## Avoid client connections spike

Creating and closing connections is an expensive operation for Redis server. Creating or closing too many connections in a small amount of time could burden the Redis server. If you are instantiating many client instances to connect to redis at once, consider staggering the new connection creations to avoid a steep spike in the number of connected clients. 

## Memory pressure

High memory usage on the server side may cause means the system may page data to disk resulting in page faults which causes the system to slow down significantly. 

## Avoid long running command

Because Redis is a single-threaded server side system, the time needed to run some more time expensive commands may cause some latency or timeouts on client side, as server can be busy dealing with these expensive commands. See Troubleshoot Azure Cache for Redis server-side issues | Microsoft Docs 

## Monitor Server Load
dd monitoring on Server Load to ensure you get notifications when instances of high server load occur. This can help you understand your application constraints well and work proactively to mitigate issues. We recommend trying to keep server load under 80% to avoid performance impact. 

## Plan for server maintenance

Ensure you have enough server capacity to handle your peak load while undergoing server maintenance. Test your system by rebooting nodes while under peak load. See ( https://docs.microsoft.com/azure/azure-cache-for-redis/cache-administration#reboot) to simulate a patch 
