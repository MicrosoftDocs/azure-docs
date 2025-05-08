---
title: Manage Azure Redis with Azure PowerShell
description: Learn how to create and perform administrative tasks for Azure Redis using Azure PowerShell.


ms.topic: conceptual
ms.date: 05/06/2025
zone_pivot_groups: redis-type
ms.custom: devx-track-azurepowershell, ignite-2024
appliesto:
  - ✅ Azure Managed Redis
---

# Manage Azure Redis with Azure PowerShell

This article shows you how to create, manage, and delete your Azure Redis instances by using Azure PowerShell.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
- Install Azure PowerShell, or use the PowerShell environment in [Azure Cloud Shell](/azure/cloud-shell/overview). For more information, see [Get started with Azure Cloud Shell](/azure/cloud-shell/quickstart).

  [:::image type="icon" source="~/reusable-content/cloud-shell/media/hdi-launch-cloud-shell.png" alt-text="Launch Azure Cloud Shell" :::](https://shell.azure.com)

[!INCLUDE [azure-powershell-requirements-no-header.md](~/reusable-content/azure-powershell/azure-powershell-requirements-no-header.md)]

- Make sure you're signed in to Azure with the subscription you want to create your cache under. To use a different subscription than the one you're signed in with, run `Select-AzSubscription -SubscriptionName <SubscriptionName>`.

>[!NOTE]
>Azure Cache for Redis Basic, Standard, and Premium tiers use the Azure PowerShell [Az.RedisCache](/powershell/module/az.rediscache) commands.
>
>Azure Cache for Redis Enterprise tiers and Azure Managed Redis use the Azure PowerShell [Az.RedisEnterpriseCache](/powershell/module/az.redisenterprisecache) commands.

::: zone pivot="azure-managed-redis"

## Azure Managed Redis PowerShell parameters and properties

For a list of all Azure Managed Redis PowerShell parameters and properties for `New-AzRedisEnterpriseCache`, see [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache). To see a list of available parameters and their descriptions, run the following command.

```azurepowershell
Get-Help New-AzRedisEnterpriseCache -detailed
```

## Create an Azure Managed Redis cache

You create new Azure Managed Redis instances using the [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-AzRedisEnterpriseCache) cmdlet.

> [!IMPORTANT]
> The first time you create an Azure Managed Redis cache in a subscription, you must first register the `Microsoft.Cache` namespace using the `Register-AzResourceProvider -ProviderNamespace "Microsoft.Cache"` command. Otherwise, cmdlets such as `New-AzRedisEnterpriseCache` and `Get-AzRedisEnterpriseCache` might fail.

`ResourceGroupName`, `Name`, and `Location` are required parameters, but the other parameters are optional and have default values. The following example command creates an Azure Managed Redis instance with the specified name, location, and resource group, and default parameters. The instance is 1 GB in size with the non-SSL port disabled.

```azurepowershell
New-AzRedisEnterpriseCache -ResourceGroupName myGroup -Name mycache -Location "North Central US"
```

To enable clustering, specify a shard count using the `ShardCount` parameter.

To specify values for the `RedisConfiguration` parameter, enclose the values inside `{}` as key/value pairs like `@{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}`. The following example creates a 1-GB cache with `allkeys-random` maxmemory policy and keyspace notifications configured with `KEA`. For more information, see [Keyspace notifications (advanced settings)]/azure-cache-for-redis/cache-configure.md#keyspace-notifications-advanced-settings) and [Memory policies]/azure-cache-for-redis/cache-configure.md#memory-policies).

```azurepowershell
New-AzRedisEnterpriseCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}
```

<a name="databases"></a>
## Configure the databases setting

The `databases` setting can be configured only during cache creation. The following example creates a cache with 48 databases using the [New-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/New-azRedisEnterpriseCache) cmdlet.

```azurepowershell
New-AzRedisEnterpriseCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku B1 -RedisConfiguration @{"databases" = "48"}
```

For more information on the `databases` property, see [Default Azure Managed Redis server configuration]/azure-cache-for-redis/cache-configure.md#default-redis-server-configuration). For more information on creating an Azure Managed Redis cache, see [New-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/new-azRedisEnterpriseCache).

<a name="scale"></a>
## Update an Azure Managed Redis cache

<!-- Umang looks like set Set-AzRedisEnterpriseCache should be Update-AzRedisEnterpriseCache -->
Azure Managed Redis instances are updated using the [Set-AzRedisEnterpriseCache] cmdlet.

To see a list of available parameters and their descriptions for `Set-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Set-AzRedisEnterpriseCache -detailed
```

The `Set-AzRedisEnterpriseCache` cmdlet can be used to update properties such as `Sku`, `EnableNonSslPort`, and the `RedisConfiguration` values.

The following command updates the `maxmemory-policy` setting for the Azure Managed Redis named `myCache`.

```azurepowershell
    Set-AzRedisEnterpriseCache -ResourceGroupName "myGroup" -Name "myCache" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random"}
```

## Get information about an Azure Managed Redis cache

You can retrieve information about a cache using the [Get-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/get-azRedisEnterpriseCache) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Get-AzRedisEnterpriseCache -detailed
```

To return information about all caches in the current subscription, run `Get-AzRedisEnterpriseCache` without any parameters.

```azurepowershell
Get-AzRedisEnterpriseCache
```

To return information about all caches in a specific resource group, run `Get-AzRedisEnterpriseCache` with the `ResourceGroupName` parameter.

```azurepowershell
Get-AzRedisEnterpriseCache -ResourceGroupName myGroup
```

To return information about a specific cache, run `Get-AzRedisEnterpriseCache` with the `Name` parameter containing the name of the cache, and the `ResourceGroupName` parameter with the resource group containing that cache.

```azurepowershell
Get-AzRedisEnterpriseCache -Name myCache -ResourceGroupName myGroup
```

## Retrieve the access keys for an Azure Managed Redis cache

To retrieve the access keys for your cache, use the [Get-AzRedisEnterpriseCacheKey](/powershell/module/az.RedisEnterpriseCache/Get-azRedisEnterpriseCacheKey) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzRedisEnterpriseCacheKey`, run the following command.

```azurepowershell
Get-Help Get-AzRedisEnterpriseCacheKey -detailed
```

To retrieve the keys for your cache, call the `Get-AzRedisEnterpriseCacheKey` cmdlet and pass in the name of your cache the name of the resource group that contains the cache.

```azurepowershell
Get-AzRedisEnterpriseCacheKey -Name myCache -ResourceGroupName myGroup
```

## Regenerate access keys for an Azure Managed Redis cache

To regenerate the access keys for your cache, you can use the [New-AzRedisEnterpriseCacheKey](/powershell/module/az.RedisEnterpriseCache/New-azRedisEnterpriseCacheKey) cmdlet.

To see a list of available parameters and their descriptions for `New-AzRedisEnterpriseCacheKey`, run the following command.

```azurepowershell
Get-Help New-AzRedisEnterpriseCacheKey -detailed
```

To regenerate the primary or secondary key for your cache, call the `New-AzRedisEnterpriseCacheKey` cmdlet and pass in the name, resource group, and specify either `Primary` or `Secondary` for the `KeyType` parameter. The following example regenerates the secondary access key for a cache.

```azurepowershell
New-AzRedisEnterpriseCacheKey -Name myCache -ResourceGroupName myGroup -KeyType Secondary
```

## Delete an Azure Managed Redis cache

To delete an Azure Managed Redis cache, use the [Remove-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/remove-azRedisEnterpriseCache) cmdlet.

To see a list of available parameters and their descriptions for `Remove-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Remove-AzRedisEnterpriseCache -detailed
```

The following example removes the cache named `myCache`.

```azurepowershell
Remove-AzRedisEnterpriseCache -Name myCache -ResourceGroupName myGroup
```

## Import Azure Managed Redis cache data

You can import data into an Azure Managed Redis instance using the `Import-AzRedisEnterpriseCache` cmdlet.

To see a list of available parameters and their descriptions for `Import-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Import-AzRedisEnterpriseCache -detailed

        -Files <String[]>
            SAS urls of blobs whose content should be imported into the cache.

        -Format <String>
            Format for the blob.  Currently "rdb" is the only supported, with other formats expected in the future.

        -Force
            When the Force parameter is provided, import will be performed without any confirmation prompts.

        -PassThru
            By default Import-AzRedisEnterpriseCache imports data in cache and does not return any value. If the PassThru
            parameter is provided then Import-AzRedisEnterpriseCache returns a boolean value indicating the success of the
            operation.
```

The following example command imports data from the files specified by the `Files` parameter into an Azure Managed Redis cache.

```azurepowershell
Import-AzRedisEnterpriseCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Files @("https://mystorageaccount.blob.core.windows.net/mycontainername/blobname?sv=2015-04-05&sr=b&sig=caIwutG2uDa0NZ8mjdNJdgOY8%2F8mhwRuGNdICU%2B0pI4%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwd") -Force
```

## Export Azure Managed Redis cache data

You can export data from an Azure Managed Redis instance using the `Export-AzRedisEnterpriseCache` cmdlet.

To see a list of available parameters and their descriptions for `Export-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Export-AzRedisEnterpriseCache -detailed

        -Prefix <String>
            Prefix to use for blob names.

        -Container <String>
            SAS url of container where data should be exported.

        -Format <String>
            Format for the blob.  Currently "rdb" is the only supported, with other formats expected in the future.

        -PassThru
            By default Export-AzRedisEnterpriseCache does not return any value. If the PassThru parameter is provided
            then Export-AzRedisEnterpriseCache returns a boolean value indicating the success of the operation.
```

The following example command exports data from an Azure Managed Redis instance into the container specified by the SAS uri.

```azurepowershell
Export-AzRedisEnterpriseCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Prefix "blobprefix"
    -Container "https://mystorageaccount.blob.core.windows.net/mycontainer?sv=2015-04-05&sr=c&sig=HezZtBZ3DURmEGDduauE7
    pvETY4kqlPI8JCNa8ATmaw%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwdl"
```

## Reboot an Azure Managed Redis cache

You can reboot your Azure Managed Redis instance using the `Reset-AzRedisEnterpriseCache` cmdlet.

To see a list of available parameters and their descriptions for `Reset-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Reset-AzRedisEnterpriseCache -detailed

        -RebootType <String>
            Which node to reboot. Possible values are "PrimaryNode", "SecondaryNode", "AllNodes".

        -ShardId <Integer>
            Which shard to reboot when rebooting a cache with clustering enabled.

        -Force
            When the Force parameter is provided, reset will be performed without any confirmation prompts.

        -PassThru
            By default Reset-AzRedisEnterpriseCache does not return any value. If the PassThru parameter is provided
            then Reset-AzRedisEnterpriseCache returns a boolean value indicating the success of the operation.
```

The following command reboots both nodes of the specified cache.

```azurepowershell
 Reset-AzRedisEnterpriseCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -RebootType "AllNodes"
    -Force
```

::: zone-end

::: zone pivot="azure-cache-redis"

## Azure Cache for Redis PowerShell properties and parameters

The following tables show Azure PowerShell properties and descriptions for common Azure Cache for Redis parameters.

| Parameter | Description | Default |
| --- | --- | --- |
| Name |Name of the cache | |
| Location |Location of the cache | |
| ResourceGroupName |Resource group name in which to create the cache | |
| Size |The size of the cache. Valid values are: P1, P2, P3, P4, P5, C0, C1, C2, C3, C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB |1GB |
| ShardCount |The number of shards to create when creating a premium cache with clustering enabled. Valid values are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | |
| SKU |Specifies the SKU of the cache. Valid values are: Basic, Standard, Premium |Standard |
| RedisConfiguration |Specifies Redis configuration settings. For details on each setting, see the following [RedisConfiguration properties](#redisconfiguration-properties) table. | |
| EnableNonSslPort |Indicates whether the non-SSL port is enabled. |False |
| MaxMemoryPolicy |This parameter has been deprecated - use RedisConfiguration instead. | |
| StaticIP |When hosting your cache in a VNET, specifies a unique IP address in the subnet for the cache. If not provided, one is chosen for you from the subnet. | |
| Subnet |When hosting your cache in a VNET, specifies the name of the subnet in which to deploy the cache. | |
| VirtualNetwork |When hosting your cache in a VNET, specifies the resource ID of the VNET in which to deploy the cache. | |
| KeyType |Specifies which access key to regenerate when renewing access keys. Valid values are: Primary, Secondary | |

### RedisConfiguration properties

| Property | Description | Pricing tiers |
| --- | --- | --- |
| rdb-backup-enabled |Whether [Redis data persistence]/azure-cache-for-redis/cache-how-to-premium-persistence.md) is enabled |Premium only |
| rdb-storage-connection-string |The connection string to the storage account for [Redis data persistence]/azure-cache-for-redis/cache-how-to-premium-persistence.md) |Premium only |
| rdb-backup-frequency |The backup frequency for [Redis data persistence]/azure-cache-for-redis/cache-how-to-premium-persistence.md) |Premium only |
| maxmemory-reserved |Configures the [memory reserved]/azure-cache-for-redis/cache-configure.md#memory-policies) for non-cache processes |Standard and Premium |
| maxmemory-policy |Configures the [eviction policy]/azure-cache-for-redis/cache-configure.md#memory-policies) for the cache |All pricing tiers |
| notify-keyspace-events |Configures [keyspace notifications]/azure-cache-for-redis/cache-configure.md#keyspace-notifications-advanced-settings) |Standard and Premium |
| hash-max-ziplist-entries |Configures [memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types |Standard and Premium |
| hash-max-ziplist-value |Configures [memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types |Standard and Premium |
| set-max-intset-entries |Configures [memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types |Standard and Premium |
| zset-max-ziplist-entries |Configures [memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types |Standard and Premium |
| zset-max-ziplist-value |Configures [memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types |Standard and Premium |
| databases |Configures the number of databases. This property can be configured only at cache creation. |Standard and Premium |

## Create an Azure Cache for Redis cache

You create new Azure Cache for Redis instances using the [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache) cmdlet.

> [!IMPORTANT]
> The first time you create an Azure Cache for Redis in a subscription using the Azure portal, the portal registers the `Microsoft.Cache` namespace for that subscription. If you attempt to create the first Azure Cache for Redis in a subscription using PowerShell, you must first register that namespace using the following command; otherwise cmdlets such as `New-AzRedisCache` and `Get-AzRedisCache` fail.
>
> `Register-AzResourceProvider -ProviderNamespace "Microsoft.Cache"`

To see a list of available parameters and their descriptions for `New-AzRedisCache`, run the following command.

```azurepowershell
Get-Help New-AzRedisCache -detailed
```

`ResourceGroupName`, `Name`, and `Location` are required parameters, but the rest are optional and have default values. Running the following command creates a Standard SKU Azure Cache for Redis instance with the specified name, location, and resource group. The instance is 1 GB in size with the non-SSL port disabled.

To create a cache with default parameters, run the following command.

```azurepowershell
    New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US"
```

To create a Premium cache, specify a size of P1 (6-60 GB), P2 (13-130 GB), P3 (26-260 GB), or P4 (53-530 GB). To enable clustering, specify a shard count using the `ShardCount` parameter. The following example creates a P1 premium cache with three shards. A P1 premium cache is 6 GB in size, and with three shards the total size is 18 GB (3 x 6 GB).

```azurepowershell
New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P1 -ShardCount 3
```

To specify values for the `RedisConfiguration` parameter, enclose the values inside `{}` as key/value pairs like `@{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}`. The following example creates a standard 1-GB cache with `allkeys-random` maxmemory policy and keyspace notifications configured with `KEA`. For more information, see [Keyspace notifications (advanced settings)]/azure-cache-for-redis/cache-configure.md#keyspace-notifications-advanced-settings) and [Memory policies]/azure-cache-for-redis/cache-configure.md#memory-policies).

```azurepowershell
New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}
```

<a name="databases"></a>
## To configure the databases setting during cache creation

The `databases` setting can be configured only during cache creation. The following example creates a premium P3 (26 GB) cache with 48 databases using the [New-AzRedisCache](/powershell/module/az.rediscache/New-azRedisCache) cmdlet.

```azurepowershell
    New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P3 -RedisConfiguration @{"databases" = "48"}
```

For more information on the `databases` property, see [Default Azure Cache for Redis server configuration]/azure-cache-for-redis/cache-configure.md#default-redis-server-configuration). For more information on creating a cache using the [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache) cmdlet, see the previous To create an Azure Cache for Redis section.

## To update an Azure Cache for Redis

Azure Cache for Redis instances are updated using the [Set-AzRedisCache](/powershell/module/az.rediscache/Set-azRedisCache) cmdlet.

To see a list of available parameters and their descriptions for `Set-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Set-AzRedisCache -detailed
```

You can use the `Set-AzRedisCache` cmdlet to update properties such as `Size`, `Sku`, `EnableNonSslPort`, and the `RedisConfiguration` values.

The following example command updates the `maxmemory-policy` for the Azure Cache for Redis instance named `myCache`.

```azurepowershell
    Set-AzRedisCache -ResourceGroupName "myGroup" -Name "myCache" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random"}
```

<a name="scale"></a>
## To scale an Azure Cache for Redis

You can use `Set-AzRedisCache` to scale an Azure Cache for Redis instance when you modify the `Size`, `Sku`, or `ShardCount` properties.

> [!NOTE]
> Scaling a cache using PowerShell has the same limits and guidelines as scaling a cache using the Azure portal. You can scale to a different pricing tier with the following restrictions:
>
> - You can't scale from a higher pricing tier to a lower pricing tier, such as from a Premium cache down to a Standard or Basic cache, or from a Standard to a Basic cache.
> - You can scale from a Basic cache to a Standard cache, but you can't change the size at the same time. If you need a different size, you can do another scaling operation to the desired size.
> - You can't scale from a Basic cache directly to a Premium cache. You must scale from Basic to Standard in one scaling operation, and then from Standard to Premium in another scaling operation.
> - You can't scale from a larger size down to the C0 (250 MB) size.
>
> For more information, see [How to scale Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-scale.md).

The following example shows how to scale a cache named `myCache` to a 2.5-GB cache. This command works for a Basic or a Standard cache.

```azurepowershell
    Set-AzRedisCache -ResourceGroupName myGroup -Name myCache -Size 2.5GB
```

After you issue this command, the status of the cache is returned, similar to calling `Get-AzRedisCache`. The `ProvisioningState` is set to `Scaling`.

```output
    Name               : mycache
    Id                 : /subscriptions/12ad12bd-abdc-2231-a2ed-a2b8b246bbad4/resourceGroups/mygroup/providers/Mi
                         crosoft.Cache/Redis/mycache
    Location           : South Central US
    Type               : Microsoft.Cache/Redis
    HostName           : mycache.redis.cache.windows.net
    Port               : 6379
    ProvisioningState  : Scaling
    SslPort            : 6380
    RedisConfiguration : {[maxmemory-policy, volatile-lru], [maxmemory-reserved, 150], [notify-keyspace-events, KEA],
                         [maxmemory-delta, 150]...}
    EnableNonSslPort   : False
    RedisVersion       : 3.0
    Size               : 1GB
    Sku                : Standard
    ResourceGroupName  : mygroup
    PrimaryKey         : ....
    SecondaryKey       : ....
    VirtualNetwork     :
    Subnet             :
    StaticIP           :
    TenantSettings     : {}
    ShardCount         :
```

When the scaling operation is complete, the `ProvisioningState` changes to `Succeeded`. If you need to do another scaling operation, such as changing the size after changing from Basic to Standard, you must wait until the previous operation is complete. Otherwise, you receive an error similar to the following message.

```azurepowershell
Set-AzRedisCache : Conflict: The resource '...' is not in a stable state, and is currently unable to accept the update request.
```

## Get information about an Azure Cache for Redis cache

You can retrieve information about a cache using the [Get-AzRedisCache](/powershell/module/az.rediscache/get-azrediscache) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Get-AzRedisCache -detailed

```

To return information about all caches in the current subscription, run `Get-AzRedisCache` without any parameters.

```azurepowershell
Get-AzRedisCache
```

To return information about all caches in a specific resource group, run `Get-AzRedisCache` with the `ResourceGroupName` parameter.

```azurepowershell
Get-AzRedisCache -ResourceGroupName myGroup
```

To return information about a specific cache, run `Get-AzRedisCache` with the `Name` parameter containing the name of the cache, and the `ResourceGroupName` parameter with the resource group containing that cache.

```azurepowershell
Get-AzRedisCache -Name myCache -ResourceGroupName myGroup

    Name               : mycache
    Id                 : /subscriptions/12ad12bd-abdc-2231-a2ed-a2b8b246bbad4/resourceGroups/myGroup/providers/Mi
                         crosoft.Cache/Redis/mycache
    Location           : South Central US
    Type               : Microsoft.Cache/Redis
    HostName           : mycache.redis.cache.windows.net
    Port               : 6379
    ProvisioningState  : Succeeded
    SslPort            : 6380
    RedisConfiguration : {[maxmemory-policy, volatile-lru], [maxmemory-reserved, 62], [notify-keyspace-events, KEA],
                         [maxclients, 1000]...}
    EnableNonSslPort   : False
    RedisVersion       : 3.0
    Size               : 1GB
    Sku                : Standard
    ResourceGroupName  : myGroup
    VirtualNetwork     :
    Subnet             :
    StaticIP           :
    TenantSettings     : {}
    ShardCount         :
```

## Retrieve the access keys for an Azure Cache for Redis cache

To retrieve the access keys for your cache, you can use the [Get-AzRedisCacheKey](/powershell/module/az.rediscache/Get-azRedisCacheKey) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzRedisCacheKey`, run the following command.

```azurepowershell
Get-Help Get-AzRedisCacheKey -detailed

```

To retrieve the keys for your cache, call the `Get-AzRedisCacheKey` cmdlet and pass in the name of your cache and the name of the resource group that contains the cache.

```azurepowershell
Get-AzRedisCacheKey -Name myCache -ResourceGroupName myGroup

    PrimaryKey   : b2wdt43sfetlju4hfbryfnregrd9wgIcc6IA3zAO1lY=
    SecondaryKey : ABhfB757JgjIgt785JgKH9865eifmekfnn649303JKL=
```

## Regenerate access keys for your Azure Cache for Redis cache

To regenerate the access keys for your cache, you can use the [New-AzRedisCacheKey](/powershell/module/az.rediscache/New-azRedisCacheKey) cmdlet.

To see a list of available parameters and their descriptions for `New-AzRedisCacheKey`, run the following command.

```azurepowershell
Get-Help New-AzRedisCacheKey -detailed

```

To regenerate the primary or secondary key for your cache, call the `New-AzRedisCacheKey` cmdlet and pass in the name, resource group, and specify either `Primary` or `Secondary` for the `KeyType` parameter. The following example regenerates the secondary access key for a cache.

```azurepowershell
New-AzRedisCacheKey -Name myCache -ResourceGroupName myGroup -KeyType Secondary
```

## Delete an Azure Cache for Redis cache

To delete an Azure Cache for Redis cache, use the [Remove-AzRedisCache](/powershell/module/az.rediscache/remove-azrediscache) cmdlet.

To see a list of available parameters and their descriptions for `Remove-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Remove-AzRedisCache -detailed
```

The following example removes the cache named `myCache`.

```azurepowershell
Remove-AzRedisCache -Name myCache -ResourceGroupName myGroup
```

<a name="to-import-an-azure-cache-for-redis"></a>
## Import data into an Azure Cache for Redis cache

You can import data into an Azure Cache for Redis instance using the `Import-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Import/Export is only available for [Premium tier]/azure-cache-for-redis/cache-overview.md#service-tiers) caches. For more information about Import/Export, see [Import and Export data in Azure Cache for Redis]/azure-cache-for-redis/cache-how-to-import-export-data.md).

To see a list of available parameters and their descriptions for `Import-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Import-AzRedisCache -detailed
```

The following command imports data from the blob specified by the `Files` parameter into Azure Cache for Redis.

```azurepowershell
Import-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Files @("https://mystorageaccount.blob.core.windows.net/mycontainername/blobname?sv=2015-04-05&sr=b&sig=caIwutG2uDa0NZ8mjdNJdgOY8%2F8mhwRuGNdICU%2B0pI4%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwd") -Force
```

<a name="to-export-an-azure-cache-for-redis"></a>
## Export Azure Cache for Redis cache data

You can export data from an Azure Cache for Redis instance using the `Export-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Import/Export is only available for [Premium tier]/azure-cache-for-redis/cache-overview.md#service-tiers) caches. For more information about Import/Export, see [Import and Export data in Azure Cache for Redis]/azure-cache-for-redis/cache-how-to-import-export-data.md).
>
To see a list of available parameters and their descriptions for `Export-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Export-AzRedisCache -detailed
```

The following command exports data from an Azure Cache for Redis instance into the container specified by the `Container` parameter.

```azurepowershell
    PS C:\>Export-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Prefix "blobprefix"
    -Container "https://mystorageaccount.blob.core.windows.net/mycontainer?sv=2015-04-05&sr=c&sig=HezZtBZ3DURmEGDduauE7
    pvETY4kqlPI8JCNa8ATmaw%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwdl"
```

<a name="to-reboot-an-azure-cache-for-redis"></a>
## Reboot an Azure Cache for Redis cache

You can reboot your Azure Cache for Redis instance using the `Reset-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Reboot is only available for [Basic, Standard, and Premium tier]/azure-cache-for-redis/cache-overview.md#service-tiers) caches. For more information about rebooting your cache, see [Cache administration - reboot]/azure-cache-for-redis/cache-administration.md#reboot).

To see a list of available parameters and their descriptions for `Reset-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Reset-AzRedisCache -detailed
```

The following command reboots both nodes of the specified cache.

```azurepowershell
Reset-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -RebootType "AllNodes" -Force
```

::: zone-end

## General Azure PowerShell commands

Run these commands at the Azure PowerShell command prompt.

Check the Azure PowerShell version:

```azurepowershell
Get-Module Az | format-table version
```

Sign in to Azure:

```azurepowershell
Connect-AzAccount
```

See a list of your current subscriptions:

```azurepowershell
Get-AzSubscription | sort SubscriptionName | Select SubscriptionName
```

Specify an Azure subscription to use:

```azurepowershell
Select-AzSubscription -SubscriptionName ContosoSubscription
```

Get detailed help for any cmdlet:

```azurepowershell
Get-Help <cmdlet-name> -Detailed
```

## How to connect to other clouds

By default the Azure environment is `AzureCloud`, which represents the global Azure cloud. To connect to a different cloud instance, use the `Connect-AzAccount` command with the `-Environment` or -`EnvironmentName` command-line switch with the environment or environment name you want.

To see the list of available environments, run `Get-AzEnvironment`.

### Azure Government Cloud

To connect to the Azure Government Cloud, use<br>
`Connect-AzAccount -EnvironmentName AzureUSGovernment`<br>
or<br>
`Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureUSGovernment)`

To create a cache in the Azure Government Cloud, use the `USGov Virginia` or `USGov Iowa` locations.

For more information about the Azure Government Cloud, see [Microsoft Azure Government](https://azure.microsoft.com/features/gov/) and [Microsoft Azure Government Developer Guide](/azure/azure-government/documentation-government-developer-guide).

### Azure operated by 21Vianet

To connect to the Azure operated by 21Vianet (China) cloud, use<br>
`Connect-AzAccount -EnvironmentName AzureChinaCloud`<br>
or<br>
`Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureChinaCloud)`

To create a cache in the Azure operated by 21Vianet cloud, use the `China East` or `China North` locations.

### Microsoft Azure Germany

To connect to Microsoft Azure Germany, use<br>
`Connect-AzAccount -EnvironmentName AzureGermanCloud`<br>
or<br>
`Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureGermanCloud)`

To create a cache in Microsoft Azure Germany, use the `Germany Central` or `Germany Northeast` locations.

For more information about Microsoft Azure Germany, see [Microsoft Azure Germany](https://azure.microsoft.com/overview/clouds/germany/).

## Related content

* [Azure Cache for Redis cmdlet documentation](/powershell/module/az.rediscache)
* [Azure Resource Manager Cmdlets](/powershell/module/)
* [Using Resource groups to manage your Azure resources](../azure-resource-manager/templates/deploy-portal.md): Learn how to create and manage resource groups in the Azure portal.
* [Azure blog](https://azure.microsoft.com/blog/): Learn about new features in Azure.
* [Windows PowerShell blog](https://devblogs.microsoft.com/powershell/): Learn about new features in Windows PowerShell.
* ["Hey, Scripting Guy!" Blog](https://devblogs.microsoft.com/scripting/tag/hey-scripting-guy/): Get real-world tips and tricks from the Windows PowerShell community.

