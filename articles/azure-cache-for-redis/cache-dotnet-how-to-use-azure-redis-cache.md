---
title: 'Quickstart: Use Azure Cache for Redis in .NET Framework'
description: In this quickstart, learn how to access Azure Cache for Redis from your .NET apps



ms.devlang: csharp
ms.topic: quickstart
ms.custom: devx-track-csharp, mvc, mode-other, devx-track-dotnet, ignite-2024
ms.date: 03/25/2022
---
# Quickstart: Use Azure Cache for Redis in .NET Framework

In this quickstart, you incorporate Azure Cache for Redis into a .NET Framework app to have access to a secure, dedicated cache that is accessible from any application within Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET console app.

## Skip to the code on GitHub

Clone the repo from [Azure-Samples/azure-cache-redis-samples](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/)
- [.NET Framework 4 or higher](https://dotnet.microsoft.com/download/dotnet-framework), which is required by the StackExchange.Redis client.

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

1. Edit the *App.config* file and add the following contents:

    ```xml
    <appSettings>

   <add key="RedisHostName" value="your_redis_cache_hostname"/>
  </appSettings>
    ```

1. Replace "your_Azure_Redis_hostname" with your Azure Redis host name and port numbers. For example: `cache-name.eastus.redis.azure.net:10000` for Azure Cache for Redis Enterprise, and `cache-name.redis.cache.windows.net:6380` for Azure Cache for Redis services.

1. Save the file.

## Configure the cache client

<!-- this section was removed from the core sample -->
In this section, you prepare the console application to use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client for .NET.

1. In Visual Studio, select **Tools** > **NuGet Package Manager** > **Package Manager Console**, and run the following command from the Package Manager Console window.

    ```powershell
    Install-Package Microsoft.Azure.StackExchangeRedis
    ```
    
1. Once the installation is completed, the *StackExchange.Redis* cache client is available to use with your project.

## Connect to the cache with RedisConnection

The connection to your cache is managed by the `RedisConnection` class. The connection is first made in this statement from `Program.cs`:

```csharp
     _redisConnection = await RedisConnection.InitializeAsync(redisHostName: ConfigurationManager.AppSettings["RedisHostName"].ToString());
```

The value of the *CacheConnection* appSetting is used to reference the cache connection string from the Azure portal as the password parameter.

In `RedisConnection.cs`, you see the `StackExchange.Redis` namespace with the `using` keyword. This is needed for the `RedisConnection` class.

```csharp
using StackExchange.Redis;
```

<!-- Is this right Philo -->
The `RedisConnection` code ensures that there is always a healthy connection to the cache by managing the `ConnectionMultiplexer` instance from `StackExchange.Redis`. The `RedisConnection` class recreates the connection when a connection is lost and unable to reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

<!-- :::code language="csharp" source="~/samples-cache/quickstart/dotnet/Redistest/RedisConnection.cs"::: -->

## Executing cache commands

In `program.cs`, you can see the following code for the `RunRedisCommandsAsync` method in the `Program` class for the console application:

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

One simple way to serialize objects is to use the `JsonConvert` serialization methods in `System.text.Json`.

Add the `System.text.Json` namespace to Visual Studio:

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console**.

1. Then, run the following command from the Package Manager Console window.
    ```powershell
    Install-Package system.text.json
    ```
    
<!-- :::image type="content" source="media/cache-dotnet-how-to-use-azure-redis-cache/cache-console-app-partial.png" alt-text="Screenshot that shows console app."::: -->

The following `Employee` class was defined in *Program.cs*  so that the sample could also show how to get and set a serialized object:

```csharp
class Employee
{
    public string Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }

    public Employee(string employeeId, string name, int age)
    {
        Id = employeeId;
        Name = name;
        Age = age;
    }
}
```

## Run the sample

Press **Ctrl+F5** to build and run the console app to test serialization of .NET objects.

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Console app completed":::

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Next steps

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
