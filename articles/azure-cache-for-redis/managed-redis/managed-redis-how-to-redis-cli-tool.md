---
title: Use redis-cli with Azure Managed Redis (preview)
description: Learn how to use *redis-cli* as a command-line tool for interacting with an Azure Managed Redis as a client

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---
# Use the Redis command-line tool with Azure Managed Redis (preview)

Use the [redis-cli command-line tool](https://redis.io/docs/connect/cli/) to interact with an Azure Managed Redis (preview) as a client. Use this tool to directly interact with your Azure Managed Redis instance and for debugging and troubleshooting.

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

- Azure CLI using [az redisenterprise database list-keys](/cli/azure/redisenterprise/database#az-redisenterprise-database-list-keys)
- Azure PowerShell using [Get-AzRedisEnterpriseCacheKey](/powershell/module/az.redisenterprisecache/get-azredisenterprisecachekey)
- Using the Azure portal

In this section, you retrieve the keys from the Azure portal.

[!INCLUDE [redis-cache-create](../includes/redis-cache-access-keys.md)]

## Connect using redis-cli

Open up a shell or terminal on a computer with the _Redis package_ installed. If using WSL, you can [use the Windows Terminal](/windows/wsl/install#ways-to-run-multiple-linux-distributions-with-wsl) to open a Linux command line. Before connecting with redis-cli, check:

1. Whether TLS access is needed - By default, Azure Managed Redis instances use [TLS](../cache-tls-configuration.md) encryption for connections. Whenever TLS is used on the server side, TLS on redis-cli must be enabled using the `--tls` option.
1. The port used - all Azure Managed Redis instances use port `10000`. Note that this is different than the default for the Redis community edition, which is `6379`. 
1. Whether the cache instance uses the OSS cluster policy - If you're using the OSS cluster policy, add the `-c`option to ensure all shards can be accessed.

### Examples

1. Connect to an Azure Managed Redis instance using Enterprise cluster policy with TLS:

    ```console
    redis-cli -p 10000 -h {yourcachename}.{region}.redis.azure.net -a YourAccessKey --tls
    ```

1. Connect to an Azure Managed Redis instance using  OSS cluster policy and TLS:

    ```console
    redis-cli -p 10000 -h {yourcachename}.{region}.redis.azure.net -a YourAccessKey --tls -c
    ```

### Testing the connection

Once the connection is established, you can issue commands to your Azure Managed Redis instance. One easy way to test the connection is to use the [`PING`](https://redis.io/commands/ping/) command. This command returns `PONG` in the console.

```output
yourcachename.region.redis.azure.net:10000> PING
PONG
```

You can also run commands like `SET` and `GET`:

```output
yourcachename.region.redis.azure.net:10000> SET hello world
OK
yourcachename.region.redis.azure.net:10000> GET hello
"world"
```

You're now connected to your Azure Managed Redis instance using the _redis-cli_.

## redis-cli alternatives

While the _redis-cli_ is a useful tool, you can connect to your cache in other ways for troubleshooting or testing:

- [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) is a rich open source graphical tool for issuing Redis commands and viewing the contents of a Redis instance. It works with Azure Managed Redis and is supported on Linux, Windows, and macOS.

## Related content

Get started by creating a [new Azure Managed Redis Instance](../quickstart-create-managed-redis.md) instance.
