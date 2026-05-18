---
title: Use Client Tools to Access Data in Azure Managed Redis
description: Learn how to use *Redis Insight* and *redis-cli* as client tools to access data and for troubleshooting and debugging Azure Managed Redis.
ms.date: 04/06/2026
ms.topic: concept-article
ms.custom:
appliesto:
  - ✅ Azure Managed Redis
---
# Use client tools to manage data in Azure Managed Redis

You can use the following tools to access and manage data in Azure Managed Redis as a client. Use these tools to directly interact with your Azure Managed Redis instance and for debugging and troubleshooting.

- Redis Insight
- redis-cli command-line tool

## Redis Insight

[Redis Insight](https://redis.com/redis-enterprise/redis-insight/) is a rich open-source graphical and CLI tool for issuing Redis commands and viewing the contents of a Redis instance. It works with Azure Managed Redis and is supported on Linux, Windows, and macOS.

### Install Redis Insight

To install Redis Insight, follow the instructions in the [Redis Insight documentation](https://redis.com/redis-enterprise/redis-insight/).

> [!TIP]
> We recommend that you select **Use recommended settings** on the **EULA and privacy settings** page during installation.

### Configure access to Azure Managed Redis with Redis Insight

Redis Insight can authenticate to Azure Managed Redis instance using Microsoft Entra ID or access key authentication. We recommend using Microsoft Entra ID for better security. 

Starting with version 3.2.0, Redis Insight can [authenticate to Azure Managed Redis with Microsoft Entra ID](https://redis.io/docs/latest/develop/tools/insight/#connect-to-azure-managed-redis-with-ease) using the PKCE OAuth 2.0 flow, enabling automatic discovery of databases across subscriptions and passwordless authentication. 

For instructions to configure access to Azure Managed Redis with Redis Insight, see the [Redis Insight GitHub repo](https://github.com/redis/RedisInsight/blob/main/docs/azure-setup.md). This is a one-time setup per Azure tenant.

### Connect to Azure Managed Redis with Redis Insight

After Microsoft Entra ID access is configured, connect to an Azure Managed Redis instance in Redis Insight by following these steps:

1. In Redis Insight, on the **Redis Databases** tab, select **+ Connect existing database**.
1. In the **Add database** window, select **Azure Managed Redis**.
1. Follow the prompts to connect using Microsoft Entra ID authentication.
1. On the **Subscription** page, select the subscription that contains your Azure Managed Redis instance, and select **Add database**.
1. Select the Azure Managed Redis instance (database) that you want to connect to, and then select **Add database**. You can select multiple databases to connect to at the same time.
1. Repeat the preceding steps to add Azure Managed Redis instances as needed in the same or another Azure subscription.

* After you add an Azure Managed Redis instance, you can select it from the list of Redis databases in Redis Insight and start issuing commands and viewing data.

* To access the built-in CLI, select (**>_ CLI**) at the bottom of the screen for the selected database. 

## redis-cli command-line tool

Use the [redis-cli command-line tool](https://redis.io/docs/latest/operate/rs/references/cli-utilities/redis-cli/#connect-to-a-database) to interact with an Azure Managed Redis instance as a client. Use _redis_cli_ as a lightweight way to issue commands and for repeatable testing in scripts.  

### Install redis-cli

The _redis-cli_ tool is installed automatically with the _Redis package_, which is available for multiple operating systems. See the open source [install Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/) guide for the most detailed documentation on your preferred operating system.

#### Linux

The _redis-cli_ runs natively on Linux, and most distributions include a _Redis package_ that contains the _redis-cli_ tool. On Ubuntu, for instance, you install the _Redis package_  with the following commands:

```linux
sudo apt-get update
sudo apt-get install redis
```

#### Windows

The best way to use _redis-cli_ on a Windows computer is to install the [Windows Subsystem for Linux (WSL)](/windows/wsl/about). The Linux subsystem allows you to run linux tools directly on Windows. To install WSL, follow the [WSL installation instructions](/windows/wsl/install).

Once WSL is installed, you can install _redis-cli_ using whatever package management is available in the Linux distro you chose for WSL.

### Gather cache access information

You can gather the information needed to access the cache using these methods:

- Azure CLI using [az redisenterprise database list-keys](/cli/azure/redisenterprise/database#az-redisenterprise-database-list-keys)
- Azure PowerShell using [Get-AzRedisEnterpriseCacheKey](/powershell/module/az.redisenterprisecache/get-azredisenterprisecachekey)
- Using the Azure portal

In this section, you retrieve the information from the Azure portal.

To connect your Azure Managed Redis server, the cache client needs the cache endpoint, port, and a key for the cache. Some clients might refer to these items by slightly different names. You can get this information from the [Azure portal](https://portal.azure.com).

- To get the endpoint and port for your cache, select **Overview** from the **Resource** menu. The endpoint is of the form `{yourcachename}.{region}.redis.azure.net`. The port is `10000` for all Azure Managed Redis instances.

- To get the access keys, select **Authentication** from the **Settings** menu. Then, select the **Access keys** tab. Here, you can find the primary and secondary keys for the cache. You can use either key to connect with your client tool.

### Connect using redis-cli

Open up a shell or terminal on a computer with the _Redis package_ installed. If using WSL, you can [use the Windows Terminal](/windows/wsl/install#ways-to-run-multiple-linux-distributions-with-wsl) to open a Linux command line. Before connecting with redis-cli, check:

1. Whether TLS access is needed - By default, Azure Managed Redis instances use [TLS](tls-configuration.md) encryption for connections. Whenever TLS is used on the server side, TLS on redis-cli must be enabled using the `--tls` option.
1. The port used - all Azure Managed Redis instances use port `10000`. Note that this is different than the default for the Redis community edition, which is `6379`. 
1. Whether the cache instance uses the OSS cluster policy - If you're using the OSS cluster policy, add the `-c`option to ensure all shards can be accessed.

### Examples

1. Connect to an Azure Managed Redis instance using Enterprise cluster policy with TLS:

    ```console
    redis-cli -p 10000 -h {yourcachename}.{region}.redis.azure.net -a YourAccessKey --tls
    ```

1. Connect to an Azure Managed Redis instance using OSS cluster policy and TLS:

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


## Related content

Get started by creating a [new Azure Managed Redis Instance](quickstart-create-managed-redis.md) instance.

