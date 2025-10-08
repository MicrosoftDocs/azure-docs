---
title: "Quickstart: Use Azure Cache for Redis in Java"
description: In this quickstart, you create a new Java app that uses Azure Cache for Redis
author: KarlErickson
ms.author: karler
ms.reviewer: zhihaoguo
ms.date: 05/18/2025
ms.topic: quickstart
ms.custom:
  - devx-track-java
  - devx-track-javaee
  - mode-api
  - mvc
  - devx-track-extended-java
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis
ms.devlang: java
zone_pivot_groups: redis-type
---

# Quickstart: Use Azure Cache for Redis in Java with Jedis Redis client

In this quickstart, you incorporate Azure Cache for Redis into a Java app using the [Jedis](https://github.com/xetorthio/jedis) Redis client. Your cache is a secure, dedicated cache that is accessible from any application within Azure.

## Skip to the code on GitHub

Clone the repo [Java quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/java) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- [Apache Maven](https://maven.apache.org/download.cgi)

::: zone pivot="azure-managed-redis"

## Create an Azure Managed Redis instance

[!INCLUDE [managed-redis-create](includes/managed-redis-create.md)]

::: zone-end

::: zone pivot="azure-cache-redis"

## Create an Azure Cache for Redis instance

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

::: zone-end

## Set up the working environment

[!INCLUDE [redis-setup-working-environment](includes/redis-setup-working-environment.md)]

## Create a new Java app

1. Use maven to generate a new quickstart app:

    ```xml
    mvn archetype:generate \
        -DarchetypeGroupId=org.apache.maven.archetypes \
        -DarchetypeArtifactId=maven-archetype-quickstart \
        -DarchetypeVersion=1.3 \
        -DinteractiveMode=false \
        -DgroupId=example.demo \
        -DartifactId=redis-jedis-test \
        -Dversion=1.0
    ```

1. Change to the new **redis-jedis-test** project directory.
1. Open the **pom.xml** file. In the file, you see a dependency for [Jedis](https://github.com/xetorthio/jedis):


    > [!NOTE]
    > Microsoft has entered into a partnership with Redis, Inc. As part of this collaboration, Microsoft Entra ID authentication support has been moved from Azure SDK to Redis Entra ID extensions. The new `redis-authx-entraid` library provides enhanced authentication capabilities and is the recommended approach for Microsoft Entra ID authentication with Azure Cache for Redis.

    ```xml
    <dependency>
        <groupId>redis.clients.authentication</groupId>
        <artifactId>redis-authx-entraid</artifactId>
        <version>0.1.1-beta2</version>
    </dependency>

    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>6.0.0</version> 
    </dependency>
    ```

1. Close the **pom.xml** file.

1. Open **App.java** and see the code with the following code:


    ```java
    package example.demo;

    import com.azure.identity.DefaultAzureCredentialBuilder;
    import redis.clients.authentication.core.TokenAuthConfig;
    import redis.clients.authentication.entraid.AzureTokenAuthConfigBuilder;
    import redis.clients.jedis.DefaultJedisClientConfig;
    import redis.clients.jedis.HostAndPort;
    import redis.clients.jedis.UnifiedJedis;
    import redis.clients.jedis.authentication.AuthXManager;

    import java.util.Set;

    /**
    * Redis test with Microsoft Entra ID authentication using redis-authx-entraid
    * For more information about Redis authentication extensions, see:
    * https://redis.io/docs/latest/develop/clients/jedis/amr/
    *
    */
    public class App
    {
        public static void main( String[] args )
        {
            String REDIS_CACHE_HOSTNAME = System.getenv("REDIS_CACHE_HOSTNAME");
            int REDIS_PORT = Integer.parseInt(System.getenv().getOrDefault("REDIS_CACHE_PORT", "10000"));
            String SCOPES = "https://redis.azure.com/.default"; // The scope for Azure Cache for Redis

            // Build TokenAuthConfig for Microsoft Entra ID authentication
            TokenAuthConfig tokenAuthConfig = AzureTokenAuthConfigBuilder.builder()
                    .defaultAzureCredential(new DefaultAzureCredentialBuilder().build())
                    .scopes(Set.of(SCOPES))
                    .tokenRequestExecTimeoutInMs(2000)
                    .build();

            DefaultJedisClientConfig config = DefaultJedisClientConfig.builder()
                    .authXManager(new AuthXManager(tokenAuthConfig))
                    .ssl(true)
                    .build();

            UnifiedJedis jedis = new UnifiedJedis(
                    new HostAndPort(REDIS_CACHE_HOSTNAME, REDIS_PORT),
                    config);

            // Test the connection
            System.out.println(String.format("Database size is %d", jedis.dbSize()));

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

            jedis.close();
        }
    }
    ```

    ---

    This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` commands are also executed.

1. Close the **App.java** file.

## Build and run the app

Execute the following Maven command to build and run the app:

```bash
mvn compile exec:java -D exec.mainClass=example.demo.App
```

In the following output, you can see that the `Message` key previously had a cached value. The value was updated to a new value using `jedis.set`. The app also executed the `PING` commands.

```output
Cache Command  : Ping
Cache Response : PONG

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java!

Cache Command  : SET Message
Cache Response : OK

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java!

```

[!INCLUDE [redis-cache-resource-group-clean-up](includes/redis-cache-resource-group-clean-up.md)]

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Java application. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

- [Development](best-practices-development.md)
- [Connection resilience](best-practices-connection.md)
- [Azure Cache for Redis with Jakarta EE](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
- [Azure Cache for Redis with Spring](/azure/developer/java/spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache)
