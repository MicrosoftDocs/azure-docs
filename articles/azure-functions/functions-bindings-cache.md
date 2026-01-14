---
title: Using Azure Functions for Azure Cache for Redis
description: Learn how to use Azure Functions Azure Cache for Redis
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, ignite-2024
ms.topic: reference
ms.date: 07/11/2024
---

# Overview of Azure functions for Azure Redis

This article describes how to use either Azure Managed Redis or Azure Cache for Redis with Azure Functions to create optimized serverless and event-driven architectures.

Azure Functions provides an event-driven programming model where triggers and bindings are key features. With Azure Functions, you can easily build event-driven serverless applications. Azure Redis services (Azure Managed Redis and Azure Cache for Redis) provide a set of building blocks and best practices for building distributed applications, including microservices, state management, pub/sub messaging, and more.

Azure Redis can be used as a trigger for Azure Functions, allowing you to initiate a serverless workflow. This functionality can be highly useful in data architectures like a write-behind cache, or any event-based architectures.

You can integrate Azure Redis and Azure Functions to build functions that react to events from Azure Redis or external systems.

| Action  | Direction |
|---------|-----------|
| [Trigger on Redis pub sub messages](functions-bindings-cache-trigger-redispubsub.md)   | Trigger |
| [Trigger on Redis lists](functions-bindings-cache-trigger-redislist.md)  | Trigger |
| [Trigger on Redis streams](functions-bindings-cache-trigger-redisstream.md) | Trigger |
| [Read a cached value](functions-bindings-cache-input.md) | Input |
| [Write a values to cache](functions-bindings-cache-output.md) | Output |  

## Scope of availability for functions triggers and bindings

|Tier     | Azure Cache for Redis (Basic, Standard, Premium, Enterprise, Enterprise Flash) | Azure Managed Redis (Memory Optimized, Basic, Compute Optimized, Flash Optimized) | 
|---------|:---------:|:---------:|
|Pub/Sub  | Yes  | Yes  |
|Lists | Yes  | Yes   |
|Streams | Yes  | Yes  |
|Bindings | Yes  | Yes  |

> [!IMPORTANT]
> Redis triggers are currently only supported for functions running in either a [Elastic Premium plan](functions-premium-plan.md) or a dedicated [App Service plan](./dedicated-plan.md).

::: zone pivot="programming-language-csharp"

## Install extension

### [Isolated worker model](#tab/isolated-process)

Functions run in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Redis).

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Redis
```

### [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

Functions run in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Redis).

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis
```

---
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  
[!INCLUDE [functions-install-extension-bundle](../../includes/functions-install-extension-bundle.md)]  
::: zone-end  
::: zone pivot="programming-language-java"  
## Update packages

Add the [Azure Functions Java Redis Annotations package](https://mvnrepository.com/artifact/com.microsoft.azure.functions/azure-functions-java-library-redis) to your project by updating the `pom.xml` file to add this dependency:

```xml
<dependency>
  <groupId>com.microsoft.azure.functions</groupId>
  <artifactId>azure-functions-java-library-redis</artifactId>
  <version>1.0.0</version>
</dependency>
```
::: zone-end  

## Redis connection string

Azure Redis triggers and bindings have a required property that indicates the application setting or collection name that contains cache connection information. The Redis trigger or binding looks for an environmental variable holding the connection string with the name passed to the `Connection` parameter.

In local development, the `Connection` can be defined using the [local.settings.json](/azure/azure-functions/functions-develop-local#local-settings-file) file. When deployed to Azure, [application settings](/azure/azure-functions/functions-how-to-use-azure-function-app-settings) can be used.

When connecting to a cache instance with an Azure function, you can use one of these kinds of connections in your deployments: 

### [User-assigned managed identity](#tab/user-assigned)

A user-assigned managed identity must be associated with your function app, and that identity must also be granted explicit permissions in your cache service. For more information, see [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication).

### [System-assigned managed identity](#tab/system-assigned)

The built-in system-assigned managed identity must be enabled in your function app, and that identity must also be granted explicit permissions in your cache service. For more information, see [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication).

### [Connection string](#tab/connection-string)

The connection string can be found on the [**Access keys**](/azure/azure-cache-for-redis/cache-configure#access-keys) menu in the Azure Managed Redis or Azure Cache for Redis portal.

For optimal security, your function app should use Microsoft Entra ID with managed identities to authorize requests against your cache, if possible. Authorization by using Microsoft Entra ID and managed identities provides superior security and ease of use over shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication). 

### [Service principal](#tab/service-principal)

Connecting to the service using a service principal is only supported when running locally during development. A service principal linked to your account must be granted explicit permissions in your cache service.

---

These examples show the key name and value of app settings required to connect to each cache service based on the kind of client authentication, assuming that the `Connection` property in the binding is set to `Redis`.

### [Azure Managed Redis](#tab/azure-managed-redis/user-assigned)

```JSON
"Redis__redisHostName": "<cacheName>.<region>.redis.azure.net",
"Redis__principalId": "<principalId>",
"Redis__clientId": "<clientId>"
```

### [Azure Managed Redis](#tab/azure-managed-redis/system-assigned)

```JSON
"Redis__redisHostName": "<cacheName>.<region>.redis.azure.net",
"Redis__principalId": "<principalId>"
```

### [Azure Managed Redis](#tab/azure-managed-redis/connection-string)

```JSON
"Redis": "<cacheName>.<region>.redis.azure.net:10000,password=..."
```
### [Azure Managed Redis](#tab/azure-managed-redis/service-principal)

Connections using Service Principal Secrets are only available during local development.

```JSON
"Redis__redisHostName": "<cacheName>.<region>.redis.azure.net",
"Redis__principalId": "<principalId>",
"Redis__clientId": "<clientId>"
"Redis__tenantId": "<tenantId>"
"Redis__clientSecret": "<clientSecret>"
```

### [Azure Cache for Redis](#tab/azure-cache-redis/user-assigned)

```JSON
"Redis__redisHostName": "<cacheName>.redis.cache.windows.net",
"Redis__principalId": "<principalId>",
"Redis__clientId": "<clientId>"
```

### [Azure Cache for Redis](#tab/azure-cache-redis/system-assigned)

```JSON
"Redis__redisHostName": "<cacheName>.redis.cache.windows.net",
"Redis__principalId": "<principalId>"
```

### [Azure Cache for Redis](#tab/azure-cache-redis/connection-string)

```JSON
"Redis": "<cacheName>.redis.cache.windows.net:6380,password=..."
```
### [Azure Cache for Redis](#tab/azure-cache-redis/service-principal)

Connections using Service Principal Secrets are only available during local development.

```JSON
"Redis__redisHostName": "<cacheName>.redis.cache.windows.net",
"Redis__principalId": "<principalId>",
"Redis__clientId": "<clientId>"
"Redis__tenantId": "<tenantId>"
"Redis__clientSecret": "<clientSecret>"
```

---

## Related content

- [Introduction to Azure Functions](/azure/azure-functions/functions-overview)
- [Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis](/azure/redis/tutorial-functions-getting-started)
- [Tutorial: Create a write-behind cache by using Azure Functions and Azure Cache for Redis](/azure/redis/tutorial-write-behind)
