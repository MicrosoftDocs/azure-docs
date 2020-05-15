---
title: Manage Azure Cache for Redis with Azure PowerShell
description: Learn how to perform administrative tasks for Azure Cache for Redis using Azure PowerShell.
author: yegu-ms

ms.service: cache
ms.topic: conceptual
ms.date: 07/13/2017
ms.author: yegu

---
# Manage Azure Cache for Redis with Azure PowerShell
> [!div class="op_single_selector"]
> * [PowerShell](cache-how-to-manage-redis-cache-powershell.md)
> * [Azure CLI](cache-manage-cli.md)
> 
> 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This topic shows you how to perform common tasks such as create, update, and scale your Azure Cache for Redis instances, how to regenerate access keys, and how to view information about your caches. For a complete list of Azure Cache for Redis PowerShell cmdlets, see [Azure Cache for Redis cmdlets](https://docs.microsoft.com/powershell/module/az.rediscache).

[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)]

For more information about the classic deployment model, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../azure-resource-manager/management/deployment-models.md).

## Prerequisites
If you have already installed Azure PowerShell, you must have Azure PowerShell version 1.0.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

    Get-Module Az | format-table version


First, you must log in to Azure with this command.

    Connect-AzAccount

Specify the email address of your Azure account and its password in the Microsoft Azure sign-in dialog.

Next, if you have multiple Azure subscriptions, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

    Get-AzSubscription | sort SubscriptionName | Select SubscriptionName

To specify the subscription, run the following command. In the following example, the subscription name is `ContosoSubscription`.

    Select-AzSubscription -SubscriptionName ContosoSubscription

Before you can use Windows PowerShell with Azure Resource Manager, you need the following:

* Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify the value of `PSVersion` is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0](https://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](https://www.microsoft.com/download/details.aspx?id=40855).

To get detailed help for any cmdlet you see in this tutorial, use the Get-Help cmdlet.

    Get-Help <cmdlet-name> -Detailed

For example, to get help for the `New-AzRedisCache` cmdlet, type:

    Get-Help New-AzRedisCache -Detailed

### How to connect to other clouds
By default the Azure environment is `AzureCloud`, which represents the global Azure cloud instance. To connect to a different instance, use the `Connect-AzAccount` command with the `-Environment` or -`EnvironmentName` command line switch with the desired environment or environment name.

To see the list of available environments, run the `Get-AzEnvironment` cmdlet.

### To connect to the Azure Government Cloud
To connect to the Azure Government Cloud, use one of the following commands.

    Connect-AzAccount -EnvironmentName AzureUSGovernment

or

    Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureUSGovernment)

To create a cache in the Azure Government Cloud, use one of the following locations.

* USGov Virginia
* USGov Iowa

For more information about the Azure Government Cloud, see [Microsoft Azure Government](https://azure.microsoft.com/features/gov/) and [Microsoft Azure Government Developer Guide](../azure-government-developer-guide.md).

### To connect to the Azure China Cloud
To connect to the Azure China Cloud, use one of the following commands.

    Connect-AzAccount -EnvironmentName AzureChinaCloud

or

    Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureChinaCloud)

To create a cache in the Azure China Cloud, use one of the following locations.

* China East
* China North

For more information about the Azure China Cloud, see [AzureChinaCloud for Azure operated by 21Vianet in China](https://www.windowsazure.cn/).

### To connect to Microsoft Azure Germany
To connect to Microsoft Azure Germany, use one of the following commands.

    Connect-AzAccount -EnvironmentName AzureGermanCloud


or

    Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureGermanCloud)

To create a cache in Microsoft Azure Germany, use one of the following locations.

* Germany Central
* Germany Northeast

For more information about Microsoft Azure Germany, see [Microsoft Azure Germany](https://azure.microsoft.com/overview/clouds/germany/).

### Properties used for Azure Cache for Redis PowerShell
The following table contains properties and descriptions for commonly used parameters when creating and managing your Azure Cache for Redis instances using Azure PowerShell.

| Parameter | Description | Default |
| --- | --- | --- |
| Name |Name of the cache | |
| Location |Location of the cache | |
| ResourceGroupName |Resource group name in which to create the cache | |
| Size |The size of the cache. Valid values are: P1, P2, P3, P4, C0, C1, C2, C3, C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB |1GB |
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
| rdb-backup-enabled |Whether [Redis data persistence](cache-how-to-premium-persistence.md) is enabled |Premium only |
| rdb-storage-connection-string |The connection string to the storage account for [Redis data persistence](cache-how-to-premium-persistence.md) |Premium only |
| rdb-backup-frequency |The backup frequency for [Redis data persistence](cache-how-to-premium-persistence.md) |Premium only |
| maxmemory-reserved |Configures the [memory reserved](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) for non-cache processes |Standard and Premium |
| maxmemory-policy |Configures the [eviction policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) for the cache |All pricing tiers |
| notify-keyspace-events |Configures [keyspace notifications](cache-configure.md#keyspace-notifications-advanced-settings) |Standard and Premium |
| hash-max-ziplist-entries |Configures [memory optimization](https://redis.io/topics/memory-optimization) for small aggregate data types |Standard and Premium |
| hash-max-ziplist-value |Configures [memory optimization](https://redis.io/topics/memory-optimization) for small aggregate data types |Standard and Premium |
| set-max-intset-entries |Configures [memory optimization](https://redis.io/topics/memory-optimization) for small aggregate data types |Standard and Premium |
| zset-max-ziplist-entries |Configures [memory optimization](https://redis.io/topics/memory-optimization) for small aggregate data types |Standard and Premium |
| zset-max-ziplist-value |Configures [memory optimization](https://redis.io/topics/memory-optimization) for small aggregate data types |Standard and Premium |
| databases |Configures the number of databases. This property can be configured only at cache creation. |Standard and Premium |

## To create an Azure Cache for Redis
New Azure Cache for Redis instances are created using the [New-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/new-azrediscache) cmdlet.

> [!IMPORTANT]
> The first time you create an Azure Cache for Redis in a subscription using the Azure portal, the portal registers the `Microsoft.Cache` namespace for that subscription. If you attempt to create the first Azure Cache for Redis in a subscription using PowerShell, you must first register that namespace using the following command; otherwise cmdlets such as `New-AzRedisCache` and `Get-AzRedisCache` fail.
> 
> `Register-AzResourceProvider -ProviderNamespace "Microsoft.Cache"`
> 
> 

To see a list of available parameters and their descriptions for `New-AzRedisCache`, run the following command.

    PS C:\> Get-Help New-AzRedisCache -detailed

    NAME
        New-AzRedisCache

    SYNOPSIS
        Creates a new Azure Cache for Redis.


    SYNTAX
        New-AzRedisCache -Name <String> -ResourceGroupName <String> -Location <String> [-RedisVersion <String>]
        [-Size <String>] [-Sku <String>] [-MaxMemoryPolicy <String>] [-RedisConfiguration <Hashtable>] [-EnableNonSslPort
        <Boolean>] [-ShardCount <Integer>] [-VirtualNetwork <String>] [-Subnet <String>] [-StaticIP <String>]
        [<CommonParameters>]


    DESCRIPTION
        The New-AzRedisCache cmdlet creates a new Azure Cache for Redis.


    PARAMETERS
        -Name <String>
            Name of the Azure Cache for Redis to create.

        -ResourceGroupName <String>
            Name of resource group in which to create the Azure Cache for Redis.

        -Location <String>
            Location in which to create the Azure Cache for Redis.

        -RedisVersion <String>
            RedisVersion is deprecated and will be removed in future release.

        -Size <String>
            Size of the Azure Cache for Redis. The default value is 1GB or C1. Possible values are P1, P2, P3, P4, C0, C1, C2, C3,
            C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB.

        -Sku <String>
            Sku of Azure Cache for Redis. The default value is Standard. Possible values are Basic, Standard and Premium.

        -MaxMemoryPolicy <String>
            The 'MaxMemoryPolicy' setting has been deprecated. Please use 'RedisConfiguration' setting to set
            MaxMemoryPolicy. e.g. -RedisConfiguration @{"maxmemory-policy" = "allkeys-lru"}

        -RedisConfiguration <Hashtable>
            All Redis Configuration Settings. Few possible keys: rdb-backup-enabled, rdb-storage-connection-string,
            rdb-backup-frequency, maxmemory-reserved, maxmemory-policy, notify-keyspace-events, hash-max-ziplist-entries,
            hash-max-ziplist-value, set-max-intset-entries, zset-max-ziplist-entries, zset-max-ziplist-value, databases.

        -EnableNonSslPort <Boolean>
            EnableNonSslPort is used by Azure Cache for Redis. If no value is provided, the default value is false and the
            non-SSL port will be disabled. Possible values are true and false.

        -ShardCount <Integer>
            The number of shards to create on a Premium Cluster Cache.

        -VirtualNetwork <String>
            The exact ARM resource ID of the virtual network to deploy the Azure Cache for Redis in. Example format: /subscriptions/{
            subid}/resourceGroups/{resourceGroupName}/providers/Microsoft.ClassicNetwork/VirtualNetworks/{vnetName}

        -Subnet <String>
            Required when deploying an Azure Cache for Redis inside an existing Azure Virtual Network.

        -StaticIP <String>
            Required when deploying an Azure Cache for Redis inside an existing Azure Virtual Network.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

To create a cache with default parameters, run the following command.

    New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US"

`ResourceGroupName`, `Name`, and `Location` are required parameters, but the rest are optional and have default values. Running the previous command creates a Standard SKU Azure Cache for Redis instance with the specified name, location, and resource group, that is 1 GB in size with the non-SSL port disabled.

To create a premium cache, specify a size of P1 (6 GB - 60 GB), P2 (13 GB - 130 GB), P3 (26 GB - 260 GB), or P4 (53 GB - 530 GB). To enable clustering, specify a shard count using the `ShardCount` parameter. The following example creates a P1 premium cache with 3 shards. A P1 premium cache is 6 GB in size, and since we specified three shards the total size is 18 GB (3 x 6 GB).

    New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P1 -ShardCount 3

To specify values for the `RedisConfiguration` parameter, enclose the values inside `{}` as key/value pairs like `@{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}`. The following example creates a standard 1 GB cache with `allkeys-random` maxmemory policy and keyspace notifications configured with `KEA`. For more information, see [Keyspace notifications (advanced settings)](cache-configure.md#keyspace-notifications-advanced-settings) and [Memory policies](cache-configure.md#memory-policies).

    New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}

<a name="databases"></a>

## To configure the databases setting during cache creation
The `databases` setting can be configured only during cache creation. The following example creates a premium P3 (26 GB) cache with 48 databases using the [New-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/New-azRedisCache) cmdlet.

    New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P3 -RedisConfiguration @{"databases" = "48"}

For more information on the `databases` property, see [Default Azure Cache for Redis server configuration](cache-configure.md#default-redis-server-configuration). For more information on creating a cache using the [New-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/new-azrediscache) cmdlet, see the previous To create an Azure Cache for Redis section.

## To update an Azure Cache for Redis
Azure Cache for Redis instances are updated using the [Set-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/Set-azRedisCache) cmdlet.

To see a list of available parameters and their descriptions for `Set-AzRedisCache`, run the following command.

    PS C:\> Get-Help Set-AzRedisCache -detailed

    NAME
        Set-AzRedisCache

    SYNOPSIS
        Set Azure Cache for Redis updatable parameters.

    SYNTAX
        Set-AzRedisCache -Name <String> -ResourceGroupName <String> [-Size <String>] [-Sku <String>]
        [-MaxMemoryPolicy <String>] [-RedisConfiguration <Hashtable>] [-EnableNonSslPort <Boolean>] [-ShardCount
        <Integer>] [<CommonParameters>]

    DESCRIPTION
        The Set-AzRedisCache cmdlet sets Azure Cache for Redis parameters.

    PARAMETERS
        -Name <String>
            Name of the Azure Cache for Redis to update.

        -ResourceGroupName <String>
            Name of the resource group for the cache.

        -Size <String>
            Size of the Azure Cache for Redis. The default value is 1GB or C1. Possible values are P1, P2, P3, P4, C0, C1, C2, C3,
            C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB.

        -Sku <String>
            Sku of Azure Cache for Redis. The default value is Standard. Possible values are Basic, Standard and Premium.

        -MaxMemoryPolicy <String>
            The 'MaxMemoryPolicy' setting has been deprecated. Please use 'RedisConfiguration' setting to set
            MaxMemoryPolicy. e.g. -RedisConfiguration @{"maxmemory-policy" = "allkeys-lru"}

        -RedisConfiguration <Hashtable>
            All Redis Configuration Settings. Few possible keys: rdb-backup-enabled, rdb-storage-connection-string,
            rdb-backup-frequency, maxmemory-reserved, maxmemory-policy, notify-keyspace-events, hash-max-ziplist-entries,
            hash-max-ziplist-value, set-max-intset-entries, zset-max-ziplist-entries, zset-max-ziplist-value.

        -EnableNonSslPort <Boolean>
            EnableNonSslPort is used by Azure Cache for Redis. The default value is null and no change will be made to the
            currently configured value. Possible values are true and false.

        -ShardCount <Integer>
            The number of shards to create on a Premium Cluster Cache.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

The `Set-AzRedisCache` cmdlet can be used to update properties such as `Size`, `Sku`, `EnableNonSslPort`, and the `RedisConfiguration` values. 

The following command updates the maxmemory-policy for the Azure Cache for Redis named myCache.

    Set-AzRedisCache -ResourceGroupName "myGroup" -Name "myCache" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random"}

<a name="scale"></a>

## To scale an Azure Cache for Redis
`Set-AzRedisCache` can be used to scale an Azure Cache for Redis instance when the `Size`, `Sku`, or `ShardCount` properties are modified. 

> [!NOTE]
> Scaling a cache using PowerShell is subject to the same limits and guidelines as scaling a cache from the Azure portal. You can scale to a different pricing tier with the following restrictions.
> 
> * You can't scale from a higher pricing tier to a lower pricing tier.
> * You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
> * You can't scale from a **Standard** cache down to a **Basic** cache.
> * You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a subsequent scaling operation to the desired size.
> * You can't scale from a **Basic** cache directly to a **Premium** cache. You must scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a subsequent scaling operation.
> * You can't scale from a larger size down to the **C0 (250 MB)** size.
> 
> For more information, see [How to Scale Azure Cache for Redis](cache-how-to-scale.md).
> 
> 

The following example shows how to scale a cache named `myCache` to a 2.5 GB cache. Note that this command works for both a Basic or a Standard cache.

    Set-AzRedisCache -ResourceGroupName myGroup -Name myCache -Size 2.5GB

After this command is issued, the status of the cache is returned (similar to calling `Get-AzRedisCache`). Note that the `ProvisioningState` is `Scaling`.

    PS C:\> Set-AzRedisCache -Name myCache -ResourceGroupName myGroup -Size 2.5GB


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

When the scaling operation is complete, the `ProvisioningState` changes to `Succeeded`. If you need to make a subsequent scaling operation, such as changing from Basic to Standard and then changing the size, you must wait until the previous operation is complete or you receive an error similar to the following.

    Set-AzRedisCache : Conflict: The resource '...' is not in a stable state, and is currently unable to accept the update request.

## To get information about an Azure Cache for Redis
You can retrieve information about a cache using the [Get-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/get-azrediscache) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzRedisCache`, run the following command.

    PS C:\> Get-Help Get-AzRedisCache -detailed

    NAME
        Get-AzRedisCache

    SYNOPSIS
        Gets details about a single cache or all caches in the specified resource group or all caches in the current
        subscription.

    SYNTAX
        Get-AzRedisCache [-Name <String>] [-ResourceGroupName <String>] [<CommonParameters>]

    DESCRIPTION
        The Get-AzRedisCache cmdlet gets the details about a cache or caches depending on input parameters. If both
        ResourceGroupName and Name parameters are provided then Get-AzRedisCache will return details about the
        specific cache name provided.

        If only ResourceGroupName is provided than it will return details about all caches in the specified resource group.

        If no parameters are given than it will return details about all caches the current subscription.

    PARAMETERS
        -Name <String>
            The name of the cache. When this parameter is provided along with ResourceGroupName, Get-AzRedisCache
            returns the details for the cache.

        -ResourceGroupName <String>
            The name of the resource group that contains the cache or caches. If ResourceGroupName is provided with Name
            then Get-AzRedisCache returns the details of the cache specified by Name. If only the ResourceGroup
            parameter is provided, then details for all caches in the resource group are returned.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

To return information about all caches in the current subscription, run `Get-AzRedisCache` without any parameters.

    Get-AzRedisCache

To return information about all caches in a specific resource group, run `Get-AzRedisCache` with the `ResourceGroupName` parameter.

    Get-AzRedisCache -ResourceGroupName myGroup

To return information about a specific cache, run `Get-AzRedisCache` with the `Name` parameter containing the name of the cache, and the `ResourceGroupName` parameter with the resource group containing that cache.

    PS C:\> Get-AzRedisCache -Name myCache -ResourceGroupName myGroup

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

## To retrieve the access keys for an Azure Cache for Redis
To retrieve the access keys for your cache, you can use the [Get-AzRedisCacheKey](https://docs.microsoft.com/powershell/module/az.rediscache/Get-azRedisCacheKey) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzRedisCacheKey`, run the following command.

    PS C:\> Get-Help Get-AzRedisCacheKey -detailed

    NAME
        Get-AzRedisCacheKey

    SYNOPSIS
        Gets the accesskeys for the specified Azure Cache for Redis.


    SYNTAX
        Get-AzRedisCacheKey -Name <String> -ResourceGroupName <String> [<CommonParameters>]

    DESCRIPTION
        The Get-AzRedisCacheKey cmdlet gets the access keys for the specified cache.

    PARAMETERS
        -Name <String>
            Name of the Azure Cache for Redis.

        -ResourceGroupName <String>
            Name of the resource group for the cache.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

To retrieve the keys for your cache, call the `Get-AzRedisCacheKey` cmdlet and pass in the name of your cache the name of the resource group that contains the cache.

    PS C:\> Get-AzRedisCacheKey -Name myCache -ResourceGroupName myGroup

    PrimaryKey   : b2wdt43sfetlju4hfbryfnregrd9wgIcc6IA3zAO1lY=
    SecondaryKey : ABhfB757JgjIgt785JgKH9865eifmekfnn649303JKL=

## To regenerate access keys for your Azure Cache for Redis
To regenerate the access keys for your cache, you can use the [New-AzRedisCacheKey](https://docs.microsoft.com/powershell/module/az.rediscache/New-azRedisCacheKey) cmdlet.

To see a list of available parameters and their descriptions for `New-AzRedisCacheKey`, run the following command.

    PS C:\> Get-Help New-AzRedisCacheKey -detailed

    NAME
        New-AzRedisCacheKey

    SYNOPSIS
        Regenerates the access key of an Azure Cache for Redis.

    SYNTAX
        New-AzRedisCacheKey -Name <String> -ResourceGroupName <String> -KeyType <String> [-Force] [<CommonParameters>]

    DESCRIPTION
        The New-AzRedisCacheKey cmdlet regenerate the access key of an Azure Cache for Redis.

    PARAMETERS
        -Name <String>
            Name of the Azure Cache for Redis.

        -ResourceGroupName <String>
            Name of the resource group for the cache.

        -KeyType <String>
            Specifies whether to regenerate the primary or secondary access key. Possible values are Primary or Secondary.

        -Force
            When the Force parameter is provided, the specified access key is regenerated without any confirmation prompts.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

To regenerate the primary or secondary key for your cache, call the `New-AzRedisCacheKey` cmdlet and pass in the name, resource group, and specify either `Primary` or `Secondary` for the `KeyType` parameter. In the following example, the secondary access key for a cache is regenerated.

    PS C:\> New-AzRedisCacheKey -Name myCache -ResourceGroupName myGroup -KeyType Secondary

    Confirm
    Are you sure you want to regenerate Secondary key for Azure Cache for Redis 'myCache'?
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y


    PrimaryKey   : b2wdt43sfetlju4hfbryfnregrd9wgIcc6IA3zAO1lY=
    SecondaryKey : c53hj3kh4jhHjPJk8l0jji785JgKH9865eifmekfnn6=

## To delete an Azure Cache for Redis
To delete an Azure Cache for Redis, use the [Remove-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/remove-azrediscache) cmdlet.

To see a list of available parameters and their descriptions for `Remove-AzRedisCache`, run the following command.

    PS C:\> Get-Help Remove-AzRedisCache -detailed

    NAME
        Remove-AzRedisCache

    SYNOPSIS
        Remove Azure Cache for Redis if exists.

    SYNTAX
        Remove-AzRedisCache -Name <String> -ResourceGroupName <String> [-Force] [-PassThru] [<CommonParameters>

    DESCRIPTION
        The Remove-AzRedisCache cmdlet removes an Azure Cache for Redis if it exists.

    PARAMETERS
        -Name <String>
            Name of the Azure Cache for Redis to remove.

        -ResourceGroupName <String>
            Name of the resource group of the cache to remove.

        -Force
            When the Force parameter is provided, the cache is removed without any confirmation prompts.

        -PassThru
            By default Remove-AzRedisCache removes the cache and does not return any value. If the PassThru par
            is provided then Remove-AzRedisCache returns a boolean value indicating the success of the operatio

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

In the following example, the cache named `myCache` is removed.

    PS C:\> Remove-AzRedisCache -Name myCache -ResourceGroupName myGroup

    Confirm
    Are you sure you want to remove Azure Cache for Redis 'myCache'?
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y


## To import an Azure Cache for Redis
You can import data into an Azure Cache for Redis instance using the `Import-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Import/Export is only available for [premium tier](cache-premium-tier-intro.md) caches. For more information about Import/Export, see [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md).
> 
> 

To see a list of available parameters and their descriptions for `Import-AzRedisCache`, run the following command.

    PS C:\> Get-Help Import-AzRedisCache -detailed

    NAME
        Import-AzRedisCache

    SYNOPSIS
        Import data from blobs to Azure Cache for Redis.


    SYNTAX
        Import-AzRedisCache -Name <String> -ResourceGroupName <String> -Files <String[]> [-Format <String>] [-Force]
        [-PassThru] [<CommonParameters>]


    DESCRIPTION
        The Import-AzRedisCache cmdlet imports data from the specified blobs into Azure Cache for Redis.


    PARAMETERS
        -Name <String>
            The name of the cache.

        -ResourceGroupName <String>
            The name of the resource group that contains the cache.

        -Files <String[]>
            SAS urls of blobs whose content should be imported into the cache.

        -Format <String>
            Format for the blob.  Currently "rdb" is the only supported, with other formats expected in the future.

        -Force
            When the Force parameter is provided, import will be performed without any confirmation prompts.

        -PassThru
            By default Import-AzRedisCache imports data in cache and does not return any value. If the PassThru
            parameter is provided then Import-AzRedisCache returns a boolean value indicating the success of the
            operation.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).


The following command imports data from the blob specified by the SAS uri into Azure Cache for Redis.

    PS C:\>Import-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Files @("https://mystorageaccount.blob.core.windows.net/mycontainername/blobname?sv=2015-04-05&sr=b&sig=caIwutG2uDa0NZ8mjdNJdgOY8%2F8mhwRuGNdICU%2B0pI4%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwd") -Force

## To export an Azure Cache for Redis
You can export data from an Azure Cache for Redis instance using the `Export-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Import/Export is only available for [premium tier](cache-premium-tier-intro.md) caches. For more information about Import/Export, see [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md).
> 
> 

To see a list of available parameters and their descriptions for `Export-AzRedisCache`, run the following command.

    PS C:\> Get-Help Export-AzRedisCache -detailed

    NAME
        Export-AzRedisCache

    SYNOPSIS
        Exports data from Azure Cache for Redis to a specified container.


    SYNTAX
        Export-AzRedisCache -Name <String> -ResourceGroupName <String> -Prefix <String> -Container <String> [-Format
        <String>] [-PassThru] [<CommonParameters>]


    DESCRIPTION
        The Export-AzRedisCache cmdlet exports data from Azure Cache for Redis to a specified container.


    PARAMETERS
        -Name <String>
            The name of the cache.

        -ResourceGroupName <String>
            The name of the resource group that contains the cache.

        -Prefix <String>
            Prefix to use for blob names.

        -Container <String>
            SAS url of container where data should be exported.

        -Format <String>
            Format for the blob.  Currently "rdb" is the only supported, with other formats expected in the future.

        -PassThru
            By default Export-AzRedisCache does not return any value. If the PassThru parameter is provided
            then Export-AzRedisCache returns a boolean value indicating the success of the operation.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).


The following command exports data from an Azure Cache for Redis instance into the container specified by the SAS uri.

        PS C:\>Export-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Prefix "blobprefix"
        -Container "https://mystorageaccount.blob.core.windows.net/mycontainer?sv=2015-04-05&sr=c&sig=HezZtBZ3DURmEGDduauE7
        pvETY4kqlPI8JCNa8ATmaw%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwdl"

## To reboot an Azure Cache for Redis
You can reboot your Azure Cache for Redis instance using the `Reset-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Reboot is only available for [premium tier](cache-premium-tier-intro.md) caches. For more information about rebooting your cache, see [Cache administration - reboot](cache-administration.md#reboot).
> 
> 

To see a list of available parameters and their descriptions for `Reset-AzRedisCache`, run the following command.

    PS C:\> Get-Help Reset-AzRedisCache -detailed

    NAME
        Reset-AzRedisCache

    SYNOPSIS
        Reboot specified node(s) of an Azure Cache for Redis instance.


    SYNTAX
        Reset-AzRedisCache -Name <String> -ResourceGroupName <String> -RebootType <String> [-ShardId <Integer>]
        [-Force] [-PassThru] [<CommonParameters>]


    DESCRIPTION
        The Reset-AzRedisCache cmdlet reboots the specified node(s) of an Azure Cache for Redis instance.


    PARAMETERS
        -Name <String>
            The name of the cache.

        -ResourceGroupName <String>
            The name of the resource group that contains the cache.

        -RebootType <String>
            Which node to reboot. Possible values are "PrimaryNode", "SecondaryNode", "AllNodes".

        -ShardId <Integer>
            Which shard to reboot when rebooting a premium cache with clustering enabled.

        -Force
            When the Force parameter is provided, reset will be performed without any confirmation prompts.

        -PassThru
            By default Reset-AzRedisCache does not return any value. If the PassThru parameter is provided
            then Reset-AzRedisCache returns a boolean value indicating the success of the operation.

        <CommonParameters>
            This cmdlet supports the common parameters: Verbose, Debug,
            ErrorAction, ErrorVariable, WarningAction, WarningVariable,
            OutBuffer, PipelineVariable, and OutVariable. For more information, see
            about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).


The following command reboots both nodes of the specified cache.

        PS C:\>Reset-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -RebootType "AllNodes"
        -Force


## Next steps
To learn more about using Windows PowerShell with Azure, see the following resources:

* [Azure Cache for Redis cmdlet documentation on MSDN](https://docs.microsoft.com/powershell/module/az.rediscache)
* [Azure Resource Manager Cmdlets](https://go.microsoft.com/fwlink/?LinkID=394765): Learn to use the cmdlets in the Azure Resource Manager module.
* [Using Resource groups to manage your Azure resources](../azure-resource-manager/templates/deploy-portal.md): Learn how to create and manage resource groups in the Azure portal.
* [Azure blog](https://azure.microsoft.com/blog/): Learn about new features in Azure.
* [Windows PowerShell blog](https://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
* ["Hey, Scripting Guy!" Blog](https://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the Windows PowerShell community.

