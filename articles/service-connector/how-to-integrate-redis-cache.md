---
title: Integrate Azure Cache for Redis and Azure Cache Redis Enterprise with Service Connector
description: Integrate Azure Cache for Redis and Azure Cache Redis Enterprise into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/03/2022
---

# Integrate Azure Cache for Redis with Service Connector

This page shows the supported authentication types and client types of Azure Cache for Redis using Service Connector. You might still be able to connect to Azure Cache for Redis in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET (StackExchange.Redis) | | | ![yes icon](./media/green-check.png) | |
| Java (Jedis) | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot (spring-boot-starter-data-redis) | | | ![yes icon](./media/green-check.png) | |
| Node.js (node-redis) | | | ![yes icon](./media/green-check.png) | |
| Python (redis-py) | | | ![yes icon](./media/green-check.png) | |
| Go (go-redis) | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET (StackExchange.Redis) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | StackExchange.Redis connection string | `{redis-server}.redis.cache.windows.net:6380,password={redis-key},ssl=True,defaultDatabase=0` |

### Java (Jedis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | Jedis connection string | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |

### Java - Spring Boot (spring-boot-starter-data-redis)

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.redis.host | Redis host | `{redis-server}.redis.cache.windows.net` |
| spring.redis.port | Redis port | `6380` |
| spring.redis.database | Redis database | `0` |
| spring.redis.password | Redis key | `{redis-key}` |
| spring.redis.ssl | SSL setting | `true` |

### Node.js (node-redis) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_REDIS_CONNECTIONSTRING | node-redis connection string | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |


### Python (redis-py)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_REDIS_CONNECTIONSTRING | redis-py connection string | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |

### Go (go-redis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_REDIS_CONNECTIONSTRING | redis-py connection string | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
