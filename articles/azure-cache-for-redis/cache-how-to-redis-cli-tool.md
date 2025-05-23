---
title: Use redis-cli
description: Learn how to use redis-cli as a command-line tool for interacting with an Azure Cache for Redis as a client.



ms.topic: how-to
ms.date: 04/04/2025
appliesto:
  - ✅ Azure Cache for Redis
---
# Use the Redis command-line tool with Azure Cache for Redis

This article describes how to use the [redis-cli command-line interface](https://redis.io/docs/connect/cli/) to interact with Azure Cache for Redis as a client. You can use *redis-cli* to directly interact with your Azure Redis cache instance, and for debugging and troubleshooting.

## Prerequisite

Access to an Azure Cache for Redis server instance.

## Install redis-cli

The redis-cli tool installs automatically with the Redis package, which is available for Linux, macOS, and Windows. For detailed installation instructions, see the open-source [Redis documentation](https://redis.io/docs).

### Install on Linux

The redis-cli tool runs natively on Linux, and most Linux distributions include a Redis package that contains redis-cli. For instance, you install the Redis package on Ubuntu with the following commands:

```linux
sudo apt-get update
sudo apt-get install redis
```

### Install on Windows

The best way to use redis-cli on Windows is to install the [Windows Subsystem for Linux](/windows/wsl/about) (WSL), which allows you to run Linux tools directly on Windows. To install WSL, see [How to install Linux on Windows with WSL](/windows/wsl/install).

Once installed, use WSL to install a Linux distro, and then install redis-cli by using the available package management for the Linux distro you chose. The default distro for WSL is Ubuntu. For more information, see the open-source [Redis documentation](https://redis.io/docs).

## Connect using redis-cli

To use redis-cli to connect to your Azure Redis cache as a client, you must specify the cache host name, port, and keys. You can retrieve these values by the following methods:

- Azure CLI using [az redis list-keys](/cli/azure/redis#az-redis-list-keys)
- Azure PowerShell using [Get-AzRedisCacheKey](/powershell/module/az.rediscache/Get-AzRedisCacheKey)
- [Azure portal](https://portal.azure.com)

The following section describes how to get these values from the Azure portal.

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

### Get other cache information

You might also need to specify the following options for redis-cli:

- **TLS**: By default, Azure Redis instances use [TLS](cache-remove-tls-10-11.md) encryption for connections. If the cache uses TLS, you must enable TLS for redis-cli by using the `--tls` option.
- **Clustering**: If you have a Premium tier cache that uses clustering, or an Enterprise or Enterprise Flash tier cache that uses OSS cluster policy, add the `-c` option to ensure that all shards can be accessed.

### Run the redis-cli connection command

To connect to your cache, open a shell or terminal on a computer with the Redis package installed. On Windows, you can use WSL with [Windows Terminal](/windows/wsl/install#ways-to-run-multiple-linux-distributions-with-wsl) to open a Linux command line.

Run one of the following command lines, depending on your TLS, port, and clustering options. Replace the `<cache name>` and `<access key>` placeholders with the values for your cache.

- Connect to a Basic, Standard, or Premium tier Azure Redis instance that uses TLS:

  ```console
  redis-cli -p 6380 -h <cache name>.redis.cache.windows.net -a <access key> --tls
  ```

- Connect to a Basic, Standard, or Premium tier Azure Redis instance that doesn't use TLS:

  ```console
  redis-cli -p 6379 -h <cache name>.redis.cache.windows.net -a <access key>
  ```

- Connect to a Premium tier Azure Redis instance that uses TLS and clustering:

  ```console
  redis-cli -p 6380 -h <cache name>.redis.cache.windows.net -a <access key> --tls -c
  ```

- Connect to an Enterprise or Enterprise Flash tier cache instance that uses Enterprise cluster policy with TLS:

  ```console
  redis-cli -p 10000 -h <cache name>.eastus.redisenterprise.cache.azure.net -a <access key> --tls
  ```

- Connect to an Enterprise or Enterprise Flash tier cache instance that uses OSS cluster policy without TLS:

  ```console
  redis-cli -p 10000 -h <cache name>.eastus.redisenterprise.cache.azure.net -a <access key> -c
  ```

You're now connected to your Azure Redis cache instance.

## Use redis-cli commands with your Azure Redis cache

Once you establish the connection, you can issue commands to your Azure Redis instance at the redis-cli command prompt. The following examples show a connection to a cache named `contoso` that uses port `6380`.

One easy way to test the connection is to use the [`PING`](https://redis.io/commands/ping/) command. The command returns `PONG` in the console.

```console
contoso.redis.cache.windows.net:6380> PING
PONG
```

You can also run commands like `SET` and `GET`.

```console
contoso.redis.cache.windows.net:6380> SET hello world
OK
contoso.redis.cache.windows.net:6380> GET hello
"world"
```

## Alternatives to redis-cli

While the redis-cli is a useful tool, you can also use the following other methods to connect to your cache for troubleshooting or testing:

- [Redis Console](cache-configure.md#redis-console) lets you issue commands without having to install redis-cli. Redis Console is currently available only for Basic, Standard, and Premium tiers. If Redis Console is available, you can use it by selecting **Console** in the top toolbar of your cache **Overview** page in the Azure portal.
- [RedisInsight](https://redis.io/insight/) is a rich open-source graphical tool for issuing Redis commands and viewing the contents of a Redis instance. RedisInsight works with Azure Cache for Redis and is supported on Linux, Windows, and macOS.

## Related content

- Azure CLI using [az redis list-keys](/cli/azure/redis#az-redis-list-keys)
- Azure PowerShell using [Get-AzRedisCacheKey](/powershell/module/az.rediscache/Get-AzRedisCacheKey)
