---
title: "Quickstart: Use Azure Cache for Redis in Java with Redisson Redis client"
description: In this quickstart, you create a new Java app that uses Azure Cache for Redis and Redisson as Redis client.
author: KarlErickson
ms.author: zhihaoguo
ms.date: 01/18/2024
ms.topic: quickstart
ms.devlang: java
ms.custom: mvc, seo-java-january2024, seo-java-february2024, mode-api, devx-track-java, devx-track-extended-java, devx-track-javaee, ignite-2024
#Customer intent: As a Java developer, new to Azure Cache for Redis, I want to create a new Java app that uses Azure Cache for Redis and Redisson as Redis client.
zone_pivot_groups: redis-type
---

# Quickstart: Use Azure Cache for Redis in Java with Redisson Redis client

In this quickstart, you incorporate Azure Cache for Redis into a Java app using the [Redisson](https://redisson.org/) Redis client and JCP standard JCache API. These services give you  access to a secure, dedicated cache that is accessible from any application within Azure. This article provides two options for selecting the Azure identity to use for the Redis connection.

## Skip to the code on GitHub

This quickstart uses the Maven archetype feature to generate the scaffolding for the app. The quickstart directs you to modify the generated code to arrive at the working sample app. If you want to skip straight to the completed code, see the [Java quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/java-redisson-jcache) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Use Microsoft Entra ID for cache authentication](cache-azure-active-directory-for-authentication.md)
- [Apache Maven](https://maven.apache.org/download.cgi)

::: zone pivot="azure-managed-redis"

## Create an Azure Managed Redis (preview) instance

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

1. Use Maven to generate a new quickstart app:

   ```bash
   mvn archetype:generate \
       -DarchetypeGroupId=org.apache.maven.archetypes \
       -DarchetypeArtifactId=maven-archetype-quickstart \
       -DarchetypeVersion=1.3 \
       -DinteractiveMode=false \
       -DgroupId=example.demo \
       -DartifactId=redis-redisson-test \
       -Dversion=1.0
   ```

1. Change to the new **redis-redisson-test** project directory.

1. Open the **pom.xml** file and add a dependency for [Redisson](https://github.com/redisson/redisson#maven):

   ### [Microsoft Entra ID authentication (recommended)](#tab/entraid)

   ```xml
   <dependency>
       <groupId>com.azure</groupId>
       <artifactId>azure-identity</artifactId>
       <version>1.15.0</version> <!-- {x-version-update;com.azure:azure-identity;dependency} -->
   </dependency>

   <dependency>
       <groupId>org.redisson</groupId>
       <artifactId>redisson</artifactId>
       <version>3.36.0</version> <!-- {x-version-update;org.redisson:redisson;external_dependency} -->
   </dependency>
   ```

   ### [Access key authentication](#tab/accesskey)

   [!INCLUDE [redis-access-key-alert](includes/redis-access-key-alert.md)]

   ```xml
   <dependency>
       <groupId>org.redisson</groupId>
       <artifactId>redisson</artifactId>
       <version>3.36.0</version> <!-- {x-version-update;org.redisson:redisson;external_dependency} -->
   </dependency>
   ```

4. Save the **pom.xml** file.

1. Open **App.java** and replace the code with the following code:

   ### [Microsoft Entra ID authentication (recommended)](#tab/entraid)

   ```java
   package example.demo;

   import com.azure.core.credential.TokenRequestContext;
   import com.azure.identity.DefaultAzureCredential;
   import com.azure.identity.DefaultAzureCredentialBuilder;
   import org.redisson.Redisson;
   import org.redisson.api.RedissonClient;
   import org.redisson.config.Config;
   import org.redisson.jcache.configuration.RedissonConfiguration;

   import javax.cache.Cache;
   import javax.cache.CacheManager;
   import javax.cache.Caching;
   import javax.cache.configuration.Configuration;
   import javax.cache.configuration.MutableConfiguration;
   import java.time.LocalDateTime;

   /**
    * Redis test
    *
    */
   public class App {
       public static void main(String[] args) {

           Config redissonconfig = getConfig();

           RedissonClient redissonClient = Redisson.create(redissonconfig);

           MutableConfiguration<String, String> jcacheConfig = new MutableConfiguration<>();
           Configuration<String, String> config = RedissonConfiguration.fromInstance(redissonClient, jcacheConfig);

           // Perform cache operations using JCache
           CacheManager manager = Caching.getCachingProvider().getCacheManager();
           Cache<String, String> map = manager.createCache("test", config);

           // Simple get and put of string data into the cache
           System.out.println("\nCache Command  : GET Message");
           System.out.println("Cache Response : " + map.get("Message"));

           System.out.println("\nCache Command  : SET Message");
           map.put("Message",
                   String.format("Hello! The cache is working from Java! %s", LocalDateTime.now()));

           // Demonstrate "SET Message" executed as expected
           System.out.println("\nCache Command  : GET Message");
           System.out.println("Cache Response : " + map.get("Message"));

           redissonClient.shutdown();

       }

       private static Config getConfig() {
           //Construct a Token Credential from Identity library, e.g. DefaultAzureCredential / ClientSecretCredential / Client    CertificateCredential / ManagedIdentityCredential etc.
           DefaultAzureCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();

           // Fetch a Microsoft Entra token to be used for authentication.
           String token = defaultAzureCredential
                   .getToken(new TokenRequestContext()
                           .addScopes("https://redis.azure.com/.default")).block().getToken();

           // Connect to the Azure Cache for Redis over the TLS/SSL port using the key
           Config redissonconfig = new Config();
           redissonconfig.useSingleServer()
                   .setAddress(String.format("rediss://%s:%s", System.getenv("REDIS_CACHE_HOSTNAME"),  System.getenv("REDIS_CACHE_PORT")))
                   .setUsername(System.getenv("USER_NAME")) // (Required) Username is Object ID of your managed identity or service principal
                   .setPassword(token); // Microsoft Entra access token as password is required.
           return redissonconfig;
       }
   }

   ```

   ### [Access key authentication](#tab/accesskey)

   ```java
   package example.demo;

   import org.redisson.Redisson;
   import org.redisson.api.RedissonClient;
   import org.redisson.config.Config;
   import org.redisson.jcache.configuration.RedissonConfiguration;

   import javax.cache.Cache;
   import javax.cache.CacheManager;
   import javax.cache.Caching;
   import javax.cache.configuration.Configuration;
   import javax.cache.configuration.MutableConfiguration;
   import java.time.LocalDateTime;

   /**
    * Redis test
    *
    */
   public class App {
       public static void main(String[] args) {

          Config redissonconfig = getConfig();

           RedissonClient redissonClient = Redisson.create(redissonconfig);

           MutableConfiguration<String, String> jcacheConfig = new MutableConfiguration<>();
           Configuration<String, String> config = RedissonConfiguration.fromInstance(redissonClient, jcacheConfig);

           // Perform cache operations using JCache
           CacheManager manager = Caching.getCachingProvider().getCacheManager();
           Cache<String, String> map = manager.createCache("test", config);

           // Simple get and put of string data into the cache
           System.out.println("\nCache Command  : GET Message");
           System.out.println("Cache Response : " + map.get("Message"));

           System.out.println("\nCache Command  : SET Message");
           map.put("Message",
                   String.format("Hello! The cache is working from Java! %s", LocalDateTime.now()));

           // Demonstrate "SET Message" executed as expected
           System.out.println("\nCache Command  : GET Message");
           System.out.println("Cache Response : " + map.get("Message"));

           redissonClient.shutdown();

       }

       private static Config getConfig() {
           // Connect to the Azure Cache for Redis over the TLS/SSL port using the key
           Config redissonconfig = new Config();
           redissonconfig.useSingleServer().setPassword(System.getenv("REDIS_CACHE_KEY"))
                   .setAddress(String.format("rediss://%s:%s", System.getenv("REDIS_CACHE_HOSTNAME"), System.getenv("REDIS_CACHE_PORT")));
           return redissonconfig;
       }
   }

   ```

1. Save **App.java**.

## Build and run the app

Execute the following Maven command to build and run the app:

```bash
mvn compile exec:java -Dexec.mainClass=example.demo.App
```

In the following output, you can see that the `Message` key previously had a cached value, which was set in the last run. The app updated that cached value.

```output
Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java! 2023-12-05T15:13:11.398873

Cache Command  : SET Message

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java! 2023-12-05T15:45:45.748667
```

[!INCLUDE [redis-cache-resource-group-clean-up](includes/redis-cache-resource-group-clean-up.md)]

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Java application with Redisson Redis client and JCache. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
> [!div class="nextstepaction"]
> [Use Java with Azure Cache for Redis on Azure Kubernetes Service](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
