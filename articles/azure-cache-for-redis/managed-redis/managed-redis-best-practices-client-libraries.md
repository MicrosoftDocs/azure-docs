---
title: Best practices using client libraries with Azure Managed Redis (preview)
description: Learn about client libraries for Azure Managed Redis.

ms.service: azure-managed-redis
ms.topic: conceptual
ms.date: 11/15/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-extended-java, ignite-2024
---

# Azure Managed Redis (preview) Client libraries

Azure Managed Redis (preview) is based on the popular in-memory data store, Redis. Azure Managed Redis can be accessed by a wide variety of Redis clients for many programming languages. Each client library has its own API that makes calls to Redis server using Redis commands, but the client libraries are built to talk to any Redis server.

Each client library maintains its own reference documentation. The libraries also provide links to get support through the client library developer community. The Azure Managed Redis team doesn't own the development, or the support for any client libraries.

Recommendations below are based on popularity and whether there's an active online community to support and answer your questions. We only recommend using the latest available version, and upgrading regularly as new versions become available. These libraries are under active development and often release new versions with improvements to reliability and performance.

| **Client library**        | **Language** | **GitHub** **repo**                                                 | **Documentation**                                                                    |
|---------------------------|--------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| StackExchange.Redis       | C#/.NET      | [Link](https://github.com/StackExchange/StackExchange.Redis)        | [More information here](https://stackexchange.github.io/StackExchange.Redis/)        |
| Lettuce                   | Java         | [Link](https://github.com/lettuce-io/)                              | [More information here](https://lettuce.io/)                                         |
| Jedis                     | Java         | [Link](https://github.com/redis/jedis)                              |                                                                                      |
| node_redis                | Node.js      | [Link](https://github.com/redis/node-redis)                         |                                                                                      |
| Redisson                  | Java         | [Link](https://github.com/redisson/redisson)                        | [More information here](https://redisson.org/)                                       |
| ioredis                   | Node.js      | [Link](https://github.com/luin/ioredis)                             | [More information here](https://ioredis.readthedocs.io/en/stable/API/)               |

> [!NOTE]
> Your application can use any client library that is compatible with open-source Redis to connect to your Azure Managed Redis instance.

## Choosing the right client library based on your clustering policy

Azure Managed Redis supports the Enterprise clustering policy and the OSS clustering policy. See more information here (add link to clustering policy information).
All client libraries work with your Redis instance with Enterprise clustering policy. However, if you are using the OSS clustering policy, ensure that the client library you choose supports connecting to clustered Redis instances.

## Blocked commands

Configuration and management of Azure Managed Redis instances is managed by Microsoft, which disables the following commands by default. 
For more information on blocked commands, see [Cluster management commands compatibility](https://redis.io/docs/latest/operate/rs/references/compatibility/commands/cluster/)

### Multi-key commands

Because the AMR instances use a clustered configuration, you might see `CROSSSLOT` exceptions on commands that operate on multiple keys. Behavior varies depending on the clustering policy used. If you use the OSS clustering policy, multi-key commands require all keys to be mapped to [the same hash slot](https://redis.io/docs/latest/operate/rs/databases/configure/oss-cluster-api/#multi-key-command-support).

You might also see `CROSSSLOT` errors with Enterprise clustering policy. Only the following multi-key commands are allowed across slots with Enterprise clustering: `DEL`, `MSET`, `MGET`, `EXISTS`, `UNLINK`, and `TOUCH`.

In Active-Active databases, multi-key write commands (`DEL`, `MSET`, `UNLINK`) can only be run on keys that are in the same slot. However, the following multi-key commands are allowed across slots in Active-Active databases: `MGET`, `EXISTS`, and `TOUCH`. For more information, see [Database clustering](https://redis.io/docs/latest/operate/rs/databases/durability-ha/clustering/#multikey-operations).

### Commands blocked for Enterprise clustering policy
* CLUSTER INFO
* CLUSTER HELP
* CLUSTER KEYSLOT
* CLUSTER NODES
* CLUSTER SLOTS

### Commands blocked for active geo-replication
* FLUSHALL
* FLUSHDB

## Client library-specific guidance

For information on client library-specific guidance best practices, see the following links:

- [StackExchange.Redis (.NET)](../cache-best-practices-connection.md#using-forcereconnect-with-stackexchangeredis)
- [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
- [Lettuce (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md)
- [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
- [Redisson (Java)](../cache-best-practices-client-libraries.md#redisson-java)
- [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
- [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
- [HiRedisCluster](https://github.com/Azure/AzureCacheForRedis/blob/main/HiRedisCluster%20Best%20Practices.md)
- [ASP.NET Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)

## Redisson (Java)

We _recommend_ you  use redisson 3.14.1 or higher. Older versions contain known connection leak issues that cause problems after failovers. Monitor the Redisson changelog for other known issues can affect features used by your application. For more information, see[`CHANGELOG`](https://github.com/redisson/redisson/blob/master/CHANGELOG.md) and the [Redisson FAQ](https://github.com/redisson/redisson/wiki/16.-FAQ).

Other notes:

- Redisson defaults to 'read from replica' strategy, unlike some other clients. To change this, modify the 'readMode' config setting.
- Redisson has a connection pooling strategy with configurable minimum and maximum settings, and the default minimum values are large. The large defaults could contribute to aggressive reconnect behaviors or 'connection storms'. To reduce the risk, consider using fewer connections because you can efficiently pipeline commands, or batches of commands, over a few connections.
- Redisson has a default idle connection timeout of 10 seconds, which leads to more closing and reopening of connections than ideal.

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
  - "redis://mycacheaddress:10000"
  scanInterval: 1000
  pingConnectionInterval: 60000
  keepAlive: false
  tcpNoDelay: true
```

For an article demonstrating how to use Redisson's support for JCache as the store for HTTP session state in IBM Liberty on Azure, see [Use Java EE JCache with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache).

## How to use client libraries

Besides the reference documentation, you can find tutorials showing how to get started with Azure Managed Redis using different languages and cache clients.

For more information on using some of these client libraries in tutorials, see the following articles:

- [Code a .NET Framework app](../cache-dotnet-how-to-use-azure-redis-cache.md)
- [Code a .NET Core app](../cache-dotnet-core-quickstart.md)
- [Code an ASP.NET web app](../cache-web-app-howto.md)
- [Code an ASP.NET Core web app](../cache-web-app-aspnet-core-howto.md)
- [Code a Java app](../cache-java-get-started.md)
- [Code a Node.js app](../cache-nodejs-get-started.md)
- [Code a Python app](../cache-python-get-started.md)

## Next steps

- [Azure Managed Redis development FAQs](managed-redis-development-faq.yml)
- [Best practices for development](managed-redis-best-practices-development.md)
