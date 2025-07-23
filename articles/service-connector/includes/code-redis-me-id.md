---
author: xfz11
description: Code example
ms.service: service-connector
ms.topic: include
ms.date: 07/23/2025
ms.author: xiaofanzhou
---

#### [.NET](#tab/dotnet)

1. Install dependencies.

    ```bash
    dotnet add package Microsoft.Azure.StackExchangeRedis --version 3.2.0
    ```

1. Add the authentication logic with environment variables set by Service Connector. For more information, see [Microsoft.Azure.StackExchangeRedis Extension](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis).

    ```csharp
    using StackExchange.Redis;
    var cacheHostName = Environment.GetEnvironmentVariable("AZURE_REDIS_HOST");
    var configurationOptions = ConfigurationOptions.Parse($"{cacheHostName}:6380");

    // Uncomment the following lines corresponding to the authentication type you want to use.
    // For system-assigned identity.
    // await configurationOptions.ConfigureForAzureWithTokenCredentialAsync(new DefaultAzureCredential());

    // For user-assigned identity.
    // var managedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_REDIS_CLIENTID");
    // await configurationOptions.ConfigureForAzureWithUserAssignedManagedIdentityAsync(managedIdentityClientId);

    // Service principal secret.
    // var clientId = Environment.GetEnvironmentVariable("AZURE_REDIS_CLIENTID");
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_REDIS_TENANTID");
    // var secret = Environment.GetEnvironmentVariable("AZURE_REDIS_CLIENTSECRET");
    // await configurationOptions.ConfigureForAzureWithServicePrincipalAsync(clientId, tenantId, secret);


    var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(configurationOptions);
    ```

#### [Java](#tab/java)

Follow the instructions at [Connect to Azure Managed Redis](https://redis.io/docs/latest/develop/clients/jedis/amr/) for using the `redis-authx-entraid` package.

#### [Spring Boot](#tab/springBoot)

Not supported yet.

#### [Python](#tab/python)

Follow the instructions at [Connect to Azure Managed Redis](https://redis.io/docs/latest/develop/clients/redis-py/amr/) for using the `redis-entra-id` package.

#### [Go](#tab/go)

Follow the instructions at [Connect to Azure Managed Redis](https://redis.io/docs/latest/develop/clients/go/amr/) for using the `go-redis-entraid` package.

#### [Node.js](#tab/nodejs)

Follow the instructions at [Connect to Azure Managed Redis](https://redis.io/docs/latest/develop/clients/nodejs/amr/) for using the `@redis/entraid` package.

### [Other](#tab/other)

For other languages, you can use the Azure Identity client library (and connection information that Service Connector sets to the environment variables) to connect to Azure Cache for Redis.
