---
title: Best practices for Connection Resilience
description: Learn how to make your Azure Cache for Redis connections resilient.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---
# Connection resilience

## Retry commands

Configure your client connections to retry commands with exponential backoff. For more information, see [retry guidelines](/azure/architecture/best-practices/retry-service-specific#azure-cache-for-redis).

## Test resiliency

Test your system's resiliency to connection breaks using a [Reboot](cache-administration.md#reboot) to simulate a patch. For more information on testing your performance, see [Resilience and Performance Testing](cache-best-practices-performance.md).

## Configure appropriate timeouts

Configure your client library to use Connect Timeout of 10 to 15 seconds and a Command Timeout of 5 seconds. Connect Timeout is the time for which your client will wait to establish a connection with Redis server. Most client libraries have another timeout configuration for command timeouts which is the time for which the client waits for a response from Redis server. Some libraries have the commands timeout set to 5 seconds by default, but you can consider setting it to a lower or higher value depending on your scenario and key sizes. If the command timeout is too small, the connection may look unstable, while if the command timeout is too large, your application will have to wait for a long time to find out if the command is going to timeout or not.

* **Configure your client library to use a *connect timeout* of at least 15 seconds**, giving the system time to connect even under higher CPU conditions.  A small connection timeout value doesn't guarantee that the connection is established in that time frame.  If something goes wrong (high client CPU, high server CPU, and so on), then a short connection timeout value will cause the connection attempt to fail. This behavior often makes a bad situation worse.  Instead of helping, shorter timeouts aggravate the problem by forcing the system to restart the process of trying to reconnect, which can lead to a *connect -> fail -> retry* loop. We generally recommend that you leave your connection Timeout at 15 seconds or higher. It's better to let your connection attempt succeed after 15 or 20 seconds than to have it fail quickly only to retry. Such a retry loop can cause your outage to last longer than if you let the system just take longer initially.  
   > [!NOTE]
   > This guidance is specific to the *connection attempt* and not related to the time you're willing to wait for an *operation* like GET or SET to complete.

## Conscious connection recreation

In case of transient connection blips, ensure that you client library is not creating new connections for every retry and that there are no connection leaks in case your application recreates connections as Azure Cache For Redis limits number of client connections per cache SKU. Apart from reaching the client connections limit, it will also result in high server load and cause lot of other important operations to fail. If using StackExchange.Redis client library, set `abortConnect` to `false` in your connection string and we recommend letting the ConnectionMultiplexer handle reconnection.

## Advance maintenance notification

Use notifications to learn of upcoming maintenance. For more information, see [notified](/cache-failover#can-i-be-notified-in-advance-of-a-planned-maintenance).

## Schedule maintenance window

[Schedule updates](/azure-cache-for-redis/cache-administration#schedule-updates) for a maintenance window to reduce impact on your system.

## More design patterns for resilience

Apply [recommended design patterns](/cache-failover#how-do-i-make-my-application-resilient) for resiliency.

## Idle Timeout

Azure Cache for Redis currently has 10-minute idle timeout for connections, so your setting should be to less than 10 minutes. Most common client libraries have a configuration setting that allows client libraries to send Redis PING commands to a Redis server automatically and periodically. However, when using client libraries without this type of setting, customer applications themselves are responsible for keeping the connection alive.

* **Idle Timeout** - Azure Cache for Redis currently has 10-minute idle timeout for connections, so your setting should be to less than 10 minutes. Most common client libraries have a configuration setting that allows client libraries to send Redis `PING` commands to a Redis server automatically and periodically. However, when using client libraries without this type of setting, customer applications themselves are responsible for keeping the connection alive.
