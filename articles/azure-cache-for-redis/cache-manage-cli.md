---
title: Manage Azure Cache for Redis using Azure classic CLI
description: Learn how to install the Azure classic CLI on any platform, how to use it to connect to your Azure account, and how to create and manage an Azure Cache for Redis from the classic CLI.
author: yegu-ms

ms.service: cache
ms.topic: conceptual
ms.date: 01/23/2017
ms.author: yegu

---
# How to create and manage Azure Cache for Redis using the Azure classic CLI
> [!div class="op_single_selector"]
> * [PowerShell](cache-how-to-manage-redis-cache-powershell.md)
> * [Azure classic CLI](cache-manage-cli.md)
>

The Azure classic CLI is a great way to manage your Azure infrastructure from any platform. This article shows you how to create and manage your Azure Cache for Redis instances using the Azure classic CLI.

[!INCLUDE [outdated-cli-content](../../includes/contains-classic-cli-content.md)]
> [!NOTE]
> For the latest Azure CLI sample scripts, see [Azure CLI Azure Cache for Redis samples](cli-samples.md).

## Prerequisites
To create and manage Azure Cache for Redis instances using Azure classic CLI, you must complete the following steps.

* You must have an Azure account. If you don't have one, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a few moments.
* [Install the Azure classic CLI](../cli-install-nodejs.md).
* Connect your Azure CLI installation with a personal Azure account, or with a work or school Azure account, and log in from the classic CLI using the `azure login` command.
* Before running any of the following commands, switch the classic CLI into Resource Manager mode by running the `azure config mode arm` command. For more information, see [Use the Azure classic CLI to manage Azure resources and resource groups](../xplat-cli-azure-resource-manager.md).

## Azure Cache for Redis properties
The following properties are used when creating and updating Azure Cache for Redis instances.

| Property | Switch | Description |
| --- | --- | --- |
| name |-n, --name |Name of the Azure Cache for Redis. |
| resource group |-g, --resource-group |Name of the Resource Group. |
| location |-l, --location |Location to create cache. |
| size |-z, --size |Size of the Azure Cache for Redis. Valid values: [C0, C1, C2, C3, C4, C5, C6, P1, P2, P3, P4] |
| sku |-x, --sku |Redis SKU. Should be one of : [Basic, Standard, Premium] |
| EnableNonSslPort |-e, --enable-non-ssl-port |EnableNonSslPort property of the Azure Cache for Redis. Add this flag if you want to enable the non-TLS/SSL Port for your cache |
| Redis Configuration |-c, --redis-configuration |Redis Configuration. Enter a JSON formatted string of configuration keys and values here. Format:"{"":"","":""}" |
| Redis Configuration |-f, --redis-configuration-file |Redis Configuration. Enter the path of a file containing configuration keys and values here. Format for the file entry: {"":"","":""} |
| Shard Count |-r, --shard-count |Number of Shards to create on a Premium Cluster Cache with clustering. |
| Virtual Network |-v, --virtual-network |When hosting your cache in a VNET, specifies the exact ARM resource ID of the virtual network to deploy the Azure Cache for Redis in. Example format: /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.ClassicNetwork/VirtualNetworks/vnet1 |
| key type |-t, --key-type |Type of key to renew. Valid values: [Primary, Secondary] |
| StaticIP |-p, --static-ip \<static-ip\> |When hosting your cache in a VNET, specifies a unique IP address in the subnet for the cache. If not provided, one is chosen for you from the subnet. |
| Subnet |t, --subnet \<subnet\> |When hosting your cache in a VNET, specifies the name of the subnet in which to deploy the cache. |
| VirtualNetwork |-v, --virtual-network \<virtual-network\> |When hosting your cache in a VNET, specifies the exact ARM resource ID of the virtual network to deploy the Azure Cache for Redis in. Example format: /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.ClassicNetwork/VirtualNetworks/vnet1 |
| Subscription |-s, --subscription |The subscription identifier. |

## See all Azure Cache for Redis commands
To see all Azure Cache for Redis commands and their parameters, use the `azure rediscache -h` command.

```azurecli
C:\>azure rediscache -h
help:    Commands to manage your Azure Cache for Redis(s)
help:
help:    Create an Azure Cache for Redis
help:      rediscache create [--name <name> --resource-group <resource-group> --location <location> [options]]
help:
help:    Delete an existing Azure Cache for Redis
help:      rediscache delete [--name <name> --resource-group <resource-group> ]
help:
help:    List all Azure Cache for Redis within your Subscription or Resource Group
help:      rediscache list [options]
help:
help:    Show properties of an existing Azure Cache for Redis
help:      rediscache show [--name <name> --resource-group <resource-group>]
help:
help:    Change settings of an existing Azure Cache for Redis
help:      rediscache set [--name <name> --resource-group <resource-group> --redis-configuration <redis-configuration>/--redis-configuration-file <redisConfigurationFile>]
help:
help:    Renew the authentication key for an existing Azure Cache for Redis
help:      rediscache renew-key [--name <name> --resource-group <resource-group> ]
help:
help:    Lists Primary and Secondary key of an existing Azure Cache for Redis
help:      rediscache list-keys [--name <name> --resource-group <resource-group>]
help:
help:    Options:
help:      -h, --help  output usage information
help:
help:    Current Mode: arm (Azure Resource Management)
```

## Create an Azure Cache for Redis
To create an Azure Cache for Redis, use the following command:

```azurecli
    azure rediscache create [--name <name> --resource-group <resource-group> --location <location> [options]]
```

For more information about this command, run the `azure rediscache create -h` command.

```azurecli
C:\>azure rediscache create -h
help:    Create an Azure Cache for Redis
help:
help:    Usage: rediscache create [--name <name> --resource-group <resource-group> --location <location> [options]]
help:
help:    Options:
help:      -h, --help                                               output usage information
help:      -v, --verbose                                            use verbose output
help:      -vv                                                      more verbose with debug output
help:      --json                                                   use json output
help:      -n, --name <name>                                        Name of the Azure Cache for Redis.
help:      -g, --resource-group <resource-group>                    Name of the Resource Group
help:      -l, --location <location>                                Location to create cache.
help:      -z, --size <size>                                        Size of the Azure Cache for Redis. Valid values: [C0, C1, C2, C3, C4, C5, C6, P1, P2, P3, P4]
help:      -x, --sku <sku>                                          Redis SKU. Should be one of : [Basic, Standard, Premium]
help:      -e, --enable-non-ssl-port                                EnableNonSslPort property of the Azure Cache for Redis. Add this flag if you want to enable the non-TLS/SSL Port for your cache
help:      -c, --redis-configuration <redis-configuration>          Redis Configuration. Enter a JSON formatted string of configuration keys and values here. Format:"{"<key1>":"<value1>","<key2>":"<value2>"}"
help:      -f, --redis-configuration-file <redisConfigurationFile>  Redis Configuration. Enter the path of a file containing configuration keys and values here. Format for the file entry: {"<key1>":"<value1>","<key2>":"<value2>"}
help:      -r, --shard-count <shard-count>                          Number of Shards to create on a Premium Cluster Cache
help:      -v, --virtual-network <virtual-network>                  The exact ARM resource ID of the virtual network to deploy the Azure Cache for Redis in. Example format: /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.ClassicNetwork/VirtualNetworks/vnet1
help:      -t, --subnet <subnet>                                    Required when deploying an Azure Cache for Redis inside an existing Azure Virtual Network
help:      -p, --static-ip <static-ip>                              Required when deploying an Azure Cache for Redis inside an existing Azure Virtual Network
help:      -s, --subscription <id>                                  the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

## Delete an existing Azure Cache for Redis
To delete an Azure Cache for Redis, use the following command:

```azurecli
    azure rediscache delete [--name <name> --resource-group <resource-group> ]
```

For more information about this command, run the `azure rediscache delete -h` command.

```azurecli
C:\>azure rediscache delete -h
help:    Delete an existing Azure Cache for Redis
help:
help:    Usage: rediscache delete [--name <name> --resource-group <resource-group> ]
help:
help:    Options:
help:      -h, --help                             output usage information
help:      -v, --verbose                          use verbose output
help:      -vv                                    more verbose with debug output
help:      --json                                 use json output
help:      -n, --name <name>                      Name of the Azure Cache for Redis.
help:      -g, --resource-group <resource-group>  Name of the Resource Group under which the cache exists
help:      -s, --subscription <subscription>      the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

## List all Azure Cache for Redis within your Subscription or Resource Group
To list all Azure Cache for Redis within your Subscription or Resource Group, use the following command:

```azurecli
    azure rediscache list [options]
```

For more information about this command, run the `azure rediscache list -h` command.

```azurecli
C:\>azure rediscache list -h
help:    List all Azure Cache for Redis within your Subscription or Resource Group
help:
help:    Usage: rediscache list [options]
help:
help:    Options:
help:      -h, --help                             output usage information
help:      -v, --verbose                          use verbose output
help:      -vv                                    more verbose with debug output
help:      --json                                 use json output
help:      -g, --resource-group <resource-group>  Name of the Resource Group
help:      -s, --subscription <subscription>      the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

## Show properties of an existing Azure Cache for Redis
To show properties of an existing Azure Cache for Redis, use the following command:

```azurecli
    azure rediscache show [--name <name> --resource-group <resource-group>]
```

For more information about this command, run the `azure rediscache show -h` command.

```azurecli
C:\>azure rediscache show -h
help:    Show properties of an existing Azure Cache for Redis
help:
help:    Usage: rediscache show [--name <name> --resource-group <resource-group>]
help:
help:    Options:
help:      -h, --help                             output usage information
help:      -v, --verbose                          use verbose output
help:      -vv                                    more verbose with debug output
help:      --json                                 use json output
help:      -n, --name <name>                      Name of the Azure Cache for Redis.
help:      -g, --resource-group <resource-group>  Name of the Resource Group
help:      -s, --subscription <subscription>      the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

<a name="scale"></a>

## Change settings of an existing Azure Cache for Redis
To change settings of an existing Azure Cache for Redis, use the following command:

```azurecli
    azure rediscache set [--name <name> --resource-group <resource-group> --redis-configuration <redis-configuration>/--redis-configuration-file <redisConfigurationFile>]
```

For more information about this command, run the `azure rediscache set -h` command.

```azurecli
C:\>azure rediscache set -h
help:    Change settings of an existing Azure Cache for Redis
help:
help:    Usage: rediscache set [--name <name> --resource-group <resource-group> --redis-configuration <redis-configuration>/--redis-configuration-file <redisConfigurationFile>]
help:
help:    Options:
help:      -h, --help                                               output usage information
help:      -v, --verbose                                            use verbose output
help:      -vv                                                      more verbose with debug output
help:      --json                                                   use json output
help:      -n, --name <name>                                        Name of the Azure Cache for Redis.
help:      -g, --resource-group <resource-group>                    Name of the Resource Group
help:      -c, --redis-configuration <redis-configuration>          Redis Configuration. Enter a JSON formatted string of configuration keys and values here.
help:      -f, --redis-configuration-file <redisConfigurationFile>  Redis Configuration. Enter the path of a file containing configuration keys and values here.
help:      -s, --subscription <subscription>                        the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

## Renew the authentication key for an existing Azure Cache for Redis
To renew the authentication key for an existing Azure Cache for Redis, use the following command:

```azurecli
    azure rediscache renew-key [--name <name> --resource-group <resource-group> --key-type <key-type>]
```

Specify `Primary` or `Secondary` for `key-type`.

For more information about this command, run the `azure rediscache renew-key -h` command.

```azurecli
C:\>azure rediscache renew-key -h
help:    Renew the authentication key for an existing Azure Cache for Redis
help:
help:    Usage: rediscache renew-key [--name <name> --resource-group <resource-group> ]
help:
help:    Options:
help:      -h, --help                             output usage information
help:      -v, --verbose                          use verbose output
help:      -vv                                    more verbose with debug output
help:      --json                                 use json output
help:      -n, --name <name>                      Name of the Azure Cache for Redis.
help:      -g, --resource-group <resource-group>  Name of the Resource Group under which cache exists
help:      -t, --key-type <key-type>              type of key to renew. Valid values are: 'Primary', 'Secondary'.
help:      -s, --subscription <subscription>      the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

## List Primary and Secondary keys of an existing Azure Cache for Redis
To list Primary and Secondary keys of an existing Azure Cache for Redis, use the following command:

```azurecli
    azure rediscache list-keys [--name <name> --resource-group <resource-group>]
```

For more information about this command, run the `azure rediscache list-keys -h` command.

```azurecli
C:\>azure rediscache list-keys -h
help:    Lists Primary and Secondary key of an existing Azure Cache for Redis
help:
help:    Usage: rediscache list-keys [--name <name> --resource-group <resource-group>]
help:
help:    Options:
help:      -h, --help                             output usage information
help:      -v, --verbose                          use verbose output
help:      -vv                                    more verbose with debug output
help:      --json                                 use json output
help:      -n, --name <name>                      Name of the Azure Cache for Redis.
help:      -g, --resource-group <resource-group>  Name of the Resource Group under which Cache exists
help:      -s, --subscription <subscription>      the subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```
