---
title: Integrate Azure Cache for Redis with Service Connector
description: Learn how to integrate Azure Cache for Redis and Azure Cache for Redis Enterprise into your application with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 03/14/2025
---

# Integrate Azure Cache for Redis with Service Connector

This article covers supported authentication methods, clients, and sample code you can use to connect your apps to Azure Cache for Redis using Service Connector.In this article, you'll also find default environment variable names, values, and configuration obtained when creating service connections.

## Supported compute services

You can use Service Connector to connect the following compute services to Azure Cache for Redis:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication and client types

The following table shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Cache for Redis by using Service Connector. "Yes" means that the combination is supported. "No" means that it isn't supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                               | Yes                             | Yes                        | Yes                |
| Go                 | No                               | No                             | Yes                        | No                |
| Java               | Yes                               | Yes                             | Yes                        | Yes                |
| Java - Spring Boot | No                               | No                             | Yes                        | No                |
| Node.js            | Yes                               | Yes                             | Yes                        | Yes                |
| Python             | Yes                               | Yes                             | Yes                        | Yes                |
| None               | Yes                               | Yes                             | Yes                        | Yes                |

## Default environment variable names or application properties and sample code

Use the following environment variable names and application properties to connect compute services to your Redis server. To learn more about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| `AZURE_REDIS_HOST` | Redis endpoint | `<RedisName>.redis.cache.windows.net` |

#### Sample code

The following steps and code show you how to use a system-assigned managed identity to connect to Redis.

[!INCLUDE [code sample for redis](./includes/code-redis-me-id.md)]

### User-assigned managed identity

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| `AZURE_REDIS_HOST` | Redis endpoint | `<RedisName>.redis.cache.windows.net` |
| `AZURE_REDIS_CLIENTID`                | Managed-identity client ID        | `<client-ID>`                                    |

#### Sample code

The following steps and code show you how to use a user-assigned managed identity to connect to Redis.

[!INCLUDE [code sample for Redis](./includes/code-redis-me-id.md)]

### Connection string

> [!WARNING]
> We recommend that you use the most secure authentication flow available. The authentication flow described here requires a very high degree of trust in the application, and carries risks that aren't present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                            | Example value                                                                                        |
| --------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `AZURE_REDIS_CONNECTIONSTRING`      | `StackExchange.Redis` connection string | `<redis-server-name>.redis.cache.windows.net:6380,password=<redis-key>,ssl=True,defaultDatabase=0` |

#### [Java](#tab/java)

| Default environment variable name | Description             | Example value                                                                |
| --------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| `AZURE_REDIS_CONNECTIONSTRING`      | Jedis connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [Spring Boot](#tab/springBoot)

| Application properties | Description    | Example value                                   |
| ---------------------- | -------------- | ----------------------------------------------- |
| `spring.redis.host`      | Redis host     | `<redis-server-name>.redis.cache.windows.net` |
| `spring.redis.port`      | Redis port     | `6380`                                        |
| `spring.redis.database`  | Redis database | `0`                                           |
| `spring.redis.password`  | Redis key      | `<redis-key>`                                 |
| `spring.redis.ssl`       | SSL setting    | `true`                                        |

#### [Python](#tab/python)

| Default environment variable name | Description                | Example value                                                              |
|-----------------------------------|----------------------------|----------------------------------------------------------------------------|
| `AZURE_REDIS_CONNECTIONSTRING`      | `redis-py` connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [Go](#tab/go)

| Default environment variable name | Description                | Example value                                                              |
|-----------------------------------|----------------------------|----------------------------------------------------------------------------|
| `AZURE_REDIS_CONNECTIONSTRING`      | `redis-py` connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [Node.js](#tab/nodejs)

| Default environment variable name | Description                  | Example value                                                                |
| --------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `AZURE_REDIS_CONNECTIONSTRING`      | `node-redis` connection string | `rediss://:<redis-key>@<redis-server-name>.redis.cache.windows.net:6380/0` |

#### [Other](#tab/none)

| Default environment variable name | Description    | Example value                                   |
| --------------------------------- | -------------- | ----------------------------------------------- |
| `AZURE_REDIS_HOST`                  | Redis host     | `<redis-server-name>.redis.cache.windows.net`   |
| `AZURE_REDIS_PORT`                  | Redis port     | `6380`                                          |
| `AZURE_REDIS_DATABASE`              | Redis database | `0`                                             |
| `AZURE_REDIS_PASSWORD`              | Redis key      | `<redis-key>`                                   |
| `AZURE_REDIS_SSL`                   | SSL setting    | `true`                                          |

---

#### Sample code

The following steps and code show you how to use a connection string to connect to Azure Cache for Redis.

[!INCLUDE [code for redis](./includes/code-redis-secret.md)]

### Service principal

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| `AZURE_REDIS_HOST` | Redis endpoint | `<RedisName>.redis.cache.windows.net` |
| `AZURE_REDIS_CLIENTID`   | Client ID of the service principal    | `<client-ID>`           |
| `AZURE_REDIS_CLIENTSECRET`  | Secret of the service principal | `<client-secret>` |
| `AZURE_REDIS_TENANTID`   | Tenant ID of the service principal | `<tenant-id>` |

#### Sample code

The following steps and code show you how to use a service principal to connect to Redis.

[!INCLUDE [code sample for Redis](./includes/code-redis-me-id.md)]

## Related content

* [Learn about Service Connector concepts](./concept-service-connector-internals.md)
