---
title: "Quickstart: Use Azure Cache for Redis in Java with Redisson Redis client"
description: In this quickstart, you create a new Java app that uses Azure Cache for Redis and Redisson as Redis client.
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

In this quickstart, you incorporate Azure Cache for Redis into a Java app using the [Redisson](https://redisson.org/) Redis client and JCP standard JCache API. These services give you  access to a secure, dedicated cache that is accessible from any application within Azure. This article provides two options for selecting the Azure identity to use for the Redis connection.

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

The steps in this section show you two options for how to select the Azure identity used for the Redis connection. The sample code looks at the value of the `AUTH_TYPE` environment variable and takes action depending on the value.

### Identity option 1: Authentication with Redis Key

Depending on your operating system, add environment variables for your cache's host name and primary access key. Open a command prompt, or a terminal window, and set up the following values:

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

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<your-primary-access-key>`: The primary access key, obtained from the *Access keys* section of your Azure Cache for Redis resource in the Azure portal.

### Identity option 2: Authentication with Microsoft Entra ID

Depending on your operating system, add environment variables for your cache's host name and user name. Open a command prompt, or a terminal window, and set up the following values:

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

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<user-name>`: Object ID of your managed identity or service principal.
  - You can get the user name by using the following steps:

    1. In the Azure portal, navigate to your Azure Cache for Redis instance.
    1. On the navigation pane, select **Data Access Configuration**.
    1. On the **Redis Users** tab, find the **Username** column.

       :::image type="content" source="media/cache-java-redisson-get-started/user-name.png" alt-text="Screenshot of the Azure portal that shows the Azure Cache for Redis Data Access Configuration page with the Redis Users tab and a Username value highlighted." lightbox="media/cache-java-redisson-get-started/user-name.png":::

## Create a new Java app

Using Maven, generate a new quickstart app:

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

### [Linux](#tab/bash)

```bash
mvn compile exec:java -Dexec.mainClass=example.demo.App
```

### [Windows](#tab/cmd)

```cmd
mvn compile exec:java -Dexec.mainClass=example.demo.App
```

---

In the following output, you can see that the `Message` key previously had a cached value, which was set in the last run. The app updated that cached value.

```output
Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java! 2023-12-05T15:13:11.398873

Cache Command  : SET Message

Cache Command  : GET Message
Cache Response : Hello! The cache is working from Java! 2023-12-05T15:45:45.748667
```

## Clean up resources

If you plan to continue with the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually instead of deleting the resource group.

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

1. In the **Filter by name** textbox, type the name of your resource group. The instructions for this article used a resource group named `TestResources`. On your resource group in the result list, select **Test Resources** then **Delete resource group**.

   :::image type="content" source="media/cache-java-redisson-get-started/redis-cache-delete-resource-group.png" alt-text="Screenshot of the Azure portal that shows the Resource group page with the Delete resource group button highlighted." lightbox="media/cache-java-redisson-get-started/redis-cache-delete-resource-group.png":::

1. Type the name of your resource group to confirm deletion and then select **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Java application with Redisson Redis client and JCache. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
> [!div class="nextstepaction"]
> [Use Java with Azure Cache for Redis on Azure Kubernetes Service](/azure/developer/java/ee/how-to-deploy-java-liberty-jcache)
