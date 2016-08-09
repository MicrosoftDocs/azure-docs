<properties
	pageTitle="Manage Azure Redis Cache with Azure PowerShell | Microsoft Azure"
	description="Learn how to perform administrative tasks for Azure Redis Cache using Azure PowerShell."
	services="redis-cache"
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/09/2016" 
	ms.author="sdanie"/>

# Manage Azure Redis Cache with Azure PowerShell

> [AZURE.SELECTOR]
- [PowerShell](cache-howto-manage-redis-cache-powershell.md)
- [Azure CLI](cache-manage-cli.md)

This topic shows you how to perform common tasks such as create, update, and scale your Azure Redis Cache instances, how to regenerate access keys, and how to view information about your caches. For a complete list of Azure Redis Cache PowerShell cmdlets, see [Azure Redis Cache cmdlets](https://msdn.microsoft.com/library/azure/mt634513.aspx).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] [classic model](../resource-manager-deployment-model.md).

## Prerequisites

If you have already installed Azure PowerShell, you must have Azure PowerShell version 1.0.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

[AZURE.INCLUDE [powershell-preview](../../includes/powershell-preview-inline-include.md)]

First, you must log in to Azure with this command.

	Login-AzureRmAccount

Specify the email address of your Azure account and its password in the Microsoft Azure sign-in dialog.

Next, if you have multiple Azure subscriptions, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

	Get-AzureRmSubscription | sort SubscriptionName | Select SubscriptionName

To specify the subscription, run the following command. In the following example, the subscription name is `ContosoSubscription`.

	Select-AzureRmSubscription -SubscriptionName ContosoSubscription

Before you can use Windows PowerShell with Azure Resource Manager, you need the following:

- Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify the value of `PSVersion` is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

To get detailed help for any cmdlet you see in this tutorial, use the Get-Help cmdlet.

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the `New-AzureRmRedisCache` cmdlet, type:

	Get-Help New-AzureRmRedisCache -Detailed

### How to connect to Azure Government Cloud or Azure China Cloud

By default the Azure environment is `AzureCloud`, which represents the global Azure cloud instance. To connect to a different instance, use the `Add-AzureRmAccount` command with the `-Environment` or -`EnvironmentName` command line switch with the desired environment or environment name.

To see the list of available environments, run the `Get-AzureRmEnvironment` cmdlet.

### To connect to the Azure Government Cloud

To connect to the Azure Government Cloud, use one of the following commands.

	Add-AzureRMAccount -EnvironmentName AzureUSGovernment

or

	Add-AzureRmAccount -Environment (Get-AzureRmEnvironment -Name AzureUSGovernment)

To create a cache in the Azure Government Cloud, use one of the following locations.

-	USGov Virginia
-	USGov Iowa

For more information about the Azure Government Cloud, see [Microsoft Azure Government](https://azure.microsoft.com/features/gov/) and [Microsoft Azure Government Developer Guide](../azure-government-developer-guide.md).

### To connect to the Azure China Cloud

To connect to the Azure China Cloud, use one of the following commands.

	Add-AzureRMAccount -EnvironmentName AzureChinaCloud

or

	Add-AzureRmAccount -Environment (Get-AzureRmEnvironment -Name AzureChinaCloud)

To create a cache in the Azure China Cloud, use one of the following locations.

-	China East
-	China North

For more information about the Azure China Cloud, see [AzureChinaCloud for Azure operated by 21Vianet in China](http://www.windowsazure.cn/).

### Properties used for Azure Redis Cache PowerShell

The following table contains properties and descriptions for commonly used parameters when creating and managing your Azure Redis Cache instances using Azure PowerShell.

| Parameter          | Description                                                                                                                                                                                                        | Default  |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Name               | Name of the cache                                                                                                                                                                                                  |          |
| Location           | Location of the cache                                                                                                                                                                                              |          |
| ResourceGroupName  | Resource group name in which to create the cache                                                                                                                                                                   |          |
| Size               | The size of the cache. Valid values are: P1, P2, P3, P4, C0, C1, C2, C3, C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB                                                                     | 1GB      |
| ShardCount         | The number of shards to create when creating a premium cache with clustering enabled. Valid values are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10                                                                                                      |          |
| SKU                | Specifies the SKU of the cache. Valid values are: Basic, Standard, Premium                                                                                                                                         | Standard |
| RedisConfiguration | Specifies Redis configuration settings. For details on each setting, see the following [RedisConfiguration properties](#redisconfiguration-properties) table. |          |
| EnableNonSslPort   | Indicates whether the non-SSL port is enabled.                                                                                                                                                                     | False    |
| MaxMemoryPolicy    | This parameter has been deprecated - use RedisConfiguration instead.                                                                                                                                              |          |
| StaticIP           | When hosting your cache in a VNET, specifies a unique IP address in the subnet for the cache. If not provided, one is chosen for you from the subnet.                                                                                                                     |          |
| Subnet             | When hosting your cache in a VNET, specifies the name of the subnet in which to deploy the cache.                                                                                                                  |          |
| VirtualNetwork     | When hosting your cache in a VNET, specifies the resource ID of the VNET in which to deploy the cache.                                                                                                             |          |
| KeyType            | Specifies which access key to regenerate when renewing access keys. Valid values are: Primary, Secondary |  |                                                                                                                                                                                                              |          |


### RedisConfiguration properties

| Property                      | Description                                                                                                          | Pricing tiers       |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------|---------------------|
| rdb-backup-enabled            | Whether [Redis data persistence](cache-how-to-premium-persistence.md) is enabled                                     | Premium only        |
| rdb-storage-connection-string | The connection string to the storage account for [Redis data persistence](cache-how-to-premium-persistence.md)       | Premium only        |
| rdb-backup-frequency          | The backup frequency for [Redis data persistence](cache-how-to-premium-persistence.md)                               | Premium only        |
| maxmemory-reserved            | Configures the [memory reserved](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) for non-cache processes | Standard and Premium |
| maxmemory-policy              | Configures the [eviction policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) for the cache           | All pricing tiers   |
| notify-keyspace-events        | Configures [keyspace notifications](cache-configure.md#keyspace-notifications-advanced-settings)                     | Standard and Premium |
| hash-max-ziplist-entries      | Configures [memory optimization](http://redis.io/topics/memory-optimization) for small aggregate data types          | Standard and Premium |
| hash-max-ziplist-value        | Configures [memory optimization](http://redis.io/topics/memory-optimization) for small aggregate data types          | Standard and Premium |
| set-max-intset-entries        | Configures [memory optimization](http://redis.io/topics/memory-optimization) for small aggregate data types          | Standard and Premium |
| zset-max-ziplist-entries      | Configures [memory optimization](http://redis.io/topics/memory-optimization) for small aggregate data types          | Standard and Premium |
| zset-max-ziplist-value        | Configures [memory optimization](http://redis.io/topics/memory-optimization) for small aggregate data types          | Standard and Premium |
| databases                     | Configures the number of databases. This property can be configured only at cache creation.                          | Standard and Premium |

## To create a Redis Cache

New Azure Redis Cache instances are created using the [New-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634517.aspx) cmdlet.

>[AZURE.IMPORTANT] The first time you create a Redis cache in a subscription using the Azure portal, the portal registers the `Microsoft.Cache` namespace for that subscription. If you attempt to create the first Redis cache in a subscription using PowerShell, you must first register that namespace using the following command; otherwise cmdlets such as `New-AzureRmRedisCache` and `Get-AzureRmRedisCache` fail.
>
>`Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.Cache"`

To see a list of available parameters and their descriptions for `New-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help New-AzureRmRedisCache -detailed
	
	NAME
	    New-AzureRmRedisCache
	
	SYNOPSIS
	    Creates a new redis cache.
	
	
	SYNTAX
	    New-AzureRmRedisCache -Name <String> -ResourceGroupName <String> -Location <String> [-RedisVersion <String>]
	    [-Size <String>] [-Sku <String>] [-MaxMemoryPolicy <String>] [-RedisConfiguration <Hashtable>] [-EnableNonSslPort
	    <Boolean>] [-ShardCount <Integer>] [-VirtualNetwork <String>] [-Subnet <String>] [-StaticIP <String>]
	    [<CommonParameters>]
	
	
	DESCRIPTION
	    The New-AzureRmRedisCache cmdlet creates a new redis cache.
	
	
	PARAMETERS
	    -Name <String>
	        Name of the redis cache to create.
	
	    -ResourceGroupName <String>
	        Name of resource group in which to create the redis cache.
	
	    -Location <String>
	        Location in which to create the redis cache.
	
	    -RedisVersion <String>
	        RedisVersion is deprecated and will be removed in future release.
	
	    -Size <String>
	        Size of the redis cache. The default value is 1GB or C1. Possible values are P1, P2, P3, P4, C0, C1, C2, C3,
	        C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB.
	
	    -Sku <String>
	        Sku of redis cache. The default value is Standard. Possible values are Basic, Standard and Premium.
	
	    -MaxMemoryPolicy <String>
	        The 'MaxMemoryPolicy' setting has been deprecated. Please use 'RedisConfiguration' setting to set
	        MaxMemoryPolicy. e.g. -RedisConfiguration @{"maxmemory-policy" = "allkeys-lru"}
	
	    -RedisConfiguration <Hashtable>
	        All Redis Configuration Settings. Few possible keys: rdb-backup-enabled, rdb-storage-connection-string,
	        rdb-backup-frequency, maxmemory-reserved, maxmemory-policy, notify-keyspace-events, hash-max-ziplist-entries,
	        hash-max-ziplist-value, set-max-intset-entries, zset-max-ziplist-entries, zset-max-ziplist-value, databases.
	
	    -EnableNonSslPort <Boolean>
	        EnableNonSslPort is used by Azure Redis Cache. If no value is provided, the default value is false and the
	        non-SSL port will be disabled. Possible values are true and false.
	
	    -ShardCount <Integer>
	        The number of shards to create on a Premium Cluster Cache.
	
	    -VirtualNetwork <String>
	        The exact ARM resource ID of the virtual network to deploy the redis cache in. Example format: /subscriptions/{
	        subid}/resourceGroups/{resourceGroupName}/providers/Microsoft.ClassicNetwork/VirtualNetworks/{vnetName}
	
	    -Subnet <String>
	        Required when deploying a redis cache inside an existing Azure Virtual Network.
	
	    -StaticIP <String>
	        Required when deploying a redis cache inside an existing Azure Virtual Network.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).

To create a cache with default parameters, run the following command.

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US"

`ResourceGroupName`, `Name`, and `Location` are required parameters, but the rest are optional and have default values. Running the previous command creates a Standard SKU Azure Redis Cache instance with the specified name, location, and resource group, that is 1 GB in size with the non-SSL port disabled.

To create a premium cache, specify a size of P1 (6 GB - 60 GB), P2 (13 GB - 130 GB), P3 (26 GB - 260 GB), or P4 (53 GB - 530 GB). To enable clustering, specify a shard count using the `ShardCount` parameter. The following example creates a P1 premium cache with 3 shards. A P1 premium cache is 6 GB in size, and since we specified three shards the total size is 18 GB (3 x 6 GB).

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P1 -ShardCount 3

To specify values for the `RedisConfiguration` parameter, enclose the values inside `{}` as key/value pairs like `@{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}`. The following example creates a standard 1 GB cache with `allkeys-random` maxmemory policy and keyspace notifications configured with `KEA`. For more information, see [Keyspace notifications (advanced settings)](cache-configure.md#keyspace-notifications-advanced-settings) and [Maxmemory-policy and maxmemory-reserved](cache-configure.md#maxmemory-policy-and-maxmemory-reserved).

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}

<a name="databases"></a>
## To configure the databases setting during cache creation

The `databases` setting can be configured only during cache creation. The following example creates a premium P3 (26 GB) cache with 48 databases using the [New-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634517.aspx) cmdlet.

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P3 -RedisConfiguration @{"databases" = "48"}

For more information on the `databases` property, see [Default Azure Redis Cache server configuration](cache-configure.md#default-redis-server-configuration). For more information on creating a cache using the [New-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634517.aspx) cmdlet, see the previous [To create a Redis Cache](#to-create-a-redis-cache) section.

## To update a Redis cache

Azure Redis Cache instances are updated using the [Set-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634518.aspx) cmdlet.

To see a list of available parameters and their descriptions for `Set-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help Set-AzureRmRedisCache -detailed
	
	NAME
	    Set-AzureRmRedisCache
	
	SYNOPSIS
	    Set redis cache updatable parameters.
	
	SYNTAX
	    Set-AzureRmRedisCache -Name <String> -ResourceGroupName <String> [-Size <String>] [-Sku <String>]
	    [-MaxMemoryPolicy <String>] [-RedisConfiguration <Hashtable>] [-EnableNonSslPort <Boolean>] [-ShardCount
	    <Integer>] [<CommonParameters>]
	
	DESCRIPTION
	    The Set-AzureRmRedisCache cmdlet sets redis cache parameters.
	
	PARAMETERS
	    -Name <String>
	        Name of the redis cache to update.
	
	    -ResourceGroupName <String>
	        Name of the resource group for the cache.
	
	    -Size <String>
	        Size of the redis cache. The default value is 1GB or C1. Possible values are P1, P2, P3, P4, C0, C1, C2, C3,
	        C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB.
	
	    -Sku <String>
	        Sku of redis cache. The default value is Standard. Possible values are Basic, Standard and Premium.
	
	    -MaxMemoryPolicy <String>
	        The 'MaxMemoryPolicy' setting has been deprecated. Please use 'RedisConfiguration' setting to set
	        MaxMemoryPolicy. e.g. -RedisConfiguration @{"maxmemory-policy" = "allkeys-lru"}
	
	    -RedisConfiguration <Hashtable>
			All Redis Configuration Settings. Few possible keys: rdb-backup-enabled, rdb-storage-connection-string,
			rdb-backup-frequency, maxmemory-reserved, maxmemory-policy, notify-keyspace-events, hash-max-ziplist-entries,
			hash-max-ziplist-value, set-max-intset-entries, zset-max-ziplist-entries, zset-max-ziplist-value.
	
	    -EnableNonSslPort <Boolean>
	        EnableNonSslPort is used by Azure Redis Cache. The default value is null and no change will be made to the
	        currently configured value. Possible values are true and false.
	
	    -ShardCount <Integer>
	        The number of shards to create on a Premium Cluster Cache.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).

The `Set-AzureRmRedisCache` cmdlet can be used to update properties such as `Size`, `Sku`, `EnableNonSslPort`, and the `RedisConfiguration` values. 

The following command updates the maxmemory-policy for the Redis Cache named myCache.

	Set-AzureRmRedisCache -ResourceGroupName "myGroup" -Name "myCache" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random"}

<a name="scale"></a>
## To scale a Redis cache

`Set-AzureRmRedisCache` can be used to scale an Azure Redis cache instance when the `Size`, `Sku`, or `ShardCount` properties are modified. 

>[AZURE.NOTE]Scaling a cache using PowerShell is subject to the same limits and guidelines as scaling a cache from the Azure portal. You can scale to a different pricing tier with the following restrictions.
>
>-	You can't scale from a higher pricing tier to a lower pricing tier.
>    -    You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
>    -    You can't scale from a **Standard** cache down to a **Basic** cache.
>-	You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a subsequent scaling operation to the desired size.
>-	You can't scale from a **Basic** cache directly to a **Premium** cache. You must scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a subsequent scaling operation.
>-	You can't scale from a larger size down to the **C0 (250 MB)** size.
>
>For more information, see [How to Scale Azure Redis Cache](cache-how-to-scale.md).

The following example shows how to scale a cache named `myCache` to a 2.5 GB cache. Note that this command works for both a Basic or a Standard cache.

	Set-AzureRmRedisCache -ResourceGroupName myGroup -Name myCache -Size 2.5GB

After this command is issued, the status of the cache is returned (similar to calling `Get-AzureRmRedisCache`). Note that the `ProvisioningState` is `Scaling`.

	PS C:\> Set-AzureRmRedisCache -Name myCache -ResourceGroupName myGroup -Size 2.5GB
	
	
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

	Set-AzureRmRedisCache : Conflict: The resource '...' is not in a stable state, and is currently unable to accept the update request.

## To get information about a Redis cache

You can retrieve information about a cache using the [Get-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634514.aspx) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help Get-AzureRmRedisCache -detailed
	
	NAME
	    Get-AzureRmRedisCache
	
	SYNOPSIS
	    Gets details about a single cache or all caches in the specified resource group or all caches in the current
	    subscription.
	
	SYNTAX
	    Get-AzureRmRedisCache [-Name <String>] [-ResourceGroupName <String>] [<CommonParameters>]
	
	DESCRIPTION
	    The Get-AzureRmRedisCache cmdlet gets the details about a cache or caches depending on input parameters. If both
	    ResourceGroupName and Name parameters are provided then Get-AzureRmRedisCache will return details about the
	    specific cache name provided.
	
	    If only ResourceGroupName is provided than it will return details about all caches in the specified resource group.
	
	    If no parameters are given than it will return details about all caches the current subscription.
	
	PARAMETERS
	    -Name <String>
	        The name of the cache. When this parameter is provided along with ResourceGroupName, Get-AzureRmRedisCache
	        returns the details for the cache.
	
	    -ResourceGroupName <String>
	        The name of the resource group that contains the cache or caches. If ResourceGroupName is provided with Name
	        then Get-AzureRmRedisCache returns the details of the cache specified by Name. If only the ResourceGroup
	        parameter is provided, then details for all caches in the resource group are returned.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).

To return information about all caches in the current subscription, run `Get-AzureRmRedisCache` without any parameters.

	Get-AzureRmRedisCache

To return information about all caches in a specific resource group, run `Get-AzureRmRedisCache` with the `ResourceGroupName` parameter.

	Get-AzureRmRedisCache -ResourceGroupName myGroup

To return information about a specific cache, run `Get-AzureRmRedisCache` with the `Name` parameter containing the name of the cache, and the `ResourceGroupName` parameter with the resource group containing that cache.

	PS C:\> Get-AzureRmRedisCache -Name myCache -ResourceGroupName myGroup
	
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

## To retrieve the access keys for a Redis cache

To retrieve the access keys for your cache, you can use the [Get-AzureRmRedisCacheKey](https://msdn.microsoft.com/library/azure/mt634516.aspx) cmdlet.

To see a list of available parameters and their descriptions for `Get-AzureRmRedisCacheKey`, run the following command.

	PS C:\> Get-Help Get-AzureRmRedisCacheKey -detailed
	
	NAME
	    Get-AzureRmRedisCacheKey
	
	SYNOPSIS
	    Gets the accesskeys for the specified redis cache.
	
	
	SYNTAX
	    Get-AzureRmRedisCacheKey -Name <String> -ResourceGroupName <String> [<CommonParameters>]
	
	DESCRIPTION
	    The Get-AzureRmRedisCacheKey cmdlet gets the access keys for the specified cache.
	
	PARAMETERS
	    -Name <String>
	        Name of the redis cache.
	
	    -ResourceGroupName <String>
	        Name of the resource group for the cache.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).

To retrieve the keys for your cache, call the `Get-AzureRmRedisCacheKey` cmdlet and pass in the name of your cache the name of the resource group that contains the cache.

	PS C:\> Get-AzureRmRedisCacheKey -Name myCache -ResourceGroupName myGroup
	
	PrimaryKey   : b2wdt43sfetlju4hfbryfnregrd9wgIcc6IA3zAO1lY=
	SecondaryKey : ABhfB757JgjIgt785JgKH9865eifmekfnn649303JKL=

## To regenerate access keys for your Redis cache

To regenerate the access keys for your cache, you can use the [New-AzureRmRedisCacheKey](https://msdn.microsoft.com/library/azure/mt634512.aspx) cmdlet.

To see a list of available parameters and their descriptions for `New-AzureRmRedisCacheKey`, run the following command.

	PS C:\> Get-Help New-AzureRmRedisCacheKey -detailed
	
	NAME
	    New-AzureRmRedisCacheKey
	
	SYNOPSIS
	    Regenerates the access key of a redis cache.
	
	SYNTAX
	    New-AzureRmRedisCacheKey -Name <String> -ResourceGroupName <String> -KeyType <String> [-Force] [<CommonParameters>]
	
	DESCRIPTION
	    The New-AzureRmRedisCacheKey cmdlet regenerate the access key of a redis cache.
	
	PARAMETERS
	    -Name <String>
	        Name of the redis cache.
	
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
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).
	
To regenerate the primary or secondary key for your cache, call the `New-AzureRmRedisCacheKey` cmdlet and pass in the name, resource group, and specify either `Primary` or `Secondary` for the `KeyType` parameter. In the following example, the secondary access key for a cache is regenerated.

	PS C:\> New-AzureRmRedisCacheKey -Name myCache -ResourceGroupName myGroup -KeyType Secondary
	
	Confirm
	Are you sure you want to regenerate Secondary key for redis cache 'myCache'?
	[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y
	
	
	PrimaryKey   : b2wdt43sfetlju4hfbryfnregrd9wgIcc6IA3zAO1lY=
	SecondaryKey : c53hj3kh4jhHjPJk8l0jji785JgKH9865eifmekfnn6=

## To delete a Redis cache

To delete a Redis cache, use the [Remove-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634515.aspx) cmdlet.

To see a list of available parameters and their descriptions for `Remove-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help Remove-AzureRmRedisCache -detailed
	
	NAME
	    Remove-AzureRmRedisCache
	
	SYNOPSIS
	    Remove redis cache if exists.
	
	SYNTAX
	    Remove-AzureRmRedisCache -Name <String> -ResourceGroupName <String> [-Force] [-PassThru] [<CommonParameters>
	
	DESCRIPTION
	    The Remove-AzureRmRedisCache cmdlet removes a redis cache if it exists.
	
	PARAMETERS
	    -Name <String>
	        Name of the redis cache to remove.
	
	    -ResourceGroupName <String>
	        Name of the resource group of the cache to remove.
	
	    -Force
	        When the Force parameter is provided, the cache is removed without any confirmation prompts.
	
	    -PassThru
	        By default Remove-AzureRmRedisCache removes the cache and does not return any value. If the PassThru par
	        is provided then Remove-AzureRmRedisCache returns a boolean value indicating the success of the operatio
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).

In the following example, the cache named `myCache` is removed.

	PS C:\> Remove-AzureRmRedisCache -Name myCache -ResourceGroupName myGroup
	
	Confirm
	Are you sure you want to remove redis cache 'myCache'?
	[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y


## To import a Redis cache

You can import data into an Azure Redis Cache instance using the `Import-AzureRmRedisCache` cmdlet.

>[AZURE.IMPORTANT] Import/Export is only available for [premium tier](cache-premium-tier-intro.md) caches. For more information about Import/Export, see [Import and Export data in Azure Redis Cache](cache-how-to-import-export-data.md).

To see a list of available parameters and their descriptions for `Import-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help Import-AzureRmRedisCache -detailed
	
	NAME
	    Import-AzureRmRedisCache
	
	SYNOPSIS
	    Import data from blobs to Azure Redis Cache.
	
	
	SYNTAX
	    Import-AzureRmRedisCache -Name <String> -ResourceGroupName <String> -Files <String[]> [-Format <String>] [-Force]
	    [-PassThru] [<CommonParameters>]
	
	
	DESCRIPTION
	    The Import-AzureRmRedisCache cmdlet imports data from the specified blobs into Azure Redis Cache.
	
	
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
	        By default Import-AzureRmRedisCache imports data in cache and does not return any value. If the PassThru
	        parameter is provided then Import-AzureRmRedisCache returns a boolean value indicating the success of the
	        operation.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).
	

The following command imports data from the blob specified by the SAS uri into Azure Redis Cache.


	PS C:\>Import-AzureRmRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Files @("https://mystorageaccount.blob.core.windows.net/mycontainername/blobname?sv=2015-04-05&sr=b&sig=caIwutG2uDa0NZ8mjdNJdgOY8%2F8mhwRuGNdICU%2B0pI4%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwd") -Force

## To export a Redis cache

You can export data from an Azure Redis Cache instance using the `Export-AzureRmRedisCache` cmdlet.

>[AZURE.IMPORTANT] Import/Export is only available for [premium tier](cache-premium-tier-intro.md) caches. For more information about Import/Export, see [Import and Export data in Azure Redis Cache](cache-how-to-import-export-data.md).

To see a list of available parameters and their descriptions for `Export-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help Export-AzureRmRedisCache -detailed
	
	NAME
	    Export-AzureRmRedisCache
	
	SYNOPSIS
	    Exports data from Azure Redis Cache to a specified container.
	
	
	SYNTAX
	    Export-AzureRmRedisCache -Name <String> -ResourceGroupName <String> -Prefix <String> -Container <String> [-Format
	    <String>] [-PassThru] [<CommonParameters>]
	
	
	DESCRIPTION
	    The Export-AzureRmRedisCache cmdlet exports data from Azure Redis Cache to a specified container.
	
	
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
	        By default Export-AzureRmRedisCache does not return any value. If the PassThru parameter is provided
	        then Export-AzureRmRedisCache returns a boolean value indicating the success of the operation.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).


The following command exports data from an Azure Redis Cache instance into the container specified by the SAS uri.


	    PS C:\>Export-AzureRmRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Prefix "blobprefix"
	    -Container "https://mystorageaccount.blob.core.windows.net/mycontainer?sv=2015-04-05&sr=c&sig=HezZtBZ3DURmEGDduauE7
	    pvETY4kqlPI8JCNa8ATmaw%3D&st=2016-05-27T00%3A00%3A00Z&se=2016-05-28T00%3A00%3A00Z&sp=rwdl"

## To reboot a Redis cache

You can reboot your Azure Redis Cache instance using the `Reset-AzureRmRedisCache` cmdlet.

>[AZURE.IMPORTANT] Reboot is only available for [premium tier](cache-premium-tier-intro.md) caches. For more information about rebooting your cache, see [Cache administration - reboot](cache-administration.md#reboot).

To see a list of available parameters and their descriptions for `Reset-AzureRmRedisCache`, run the following command.

	PS C:\> Get-Help Reset-AzureRmRedisCache -detailed
	
	NAME
	    Reset-AzureRmRedisCache
	
	SYNOPSIS
	    Reboot specified node(s) of an Azure Redis Cache instance.
	
	
	SYNTAX
	    Reset-AzureRmRedisCache -Name <String> -ResourceGroupName <String> -RebootType <String> [-ShardId <Integer>]
	    [-Force] [-PassThru] [<CommonParameters>]
	
	
	DESCRIPTION
	    The Reset-AzureRmRedisCache cmdlet reboots the specified node(s) of an Azure Redis Cache instance.
	
	
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
	        By default Reset-AzureRmRedisCache does not return any value. If the PassThru parameter is provided
	        then Reset-AzureRmRedisCache returns a boolean value indicating the success of the operation.
	
	    <CommonParameters>
	        This cmdlet supports the common parameters: Verbose, Debug,
	        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
	        OutBuffer, PipelineVariable, and OutVariable. For more information, see
	        about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).
	

The following command reboots both nodes of the specified cache.

	
	    PS C:\>Reset-AzureRmRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -RebootType "AllNodes"
	    -Force
	

## Next steps

To learn more about using Windows PowerShell with Azure, see the following resources:

- [Azure Redis Cache cmdlet documentation on MSDN](https://msdn.microsoft.com/library/azure/mt634513.aspx)
- [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765): Learn to use the cmdlets in the AzureResourceManager module.
- [Using Resource groups to manage your Azure resources](../resource-group-template-deploy-portal.md): Learn how to create and manage resource groups in the Azure portal.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Windows PowerShell blog](http://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
- ["Hey, Scripting Guy!" Blog](http://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the Windows PowerShell community.
