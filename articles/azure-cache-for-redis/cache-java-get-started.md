---
title: 'Quickstart: Use Azure Cache for Redis in Java'
description: In this quickstart, you create a new Java app that uses Azure Cache for Redis
author: KarlErickson
ms.author: zhihaoguo
ms.date: 01/04/2022
ms.topic: quickstart
ms.service: cache
ms.devlang: java
ms.custom: devx-track-java, devx-track-javaee, mode-api, mvc, devx-track-extended-java
---

# Quickstart: Use Azure Cache for Redis in Java

In this quickstart, you incorporate Azure Cache for Redis into a Java app using the [Jedis](https://github.com/xetorthio/jedis) Redis client. Your cache is a secure, dedicated cache that is accessible from any application within Azure.

## Skip to the code on GitHub

Clone the repo [Java quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/java) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Apache Maven](https://maven.apache.org/download.cgi)

## Create an Azure Cache for Redis

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

## Set up the working environment

Depending on your operating system, add environment variables for your **Host name** and **Primary access key** that you noted previously. Open a command prompt, or a terminal window, and set up the following values:

### [Linux](#tab/bash)

```bash
export REDISCACHEHOSTNAME=<your-host-name>.redis.cache.windows.net
export REDISCACHEKEY=<your-primary-access-key>
```

### [Windows](#tab/cmd)

```cmd
set REDISCACHEHOSTNAME=<your-host-name>.redis.cache.windows.net
set REDISCACHEKEY=<your-primary-access-key>
```

---

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<your-primary-access-key>`: The primary access key, obtained from the *Access keys* section of your Azure Cache for Redis resource in the Azure portal.

## Understand the Java sample

In this sample, you use Maven to run the quickstart app.

1. Change to the new *redistest* project directory.

1. Open the *pom.xml* file. In the file, you see a dependency for [Jedis](https://github.com/xetorthio/jedis):

    ```xml
    <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
      <version>4.1.0</version>
      <type>jar</type>
      <scope>compile</scope>
    </dependency>
    ```

1. Close the *pom.xml* file.

1. Open *App.java* and see the code with the following code:

    ```java
    package example.demo;
    
    import redis.clients.jedis.DefaultJedisClientConfig;
    import redis.clients.jedis.Jedis;
    
    /**
     * Redis test
     *
     */
    public class App 
    {
        public static void main( String[] args )
        {
    
            boolean useSsl = true;
            String cacheHostname = System.getenv("REDISCACHEHOSTNAME");
            String cachekey = System.getenv("REDISCACHEKEY");
    
            // Connect to the Azure Cache for Redis over the TLS/SSL port using the key.
            Jedis jedis = new Jedis(cacheHostname, 6380, DefaultJedisClientConfig.builder()
                .password(cachekey)
                .ssl(useSsl)
                .build());
    
            // Perform cache operations using the cache connection object...
    
            // Simple PING command
            System.out.println( "\nCache Command  : Ping" );
            System.out.println( "Cache Response : " + jedis.ping());
    
            // Simple get and put of integral data types into the cache
            System.out.println( "\nCache Command  : GET Message" );
            System.out.println( "Cache Response : " + jedis.get("Message"));
    
            System.out.println( "\nCache Command  : SET Message" );
            System.out.println( "Cache Response : " + jedis.set("Message", "Hello! The cache is working from Java!"));
    
            // Demonstrate "SET Message" executed as expected...
            System.out.println( "\nCache Command  : GET Message" );
            System.out.println( "Cache Response : " + jedis.get("Message"));
    
            // Get the client list, useful to see if connection list is growing...
            System.out.println( "\nCache Command  : CLIENT LIST" );
            System.out.println( "Cache Response : " + jedis.clientList());
    
            jedis.close();
        }
    }
    ```

    This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed.

1. Close the *App.java*.

## Build and run the app

1. First, if you haven't already, you must set the environment variables as noted previously.

   ### [Linux](#tab/bash)

   ```bash
   export REDISCACHEHOSTNAME=<your-host-name>.redis.cache.windows.net
   export REDISCACHEKEY=<your-primary-access-key>
   ```

   ### [Windows](#tab/cmd)

   ```cmd
   set REDISCACHEHOSTNAME=<your-host-name>.redis.cache.windows.net
   set REDISCACHEKEY=<your-primary-access-key>
   ```

    ---

1. Execute the following Maven command to build and run the app:

   ### [Linux](#tab/bash)

   ```bash
   mvn compile
   mvn exec:java -D exec.mainClass=example.demo.App
   ```

   ### [Windows](#tab/cmd)

   ```cmd
   mvn compile
   mvn exec:java -D exec.mainClass=example.demo.App
   ```

    ---

In the following output, you can see that the `Message` key previously had a cached value. The value was updated to a new value using `jedis.set`. The app also executed the `PING` and `CLIENT LIST` commands.

```output
Cache Command  : Ping
Cache Response : PONG

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java!

Cache Command  : SET Message
Cache Response : OK

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java!

Cache Command  : CLIENT LIST
Cache Response : id=777430 addr=             :58989 fd=22 name= age=1 idle=0 flags=N db=0 sub=0 psub=0 multi=-1 qbuf=0 qbuf-free=32768 obl=0 oll=0 omem=0 ow=0 owmem=0 events=r cmd=client numops=6
```

## Clean up resources

If you continue to use the quickstart code, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually instead of deleting the resource group.
>

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

1. In the **Filter by name** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, select **...** then **Delete resource group**.

   :::image type="content" source="media/cache-java-get-started/azure-cache-redis-delete-resource-group.png" alt-text="Screenshot of the Azure portal that shows the Resource groups page with the Delete resource group button highlighted." lightbox="media/cache-java-get-started/azure-cache-redis-delete-resource-group.png":::

1. Type the name of your resource group to confirm deletion and then select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Java application. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

- [Development](cache-best-practices-development.md)
- [Connection resilience](cache-best-practices-connection.md)
- [Azure Cache for Redis with Jakarta EE](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
- [Azure Cache for Redis with Spring](/azure/developer/java/spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache)
