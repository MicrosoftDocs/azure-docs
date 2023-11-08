---
author: wchigit
description: code example
ms.service: service-connector
ms.topic: include
ms.date: 10/24/2023
ms.author: wchi
---

#### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package StackExchange.Redis --version 2.6.122
    ```
1. Get the Redis connection string from the environment variable added by Service Connector.
    
    ```csharp
    using StackExchange.Redis;
    var connectionString = Environment.GetEnvironmentVariable("AZURE_REDIS_CONNECTIONSTRING");
    var _redisConnection = await RedisConnection.InitializeAsync(connectionString: connectionString);
    ```
    
#### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:
    ```xml
    <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
      <version>4.1.0</version>
      <type>jar</type>
      <scope>compile</scope>
    </dependency>
    ```
1. Get the Redis connection string from the environment variable added by Service Connector.
    ```java
    import redis.clients.jedis.DefaultJedisClientConfig;
    import redis.clients.jedis.Jedis;
    import redis.clients.jedis.JedisShardInfo;
    import java.net.URI;
    
    String connectionString = System.getenv("AZURE_REDIS_CONNECTIONSTRING");
    URI uri = new URI(connectionString);
    JedisShardInfo shardInfo = new JedisShardInfo(uri);
    shardInfo.setSsl(true);
    Jedis jedis = new Jedis(shardInfo);
    ```

#### [SpringBoot](#tab/spring)

Refer to [Use Azure Redis Cache in Spring](/azure/developer/java/spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache) to set up your Spring application. The configuration properties are added to Spring Apps by Service Connector.

#### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install redis
    ```
1. Get the Redis connection string from the environment variable added by Service Connector.
    ```python
    import os
    import redis
    
    url = os.getenv('AZURE_REDIS_CONNECTIONSTRING')
    url_connection = redis.from_url(url)
    url_connection.ping()
    ```

#### [Go](#tab/go)

1. Install dependencies.
    ```bash
    go get github.com/redis/go-redis/v9
    ```
1. Get the Redis connection string from the environment variable added by Service Connector.
    ```go
    import (
        "context"
        "fmt"
    
        "github.com/redis/go-redis/v9"
    )

    connectionString := os.Getenv("AZURE_REDIS_CONNECTIONSTRING")
    opt, err := redis.ParseURL(connectionString)
    if err != nil {
    	panic(err)
    }
    
    client := redis.NewClient(opt)
    ```

#### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install redis
    ```
1. Get the Redis connection string from the environment variable added by Service Connector.
    
    ```javascript
    const redis = require("redis");
    
    const connectionString = process.env.AZURE_REDIS_CONNECTIONSTRING;
    const cacheConnection = redis.createClient({
        url: connectionString,
    });
    await cacheConnection.connect();
    ```