---
title: Use Azure Cache for Redis with Go
description: In this quickstart, you learn how to create a Go app that uses Azure Cache for Redis.
ms.date: 06/26/2025
ms.topic: quickstart
ms.custom:
  - mode-api
  - devx-track-go
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Cache for Redis
ms.devlang: golang
---

# Quickstart: Use Azure Redis with Go

In this article, you learn how to use an Azure Redis cache with the Go language and connect using Microsoft Entra ID.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Install [Go](https://go.dev/doc/install) language environment
- Add [two imports from Redis](https://redis.io/docs/latest/develop/clients/go/) to your project and to your development environment
  - `entraid "github.com/redis/go-redis-entraid"`
  - `"github.com/redis/go-redis/v9"`

## Create an Azure Managed Redis instance

First, create a cache. You can create a cache using Azure Managed Redis or Azure Cache for Redis using the Azure portal. In this Quickstart, we use Azure Managed Redis.

When you create the cache, Microsoft Entra ID is enabled by default making it secure from the start. Your cache must also use a public endpoint for this QuickStart.

To create a cache with the portal, follow one of these procedures:

- [Azure Managed Redis](quickstart-create-managed-redis.md)
- [Azure Cache for Redis](/azure/azure-cache-for-redis/quickstart-create-redis)

Optionally, you can create a cache using Azure CLI, PowerShell, whichever you prefer.

## Code to connect to a Redis cache

In the first part of the code sample, set your connection to the cache:

```go
package main

import (
  "context"
  "crypto/tls"
  "fmt"
  "log"
  "time"

  entraid "github.com/redis/go-redis-entraid"
  "github.com/redis/go-redis/v9"
)

func main() {
  ctx := context.Background()

  // Set your Redis endpoint (hostname:port) from the cache you created.
  redisHost := "<host >:<public port number>"

  // Create a credentials provider using DefaultAzureCredential
  provider, err := entraid.NewDefaultAzureCredentialsProvider(entraid.DefaultAzureCredentialsProviderOptions{})

  if err != nil {
    log.Fatalf("Failed to create credentials provider: %v", err)
  }

  // Create Redis client with Entra ID authentication
  client := redis.NewClient(&redis.Options{
    Addr:                         redisHost,
    TLSConfig:                    &tls.Config{MinVersion: tls.VersionTLS12},
    WriteTimeout:                 5 * time.Second,
    StreamingCredentialsProvider: provider,
  })
  defer client.Close()
```

## Code to test a connection

In the next section, test the connection using the Redis command `ping` that returns the `pong` string.

```go
        // Ping the Redis server to test the connection
        pong, err := client.Ping(ctx).Result()
        if err != nil {
                log.Fatal("Failed to connect to Redis:", err)
        }
        fmt.Println("Ping returned: ", pong)
```

## Code set a key, get a key

In this section, use a basic `set` and `get` sequence to start using the Redis cache in the simplest way to get started.

```go
        // Do something with Redis and a key-value pair
        result, err := client.Set(ctx, "Message", "Hello, The cache is working with Go!", 0).Result()
        if err != nil {
                log.Fatal("SET Message failed:", err)
        }
        fmt.Println("SET Message succeeded:", result)

        value, err := client.Get(ctx, "Message").Result()
        if err != nil {
                if err == redis.Nil {
                        fmt.Println("GET Message returned: key does not exist")
                } else {
                        log.Fatal("GET Message failed:", err)
                }
        } else {
                fmt.Println("GET Message returned:", value)
        }

}

```

Before you can run this code, you must add yourself as a Redis user.

You must also authorize your connection to Azure from the command line using the Azure command line or Azure developer command line (azd).

You should also [add users or a System principal to your cache](entra-for-authentication.md#add-users-or-system-principal-to-your-cache). Add anyone who might run the program as a user on the Redis cache.

The result looks like this:

```console
Ping returned:  PONG
SET Message succeeded: OK
GET Message returned: Hello, The cache is working with Go!
```

Here, you can see this code sample in its entirety.

```go
package main

import (
        "context"
        "crypto/tls"
        "fmt"
        "log"
        "time"

        entraid "github.com/redis/go-redis-entraid"
        "github.com/redis/go-redis/v9"
)

func main() {
        ctx := context.Background()

        // Set your Redis host (hostname:port)
        redisHost := "<host >:<public port number>"

        // Create a credentials provider using DefaultAzureCredential
        provider, err := entraid.NewDefaultAzureCredentialsProvider(entraid.DefaultAzureCredentialsProviderOptions{})

        if err != nil {
                log.Fatalf("Failed to create credentials provider: %v", err)
        }

        // Create Redis client with Entra ID authentication
        client := redis.NewClient(&redis.Options{
                Addr:                         redisHost,
                TLSConfig:                    &tls.Config{MinVersion: tls.VersionTLS12},
                WriteTimeout:                 5 * time.Second,
                StreamingCredentialsProvider: provider,
        })
        defer client.Close()

        // Ping the Redis server to test the connection
        pong, err := client.Ping(ctx).Result()
        if err != nil {
                log.Fatal("Failed to connect to Redis:", err)
        }
        fmt.Println("Ping returned: ", pong)

        // Do something with Redis and a key-value pair
        result, err := client.Set(ctx, "Message", "Hello, The cache is working with Go!", 0).Result()
        if err != nil {
                log.Fatal("SET Message failed:", err)
        }
        fmt.Println("SET Message succeeded:", result)

        value, err := client.Get(ctx, "Message").Result()
        if err != nil {
                if err == redis.Nil {
                        fmt.Println("GET Message returned: key does not exist")
                } else {
                        log.Fatal("GET Message failed:", err)
                }
        } else {
                fmt.Println("GET Message returned:", value)
        }

}
```

<!-- Clean up resources include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Redis Extension for connecting using Microsoft Entra ID](https://github.com/redis/go-redis-entraid)
- [go-Redis guide](https://redis.io/docs/latest/develop/clients/go/)
