<properties
	pageTitle="Manage Azure Redis Cache with Azure PowerShell | Microsoft Azure"
	description="Learn how to perform administrative tasks for Azure Redis Cache using Azure PowerShell."
	services="redis-cache"
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/04/2015" 
	ms.author="sdanie"/>

# Manage Azure Redis Cache with Azure PowerShell

> [AZURE.SELECTOR]
- [PowerShell](cache-howto-manage-redis-cache-powershell.md)
- [Azure CLI](cache-manage-cli.md)

This topic shows you how to perform common tasks such as create, update and delete an Azure Redis Cache. For a complete list of Azure Redis Cache PowerShell cmdlets, see [Azure Redis Cache cmdlets](https://msdn.microsoft.com/library/azure/mt634513.aspx).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-machines-ps-create-preconfigure-windows-vms.md).

## Prerequisites ##

If you have already installed Azure PowerShell, you must have Azure PowerShell version 1.0.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

[AZURE.INCLUDE [powershell-preview](../../includes/powershell-preview-inline-include.md)]

First, you must logon to Azure with this command.

	Login-AzureRmAccount

Specify the email address of your Azure account and its password in the Microsoft Azure sign-in dialog.

Next, if you have multiple Azure subscriptions, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

	Get-AzureRmSubscription | sort SubscriptionName | Select SubscriptionName

To specify the subscription, run the following command. In the following example, the subscription name is `ContosoSubscription`.

	Select-AzureRmSubscription -SubscriptionName ContosoSubscription

Before you can use Windows PowerShell with Azure Resource Manager, you need the following:

- Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify the value of `PSVersion` is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0 ](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

To get detailed help for any cmdlet you see in this tutorial, use the Get-Help cmdlet.

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the `New-AzureRmRedisCache` cmdlet, type:

	Get-Help New-AzureRmRedisCache -Detailed

## Properties used for Azure Redis Cache PowerShell

The following table contains properties and descriptions for commonly used parameters when creating and managing your Azure Redis Cache instances using Azure PowerShell.

| Parameter          | Description                                                                                                                                                                                                        | Default  |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Name               | Name of the cache                                                                                                                                                                                                  |          |
| Location           | Location of the cache                                                                                                                                                                                              |          |
| ResourceGroupName  | Resource group name in which to create the cache                                                                                                                                                                   |          |
| Size               | The size of the cache. Valid values are: P1, P2, P3, P4, C0, C1, C2, C3, C4, C5, C6, 250MB, 1GB, 2.5GB, 6GB, 13GB, 26GB, 53GB                                                                     | 1GB      |
| ShardCount         | The number of shards to create when creating a premium cache with clustering enabled. Valid values are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10                                                                                                      |          |
| SKU                | Specifies the SKU of the cache. Valid values are: Basic, Standard, Premium                                                                                                                                         | Standard |
| RedisConfiguration | Specifies Redis configuration settings for maxmemory-delta, maxmemory-policy, and notify-keyspace-events. Note that maxmemory-delta and notify-keyspace-events are available for Standard and Premium caches only. |          |
| EnableNonSslPort   | Indicates whether the non-SSL port is enabled.                                                                                                                                                                     | False    |
| MaxMemoryPolicy    | Those parameter has been deprecated - use RedisConfiguration instead.                                                                                                                                              |          |
| StaticIp           | When hosting your cache in a VNET, provides a unique IP address in the subnet for the cache.                                                                                                                       |          |
| Subnet             | When hosting your cache in a VNET, specifies the name of the subnet in which to deploy the cache.                                                                                                                  |          |
| VirtualNetwork     | When hosting your cache in a VNET, specifies the resource ID of the VNET in which to deploy the cache.                                                                                                             |          |
|                    |                                                                                                                                                                                                                    |          |
|                    |                                                                                                                                                                                                                    |          |

## To create a Redis Cache

New Azure Redis Cache instances are created using the [New-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634517.aspx) cmdlet.

To see a list of available parameters for `New-AzureRmRedisCache`, run the following command:

	PS C:\> Get-Help New-AzureRmRedisCache

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

To create a cache with default parameters, run the following command.

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US"

`ResourceGroupName`, `Name`, and `Location` are required parameters, but the rest are optional and have default values. Running the previous command creates a Standard SKU Azure Redis Cache instance in with the specified name, location, and resource group, that is 1 GB in size with the non-SSL port disabled.

To create a premium cache, specify a size of P1 (6 GB - 60 GB), P2 (13 GB - 130 GB), P3 (26 GB - 260 GB), or P4 (53 GB - 530 GB). To enable clustering, specify a shard count using the ShardCount parameter. The following example creates a P1 premium cache with 3 shards (so the size is 18 GB - 3 x 6 GB).

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku=Premium -Size P1 -ShardCount 3

To specify values for the RedisConfiuration parameter, enclose the values inside `{}` as a key/value pair. The following example creates a standard 1 GB cache with allkeys-random maxmemory policy and keyspace notifications configured with KEA. For more information see [Keyspace notifications (advanced settings)](cache-configure.md#keyspace-notifications-advanced-settings) and [Maxmemory-policy and maxmemory-reserved](cache-configure.md#maxmemory-policy-and-maxmemory-reserved).

	New-AzureRmRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}

## To update a Redis cache

Azure Redis Cache instances are updated using the [Set-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634518.aspx) cmdlet.

To see a list of available parameters for `Set-AzureRmRedisCache`, run the following command:

	PS C:\> Get-Help Set-AzureRmRedisCache
	
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

The `Set-AzureRmRedisCache` can be used to update properties such as `Size`, `Sku`, `EnableNonSslPort` and the `RedisConfiguration` values. 

The following command updates the maxmemory-policy for the Redis Cache named MyCache.

	Set-AzureRmRedisCache -ResourceGroupName "MyGroup" -Name "MyCache" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random"}

### Scale a Redis cache with PowerShell

`Set-AzureRmRedisCache` can be used to scale an Azure Redis cache instance when the `Size`, `Sku`, or `ShardCount` properties are modified. 

>[AZURE.NOTE]Scaling a cache using PowerShell is subject to the same limits and guidelines as scaling a cache from the Azure Portal. You can scale to a different pricing tier with the following restrictions.
>
>-	You can't scale to or from a **Premium** cache.
>-	You can't scale from a **Standard** cache to a **Basic** cache.
>-	You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a subsequent scaling operation to the desired size.
>-	You can't scale from a larger size down to the **C0 (250 MB)** size.
>
>For more information, see [How to Scale Azure Redis Cache](cache-how-to-scale.md).

The following example shows how to scale a cache named MyCache to a 2.5 GB cache. Note that this command will work for both a Basic or a Standard cache.

	Set-AzureRmRedisCache -ResourceGroupName "MyGroup" -Name "MyCache" -Size 2.5GB

After this command is issued, the status of the cache is returned (equivalent to calling `Get-AzureRmRedisCache`). Note that the `ProvisioningState` is `Scaling`.

	PS C:\> Set-AzureRmRedisCache -Name "MyCache" -ResourceGroupName "MyGroup" -Size 2.5GB
	
	
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
	ResourceGroupName  : default-sql-eastumygroups
	PrimaryKey         : ....
	SecondaryKey       : ....
	VirtualNetwork     :
	Subnet             :
	StaticIP           :
	TenantSettings     : {}
	ShardCount         :

When the scaling operation is complete, the `ProvisionState` will change to `Running`. If you need to make a subsequent scaling operation, such as changing from Basic to Standard and then changing the size, you must wait until the previous operation is complete, so else you willr eceive an error similar to the following.

	Set-AzureRmRedisCache : Conflict: The resource '...' is not in a stable state, and is currently unable to accept the update request.

## A simple Azure PowerShell script for the Redis Cache  ##

The following script demonstrates how to create, update and delete an Azure Redis Cache.

		
		$VerbosePreference = "Continue"

    	# Create a new cache with date string to make name unique.
		$cacheName = "MovieCache" + $(Get-Date -Format ('ddhhmm'))
		$location = "West US"
		$resourceGroupName = "Default-Web-WestUS"
		
		$movieCache = New-AzureRedisCache -Location $location -Name $cacheName  -ResourceGroupName $resourceGroupName -Size 250MB -Sku Basic
		
		# Wait until the Cache service is provisioned.
		
		for ($i = 0; $i -le 60; $i++)
		{
		    Start-Sleep -s 30
		    $cacheGet = Get-AzureRedisCache -ResourceGroupName $resourceGroupName -Name $cacheName
		    if ([string]::Compare("succeeded", $cacheGet[0].ProvisioningState, $True) -eq 0)
		    {
		        break
		    }
		    If($i -eq 60)
		    {
		        exit
		    }
		}
		
		# Update the access keys.
		
		Write-Verbose "PrimaryKey: $($movieCache.PrimaryKey)"
		New-AzureRedisCacheKey -KeyType "Primary" -Name $cacheName  -ResourceGroupName $resourceGroupName -Force
		$cacheKeys = Get-AzureRedisCacheKey -ResourceGroupName $resourceGroupName  -Name $cacheName
		Write-Verbose "PrimaryKey: $($cacheKeys.PrimaryKey)"
		
		# Use Set-AzureRedisCache to set Redis cache updatable parameters.
		# Set the memory policy to Least Recently Used.
		
		Set-AzureRedisCache -Name $cacheName -ResourceGroupName $resourceGroupName -RedisConfiguration @{"maxmemory-policy" = "AllKeys-LRU"}
		
		# Delete the cache.
		
		Remove-AzureRedisCache -Name $movieCache.Name -ResourceGroupName $movieCache.ResourceGroupName  -Force

## Next steps

To learn more about using Windows PowerShell with Azure, see the following resources:

- [Azure Redis Cache cmdlet documentation on MSDN](https://msdn.microsoft.com/library/azure/mt634513.aspx)
- [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765): Learn to use the cmdlets in the AzureResourceManager module.
- [Using Resource groups to manage your Azure resources](../azure-portal/resource-group-portal.md): Learn how to create and manage resource groups in the Azure Portal.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Windows PowerShell blog](http://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
- ["Hey, Scripting Guy!" Blog](http://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the Windows PowerShell community.
