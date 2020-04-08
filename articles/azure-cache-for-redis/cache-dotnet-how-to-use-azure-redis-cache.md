---
title: 'Quickstart: Use Azure Cache for Redis with .NET apps'
description: In this quickstart, learn how to access Azure Cache for Redis from your .NET apps
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.devlang: dotnet
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/11/2020

#Customer intent: As a .NET developer, new to Azure Cache for Redis, I want to create a new .NET app that uses Azure Cache for Redis.
---
# Quickstart: Use Azure Cache for Redis with a .NET Framework application

In this quickstart, you incorporate Azure Cache for Redis into a .NET Framework app to have access to a secure, dedicated cache that is accessible from any application within Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET console app.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/)
- [.NET Framework 4 or higher](https://www.microsoft.com/net/download/dotnet-framework-runtime), which is required by the StackExchange.Redis client.

## Create a cache
[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](../../includes/redis-cache-access-keys.md)]

Create a file on your computer named *CacheSecrets.config* and place it in a location where it won't be checked in with the source code of your sample application. For this quickstart, the *CacheSecrets.config* file is located here, *C:\AppSecrets\CacheSecrets.config*.

Edit the *CacheSecrets.config* file and add the following contents:

```xml
<appSettings>
    <add key="CacheConnection" value="<cache-name>.redis.cache.windows.net,abortConnect=false,ssl=true,password=<access-key>"/>
</appSettings>
```

Replace `<cache-name>` with your cache host name.

Replace `<access-key>` with the primary key for your cache.


## Create a console app

In Visual Studio, click **File** > **New** > **Project**.

Select **Console App (.NET Framework)**, and **Next** to configure your app. Type a **Project name** and click **Create** to create a new console application.

<a name="configure-the-cache-clients"></a>

## Configure the cache client

In this section, you will configure the console application to use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client for .NET.

In Visual Studio, click **Tools** > **NuGet Package Manager** > **Package Manager Console**, and run the following command from the Package Manager Console window.

```powershell
Install-Package StackExchange.Redis
```

Once the installation is completed, the *StackExchange.Redis* cache client is available to use with your project.


## Connect to the cache

In Visual Studio, open your *App.config* file and update it to include an `appSettings` `file` attribute that references the *CacheSecrets.config* file.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.7.1" />
    </startup>

    <appSettings file="C:\AppSecrets\CacheSecrets.config"></appSettings>  

</configuration>
```

In Solution Explorer, right-click **References** and click **Add a reference**. Add a reference to the **System.Configuration** assembly.

Add the following `using` statements to *Program.cs*:

```csharp
using StackExchange.Redis;
using System.Configuration;
```

The connection to the Azure Cache for Redis is managed by the `ConnectionMultiplexer` class. This class should be shared and reused throughout your client application. Do not create a new connection for each operation. 

Never store credentials in source code. To keep this sample simple, I’m only using an external secrets config file. A better approach would be to use [Azure Key Vault with certificates](https://docs.microsoft.com/rest/api/keyvault/certificate-scenarios).

In *Program.cs*, add the following members to the `Program` class of your console application:

```csharp
        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
        {
            string cacheConnection = ConfigurationManager.AppSettings["CacheConnection"].ToString();
            return ConnectionMultiplexer.Connect(cacheConnection);
        });

        public static ConnectionMultiplexer Connection
        {
            get
            {
                return lazyConnection.Value;
            }
        }
```


This approach to sharing a `ConnectionMultiplexer` instance in your application uses a static property that returns a connected instance. The code provides a thread-safe way to initialize only a single connected `ConnectionMultiplexer` instance. `abortConnect` is set to false, which means that the call succeeds even if a connection to the Azure Cache for Redis is not established. One key feature of `ConnectionMultiplexer` is that it automatically restores connectivity to the cache once the network issue or other causes are resolved.

The value of the *CacheConnection* appSetting is used to reference the cache connection string from the Azure portal as the password parameter.

## Executing cache commands

Add the following code for the `Main` procedure of the `Program` class for your console application:

```csharp
        static void Main(string[] args)
        {
            // Connection refers to a property that returns a ConnectionMultiplexer
            // as shown in the previous example.
            IDatabase cache = Connection.GetDatabase();

            // Perform cache operations using the cache object...

            // Simple PING command
            string cacheCommand = "PING";
            Console.WriteLine("\nCache command  : " + cacheCommand);
            Console.WriteLine("Cache response : " + cache.Execute(cacheCommand).ToString());

            // Simple get and put of integral data types into the cache
            cacheCommand = "GET Message";
            Console.WriteLine("\nCache command  : " + cacheCommand + " or StringGet()");
            Console.WriteLine("Cache response : " + cache.StringGet("Message").ToString());

            cacheCommand = "SET Message \"Hello! The cache is working from a .NET console app!\"";
            Console.WriteLine("\nCache command  : " + cacheCommand + " or StringSet()");
            Console.WriteLine("Cache response : " + cache.StringSet("Message", "Hello! The cache is working from a .NET console app!").ToString());

            // Demonstrate "SET Message" executed as expected...
            cacheCommand = "GET Message";
            Console.WriteLine("\nCache command  : " + cacheCommand + " or StringGet()");
            Console.WriteLine("Cache response : " + cache.StringGet("Message").ToString());

            // Get the client list, useful to see if connection list is growing...
            cacheCommand = "CLIENT LIST";
            Console.WriteLine("\nCache command  : " + cacheCommand);
            Console.WriteLine("Cache response : \n" + cache.Execute("CLIENT", "LIST").ToString().Replace("id=", "id="));

            lazyConnection.Value.Dispose();
        }
```

Azure Cache for Redis has a configurable number of databases (default of 16) that can be used to logically separate the data within an Azure Cache for Redis. The code connects to the default database, DB 0. For more information, see [What are Redis databases?](cache-faq.md#what-are-redis-databases) and [Default Redis server configuration](cache-configure.md#default-redis-server-configuration).

Cache items can be stored and retrieved by using the `StringSet` and `StringGet` methods.

Redis stores most data as Redis strings, but these strings can contain many types of data, including serialized binary data, which can be used when storing .NET objects in the cache.

Press **Ctrl+F5** to build and run the console app.

In the example below, you can see the `Message` key previously had a cached value, which was set using the Redis Console in the Azure portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

![Console app partial](./media/cache-dotnet-how-to-use-azure-redis-cache/cache-console-app-partial.png)


## Work with .NET objects in the cache

Azure Cache for Redis can cache both .NET objects and primitive data types, but before a .NET object can be cached it must be serialized. This .NET object serialization is the responsibility of the application developer, and gives the developer flexibility in the choice of the serializer.

One simple way to serialize objects is to use the `JsonConvert` serialization methods in [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) and serialize to and from JSON. In this section, you will add a .NET object to the cache.

In Visual Studio, click **Tools** > **NuGet Package Manager** > **Package Manager Console**, and run the following command from the Package Manager Console window.

```powershell
Install-Package Newtonsoft.Json
```

Add the following `using` statement to the top of *Program.cs*:

```csharp
using Newtonsoft.Json;
```

Add the following `Employee` class definition to *Program.cs*:

```csharp
        class Employee
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public int Age { get; set; }

            public Employee(string EmployeeId, string Name, int Age)
            {
                this.Id = EmployeeId;
                this.Name = Name;
                this.Age = Age;
            }
        }
```

At the bottom of `Main()` procedure in *Program.cs*, and before the call to `Dispose()`, add the following lines of code to cache and retrieve a serialized .NET object:

```csharp
            // Store .NET object to cache
            Employee e007 = new Employee("007", "Davide Columbo", 100);
            Console.WriteLine("Cache response from storing Employee .NET object : " + 
                cache.StringSet("e007", JsonConvert.SerializeObject(e007)));

            // Retrieve .NET object from cache
            Employee e007FromCache = JsonConvert.DeserializeObject<Employee>(cache.StringGet("e007"));
            Console.WriteLine("Deserialized Employee .NET object :\n");
            Console.WriteLine("\tEmployee.Name : " + e007FromCache.Name);
            Console.WriteLine("\tEmployee.Id   : " + e007FromCache.Id);
            Console.WriteLine("\tEmployee.Age  : " + e007FromCache.Age + "\n");
```

Press **Ctrl+F5** to build and run the console app to test serialization of .NET objects. 

![Console app completed](./media/cache-dotnet-how-to-use-azure-redis-cache/cache-console-app-complete.png)


## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
>

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

![Delete](./media/cache-dotnet-how-to-use-azure-redis-cache/cache-delete-resource-group.png)

You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.



<a name="next-steps"></a>

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a .NET application. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)


