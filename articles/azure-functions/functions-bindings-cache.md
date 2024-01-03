---
title: Using Azure Functions for Azure Cache for Redis (preview)
description: Learn how to use Azure Functions Azure Cache for Redis
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 07/26/2023
---

# Overview of Azure functions for Azure Cache for Redis (preview)

This article describes how to use Azure Cache for Redis with Azure Functions to create optimized serverless and event-driven architectures.

Azure Functions provide an event-driven programming model where triggers and bindings are key features. With Azure Functions, you can easily build event-driven serverless applications. Azure Cache for Redis provides a set of building blocks and best practices for building distributed applications, including microservices, state management, pub/sub messaging, and more.

Azure Cache for Redis can be used as a trigger for Azure Functions, allowing you to initiate a serverless workflow. This functionality can be highly useful in data architectures like a write-behind cache, or any event-based architectures.

You can integrate Azure Cache for Redis and Azure Functions to build functions that react to events from Azure Cache for Redis or external systems.

| Action  | Direction | Type | Preview |
|---------|-----------|------|------|
| Triggers on Redis pub sub messages   | N/A | [RedisPubSubTrigger](functions-bindings-cache-trigger-redispubsub.md) | Yes|
| Triggers on Redis lists | N/A | [RedisListsTrigger](functions-bindings-cache-trigger-redislist.md)  | Yes |
| Triggers on Redis streams | N/A | [RedisStreamsTrigger](functions-bindings-cache-trigger-redisstream.md) | Yes |

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Pub/Sub  | Yes  | Yes  |  Yes  |
|Lists | Yes  | Yes   |  Yes  |
|Streams | Yes  | Yes  |  Yes  |

> [!IMPORTANT]
> Redis triggers aren't currently supported for functions running in the [Consumption plan](consumption-plan.md).
>

::: zone pivot="programming-language-csharp"

## Install extension

### [Isolated worker model](#tab/isolated-process)

Functions run in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Redis).

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Redis --prerelease
```

### [In-process model](#tab/in-process)

Functions run in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Redis).

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis --prerelease
```

---
::: zone-end

## Install bundle

::: zone pivot="programming-language-java"

1. Create a Java function project. You could use Maven:
   `mvn archetype:generate -DarchetypeGroupId=com.microsoft.azure -DarchetypeArtifactId=azure-functions-archetype -DjavaVersion=8`

1. Add the extension bundle by adding or replacing the following code in your _host.json_ file:

    ```json
    {
      "version": "2.0",
      "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
        "version": "[4.11.*, 5.0.0)"
      }
    }
   ```

   >[!WARNING]
   >The Redis extension is currently only available in a preview bundle release.
   >

1. Add the Java library for Redis bindings to the `pom.xml` file:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.functions</groupId>
      <artifactId>azure-functions-java-library-redis</artifactId>
      <version>${azure.functions.java.library.redis.version}</version>
    </dependency>
    ```

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

1. Add the extension bundle by adding or replacing the following code in your _host.json_ file:

    <!-- I don't see this in the samples.  -->
    ```json
    {
      "version": "2.0",
      "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
        "version": "[4.11.*, 5.0.0)"
    }
  }
  ```

    >[!WARNING]
    >The Redis extension is currently only available in a preview bundle release.
    >

::: zone-end

## Redis connection string

Azure Cache for Redis triggers and bindings have a required property for the cache connection string. The connection string can be found on the [**Access keys**](/azure/azure-cache-for-redis/cache-configure#access-keys) menu in the Azure Cache for Redis portal. The Redis trigger or binding looks for an environmental variable holding the connection string with the name passed to the `ConnectionStringSetting` parameter. In local development, the `ConnectionStringSetting` can be defined using the [local.settings.json](/azure/azure-functions/functions-develop-local#local-settings-file) file. When deployed to Azure, [application settings](/azure/azure-functions/functions-how-to-use-azure-function-app-settings) can be used.

## Related content

- [Introduction to Azure Functions](/azure/azure-functions/functions-overview)
- [Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Tutorial: Create a write-behind cache by using Azure Functions and Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
