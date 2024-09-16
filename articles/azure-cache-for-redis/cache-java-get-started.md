---
title: 'Quickstart: Use Azure Cache for Redis with Java'
description: Create a Java app and connect the app to Azure Cache for Redis.
author: KarlErickson
ms.author: zhihaoguo
ms.date: 01/04/2022
ms.topic: quickstart

ms.devlang: java
ms.custom: devx-track-java, devx-track-javaee, mode-api, mvc, devx-track-extended-java
#Customer intent: As a Java developer who is new to Azure Cache for Redis, I want to create a new Java app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a Java app

In this quickstart, you incorporate Azure Cache for Redis into a Java app by using the [Jedis](https://github.com/xetorthio/jedis) Redis client. Your app connects to a secure, dedicated cache that is accessible from any application in Azure.

## Skip to the code

This quickstart uses the Maven archetype feature to generate scaffolding for a Java app. The quickstart describes how to configure the code to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the code, see the [Java quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/java) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- [Apache Maven](https://maven.apache.org/download.cgi)

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

## Set up the working environment

Depending on your operating system, add environment variables for host name and primary access key that you noted earlier. In a Command Prompt window or terminal window, set the following values:

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

- `<your-host-name>`: The DNS host name, obtained from the **Properties** section of your Azure Cache for Redis resource in the Azure portal.
- `<your-primary-access-key>`: The primary access key, obtained from the **Access keys** section of your Azure Cache for Redis resource in the Azure portal.

## Review the Java sample

In this sample, you use Maven to run the quickstart app.

1. Go to the new *redistest* project directory.

1. Open the *pom.xml* file. In the file, verify that a dependency for [Jedis](https://github.com/xetorthio/jedis) appears:

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

1. Open *App.java* and verify that the following code appears:

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
    
            // Perform cache operations by using the cache connection object. 
    
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

    This code shows you how to connect to an Azure Cache for Redis instance by using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed.

1. Close *App.java*.

## Build and run the app

1. Set the environment variables as noted earlier:

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

1. To build and run the app, run the following Maven command:

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

In the following output, you can see that the `Message` key previously had a cached value. The value was updated to a new value by using `jedis.set`. The app also executed the `PING` and `CLIENT LIST` commands.

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

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience best practices for your cache](cache-best-practices-connection.md)
- [Development best practices for your cache](cache-best-practices-development.md)
- [Use Azure Cache for Redis with Jakarta EE](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
- [Use Azure Cache for Redis with Spring](/azure/developer/java/spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache)
