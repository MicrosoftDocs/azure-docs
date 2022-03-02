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
<!-- This doesn't look right. -->
The value of the *CacheConnection* secret is accessed using the Secret Manager configuration provider and used as the password parameter.

## Connnect to the cache with RedisConnection

The connection to your cache is managed by the `RedisConnection` class. The connection is first made in this statement from `Program.cs`:

```csharp
 RedisResult pingResult = await _redisConnection.BasicRetryAsync(async (db) => await db.ExecuteAsync("PING"));
```

You must have this statement in your code as seen in `RedisConnection.cs` to use the `RedisConnection` class.

```csharp
using StackExchange.Redis;

```

:::code language="csharp" source="~/samples-cache/quickstart/dotnet-core/RedisConnection.cs":::

The `RedisConnection` code uses the `ConnectionMultiplexer` pattern, but abstracts it. Using `ConnectionMultiplexer` is common across Redis applications. Look at this code to see one implementation.

For more information, see [StackExchange's `ConnectionMultiplexer`](https://stackexchange.github.io/StackExchange.Redis/Basics.html).

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
