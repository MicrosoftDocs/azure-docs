---
title: Integrate Azure Cache for Redis and Azure Cache Redis Enterprise with Service Connector
description: Integrate Azure Cache for Redis and Azure Cache Redis Enterprise into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Cache for Redis with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Cache for Redis to other cloud services using Service Connector. You might still be able to connect to Azure Cache for Redis in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Cache for Redis:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported Authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Cache for Redis using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | No                               | No                             | Yes                        | No                |
| Go                 | No                               | No                             | Yes                        | No                |
| Java               | No                               | No                             | Yes                        | No                |
| Java - Spring Boot | No                               | No                             | Yes                        | No                |
| Node.js            | No                               | No                             | Yes                        | No                |
| Python             | No                               | No                             | Yes                        | No                |
| None               | No                               | No                             | Yes                        | No                |

This table indicates that the only supported authentication method for all client types in the table is the Secret / connection string method. Other authentication methods are not supported for any of the client types to connect to Azure Cache for Redis using Service Connector.

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

#### [SpringBoot](#tab/springBoot) 

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

#### [Other](#tab/none)

| Default environment variable name | Description    | Example value                                   |
| --------------------------------- | -------------- | ----------------------------------------------- |
| AZURE_REDIS_HOST                  | Redis host     | `<redis-server-name>.redis.cache.windows.net`   |
| AZURE_REDIS_PORT                  | Redis port     | `6380`                                          |
| AZURE_REDIS_DATABASE              | Redis database | `0`                                             |
| AZURE_REDIS_PASSWORD              | Redis key      | `<redis-key>`                                   |
| AZURE_REDIS_SSL                   | SSL setting    | `true`                                          |

---

#### Sample code

Refer to the steps and code below to connect to Azure Cache for Redis using a connection string.
[!INCLUDE [code for redis](./includes/code-redis-secret.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
