---
title: Use redis-cli with Azure Cache for Redis
description: Learn how to use *redis-cli* as a command-line tool for interacting with an Azure Cache for Redis as a client
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 01/04/2024
---
# Use the Redis command-line tool with Azure Cache for Redis

Use the [redis-cli command-line tool](https://redis.io/docs/connect/cli/) to interact with an Azure Cache for Redis as a client. Use this tool to directly interact with your Azure Cache for Redis instance and for debugging and troubleshooting.

## Install redis-cli

The _redis-cli_ tool is installed automatically with the _Redis package_, which is available for multiple operating systems. See the open source [install Redis](https://redis.io/docs/install/install-redis/) guide for the most detailed documentation on your preferred operating system.

### Linux

The _redis-cli_ runs natively on Linux, and most distributions include a _Redis package_ that contains the _redis-cli_ tool. On Ubuntu, for instance, you install the _Redis package_  with the following commands:

```linux
sudo apt-get update
sudo apt-get install redis
```

### Windows

The best way to use _redis-cli_ on a Windows computer is to install the [Windows Subsystem for Linux (WSL)](/windows/wsl/about). The Linux subsystem allows you to run linux tools directly on Windows. To install WSL, follow the [WSL installation instructions](/windows/wsl/install).

Once WSL is installed, you can install _redis-cli_ using whatever package management is available in the Linux distro you chose for WSL.

## Gather cache access information

You can gather the information needed to access the cache using these methods:

- Azure CLI using [az redis list-keys](/cli/azure/redis#az-redis-list-keys)
- Azure PowerShell using [Get-AzRedisCacheKey](/powershell/module/az.rediscache/Get-AzRedisCacheKey)
- Using the Azure portal

In this section, you retrieve the keys from the Azure portal.

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

## Connect using redis-cli

Open up a shell or terminal on a computer with the _Redis package_ installed. If using WSL, you can [use the Windows Terminal](/windows/wsl/install#ways-to-run-multiple-linux-distributions-with-wsl) to open a Linux command line. Before connecting with redis-cli, check:

1. Whether TLS access is needed - By default, Azure Cache for Redis instances use [TLS](cache-remove-tls-10-11.md) encryption for connections. Whenever TLS is used on the server side, TLS on redis-cli must be enabled using the `--tls` option.
1. The port used - All Enterprise and Enterprise Flash tier caches use port `10000`. Basic, Standard, and Premium tier caches, however, use either port `6379` for non-TLS connections or port `6380` for TLS connections.
1. Whether the cache instance uses clustering - If you're using a Premium tier cache that uses clustering or an Enterprise/Enterprise Flash tier cache that is using OSS cluster policy, add the `-c`option to ensure all shards can be accessed.

### Examples

1. Use the following command to connect to a Basic, Standard, or Premium tier Azure Cache for Redis instance using TLS:

    ```console
    redis-cli -p 6380 -h yourcachename.redis.cache.windows.net -a YourAccessKey --tls
    ```

1. Connect to a Basic, Standard, or Premium tier Azure Cache for Redis instance that doesn't use TLS:

    ```console
    redis-cli -p 6379 -h yourcachename.redis.cache.windows.net -a YourAccessKey
    ```

1. Connect to a Basic, Standard, or Premium tier Azure Cache for Redis instance using TLS and clustering:

    ```console
    redis-cli -p 6380 -h yourcachename.redis.cache.windows.net -a YourAccessKey --tls -c
    ```

1. Connect to an Enterprise or Enterprise Flash tier cache instance using Enterprise cluster policy with TLS:

    ```console
    redis-cli -p 10000 -h yourcachename.eastus.redisenterprise.cache.azure.net -a YourAccessKey --tls
    ```

1. Connect to an Enterprise or Enterprise Flash tier cache instance using  OSS cluster policy without TLS:

    ```console
    redis-cli -p 10000 -h yourcachename.eastus.redisenterprise.cache.azure.net -a YourAccessKey -c
    ```

### Testing the connection

Once the connection is established, you can issue commands to your Azure Cache for Redis instance. One easy way to test the connection is to use the [`PING`](https://redis.io/commands/ping/) command. This command returns `PONG` in the console.

```output
yourcachename.redis.cache.windows.net:6380> PING
PONG
```

You can also run commands like `SET` and `GET`:

```output
yourcachename.redis.cache.windows.net:6380> SET hello world
OK
yourcachename.redis.cache.windows.net:6380> GET hello
"world"
```

You're now connected to your Azure Cache for Redis instance using the _redis-cli_.

## redis-cli alternatives

While the _redis-cli_ is a useful tool, you can connect to your cache in other ways for troubleshooting or testing:

- Azure Cache for Redis offers a [Redis Console](cache-configure.md#redis-console) built into the Azure portal where you can issue commands without needing to install the command-line tool. The Redis Console feature is currently only available in the Basic, Standard, and Premium tiers.
- [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) is a rich open source graphical tool for issuing Redis commands and viewing the contents of a Redis instance. It works with Azure Cache for Redis and is supported on Linux, Windows, and macOS.

## Related content

Get started by creating a [new Enterprise-tier cache](quickstart-create-redis-enterprise.md) instance.
