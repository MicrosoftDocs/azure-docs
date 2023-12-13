---
title: Best practices for connection resilience
titleSuffix: Azure Cache for Redis
description: Learn how to make your Azure Cache for Redis connections resilient.
author: flang-msft

ms.service: cache
ms.topic: conceptual
ms.date: 09/29/2023
ms.author: franlanglois
---

# Connection resilience

## Retry commands

Configure your client connections to retry commands with exponential backoff. For more information, see [retry guidelines](/azure/architecture/best-practices/retry-service-specific#azure-cache-for-redis).

## Test resiliency

Test your system's resiliency to connection breaks using a [reboot](cache-administration.md#reboot) to simulate a patch. For more information on testing your performance, see [Performance testing](cache-best-practices-performance.md).

## TCP settings for Linux-hosted client applications

The default TCP settings in some Linux versions can cause Redis server connections to fail for 13 minutes or more. The default settings can prevent the client application from detecting closed connections and restoring them automatically if the connection wasn't closed gracefully.

The failure to reestablish a connection can happen in situations where the network connection is disrupted or the Redis server goes offline for unplanned maintenance.

We recommend these TCP settings:

|Setting  |Value |
|---------|---------|
| *net.ipv4.tcp_retries2*   | 5 |

For more information about the scenario, see [Connection does not re-establish for 15 minutes when running on Linux](https://github.com/StackExchange/StackExchange.Redis/issues/1848#issuecomment-913064646). While this discussion is about the StackExchange.Redis library, other client libraries running on Linux are affected as well. The explanation is still useful and you can generalize to other libraries.

## Using ForceReconnect with StackExchange.Redis

In rare cases, StackExchange.Redis fails to reconnect after a connection is dropped. In these cases, restarting the client or creating a new `ConnectionMultiplexer` fixes the issue. We recommend using a singleton `ConnectionMultiplexer` pattern while allowing apps to force a reconnection periodically. Take a look at the quickstart sample project that best matches the framework and platform your application uses. You can see an example of this code pattern in our [quickstarts](https://github.com/Azure-Samples/azure-cache-redis-samples).

Users of the `ConnectionMultiplexer` must handle any `ObjectDisposedException` errors that might occur as a result of disposing the old one.

Call `ForceReconnectAsync()` for `RedisConnectionExceptions` and `RedisSocketExceptions`. You can also call `ForceReconnectAsync()` for `RedisTimeoutExceptions`, but only if you're using generous `ReconnectMinInterval` and `ReconnectErrorThreshold`. Otherwise, establishing new connections can cause a cascade failure on a server that's timing out because it's already overloaded.

## Configure appropriate timeouts

Two timeout values are important to consider in connection resiliency: [connect timeout](#connect-timeout) and [command timeout](#command-timeout).

### Connect timeout

The `connect timeout` is the time your client waits to establish a connection with Redis server. Configure your client library to use a `connect timeout` of five seconds, giving the system sufficient time to connect even under higher CPU conditions.

A small `connection timeout` value doesn't guarantee a connection is established in that time frame. If something goes wrong (high client CPU, high server CPU, and so on), then a short `connection timeout` value causes the connection attempt to fail. This behavior often makes a bad situation worse. Instead of helping, shorter timeouts aggravate the problem by forcing the system to restart the process of trying to reconnect, which can lead to a *connect -> fail -> retry* loop.

### Command timeout

Most client libraries have another timeout configuration for `command timeouts`, which is the time the client waits for a response from Redis server. Although we recommend an initial setting of less than five seconds, consider setting the `command timeout` higher or lower depending on your scenario and the sizes of the values that are stored in your cache.

If the `command timeout` is too small, the connection can look unstable. However, if the `command timeout` is too large, your application might have to wait for a long time to find out whether the command is going to time out or not.

## Avoid client connection spikes

Avoid creating many connections at the same time when reconnecting after a connection loss. Similar to the way that [short connect timeouts](#configure-appropriate-timeouts) can result in longer outages, starting many reconnect attempts at the same time can also increase server load and extend how long it takes for all clients to reconnect successfully.

If you're reconnecting many client instances, consider staggering the new connections to avoid a steep spike in the number of connected clients.

> [!NOTE]
> When you use the `StackExchange.Redis` client library, set `abortConnect` to `false` in your connection string.  We recommend letting the `ConnectionMultiplexer` handle reconnection. For more information, see [StackExchange.Redis best practices](./cache-management-faq.yml#stackexchangeredis-best-practices).

## Avoid leftover connections

Caches have limits on the number of client connections per cache tier. Ensure that when your client application recreates connections that it closes and removes the old connections.

## Advance maintenance notification

Use notifications to learn of upcoming maintenance. For more information, see [Can I be notified in advance of a planned maintenance](cache-failover.md#can-i-be-notified-in-advance-of-planned-maintenance).

## Schedule maintenance window

Adjust your cache settings to accommodate maintenance. For more information about creating a maintenance window to reduce any negative effects to your cache, see [Update channel and Schedule updates](cache-administration.md#update-channel-and-schedule-updates).

## More design patterns for resilience

Apply design patterns for resiliency. For more information, see [How do I make my application resilient](cache-failover.md#how-do-i-make-my-application-resilient).

## Idle timeout

Azure Cache for Redis has a 10-minute timeout for idle connections. The 10-minute timeout allows the server to automatically clean up leaky connections or connections orphaned by a client application. Most Redis client libraries have a built-in capability to send `heartbeat` or `keepalive` commands periodically to prevent connections from being closed even if there are no requests from the client application.

If there's any risk of your connections being idle for 10 minutes, configure the `keepalive` interval to a value less than 10 minutes. If your application is using a client library that doesn't have native support for `keepalive` functionality, you can implement it in your application by periodically sending a `PING` command.

## Related content

- [Best practices for development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQ](cache-development-faq.yml)
- [Failover and patching](cache-failover.md)
