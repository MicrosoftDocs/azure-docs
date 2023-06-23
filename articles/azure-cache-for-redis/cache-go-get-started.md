---
title: Use Azure Cache for Redis with Go
description: In this quickstart, you learn how to create a Go app that uses Azure Cache for Redis.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: golang
ms.topic: quickstart
ms.date: 09/09/2021
ms.custom: mode-api, devx-track-go
---

# Quickstart: Use Azure Cache for Redis with Go

In this article, you learn how to build a REST API in Go that stores and retrieves user information backed by a [HASH](https://redis.io/topics/data-types-intro#redis-hashes) data structure in [Azure Cache for Redis](./cache-overview.md).

## Skip to the code on GitHub

If you want to skip straight to the code, see the [Go quickstart](https://github.com/Azure-Samples/azure-redis-cache-go-quickstart/) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Go](https://go.dev/doc/install) (preferably version 1.13 or above)
- [Git](https://git-scm.com/downloads)
- An HTTP client such [curl](https://curl.se/)

## Create an Azure Cache for Redis instance

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

## Review the code (Optional)

If you're interested in learning how the code works, you can review the following snippets. Otherwise, feel free to skip ahead to [Run the application](#run-the-application).

The open source [go-redis](https://github.com/go-redis/redis) library is used to interact with Azure Cache for Redis.

The `main` function starts off by reading the host name and password (Access Key) for the Azure Cache for Redis instance.

```go
func main() {
    redisHost := os.Getenv("REDIS_HOST")
    redisPassword := os.Getenv("REDIS_PASSWORD")
...
```

Then, we establish connection with Azure Cache for Redis. We use [tls.Config](https://go.dev/pkg/crypto/tls/#Config)--Azure Cache for Redis only accepts secure connections with [TLS 1.2 as the minimum required version](cache-remove-tls-10-11.md).

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

If the connection is successful, [HTTP handlers](https://go.dev/pkg/net/http/#HandleFunc) are configured to handle `POST` and `GET` operations and the HTTP server is started.

> [!NOTE]
> [gorilla mux library](https://github.com/gorilla/mux) is used for routing (although it's not strictly necessary and we could have gotten away by using the standard library for this sample application).
>

```go
uh := userHandler{client: client}

router := mux.NewRouter()
router.HandleFunc("/users/", uh.createUser).Methods(http.MethodPost)
router.HandleFunc("/users/{userid}", uh.getUser).Methods(http.MethodGet)

log.Fatal(http.ListenAndServe(":8080", router))
```

`userHandler` struct encapsulates a [redis.Client](https://pkg.go.dev/github.com/go-redis/redis/v8#Client), which is used by the `createUser`, `getUser` methods - code for these methods isn't included for brevity.

- `createUser`: accepts a JSON payload (containing user information) and saves it as a `HASH` in Azure Cache for Redis.
- `getUser`: fetches user info from `HASH` or returns an HTTP `404` response if not found.

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

Start by cloning the application from GitHub.

1. Open a command prompt and create a new folder named `git-samples`.

    ```bash
    md "C:\git-samples"
    ```

1. Open a git terminal window, such as git bash. Use the `cd` command to change to the new folder where you want to clone the sample app.

    ```bash
    cd "C:\git-samples"
    ```

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-redis-cache-go-quickstart.git
    ```

## Run the application

The application accepts connectivity and credentials in the form of environment variables.

1. Fetch the **Host name** and **Access Keys** (available via Access Keys) for Azure Cache for Redis instance in the [Azure portal](https://portal.azure.com/)

1. Set them to the respective environment variables:

    ```console
    set REDIS_HOST=<Host name>:<port> (e.g. <name of cache>.redis.cache.windows.net:6380)
    set REDIS_PASSWORD=<Primary Access Key>
    ```

1. In the terminal window, change to the correct folder. For example:

    ```console
    cd "C:\git-samples\azure-redis-cache-go-quickstart"
    ```

1. In the terminal, run the following command to start the application.

    ```console
    go run main.go
    ```

The HTTP server will start on port `8080`.

## Test the application

1. Create a few user entries. The below example uses curl:

    ```bash
    curl -i -X POST -d '{"id":"1","name":"foo1", "email":"foo1@baz.com"}' localhost:8080/users/
    curl -i -X POST -d '{"id":"2","name":"foo2", "email":"foo2@baz.com"}' localhost:8080/users/
    curl -i -X POST -d '{"id":"3","name":"foo3", "email":"foo3@baz.com"}' localhost:8080/users/
    ```

1. Fetch an existing user with its `id`:

    ```bash
    curl -i localhost:8080/users/1
    ```

    You should get JSON response as such:

    ```json
    {
        "email": "foo1@bar",
        "id": "1",
        "name": "foo1"
    }
    ```

1. If you try to fetch a user who doesn't exist, you get an HTTP `404`. For example:

    ```bash
    curl -i localhost:8080/users/100
    
    #response

    HTTP/1.1 404 Not Found
    Date: Fri, 08 Jan 2021 13:43:39 GMT
    Content-Length: 0
    ```

## Clean up resources

If you're finished with the Azure resource group and resources you created in this quickstart, you can delete them to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible, and the resource group and all the resources in it are permanently deleted. If you created your Azure Cache for Redis instance in an existing resource group that you want to keep, you can delete just the cache by selecting **Delete** from the cache **Overview** page.

To delete the resource group and its Redis Cache for Azure instance:

1. From the [Azure portal](https://portal.azure.com), search for and select **Resource groups**.
1. In the **Filter by name** text box, enter the name of the resource group that contains your cache instance, and then select it from the search results.
1. On your resource group page, select **Delete resource group**.
1. Type the resource group name, and then select **Delete**.

   ![Delete your resource group for Azure Cache for Redis](./media/cache-python-get-started/delete-your-resource-group-for-azure-cache-for-redis.png)

## Next steps

In this quickstart, you learned how to get started using Go with Azure Cache for Redis. You configured and ran a simple REST API-based application to create and get user information backed by a Redis `HASH` data structure.

> [!div class="nextstepaction"]
> [Create a simple ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
