---
title: "Quickstart: Use Azure Cache for Redis in Java with Redisson Redis client"
description: In this quickstart, you will create a new Java app that uses Azure Cache for Redis and Redisson as Redis client.
author: KarlErickson
ms.author: zhihaoguo
ms.date: 01/18/2024
ms.topic: quickstart
ms.service: cache
ms.devlang: java
ms.custom: mvc, seo-java-january2024, seo-java-february2024, mode-api, devx-track-java, devx-track-extended-java, devx-track-javaee
#Customer intent: As a Java developer, new to Azure Cache for Redis, I want to create a new Java app that uses Azure Cache for Redis and Redisson as Redis client.
---

# Quickstart: Use Azure Cache for Redis in Java with Redisson Redis client

In this quickstart, you incorporate Azure Cache for Redis into a Java app using the [Redisson](https://redisson.org/) Redis client and JCP standard JCache API to have access to a secure, dedicated cache that is accessible from any application within Azure. Two options are provided for selecting the Azure identity to use for the Redis connection.

## Skip to the code on GitHub

This quickstart uses the Maven archetype feature to generate the scaffolding for the app. The quickstart directs you to modify the generated code to arrive at the working sample app. If you want to skip straight to the completed code, see the [Java quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/java-redisson-jcache) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Use Microsoft Entra ID for cache authentication](cache-azure-active-directory-for-authentication.md)
- [Apache Maven](https://maven.apache.org/download.cgi)

## Create an Azure Cache for Redis

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

## Set up the working environment

The steps in this section show you how to select the Azure identity used for the Redis connection. Two options are shown. The sample code looks at the value of the `AUTH_TYPE` environment variable and takes action depending on the value.

### Identity option 1: Authentication with Redis Key

Depending on your operating system, add environment variables for your cache's **Host name** and **Primary access key**. Open a command prompt, or a terminal window, and set up the following values:

```CMD
set REDIS_CACHE_HOSTNAME=<YOUR_HOST_NAME>.redis.cache.windows.net
set REDIS_CACHE_KEY=<YOUR_PRIMARY_ACCESS_KEY>
set AUTH_TYPE=RedisKey
```

```bash
export REDIS_CACHE_HOSTNAME=<YOUR_HOST_NAME>.redis.cache.windows.net
export REDIS_CACHE_KEY=<YOUR_PRIMARY_ACCESS_KEY>
export AUTH_TYPE=RedisKey
```

Replace the placeholders with the following values:

- `<YOUR_HOST_NAME>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<YOUR_PRIMARY_ACCESS_KEY>`: The primary access key, obtained from the *Access keys* section of your Azure Cache for Redis resource in the Azure portal.

### Identity option 2: Authentication with Microsoft Entra ID

Depending on your operating system, add environment variables for your cache's **Host name** and **USER_NAME**. Open a command prompt, or a terminal window, and set up the following values:

```CMD
set REDIS_CACHE_HOSTNAME=<YOUR_HOST_NAME>.redis.cache.windows.net
set USER_NAME=<USER_NAME>
set AUTH_TYPE=MicrosoftEntraID
```

```bash
export REDIS_CACHE_HOSTNAME=<YOUR_HOST_NAME>.redis.cache.windows.net
export USER_NAME=<USER_NAME>
export AUTH_TYPE=MicrosoftEntraID
```

Replace the placeholders with the following values:

- `<YOUR_HOST_NAME>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<USER_NAME>`: Object ID of your managed identity or service principal.
   - You can get the **USER_NAME** by following 1-4 steps in the image:

   :::image type="content" source="media/cache-java-redisson-get-started/user_name.png" alt-text="Screen shot of user name panel." lightbox="media/cache-java-redisson-get-started/user_name.png":::

## Create a new Java app

Using Maven, generate a new quickstart app:

```CMD
mvn archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.3 -DinteractiveMode=false -DgroupId=example.demo -DartifactId=redis-redisson-test -Dversion=1.0
```

Change to the new *redis-redisson-test* project directory.

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

Open *App.java* and replace the code with the following code:

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

This code shows you how to connect to an Azure Cache for Redis instance using Microsoft Entra ID with the JCache API support from the Redisson client library. The code also stores and retrieves a string value in the cache. For more information on JCache, see the [JCache specification](https://jcp.org/en/jsr/detail?id=107).

Save *App.java*.

## Build and run the app

Execute the following Maven command to build and run the app:

```CMD
mvn compile exec:java -Dexec.mainClass=example.demo.App
```

In the example below, you can see the `Message` key previously had a cached value, which was set in the last run. The app updated that cached value.

:::image type="content" source="media/cache-java-redisson-get-started/redis-cache-app-complete.png" alt-text="Screen show showing the completed app." lightbox="media/cache-java-redisson-get-started/redis-cache-app-complete.png":::


## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually on the left instead of deleting the resource group.
>

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

1. In the **Filter by name** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, click **Test Resources** then **Delete resource group**.

   :::image type="content" source="media/cache-java-redisson-get-started/redis-cache-delete-resource-group.png" alt-text="Azure resource group deleted" lightbox="media/cache-java-redisson-get-started/redis-cache-delete-resource-group.png":::

1. You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Java application with Redisson Redis client and JCache. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
