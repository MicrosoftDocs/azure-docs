---
title: Best practices for client libraries
description: Learn about recommended client libraries for Azure Cache for Redis, including a section devoted to Redisson best practices.


ms.topic: conceptual
ms.date: 05/05/2025
appliesto:
  - ✅ Azure Cache for Redis
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-extended-java, ignite-2024
---

# Client libraries

Azure Cache for Redis is based on the Redis open-source, in-memory data store. Redis clients for many programming languages can access Azure Redis. Your application can use any client library that's compatible with open-source Redis to connect to your Azure Redis cache.

Each client library has its own API that calls Redis servers using Redis commands. The client libraries are built to communicate with any Redis server.

Clients maintain reference documentation for their own libraries, and provide links to get support through the client library developer community. Microsoft and the Azure Redis team don't own the development or support for any client libraries.

Microsoft and Azure Redis do recommend some libraries, based on popularity and whether there's an active online support community to answer questions. These libraries are under active development and often release new versions with reliability and performance improvements. Microsoft recommends using the latest available version, and upgrading regularly as new versions become available.

The following table lists links and documentation for some recommended client libraries.

| **Client library**  | **Language** |  **GitHub repo**                                  |          **Documentation**|
| --------------------|------------- |-------------------------------------------------------| --------------------------|
| StackExchange.Redis | C#/.NET |  [https://github.com/StackExchange/StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis)| [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) |
| Jedis               | Java    |  [https://github.com/redis/jedis](https://github.com/redis/jedis)                       |                                              |
| Lettuce             | Java    |  [https://github.com/lettuce-io/](https://github.com/lettuce-io/)                       | [Lettuce - Advanced Java Redis client](https://lettuce.io/) |
| Redisson            | Java    |  [https://github.com/redisson/redisson](https://github.com/redisson/redisson)           | [Redisson - Redis Java client Real-Time Data Platform](https://redisson.pro/docs/) |
| ioredis             | Node.js |  [https://github.com/luin/ioredis](https://github.com/luin/ioredis)                | [Classes](https://ioredis.readthedocs.io/en/stable/API/) |
| node_redis          | Node.js |  [https://github.com/redis/node-redis](https://github.com/redis/node-redis)            |                                              |

> [!NOTE]
> Your application can use any client library that's compatible with open-source Redis to connect to your Azure Redis instance.

## Client library-specific guidance

For client library-specific guidance and best practices, see the following links:

- [StackExchange.Redis (.NET)](cache-best-practices-connection.md#using-forcereconnect-with-stackexchangeredis)
- [HiRedisCluster](https://github.com/Azure/AzureCacheForRedis/blob/main/HiRedisCluster%20Best%20Practices.md)
- [Jedis (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Redis-BestPractices-Java-Jedis.md)
- [Lettuce (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md)
- [Node.js](https://github.com/Azure/AzureCacheForRedis/blob/main/Redis-BestPractices-Node-js.md)
- [PHP](https://github.com/Azure/AzureCacheForRedis/blob/main/Redis-BestPractices-PHP.md)
- [Redisson (Java)](cache-best-practices-client-libraries.md#best-practices-for-redisson-java)

## How to use client libraries

Besides the reference documentation, you can use the following tutorials to get started with Azure Redis using different languages and cache clients:

- [Code a .NET Framework app](../redis/dotnet-how-to-use-azure-redis-cache.md)
- [Code a .NET Core app](../redis/dotnet-core-quickstart.md)
- [Code an ASP.NET web app](../redis/web-app-cache-howto.md)
- [Code an ASP.NET Core web app](../redis/web-app-aspnet-core-howto.md)
- [Code a Java app](../redis/java-get-started.md)
- [Code a Node.js app](../redis/nodejs-get-started.md)
- [Code a Python app](../redis/python-get-started.md)

## Best practices for Redisson (Java)

Here are some recommended best practices for the [Redisson](https://redisson.pro/) client library:

- Use Redisson 3.14.1 or higher. Older versions contain known connection leak issues that cause problems after failovers.

- Monitor the Redisson changelog for known issues that can affect features your application uses. For more information, see the [Redisson Releases History](https://github.com/redisson/redisson/blob/master/CHANGELOG.md) and the [Redisson FAQ](https://redisson.pro/docs/faq/).

- Modify the `readMode` config setting if you don't want to use the *read from replica* strategy. Unlike some other clients, Redisson uses *read from replica* as the default.

- To reduce the risk of aggressive reconnect behaviors or *connection storms*, consider setting fewer minimum connections.

  Redisson has a connection pooling strategy with configurable minimum and maximum settings, and the default minimum values are large. The large defaults could contribute to aggressive reconnect behaviors or connection storms. To reduce this risk, consider using fewer connections. You can efficiently pipeline commands or batches of commands over a few connections.

- Reset the idle connection timeout if necessary. Redisson has a default 10-second idle connection timeout, which can lead to more closing and reopening of connections than ideal.

- For information about using Redisson with Java EE JCache to store HTTP session state on an Azure Kubernetes Service (AKS) cluster, see [Using Azure Redis as session cache for WebSphere Liberty or Open Liberty](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache).

- Use the following recommended baseline configuration for cluster mode, and modify it as needed.

  ```yml
  clusterServersConfig:
    idleConnectionTimeout: 30000
    connectTimeout: 15000
    timeout: 5000
    retryAttempts: 3
    retryInterval: 3000
    checkLockSyncedSlaves: false
    failedSlaveReconnectionInterval: 15000
    failedSlaveCheckInterval: 60000
    subscriptionsPerConnection: 5
    clientName: "redisson"
    loadBalancer: !<org.redisson.connection.balancer.RoundRobinLoadBalancer> {}
    subscriptionConnectionMinimumIdleSize: 1
    subscriptionConnectionPoolSize: 50
    slaveConnectionMinimumIdleSize: 2
    slaveConnectionPoolSize: 24
    masterConnectionMinimumIdleSize: 2
    masterConnectionPoolSize: 24
    readMode: "MASTER"
    subscriptionMode: "MASTER"
    nodeAddresses:
    - "redis://mycacheaddress:6380"
    scanInterval: 1000
    pingConnectionInterval: 60000
    keepAlive: false
    tcpNoDelay: true
  ```

## Related content

- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Best practices for development](cache-best-practices-development.md)
