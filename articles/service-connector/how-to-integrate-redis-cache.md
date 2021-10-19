---
title: Integrate Azure Cache for Redis with Service Connector
description: Integrate  Azure Cache for Redis into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure Cache for Redis with Service Connector

This page shows the supported authentication types and client types of Azure Cache for Redis using Service Connector. You might still be able to connect to Azure Cache for Redis in other programming languages without using Service Connector. This page also shows default environment variable name and value (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net (StackExchange.Redis) | | | ![yes icon](./media/green-check.png) | |
| Java (Jedis) | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot (spring-boot-starter-data-redis) | | | ![yes icon](./media/green-check.png) | |
| Node.js (node-redis) | | | ![yes icon](./media/green-check.png) | |
| Python (redis-py) | | | ![yes icon](./media/green-check.png) | |
| Go ((go-redis) | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET (StackExchange.Redis) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | Redis cache connection string | `{redis-server}.redis.cache.windows.net:6380,password={redis-key},ssl=True,defaultDatabase=0` |

### Java (Jedis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | Redis cache connection string | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |

### Java - Spring Boot (spring-boot-starter-data-redis)

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.redis.host | Redis cache server URL | `{redis-server}.redis.cache.windows.net` |
| spring.redis.port | Port number | `6380` |
| spring.redis.database | Redis database number | `0` |
| spring.redis.password | Redis key | `{redis-key}` |
| spring.redis.ssl | SSL option | `true` |

### Node.js (node-redis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_REDIS_SERVER | Redis cache server URL  | `{redis-server}.redis.cache.windows.net` |
| AZURE_REDIS_PORT| Port number | `6380` |
| AZURE_REDIS_DATABASE | Redis database number | `0` |
| AZURE_REDIS_PASSWORD | Redis key | `{redis-key}` |
| AZURE_REDIS_TLS | SSL option | `true` |

### Python (redis-py)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | Redis cache connection string using redis-py | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |


### Go (go-redis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | Redis cache connection string using go-redis | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
