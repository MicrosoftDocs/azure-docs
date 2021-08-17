---
title: Best practices for Using and Monitoring the Server Load
description: Learn how to use and monitor your server load for  Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---

# Manage Server Load

## Key size

Should I use small key/values or large key/values? It depends on the scenario. If your scenario requires larger keys, you can adjust the Connection Timeout and Command timeouts, then retry values and adjust your retry logic. From a Redis server perspective, smaller values give better performance. We recommend keeping key size smaller than 100 kB. If you do need to store larger values in Redis; you must be aware of that latencies will be higher and you should consider setting higher ConnectionTimeout. We recommend setting it to 15 seconds. Also, avoid large keys to protect the Redis server memory becoming too fragmented on key evictions.

## Avoid client connections spike

Creating and closing connections is an expensive operation for Redis server. If your client application creates or closes too many connections in a small amount of time, it could burden the Redis server.

If you're instantiating many client instances to connect to redis at once, consider staggering the new connection creations to avoid a steep spike in the number of connected clients.

## Memory pressure

High memory usage on the server side may cause means the system may page data to disk resulting in page faults that causes the system to slow down significantly.

## Avoid long running command

Redis server is a single-threaded system. The time needed to run some more time-expensive commands can cause some latency or timeouts on the client side because the server is too busy carrying out the time-expensive commands. For more information, see [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md).  

## Monitor Server Load

Add monitoring on Server load to ensure you get notifications when high server load occurs. Monitoring can help you understand your application constraints well. Then, you can work proactively to mitigate issues. We recommend trying to keep server load under 80% to avoid negative performance effects.

## Plan for server maintenance

Ensure you have enough server capacity to handle your peak load while undergoing server maintenance. Test your system by rebooting nodes while under peak load. For more information on how to simulate deployment of a patch, see [reboot](cache-administration.md#reboot).
