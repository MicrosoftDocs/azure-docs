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
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported Authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Cache for Redis using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                               | Yes                             | Yes                        | Yes                |
| Go                 | No                               | No                             | Yes                        | No                |
| Java               | Yes                               | Yes                             | Yes                        | Yes                |
| Java - Spring Boot | No                               | No                             | Yes                        | No                |
| Node.js            | Yes                               | Yes                             | Yes                        | Yes                |
| Python             | Yes                               | Yes                             | Yes                        | Yes                |
| None               | Yes                               | Yes                             | Yes                        | Yes                |

This table indicates that the only supported authentication method for all client types in the table is the Secret / connection string method. Other authentication methods are not supported for any of the client types to connect to Azure Cache for Redis using Service Connector.

## Default environment variable names or application properties and sample code

Use the environment variable names and application properties listed below to connect compute services to Redis Server. For each example below, replace the placeholder texts `<redis-server-name>`, and `<redis-key>` with your own Redis server name and key. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| AZURE_REDIS_HOST | Redis Endpoint | `<RedisName>.redis.cache.windows.net` |

#### Sample code

Refer to the steps and code below to connect to Redis using a system-assigned managed identity.
[!INCLUDE [code sample for redis](./includes/code-redis-me-id.md)]

### User-assigned managed identity

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| AZURE_REDIS_HOST | Redis Endpoint | `<RedisName>.redis.cache.windows.net` |
| AZURE_REDIS_CLIENTID                | managed identity client ID        | `<client-ID>`                                    |

#### Sample code

Refer to the steps and code below to connect to Redis using a user-assigned managed identity.
[!INCLUDE [code sample for Redis](./includes/code-redis-me-id.md)]

### Connection String

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

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

### Service Principal

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| AZURE_REDIS_HOST | Redis Endpoint | `<RedisName>.redis.cache.windows.net` |
| AZURE_REDIS_CLIENTID   | client ID of service principal    | `<client-ID>`           |
| AZURE_REDIS_CLIENTSECRET  | secret of the service principal | `<client-secret>` |
| AZURE_REDIS_TENANTID   | tenant ID of the service principal | `<tenant-id>` |

#### Sample code

Refer to the steps and code below to connect to Redis using a Service Principal.
[!INCLUDE [code sample for Redis](./includes/code-redis-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
