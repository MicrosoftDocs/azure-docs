---
title: 'Quickstart: Use Azure Cache for Redis with Go'
description: Create a Go app and connect the app to Azure Cache for Redis.


ms.devlang: golang
ms.topic: quickstart
ms.date: 09/09/2021
ms.custom: mode-api, devx-track-go
#Customer intent: As a Go developer who is new to Azure Cache for Redis, I want to create a new Go app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a Go app

In this quickstart, you learn how to build a REST API in Go that stores and retrieves user information backed by a [HASH](https://redis.io/topics/data-types-intro#redis-hashes) data structure in [Azure Cache for Redis](./cache-overview.md).

## Skip to the code

This article describes how to create an app by using the Azure portal and then modify the code to end up with a working sample app.

If you want to go straight to the code, see the [Go quickstart sample](https://github.com/Azure-Samples/azure-redis-cache-go-quickstart/) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- [Go](https://go.dev/doc/install) (preferably version 1.13 or later)
- [Git](https://git-scm.com/downloads)
- An HTTP client like [curl](https://curl.se/)

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

## Review the code (optional)

If you're interested in learning how the code works, you can review the following code snippets. Feel free to skip ahead to [Run the application](#run-the-application).

The open-source [go-redis](https://github.com/go-redis/redis) library is used to interact with Azure Cache for Redis.

The `main` function starts by reading the host name and password (access key) for the Azure Cache for Redis instance.

```go
func main() {
    redisHost := os.Getenv("REDIS_HOST")
    redisPassword := os.Getenv("REDIS_PASSWORD")
...
```

Then, you establish connection with Azure Cache for Redis. We use [tls.Config](https://go.dev/pkg/crypto/tls/#Config). Azure Cache for Redis supports only secure connections, and [TLS 1.2 as the minimum required version](cache-remove-tls-10-11.md).

```go
...
op := &redis.Options{Addr: redisHost, Password: redisPassword, TLSConfig: &tls.Config{MinVersion: tls.VersionTLS12}}
client := redis.NewClient(op)

ctx := context.Background()
err := client.Ping(ctx).Err()
if err != nil {
    log.Fatalf("failed to connect with redis instance at %s - %v", redisHost, err)
}
...
```

If the connection is successful, [HTTP handlers](https://go.dev/pkg/net/http/#HandleFunc) are configured to handle `POST` and `GET` operations, and the HTTP server is started.

> [!NOTE]
>The [gorilla mux library](https://github.com/gorilla/mux) is used for routing (although it's not required, and using the standard library for this sample application is an option).
>

```go
uh := userHandler{client: client}

router := mux.NewRouter()
router.HandleFunc("/users/", uh.createUser).Methods(http.MethodPost)
router.HandleFunc("/users/{userid}", uh.getUser).Methods(http.MethodGet)

log.Fatal(http.ListenAndServe(":8080", router))
```

The `userHandler` struct encapsulates [redis.Client](https://pkg.go.dev/github.com/go-redis/redis/v8#Client). The `createUser` and `getUser` methods use redis.Client. For brevity, the code for these methods isn't included in this article.

- `createUser`: Accepts a JSON payload (that has user information) and saves it as a `HASH` in Azure Cache for Redis.
- `getUser`: Fetches user info from `HASH` or returns an HTTP `404` response if it's not found.

```go
type userHandler struct {
    client *redis.Client
}
...

func (uh userHandler) createUser(rw http.ResponseWriter, r *http.Request) {
    // details omitted
}
...

func (uh userHandler) getUser(rw http.ResponseWriter, r *http.Request) {
    // details omitted
}
```

## Clone the sample application

Start by cloning the application on GitHub:

1. In the Command Prompt window for your computer's root directory, create a folder named *git-samples*:

    ```bash
    md "C:\git-samples"
    ```

1. Open a git terminal window, such as by using Git Bash. Use the `cd` command to go to the new folder to clone the sample app.

    ```bash
    cd "C:\git-samples"
    ```

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-redis-cache-go-quickstart.git
    ```

## Run the application

The application accepts connectivity and credentials in the form of environment variables.

1. In the [Azure portal](https://portal.azure.com/), get the host name and access key for the instance of Azure Cache for Redis.

1. Set the host name and access key to the following environment variables:

    ```console
    set REDIS_HOST=<Host name>:<port> (for example, <name of cache>.redis.cache.windows.net:6380)
    set REDIS_PASSWORD=<Primary Access Key>
    ```

1. In the terminal, go to the folder you created for the samples:

   For example:

    ```console
    cd "C:\git-samples\azure-redis-cache-go-quickstart"
    ```

1. In the terminal, start the application by using this command:

    ```console
    go run main.go
    ```

The HTTP server starts on port `8080`.

## Test the application

1. Create a few user entries.

   The following example uses curl:

    ```bash
    curl -i -X POST -d '{"id":"1","name":"foo1", "email":"foo1@baz.com"}' localhost:8080/users/
    curl -i -X POST -d '{"id":"2","name":"foo2", "email":"foo2@baz.com"}' localhost:8080/users/
    curl -i -X POST -d '{"id":"3","name":"foo3", "email":"foo3@baz.com"}' localhost:8080/users/
    ```

1. Fetch an existing user by using the value for `id`:

    ```bash
    curl -i localhost:8080/users/1
    ```

    The output is a JSON response that's similar to this example:

    ```json
    {
        "email": "foo1@bar",
        "id": "1",
        "name": "foo1"
    }
    ```

1. If you try to fetch a user who doesn't exist, you get an HTTP `404` error message.

   For example:

    ```bash
    curl -i localhost:8080/users/100
    
    #response

    HTTP/1.1 404 Not Found
    Date: Fri, 08 Jan 2021 13:43:39 GMT
    Content-Length: 0
    ```

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Create a basic ASP.NET web app that uses Azure Cache for Redis](./cache-web-app-howto.md)
