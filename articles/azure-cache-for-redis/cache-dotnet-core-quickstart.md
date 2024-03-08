---
title: 'Quickstart: Use Azure Cache for Redis in .NET Core'
description: In this quickstart, learn how to access Azure Cache for Redis in your .NET Core apps
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.date: 03/25/2022
---
# Quickstart: Use Azure Cache for Redis in .NET Core

In this quickstart, you incorporate Azure Cache for Redis into a .NET Core app to have access to a secure, dedicated cache that is accessible from any application within Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET Core console app.

## Skip to the code on GitHub

Clone the repo [https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet-core](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet-core) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a cache

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Make a note of the **HOST NAME** and the **Primary** access key. You'll use these values later to construct the *CacheConnection* secret.

## Add a local secret for the connection string

In your command window, execute the following command to store a new secret named *CacheConnection*, after replacing the placeholders (including angle brackets) for your cache name and primary access key:

```dos
dotnet user-secrets set CacheConnection "<cache name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<primary-access-key>"
```

## Connect to the cache with RedisConnection

The connection to your cache is managed by the `RedisConnection` class. The connection is first made in this statement from `Program.cs`:

```csharp
      _redisConnection = await RedisConnection.InitializeAsync(connectionString: configuration["CacheConnection"].ToString());

```

In `RedisConnection.cs`, you see the `StackExchange.Redis` namespace has been added to the code. This is needed for the `RedisConnection` class.

```csharp
using StackExchange.Redis;

```
<!-- Is this right Philo -->
The `RedisConnection` code ensures that there is always a healthy connection to the cache by managing the `ConnectionMultiplexer` instance from `StackExchange.Redis`. The `RedisConnection` class recreates the connection when a connection is lost and unable to reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

<!-- :::code language="csharp" source="~/samples-cache/quickstart/dotnet-core/RedisConnection.cs"::: -->

## Executing cache commands

In `program.cs`, you can see the following code for the `RunRedisCommandsAsync` method in the `Program` class for the console application:
<!-- Replaced this code with lines 57-81 from dotnet-core/Program.cs -->
```csharp
private static async Task RunRedisCommandsAsync(string prefix)
    {
        // Simple PING command
        Console.WriteLine($"{Environment.NewLine}{prefix}: Cache command: PING");
        RedisResult pingResult = await _redisConnection.BasicRetryAsync(async (db) => await db.ExecuteAsync("PING"));
        Console.WriteLine($"{prefix}: Cache response: {pingResult}");

        // Simple get and put of integral data types into the cache
        string key = "Message";
        string value = "Hello! The cache is working from a .NET console app!";

        Console.WriteLine($"{Environment.NewLine}{prefix}: Cache command: GET {key} via StringGetAsync()");
        RedisValue getMessageResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringGetAsync(key));
        Console.WriteLine($"{prefix}: Cache response: {getMessageResult}");

        Console.WriteLine($"{Environment.NewLine}{prefix}: Cache command: SET {key} \"{value}\" via StringSetAsync()");
        bool stringSetResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringSetAsync(key, value));
        Console.WriteLine($"{prefix}: Cache response: {stringSetResult}");

        Console.WriteLine($"{Environment.NewLine}{prefix}: Cache command: GET {key} via StringGetAsync()");
        getMessageResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringGetAsync(key));
        Console.WriteLine($"{prefix}: Cache response: {getMessageResult}");

        // Store serialized object to cache
        Employee e007 = new Employee("007", "Davide Columbo", 100);
        stringSetResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringSetAsync("e007", JsonSerializer.Serialize(e007)));
        Console.WriteLine($"{Environment.NewLine}{prefix}: Cache response from storing serialized Employee object: {stringSetResult}");

        // Retrieve serialized object from cache
        getMessageResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringGetAsync("e007"));
        Employee e007FromCache = JsonSerializer.Deserialize<Employee>(getMessageResult);
        Console.WriteLine($"{prefix}: Deserialized Employee .NET object:{Environment.NewLine}");
        Console.WriteLine($"{prefix}: Employee.Name : {e007FromCache.Name}");
        Console.WriteLine($"{prefix}: Employee.Id   : {e007FromCache.Id}");
        Console.WriteLine($"{prefix}: Employee.Age  : {e007FromCache.Age}{Environment.NewLine}");
    }

```

Cache items can be stored and retrieved by using the `StringSetAsync` and `StringGetAsync` methods.

In the example, you can see the `Message` key is set to value. The app updated that cached value. The app also executed the `PING` and command.

### Work with .NET objects in the cache

The Redis server stores most data as strings, but these strings can contain many types of data, including serialized binary data, which can be used when storing .NET objects in the cache.

Azure Cache for Redis can cache both .NET objects and primitive data types, but before a .NET object can be cached it must be serialized.

This .NET object serialization is the responsibility of the application developer, and gives the developer flexibility in the choice of the serializer.

The following `Employee` class was defined in *Program.cs*  so that the sample could also show how to get and set a serialized object :

```csharp
class Employee
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }

        public Employee(string id, string name, int age)
        {
            Id = id;
            Name = name;
            Age = age;
        }
    }
```

## Run the sample

If you have opened any files, save them and build the app with the following command:

```dos
dotnet build
```

Run the app with the following command to test serialization of .NET objects:

```dos
dotnet run
```

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Console app completed":::

## Clean up resources

If you continue to use this quickstart, you can keep the resources you created and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually on the left instead of deleting the resource group.
>
### To delete a resource group

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

1. In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, select **...** then **Delete resource group**.

    :::image type="content" source="media/cache-dotnet-core-quickstart/cache-delete-resource-group.png" alt-text="Delete":::

1. You'll be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
