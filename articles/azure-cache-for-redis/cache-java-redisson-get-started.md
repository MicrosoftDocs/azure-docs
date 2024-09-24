---
title: "Quickstart: Use Azure Cache for Redis with Java and Redisson Redis client"
description: Create a Java app and connect the app to Azure Cache for Redis by using Redisson as the Redis client.
author: KarlErickson
ms.author: zhihaoguo
ms.date: 01/18/2024
ms.topic: quickstart

ms.devlang: java
ms.custom: mvc, seo-java-january2024, seo-java-february2024, mode-api, devx-track-java, devx-track-extended-java, devx-track-javaee
#Customer intent: As a Java developer who is new to Azure Cache for Redis, I want to create a new Java app that uses Azure Cache for Redis and Redisson as the Redis client.
---

# Quickstart: Use Azure Cache for Redis with a Java app and a Redisson Redis client

In this quickstart, you incorporate Azure Cache for Redis into a Java app by using the [Redisson](https://redisson.org/) Redis client and the Java Community Practice (JCP) standard JCache API. These services give you access to a secure, dedicated cache that is accessible from any application in Azure.

This article describes two options to select the Azure identity to use for the Redis connection:

- Authentication by using a Redis key
- Authentication by using Microsoft Entra ID

## Skip to the code

This quickstart uses the Maven archetype feature to generate scaffolding for a Java app. The quickstart describes how to configure the code to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the code, see the [Java quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/java-redisson-jcache) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- [Microsoft Entra ID for cache authentication](cache-azure-active-directory-for-authentication.md)
- [Apache Maven](https://maven.apache.org/download.cgi)

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

## Set up the working environment

The steps in this section show you two options for selecting an Azure identity to use for the Redis connection. The sample code looks at the value of the `AUTH_TYPE` environment variable, and then takes action based on the value.

### Authenticate by using a Redis key

Depending on your operating system, add environment variables to hold your cache's host name and primary access key. In a Command Prompt window or terminal window, set the following values:

### [Linux](#tab/bash)

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export REDIS_CACHE_KEY=<your-primary-access-key>
export AUTH_TYPE=RedisKey
```

### [Windows](#tab/cmd)

```cmd
set REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
set REDIS_CACHE_KEY=<your-primary-access-key>
set AUTH_TYPE=RedisKey
```

---

In the preceding code, replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the **Properties** section of your Azure Cache for Redis resource in the Azure portal.
- `<your-primary-access-key>`: The primary access key, obtained from the **Access keys** section of your Azure Cache for Redis resource in the Azure portal.

### Authenticate by using Microsoft Entra ID

Depending on your operating system, add environment variables to hold your cache's host name and user name. In a Command Prompt window or terminal window, set up the following values:

### [Linux](#tab/bash)

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export USER_NAME=<user-name>
export AUTH_TYPE=MicrosoftEntraID
```

### [Windows](#tab/cmd)

```cmd
set REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
set USER_NAME=<user-name>
set AUTH_TYPE=MicrosoftEntraID
```

---

In the preceding code, replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the **Properties** section of your Azure Cache for Redis resource in the Azure portal.
- `<user-name>`: The object ID of your managed identity or service principal.

   To get the user name:

    1. In the Azure portal, go to your Azure Cache for Redis instance.
    1. On the service menu, select **Data Access Configuration**.
    1. On the **Redis Users** tab, find the **Username** column and copy the value.

       :::image type="content" source="media/cache-java-redisson-get-started/user-name.png" alt-text="Screenshot of the Azure portal that shows the Azure Cache for Redis Data Access Configuration page with the Redis Users tab and a Username value highlighted." lightbox="media/cache-java-redisson-get-started/user-name.png":::

## Create a new Java app

Generate a new quickstart app by using Maven:

### [Linux](#tab/bash)

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

### [Windows](#tab/cmd)

```cmd
mvn archetype:generate \
    -DarchetypeGroupId=org.apache.maven.archetypes \
    -DarchetypeArtifactId=maven-archetype-quickstart \
    -DarchetypeVersion=1.3 \
    -DinteractiveMode=false \
    -DgroupId=example.demo \
    -DartifactId=redis-redisson-test \
    -Dversion=1.0
```

---

Go to the new *redis-redisson-test* project directory.

Open the *pom.xml* file and add a dependency for [Redisson](https://github.com/redisson/redisson#maven):

```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.8.2</version>
    </dependency>

    <dependency>
        <groupId>org.redisson</groupId>
        <artifactId>redisson</artifactId>
        <version>3.24.3</version>
    </dependency>
```

Save the *pom.xml* file.

Open *App.java* and replace the existing code with the following code:

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

    private static Config getConfig(){
        if ("MicrosoftEntraID".equals(System.getenv("AUTH_TYPE"))) {
            System.out.println("Auth with Microsoft Entra ID");
            return getConfigAuthWithAAD();
        } else if ("RedisKey".equals(System.getenv("AUTH_TYPE"))) {
            System.out.println("Auth with Redis key");
            return getConfigAuthWithKey();
        }
        System.out.println("Auth with Redis key");
        return getConfigAuthWithKey();
    }

    private static Config getConfigAuthWithKey() {
        // Connect to the Azure Cache for Redis over the TLS/SSL port using the key
        Config redissonconfig = new Config();
        redissonconfig.useSingleServer().setPassword(System.getenv("REDIS_CACHE_KEY"))
            .setAddress(String.format("rediss://%s:6380", System.getenv("REDIS_CACHE_HOSTNAME")));
        return redissonconfig;
    }

    private static Config getConfigAuthWithAAD() {
        //Construct a Token Credential from Identity library, e.g. DefaultAzureCredential / ClientSecretCredential / Client CertificateCredential / ManagedIdentityCredential etc.
        DefaultAzureCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();

        // Fetch a Microsoft Entra token to be used for authentication.
        String token = defaultAzureCredential
            .getToken(new TokenRequestContext()
                .addScopes("acca5fbb-b7e4-4009-81f1-37e38fd66d78/.default")).block().getToken();

        // Connect to the Azure Cache for Redis over the TLS/SSL port using the key
        Config redissonconfig = new Config();
        redissonconfig.useSingleServer()
            .setAddress(String.format("rediss://%s:6380", System.getenv("REDIS_CACHE_HOSTNAME")))
            .setUsername(System.getenv("USER_NAME")) // (Required) Username is Object ID of your managed identity or service principal
            .setPassword(token); // Microsoft Entra access token as password is required.
        return redissonconfig;
    }

}
```

This code shows you how to connect to an Azure Cache for Redis instance by using Microsoft Entra ID with the JCache API support from the Redisson client library. The code also stores and retrieves a string value in the cache. For more information, see the [JCache specification](https://jcp.org/en/jsr/detail?id=107).

Save *App.java*.

## Build and run the app

To build and run the app, run the following Maven command:

### [Linux](#tab/bash)

```bash
mvn compile exec:java -Dexec.mainClass=example.demo.App
```

### [Windows](#tab/cmd)

```cmd
mvn compile exec:java -Dexec.mainClass=example.demo.App
```

---

In the following output, you can see that the `Message` key previously had a cached value that was set in the last run. The app updated that cached value.

```output
Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java! 2023-12-05T15:13:11.398873

Cache Command  : SET Message

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java! 2023-12-05T15:45:45.748667
```

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Create an ASP.NET web app that uses Azure Cache for Redis](./cache-web-app-howto.md)
- [Use Java with Azure Cache for Redis on Azure Kubernetes Service](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
