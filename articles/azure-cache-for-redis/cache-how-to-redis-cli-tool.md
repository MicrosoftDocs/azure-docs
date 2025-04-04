---
title: Use redis-cli
description: Learn how to use redis-cli as a command-line tool for interacting with an Azure Cache for Redis as a client.



ms.topic: how-to
ms.date: 01/04/2024
appliesto:
  - ✅ Azure Cache for Redis
---
# Use the Redis command-line tool with Azure Cache for Redis

This article describes how to use the [redis-cli command-line interface](https://redis.io/docs/connect/cli/) to interact with Azure Cache for Redis as a client. You can use *redis-cli* to directly interact with your Azure Redis cache instance, and for debugging and troubleshooting.

## Prerequisite

Access to an Azure Cache for Redis server instance.

## Install redis-cli

The redis-cli tool installs automatically with the Redis package, which is available for Linux, macOS, and Windows. For detailed installation instructions for your operating system, see the open-source [Install Redis](https://redis.io/docs/install/install-redis/) guide.

### Install on Linux

The redis-cli tool runs natively on Linux, and most Linux distributions include a Redis package that contains redis-cli. For instance, you install the Redis package on Ubuntu with the following commands:

```linux
sudo apt-get update
sudo apt-get install redis
```

### Install on Windows

The best way to use redis-cli on Windows is to install the [Windows Subsystem for Linux (WSL)](/windows/wsl/about), which allows you to run Linux tools directly on Windows. To install WSL, see [How to install Linux on Windows with WSL](/windows/wsl/install).

Once installed, use WSL to install a Linux distro, and then install redis-cli by using the available package management for the Linux distro you chose. The default distro for WSL is Ubuntu. For more information, see [Install Redis on Windows](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/).

## Connect using redis-cli

To use redis-cli to connect to your Azure Redis cache as a client, you must specify the cache host name, port, and keys. You can retrieve these values by the following methods:

- Azure CLI using [az redis list-keys](/cli/azure/redis#az-redis-list-keys)
- Azure PowerShell using [Get-AzRedisCacheKey](/powershell/module/az.rediscache/Get-AzRedisCacheKey)
- [Azure portal](https://portal.azure.com)

The following section describes how to get these values from the Azure portal.

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

### Gather cache information

Before connecting to your cache via redis-cli, determine the following information so you know what command options to use.

- **Transport Layer Security (TLS)**: By default, Azure Redis instances use [TLS](cache-remove-tls-10-11.md) encryption for connections. If the cache uses TLS, you must enable TLS for redis-cli by using the `--tls` option.
- **Port**: Enterprise and Enterprise Flash tier caches use port `10000`. Basic, Standard, and Premium tier caches use either port `6379` for non-TLS connections or port `6380` for TLS connections.
- **Clustering**: If you have a Premium tier cache that uses clustering, or an Enterprise or Enterprise Flash tier cache that uses OSS cluster policy, add the `-c` option to ensure all shards can be accessed.

### Run the redis-cli connection command

Open a shell or terminal on a computer with the Redis package installed. On Windows, you can use WSL with [Windows Terminal](/windows/wsl/install#ways-to-run-multiple-linux-distributions-with-wsl) to open a Linux command line.

Run one of the following command lines, depending on your TLS, port, and clustering options. Replace the `<cache name>` and `<access key>` placeholders with the values for your cache.

- Connect to a Basic, Standard, or Premium tier Azure Redis instance that uses TLS:

  ```console
  redis-cli -p 6380 -h <cache name>.redis.cache.windows.net -a <access key> --tls
  ```

- Connect to a Basic, Standard, or Premium tier Azure Redis instance that doesn't use TLS:

  ```console
  redis-cli -p 6379 -h <cache name>.redis.cache.windows.net -a <access key>
  ```

- Connect to a Basic, Standard, or Premium tier Azure Redis instance that uses TLS and clustering:

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

Once you establish the connection, you can issue commands to your Azure Redis instance. One easy way to test the connection is to use the [`PING`](https://redis.io/commands/ping/) command. The following command returns `PONG` in the console.

```console
<cache name>.redis.cache.windows.net:6380> PING
PONG
```

You can also run commands like `SET` and `GET`.

```console
<cache name>.redis.cache.windows.net:6380> SET hello world
OK
<cache name>.redis.cache.windows.net:6380> GET hello
"world"
```

## Alternatives to redis-cli

You can also connect to your cache in the following other ways for troubleshooting or testing:

- Azure Cache for Redis offers a [Redis Console](cache-configure.md#redis-console) built into the Azure portal where you can issue commands without needing the command-line tool. The Redis Console feature is currently available only in the Basic, Standard, and Premium tiers.
- [RedisInsight](https://redis.io/insight/) is a rich open-source graphical tool for issuing Redis commands and viewing the contents of a Redis instance. RedisInsight works with Azure Cache for Redis and is supported on Linux, Windows, and macOS.

## Related content

Get started by creating a [new Enterprise-tier cache](quickstart-create-redis-enterprise.md).
