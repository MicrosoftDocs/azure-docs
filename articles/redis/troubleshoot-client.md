---
title: Troubleshoot Azure Managed Redis client issues
description: Learn how to resolve common client issues, such as client memory pressure, traffic burst, high CPU, limited bandwidth, large requests, or large response size, when using Azure Managed Redis.
ms.date: 05/18/2025
ms.service: azure-managed-redis
ms.topic: troubleshooting
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---
# Troubleshoot Azure Managed Redis client-side issues

This section discusses troubleshooting issues that occur because of a condition on the Redis client that your application uses.

- [Memory pressure on Redis client](#memory-pressure-on-redis-client)
- [Traffic burst](#traffic-burst)
- [High client CPU usage](#high-client-cpu-usage)
- [Client-side bandwidth limitation](#client-side-bandwidth-limitation)

## Memory pressure on Redis client

Memory pressure on the client can lead to performance problems that can delay processing of responses from the cache. When memory pressure hits, the system might page data to disk. This _page faulting_ causes the system to slow down significantly.

To detect memory pressure on the client:

- Monitor memory usage on machine to make sure that it doesn't exceed available memory.
- Monitor the client's `Page Faults/Sec` performance counter. During normal operation, most systems have some page faults. Spikes in page faults corresponding with request timeouts can indicate memory pressure.

High memory pressure on the client can be mitigated several ways:

- Dig into your memory usage patterns to reduce memory consumption on the client.
- Upgrade your client VM to a larger size with more memory.

## Traffic burst

For more information, see [Traffic burst and thread pool configuration](troubleshoot-timeouts.md#traffic-burst-and-thread-pool-configuration).

## High client CPU usage

For more information, see [High CPU on client hosts](troubleshoot-timeouts.md#high-cpu-on-client-hosts).

## Client-side bandwidth limitation

For more information, see [Network bandwidth limitation on client hosts](troubleshoot-timeouts.md#network-bandwidth-limitation-on-client-hosts).

## High client connections

When client connections reach the maximum for the cache, you can have failures in client requests for connections beyond the maximum. High client connections can also cause high server load when processing repeated reconnection attempts.

High client connections might indicate a connection leak in client code. Connections might not be getting reused or closed properly. Review client code for connection use.

If the high connections are all legitimate and required client connections, upgrading your cache to a size with a higher connection limit might be required. Check if the `Max aggregate for Connected Clients` metric is close or higher than the maximum number of allowed connections for a particular cache size. For more information on sizing per client connections, see [Azure Managed Redis performance](planning-faq.yml).

## Additional information

These articles provide more information on troubleshooting and performance testing:

- [Troubleshoot Azure Managed Redis server issues](troubleshoot-server.md)
- [Troubleshoot Azure Managed Redis latency and timeouts](troubleshoot-timeouts.md)
- [Performance testing with Azure Managed Redis](best-practices-performance.md)
