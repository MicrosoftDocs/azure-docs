---
title: Best practices using client libraries
description: Learn about client libraries for Azure Cache for Redis.


ms.topic: conceptual
ms.date: 02/06/2025
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-extended-java, ignite-2024
---

# Client libraries

Azure Cache for Redis is based on the popular open-source in-memory data store, open-source Redis. Redis clients for many programming languages can access Azure Managed Redis. Each client library has its own API that makes calls to Redis server using Redis commands, but the client libraries are built to talk to any Redis server.

Each client maintains its own reference documentation for its library. The clients also provide links to get support through the client library developer community. The Azure Cache for Redis team doesn't own the development, or the support for any client libraries.

Although we don't own or support any client libraries, we do recommend some libraries. Recommendations are based on popularity and whether there's an active online community to support and answer your questions. We only recommend using the latest available version, and upgrading regularly as new versions become available. These libraries are under active development and often release new versions with improvements to reliability and performance.

| **Client library**  | **Language** |  **GitHub** **repo**                                  |          **Documentation**|
| --------------------|------------- |-------------------------------------------------------| --------------------------|
| StackExchange.Redis | C#/.NET |  [Link](https://github.com/StackExchange/StackExchange.Redis)| [More information here](https://stackexchange.github.io/StackExchange.Redis/) |
| Lettuce             | Java    |  [Link](https://github.com/lettuce-io/)                       | [More information here](https://lettuce.io/) |
| Jedis               | Java    |  [Link](https://github.com/redis/jedis)                       |                                              |
| node_redis          | Node.js |  [Link](https://github.com/redis/node-redis)            |                                              |
| Redisson            | Java    |  [Link](https://github.com/redisson/redisson)           | [More information here](https://redisson.org/) |
| ioredis             | Node.js |  [Link](https://github.com/luin/ioredis)                | [More information here](https://ioredis.readthedocs.io/en/stable/API/) |

> [!NOTE]
> Your application can use any client library that is compatible with open-source Redis to connect to your Azure Cache for Redis instance.

## Client library-specific guidance

For information on client library-specific guidance best practices, see the following links:

- [StackExchange.Redis (.NET)](cache-best-practices-connection.md#using-forcereconnect-with-stackexchangeredis)
- [Lettuce (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md)
- [Jedis (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Redis-BestPractices-Java-Jedis.md)
- [Redisson (Java)](cache-best-practices-client-libraries.md#redisson-java)
- [Node.js](https://github.com/Azure/AzureCacheForRedis/blob/main/Redis-BestPractices-Node-js.md)
- [PHP](https://github.com/Azure/AzureCacheForRedis/blob/main/Redis-BestPractices-PHP.md)
- [HiRedisCluster](https://github.com/Azure/AzureCacheForRedis/blob/main/HiRedisCluster%20Best%20Practices.md)

## Redisson (Java)

We _recommend_ you  use redisson 3.14.1 or higher. Older versions contain known connection leak issues that cause problems after failovers. Monitor the Redisson changelog for other known issues can affect features used by your application. For more information, see[`CHANGELOG`](https://github.com/redisson/redisson/blob/master/CHANGELOG.md) and the [Redisson FAQ](https://github.com/redisson/redisson/wiki/16.-FAQ).

Other notes:

- Redisson defaults to 'read from replica' strategy, unlike some other clients. To change this default, modify the 'readMode' config setting.
- Redisson has a connection pooling strategy with configurable minimum and maximum settings, and the default minimum values are large. The large defaults could contribute to aggressive reconnect behaviors or 'connection storms.' To reduce the risk, consider using fewer connections because you can efficiently pipeline commands, or batches of commands, over a few connections.
- Redisson has a default idle connection time out of 10 seconds, which leads to more closing and reopening of connections than ideal.

Here's a recommended baseline configuration for cluster mode that you can modify as needed:

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

For an article about Redisson's support for JCache as the store for HTTP session state in IBM Liberty on Azure, see [Use Java EE JCache with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache).

## How to use client libraries

Besides the reference documentation, you can find tutorials showing how to get started with Azure Cache for Redis using different languages and cache clients.

For more information on using some of these client libraries in tutorials, see the following articles:

- [Code a .NET Framework app](../redis/dotnet-how-to-use-azure-redis-cache.md)
- [Code a .NET Core app](../redis/dotnet-core-quickstart.md)
- [Code an ASP.NET web app](../redis/web-app-cache-howto.md)
- [Code an ASP.NET Core web app](../redis/web-app-aspnet-core-howto.md)
- [Code a Java app](../redis/java-get-started.md)
- [Code a Node.js app](../redis/nodejs-get-started.md)
- [Code a Python app](../redis/python-get-started.md)

## Next steps

- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Best practices for development](cache-best-practices-development.md)
