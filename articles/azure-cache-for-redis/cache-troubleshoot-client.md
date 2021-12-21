---
title: Troubleshoot Azure Cache for Redis client-side issues
description: Learn how to resolve common client-side issues with Azure Cache for Redis such as Redis client memory pressure, traffic burst, high CPU, limited bandwidth, large requests or large response size.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: troubleshooting
ms.date: 12/01/2021
---
# Troubleshoot Azure Cache for Redis client-side issues

This section discusses troubleshooting issues that occur because of a condition on the Redis client that your application uses.

- [Memory pressure on Redis client](#memory-pressure-on-redis-client)
- [Traffic burst](#traffic-burst)
- [High client CPU usage](#high-client-cpu-usage)
- [Client-side bandwidth limitation](#client-side-bandwidth-limitation)

## Memory pressure on Redis client

Memory pressure on the client machine leads to all kinds of performance problems that can delay processing of responses from the cache. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly.

To detect memory pressure on the client:

- Monitor memory usage on machine to make sure that it doesn't exceed available memory.
- Monitor the client's `Page Faults/Sec` performance counter. During normal operation, most systems have some page faults. Spikes in page faults corresponding with request timeouts can indicate memory pressure.

High memory pressure on the client can be mitigated several ways:

- Dig into your memory usage patterns to reduce memory consumption on the client.
- Upgrade your client VM to a larger size with more memory.

## Traffic burst

Moved.
<!-- Moved Traffic burst section to cache-troubleshoot-timeouts.md -->

## High client CPU usage

Moved.
<!-- Moved to high CPU on clients section in cache-troubleshoot-timeouts.md -->

## Client-side bandwidth limitation

Moved.
<!-- Moved to  Network bandwidth limitation in client hosts section of  cache-troubleshoot-timeouts.md -->

## High client connections

Client connections reaching the maximum for the cache can cause failures in client requests for connections beyond the maximum, and can also cause high server CPU usage on the cache due to processing repeated reconnection attempts.

High client connections may indicate a connection leak in client code.  Connections may not be getting re-used or closed properly.  Review client code for connection use.

If the high connections are all legitimate and required client connections, upgrading your cache to a size with a higher connection limit may be required.

## Additional information

These articles provide more information on troubleshooting and performance testing:

- [Troubleshoot Azure Cache for Redis server issues](cache-troubleshoot-server.md)
- [Troubleshoot Azure Cache for Redis latency and timeouts](cache-troubleshoot-timeouts.md)
- [How can I benchmark and test the performance of my cache?](cache-management-faq.yml#how-can-i-benchmark-and-test-the-performance-of-my-cache-)
