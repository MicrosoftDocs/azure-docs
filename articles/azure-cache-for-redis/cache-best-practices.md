---
title: Best practices for Azure Cache for Redis
description: Learn how to use your Azure Cache for Redis effectively by following these best practices.
author: carldc
ms.service: cache
ms.topic: conceptual
ms.date: 01/06/2020
ms.author: cadaco
---

# Best practices for Azure Cache for Redis

By following these best practices, you can help maximize the performance and cost-effective use of your Azure Cache for Redis instance.

- [Connection resilience](cache-best-practices-connection.md)
- [Server load management](cache-best-practices-server-load.md)
- [Memory Management](cache-best-practices-memory-management.md)
- [Development](cache-best-practices-development.md)
- [Scaling](cache-best-practices-scale.md)
- [Kubernetes-hosted client applications](cache-best-practices-kubernetes.md)
- [Resilience and performance testing](cache-best-practices-performance.md)

## Configuration and concepts

- **Use Standard or Premium tier for production systems.**  The Basic tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache.  C0 caches are meant for simple dev/test scenarios since they have a shared CPU core, little memory, and are prone to "noisy neighbor" issues.

- **Remember that Redis is an in-memory data store.**  [This article](cache-troubleshoot-data-loss.md) outlines some scenarios where data loss can occur.

- **Develop your system such that it can handle connection blips** [because of patching and failover](cache-failover.md).

- **Redis works best with smaller values**, so consider chopping up bigger data into multiple keys.  In [this Redis discussion](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/), some considerations are listed that you should consider carefully.  Read [this article](cache-troubleshoot-client.md#large-request-or-response-size) for an example problem that can be caused by large values.

- **Reuse connections.**  Creating new connections is expensive and increases latency, so reuse connections as much as possible. If you choose to create new connections, make sure to close the old connections before you release them (even in managed memory languages like .NET or Java).

- **Use TLS encryption** - Azure Cache for Redis requires TLS encrypted communications by default.  TLS versions 1.0, 1.1 and 1.2 are currently supported.  However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 if at all possible.  If your client library or tool doesn't support TLS, then enabling unencrypted connections can be done [through the Azure portal](cache-configure.md#access-ports) or [management APIs](/rest/api/redis/redis/update).  In such cases where encrypted connections aren't possible, placing your cache and client application into a virtual network would be recommended.  For more information about which ports are used in the virtual network cache scenario, see this [table](cache-how-to-premium-vnet.md#outbound-port-requirements).


## When is it safe to retry?

Unfortunately, there's no easy answer.  Each application needs to decide what operations can be retried and which can't.  Each operation has different requirements and inter-key dependencies.  Here are some things you might consider:

- You can get client-side errors even though Redis successfully ran the command you asked it to run.  For example:
  - Timeouts are a client-side concept. If the operation reached the server, the server will run the command even if the client gives up waiting.  
  - When an error occurs on the socket connection, it's not possible to know if the operation actually ran on the server.  For example, the connection error can happen after the server processed the request but before the client receives the response.
- How does my application react if I accidentally run the same operation twice?  For instance, what if I increment an integer twice instead of once?  Is my application writing to the same key from multiple places?  What if my retry logic overwrites a value set by some other part of my app?

If you would like to test how your code works under error conditions, consider using the [Reboot feature](cache-administration.md#reboot). Rebooting allows you to see how connection blips affect your application.

- **Enable VRSS** on the client machine if you are on Windows.  [See here for details](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn383582(v=ws.11)).  Example PowerShell script:
   >PowerShell -ExecutionPolicy Unrestricted Enable-NetAdapterRSS -Name (  Get-NetAdapter).Name
