---
title: Best practices using Client Libraries
titleSuffix: Azure Cache for Redis
description: Learn about client libraries for Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 07/07/2022
ms.author: franlanglois

---

# Client Libraries

Microsoft Azure Cache for Redis is based on the popular open-source in-memory data store, open-source Redis. Azure Cache for Redis can be accessed by a wide variety of Redis clients for many programming languages. Each client has its own API that makes calls to a Redis server using Redis commands, but the clients are built to talk to any Redis server.

Each client maintains its own reference documentation with links to get support through the client library developer community. The Azure Cache for Redis team doesn't own the development or support for any client libraries.

Although we do not own or support any client libraries, we do recommend some libraries--based on their popularity and whether there is an active online community to support and answer your questions. We only recommend using the latest available version, and upgrading regularly as new versions become available. These libraries are under active development and often release new versions with improvements to reliability and performance.

 

Client Library 

Language 

Github repo 

Documentation 

StackExchange.Redis 

C#/.NET 

Link 

More information here 

Lettuce 

Java 

Link 

More information here 

Jedis 

Java 

Link 

 

node_redis 

Node.js 

Link 

 

Redisson 

Java 

Link 

More information here 

ioredis 

Node.js 

Link 

More information here 

> [!NOTE]
> Your application will be able to connect and use your Azure Cache for Redis instance with any client library that can communicate with open-source Redis.

Besides the reference documentation, there are several tutorials showing how to get started with Azure Cache for Redis using different languages and cache clients. To access these tutorials, see How to use Azure Cache for Redis and its sibling articles in the table of contents.  

## Client library-specific guidance

For information on Client library-specific guidance best practices, see the following links:

- [StackExchange.Redis (.NET)](cache-best-practices-connection.md#using-forcereconnect-with-stackexchangeredis)
- [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
- [Lettuce (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md)
- [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
- [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
- [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
- [HiRedisCluster](https://github.com/Azure/AzureCacheForRedis/blob/main/HiRedisCluster%20Best%20Practices.md)
- [ASP.NET Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)


## Next steps

- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Best practices for development](cache-best-practices-development.md)
