---
title: Integrate Azure Cache for Redis and Azure Cache Redis Enterprise with Service Connector
description: Integrate Azure Cache for Redis and Azure Cache Redis Enterprise into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/31/2023
ms.custom: event-tier1-build-2022
---
# Integrate Azure Cache for Redis with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Cache for Redis to other cloud services using Service Connector. You might still be able to connect to Azure Cache for Redis in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection, as well as sample code.

## Supported compute service

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported Authentication types and client types

Supported authentication and clients for App Service, Azure Functions, Container Apps and Azure Spring Apps:

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string         | Service principal |
| ------------------ | -------------------------------- | ------------------------------ | ---------------------------------- | ----------------- |
| .NET               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Go                 |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java - Spring Boot |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Node.js            |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python             |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| None               |                                  |                                | ![yes icon](./media/green-check.png) |                   |

## Default environment variable names or application properties and sample code

Use the environment variable names and application properties listed below to connect compute services to Redis Server. For each example below, replace the placeholder texts `<redis-server-name>`, and `<redis-key>` with your own Redis server name and key. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### Connection String

#### [.NET](#tab/dotnet) 

| Default environment variable name | Description                            | Example value                                                                                        |
| --------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| AZURE_REDIS_CONNECTIONSTRING      | StackExchange. Redis connection string | `<redis-server-name>.redis.cache.windows.net:6380,password=<redis-key>,ssl=True,defaultDatabase=0` |

#### [Java](#tab/java) 

| Default environment variable name | Description             | Example value                                                                |
| --------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| AZURE_REDIS_CONNECTIONSTRING      | Jedis connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [SpringBoot](#tab/spring) 

| Application properties | Description    | Example value                                   |
| ---------------------- | -------------- | ----------------------------------------------- |
| spring.redis.host      | Redis host     | `<redis-server-name>.redis.cache.windows.net` |
| spring.redis.port      | Redis port     | `6380`                                        |
| spring.redis.database  | Redis database | `0`                                           |
| spring.redis.password  | Redis key      | `<redis-key>`                                 |
| spring.redis.ssl       | SSL setting    | `true`                                        |

#### [Python](#tab/python) 

| Default environment variable name | Description                | Example value                                                              |
|-----------------------------------|----------------------------|----------------------------------------------------------------------------|
| AZURE_REDIS_CONNECTIONSTRING      | redis-py connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [Go](#tab/go) 

| Default environment variable name | Description                | Example value                                                              |
|-----------------------------------|----------------------------|----------------------------------------------------------------------------|
| AZURE_REDIS_CONNECTIONSTRING      | redis-py connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description                  | Example value                                                                |
| --------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| AZURE_REDIS_CONNECTIONSTRING      | node-redis connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

---

#### Sample code

Refer to the steps and code below to connect to Azure Cache for Redis using a connection string.
[!INCLUDE [code for redis](./includes/code-redis-secret.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
