---
title: 'Quickstart: Use Azure Cache for Redis in .NET Core'
description: In this quickstart, learn how to access Azure Cache for Redis in your .NET Core apps
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other
ms.topic: quickstart
ms.date: 02/24/2022
---
# Quickstart: Use Azure Cache for Redis in .NET Core

In this quickstart, you incorporate Azure Cache for Redis into a .NET Core app to have access to a secure, dedicated cache that is accessible from any application within Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET Core console app.

## Skip to the code on GitHub

Skip straight to the code bye downloading the sample from [.NET Core quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet-core) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a cache

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Make a note of the **HOST NAME** and the **Primary** access key. You'll use these values later to construct the *CacheConnection* secret.

## Add Secret Manager to the project

In this section, you add the [Secret Manager tool](/aspnet/core/security/app-secrets) to your project. The Secret Manager tool stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code.

Open your *Redistest.csproj* file. See the `DotNetCliToolReference` element that includes *Microsoft.Extensions.SecretManager.Tools*. Also, observe the `UserSecretsId` element as shown below, and save the file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net5.0</TargetFramework>
        <UserSecretsId>Redistest</UserSecretsId>
    </PropertyGroup>
    <ItemGroup>
        <DotNetCliToolReference Include="Microsoft.Extensions.SecretManager.Tools" Version="2.0.0" />
    </ItemGroup>
</Project>
```

Execute the following command to add the *Microsoft.Extensions.Configuration.UserSecrets* package to the project:

```dos
dotnet add package Microsoft.Extensions.Configuration.UserSecrets
```

Execute the following command to restore your packages:

```dos
dotnet restore
```

In your command window, execute the following command to store a new secret named *CacheConnection*, after replacing the placeholders (including angle brackets) for your cache name and primary access key:

```dos
dotnet user-secrets set CacheConnection "<cache name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<primary-access-key>"
```

This following code initializes a configuration to access the user secret for the Azure Cache for Redis connection string.

```csharp
var builder = new ConfigurationBuilder()
  .AddUserSecrets<Program>();
var configuration = builder.Build();
```

## Connect to the cache

Add the following `using` statement to *Program.cs*:

```csharp
using StackExchange.Redis;
```

The connection to the Azure Cache for Redis is managed by the `ConnectionMultiplexer` class. This class should be shared and reused throughout your client application. Don't create a new connection for each operation.

<!-- Delete and replace with "for an example of how to initialize and re-use a ConnectionMultiplexer, please see RedisConnection.cs" -->
For an example of how to initialize and reuse a `ConnectionMultiplexer`, see `RedisConnection.cs`.

The code provides a thread-safe way to initialize only a single connected `ConnectionMultiplexer` instance. `abortConnect` is set to false, which means that the call succeeds even if a connection to the Azure Cache for Redis isn't established. One key feature of `ConnectionMultiplexer` is that it automatically restores connectivity to the cache once the network issue or other causes are resolved.

The value of the *CacheConnection* secret is accessed using the Secret Manager configuration provider and used as the password parameter.

## Handle RedisConnectionException and SocketException by reconnecting

A recommended best practice when calling methods on `ConnectionMultiplexer` is to attempt to resolve `RedisConnectionException` and `SocketException` exceptions automatically by closing and reestablishing the connection.

:::code language="csharp" source="~/samples-cache/quickstart/dotnet-core/RedisConnection.cs":::

<!-- 

```csharp
using StackExchange.Redis;
using System;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;

namespace Redistest
{
    public class RedisConnection : IDisposable
    {
        private long _lastReconnectTicks = DateTimeOffset.MinValue.UtcTicks;
        private DateTimeOffset _firstErrorTime = DateTimeOffset.MinValue;
        private DateTimeOffset _previousErrorTime = DateTimeOffset.MinValue;

        // StackExchange.Redis will also be trying to reconnect internally,
        // so limit how often we recreate the ConnectionMultiplexer instance
        // in an attempt to reconnect
        private readonly TimeSpan ReconnectMinInterval = TimeSpan.FromSeconds(60);

        // If errors occur for longer than this threshold, StackExchange.Redis
        // may be failing to reconnect internally, so we'll recreate the
        // ConnectionMultiplexer instance
        private readonly TimeSpan ReconnectErrorThreshold = TimeSpan.FromSeconds(30);
        private readonly TimeSpan RestartConnectionTimeout = TimeSpan.FromSeconds(15);
        private const int RetryMaxAttempts = 5;

        private SemaphoreSlim _reconnectSemaphore = new SemaphoreSlim(initialCount: 1, maxCount: 1);
        private readonly string _connectionString;
        private ConnectionMultiplexer _connection;
        private IDatabase _database;

        private RedisConnection(string connectionString)
        {
            _connectionString = connectionString;
        }

        public static async Task<RedisConnection> InitializeAsync(string connectionString)
        {
            var redisConnection = new RedisConnection(connectionString);
            await redisConnection.ForceReconnectAsync(initializing: true);

            return redisConnection;
        }

        // In real applications, consider using a framework such as
        // Polly to make it easier to customize the retry approach.
        // For more info, please see: https://github.com/App-vNext/Polly
        public async Task<T> BasicRetryAsync<T>(Func<IDatabase, Task<T>> func)
        {
            int reconnectRetry = 0;

            while (true)
            {
                try
                {
                    return await func(_database);
                }
                catch (Exception ex) when (ex is RedisConnectionException || ex is SocketException)
                {
                    reconnectRetry++;
                    if (reconnectRetry > RetryMaxAttempts)
                    {
                        throw;
                    }

                    try
                    {
                        await ForceReconnectAsync();
                    }
                    catch (ObjectDisposedException) { }
                }
            }
        }

        /// <summary>
        /// Force a new ConnectionMultiplexer to be created.
        /// NOTES:
        ///     1. Users of the ConnectionMultiplexer MUST handle ObjectDisposedExceptions, which can now happen as a result of calling ForceReconnectAsync().
        ///     2. Call ForceReconnectAsync() for RedisConnectionExceptions and RedisSocketExceptions. You can also call it for RedisTimeoutExceptions,
        ///         but only if you're using generous ReconnectMinInterval and ReconnectErrorThreshold. Otherwise, establishing new connections can cause
        ///         a cascade failure on a server that's timing out because it's already overloaded.
        ///     3. The code will:
        ///         a. wait to reconnect for at least the "ReconnectErrorThreshold" time of repeated errors before actually reconnecting
        ///         b. not reconnect more frequently than configured in "ReconnectMinInterval"
        /// </summary>
        /// <param name="initializing">Should only be true when ForceReconnect is running at startup.</param>
        private async Task ForceReconnectAsync(bool initializing = false)
        {
            long previousTicks = Interlocked.Read(ref _lastReconnectTicks);
            var previousReconnectTime = new DateTimeOffset(previousTicks, TimeSpan.Zero);
            TimeSpan elapsedSinceLastReconnect = DateTimeOffset.UtcNow - previousReconnectTime;

            // We want to limit how often we perform this top-level reconnect, so we check how long it's been since our last attempt.
            if (elapsedSinceLastReconnect < ReconnectMinInterval)
            {
                return;
            }

            try
            {
                await _reconnectSemaphore.WaitAsync(RestartConnectionTimeout);
            }
            catch
            {
                // If we fail to enter the semaphore, then it is possible that another thread has already done so.
                // ForceReconnectAsync() can be retried while connectivity problems persist.
                return;
            }

            try
            {
                var utcNow = DateTimeOffset.UtcNow;
                elapsedSinceLastReconnect = utcNow - previousReconnectTime;

                if (_firstErrorTime == DateTimeOffset.MinValue && !initializing)
                {
                    // We haven't seen an error since last reconnect, so set initial values.
                    _firstErrorTime = utcNow;
                    _previousErrorTime = utcNow;
                    return;
                }

                if (elapsedSinceLastReconnect < ReconnectMinInterval)
                {
                    return; // Some other thread made it through the check and the lock, so nothing to do.
                }

                TimeSpan elapsedSinceFirstError = utcNow - _firstErrorTime;
                TimeSpan elapsedSinceMostRecentError = utcNow - _previousErrorTime;

                bool shouldReconnect =
                    elapsedSinceFirstError >= ReconnectErrorThreshold // Make sure we gave the multiplexer enough time to reconnect on its own if it could.
                    && elapsedSinceMostRecentError <= ReconnectErrorThreshold; // Make sure we aren't working on stale data (e.g. if there was a gap in errors, don't reconnect yet).

                // Update the previousErrorTime timestamp to be now (e.g. this reconnect request).
                _previousErrorTime = utcNow;

                if (!shouldReconnect && !initializing)
                {
                    return;
                }

                _firstErrorTime = DateTimeOffset.MinValue;
                _previousErrorTime = DateTimeOffset.MinValue;

                ConnectionMultiplexer oldConnection = _connection;
                try
                {
                    await oldConnection?.CloseAsync();
                }
                catch (Exception)
                {
                    // Ignore any errors from the oldConnection
                }

                Interlocked.Exchange(ref _connection, null);
                ConnectionMultiplexer newConnection = await ConnectionMultiplexer.ConnectAsync(_connectionString);
                Interlocked.Exchange(ref _connection, newConnection);

                Interlocked.Exchange(ref _lastReconnectTicks, utcNow.UtcTicks);
                IDatabase newDatabase = _connection.GetDatabase();
                Interlocked.Exchange(ref _database, newDatabase);
            }
            finally
            {
                _reconnectSemaphore.Release();
            }
        }

        public void Dispose()
        {
            try { _connection?.Dispose(); } catch { }
        }
    }
}
-->```

## Executing cache commands

In `Program.cs`, observe the following code for the `Main` procedure of the `Program` class for your console application:
<!-- Replace this code with lines 57-81 from dotnet-core/Program.cs -->
```csharp
      // Simple PING command
      Console.WriteLine($"{Environment.NewLine}{prefix}: Cache command: PING");
      RedisResult pingResult = await _redisConnection.BasicRetryAsync(async (db) => await db.ExecuteAsync("PING"));
      Console.WriteLine($"{prefix}: Cache response: {pingResult}");

      // Simple get and put of integral data types into the cache
      string key = "Message";
      string value = "Hello! The cache is working from a .NET Core console app!";

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
```

Save *Program.cs*.

Azure Cache for Redis has a configurable number of databases (default of 16) that can be used to logically separate the data within an Azure Cache for Redis. The code connects to the default database, DB 0. For more information, see [What are Redis databases?](cache-development-faq.yml#what-are-redis-databases-) and [Default Redis server configuration](cache-configure.md#default-redis-server-configuration).

Cache items can be stored and retrieved by using the `StringSet` and `StringGet` methods.

Redis stores most data as Redis strings, but these strings can contain many types of data, including serialized binary data, which can be used when storing .NET objects in the cache.

Execute the following command in your command window to build the app:

```dos
dotnet build
```

Then run the app with the following command:

```dos
dotnet run
```

In the example below, you can see the `Message` key previously had a cached value, which was set using the Redis Console in the Azure portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-partial.png" alt-text="Console app partial":::

## Work with .NET objects in the cache

Azure Cache for Redis can cache both .NET objects and primitive data types, but before a .NET object can be cached it must be serialized. This .NET object serialization is the responsibility of the application developer, and gives the developer flexibility in the choice of the serializer.

One simple way to serialize objects is to use the `JsonConvert` serialization methods in [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) and serialize to and from JSON. In this section, you'll add a .NET object to the cache.

Add the following `Employee` class definition to *Program.cs*:
<!-- Replace with lines 9-21 in Program.cs  -->
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

At the bottom of `Main()` procedure in *Program.cs*, and before the call to `CloseConnection()`, add the following lines of code to cache and retrieve a serialized .NET object:
<!-- Replace with lines 78-89 of Program.cs -->
```csharp
  Employee e007 = new Employee("007", "Davide Columbo", 100);
  stringSetResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringSetAsync("e007", JsonSerializer.Serialize(e007)));
  Console.WriteLine($"{Environment.NewLine}{prefix}: Cache response from storing serialized Employee object: {stringSetResult}");

  // Retrieve serialized object from cache
  getMessageResult = await _redisConnection.BasicRetryAsync(async (db) => await db.StringGetAsync("e007"));
  Employee e007FromCache = JsonSerializer.Deserialize<Employee>(getMessageResult.ToString());
  Console.WriteLine($"{prefix}: Deserialized Employee .NET object:{Environment.NewLine}");
  Console.WriteLine($"{prefix}: Employee.Name : {e007FromCache.Name}");
  Console.WriteLine($"{prefix}: Employee.Id   : {e007FromCache.Id}");
  Console.WriteLine($"{prefix}: Employee.Age  : {e007FromCache.Age}{Environment.NewLine}");
```

Save *Program.cs* and rebuild the app with the following command:

```dos
dotnet build
```

Run the app with the following command to test serialization of .NET objects:

```dos
dotnet run
```

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Console app completed":::

## Clean up resources

If you continue to the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually on the left instead of deleting the resource group.
>

Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, select **...** then **Delete resource group**.

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-delete-resource-group.png" alt-text="Delete":::

You'll be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.

<a name="next-steps"></a>

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a .NET Core application. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
