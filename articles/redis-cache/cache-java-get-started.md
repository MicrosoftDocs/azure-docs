---
title: Quickstart to learn how to use Azure Redis Cache with Java | Microsoft Docs
description: In this quickstart, you will create a new Java app that uses Azure Redis Cache
services: redis-cache
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: ''

ms.assetid: 29275a5e-2e39-4ef2-804f-7ecc5161eab9
ms.service: cache
ms.devlang: java
ms.topic: quickstart
ms.tgt_pltfrm: cache-redis
ms.workload: tbd
ms.date: 05/23/2018
ms.author: wesmc
ms.custom: mvc
#Customer intent: As a Java developer, new to Azure Redis Cache, I want to create a new Java app that uses Azure Redis Cache.
---

# Quickstart: How to use Azure Redis Cache with Java


Azure Redis Cache gives you access to a dedicated Redis cache, managed by Microsoft. Your cache is accessible from any application within Microsoft Azure.

This article shows you how to get started with Azure Redis Cache using the [Jedis](https://github.com/xetorthio/jedis) Redis Cache client for Java.

![Cache app completed](./media/cache-java-get-started/cache-app-complete.png)

You can use any code editor to complete the steps in this quickstart. However, [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Prerequisites

[Apache Maven](http://maven.apache.org/)



## Create an Azure Redis cache

[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](../../includes/redis-cache-access-keys.md)]

Add environment variables for your **HOST NAME** and **Primary** access key. You will use these variables from your code instead of including the sensitive information directly in your code.

```
set REDISCACHEHOSTNAME=contosoCache.redis.cache.windows.net
set REDISCACHEKEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Create a new Java app

Using Maven, generate a new quickstart app:

```
mvn archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.3 -DgroupId=example.demo -DartifactId=redistest -Dversion=1.0
```

Change to the new *redistest* project directory.

Open the *pom.xml* file and add a dependency for [Jedis](https://github.com/xetorthio/jedis):

```xml
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>2.9.0</version>
        <type>jar</type>
        <scope>compile</scope>
    </dependency>
```

Save the *pom.xml* file.

Open *App.java* and replace the code with the following code:

```java
package example.demo;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisShardInfo;

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

        // Connect to the Redis cache over the SSL port using the key.
        JedisShardInfo shardInfo = new JedisShardInfo(cacheHostname, 6380, useSsl);
        shardInfo.setPassword(cachekey); /* Use your access key. */
        Jedis jedis = new Jedis(shardInfo);      

        // Perform cache operations using the cache connection object...

        // Simple PING command        
        System.out.println( "\nCache Command  : Ping" );
        System.out.println( "Cache Response : " + jedis.ping());

        // Simple get and put of integral data types into the cache
        System.out.println( "\nCache Command  : GET Message" );
        System.out.println( "Cache Response : " + jedis.get("Message"));

        System.out.println( "\nCache Command  : SET Message" );
        System.out.println( "Cache Response : " + jedis.set("Message", "Hello! The cache is working from Java!"));

        // Demostrate "SET Message" executed as expected...
        System.out.println( "\nCache Command  : GET Message" );
        System.out.println( "Cache Response : " + jedis.get("Message"));

        // Get the client list, useful to see if connection list is growing...
        System.out.println( "\nCache Command  : CLIENT LIST" );
        System.out.println( "Cache Response : " + jedis.clientList());

        jedis.close();
    }
}
```

This code shows you how to connect to an Azure Redis Cache instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. 

Save *App.java*.

## Build and run the app

Execute the following Maven command to build and run the app:

```
mvn compile
mvn exec:java -D exec.mainClass=example.demo.App
```

In the example below, you can see the `Message` key previously had a cached value, which was set using the Redis Console in the Azure portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

![Cache app completed](./media/cache-java-get-started/cache-app-complete.png)


## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
>

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

![Delete](./media/cache-java-get-started/cache-delete-resource-group.png)

You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.



## Next steps

In this quickstart, you learned how to use Azure Redis Cache from a Java application. Continue to the next quickstart to use Redis Cache with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Redis Cache.](./cache-web-app-howto.md)



