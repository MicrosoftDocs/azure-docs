---
title: 'Quickstart: Use Azure Cache for Redis with .NET Core'
description: Modify a sample .NET Core app and connect the app to Azure Cache for Redis.



ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.date: 03/25/2022
#Customer intent: As a .NET Core developer who is new to Azure Cache for Redis, I want to create a new .NET Core app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a .NET Core app

In this quickstart, you incorporate Azure Cache for Redis into a .NET Core app for access to a secure, dedicated cache that is accessible from any application in Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET Core console app.

## Skip to the code

This article describes how to modify the code for a sample app to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the sample code, see the [.NET Core quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet-core) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Make a note of the values for **HOST NAME** and the **Primary** access key. You use these values later to construct the `CacheConnection` secret.

## Add a local secret for the connection string

In your Command Prompt window, execute the following command to store a new secret named `CacheConnection`. Replace the placeholders (including angle brackets) with your cache name (`<cache name>`) and primary access key (`<primary-access-key>`):

```dos
dotnet user-secrets set CacheConnection "<cache name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<primary-access-key>"
```

## Connect to the cache by using RedisConnection

The connection to your cache is managed by the `RedisConnection` class. First, make the connection in this statement in *Program.cs*:

```csharp
      _redisConnection = await RedisConnection.InitializeAsync(connectionString: configuration["CacheConnection"].ToString());

```

In *RedisConnection.cs*, the StackExchange.Redis namespace is added to the code. The namespace is required for the `RedisConnection` class.

```csharp
using StackExchange.Redis;

```

The `RedisConnection` class code ensures that there's always a healthy connection to the cache. The connection is managed by the `ConnectionMultiplexer` instance from StackExchange.Redis. The `RedisConnection` class re-creates the connection when a connection is lost and can't reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in the [StackExchange.Redis GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

<!-- :::code language="csharp" source="~/samples-cache/quickstart/dotnet-core/RedisConnection.cs"::: -->

## Execute cache commands

In *Program.cs*, you can see the following code for the `RunRedisCommandsAsync` method in the `Program` class for the console application:

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

You can store and retrieve cache items by using the `StringSetAsync` and `StringGetAsync` methods.

In the example, you can see the `Message` key is set to a value. The app updated that cached value. The app also executed the `PING` and command.

### Work with .NET objects in the cache

The Redis server stores most data in string format. The strings can contain many types of data, including serialized binary data. You can use serialized binary data when you store .NET objects in the cache.

Azure Cache for Redis can cache both .NET objects and primitive data types, but before a .NET object can be cached, it must be serialized.

The .NET object serialization is the responsibility of the application developer. The object serialization gives the developer flexibility in their choice of the serializer.

The following `Employee` class was defined in *Program.cs*  so that the sample could also show how to get and set a serialized object:

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

If you opened any files, save the files. Then, build the app by using the following command:

```dos
dotnet build
```

To test serialization of .NET objects, run this command:

```dos
dotnet run
```

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Screenshot that shows a console test completed.":::

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience best practices for your cache](cache-best-practices-connection.md)
- [Development best practices for your cache](cache-best-practices-development.md)
