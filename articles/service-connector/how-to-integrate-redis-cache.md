---
title: Integrate Azure Cache for Redis with Service Connector
description: Integrate  Azure Cache for Redis into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate  Azure Cache for Redis with Service Connector

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
| AZURE_REDIS_CONNECTIONSTRING | | `{redis-server}.redis.cache.windows.net:6380,password={redis-key},ssl=True,defaultDatabase=0"` |

### Java (Jedis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |

### Java - Spring Boot (spring-boot-starter-data-redis)

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.redis.host | | `{redis-server}.redis.cache.windows.net` |
| spring.redis.port | | `6380` |
| spring.redis.database | | `0` |
| spring.redis.password | | `{redis-key}` |
| spring.redis.ssl | | `true` |

### Node.js (node-redis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_REDIS_SERVER |  | `{redis-server}.redis.cache.windows.net` |
| AZURE_REDIS_PORT|  | `6380` |
| AZURE_REDIS_DATABASE |  | `0` |
| AZURE_REDIS_PASSWORD |  | `{redis-key}` |
| AZURE_REDIS_TLS |  | `true` |

### Python (redis-py)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |


### Go (go-redis)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_REDIS_CONNECTIONSTRING | | `rediss://:{redis-key}@{redis-server}.redis.cache.windows.net:6380/0` |
