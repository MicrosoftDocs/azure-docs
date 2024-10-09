---
title: 'Quickstart: Use Azure Cache for Redis with .NET'
description: Modify a sample .NET app and connect the app to Azure Cache for Redis.



ms.devlang: csharp
ms.topic: quickstart
ms.custom: devx-track-csharp, mvc, mode-other, devx-track-dotnet
ms.date: 03/25/2022
#Customer intent: As a .NET developer who is new to Azure Cache for Redis, I want to create a new .NET app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a .NET app

In this quickstart, you incorporate Azure Cache for Redis into a .NET app for access to a secure, dedicated cache that is accessible from any application in Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET console app.

## Skip to the code on GitHub

This article describes how to modify the code for a sample app to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the code, see the [.NET quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/)
- [.NET Framework 4 or later](https://dotnet.microsoft.com/download/dotnet-framework) as required by the StackExchange.Redis client

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

1. Create a file on your computer named *CacheSecrets.config*. Place it in the *C:\AppSecrets\* folder.

1. Edit the *CacheSecrets.config* file and add the following contents:

    ```xml
    <appSettings>
        <add key="CacheConnection" value="<host-name>,abortConnect=false,ssl=true,allowAdmin=true,password=<access-key>"/>
    </appSettings>
    ```

   - Replace `<host-name>` with your cache host name.

   - Replace `<access-key>` with the primary key for your cache.

1. Save the file.

## Configure the cache client

<!-- this section was removed from the core sample -->
In this section, you prepare the console application to use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client for .NET.

1. In Visual Studio, select **Tools** > **NuGet Package Manager** > **Package Manager Console**. Run the following command in the Package Manager Console window:

    ```powershell
    Install-Package StackExchange.Redis
    ```
 
1. When the installation is finished, the *StackExchange.Redis* cache client is available to use with your project.

## Connect to the Secrets cache

In Visual Studio, open your *App.config* file to verify it contains an `appSettings` `file` attribute that references the *CacheSecrets.config* file:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.7.2" />
    </startup>

    <appSettings file="C:\AppSecrets\CacheSecrets.config"></appSettings>
</configuration>
```

Never store credentials in your source code. To keep this sample simple, we use an external secrets config file. A better approach would be to use [Azure Key Vault with certificates](/rest/api/keyvault/certificate-scenarios).

## Connect to the cache by using RedisConnection

The connection to your cache is managed by the `RedisConnection` class. First, make the connection in this statement in *Program.cs*:

```csharp
     _redisConnection = await RedisConnection.InitializeAsync(connectionString: ConfigurationManager.AppSettings["CacheConnection"].ToString());


```

The value of the *CacheConnection* app setting is used to reference the cache connection string from the Azure portal as the password parameter.

In *RedisConnection.cs*, the StackExchange.Redis namespace appears as a `using` statement that the `RedisConnection` class requires:

```csharp
using StackExchange.Redis;
```

The `RedisConnection` class code ensures that there's always a healthy connection to the cache. The connection is managed by the `ConnectionMultiplexer` instance from StackExchange.Redis. The `RedisConnection` class re-creates the connection when a connection is lost and can't reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in the [StackExchange.Redis GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

<!-- :::code language="csharp" source="~/samples-cache/quickstart/dotnet/Redistest/RedisConnection.cs"::: -->

## Execute cache commands

In *Program.cs*, you can see the following code for the `RunRedisCommandsAsync` method in the `Program` class for the console application:

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

Azure Cache for Redis can cache both .NET objects and primitive data types, but before a .NET object can be cached, it must be serialized.

This .NET object serialization is the responsibility of the application developer. You have some flexibility in your choice of the serializer.

A simple way to serialize objects is to use the `JsonConvert` serialization methods in *System.text.Json*.

Add the System.text.Json namespace in Visual Studio:

1. Select **Tools** > **NuGet Package Manager** > *Package Manager Console**.

1. Then, run the following command in the Package Manager Console window:

    ```powershell
    Install-Package system.text.json
    ```
    
<!-- :::image type="content" source="media/cache-dotnet-how-to-use-azure-redis-cache/cache-console-app-partial.png" alt-text="Screenshot that shows a partial console app."::: -->

The following `Employee` class was defined in *Program.cs* so that the sample can show how to get and set a serialized object:

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

To build and run the console app to test serialization of .NET objects, select Ctrl+F5.

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Screenshot that shows the console app completed.":::

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience best practices for your cache](cache-best-practices-connection.md)
- [Development best practices for your cache](cache-best-practices-development.md)
