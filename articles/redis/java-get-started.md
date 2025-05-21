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

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
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

    ### [Microsoft Entra ID authentication (recommended)](#tab/entraid)

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.15.0</version> <!-- {x-version-update;com.azure:azure-identity;dependency} -->
    </dependency>

    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>5.2.0</version> <!-- {x-version-update;redis.clients:jedis;external_dependency} -->
    </dependency>
    ```

    ### [Access key authentication](#tab/accesskey)

    [!INCLUDE [redis-access-key-alert](includes/redis-access-key-alert.md)]

    ```xml
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>5.2.0</version> <!-- {x-version-update;redis.clients:jedis;external_dependency} -->
    </dependency>
    ```

1. Close the **pom.xml** file.

1. Open **App.java** and see the code with the following code:

    ### [Microsoft Entra ID authentication (recommended)](#tab/entraid)

    ```java
    package example.demo;

    import com.azure.identity.DefaultAzureCredential;
    import com.azure.identity.DefaultAzureCredentialBuilder;
    import com.azure.core.credential.TokenRequestContext;
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

            //Construct a Token Credential from Identity library, e.g. DefaultAzureCredential / ClientSecretCredential / Client CertificateCredential / ManagedIdentityCredential etc.
            DefaultAzureCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();

            // Fetch a Microsoft Entra token to be used for authentication. This token will be used as the password.
                    String token = defaultAzureCredential
                            .getToken(new TokenRequestContext()
                                    .addScopes("https://redis.azure.com/.default")).block().getToken();

            String cacheHostname = System.getenv("REDIS_CACHE_HOSTNAME");
            String username = System.getenv("USER_NAME");
            int port = Integer.parseInt(System.getenv().getOrDefault("REDIS_CACHE_PORT", "6380"));

            // Connect to the Azure Cache for Redis over the TLS/SSL port using the key.
            Jedis jedis = new Jedis(cacheHostname, port, DefaultJedisClientConfig.builder()
                    .password(token) // Microsoft Entra access token as password is required.
                    .user(username) // Username is Required
                    .ssl(useSsl) // SSL Connection is Required
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

    ### [Access key authentication](#tab/accesskey)

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
            String cacheHostname = System.getenv("REDIS_CACHE_HOSTNAME");
            String cachekey = System.getenv("REDIS_CACHE_KEY");
            int port = Integer.parseInt(System.getenv().getOrDefault("REDIS_CACHE_PORT", "6380"));

            // Connect to the Azure Cache for Redis over the TLS/SSL port using the key.
            Jedis jedis = new Jedis(cacheHostname, port, DefaultJedisClientConfig.builder()
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

    ---

    This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed.

1. Close the **App.java** file.

## Build and run the app

Execute the following Maven command to build and run the app:

```bash
mvn compile exec:java -D exec.mainClass=example.demo.App
```

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

[!INCLUDE [redis-cache-resource-group-clean-up](includes/redis-cache-resource-group-clean-up.md)]

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Java application. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

- [Development](best-practices-development.md)
- [Connection resilience](best-practices-connection.md)
- [Azure Cache for Redis with Jakarta EE](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
- [Azure Cache for Redis with Spring](/azure/developer/java/spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache)
